export interface GalleryAvatar {
  id: string;
  name: string;
  category: 'scholars' | 'tech' | 'campus' | 'abstract';
  url: string;
  description: string;
}

export const AVATAR_GALLERY: GalleryAvatar[] = [
  // University Scholars (Real Portraits)
  {
    id: 'scholar-1',
    name: 'Aria Chen',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Computer Science Scholar • AI & Data Lab'
  },
  {
    id: 'scholar-2',
    name: 'Marcus Vance',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Information Technology • Cloud Architect'
  },
  {
    id: 'scholar-3',
    name: 'Dinesh Miller',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Electronics & VLSI • Embedded Systems'
  },
  {
    id: 'scholar-4',
    name: 'Sophia Patel',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Data Science & Analytics • Neural Nets'
  },
  {
    id: 'scholar-5',
    name: 'Liam Zhang',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Software Engineering • Distributed Systems'
  },
  {
    id: 'scholar-6',
    name: 'Elena Rostova',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Cybersecurity & Cryptography'
  },
  {
    id: 'scholar-7',
    name: 'Karan Sharma',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Full Stack Web & Mobile Technologies'
  },
  {
    id: 'scholar-8',
    name: 'Maya Lin',
    category: 'scholars',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Artificial Intelligence & Robotics Research'
  },

  // Tech & Engineering Avatars
  {
    id: 'tech-1',
    name: 'Arjun Rivera',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Systems Engineer • Linux Kernel Dev'
  },
  {
    id: 'tech-2',
    name: 'Priya Nambiar',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Deep Learning & Vision Systems'
  },
  {
    id: 'tech-3',
    name: 'Nico Brooks',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Backend & High-Throughput Architect'
  },
  {
    id: 'tech-4',
    name: 'Zoe Morales',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Quantum Computing & Algorithms'
  },

  // Campus Life & Research Labs
  {
    id: 'campus-1',
    name: 'Library Scholar',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'University Library Research Wing'
  },
  {
    id: 'campus-2',
    name: 'Hardware Lab',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Robotics & Automation Laboratory'
  },
  {
    id: 'campus-3',
    name: 'Campus Commons',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Academic Hall • Study Circle'
  },
  {
    id: 'campus-4',
    name: 'Graduate Honors',
    category: 'campus',
    url: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Dean’s Honor Roll • Academic Conclave'
  },

  // Abstract & Collegiate Insignias
  {
    id: 'abstract-1',
    name: 'Cyber Sentinel',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Algorithmic Mesh • Neural Spectrum'
  },
  {
    id: 'abstract-2',
    name: 'Quantum Prism',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Geometric Waves • Indigo Glow'
  },
  {
    id: 'abstract-3',
    name: 'Cosmic Core',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'Computational Topography'
  },
  {
    id: 'abstract-4',
    name: 'Synapse Pulse',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=400&h=400&q=80',
    description: 'High-Density Silicon Blueprint'
  }
];

export const DEFAULT_AVATAR = AVATAR_GALLERY[0].url;
