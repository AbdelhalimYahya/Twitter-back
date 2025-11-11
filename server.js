import express from "express";
import authRoutes from "./routes/auth.route.js";
import connectMongoDB from "./db/mongoDB.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route.js";
import { v2 as cloudinary } from "cloudinary";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";
import cors from "cors";
import path from "path";

dotenv.config();
const __dirname = path.resolve();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true })); // to parse form data
app.use(cookieParser());
app.use(cors({
        origin: "https://twitter-ten-rust.vercel.app",
        credentials: true,
    }));
    // app.use(cors({
    //     origin: "*", // Allow all origins
    //     methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    //     credentials: true, // Allow cookies/auth headers
    //     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    //   }));

    app.use((req, res, next) => {
        res.setHeader(
            "Cache-Control",
            "no-store, no-cache, must-revalidate, proxy-revalidate"
          );
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        next();
      });

    //   res.setHeader("Access-Control-Allow-Origin", "https://twitter-ten-rust.vercel.app");
    //     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    //     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
app.use("/api/auth",authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectMongoDB();
});