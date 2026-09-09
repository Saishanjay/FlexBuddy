import React from 'react';
import { ActivePage, UserProfile } from '../types';
import { Menu, Sparkles, Zap } from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  user: UserProfile;
  onOpenMobileMenu: () => void;
  backendStatus: { status: string; groqConfigured: boolean };
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  user,
  onOpenMobileMenu,
  backendStatus,
}) => {
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Dashboard & Discover';
      case 'find-teammates':
        return 'Find Teammates';
      case 'match-details':
        return 'Match Details';
      case 'my-team':
        return 'My Team';
      case 'chat':
        return 'Messages & Collaboration';
      case 'profile':
        return 'My Profile';
      default:
        return 'Dashboard';
    }
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base lg:text-lg font-bold text-slate-900 leading-tight">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            AI-powered teammate matching & hackathon collaboration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* AI Engine Status Pill */}
        <div
          title={
            backendStatus.groqConfigured
              ? 'Groq LLaMA 3.3 Active'
              : 'Smart Heuristic Fallback Active'
          }
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200/80 text-indigo-700"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {backendStatus.groqConfigured ? 'Groq AI Ready' : 'AI Engine Ready'}
          </span>
        </div>

        {/* Quick Action Button */}
        {activePage !== 'find-teammates' && (
          <button
            id="quick-find-team-btn"
            onClick={() => setActivePage('find-teammates')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Find My Team
          </button>
        )}

        {/* User profile snippet */}
        <button
          onClick={() => setActivePage('profile')}
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {initials}
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {user.name}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {user.role}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
