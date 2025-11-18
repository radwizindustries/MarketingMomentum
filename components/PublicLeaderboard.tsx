import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { Trophy, Star, User } from 'lucide-react';

const PublicLeaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('marketMomentumLeaderboard');
    if (stored) {
      setEntries(JSON.parse(stored));
    } else {
      // Default data matching LeaderboardForm initial state
      setEntries([
        { businessName: "Apex Digital", score: 85000, customers: 85, challenge: "Growth" },
        { businessName: "Creative Co", score: 62000, customers: 60, challenge: "Branding" },
        { businessName: "Local Eats", score: 45000, customers: 45, challenge: "Traffic" },
      ]);
    }
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-brand-dark text-white p-4 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-serif font-bold text-lg">Top Performing Practices</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-sans text-xs font-bold">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Practice</th>
              <th className="px-4 py-3 text-right">Patients Acquired</th>
              <th className="px-4 py-3 text-right">ROI Value</th>
              <th className="px-4 py-3">Challenge Overcome</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-bold text-slate-400 w-16">
                    {idx === 0 && <Star className="inline w-4 h-4 text-yellow-500 mr-1" />}
                    #{idx + 1}
                </td>
                <td className="px-4 py-3 font-medium text-brand-dark flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-300" />
                    {entry.businessName}
                </td>
                <td className="px-4 py-3 text-right text-slate-600 font-medium">{entry.customers}</td>
                <td className="px-4 py-3 text-right font-bold text-brand-cyan">${entry.score.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500 italic">{entry.challenge}</td>
              </tr>
            ))}
            {entries.length === 0 && (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-400">No entries yet. Be the first to play!</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicLeaderboard;