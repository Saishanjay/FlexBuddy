import React from 'react';
import { ActivePage, ProjectRequirements, TeamMember } from '../types';
import {
  LayoutDashboard,
  UserSearch,
  Users,
  MessageSquare,
  User,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  project: ProjectRequirements;
  teamMembers: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  project,
  teamMembers,
  isOpen,
  onClose,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'find-teammates' as ActivePage,
      label: 'Find Teammates',
      icon: UserSearch,
      badge: 'AI Match',
    },
    {
      id: 'my-team' as ActivePage,
      label: 'My Team',
      icon: Users,
      count: teamMembers.length,
    },
    {
      id: 'chat' as ActivePage,
      label: 'Messages',
      icon: MessageSquare,
      badge: '2',
    },
    {
      id: 'profile' as ActivePage,
      label: 'Profile',
      icon: User,
    },
  ];

  const handleNav = (page: ActivePage) => {
    setActivePage(page);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1">
                  FlexBuddy
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold block uppercase tracking-wider -mt-0.5">
                  AI Collaboration
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Main Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.id ||
                (item.id === 'find-teammates' && activePage === 'match-details');

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current Project Card in bottom of sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-800 truncate">
                {project.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 mb-2.5">
              {project.description}
            </p>
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
              <span>Team size:</span>
              <span className="font-bold text-indigo-700">
                {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
