export function createColumn({
  key,
  header,
  sortable = false,
  width,
  align,
  render,
  accessor,
}) {
  return { key, header, sortable, width, align, render, accessor };
}
