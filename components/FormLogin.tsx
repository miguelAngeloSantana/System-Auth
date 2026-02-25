"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { useActionState, startTransition, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { formLoginAction } from "@/actions/formLoginAction";

import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";


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

    const router = useRouter();
    
    const { register, handleSubmit, formState, reset } = useForm<LoginType>({
        resolver: zodResolver(dataUserSchema)
    });
    
    const [ state, formAction, isPending ] = useActionState(formLoginAction, null);
    
    const [ isLoading, setIsloaing ] = useState<boolean>(false);
    const [ mensageError, setMensageError ] = useState<string>("");

    async function onSubmit(data: LoginType) {
        setIsloaing(true)
        const formData = new FormData();

        startTransition(async() => {

            formData.append("email", data.email);
            formData.append("senha", data.senha);
            formAction(formData);
        });

        if (!state?.success) {
            reset()
        };

        try {
            const email = formData.get("email") as string;
            const password = formData.get("senha") as string;

            await authClient.signIn.email({
                email,
                password,
                // rememberMe: true
            }, {
                onRequest: () => {
                    setIsloaing(true)
                },
                onSuccess: () => {
                    // setIsloaing(false)
                    router.push("/perfil")
                },
                onError: (ctx) => {
                    console.log(ctx.error)
                        alert("Error ao logar, verifique suas credenciais")
                    

                    // setIsloaing(false);
                    // setTimeout(() => {
                    //     router.refresh();
                    // }, 2000)
                }
            })
            
        } catch (error) {
            setMensageError(error instanceof Error ? error.message: "Error inesperado, tente novamente");
            console.log(error)
        } finally{
            setIsloaing(false)
        }

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
                        // disabled={isPending}
                    />
                    { formState.errors.email && 
                        (<span className="text-red-500 font-bold text-lg">{formState.errors.email.message}</span> )
                    }
                </div>

                <div className="flex flex-col gap-3">
                    <label>Escreva sua senha</label>
                    <input 
                        type="password"
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("senha", { required: "É necessario inserir uma senha valida" })}
                        // disabled={isPending}
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
    );
};