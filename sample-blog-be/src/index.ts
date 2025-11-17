import express from "express"
import cors from "cors"
import authRouter from "./routes/authRoutes"
import postRouter from "./routes/postRoutes"
import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT || 5000
const MONGO_URI = process.env.MONGO_URI as string || "mongodb://localhost:27017/smart_blog_db"

const app = express()

app.use(express.json())

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/posts", postRouter)

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error)
        process.exit(1)
    })

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${SERVER_PORT}`)
})
