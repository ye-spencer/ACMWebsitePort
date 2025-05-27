interface ContributorData {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  imagePath?: string;
}

export const contributorsData: ContributorData[] = [
  {
    name: "Alan Li",
    role: "About Us",
    bio: "2026",
    linkedin: "https://www.linkedin.com/in/alanli6/",
    imagePath: "/images/contributors/john.jpg"
  },
  {
    name: "Jane Smith",
    role: "UI/UX Designer",
    bio: "Created the visual design and user experience.",
    linkedin: "https://www.linkedin.com/in/jhu-acm-design",
    imagePath: "/images/contributors/jane.jpg"
  },
  {
    name: "Alex Johnson",
    role: "Backend Developer",
    bio: "Built the server infrastructure and APIs.",
    linkedin: "https://www.linkedin.com/in/jhu-acm-backend",
    imagePath: "/images/contributors/alex.jpg"
  },
  {
    name: "Sam Wilson",
    role: "Content Manager",
    bio: "Developed and organized website content.",
    linkedin: "https://www.linkedin.com/in/jhu-acm-content",
    imagePath: "/images/contributors/sam.jpg"
  }
];
