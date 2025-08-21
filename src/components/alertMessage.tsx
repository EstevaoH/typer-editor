import { AlertCircle, CircleCheck } from "lucide-react";

interface AlertMessageProps {
    success?: boolean;
    message?: string;

}

export function AlertMessage({ success, message }: AlertMessageProps) {
    if (success === false) {
        return (
            <div
                className="grid gap-1 text-xs my-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <div className="flex gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <strong className="font-bold">Erro!{' '}</strong>
                    <span className="block sm:inline">{message}</span>
                </div>
            </div>
        );
    }

    if (success === true) {
        return (
            <div
                className="grid gap-1 text-xs my-3 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
            >
                <div className="flex gap-1">
                    <CircleCheck className="h-4 w-4" />
                    <strong className="font-bold">Sucesso!{' '}</strong>
                    <span className="block sm:inline">{message}</span>
                </div>
            </div>
        );
    }

    return null; // Retorna null se não houver mensagem para exibir
}