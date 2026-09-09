import React from 'react';
import { TeamMember as TeamMemberType, ProjectRequirements } from '../types';
import { TeamMember } from '../components/TeamMember';
import { SkillBadge } from '../components/SkillBadge';
import {
  Users,
  ShieldCheck,
  Sparkles,
  Layers,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  Share2,
} from 'lucide-react';

interface MyTeamProps {
  teamName: string;
  project: ProjectRequirements;
  teamMembers: TeamMemberType[];
  onRemoveMember: (memberId: string) => void;
  onChatMember: (member: TeamMemberType) => void;
  onFindMore: () => void;
}

export const MyTeam: React.FC<MyTeamProps> = ({
  teamName,
  project,
  teamMembers,
  onRemoveMember,
  onChatMember,
  onFindMore,
}) => {
  // Aggregate all skills from current team
  const allTeamSkills: string[] = Array.from(
    new Set(teamMembers.flatMap((m) => m.skills.map((s) => s.toLowerCase())))
  );

  // Check required skills coverage
  const skillCoverage = project.requiredSkills.map((req) => {
    const isCovered = allTeamSkills.some(
      (ts) => ts.includes(req.toLowerCase()) || req.toLowerCase().includes(ts)
    );
    const coveringMembers = teamMembers.filter((m) =>
      m.skills.some(
        (s) =>
          s.toLowerCase().includes(req.toLowerCase()) ||
          req.toLowerCase().includes(s.toLowerCase())
      )
    );
    return {
      skill: req,
      isCovered,
      coveringMembers,
    };
  });

  const coveredCount = skillCoverage.filter((s) => s.isCovered).length;
  const coveragePercent = Math.round(
    (coveredCount / Math.max(1, project.requiredSkills.length)) * 100
  );

  const missingSkills = skillCoverage
    .filter((s) => !s.isCovered)
    .map((s) => s.skill);

  return (
    <div className="space-y-6 pb-12">
      {/* Team Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Users className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Active Hackathon Squad
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
              {teamName || `${project.name} Team`}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Collaborative squad formed for {project.name}. Cross-functional roles
              assembled to build, pitch, and ship within hackathon timelines.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="team-find-more-btn"
              onClick={onFindMore}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Recruit More Teammates
            </button>
          </div>
        </div>

        {/* Quick Team Stats Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold">Total Members</span>
            <span className="text-xl font-bold text-slate-900">
              {teamMembers.length}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold">Skill Coverage</span>
            <span className="text-xl font-bold text-indigo-600">
              {coveragePercent}%
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold">Target Location</span>
            <span className="text-xl font-bold text-slate-900">
              {project.location}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-semibold">Team Status</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-sm mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              {missingSkills.length === 0 ? 'Fully Assembled' : 'Recruiting'}
            </span>
          </div>
        </div>
      </div>

      {/* Team Skill Coverage Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Team Skill Coverage Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Verifies if all critical project requirements are covered by members
            </p>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
              missingSkills.length === 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {coveredCount} of {project.requiredSkills.length} Required Skills Covered
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {skillCoverage.map((item) => (
            <div
              key={item.skill}
              className={`p-4 rounded-2xl border transition-all ${
                item.isCovered
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 text-sm">
                  {item.skill}
                </span>
                {item.isCovered ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
              </div>

              {item.isCovered ? (
                <p className="text-xs text-slate-600">
                  Covered by:{' '}
                  <span className="font-semibold text-emerald-900">
                    {item.coveringMembers.map((m) => m.name).join(', ')}
                  </span>
                </p>
              ) : (
                <div className="flex items-center justify-between text-xs text-amber-800 mt-1">
                  <span>Skill Missing</span>
                  <button
                    onClick={onFindMore}
                    className="font-bold underline hover:text-amber-950 cursor-pointer"
                  >
                    Find
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Missing skills highlight banner if any */}
        {missingSkills.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Missing core requirements:{' '}
                <strong className="text-amber-950">{missingSkills.join(', ')}</strong>.
                Search for candidates specializing in these areas.
              </span>
            </div>
            <button
              onClick={onFindMore}
              className="px-3 py-1.5 rounded-lg bg-amber-800 text-white font-bold hover:bg-amber-900 transition-colors shrink-0 cursor-pointer"
            >
              Match Candidates
            </button>
          </div>
        )}
      </div>

      {/* Team Members Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-base">
            Team Members ({teamMembers.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click message to initiate collaboration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((member) => (
            <TeamMember
              key={member.id}
              member={member}
              onChat={onChatMember}
              onRemove={onRemoveMember}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
