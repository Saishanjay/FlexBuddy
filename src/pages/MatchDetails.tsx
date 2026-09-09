import React from 'react';
import { Candidate, MatchResult } from '../types';
import { MatchScore } from '../components/MatchScore';
import { SkillBadge } from '../components/SkillBadge';
import {
  ArrowLeft,
  UserPlus,
  UserCheck,
  MessageSquare,
  Sparkles,
  MapPin,
  Clock,
  Briefcase,
  Target,
  FileText,
  CheckCircle2,
  Award,
  ShieldCheck,
} from 'lucide-react';

interface MatchDetailsProps {
  candidate: Candidate;
  match: MatchResult;
  isConnected: boolean;
  requiredSkills: string[];
  onBack: () => void;
  onConnect: (candidate: Candidate) => void;
  onChat: (candidate: Candidate) => void;
}

export const MatchDetails: React.FC<MatchDetailsProps> = ({
  candidate,
  match,
  isConnected,
  requiredSkills,
  onBack,
  onConnect,
  onChat,
}) => {
  const breakdownItems = [
    {
      label: 'Skill Compatibility',
      score: match.skillScore,
      description: 'Coverage of required tech stack & complementary abilities',
      color: 'bg-indigo-600',
    },
    {
      label: 'Shared Interests',
      score: match.interestScore,
      description: 'Common motivation in AI, Web Development & Education',
      color: 'bg-violet-600',
    },
    {
      label: 'Availability Overlap',
      score: match.availabilityScore,
      description: 'Matching working hours for synchronized sprint sessions',
      color: 'bg-emerald-600',
    },
    {
      label: 'Location Compatibility',
      score: match.locationScore,
      description: 'Geographic proximity or high-bandwidth remote fit',
      color: 'bg-sky-600',
    },
    {
      label: 'Role Compatibility',
      score: match.roleScore,
      description: 'Cross-functional balance (prevents redundant skill overlap)',
      color: 'bg-amber-600',
    },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Back navigation button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Candidate Matches
        </button>
      </div>

      {/* Candidate Profile Hero Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {candidate.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-900">
                  {candidate.name}
                </h2>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    In Your Team
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    Available Candidate
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-indigo-600 mt-0.5">
                {candidate.role}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {candidate.availability.join(', ')}
                </span>
                {candidate.experience && (
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.experience}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Overall Match Gauge Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 self-start">
            <MatchScore score={match.matchScore} size="lg" showLabel={false} />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Overall Compatibility
              </div>
              <div className="text-xl font-bold text-slate-900">
                {match.matchScore}% Match
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                AI Verified Candidate
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 flex-wrap">
          <button
            onClick={() => onConnect(candidate)}
            disabled={isConnected}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isConnected
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow'
            }`}
          >
            {isConnected ? (
              <>
                <UserCheck className="w-4 h-4" />
                Teammate Connected
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add to My Team
              </>
            )}
          </button>

          <button
            onClick={() => onChat(candidate)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Send Direct Message
          </button>
        </div>
      </div>

      {/* Grid: Compatibility Breakdown & AI Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Compatibility Metric Bars */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Compatibility Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Multi-factor analysis computed for your project
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
              5 Vectors
            </span>
          </div>

          <div className="space-y-4">
            {breakdownItems.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.score}%</span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${item.color} h-2.5 rounded-full transition-all duration-700`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Why this Match & Team Value */}
        <div className="lg:col-span-6 space-y-6">
          {/* Why this match box */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Why this match?
              </h3>
            </div>

            <ul className="space-y-2.5">
              {match.reasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Team Value Quote */}
          {match.teamValue && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                <Target className="w-4 h-4 text-amber-700" />
                <span>Complementary Team Value</span>
              </div>
              <p className="text-sm font-medium text-amber-950 italic leading-relaxed">
                "{match.teamValue}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Background, Skills & Interests */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Short Bio
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            {candidate.bio}
          </p>
          <div className="mt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Collaboration Goal
            </h4>
            <p className="text-xs text-indigo-900 font-medium">
              "{candidate.goal}"
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Technical Skills
          </h4>
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
                  size="md"
                />
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Areas of Interest
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {candidate.interests.map((interest) => (
              <span
                key={interest}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
