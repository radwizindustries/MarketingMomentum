import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { generateMarketingTip } from '../services/geminiService';
import { Loader2, Trophy, Briefcase, RotateCcw, CheckCircle2 } from 'lucide-react';

interface LeaderboardFormProps {
  finalRoi: number;
  finalCustomers: number;
  onRestart: () => void;
}

const CHALLENGES = [
  "Need More Leads",
  "Low Website Traffic",
  "Poor Brand Recognition",
  "Inconsistent Marketing",
  "Other"
];

const LeaderboardForm: React.FC<LeaderboardFormProps> = ({ finalRoi, finalCustomers, onRestart }) => {
  const [step, setStep] = useState<'FORM' | 'LEADERBOARD'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<LeaderboardEntry | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    challenge: CHALLENGES[0]
  });

  // Load leaderboard from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('marketMomentumLeaderboard');
    if (stored) {
      setLeaderboard(JSON.parse(stored));
    } else {
      // Seed data
      setLeaderboard([
        { businessName: "Apex Digital", score: 85000, customers: 85, challenge: "Growth" },
        { businessName: "Creative Co", score: 62000, customers: 60, challenge: "Branding" },
        { businessName: "Local Eats", score: 45000, customers: 45, challenge: "Traffic" },
      ]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call / Webform Submission
    // In a real app, this would be a fetch() to your CRM/Email endpoint
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate AI Tip using Gemini
    const tip = await generateMarketingTip(
        formData.businessName, 
        formData.challenge, 
        finalRoi
    );

    const newEntry: LeaderboardEntry = {
      businessName: formData.businessName,
      score: finalRoi,
      customers: finalCustomers,
      challenge: formData.challenge,
      aiTip: tip
    };

    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    localStorage.setItem('marketMomentumLeaderboard', JSON.stringify(newLeaderboard));
    setLeaderboard(newLeaderboard);
    setCurrentEntry(newEntry);
    setStep('LEADERBOARD');
    setIsSubmitting(false);
  };

  if (step === 'FORM') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl mx-auto border-4 border-brand-dark/10 animate-in fade-in zoom-in duration-300">
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
            
            {/* Left Side: Stats */}
            <div className="w-full md:w-1/3 text-center border-r border-slate-100 pr-0 md:pr-4">
                <h2 className="text-2xl font-bold text-brand-dark mb-4 font-serif">Great Job!</h2>
                <div className="space-y-4">
                    <div className="bg-brand-lime/10 p-4 rounded-lg border border-brand-lime/30">
                        <div className="text-xs text-brand-dark font-semibold font-sans uppercase tracking-wide">Est. Revenue</div>
                        <div className="text-4xl font-black text-brand-dark font-serif tracking-tight">${finalRoi.toLocaleString()}</div>
                    </div>
                    <div className="bg-brand-cyan/10 p-4 rounded-lg border border-brand-cyan/30">
                        <div className="text-xs text-brand-dark font-semibold font-sans uppercase tracking-wide">New Patients</div>
                        <div className="text-4xl font-black text-brand-cyan font-serif tracking-tight">{finalCustomers}</div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-2/3">
                 <p className="text-slate-600 mb-4 text-sm font-sans">
                  Enter your details to save your score and receive a <b>custom AI marketing tip</b> for your practice.
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-brand-dark uppercase mb-1 font-sans">Business Name</label>
                        <input
                        required
                        type="text"
                        placeholder="Unity Clinic"
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-cyan outline-none font-sans bg-white text-brand-dark shadow-sm"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase mb-1 font-sans">Contact Name</label>
                        <input
                        required
                        type="text"
                        placeholder="Dr. Smith"
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-cyan outline-none font-sans bg-white text-brand-dark shadow-sm"
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase mb-1 font-sans">Phone</label>
                        <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-cyan outline-none font-sans bg-white text-brand-dark shadow-sm"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase mb-1 font-sans">Email</label>
                        <input
                        required
                        type="email"
                        placeholder="doctor@clinic.com"
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-cyan outline-none font-sans bg-white text-brand-dark shadow-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-brand-dark uppercase mb-1 font-sans">Marketing Challenge</label>
                        <select
                        className="w-full p-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-cyan outline-none bg-white text-brand-dark font-sans shadow-sm"
                        value={formData.challenge}
                        onChange={(e) => setFormData({...formData, challenge: e.target.value})}
                        >
                        {CHALLENGES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="md:col-span-2 mt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-brand-cyan hover:bg-cyan-600 text-white font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-sans shadow-md"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Submit & View Results'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-3xl mx-auto border-4 border-brand-dark/10 animate-in fade-in zoom-in duration-300 font-sans max-h-[80vh] overflow-y-auto">
        
        {/* Success Banner */}
        <div className="bg-brand-lime/20 text-brand-dark border border-brand-lime/50 p-3 rounded-lg mb-6 flex items-center gap-3">
             <CheckCircle2 className="text-green-600 w-6 h-6" />
             <div>
                <p className="font-bold text-sm">Score Submitted Successfully!</p>
                <p className="text-xs">One of our specialists will review your results and contact you shortly.</p>
             </div>
        </div>

        {/* AI Tip Section */}
        {currentEntry?.aiTip && (
            <div className="mb-6 bg-brand-cyan/5 border border-brand-cyan/20 p-4 rounded-lg relative">
                <div className="absolute -top-3 -left-2 bg-brand-cyan text-white text-xs font-bold px-2 py-1 rounded shadow font-sans">
                    AI CONSULTANT SAYS
                </div>
                <p className="text-brand-dark italic mt-2 font-serif text-lg">
                    "{currentEntry.aiTip}"
                </p>
            </div>
        )}

        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2 font-serif">
                <Trophy className="text-yellow-500" /> Top Practices
            </h3>
            <button 
                onClick={onRestart}
                className="text-sm text-brand-cyan font-semibold hover:underline flex items-center gap-1 font-sans"
            >
                <RotateCcw className="w-4 h-4" /> Play Again
            </button>
        </div>

        <div className="space-y-1 mb-6 overflow-y-auto max-h-60 pr-2">
            <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase border-b pb-2 font-sans sticky top-0 bg-white">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Business</div>
                <div className="col-span-3 text-right">Customers</div>
                <div className="col-span-3 text-right">ROI Score</div>
            </div>
            {leaderboard.map((entry, idx) => (
                <div 
                    key={idx} 
                    className={`grid grid-cols-12 py-2.5 items-center font-sans text-sm ${
                        entry.businessName === formData.businessName && entry.score === finalRoi 
                        ? 'bg-brand-lime/20 border-l-4 border-brand-lime -mx-2 px-2 rounded-r' 
                        : 'border-b border-slate-50 hover:bg-slate-50'
                    }`}
                >
                    <div className="col-span-1 text-center font-bold text-slate-500">{idx + 1}</div>
                    <div className="col-span-5 font-medium text-brand-dark truncate">{entry.businessName}</div>
                    <div className="col-span-3 text-right text-slate-600">{entry.customers}</div>
                    <div className="col-span-3 text-right font-bold text-brand-cyan">${entry.score.toLocaleString()}</div>
                </div>
            ))}
        </div>

        <div className="text-center bg-slate-50 p-5 rounded-xl">
            <h4 className="font-bold text-lg text-brand-dark mb-1 font-serif">Ready to improve your real-world ROI?</h4>
            <p className="text-slate-600 text-xs mb-3 font-sans">Our team of experts can help you navigate the market.</p>
            <button 
                className="bg-brand-lime hover:bg-lime-500 text-brand-dark px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 flex items-center gap-2 mx-auto font-sans text-sm shadow-lg"
                onClick={() => window.open('mailto:brian@aihealthcaremarketing.com?subject=Consultation Request')}
            >
                <Briefcase className="w-4 h-4" /> Schedule Free Consultation
            </button>
        </div>
    </div>
  );
};

export default LeaderboardForm;