import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import { connectToDB } from "../../../lib/mongodb";
import { compare } from "bcryptjs"; // ✅ Secure password comparison

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                await connectToDB();
                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("User not found");
                }

                const isPasswordValid = await compare(credentials.password, user.password); // 🔒 Secure comparison
                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                if (user.role === "company" && !user.approved) {
                    throw new Error("Your account is pending admin approval.");
                }

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    approved: user.approved
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.approved = user.approved;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = session.user || {};  // Ensure `session.user` exists
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.approved = token.approved;
            return session;
        }
        
    },
    pages: {
        signIn: "/login",
        error: "/error"
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
