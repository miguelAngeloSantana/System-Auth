"use server";

import { z } from "zod";

const dataUserSchema = z.object({
    name: z.string().min(3, { error: "Nome não permitido" }),
    email: z.email({pattern: z.regexes.html5Email, error: 'Erro de autenticação'}),
    senha: z.string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" }),
    confirmaSenha: z.string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/r'^[A-Z]+$'/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" }) 
}).refine(user => user.senha === user.confirmaSenha, {
    error: "As senhas devem ser iguais"
});

export async function formRegisterAction(_:unknown, data: FormData) {
    
    const formDataSchema = Object.fromEntries(data.entries());

    const isValidationData = dataUserSchema.safeParse(formDataSchema);

    if (!isValidationData.success) {

        return {
            success: false,
            errors: {
                name: z.treeifyError(isValidationData.error).properties?.name,
                email: z.treeifyError(isValidationData.error).properties?.email,
                senha: z.treeifyError(isValidationData.error).properties?.senha,
                confirmaSenha: z.treeifyError(isValidationData.error).properties?.confirmaSenha || "As senhas devem ser iguais"
            }
        };
    };

    // console.log(formDataSchema)

    return isValidationData;
};