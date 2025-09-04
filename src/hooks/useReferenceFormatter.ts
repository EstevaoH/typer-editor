import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { z } from 'zod'

export const referenceSchema = z.object({
    lastName: z.string().min(3, "Mínimo 3 caracteres").trim(),
    firstName: z.string().min(2, "Mínimo 2 caracteres").trim(),
    articleTitle: z.string().min(5, "Mínimo 5 caracteres").trim(),
    journalTitle: z.string().min(5, "Mínimo 5 caracteres").trim(),
    location: z.string().min(3, "Mínimo 3 caracteres").trim(),
    volume: z.string().optional(),
    number: z.string().optional(),
    startPage: z.string().min(1, "Obrigatório"),
    endPage: z.string().min(1, "Obrigatório"),
    publicationDate: z.date(),
    url: z.string().url("URL inválida").optional().or(z.literal('')),
    accessDate: z.date(),
})

export type ReferenceData = z.infer<typeof referenceSchema>

export function useReferenceFormatter() {
    const formatABNTReference = (data: ReferenceData, index?: number) => {
        const authorName = `${data.lastName.toUpperCase()}, ${data.firstName}`
        const publicationMonth = format(data.publicationDate, 'MMM', { locale: ptBR }).toLowerCase()
        const accessDateFormatted = format(data.accessDate, 'dd/MM/yyyy')

        const referenceParts = [
            `${authorName}. ${data.articleTitle}.`,
            `${data.journalTitle}, ${data.location},`,
        ]

        const volumeNumber = []
        if (data.volume?.trim()) volumeNumber.push(`v. ${data.volume.trim()}`)
        if (data.number?.trim()) volumeNumber.push(`n. ${data.number.trim()}`)
        
        if (volumeNumber.length > 0) {
            referenceParts.push(`${volumeNumber.join(', ')},`)
        }

        referenceParts.push(`p. ${data.startPage}-${data.endPage},`)
        referenceParts.push(`${publicationMonth}. ${data.publicationDate.getFullYear()}.`)

        if (data.url?.trim()) {
            referenceParts.push(`Disponível em: ${data.url.trim()}. Acesso em: ${accessDateFormatted}.`)
        }

        let reference = referenceParts.join(' ')
            .replace(/\s+/g, ' ')
            .replace(/, ,/g, ',')
            .replace(/, \./g, '.') 

        return {
            plainText: reference,
            html: `
                <div class="" style="text-align: justify">
                    <div>${reference}</div>
                </div>
            `.replace(/\s+/g, ' ').trim()
        }
    }

    return {
        formatABNTReference,
        referenceSchema
    }
}