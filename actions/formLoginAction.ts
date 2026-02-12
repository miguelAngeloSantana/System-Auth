"use server";

import { z } from "zod";

const dataUserSchema = z.object({
    email: z.email({pattern: z.regexes.html5Email, error: 'Erro de autenticação'}),
    senha: z.string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" })
});

export async function formLoginAction(_:unknown, data: FormData) {
    
    const formDataSchema = Object.fromEntries(data.entries());

    const isValidationData = dataUserSchema.safeParse(formDataSchema);

    if (!isValidationData.success) {

        return {
            success: false,
            errors: {
                email: /*z.treeifyError(isValidationData.error).properties?.email*/ "Erro de validação" ,
                senha: /*z.treeifyError(isValidationData.error).properties?.senha*/ "Erro de validação"
            }
        };
    };

    return isValidationData;
};