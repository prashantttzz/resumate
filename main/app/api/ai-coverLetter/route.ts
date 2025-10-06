import { getUserIdFromSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(req: Request) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 400 });
  }
  const {input} = await req.json();
  const data = input;
  if (!data) {
    return NextResponse.json({ error: "no data available" }, { status: 400 });
  }
  try {
    const systemPrompt = `You are an expert cover letter assistant AI.

Your task is to write a professional, personalized cover letter tailored to a specific job description using the user’s resume data.

**Content requirements:**
- Keep the cover letter **brief and impactful** — no longer than what would fit on **one standard A4 page** (~250–350 words).
- Focus on **relevance and clarity**, not repetition or generic phrases.
- Highlight the candidate’s **top 1–2 strengths** that directly match the job description.
- Maintain a **professional yet human tone**, avoiding fluff or filler.
- Use standard formatting: greeting, introduction, body (key value points), closing with a call to action.

Use the resume data and job description provided. If any details are unclear, make reasonable assumptions based on the resume context.

Only return the **plain text** of the cover letter. Do not include JSON, markdown, or formatting codes.

`;

    const userPrompt = `Full Name: ${data.fullName}Email: ${data.email}Phone: ${
      data.phone
    }Company: ${data.companyName}Hiring Manager: ${
      data.hiringManager || "Not specified"
    }Job Title: ${data.jobTitle}your prompt: ${data.content}Preferences: ${
      data.preferences || "Not specified"
    }
      `;

    const response = await openai.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      temperature: 0.6,
      top_p: 0.9,
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt.trim(),
        },
      ],
    });

    const result = response.choices?.[0]?.message?.content?.trim() || "";
    if (!result) {
      return NextResponse.json(
        { error: "unable to generate ai response" },
        { status: 400 }
      );
    }
    return NextResponse.json({ res: result }, { status: 200 });
  } catch (error: any) {
    console.error(error.message || "internal server error");
    return NextResponse.json(
      { error: error.message || "interal server error" },
      { status: 500 }
    );
  }
}
