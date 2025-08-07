import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

//check if env is loaded
if (!process.env.COGNITO_CLIENT_ID)
  throw new Error("COGNITO_CLIENT_ID is not set");
if (!process.env.COGNITO_CLIENT_SECRET)
  throw new Error("COGNITO_CLIENT_SECRET is not set");
if (!process.env.COGNITO_ISSUER) throw new Error("COGNITO_ISSUER is not set");

export default NextAuth({
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET,
      issuer: process.env.COGNITO_ISSUER,
      idToken: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name,
          familyName: profile.family_name,
          email: profile.email,
        };
        // return {...profile};
      },
    }),
  ],

  // debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    //@ts-ignore
    jwt: async ({ token, user, account, profile, isNewUser }) => {
      if (user) {
        return {
          ...token,
          user: {
            ...user,
          },
          group: profile["cognito:groups"][0],
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as any;
      session.group = token.group as unknown as string;

      return session;
    },
  },
  pages: {
    signIn: "/", // Our default landing page
  },
  events: {
    async signOut() {
      const endpointURL = new URL(`${process.env.COGNITO_DOMAIN}/logout`);
      endpointURL.searchParams.append(
        "client_id",
        process.env.COGNITO_CLIENT_ID
      );
      endpointURL.searchParams.append("logout_uri", "http://localhost:3000");

      await fetch(endpointURL);
    },
  },
});
