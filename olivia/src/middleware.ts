// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/access", // Redirect unauthenticated users here
    },
});

export const config = {
    // Add the routes you want to protect here
    matcher: [
        "/dashboard/:path*", // You can even protect backend API routes
    ],
};