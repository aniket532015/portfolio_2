export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  // Attempt to fetch latest GitHub repos dynamically if token or public API is reachable
  let dynamicRepos = [];
  try {
    const token = process.env.GITHUB_TOKEN;
    const ghHeaders = { 'User-Agent': 'Mozilla/5.0' };
    if (token) ghHeaders['Authorization'] = `token ${token}`;

    const ghUrl = token
      ? 'https://api.github.com/user/repos?visibility=all&sort=updated&per_page=10'
      : 'https://api.github.com/users/aniket532015/repos?sort=updated&per_page=10';

    const ghRes = await fetch(ghUrl, { headers: ghHeaders });
    if (ghRes.ok) {
      const data = await ghRes.json();
      dynamicRepos = data.map(r => ({
        name: r.name,
        private: r.private,
        description: r.description || '',
        url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        updatedAt: r.updated_at
      }));
    }
  } catch (err) {
    // Dynamic GitHub fetch is non-blocking; fallback to curated list below
  }

  const portfolioDetails = {
    profile: {
      name: "Aniket Kumar",
      title: "Senior Associate Consultant & Cloud Engineer",
      bio: "DevOps Engineer with 2+ years of experience in cloud infrastructure, CI/CD automation, application deployment, monitoring, and backend systems. Experienced in AWS, Docker, Kubernetes, Jenkins, Terraform, Ansible, Linux, and Java Spring Boot. Specializes in automating deployments, improving system reliability, and supporting enterprise-scale applications.",
      headline: "Automating cloud infrastructure, accelerating deployments & engineering resilient distributed systems.",
      status: "Available for Projects & Consulting",
      experienceYears: "2+",
      location: {
        country: "India",
        relocation: "Open to global & remote opportunities"
      },
      avatar: "/Profile.png"
    },
    contact: {
      email: "akaniketkumar532015@gmail.com",
      phone: "+91-9122969421",
      website: "https://aniket.uk",
      productionUrl: "https://aniketkumar.me",
      contactFormEndpoint: "/api/send-email"
    },
    socials: {
      github: "https://github.com/aniket532015",
      linkedin: "https://www.linkedin.com/in/aniket-kumar-devops/",
      website: "https://aniket.uk",
      resumeDownload: "https://aniket.uk/#home"
    },
    experience: [
      {
        company: "InvenioLSI",
        role: "Senior Associate Consultant",
        location: "Hyderabad, India",
        period: "June 2024 - Present",
        type: "Full-time",
        responsibilities: [
          "Design and implement end-to-end CI/CD pipelines using Jenkins, GitHub Actions, and AWS infrastructure.",
          "Manage containerized microservices deployments with Docker, Kubernetes clusters, and Helm charts.",
          "Provision and maintain scalable, reliable Infrastructure as Code (IaC) using Terraform and Ansible.",
          "Configure observability, centralized logging, and alerting systems using AWS CloudWatch, Prometheus, and Grafana.",
          "Collaborate across cross-functional engineering teams to automate software release lifecycles and achieve 99.9% uptime."
        ],
        technologies: [
          "AWS", "Kubernetes", "Docker", "Terraform", "Ansible", "Jenkins",
          "Helm", "CloudWatch", "Linux", "Spring Boot", "Git"
        ]
      }
    ],
    skills: {
      cloudAndDevops: [
        { name: "AWS (EC2, S3, IAM, SQS, VPC, CloudWatch)", proficiency: 85 },
        { name: "GCP Basics", proficiency: 60 },
        { name: "Jenkins (CI/CD Automation)", proficiency: 80 },
        { name: "GitHub Actions", proficiency: 75 },
        { name: "Docker Containerization", proficiency: 80 },
        { name: "Kubernetes & Helm", proficiency: 70 }
      ],
      iacAndObservability: [
        { name: "Terraform (IaC)", proficiency: 75 },
        { name: "Ansible Configuration Management", proficiency: 80 },
        { name: "AWS CloudWatch", proficiency: 85 },
        { name: "System Logging & Alerting", proficiency: 80 },
        { name: "Performance Monitoring (Prometheus/Grafana)", proficiency: 80 }
      ],
      programmingAndDatabases: [
        { name: "Java (Core & EE)", proficiency: 90 },
        { name: "Spring Boot Microservices", proficiency: 85 },
        { name: "MuleSoft (Mule 4 Integration)", proficiency: 85 },
        { name: "Python & Bash Scripting", proficiency: 80 },
        { name: "SQL (PostgreSQL, MySQL)", proficiency: 75 },
        { name: "Linux Administration (Ubuntu, RHEL)", proficiency: 80 }
      ]
    },
    featuredProjects: [
      {
        id: "alfred-ai-platform",
        title: "Alfred AI — Enterprise Autonomous Multi-Agent Platform",
        description: "Industrial-grade Autonomous Multi-Agent AI Platform featuring a 5-agent specialized harness, deterministic AST policy engine, Temporal durable workflows, multi-LLM failover (Claude, GPT-4, Gemini), and embeddable chat SDK.",
        technologies: ["FastAPI", "Angular 19", "Temporal.io", "MongoDB", "Redis", "Docker", "OpenAPI 3.1"],
        liveUrl: "https://integrate-ai.aniket.uk/",
        githubUrl: "https://github.com/aniket532015",
        status: "Production Ready / Live",
        highlights: [
          "5-agent specialized harness with streaming tool execution",
          "Deterministic AST policy verification before action execution",
          "Durable long-running workflow orchestration with Temporal.io",
          "Shadow DOM embeddable chat widget (agent.js)",
          "Over 120+ documented OpenAPI 3.1 micro-endpoints"
        ]
      },
      {
        id: "ai-hybrid-voice-caller",
        title: "AI Hybrid Voice Caller",
        description: "Intelligent automated telephony system for healthcare appointment reminders & scheduling. Combines low-latency Rule Engine (Fast Path) with dynamic multi-AI fallback (Gemini 2.0 Flash Live, Mistral, GPT-4o-mini) and Amazon Polly Neural TTS.",
        technologies: ["FastAPI", "Twilio Voice API", "Gemini Live", "Mistral AI", "OpenAI", "MongoDB Atlas", "Amazon Polly"],
        liveUrl: "https://aicalling.aniket.uk/",
        githubUrl: "https://github.com/aniket532015/ai-hybrid-voice-caller",
        status: "Production Ready / Live",
        highlights: [
          "Low-latency dual-path engine: Rule-based fast path + Contextual AI fallback",
          "Automated multi-provider LLM failover chain (Gemini -> Mistral -> OpenAI)",
          "Real-time bidirectional speech recognition and Twilio webhook event handling",
          "Live MongoDB Atlas integration for appointment slot scheduling & call logging"
        ]
      },
      {
        id: "camporaone-school-os",
        title: "CamporaOne — The School Operating System",
        description: "Modern all-in-one Campus ERP SaaS connecting admissions CRM funnel, live fee billing ledgers, academic grading, timetables, and multi-branch parent portals in one unified, real-time cloud database.",
        technologies: ["Next.js", "React", "Tailwind CSS", "PostgreSQL", "Cloud Hosted", "Multi-Branch SaaS"],
        liveUrl: "https://www.camporaone.com/",
        githubUrl: "https://github.com/aniket532015",
        status: "Production SaaS / Live",
        highlights: [
          "Admissions CRM with real-time lead funnel conversion tracking",
          "Automated billing ledgers, fee collection tracking, and digital receipting",
          "Dedicated responsive portals for parents, teachers, and school administrators",
          "Scalable multi-branch cloud infrastructure with weekly continuous deployment"
        ]
      },
      {
        id: "aws-cicd-pipeline",
        title: "AWS CI/CD Pipeline",
        description: "Built automated deployment pipeline using Jenkins, GitHub, and AWS EC2. Reduced deployment cycles and improved release reliability across environments.",
        technologies: ["Jenkins", "AWS EC2", "Git", "Bash", "Docker"],
        githubUrl: "https://github.com/aniket532015",
        status: "Production Ready",
        highlights: [
          "Automated triggering via GitHub webhooks",
          "Integrated test validation and artifact packaging",
          "Zero-downtime deployment on AWS EC2 nodes"
        ]
      },
      {
        id: "kubernetes-deployment-lab",
        title: "Kubernetes Deployment Lab",
        description: "Deployed containerized applications using Deployments, Services, ConfigMaps, and Ingress. Managed application scaling and service exposure within Kubernetes clusters.",
        technologies: ["Kubernetes", "Docker", "Helm", "Ingress NGINX", "Linux"],
        githubUrl: "https://github.com/aniket532015",
        status: "Active Lab",
        highlights: [
          "Helm chart packaging for reproducible deployments",
          "Horizontal Pod Autoscaling (HPA) and resource limits",
          "TLS termination and path-based ingress routing"
        ]
      },
      {
        id: "terraform-aws-infrastructure",
        title: "Terraform AWS Infrastructure",
        description: "Provisioned secure, scalable EC2 infrastructure and networking components using modular Terraform configurations and Infrastructure as Code practices.",
        technologies: ["Terraform", "AWS VPC", "EC2", "Security Groups", "S3"],
        githubUrl: "https://github.com/aniket532015",
        status: "Production Ready",
        highlights: [
          "Custom VPC architecture with public and private subnets",
          "Remote state locking using S3 and DynamoDB",
          "Reusable modules for rapid multi-environment spin-up"
        ]
      },
      {
        id: "ansible-automation",
        title: "Infrastructure Automation using Ansible",
        description: "Created Ansible playbooks for server provisioning, package installation, security hardening, and automated software deployment across multiple nodes.",
        technologies: ["Ansible", "YAML", "Linux", "SSH", "Bash"],
        githubUrl: "https://github.com/aniket532015",
        status: "Production Ready",
        highlights: [
          "Idempotent playbooks for multi-server orchestration",
          "Automated security patch management and firewall rules",
          "Dynamic inventory integration with cloud providers"
        ]
      }
    ],
    repositories: {
      curated: [
        {
          name: "portfolio_2",
          description: "Interactive DevOps Engineer portfolio web application featuring telemetry, terminal, and AI assistant.",
          url: "https://github.com/aniket532015/portfolio_2",
          tech: ["JavaScript", "HTML5", "CSS3", "Vercel Serverless", "Java Spring Boot"]
        },
        {
          name: "ai-hybrid-voice-caller",
          description: "AI-driven outbound voice agent integrating Twilio, OpenAI audio streaming, and FastAPI orchestration.",
          url: "https://github.com/aniket532015/ai-hybrid-voice-caller",
          tech: ["Python", "FastAPI", "Twilio", "OpenAI"]
        }
      ],
      dynamicLatest: dynamicRepos
    },
    certifications: [
      { year: "2025", title: "AWS Cloud 101", issuer: "AWS Educate" },
      { year: "2025", title: "ITIL Certification", issuer: "InvenioLSI" },
      { year: "2024", title: "MuleSoft Developer", issuer: "Salesforce" },
      { year: "2023", title: "NPTEL Cloud Computing", issuer: "IIT Kharagpur / NPTEL" },
      { year: "2022", title: "Java Programming", issuer: "IIT Bombay Spoken Tutorial" },
      { year: "2022", title: "Google Cloud Challenge", issuer: "Google Cloud" }
    ],
    education: [
      {
        degree: "Bachelor of Technology in Computer Science and Engineering",
        institution: "GIET University",
        location: "Odisha, India",
        period: "May 2020 - May 2024",
        distinction: "Top 5% of Batch",
        leadership: [
          "Ex-Lead @ Data Science Club",
          "Ex-Lead @ Google Developer Student Clubs (DSC)"
        ]
      }
    ],
    cloudInfrastructureRegistry: [
      { name: "AWS EC2", type: "Compute Instance", role: "Primary Host", status: "ONLINE" },
      { name: "Jenkins Master", type: "CI/CD Server", role: "Build Pipeline Orchestrator", status: "ONLINE" },
      { name: "Docker Hub", type: "Container Registry", role: "Image Storage & Versioning", status: "ONLINE" },
      { name: "Kubernetes Cluster", type: "Container Orchestration", role: "Microservices Workloads", status: "ONLINE" },
      { name: "AWS CloudWatch", type: "Observability", role: "Logs & Alarm Dispatch", status: "ONLINE" },
      { name: "PostgreSQL DB", type: "Managed Database", role: "Relational Data Store", status: "ONLINE" }
    ],
    aiAssistant: {
      type: "Alfred AI Embeddable Agent",
      publicId: "agt_5TdfjHHEBlOo7kSiRJfZEg",
      apiBase: "https://integrate-ai.aniket.uk/api/v1",
      sdkUrl: "/agent.js"
    },
    apiEndpoints: [
      { path: "/api/details", method: "GET", description: "Complete portfolio metadata, profile, projects, skills, and telemetry" },
      { path: "/api/get-repos", method: "GET", description: "Fetch public and private GitHub repositories list" },
      { path: "/api/send-email", method: "POST", description: "Submit contact form notification via SMTP" },
      { path: "/api/openapi.json", method: "GET", description: "OpenAPI 3.0.3 specification document" }
    ],
    meta: {
      version: "2.5.0",
      generatedAt: new Date().toISOString(),
      platform: "Aniket Kumar Portfolio API (Vercel Serverless)"
    }
  };

  // Support optional ?section= filter (e.g. /api/details?section=projects)
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const section = url.searchParams.get('section');

  if (section && portfolioDetails[section]) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({
      section,
      data: portfolioDetails[section],
      meta: portfolioDetails.meta
    });
    return;
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).json(portfolioDetails);
}
