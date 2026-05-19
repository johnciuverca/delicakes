import { type Response } from "express";
import { authenticateUser } from "../model/user.js";
import { readFile } from 'node:fs/promises';
import { randomBytes } from "node:crypto";

type AuthBody = { email: string; password: string };
type Session = { email: string; expiresAt: number };

const SESSION_COOKIE_NAME = "sid";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24h

const sessions = new Map<string, Session>(); // TODO: use DB 

export async function authMiddleware(req: any, res: any, next: any) {
  req.user = null;
  
  let sid = req.signedCookies[SESSION_COOKIE_NAME] as string | undefined;
  if (!sid) {
    const email = req.headers["x-user-email"] as string | undefined;
    const password = req.headers["x-user-password"] as string | undefined;
    if (!email || !password) {
      res.sendStatus(401);
      return;
    }
    
    const authResult = await authenticateUser(email, password);
    if (!authResult.success) {
      res.sendStatus(401);
      return;
    }
    
    sid = newSessionId();
    const newSession: Session = { 
        email,
        expiresAt: Date.now() + SESSION_TTL_MS
    };
    sessions.set(sid, newSession);
    setSessionCookie(res, sid);
  }
  
  const session = sessions.get(sid);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(sid);
	res.clearCookie(SESSION_COOKIE_NAME);
    res.sendStatus(401);
    return;
  }
  
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(sid, session);
  
  req.user = { email: session.email };
  next();
}

function newSessionId(): string {
  return randomBytes(32).toString("hex");
}

function setSessionCookie(res: Response, sid: string): void {
  res.cookie(SESSION_COOKIE_NAME, sid, {
    httpOnly: true,
    signed: true,
    sameSite: "lax",
    secure: false, // set true in production (HTTPS)
    maxAge: SESSION_TTL_MS,
    path: "/",
  });
}

