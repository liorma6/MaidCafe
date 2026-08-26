export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  active: boolean;
  pinned: boolean;
  category: string;
  sortOrder: number;
}

export interface EventAlbum {
  id: string;
  title: string;
  date: string;
  endDate?: string | null;
  description?: string;
  coverImage: string;
  images: string[];
  videos: string[];
}

export interface MerchItem {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  available: boolean;
  sortOrder: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  catchphrase: string;
  image: string;
  chibiImage: string;
}

export interface Partnership {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
}

export interface AboutInfoItem {
  label: string;
  value: string;
}

export interface AboutInfoSection {
  title: string;
  items: AboutInfoItem[];
}

export interface AboutPage {
  id: string;
  title: string;
  content: string;
  image: string;
  infoSections: AboutInfoSection[];
  updatedAt: string;
}

export interface AdminContent {
  announcements: Announcement[];
  events: EventAlbum[];
  merch: MerchItem[];
  team: TeamMember[];
  partnerships: Partnership[];
  about: AboutPage;
  faq: FaqItem[];
}
