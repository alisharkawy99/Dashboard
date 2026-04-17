import AuthForm from '../../../Components/auth-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <AuthForm mode="login" />
    </main>
  );
}
