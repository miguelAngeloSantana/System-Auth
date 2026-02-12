"use client"

import Link from "next/link"

import { useForm } from "react-hook-form";
import z from "zod";

import { useActionState, startTransition } from "react";

import { validationEmailForgot } from "@/actions/validationEmailForgot";

import { zodResolver } from "@hookform/resolvers/zod";

const dataUserSchema = z.object({
    email: z.email({pattern: z.regexes.html5Email, error: 'Erro de autenticação'}),
})

type EmailType = z.infer<typeof dataUserSchema>;

export default function ForgotPassword() {

    const { register, handleSubmit, formState, reset } = useForm<EmailType>({
        resolver: zodResolver(dataUserSchema)
    });
    
    const [ state, formAction, isPending ] = useActionState(validationEmailForgot, null);

    function onSubmit(data: EmailType) {
        const formData = new FormData()

        startTransition(async() => {

            formData.append("email", data.email);
            formAction(formData);
        });

        if (!state?.success) {
            reset()
        };
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl mb-4">Esqueceu a senha</h1>
            <p className="mb-4 font-semibold text-lg">Digite seu email abaixo e nos mandaremos um link para você redefinir ela</p>
            <form className="flex flex-col items-center gap-6 w-[40%]" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full gap-3 items-center">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        required 
                        placeholder="seu@email.com"
                        className="w-full border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-6" 
                        disabled={isPending}
                        {...register("email", { required: "Por favor inseria um e-mail" })}   
                    />
                    { formState.errors.email && <span className="text-red-500 font-bold text-lg">{formState.errors.email.message}</span> }
                </div>

                <div className="w-full flex justify-center">
                    <button className="w-full border border-zinc-200 bg-emerald-500 rounded font-semibold h-10 hover:bg-emerald-600 cursor-pointer">
                        Enviar
                    </button>
                </div>
            </form>

            <div className="w-full flex justify-center">

                <Link 
                    className="w-[40%] flex justify-center font-bold text-lg border border-zinc-900 mt-6 py-3" 
                    href={"/"}
                    
                >
                    Voltar para a tela de login
                </Link>
            </div>

        </div>
    )
}