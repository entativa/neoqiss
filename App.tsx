
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { TheGeniusLoop, TechStackFlow, HustleMetrics } from './components/Diagrams';
import { CodeArena, PatronModal, AccountingSimulator } from './components/Interactive';
import { FeaturedMerch, ShopPage } from './components/Shop';
import { ArrowDown, Menu, X, Terminal, Music, Car, Code, Heart, Briefcase, ShoppingBag } from 'lucide-react';

const SkillCard = ({ title, skills, delay }: { title: string, skills: string, delay: string }) => {
  return (
    <div className="flex flex-col group animate-fade-in-up items-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 w-full max-w-xs hover:border-nobel-gold/50" style={{ animationDelay: delay }}>
      <h3 className="font-serif text-2xl text-stone-900 text-center mb-3">{title}</h3>
      <div className="w-12 h-0.5 bg-nobel-gold mb-4 opacity-60"></div>
      <p className="text-xs text-stone-500 font-bold uppercase tracking-widest text-center leading-relaxed">{skills}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'shop'>('home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    if (currentView === 'shop') {
        setCurrentView('home');
        // Allow time for render before scrolling
        setTimeout(() => {
             const element = document.getElementById(id);
             if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
    }
  };

  // If viewing shop, render ShopPage only
  if (currentView === 'shop') {
      return <ShopPage onBack={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-stone-800 selection:bg-nobel-gold selection:text-white">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#F9F8F4]/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 bg-nobel-gold rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm pb-1">N</div>
            <span className={`font-serif font-bold text-lg tracking-wide transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}>
              NEO QISS <span className="font-normal text-stone-500">2004</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
            <a href="#origin" onClick={scrollToSection('origin')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">Origin</a>
            <a href="#stack" onClick={scrollToSection('stack')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">Stack</a>
            <a href="#arena" onClick={scrollToSection('arena')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">Arena</a>
            <a href="#ledger" onClick={scrollToSection('ledger')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">Ledger</a>
            <button onClick={() => setCurrentView('shop')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase flex items-center gap-1">
                <ShoppingBag size={14} /> Merch
            </button>
            <button 
                onClick={() => setShowDonateModal(true)}
                className="px-5 py-2 bg-stone-900 text-white rounded-full hover:bg-nobel-gold transition-colors shadow-sm flex items-center gap-2"
            >
              <Heart size={14} className="fill-current" />
              <span>Support</span>
            </button>
          </div>

          <button className="md:hidden text-stone-900 p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#F9F8F4] flex flex-col items-center justify-center gap-8 text-xl font-serif animate-fade-in">
            <a href="#origin" onClick={scrollToSection('origin')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">Origin</a>
            <a href="#stack" onClick={scrollToSection('stack')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">Stack</a>
            <a href="#arena" onClick={scrollToSection('arena')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">The Arena</a>
            <a href="#ledger" onClick={scrollToSection('ledger')} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">The Ledger</a>
            <button onClick={() => { setCurrentView('shop'); setMenuOpen(false); }} className="hover:text-nobel-gold transition-colors cursor-pointer uppercase">Merch Store</button>
            <button onClick={() => { setShowDonateModal(true); setMenuOpen(false); }} className="text-nobel-gold font-bold uppercase">Support The Loop</button>
        </div>
      )}

      {/* Donation Modal */}
      {showDonateModal && (
        <PatronModal isOpen={showDonateModal} onClose={() => setShowDonateModal(false)} />
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.92)_0%,rgba(249,248,244,0.6)_50%,rgba(249,248,244,0.3)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-block mb-4 px-3 py-1 border border-nobel-gold text-nobel-gold text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30">
            Born July 22, 2004
          </div>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl font-medium leading-tight md:leading-[0.9] mb-8 text-stone-900 drop-shadow-sm">
            Neo Qiss <br/><span className="italic font-normal text-stone-600 text-2xl md:text-4xl block mt-6">"My code is so bad it loops back around to genius"</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-stone-700 font-light leading-relaxed mb-12">
            Full-stack programmer. Chartered Accountant Student. Ride-hail Driver.<br/>
            Based in Alexandra, Johannesburg.
          </p>
          
          <div className="flex justify-center">
             <a href="#origin" onClick={scrollToSection('origin')} className="group flex flex-col items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">
                <span>ENTER THE LOOP</span>
                <span className="p-2 border border-stone-300 rounded-full group-hover:border-stone-900 transition-colors bg-white/50">
                    <ArrowDown size={16} />
                </span>
             </a>
          </div>
        </div>
      </header>

      <main>
        {/* Origin Story */}
        <section id="origin" className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">The Origin</div>
              <h2 className="font-serif text-4xl mb-6 leading-tight text-stone-900">From Alex to the World</h2>
              <div className="w-16 h-1 bg-nobel-gold mb-6"></div>
              
               {/* Profile Image Placeholder */}
               <div className="relative w-full aspect-[4/5] bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-lg mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop" 
                    alt="Neo Qiss" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-stone-900/80 backdrop-blur-sm p-4 text-white">
                    <p className="font-serif text-lg">Neo Qiss</p>
                    <p className="text-xs uppercase tracking-widest text-nobel-gold">21 Years Old</p>
                  </div>
               </div>
            </div>
            <div className="md:col-span-8 text-lg text-stone-600 leading-relaxed space-y-6">
              <p>
                <span className="text-5xl float-left mr-3 mt-[-8px] font-serif text-nobel-gold">I</span> am Neo Qiss. A 21-year-old creative from Alexandra, Johannesburg. I exist at the intersection of extreme discipline and creative chaos.
              </p>
              <p>
                By day, I study <strong>BAcc towards CA(SA)</strong>, navigating the structured world of finance. By night, I break things. I am a full-stack programmer addicted to complexity, currently mastering <strong className="text-stone-900">Kotlin, Swift, Rust, and SQL</strong>.
              </p>
              <p>
                I don't have a traditional setup. I build projects in my shack, funded by driving borrowed cars for ride-hailing apps. I don't have many friends, and I don't talk much. I let the code speak—even when it's so bad it needs a citation.
              </p>
              <div className="p-8 bg-[#F9F8F4] border-l-4 border-nobel-gold mt-8 rounded-r-lg">
                 <p className="font-serif italic text-xl text-stone-800 mb-2">"I'm addicted to complexity and I'm gonna ship something soon."</p>
              </div>
            </div>
          </div>
        </section>

        {/* The Stack */}
        <section id="stack" className="py-24 bg-white border-t border-stone-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-200">
                            <Terminal size={14}/> THE ARSENAL
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">The Tech Stack</h2>
                        <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                           I don't just write code; I wrestle with it. My expertise spans the full spectrum of modern development, with a special focus on systems programming and mobile architecture.
                        </p>
                        <ul className="space-y-4 mt-8">
                            <li className="flex items-center gap-4 text-stone-800 font-medium">
                                <span className="w-2 h-2 bg-nobel-gold rounded-full"></span>
                                Kotlin & Swift (Mobile Mastery)
                            </li>
                            <li className="flex items-center gap-4 text-stone-800 font-medium">
                                <span className="w-2 h-2 bg-nobel-gold rounded-full"></span>
                                Rust (Safety & Speed)
                            </li>
                            <li className="flex items-center gap-4 text-stone-800 font-medium">
                                <span className="w-2 h-2 bg-nobel-gold rounded-full"></span>
                                SQL & DevOps (The Backbone)
                            </li>
                             <li className="flex items-center gap-4 text-stone-800 font-medium">
                                <span className="w-2 h-2 bg-nobel-gold rounded-full"></span>
                                Complexity (The Addiction)
                            </li>
                        </ul>
                    </div>
                    <div>
                        <TechStackFlow />
                    </div>
                </div>
            </div>
        </section>

        {/* The Code Arena */}
        <section id="arena" className="py-24 bg-[#252526] text-stone-100 border-y border-stone-700">
             <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 text-nobel-gold text-xs font-bold tracking-widest uppercase rounded-full mb-4 border border-stone-700">
                       <Code size={14}/> The Playground
                    </div>
                    <h2 className="font-serif text-4xl md:text-5xl mb-4 text-white">Genius In Action</h2>
                    <p className="text-lg text-stone-400 max-w-2xl mx-auto">
                        Solving the world's hardest interview questions with the "Neo Approach". 
                        Select a challenge below, examine the logic, and execute the solution.
                    </p>
                </div>
                
                <CodeArena />
             </div>
        </section>

        {/* Accounting Simulator */}
        <section id="ledger" className="py-24 bg-[#F9F8F4] text-stone-900 border-b border-stone-200">
             <div className="container mx-auto px-6">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 items-center">
                      <div className="lg:col-span-2">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200 text-stone-600 text-xs font-bold tracking-widest uppercase rounded-full mb-4 border border-stone-300">
                             <Briefcase size={14}/> The BAcc Candidate
                          </div>
                          <h2 className="font-serif text-4xl md:text-5xl mb-4 text-stone-900">GAAP & Grit</h2>
                          <p className="text-lg text-stone-600 max-w-2xl">
                              It's not just about coding. As a future CA(SA), I speak the language of business. 
                              Explore the interactive Double-Entry Engine below to see how I balance the books of my chaotic life.
                          </p>
                      </div>
                 </div>
                 
                 <AccountingSimulator />
             </div>
        </section>

        {/* The Loop */}
        <section className="py-24 bg-stone-900 text-stone-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="w-96 h-96 rounded-full bg-stone-600 blur-[100px] absolute top-[-100px] left-[-100px]"></div>
                <div className="w-96 h-96 rounded-full bg-nobel-gold blur-[100px] absolute bottom-[-100px] right-[-100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="order-2 lg:order-1">
                        <TheGeniusLoop />
                     </div>
                     <div className="order-1 lg:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 text-nobel-gold text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-700">
                            <Code size={14}/> THE PARADOX
                        </div>
                        <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">The Genius Loop</h2>
                        <p className="text-lg text-stone-400 mb-6 leading-relaxed">
                            They say genius is 1% inspiration and 99% perspiration. For me, it's 100% iteration. My code often starts terrible—spaghetti logic, memory leaks, and questionable variable names.
                        </p>
                        <p className="text-lg text-stone-400 leading-relaxed">
                             But I iterate. I refactor. I obsess. Eventually, the code loops back around. The bugs become features. The mess becomes an abstraction layer. Citation is needed, but the results speak for themselves.
                        </p>
                     </div>
                </div>
            </div>
        </section>

        {/* The Hustle */}
        <section id="hustle" className="py-24 bg-[#F9F8F4]">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="font-serif text-4xl md:text-5xl mb-6 text-stone-900">Funding The Vision</h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Great projects require resources. I don't have investors; I have grit. I borrow cars to do ride-hailing in Johannesburg, turning kilometers into cloud credits and hardware upgrades for my shack.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto">
                    <HustleMetrics />
                </div>
            </div>
        </section>

        {/* NEW FEATURED MERCH SECTION */}
        <FeaturedMerch onOpenShop={() => { setCurrentView('shop'); window.scrollTo(0,0); }} />

        {/* The Mind / Impact */}
        <section id="mind" className="py-24 bg-white border-t border-stone-200">
             <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-5 relative">
                    <div className="aspect-square bg-[#F5F4F0] rounded-xl overflow-hidden relative border border-stone-200 shadow-inner">
                        <QuantumComputerScene />
                        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-stone-400 font-serif italic">Visualizing the Complexity Engine (My Brain)</div>
                    </div>
                </div>
                <div className="md:col-span-7 flex flex-col justify-center">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">HIDDEN TALENT</div>
                    <h2 className="font-serif text-4xl mb-6 text-stone-900">The Lyricist</h2>
                    <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                        When nobody's watching, the IDE closes and the beat drops. Inspired by <strong>Eminem</strong>, I channel my creativity into rap.
                    </p>
                    <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                        Coding and rapping are the same to me. Both require rhythm, syntax, flow, and the ability to handle complexity without choking. I build rhyme schemes like I build database schemas—intricate, dense, and designed to perform.
                    </p>
                    
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-full bg-stone-100 text-stone-600">
                            <Music size={24} />
                        </div>
                        <div className="flex-1">
                             <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-nobel-gold w-3/4"></div>
                             </div>
                             <div className="flex justify-between text-xs font-bold text-stone-500 mt-2 uppercase tracking-wider">
                                <span>Creativity Level</span>
                                <span>Over 9000</span>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
        </section>

        {/* Skills/Footer Area */}
        <section className="py-24 bg-[#F5F4F0] border-t border-stone-300">
           <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-block mb-3 text-xs font-bold tracking-widest text-stone-500 uppercase">CAPABILITIES</div>
                    <h2 className="font-serif text-3xl md:text-5xl mb-4 text-stone-900">The Skill Set</h2>
                </div>
                
                <div className="flex flex-col md:flex-row gap-8 justify-center items-center flex-wrap">
                    <SkillCard 
                        title="Mobile Dev" 
                        skills="Kotlin • Swift • React Native" 
                        delay="0s" 
                    />
                    <SkillCard 
                        title="Systems" 
                        skills="Rust • C++ • Optimization" 
                        delay="0.1s" 
                    />
                    <SkillCard 
                        title="Backend" 
                        skills="SQL • Node • DevOps" 
                        delay="0.2s" 
                    />
                    <SkillCard 
                        title="Finance" 
                        skills="Accounting • CA(SA) Candidate" 
                        delay="0.3s" 
                    />
                </div>
           </div>
        </section>

        {/* Support Call to Action */}
        <section className="py-16 bg-nobel-gold text-white">
           <div className="container mx-auto px-6 text-center">
              <h2 className="font-serif text-3xl mb-4">Believe in the Potential?</h2>
              <p className="max-w-2xl mx-auto mb-8 opacity-90">
                Whether it's covering tuition fees, upgrading hardware, or just buying a coffee to keep the ride-hailing going.
              </p>
              <button onClick={() => setShowDonateModal(true)} className="px-8 py-3 bg-white text-stone-900 font-bold uppercase tracking-widest rounded hover:bg-stone-100 transition-colors shadow-lg inline-flex items-center gap-2">
                  <Heart size={18} fill="#C5A059" className="text-nobel-gold" />
                  <span>Make a Donation</span>
              </button>
           </div>
        </section>

      </main>

      <footer className="bg-stone-900 text-stone-400 py-16">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <div className="text-white font-serif font-bold text-2xl mb-2">Neo Qiss</div>
                <p className="text-sm">"This is not even a portfolio website, it's just a biosite."</p>
            </div>
            <div className="flex gap-6 text-sm font-medium">
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Email</a>
            </div>
        </div>
        <div className="text-center mt-12 text-xs text-stone-600">
            © 2024 Neo Qiss. Made with borrowed cars and complexity.
        </div>
      </footer>
    </div>
  );
};

export default App;
