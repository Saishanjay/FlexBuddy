import React from 'react';
import { TeamMember as TeamMemberType } from '../types';
import { MessageSquare, Trash2, Crown, MapPin, CheckCircle2 } from 'lucide-react';
import { SkillBadge } from './SkillBadge';

interface TeamMemberProps {
  member: TeamMemberType;
  currentUserId?: string;
  onChat?: (member: TeamMemberType) => void;
  onRemove?: (memberId: string) => void;
}

export const TeamMember: React.FC<TeamMemberProps> = ({
  member,
  onChat,
  onRemove,
}) => {
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      id={`team-member-${member.id}`}
      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-base">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-slate-900 text-base">
                  {member.name}
                </h4>
                {member.isOwner && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <Crown className="w-3 h-3 text-amber-600" /> Lead
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-indigo-600">{member.role}</p>
              <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3" />
                {member.location}
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
          </span>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Skills Contributed
          </p>
          <div className="flex flex-wrap gap-1.5">
            {member.skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        {!member.isOwner ? (
          <>
            {onChat && (
              <button
                id={`chat-member-${member.id}`}
                onClick={() => onChat(member)}
                className="flex-1 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
            )}
            {onRemove && (
              <button
                id={`remove-member-${member.id}`}
                onClick={() => onRemove(member.id)}
                title="Remove from team"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          <div className="w-full text-center text-xs text-slate-400 italic py-1">
            Team Founder (You)
          </div>
        )}
      </div>
    </div>
  );
};
