
export enum BadgeTier {
  OWNER = 'OWNER',
  INSPECTOR = 'INSPECTOR',
  RANK = 'RANK',
  PERK = 'PERK'
}

export interface Badge {
  id: string;
  name: string;
  icon: string; // URL or FontAwesome class
  tier: BadgeTier;
  color: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  pronouns: string;
  avatar: string;
  banner: string;
  profileBackground?: string; // Estilo Amino
  nameColor: string;
  accentColor: string;
  badges: string[]; // IDs of badges
  primaryBadgeId: string | null;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  image?: string;
  category?: 'Minimalista' | 'Anime' | 'Paisagem';
  type: 'quote' | 'thought' | 'vent' | 'wallpaper';
  timestamp: number;
  likes: number;
  comments: Comment[];
  isVerified?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
}
