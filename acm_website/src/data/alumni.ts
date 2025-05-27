import miseokImage from '../assets/alumni/miseok kim.jpg';
import juliaImage from '../assets/alumni/julia bian.jpeg';
import nishImage from '../assets/alumni/nish.jpeg';
import chaseImage from '../assets/alumni/chase feng.jpeg';

interface PersonData {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  imagePath?: string | undefined;
}

export const alumniData: PersonData[] = [
  {
    name: "Miseok Kim",
    role: "2025",
    bio: "Google",
    linkedin: "https://www.linkedin.com/in/miseok-k-aa4202195/",
    imagePath: miseokImage
  },
  {
    name: "Julia Bian",
    role: "2024",
    bio: "Meta",
    linkedin: "https://www.linkedin.com/in/juliabian/",
    imagePath: juliaImage
  },
  {
    name: "Nish Paruchuri",
    role: "2024",
    bio: "MS @ Stanford",
    linkedin: "https://www.linkedin.com/in/nishikarp/",
    imagePath: nishImage
  },
  {
    name: "Chase Feng",
    role: "2025",
    bio: "IMC Trading",
    linkedin: "https://www.linkedin.com/in/chasejhu/",
    imagePath: chaseImage
  }
];
