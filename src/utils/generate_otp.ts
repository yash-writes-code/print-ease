import clientPromise from "@/lib/db";


const client = await clientPromise;
const db = client.db("PrintEase");


export async function generate_otp() {
    const OtpCollection = db.collection("Otp");

    // Try to find the OTP document
    const otpDoc = await OtpCollection.findOne({key:"current_otp"});

    const currentOtp = otpDoc?.otp || "A0"; // Default to A0 if not found
    const newOtp = incrementOtp(currentOtp);

    // Upsert the document (insert if not exists, update if exists)
    await OtpCollection.updateOne(
        { key: "current_otp" },
        { $set: { otp: newOtp } },
        { upsert: true }
    );

    return newOtp;
}

function incrementOtp(otp: string): string {
    let [letter, number] = [otp[0], otp.slice(1)];
    const num = parseInt(number);

    if (num === 99) {
        letter = letter === "Z" ? "A" : String.fromCharCode(letter.charCodeAt(0) + 1);
        number = "0";
    } else {
        number = String(num + 1);
    }

    return letter + number;
}


function incrementLetterLoop(letter:string) {
    return letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
}

function increment_otp(current_otp:string){
    let [letter,number]=[current_otp[0],current_otp.slice(1)];
    
    if(eval(number) == 99){
        letter=incrementLetterLoop(letter);
        number="0";
    }
    else{
        number = String(eval(number)+1);
    };
    current_otp=letter+number;
    return current_otp;
}

