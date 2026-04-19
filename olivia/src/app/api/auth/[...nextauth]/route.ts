import NextAuth from "next-auth";
import { AuthService } from "../../../lib/auth"; // Path to your class above

const handler = NextAuth(AuthService.getAuthOptions());

export { handler as GET, handler as POST };