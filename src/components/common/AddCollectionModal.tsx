/**
 * Component Name: AddCollectionModal
 * Description: Modal sử dụng shadcn Dialog để tạo mới Collection
 * SCSS File: src/assets/scss/components/_c-add-collection-modal.scss
 */

import { FolderPlus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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
import { Input, Label } from '../ui/input';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
}

export const AddCollectionModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  // State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Methods
  const resetForm = () => {
    setName('');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined);
      resetForm();
      onClose();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  // Lifecycle Hooks — chỉ tương tác với DOM (focus input)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus size={18} className="text-[#4f8ef7]" />
            {t('addCollection.title')}
          </DialogTitle>
          <DialogDescription>
            {t('addCollection.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="collection-name">
              {t('addCollection.name')} <span className="text-red-400">*</span>
            </Label>
            <Input
              ref={inputRef}
              id="collection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('addCollection.namePlaceholder')}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collection-desc">
              {t('addCollection.descriptionLabel')}
            </Label>
            <Input
              id="collection-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('addCollection.descPlaceholder')}
              autoComplete="off"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" size="sm" disabled={!name.trim()}>
              <FolderPlus size={14} />
              {t('addCollection.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
