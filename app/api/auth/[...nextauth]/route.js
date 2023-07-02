import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";

import { connectToDB } from "@utils/database";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      cliendId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  async session({ session }) {},
  async signIn({ profile }) {
    try {
      await connectToDB();

      // check if user already exists
      const userExists = await User.findOne({
        email: profile.email,
      });

      // if not, create a new user
      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace("", "").tolowerCase(),
          image: profile.picture,
        });
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  },
});

export { handler as GET, handler as POST };
