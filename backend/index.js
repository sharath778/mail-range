import express from "express";
import connectDB from "./db.js";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./user/userRoutes.js";
import mailRoutes from "./mail/mailRoutes.js";
import authMiddleware from "./middlwares/authMiddleware.js";


const __dirname = path.resolve();

const app = express();

// Connect to MongoDB

connectDB();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/mail", authMiddleware, mailRoutes);


app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*",(req,res)=>{
  res.sendFile(path.join(__dirname,"frontend","dist", "index.html"));  //path.join(__dirname,"/frontend/dist/index.html") is the path to your index.html file in dist folder.
})
app.listen(5000, () => {
  console.log(`Server running on port 5000`);
});
