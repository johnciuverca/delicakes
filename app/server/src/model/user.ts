const knownCredentials = new Map<string, string>([
      ["admin", "0000"],
      ["audit", "0000"],
]);

export function authenticateUser(email: string | undefined, inputPassword: string | undefined): boolean {
      if (!email) return false;
      const realPassword = knownCredentials.get(email);
      return Boolean(inputPassword && inputPassword === realPassword);
}
