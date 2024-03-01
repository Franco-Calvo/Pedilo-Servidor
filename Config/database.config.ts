import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO || "")
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));
