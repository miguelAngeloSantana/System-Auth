import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { nextCookies } from "better-auth/next-js";

import { Resend } from "resend";

const resend = new Resend(process.env.API_KEY_RESEND as string)

import { prisma } from "./prisma";
import { EmailTemplate } from "./emailConfig";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    advanced: {
        useSecureCookies: true
    },

    emailAndPassword: {
        enabled: true,
        sendResetPassword: async({ user, url }) => {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "Reset Password",
                text: `clique no ${url}`,
                react: EmailTemplate({resetUrl:url})
            })
        },
    },

    emailVerification: {
        sendVerificationEmail: async({ user, url }) => {
            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: user.email,
                subject: "De uma olhada no seu email",
                text: `clique no ${url}`
            })
        },
        sendOnSignUp: true
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        }
    },

    rateLimit: {
        enabled: true,
        customRules: {
           "/": {
                window: 60,
                max: 3
            },
            '/reset-password': {
                window: 60,
                max: 1
            },
            '/forgot-password': {
                window: 120,
                max: 2
            }
        },
        storage: "database",
        modelName: "rateLimit"
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        freshAge: 60 * 60 * 24
    },

    plugins: [ nextCookies() ]
});