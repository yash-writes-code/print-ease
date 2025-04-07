import clientPromise from "@/lib/db";

const client = await clientPromise;
const db = client.db("PrintEase");

export async function generate_otp() {
    //alternate way to find current otp is to juist find the last printdoc instance and update it
    const PrintDocCollection = db.collection("PrintDoc");

    const last_pd = await PrintDocCollection.find().sort({createdAt:-1}).limit(1).next();

    const currentOtp = last_pd?.otp?? "A0";

    const newOtp = incrementOtp(currentOtp);

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


