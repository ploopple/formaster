'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { useI18n } from '../lib/i18n/I18nContext';

interface KeyboardShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsPanel: React.FC<KeyboardShortcutsPanelProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();

  const shortcutGroups = [
    {
      title: t.shortcuts.groups.general,
      shortcuts: [
        { keys: ['⌘/Ctrl', 'Z'], description: t.shortcuts.actions.undo },
        { keys: ['⌘/Ctrl', 'Shift', 'Z'], description: t.shortcuts.actions.redo },
        { keys: ['⌘/Ctrl', 'Y'], description: t.shortcuts.actions.redoAlt },
        { keys: ['?'], description: t.shortcuts.actions.toggleShortcuts },
      ],
    },
    {
      title: t.shortcuts.groups.fieldSelection,
      shortcuts: [
        { keys: ['Escape'], description: t.shortcuts.actions.deselectField },
        { keys: ['Delete/Backspace'], description: t.shortcuts.actions.deleteField },
        { keys: ['⌘/Ctrl', 'D'], description: t.shortcuts.actions.duplicateField },
      ],
    },
    {
      title: t.shortcuts.groups.fieldMovement,
      shortcuts: [
        { keys: ['↑'], description: t.shortcuts.actions.moveUp },
        { keys: ['↓'], description: t.shortcuts.actions.moveDown },
        { keys: ['←'], description: t.shortcuts.actions.moveLeft },
        { keys: ['→'], description: t.shortcuts.actions.moveRight },
        { keys: ['Shift', '↑↓←→'], description: t.shortcuts.actions.moveFaster },
      ],
    },
    {
      title: t.shortcuts.groups.fieldResizing,
      shortcuts: [
        { keys: ['⌘/Ctrl', '↑'], description: t.shortcuts.actions.decreaseHeight },
        { keys: ['⌘/Ctrl', '↓'], description: t.shortcuts.actions.increaseHeight },
        { keys: ['⌘/Ctrl', '←'], description: t.shortcuts.actions.decreaseWidth },
        { keys: ['⌘/Ctrl', '→'], description: t.shortcuts.actions.increaseWidth },
        { keys: ['Shift', '⌘/Ctrl', '↑↓←→'], description: t.shortcuts.actions.resizeFaster },
      ],
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Keyboard size={20} className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">{t.shortcuts.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-60px)]">
          <div className="space-y-6">
            {shortcutGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-sm text-slate-600">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <React.Fragment key={keyIdx}>
                            <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded text-xs font-mono text-slate-700 shadow-sm">
                              {key}
                            </kbd>
                            {keyIdx < shortcut.keys.length - 1 && (
                              <span className="text-slate-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center">
              {t.shortcuts.pressToToggle.split('?')[0]}<kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-mono">?</kbd>{t.shortcuts.pressToToggle.split('?')[1] || ''}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyboardShortcutsPanel;
