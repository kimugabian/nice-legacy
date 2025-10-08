import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP } from "better-auth/plugins";
import { resend } from "./resend";
import type { User } from "./generated/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string" },
    },
  },

  sessionFields: ["id", "email", "name", "image", "role"], // ✅


  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "Ruang Siswa <onboarding@resend.dev>",
          to: [email],
          subject: "Ruang Siswa - verify your email",
          html: `<p>Your OTP is <strong>${otp}</strong></p>`,
        });
      },
    }),
  ],

  events: {
    async onLogin({ user }: { user: User }) {
      if (user.role === "ADMIN") {
        return { redirectTo: "/dashboard/admin" };
      }
      if (user.role === "TEACHER") {
        return { redirectTo: "/dashboard/teacher" };
      }
      if (user.role === "STUDENT") {
        return { redirectTo: "/dashboard/student" };
      }
      return { redirectTo: "/" };
    },
  },
});

