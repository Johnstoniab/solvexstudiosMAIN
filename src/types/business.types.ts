// Core business service type
export interface BusinessService {
  title: string;
  summary: string;
  imageUrl: string;
  titleColor: string;
  details: {
    description: string;
    subServices: string[];
    outcome: string;
  };
}

// Equipment rental type
export interface RentalEquipment {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  images: string[];
  features: string[];
  videoUrl: string;
}

// Team member type
export interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  bio: string;
  fullBio?: string;
  linkedinUrl?: string;
  email?: string;
}