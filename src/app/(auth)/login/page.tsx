"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { LoginForm } from "./login-form"
import { Button } from "@/components/ui/button"
import { ChromeIcon, GithubIcon } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  px-4 py-12 rounded-lg ">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col items-center space-y-2 mb-8">
          {/* Substitua pelo seu logo */}
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
            {/* <Icons.logo className="h-8 w-8 text-white" /> */}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-muted-foreground">
            Acesse sua conta para continuar
          </p>
        </div>

        <Card className="border-none shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center">
              Entre com seu e-mail e senha
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <LoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline">
                <ChromeIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline">
                <GithubIcon className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Não possui uma conta?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}