import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";


const expenseTrackerDistDir = path.join(__dirname, "../../UI/expense-tracker/dist");
const getExpenseTracker = express.static(path.join(__dirname, expenseTrackerDistDir));

// Remove after implementing real authentication and session management //
const authCookie = "123-fake-auth-cookie";

export const expenseTrackerHandler = (req: Request, res: Response, next: NextFunction) => {
    const reqAuthCookie = req.cookies ? (req.cookies["auth"] as string | undefined) : undefined;
    if (reqAuthCookie === authCookie) {
        getExpenseTracker(req, res, next);
        return;
    }
    res.redirect("/login");
}