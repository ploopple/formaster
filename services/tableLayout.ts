import { FormField } from '../types';
import { generateUUID } from '../lib/uuid';

/**
 * Geometry helpers for table rows.
 *
 * A table can lay its rows out automatically inside its own box, or hand every
 * row its own draggable box so it can be snapped onto the printed lines of a
 * scanned form. These helpers move a table between the two, and are pure: each
 * takes the whole field list and returns a new one.
 */

const rowsOf = (fields: FormField[], tableId: string): FormField[] =>
  fields
    .filter((f) => f.parentFieldId === tableId && f.type === 'table-row')
    .sort((a, b) => (a.rowIndex || 0) - (b.rowIndex || 0));

/** Where row `index` sits when the table lays its rows out itself */
export const rowGeometry = (table: FormField, index: number) => {
  const capacity = Math.max(1, table.maxRows || 1);
  const slots = table.showHeaders ? capacity + 1 : capacity;
  const rowHeight = table.height / slots;
  const slotIndex = (table.showHeaders ? 1 : 0) + index;

  return {
    x: table.x,
    y: table.y + slotIndex * rowHeight,
    width: table.width,
    height: rowHeight,
  };
};

/** Spreads a table's existing rows evenly down its box, keeping their order */
export const distributeTableRows = (fields: FormField[], tableId: string): FormField[] => {
  const table = fields.find((f) => f.id === tableId);
  if (!table) return fields;

  const rows = rowsOf(fields, tableId);
  if (rows.length === 0) return fields;

  // Size the slots to the number of rows that actually exist
  const sizingTable: FormField = { ...table, maxRows: rows.length };
  const positions = new Map(rows.map((row, i) => [row.id, rowGeometry(sizingTable, i)]));

  return fields.map((f) => {
    const pos = positions.get(f.id);
    return pos ? { ...f, ...pos, page: table.page } : f;
  });
};

/** Creates one more row for a table, placed just under the last one */
export const appendTableRow = (fields: FormField[], tableId: string): FormField[] => {
  const table = fields.find((f) => f.id === tableId);
  if (!table) return fields;

  const rows = rowsOf(fields, tableId);
  const index = rows.length;
  const last = rows[rows.length - 1];

  const geometry = last
    ? { x: last.x, y: last.y + last.height, width: last.width, height: last.height }
    : rowGeometry(table, 0);

  // Wrap back to the top of the table rather than running off the page
  if (geometry.y + geometry.height > 100) geometry.y = table.y;

  const row: FormField = {
    id: generateUUID(),
    page: table.page,
    ...geometry,
    name: `${table.name} row ${index + 1}`,
    value: '',
    previewText: '',
    type: 'table-row',
    fontSize: table.fontSize || 12,
    letterSpacing: table.letterSpacing || 0,
    textAlign: table.textAlign || 'center',
    parentFieldId: tableId,
    rowIndex: index,
  };

  return [...fields, row];
};

/**
 * Switches a table between auto layout and hand-placed rows.
 *
 * Going manual seeds one box per row so there is something to drag straight
 * away; going back to auto removes those boxes so no stale geometry is left
 * behind (undo restores them).
 */
export const setTableRowLayout = (
  fields: FormField[],
  tableId: string,
  layout: 'auto' | 'manual'
): FormField[] => {
  const table = fields.find((f) => f.id === tableId);
  if (!table) return fields;

  if (layout === 'auto') {
    return fields
      .filter((f) => !(f.parentFieldId === tableId && f.type === 'table-row'))
      .map((f) => (f.id === tableId ? { ...f, rowLayout: 'auto' as const } : f));
  }

  const withFlag = fields.map((f) => (f.id === tableId ? { ...f, rowLayout: 'manual' as const } : f));
  if (rowsOf(withFlag, tableId).length > 0) return withFlag;

  // Seed the rows the auto layout would have drawn
  const count = Math.max(1, table.maxRows || 1);
  const seeded: FormField[] = Array.from({ length: count }, (_, index) => ({
    id: generateUUID(),
    page: table.page,
    ...rowGeometry(table, index),
    name: `${table.name} row ${index + 1}`,
    value: '',
    previewText: '',
    type: 'table-row' as const,
    fontSize: table.fontSize || 12,
    letterSpacing: table.letterSpacing || 0,
    textAlign: table.textAlign || 'center',
    parentFieldId: tableId,
    rowIndex: index,
  }));

  return [...withFlag, ...seeded];
};
