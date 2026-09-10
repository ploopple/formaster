'use client';

import React from 'react';
import { FieldType } from '../types';
import { PALETTE_GROUPS, PALETTE_TYPES, getFieldTypeDef } from '../lib/fieldTypes';
import { MousePointer2, X } from 'lucide-react';

interface FieldPaletteProps {
  /** Type currently armed for placement, or null for the select tool */
  armedType: FieldType | null;
  onArm: (type: FieldType | null) => void;
  /** Horizontal strip on small screens, vertical rail on desktop */
  orientation: 'vertical' | 'horizontal';
}

/**
 * Field type picker. Clicking a type arms it; the next click or drag on the
 * page places a field of that type. Clicking it again (or Escape) goes back to
 * the select tool.
 */
const FieldPalette: React.FC<FieldPaletteProps> = ({ armedType, onArm, orientation }) => {
  const isVertical = orientation === 'vertical';

  const renderButton = (type: FieldType) => {
    const def = getFieldTypeDef(type);
    const Icon = def.icon;
    const isArmed = armedType === type;

    return (
      <button
        key={type}
        onClick={() => onArm(isArmed ? null : type)}
        title={`${def.label} — ${def.hint}`}
        aria-pressed={isArmed}
        className={`group flex items-center gap-2 rounded-lg border transition-all touch-manipulation ${
          isVertical ? 'w-full px-2 py-2' : 'shrink-0 px-2.5 py-1.5'
        } ${
          isArmed
            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100'
        }`}
      >
        <Icon size={16} className="shrink-0" />
        <span className={`text-[11px] font-medium whitespace-nowrap ${isVertical ? '' : ''}`}>{def.label}</span>
      </button>
    );
  };

  const selectTool = (
    <button
      onClick={() => onArm(null)}
      title="Select and move fields"
      aria-pressed={armedType === null}
      className={`flex items-center gap-2 rounded-lg border transition-all touch-manipulation ${
        isVertical ? 'w-full px-2 py-2' : 'shrink-0 px-2.5 py-1.5'
      } ${
        armedType === null
          ? 'bg-slate-800 border-slate-800 text-white shadow-sm'
          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 hover:bg-slate-50'
      }`}
    >
      <MousePointer2 size={16} className="shrink-0" />
      <span className="text-[11px] font-medium whitespace-nowrap">Select</span>
    </button>
  );

  if (!isVertical) {
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto px-2 py-2 bg-slate-50 border-b border-slate-200 no-scrollbar">
        {selectTool}
        <div className="w-px h-6 bg-slate-200 shrink-0" />
        {PALETTE_TYPES.map((def) => renderButton(def.type))}
      </div>
    );
  }

  return (
    <div className="w-28 shrink-0 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto">
      <div className="p-2 space-y-1.5">
        {selectTool}
      </div>

      {PALETTE_GROUPS.map((group) => {
        const types = PALETTE_TYPES.filter((def) => def.group === group.id);
        if (types.length === 0) return null;
        return (
          <div key={group.id} className="px-2 pb-2 space-y-1.5">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide px-1 pt-1">{group.label}</p>
            {types.map((def) => renderButton(def.type))}
          </div>
        );
      })}

      {armedType && (
        <div className="mt-auto p-2 border-t border-slate-200 bg-blue-50">
          <p className="text-[9px] text-blue-700 leading-snug mb-1.5">
            Click or drag on the page to place it.
          </p>
          <button
            onClick={() => onArm(null)}
            className="w-full flex items-center justify-center gap-1 text-[10px] text-slate-600 hover:text-slate-800 py-1 rounded hover:bg-white"
          >
            <X size={11} /> Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default FieldPalette;
