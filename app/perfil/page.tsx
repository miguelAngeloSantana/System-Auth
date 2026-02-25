import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation"

export default async function Perfil() {


    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        redirect("/register")        
    };

    return <h1>teste</h1>
}