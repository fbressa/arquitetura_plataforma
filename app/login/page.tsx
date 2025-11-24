"use client";

import { useState } from "react";
import { loginRequest } from "../../lib/api";
import { useAppContext } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError } from "@/lib/types";

export default function LoginPage() {
  const { setToken, setUserInfo, addNotification } = useAppContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Valida os dados de entrada
   */
  const validateInput = (): boolean => {
    if (!email.trim()) {
      setError("Email é obrigatório");
      return false;
    }

    if (!password) {
      setError("Senha é obrigatória");
      return false;
    }

    return true;
  };

  /**
   * Extrai mensagem de erro apropriada
   */
  const getErrorMessage = (error: unknown): string => {
    if (ApiError.isApiError(error)) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Erro desconhecido ao fazer login";
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validação
      if (!validateInput()) {
        setIsLoading(false);
        return;
      }

      // Requisição ao backend
      const response = await loginRequest(email, password);

      // Validação de resposta
      if (!response?.access_token || !response?.user) {
        throw new Error("Resposta inválida do servidor");
      }

      // Salvar autenticação
      setToken(response.access_token);
      setUserInfo({
        id: response.user.id.toString(),
        name: response.user.name,
        email: response.user.email,
        role: response.user.role || "user",
      });

      // Notificação de sucesso
      addNotification({
        type: "success",
        message: `Bem-vindo, ${response.user.name}!`,
      });

      // Redirecionar
      router.push("/");
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
      addNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="w-80 rounded-lg bg-gray-900 p-6 shadow-lg"
      >
        <h1 className="mb-2 text-xl font-bold text-white">Entrar</h1>
        <p className="mb-6 text-sm text-gray-400">
          Acesse sua conta para continuar
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded bg-gray-800 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="mb-6 w-full rounded bg-gray-800 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Não tem conta?{" "}
          <Link href="/signup" className="text-orange-500 hover:text-orange-600">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
