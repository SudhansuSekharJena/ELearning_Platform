import mongoose from "mongoose"

export const connectDB = async () =>{
  try{
    await mongoose.connect(process.env.DB)
    console.log("Database Connected Successfully...")
  } catch (error){
    console.log(`Error occured while connecting database...`)
  }
}