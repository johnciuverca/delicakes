import "dotenv/config";

import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./model/user";
import { insertUser } from "./data/dbStorage";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

type LoginBody = {
    email?: string;
    psw?: string;
};

type RegisterBody = {
    email?: string;
    password?: string;
    name?: string;
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve mainUI as a built site (dist only)
const mainUiDistDir = path.join(__dirname, "../../UI/mainUI/dist");
const expenseTrackerDistDir = path.join(__dirname, "../../UI/expense-tracker/dist");

const registerHandler = (req: Request, res: express.Response) => {
    const { email, password, name } = req.body ?? {};
    if (!email || !password || !name) {
        res.status(400).json({ message: "name, email, password and name are required" });
        return;
    }
    insertUser({ email, password, name })
    .then((user) => res.status(201).json(user))
    .catch((err:any) => {
        const error = err as { code?: string };

        if (error.code === "23505") {
            res.status(409).json({ message: "Email already exists" });
            return;
        }
        res.status(500).json({
            message: "Failed to create user",
            error: err instanceof Error ? err.message : String(err)
        });
    });
}

app.use("/expense-tracker1", (req: Request, res: Response, next: NextFunction) => {
    const handler = express.static(expenseTrackerDistDir);
    handler(req, res, next);
    return;
});

app.use(express.static(mainUiDistDir));

app.post("/register", registerHandler);

// SPA fallback for React Router (exclude API + login + logout + real files)
app.get(/^\/(?!api|login|logout)(?!.*\.[a-zA-Z0-9]+$).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(mainUiDistDir, "index.html"));   
    return
});

const getExpenseTracker = express.static(path.join(__dirname, expenseTrackerDistDir));
const authCookie = "123-fake-auth-cookie";

app.post(
    "/login",
    async (req: Request<Record<string, never>, unknown, LoginBody>, res: Response) => {
        const reqAuthCookie = req.cookies ? (req.cookies["auth"] as string | undefined) : undefined;
        if (reqAuthCookie === authCookie) {
            res.status(200).json({ authCookie });
            return;
        }

        const email = req.body.email;
        const inputPassword = req.body.psw;

        try {
            const authenticationResult = await authenticateUser(email, inputPassword);
            if (authenticationResult.success && authenticationResult.user) {
                const sanitizedUser = {
                    name: authenticationResult.user.name,
                    email: authenticationResult.user.email,  
                };
                res.status(200).json({ user: sanitizedUser });
                return;
            }
        } catch (caught) {
            // eslint-disable-next-line no-console
            console.error("Error authenticating user:", caught);
            res.status(500).json({ message: "Authentication failed" });
            return;
        }

        res.status(401).json({ message: "Unauthorized" });
    },
);

app.post("/logout", (req: Request, res: Response) => {
    res.status(200).json({ message: "Logged out" });
});

type ChangePasswordBody = {
    email: string;
    currentPassword: string;
    newPassword: string;
}

app.post("/change-password", (req: Request<any, any, ChangePasswordBody>, res) => { 
    // UI -- post-request -->  SERVER  -- queries user --> DB
    //                         SERVER  <-- queries user -- DB
    //                         SERVER  -- queries user --> DB
    //                         SERVER  <-- queries user -- DB
    // UI <-- response     --  SERVER  <-- queries user -- DB
    
    const email = req.body.email;
    const password = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    
    // 1 Change Password
    
    // Q: whom's password?
    // A: user's password
    // Q: How do we identify the user?
    // A: via email.
    
    // 1.1 Validate password matches current password 
    // 1.2.a If valid, update password to new password
    // 1.2.b If not valid, return error
})

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
