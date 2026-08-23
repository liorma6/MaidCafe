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
  coverImage: string;
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
  chibiImage: string;
}

export interface AdminContent {
  announcements: Announcement[];
  events: EventAlbum[];
  merch: MerchItem[];
  team: TeamMember[];
}
