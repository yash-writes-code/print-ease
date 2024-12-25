import mongoose, {Schema, Document} from "mongoose";

export interface User extends Document{
    userID: string;
    name: string;
    rollNo: number;
}

const UserSchema: Schema<User> = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    rollNo: {
        type: Number,
        required: true,
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;

