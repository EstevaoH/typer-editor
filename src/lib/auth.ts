import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { getTursoClient } from "./turso";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const client = getTursoClient();

        const result = await client.execute({
          sql: "SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1",
          args: [credentials.email],
        });

        const row = result.rows[0];
        if (!row) {
          throw new Error("Usuário não encontrado");
        }

        const user = {
          id: String(row.id),
          name: (row.name as string | null) ?? undefined,
          email: row.email as string,
          password_hash: row.password_hash as string,
        };

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValid) {
          throw new Error("Credenciais inválidas");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Se for login social (Google ou GitHub), criar/atualizar usuário no Turso
      if (account?.provider === "google" || account?.provider === "github") {
        const client = getTursoClient();

        try {
          // Verificar se usuário já existe
          const existingUser = await client.execute({
            sql: "SELECT id FROM users WHERE email = ? LIMIT 1",
            args: [user.email as string],
          });

          if (existingUser.rows.length === 0) {
            // Criar novo usuário
            const userId = uuidv4();
            await client.execute({
              sql: "INSERT INTO users (id, name, email, password_hash, provider, created_at, plan) VALUES (?, ?, ?, ?, ?, ?, 'FREE')",
              args: [
                userId,
                user.name || user.email?.split("@")[0] || "Usuário",
                user.email as string,
                "", // Login social não precisa de senha
                account.provider, // Salva o provider (google ou github)
                new Date().toISOString(),
              ],
            });
            user.id = userId;
          } else {
            // Usuário já existe - atualizar provider se necessário
            const existingUserId = String(existingUser.rows[0].id);
            await client.execute({
              sql: "UPDATE users SET provider = ? WHERE id = ?",
              args: [account.provider, existingUserId],
            });
            user.id = existingUserId;
          }
        } catch (error) {
          console.error("Erro ao criar/atualizar usuário social:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as any).id;
        token.plan = (user as any).plan || "FREE"; // Defaults
      }

      // Refresh user data from DB to get latest plan status on every session refresh
      if (token.email) {
        try {
          const client = getTursoClient();
          const result = await client.execute({
            sql: "SELECT plan, customer_id, subscription_status FROM users WHERE email = ?",
            args: [token.email]
          });
          if (result.rows.length > 0) {
            token.plan = result.rows[0].plan;
            token.customer_id = result.rows[0].customer_id;
            token.subscription_status = result.rows[0].subscription_status;
          }
        } catch (e) {
          console.error("Error fetching user plan details", e);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan;
        (session.user as any).customer_id = token.customer_id;
        (session.user as any).subscription_status = token.subscription_status;
      }
      return session;
    },
  },
};


