import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "MovieGalaxy",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;

        if (
          creds.email === process.env.OWNER_EMAIL &&
          creds.password === process.env.OWNER_PASSWORD
        ) {
          return { id: "owner", name: "Owner", email: creds.email };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };
