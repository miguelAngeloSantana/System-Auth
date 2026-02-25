import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { Resend } from "resend";

const resend = new Resend(process.env.API_KEY_RESEND as string)

import { prisma } from "./prisma";
// import { resetPassword } from "better-auth/api";
import { EmailTemplate } from "./emailConfig";
// import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        sendResetPassword: async({ user, url }) => {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "De uma olhada no seu email",
                text: `clique no ${url}`,
                react: EmailTemplate({firstName:url})
            })
        },
        // requireEmailVerification: true
    },
    emailVerification: {
        sendVerificationEmail: async({ user, url }) => {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "De uma olhada no seu email",
                text: `clique no ${url}`
                // react: 
            })
        },
        sendOnSignUp: true
    }

    // plugins: [nextCookies()]
});