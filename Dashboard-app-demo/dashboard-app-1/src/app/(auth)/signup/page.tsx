import React from 'react'
import AuthForm from '../../../Components/auth-form'
const SignIn = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <AuthForm mode="signup" />
    </main>
  )
}

export default SignIn