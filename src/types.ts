export interface UserProfile {
  id: string;
  name: string;
  role: string;
  skills: string[];
  interests: string[];
  availability: string[];
  location: string;
  goal: string;
  bio: string;
  avatar?: string;
}

export interface ProjectRequirements {
  id: string;
  name: string;
  description: string;
  requiredSkills: string[];
  preferredRoles: string[];
  availability: string[];
  location: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  interests: string[];
  availability: string[];
  location: string;
  bio: string;
  goal: string;
  avatar?: string;
  github?: string;
  experience?: string;
}

export interface MatchResult {
  userId: string;
  matchScore: number;
  skillScore: number;
  interestScore: number;
  availabilityScore: number;
  locationScore: number;
  roleScore: number;
  reasons: string[];
  strengths: string[];
  teamValue: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  avatar?: string;
  location: string;
  connectedAt: string;
  isOwner?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  text: string;
  timestamp: string;
}

export type ActivePage =
  | 'dashboard'
  | 'find-teammates'
  | 'match-details'
  | 'my-team'
  | 'profile'
  | 'chat';
