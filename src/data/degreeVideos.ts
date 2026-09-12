export interface AcademicVideo {
  id: string;
  title: string;
  degree: string;
  category: 'core' | 'future-tech' | 'competitive' | 'placement';
  platform: 'YouTube' | 'MIT OCW' | 'Harvard CS50' | 'Stanford Online' | 'NPTEL';
  youtubeId: string;
  thumbnailUrl: string;
  instructor: string;
  institution: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  semesterRelevance: string;
  description: string;
  learningOutcomes: string[];
  searchQuery: string;
}

export const DEGREE_ACADEMIC_VIDEOS: AcademicVideo[] = [
  // ==========================================
  // COMPUTER SCIENCE & INFORMATION TECHNOLOGY
  // ==========================================
  {
    id: 'cs-1',
    title: 'Harvard CS50: Full Computer Science Foundation & Systems',
    degree: 'Computer Science',
    category: 'core',
    platform: 'Harvard CS50',
    youtubeId: '8jLOx1hD3_o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. David J. Malan',
    institution: 'Harvard University',
    duration: '24h 50m Masterclass',
    difficulty: 'Beginner',
    semesterRelevance: 'Semester I - IV Foundational',
    description: 'An intellectual enterprise in the art of programming and computer science essentials: algorithmic thinking, C memory architecture, data structures, and Python.',
    learningOutcomes: [
      'Master fundamental computational thinking and memory pointers in C',
      'Understand time complexity (Big-O) in sorting and searching',
      'Bridge hardware architecture to software execution'
    ],
    searchQuery: 'Harvard CS50 full course introduction to computer science'
  },
  {
    id: 'cs-2',
    title: 'MIT 6.006: Introduction to Algorithms & Complex Data Structures',
    degree: 'Computer Science',
    category: 'core',
    platform: 'MIT OCW',
    youtubeId: 'ZA-tUyM_y7s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc141e974e4?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. Erik Demaine & Prof. Srini Devadas',
    institution: 'MIT (Massachusetts Institute of Technology)',
    duration: '1h 18m per lecture (24 Lectures)',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester III & IV Core Syllabus',
    description: 'Rigorous mathematical and computational analysis of trees, balanced AVL structures, Dijkstra graph traversal, dynamic programming, and hash collisions.',
    learningOutcomes: [
      'Formulate dynamic programming sub-problems with memoization',
      'Analyze graph search algorithms (BFS, DFS, Bellman-Ford)',
      'Prepare for university university semester finals and competitive coders'
    ],
    searchQuery: 'MIT 6.006 Introduction to Algorithms lecture'
  },
  {
    id: 'cs-3',
    title: 'Building GPT from Scratch & Deep Transformer Architectures',
    degree: 'Computer Science',
    category: 'future-tech',
    platform: 'YouTube',
    youtubeId: 'kCc8FmEb1nY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    instructor: 'Andrej Karpathy (Former Director of AI, Tesla / OpenAI)',
    institution: 'Eureka AI Labs',
    duration: '1h 56m Deep Dive',
    difficulty: 'Advanced',
    semesterRelevance: 'Semester VI & Final Year Specialization',
    description: 'Step-by-step implementation of multi-head self-attention, transformer blocks, residual connections, and language model training from absolute first principles.',
    learningOutcomes: [
      'Code scaled dot-product attention and multi-head mechanisms in PyTorch',
      'Understand positional encodings and layer normalization',
      'Gain industrial competitive advantage in modern generative AI and LLMs'
    ],
    searchQuery: 'Andrej Karpathy Let\'s build GPT from scratch nanoGPT'
  },
  {
    id: 'cs-4',
    title: 'System Design Interview & Distributed Architecture Masterclass',
    degree: 'Computer Science',
    category: 'placement',
    platform: 'YouTube',
    youtubeId: 'm8Icp_Cid5o',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    instructor: 'Alex Xu / ByteByteGo',
    institution: 'ByteByteGo Academy',
    duration: '45m Case Studies',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester V - VIII Campus Placement & Interviews',
    description: 'Comprehensive high-level system design: load balancers, CDN caching, database sharding, microservices communication, and message queues (Kafka, RabbitMQ).',
    learningOutcomes: [
      'Scale relational and NoSQL databases for millions of concurrent users',
      'Evaluate CAP theorem trade-offs in distributed clusters',
      'Crack Tier-1 product company tech rounds and architectural viva'
    ],
    searchQuery: 'System design for beginners ByteByteGo distributed systems'
  },
  {
    id: 'cs-5',
    title: 'Operating Systems & Concurrency Deep Dive (Threads & Deadlocks)',
    degree: 'Computer Science',
    category: 'core',
    platform: 'NPTEL',
    youtubeId: 'bkSWJJZNgf8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. P.K. Biswas',
    institution: 'IIT Kharagpur (NPTEL)',
    duration: '48m Modules',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester IV & V Core',
    description: 'Process scheduling, virtual memory paging, semaphore synchronization, inter-process communication (IPC), and kernel virtualization.',
    learningOutcomes: [
      'Master Banker\'s algorithm and deadlock avoidance strategies',
      'Understand translation lookaside buffers (TLB) and page fault recovery',
      'Ace college university exams and GATE Computer Science questions'
    ],
    searchQuery: 'NPTEL Operating Systems process scheduling and memory management'
  },
  {
    id: 'cs-6',
    title: 'Full-Stack Modern Web & Cloud Architecture (React, Node, Docker)',
    degree: 'Computer Science',
    category: 'placement',
    platform: 'YouTube',
    youtubeId: 'Oe421EPjeBE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
    instructor: 'Beau Carnes & freeCodeCamp Staff',
    institution: 'freeCodeCamp',
    duration: '8h 20m Full Course',
    difficulty: 'Beginner',
    semesterRelevance: 'Semester III - VI Project Portfolio',
    description: 'Build real-world production applications with RESTful APIs, JWT authentication, PostgreSQL ORMs, responsive frontend interfaces, and container deployment.',
    learningOutcomes: [
      'Construct scalable full-stack web applications with cloud databases',
      'Implement asynchronous API handling and reactive state architecture',
      'Build a portfolio-grade capstone project for campus recruitment'
    ],
    searchQuery: 'freeCodeCamp full stack web development tutorial node react'
  },

  // ==========================================
  // ARTIFICIAL INTELLIGENCE & DATA SCIENCE
  // ==========================================
  {
    id: 'ai-1',
    title: 'Neural Networks & Deep Learning Math Visualized',
    degree: 'AI & Data Science',
    category: 'core',
    platform: 'YouTube',
    youtubeId: 'aircAruvnKk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
    instructor: 'Grant Sanderson',
    institution: '3Blue1Brown',
    duration: '1h 40m 4-Part Series',
    difficulty: 'Beginner',
    semesterRelevance: 'Semester III - VI Core AI Syllabus',
    description: 'Intuitive geometric and calculus visual foundations of multi-layer perceptrons, matrix transformations, backpropagation, and gradient descent optimization.',
    learningOutcomes: [
      'Develop geometric intuition for high-dimensional matrix weight spaces',
      'Calculate partial derivatives of cost functions in backpropagation',
      'Eliminate the black-box mystery of modern neural networks'
    ],
    searchQuery: '3Blue1Brown neural networks deep learning chapter 1'
  },
  {
    id: 'ai-2',
    title: 'Stanford CS229: Machine Learning Full Lecture Series',
    degree: 'AI & Data Science',
    category: 'core',
    platform: 'Stanford Online',
    youtubeId: 'jGwO_UgTS7I',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. Andrew Ng',
    institution: 'Stanford University',
    duration: '1h 15m (20 Lectures)',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester IV & V Core Coursework',
    description: 'The definitive machine learning masterclass: linear and logistic regression, SVMs, kernel methods, regularization, clustering, and reinforcement learning.',
    learningOutcomes: [
      'Formulate maximum likelihood estimation and bias-variance tradeoff',
      'Implement support vector machines with Mercer kernels',
      'Analyze real-world data science datasets and prevent overfitting'
    ],
    searchQuery: 'Stanford CS229 Machine Learning Andrew Ng lecture 1'
  },
  {
    id: 'ai-3',
    title: 'MLOps: End-to-End Machine Learning Pipeline Deployment in Cloud',
    degree: 'AI & Data Science',
    category: 'future-tech',
    platform: 'YouTube',
    youtubeId: '06-AZXmwHjo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=600&q=80',
    instructor: 'Alexey Grigorev',
    institution: 'DataTalksClub',
    duration: '3h 10m Workshop',
    difficulty: 'Advanced',
    semesterRelevance: 'Semester VI - VIII Future Tech',
    description: 'Take models from Jupyter notebooks to production: model registries (MLflow), data version control (DVC), containerization with Docker, and CI/CD pipelines.',
    learningOutcomes: [
      'Deploy inference microservices with FastAPI and AWS ECS',
      'Monitor model drift and performance metrics in real-time',
      'Build industry-standard MLOps practices demanded by tech enterprises'
    ],
    searchQuery: 'MLOps zoomcamp full course machine learning engineering deployment'
  },

  // ==========================================
  // ELECTRONICS & COMMUNICATION ENGINEERING (ECE)
  // ==========================================
  {
    id: 'ece-1',
    title: 'MIT 6.002: Circuits and Electronics Fundamentals',
    degree: 'Electronics & Communication',
    category: 'core',
    platform: 'MIT OCW',
    youtubeId: 'bO7FQsCcbD8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. Anant Agarwal',
    institution: 'MIT (Massachusetts Institute of Technology)',
    duration: '50m (25 Lectures)',
    difficulty: 'Beginner',
    semesterRelevance: 'Semester II & III Core',
    description: 'Lumped circuit abstraction, nodal analysis, nonlinear diodes, MOSFET amplifiers, state-space representations, and operational amplifiers.',
    learningOutcomes: [
      'Analyze RLC transient responses and AC frequency domain impedances',
      'Design small-signal MOSFET and BJT amplifier configurations',
      'Form the bedrock for all future VLSI and hardware engineering courses'
    ],
    searchQuery: 'MIT 6.002 Circuits and Electronics lecture Anant Agarwal'
  },
  {
    id: 'ece-2',
    title: 'NPTEL: VLSI Design, Verilog HDL & CMOS Layout Verification',
    degree: 'Electronics & Communication',
    category: 'future-tech',
    platform: 'NPTEL',
    youtubeId: '9SnR3M3CIm4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. S. Sengupta',
    institution: 'IIT Kharagpur (NPTEL)',
    duration: '45m Series',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester V & VI Core',
    description: 'CMOS logic synthesis, static timing analysis (STA), propagation delay calculation, FPGA architecture, and RTL coding with Verilog.',
    learningOutcomes: [
      'Synthesize combinational and sequential hardware circuits in Verilog',
      'Optimize power dissipation and clock-skew in sub-micron chips',
      'Qualify for high-demand core semiconductor roles (Qualcomm, Intel, TI)'
    ],
    searchQuery: 'NPTEL VLSI design verification CMOS inverter Verilog'
  },
  {
    id: 'ece-3',
    title: 'Embedded Systems with ARM Cortex-M & Bare-Metal C Programming',
    degree: 'Electronics & Communication',
    category: 'placement',
    platform: 'YouTube',
    youtubeId: 'q_j9kG2D4kU',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80',
    instructor: 'FastBit Embedded Brain Academy',
    institution: 'FastBit Academy',
    duration: '2h 15m Masterclass',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester V - VII Industry Focus',
    description: 'Memory-mapped I/O, NVIC interrupt controllers, GPIO peripheral drivers, USART, SPI, I2C bus protocols, and FreeRTOS task scheduling.',
    learningOutcomes: [
      'Program ARM Cortex-M microcontrollers without vendor HAL libraries',
      'Configure hardware timers, PWM signals, and DMA transfers',
      'Acquire core robotics, automotive, and IoT engineering placement skills'
    ],
    searchQuery: 'ARM Cortex microcontroller bare metal embedded C programming tutorial'
  },

  // ==========================================
  // MECHANICAL ENGINEERING (MECH)
  // ==========================================
  {
    id: 'mech-1',
    title: 'Mechanics of Materials & Stress-Strain Tensors Visualized',
    degree: 'Mechanical Engineering',
    category: 'core',
    platform: 'YouTube',
    youtubeId: 'HcgV_kH1j_U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
    instructor: 'The Efficient Engineer',
    institution: 'The Efficient Engineer Academy',
    duration: '18m High-Density Visualizer',
    difficulty: 'Beginner',
    semesterRelevance: 'Semester III Core Mechanical',
    description: 'Stunning 3D visualizations of Mohr\'s Circle, principal stresses, shear strain, torsion, and beam bending equations derived intuitively.',
    learningOutcomes: [
      'Visualize complex stress tensors and von Mises yield criteria',
      'Calculate bending moment diagrams (BMD) and shear force diagrams (SFD)',
      'Establish flawless engineering design foundations for machinery'
    ],
    searchQuery: 'The Efficient Engineer understanding Mohr\'s circle and stress tensors'
  },
  {
    id: 'mech-2',
    title: 'Finite Element Analysis (FEA) & ANSYS Structural Simulations',
    degree: 'Mechanical Engineering',
    category: 'future-tech',
    platform: 'NPTEL',
    youtubeId: 'd0j9xL7c1bM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. B.N. Rao',
    institution: 'IIT Madras (NPTEL)',
    duration: '45m Lectures',
    difficulty: 'Advanced',
    semesterRelevance: 'Semester VI & VII Core',
    description: 'Matrix structural analysis, discretization, shape functions, stiffness matrices, boundary conditions, and nonlinear structural simulations.',
    learningOutcomes: [
      'Derive 1D and 2D finite element stiffness matrices manually',
      'Execute stress, modal, and thermal simulations in industrial CAD/FEA suites',
      'Prepare for aerospace, automotive, and structural engineering positions'
    ],
    searchQuery: 'NPTEL Finite Element Method structural analysis IIT Madras'
  },
  {
    id: 'mech-3',
    title: 'Electric Vehicle Powertrain Dynamics & Battery Thermal Management',
    degree: 'Mechanical Engineering',
    category: 'future-tech',
    platform: 'YouTube',
    youtubeId: 'b3_0O1C0GjM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. John Hayes & Engineering Explained',
    institution: 'Global EV Mobility Consortium',
    duration: '1h 35m Specialized Tech',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester V - VIII Future Career Track',
    description: 'EV transmission sizing, regenerative braking thermodynamics, lithium-ion battery cooling channels, and regenerative powertrain mechanics.',
    learningOutcomes: [
      'Model vehicle resistance forces (aerodynamic drag, rolling resistance)',
      'Design liquid cooling jacket geometries for high-discharge battery packs',
      'Position yourself for high-growth EV and renewable transport industries'
    ],
    searchQuery: 'Electric vehicle powertrain mechanics battery cooling systems explained'
  },

  // ==========================================
  // ELECTRICAL & ELECTRONICS ENGINEERING (EEE)
  // ==========================================
  {
    id: 'eee-1',
    title: 'NPTEL: Power Electronics Converters, Inverters & Motor Drives',
    degree: 'Electrical & Electronics',
    category: 'core',
    platform: 'NPTEL',
    youtubeId: 'G1j6q2cK1w4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. K. Gopakumar',
    institution: 'IISc Bangalore (NPTEL)',
    duration: '50m Modules',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester IV & V Core',
    description: 'Buck, boost, and buck-boost switch mode power supplies, sinusoidal pulse width modulation (SPWM), H-bridge inverters, and induction motor drive control.',
    learningOutcomes: [
      'Design high-efficiency DC-DC switched converters with minimal ripple',
      'Analyze harmonics in three-phase inverter switching schemes',
      'Ace power engineering GATE papers and industrial power grid interviews'
    ],
    searchQuery: 'NPTEL Power Electronics converters inverters IISc Bangalore'
  },
  {
    id: 'eee-2',
    title: 'Smart Grid Architectures & Modern Renewable Energy Integration',
    degree: 'Electrical & Electronics',
    category: 'future-tech',
    platform: 'MIT OCW',
    youtubeId: 'P0a9pQ6u5yQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. Marija Ilic',
    institution: 'MIT Energy Initiative',
    duration: '1h 10m Lecture',
    difficulty: 'Advanced',
    semesterRelevance: 'Semester VI & VII Specialized',
    description: 'Dynamic load balancing, microgrid islanding, solar photovoltaic MPPT algorithms, wind turbine generator interfacing, and SCADA monitoring.',
    learningOutcomes: [
      'Formulate maximum power point tracking (MPPT) for fluctuating solar input',
      'Coordinate distributed energy resources with modern utility grids',
      'Unlock future career pathways in global clean tech and energy storage'
    ],
    searchQuery: 'MIT smart grid architecture renewable energy integration power systems'
  },

  // ==========================================
  // CIVIL ENGINEERING (CIVIL)
  // ==========================================
  {
    id: 'civ-1',
    title: 'Structural Analysis & Reinforced Concrete Design (RCC) Mastery',
    degree: 'Civil Engineering',
    category: 'core',
    platform: 'NPTEL',
    youtubeId: '4b4bN39b4hM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    instructor: 'Prof. P. Banerjee',
    institution: 'IIT Roorkee (NPTEL)',
    duration: '52m Lectures',
    difficulty: 'Intermediate',
    semesterRelevance: 'Semester IV & V Core Civil',
    description: 'Limit state design philosophy, singly & doubly reinforced beams, column buckling, slab shear resistance, and earthquake-resistant detailing.',
    learningOutcomes: [
      'Calculate ultimate moment capacities of reinforced concrete sections',
      'Detail steel rebar placement to prevent sudden brittle shear failure',
      'Prepare for professional structural consultant and public sector exams'
    ],
    searchQuery: 'NPTEL reinforced concrete design limit state method IIT Roorkee'
  },
  {
    id: 'civ-2',
    title: 'Smart City Infrastructure, GIS & BIM (Building Information Modeling)',
    degree: 'Civil Engineering',
    category: 'future-tech',
    platform: 'YouTube',
    youtubeId: 'F1c8pQ6x9kL',
    thumbnailUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    instructor: 'Autodesk & Practical Engineering',
    institution: 'Global Infrastructure Forum',
    duration: '42m Overview',
    difficulty: 'Beginner',
    semesterRelevance: 'Semester V - VIII Modern Civil',
    description: 'Digital twins in construction, 4D/5D BIM scheduling, geographic information systems (GIS) spatial planning, and resilient smart transport corridors.',
    learningOutcomes: [
      'Understand clash detection and lifecycle cost estimation in BIM models',
      'Leverage geospatial data for urban drainage and transport zoning',
      'Bridge traditional civil engineering into modern digital construction tech'
    ],
    searchQuery: 'Building information modeling BIM digital twins civil engineering'
  }
];

export const DEGREE_LIST = [
  'Computer Science',
  'AI & Data Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Electrical & Electronics',
  'Civil Engineering'
] as const;

export function getDegreeVideos(degree: string): AcademicVideo[] {
  const norm = (degree || '').trim().toUpperCase();
  
  if (norm.includes('COMPUTER') || norm.includes('CS') || norm.includes('SOFTWARE') || norm.includes('IT') || norm.includes('INFORMATION')) {
    return DEGREE_ACADEMIC_VIDEOS.filter(v => v.degree === 'Computer Science' || v.degree === 'AI & Data Science');
  }
  if (norm.includes('DATA') || norm.includes('AI') || norm.includes('INTELLIGENCE')) {
    return DEGREE_ACADEMIC_VIDEOS.filter(v => v.degree === 'AI & Data Science' || v.degree === 'Computer Science');
  }
  if (norm.includes('ELECTRONIC') || norm.includes('ECE') || norm.includes('COMMUNICATION')) {
    return DEGREE_ACADEMIC_VIDEOS.filter(v => v.degree === 'Electronics & Communication');
  }
  if (norm.includes('MECHANICAL') || norm.includes('MECH') || norm.includes('AUTOMOBILE') || norm.includes('AERO')) {
    return DEGREE_ACADEMIC_VIDEOS.filter(v => v.degree === 'Mechanical Engineering');
  }
  if (norm.includes('ELECTRICAL') || norm.includes('EEE') || norm.includes('POWER')) {
    return DEGREE_ACADEMIC_VIDEOS.filter(v => v.degree === 'Electrical & Electronics');
  }
  if (norm.includes('CIVIL') || norm.includes('STRUCTURAL') || norm.includes('CONSTRUCTION')) {
    return DEGREE_ACADEMIC_VIDEOS.filter(v => v.degree === 'Civil Engineering');
  }

  // Default fallback: Return Computer Science & AI videos if degree is unclassified
  return DEGREE_ACADEMIC_VIDEOS.filter(v => v.degree === 'Computer Science' || v.degree === 'AI & Data Science');
}
