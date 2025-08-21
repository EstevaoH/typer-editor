
// import prisma from "@/lib/db";
// import { compare } from "bcryptjs";
// import { sign } from "jsonwebtoken";
// import { NextAuthOptions } from "next-auth";


// export const authOptions: NextAuthOptions = {
//     providers: [
//         CredentialsProvider({
//             name: 'Credentials',
//             credentials: {
//                 email: { label: 'Email', type: 'text' },
//                 password: { label: 'Password', type: 'password' },
//             },
//             async authorize(credentials) {
//                 try {
//                     if (!credentials?.email || !credentials?.password) {
//                         throw new Error("Email e senha são obrigatórios.");
//                     }

//                     const user = await prisma.user.findUnique({
//                         where: { email: credentials.email },
//                     });

//                     if (!user) {
//                         throw new Error("Usuário não encontrado.");
//                     }

//                     const isValid = await compare(credentials.password, user.password);
//                     if (!isValid) {
//                         throw new Error("Senha incorreta.");
//                     }

//                     const { password, ...userWithoutPassword } = user;

//                     return {
//                         id: userWithoutPassword.id.toString(),
//                         name: userWithoutPassword.name,
//                         email: userWithoutPassword.email,
//                         username: userWithoutPassword.username,
//                     };
//                 } catch (error) {
//                     console.error("Erro ao autenticar usuário:", error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id;
//                 token.username = user.username;
//                 token.email = user.email!;

//                 const accessToken = sign(
//                     { id: user.id, username: user.username, email: user.email },
//                     process.env.AUTH_SECRET!,
//                     { expiresIn: '1h' }
//                 );

//                 const refreshToken = sign(
//                     { id: user.id },
//                     process.env.AUTH_SECRET!,
//                     { expiresIn: '7d' }
//                 );

//                 token.accessToken = accessToken;
//                 token.refreshToken = refreshToken;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             if (token) {
//                 session.user.id = token.id;
//                 session.user.username = token.username;
//                 session.user.email = token.email;
//                 session.accessToken = token.accessToken;
//                 session.refreshToken = token.refreshToken;
//             }
//             return session;
//         },
//     },
//     pages: {
//         signIn: '/login',
//     },
//     session: {
//         strategy: 'jwt',
//     },
//     jwt: {
//         secret: process.env.AUTH_SECRET,
//     },
// };
// function CredentialsProvider(arg0: { name: string; credentials: { email: { label: string; type: string; }; password: { label: string; type: string; }; }; authorize(credentials: any): Promise<{ id: any; name: any; email: any; username: any; } | null>; }): import("next-auth/providers/index").Provider {
//     throw new Error("Function not implemented.");
// }

