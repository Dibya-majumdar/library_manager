const mongoose=require("mongoose");
const connectDb=async ()=>{
await mongoose.connect("mongodb+srv://majumdardibya700:VyPPvjRH9XXKueEu@cluster0.4cwur.mongodb.net/library");
}
module.exports=connectDb;

