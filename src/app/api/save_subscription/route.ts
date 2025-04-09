import { NextRequest,NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import {auth} from "@/lib/auth"

export async function POST(req:NextRequest){

    const session = await auth();

    if(!session?.user?.email){
        return NextResponse.json({"message":"unauthorised"},{status:401})

    }

    const {pushSubscription,allowsNotifications} = await req.json();
    const client =await clientPromise;
    const db= client.db();

    console.log(pushSubscription);
    
    const user_collection =  db.collection("users");

    user_collection.updateOne(
        {email:session.user.email},
        {
            $set: {
                allowsNotifications:true,
                pushSubscription:pushSubscription,
              },
        }
    )

    return NextResponse.json({message:"Push Subscription saved"},{status:200});
}