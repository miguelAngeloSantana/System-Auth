import FormLogin from "@/components/FormLogin";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {

  const session = await auth.api.getSession({
          headers: await headers()
      });
  
      if (session) {
          redirect("/perfil");
      };

  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-6 md:px-16 bg-white dark:bg-zinc-950 sm:items-start}" >
        <FormLogin />
      </main>
    </div>
  );
}
