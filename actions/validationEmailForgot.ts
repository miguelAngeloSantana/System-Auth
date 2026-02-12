"use server";

import { z } from "zod";

const dataUserSchema = z.object({
    email: z.email({pattern: z.regexes.html5Email, error: 'Erro de autenticação'}),
})

export async function validationEmailForgot(_:unknown, formData: FormData) {
    const emailUSer = Object.entries(formData.entries());
    const schemaEmail = dataUserSchema.safeParse(emailUSer);

    if(!schemaEmail.success) {
        return {
            success: false,
            error: {
                email: z.treeifyError(schemaEmail.error).properties?.email
            }
        }
    }

    return schemaEmail;
}