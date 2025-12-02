const express=require("express");
const connectDb=require("./config/database")
const cors=require("cors")
const app=express();
// Routers
const authRouter = require("./Routers/authRouter.js");
const bookRouter = require("./Routers/bookRouter.js");
const membershipRouter = require("./Routers/membershipRouter.js");
const userRouter = require("./Routers/userRouter.js");
const transactionRouter = require("./Routers/transactionRouter.js");
const reportsRouter =require("./Routers/reportRouter.js");
const cookieParser=require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:"http://localhost:3002",
    credentials:true
}))

app.use("/", authRouter);
app.use("/", bookRouter);
app.use("/", membershipRouter);
app.use("/", userRouter);
app.use("/", transactionRouter);
app.use("/", reportsRouter);


const start=async ()=>{
    try{
        await connectDb();
        app.listen(3000,()=>{
            console.log("Server is listing in port no 3000");
        });

    }catch(err){
         console.log(err.message);
    }
}
start();