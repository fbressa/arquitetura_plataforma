export async function loginRequest(email: string, password: string) {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Erro ao fazer login.");
  }

  
  return response.json();
}
