import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Crown, 
  Heart, 
  User, 
  Menu, 
  Bell, 
  Download, 
  Share2, 
  Settings, 
  Zap,
  Gift,
  Phone,
  MessageCircle,
  Image as ImageIcon,
  ArrowLeft,
  Minimize2,
  Eye,
  Check,
  Youtube,
  Edit2,
  Trash2,
  Smartphone,
  Info
} from 'lucide-react';
import { PLANS, WALLPAPER_CATEGORIES, WHATSAPP_GROUP_LINK, YOUTUBE_CHANNEL_LINK } from './constants';
import { PaymentModal } from './components/PaymentModal';
import { Plan, Wallpaper, UserProfile } from './types';

// -- Helper Functions --

// Generate a large set of wallpapers (100+ per category)
const generateDailyWallpapers = (): Wallpaper[] => {
    const contentCategories = ["Nature", "Anime", "Minimal", "Abstract", "Dark", "Cars", "3D Live"];
    let allWallpapers: Wallpaper[] = [];
    let idCounter = 1;

    // Helper to get random item from array
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    contentCategories.forEach(cat => {
        // User requested 100+ per category. 
        // We generate 105 to be safe and ensure abundance.
        const count = 105; 
        
        for (let i = 0; i < count; i++) {
            const isPremium = i % 5 === 0; // 20% Premium
            const is3D = cat === "3D Live" || (i % 7 === 0);
            
            // Using different seed strategies to ensure variety
            // We append the category to the seed to try and keep it consistent per run
            const seed = `${cat.toLowerCase().replace(/\s/g,'')}-${i}-${idCounter}`;
            
            // Using a mix of keywords for titles to make them sound real
            const adjectives = ["Mystic", "Golden", "Dark", "Neon", "Cyber", "Silent", "Wild", "Epic", "Lost", "Future", "Retro", "Urban", "Crystal"];
            const nouns = ["Horizon", "Dreams", "World", "Vision", "Soul", "Vibes", "Forest", "City", "Light", "Shadow", "Galaxy", "Ocean", "Storm"];
            
            const title = `${getRandom(adjectives)} ${getRandom(nouns)} ${idCounter}`;
            
            allWallpapers.push({
                id: `wp-${idCounter}`,
                // utilizing fast picsum with deterministic seed
                url: `https://picsum.photos/seed/${seed}/540/960`, // Using 540x960 for better performance in grid
                title: title,
                category: cat,
                isPremium,
                is3D,
                likes: Math.floor(Math.random() * 500) + 50,
                tags: [cat.toLowerCase(), '4k', 'wallpaper', getRandom(['popular', 'new', 'trending'])]
            });
            idCounter++;
        }
    });

    // Shuffle array for "Trending" view so it's not just one category
    return allWallpapers.sort(() => Math.random() - 0.5);
};

// -- Helper Components --

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 transition-colors duration-300 ${active ? 'text-yellow-400' : 'text-slate-600'}`}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </Link>
);

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isPremiumUser: boolean;
  onClick: () => void;
}

// Optimized Card with better loading state
const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper, isPremiumUser, onClick }) => (
  <div onClick={onClick} className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group mb-4 break-inside-avoid shadow-lg hover:shadow-yellow-500/10 transition-shadow bg-slate-900">
    <div className="absolute inset-0 bg-slate-800 animate-pulse" />
    <img 
      src={wallpaper.url} 
      alt={wallpaper.title} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0 onload-opacity" 
      loading="lazy" 
      onLoad={(e) => (e.target as HTMLImageElement).classList.remove('opacity-0')}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
      <h3 className="font-bold text-white text-sm line-clamp-1">{wallpaper.title}</h3>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-gray-300">{wallpaper.category}</span>
        <div className="flex items-center gap-1 text-[10px] text-gray-300">
            <Heart size={10} className="fill-white text-white" /> {wallpaper.likes}
        </div>
      </div>
    </div>
    {wallpaper.isPremium && !isPremiumUser && (
      <div className="absolute top-2 right-2 bg-yellow-500/90 backdrop-blur-sm text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
        <Crown size={10} /> PRO
      </div>
    )}
    {wallpaper.is3D && (
      <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
        <Zap size={10} /> 3D
      </div>
    )}
  </div>
);

// -- Page Components --

const HomePage = ({ onOpenWallpaper, wallpapers }: { onOpenWallpaper: (w: Wallpaper) => void, wallpapers: Wallpaper[] }) => {
  const [activeCat, setActiveCat] = useState('Trending');

  // Optimization: Limit the number of items displayed initially to prevent lag
  // "Trending" shows a mix, Category shows specific.
  const displayWallpapers = useMemo(() => {
      let filtered: Wallpaper[] = [];
      if (activeCat === 'Trending') {
          // Show top 100 mixed
          filtered = wallpapers.slice(0, 100);
      } else if (activeCat === 'New') {
           // Simulate new by taking a slice from the middle
           filtered = wallpapers.slice(100, 200);
      } else {
          filtered = wallpapers.filter(w => w.category === activeCat);
      }
      return filtered;
  }, [activeCat, wallpapers]);

  return (
    <div className="pb-24 pt-4 animate-in fade-in duration-500">
      {/* Daily Gift Banner */}
      <div className="mx-4 mb-6 p-1 rounded-2xl bg-gradient-to-r from-yellow-500 to-purple-600 shadow-lg shadow-purple-900/20">
        <div className="bg-black/90 rounded-xl p-4 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-lg text-white flex items-center gap-2"><Gift className="text-yellow-400 fill-yellow-400 animate-bounce" /> Daily Surprise</h2>
                    <p className="text-xs text-gray-400">New wallpapers added daily!</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform">
                    Check Now
                </button>
            </div>
            <div className="absolute -right-6 -bottom-6 text-purple-600/20 rotate-12">
                <Gift size={120} />
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 mb-6 mask-linear-fade">
        {WALLPAPER_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 ${
              activeCat === cat 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] transform scale-105' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-2 md:columns-4 gap-4 px-4 space-y-4">
        {displayWallpapers.map(w => (
          <WallpaperCard key={w.id} wallpaper={w} isPremiumUser={false} onClick={() => onOpenWallpaper(w)} />
        ))}
      </div>
      
      {displayWallpapers.length === 0 && (
          <div className="text-center py-20 text-gray-500">
              <p>No wallpapers found for this category.</p>
          </div>
      )}

      <div className="text-center mt-8 text-xs text-gray-600 pb-4">
        Showing {displayWallpapers.length} Wallpapers
      </div>
    </div>
  );
};

const SettingsPage = () => {
    return (
        <div className="pt-20 pb-24 px-4 animate-in fade-in">
            <h1 className="text-3xl font-black italic mb-6">Settings</h1>
            
            <div className="space-y-6">
                <section>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">App Preferences</h3>
                    <div className="bg-slate-900 rounded-2xl overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <span>Dark Mode</span>
                            <div className="w-10 h-6 bg-yellow-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <span>Push Notifications</span>
                            <div className="w-10 h-6 bg-yellow-500 rounded-full relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            <span>Clear Cache</span>
                            <button onClick={() => alert('Cache Cleared!')} className="text-xs bg-white/10 px-3 py-1 rounded-full">Clear</button>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Community</h3>
                    <div className="bg-slate-900 rounded-2xl overflow-hidden">
                        <a href={YOUTUBE_CHANNEL_LINK} target="_blank" rel="noreferrer" className="p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                                    <Youtube size={16} fill="white" />
                                </div>
                                <span>AiCartoon LAND</span>
                            </div>
                            <ArrowLeft size={16} className="rotate-180 text-gray-500" />
                        </a>
                        <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer" className="p-4 flex justify-between items-center hover:bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                                    <MessageCircle size={16} fill="white" />
                                </div>
                                <span>Join WhatsApp Group</span>
                            </div>
                            <ArrowLeft size={16} className="rotate-180 text-gray-500" />
                        </a>
                    </div>
                </section>

                <section>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">About</h3>
                    <div className="bg-slate-900 rounded-2xl overflow-hidden p-4 text-center">
                        <p className="font-bold text-lg mb-1">OGWALL</p>
                        <p className="text-gray-500 text-sm mb-4">Version 1.2.0</p>
                        <p className="text-xs text-gray-600">Created by OG STUDIO / ALI RAZA</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

// -- Wallpaper Detail View (Updated with Download & Apply Logic) --

interface DetailViewProps {
    wallpaper: Wallpaper;
    isPremiumUser: boolean;
    onClose: () => void;
    onUnlock: () => void;
}

const WallpaperDetailView: React.FC<DetailViewProps> = ({ wallpaper, isPremiumUser, onClose, onUnlock }) => {
    const [hideUI, setHideUI] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const handleDownload = async (action: 'save' | 'apply') => {
        setDownloading(true);
        setStatusMsg(action === 'save' ? "Downloading..." : "Preparing...");

        try {
            // Use high-res URL for download (replacing 540/960 with 1080/1920)
            const highResUrl = wallpaper.url.replace('540/960', '1080/1920');
            const response = await fetch(highResUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            // Create a temporary link to force download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `OGWALL_${wallpaper.title.replace(/\s+/g, '_')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);

            setDownloading(false);
            
            if (action === 'save') {
                setStatusMsg("Saved to Gallery! ✅");
            } else {
                setStatusMsg("Image Saved! Open Gallery to Set as Wallpaper 📱");
                alert("For security reasons, browsers cannot directly change your home screen.\n\nThe image has been saved to your Gallery.\nPlease open your Gallery and set it as wallpaper from there.");
            }

            setTimeout(() => setStatusMsg(""), 3000);

        } catch (error) {
            console.error(error);
            setDownloading(false);
            setStatusMsg("Download Failed ❌");
        }
    };

    const toggleUI = () => setHideUI(!hideUI);
    const isLocked = wallpaper.isPremium && !isPremiumUser;

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Full Screen Image */}
            <div className="absolute inset-0 z-0" onClick={toggleUI}>
                <img src={wallpaper.url.replace('540/960', '1080/1920')} alt="full" className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 transition-opacity duration-500 ${hideUI ? 'opacity-0' : 'opacity-100'}`} />
            </div>

            {/* Top Bar */}
            <div className={`relative z-10 flex justify-between items-center p-4 pt-safe transition-transform duration-500 ${hideUI ? '-translate-y-24' : 'translate-y-0'}`}>
                <button onClick={onClose} className="p-3 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 text-white hover:bg-black/40 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div className="flex gap-3">
                     <button onClick={toggleUI} className="p-3 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 text-white hover:bg-black/40 transition-colors">
                        {hideUI ? <Minimize2 size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>

            {/* Bottom Content Info */}
            <div className={`mt-auto relative z-10 p-6 pb-10 transition-transform duration-500 ${hideUI ? 'translate-y-full' : 'translate-y-0'}`}>
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        {wallpaper.isPremium && <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1"><Crown size={10} /> PREMIUM</span>}
                        {wallpaper.is3D && <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1"><Zap size={10} /> 3D LIVE</span>}
                        <span className="bg-white/10 text-white text-[10px] font-medium px-2 py-0.5 rounded-sm">4K UHD</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-1 shadow-black drop-shadow-lg">{wallpaper.title}</h2>
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                        By OG Studio <span className="w-1 h-1 bg-gray-500 rounded-full"/> {wallpaper.likes} Likes
                    </p>
                </div>

                {/* Status Message Toast */}
                {statusMsg && (
                    <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-xl text-green-200 text-center text-sm font-bold animate-pulse">
                        {statusMsg}
                    </div>
                )}

                {/* Action Buttons */}
                {isLocked ? (
                    <div className="space-y-3">
                        <button 
                            onClick={onUnlock}
                            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl font-bold text-black flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(234,179,8,0.3)] animate-pulse hover:scale-[1.02] transition-transform"
                        >
                            <Crown size={20} className="fill-black" /> Unlock for ₨ 120 (Weekly)
                        </button>
                        <p className="text-center text-[10px] text-gray-400">Includes access to all premium wallpapers</p>
                    </div>
                ) : (
                    <div className="flex gap-3">
                        <button 
                            onClick={() => handleDownload('save')}
                            disabled={downloading}
                            className="flex-1 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl font-bold text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                        >
                             <Download size={20} /> Save
                        </button>
                        <button 
                            onClick={() => handleDownload('apply')}
                            disabled={downloading}
                            className="flex-1 py-4 bg-white rounded-2xl font-bold text-black flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                        >
                            <Smartphone size={20} /> Apply
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// -- Profile Page --

const ProfilePage = ({ isPremium, setIsPremium }: { isPremium: boolean, setIsPremium: any }) => {
    const [user, setUser] = useState<UserProfile>({
        name: "Guest User",
        bio: "Wallpaper Enthusiast",
        isPremium: isPremium,
        premiumExpiry: null,
        favorites: [],
        credits: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('ogwall_user');
        if (saved) {
            setUser({...JSON.parse(saved), isPremium}); // Keep isPremium synced with App state
        }
    }, [isPremium]);

    const handleEdit = () => {
        setEditName(user.name);
        setEditBio(user.bio);
        setIsEditing(true);
    };

    const handleSave = () => {
        const newUser = { ...user, name: editName, bio: editBio };
        setUser(newUser);
        localStorage.setItem('ogwall_user', JSON.stringify(newUser));
        setIsEditing(false);
    };

    return (
        <div className="p-4 pt-24 animate-in fade-in">
            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 p-6 rounded-3xl mb-8 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-3xl font-bold text-black border-4 border-black shadow-lg">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-lg px-2 py-1 text-white" />
                                <input value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full bg-black/40 border border-white/20 rounded-lg px-2 py-1 text-white text-xs" />
                            </div>
                        ) : (
                            <>
                                <h2 className="font-bold text-xl text-white">{user.name}</h2>
                                <p className="text-sm text-gray-400 mb-1">{user.bio}</p>
                                <p className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                                    {isPremium ? <><Crown size={12}/> Premium Member</> : 'Free Account'}
                                </p>
                            </>
                        )}
                    </div>
                    <button onClick={isEditing ? handleSave : handleEdit} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                        {isEditing ? <Check size={18} className="text-green-400" /> : <Edit2 size={18} />}
                    </button>
                </div>
            </div>
            
            {!isPremium && (
                <Link to="/premium" className="block">
                    <div className="bg-gradient-to-r from-yellow-600 to-orange-700 p-6 rounded-3xl mb-8 flex items-center justify-between cursor-pointer shadow-lg shadow-orange-900/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-black text-lg text-white mb-1">Upgrade to Pro</h3>
                            <p className="text-xs text-orange-100 opacity-90">Remove ads, unlock 4K & Support OG Studio</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                                <Crown className="text-white fill-white" size={20} />
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                            <Crown size={150} />
                        </div>
                    </div>
                </Link>
            )}

            <div className="space-y-2">
                    <Link to="/settings" className="p-4 bg-slate-900/50 rounded-2xl flex items-center justify-between text-gray-300 hover:bg-slate-900">
                    <span>Settings</span>
                    <ArrowLeft className="rotate-180 w-4 h-4" />
                    </Link>
                    <a href={YOUTUBE_CHANNEL_LINK} target="_blank" rel="noreferrer" className="p-4 bg-slate-900/50 rounded-2xl flex items-center justify-between text-gray-300 hover:bg-slate-900">
                    <span className="flex items-center gap-2"><Youtube size={16} className="text-red-500" /> YouTube Channel</span>
                    <ArrowLeft className="rotate-180 w-4 h-4" />
                    </a>
                    <div className="p-4 bg-slate-900/50 rounded-2xl flex items-center justify-between text-gray-300">
                    <span>Help & Support</span>
                    <ArrowLeft className="rotate-180 w-4 h-4" />
                    </div>
            </div>
        </div>
    );
};

// -- Main App --

const App = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);

  // Initialize Daily Wallpapers on Mount
  useEffect(() => {
      setWallpapers(generateDailyWallpapers());
  }, []);

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    setSelectedPlan(null); 
  };

  const handleUnlockClick = () => {
      setSelectedPlan(PLANS[0]);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500/30">
        <HashRouter>
            <AppContent 
                isPremium={isPremium}
                setIsPremium={setIsPremium}
                selectedWallpaper={selectedWallpaper}
                setSelectedWallpaper={setSelectedWallpaper}
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                handlePaymentSuccess={handlePaymentSuccess}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                onUnlock={handleUnlockClick}
                wallpapers={wallpapers}
            />
        </HashRouter>
    </div>
  );
};

const PremiumPage = ({ onBuyPlan }: { onBuyPlan: (p: Plan) => void }) => (
    <div className="pt-20 pb-24 px-4 text-center animate-in slide-in-from-bottom duration-500">
      <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500/10 rounded-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
          <Crown className="w-12 h-12 text-yellow-400 relative z-10" />
      </div>
      <h1 className="text-4xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 mb-2 uppercase tracking-tight">OG Premium</h1>
      <p className="text-gray-400 mb-10 text-sm max-w-xs mx-auto">Get unlimited access to 4K, 3D & Live Wallpapers. No Ads. Cancel anytime.</p>
  
      <div className="space-y-5 max-w-md mx-auto">
        {PLANS.map(plan => (
          <div 
            key={plan.id} 
            onClick={() => onBuyPlan(plan)}
            className={`relative p-6 rounded-3xl border cursor-pointer group transition-all duration-300 overflow-hidden ${
              plan.recommended 
                ? 'bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.15)] hover:shadow-[0_0_60px_rgba(234,179,8,0.25)] scale-105 z-10' 
                : 'bg-slate-900/50 border-white/5 hover:border-white/20 hover:bg-slate-900'
            }`}
          >
              {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-4 py-1 rounded-bl-xl shadow-lg">
                      BEST VALUE
                  </div>
              )}
            <div className="flex justify-between items-center mb-4 relative z-10">
              <div className="text-left">
                  <h3 className={`font-bold text-lg ${plan.recommended ? 'text-white' : 'text-gray-300'}`}>{plan.name}</h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{plan.duration}</p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black ${plan.recommended ? 'text-yellow-400' : 'text-white'}`}>₨ {plan.price}</span>
              </div>
            </div>
            
            <div className="w-full h-px bg-white/5 mb-4"></div>
  
            <ul className="text-left space-y-2 mb-6 relative z-10">
              {plan.features.map((f, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-center gap-2 group-hover:text-gray-200 transition-colors">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${plan.recommended ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-gray-400'}`}>
                      <Check size={8} strokeWidth={4} />
                  </div> 
                  {f}
                </li>
              ))}
            </ul>
            
            <button 
              className={`w-full py-3 rounded-xl font-bold text-sm transition-transform active:scale-95 flex items-center justify-center gap-2 relative z-10 ${
                  plan.recommended 
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 group-hover:bg-yellow-400' 
                  : 'bg-white/10 text-white group-hover:bg-white/20'
              }`}
            >
              {plan.recommended && <Zap size={16} className="fill-black" />}
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );

// Separated to use useLocation hook
const AppContent = ({ 
    isPremium, setIsPremium, 
    selectedWallpaper, setSelectedWallpaper,
    selectedPlan, setSelectedPlan,
    handlePaymentSuccess,
    mobileMenuOpen, setMobileMenuOpen,
    onUnlock,
    wallpapers
}: any) => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
      <>
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                    <Menu className="text-white" />
                </button>
                <div className="flex flex-col">
                    <span className="font-black text-lg tracking-wider italic">OGWALL</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <Link to="/premium" className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full px-3 py-1 flex items-center gap-1 shadow-lg shadow-yellow-500/20">
                    <Crown size={12} className="text-black fill-black" />
                    <span className="text-[10px] font-bold text-black uppercase">Go Pro</span>
                </Link>
                <Bell size={20} className="text-white" />
            </div>
        </header>

        {/* Side Drawer */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-white/10 p-6 flex flex-col animate-in slide-in-from-left duration-200 shadow-2xl">
                    <div className="mb-10 mt-4">
                         <h2 className="text-3xl font-black italic">OGWALL</h2>
                         <p className="text-gray-500 text-xs tracking-widest uppercase">Premium Wallpapers</p>
                    </div>
                    <nav className="space-y-2 flex-1">
                         <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                            <Home size={20} /> Home
                         </Link>
                         <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors">
                            <Search size={20} /> Search
                         </Link>
                         <div className="h-px bg-white/5 my-2 mx-3" />
                         <Link to="/premium" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl bg-yellow-500/10 text-yellow-500 font-bold border border-yellow-500/20">
                            <Crown size={20} /> Get Premium
                         </Link>
                         <a href={YOUTUBE_CHANNEL_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-red-500 font-bold">
                            <Youtube size={20} /> AiCartoon LAND
                         </a>
                         <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-green-400 font-bold">
                            <MessageCircle size={20} /> Join WhatsApp
                         </a>
                         <div className="h-px bg-white/5 my-2 mx-3" />
                         <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-gray-400"><Settings size={20} /> Settings</Link>
                         <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 text-gray-400"><Phone size={20} /> Support</div>
                    </nav>
                    <div className="text-[10px] text-gray-600 text-center">
                        v1.2.0 • OG STUDIO
                    </div>
                </div>
            </div>
        )}

        {/* Main Content Area */}
        <main className="min-h-screen pt-16 bg-black">
            <Routes>
                <Route path="/" element={<HomePage onOpenWallpaper={setSelectedWallpaper} wallpapers={wallpapers} />} />
                <Route path="/search" element={
                    <div className="p-4 pt-20 animate-in fade-in">
                        <div className="relative mb-8">
                             <input type="text" placeholder="Search for 'Anime'..." className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl py-4 px-12 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all shadow-lg" />
                             <Search className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Trending Tags</p>
                        <div className="flex flex-wrap gap-3">
                             {['Dark', 'Amoled', 'Cars', '4K', 'Girl', 'Nature', 'Cyberpunk', 'Minimal', 'Neon'].map(tag => (
                                 <span key={tag} className="px-4 py-2 bg-slate-800/50 border border-white/5 rounded-full text-xs text-gray-300 hover:border-yellow-500/50 hover:text-yellow-400 transition-colors cursor-pointer">#{tag}</span>
                             ))}
                        </div>
                    </div>
                } />
                <Route path="/premium" element={<PremiumPage onBuyPlan={setSelectedPlan} />} />
                <Route path="/favorites" element={
                    <div className="p-4 pt-32 text-center animate-in fade-in">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                             <Heart className="w-8 h-8 text-gray-600" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No Favorites Yet</h2>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">Tap the heart icon on any wallpaper to save it here for offline access.</p>
                    </div>
                } />
                <Route path="/profile" element={<ProfilePage isPremium={isPremium} setIsPremium={setIsPremium} />} />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/5 pb-safe h-20 flex items-center justify-around z-40 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <NavItem to="/" icon={ImageIcon} label="Home" active={location.pathname === '/'} />
            <NavItem to="/search" icon={Search} label="Search" active={location.pathname === '/search'} />
            <div className="relative -top-6 group">
                <Link to="/premium" className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.5)] border-4 border-black transition-transform duration-300 group-hover:scale-110">
                    <Crown className="text-black fill-black" size={28} />
                </Link>
            </div>
            <NavItem to="/favorites" icon={Heart} label="Saved" active={location.pathname === '/favorites'} />
            <NavItem to="/profile" icon={User} label="Profile" active={location.pathname === '/profile'} />
        </nav>

        {/* Wallpaper Detail Modal */}
        {selectedWallpaper && (
            <WallpaperDetailView 
                wallpaper={selectedWallpaper}
                isPremiumUser={isPremium}
                onClose={() => setSelectedWallpaper(null)}
                onUnlock={onUnlock}
            />
        )}

        {/* Payment Modal */}
        {selectedPlan && (
            <PaymentModal 
                plan={selectedPlan} 
                onClose={() => setSelectedPlan(null)} 
                onSuccess={handlePaymentSuccess} 
            />
        )}
      </>
    );
};

export default App;