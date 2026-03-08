/**
 * Component Name: AddCollectionModal
 * Description: Modal để tạo mới Collection với tên và mô tả
 * SCSS File: src/assets/scss/components/_c-add-collection-modal.scss
 */

import { FolderPlus, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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
  // State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Methods
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined);
      setName('');
      setDescription('');
      onClose();
    }
  };

  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Lifecycle Hooks
  useEffect(() => {
    if (isOpen) {
      // Focus vào input khi mở modal
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setName('');
      setDescription('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="c-modal_overlay"
      onClick={onClose}
      onKeyDown={handleOverlayKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="c-modal_content" onClick={(e) => e.stopPropagation()}>
        <div className="c-modal_header">
          <div className="c-modal_header_title">
            <FolderPlus size={18} className="text-[#4f8ef7]" />
            <h3>New Collection</h3>
          </div>
          <button onClick={onClose} className="c-modal_close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="c-modal_body">
          <div className="c-modal_field">
            <label htmlFor="collection-name" className="c-modal_label">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              ref={inputRef}
              id="collection-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My API Collection"
              className="c-modal_input"
              autoComplete="off"
            />
          </div>

          <div className="c-modal_field">
            <label htmlFor="collection-desc" className="c-modal_label">
              Description
            </label>
            <input
              id="collection-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="c-modal_input"
              autoComplete="off"
            />
          </div>

          <div className="c-modal_footer">
            <button
              type="button"
              onClick={onClose}
              className="c-modal_btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="c-modal_btn-submit"
            >
              <FolderPlus size={14} />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
