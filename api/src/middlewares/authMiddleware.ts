import { readFile } from 'node:fs/promises';

const apiKeyHeader = "x-api-key";

const DEV_USER = {
  id: "dev-user",
  name: "Developer",
  email: ""
}

export async function authMiddleware(req: any, res: any, next: any) {
  req.user = null;
  
  const devApiKey = await getDevApiKey();
  const receivedApiKey = req.headers[apiKeyHeader];
  
  if (devApiKey && process.env.NODE_ENV === "development" && receivedApiKey === devApiKey) {
    req.user = DEV_USER;
    return next();
  }
  
  res.status(401).json({ error: "Unauthorized" });
  return;
}

async function getDevApiKey(): Promise<string | null> {
    const content = await readFile("/Users/ciuverca/Desktop/1T career/delicakes/appdata/devapikey", "utf-8");
    const lines = content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    if(lines.length > 1) {
        console.warn("Warning: Multiple lines found in devapikey file. Using the first line as the API key.");
    }
    return lines.length > 0 ? lines[0] : null;
}
