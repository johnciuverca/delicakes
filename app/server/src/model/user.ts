import { getUserByEmail } from "../data/dbStorage";
import { passwordsMatch } from "../security/utils";

export async function authenticateUser(
      email: string | undefined,
      inputPassword: string | undefined,
): Promise<boolean> {
      if (!email || !inputPassword) {
            return false;
      }

      const user = await getUserByEmail(email);
      if (!user) {
            return false;
      }

      return passwordsMatch(inputPassword, user.passwordHash);
}
