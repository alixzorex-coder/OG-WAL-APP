import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  Image as ImageIcon
} from 'lucide-react';
import { MOCK_WALLPAPERS, PLANS, WALLPAPER_CATEGORIES, WHATSAPP_GROUP_LINK } from './constants';
import { PaymentModal } from './components/PaymentModal';
import { Plan, Wallpaper } from './types';

// -- Helper Components --

interface NavItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center gap-1 ${active ? 'text-yellow-400' : 'text-slate-500'}`}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </Link>
);

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isPremiumUser: boolean;
  onClick: () => void;
}

const WallpaperCard: React.FC<WallpaperCardProps> = ({ wallpaper, isPremiumUser, onClick }) => (
  <div onClick={onClick} className="relative aspect-[9/16] rounded-xl overflow-hidden cursor-pointer group mb-4 break-inside-avoid">
    <img src={wallpaper.url} alt={wallpaper.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
      <h3 className="font-bold text-white text-sm">{wallpaper.title}</h3>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-300">{wallpaper.category}</span>
        <button className="p-1.5 bg-white/20 backdrop-blur-md rounded-full">
          <Heart size={14} className="text-white" />
        </button>
      </div>
    </div>
    {wallpaper.isPremium && !isPremiumUser && (
      <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
        <Crown size={10} /> PRO
      </div>
    )}
    {wallpaper.is3D && (
      <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
        <Zap size={10} /> 3D
      </div>
    )}
  </div>
);

// -- Page Components --

const HomePage = ({ onOpenWallpaper }: { onOpenWallpaper: (w: Wallpaper) => void }) => {
  const [activeCat, setActiveCat] = useState('Trending');

  const filteredWallpapers = activeCat === 'Trending' 
    ? MOCK_WALLPAPERS 
    : MOCK_WALLPAPERS.filter(w => w.category === activeCat || w.tags.includes(activeCat.toLowerCase()));

  return (
    <div className="pb-24 pt-4">
      {/* Daily Gift Banner */}
      <div className="mx-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-500/30 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <h2 className="font-bold text-lg text-white flex items-center gap-2"><Gift className="text-yellow-400" /> Daily Surprise</h2>
                <p className="text-xs text-purple-200">Tap to unlock your free premium wallpaper!</p>
            </div>
            <button className="bg-white text-purple-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-transform">
                Open
            </button>
        </div>
        <div className="absolute -right-4 -bottom-4 text-purple-800/50 opacity-50">
            <Gift size={100} />
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 px-4 mb-6">
        {WALLPAPER_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeCat === cat 
                ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                : 'glass-panel text-gray-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-2 md:columns-4 gap-4 px-4 space-y-4">
        {filteredWallpapers.map(w => (
          <WallpaperCard key={w.id} wallpaper={w} isPremiumUser={false} onClick={() => onOpenWallpaper(w)} />
        ))}
      </div>
    </div>
  );
};

const PremiumPage = ({ onBuyPlan }: { onBuyPlan: (p: Plan) => void }) => (
  <div className="pt-20 pb-24 px-4 text-center">
    <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600 mb-2">OGWALL PREMIUM</h1>
    <p className="text-gray-400 mb-8 text-sm">Unlock full access, 3D Wallpapers & Auto-Updates.</p>

    <div className="space-y-4 max-w-md mx-auto">
      {PLANS.map(plan => (
        <div 
          key={plan.id} 
          className={`relative p-6 rounded-2xl border transition-all ${
            plan.recommended 
              ? 'bg-gradient-to-br from-yellow-900/40 to-black border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]' 
              : 'glass-panel border-white/10 hover:border-white/30'
          }`}
        >
            {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                </div>
            )}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">{plan.name}</h3>
            <div className="text-right">
              <span className="text-2xl font-bold text-yellow-400">₨ {plan.price}</span>
              <p className="text-[10px] text-gray-500 uppercase">{plan.duration}</p>
            </div>
          </div>
          <ul className="text-left space-y-2 mb-6">
            {plan.features.map((f, i) => (
              <li key={i} className="text-xs text-gray-300 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> {f}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onBuyPlan(plan)}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-transform active:scale-95 ${
                plan.recommended 
                ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Choose Plan
          </button>
        </div>
      ))}
    </div>
  </div>
);

// -- Main App --

const App = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Note: useLocation removed from here as it must be used within Router

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    setSelectedPlan(null);
    // Ideally save to localStorage
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
            />
        </HashRouter>
    </div>
  );
};

// Separated to use useLocation hook
const AppContent = ({ 
    isPremium, setIsPremium, 
    selectedWallpaper, setSelectedWallpaper,
    selectedPlan, setSelectedPlan,
    handlePaymentSuccess,
    mobileMenuOpen, setMobileMenuOpen
}: any) => {
    const location = useLocation();

    return (
      <>
        {/* Top Header */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={() => setMobileMenuOpen(true)}>
                    <Menu className="text-white" />
                </button>
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-wider">OGWALL</span>
                    <span className="text-[9px] text-gray-500 tracking-[0.2em] -mt-1">OG STUDIO</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-gray-800 rounded-full px-2 py-1 flex items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-400">HD</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                <Bell size={20} className="text-gray-400" />
            </div>
        </header>

        {/* Side Drawer */}
        {mobileMenuOpen && (
            <div className="fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black/80" onClick={() => setMobileMenuOpen(false)} />
                <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-white/10 p-6 flex flex-col animate-in slide-in-from-left duration-200">
                    <div className="mb-8">
                         <h2 className="text-2xl font-bold">Menu</h2>
                    </div>
                    <nav className="space-y-6 flex-1">
                         <Link to="/premium" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-yellow-400 font-bold">
                            <Crown size={20} /> Get Premium
                         </Link>
                         <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-green-400 font-bold">
                            <MessageCircle size={20} /> Join WhatsApp
                         </a>
                         <div className="h-px bg-white/10 my-2" />
                         <div className="flex items-center gap-3 text-gray-400"><Settings size={20} /> Settings</div>
                         <div className="flex items-center gap-3 text-gray-400"><Share2 size={20} /> Share App</div>
                         <div className="flex items-center gap-3 text-gray-400"><Phone size={20} /> Support</div>
                    </nav>
                    <div className="text-xs text-gray-600">
                        v1.1.0 • Built by OG STUDIO
                    </div>
                </div>
            </div>
        )}

        {/* Main Content Area */}
        <main className="min-h-screen pt-16 bg-black">
            <Routes>
                <Route path="/" element={<HomePage onOpenWallpaper={setSelectedWallpaper} />} />
                <Route path="/search" element={
                    <div className="p-4 pt-20">
                        <div className="relative mb-6">
                             <input type="text" placeholder="Search wallpapers..." className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-10 text-white focus:outline-none focus:border-yellow-500 transition-colors" />
                             <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Trending Tags</p>
                        <div className="flex flex-wrap gap-2">
                             {['Dark', 'Amoled', 'Cars', '4K', 'Girl', 'Nature', 'Cyberpunk'].map(tag => (
                                 <span key={tag} className="px-3 py-1 bg-slate-800 rounded-full text-xs text-gray-300">#{tag}</span>
                             ))}
                        </div>
                    </div>
                } />
                <Route path="/premium" element={<PremiumPage onBuyPlan={setSelectedPlan} />} />
                <Route path="/favorites" element={
                    <div className="p-4 pt-20 text-center">
                        <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-lg font-bold text-gray-400">No Favorites Yet</h2>
                        <p className="text-xs text-gray-600 mt-2">Start liking wallpapers to see them here.</p>
                    </div>
                } />
                <Route path="/profile" element={
                    <div className="p-4 pt-20">
                        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-black">
                                U
                            </div>
                            <div>
                                <h2 className="font-bold text-lg">User Guest</h2>
                                <p className="text-xs text-gray-400">{isPremium ? 'Premium Member' : 'Free Account'}</p>
                            </div>
                        </div>
                        {!isPremium && (
                            <div onClick={() => setSelectedPlan(PLANS[1])} className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-4 rounded-xl mb-4 flex items-center justify-between cursor-pointer">
                                <div>
                                    <h3 className="font-bold text-sm">Upgrade to Pro</h3>
                                    <p className="text-[10px] opacity-80">Remove ads & unlock 4K</p>
                                </div>
                                <Crown className="text-yellow-200" />
                            </div>
                        )}
                    </div>
                } />
            </Routes>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/5 pb-safe h-20 flex items-center justify-around z-40 px-2">
            <NavItem to="/" icon={ImageIcon} label="Home" active={location.pathname === '/'} />
            <NavItem to="/search" icon={Search} label="Search" active={location.pathname === '/search'} />
            <div className="relative -top-5">
                <Link to="/premium" className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)] border-4 border-black">
                    <Crown className="text-black fill-black" size={24} />
                </Link>
            </div>
            <NavItem to="/favorites" icon={Heart} label="Saved" active={location.pathname === '/favorites'} />
            <NavItem to="/profile" icon={User} label="Profile" active={location.pathname === '/profile'} />
        </nav>

        {/* Wallpaper Detail Modal */}
        {selectedWallpaper && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in slide-in-from-bottom duration-300">
                <div className="relative flex-1">
                    <img src={selectedWallpaper.url} alt="full" className="w-full h-full object-cover" />
                    <button onClick={() => setSelectedWallpaper(null)} className="absolute top-10 left-4 p-2 bg-black/30 rounded-full backdrop-blur-md">
                        <XCircle className="text-white" />
                    </button>
                    <div className="absolute top-10 right-4 p-2 bg-black/30 rounded-full backdrop-blur-md">
                         <span className="text-xs font-bold text-white px-2">HD</span>
                    </div>
                </div>
                <div className="bg-slate-900 p-6 rounded-t-3xl -mt-6 relative z-10 border-t border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-xl font-bold">{selectedWallpaper.title}</h2>
                            <p className="text-sm text-gray-400">By OG Studio</p>
                        </div>
                        <button className="p-2 bg-slate-800 rounded-full text-red-500">
                            <Heart className="fill-current" />
                        </button>
                    </div>
                    {selectedWallpaper.isPremium && !isPremium ? (
                         <button 
                            onClick={() => { setSelectedWallpaper(null); setSelectedPlan(PLANS[0]); }}
                            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl font-bold text-black flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
                         >
                            <Crown size={20} /> Unlock Premium to Download
                         </button>
                    ) : (
                         <button className="w-full py-4 bg-white rounded-xl font-bold text-black flex items-center justify-center gap-2">
                            <Download size={20} /> Download Wallpaper
                         </button>
                    )}
                </div>
            </div>
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

// Helper Icon for close button in wallpaper modal
const XCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
);

export default App;