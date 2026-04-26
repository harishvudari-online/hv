export type LocalizedContent = {
  labels: {
    language: string;
    home: string;
    skills: string;
    experience: string;
    projects: string;
    contact: string;
    featuredCaseStudy: string;
    trustedBy: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    url: string;
  };
  hero: {
    name: string;
    role: string;
    summary: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    ctas: { label: string; href: string }[];
    badges: string[];
  };
  skills: {
    title: string;
    groups: { label: string; values: string[] }[];
  };
  experience: {
    company: string;
    role: string;
    period: string;
    highlight: string;
    points: string[];
  }[];
  caseStudy: {
    title: string;
    subtitle: string;
    architecture: string[];
    impact: string[];
  };
  companies: string[];
  projects: {
    name: string;
    stack: string;
    problem: string;
    solution: string;
    impact: string;
  }[];
  additionalLinks: string[];
  education: { qualification: string; institution: string; result: string }[];
  profile: string;
};

export const content: Record<string, LocalizedContent> = {
  en: {
    labels: {
      language: "Language",
      home: "Home",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
      featuredCaseStudy: "Featured Case Study",
      trustedBy: "Delivery Experience Across"
    },
    seo: {
      title: "Harish Vudari | Senior UI Engineer | Angular & React",
      description:
        "Senior UI Engineer with 10+ years of experience in Angular, React.js, TypeScript, Node.js, and AWS. Based in Hyderabad, open to remote global roles.",
      keywords: [
        "Harish Vudari",
        "Senior UI Engineer",
        "Angular Developer",
        "React.js Developer",
        "Frontend Architect",
        "Hyderabad",
        "Remote"
      ],
      url: "https://harishvudari.online"
    },
    hero: {
      name: "Harish Vudari",
      role: "Senior UI Engineer (10+ Years)",
      summary:
        "Frontend specialist building high-performance Angular and React applications with scalable architecture, polished UX, and cloud-ready delivery.",
      location: "Hyderabad, India + Remote Global",
      email: "vudari1043@gmail.com",
      phone: "+91 9666119079",
      linkedin: "https://linkedin.com/in/hareesh-vudari-43b3a0113",
      ctas: [
        { label: "Hire Me", href: "https://wa.me/919666119079?text=Hi%20Harish%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity." },
        { label: "Download CV", href: "/Harish_Vudari_UI_Senior_Developer_10+Years_2026.pdf" }
      ],
      badges: ["Angular", "React", "TypeScript", "Redux", "Node.js", "AWS"]
    },
    skills: {
      title: "Technical Expertise",
      groups: [
        { label: "Frontend", values: ["ReactJS", "Angular", "NextJS", "Bootstrap", "Material UI", "Tailwind CSS"] },
        { label: "Backend Languages", values: ["NodeJS", "JavaScript (ES6+)", "TypeScript", "PHP", "JSX"] },
        { label: "Databases", values: ["MongoDB", "MySQL", "DynamoDB"] },
        { label: "Tools & Cloud", values: ["AWS (S3, AppSync, Cognito)", "Git", "Bitbucket", "Jira", "VS Code"] },
        { label: "AI Tools", values: ["ChatGPT", "GitHub Copilot", "Cursor AI", "Claude", "Perplexity"] }
      ]
    },
    experience: [
      {
        company: "Nvizion Solutions Pvt Ltd",
        role: "Senior UI Engineer",
        period: "Feb 2022 - Present",
        highlight: "4+ years driving enterprise UI delivery",
        points: [
          "Driving enterprise-level MERN stack applications with focus on performance and clean architecture.",
          "Architecting responsive interfaces using React.js and Material UI for premium UX across devices.",
          "Collaborating in Agile/Scrum teams to ship reliable, high-performance releases on tight timelines."
        ]
      },
      {
        company: "Infosys Limited",
        role: "Technology Analyst",
        period: "Dec 2018 - Feb 2022",
        highlight: "3+ years building high-throughput client systems",
        points: [
          "Engineered high-throughput Angular and TypeScript applications for global clients.",
          "Built serverless services using AWS AppSync, Cognito, and DynamoDB.",
          "Designed workflow architectures for complex business logic and scalability."
        ]
      },
      {
        company: "WTA Studios Pvt Ltd",
        role: "Frontend Developer",
        period: "Mar 2017 - Nov 2018",
        highlight: "Built modular Angular platforms for product teams",
        points: [
          "Developed modular Angular components and integrated APIs such as Google Maps and Calendar.",
          "Built middle-tier Node.js HTTP services for stronger frontend-backend communication."
        ]
      },
      {
        company: "Cycado Lifestyle Pvt. Ltd (Liberent.com)",
        role: "Frontend Developer",
        period: "Jan 2016 - Feb 2017",
        highlight: "Scaled startup frontend during rapid growth stage",
        points: [
          "Optimized web apps for performance and mobile responsiveness using Bootstrap and custom CSS3.",
          "Maintained and improved core platform features during rapid startup growth."
        ]
      }
    ],
    caseStudy: {
      title: "N7 Dash Self-Service Platform",
      subtitle: "End-to-end Angular delivery with secure cloud architecture",
      architecture: [
        "Angular 18+ UI modules with reusable component architecture",
        "Redux-driven state management for predictable data flows",
        "JWT/OAuth security layer for role-based access",
        "AWS-backed CI/CD for reliable deployments"
      ],
      impact: [
        "Faster release cycles with standardized feature delivery",
        "Improved UX consistency across business-critical workflows",
        "Better scalability readiness through modular architecture"
      ]
    },
    companies: ["Nvizion", "Infosys", "WTA Studios", "Liberent", "First Group", "Neve Jewels"],
    projects: [
      {
        name: "Self-Service (N7 Dash)",
        stack: "Angular 18+, Redux, Material UI",
        problem: "Needed secure and scalable feature delivery for enterprise workflows.",
        solution: "Built end-to-end Angular features with JWT/OAuth security and CI/CD support on AWS.",
        impact: "Improved release stability, development velocity, and platform readiness for scale."
      },
      {
        name: "Neve Jewels (NJ)",
        stack: "ReactJS, Redux, Material UI",
        problem: "Required performant frontend modules with predictable state in a fast-moving product cycle.",
        solution: "Implemented Redux, Hooks, and Context patterns with reusable UI architecture.",
        impact: "Delivered smoother user flows, easier maintainability, and faster iteration."
      },
      {
        name: "Adiona Daily Screen (First Group of America)",
        stack: "Angular 7, AWS Services, DynamoDB, S3",
        problem: "Needed cloud-backed architecture for large data handling and secure user access.",
        solution: "Designed Angular UX and built microservices using AppSync with Cognito-based auth.",
        impact: "Enabled reliable large-scale data workflows with secure authentication."
      },
      {
        name: "Health @ Home",
        stack: "NodeJS, MongoDB, Angular 5, Bootstrap",
        problem: "Demanded quick UI delivery with REST integration under agile sprint pressure.",
        solution: "Developed modular UI features and integrated backend services using Node and MongoDB.",
        impact: "Accelerated sprint execution while maintaining app quality and responsiveness."
      }
    ],
    additionalLinks: [
      "https://wtastudios.com",
      "https://conduiraonline.com",
      "https://perspect.ai",
      "https://shecab.in",
      "https://stylmart.be",
      "https://thenextbigthing.co",
      "https://liberent.com",
      "https://greenkogroup.com",
      "https://ststworld.com",
      "https://trivive.com"
    ],
    education: [
      { qualification: "B.Tech (CS Engineering)", institution: "JNTUH", result: "66.8%" },
      { qualification: "Standard XII / Intermediate", institution: "Siddhartha Jr. college (AP State Board)", result: "68.8%" },
      { qualification: "Standard X / SSC", institution: "Sri Sharadha Vidhya Mandir (AP State Board)", result: "74%" }
    ],
    profile:
      "Date of Birth: 20th July 1993 | Languages: English, Telugu, Hindi | Marital Status: Married"
  },
  zh: {
    labels: {
      language: "语言",
      home: "首页",
      skills: "技能",
      experience: "经验",
      projects: "项目",
      contact: "联系",
      featuredCaseStudy: "精选案例研究",
      trustedBy: "交付经验覆盖"
    },
    seo: {
      title: "Harish Vudari | Senior UI Engineer | Angular & React",
      description:
        "Senior UI Engineer with 10+ years of experience in Angular, React.js, TypeScript, Node.js, and AWS. Based in Hyderabad, open to remote global roles.",
      keywords: [
        "Harish Vudari",
        "Senior UI Engineer",
        "Angular Developer",
        "React.js Developer",
        "Frontend Architect",
        "Hyderabad",
        "Remote"
      ],
      url: "https://harishvudari.online"
    },
    hero: {
      name: "Harish Vudari",
      role: "Senior UI Engineer (10+ Years)",
      summary:
        "Frontend specialist building high-performance Angular and React applications with scalable architecture, polished UX, and cloud-ready delivery.",
      location: "Hyderabad, India + Remote Global",
      email: "vudari1043@gmail.com",
      phone: "+91 9666119079",
      linkedin: "https://linkedin.com/in/hareesh-vudari-43b3a0113",
      ctas: [
        { label: "Hire Me", href: "https://wa.me/919666119079?text=Hi%20Harish%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20an%20opportunity." },
        { label: "Download CV", href: "/Harish_Vudari_UI_Senior_Developer_10+Years_2026.pdf" }
      ],
      badges: ["Angular", "React", "TypeScript", "Redux", "Node.js", "AWS"]
    },
    skills: {
      title: "Technical Expertise",
      groups: [
        { label: "Frontend", values: ["ReactJS", "Angular", "NextJS", "Bootstrap", "Material UI", "Tailwind CSS"] },
        { label: "Backend Languages", values: ["NodeJS", "JavaScript (ES6+)", "TypeScript", "PHP", "JSX"] },
        { label: "Databases", values: ["MongoDB", "MySQL", "DynamoDB"] },
        { label: "Tools & Cloud", values: ["AWS (S3, AppSync, Cognito)", "Git", "Bitbucket", "Jira", "VS Code"] },
        { label: "AI Tools", values: ["ChatGPT", "GitHub Copilot", "Cursor AI", "Claude", "Perplexity"] }
      ]
    },
    experience: [
      {
        company: "Nvizion Solutions Pvt Ltd",
        role: "Senior UI Engineer",
        period: "Feb 2022 - Present",
        highlight: "4+ years driving enterprise UI delivery",
        points: [
          "Driving enterprise-level MERN stack applications with focus on performance and clean architecture.",
          "Architecting responsive interfaces using React.js and Material UI for premium UX across devices.",
          "Collaborating in Agile/Scrum teams to ship reliable, high-performance releases on tight timelines."
        ]
      },
      {
        company: "Infosys Limited",
        role: "Technology Analyst",
        period: "Dec 2018 - Feb 2022",
        highlight: "3+ years building high-throughput client systems",
        points: [
          "Engineered high-throughput Angular and TypeScript applications for global clients.",
          "Built serverless services using AWS AppSync, Cognito, and DynamoDB.",
          "Designed workflow architectures for complex business logic and scalability."
        ]
      },
      {
        company: "WTA Studios Pvt Ltd",
        role: "Frontend Developer",
        period: "Mar 2017 - Nov 2018",
        highlight: "Built modular Angular platforms for product teams",
        points: [
          "Developed modular Angular components and integrated APIs such as Google Maps and Calendar.",
          "Built middle-tier Node.js HTTP services for stronger frontend-backend communication."
        ]
      },
      {
        company: "Cycado Lifestyle Pvt. Ltd (Liberent.com)",
        role: "Frontend Developer",
        period: "Jan 2016 - Feb 2017",
        highlight: "Scaled startup frontend during rapid growth stage",
        points: [
          "Optimized web apps for performance and mobile responsiveness using Bootstrap and custom CSS3.",
          "Maintained and improved core platform features during rapid startup growth."
        ]
      }
    ],
    caseStudy: {
      title: "N7 Dash Self-Service Platform",
      subtitle: "End-to-end Angular delivery with secure cloud architecture",
      architecture: [
        "Angular 18+ UI modules with reusable component architecture",
        "Redux-driven state management for predictable data flows",
        "JWT/OAuth security layer for role-based access",
        "AWS-backed CI/CD for reliable deployments"
      ],
      impact: [
        "Faster release cycles with standardized feature delivery",
        "Improved UX consistency across business-critical workflows",
        "Better scalability readiness through modular architecture"
      ]
    },
    companies: ["Nvizion", "Infosys", "WTA Studios", "Liberent", "First Group", "Neve Jewels"],
    projects: [
      {
        name: "Self-Service (N7 Dash)",
        stack: "Angular 18+, Redux, Material UI",
        problem: "Needed secure and scalable feature delivery for enterprise workflows.",
        solution: "Built end-to-end Angular features with JWT/OAuth security and CI/CD support on AWS.",
        impact: "Improved release stability, development velocity, and platform readiness for scale."
      },
      {
        name: "Neve Jewels (NJ)",
        stack: "ReactJS, Redux, Material UI",
        problem: "Required performant frontend modules with predictable state in a fast-moving product cycle.",
        solution: "Implemented Redux, Hooks, and Context patterns with reusable UI architecture.",
        impact: "Delivered smoother user flows, easier maintainability, and faster iteration."
      },
      {
        name: "Adiona Daily Screen (First Group of America)",
        stack: "Angular 7, AWS Services, DynamoDB, S3",
        problem: "Needed cloud-backed architecture for large data handling and secure user access.",
        solution: "Designed Angular UX and built microservices using AppSync with Cognito-based auth.",
        impact: "Enabled reliable large-scale data workflows with secure authentication."
      },
      {
        name: "Health @ Home",
        stack: "NodeJS, MongoDB, Angular 5, Bootstrap",
        problem: "Demanded quick UI delivery with REST integration under agile sprint pressure.",
        solution: "Developed modular UI features and integrated backend services using Node and MongoDB.",
        impact: "Accelerated sprint execution while maintaining app quality and responsiveness."
      }
    ],
    additionalLinks: [
      "https://wtastudios.com",
      "https://conduiraonline.com",
      "https://perspect.ai",
      "https://shecab.in",
      "https://stylmart.be",
      "https://thenextbigthing.co",
      "https://liberent.com",
      "https://greenkogroup.com",
      "https://ststworld.com",
      "https://trivive.com"
    ],
    education: [
      { qualification: "B.Tech (CS Engineering)", institution: "JNTUH", result: "66.8%" },
      { qualification: "Standard XII / Intermediate", institution: "Siddhartha Jr. college (AP State Board)", result: "68.8%" },
      { qualification: "Standard X / SSC", institution: "Sri Sharadha Vidhya Mandir (AP State Board)", result: "74%" }
    ],
    profile:
      "Date of Birth: 20th July 1993 | Languages: English, Telugu, Hindi | Marital Status: Married"
  }
};
