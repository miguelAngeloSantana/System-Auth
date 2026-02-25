interface EmailTemplateProps {
  firstName: string;
}

export function EmailTemplate({ firstName }: EmailTemplateProps) {
  console.log(firstName)
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  );
}