const knownCredentials = new Map<string, string>([
      ["admin", "0000"],
      ["audit", "0000"],
]);

export function authenticateUser(role: string | undefined, inputPassword: string | undefined): boolean {
      if (!role) return false;
      const realPassword = knownCredentials.get(role);
      return Boolean(inputPassword && inputPassword === realPassword);
}
