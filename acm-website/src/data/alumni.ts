export interface Person {
  name: string;
  year: string;
  company: string;
  linkedin: string;
  imagePath: string;
}

export const alumniData: Person[] = [
  {
    name: "Miseok Kim",
    year: "2025",
    company: "Google",
    linkedin: "https://www.linkedin.com/in/miseok-k-aa4202195/",
    imagePath: "placeholder-alumni.svg"
  },
  {
    name: "Julia Bian",
    year: "2024",
    company: "Meta",
    linkedin: "https://www.linkedin.com/in/juliabian/",
    imagePath: "placeholder-alumni.svg"
  },
  { 
    name: "Nish Paruchuri",
    year: "2024",
    company: "MS @ Stanford",
    linkedin: "https://www.linkedin.com/in/nishikarp/",
    imagePath: "placeholder-alumni.svg"
  },
  {
    name: "Chase Feng",
    year: "2025",
    company: "IMC Trading",
    linkedin: "https://www.linkedin.com/in/chasejhu/",
    imagePath: "placeholder-alumni.svg"
  }
];
