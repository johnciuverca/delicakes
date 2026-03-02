import { createHash } from "crypto";

const hashAlgorithm = "sha256";

export function hashPassword(inputPassword: string): string {
  return createHash(hashAlgorithm).update(inputPassword).digest("hex");
}

export function passwordsMatch(inputPassword: string, storedPasswordHash: string): boolean {
  return hashPassword(inputPassword) === storedPasswordHash;
}