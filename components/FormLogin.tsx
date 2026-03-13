"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { useActionState, startTransition, useState, useEffect } from "react";

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
    
    const [ state, formAction ] = useActionState(formLoginAction, null);
    
    const [ isLoading, setIsloaing ] = useState<boolean>(false);
    const [ mensageError, setMensageError ] = useState<string>("");
    const [ timerRateLimit, setTimerRateLimit ] = useState<number>(0);

    
    useEffect(() => {
        localStorage.getItem("login_timer");
        if (timerRateLimit <=0 ) return;
        const time = setInterval((prev: number) => {
            setTimerRateLimit(prev);
            if (prev <= 1) {
                clearInterval(time);
                localStorage.removeItem("login_timer");
                return 0;
            };
            return prev -1
        }, 1000)
        return () => clearInterval(time)
    }, [timerRateLimit])

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
            await authClient.signIn.email({
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
                    console.log(ctx.error);
                    if (ctx.error.status === 429) {
                        // const statusRetry = ctx.response.headers.get("X-Retry-After");
                        const statusRetry = Number(ctx.response.headers.get("X-Retry-After") ?? 60);
                        const timerUtilLogin = Date.now() * statusRetry * 1000;

                        localStorage.setItem("login_timer", String(timerUtilLogin));
                        setTimerRateLimit(statusRetry)
                        alert(`Exceso de tentativas, tente novamente em ${statusRetry} segundo`);
                    } else {
                        alert(ctx.error.message)
                    }
                }
            });
            
        } catch (error) {
            setMensageError(error instanceof Error ? error.message: "Error inesperado, tente novamente");
            console.log(error)
        } finally{
            setIsloaing(false)
        }

    };

    async function socialClick() {
        await authClient.signIn.social({
            provider: "google" ,
            callbackURL: "/perfil"
        })
    };
    
    async function socialGithubClick() {
        await authClient.signIn.social({
            provider: "github" ,
            callbackURL: "/perfil"
        })
    }

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <form className="flex flex-col gap-6 w-full md:w-[70%]" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3">
                    <label>Digite seu e-mail</label>
                    <input 
                        type="email"  
                        placeholder="seuemail@email.com"
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
                        placeholder="********"
                        className="border border-zinc-800 shadow-sm h-10 bg-zinc-900 rounded focus:outline p-3"
                        {...register("senha", { required: "É necessario inserir uma senha valida" })}
                        // disabled={isPending}
                    />
                    { formState.errors.senha && <span className="text-red-500 font-bold text-lg">{formState.errors.senha.message}</span> }
                </div>

                <div className="flex flex-col items-center justify-center">
                    <button 
                        type="submit" 
                        className="border border-zinc-200 bg-emerald-500 rounded w-full font-semibold h-10 hover:bg-emerald-600 cursor-pointer"
                        disabled={isLoading || timerRateLimit > 0}
                    >
                        Login
                    </button>

                    <h2 className="my-3">ou</h2>

                    <div 
                        className="bg-red-600 w-full flex justify-center items-center gap-4 p-2 mb-3 rounded cursor-pointer"
                        onClick={socialClick}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)"> <path d="M21.5939 11.0792H12.3209V13.8256H18.9768C18.6214 17.6382 15.5196 19.286 12.5148 19.286C8.70223 19.286 5.30969 16.3135 5.30969 12.0162C5.30969 7.88057 8.54068 4.74651 12.5148 4.74651C15.5519 4.74651 17.3936 6.71741 17.3936 6.71741L19.2676 4.74651C19.2676 4.74651 16.7474 2.00016 12.3856 2.00016C6.6344 1.96785 2.24023 6.78203 2.24023 11.9839C2.24023 17.0243 6.37592 22 12.4825 22C17.8783 22 21.7554 18.349 21.7554 12.8886C21.7877 11.7578 21.5939 11.0792 21.5939 11.0792Z" fill="#ccced4"/> </svg>
                        <p className="font-bold text-sm md:text-lg">Entre com o Google</p>
                    </div>

                    <div 
                        className="bg-zinc-200 w-full flex justify-center items-center gap-4 p-2 mt-3 mb-7 rounded cursor-pointer"
                        onClick={socialGithubClick}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                            <path d="M12 2.24902C6.51613 2.24902 2 6.70064 2 12.249C2 16.6361 4.87097 20.3781 8.87097 21.7329C9.3871 21.8297 9.54839 21.5071 9.54839 21.2813C9.54839 21.0555 9.54839 20.4103 9.51613 19.5393C6.74194 20.1845 6.16129 18.1845 6.16129 18.1845C5.70968 17.0555 5.03226 16.7329 5.03226 16.7329C4.12903 16.0877 5.06452 16.0877 5.06452 16.0877C6.06452 16.12 6.6129 17.12 6.6129 17.12C7.48387 18.6684 8.96774 18.2168 9.51613 17.9264C9.6129 17.2813 9.87097 16.8297 10.1613 16.5716C7.96774 16.3458 5.6129 15.4748 5.6129 11.6684C5.6129 10.5716 6.03226 9.70064 6.64516 9.02322C6.54839 8.79741 6.19355 7.76515 6.74194 6.37806C6.74194 6.37806 7.6129 6.11999 9.51613 7.41031C10.3226 7.18451 11.1613 7.05548 12.0323 7.05548C12.9032 7.05548 13.7742 7.15225 14.5484 7.41031C16.4516 6.15225 17.2903 6.37806 17.2903 6.37806C17.8387 7.73289 17.5161 8.79741 17.3871 9.02322C18.0323 9.70064 18.4194 10.6039 18.4194 11.6684C18.4194 15.4748 16.0645 16.3458 13.871 16.5716C14.2258 16.8942 14.5484 17.5393 14.5484 18.4426C14.5484 19.7974 14.5161 20.8619 14.5161 21.1845C14.5161 21.4426 14.7097 21.7329 15.1935 21.6361C19.129 20.3135 22 16.6039 22 12.1845C21.9677 6.70064 17.4839 2.24902 12 2.24902Z" fill="#343C54"/>
                        </svg>

                        <p className="font-bold text-sm md:text-lg text-zinc-950">Entre com o Github</p>
                    </div>
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