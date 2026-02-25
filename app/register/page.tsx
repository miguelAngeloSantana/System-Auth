import FormRegister from "@/components/FormRegister";

import { auth } from "@/lib/auth";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Register() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (session) {
        redirect("/perfil")
    }

    return (
        <div className="flex h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-zinc-950 sm:items-start">
            <FormRegister />
        </div>
    )
}