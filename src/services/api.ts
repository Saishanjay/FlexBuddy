import { UserProfile, ProjectRequirements, Candidate, MatchResult } from '../types';

export interface MatchApiResponse {
  matches: MatchResult[];
  engine?: string;
  notice?: string;
}

// Skill semantic cluster mapping for robust hackathon heuristic matching
const SKILL_CLUSTERS: Record<string, string[]> = {
  'ai/ml': ['python', 'machine learning', 'tensorflow', 'nlp', 'pytorch', 'ai', 'deep learning', 'data science', 'llm'],
  'frontend': ['react', 'javascript', 'html', 'css', 'figma', 'ui/ux', 'tailwind', 'typescript', 'frontend developer'],
  'ui/ux': ['figma', 'ui design', 'prototyping', 'user research', 'design', 'ux', 'ui/ux designer'],
  'backend': ['java', 'spring boot', 'mysql', 'rest api', 'postgresql', 'docker', 'node', 'express', 'cloud', 'backend developer'],
  'mobile': ['flutter', 'dart', 'firebase', 'android', 'ios', 'mobile developer'],
};

function checkSkillMatch(skillA: string, skillB: string): boolean {
  const a = skillA.toLowerCase().trim();
  const b = skillB.toLowerCase().trim();
  if (a === b || a.includes(b) || b.includes(a)) return true;

  for (const cluster of Object.values(SKILL_CLUSTERS)) {
    const hasA = cluster.some((item) => a === item || a.includes(item) || item.includes(a));
    const hasB = cluster.some((item) => b === item || b.includes(item) || item.includes(b));
    if (hasA && hasB) return true;
  }
  return false;
}

// Client-side fallback matching if server is unreachable
export function clientSideFallbackMatch(
  user: UserProfile,
  project: ProjectRequirements,
  candidates: Candidate[]
): MatchResult[] {
  const userSkills = (user.skills || []).map((s) => s.toLowerCase());
  const reqSkills = (project.requiredSkills || []).map((s) => s.toLowerCase());
  const prefRoles = (project.preferredRoles || []).map((r) => r.toLowerCase());

  const results: MatchResult[] = candidates.map((candidate) => {
    const candidateSkills = (candidate.skills || []).map((s) => s.toLowerCase());

    let matchedReqCount = 0;
    let complementaryFilledCount = 0;

    for (const req of reqSkills) {
      const candidateHasSkill = candidateSkills.some((cs) => checkSkillMatch(cs, req));
      const userHasSkill = userSkills.some((us) => checkSkillMatch(us, req));

      if (candidateHasSkill) {
        matchedReqCount++;
        if (!userHasSkill) {
          complementaryFilledCount++;
        }
      }
    }

    const reqRatio = reqSkills.length > 0 ? matchedReqCount / reqSkills.length : 0.8;
    const compRatio = reqSkills.length > 0 ? complementaryFilledCount / reqSkills.length : 0.6;
    const skillScore = Math.min(99, Math.max(70, Math.round(75 + reqRatio * 15 + compRatio * 9)));

    // Role Compatibility
    const isTargetRole = prefRoles.length === 0 || prefRoles.some((pr) =>
      candidate.role.toLowerCase().includes(pr) || pr.includes(candidate.role.toLowerCase())
    );
    const isComplementaryRole = candidate.role.toLowerCase() !== (user.role || '').toLowerCase();
    const roleScore = isTargetRole ? (isComplementaryRole ? 95 : 85) : 74;

    // Shared interests
    const userInterests = (user.interests || []).map((i) => i.toLowerCase());
    const candInterests = (candidate.interests || []).map((i) => i.toLowerCase());
    const sharedInterests = candInterests.filter((ci) =>
      userInterests.some((ui) => ui.includes(ci) || ci.includes(ui))
    );
    const interestScore = sharedInterests.length >= 2 ? 92 : (sharedInterests.length === 1 ? 84 : 72);

    // Availability
    const userAvail = (user.availability || []).map((a) => a.toLowerCase());
    const candAvail = (candidate.availability || []).map((a) => a.toLowerCase());
    const availOverlap = candAvail.some((ca) => userAvail.includes(ca));
    const availabilityScore = availOverlap ? 100 : 70;

    // Location
    const locMatches =
      !user.location ||
      !candidate.location ||
      candidate.location.toLowerCase() === user.location.toLowerCase() ||
      project.location === 'Remote' ||
      project.location === 'All';
    const locationScore = locMatches ? 100 : 80;

    // Overall match score
    const matchScore = Math.min(
      98,
      Math.round(
        skillScore * 0.4 +
        roleScore * 0.2 +
        interestScore * 0.15 +
        availabilityScore * 0.15 +
        locationScore * 0.1
      )
    );

    const reasons: string[] = [];
    if (isComplementaryRole) {
      reasons.push(`Strong complementary ${candidate.role} and ${user.role || 'existing team'} skills`);
    }
    if (sharedInterests.length > 0) {
      const interestStr = sharedInterests.slice(0, 2).map((i) => i.toUpperCase()).join(' & ');
      reasons.push(`Shared interest in ${interestStr}`);
    }
    if (availOverlap) {
      reasons.push(`Same ${candAvail.join('/')} availability`);
    }
    if (locMatches) {
      reasons.push(`Same location (${candidate.location})`);
    }
    if (complementaryFilledCount > 0 || matchedReqCount > 0) {
      reasons.push(`Fills an important project requirement (${candidate.skills[0]})`);
    }

    const strengths = candidate.skills.slice(0, 4);
    let teamValue = '';
    if (candidate.role.toLowerCase().includes('frontend')) {
      teamValue = `${candidate.name} can build the frontend while you focus on the backend, creating a strong full-stack team.`;
    } else if (candidate.role.toLowerCase().includes('ai') || candidate.role.toLowerCase().includes('ml')) {
      teamValue = `${candidate.name} brings dedicated NLP and machine learning capabilities to power intelligent project interactions.`;
    } else if (candidate.role.toLowerCase().includes('design') || candidate.role.toLowerCase().includes('ui')) {
      teamValue = `${candidate.name} transforms technical features into intuitive user flows, ensuring an outstanding demo presentation.`;
    } else {
      teamValue = `${candidate.name} adds specialized expertise in ${candidate.skills.slice(0, 2).join(' and ')} to accelerate delivery.`;
    }

    return {
      userId: String(candidate.id),
      matchScore,
      skillScore,
      interestScore,
      availabilityScore,
      locationScore,
      roleScore,
      reasons: reasons.slice(0, 4),
      strengths,
      teamValue,
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

// Call backend /api/match
export async function fetchMatches(
  user: UserProfile,
  project: ProjectRequirements,
  candidates: Candidate[]
): Promise<MatchApiResponse> {
  try {
    const response = await fetch('/api/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, project, candidates }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    if (data && Array.isArray(data.matches) && data.matches.length > 0) {
      return data;
    }
    throw new Error('Invalid match response payload');
  } catch (err) {
    console.warn('Backend match failed, using client-side matching algorithm:', err);
    const fallbackMatches = clientSideFallbackMatch(user, project, candidates);
    return {
      matches: fallbackMatches,
      engine: 'client-fallback',
      notice: 'Client-side heuristic engine active',
    };
  }
}

export async function checkBackendHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'offline', groqConfigured: false };
  }
}
