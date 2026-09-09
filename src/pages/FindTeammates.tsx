import React, { useState } from 'react';
import {
  UserProfile,
  ProjectRequirements,
  Candidate,
  MatchResult,
  TeamMember,
} from '../types';
import { MatchCard } from '../components/MatchCard';
import { SkillBadge } from '../components/SkillBadge';
import {
  Sparkles,
  Filter,
  Layers,
  Edit3,
  Check,
  RotateCcw,
  Loader2,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  Zap,
} from 'lucide-react';

interface FindTeammatesProps {
  user: UserProfile;
  project: ProjectRequirements;
  onUpdateProject: (proj: ProjectRequirements) => void;
  candidates: Candidate[];
  matches: MatchResult[];
  teamMembers: TeamMember[];
  isLoading: boolean;
  onRunMatch: () => void;
  onViewProfile: (candidate: Candidate, match: MatchResult) => void;
  onConnect: (candidate: Candidate) => void;
  engineUsed?: string;
}

export const FindTeammates: React.FC<FindTeammatesProps> = ({
  user,
  project,
  onUpdateProject,
  candidates,
  matches,
  teamMembers,
  isLoading,
  onRunMatch,
  onViewProfile,
  onConnect,
  engineUsed,
}) => {
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectRequirements>(project);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newRoleInput, setNewRoleInput] = useState('');

  // Hard filter state
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  // Handle saving edited project
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProject(projectForm);
    setIsEditingProject(false);
  };

  const addSkill = () => {
    if (newSkillInput.trim() && !projectForm.requiredSkills.includes(newSkillInput.trim())) {
      setProjectForm({
        ...projectForm,
        requiredSkills: [...projectForm.requiredSkills, newSkillInput.trim()],
      });
      setNewSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setProjectForm({
      ...projectForm,
      requiredSkills: projectForm.requiredSkills.filter((s) => s !== skill),
    });
  };

  const addRole = () => {
    if (newRoleInput.trim() && !projectForm.preferredRoles.includes(newRoleInput.trim())) {
      setProjectForm({
        ...projectForm,
        preferredRoles: [...projectForm.preferredRoles, newRoleInput.trim()],
      });
      setNewRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setProjectForm({
      ...projectForm,
      preferredRoles: projectForm.preferredRoles.filter((r) => r !== role),
    });
  };

  // Extract unique filter options from candidates
  const allRoles = ['All', ...Array.from(new Set(candidates.map((c) => c.role)))];
  const allAvailabilities = ['All', 'Evening', 'Weekend'];
  const allLocations = ['All', ...Array.from(new Set(candidates.map((c) => c.location)))];

  // Apply hard filters
  const filteredMatches = matches.filter((match) => {
    const candidate = candidates.find((c) => String(c.id) === String(match.userId));
    if (!candidate) return false;

    if (selectedRole !== 'All' && candidate.role !== selectedRole) return false;
    if (
      selectedAvailability !== 'All' &&
      !candidate.availability.includes(selectedAvailability)
    ) {
      return false;
    }
    if (
      selectedLocation !== 'All' &&
      candidate.location.toLowerCase() !== selectedLocation.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Project Banner & Trigger Action */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Active Project
              </span>
              <button
                onClick={() => setIsEditingProject(!isEditingProject)}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 inline-flex items-center gap-1 ml-2 underline cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditingProject ? 'Close Editor' : 'Edit Project Requirements'}
              </button>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              id="trigger-ai-match-btn"
              onClick={onRunMatch}
              disabled={isLoading}
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Find My Team
                </>
              )}
            </button>
          </div>
        </div>

        {/* Project Requirements Preview Chips */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Required Skills:</span>
            <div className="flex flex-wrap gap-1">
              {project.requiredSkills.map((skill) => (
                <SkillBadge key={skill} skill={skill} size="sm" isMatched />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Preferred Roles:</span>
            <div className="flex flex-wrap gap-1">
              {project.preferredRoles.map((role) => (
                <span
                  key={role}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {project.availability.join(', ')}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {project.location}
            </span>
          </div>
        </div>

        {/* Project Edit Form Collapsible */}
        {isEditingProject && (
          <form
            onSubmit={handleSaveProject}
            className="mt-6 pt-6 border-t border-slate-200 space-y-4 bg-slate-50/70 p-5 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900">
                Modify Project Requirements
              </h4>
              <span className="text-xs text-slate-500">
                Affects AI matching compatibility weights
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Location / Format
                </label>
                <input
                  type="text"
                  value={projectForm.location}
                  onChange={(e) =>
                    setProjectForm({ ...projectForm, location: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Project Description
              </label>
              <textarea
                rows={2}
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              />
            </div>

            {/* Required Skills input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Skills
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="e.g. React, UI/UX, AI/ML..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {projectForm.requiredSkills.map((skill) => (
                  <SkillBadge
                    key={skill}
                    skill={skill}
                    onRemove={() => removeSkill(skill)}
                  />
                ))}
              </div>
            </div>

            {/* Preferred Roles input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Roles
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addRole();
                    }
                  }}
                  placeholder="e.g. Frontend Developer, UI/UX Designer..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={addRole}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {projectForm.preferredRoles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 text-xs font-medium"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="ml-1 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
              >
                Save Requirements
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProject(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Matching Results Header & Hard Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              Ranked Teammate Matches
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
              {filteredMatches.length} candidates
            </span>
          </div>

          {/* Engine indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              {engineUsed === 'groq-ai'
                ? 'Powered by Groq LLaMA 3.3'
                : 'Smart Hybrid Matching'}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <Filter className="w-3.5 h-3.5" />
            <span>Hard Filters:</span>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {allRoles.map((r) => (
                <option key={r} value={r}>
                  Role: {r}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {allAvailabilities.map((a) => (
                <option key={a} value={a}>
                  Availability: {a}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {allLocations.map((l) => (
                <option key={l} value={l}>
                  Location: {l}
                </option>
              ))}
            </select>
          </div>

          {(selectedRole !== 'All' ||
            selectedAvailability !== 'All' ||
            selectedLocation !== 'All') && (
            <button
              onClick={() => {
                setSelectedRole('All');
                setSelectedAvailability('All');
                setSelectedLocation('All');
              }}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 ml-auto font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((match) => {
            const candidate = candidates.find(
              (c) => String(c.id) === String(match.userId)
            );
            if (!candidate) return null;
            const isConnected = teamMembers.some(
              (m) => String(m.id) === String(candidate.id)
            );

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
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-900 text-base mb-1">
            No candidates match current filters
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your role, availability, or location filters to see more
            recommendations.
          </p>
          <button
            onClick={() => {
              setSelectedRole('All');
              setSelectedAvailability('All');
              setSelectedLocation('All');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
