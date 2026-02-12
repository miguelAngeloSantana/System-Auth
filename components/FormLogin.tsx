"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { useActionState, startTransition } from "react";

import Link from "next/link";

import { formLoginAction } from "@/actions/formLoginAction";

import { zodResolver } from "@hookform/resolvers/zod";

const dataUserSchema = z.object({
    email: z.email({pattern: z.regexes.html5Email, error: 'Formato de e-mail invalido'}),
    senha: z
        .string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" })
});

type LoginType = z.infer<typeof dataUserSchema>;

export default function FormLogin() {
    
    const { register, handleSubmit, formState, reset } = useForm<LoginType>({
        resolver: zodResolver(dataUserSchema)
    });
    
    const [ state, formAction, isPending ] = useActionState(formLoginAction, null);
    
    function onSubmit(data: LoginType) {
        // console.log(data)

        const formData = new FormData();

        startTransition(async() => {

            formData.append("email", data.email);
            formData.append("senha", data.senha);
            formAction(formData);
        });

        if (!state?.success) {
            reset()
        };
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <form className="flex flex-col gap-6 w-[70%]" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <label>Digite seu e-mail</label>
                    <input 
                        type="email"  
                        required 
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("email", { required: "É necessario inserir um email" })}
                        disabled={isPending}
                    />
                    { formState.errors.email && <span className="text-red-500 font-bold text-lg">{formState.errors.email.message}</span> }
                </div>

                <div className="flex flex-col gap-3">
                    <label>Escreva sua senha</label>
                    <input 
                        type="password"
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("senha", { required: "É necessario inserir uma senha valida" })}
                        disabled={isPending}
                    />
                    { formState.errors.senha && <span className="text-red-500 font-bold text-lg">{formState.errors.senha.message}</span> }
                </div>

                <div className="flex items-center justify-center">
                    <button 
                        type="submit" 
                        className="border border-zinc-200 bg-emerald-500 rounded w-full font-semibold h-10 hover:bg-emerald-600 cursor-pointer"
                    >
                        Login
                    </button>
                </div>
            </form>

           <Link href={"/forgot-password"} className="font-bold text-lg">Esqueceu a senha?</Link> 

            <div className="flex mt-3 gap-7">
                <p>Não possui uma conta? 
                    <Link href="/register" className="cursor-pointer text-lg font-bold hover:underline ml-2">Crie uma</Link>
                </p>
            </div>
        </div>
    );
};