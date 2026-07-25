import { JobOpportunity, UserProfile } from '../types';

export const DEMO_PROFILES: Record<string, UserProfile> = {
  student: {
    id: 'demo-student-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@college.edu',
    targetRole: 'Full Stack Web Developer',
    experienceLevel: 'Entry-Level / Fresher',
    yearsOfExperience: 0,
    currentSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Git', 'Tailwind CSS', 'SQL basics'],
    resumeText: `ALEX RIVERA
Email: alex.rivera@college.edu | Phone: (555) 019-2831 | GitHub: github.com/alexrivera | LinkedIn: linkedin.com/in/alexrivera

OBJECTIVE
Motivated Computer Science senior seeking an Entry-Level Full Stack Software Engineer or Developer Internship position to apply strong foundational knowledge of React, Node.js, and web application development.

EDUCATION
B.S. in Computer Science | University Tech | Graduating May 2026
Relevant Coursework: Data Structures & Algorithms, Web Engineering, Database Systems, Software Engineering, Computer Networks.

PROJECTS
- AI Notes Summarizer (React, Node.js, Express, Gemini API)
  * Developed a web application that takes long lecture notes and generates bulleted AI summaries using Google Gemini.
  * Built responsive UI with Tailwind CSS and integrated RESTful endpoints in Node.js.
  * Used by 200+ students on campus for exam preparation.
- E-Commerce Dashboard (React, Context API, CSS Grid)
  * Designed an interactive product management dashboard with real-time state management, cart state, and search filtering.

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, C++, Python
- Frameworks/Libraries: React.js, Express.js, Node.js, Tailwind CSS
- Developer Tools: Git, GitHub, VS Code, Postman, Vercel

WORK EXPERIENCE
IT Student Assistant | University Tech Library | Sept 2024 - Present
- Assisted students and faculty with technical troubleshooting and software installations.
- Managed inventory of lab computers and resolved network printer issues.`,
    savedJobs: ['job-1', 'job-3'],
    savedRoadmaps: []
  },

  ai_enthusiast: {
    id: 'demo-ai-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@techinst.edu',
    targetRole: 'AI & Machine Learning Engineer',
    experienceLevel: 'Junior (1-2 years)',
    yearsOfExperience: 1,
    currentSkills: ['Python', 'PyTorch', 'Scikit-learn', 'FastAPI', 'Pandas', 'NumPy', 'Docker', 'Google Gemini API', 'Git'],
    resumeText: `PRIYA SHARMA
Email: priya.s@ai-lab.org | Location: San Francisco, CA | Portfolio: priyasharma.ai

SUMMARY
Junior AI Engineer with 1+ year of hands-on experience building GenAI prototypes, fine-tuning LLM pipelines, and deploying containerized REST APIs with FastAPI and Docker.

TECHNICAL SKILLS
- Programming: Python, SQL, C++
- AI/ML Frameworks: PyTorch, Hugging Face Transformers, LangChain, Scikit-learn, OpenCV
- Backend & Cloud: FastAPI, Docker, PostgreSQL, Google Cloud Platform (GCP), Git
- Specializations: RAG (Retrieval Augmented Generation), Prompt Engineering, Semantic Search

PROJECTS & EXPERIENCE
AI Software Engineering Intern | DataPulse Labs | Jun 2025 - Dec 2025
- Built an internal knowledge-base search engine using RAG architecture and Gemini Embeddings, reducing document search time by 40%.
- Optimized vector similarity search latency from 800ms to 120ms by implementing PGVector indexing.
- Authored automated test scripts for ML model validation with 92% code coverage.`,
    savedJobs: ['job-2', 'job-5'],
    savedRoadmaps: []
  }
};

export const MOCK_JOBS: JobOpportunity[] = [
  {
    id: 'job-1',
    title: 'Full Stack React & Node.js Developer Intern',
    company: 'NextGen Cloud Systems',
    location: 'Remote / San Francisco, CA',
    type: 'Internship',
    experienceLevel: 'Entry-Level / Fresher',
    salaryOrStipend: '$35 - $45 / hour',
    description: 'We are seeking an energetic Full Stack Developer Intern to contribute to our real-time cloud collaboration suite. You will work directly with senior engineers building responsive React interfaces and high-performance Express REST APIs.',
    requirements: [
      'Proficiency in React 18+, JavaScript (ES6+), and CSS/Tailwind',
      'Understanding of Node.js and Express REST API design',
      'Familiarity with Git/GitHub workflows and modern frontend tooling',
      'Passion for building accessible, user-friendly UI/UX'
    ],
    skillsNeeded: ['React', 'Node.js', 'Express', 'JavaScript', 'Tailwind CSS', 'Git'],
    applyUrl: 'https://github.com/careers',
    source: 'Curated Tech Openings',
    postedDate: '2 days ago'
  },
  {
    id: 'job-2',
    title: 'AI & GenAI Solutions Engineering Intern',
    company: 'Cognitive Dynamics',
    location: 'Remote',
    type: 'Internship',
    experienceLevel: 'Entry-Level / Student',
    salaryOrStipend: '$40 - $50 / hour',
    description: 'Join our GenAI innovation hub to build state-of-the-art AI agents, LLM integrations, and RAG pipelines. Ideal for students passionate about prompt engineering, Gemini API, and modern Python/TypeScript AI stacks.',
    requirements: [
      'Hands-on experience with Python or TypeScript',
      'Familiarity with Gemini API, LangChain, or Hugging Face APIs',
      'Understanding of REST APIs and prompt design strategies',
      'Proactive problem solver with strong communication skills'
    ],
    skillsNeeded: ['Python', 'Google Gemini API', 'TypeScript', 'FastAPI', 'RAG', 'Git'],
    applyUrl: 'https://huggingface.co/jobs',
    source: 'GenAI Hub',
    postedDate: '1 day ago'
  },
  {
    id: 'job-3',
    title: 'Junior Frontend Developer (React / Next.js)',
    company: 'Pulse Media Studio',
    location: 'Austin, TX (Hybrid)',
    type: 'Full-time',
    experienceLevel: '0 - 2 Years',
    salaryOrStipend: '$75,000 - $90,000 / year',
    description: 'Pulse Media is looking for a Junior Frontend Developer to build highly interactive web apps with React, Tailwind CSS, and Framer Motion / Motion animations. You will collaborate with product designers to ship slick digital experiences.',
    requirements: [
      'Strong knowledge of HTML5, CSS3, Modern JavaScript, React',
      'Experience with responsive mobile-first layouts using Tailwind CSS',
      'Ability to turn Figma component designs into clean TypeScript code',
      'Familiarity with REST APIs and state management'
    ],
    skillsNeeded: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'REST API'],
    applyUrl: 'https://about.google/careers',
    source: 'Tech Careers',
    postedDate: '3 days ago'
  },
  {
    id: 'job-4',
    title: 'Backend Node.js & Database Engineer Intern',
    company: 'StreamData Infrastructure',
    location: 'Remote',
    type: 'Internship',
    experienceLevel: 'Entry-Level / Student',
    salaryOrStipend: '$30 - $40 / hour',
    description: 'Help us engineer scalable backend services, microservices, and database connectors. You will work with Node.js, Express, MongoDB/SQL, and container deployment tools.',
    requirements: [
      'Solid grasp of JavaScript/TypeScript and asynchronous Node.js',
      'Knowledge of relational databases (PostgreSQL) or NoSQL (MongoDB)',
      'Basic understanding of Docker, environment security, and REST architecture'
    ],
    skillsNeeded: ['Node.js', 'Express', 'MongoDB', 'SQL', 'TypeScript', 'Docker'],
    applyUrl: 'https://mongodb.com/careers',
    source: 'Curated Tech Openings',
    postedDate: '4 days ago'
  },
  {
    id: 'job-5',
    title: 'UI/UX & Product Design Intern',
    company: 'Aura Digital Labs',
    location: 'New York, NY (Hybrid)',
    type: 'Internship',
    experienceLevel: 'Student / Entry-Level',
    salaryOrStipend: '$28 - $36 / hour',
    description: 'Design intuitive, human-centric user experiences for our next-generation career and learning platforms. Collaborate with engineers and product managers on wireframes, design systems, and rapid interactive prototypes.',
    requirements: [
      'Portfolio demonstrating user research, wireframing, and polished UI design',
      'Proficiency with Figma or Adobe XD',
      'Understanding of web accessibility standards (WCAG 2.1 AA)',
      'Basic knowledge of HTML/CSS is a big plus'
    ],
    skillsNeeded: ['Figma', 'UI/UX', 'Wireframing', 'User Research', 'Prototyping', 'Design Systems'],
    applyUrl: 'https://figma.com/careers',
    source: 'Design Openings',
    postedDate: '5 days ago'
  },
  {
    id: 'job-6',
    title: 'Data Science & Analytics Intern',
    company: 'FinTech Analytics Corp',
    location: 'Remote',
    type: 'Internship',
    experienceLevel: 'Student / Fresher',
    salaryOrStipend: '$32 - $42 / hour',
    description: 'Transform complex transaction datasets into actionable business insights. Build automated data pipelines, predictive models, and interactive dashboard visualizers using Python, SQL, and Pandas.',
    requirements: [
      'Strong knowledge of Python, Pandas, NumPy, and SQL',
      'Experience with data visualization libraries (Matplotlib, Seaborn, or Plotly)',
      'Understanding of basic statistics and exploratory data analysis'
    ],
    skillsNeeded: ['Python', 'SQL', 'Pandas', 'Data Analysis', 'Statistics', 'Matplotlib'],
    applyUrl: 'https://kaggle.com/careers',
    source: 'Data Openings',
    postedDate: 'Just now'
  }
];

export const COMMON_JOB_ROLES = [
  'Full Stack Developer',
  'Frontend Developer (React)',
  'Backend Developer (Node.js)',
  'AI & GenAI Engineer',
  'Data Scientist / Analytics',
  'DevOps / Cloud Engineer',
  'Mobile App Developer (React Native)',
  'UI/UX Product Designer',
  'Cybersecurity Analyst',
  'Product Manager Intern'
];
