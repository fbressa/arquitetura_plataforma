"use client";

import { useState } from "react";
import { signupRequest } from "../../lib/api";
import { useAppContext } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ApiError, SignupRequest } from "@/lib/types";

export default function SignupPage() {
  const { addNotification } = useAppContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Valida os dados do formulário
   */
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email é obrigatório");
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email inválido");
      return false;
    }

    if (!formData.password) {
      setError("Senha é obrigatória");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não correspondem");
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
    return "Erro desconhecido ao criar conta";
  };

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validação do formulário
      if (!validateForm()) {
        setIsLoading(false);
        return;
      }

      // Preparar dados para envio
      const signupData: SignupRequest = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      // Requisição ao backend
      await signupRequest(signupData);

      // Sucesso
      addNotification({
        type: "success",
        message: "Conta criada com sucesso! Faça login para continuar.",
      });

      router.push("/login");
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
        onSubmit={handleSignup}
        className="w-96 rounded-lg bg-gray-900 p-6 shadow-lg"
      >
        <h1 className="mb-2 text-xl font-bold text-white">Criar Conta</h1>
        <p className="mb-6 text-sm text-gray-400">
          Cadastre-se para acessar o sistema
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Nome completo"
          className="mb-3 w-full rounded bg-gray-800 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-3 w-full rounded bg-gray-800 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Senha (mín. 6 caracteres)"
          className="mb-3 w-full rounded bg-gray-800 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Senha"
          className="mb-6 w-full rounded bg-gray-800 p-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-orange-500 hover:text-orange-600">
            Faça login
          </Link>
        </p>
      </form>
    </div>
  );
}
