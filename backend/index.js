import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectToDB from "./db.js";
import todoRoute from "./routes/todo.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 4002;

//using cors
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:"GET,POST,PUT,DELETE",
    allowedHeaders:["Content-Type", "Authorization"]
}))

app.use(express.json());
app.use(cookieParser());


connectToDB();

app.use("/todo", todoRoute);
app.use("/user", userRoute)


app.get("/", (req, res) => {
    res.send("Hello clients!")
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})