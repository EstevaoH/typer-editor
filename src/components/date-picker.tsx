"use client"
import { useState } from 'react'
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export function DatePicker({ value, onChange }: {
    value: Date | undefined
    onChange: (date: Date | undefined) => void
}) {
    const [open, setOpen] = useState(false)
    const [internalDate, setInternalDate] = useState<Date>(value || new Date())
    return (
        <div className="relative">
            <Button
                variant="outline"
                className="justify-start text-left font-normal w-full"
                type="button"
                onClick={() => setOpen(!open)}
            >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
            </Button>

            {open && (
                <div className="absolute z-50 mt-1 w-auto rounded-md border bg-popover p-0 shadow-md">
                    <Calendar
                        mode="single"
                        selected={internalDate}
                        onSelect={(date) => {
                            const selectedDate = date || new Date()
                            setInternalDate(selectedDate)
                            onChange(selectedDate)
                            setOpen(false)
                        }}
                        initialFocus
                        locale={ptBR}
                    />
                </div>
            )}
        </div>
    )
}