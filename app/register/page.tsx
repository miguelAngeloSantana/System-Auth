import FormRegister from "@/components/FormRegister";

export default function Register() {
    return (
        <div className="flex h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-zinc-950 sm:items-start">
            <FormRegister />
        </div>
    )
}