"use client"
import { BookMarkedIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useReferenceFormatter } from "@/hooks/useReferenceFormatter"
import { useState } from "react"
import { DatePicker } from "./date-picker"
//@typescript-eslint/no-explicit-any
export function ReferenceDialog({ editor }: { editor: any }) {
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const { formatABNTReference, referenceSchema } = useReferenceFormatter()
    const form = useForm({
        resolver: zodResolver(referenceSchema),
        defaultValues: {
            lastName: "",
            firstName: "",
            articleTitle: "",
            journalTitle: "",
            location: "",
            volume: "",
            number: "",
            startPage: "",
            endPage: "",
            publicationDate: new Date(),
            url: "",
            accessDate: new Date(),
        }
    })

    const onSubmit = (data: z.infer<typeof referenceSchema>) => {
        const { html } = formatABNTReference(data)
        console.log(html)
        editor?.commands.insertContent(html, {
            parseOptions: {
                preserveWhitespace: false
            }
        })
        setIsOpenDialog(false)
        form.reset()
    }


    return (
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
            <DialogTrigger asChild>
                <button
                    className={`p-2 rounded relative ${editor?.isActive('highlight')
                        ? 'bg-zinc-600 text-white'
                        : 'text-zinc-300 hover:bg-zinc-700'
                        }`}
                    title="Criar referência"
                >
                    <BookMarkedIcon className="w-4 h-4" />
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] dark">
                <DialogHeader>
                    <DialogTitle>Adicionar Referência ABNT</DialogTitle>
                    <DialogDescription>
                        Preencha os campos para gerar uma referência no padrão ABNT
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sobrenome do autor*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SOBRENOME" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primeiro nome do autor*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nome" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="articleTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título do artigo*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Título completo do artigo" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="journalTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título da Revista*</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome da revista científica" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Local de publicação*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Cidade, País" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="volume"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Volume (opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 12" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número (opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 3" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="startPage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Página inicial*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 45" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endPage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Página final*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 52" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="publicationDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Data de publicação*</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL (opcional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://exemplo.com/artigo" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="accessDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Data de acesso*</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="submit">Inserir Referência</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}