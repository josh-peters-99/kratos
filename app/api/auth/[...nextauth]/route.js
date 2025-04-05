import { connectDB } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
// import crypto from "crypto";
// import { sendVerificationEmail } from "@/lib/email";

export const authOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    await connectDB();

                    const user = await User.findOne({ userName: credentials.userName });

                    if (!user || !user.password) {
                        console.log("Invalid username or password");
                        throw new Error("Invalid username or password");
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        console.log("Invalid username or password");
                        throw new Error("Invalid username or password");
                    }
                    return { 
                        id: user._id, 
                        userName: user.userName, 
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email
                    }
                } catch (error) {
                    console.error("Error in authorize function:", error);
                    throw new Error("Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.userName = user.userName;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.userName = token.userName;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };