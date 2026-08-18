import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        maxLenght:20,
        required: [true, "Category name is required"],
        unique: true
    },
    slug:{
        type:String,
        minLength:3,
        maxLenght:20,
        required: [true, "Category slug is required"],
        unique: true
    },
    image:{
        type:String
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

const CategoryModel =  mongoose.model("categories",categorySchema);
export default CategoryModel;