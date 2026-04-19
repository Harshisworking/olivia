import { NextAuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./modals/Container";
import bcrypt from "bcrypt";
import dbConnect from "./mongodb";

export class AuthService {
    /**
     * Returns the complete NextAuth configuration object.
     */
    public static getAuthOptions(): NextAuthOptions {
        return {
            providers: [
                CredentialsProvider({
                    name: "Credentials",
                    credentials: {
                        email: { label: "Email", type: "email", placeholder: "admin@olivia.paas" },
                        password: { label: "Password", type: "password" }
                    },
                    async authorize(credentials) {
                        try {
                            await dbConnect();

                            if (!credentials?.email || !credentials?.password) {
                                throw new Error("Missing credentials");
                            }

                            const { email, password } = credentials;

                            const user = await User.findOne({ email }).select("+password");

                            if (!user) {
                                console.log("Auth Failure: User not found");
                                return null;
                            }

                            const isMatch = await bcrypt.compare(password, user.password);

                            if (!isMatch) {
                                console.log("Auth Failure: Incorrect password");
                                return null;
                            }

                            // Return clean User object
                            return {
                                id: user._id.toString(),
                                email: user.email,
                                name: user.name || "Olivia User",
                            };
                        } catch (error) {
                            console.error("Critical Auth Error:", error);
                            return null;
                        }
                    }
                })
            ],
            pages: {
                signIn: "/access",
                error: "/access",
            },
            session: {
                strategy: "jwt",
                maxAge: 30 * 24 * 60 * 60,
            },
            callbacks: {
                async jwt({ token, user }) {
                    if (user) {
                        token.id = user.id;
                    }
                    return token;
                },
                async session({ session, token }) {
                    if (session.user) {
                        (session.user as any).id = token.id;
                    }
                    return session;
                },
            },
            secret: process.env.NEXTAUTH_SECRET,
            debug: process.env.NODE_ENV === "development",
        };
    }

    /**
     * Utility method to fetch the server-side session safely.
     * Always passes the custom authOptions to ensure callbacks run and 'id' is present.
     */
    public static async getBackendSession() {
        try {
            return await getServerSession(this.getAuthOptions());
        } catch (error) {
            console.error("Failed to fetch backend session:", error);
            return null;
        }
    }
}