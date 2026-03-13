"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { useActionState, startTransition, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { formRegisterAction } from "@/actions/formRegisterAction";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";

const dataUserSchema = z.object({
    name: z.string().min(3, { error: "Nome não permitido" }),
    email: z.email({pattern: z.regexes.html5Email, error: 'Formato de e-mail invalido'}),
    senha: z
        .string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" }),
    confirmaSenha: z.string()
            .trim()
            .min(8, "senha muito curta")
            .regex(/[a-zA-Z]/, { error: "Deve conter pelo menos uma letra" })
            .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
            .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
}).refine(user => user.senha === user.confirmaSenha, {
    error: "As senhas devem ser iguais",
    path: ["confirmaSenha"]
});

type LoginType = z.infer<typeof dataUserSchema>;

export default function FormRegister() {

    const [ isLoading, setIsloaing ] = useState<boolean>(false)
    const router = useRouter()
    
    const { register, handleSubmit, formState, reset } = useForm<LoginType>({
        resolver: zodResolver(dataUserSchema)
    });
    
    const [ state, formAction, isPending ] = useActionState(formRegisterAction, null);
    
    async function onSubmit(data: LoginType) {

        const formData = new FormData();

        startTransition(async() => {
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("senha", data.senha);
            formData.append("confirmaSenha", data.confirmaSenha);
            formAction(formData);
        })

        if (!state?.success) {
            reset();
        };


        try {
            await authClient.signUp.email({
                name: data.name,
                email: data.email,
                password: data.senha,
                    
            }, {
                onRequest: () => {
                    setIsloaing(true)
                },
                onSuccess: () => {
                    router.push("/perfil") 
                },
                onError: (ctx) => {
                    if (ctx.error.status === 422) {
                        alert("Email já cadastrado, logue usando ele")
                    }
                    console.log(ctx.error)
                }
            })
        } catch(error){
            console.log(error)
        } finally {
            setIsloaing(false)
        }

    };

    return (
        <div className="flex flex-col items-center justify-center w-[90vw]">
            <form className="flex flex-col gap-6 w-full lg:w-[50%]" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <label>Digite seu Nome</label>
                    <input 
                        type="text"
                        required 
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("name", { required: "É necessario inserir um nome" })}
                        // disabled={isPending}
                    />
                    { formState.errors.name && <span className="text-red-500 font-bold text-lg">{formState.errors.name.message}</span> }
                </div>

                <div className="flex flex-col gap-3">
                    <label>Digite seu e-mail</label>
                    <input 
                        type="email"  
                        placeholder="seuemail@example.com"
                        required 
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("email", { required: "É necessario inserir um email" })}
                        // disabled={isPending}
                    />
                    { formState.errors.email && <span className="text-red-500 font-bold text-lg">{formState.errors.email.message}</span> }
                </div>

                <div className="flex flex-col gap-3">
                    <label>Escreva sua senha</label>
                    <input 
                        type="password"
                        placeholder="********"
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("senha", { required: "É necessario inserir uma senha valida" })}
                        // disabled={isPending}
                    />
                    { formState.errors.senha && <span className="text-red-500 font-bold text-lg">{formState.errors.senha.message}</span> }
                </div>

                <div className="flex flex-col gap-3">
                    <label>Confirma senha</label>
                    <input 
                        type="password"
                        placeholder="********"
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("confirmaSenha", { required: "As senhas precisam estar iguais" })}
                        // disabled={isPending}
                    />
                    { formState.errors.confirmaSenha && <span className="text-red-500 font-bold text-lg">{formState.errors.confirmaSenha.message}</span> }
                </div>

                <div className="flex flex-col items-center justify-center">
                    <button 
                        type="submit" 
                        className="border border-zinc-200 bg-emerald-500 rounded w-full font-semibold h-10 hover:bg-emerald-600 cursor-pointer"
                        disabled={isPending}
                    >
                        Login
                    </button>
                </div>
            </form>

            <div className="flex mt-3 gap-7">
                <p>Já possui uma conta? 
                    <Link href="/" className="cursor-pointer text-lg font-bold hover:underline ml-2">Faça login e acesse ela</Link>
                </p>
            </div>

            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null} 
        </div>
    );
};