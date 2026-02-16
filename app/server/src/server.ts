import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { authenticateUser } from "./model/user";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve mainUI as a built site (dist only)
const mainUiDistDir = path.join(__dirname, "../../UI/mainUI/dist");
app.use(express.static(mainUiDistDir));

// React SPA entry (preserve old .html URLs)
app.get(["/", "/login", "/pages/:page"], (_req: Request, res: Response) => {
      res.sendFile(path.join(mainUiDistDir, "index.html"));
});

const getExpenseTracker = express.static(path.join(__dirname, "../../UI/expense-tracker/dist"));
const authCookie = "123-fake-auth-cookie";

type ExpenseTrackerLoginBody = {
      role?: string;
      psw?: string;
};

app.post(
      "/expense-tracker",
      (req: Request<Record<string, never>, unknown, ExpenseTrackerLoginBody>, res: Response) => {
            const reqAuthCookie = req.cookies ? (req.cookies["auth"] as string | undefined) : undefined;
            if (reqAuthCookie === authCookie) {
                  res.status(200).json({ authCookie });
                  return;
            }

            const role = req.body.role;
            const inputPassword = req.body.psw;

            if (authenticateUser(role, inputPassword)) {
                  res.status(200).json({ authCookie });
                  return;
            }

            res.status(401).json({ message: "Unauthorized" });
      },
);

// Serve static files from the expense-tracker folder (CSS, JS, etc.)
app.use("/expense-tracker", (req: Request, res: Response, next: NextFunction) => {
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
