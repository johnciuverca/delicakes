const DEV_USER = {
  id: 1,
  name: "Dev User",
  role: "user",
};

export function authMiddleware(req: any, res: any, next: any) {
  const devAuth = req.headers("x-dev-auth");

  if (process.env.NODE_ENV === "development" && devAuth === "devtoken") {
    req.user = DEV_USER;
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}
