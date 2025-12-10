const knownCredentials = new Map([
      ['admin', '0000'],
      ['audit', '0000']
]);

export function authenticateUser(role, inputPassword) {
      const realPassword = knownCredentials.get(role);
      return inputPassword && inputPassword === realPassword;
}