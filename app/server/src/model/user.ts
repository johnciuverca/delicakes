import { getUserByEmail, UserRecord } from "../data/dbStorage";
import { passwordsMatch } from "../security/utils";

export async function authenticateUser(
      email: string | undefined,
      inputPassword: string | undefined,
): Promise<{
    success: boolean;
    user?: UserRecord;
}> {
      if (!email || !inputPassword) {
            return {
                success: false
            };
      }

      const user = await getUserByEmail(email);
      if (!user) {
            return {
                success: false
            };
      }
      
      const isPasswordMatching = passwordsMatch(inputPassword, user.passwordHash);

      return {
            success: isPasswordMatching,
            user: isPasswordMatching ? user : undefined
      };
}
