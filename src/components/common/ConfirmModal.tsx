import { AlertTriangle } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'warning';
}

export const ConfirmModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type = 'danger',
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getButtonVariant = () => {
    switch (type) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {type === 'danger' && (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 dark:bg-red-500/10">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="pt-2 text-gray-500 dark:text-gray-400">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onClose} className="text-xs">
            {cancelText || t('common.cancel')}
          </Button>
          <Button
            variant={
              getButtonVariant() as
                | 'destructive'
                | 'default'
                | 'ghost'
                | 'link'
                | 'outline'
                | 'secondary'
            }
            onClick={handleConfirm}
            className="text-xs"
          >
            {confirmText || t('common.confirm', 'Xác nhận')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
