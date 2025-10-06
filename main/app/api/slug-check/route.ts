import { getUserIdFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getUserIdFromSession();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const { link } = await req.json();
    const existing = await prisma.resume.findUnique({
      where: { slug: link },
    });

    if (existing) {
      return NextResponse.json({ available: false }, { status: 200 });
    }

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (err) {
    console.error("Slug check error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
