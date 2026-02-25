"use server";

import { z } from "zod";

const dataUserSchema = z.object({
    password: z.string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" }),
    confirmPassowrd: z.string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/r'^[A-Z]+$'/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" }) 
}).refine(user => user.password === user.confirmPassowrd, {
    error: "As senhas devem ser iguais"
});

export async function formResetAction(_:unknown, data: FormData) {
    
    const formDataSchema = Object.fromEntries(data.entries());

    const isValidationData = dataUserSchema.safeParse(formDataSchema);

    if (!isValidationData.success) {

        return {
            success: false,
            errors: {
                senha: z.treeifyError(isValidationData.error).properties?.password,
                confirmaSenha: z.treeifyError(isValidationData.error).properties?.confirmPassowrd || "As senhas devem ser iguais"
            }
        };
    };
    
    return isValidationData;
};