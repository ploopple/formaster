'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PropertyGroupProps {
  title: string;
  icon?: LucideIcon;
  /** Open on first render. The group remembers the reader's choice after that. */
  defaultOpen?: boolean;
  /** Small hint on the right of the header, e.g. how many options are set */
  badge?: string | number | null;
  children: React.ReactNode;
}

/**
 * One collapsible section of the field property panel. Uses a native <details>
 * so the open state survives re-renders without any extra state plumbing, which
 * matters here because the panel re-renders on every keystroke.
 */
const PropertyGroup: React.FC<PropertyGroupProps> = ({ title, icon: Icon, defaultOpen = false, badge, children }) => (
  <details open={defaultOpen} className="group border-t border-slate-100 pt-2 [&_summary::-webkit-details-marker]:hidden">
    <summary className="flex items-center gap-2 cursor-pointer list-none select-none py-1 -mx-1 px-1 rounded hover:bg-slate-50">
      <ChevronDown size={13} className="text-slate-400 transition-transform group-open:rotate-0 -rotate-90 shrink-0" />
      {Icon && <Icon size={14} className="text-slate-600 shrink-0" />}
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex-1 min-w-0 truncate">{title}</h3>
      {badge !== null && badge !== undefined && badge !== '' && (
        <span className="text-[9px] font-medium text-slate-500 bg-slate-100 rounded-full px-1.5 py-0.5 shrink-0">{badge}</span>
      )}
    </summary>
    <div className="space-y-3 pt-2 pb-1">{children}</div>
  </details>
);

export default PropertyGroup;
