// app/api/razorpay-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event;

  if (event === "subscription.activated" || event === "subscription.charged") {
    const subscriptionId = payload.payload.subscription.entity.id;
    const user = await prisma.user.updateMany({
      where: { subscriptionId },
      data: { isPremium: true },
    });

    if (event === "subscription.completed") {
      const subscriptionId = payload.payload.subscription.entity.id;
      await prisma.user.updateMany({
        where: {
          subscriptionId,
        },
        data: {
          isPremium: false,
          lastSubscriptionDate: new Date(),
          subscriptionId: null,
        },
      });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ received: true });
}
