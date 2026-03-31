import { type Request, type Response } from "express";
import { getUserByEmail, insertUser, updateUserPassword } from "../data/dbStorage";
import { authenticateUser } from "../model/user";
import { hashPassword, passwordsMatch } from "../security/utils";

type RegisterBody = {
    email: string;
    password: string;
    name: string;
};

export const registerHandler = (req: Request<any, any, RegisterBody>, res: Response) => {
    const { email, password, name } = req.body ?? {};
    if (!email || !password || !name) {
        res.status(400).json({ message: "name, email, password and name are required" });
        return;
    }

    getUserByEmail(email)
        .then((user) => {
            if (user){
                res.status(409).json({ message: "Email already exists" });
                return;
            } else {
                insertUser({ email, password, name })
                    .then((user) => res.status(201).json(user))
                    .catch((err:any) => {
                        res.status(500).json({
                            message: "Failed to create user",
                            error: err instanceof Error ? err.message : String(err)
                        });
                    });
            }
        });
}
    
type LoginBody = {
    email?: string;
    psw?: string;
};

// Remove after implementing real authentication and session management //
const authCookie = "123-fake-auth-cookie";

export const loginHandler = async (req: Request<Record<string, never>, unknown, LoginBody>, res: Response) => {
	const reqAuthCookie = req.cookies ? (req.cookies["auth"] as string | undefined) : undefined;
	if (reqAuthCookie === authCookie) {
		res.status(200).json({ authCookie });
		return;
	}

	const email = req.body.email;
	const inputPassword = req.body.psw;

	try {
		const authenticationResult = await authenticateUser(email, inputPassword);
		if (authenticationResult.success && authenticationResult.user) {
			const sanitizedUser = {
				name: authenticationResult.user.name,
				email: authenticationResult.user.email,  
                role: authenticationResult.user.role,
			};
			res.cookie("auth", authCookie, {
				httpOnly: true,
				sameSite: "lax",
				secure: false,
				path: "/",
				maxAge: 1000 * 60 * 60 * 24,
			});

			res.cookie("userEmail", authenticationResult.user.email, {
				httpOnly: true,
				sameSite: "lax",
				secure: false,
				path: "/",
				maxAge: 1000 * 60 * 60 * 24,
			});

			res.status(200).json({user: sanitizedUser});
			return;
		}
	} catch (caught) {
		// eslint-disable-next-line no-console
		console.error("Error authenticating user:", caught);
		res.status(500).json({ message: "Authentication failed" });
		return;
	}

	res.status(401).json({ message: "Unauthorized" });
}

export const logoutHandler = (req: Request, res: Response) => {
    res.clearCookie("auth", { path: "/" });
    res.clearCookie("userEmail", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
}

type ChangePasswordBody = {
    email: string;
    currentPassword: string;
    newPassword: string;
}

export const changePasswordHandler = (req: Request<any, any, ChangePasswordBody>, res: Response) => { 
    const email = req.body.email;
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;

    getUserByEmail(email).then(user => {
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return Promise.reject();
        }
        if (!passwordsMatch(currentPassword, user.passwordHash)) {
            res.status(401).json({ message: "Unauthorized" });
            return Promise.reject();
        }

        const newPasswordHash = hashPassword(newPassword);

        return updateUserPassword(email, newPasswordHash)
            .then(() => {
                res.status(200).json({ message: "Password changed successfully" });
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error("Error updating password:", err);
                res.status(500).json({ message: "Failed to change password" });
            });
	});
}

export const meHandler = (req: Request, res: Response) => {
    const reqAuthCookie = req.cookies ? (req.cookies["auth"] as string | undefined) : undefined;
    const userEmail = req.cookies ? (req.cookies["userEmail"] as string | undefined) : undefined;

    if (reqAuthCookie !== authCookie || !userEmail) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    getUserByEmail(userEmail)
        .then((user) => {
            if (!user) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            res.status(200).json({
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        })
        .catch((err) => {
            console.error("Failed to load session:", err);
            res.status(500).json({ message: "Failed to load session" });
        });
}