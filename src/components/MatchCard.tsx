import React from 'react';
import { Candidate, MatchResult } from '../types';
import { MatchScore } from './MatchScore';
import { SkillBadge } from './SkillBadge';
import { Check, Sparkles, MapPin, Clock, ArrowRight, UserPlus, UserCheck } from 'lucide-react';

interface MatchCardProps {
  candidate: Candidate;
  match: MatchResult;
  isConnected: boolean;
  requiredSkills: string[];
  onViewProfile: (candidate: Candidate, match: MatchResult) => void;
  onConnect: (candidate: Candidate) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  candidate,
  match,
  isConnected,
  requiredSkills,
  onViewProfile,
  onConnect,
}) => {
  // Initials for avatar
  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Avatar pastel background colors
  const avatarColors = [
    'bg-indigo-600 text-white',
    'bg-teal-600 text-white',
    'bg-violet-600 text-white',
    'bg-sky-600 text-white',
    'bg-rose-600 text-white',
    'bg-emerald-600 text-white',
  ];
  const colorIndex = Math.abs(
    candidate.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % avatarColors.length;
  const avatarBg = avatarColors[colorIndex];

  return (
    <div
      id={`match-card-${candidate.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col justify-between group hover:border-indigo-300 relative overflow-hidden"
    >
      {/* Top row: Avatar, Info, and Circular Score */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-sm ${avatarBg}`}
            >
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                  {candidate.name}
                </h3>
                {isConnected && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <UserCheck className="w-3 h-3" /> Connected
                  </span>
                )}
              </div>
              <p className="text-sm text-indigo-600 font-medium">{candidate.role}</p>

              {/* Location & Availability tags */}
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {candidate.availability.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Match percentage circular score */}
          <div className="shrink-0">
            <MatchScore score={match.matchScore} size="md" />
          </div>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Key Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => {
              const isReq = requiredSkills.some((r) =>
                r.toLowerCase().includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(r.toLowerCase())
              );
              return (
                <SkillBadge
                  key={skill}
                  skill={skill}
                  isMatched={isReq}
                  size="sm"
                />
              );
            })}
          </div>
        </div>

        {/* AI Match Reasons */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Why you're a great match</span>
          </div>
          <ul className="space-y-1.5">
            {match.reasons.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Team Value */}
        {match.teamValue && (
          <div className="text-xs text-slate-600 italic bg-amber-50/70 border border-amber-200/60 rounded-lg p-2.5 mb-4">
            <span className="font-semibold text-amber-900 not-italic">Team Value: </span>
            "{match.teamValue}"
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          id={`view-profile-btn-${candidate.id}`}
          onClick={() => onViewProfile(candidate, match)}
          className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          View Profile
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          id={`connect-btn-${candidate.id}`}
          onClick={() => onConnect(candidate)}
          disabled={isConnected}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isConnected
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow active:scale-[0.99]'
          }`}
        >
          {isConnected ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              In My Team
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              Connect
            </>
          )}
        </button>
      </div>
    </div>
  );
};
