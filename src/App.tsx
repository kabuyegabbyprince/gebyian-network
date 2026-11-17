/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Sparkles, Package, ShieldCheck, Truck, 
  ArrowRight, X, Plus, Minus, CheckCircle, ChevronRight, Store, 
  ExternalLink, User, HelpCircle, Star, SlidersHorizontal
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  specs: string[];
  artisan: string;
  badge?: string;
}

interface CartItem extends Product {
  qty: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'artisans' | 'track' | 'merchant'>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // AI Concierge State
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [conciergeInput, setConciergeInput] = useState('');
  const [conciergeMessages, setConciergeMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Welcome to Gebyian Network. I am your personal AI shopping concierge. How can I assist you in discovering our curated artisanal, streetwear, or tech collections today?' }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Order Tracking State
  const [trackIdInput, setTrackIdInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any>(null);
  const [trackError, setTrackError] = useState('');
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Checkout Form State
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: 'Alex Mercer',
    email: 'alex.mercer@example.com',
    phone: '+1 (555) 234-5678',
    shippingAddress: '450 Mission Street, Suite 1200, San Francisco, CA 94105',
    paymentMethod: 'card'
  });
  const [orderCompleteData, setOrderCompleteData] = useState<any>(null);

  const products: Product[] = [
    {
      id: 'p1',
      name: 'Heavy Cotton Raw Denim Cargo Hoodie',
      category: 'Apparel & Streetwear',
      price: 185,
      rating: 4.9,
      reviewsCount: 42,
      image: '/src/assets/images/product_streetwear_1794914953110.jpg',
      description: 'Engineered from 500gsm heavy Japanese cotton fleece with triple-stitched cargo pockets and custom matte hardware. Designed for structural silhouette and everyday wearability.',
      specs: ['500gsm Heavyweight Cotton', 'Triple-needle stitching', 'Custom matte hardware', 'Relaxed architectural fit'],
      artisan: 'Studio Nomadic (Berlin)',
      badge: 'Limited Run'
    },
    {
      id: 'p2',
      name: 'Artisanal Botanical Serum No. 3',
      category: 'Artisan Beauty',
      price: 68,
      rating: 4.8,
      reviewsCount: 128,
      image: '/src/assets/images/product_serum_1794914953097.jpg',
      description: 'Cold-pressed cold-climate botanicals infused with bioactive peptides and rosehip seed oil. Packaged in UV-protective amber apothecary glass.',
      specs: ['30ml / 1 fl oz', '100% cold-pressed organic oils', 'Sulphate & paraben-free', 'Refillable amber glass'],
      artisan: 'Apothecary Lab (Zurich)',
      badge: 'Best Seller'
    },
    {
      id: 'p3',
      name: 'Sculptural Solid Oak Lounge Chair',
      category: 'Home & Living',
      price: 1240,
      rating: 5.0,
      reviewsCount: 19,
      image: '/src/assets/images/product_chair_1794914952368.jpg',
      description: 'Hand-turned European white oak frame with hand-woven natural linen webbing. A masterclass in minimalist architectural joinery.',
      specs: ['European White Oak', 'Natural Belgian Linen webbing', 'Traditional mortise joinery', 'Hand-finished beeswax'],
      artisan: 'Nordic Joinery Guild',
      badge: 'Masterpiece'
    },
    {
      id: 'p4',
      name: 'Precision Titanium Audio Interface & Watch',
      category: 'Tech & Hardware',
      price: 890,
      rating: 4.9,
      reviewsCount: 84,
      image: '/src/assets/images/product_hardware_1794914953061.jpg',
      description: 'Grade-5 titanium chassis featuring high-resolution audio converters paired with a mechanical automatic field watch. Built for uncompromising creators.',
      specs: ['Grade-5 Titanium Alloy', '32-bit / 192kHz audio converters', 'Automatic mechanical movement', 'Sapphire crystal glass'],
      artisan: 'Kurozawa Precision (Kyoto)',
      badge: 'New Arrival'
    },
    {
      id: 'p5',
      name: 'Minimalist Cast Iron Pour-Over Kettle',
      category: 'Home & Living',
      price: 145,
      rating: 4.7,
      reviewsCount: 65,
      image: '/src/assets/images/hero_gebyian_network_1794914952441.jpg',
      description: 'Matte black cast iron gooseneck kettle with ergonomic walnut handle for precision thermal retention and extraction.',
      specs: ['1.2L capacity', 'Matte enamel cast iron', 'Walnut wood insulated handle', 'Built-in precision thermometer'],
      artisan: 'Atelier Kuro (Tokyo)'
    },
    {
      id: 'p6',
      name: 'Technical Gore-Tex Weather Shell',
      category: 'Apparel & Streetwear',
      price: 340,
      rating: 4.9,
      reviewsCount: 31,
      image: '/src/assets/images/product_streetwear_1794914953110.jpg',
      description: 'Three-layer waterproof breathable membrane with YKK AquaGuard zips and fully taped internal seams.',
      specs: ['Gore-Tex Pro 3-Layer', 'YKK AquaGuard zippers', 'Storm hood with Cohaesive cords', 'Articulated sleeves'],
      artisan: 'Studio Nomadic (Berlin)'
    }
  ];

  const categories = ['All', 'Apparel & Streetwear', 'Artisan Beauty', 'Home & Living', 'Tech & Hardware'];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = subtotal > 150 ? 0 : 15;
  const grandTotal = subtotal + (subtotal > 0 ? shippingFee : 0);

  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeInput.trim() || isAiLoading) return;

    const userMsg = conciergeInput.trim();
    setConciergeInput('');
    setConciergeMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/ai/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg })
      });
      const data = await res.json();
      if (data.text) {
        setConciergeMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setConciergeMessages(prev => [...prev, { sender: 'ai', text: 'I apologize, but I am unable to process that request right now.' }]);
      }
    } catch (err) {
      setConciergeMessages(prev => [...prev, { sender: 'ai', text: 'Connection error. Please try again.' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackIdInput.trim()) return;
    setIsTrackingLoading(true);
    setTrackError('');
    setTrackedOrder(null);

    try {
      const res = await fetch(`/api/orders/${trackIdInput.trim()}`);
      if (!res.ok) {
        throw new Error('Order not found. Please check your tracking ID (e.g., GBY-98421).');
      }
      const data = await res.json();
      setTrackedOrder(data);
    } catch (err: any) {
      setTrackError(err.message);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  const handleCompleteCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: grandTotal,
          ...checkoutForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrderCompleteData(data.order);
        setCart([]);
        setIsCheckoutOpen(false);
      }
    } catch (err) {
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-900 selection:text-stone-100 flex flex-col">
      
      {/* TOP BAR CONTRACT: Brand | Nav Links | Primary Action */}
      <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a href="#" onClick={() => setActiveTab('store')} className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-stone-900 rounded-full"></span>
          Gebyian Network
        </a>

        {/* Zone 2: 4-5 Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button onClick={() => setActiveTab('store')} className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'store' ? 'text-stone-900 font-semibold' : ''}`}>
            Store
          </button>
          <button onClick={() => setActiveTab('artisans')} className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'artisans' ? 'text-stone-900 font-semibold' : ''}`}>
            Network Artisans
          </button>
          <button onClick={() => setActiveTab('track')} className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'track' ? 'text-stone-900 font-semibold' : ''}`}>
            Track Order
          </button>
          <button onClick={() => setActiveTab('merchant')} className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 ${activeTab === 'merchant' ? 'text-stone-900 font-semibold' : ''}`}>
            Merchant Hub
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsConciergeOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-200/70 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            AI Concierge
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-lg bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors flex items-center gap-2 px-3.5 py-2 text-xs font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {cart.reduce((s, i) => s + i.qty, 0) > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold tabular-nums shadow-sm">
                {cart.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* SUCCESS ORDER BANNER */}
      {orderCompleteData && (
        <div className="bg-stone-900 text-stone-100 px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Order <strong className="font-mono text-amber-300">{orderCompleteData.orderId}</strong> placed successfully! Estimated delivery: {orderCompleteData.estimatedDelivery}.</span>
          </div>
          <button onClick={() => setOrderCompleteData(null)} className="text-stone-400 hover:text-white text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {activeTab === 'store' && (
          <div className="space-y-16 pb-20">
            
            {/* HERO SECTION */}
            <section className="relative bg-stone-900 text-stone-100 overflow-hidden">
              <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
                <img 
                  src="/src/assets/images/hero_gebyian_network_1794914952441.jpg" 
                  alt="Gebyian Network Showroom" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent"></div>
              
              <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Global Creator Network
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl text-balance">
                  Engineered for Taste, Crafted by Artisans.
                </h1>
                <p className="text-stone-300 max-w-xl text-base md:text-lg font-normal leading-relaxed">
                  Discover uncompromising streetwear, artisanal botanicals, heirloom furniture, and precision tech hardware curated directly from independent workshops worldwide.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <a href="#catalog" className="px-6 py-3 bg-stone-100 text-stone-900 font-semibold rounded-lg hover:bg-white transition-colors text-sm shadow-sm flex items-center gap-2">
                    Explore Catalog <ArrowRight className="w-4 h-4" />
                  </a>
                  <button onClick={() => setIsConciergeOpen(true)} className="px-6 py-3 bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium rounded-lg transition-colors text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Consult AI Concierge
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-stone-800/80 w-full mt-8">
                  <div>
                    <p className="text-2xl font-bold font-mono text-stone-100">142+</p>
                    <p className="text-xs text-stone-400">Verified Artisans</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-stone-100">48h</p>
                    <p className="text-xs text-stone-400">Global Dispatch</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-stone-100">100%</p>
                    <p className="text-xs text-stone-400">Carbon Neutral Delivery</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-stone-100">4.9/5</p>
                    <p className="text-xs text-stone-400">Collector Rating</p>
                  </div>
                </div>
              </div>
            </section>

            {/* CATALOG SECTION */}
            <section id="catalog" className="max-w-7xl mx-auto px-6 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Curated Collections</h2>
                  <p className="text-sm text-stone-500 mt-1">Showing {filteredProducts.length} exceptional pieces across the network</p>
                </div>

                {/* SEARCH & SORT CONTROLS */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input 
                      type="text" 
                      placeholder="Search items or artisans..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 w-64"
                    />
                  </div>

                  <select 
                    value={sortBy} 
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* CATEGORY TABS (Interactive Filter Controls) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat 
                        ? 'bg-stone-900 text-white shadow-sm' 
                        : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* PRODUCT GRID */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl">
                  <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-stone-800">No pieces found</h3>
                  <p className="text-sm text-stone-500 mt-1">Try adjusting your search criteria or category filter.</p>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <div 
                      key={product.id}
                      className="group bg-white border border-stone-200/80 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {product.badge && (
                          <span className="absolute top-3 left-3 bg-stone-900/90 text-stone-100 text-[10px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-sm">
                            {product.badge}
                          </span>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          className="absolute bottom-3 right-3 bg-white/95 text-stone-900 hover:bg-stone-900 hover:text-white p-2.5 rounded-lg shadow-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                            <span>{product.artisan}</span>
                            <div className="flex items-center gap-1 text-amber-600 font-sans">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                          <h3 
                            onClick={() => setSelectedProduct(product)}
                            className="text-base font-semibold text-stone-900 hover:text-stone-700 cursor-pointer line-clamp-1"
                          >
                            {product.name}
                          </h3>
                          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                          <span className="text-lg font-bold font-mono text-stone-900 tabular-nums">
                            ${product.price.toLocaleString()}
                          </span>
                          <button 
                            onClick={() => setSelectedProduct(product)}
                            className="text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1"
                          >
                            View details <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'artisans' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-700">Network Directory</span>
              <h2 className="text-3xl font-bold text-stone-900 mt-1">Independent Guilds & Creators</h2>
              <p className="text-sm text-stone-600 mt-2 max-w-2xl">
                Gebyian Network partners exclusively with master workshops, independent design studios, and artisanal laboratories that maintain rigorous material standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Studio Nomadic', location: 'Berlin, Germany', focus: 'Heavyweight Streetwear & Tech Shells', items: 14, image: '/src/assets/images/product_streetwear_1794914953110.jpg' },
                { name: 'Apothecary Lab', location: 'Zurich, Switzerland', focus: 'Cold-Pressed Botanical Skincare', items: 8, image: '/src/assets/images/product_serum_1794914953097.jpg' },
                { name: 'Nordic Joinery Guild', location: 'Copenhagen, Denmark', focus: 'Solid Wood Architectural Furniture', items: 19, image: '/src/assets/images/product_chair_1794914952368.jpg' },
                { name: 'Kurozawa Precision', location: 'Kyoto, Japan', focus: 'Titanium Audio Gear & Horology', items: 11, image: '/src/assets/images/product_hardware_1794914953061.jpg' }
              ].map((artisan, idx) => (
                <div key={idx} className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[16:9] bg-stone-100 overflow-hidden">
                    <img src={artisan.image} alt={artisan.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-stone-900">{artisan.name}</h3>
                      <span className="text-xs font-mono bg-stone-100 px-2.5 py-1 rounded-md text-stone-600">{artisan.location}</span>
                    </div>
                    <p className="text-xs text-stone-600">{artisan.focus}</p>
                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-500">
                      <span>{artisan.items} Curated Pieces</span>
                      <button onClick={() => setActiveTab('store')} className="text-stone-900 hover:underline flex items-center gap-1">
                        Browse Works <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'track' && (
          <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-700">Shipment Intelligence</span>
              <h2 className="text-3xl font-bold text-stone-900">Track Your Order</h2>
              <p className="text-sm text-stone-600">Enter your Gebyian tracking ID (try sample ID: <code className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">GBY-98421</code>)</p>
            </div>

            <form onSubmit={handleTrackOrder} className="flex gap-3">
              <input 
                type="text" 
                placeholder="e.g., GBY-98421" 
                value={trackIdInput}
                onChange={(e) => setTrackIdInput(e.target.value)}
                className="flex-1 px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
              <button 
                type="submit" 
                disabled={isTrackingLoading}
                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
              >
                {isTrackingLoading ? 'Searching...' : 'Track Shipment'}
              </button>
            </form>

            {trackError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                {trackError}
              </div>
            )}

            {trackedOrder && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <p className="text-xs text-stone-500 font-mono">Order Reference</p>
                    <p className="text-xl font-bold font-mono text-stone-900">{trackedOrder.orderId}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {trackedOrder.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Estimated Delivery</p>
                    <p className="text-base font-semibold text-stone-900 mt-1">{trackedOrder.estimatedDelivery}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">Shipping Address</p>
                    <p className="text-stone-700 mt-1">{trackedOrder.shippingAddress}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <p className="text-xs font-semibold text-stone-700 uppercase tracking-wider">Order Items</p>
                  <div className="space-y-2">
                    {trackedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm py-2 px-3 bg-stone-50 rounded-lg">
                        <span className="font-medium text-stone-800">{item.name} (x{item.qty})</span>
                        <span className="font-mono text-stone-900">${(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between font-bold">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg">${trackedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'merchant' && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-700">Merchant Network Portal</span>
                <h2 className="text-3xl font-bold text-stone-900 mt-1">Creator Dashboard</h2>
                <p className="text-sm text-stone-600 mt-1">Manage global distribution, active catalog inventory, and network payouts.</p>
              </div>
              <button 
                onClick={() => alert('Application dialog opened. Our curator review board responds within 48 hours.')}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shadow-sm"
              >
                Apply as New Merchant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-2 shadow-sm">
                <p className="text-xs text-stone-500 font-medium">Total Network Sales (MTD)</p>
                <p className="text-3xl font-bold font-mono text-stone-900">$48,290.00</p>
                <p className="text-xs text-emerald-600 font-medium">+18.4% vs last month</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-2 shadow-sm">
                <p className="text-xs text-stone-500 font-medium">Active Curated Listings</p>
                <p className="text-3xl font-bold font-mono text-stone-900">14</p>
                <p className="text-xs text-stone-600">Across 3 categories</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-2 shadow-sm">
                <p className="text-xs text-stone-500 font-medium">Global Fulfillment Rate</p>
                <p className="text-3xl font-bold font-mono text-stone-900">99.4%</p>
                <p className="text-xs text-emerald-600 font-medium">Zero customs friction</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-2 shadow-sm">
                <p className="text-xs text-stone-500 font-medium">Collector Satisfaction</p>
                <p className="text-3xl font-bold font-mono text-stone-900">4.92</p>
                <p className="text-xs text-stone-600">Based on 312 reviews</p>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold text-stone-900">Network Standards & Protocols</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <h4 className="font-semibold text-stone-900">01. Material Authenticity</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">All products must declare origin of raw materials, sustainable timber certification, or recycled composite indices.</p>
                </div>
                <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <h4 className="font-semibold text-stone-900">02. Direct Dispatch</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Merchants ship within 48 hours of order confirmation using carbon-neutral logistics providers.</p>
                </div>
                <div className="space-y-2 p-4 bg-stone-50 rounded-xl border border-stone-100">
                  <h4 className="font-semibold text-stone-900">03. Transparent Royalties</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Creators retain 85% of retail valuation with automated weekly payout escrow settlements.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
            <span className="text-stone-100 font-bold tracking-tight">Gebyian Network</span>
          </div>
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Gebyian Network Inc. All rights reserved. Curated global commerce.
          </p>
          <div className="flex items-center gap-6 text-xs text-stone-400">
            <a href="#" onClick={() => setActiveTab('store')} className="hover:text-stone-100 transition-colors">Storefront</a>
            <a href="#" onClick={() => setActiveTab('artisans')} className="hover:text-stone-100 transition-colors">Network Guilds</a>
            <a href="#" onClick={() => setActiveTab('track')} className="hover:text-stone-100 transition-colors">Tracking</a>
            <a href="#" onClick={() => setActiveTab('merchant')} className="hover:text-stone-100 transition-colors">Merchant Portal</a>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAIL MODAL (PDP) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            <div className="md:w-1/2 bg-stone-100 relative aspect-square md:aspect-auto">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              {selectedProduct.badge && (
                <span className="absolute top-4 left-4 bg-stone-900 text-white text-xs font-semibold px-3 py-1 rounded-md">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">{selectedProduct.category}</span>
                  <button onClick={() => setSelectedProduct(null)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div>
                  <p className="text-xs text-stone-500 font-mono">{selectedProduct.artisan}</p>
                  <h2 className="text-2xl font-bold text-stone-900 mt-1">{selectedProduct.name}</h2>
                  <p className="text-xl font-bold font-mono text-stone-900 mt-2">${selectedProduct.price.toLocaleString()}</p>
                </div>

                <p className="text-sm text-stone-600 leading-relaxed">{selectedProduct.description}</p>

                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-stone-800 uppercase tracking-wider">Specifications & Materials</p>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1 h-1 bg-stone-400 rounded-full"></span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-100 flex items-center gap-4">
                <button 
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-stone-900" />
                  <h2 className="text-lg font-bold text-stone-900">Your Shopping Bag ({cart.reduce((s, i) => s + i.qty, 0)})</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                    <p className="text-stone-700 font-medium">Your bag is currently empty.</p>
                    <p className="text-xs text-stone-500">Explore our curated collections and add your first piece.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200/80 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-stone-900 truncate">{item.name}</h4>
                        <p className="text-xs font-mono text-stone-500">${item.price.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                            <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-stone-100 text-stone-600"><Minus className="w-3 h-3" /></button>
                            <span className="px-2.5 text-xs font-mono font-medium">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-stone-100 text-stone-600"><Plus className="w-3 h-3" /></button>
                          </div>
                          <span className="text-xs font-bold font-mono text-stone-900">${(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-200 space-y-4 bg-stone-50/50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-stone-600">
                      <span>Subtotal</span>
                      <span className="font-mono">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Shipping</span>
                      <span className="font-mono">{shippingFee === 0 ? 'FREE' : `$${shippingFee}`}</span>
                    </div>
                    <div className="flex justify-between text-stone-900 font-bold pt-2 border-t border-stone-200 text-base">
                      <span>Total</span>
                      <span className="font-mono">${grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    Proceed to Secure Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900">Secure Network Checkout</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteCheckout} className="p-6 space-y-4 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={checkoutForm.customerName}
                  onChange={e => setCheckoutForm({...checkoutForm, customerName: e.target.value})}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={checkoutForm.email}
                    onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">Phone Number</label>
                  <input 
                    type="text" 
                    required
                    value={checkoutForm.phone}
                    onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Shipping Address</label>
                <textarea 
                  rows={2}
                  required
                  value={checkoutForm.shippingAddress}
                  onChange={e => setCheckoutForm({...checkoutForm, shippingAddress: e.target.value})}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-stone-700">Payment Option</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${checkoutForm.paymentMethod === 'card' ? 'border-stone-900 bg-stone-50 font-medium' : 'border-stone-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={checkoutForm.paymentMethod === 'card'} 
                      onChange={() => setCheckoutForm({...checkoutForm, paymentMethod: 'card'})}
                    />
                    <span className="text-sm">Credit / Debit Card</span>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${checkoutForm.paymentMethod === 'cod' ? 'border-stone-900 bg-stone-50 font-medium' : 'border-stone-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={checkoutForm.paymentMethod === 'cod'} 
                      onChange={() => setCheckoutForm({...checkoutForm, paymentMethod: 'cod'})}
                    />
                    <span className="text-sm">Cash on Delivery (COD)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-sm">
                <span className="font-semibold text-stone-700">Total Payable ({cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span className="font-mono text-xl font-bold text-stone-900">${grandTotal.toLocaleString()}</span>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                Confirm & Place Order (${grandTotal.toLocaleString()})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI SHOPPING CONCIERGE CHAT DRAWER */}
      {isConciergeOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" onClick={() => setIsConciergeOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-stone-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-base font-bold">Gebyian AI Concierge</h2>
                    <p className="text-[11px] text-stone-400">Powered by Gemini 4 Hydrogen</p>
                  </div>
                </div>
                <button onClick={() => setIsConciergeOpen(false)} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-stone-50">
                {conciergeMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-stone-900 text-stone-100 rounded-br-none' 
                        : 'bg-white text-stone-800 border border-stone-200/80 shadow-sm rounded-bl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 text-stone-500 text-xs animate-pulse">
                      Consulting Gebyian network archives & style guides...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleAiSend} className="p-4 bg-white border-t border-stone-200 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask for recommendations, sizing, or styling..." 
                  value={conciergeInput}
                  onChange={e => setConciergeInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <button 
                  type="submit"
                  disabled={isAiLoading}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
