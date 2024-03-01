import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import { default as morgan } from "morgan";
import passport from "./Middlewares/Passport.js";
import path from "path";
import { fileURLToPath } from "url";
import "./Config/database.config.js";
import { errorHandler, errorNotFound } from "./Middlewares/Response_handler.js";
import indexRouter from "./routes/index.routes.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  cors({
    origin: (origin: any, callback) => {
      const ACCEPTED_ORIGINS = [
        "http://localhost:3000",
        "https://pedilo.app",
        "https://www.pedilo.app",
      ];

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(morgan("dev"));
app.use(
  session({
    secret: "Acá tenés que poner tu secret como string",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", indexRouter);
app.use(express.static(path.join(__dirname, "public")));
app.use(errorNotFound);
app.use(errorHandler);

export default app;
