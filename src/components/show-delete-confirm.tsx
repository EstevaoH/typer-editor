import { useToast } from "@/context/toast-context";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AlertTriangle, FileText, Clock, Cloud, HardDrive } from "lucide-react";
import { useDocuments } from "@/context/documents-context";
import { useSession } from "next-auth/react";

interface DeleteConfirmProps {
    currentDocument: any;
    handleDeleteDocument: (deleteFromCloud: boolean) => Promise<void> | void;
    setShowDeleteConfirm: (show: boolean) => void;
}

export function ShowDeleteConfirm({ currentDocument, handleDeleteDocument, setShowDeleteConfirm }: DeleteConfirmProps) {
    const [rememberChoice, setRememberChoice] = useState(false);
    const [deleteFromCloud, setDeleteFromCloud] = useState(false);
    const toast = useToast();
    const { versions, undoDelete } = useDocuments();
    const { data: session } = useSession();

    // Count versions for this document
    const versionCount = versions.filter(v => v.documentId === currentDocument?.id).length;

    const handleClose = () => {
        setShowDeleteConfirm(false);
    };

    const handleDelete = async () => {
        if (rememberChoice) {
            localStorage.setItem('skipDeleteConfirmation', 'true');
        } else {
            localStorage.removeItem('skipDeleteConfirmation');
        }

        await handleDeleteDocument(deleteFromCloud);
        setShowDeleteConfirm(false);
        
        // Show custom toast with undo button
        const toastElement = document.createElement('div');
        toastElement.className = 'fixed bottom-4 right-4 bg-popover border border-border text-popover-foreground px-6 py-4 rounded-lg shadow-2xl z-50 flex items-center gap-4 max-w-md';
        toastElement.style.transition = 'opacity 0.3s';
        toastElement.innerHTML = `
            <div class="flex-1">
                <p class="font-medium mb-1">🗑️ Documento excluído</p>
                <p class="text-sm text-muted-foreground">Você tem <span id="countdown" class="font-semibold text-foreground">5</span> segundos para desfazer</p>
            </div>
            <button id="undo-btn" class="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors whitespace-nowrap">
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
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
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
                    className="bg-popover border border-border p-4 sm:p-6 rounded-lg shadow-2xl max-w-md w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-destructive/10 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-popover-foreground mb-1">
                                Confirmar exclusão
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Você terá 5 segundos para desfazer
                            </p>
                        </div>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4 mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-foreground">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{currentDocument?.title || "Sem título"}</span>
                        </div>
                        {versionCount > 0 && (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{versionCount} {versionCount === 1 ? 'versão salva' : 'versões salvas'}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-muted-foreground text-sm mb-4">
                        {versionCount > 0 
                            ? `O documento e suas ${versionCount} ${versionCount === 1 ? 'versão' : 'versões'} serão excluídos.`
                            : 'O documento será excluído.'}
                    </p>

                    {session?.user && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg space-y-2">
                            <p className="text-sm font-medium text-foreground mb-2">Onde deseja excluir?</p>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="deleteLocation"
                                    checked={!deleteFromCloud}
                                    onChange={() => setDeleteFromCloud(false)}
                                    className="w-4 h-4 border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer"
                                />
                                <HardDrive className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                    Apenas localmente
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="deleteLocation"
                                    checked={deleteFromCloud}
                                    onChange={() => setDeleteFromCloud(true)}
                                    className="w-4 h-4 border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer"
                                />
                                <Cloud className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                    Localmente e na nuvem
                                </span>
                            </label>
                        </div>
                    )}

                    <label className="flex items-center gap-2 mb-6 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={rememberChoice}
                            onChange={handleRememberChange}
                            className="w-4 h-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            Não perguntar novamente
                        </span>
                    </label>

                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClose}
                            className="px-4 py-2 text-foreground bg-secondary border border-border rounded-md hover:bg-secondary/80 cursor-pointer transition-colors duration-200 w-full sm:w-auto"
                        >
                            Cancelar
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDelete}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 cursor-pointer transition-colors duration-200 font-medium w-full sm:w-auto"
                        >
                            Excluir documento
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}