import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Auth from "./Routes/AuthRoute.js";
import Equipment from "./Routes/EquipmentRoute.js";
import cors from 'cors'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
  methods: ["GET", "PUT", "POST", "DELETE"],
}))
const port = process.env.PORT || 5000;






app.use("/api/auth", Auth);





mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected With DB Successfull"))
  .catch((e) => console.log("Db Connection Failed"));


const server = app.listen(port, () => {
  console.log(`Server is Listening on PORT ${port}`);
})