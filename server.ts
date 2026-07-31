import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { MOCK_JOBS } from './src/data/mockData.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client to prevent crashes if API key is missing
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'AI Career Accelerator Backend', timestamp: new Date().toISOString() });
});

// 1. Resume ATS Analyzer & Improvement Endpoint
app.post('/api/ai/analyze-resume', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole = 'Software Developer', experienceLevel = 'Entry-Level' } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide a valid resume text (at least 20 characters).' });
    }

    const ai = getGeminiClient();

    const prompt = `You are an expert ATS (Applicant Tracking System) recruiter and resume optimization specialist.
Analyze the following resume for the target role: "${targetRole}" at experience level: "${experienceLevel}".

Resume Text:
"""
${resumeText}
"""

Provide a rigorous ATS assessment including:
- Overall ATS Score (0-100)
- Impact Metrics score (0-100)
- Formatting & Clarity rating (0-100)
- Contact details check
- Executive summary of the candidate's ATS readiness
- List of technical and soft skills extracted from the resume
- Critical missing keywords/skills required for a "${targetRole}"
- Strengths in the resume
- Weaknesses or red flags
- 3 to 5 specific Bullet Point Improvements: Take weak or generic resume statements and rewrite them into high-impact, metrics-driven STAR method statements.
- Actionable, step-by-step recommendations for fixing the resume to hit 90+ ATS score.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            atsScore: { type: Type.INTEGER, description: 'Overall ATS score 0 to 100' },
            summary: { type: Type.STRING, description: 'Executive summary' },
            contactDetailsPresent: { type: Type.BOOLEAN, description: 'Whether email/phone/links were detected' },
            formattingScore: { type: Type.INTEGER, description: 'Formatting score 0 to 100' },
            impactScore: { type: Type.INTEGER, description: 'Impact & action verbs score 0 to 100' },
            skillsFound: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Skills found in resume'
            },
            missingKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Missing high-value keywords for target role'
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            bulletPointFixes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: 'Weak original bullet' },
                  improved: { type: Type.STRING, description: 'STAR & metrics driven improvement' },
                  reason: { type: Type.STRING, description: 'Why this change improves ATS & recruiter score' }
                },
                required: ['original', 'improved', 'reason']
              }
            },
            actionableRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'atsScore',
            'summary',
            'contactDetailsPresent',
            'formattingScore',
            'impactScore',
            'skillsFound',
            'missingKeywords',
            'strengths',
            'weaknesses',
            'bulletPointFixes',
            'actionableRecommendations'
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.error('Error in analyze-resume:', error);
    return res.status(500).json({
      error: 'Failed to analyze resume with AI.',
      details: error.message || String(error)
    });
  }
});

// 1b. Parse Resume File (PDF, DOCX, TXT, MD) Endpoint
app.post('/api/parse-resume-file', async (req: Request, res: Response) => {
  try {
    const { fileName = '', fileType = '', fileBase64 = '' } = req.body;

    if (!fileBase64) {
      return res.status(400).json({ error: 'No file content uploaded.' });
    }

    // Clean base64 string (strip data URI prefix and any whitespace/newlines)
    const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '').replace(/\s+/g, '');

    const isPdf = fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf');
    const isDocx = fileType.includes('word') || fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc');
    const isTxtOrMd =
      fileType.includes('text') ||
      fileType.includes('json') ||
      fileName.toLowerCase().endsWith('.txt') ||
      fileName.toLowerCase().endsWith('.md') ||
      fileName.toLowerCase().endsWith('.text') ||
      fileName.toLowerCase().endsWith('.rtf');

    if (isTxtOrMd) {
      const decodedText = Buffer.from(cleanBase64, 'base64').toString('utf-8').trim();
      // Ensure we don't return raw binary headers if mistagged
      if (!decodedText.startsWith('%PDF-') && !decodedText.includes('PK\x03\x04')) {
        return res.json({ text: decodedText });
      }
    }

    // For PDF and DOCX, use Gemini Multimodal extraction
    const ai = getGeminiClient();
    let mimeType = 'application/pdf';
    if (isDocx) {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (isPdf) {
      mimeType = 'application/pdf';
    } else {
      mimeType = fileType || 'application/octet-stream';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64
          }
        },
        'Extract all plain text content from this resume document accurately, maintaining section headings, experience points, education, contact details, and bullet points. Output ONLY the raw extracted resume text with no commentary or intro.'
      ]
    });

    const extractedText = (response.text || '').trim();
    if (extractedText && !extractedText.startsWith('%PDF-') && !extractedText.includes('PK\x03\x04')) {
      return res.json({ text: extractedText });
    }

    return res.status(400).json({
      error: 'Could not extract readable text from document. Please copy & paste your resume text directly.'
    });
  } catch (error: any) {
    console.error('Error parsing uploaded resume file:', error);
    return res.status(500).json({
      error: 'Could not extract text from document. Please copy & paste your resume text directly.',
      details: error.message || String(error)
    });
  }
});

// 2. Generate Interview Questions Endpoint
app.post('/api/ai/interview/generate-questions', async (req: Request, res: Response) => {
  try {
    const { targetRole = 'Full Stack Developer', companyTarget = 'Top Tech Companies', category = 'Mixed', difficulty = 'Intermediate' } = req.body;

    const safeTargetRole = targetRole || 'Full Stack Developer';
    const safeCompanyTarget = companyTarget || 'Top Tech Companies';
    const safeCategory = category || 'Mixed';
    const safeDifficulty = difficulty || 'Intermediate';

    const ai = getGeminiClient();

    const prompt = `Generate a set of 5 realistic, high-value interview questions for a candidate applying for:
Target Role: "${safeTargetRole}"
Target Company Context: "${safeCompanyTarget}"
Category Focus: "${safeCategory}" (Technical, Behavioral, Problem Solving, HR, or Mixed)
Difficulty Level: "${safeDifficulty}"

Each question should test practical industry skills or STAR behavioral scenarios. Provide clear model answers and key talking points for evaluation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              category: { type: Type.STRING, description: 'Technical, Behavioral, Problem Solving, or HR' },
              difficulty: { type: Type.STRING, description: 'Beginner, Intermediate, or Advanced' },
              keyTalkingPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              modelAnswer: { type: Type.STRING, description: 'Comprehensive ideal response' }
            },
            required: ['id', 'question', 'category', 'difficulty', 'keyTalkingPoints', 'modelAnswer']
          }
        }
      }
    });

    let text = (response.text || '').trim();
    if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const questions = JSON.parse(text || '[]');
    return res.json({ questions });
  } catch (error: any) {
    console.error('Error in generate-questions:', error);
    return res.status(500).json({
      error: 'Failed to generate interview questions.',
      details: error.message || String(error)
    });
  }
});

// 3. Evaluate Interview Answer Endpoint
app.post('/api/ai/interview/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, userAnswer, targetRole = 'Software Developer' } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Question and candidate user answer are required.' });
    }

    const ai = getGeminiClient();

    const prompt = `You are a Senior Technical Hiring Manager evaluating a candidate's verbal or written answer in a mock interview.
Role Applied For: "${targetRole}"
Question Asked: "${question}"
Candidate's Response:
"""
${userAnswer}
"""

Evaluate the candidate's answer constructively:
1. Score (0-100 overall)
2. Technical Score (0-100) - depth, correctness, accuracy
3. Communication Score (0-100) - clarity, structure, tone
4. STAR Format Score (0-100) - Situation, Task, Action, Result usage
5. Constructive Feedback highlighting strengths and specific areas to refine.
6. A 'Better Response Example' demonstrating how a top candidate would answer.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: 'Overall score 0-100' },
            technicalScore: { type: Type.INTEGER },
            communicationScore: { type: Type.INTEGER },
            starFormatScore: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            betterResponseExample: { type: Type.STRING }
          },
          required: ['score', 'technicalScore', 'communicationScore', 'starFormatScore', 'feedback', 'betterResponseExample']
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return res.json(result);
  } catch (error: any) {
    console.error('Error in evaluate-answer:', error);
    return res.status(500).json({
      error: 'Failed to evaluate interview response.',
      details: error.message || String(error)
    });
  }
});

// 4. Generate Dynamic Career Roadmap Endpoint
app.post('/api/ai/career-roadmap', async (req: Request, res: Response) => {
  try {
    const { targetRole = 'Full Stack Developer', currentSkills = [], hoursPerWeek = 10 } = req.body;

    const ai = getGeminiClient();

    const prompt = `Create a structured, step-by-step learning roadmap for someone aiming to become a successful "${targetRole}".
Current Skills already mastered: ${currentSkills.length > 0 ? currentSkills.join(', ') : 'Beginner / General Computer Science basics'}.
Weekly Study Hours Available: ${hoursPerWeek} hours/week.

Structure the response as a 4-Phase Roadmap spanning 3-6 months.
IMPORTANT: All recommended resources MUST be 100% FREE (e.g., MDN Web Docs, freeCodeCamp, official documentation, GitHub repositories, free YouTube courses, W3Schools). Do NOT recommend paid courses or paid sites.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            targetRole: { type: Type.STRING },
            durationMonths: { type: Type.INTEGER },
            estimatedHoursPerWeek: { type: Type.INTEGER },
            overview: { type: Type.STRING },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  phaseNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  durationWeeks: { type: Type.INTEGER },
                  summary: { type: Type.STRING },
                  focusSkills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  keyTopics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  recommendedProjects: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  freeResources: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        url: { type: Type.STRING },
                        type: { type: Type.STRING, description: 'Documentation, Course, YouTube, GitHub, or Article' },
                        isFree: { type: Type.BOOLEAN }
                      },
                      required: ['title', 'url', 'type', 'isFree']
                    }
                  }
                },
                required: ['id', 'phaseNumber', 'title', 'durationWeeks', 'summary', 'focusSkills', 'keyTopics', 'recommendedProjects', 'freeResources']
              }
            }
          },
          required: ['title', 'targetRole', 'durationMonths', 'estimatedHoursPerWeek', 'overview', 'milestones']
        }
      }
    });

    const roadmapData = JSON.parse(response.text || '{}');
    return res.json(roadmapData);
  } catch (error: any) {
    console.error('Error in career-roadmap:', error);
    return res.status(500).json({
      error: 'Failed to generate career roadmap.',
      details: error.message || String(error)
    });
  }
});

// 5. Skill Gap Analysis Endpoint
app.post('/api/ai/skill-gap', async (req: Request, res: Response) => {
  try {
    const { targetRole = 'Full Stack Developer', currentSkills = [] } = req.body;

    const ai = getGeminiClient();

    const prompt = `Analyze the skill gap between a candidate's current skills and industry market requirements for the target role: "${targetRole}".
Candidate's Current Skills: ${currentSkills.length > 0 ? currentSkills.join(', ') : 'Basic HTML/CSS, JavaScript'}.

Categorize skills into:
1. Mastered Skills (already strong)
2. Partially Known Skills (needs deepening)
3. Critical Missing Skills (highest demand for "${targetRole}")

Provide a Gap Score (0-100, where 100 means no gap and 0 means large gap), and a list of step-by-step actionable learning strategies with 100% free learning resource links.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetRole: { type: Type.STRING },
            gapScore: { type: Type.INTEGER, description: '0 to 100 score' },
            masteredSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['name', 'level', 'importance']
              }
            },
            partiallyKnownSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  description: { type: Type.STRING },
                  freeResourceUrl: { type: Type.STRING }
                },
                required: ['name', 'level', 'importance']
              }
            },
            criticalMissingSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  level: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  description: { type: Type.STRING },
                  freeResourceUrl: { type: Type.STRING }
                },
                required: ['name', 'level', 'importance']
              }
            },
            learningStrategy: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['targetRole', 'gapScore', 'masteredSkills', 'partiallyKnownSkills', 'criticalMissingSkills', 'learningStrategy']
        }
      }
    });

    const gapResult = JSON.parse(response.text || '{}');
    return res.json(gapResult);
  } catch (error: any) {
    console.error('Error in skill-gap:', error);
    return res.status(500).json({
      error: 'Failed to evaluate skill gap.',
      details: error.message || String(error)
    });
  }
});

// 6. Cover Letter Generator Endpoint
app.post('/api/ai/cover-letter', async (req: Request, res: Response) => {
  try {
    const { targetRole = 'Software Engineer', companyName = 'Innovate Tech', jobDescription = '', userSkills = [], tone = 'Professional' } = req.body;

    const safeUserSkills = Array.isArray(userSkills) ? userSkills : [];
    const safeTargetRole = targetRole || 'Software Engineer';
    const safeCompanyName = companyName || 'Innovate Tech';
    const safeTone = tone || 'Professional';

    const ai = getGeminiClient();

    const prompt = `Write a compelling, customized Cover Letter for a job application.
Candidate Target Role: "${safeTargetRole}"
Company Name: "${safeCompanyName}"
Selected Tone: "${safeTone}" (Professional, Enthusiastic, Technical, or Concise)
Candidate Skills: ${safeUserSkills.join(', ')}
${jobDescription ? `Job Description Context: "${jobDescription}"` : ''}

Make it modern, persuasive, concise (approx 250-350 words), avoiding boilerplate SaaS cliché phrases. Highlight key projects and enthusiasm for the team's engineering culture.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverLetterText: { type: Type.STRING },
            keyHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            wordCount: { type: Type.INTEGER },
            toneUsed: { type: Type.STRING },
            customizationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['coverLetterText', 'keyHighlights', 'wordCount', 'toneUsed', 'customizationTips']
        }
      }
    });

    const letterData = JSON.parse(response.text || '{}');
    return res.json(letterData);
  } catch (error: any) {
    console.error('Error in cover-letter:', error);
    return res.status(500).json({
      error: 'Failed to generate cover letter.',
      details: error.message || String(error)
    });
  }
});

// 7. Internship & Job Finder Endpoint
app.get('/api/jobs', (req: Request, res: Response) => {
  try {
    const { query = '', location = '', type = 'All', remoteOnly = 'false' } = req.query;

    let results = [...MOCK_JOBS];

    if (query && typeof query === 'string') {
      const q = query.toLowerCase();
      results = results.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skillsNeeded.some(s => s.toLowerCase().includes(q)) ||
          j.description.toLowerCase().includes(q)
      );
    }

    if (location && typeof location === 'string' && location.trim()) {
      const loc = location.toLowerCase();
      results = results.filter(j => j.location.toLowerCase().includes(loc));
    }

    if (type && type !== 'All') {
      results = results.filter(j => j.type.toLowerCase() === (type as string).toLowerCase());
    }

    if (remoteOnly === 'true') {
      results = results.filter(j => j.location.toLowerCase().includes('remote'));
    }

    return res.json({ jobs: results, total: results.length });
  } catch (error: any) {
    console.error('Error in get jobs:', error);
    return res.status(500).json({ error: 'Failed to fetch job opportunities.' });
  }
});

// 8. Match Job with Candidate Resume/Skills Endpoint
app.post('/api/jobs/match-score', async (req: Request, res: Response) => {
  try {
    const { jobTitle, jobDescription, skillsNeeded = [], userSkills = [], userResumeText = '' } = req.body;

    const ai = getGeminiClient();

    const prompt = `Evaluate the match between candidate profile and this job opportunity:
Job Title: "${jobTitle}"
Job Required Skills: ${skillsNeeded.join(', ')}
Job Description: "${jobDescription}"

Candidate Current Skills: ${userSkills.join(', ')}
Candidate Resume Context: "${userResumeText.slice(0, 1000)}"

Return:
- Match Score (0 to 100%)
- Reason/Explanation for score
- Matching Skills found
- Missing Skills needed
- 2 Quick Interview Preparation Tips for this specific company/role.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.INTEGER },
            matchReason: { type: Type.STRING },
            matchingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            interviewPrepTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['matchScore', 'matchReason', 'matchingSkills', 'missingSkills', 'interviewPrepTips']
        }
      }
    });

    const matchData = JSON.parse(response.text || '{}');
    return res.json(matchData);
  } catch (error: any) {
    console.error('Error in match-score:', error);
    return res.status(500).json({
      error: 'Failed to calculate job match score.',
      details: error.message || String(error)
    });
  }
});

// ==========================================
// VITE / STATIC MIDDLEWARE SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AI Career Accelerator running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
