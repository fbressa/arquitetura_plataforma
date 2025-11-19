"use client";

import { useState } from "react";
import { loginRequest } from "../../lib/api";
import { useAppContext } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { setToken, setUserInfo, addNotification } = useAppContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();

  try {
    const { accessToken } = await loginRequest(email, password);

    setToken(accessToken);

    setUserInfo({
      id: "1",
      name: email,
      email: email,
      role: "user"
    });

    addNotification({
      type: "success",
      message: "Login realizado com sucesso!"
    });

    router.push("/");

  } catch (error: any) {
    addNotification({
      type: "error",
      message: error.message || "Erro ao fazer login"
    });
  }
}

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="w-80 rounded-lg bg-gray-900 p-6 shadow-lg"
      >
        <h1 className="mb-4 text-xl font-bold text-white">Entrar</h1>

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded bg-gray-800 p-2 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="mb-4 w-full rounded bg-gray-800 p-2 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600">
          Entrar
        </button>
      </form>
    </div>
  );
}
