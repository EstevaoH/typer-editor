import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { headers } from "next/headers";

/**
 * Obtém a sessão do usuário nas rotas de API do Next.js App Router
 * Esta função garante que os cookies sejam lidos corretamente
 */
export async function getSession() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";

  // Cria um objeto Request-like para passar para getServerSession
  const req = {
    headers: {
      cookie: cookieHeader,
    },
  } as any;

  return await getServerSession(authOptions);
}

