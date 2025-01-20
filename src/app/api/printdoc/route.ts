import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("PrintEase");
    const PrintDocCollection = db.collection("PrintDoc");

    const body = await req.json();

    // Validate request body
    if (!body.userID || !body.fileID || !body.storeID || !body.status || !body.type || !body.cost || !body.paymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert into database
    const newPrintDoc = await PrintDocCollection.insertOne({
      userID: new ObjectId(body.userID),
      fileID: body.fileID.map((id: string) => new ObjectId(id)),
      storeID:body.storeID,
      status: body.status,
      type: body.type,
      cost: body.cost,
      createdAt: new Date(),
      paymentId: body.paymentId,
    });

    return NextResponse.json({ message: "PrintDoc created successfully", id: newPrintDoc.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating PrintDoc:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


