
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ArrowRight, ArrowLeft, Star, Tag, X, Plus, Minus, Trash2, Check, ChevronRight, Package, Truck, MapPin, Clock, Info, User, LogOut, History, CreditCard, Smartphone, Heart, Share2, Ruler, RefreshCw, MessageSquare, Copy, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---

interface Review {
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
    avatar?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[]; // Default images
  colorImages: { [key: string]: string[] }; // Maps color name to specific images
  category: 'Apparel' | 'Headwear' | 'Accessories';
  tagline: string;
  description: string;
  badge?: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  details: string[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

interface CartItem extends Product {
  cartId: string; // unique id for cart item (productId + size + color)
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered';
}

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    provider: 'google' | 'apple';
    orders: Order[];
    wishlist: string[]; // Array of Product IDs
}

type ToastType = 'success' | 'info' | 'error';

// --- DATA ---

const MOCK_REVIEWS: Review[] = [
    { id: 'r1', user: 'Alex D.', rating: 5, date: '2 days ago', comment: 'Absolutely fire quality. The embroidery is insane.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 'r2', user: 'Sarah K.', rating: 4, date: '1 week ago', comment: 'Fits slightly oversized as described. Love the material.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 'r3', user: 'Dev_007', rating: 5, date: '3 weeks ago', comment: 'My code compiles faster when I wear this. Verified.', avatar: 'https://randomuser.me/api/portraits/men/85.jpg' }
];

const PRODUCTS: Product[] = [
  {
    id: 'tee-invisible',
    name: "The 'Invisible Logic' Heavyweight Tee",
    price: 650,
    images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop"
    ],
    colorImages: {
        'Black': [
             "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
             "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
        ],
        'White': [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop&invert=1", 
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop&invert=1"
        ]
    },
    category: 'Apparel',
    tagline: "YOU CAN'T SEE MY BUGS",
    description: "100% Cotton oversized fit. Features the iconic hand-wave gesture rendered in ASCII art on the back. If the code works, don't touch it. If it doesn't, you didn't see it.",
    badge: "BEST SELLER",
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'White', hex: '#ffffff' }
    ],
    details: ["Heavyweight 240gsm Cotton", "Oversized Boxy Fit", "Gold Thread Embroidery", "Preshrunk"],
    reviews: MOCK_REVIEWS,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: 'cap-respect',
    name: "The 'Respect The Stack' Snapback",
    price: 350,
    category: 'Headwear',
    tagline: "HUSTLE / SYNTAX / RESPECT",
    images: [
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=800&auto=format&fit=crop"
    ],
    colorImages: {
        'Black': [
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=800&auto=format&fit=crop"
        ],
        'Navy': [
            "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=800&auto=format&fit=crop&hue=200", 
             "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop&hue=200"
        ]
    },
    description: "Black canvas snapback with 3D embroidered gold thread. A tribute to the three pillars of the Neo Qiss philosophy. Never give up on the compiler.",
    sizes: ['ONE SIZE'],
    colors: [
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'Navy', hex: '#0f172a' }
    ],
    details: ["5-Panel Structure", "Adjustable Snap Closure", "3D Puff Embroidery", "Flat Bill"],
    reviews: [MOCK_REVIEWS[0], MOCK_REVIEWS[2]],
    rating: 4.9,
    reviewCount: 42
  },
  {
    id: 'socks-aa',
    name: "The 'Attitude Adjustment' Socks",
    price: 150,
    category: 'Accessories',
    tagline: "WALK IT OFF",
    images: [
        "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588055443997-d84050949629?q=80&w=800&auto=format&fit=crop"
    ],
    colorImages: {
        'Black': [
             "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop",
             "https://images.unsplash.com/photo-1588055443997-d84050949629?q=80&w=800&auto=format&fit=crop"
        ],
        'White': [
             "https://images.unsplash.com/photo-1588055443997-d84050949629?q=80&w=800&auto=format&fit=crop",
             "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop"
        ]
    },
    description: "Performance crew socks for long debugging sessions. When the code slams you down, adjust your attitude and get back up. The champ is here.",
    badge: "LIMITED DROP",
    sizes: ['6-9', '9-12'],
    colors: [
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'White', hex: '#ffffff' }
    ],
    details: ["Reinforced Heel & Toe", "Moisture Wicking", "Arch Support", "Cushioned Sole"],
    reviews: [MOCK_REVIEWS[1]],
    rating: 4.5,
    reviewCount: 18
  },
  {
    id: 'hoodie-champ',
    name: "The 'Champ Is Here' Dev Hoodie",
    price: 1200,
    category: 'Apparel',
    tagline: "DEPLOY ON FRIDAY",
    images: [
        "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=800&auto=format&fit=crop"
    ],
    colorImages: {
        'Black': [
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=800&auto=format&fit=crop"
        ],
        'Charcoal': [
             "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?q=80&w=800&auto=format&fit=crop",
             "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop"
        ]
    },
    description: "A hoodie so comfortable you'll forget you're still in the office on a Friday night. Matte black hardware and hidden pockets for your secrets.",
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
        { name: 'Black', hex: '#1a1a1a' },
        { name: 'Charcoal', hex: '#334155' }
    ],
    details: ["400gsm Fleece", "Double-lined Hood", "Kangaroo Pocket", "Ribbed Cuffs"],
    reviews: MOCK_REVIEWS,
    rating: 5.0,
    reviewCount: 89
  }
];

// --- UTILS ---

const formatCurrency = (val: number) => `R${val.toLocaleString()}`;

// --- TOAST COMPONENT ---

const ToastNotification: React.FC<{ message: string; type: ToastType; isVisible: boolean; onClose: () => void }> = ({ message, type, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full px-6 max-w-sm pointer-events-none"
                >
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-lg shadow-2xl border w-full pointer-events-auto ${
                        type === 'success' ? 'bg-stone-900 text-white border-stone-800' : 
                        type === 'error' ? 'bg-red-500 text-white border-red-600' :
                        'bg-white text-stone-900 border-stone-200'
                    }`}>
                        {type === 'success' && <Check size={16} className="text-nobel-gold shrink-0" />}
                        {type === 'error' && <Info size={16} className="shrink-0" />}
                        {type === 'info' && <Info size={16} className="text-blue-500 shrink-0" />}
                        <span className="font-medium text-sm">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- SIZE GUIDE COMPONENT ---

const SizeGuideModal: React.FC<{ isOpen: boolean; onClose: () => void; category: string }> = ({ isOpen, onClose, category }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden m-4"
            >
                <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                    <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg md:text-xl">
                        <Ruler size={20} className="text-nobel-gold" />
                        Size Guide
                    </div>
                    <button onClick={onClose}><X size={20} className="text-stone-500 hover:text-stone-900" /></button>
                </div>
                <div className="p-6 overflow-x-auto custom-scrollbar">
                    <p className="text-sm text-stone-500 mb-4 leading-relaxed">
                        Measurements in centimeters. Fits true to size.
                    </p>
                    
                    {category === 'Headwear' ? (
                         <table className="w-full text-sm text-left min-w-[300px]">
                            <thead>
                                <tr className="border-b border-stone-200 text-xs font-bold uppercase tracking-widest text-stone-500">
                                    <th className="py-3 px-2">Size</th>
                                    <th className="py-3 px-2">Circumference</th>
                                    <th className="py-3 px-2">Depth</th>
                                </tr>
                            </thead>
                            <tbody className="text-stone-700 font-mono">
                                <tr className="border-b border-stone-100">
                                    <td className="py-3 px-2 font-bold">ONE SIZE</td>
                                    <td className="py-3 px-2">56 - 62 cm</td>
                                    <td className="py-3 px-2">16 cm</td>
                                </tr>
                            </tbody>
                         </table>
                    ) : (
                        <table className="w-full text-sm text-left min-w-[300px]">
                            <thead>
                                <tr className="border-b border-stone-200 text-xs font-bold uppercase tracking-widest text-stone-500">
                                    <th className="py-3 px-2">Size</th>
                                    <th className="py-3 px-2">Chest</th>
                                    <th className="py-3 px-2">Length</th>
                                    <th className="py-3 px-2">Shoulder</th>
                                </tr>
                            </thead>
                            <tbody className="text-stone-700 font-mono">
                                <tr className="border-b border-stone-100">
                                    <td className="py-3 px-2 font-bold">XS</td>
                                    <td className="py-3 px-2">98</td>
                                    <td className="py-3 px-2">68</td>
                                    <td className="py-3 px-2">44</td>
                                </tr>
                                <tr className="border-b border-stone-100">
                                    <td className="py-3 px-2 font-bold">S</td>
                                    <td className="py-3 px-2">104</td>
                                    <td className="py-3 px-2">70</td>
                                    <td className="py-3 px-2">46</td>
                                </tr>
                                <tr className="border-b border-stone-100">
                                    <td className="py-3 px-2 font-bold">M</td>
                                    <td className="py-3 px-2">110</td>
                                    <td className="py-3 px-2">72</td>
                                    <td className="py-3 px-2">48</td>
                                </tr>
                                <tr className="border-b border-stone-100">
                                    <td className="py-3 px-2 font-bold">L</td>
                                    <td className="py-3 px-2">116</td>
                                    <td className="py-3 px-2">74</td>
                                    <td className="py-3 px-2">50</td>
                                </tr>
                                <tr className="border-b border-stone-100">
                                    <td className="py-3 px-2 font-bold">XL</td>
                                    <td className="py-3 px-2">122</td>
                                    <td className="py-3 px-2">76</td>
                                    <td className="py-3 px-2">52</td>
                                </tr>
                                <tr className="border-b border-stone-100">
                                    <td className="py-3 px-2 font-bold">XXL</td>
                                    <td className="py-3 px-2">128</td>
                                    <td className="py-3 px-2">78</td>
                                    <td className="py-3 px-2">54</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// --- ICONS ---

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 126.7 89.8 126.7 19.6 0 23-12.9 54.9-12.9 30.5 0 34.3 12.9 57.6 12.9 32.4 0 55.9-77.9 75.8-107.8 17.7-26.9 24.9-52.9 24.9-53.3-1.7-.5-45.1-17.4-42.7-51.6zm-22.8-153c25-30.2 18.4-74.4 16.3-84.2-26.2 2.1-59.6 18.6-78.6 41.3-18.2 20.9-23.8 53.7-21.2 79.9 28.7 2.2 58.5-17 83.5-37z"/>
  </svg>
);

// --- SUB-COMPONENTS ---

const FeaturedMerch: React.FC<{ onOpenShop: () => void }> = ({ onOpenShop }) => {
  return (
    <section className="relative py-24 bg-stone-900 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#1a1a1a] skew-x-12 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-nobel-gold/20"></div>

      <div className="container mx-auto px-6 relative z-10">
         <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-nobel-gold text-stone-900 text-xs font-bold tracking-widest uppercase rounded-full mb-6">
                   <Star size={12} fill="currentColor" /> The Franchise Collection
                </div>
                <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
                  You Can't See <br/> <span className="text-stone-500">My Bugs.</span>
                </h2>
                <p className="text-lg text-stone-400 mb-8 max-w-md leading-relaxed">
                  Official streetwear inspired by the grind. 
                  Hustle, Syntax, and Respect. Wear the code. 
                  Limited edition drops available now.
                </p>
                <button 
                  onClick={onOpenShop}
                  className="px-8 py-4 bg-white text-stone-900 font-bold uppercase tracking-widest hover:bg-nobel-gold hover:text-white transition-all duration-300 inline-flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(197,160,89,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                   <span>Enter The Shop</span>
                   <ArrowRight size={18} />
                </button>
            </div>

            <div className="flex-1 relative group cursor-pointer" onClick={onOpenShop}>
                <motion.div 
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 aspect-[4/5] max-w-sm mx-auto bg-stone-800 rounded-xl overflow-hidden border border-stone-700 shadow-2xl"
                >
                    <img 
                      src={PRODUCTS[0].images[0]} 
                      alt="Merch" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-stone-900 to-transparent">
                       <div className="text-nobel-gold font-bold tracking-widest text-xs mb-1">FEATURED DROP</div>
                       <div className="text-white font-serif text-2xl">The 'Invisible' Tee</div>
                       <div className="text-stone-300 font-mono text-sm mt-1">R650.00</div>
                    </div>
                </motion.div>
                <div className="absolute inset-0 bg-nobel-gold/10 -z-10 rounded-xl transform rotate-3 scale-100 max-w-sm mx-auto"></div>
            </div>
         </div>
      </div>
    </section>
  );
};

// --- AUTH COMPONENT ---

const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: (provider: 'google' | 'apple') => void }> = ({ isOpen, onClose, onLogin }) => {
    const [loading, setLoading] = useState<'google' | 'apple' | null>(null);

    const handleLogin = (provider: 'google' | 'apple') => {
        setLoading(provider);
        // Simulate network delay
        setTimeout(() => {
            onLogin(provider);
            setLoading(null);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-stone-900/90 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 text-center">
                            <div className="w-12 h-12 bg-nobel-gold rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm mx-auto mb-4">N</div>
                            <h3 className="font-serif text-2xl text-stone-900 mb-2">Join The Loop</h3>
                            <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                                Sign in to save your cart, track orders, and get early access to limited drops.
                            </p>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => handleLogin('google')}
                                    disabled={!!loading}
                                    className="w-full py-3 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    {loading === 'google' ? (
                                        <div className="w-5 h-5 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <GoogleIcon />
                                            <span>Continue with Google</span>
                                        </>
                                    )}
                                </button>
                                <button 
                                    onClick={() => handleLogin('apple')}
                                    disabled={!!loading}
                                    className="w-full py-3 px-4 bg-black text-white hover:bg-stone-800 rounded-lg font-medium transition-colors flex items-center justify-center gap-3 relative overflow-hidden"
                                >
                                    {loading === 'apple' ? (
                                        <div className="w-5 h-5 border-2 border-stone-600 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <AppleIcon />
                                            <span>Continue with Apple</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-6 text-[10px] text-stone-400">
                                By continuing, you agree to our Terms of Service and Privacy Policy.
                                <br/> We don't see your password. We only see the code.
                            </div>
                        </div>
                        <div className="bg-stone-50 p-4 border-t border-stone-200 text-center">
                            <button onClick={onClose} className="text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900">Cancel</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// --- ACCOUNT DRAWER ---

const AccountDrawer: React.FC<{ 
    user: UserProfile; 
    isOpen: boolean; 
    onClose: () => void; 
    onLogout: () => void; 
}> = ({ user, isOpen, onClose, onLogout }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-stone-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-[80] w-full max-w-md bg-[#F9F8F4] shadow-2xl flex flex-col border-l border-stone-200"
                    >
                        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                            <h2 className="font-serif text-2xl text-stone-900">My Account</h2>
                            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X size={20}/></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Profile Header */}
                            <div className="p-8 text-center bg-white border-b border-stone-200">
                                <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 border-2 border-nobel-gold p-1 mb-3">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                </div>
                                <h3 className="font-serif text-xl text-stone-900">{user.name}</h3>
                                <p className="text-sm text-stone-500 mb-4">{user.email}</p>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-600">
                                    {user.provider === 'google' ? <GoogleIcon /> : <AppleIcon />}
                                    Connected
                                </div>
                            </div>

                            {/* Order History */}
                            <div className="p-6">
                                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">
                                    <History size={14} /> Order History
                                </h4>

                                {user.orders.length === 0 ? (
                                    <div className="text-center py-8 border border-dashed border-stone-300 rounded-lg">
                                        <Package size={24} className="mx-auto text-stone-300 mb-2" />
                                        <p className="text-stone-500 text-sm">No orders yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {user.orders.map(order => (
                                            <div key={order.id} className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="font-bold text-stone-900 text-sm">Order #{order.id}</div>
                                                        <div className="text-xs text-stone-500">{order.date}</div>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                        order.status === 'Processing' ? 'bg-blue-50 text-blue-600' : 
                                                        order.status === 'Shipped' ? 'bg-yellow-50 text-yellow-600' : 
                                                        'bg-green-50 text-green-600'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="space-y-2 mb-3">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="flex justify-between text-xs">
                                                            <span className="text-stone-600">
                                                                {item.quantity}x {item.name}
                                                                <span className="text-stone-400 ml-1">({item.selectedSize} / {item.selectedColor})</span>
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="pt-2 border-t border-stone-100 flex justify-between items-center">
                                                    <span className="text-xs text-stone-400">Total</span>
                                                    <span className="font-mono font-bold text-stone-900 text-sm">{formatCurrency(order.total)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-stone-200">
                            <button 
                                onClick={() => { onLogout(); onClose(); }}
                                className="w-full py-3 border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 hover:text-red-500 transition-colors rounded flex items-center justify-center gap-2"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- WISHLIST DRAWER ---

const WishlistDrawer: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    wishlistItems: Product[];
    onRemove: (id: string) => void;
    onViewProduct: (product: Product) => void;
    onShare: () => void;
}> = ({ isOpen, onClose, wishlistItems, onRemove, onViewProduct, onShare }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-stone-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-[80] w-full max-w-md bg-[#F9F8F4] shadow-2xl flex flex-col border-l border-stone-200"
                    >
                        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                            <h2 className="font-serif text-2xl text-stone-900">Your Wishlist <span className="text-stone-400 text-lg">({wishlistItems.length})</span></h2>
                            <div className="flex gap-2">
                                {wishlistItems.length > 0 && (
                                    <button onClick={onShare} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500" title="Share Wishlist">
                                        <Share2 size={20} />
                                    </button>
                                )}
                                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X size={20}/></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                             {wishlistItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-stone-400">
                                    <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                                        <Heart size={32} className="text-stone-400" />
                                    </div>
                                    <p className="font-serif text-xl text-stone-500 mb-2">No saved items.</p>
                                    <p className="text-xs text-stone-400 max-w-[200px] text-center leading-relaxed">
                                        Heart items to save them for later.
                                    </p>
                                    <button onClick={onClose} className="mt-6 px-6 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-nobel-gold transition-colors">
                                        Browse Shop
                                    </button>
                                </div>
                             ) : (
                                 wishlistItems.map(item => (
                                     <motion.div 
                                        layout 
                                        key={item.id} 
                                        className="flex gap-4 bg-white p-3 rounded border border-stone-200 shadow-sm group"
                                    >
                                         <div 
                                            className="w-20 h-24 bg-stone-100 rounded overflow-hidden shrink-0 border border-stone-100 cursor-pointer"
                                            onClick={() => onViewProduct(item)}
                                         >
                                             <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                         </div>
                                         <div className="flex-1 flex flex-col justify-between py-1">
                                             <div>
                                                 <div className="flex justify-between items-start">
                                                     <h4 
                                                        onClick={() => onViewProduct(item)}
                                                        className="font-serif text-stone-900 text-sm leading-tight pr-4 line-clamp-2 cursor-pointer hover:text-nobel-gold transition-colors"
                                                    >
                                                        {item.name}
                                                    </h4>
                                                     <button onClick={() => onRemove(item.id)} className="text-stone-300 hover:text-red-400 transition-colors p-1">
                                                        <Trash2 size={14}/>
                                                    </button>
                                                 </div>
                                                 <div className="text-[10px] text-stone-400 mt-1 uppercase tracking-widest">{item.category}</div>
                                             </div>
                                             <div className="flex justify-between items-end mt-2">
                                                  <div className="font-mono font-bold text-stone-900 text-sm">{formatCurrency(item.price)}</div>
                                                  <button 
                                                    onClick={() => onViewProduct(item)}
                                                    className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 flex items-center gap-1"
                                                  >
                                                      View <ArrowRight size={10} />
                                                  </button>
                                             </div>
                                         </div>
                                     </motion.div>
                                 ))
                             )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- ORDER CONFIRMATION ---

const OrderConfirmation: React.FC<{ items: CartItem[]; onReturn: () => void; orderId: string }> = ({ items, onReturn, orderId }) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(2), 1500); 
    const timer2 = setTimeout(() => setProgress(3), 4000); 
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const steps = [
    { id: 1, label: 'Order Confirmed', icon: Check, desc: 'We have received your order.' },
    { id: 2, label: 'Processing', icon: Package, desc: 'Your gear is being prepared.' },
    { id: 3, label: 'Shipped', icon: Truck, desc: 'On the way to the loop.' },
    { id: 4, label: 'Delivered', icon: MapPin, desc: 'Arriving soon.' }
  ];

  const total = items.reduce((a, b) => a + (b.price * b.quantity), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#F9F8F4] flex flex-col items-center justify-center p-6 animate-fade-in"
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-900 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-800 via-nobel-gold to-stone-800"></div>
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-stone-900 rounded-full mb-4 shadow-lg"
            >
                <Check size={32} strokeWidth={3} />
            </motion.div>
            <h2 className="font-serif text-3xl mb-2">Order Confirmed</h2>
            <p className="text-stone-400 font-mono text-sm tracking-widest">ORDER #{orderId}</p>
        </div>

        <div className="p-6 md:p-10">
           {/* Tracking Section */}
           <div className="mb-12">
              <h3 className="font-bold text-stone-900 uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                 <Clock size={14} className="text-nobel-gold" /> Real-time Status
              </h3>
              <div className="relative pl-4">
                 {/* Vertical Line */}
                 <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-stone-100"></div>
                 <motion.div 
                     className="absolute left-[22px] top-2 w-0.5 bg-nobel-gold"
                     initial={{ height: '0%' }}
                     animate={{ height: `${(progress - 1) * 33}%` }}
                     transition={{ duration: 1 }}
                 />
                 
                 <div className="space-y-8 relative z-10">
                     {steps.map((step) => {
                         const isActive = progress >= step.id;
                         const isCurrent = progress === step.id;
                         return (
                             <div key={step.id} className={`flex items-start gap-5 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 blur-[1px]'}`}>
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${isActive ? 'bg-nobel-gold border-nobel-gold text-white scale-110 shadow-md' : 'bg-white border-stone-200 text-stone-300'}`}>
                                     <step.icon size={14} />
                                 </div>
                                 <div className="flex-1 pt-1">
                                     <div className="flex justify-between items-center">
                                        <div className="font-serif font-bold text-stone-900 text-lg leading-none">{step.label}</div>
                                        {isCurrent && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-nobel-gold animate-pulse">
                                                Current Status
                                            </span>
                                        )}
                                     </div>
                                     <div className="text-sm text-stone-500 mt-1">{step.desc}</div>
                                 </div>
                             </div>
                         )
                     })}
                 </div>
              </div>
           </div>

           {/* Order Summary */}
           <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
               <h3 className="font-bold text-stone-900 uppercase tracking-widest text-xs mb-4 border-b border-stone-200 pb-2">Order Summary</h3>
               <div className="space-y-3 mb-4">
                   {items.map((item, idx) => (
                       <div key={idx} className="flex justify-between text-sm items-center">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-12 rounded bg-white border border-stone-200 overflow-hidden shrink-0">
                                   <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                               </div>
                               <div className="flex flex-col">
                                   <span className="text-stone-700 font-medium">{item.quantity}x {item.name}</span>
                                   <span className="text-stone-400 text-xs">({item.selectedSize} / {item.selectedColor})</span>
                               </div>
                           </div>
                           <span className="font-mono font-bold text-stone-900">{formatCurrency(item.price * item.quantity)}</span>
                       </div>
                   ))}
               </div>
               <div className="flex justify-between text-lg font-bold pt-4 border-t border-stone-200 border-dashed">
                   <span>Total</span>
                   <span>{formatCurrency(total)}</span>
               </div>
           </div>

           {/* Action */}
           <div className="mt-8">
               <button onClick={onReturn} className="w-full py-4 bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors rounded shadow-lg flex items-center justify-center gap-2 group">
                   <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                   <span>Back to Shop</span>
               </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- PRODUCT MODAL ---

const ProductQuickView: React.FC<{ 
    product: Product; 
    onClose: () => void; 
    onAddToCart: (p: Product, s: string, c: string) => void;
    isWishlisted: boolean;
    onToggleWishlist: () => void;
}> = ({ product, onClose, onAddToCart, isWishlisted, onToggleWishlist }) => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'shipping'>('details');
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [currentImages, setCurrentImages] = useState<string[]>(product.images);

    useEffect(() => {
        if (selectedColor && product.colorImages[selectedColor]) {
            setCurrentImages(product.colorImages[selectedColor]);
            setActiveImageIndex(0);
        } else {
             setCurrentImages(product.images);
        }
    }, [selectedColor, product]);

    const handleAdd = () => {
        if (!selectedSize || (product.colors.length > 0 && !selectedColor)) {
            setError(true);
            setTimeout(() => setError(false), 1000);
            return;
        }
        onAddToCart(product, selectedSize, selectedColor || product.colors[0].name);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-8">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/90 backdrop-blur-sm" 
                onClick={onClose}
            />
            
            <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} category={product.category} />

            <motion.div 
                initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-6xl bg-[#F9F8F4] md:rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[95vh] md:h-[90vh] rounded-t-xl"
            >
                <button onClick={onClose} className="absolute top-4 right-4 z-30 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                    <X size={20} />
                </button>

                {/* Gallery Side */}
                <div className="w-full md:w-[55%] bg-white relative flex flex-col border-b md:border-b-0 md:border-r border-stone-200 group h-[40vh] md:h-full shrink-0">
                    <div className="flex-1 relative overflow-hidden bg-stone-100 md:cursor-zoom-in">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImages[activeImageIndex]}
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full h-full relative"
                            >
                                <img 
                                    src={currentImages[activeImageIndex]} 
                                    alt={product.name} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 md:hover:scale-125 origin-center" 
                                />
                            </motion.div>
                         </AnimatePresence>
                        
                         {/* Floating Zoom Hint */}
                        <div className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
                            <Maximize2 size={16} />
                        </div>

                        {product.badge && (
                             <div className="absolute top-6 left-6 bg-nobel-gold text-white text-xs font-bold px-3 py-1 uppercase tracking-widest shadow-lg z-20">
                                {product.badge}
                            </div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    <div className="h-16 md:h-24 flex gap-2 p-3 md:p-4 overflow-x-auto bg-white border-t border-stone-200 shrink-0">
                        {currentImages.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setActiveImageIndex(idx)}
                                className={`aspect-square h-full rounded overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-stone-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Side */}
                <div className="w-full md:w-[45%] flex flex-col bg-[#F9F8F4] flex-1 overflow-hidden h-full">
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 pb-6 md:pb-10">
                        <div className="mb-2">
                            <span className="text-nobel-gold text-xs font-bold uppercase tracking-widest border border-nobel-gold/30 px-2 py-0.5 rounded">{product.category}</span>
                        </div>
                        <h2 className="font-serif text-2xl md:text-4xl text-stone-900 mb-2 leading-tight">{product.name}</h2>
                        
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-nobel-gold">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < Math.round(product.rating) ? "currentColor" : "none"} className={i >= Math.round(product.rating) ? "text-stone-300" : ""} />
                                ))}
                            </div>
                            <span className="text-xs text-stone-500 font-medium underline cursor-pointer hover:text-stone-800" onClick={() => setActiveTab('reviews')}>{product.reviewCount} Reviews</span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-8 border-b border-stone-200 pb-6">
                             <span className="font-mono text-2xl text-stone-900 font-bold">{formatCurrency(product.price)}</span>
                             <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded">In Stock</span>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex gap-6 mb-6 border-b border-stone-200">
                            {['details', 'reviews', 'shipping'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'}`}
                                >
                                    {tab}
                                    {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-nobel-gold" />}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[150px]">
                            {activeTab === 'details' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <p className="text-stone-600 leading-relaxed text-sm">{product.description}</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {product.details.map((detail, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-stone-500 bg-white px-3 py-2 rounded border border-stone-200">
                                                <Check size={12} className="text-nobel-gold shrink-0" /> {detail}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                            
                            {activeTab === 'reviews' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                    {product.reviews.map(review => (
                                        <div key={review.id} className="bg-white p-4 rounded border border-stone-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-stone-200 overflow-hidden">
                                                        <img src={review.avatar} alt={review.user} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-xs font-bold text-stone-900">{review.user}</span>
                                                </div>
                                                <span className="text-[10px] text-stone-400">{review.date}</span>
                                            </div>
                                            <div className="flex text-nobel-gold mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-stone-200" : ""} />
                                                ))}
                                            </div>
                                            <p className="text-xs text-stone-600 italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'shipping' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 text-sm text-stone-600">
                                    <div className="flex items-start gap-3">
                                        <Truck size={18} className="text-stone-900 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">Free Express Shipping</p>
                                            <p>On all orders over R1,500. Delivered within 2-3 working days to major centers.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <RefreshCw size={18} className="text-stone-900 mt-0.5" />
                                        <div>
                                            <p className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1">Easy Returns</p>
                                            <p>If the fit isn't right, return it within 30 days for an exchange. No bugs attached.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Sticky Bottom Action Area */}
                    <div className="p-4 md:p-8 bg-white border-t border-stone-200 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] z-10 shrink-0 safe-area-bottom">
                        {/* Color Selection */}
                        {product.colors.length > 0 && (
                            <div className="mb-4 md:mb-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3 block">Select Color: <span className="text-stone-900 ml-1">{selectedColor || '-'}</span></label>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.name}
                                            onClick={() => { setSelectedColor(color.name); setError(false); }}
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                                                selectedColor === color.name 
                                                ? 'border-stone-900 scale-110 shadow-md' 
                                                : 'border-stone-200 hover:scale-105 hover:border-stone-400'
                                            } ${error && !selectedColor ? 'animate-shake border-red-400' : ''}`}
                                            title={color.name}
                                        >
                                            <div 
                                                className="w-8 h-8 rounded-full border border-stone-100 shadow-inner" 
                                                style={{ backgroundColor: color.hex }}
                                            ></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        <div className="flex justify-between mb-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Select Size: <span className="text-stone-900 ml-1">{selectedSize || '-'}</span></label>
                            <button 
                                onClick={() => setShowSizeGuide(true)}
                                className="text-xs text-stone-500 underline hover:text-stone-800 flex items-center gap-1"
                            >
                                <Ruler size={12} /> Size Guide
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => { setSelectedSize(size); setError(false); }}
                                    className={`min-w-[3.5rem] h-12 flex items-center justify-center text-sm font-bold transition-all rounded ${
                                        selectedSize === size 
                                        ? 'bg-stone-900 text-white shadow-lg scale-105' 
                                        : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                                    } ${error && !selectedSize ? 'animate-shake border-red-400' : ''}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {error && <div className="text-red-500 text-xs font-bold mb-4 animate-fade-in flex items-center gap-1"><Info size={12}/> Please select color & size</div>}

                        <div className="flex gap-3 mt-4">
                             <button 
                                onClick={onToggleWishlist}
                                className={`px-5 py-4 border-2 rounded transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-stone-300 text-stone-400 hover:border-stone-500 hover:text-stone-600'}`}
                             >
                                 <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                             </button>
                            <button 
                                onClick={handleAdd}
                                className="flex-1 py-4 bg-nobel-gold text-white font-bold uppercase tracking-widest hover:bg-[#b38e3d] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 rounded"
                            >
                                <span>Add to Cart</span>
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- CART DRAWER ---

const CartDrawer: React.FC<{ 
    cart: CartItem[]; 
    isOpen: boolean; 
    onClose: () => void;
    onUpdateQty: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    onCheckout: () => void;
    onClearCart: () => void;
    isLoggedIn: boolean;
}> = ({ cart, isOpen, onClose, onUpdateQty, onRemove, onCheckout, onClearCart, isLoggedIn }) => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const freeShippingThreshold = 1500;
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);
    const progress = Math.min(100, (total / freeShippingThreshold) * 100);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[70] bg-stone-900/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    {/* Drawer */}
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-[80] w-full max-w-md bg-[#F9F8F4] shadow-2xl flex flex-col border-l border-stone-200"
                    >
                        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                            <h2 className="font-serif text-2xl text-stone-900">Your Cart <span className="text-stone-400 text-lg">({cart.length})</span></h2>
                            <div className="flex gap-2">
                                {cart.length > 0 && (
                                    <button onClick={onClearCart} className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400 hover:text-red-500" title="Clear Cart">
                                        <Trash2 size={20} />
                                    </button>
                                )}
                                <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><X size={20}/></button>
                            </div>
                        </div>
                        
                        {/* Shipping Progress */}
                        {cart.length > 0 && (
                            <div className="px-6 py-4 bg-stone-100 border-b border-stone-200">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                                    {remainingForFreeShipping > 0 
                                        ? <span className="text-stone-500">Add {formatCurrency(remainingForFreeShipping)} for Free Shipping</span>
                                        : <span className="text-green-600 flex items-center gap-1"><Check size={12} /> Free Shipping Unlocked</span>
                                    }
                                    <span className="text-stone-400">{Math.round(progress)}%</span>
                                </div>
                                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                                        className={`h-full transition-all duration-500 ${remainingForFreeShipping > 0 ? 'bg-stone-800' : 'bg-green-500'}`}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-stone-400">
                                    <div className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center mb-4">
                                        <ShoppingBag size={32} className="text-stone-400" />
                                    </div>
                                    <p className="font-serif text-xl text-stone-500 mb-2">Your cart is empty.</p>
                                    <p className="text-xs text-stone-400 max-w-[200px] text-center leading-relaxed">Add some gear to represent the hustle.</p>
                                    <button onClick={onClose} className="mt-6 px-6 py-2 bg-stone-900 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-nobel-gold transition-colors">Start Shopping</button>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <motion.div layout key={item.cartId} className="flex gap-4 bg-white p-3 rounded border border-stone-200 shadow-sm">
                                        <div className="w-20 h-24 bg-stone-100 rounded overflow-hidden shrink-0 border border-stone-100">
                                            <img src={item.colorImages[item.selectedColor]?.[0] || item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-serif text-stone-900 text-sm leading-tight pr-4 line-clamp-2">{item.name}</h4>
                                                    <button onClick={() => onRemove(item.cartId)} className="text-stone-300 hover:text-red-400 transition-colors p-1"><Trash2 size={14}/></button>
                                                </div>
                                                <div className="text-xs text-stone-500 mt-1 uppercase tracking-wider flex items-center gap-2">
                                                    <span className="px-1.5 py-0.5 bg-stone-100 rounded border border-stone-200">{item.selectedSize}</span>
                                                    {item.selectedColor && (
                                                        <span className="flex items-center gap-1 text-stone-500">
                                                            <span className="w-2 h-2 rounded-full border border-stone-300" style={{backgroundColor: PRODUCTS.find(p => p.id === item.id)?.colors.find(c => c.name === item.selectedColor)?.hex}}></span>
                                                            {item.selectedColor}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end mt-2">
                                                <div className="flex items-center border border-stone-200 rounded bg-stone-50">
                                                    <button onClick={() => onUpdateQty(item.cartId, -1)} className="p-1.5 hover:bg-stone-200 text-stone-500 transition-colors"><Minus size={10}/></button>
                                                    <span className="w-6 text-center text-xs font-mono font-bold">{item.quantity}</span>
                                                    <button onClick={() => onUpdateQty(item.cartId, 1)} className="p-1.5 hover:bg-stone-200 text-stone-500 transition-colors"><Plus size={10}/></button>
                                                </div>
                                                <div className="font-mono font-bold text-stone-900 text-sm">{formatCurrency(item.price * item.quantity)}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        <div className="p-6 bg-white border-t border-stone-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between text-stone-500">
                                    <span>Subtotal</span>
                                    <span className="font-mono">{formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between text-stone-500">
                                    <span>Shipping</span>
                                    <span className="font-mono">{remainingForFreeShipping === 0 ? 'FREE' : 'Calc at checkout'}</span>
                                </div>
                                <div className="flex justify-between text-stone-900 font-bold text-lg pt-3 border-t border-stone-100">
                                    <span>Total</span>
                                    <span className="font-mono">{formatCurrency(total)}</span>
                                </div>
                            </div>
                            <button 
                                onClick={onCheckout}
                                disabled={cart.length === 0}
                                className="w-full py-4 bg-stone-900 text-white font-bold uppercase tracking-widest hover:bg-nobel-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded shadow-lg"
                            >
                                {isLoggedIn ? (
                                    <>
                                        <span>Proceed to Checkout</span>
                                        <ChevronRight size={16} />
                                    </>
                                ) : (
                                    <>
                                        <span>Login to Checkout</span>
                                        <User size={16} />
                                    </>
                                )}
                            </button>
                            <div className="text-center mt-4 flex items-center justify-center gap-2 text-[10px] text-stone-400 uppercase tracking-widest">
                                <Package size={12}/> <span>Secured by Logic & Grit</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- MAIN PAGE ---

const ShopPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [lastOrder, setLastOrder] = useState<CartItem[]>([]);
  const [lastOrderId, setLastOrderId] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Auth States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountDrawer, setShowAccountDrawer] = useState(false);

  // Wishlist State
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Notification
  const [toast, setToast] = useState<{msg: string, type: ToastType, visible: boolean}>({msg: '', type: 'info', visible: false});

  const showToast = (msg: string, type: ToastType = 'info') => {
      setToast({msg, type, visible: true});
  };
  
  const addToCart = (product: Product, size: string, color: string) => {
      setCart(prev => {
          const existingId = `${product.id}-${size}-${color}`;
          const existingItem = prev.find(item => item.cartId === existingId);
          if (existingItem) {
              return prev.map(item => 
                  item.cartId === existingId 
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
          }
          return [...prev, { ...product, selectedSize: size, selectedColor: color, quantity: 1, cartId: existingId }];
      });
      showToast(`Added ${product.name} to cart`, 'success');
      setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(item => item.cartId !== id));
      showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
      if (confirm("Are you sure you want to clear your cart?")) {
        setCart([]);
        showToast('Cart cleared', 'info');
      }
  };

  const updateQuantity = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.cartId === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
      }));
  };

  const handleLogin = (provider: 'google' | 'apple') => {
      // Mock Login
      const newUser: UserProfile = {
          name: provider === 'google' ? 'Neo Developer' : 'Apple User',
          email: provider === 'google' ? 'neo@code.dev' : 'user@icloud.com',
          avatar: provider === 'google' 
            ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" 
            : "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&auto=format&fit=crop",
          provider,
          orders: [],
          wishlist: [] // Initial empty wishlist
      };
      setUser(newUser);
      setShowAuthModal(false);
      showToast(`Welcome back, ${newUser.name}`, 'success');
  };

  const handleLogout = () => {
      setUser(null);
      setShowAccountDrawer(false);
      setIsWishlistOpen(false);
      showToast('Logged out successfully', 'info');
  };

  const handleToggleWishlist = (product: Product) => {
      if (!user) {
          setShowAuthModal(true);
          return;
      }

      setUser(prev => {
          if (!prev) return null;
          const exists = prev.wishlist.includes(product.id);
          let newWishlist;
          if (exists) {
              newWishlist = prev.wishlist.filter(id => id !== product.id);
              showToast('Removed from Wishlist', 'info');
          } else {
              newWishlist = [...prev.wishlist, product.id];
              showToast('Added to Wishlist', 'success');
          }
          return { ...prev, wishlist: newWishlist };
      });
  };

  const handleShareWishlist = () => {
      const dummyLink = `https://neoqiss.dev/wishlist/${user?.name.replace(/\s/g, '-').toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`;
      navigator.clipboard.writeText(dummyLink);
      showToast('Wishlist link copied to clipboard!', 'success');
  };

  const handleCheckout = () => {
      if (!user) {
          setIsCartOpen(false);
          setShowAuthModal(true);
          return;
      }

      setCheckoutStatus('processing');
      
      // Generate ID
      const newOrderId = `NQ-${Math.floor(Math.random() * 1000000)}`.padEnd(9, '0');
      
      setTimeout(() => {
          const newOrder: Order = {
              id: newOrderId,
              date: new Date().toLocaleDateString(),
              items: [...cart],
              total: cart.reduce((a, b) => a + (b.price * b.quantity), 0),
              status: 'Processing'
          };

          // Add to user history
          if (user) {
              setUser({
                  ...user,
                  orders: [newOrder, ...user.orders]
              });
          }

          setLastOrder([...cart]);
          setLastOrderId(newOrderId);
          setCart([]);
          setCheckoutStatus('idle');
          setOrderComplete(true);
          setIsCartOpen(false);
          showToast('Order placed successfully!', 'success');
      }, 2000);
  };

  if (orderComplete) {
      return <OrderConfirmation items={lastOrder} orderId={lastOrderId} onReturn={() => { setOrderComplete(false); }} />;
  }

  const filteredProducts = activeCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  // Derive full product objects for wishlist
  const wishlistProducts = user 
    ? PRODUCTS.filter(p => user.wishlist.includes(p.id))
    : [];

  return (
    <div className="min-h-screen bg-[#F9F8F4] animate-fade-in relative">
        
        <ToastNotification 
            message={toast.msg} 
            type={toast.type} 
            isVisible={toast.visible} 
            onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
        />

        <AnimatePresence>
            {selectedProduct && (
                <ProductQuickView 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                    onAddToCart={addToCart}
                    isWishlisted={user?.wishlist.includes(selectedProduct.id) || false}
                    onToggleWishlist={() => handleToggleWishlist(selectedProduct)}
                />
            )}
        </AnimatePresence>

        <AuthModal 
            isOpen={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
            onLogin={handleLogin} 
        />

        {user && (
            <AccountDrawer 
                user={user} 
                isOpen={showAccountDrawer} 
                onClose={() => setShowAccountDrawer(false)} 
                onLogout={handleLogout}
            />
        )}

        <CartDrawer 
            cart={cart} 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)}
            onUpdateQty={updateQuantity}
            onRemove={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
            isLoggedIn={!!user}
        />

        <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlistItems={wishlistProducts}
            onRemove={(id) => {
               const product = PRODUCTS.find(p => p.id === id);
               if(product) handleToggleWishlist(product);
            }}
            onViewProduct={(product) => {
                setSelectedProduct(product);
                setIsWishlistOpen(false);
            }}
            onShare={handleShareWishlist}
        />

        <AnimatePresence>
            {checkoutStatus === 'processing' && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-stone-900/80 backdrop-blur-sm flex items-center justify-center"
                >
                    <div className="text-center text-white">
                        <div className="w-16 h-16 border-4 border-stone-600 border-t-nobel-gold rounded-full animate-spin mx-auto mb-4"></div>
                        <h3 className="font-serif text-2xl">Processing</h3>
                        <p className="text-stone-400 text-sm">Securing your order...</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-4 md:px-6">
            <div className="container mx-auto flex justify-between items-center">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors uppercase text-[10px] md:text-xs font-bold tracking-widest"
                >
                    <ArrowLeft size={14} /> <span className="hidden md:inline">Back to Loop</span><span className="md:hidden">Back</span>
                </button>
                
                <div className="font-serif font-bold text-lg md:text-xl text-stone-900 tracking-wide text-center">
                    NEO QISS <span className="text-nobel-gold block md:inline text-xs md:text-xl">SUPPLY CO.</span>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                    {/* Wishlist Button */}
                    <div className="relative cursor-pointer group" onClick={() => user ? setIsWishlistOpen(true) : setShowAuthModal(true)}>
                         <div className="p-2 group-hover:bg-stone-100 rounded-full transition-colors relative">
                             <Heart className="text-stone-800" size={20} />
                             {user && user.wishlist.length > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    key={user.wishlist.length}
                                    className="absolute -top-0 -right-0 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm border border-white"
                                >
                                    {user.wishlist.length}
                                </motion.span>
                             )}
                         </div>
                    </div>

                    {user ? (
                        <div 
                            className="flex items-center gap-2 cursor-pointer hover:bg-stone-100 py-1 px-2 rounded-full transition-colors"
                            onClick={() => setShowAccountDrawer(true)}
                        >
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-300">
                                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <span className="hidden md:block text-xs font-bold text-stone-700">{user.name.split(' ')[0]}</span>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowAuthModal(true)}
                            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-nobel-gold transition-colors"
                        >
                            <User size={16} /> Sign In
                        </button>
                    )}

                    <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                        <div className="p-2 group-hover:bg-stone-100 rounded-full transition-colors relative">
                            <ShoppingBag className="text-stone-800" size={24} />
                            {cart.length > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    key={cart.length}
                                    className="absolute -top-1 -right-1 bg-nobel-gold text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm border border-white"
                                >
                                    {cart.reduce((a, b) => a + b.quantity, 0)}
                                </motion.span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <div className="bg-stone-900 text-white py-20 px-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="inline-block px-3 py-1 border border-nobel-gold text-nobel-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-6"
                >
                    Est. 2024
                </motion.div>
                <motion.h1 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                    className="font-serif text-5xl md:text-7xl mb-6 leading-tight"
                >
                    Never Give Up. <br/><span className="text-stone-600">Never Quit.</span>
                </motion.h1>
                <motion.p 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                    className="text-stone-400 text-sm md:text-base tracking-widest uppercase max-w-lg mx-auto leading-relaxed"
                >
                    Premium streetwear for the hustlers, the coders, and the ones who can't be seen.
                </motion.p>
            </div>
        </div>

        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-center gap-4 mb-12 flex-wrap">
                {['All', 'Apparel', 'Headwear', 'Accessories'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-stone-900 text-white shadow-lg transform scale-105' : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product, idx) => (
                    <motion.div 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={product.id} 
                        className="group cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                    >
                        <div className="relative aspect-[4/5] bg-white rounded-lg overflow-hidden mb-4 border border-stone-200 shadow-sm group-hover:shadow-xl transition-all duration-500">
                            {product.badge && (
                                <div className="absolute top-3 left-3 z-20 bg-nobel-gold text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm">
                                    {product.badge}
                                </div>
                            )}
                            {/* Heart Icon on Card */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                                className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white shadow-sm transition-transform hover:scale-110 ${user?.wishlist.includes(product.id) ? 'text-red-500' : 'text-stone-300 hover:text-stone-500'}`}
                            >
                                <Heart size={16} fill={user?.wishlist.includes(product.id) ? "currentColor" : "none"} />
                            </button>

                            <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100 group-hover:opacity-0"
                            />
                             <img 
                                src={product.images[1] || product.images[0]} 
                                alt={product.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-0 group-hover:opacity-100"
                            />
                            
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="px-6 py-3 bg-white/90 backdrop-blur text-stone-900 font-bold uppercase text-xs tracking-widest transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-lg rounded">
                                    Quick View
                                </div>
                            </div>
                        </div>

                        <div className="text-left">
                            <div className="text-stone-400 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Tag size={10} /> {product.category}
                            </div>
                            <h3 className="font-serif text-lg text-stone-900 mb-1 group-hover:text-nobel-gold transition-colors leading-tight">{product.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-stone-900">{formatCurrency(product.price)}</span>
                                <div className="flex text-nobel-gold">
                                    <Star size={10} fill="currentColor"/>
                                    <span className="text-[10px] text-stone-500 ml-1 font-medium">{product.rating}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="bg-stone-100 border-t border-stone-200 py-12 mt-12 text-center">
             <div className="container mx-auto px-6">
                <h3 className="font-serif text-2xl text-stone-900 mb-2">The Neo Qiss Guarantee</h3>
                <p className="font-serif italic text-stone-500 mb-8">"If the code breaks, at least you look good."</p>
                <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                    <span className="flex items-center gap-2"><Check size={12} /> Secure Checkout</span>
                    <span className="flex items-center gap-2"><Check size={12} /> Worldwide Shipping</span>
                    <span className="flex items-center gap-2"><Check size={12} /> Limited Stock</span>
                </div>
             </div>
        </div>
    </div>
  );
};

export { FeaturedMerch, ShopPage };
