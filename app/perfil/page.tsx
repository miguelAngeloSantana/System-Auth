import ButtonSingOut from "@/components/ButtonSingOut";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation"

export default async function Perfil() {

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session) {
        redirect("/");      
    };

    return (
        <div className="flex flex-col items-center justify-center mx-auto min-h-screen">
            <h1>Bem vindo/a {session.user.name}</h1>
            <ButtonSingOut />
        </div>
    )
}