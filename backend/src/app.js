import 'dotenv/config'
import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { connectDB } from './config/connectDB.js';
const server = express();
//Router import
import categoryRouter from "./routers/category.router.js";
import roomRouter from "./routers/room.router.js";
import productRouter from "./routers/product.router.js"
import userRouter from "./routers/user.router.js"
import orderRouter from "./routers/order.router.js"
//JSON Parser
server.use(express.json());
//Cookie Parser
server.use(cookieParser());
//Cors
server.use(cors({
    origin: ["http://localhost:3000", "https://nestro-khaki.vercel.app"],
    credentials: true
}));
//Router use
server.use("/api/category", categoryRouter);
server.use("/api/room-type", roomRouter);
server.use("/api/product", productRouter);
server.use("/api/user", userRouter);
server.use("/api/order", orderRouter);


connectDB().then(() => {
    server.listen(process.env.PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${process.env.PORT}`)
        console.log("backend started")
    })
}).catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});
