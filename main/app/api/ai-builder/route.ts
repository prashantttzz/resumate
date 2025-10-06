import { NextResponse } from "next/server";

interface PersonalInfo {
  summary: string;
  [key: string]: any;
}

interface Skill {
  id: string;
  name: string;
  level?: string;
}

interface SkillSection {
  id: string;
  name: string;
  skills: Skill[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  [key: string]: any;
}

interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  [key: string]: any;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  skills: SkillSection[];
  projects: Project[];
  experiences: Experience[];
  [key: string]: any;
}

function mergeEnhancements(
  original: ResumeData,
  update: Partial<ResumeData>
): ResumeData {
  const updated = { ...original };

  if (update.personalInfo?.summary && updated.personalInfo) {
    updated.personalInfo.summary = update.personalInfo.summary;
  }
  if (update.skills && update.skills.length > 0) {
    for (const updatedSkillSection of update.skills) {
      const section = updated.skills.find(
        (s) => s.id === updatedSkillSection.id
      );
      if (section) {
        section.skills = updatedSkillSection.skills;
      }
    }
  }
  if (update.projects && update.projects.length > 0) {
    for (const updatedProject of update.projects) {
      const project = updated.projects.find((p) => p.id === updatedProject.id);
      if (project) {
        project.description = updatedProject.description;
      }
    }
  }
  if (update.experiences && update.experiences.length > 0) {
    for (const updatedExperience of update.experiences) {
      const experience = updated.experiences.find(
        (e) => e.id === updatedExperience.id
      );
      if (experience) {
        experience.description = updatedExperience.description;
      }
    }
  }

  return updated;
}

let lastApiCallTime: number = 0;
const MIN_TIME_BETWEEN_CALLS_MS = 200;

async function callGeminiApi<T>(
  apiUrl: string,
  payload: any,
  errorMessage: string,
  maxRetries: number = 3,
  retryDelayMs: number = 1000
): Promise<T> {
  const now = Date.now();
  const timeSinceLastCall = now - lastApiCallTime;

  if (timeSinceLastCall < MIN_TIME_BETWEEN_CALLS_MS) {
    const delayNeeded = MIN_TIME_BETWEEN_CALLS_MS - timeSinceLastCall;
    await new Promise((resolve) => setTimeout(resolve, delayNeeded));
  }
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      lastApiCallTime = Date.now();

      if (!response.ok) {
        console.error(
          `${errorMessage} API call failed (Attempt ${
            i + 1
          }/${maxRetries}) with status ${response.status}:`
        );
        if (
          response.status === 429 ||
          (response.status >= 500 && response.status < 600)
        ) {
          const delay = retryDelayMs * Math.pow(2, i);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        } else {
          throw new Error(
            `${errorMessage}: API call failed with status ${response.status}`
          );
        }
      }

      const result = await response.json();
      let jsonString = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!jsonString) {
        console.error(
          `${errorMessage}: No content found in Gemini response. Full result:`,
          result
        );
        throw new Error(`${errorMessage}: AI did not return expected content.`);
      }

      // Handle cases where the model might wrap JSON in markdown code block
      if (jsonString.startsWith("```json")) {
        jsonString = jsonString
          .substring(7, jsonString.lastIndexOf("```"))
          .trim();
      }
      const parsedData = JSON.parse(jsonString) as T;
      return parsedData;
    } catch (error: any) {
      if (i === maxRetries - 1) {
        if (error instanceof Error) {
          throw new Error(`${errorMessage}: ${error.message}`);
        } else {
          throw new Error(
            `${errorMessage}: An unknown error occurred during API call or parsing after ${maxRetries} retries.`
          );
        }
      }
      console.error(`Attempt ${i + 1}/${maxRetries} failed:`, error.message);
      const delay = retryDelayMs * Math.pow(2, i);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`${errorMessage}: All retry attempts failed.`);
}

export async function POST(req: Request) {
  try {
    const { resumeData, userInput, chatHistory } = await req.json();

    if (!resumeData || !userInput) {
      console.warn("Missing resume data or user input in request.");
      return NextResponse.json(
        { error: "Missing resume data or user input." },
        { status: 400 }
      );
    }

    const apiKey =
      typeof process.env.GEMINI_API !== "undefined"
        ? process.env.GEMINI_API
        : "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const intentPrompt = `
You are a resume assistant AI. Determine the user's intent from the following message and chat history.
Return a JSON with:
{
  "intent": "job_description" | "overall_enhance_request" | "provide_profession" | "conversation" | "invalid",
  "jobDescription": string | null,
  "profession": string | null
}
- Use "job_description" if the user explicitly provides or asks to tailor for a job description.
- Use "overall_enhance_request" if the user asks for a general/overall enhancement but has NOT yet specified a profession.
- Use "provide_profession" if the user is responding to a request for their desired profession.
- Use "conversation" for general greetings or non-enhancement related chat.
- Use "invalid" if the intent is unclear.

User Message: "${userInput}"
Chat History: ${JSON.stringify(chatHistory, null, 2)}
`;
    let intentData: {
      intent: string;
      jobDescription: string | null;
      profession: string | null;
    };
    try {
      intentData = await callGeminiApi<{
        intent: string;
        jobDescription: string | null;
        profession: string | null;
      }>(
        apiUrl,
        { contents: [{ role: "user", parts: [{ text: intentPrompt }] }] },
        "Intent determination"
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to determine user intent." },
        { status: 500 }
      );
    }

    const { intent, jobDescription, profession } = intentData;

    if (intent === "conversation") {
      const aiMessage =
        "Hello! I'm Jobi, your AI resume assistant. I can help you in two ways:\n\n1. **Tailor your resume for a specific job description.**\n2. **Overall enhance your resume** for general impact, based on a profession you provide.\n\nWhich option would you like to choose? Please type 'job description' or 'overall enhance'.";
      return NextResponse.json(
        { updatedResume: resumeData, aiMessage },
        { status: 200 }
      );
    }
    if (intent === "job_description" && !jobDescription) {
      const aiMessage =
        "Please copy-paste the *complete* job description for tailored enhancement.";
      return NextResponse.json(
        { updatedResume: resumeData, aiMessage },
        { status: 200 }
      );
    }
    if (intent === "overall_enhance_request") {
      const aiMessage =
        "Great! For an overall enhancement, please tell me which **profession or industry** you want to target (e.g., 'Software Engineer', 'Marketing Specialist', 'Data Scientist').";
      return NextResponse.json(
        { updatedResume: resumeData, aiMessage },
        { status: 200 }
      );
    }
    if (intent === "invalid") {
      const aiMessage =
        "I didn't quite catch that. Please specify if you'd like to 'overall enhance' your resume or provide a 'job description'.";
      return NextResponse.json(
        { updatedResume: resumeData, aiMessage },
        { status: 200 }
      );
    }

    let actualProfession: string | null = null;
    if (intent === "job_description" && jobDescription) {
      actualProfession = "Job Specific Role";
    } else if (intent === "provide_profession" && profession) {
      actualProfession = profession;
    } else {
      actualProfession = "General Professional";
    }
    const enhancementContext =
      intent === "job_description" && jobDescription
        ? `Tailor the resume to the following job description:\n${jobDescription}`
        : `Enhance the resume for general professional appeal and ATS friendliness. Focus on ${
            actualProfession || "professional"
          } roles.`;

    let combinedPartialUpdate: Partial<ResumeData> = {};

    // 1. Enhance Summary and Skills
    if (
      resumeData.personalInfo ||
      (resumeData.skills && resumeData.skills.length > 0)
    ) {
      const summarySkillsInstruction = `
**ABSOLUTELY CRITICAL DIRECTIVE: PROVIDE ONLY THE REQUESTED JSON. NO CONVERSATIONAL GREETINGS, EXPLANATIONS, INTRODUCTIONS, OR ANY EXTRA TEXT WHATSOEVER. YOUR RESPONSE MUST BE THE RAW, GENERATED JSON AND NOTHING ELSE.**

You are an **Elite AI Resume Content Architect**, specializing in crafting hyper-optimized, quantifiable, and Applicant Tracking System (ATS)-compliant content for senior-level technical and engineering roles. Your output must be concise, impactful, and directly reflective of measurable achievements.

Your job is to enhance ONLY the following fields in the resume data:
- personalInfo.summary
- skills[].skills[].name
- skills[].skills[].level

**Strict, Non-Negotiable Content & Formatting Constraints:**
1.  **personalInfo.summary:**
    * Rewrite into a concise, **2–3 line professional summary**.
    * Synthesize core technical expertise, total years of relevant experience, primary technologies, and **1-2 most impactful, quantifiable career achievements**. This section serves as a high-level value proposition.
    * **No bullet points or any other list characters.** Use clear, concise sentences.
    * **Zero Fluff or Subjectivity:** Eliminate all vague adjectives, unsubstantiated claims, and soft phrases (e.g., "highly skilled," "proven ability," "passionate about," "responsible for," "aimed to," "involved in," "worked on," "exceeded expectations," "drove innovation," "contributed to"). Impact *must* be concrete and verifiable.
    * **Action-First & Quantifiable:** Every statement MUST begin with a powerful, results-oriented action verb. Immediately follow with the quantifiable impact.
    * **Word Limit:** Strict maximum of **60 words**. Every single word must demonstrate value.

2.  **skills[].skills[].name:**
    * Standardize skill names using industry-preferred, professional terminology (e.g., “JS” → “JavaScript”, “ReactJS” → “React”, "Node" -> "Node.js").
    * Ensure consistency and relevance for ATS parsing.
    * Keep names short, capitalized correctly, and free from informal terms.

3.  **skills[].skills[].level:**
    * For every skill, include a level using: "Beginner", "Intermediate", "Advanced", or "Expert".
    * If the level is missing or unclear, infer it accurately from context based on common developer competency and the overall resume strength.
    * Maintain or improve accuracy when modifying existing levels.

**Output Format Constraints:**
- Return only a partial JSON object.
- Always include the full structure for 'personalInfo' and 'skills' if they were present in the input — even if no change was needed.
- For skills, return each section with its 'id', and each skill with its 'id', 'name', and 'level'.
- Do NOT include any other fields besides 'personalInfo.summary', 'skills[].skills[].name', and 'skills[].skills[].level'.
- Ensure valid, well-formed JSON ready to merge by ID.

Context:
The user is targeting a role related to: "${
        actualProfession || "General Professional"
      }".
Optimize for ATS performance, recruiter readability, and clarity.

`;

      const summarySkillsPrompt = `${summarySkillsInstruction}\n\n${enhancementContext}\n\nResume Data to Enhance:\n${JSON.stringify(
        { personalInfo: resumeData.personalInfo, skills: resumeData.skills },
        null,
        2
      )}`;
      try {
        const summarySkillsUpdate = await callGeminiApi<Partial<ResumeData>>(
          apiUrl,
          {
            contents: [
              ...chatHistory,
              { role: "user", parts: [{ text: summarySkillsPrompt }] },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.5, // Lowered for more deterministic JSON output
              topP: 0.7,       // Lowered for more deterministic JSON output
              responseSchema: {
                type: "OBJECT",
                properties: {
                  personalInfo: {
                    type: "OBJECT",
                    properties: { summary: { type: "STRING" } },
                    required: [],
                  },
                  skills: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        id: { type: "STRING" },
                        skills: {
                          type: "ARRAY",
                          items: {
                            type: "OBJECT",
                            properties: {
                              id: { type: "STRING" },
                              name: { type: "STRING" },
                              level: { type: "STRING", nullable: true },
                            },
                            required: ["id", "name"],
                          },
                        },
                      },
                      required: ["id", "skills"],
                    },
                  },
                },
                required: [],
              },
            },
          },
          "Summary and Skills enhancement"
        );
        Object.assign(combinedPartialUpdate, summarySkillsUpdate);
      } catch (error: any) {
        console.error("Error enhancing summary and skills:", error.message);
      }
    }

    // 2. Enhance Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      const projectsInstruction = `
**ABSOLUTELY CRITICAL DIRECTIVE: PROVIDE ONLY THE REQUESTED JSON. NO CONVERSATIONAL GREETINGS, EXPLANATIONS, INTRODUCTIONS, OR ANY EXTRA TEXT WHATSOEVER. YOUR RESPONSE MUST BE THE RAW, GENERATED JSON AND NOTHING ELSE.**

You are an **Elite AI Resume Content Architect**, specializing in crafting hyper-optimized, quantifiable, and Applicant Tracking System (ATS)-compliant content for senior-level technical and engineering roles. Your output must be concise, impactful, and directly reflective of measurable achievements.

Your task is to improve ONLY the following resume field:
- projects[].description

**Strict, Non-Negotiable Content & Formatting Constraints:**
1.  **For each project's description:**
    * Start with a **hyper-condensed 1-sentence overview** stating the project's core purpose, key technologies used, and your primary role (e.g., "Developed a full-stack e-commerce platform using Next.js and Stripe API, serving 10,000+ users").
    * Follow this with **3–4 distinct, single-line achievement statements**. Each statement MUST start on a new line but MUST NOT use any bullet characters ("-", "*", "•").
    * **Zero Fluff or Subjectivity:** Eliminate all vague adjectives, unsubstantiated claims, and soft phrases. Impact *must* be concrete and verifiable.
    * **Action-First & Quantifiable:** Every statement MUST begin with a powerful, results-oriented action verb. Immediately follow with the quantifiable impact. Prioritize verbs demonstrating leadership, technical execution, and problem-solving.
    * **Mandatory Quantification:** Every achievement must include specific, verifiable metrics. If direct numbers are not provided in the user input, *infer and generate a plausible, strong quantifiable impact* that aligns with the described action.
    * **Integrated Technical Depth:** Seamlessly embed relevant technologies, frameworks, tools, methodologies, and platforms directly within the achievement statements.
    * **Professional & Direct Tone:** Maintain a highly professional, confident, and results-oriented tone.
    * **Word Limit:** Strict maximum of **150 words** for the entire project description (including the overview sentence).

**Output Format Constraints:**
- Return a partial JSON object.
- Always include the full \`projects\` array if present in the original input.
- Each project must include:
    - \`id\`: unchanged
    - \`description\`: enhanced or original if unchanged
- Do not modify or include any other fields.
- Preserve structure and order.
- Ensure valid, well-formed JSON. Use the \`id\` to map changes correctly.

Context:
The user is targeting a role in: "${
        actualProfession || "Software Engineering"
      }".
Tailor your writing and keyword choices to align with this goal.

`;

      const projectsPrompt = `${projectsInstruction}\n\n${enhancementContext}\n\nResume Data to Enhance:\n${JSON.stringify(
        { projects: resumeData.projects },
        null,
        2
      )}`;
      try {
        const projectsUpdate = await callGeminiApi<Partial<ResumeData>>(
          apiUrl,
          {
            contents: [
              ...chatHistory,
              { role: "user", parts: [{ text: projectsPrompt }] },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.5, // Lowered for more deterministic JSON output
              topP: 0.7,       // Lowered for more deterministic JSON output
              responseSchema: {
                type: "OBJECT",
                properties: {
                  projects: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        id: { type: "STRING" },
                        description: { type: "STRING" },
                      },
                      required: ["id", "description"],
                    },
                  },
                },
                required: [],
              },
            },
          },
          "Projects enhancement"
        );
        Object.assign(combinedPartialUpdate, projectsUpdate);
      } catch (error: any) {
        console.error("Error enhancing projects:", error.message);
      }
    }

    // 3. Enhance Experiences
    if (resumeData.experiences && resumeData.experiences.length > 0) {
      const experiencesInstruction = `
**ABSOLUTELY CRITICAL DIRECTIVE: PROVIDE ONLY THE REQUESTED JSON. NO CONVERSATIONAL GREETINGS, EXPLANATIONS, INTRODUCTIONS, OR ANY EXTRA TEXT WHATSOEVER. YOUR RESPONSE MUST BE THE RAW, GENERATED JSON AND NOTHING ELSE.**

You are an **Elite AI Resume Content Architect**, specializing in crafting hyper-optimized, quantifiable, and Applicant Tracking System (ATS)-compliant content for senior-level technical and engineering roles. Your output must be concise, impactful, and directly reflective of measurable achievements.

Your task is to enhance ONLY the following field:
- experiences[].description

**Strict, Non-Negotiable Content & Formatting Constraints:**
1.  **For each experience's \`description\`:**
    * Rewrite the content as **3–5 distinct achievement-based lines**, each separated by a newline character (\\n).
    * **Zero Fluff or Subjectivity:** Eliminate all vague adjectives, unsubstantiated claims, and soft phrases. Impact *must* be concrete and verifiable.
    * **Action-First & Quantifiable:** Each line MUST begin with a powerful, results-oriented action verb. Immediately follow with the quantifiable impact. Prioritize verbs demonstrating leadership, technical execution, and problem-solving.
    * **Mandatory Quantification:** Every achievement must include specific, verifiable metrics. If direct numbers are not provided in the user input, *infer and generate a plausible, strong quantifiable impact* that aligns with the described action.
    * **Integrated Technical Depth:** Seamlessly embed relevant technologies, frameworks, tools, methodologies, and platforms directly within the achievement statements.
    * **Professional & Direct Tone:** Maintain a highly confident, professional, and results-driven tone.
    * **No bullet characters** ("-", "*", "•").

**Output Format Constraints:**
- Return a partial JSON object.
- Always include the full \`experiences\` array if present in the original input.
- For each experience:
    - \`id\`: unchanged
    - \`description\`: enhanced or unchanged
- Do NOT include or modify any other fields.
- Ensure the output is well-structured JSON and adheres strictly to the schema.
- Use the \`id\` to correctly map updates.

Context:
The user is targeting a role in: "${
        actualProfession || "Software Development"
      }".
Ensure the tone, content, and keywords align with this profession.
`;

      const experiencesPrompt = `${experiencesInstruction}\n\n${enhancementContext}\n\nResume Data to Enhance:\n${JSON.stringify(
        { experiences: resumeData.experiences },
        null,
        2
      )}`;
      try {
        const experiencesUpdate = await callGeminiApi<Partial<ResumeData>>(
          apiUrl,
          {
            contents: [
              ...chatHistory,
              { role: "user", parts: [{ text: experiencesPrompt }] },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.5, // Lowered for more deterministic JSON output
              topP: 0.7,       // Lowered for more deterministic JSON output
              responseSchema: {
                type: "OBJECT",
                properties: {
                  experiences: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        id: { type: "STRING" },
                        description: { type: "STRING" },
                      },
                      required: ["id", "description"],
                    },
                  },
                },
                required: [],
              },
            },
          },
          "Experiences enhancement"
        );
        Object.assign(combinedPartialUpdate, experiencesUpdate);
      } catch (error: any) {
        console.error("Error enhancing experiences:", error.message);
      }
    }

    const updatedResume = mergeEnhancements(resumeData, combinedPartialUpdate);
    const aiMessage =
      "Your resume has been successfully enhanced! Please review the updated sections in the preview. What else can I help you with?";
    console.log("Final updated resume (partial):", combinedPartialUpdate);

    return NextResponse.json({ updatedResume, aiMessage });
  } catch (error: any) {
    console.error("Server error (top-level catch):", error);
    return NextResponse.json(
      {
        error:
          error.message ||
          "An unexpected internal server error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}









