"use client";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { useActionState, startTransition, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";

import { authClient } from "@/lib/auth-client";

import { validationEmailForgot } from "@/actions/validationEmailForgot";

const dataUserSchema = z.object({
    email: z.email({pattern: z.regexes.html5Email, error: 'Erro de autenticação'}),
})

type EmailType = z.infer<typeof dataUserSchema>;

export default function FormForgotPassoword(){

    const { register, handleSubmit, formState, reset } = useForm<EmailType>({
        resolver: zodResolver(dataUserSchema)
    });
    
    const [ state, formAction, isPending ] = useActionState(validationEmailForgot, null);

    const [ isLoading, setIsloaing ] = useState<boolean>(false);
    const [ mensageError, setMensageError ] = useState<string>("");

    async function onSubmit(data: EmailType) {
        setIsloaing(true)
        const formData = new FormData()

        startTransition(async() => {

            formData.append("email", data.email);
            formAction(formData);
        });

        if (!state?.success) {
            reset()
        };

        try {

            const { error } = await authClient.requestPasswordReset({
                email: data.email,
                redirectTo: "/reset-password"
            })

            if(error) {
                setIsloaing(false)
                alert(error.message || "Error ao enviar o codigo para o email");
            } else {
                setIsloaing(true)
                alert("Codigo enviado para o email inserido!");
            };

        } catch (error) {
            setMensageError(error instanceof Error ? error.message: "Error inesperado, tente novamente");
            console.log(error)
        } finally{
            setIsloaing(false)
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <div className="w-full text-center px-3">
                <h1 className="font-bold text-lg md:text-2xl mb-4">Esqueceu a senha</h1>
                <p className="mb-4 font-semibold text-base md:text-lg">Digite seu email abaixo e nos mandaremos um link para você redefinir ela</p>
            </div>
            <form className="flex flex-col items-center gap-6 w-full md:w-[40%]" onSubmit={handleSubmit(onSubmit)}>
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
                    
                    { formState.errors.email && 
                        <span className="text-red-500 font-bold text-lg">{formState.errors.email.message}</span> 
                    }
                </div>

                <div className="w-full flex justify-center">
                    <button 
                        className="w-full border border-zinc-200 bg-emerald-500 rounded font-semibold h-10 
                            hover:bg-emerald-600 cursor-pointer"
                    >
                        Enviar
                    </button>
                </div>
            </form>

            <div className="w-full flex justify-center">

                <Link 
                    className="w-full md:w-[40%] flex justify-center font-bold text-lg border border-zinc-900 mt-6 py-3" 
                    href={"/"}
                    
                >
                    Voltar para a tela de login
                </Link>
            </div>

               {
                mensageError && (
                    // <div>
                        <span className="text-red-500 font-bold text-lg">{mensageError}</span>
                    // </div>
                )
            }

            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null} 

        </div>
    )
}