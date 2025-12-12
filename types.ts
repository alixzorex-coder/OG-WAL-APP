export interface Wallpaper {
  id: string;
  url: string;
  title: string;
  category: string;
  isPremium: boolean;
  is3D: boolean;
  likes: number;
  tags: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  recommended?: boolean;
}

export interface UserProfile {
  isPremium: boolean;
  premiumExpiry: number | null; // Timestamp
  favorites: string[]; // Wallpaper IDs
  credits: number;
}

export enum PaymentMethod {
  JAZZCASH = 'JazzCash',
  EASYPAISA = 'Easypaisa'
}

export enum VerificationStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED'
}

export interface PaymentVerificationResult {
  success: boolean;
  amount?: number;
  method?: string;
  message: string;
}
