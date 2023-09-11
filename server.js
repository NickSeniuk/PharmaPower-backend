import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "../server/routes/categoryRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import cors from "cors";

import connectDB from "./config/db.js";

//config env
dotenv.config();

//database connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/pharma/auth", authRoutes);
app.use("/pharma/category", categoryRoutes);
app.use("/pharma/medicine", medicineRoutes);

//rest api
app.get("/", (req, res) => {
  res.send({ message: "Welcome!" });
});

//PORT
const PORT = process.env.PORT || 3001;

//running server
app.listen(PORT, (req, res) => {
  console.log(`Server runs on ${process.env.DEV_MODE} on port ${PORT}`);
});
