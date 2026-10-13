import React, { useState } from 'react';
import {
  FolderKanban,
  Calendar,
  BarChart3,
  Users,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Mail,
  User,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { DEFAULT_TEAM_MEMBERS } from '../data/defaultData.ts';

interface LoginPageProps {
  onNavigateHome?: () => void;
  onOpenDeveloperInfo?: () => void;
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateHome,
  onOpenDeveloperInfo,
  onLoginSuccess,
}) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    loginAsDemoUser,
    continueAsGuest,
    error,
    clearError,
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'quick' | 'email'>('quick');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onLoginSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubmitting(true);
    try {
      await signInWithEmail(emailInput, nameInput);
      onLoginSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectRole = (member: (typeof DEFAULT_TEAM_MEMBERS)[0]) => {
    loginAsDemoUser({
      uid: member.id,
      email: member.email,
      displayName: member.name,
      role: member.role,
    });
    onLoginSuccess?.();
  };

  const handleGuestEntry = () => {
    continueAsGuest();
    onLoginSuccess?.();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left cursor-pointer"
          title="Return to Home"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FolderKanban className="w-4 h-4" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white">
            Planning Master
          </span>
        </button>

        <div className="flex items-center gap-4">
          {onNavigateHome && (
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              ← Back to Home
            </button>
          )}

          <button
            onClick={handleGuestEntry}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Center Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-md space-y-6">
          {/* Main Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header Lockup */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2.5 py-1 rounded-full">
                <FolderKanban className="w-3 h-3" />
                <span>Project Management Tool</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Sign in to Planning Master
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Orchestrate project plans, assign tasks, enforce deadlines, and monitor team velocity in real time.
              </p>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setAuthMethod('quick')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                  authMethod === 'quick'
                    ? 'bg-slate-850 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Quick Access & Roles
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-1.5 rounded-lg font-medium transition-colors ${
                  authMethod === 'email'
                    ? 'bg-slate-850 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Work Email Login
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Authentication notice</span>
                </div>
                <p className="text-[11px] text-rose-300/90">{error}</p>
                <button
                  onClick={handleGuestEntry}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline block pt-0.5"
                >
                  Continue with Demo Workspace instead
                </button>
              </div>
            )}

            {/* Method 1: Quick Access & Roles */}
            {authMethod === 'quick' && (
              <div className="space-y-4 pt-1">
                {/* Google Sign-In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    or instant role sign-in
                  </span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                {/* Team Role Presets */}
                <div className="space-y-1.5">
                  <p className="text-[11px] text-slate-400 font-medium px-1">
                    Sign in as project team member:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {DEFAULT_TEAM_MEMBERS.slice(0, 3).map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleSelectRole(member)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
                            style={{ backgroundColor: member.avatarColor }}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <p className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                              {member.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          Enter <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Demo Mode Button */}
                <button
                  onClick={handleGuestEntry}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-850 text-slate-200 hover:text-white font-medium text-xs border border-slate-700/80 transition-all cursor-pointer"
                >
                  <span>Enter General Demo Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            )}

            {/* Method 2: Work Email Login */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailSignIn} className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="alex.rivera@planningmaster.io"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    Your Name (Optional)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !emailInput.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Trust badge */}
            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secured with Firebase Authentication & Cloud Firestore</span>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200 text-xs">
                <FolderKanban className="w-3.5 h-3.5 text-indigo-400" />
                <span>Kanban & List</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Visual pipeline lanes, sortable data grids, and drag status steppers.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200 text-xs">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Milestone Gantt</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Chronological roadmap with task duration and deadline pacing.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/60 space-y-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200 text-xs">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Velocity Health</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Burndown completion, overdue deadline alerts, and workload balancing.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Developer Info & Copyright */}
      <footer className="px-6 py-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2 max-w-4xl mx-auto w-full">
        <span>&copy; 2026 Planning Master. All rights reserved.</span>
        <div className="flex items-center gap-2">
          <span>Developed by</span>
          <button
            onClick={onOpenDeveloperInfo}
            className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors cursor-pointer"
          >
            Prem Parmar
          </button>
        </div>
      </footer>
    </div>
  );
};
