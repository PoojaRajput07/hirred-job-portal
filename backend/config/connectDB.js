import mongoose from "mongoose";
const connectDB=async()=>{
    mongoose.connection.on("connected",()=>{
        console.log("database connected")
    })
    const mongooseInstance=await mongoose.connect(`${process.env.MONGOOSE_URI}/jobPortal`);
   
}
export default connectDB;