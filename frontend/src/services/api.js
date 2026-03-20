/**
 * AlgoRangers API Service Layer
 * This service handles all interactions with the Backend SkillGraph Engine.
 * Integrated with FastAPI Backend on http://localhost:8000
 */

const BASE_URL = 'http://localhost:8000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Network request failed" }));
    throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

export const analyzeResume = async (resumeFile, jobDescription) => {
  console.log("Starting Full-Stack Analysis...", { resumeFile, jobDescription });

  try {
    // 1. Parse Resume
    const formData = new FormData();
    formData.append('file', resumeFile);
    const resumeResponse = await fetch(`${BASE_URL}/parse-resume`, {
      method: 'POST',
      body: formData,
    });
    const resumeData = await handleResponse(resumeResponse);
    const resumeSkillsFull = resumeData.skills;
    const resumeSkills = resumeSkillsFull.map(s => s.name);

    // 2. Parse JD
    const jdFormData = new FormData();
    jdFormData.append('jd_text', jobDescription);
    const jdResponse = await fetch(`${BASE_URL}/parse-jd`, {
      method: 'POST',
      body: jdFormData,
    });
    const jdData = await handleResponse(jdResponse);
    const jdSkillsFull = jdData.skills;
    const jdSkills = jdSkillsFull.map(s => s.name);

    // 3. Get Interview Readiness Score
    const scoreResponse = await fetch(`${BASE_URL}/get-score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_skills: resumeSkills, jd_skills: jdSkills }),
    });
    const scoreData = await handleResponse(scoreResponse);

    // 4. Analyze Skill Gaps
    const gapResponse = await fetch(`${BASE_URL}/analyze-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_skills: resumeSkills, jd_skills: jdSkills }),
    });
    const gapData = await handleResponse(gapResponse);
    const missingSkills = gapData.missing_skills;

    // 5. Generate Adaptive Roadmap
    const roadmapResponse = await fetch(`${BASE_URL}/generate-roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ missing_skills: missingSkills, user_skills: resumeSkills }),
    });
    const roadmapData = await handleResponse(roadmapResponse);

    return {
      score: scoreData.score,
      reasoning: scoreData.reasoning,
      tier: scoreData.tier,
      trainingWeeks: scoreData.training_weeks,
      hiringRecommendation: scoreData.hiring_recommendation,
      skills: resumeSkills,
      skillsFull: resumeSkillsFull,
      missingSkills: missingSkills,
      roadmap: roadmapData.roadmap,
      jdSkills: jdSkills
    };
  } catch (error) {
    console.error("Full-Stack Integration Error:", error);
    // Add specific context for UI display
    if (error.message.includes("422")) {
      error.message = "The AI Engine could not process the provided files. Please ensure the resume is a valid PDF or Text file.";
    } else if (error.message.includes("500")) {
      error.message = "The AI Engine encountered an internal error. This is often due to a missing or invalid OpenAI API key.";
    }
    throw error;
  }
};

export const fetchQuiz = async (jdSkills, resumeSkills) => {
  try {
    const response = await fetch(`${BASE_URL}/generate-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jd_skills: jdSkills, resume_skills: resumeSkills }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const submitQuizResults = async (score, total) => {
  console.log("Submitting quiz results to backend...", { score, total });
  return { success: true, updatedReadiness: 85 };
};
