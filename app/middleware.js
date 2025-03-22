import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const { pathname } = req.nextUrl;

    // Redirect if not authenticated
    if (!token) {
        if (
            pathname.startsWith("/dashboard") || 
            pathname.startsWith("/company") || 
            pathname.startsWith("/admin")
        ) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Role-based protection
    if (pathname.startsWith("/admin") && token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/company") && token.role !== "company") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/company/:path*", "/admin/:path*"],
};
