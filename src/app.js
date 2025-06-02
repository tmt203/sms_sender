import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import xss from "xss-clean";
import globalErrorHandler from "./utils/handlerGlobalError.js";
import brandRouter from "./routes/brand.route.js";
import templateRouter from "./routes/template.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Start app
const app = express();
app.enable("trust proxy");

// Global middlewares
app.use(cors());
app.options("*", cors());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());

// Routes
app.use("/api/sns/brands", brandRouter);
app.use("/api/sns/templates", templateRouter);

app.get("/", (req, res) => {
  res.json("Backend started successfully");
});

// Error Routes
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Can not find ${req.originalUrl} on this server`,
  });
});

app.use(globalErrorHandler);

export default app;
