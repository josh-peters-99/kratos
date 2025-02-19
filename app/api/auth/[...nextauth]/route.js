import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
    secret: process.env.AUTH_SECRET,
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                try {
                    await connectDB();
                    const user = await User.findOne({ email: credentials.email })

                    if (!user) {
                        console.log("Invalid username or password");
                    }

                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        console.log("Invalid username or password");
                        return null;
                    }

                    return { id: user._id, email: user.email, username: user.username };
                } catch (error) {
                    console.log("An error occurred: ", error);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
    }
};

const handler  = NextAuth(authOptions);
export { handler as GET, handler as POST };