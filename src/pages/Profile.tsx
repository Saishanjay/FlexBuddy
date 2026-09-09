import React, { useState } from 'react';
import { UserProfile } from '../types';
import { SkillBadge } from '../components/SkillBadge';
import {
  User,
  Briefcase,
  MapPin,
  Clock,
  Target,
  FileText,
  Save,
  RotateCcw,
  Check,
  Plus,
  Sparkles,
} from 'lucide-react';
import { INITIAL_USER_PROFILE } from '../data/users';

interface ProfileProps {
  user: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2500);
  };

  const handleResetToDemo = () => {
    setFormData(INITIAL_USER_PROFILE);
    onUpdateProfile(INITIAL_USER_PROFILE);
    setShowSavedNotification(true);
    setTimeout(() => setShowSavedNotification(false), 2500);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const toggleAvailability = (item: string) => {
    const exists = formData.availability.includes(item);
    setFormData({
      ...formData,
      availability: exists
        ? formData.availability.filter((a) => a !== item)
        : [...formData.availability, item],
    });
  };

  const initials = (formData.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Profile Header Hero */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{formData.name}</h2>
            <p className="text-sm font-semibold text-indigo-600">{formData.role}</p>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {formData.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formData.availability.join(', ')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Demo
          </button>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200/90 rounded-3xl p-6 lg:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Edit Your Collaboration Profile
            </h3>
            <p className="text-xs text-slate-500">
              This information is used by the Groq AI matching algorithm to identify complementary teammates.
            </p>
          </div>

          {showSavedNotification && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Profile Saved
            </span>
          )}
        </div>

        {/* Name & Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Primary Role
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              placeholder="e.g. Backend Developer, Frontend Developer"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            />
          </div>
        </div>

        {/* Location & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g. Chennai, Bangalore, Remote"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Availability Slots
            </label>
            <div className="flex gap-2">
              {['Morning', 'Evening', 'Weekend'].map((slot) => {
                const isSelected = formData.availability.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleAvailability(slot)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Technical Skills & Technologies
          </label>
          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="e.g. Java, Spring Boot, MySQL, REST API"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Add Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-50 border border-slate-100">
            {formData.skills.map((skill) => (
              <SkillBadge
                key={skill}
                skill={skill}
                onRemove={() => removeSkill(skill)}
                size="md"
              />
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Domains & Interests
          </label>
          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addInterest();
                }
              }}
              placeholder="e.g. AI, Web Development, Education"
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
            />
            <button
              type="button"
              onClick={addInterest}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Add Interest
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-slate-50 border border-slate-100">
            {formData.interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="hover:text-red-500 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Collaboration Goal */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Collaboration Goal
          </label>
          <input
            type="text"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            placeholder="e.g. Build an AI-powered college assistant"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Short Bio
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell potential teammates about your experience and what you want to build..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            required
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            id="save-profile-btn"
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};
