"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { useActionState, startTransition, useState } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { formResetAction } from "@/actions/formResetAction";

const formSchema = z.object({
    password: z
        .string()
        .trim()
        .min(8, "senha muito curta")
        .regex(/[a-z]/, { error: "Deve conter pelo menos uma letra" })
        .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
        .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { error: "Deve conter um caracter especial" }),
    confirmPassowrd:  z
            .string()
            .trim()
            .min(8, "senha muito curta")
            .regex(/[a-zA-Z]/, { error: "Deve conter pelo menos uma letra" })
            .regex(/[A-Z]/, { error: "Deve conter pelo menos uma letra maisucula" }) 
            .regex(/[0-9]/, { error: "Deve conter pelo menos um número" })
}).refine(user => user.password === user.confirmPassowrd, {
    error: "As senhas devem ser iguais",
    path: ["confirmPassowrd"]
});

type ResetSchema = z.infer<typeof formSchema>

export default function FormResetPassoword() {

    const router = useRouter();

    const [ isLoading, setIsloaing ] = useState<boolean>(false);
    const [ mensageError, setMensageError ] = useState<string>("");

    const { register, handleSubmit, formState, reset } = useForm<ResetSchema>({
        resolver: zodResolver(formSchema)
    });
    
    const searchParams = useSearchParams()
    const [ state, formAction ] = useActionState(formResetAction, null);

    async function onSubmit(data: ResetSchema) {
        setIsloaing(true);
        
        const formData = new FormData();
        
        startTransition(() => {
            formData.append("password", data.password);
            formData.append("confirmPassowrd", data.confirmPassowrd);
            formAction(formData);
        });
        
        if (!state?.success) {
            reset();
        };
        
        try {
            
            const token = searchParams.get("token") as string;

            if (!token) {
                setIsloaing(false);
                alert("Error ao validar as credenciais, por favor tente novamente");
                return;
            }

            if (data.password !== data.confirmPassowrd) {
                alert("As senhas dvem ser iguais");
                setIsloaing(false);
                return;
            }


            await authClient.resetPassword({
                newPassword: data.password,
                token,
            },{
                onRequest: () => {
                    setIsloaing(true);
                },
                onSuccess: () => {
                    setIsloaing(false);
                    alert("Senha resetada com sucesso");
                    router.replace("/perfil");
                },
                onError: (error) => {
                    alert(error.error.message);
                    setIsloaing(false)
                }
            })
        } catch(error) {
            setMensageError(error instanceof Error ? error.message: "Error inesperado, tente novamente");
            console.log(error)
        } finally {
            setIsloaing(false);
        }
    }

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-2xl mb-4">Digite sua nova senha</h1>
            <form className="flex flex-col items-center g-6 w-full md:w-[60%] px-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center w-full">
                    <label className="mb-4">Nova senha:</label>
                    <input 
                        type="password" 
                        placeholder="********"
                        required
                        className="w-full border border-zinc-900 rounded focus:outline p-6"
                        {...register("password", { required: "As senhas precisam ser iguais" })}
                    />

                    { formState.errors.password && 
                        <span className="text-red-500 font-bold text-lg">{formState.errors.password.message}</span>
                    }

                </div>

                <div className="flex flex-col items-center w-full mt-8">
                    <label className="mb-4">Digite a mesma senha novamente</label>
                    <input 
                        type="password" 
                        placeholder="********"
                        required
                        className="w-full border border-zinc-900 rounded focus:outline p-6" 
                        {...register("confirmPassowrd", { required: "As senhas devem ser iguais" })}    
                    />

                    { formState.errors.confirmPassowrd && 
                        <span className="text-red-500 font-bold text-lg">{formState.errors.confirmPassowrd.message}</span> 
                    }
 
                </div>

                <div className="w-full flex justify-cente items mt-7">
                    <button 
                        className="w-full border border-zinc-200 rounded font-semibold h-16 cursor-pointer hover:bg-zinc-200 hover:text-black" type="submit">
                        Resetar senhas 
                    </button>
                </div>
            </form>

            <div className="flex mt-3 gap-7">
                <p>Não possui uma conta? 
                    <Link href="/register" className="cursor-pointer text-lg font-bold hover:underline ml-2">Crie uma</Link>
                </p>
            </div>

            {
                mensageError && (
                        <span className="text-red-500 font-bold text-lg">{mensageError}</span>
                )
            }

            {isLoading ? (
                <svg 
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>

                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null} 
        </div>
    )
}