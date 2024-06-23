import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


//data kha kha se aayega usse kaise handle kregye
app.use(express.json({limit: "50mb"}));  //json data
app.use(express.urlencoded({limit: "32kb"}))  //url data
app.use(express.static("public"))  //when file upload store in public folder
app.use(cookieParser())  //cookie data


//routes import
import userRouter from "../src/routes/user.routes.js"
import fileRouter from "../src/routes/file.routes.js"

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/files", fileRouter);

export default app;