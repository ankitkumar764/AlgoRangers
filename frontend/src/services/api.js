/**
 * AlgoRangers AI Decision Engine — API Service Layer v2.0
 * Unified /analyze endpoint: deterministic, explainable, graph-optimized.
 */

const BASE_URL = 'http://localhost:8000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Network request failed" }));
    throw new Error(errorData.detail || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Primary analysis pipeline — single call returns all 10 intelligence outputs.
 */
export const analyzeResume = async (resumeFile, jobDescription) => {
  console.log("AlgoRangers AI Decision Engine — Starting Full Pipeline...");

  try {
    const formData = new FormData();
    formData.append('file', resumeFile);
    formData.append('jd_text', jobDescription);

    const response = await fetch(`${BASE_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
    const data = await handleResponse(response);

    // Return full 10-output contract + backward-compat fields
    return {
      // Core 10 Outputs
      extracted_skills:      data.extracted_skills || [],
      verified_scores:       data.verified_scores || [],
      ranked_gaps:           data.ranked_gaps || [],
      optimal_path:          data.optimal_path || {},
      alternative_path:      data.alternative_path || {},
      time_estimate:         data.time_estimate || {},
      reasoning_trace:       data.reasoning_trace || [],
      system_confidence:     data.system_confidence || {},
      risk_prediction:       data.risk_prediction || [],
      hiring_recommendation: data.hiring_recommendation || {},
      // Backward compat for existing components
      score:                 data.score || 0,
      tier:                  data.tier || "Potential Growth",
      training_weeks:        data.training_weeks || 0,
      hiringRecommendation:  data.hiringRecommendation || "",
      skills:                data.skills || [],
      skillsFull:            data.skillsFull || [],
      missingSkills:         data.missingSkills || [],
      jdSkills:              data.jdSkills || [],
      roadmap:               data.roadmap || [],
      auto_inserted:         data.auto_inserted_prerequisites || [],
    };

  } catch (error) {
    console.error("AI Decision Engine — Pipeline Error:", error);
    if (error.message.includes("422")) {
      error.message = "The AI Engine could not process the provided files. Please ensure the resume is a valid PDF or Text file.";
    } else if (error.message.includes("500")) {
      error.message = "The AI Engine encountered an internal error. Check backend console for details.";
    }
    throw error;
  }
};

export const fetchQuiz = async (jdSkills, resumeSkills, verifiedScores = {}) => {
  try {
    // Build a simple {skill: score} map from the verifiedScores array
    const scoresMap = {};
    if (Array.isArray(verifiedScores)) {
      verifiedScores.forEach(item => {
        if (item?.skill && item?.current_score != null) {
          scoresMap[item.skill] = item.current_score;
        }
      });
    } else if (verifiedScores && typeof verifiedScores === 'object') {
      Object.assign(scoresMap, verifiedScores);
    }

    const response = await fetch(`${BASE_URL}/generate-quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jd_skills:       jdSkills,
        resume_skills:   resumeSkills,
        verified_scores: scoresMap,
      }),
    });
    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const submitQuizResults = async (score, total) => {
  console.log("Submitting quiz results...", { score, total });
  return { success: true, updatedReadiness: 85 };
};
