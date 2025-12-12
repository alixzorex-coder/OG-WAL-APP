import { Plan, Wallpaper } from './types';

export const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/Gc68uxN9axHB4y1T2usxCu";
export const YOUTUBE_CHANNEL_LINK = "https://www.youtube.com/@AiCartoon-LAND";
export const SUPPORT_PHONE_JAZZCASH = "0326 4098088";
export const SUPPORT_NAME_JAZZCASH = "Zeeshan Ali";
export const SUPPORT_PHONE_EASYPAISA = "0303 0997911";
export const SUPPORT_NAME_EASYPAISA = "Muhammad Ilyas";

export const WALLPAPER_CATEGORIES = [
  "Trending", "New", "3D Live", "Nature", "Anime", "Minimal", "Abstract", "Dark", "Cars"
];

export const PLANS: Plan[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    price: 120,
    duration: '1 Week',
    features: ['Unlimited Downloads', 'No Ads', 'Access 3D Walls']
  },
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 350,
    duration: '1 Month',
    features: ['All Premium Content', 'Priority Support', 'High Res 4K'],
    recommended: true
  },
  {
    id: 'yearly',
    name: 'Yearly Elite',
    price: 2500,
    duration: '1 Year',
    features: ['Best Value', 'Exclusive Drops', 'Request Wallpapers']
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 5500,
    duration: 'Forever',
    features: ['One-time Payment', 'VIP Badge', 'Founder Status']
  }
];

// We will generate wallpapers dynamically in App.tsx based on the date
export const MOCK_WALLPAPERS: Wallpaper[] = []; 
