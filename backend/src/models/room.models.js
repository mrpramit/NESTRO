import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        maxLenght:20,
        required: [true, "Room name is required"],
        unique: true
    },
    slug:{
        type:String,
        minLength:3,
        maxLenght:20,
        required: [true, "Room slug is required"],
        unique: true
    },
    status:{
        type:Boolean,
        default: true
    }
},
    {
        timestamps:true
    }
)

const RoomModel =  mongoose.model("rooms",roomSchema);
export default RoomModel;