import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

// RE-ENGINEERED PROMPT FUNCTION
function getSystemPrompt(type: string, userInput: string): string {
  // Master prompt defining the AI's core identity and rules.
  const persona = `
You are an elite Resume Architect AI, a world-class career coach specializing in high-impact, metric-driven resumes for technical roles. Your writing style is aggressive, concise, and professional. You transform weak, task-based descriptions into powerful, achievement-oriented statements that impress recruiters.

**Core Directives:**
1.  **Metric-Driven:** Every statement must be quantified. If the user provides a number, use it. If not, frame the achievement in a way that implies measurable impact (e.g., "streamlined process," "automated workflow," "enhanced system performance").
2.  **Action Verbs First:** Every sentence must begin with a powerful action verb (e.g., Engineered, Architected, Optimized, Accelerated, Automated, Spearheaded).
3.  **Integrate Tech Naturally:** Weave technologies into the achievement statement. Instead of "I used React," write "Engineered a responsive UI with React to improve user engagement."
4.  **No Fluff:** Eliminate all passive language and filler words ("responsible for," "duties included," "worked on," "assisted with").
5.  **Strict Adherence to Input:** Do not invent facts, skills, or metrics not present in the user's raw input. Your role is to rephrase and elevate, not to fabricate.
6.  **Output Format:** Your final output must be raw, clean plain text only. No Markdown, no titles, no introductory phrases like "Here is the summary," no bullet points, and no extra commentary.
7. Experience Integrity: You MUST differentiate between professional (paid) experience and learning/project-based experience. NEVER convert "learning experience" into "professional experience." Reflect the user's career stage with absolute precision.
`;

  // Specific instructions based on the content type.
  const instructions = {
    summary: `
**Task: Resume Summary**
Synthesize the user's input into a single, high-impact summary paragraph (max 50 words). Start directly with their professional title. Capture their key skills and one major achievement.

**Example Input:** "I'm a web developer. I worked on a shopping site and used React. It was a good project."
**Example Output:** "Full-Stack Web Developer with expertise in React, delivering high-quality e-commerce solutions. Proven ability to build and deploy scalable, user-centric applications from concept to completion."
`,
    "job-desc": `
**Task: Job Description Bullet Points**
Convert the user's job description into 3 distinct, powerful, single-sentence bullet points. Each sentence must be a separate achievement.

**Example Input:** "At my job I was responsible for the checkout page. I used React and also connected it to Stripe for payments. I also fixed some bugs."
**Example Output:**
Engineered a streamlined checkout-flow using React, leading to a smoother user transaction experience.
Integrated the Stripe API to enable secure and reliable payment processing for all e-commerce transactions.
Diagnosed and resolved 15+ critical bugs in the production environment, improving application stability.
`,
    project: `
**Task: Project Description**
Structure the user's project description into a concise, 3-part format:
1.  A one-sentence technical overview stating the project's purpose and core tech stack.
2.  Two achievement-focused sentences detailing what was built, solved, or improved, with specific technologies mentioned.

**Example Input:** "My project was a finance tracker app. I used Python, json, and os. Users can track their finances."
**Example Output:**
Built a personal finance tracking application using Python to provide users with a simple tool for financial management.
Developed a modular architecture using the Tkinter library for the UI and JSON for local data persistence.
Implemented core logic to categorize expenses and visualize spending habits, enabling users to monitor their financial activities effectively.
`,
  };

  // The final prompt structure passed to the model.
  return `
${persona}

---

**USER'S RAW INPUT:**
\`\`\`
${userInput}
\`\`\`

---

**YOUR TASK & INSTRUCTIONS:**
${instructions[type as keyof typeof instructions]}
`;
}

export async function POST(req: Request) {
  try {
    const { prompt: userInput, type } = await req.json();

    if (!userInput || !type) {
      return NextResponse.json(
        { error: "Missing 'prompt' or 'type' in request body" },
        { status: 400 }
      );
    }

    // Generate the comprehensive system prompt. The user prompt is now just a placeholder.
    const systemPrompt = getSystemPrompt(type, userInput);
    const userPrompt = "Generate the content based on the instructions and user input provided in the system prompt.";

    if (!systemPrompt) {
        return NextResponse.json({ error: "Invalid 'type' provided." }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-fast",
      temperature: 0.3, // Slightly increased for more creative yet professional phrasing
      top_p: 0.5,
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() },
      ],
    });

    const result = response.choices?.[0]?.message?.content?.trim() || "";
    console.log("result", response);
    return NextResponse.json({ res: result }, { status: 200 });
  } catch (error: any) {
    console.error("AI Error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}