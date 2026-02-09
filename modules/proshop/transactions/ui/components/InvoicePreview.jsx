export default function InvoicePreview({ transaction }) {
  if (!transaction) return null;
  return <pre>{JSON.stringify(transaction, null, 2)}</pre>;
}
