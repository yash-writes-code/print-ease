import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  
    // Parse the incoming FormData
    const formData = await req.formData();
    
    console.log("data aagya bhaiyaaaaa");
    console.log(formData);
    
    // Send a success response
    return NextResponse.json(
      {
        message: "Files uploaded successfully",
      },
      { status: 200 }
    );


}
