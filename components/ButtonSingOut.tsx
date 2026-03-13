"use client";

import { authClient } from "@/lib/auth-client";

import { useRouter } from "next/navigation";

export default function ButtonSingOut() {

    const router = useRouter();


    async function singOut() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.replace("/");
                }
            }
        });
    };

    return (
        <div className="w-48">
            <button 
                className="w-full border border-zinc-200 rounded font-semibold h-10 mt-5 cursor-pointer hover:bg-zinc-200 hover:text-black" 
                type="submit"
                onClick={singOut}
            >
                Sair da conta
            </button>
        </div>
    )
}