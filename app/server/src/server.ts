import "dotenv/config";

import express, { type Request, type Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { changePasswordHandler, loginHandler, logoutHandler, meHandler, registerHandler } from "./handlers/auth";
import { expenseTrackerHandler } from "./handlers/expense-tracker";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Serve mainUI as a built site (dist only)
const mainUiDistDir = path.join(__dirname, "../../UI/mainUI/dist");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(mainUiDistDir));

app.post("/register", registerHandler);

app.post("/login", loginHandler);

app.get("/me", meHandler)

app.post("/logout", logoutHandler);

app.post("/change-password", changePasswordHandler);

// SPA fallback for React Router (exclude API + login + logout + real files)
app.get(/^\/(?!api)(?!.*\.[a-zA-Z0-9]+$).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(mainUiDistDir, "index.html"));   
    return
});

app.use("/expense-tracker", expenseTrackerHandler);

// Start server
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${PORT}`);
});
