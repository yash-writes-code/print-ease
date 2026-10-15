import mongoose, {Schema, Document} from "mongoose";
import { generate_otp } from "@/utils/generate_otp";

export interface PrintDoc extends Document{
    userID: mongoose.Types.ObjectId;
    fileID: mongoose.Types.ObjectId[];
    storeID: mongoose.Types.ObjectId;
    status: 'pending' | 'completed' | 'collected';
    type: string;
    cost: number;
    createdAt: Date;
    paymentId:string;
    otp:string;
}

const PrintDocSchema: Schema<PrintDoc> = new Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    fileID: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "File", 
        required: true,
    },
    storeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store", 
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default : Date.now(),
        required:true
    },
    paymentId:{
        type:String,
        required : true
    },
    otp:{
        type:String,
        required:true,
        default:"A0"      
    }
})

const PrintDocModel = (mongoose.models.PrintDoc as mongoose.Model<PrintDoc>) || mongoose.model<PrintDoc>("PrintDoc", PrintDocSchema)

export default PrintDocModel;