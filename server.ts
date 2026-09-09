import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FlexBuddy AI',
    groqConfigured: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

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

  // Check cluster overlap
  for (const cluster of Object.values(SKILL_CLUSTERS)) {
    const hasA = cluster.some((item) => a === item || a.includes(item) || item.includes(a));
    const hasB = cluster.some((item) => b === item || b.includes(item) || item.includes(b));
    if (hasA && hasB) return true;
  }
  return false;
}

// Fallback matching algorithm implementation in case Groq is unavailable or fails
function calculateLocalMatch(user: any, project: any, candidate: any) {
  const userSkills: string[] = (user.skills || []).map((s: string) => s.toLowerCase());
  const candidateSkills: string[] = (candidate.skills || []).map((s: string) => s.toLowerCase());
  const reqSkills: string[] = (project.requiredSkills || []).map((s: string) => s.toLowerCase());
  const prefRoles: string[] = (project.preferredRoles || []).map((r: string) => r.toLowerCase());

  // 1. Skill overlap and complementarity (40%)
  // High score for candidates who bring skills project needs and user doesn't already cover
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

  // 2. Role compatibility (20%)
  const isTargetRole = prefRoles.length === 0 || prefRoles.some((pr) =>
    candidate.role.toLowerCase().includes(pr) || pr.includes(candidate.role.toLowerCase())
  );
  const isComplementaryRole = candidate.role.toLowerCase() !== (user.role || '').toLowerCase();
  const roleScore = isTargetRole ? (isComplementaryRole ? 95 : 85) : 74;

  // 3. Shared interests (15%)
  const userInterests: string[] = (user.interests || []).map((i: string) => i.toLowerCase());
  const candInterests: string[] = (candidate.interests || []).map((i: string) => i.toLowerCase());
  const sharedInterests = candInterests.filter((ci) =>
    userInterests.some((ui) => ui.includes(ci) || ci.includes(ui))
  );
  const interestScore = sharedInterests.length >= 2 ? 92 : (sharedInterests.length === 1 ? 84 : 72);

  // 4. Availability overlap (15%)
  const userAvail: string[] = (user.availability || []).map((a: string) => a.toLowerCase());
  const candAvail: string[] = (candidate.availability || []).map((a: string) => a.toLowerCase());
  const availOverlap = candAvail.some((ca) => userAvail.includes(ca));
  const availabilityScore = availOverlap ? 100 : 70;

  // 5. Location compatibility (10%)
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

  // Generate dynamic reasons
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

  // Strengths
  const strengths = candidate.skills.slice(0, 4);

  // Team value statement
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
}

// POST /api/match
app.post('/api/match', async (req, res) => {
  try {
    const { user, project, candidates } = req.body;

    if (!user || !project || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({ error: 'Invalid input. user, project, and candidates array are required.' });
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    // If Groq API key is configured, use Groq
    if (groqApiKey && groqApiKey.trim() !== '') {
      try {
        const groq = new Groq({ apiKey: groqApiKey });

        const systemPrompt = `You are FlexBuddy, an expert AI teammate matching engine.

Your job is to find the best teammates for a project.

Analyze candidates using:
1. Skill complementarity
2. Project requirement coverage
3. Shared interests
4. Availability overlap
5. Location compatibility
6. Role compatibility
7. Overall team contribution

IMPORTANT:
Do NOT simply recommend people who have identical skills.
Complementary skills are extremely important.
For example:
Backend Developer + Frontend Developer is generally a stronger team combination than Backend Developer + Backend Developer.
Also consider whether a candidate fills a missing skill in the project.
Give higher scores to candidates who bring skills that the current team does not already have.
Return candidates ranked from best to worst.

You MUST respond strictly with valid JSON only, without any markdown code fence or extra text.
The JSON must follow this exact format:
{
  "matches": [
    {
      "userId": "string id of candidate",
      "matchScore": number 0-100,
      "skillScore": number 0-100,
      "interestScore": number 0-100,
      "availabilityScore": number 0-100,
      "locationScore": number 0-100,
      "roleScore": number 0-100,
      "reasons": [
        "reason 1",
        "reason 2",
        "reason 3",
        "reason 4"
      ],
      "strengths": [
        "skill 1",
        "skill 2",
        "skill 3"
      ],
      "teamValue": "one or two sentences explaining specific contribution to team balance"
    }
  ]
}`;

        const userPrompt = JSON.stringify({
          currentUser: {
            name: user.name,
            role: user.role,
            skills: user.skills,
            interests: user.interests,
            availability: user.availability,
            location: user.location,
            goal: user.goal,
          },
          projectRequirements: {
            name: project.name,
            description: project.description,
            requiredSkills: project.requiredSkills,
            preferredRoles: project.preferredRoles,
            availability: project.availability,
            location: project.location,
          },
          candidates: candidates.map((c: any) => ({
            id: String(c.id),
            name: c.name,
            role: c.role,
            skills: c.skills,
            interests: c.interests,
            availability: c.availability,
            location: c.location,
            bio: c.bio,
          })),
        });

        // Use llama-3.3-70b-versatile with fallback to llama-3.1-8b-instant
        let responseContent = '';
        try {
          const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
          });
          responseContent = completion.choices[0]?.message?.content || '';
        } catch (modelErr) {
          console.warn('llama-3.3-70b-versatile failed, attempting llama-3.1-8b-instant:', modelErr);
          const completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.2,
            response_format: { type: 'json_object' },
          });
          responseContent = completion.choices[0]?.message?.content || '';
        }

        // Parse JSON
        if (responseContent) {
          let cleaned = responseContent.trim();
          if (cleaned.startsWith('```json')) {
            cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const parsed = JSON.parse(cleaned);
          if (parsed && Array.isArray(parsed.matches) && parsed.matches.length > 0) {
            // Sort by matchScore descending
            parsed.matches.sort((a: any, b: any) => (b.matchScore || 0) - (a.matchScore || 0));
            return res.json({
              matches: parsed.matches,
              engine: 'groq-ai',
              model: 'llama-3.3-70b-versatile',
            });
          }
        }
      } catch (groqErr: any) {
        console.error('Groq AI matching error, engaging fallback algorithm:', groqErr.message);
      }
    }

    // Heuristic Fallback matching (if no Groq key, or Groq failed)
    const matches = candidates.map((candidate: any) =>
      calculateLocalMatch(user, project, candidate)
    );

    // Sort candidates by highest match score
    matches.sort((a: any, b: any) => b.matchScore - a.matchScore);

    return res.json({
      matches,
      engine: 'fallback-heuristic',
      notice: groqApiKey ? 'Fallback engine used due to Groq API temporary unavailability' : 'Fallback engine active (set GROQ_API_KEY in .env for Groq LLaMA 3.3)',
    });
  } catch (error: any) {
    console.error('Server match error:', error);
    res.status(500).json({ error: 'Internal server error while matching teammates.' });
  }
});

// Vite middleware for development or static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FlexBuddy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
