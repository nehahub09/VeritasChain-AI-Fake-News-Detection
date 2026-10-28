import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = "cyan", badge }) {
  const colorStyles = {
    cyan: "border-cyan-900/50 from-cyan-950/20 to-slate-900/60 text-cyan-400 bg-cyan-500/10",
    rose: "border-rose-900/50 from-rose-950/20 to-slate-900/60 text-rose-400 bg-rose-500/10",
    emerald: "border-emerald-900/50 from-emerald-950/20 to-slate-900/60 text-emerald-400 bg-emerald-500/10",
    amber: "border-amber-900/50 from-amber-950/20 to-slate-900/60 text-amber-400 bg-amber-500/10",
    indigo: "border-indigo-900/50 from-indigo-950/20 to-slate-900/60 text-indigo-400 bg-indigo-500/10"
  };

  const currentStyle = colorStyles[color] || colorStyles.cyan;

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br border ${currentStyle} shadow-xl backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl ${currentStyle.split(' ').pop()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-2 font-medium">{subtitle}</p>}
    </div>
  );
}
