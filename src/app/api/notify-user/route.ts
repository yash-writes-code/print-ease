// app/api/notify-user/route.ts (App Router route)
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import webPush from "@/lib/webpush";

export async function POST(req: NextRequest) {
  const { userEmail, title ,body} = await req.json();

  console.log(userEmail);
  
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection("users").findOne({ email: userEmail });
  console.log("USER MIL GYAA BHNCHODDD");
  console.log(user);
  console.log(user?.allowsNotifications);
  
  
  
  if (!user?.pushSubscription) {
    console.log("subscription nhi hai user ke pass??");
    
    return NextResponse.json({ error: "User has no push subscription" }, { status: 400 });
  }

  const payload = JSON.stringify({
    title: title,
    body: body,
  });

  try {
    await webPush.sendNotification(user.pushSubscription, payload);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send notification:", err);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
