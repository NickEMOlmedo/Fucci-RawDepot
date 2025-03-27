import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { authUser } from "./middleware/auth.js";
import adminRoutes from "./routes/admin.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import productRoutes from "./routes/product.routes.js";
import entryRoutes from "./routes/entry.routes.js";
import lotRoutes from "./routes/lot.routes.js";
import withdrawalRoutes from "./routes/withdrawal.routes.js";
import withdrawatlDetailRoutes from "./routes/withdrawalDetails.routes.js";

dotenv.config();

const port = process.env.PORT ?? 3000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(helmet());
app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.listen(port);

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/api/admins", adminRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", authUser, productRoutes);
app.use("/api/entrys", authUser, entryRoutes);
app.use("/api/lots", authUser, lotRoutes);
app.use("/api/withdrawals", authUser, withdrawalRoutes);
app.use("/api/withdrawal-details", authUser, withdrawatlDetailRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).json({
      error:
        "Error de sintaxis, asegurate de introducir los datos de manera correcta.",
    });
  }
});
