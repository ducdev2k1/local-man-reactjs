import { Globe, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import type { IEnvironment, IKeyValuePair } from '../../Types/models';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input, Label } from '../ui/input';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  env?: IEnvironment; // if provided, it's edit mode
  onSubmit: (name: string, variables: IKeyValuePair[]) => void;
}

export const AddEnvironmentModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  env,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [variables, setVariables] = useState<IKeyValuePair[]>([]);

  // Track previous prop values to reset state when they change
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevEnv, setPrevEnv] = useState(env);

  if (isOpen !== prevIsOpen || env !== prevEnv) {
    setPrevIsOpen(isOpen);
    setPrevEnv(env);
    if (isOpen) {
      if (env) {
        setName(env.name);
        setVariables(
          env.variables?.length
            ? env.variables
            : [{ id: uuidv4(), key: '', value: '', description: '', enabled: true }],
        );
      } else {
        setName('');
        setVariables([
          { id: uuidv4(), key: '', value: '', description: '', enabled: true },
        ]);
      }
    }
  }

  const handleUpdateVariable = (id: string, field: keyof IKeyValuePair, value: string | boolean) => {
    setVariables((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  const handleRemoveVariable = (id: string) => {
    setVariables((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddVariable = () => {
    setVariables((prev) => [
      ...prev,
      { id: uuidv4(), key: '', value: '', description: '', enabled: true },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Filter out empty rows before submit
      const validVars = variables.filter((v) => v.key.trim() || v.value.trim());
      onSubmit(name.trim(), validVars);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe size={18} className="text-[#4f8ef7]" />
            {env ? t('environments.edit') : t('environments.add')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 pb-2 border-b border-gray-200 dark:border-gray-800">
            <Label htmlFor="env-name">{t('environments.name')} <span className="text-red-400">*</span></Label>
            <Input
              id="env-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>{t('environments.variables')}</Label>
            <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
              {variables.map((item) => (
                <div key={item.id} className="flex items-center gap-2 mb-2">
                  <Input
                    placeholder={t('common.key')}
                    value={item.key}
                    onChange={(e) => handleUpdateVariable(item.id, 'key', e.target.value)}
                    className="flex-1 h-8 text-xs font-mono"
                  />
                  <Input
                    placeholder={t('common.value')}
                    value={item.value}
                    onChange={(e) => handleUpdateVariable(item.id, 'value', e.target.value)}
                    className="flex-1 h-8 text-xs font-mono"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 shrink-0"
                    onClick={() => handleRemoveVariable(item.id)}
                    disabled={variables.length === 1}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              <div className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={handleAddVariable}>
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" size="sm" disabled={!name.trim()}>
              {env ? t('common.confirm') : t('addCollection.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
