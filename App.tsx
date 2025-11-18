import React, { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import LeaderboardForm from './components/LeaderboardForm';
import PublicLeaderboard from './components/PublicLeaderboard';
import { GameState } from './types';
import { GAME_DURATION } from './constants';
import { DollarSign, Users, Timer, Activity, ArrowRight, CheckCircle, BarChart3 } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState({ revenue: 0, customers: 0 });
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const handleStart = useCallback(() => {
    setScore({ revenue: 0, customers: 0 });
    setTimeLeft(GAME_DURATION);
    setGameState('PLAYING');
  }, []);

  const handleRestart = useCallback(() => {
    setGameState('START');
  }, []);

  const handleScoreUpdate = useCallback((revenue: number, customers: number) => {
    setScore({ revenue, customers });
  }, []);

  const handleTimeUpdate = useCallback((time: number) => {
    setTimeLeft(time);
  }, []);

  const scrollToLeaderboard = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('leaderboard-section');
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-brand-dark font-sans">
      {/* Brand Header - Matches AI Healthcare Marketing */}
      <header className="bg-brand-dark py-5 border-b border-slate-800 sticky top-0 z-50">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="flex items-center gap-3">
            <img 
                src="https://aihealthcaremarketing.com/wp-content/uploads/2023/04/Ai-Healthcare-Marketing-Logo-White.png" 
                alt="AI Healthcare Marketing" 
                className="h-10 md:h-12"
            />
          </a>
          
          {/* Cleaned up navigation with Leaderboard Link */}
          <nav className="hidden md:flex items-center gap-8 text-slate-300 font-medium text-sm font-sans">
              <a href="#leaderboard-section" onClick={scrollToLeaderboard} className="hover:text-brand-cyan transition-colors flex items-center gap-2">
                  <BarChart3 size={16} /> Leaderboard
              </a>
          </nav>

          <button className="hidden md:flex items-center gap-2 bg-brand-cyan hover:bg-cyan-500 text-white px-6 py-3 rounded-full text-sm font-bold font-sans transition-all shadow-lg hover:shadow-cyan-900/50">
            Book Strategy Call <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero / Game Section */}
      <div className="relative w-full bg-brand-dark overflow-hidden">
          {/* Game HUD - Floating Overlay */}
          <div className="absolute top-6 left-0 right-0 z-30 pointer-events-none">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 max-w-5xl mx-auto pointer-events-auto overflow-hidden">
                    {/* Header for HUD */}
                    <div className="bg-brand-dark text-white px-6 py-2 md:py-0 flex items-center justify-center md:justify-start font-serif font-bold text-sm md:w-40 text-center md:text-left">
                        Your Practice
                    </div>
                    
                    <div className="flex-1 flex flex-wrap gap-4 justify-between items-center p-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-brand-lime/20 p-3 rounded-full shadow-inner"><DollarSign className="text-brand-dark w-6 h-6" /></div>
                            <div>
                                <div className="text-xs text-slate-500 font-extrabold uppercase tracking-wider font-sans">Est. Revenue</div>
                                <div className="text-3xl font-black text-brand-dark tracking-tight font-serif">${score.revenue.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-4">
                            <div className="bg-brand-cyan/20 p-3 rounded-full shadow-inner"><Users className="text-brand-cyan w-6 h-6" /></div>
                            <div>
                                <div className="text-xs text-slate-500 font-extrabold uppercase tracking-wider font-sans">New Patients</div>
                                <div className="text-3xl font-black text-brand-dark tracking-tight font-serif">{score.customers}</div>
                            </div>
                        </div>
                        <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                        <div className="flex items-center gap-4 ml-auto">
                            <div className={`p-3 rounded-full shadow-inner ${timeLeft < 10 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                                <Timer className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 font-extrabold uppercase tracking-wider font-sans">Time Remaining</div>
                                <div className={`text-3xl font-black font-serif ${timeLeft < 10 ? 'text-red-500' : 'text-brand-dark'}`}>
                                    00:{timeLeft.toString().padStart(2, '0')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Game Container - Full Width */}
          <div className="relative w-full aspect-[21/9] max-h-[80vh]">
            {/* Overlays */}
            {gameState === 'GAME_OVER' || gameState === 'SUBMITTED' ? (
              <div className="absolute inset-0 z-40 flex items-center justify-center bg-brand-dark/90 backdrop-blur-md p-4 overflow-y-auto">
                 <div className="w-full max-w-4xl my-auto">
                    <LeaderboardForm 
                        finalRoi={score.revenue} 
                        finalCustomers={score.customers} 
                        onRestart={handleRestart} 
                    />
                 </div>
              </div>
            ) : null}

            {gameState === 'START' && (
               <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white p-6 text-center">
                  <div className="bg-brand-dark/80 p-8 rounded-3xl border border-brand-cyan/30 shadow-2xl max-w-2xl backdrop-blur-md">
                    <div className="w-20 h-20 bg-brand-cyan rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-cyan-500/40 rotate-3 hover:rotate-6 transition-transform">
                        <Activity size={40} className="text-white" />
                    </div>
                    <h2 className="text-5xl font-black mb-4 text-white tracking-tight leading-tight font-serif">
                        Grow Your <span className="text-brand-cyan">Practice</span>
                    </h2>
                    <p className="text-blue-100 mb-8 text-lg font-medium max-w-lg mx-auto font-sans">
                        Catch the right marketing channels to attract new patients ($1500 value each) and fill your waiting room before time runs out!
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8 text-left text-sm font-sans">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                            <span className="text-2xl">📬</span> 
                            <div><span className="font-bold block text-brand-lime">Direct Mail</span><span className="text-white/60 text-xs">Acquire Leads</span></div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                            <span className="text-2xl">💻</span> 
                            <div><span className="font-bold block text-brand-lime">SEO & Web</span><span className="text-white/60 text-xs">Boost Traffic</span></div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                            <span className="text-2xl">📈</span> 
                            <div><span className="font-bold block text-brand-lime">Online Ads</span><span className="text-white/60 text-xs">Fast Growth</span></div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors">
                            <span className="text-2xl">✂️</span> 
                            <div><span className="font-bold block text-red-400">Avoid Cuts</span><span className="text-white/60 text-xs">Don't lose momentum</span></div>
                        </div>
                    </div>

                    <button 
                        onClick={handleStart}
                        className="w-full bg-brand-cyan hover:bg-cyan-500 text-white text-xl font-bold py-4 rounded-xl shadow-xl shadow-cyan-900/50 transform transition hover:scale-[1.02] ring-4 ring-cyan-500/20 font-serif"
                    >
                        Start Game
                    </button>
                  </div>
               </div>
            )}

            <GameCanvas 
                gameState={gameState} 
                setGameState={setGameState} 
                onScoreUpdate={handleScoreUpdate} 
                onTimeUpdate={handleTimeUpdate}
            />
          </div>
      </div>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
               <div className="inline-block bg-brand-lime/20 text-brand-dark font-bold px-4 py-1 rounded-full text-xs uppercase tracking-wider mb-4 font-sans">
                  Proven Results
               </div>
               <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark mb-6 leading-tight font-serif">
                 Stop Playing Games With Your <span className="text-brand-cyan">ROI</span>
               </h2>
               <p className="text-lg text-slate-600 mb-8 leading-relaxed font-sans">
                 While catching falling icons is fun, building a sustainable patient acquisition engine requires a strategic partner. At AI Healthcare Marketing, we leverage data-driven insights and artificial intelligence to maximize your practice's growth.
               </p>
               
               <div className="grid grid-cols-2 gap-8 mb-8">
                   <div>
                       <div className="text-5xl font-black text-brand-dark mb-1 font-serif">25%</div>
                       <div className="text-sm font-bold text-slate-500 uppercase tracking-wide font-sans">Avg. Patient Growth</div>
                   </div>
                   <div>
                       <div className="text-5xl font-black text-brand-dark mb-1 font-serif">3.5x</div>
                       <div className="text-sm font-bold text-slate-500 uppercase tracking-wide font-sans">Return on Ad Spend</div>
                   </div>
               </div>

               <button className="bg-brand-dark hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl font-sans">
                  Get Your Marketing Plan <ArrowRight size={18} />
               </button>
            </div>
            
            <div className="bg-slate-50 p-8 lg:p-10 rounded-3xl border border-slate-100 shadow-xl">
                <h3 className="font-bold text-brand-dark mb-8 text-2xl font-serif">Comprehensive Care For Your Brand</h3>
                <ul className="space-y-6">
                    {[
                        { title: "Search Engine Optimization", desc: "Dominate local search results for high-value keywords." },
                        { title: "High-Conversion Web Design", desc: "Mobile-first sites built to turn visitors into appointments." },
                        { title: "Patient Reactivation", desc: "Automated systems to bring dormant patients back." },
                        { title: "Reputation Management", desc: "Build trust with 5-star reviews on autopilot." }
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-4">
                            <CheckCircle className="text-brand-lime w-6 h-6 mt-1 flex-shrink-0" /> 
                            <div>
                                <div className="font-bold text-brand-dark text-lg font-serif">{item.title}</div>
                                <div className="text-slate-500 leading-relaxed font-sans">{item.desc}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          {/* Public Leaderboard Section */}
          <div id="leaderboard-section" className="scroll-mt-24">
             <div className="text-center mb-10">
                 <h2 className="text-3xl font-bold text-brand-dark font-serif mb-4">Community Leaderboard</h2>
                 <p className="text-slate-500">See how your practice stacks up against other healthcare providers.</p>
             </div>
             <PublicLeaderboard />
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;