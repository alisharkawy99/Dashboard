import AuthForm from "../../../Components/auth-form";

const SignIn = () => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-app-bg px-4 py-10 transition-colors duration-300">
      <div
        className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-app-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-app-accent-secondary/15 blur-3xl"
        aria-hidden
      />
      <AuthForm mode="signup" />
    </main>
  );
};

export default SignIn;
