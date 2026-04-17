'use client';
import { useRouter } from "next/navigation";
const Home = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 px-4">
      
      <div className="flex flex-col gap-5 items-start justify-center w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-black">Service Status Dashboard</h1>
      <p className="text-gray-500 overflow-hidden overflow-ellipsis max-w-md">Track health, uptime and latency for core servers with a simple status dashboard built for fast incident visibility.
</p>
      <div className="flex flex-row gap-4">
        <button className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer" onClick={() => router.push('/login')}>Login</button>
        <button className="bg-white text-black px-4 py-2 rounded-lg border border-black cursor-pointer" onClick={() => router.push('/signup')}>Create Account</button>
      </div>
      </div>
      
    </div>
  );
};

export default Home;
