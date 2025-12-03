import { useToast } from "@/context/toast-context";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, FileText, Clock } from "lucide-react";
import { useDocuments } from "@/context/documents-context";

interface DeleteConfirmProps {
    currentDocument: any;
    handleDeleteDocument: () => void;
    setShowDeleteConfirm: (show: boolean) => void;
}

export function ShowDeleteConfirm({ currentDocument, handleDeleteDocument, setShowDeleteConfirm }: DeleteConfirmProps) {
    const [rememberChoice, setRememberChoice] = useState(false);
    const toast = useToast();
    const { versions, undoDelete } = useDocuments();

    // Count versions for this document
    const versionCount = versions.filter(v => v.documentId === currentDocument?.id).length;

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
        
        // Show custom toast with undo button
        const toastElement = document.createElement('div');
        toastElement.className = 'fixed bottom-4 right-4 bg-zinc-800 border border-zinc-700 text-white px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-4 max-w-md';
        toastElement.style.transition = 'opacity 0.3s';
        toastElement.innerHTML = `
            <div class="flex-1">
                <p class="font-medium mb-1">🗑️ Documento excluído</p>
                <p class="text-sm text-zinc-400">Você tem <span id="countdown" class="font-semibold text-white">5</span> segundos para desfazer</p>
            </div>
            <button id="undo-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors whitespace-nowrap">
                Desfazer
            </button>
        `;
        
        document.body.appendChild(toastElement);
        
        // Countdown timer
        let timeLeft = 5;
        const countdownEl = document.getElementById('countdown');
        const countdownInterval = setInterval(() => {
            timeLeft--;
            if (countdownEl) {
                countdownEl.textContent = timeLeft.toString();
            }
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                toastElement.style.opacity = '0';
                setTimeout(() => toastElement.remove(), 300);
            }
        }, 1000);
        
        // Undo button handler - IMPORTANT: Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            const undoBtn = document.getElementById('undo-btn');
            console.log('Setting up undo button, element found:', !!undoBtn);
            
            if (undoBtn) {
                undoBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Undo button clicked!');
                    clearInterval(countdownInterval);
                    
                    try {
                        console.log('Calling undoDelete...');
                        const restoredId = undoDelete();
                        console.log('Restored ID:', restoredId);
                        
                        if (restoredId) {
                            toastElement.style.opacity = '0';
                            setTimeout(() => toastElement.remove(), 300);
                            toast.showToast('✅ Documento restaurado');
                        } else {
                            console.error('undoDelete returned null/undefined');
                            toastElement.style.opacity = '0';
                            setTimeout(() => toastElement.remove(), 300);
                            toast.showToast('❌ Nenhum documento para restaurar');
                        }
                    } catch (error) {
                        console.error('Error in undo:', error);
                        toastElement.style.opacity = '0';
                        setTimeout(() => toastElement.remove(), 300);
                        toast.showToast('❌ Erro ao restaurar documento');
                    }
                };
            } else {
                console.error('Undo button not found in DOM!');
            }
        }, 100); // Small delay to ensure DOM is ready
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            clearInterval(countdownInterval);
            toastElement.style.opacity = '0';
            setTimeout(() => toastElement.remove(), 300);
        }, 5000);
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
                    className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg shadow-2xl max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                                Confirmar exclusão
                            </h3>
                            <p className="text-sm text-zinc-400">
                                Você terá 5 segundos para desfazer
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-zinc-800/50 rounded-lg p-4 mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <FileText className="w-4 h-4 text-zinc-500" />
                            <span className="font-medium">{currentDocument?.title || "Sem título"}</span>
                        </div>
                        {versionCount > 0 && (
                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                <Clock className="w-4 h-4 text-zinc-500" />
                                <span>{versionCount} {versionCount === 1 ? 'versão salva' : 'versões salvas'}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-zinc-400 text-sm mb-4">
                        {versionCount > 0 
                            ? `O documento e suas ${versionCount} ${versionCount === 1 ? 'versão' : 'versões'} serão excluídos.`
                            : 'O documento será excluído.'}
                    </p>

                    <label className="flex items-center gap-2 mb-6 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={rememberChoice}
                            onChange={handleRememberChange}
                            className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            Não perguntar novamente
                        </span>
                    </label>

                    <div className="flex gap-3 justify-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClose}
                            className="px-4 py-2 text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-md hover:bg-zinc-700 cursor-pointer transition-colors duration-200"
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer transition-colors duration-200 font-medium"
                        >
                            Excluir documento
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}