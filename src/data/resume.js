import certPython from '../assets/certificates/pe2.jpg'
import certBI from '../assets/certificates/bi.jpg'
import certNLP from '../assets/certificates/nlp.jpg'
import certWeka from '../assets/certificates/weka.jpg'
import certTableau from '../assets/certificates/powerbi.jpg'
import certPowerBIScenarios from '../assets/certificates/powerbi2.jpg'
import certPowerBIPractical from '../assets/certificates/powerbi3.jpg'

export const profile = {
  name: 'Kota Himesh Yoga',
  displayName: 'Himesh Kota',
  role: 'AI & ML Engineer',
  tagline: 'Final-year AI & ML student building intelligent systems that ship.',
  summary:
    'Aspiring Artificial Intelligence Engineer and AIML student with a strong foundation in Python, machine learning, deep learning, and data analytics. Seeking opportunities to apply my skills in building intelligent systems, predictive models, and data-driven solutions to solve real-world problems. Passionate about continuously learning emerging AI technologies and contributing to innovative projects while growing as a skilled AI engineer.',
  location: 'Bengaluru, India',
  email: 'himeshkota@gmail.com',
  phone: '+91 73863 33400',
  github: 'https://github.com/himeshkota07',
  githubHandle: 'github.com/himeshkota07',
  linkedin: 'https://linkedin.com/in/himesh-kota',
  linkedinHandle: 'linkedin.com/in/himesh-kota',
}

export const skills = {
  Languages: ['Python', 'Java', 'SQL'],
  'ML / AI': [
    'scikit-learn',
    'TensorFlow',
    'PyTorch',
    'YOLOv8',
    'Deep Learning',
    'NLP',
    'LLM APIs',
    'Predictive Modelling',
  ],
  Data: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'EDA', 'Feature Engineering'],
  'Cloud / Tools': ['AWS Lambda', 'API Gateway', 'REST APIs', 'JWT Auth', 'Git', 'GitHub', 'Jupyter'],
}

export const softSkills = [
  'Team Collaboration',
  'Effective Communication',
  'Leadership',
  'Time Management',
  'Adaptability',
  'Critical Thinking',
]

export const experience = [
  {
    role: 'AI Engineer Intern',
    company: 'Reworked.AI (ReworkedREI LLC)',
    location: 'Remote',
    period: 'May 2025 – September 2025',
    bullets: [
      'Developed ML components for Betty Score, Reworked.AI\'s proprietary lead scoring engine that processes property datasets for roofing, solar, and real estate investor verticals and ranks homeowner leads by conversion likelihood.',
      'Built and maintained data pipelines that ingested structured property files (owner name, mailing address, ZIP code) through a JWT-authenticated REST API (/process-leads), applying cleaning, feature engineering, and predictive modelling across incoming batches.',
      'Integrated the scoring system with an async callback architecture — processing jobs dispatched file results to client callback URLs on completion, supporting multiple concurrent client integrations.',
      'Performed statistical analysis and EDA to identify signal features driving lead quality across three industry verticals (Roofing, Solar Installer, Real Estate Investors), improving scoring precision.',
      'Translated model outputs into business-ready lead rankings consumed directly by client sales workflows, reducing manual lead qualification effort.',
    ],
  },
]

export const projects = [
  {
    title: 'Bank Statement Extraction & CoA Mapping',
    period: '2026',
    tag: 'Agentica-2.0 — 1st Place, IIIT SriCity',
    stack: ['Python', 'LLM APIs', 'OCR'],
    description:
      'LLM-powered pipeline that parses unstructured bank statement PDFs (scanned and digital) and automatically classifies transactions against a Chart of Accounts schema — won first place at a national-level hackathon.',
    highlights: [
      'Combined OCR preprocessing with regex normalisation for multi-format PDF handling',
      'Applied structured prompting to maximise classification accuracy across varied bank statement layouts',
    ],
    link: 'https://github.com/himeshkota07',
    featured: true,
  },
  {
    title: 'Vision & ML Adaptive Traffic Signal Control',
    period: '2024',
    tag: 'B.N.M. Institute of Technology',
    stack: ['YOLOv8', 'Python', 'OpenCV'],
    description:
      'Deployed YOLOv8 with the UA-DETRAC benchmark to estimate lane-wise vehicle density in real time and feed a fairness-aware signal controller that dynamically optimises cycle timings.',
    highlights: [
      'Validated through simulation-based evaluation',
      'Demonstrated measurable reduction in average vehicle waiting time versus a fixed-cycle baseline',
    ],
    link: 'https://github.com/himeshkota07',
    featured: true,
  },
  {
    title: 'Serverless ChatBot Application',
    period: '2024',
    tag: 'Personal Project',
    stack: ['Python', 'AWS Lambda', 'API Gateway'],
    description:
      'Conversational chatbot deployed on AWS Lambda and API Gateway, demonstrating end-to-end serverless architecture, REST API integration, and cloud deployment.',
    highlights: [],
    link: 'https://github.com/himeshkota07',
    featured: false,
  },
  {
    title: 'Graphical Password Authentication System',
    period: '2024',
    tag: 'Personal Project',
    stack: ['Python', 'Security'],
    description:
      'Image-based authentication system designed as a secure, user-friendly alternative to text passwords, built to resist common password attacks.',
    highlights: [],
    link: 'https://github.com/himeshkota07',
    featured: false,
  },
]

export const education = [
  {
    degree: 'Bachelor of Engineering — Artificial Intelligence and Machine Learning',
    school: 'B.N.M. Institute of Technology, Bengaluru',
    period: '2023 – Present',
    detail: 'CGPA: 9.16 / 10.00 (Semesters 1–6)',
  },
  {
    degree: 'Class XII — Science (PCMC)',
    school: 'Sri Sathya Sai Higher Secondary School, Puttaparthi',
    period: '2021 – 2023',
    detail: '88%',
  },
  /*{
    degree: 'Secondary School (SSLC)',
    school: 'Vidya Mandir EM High School, Kadapa',
    period: '2020 – 2021',
    detail: '81.6%',
  },*/
]

export const achievements = [
  {
    title: 'Agentica-2.0 National Hackathon — 1st Place',
    org: 'IIIT SriCity',
    year: '2026',
    description: 'Problem statement: bank statement data extraction to spreadsheet and Chart-of-Accounts mapping.',
  },
  {
    title: "HackVerse '25 National Hackathon — Participant",
    org: 'IBM SkillsBuild & 1M1B',
    year: '2025',
    description: 'Problem statement: CradleCare — AI-powered digital health tracking for infants and mothers.',
  },
]

export const certifications = [
  {
    title: 'Python for Data Science',
    issuer: 'Infosys Springboard',
    year: 'Apr 2026',
    description: 'NumPy, Pandas, EDA, and data visualisation for real-world datasets.',
    image: certPython,
  },
  /*{
    title: 'JavaScript Fundamentals',
    issuer: 'Infosys Springboard',
    year: '2024',
    description: 'Variables, functions, control structures, DOM manipulation, and ES6 features.',
  },*/
  {
    title: 'BI — Business Intelligence',
    issuer: 'Infosys Springboard',
    year: 'Apr 2026',
    description: 'Business intelligence fundamentals and applied analytics workflows.',
    image: certBI,
  },
  {
    title: 'Introduction to Natural Language Processing',
    issuer: 'Infosys Springboard',
    year: 'Apr 2026',
    description: 'Core NLP concepts and text-processing techniques.',
    image: certNLP,
  },
  {
    title: 'Overview of Business Analytics using WEKA',
    issuer: 'Infosys Springboard',
    year: 'Mar 2026',
    description: 'Applied business analytics using the WEKA data mining toolkit.',
    image: certWeka,
  },
  {
    title: 'Salesforce Tableau Data Analyst/Specialist Desktop Cert Prep',
    issuer: 'Udemy',
    year: 'Jul 2026',
    description: '15.5-hour cert-prep course covering Tableau Desktop Specialist exam objectives.',
    image: certTableau,
  },
  {
    title: 'Power BI Business Scenarios with Hands-on Use Cases',
    issuer: 'Udemy',
    year: 'Jul 2026',
    description: '37.5 hours of applied Power BI scenarios and dashboarding use cases.',
    image: certPowerBIScenarios,
  },
  {
    title: 'The Complete Power BI Practical Course 2026',
    issuer: 'Udemy',
    year: 'Jul 2026',
    description: '21.5-hour practical, project-based Power BI course.',
    image: certPowerBIPractical,
  },
]

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Telugu', level: 'Fluent' },
  { name: 'Kannada', level: 'Fluent' },
  { name: 'Hindi', level: 'Intermediate' },
]

export const hobbies = ['Badminton', 'Chess', 'Volleyball', 'Vedic Math']
