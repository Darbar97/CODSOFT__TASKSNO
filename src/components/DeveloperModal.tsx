import React from 'react';
import { X, Code2, Mail, Shield, CheckCircle2, Heart, Award } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-xs text-slate-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Developer & System Info</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Developer Profile Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold text-lg">
              PP
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-sm">Prem Parmar</h4>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-800/60 font-medium">
                  Author
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Lead Full-Stack Software Engineer</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-300">
                <Mail className="w-3 h-3 text-slate-500" />
                <a
                  href="mailto:premparmar9161@gmail.com"
                  className="hover:text-indigo-400 transition-colors underline font-mono"
                >
                  premparmar9161@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Architecture & Tech Stack */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Technology Stack
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-850">
                <span className="text-slate-500 block text-[10px]">Frontend UI</span>
                <span className="font-medium text-slate-200">React 19 & Tailwind CSS</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-850">
                <span className="text-slate-500 block text-[10px]">Server & API</span>
                <span className="font-medium text-slate-200">Node.js Express & TSX</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-850">
                <span className="text-slate-500 block text-[10px]">Cloud Database</span>
                <span className="font-medium text-slate-200">Google Cloud Firestore</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-850">
                <span className="text-slate-500 block text-[10px]">AI Copilot</span>
                <span className="font-medium text-slate-200">Google Gemini API</span>
              </div>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 text-xs">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copyright & Rights Reservation</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              &copy; 2026 <strong>Planning Master</strong>. Developed and designed with excellence by <strong>Prem Parmar</strong>. All rights reserved.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
