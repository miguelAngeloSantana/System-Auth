interface EmailTemplateProps {
  resetUrl: string;
}

export function EmailTemplate({ resetUrl }: EmailTemplateProps) {
  return (
    <div>
      <h1 className="text-4xl mb-4">Reset Passwords!</h1>
      <p>Olá,você requisitou uma nova senha para sua conta. Por favor clique no botão abaixo para reseta-la </p>
      <button className="w-full flex justify-center font-bold text-lg border border-zinc-900 mt-6 py-3 text-black no-underline">
        <a href={resetUrl} className="text-black no-underline">Resetar senha</a>
      </button>
      <p className="mt-4">A sua senha não será alterada até você clicar no botão</p>
    </div>
  );
}