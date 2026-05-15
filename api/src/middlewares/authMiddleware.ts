import { User } from "../model/user.js";
import { readFile } from 'node:fs/promises';

const DEV_USER: User = {
  id: 1,
  name: "Dev User",
  role: "user",
};

const TEMP_USER: User = {
  id: 2,
  name: "Temp User",
  role: "user",
};

const devAuthHeader = "x-dev-auth";
const apiKeyHeader = "x-api-key";

export async function authMiddleware(req: any, res: any, next: any) {
  req.user = null;
  
  const devAuth = req.headers[devAuthHeader];
  if (process.env.NODE_ENV === "development" && devAuth === "devtoken") {
    req.user = DEV_USER;
    return next();
  }
  
  req.user = await authenticateUser(req);
  if (req.user) {
    return next();
  }
  
  return res.status(401).json({ message: "Unauthorized" });
}

async function authenticateUser(req: any): Promise<User | null> {
  var apiKey = req.headers[apiKeyHeader];
  
  if(apiKey) {
    const apiKeys = await readFile("/Users/ciuverca/Desktop/1T career/delicakes/appdata/apikeys", "utf-8")
      .then(data => data.split("\n").map(line => line.trim()).filter(line => line.length > 0));
    
    if (apiKeys.includes(apiKey)) {
      return TEMP_USER;
    }
  }
  return null;
}

/*
[
  {
    "key": "asda",
    "value": "asdasd"
  },
  {
    "key": "x-api-key",
    "value": "asdaeq2131sadc123qwasd"
  }
]
*/
