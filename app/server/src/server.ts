import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./model/user";
import { get } from "http";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve mainUI as a built site (dist only)
const mainUiDistDir = path.join(__dirname, "../../UI/mainUI/dist");
const expenseTrackerDistDir = path.join(__dirname, "../../UI/expense-tracker/dist");

app.use("/expense-tracker1", (req: Request, res: Response, next: NextFunction) => {
    const handler = express.static(expenseTrackerDistDir);
    handler(req, res, next);
    return;
});

app.use(express.static(mainUiDistDir));

// SPA fallback for React Router (exclude API + login + logout + real files)
app.get(/^\/(?!api|login|logout)(?!.*\.[a-zA-Z0-9]+$).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(mainUiDistDir, "index.html"));   
    return
});

const getExpenseTracker = express.static(path.join(__dirname, expenseTrackerDistDir));
const authCookie = "123-fake-auth-cookie";

type LoginBody = {
    email?: string;
    psw?: string;
};

app.post(
    "/login",
    (req: Request<Record<string, never>, unknown, LoginBody>, res: Response) => {
        const reqAuthCookie = req.cookies ? (req.cookies["auth"] as string | undefined) : undefined;
        if (reqAuthCookie === authCookie) {
            res.status(200).json({ authCookie });
            return;
        }

        const email = req.body.email;
        const inputPassword = req.body.psw;

        if (authenticateUser(email, inputPassword)) {
            res.status(200).json({ authCookie });
            return;
        }

        res.status(401).json({ message: "Unauthorized" });
    },
);

app.post("/logout", (req: Request, res: Response) => {
    res.status(200).json({ message: "Logged out" });
});

// Serve static files from the expense-tracker folder (CSS, JS, etc.)
app.use(
    "/expense-tracker", (req: Request, res: Response, next: NextFunction) => {
    const reqAuthCookie = req.cookies ? (req.cookies["auth"] as string | undefined) : undefined;
    if (reqAuthCookie === authCookie) {
        getExpenseTracker(req, res, next);
        return;
    }
    res.redirect("/login");
});

// Start server
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${PORT}`);
});
