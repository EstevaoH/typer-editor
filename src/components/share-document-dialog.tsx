'use client'
import { useState } from 'react';
import { Share, Link, Copy, CheckCircle, X } from 'lucide-react';
import { useDocuments } from '@/context/documents-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from './ui/switch';


export function ShareDocumentDialog({ documentId, open, onOpenChange }: {
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { currentDocument, shareDocument, stopSharing } = useDocuments();
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!documentId) return;
    
    setIsSharing(true);
    try {
      const url = await shareDocument(documentId);
      setShareUrl(url);
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleStopSharing = () => {
    if (!documentId) return;
    
    stopSharing(documentId);
    setShareUrl(null);
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Documento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sharing-toggle">Compartilhamento</Label>
            <Switch
              id="sharing-toggle"
              checked={!!currentDocument?.isPublic}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleShare();
                } else {
                  handleStopSharing();
                }
              }}
              disabled={isSharing}
            />
          </div>

          {currentDocument?.isPublic && shareUrl && (
            <div className="space-y-3">
              <Label>Link de compartilhamento</Label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(shareUrl, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Abrir Link
                </Button>
                
                {navigator.share && (
                  <Button
                    onClick={() => navigator.share({
                      title: currentDocument.title,
                      text: 'Confira este documento',
                      url: shareUrl
                    })}
                    className="flex-1"
                  >
                    <Share className="w-4 h-4 text-zinc-300 mr-2" />
                    Compartilhar
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentDocument?.isPublic && !shareUrl && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Gerando link de compartilhamento...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}