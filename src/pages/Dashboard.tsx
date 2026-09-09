import React from 'react';
import {
  UserProfile,
  ProjectRequirements,
  Candidate,
  MatchResult,
  TeamMember,
} from '../types';
import { MatchCard } from '../components/MatchCard';
import {
  Sparkles,
  Users,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  MessageSquare,
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  project: ProjectRequirements;
  candidates: Candidate[];
  matches: MatchResult[];
  teamMembers: TeamMember[];
  onNavigate: (page: any) => void;
  onViewProfile: (candidate: Candidate, match: MatchResult) => void;
  onConnect: (candidate: Candidate) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  project,
  candidates,
  matches,
  teamMembers,
  onNavigate,
  onViewProfile,
  onConnect,
}) => {
  // Calculate profile completion
  const profileFields = [
    user.name,
    user.role,
    user.skills.length > 0,
    user.interests.length > 0,
    user.availability.length > 0,
    user.location,
    user.goal,
    user.bio,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const profilePercent = Math.round((completedFields / profileFields.length) * 100);

  // Calculate team skill coverage
  const allTeamSkills: string[] = Array.from(
    new Set(teamMembers.flatMap((m) => m.skills.map((s) => s.toLowerCase())))
  );
  const coveredSkills = project.requiredSkills.filter((req) =>
    allTeamSkills.some(
      (ts) => ts.includes(req.toLowerCase()) || req.toLowerCase().includes(ts)
    )
  );
  const missingSkills = project.requiredSkills.filter(
    (req) => !coveredSkills.includes(req)
  );

  // Dynamic AI Insight
  const getAiInsight = () => {
    if (missingSkills.length === 0) {
      return 'Your team has achieved 100% coverage on all project required skills! Focus on preparing your hackathon demo pitch and architecture prototype.';
    }
    if (
      missingSkills.some((s) => s.toLowerCase().includes('frontend') || s.toLowerCase().includes('react')) ||
      missingSkills.some((s) => s.toLowerCase().includes('ui') || s.toLowerCase().includes('ux'))
    ) {
      return `You have strong ${user.role} skills but currently lack ${missingSkills.slice(0, 2).join(' & ')} expertise. We recommend connecting with a Frontend Developer and UI/UX Designer next.`;
    }
    return `Your team is currently seeking teammates skilled in ${missingSkills.join(', ')} to achieve full project coverage.`;
  };

  // Top recommended candidates
  const topMatches = matches.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-3xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium backdrop-blur-xs mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Hackathon Teammate Matching Engine</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">
            Welcome back, {user.name}!
          </h2>
          <p className="text-indigo-200 text-sm lg:text-base leading-relaxed mb-6">
            Assemble your dream squad for <span className="text-white font-semibold">"{project.name}"</span>.
            Our Groq-powered AI matches candidates based on complementary skill gaps, roles, and collaboration goals.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-find-team-btn"
              onClick={() => onNavigate('find-teammates')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-sm hover:bg-indigo-50 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Find My Team
              <ArrowRight className="w-4 h-4 text-indigo-500" />
            </button>

            <button
              id="dash-view-team-btn"
              onClick={() => onNavigate('my-team')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-colors border border-white/15 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              View Team ({teamMembers.length})
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Profile Completion
            </span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-slate-900">{profilePercent}%</span>
            <span className="text-xs text-slate-400">ready for matching</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${profilePercent}%` }}
            />
          </div>
        </div>

        {/* Potential Matches */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Potential Matches
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-slate-900">{candidates.length}</span>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
              Ranked by AI
            </span>
          </div>
          <p className="text-xs text-slate-500">Shortlisted candidates for your role</p>
        </div>

        {/* Current Team Members */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Current Team
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-slate-900">{teamMembers.length}</span>
            <span className="text-xs text-slate-400">members confirmed</span>
          </div>
          <p className="text-xs text-slate-500">
            {teamMembers.map((m) => m.name).join(', ')}
          </p>
        </div>

        {/* Missing Skills */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Missing Skills
            </span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-slate-900">
              {missingSkills.length}
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                missingSkills.length === 0
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {missingSkills.length === 0 ? 'Fully Covered' : 'Needed'}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">
            {missingSkills.length === 0
              ? 'All requirements satisfied'
              : missingSkills.join(', ')}
          </p>
        </div>
      </div>

      {/* AI Match Insights Block */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 text-amber-800">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-amber-950">AI Match Insights</h3>
            <span className="text-[10px] uppercase font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
              Automated Analysis
            </span>
          </div>
          <p className="text-xs lg:text-sm text-amber-900/90 leading-relaxed">
            "{getAiInsight()}"
          </p>
        </div>
        <button
          onClick={() => onNavigate('find-teammates')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-900 text-white text-xs font-semibold hover:bg-amber-950 transition-colors shrink-0 cursor-pointer"
        >
          Explore Candidates
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Recommended Teammates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Top Recommended Teammates
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by Groq AI according to skill complementarity and project compatibility
            </p>
          </div>
          <button
            onClick={() => onNavigate('find-teammates')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            View all ({candidates.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {topMatches.map((match) => {
            const candidate = candidates.find((c) => String(c.id) === String(match.userId));
            if (!candidate) return null;
            const isConnected = teamMembers.some((m) => String(m.id) === String(candidate.id));

            return (
              <MatchCard
                key={candidate.id}
                candidate={candidate}
                match={match}
                isConnected={isConnected}
                requiredSkills={project.requiredSkills}
                onViewProfile={onViewProfile}
                onConnect={onConnect}
              />
            );
          })}
        </div>
      </div>

      {/* Recent Team Activity & Connections */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Your Team Lineup
            </h3>
          </div>
          <button
            onClick={() => onNavigate('my-team')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            Manage Team
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {member.name}
                  </div>
                  <div className="text-[11px] text-slate-500">{member.role}</div>
                </div>
              </div>

              {!member.isOwner && (
                <button
                  onClick={() => onNavigate('chat')}
                  className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="Message member"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
