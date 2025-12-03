import { useToast } from "@/context/toast-context";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface DeleteConfirmProps {
    currentDocument: any;
    handleDeleteDocument: () => void;
    setShowDeleteConfirm: (show: boolean) => void;
}

export function ShowDeleteConfirm({ currentDocument, handleDeleteDocument, setShowDeleteConfirm }: DeleteConfirmProps) {
    const [rememberChoice, setRememberChoice] = useState(false);
    const toast = useToast()

    const handleClose = () => {
        setShowDeleteConfirm(false);
    };

    const handleDelete = () => {
        if (rememberChoice) {
            localStorage.setItem('skipDeleteConfirmation', 'true');
        } else {
            localStorage.removeItem('skipDeleteConfirmation');
        }

        handleDeleteDocument();
        setShowDeleteConfirm(false);
        toast.showToast('🗑️ Documento excluído');

    };

    const handleRememberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRememberChoice(e.target.checked);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-50"
                onClick={handleClose}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                        duration: 0.3
                    }}
                    className="bg-zinc-50 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-lg font-semibold mb-4 text-zinc-600">
                        Confirmar exclusão
                    </h3>
                    <p className="text-zinc-500 mb-4">
                        Tem certeza que deseja excluir o documento "{currentDocument?.title}"?
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 justify-end mt-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClose}
                            className="px-4 py-2 text-zinc-500 border border-zinc-600 rounded-md hover:bg-zinc-200 cursor-pointer transition-colors duration-200"
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer transition-colors duration-200"
                        >
                            Excluir
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}