import FormLogin from "@/components/FormLogin";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950">
      <main className="flex h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-zinc-950 sm:items-start}" >
        <FormLogin />
      </main>
    </div>
  );
}
