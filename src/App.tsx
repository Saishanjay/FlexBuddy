import React, { useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  ProjectRequirements,
  Candidate,
  MatchResult,
  TeamMember as TeamMemberType,
  ActivePage,
} from './types';
import {
  INITIAL_USER_PROFILE,
  INITIAL_PROJECT,
  DEMO_CANDIDATES,
} from './data/users';
import {
  fetchMatches,
  clientSideFallbackMatch,
  checkBackendHealth,
} from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { FindTeammates } from './pages/FindTeammates';
import { MatchDetails } from './pages/MatchDetails';
import { MyTeam } from './pages/MyTeam';
import { Profile } from './pages/Profile';
import { Chat } from './pages/Chat';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // 1. Persistent User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('flexbuddy_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  // 2. Persistent Project Requirements
  const [project, setProject] = useState<ProjectRequirements>(() => {
    const saved = localStorage.getItem('flexbuddy_project');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROJECT;
  });

  // 3. Persistent Team Members
  const [teamMembers, setTeamMembers] = useState<TeamMemberType[]>(() => {
    const saved = localStorage.getItem('flexbuddy_team_members');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default team setup: Arun (You/Lead) + Priya (Frontend Developer)
    return [
      {
        id: INITIAL_USER_PROFILE.id,
        name: INITIAL_USER_PROFILE.name,
        role: INITIAL_USER_PROFILE.role,
        skills: INITIAL_USER_PROFILE.skills,
        location: INITIAL_USER_PROFILE.location,
        connectedAt: new Date().toISOString(),
        isOwner: true,
      },
      {
        id: '1',
        name: 'Priya',
        role: 'Frontend Developer',
        skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Figma'],
        location: 'Chennai',
        connectedAt: new Date().toISOString(),
        isOwner: false,
      },
    ];
  });

  // 4. Candidate pool
  const [candidates] = useState<Candidate[]>(DEMO_CANDIDATES);

  // 5. Matches state
  const [matches, setMatches] = useState<MatchResult[]>(() =>
    clientSideFallbackMatch(user, project, candidates)
  );

  // 6. Navigation and UI State
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [selectedCandidateData, setSelectedCandidateData] = useState<{
    candidate: Candidate;
    match: MatchResult;
  } | null>(null);

  const [selectedChatPartnerId, setSelectedChatPartnerId] = useState<string | undefined>('1');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [engineUsed, setEngineUsed] = useState<string>('groq-ai');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 7. Backend Health status
  const [backendStatus, setBackendStatus] = useState({
    status: 'checking',
    groqConfigured: false,
  });

  // Check health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendStatus({
        status: res.status || 'ok',
        groqConfigured: Boolean(res.groqConfigured),
      });
    });
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('flexbuddy_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('flexbuddy_project', JSON.stringify(project));
  }, [project]);

  useEffect(() => {
    localStorage.setItem('flexbuddy_team_members', JSON.stringify(teamMembers));
  }, [teamMembers]);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Run AI matching
  const runAiMatching = useCallback(async () => {
    setIsLoadingMatches(true);
    try {
      const response = await fetchMatches(user, project, candidates);
      if (response && response.matches && response.matches.length > 0) {
        setMatches(response.matches);
        setEngineUsed(response.engine || 'groq-ai');
        showToast(
          response.engine === 'groq-ai'
            ? 'Teammates ranked via Groq LLaMA 3.3 AI!'
            : 'Teammates analyzed with smart hybrid algorithm!'
        );
      }
    } catch (err) {
      console.error(err);
      const fallback = clientSideFallbackMatch(user, project, candidates);
      setMatches(fallback);
      showToast('Teammates updated with hybrid algorithm');
    } finally {
      setIsLoadingMatches(false);
    }
  }, [user, project, candidates]);

  // Trigger matching initially once
  useEffect(() => {
    runAiMatching();
  }, [runAiMatching]);

  // Handle Connect
  const handleConnect = (candidate: Candidate) => {
    if (teamMembers.some((m) => String(m.id) === String(candidate.id))) {
      return;
    }

    const newMember: TeamMemberType = {
      id: String(candidate.id),
      name: candidate.name,
      role: candidate.role,
      skills: candidate.skills,
      location: candidate.location,
      connectedAt: new Date().toISOString(),
      isOwner: false,
    };

    setTeamMembers((prev) => [...prev, newMember]);
    showToast(`${candidate.name} joined ${project.name} team!`);
  };

  // Handle Remove Member
  const handleRemoveMember = (memberId: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast('Member removed from team.');
  };

  // Handle View Profile
  const handleViewProfile = (candidate: Candidate, match: MatchResult) => {
    setSelectedCandidateData({ candidate, match });
    setActivePage('match-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Chat with candidate or member
  const handleChat = (target: Candidate | TeamMemberType) => {
    // If not connected yet, connect automatically
    if (!teamMembers.some((m) => String(m.id) === String(target.id))) {
      const newMember: TeamMemberType = {
        id: String(target.id),
        name: target.name,
        role: target.role,
        skills: target.skills,
        location: target.location,
        connectedAt: new Date().toISOString(),
        isOwner: false,
      };
      setTeamMembers((prev) => [...prev, newMember]);
    }
    setSelectedChatPartnerId(String(target.id));
    setActivePage('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={(page) => {
            setActivePage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          project={project}
          teamMembers={teamMembers}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            activePage={activePage}
            setActivePage={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            user={user}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            backendStatus={backendStatus}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activePage === 'dashboard' && (
              <Dashboard
                user={user}
                project={project}
                candidates={candidates}
                matches={matches}
                teamMembers={teamMembers}
                onNavigate={(page) => {
                  setActivePage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onViewProfile={handleViewProfile}
                onConnect={handleConnect}
              />
            )}

            {activePage === 'find-teammates' && (
              <FindTeammates
                user={user}
                project={project}
                onUpdateProject={(p) => {
                  setProject(p);
                  showToast('Project updated. Re-running AI matching...');
                  runAiMatching();
                }}
                candidates={candidates}
                matches={matches}
                teamMembers={teamMembers}
                isLoading={isLoadingMatches}
                onRunMatch={runAiMatching}
                onViewProfile={handleViewProfile}
                onConnect={handleConnect}
                engineUsed={engineUsed}
              />
            )}

            {activePage === 'match-details' && selectedCandidateData && (
              <MatchDetails
                candidate={selectedCandidateData.candidate}
                match={selectedCandidateData.match}
                isConnected={teamMembers.some(
                  (m) => String(m.id) === String(selectedCandidateData.candidate.id)
                )}
                requiredSkills={project.requiredSkills}
                onBack={() => setActivePage('find-teammates')}
                onConnect={handleConnect}
                onChat={handleChat}
              />
            )}

            {activePage === 'my-team' && (
              <MyTeam
                teamName={`${project.name} Team`}
                project={project}
                teamMembers={teamMembers}
                onRemoveMember={handleRemoveMember}
                onChatMember={(m) => handleChat(m)}
                onFindMore={() => setActivePage('find-teammates')}
              />
            )}

            {activePage === 'profile' && (
              <Profile
                user={user}
                onUpdateProfile={(updatedUser) => {
                  setUser(updatedUser);
                  showToast('Profile saved. Adjusting AI compatibility weights...');
                  runAiMatching();
                }}
              />
            )}

            {activePage === 'chat' && (
              <Chat
                currentUser={user}
                teamMembers={teamMembers}
                selectedMemberId={selectedChatPartnerId}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
