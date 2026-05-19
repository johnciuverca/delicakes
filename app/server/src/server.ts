import "dotenv/config";
import express, { type Request, type Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import { changePasswordHandler, loginHandler, logoutHandler, meHandler, registerHandler } from "./handlers/auth";
import { expenseTrackerHandler } from "./handlers/expense-tracker";
import { IncomingHttpHeaders } from "http";
import { authMiddleware } from "./middlewares/authMiddleware";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Serve mainUI as a built site (dist only)
const mainUiDistDir = path.join(__dirname, "../../UI/mainUI/dist");

// Middleware
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.static(mainUiDistDir));

app.post("/register", registerHandler);

app.post("/login", loginHandler);
 
app.get("/me", meHandler);

app.post("/logout", logoutHandler);

app.post("/change-password", changePasswordHandler);

app.get("/recipes", authMiddleware, (req: Request, res: Response) => {
    fetchApiRecipes(req).then(apiRes => {
        apiRes.text().then(text => {
            res.status(apiRes.status).send(text);
        });
    }).catch(err => {
        console.error("Error fetching recipes:", err);
        res.status(500).json({ error: "Failed to fetch recipes" });
    });
});

app.post("/recipes", (req: Request, res: Response) => {
    fetchApiRecipes(req).then(apiRes => {
        apiRes.text().then(text => {
            res.status(apiRes.status).send(text);
        });
    }).catch(err => {
        console.error("Error posting recipe:", err);
        res.status(500).json({ error: "Failed to post recipe" });
    });
});

app.delete("/recipes", (req: Request, res: Response) => {
    fetchApiRecipes(req).then(apiRes => {
        apiRes.text().then(text => {
            res.status(apiRes.status).send(text);
        });
    }).catch(err => {
        console.error("Error deleting recipe:", err);
        res.status(500).json({ error: "Failed to delete recipe" });
    });
});

// SPA fallback for React Router (exclude API + login + logout + real files)
app.get(/^\/(?!api)(?!.*\.[a-zA-Z0-9]+$).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(mainUiDistDir, "index.html"));   
    return
});

app.use("/expense-tracker", expenseTrackerHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function fetchApiRecipes(request: Request) {
    const apiUrl = process.env.API_URL ?? "http://localhost:3100";

    // Keeps original query params; only replaces endpoint path
    const targetUrl = new URL(request.originalUrl, apiUrl);
    targetUrl.pathname = "/api/recipes"
    
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("x-api-key", "sk_7f3b2c9e8a4d1f6c2b9e0a4d7f1c8e3a"); // TODO: Use env variable for API key
    
    return fetch(targetUrl, {
        method: request.method,
        headers,
        body: Object.keys(request.body).length > 0 ? request.body : undefined, 
    });
}
