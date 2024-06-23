import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";

const port = process.env.PORT || 8000;


dotenv.config(
    {
        path: "./.env"
    }
)

connectDB()
.then( ()=> {
    app.on("Error", (error)=> {
        console.log(`Error: ${error}`)
        throw error
    })

    app.listen(port, () => {
        console.log(`Server is running at : ${port}`)
    })
})
.catch((err) => {
    console.log("MongoDB Connection Failed !!! ", err);
})
