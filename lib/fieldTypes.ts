import type { LucideIcon } from 'lucide-react';
import {
  Type,
  AlignLeft,
  Hash,
  Calendar,
  PenTool,
  ChevronDownSquare,
  CircleDot,
  SquareCheck,
  Table,
  Braces,
  Rows3,
} from 'lucide-react';
import { FieldType, FormField, FieldOption, TableColumn } from '../types';
import { generateUUID } from './uuid';

/**
 * Single source of truth for what each field type is, how it is created and
 * which property groups apply to it. The palette, the placement logic in the
 * viewer and the property panel all read from here, so adding a field type or
 * changing a default is a one-line change instead of a hunt through the UI.
 */

// Which property groups the editor should offer for a given type
export interface FieldCapabilities {
  typography: boolean;      // font size, letter spacing, alignment
  richText: boolean;        // bold / italic / underline
  maxLength: boolean;
  options: boolean;         // radio / checkbox / select choices
  markStyle: boolean;       // how a ticked box is drawn
  date: boolean;
  table: boolean;
  signature: boolean;
  digitPositions: boolean;  // per-digit placement for boxed number grids
  validation: boolean;
  attachments: boolean;
  multiPosition: boolean;   // can be repeated at extra spots on the page
}

const noCapabilities: FieldCapabilities = {
  typography: false,
  richText: false,
  maxLength: false,
  options: false,
  markStyle: false,
  date: false,
  table: false,
  signature: false,
  digitPositions: false,
  validation: false,
  attachments: false,
  multiPosition: false,
};

export interface FieldTypeDef {
  type: FieldType;
  /** Short name shown in the palette */
  label: string;
  /** One line explaining what it is for, shown on hover / long-press */
  hint: string;
  icon: LucideIcon;
  /** Palette grouping */
  group: 'input' | 'choice' | 'advanced';
  /** Size in page percent used when the field is placed with a click */
  defaultSize: { width: number; height: number };
  /** Smallest sensible size, used to clamp a drawn box */
  minSize: { width: number; height: number };
  capabilities: FieldCapabilities;
  /** Type specific properties applied on create and on type change */
  defaults: (ctx: { name: string; x: number; y: number }) => Partial<FormField>;
}

const makeOptions = (count = 2, x = 0, y = 0): FieldOption[] =>
  Array.from({ length: count }, (_, i) => ({
    id: generateUUID(),
    x: x + i * 10,
    y,
    width: 4,
    height: 3,
    value: `Option ${i + 1}`,
  }));

export const makeColumn = (name: string, type: TableColumn['type'], width: number): TableColumn => ({
  id: generateUUID(),
  name,
  type,
  width,
  fontSize: 12,
  textAlign: 'center',
  ...(type === 'date' ? { dateFormat: 'DD/MM/YYYY' } : {}),
  ...(type === 'radio' || type === 'checkbox' || type === 'select'
    ? { options: makeOptions(2) }
    : {}),
});

const capabilities = (over: Partial<FieldCapabilities>): FieldCapabilities => ({ ...noCapabilities, ...over });

export const FIELD_TYPES: FieldTypeDef[] = [
  {
    type: 'text',
    label: 'Text',
    hint: 'A single line of text',
    icon: Type,
    group: 'input',
    defaultSize: { width: 30, height: 4 },
    minSize: { width: 2, height: 1.5 },
    capabilities: capabilities({
      typography: true, richText: true, maxLength: true,
      validation: true, attachments: true, multiPosition: true,
    }),
    defaults: () => ({ value: '', previewText: '' }),
  },
  {
    type: 'textarea',
    label: 'Paragraph',
    hint: 'Multi-line text that wraps',
    icon: AlignLeft,
    group: 'input',
    defaultSize: { width: 40, height: 12 },
    minSize: { width: 5, height: 3 },
    capabilities: capabilities({
      typography: true, richText: true, maxLength: true,
      validation: true, attachments: true, multiPosition: true,
    }),
    defaults: () => ({ value: '', previewText: '' }),
  },
  {
    type: 'number',
    label: 'Number',
    hint: 'Digits only, can be split into boxes',
    icon: Hash,
    group: 'input',
    defaultSize: { width: 20, height: 4 },
    minSize: { width: 2, height: 1.5 },
    capabilities: capabilities({
      typography: true, maxLength: true, digitPositions: true,
      validation: true, attachments: true, multiPosition: true,
    }),
    defaults: () => ({ value: '', previewText: '' }),
  },
  {
    type: 'date',
    label: 'Date',
    hint: 'A date, with control over the day / month / year layout',
    icon: Calendar,
    group: 'input',
    defaultSize: { width: 25, height: 4 },
    minSize: { width: 3, height: 1.5 },
    capabilities: capabilities({
      typography: true, date: true, validation: true,
      attachments: true, multiPosition: true,
    }),
    defaults: () => ({ value: '', previewText: 'DD/MM/YYYY', dateFormat: 'DD/MM/YYYY' }),
  },
  {
    type: 'signature',
    label: 'Signature',
    hint: 'Draw-to-sign box',
    icon: PenTool,
    group: 'input',
    defaultSize: { width: 25, height: 8 },
    minSize: { width: 5, height: 3 },
    capabilities: capabilities({
      signature: true, validation: true, attachments: true, multiPosition: true,
    }),
    defaults: () => ({
      value: '', previewText: 'Sign Here',
      signatureCanvasWidth: 500, signatureCanvasHeight: 300,
    }),
  },
  {
    type: 'select',
    label: 'Dropdown',
    hint: 'Pick one value from a list',
    icon: ChevronDownSquare,
    group: 'choice',
    defaultSize: { width: 30, height: 4 },
    minSize: { width: 3, height: 1.5 },
    capabilities: capabilities({
      typography: true, options: true, validation: true,
      attachments: true, multiPosition: true,
    }),
    defaults: ({ x, y }) => ({ value: '', previewText: '', options: makeOptions(2, x, y) }),
  },
  {
    type: 'radio',
    label: 'Radio',
    hint: 'One choice, each option placed on the page',
    icon: CircleDot,
    group: 'choice',
    defaultSize: { width: 4, height: 3 },
    minSize: { width: 1, height: 1 },
    capabilities: capabilities({
      options: true, markStyle: true, validation: true, attachments: true,
    }),
    defaults: ({ x, y }) => ({ value: '', previewText: '', options: makeOptions(2, x, y), markStyle: 'checkmark' }),
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    hint: 'One or more ticks',
    icon: SquareCheck,
    group: 'choice',
    defaultSize: { width: 4, height: 3 },
    minSize: { width: 1, height: 1 },
    capabilities: capabilities({
      options: true, markStyle: true, validation: true, attachments: true,
    }),
    defaults: ({ x, y }) => ({ value: '', previewText: '', options: makeOptions(2, x, y), markStyle: 'checkmark' }),
  },
  {
    type: 'table',
    label: 'Table',
    hint: 'Rows and columns that fill the box automatically',
    icon: Table,
    group: 'advanced',
    defaultSize: { width: 70, height: 20 },
    minSize: { width: 10, height: 4 },
    capabilities: capabilities({ table: true, validation: true, attachments: true }),
    defaults: () => ({
      value: '[]',
      previewText: '',
      columns: [
        makeColumn('Column 1', 'text', 50),
        makeColumn('Column 2', 'text', 50),
      ],
      maxRows: 3,
      filledRows: 1,
      showHeaders: true,
      rowLayout: 'auto',
      cellPadding: 2,
      cellGap: 0,
    }),
  },
  {
    type: 'composite',
    label: 'Sentence',
    hint: 'A sentence with inputs embedded in it',
    icon: Braces,
    group: 'advanced',
    defaultSize: { width: 60, height: 5 },
    minSize: { width: 10, height: 2 },
    capabilities: capabilities({ typography: true }),
    defaults: () => ({ value: '', previewText: '', compositeTemplate: '' }),
  },
];

/** Table rows are created by the table, never placed from the palette */
const TABLE_ROW_DEF: FieldTypeDef = {
  type: 'table-row',
  label: 'Table row',
  hint: 'One row of a table, positioned by hand',
  icon: Rows3,
  group: 'advanced',
  defaultSize: { width: 70, height: 5 },
  minSize: { width: 5, height: 1 },
  capabilities: capabilities({ typography: true }),
  defaults: () => ({ value: '', previewText: '' }),
};

const BY_TYPE = new Map<FieldType, FieldTypeDef>(
  [...FIELD_TYPES, TABLE_ROW_DEF].map((def) => [def.type, def])
);

export const getFieldTypeDef = (type: FieldType): FieldTypeDef =>
  BY_TYPE.get(type) ?? BY_TYPE.get('text')!;

export const getCapabilities = (type: FieldType): FieldCapabilities => getFieldTypeDef(type).capabilities;

/** Types offered in the palette, in palette order */
export const PALETTE_TYPES = FIELD_TYPES;

export const PALETTE_GROUPS: { id: FieldTypeDef['group']; label: string }[] = [
  { id: 'input', label: 'Input' },
  { id: 'choice', label: 'Choice' },
  { id: 'advanced', label: 'Advanced' },
];

/**
 * Builds a complete field of the given type. `x`/`y`/`width`/`height` are in
 * page percent; width/height fall back to the type's default size, which is
 * what a plain click (rather than a drag) uses.
 */
export const createField = (
  type: FieldType,
  placement: { page: number; x: number; y: number; width?: number; height?: number },
  context: { name: string; color?: string }
): FormField => {
  const def = getFieldTypeDef(type);
  const width = placement.width ?? def.defaultSize.width;
  const height = placement.height ?? def.defaultSize.height;

  // Keep the box on the page
  const x = Math.max(0, Math.min(100 - width, placement.x));
  const y = Math.max(0, Math.min(100 - height, placement.y));

  return {
    id: generateUUID(),
    page: placement.page,
    x,
    y,
    width,
    height,
    name: context.name,
    value: '',
    previewText: '',
    type,
    fontSize: 12,
    letterSpacing: 0,
    textAlign: 'center',
    options: [],
    color: context.color,
    useGlobalColor: true,
    borderWidth: 0,
    padding: 2,
    ...def.defaults({ name: context.name, x, y }),
  };
};

/**
 * Properties to apply when an existing field is switched to another type.
 * Clears the settings that no longer apply so a leftover option list or date
 * format can't quietly affect the new type.
 */
export const propsForTypeChange = (type: FieldType, field: FormField): Partial<FormField> => {
  const def = getFieldTypeDef(type);
  const caps = def.capabilities;

  return {
    type,
    ...def.defaults({ name: field.name, x: field.x, y: field.y }),
    ...(caps.options ? {} : { options: [] }),
    ...(caps.date ? {} : { dateFormat: undefined, dateHideSeparator: undefined, dateSegmentSpacing: undefined }),
    ...(caps.table ? {} : { columns: undefined, maxRows: undefined, filledRows: undefined, showHeaders: undefined, rowLayout: undefined }),
    ...(caps.markStyle ? {} : { markStyle: undefined }),
    ...(caps.digitPositions ? {} : { digitPositions: undefined }),
    ...(caps.maxLength ? {} : { maxLength: undefined }),
  };
};

/** Next default name for a newly placed field of this type */
export const nextFieldName = (type: FieldType, existing: FormField[]): string => {
  const label = getFieldTypeDef(type).label;
  const used = existing.filter((f) => f.type === type).length;
  return `${label} ${used + 1}`;
};
