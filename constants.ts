import { Plan, Wallpaper } from './types';

export const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/Gc68uxN9axHB4y1T2usxCu";
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

// Generating some mock wallpapers
export const MOCK_WALLPAPERS: Wallpaper[] = [
  {
    id: '1',
    url: 'https://picsum.photos/400/800?random=1',
    title: 'Neon City',
    category: 'Abstract',
    isPremium: false,
    is3D: false,
    likes: 1240,
    tags: ['neon', 'city', 'night']
  },
  {
    id: '2',
    url: 'https://picsum.photos/400/800?random=2',
    title: 'Misty Mountains',
    category: 'Nature',
    isPremium: true,
    is3D: false,
    likes: 3500,
    tags: ['mountain', 'fog', 'nature']
  },
  {
    id: '3',
    url: 'https://picsum.photos/400/800?random=3',
    title: 'Cyber Samurai',
    category: 'Anime',
    isPremium: true,
    is3D: true,
    likes: 8900,
    tags: ['anime', 'cyberpunk', 'sword']
  },
  {
    id: '4',
    url: 'https://picsum.photos/400/800?random=4',
    title: 'Deep Ocean',
    category: 'Nature',
    isPremium: false,
    is3D: false,
    likes: 450,
    tags: ['water', 'blue', 'ocean']
  },
  {
    id: '5',
    url: 'https://picsum.photos/400/800?random=5',
    title: 'Minimal Curves',
    category: 'Minimal',
    isPremium: true,
    is3D: false,
    likes: 2100,
    tags: ['abstract', 'minimal', 'white']
  },
  {
    id: '6',
    url: 'https://picsum.photos/400/800?random=6',
    title: 'Space Voyager',
    category: 'Trending',
    isPremium: true,
    is3D: true,
    likes: 5600,
    tags: ['space', 'stars', 'planet']
  },
  {
    id: '7',
    url: 'https://picsum.photos/400/800?random=7',
    title: 'Golden Dunes',
    category: 'Nature',
    isPremium: false,
    is3D: false,
    likes: 120,
    tags: ['sand', 'desert', 'gold']
  },
  {
    id: '8',
    url: 'https://picsum.photos/400/800?random=8',
    title: 'Red Sports Car',
    category: 'Cars',
    isPremium: true,
    is3D: false,
    likes: 9999,
    tags: ['car', 'red', 'speed']
  }
];
