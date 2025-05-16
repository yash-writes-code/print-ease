import mongoose, {Schema, Document} from "mongoose";

export interface Store extends Document{
    storeID: string;
    name: string;
    address: string;
    phone: number;
}

const StoreSchema: Schema<Store> = new Schema({
    storeID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    }
})

const StoreModel = (mongoose.models.Store as mongoose.Model<Store>) || mongoose.model<Store>("Store", StoreSchema)

export default StoreModel;