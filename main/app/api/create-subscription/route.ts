// app/api/create-subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/auth";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    const planId =process.env.MONTHLY_PLANID!; 

      const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 1,
    });
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionId: subscription.id,
              lastSubscriptionDate:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

       },

    });
    return NextResponse.json({
      subscriptionId: subscription.id,
      user,
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
