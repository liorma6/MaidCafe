export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  active: boolean;
}

export interface EventAlbum {
  id: string;
  title: string;
  date: string;
  description?: string;
  images: string[];
}

export interface MerchItem {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  available: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  catchphrase: string;
  image: string;
}

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  age: string;
  experience: string;
  message: string;
  createdAt: string;
}

export interface SiteContent {
  announcements: Announcement[];
  events: EventAlbum[];
  merch: MerchItem[];
  team: TeamMember[];
  applications: JobApplication[];
}
