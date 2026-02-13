import PDFDocument from "pdfkit";

function fmtMoney(cents, currency = "AED") {
  const v = (Number(cents || 0) / 100).toFixed(2);
  return `${currency} ${v}`;
}
function safe(v) {
  return v == null ? "" : String(v);
}
function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toISOString().slice(0, 10);
}

export function renderInvoicePdf(invoice, company = {}) {
  const doc = new PDFDocument({ size: "A4", margin: 48 });

  const currency = invoice.currency || "AED";
  const left = doc.page.margins.left;
  const right = doc.page.width - doc.page.margins.right;

  doc.fontSize(20).text(company.name || "ProShop", left, 48);
  doc.fontSize(10).fillColor("#444");
  doc.text(safe(company.address || ""), left, 74);
  doc.text(safe(company.email || ""), left, 88);
  doc.text(safe(company.phone || ""), left, 102);
  doc.fillColor("#000");

  doc.fontSize(22).text("INVOICE", left, 48, { align: "right" });
  doc.fontSize(10).fillColor("#444");
  doc.text(`Invoice #: ${safe(invoice.invoiceNo)}`, left, 78, { align: "right" });
  doc.text(`Date: ${fmtDate(invoice.createdAt)}`, left, 92, { align: "right" });
  doc.text(`Status: ${safe(invoice.status)}`, left, 106, { align: "right" });
  doc.fillColor("#000");

  doc.moveTo(left, 132).lineTo(right, 132).strokeColor("#ddd").stroke();
  doc.strokeColor("#000");

  const billY = 146;
  doc.fontSize(12).text("Bill To", left, billY);
  doc.fontSize(10).fillColor("#444");
  doc.text(safe(invoice.userSnapshot?.name) || "—", left, billY + 18);
  doc.text(safe(invoice.userSnapshot?.email) || "—", left, billY + 32);
  doc.fillColor("#000");

  let y = 210;
  const col1 = left;
  const col2 = left + 250;
  const col3 = left + 340;
  const col4 = left + 420;
  const col5 = left + 500;

  doc.fontSize(10).fillColor("#111");
  doc.text("Item", col1, y);
  doc.text("Type", col2, y);
  doc.text("Qty", col3, y, { width: 50, align: "right" });
  doc.text("Unit", col4, y, { width: 60, align: "right" });
  doc.text("Total", col5, y, { width: right - col5, align: "right" });
  doc.fillColor("#000");

  y += 14;
  doc.moveTo(left, y).lineTo(right, y).strokeColor("#ddd").stroke();
  doc.strokeColor("#000");
  y += 10;

  for (const line of invoice.lines || []) {
    const name = safe(line.name) + (line.sku ? ` (SKU: ${line.sku})` : "");
    const type = safe(line.type);
    const qty = String(line.quantity ?? 1);
    const unit = fmtMoney(line.unitPriceCents ?? 0, currency);
    const total = fmtMoney(line.lineTotalCents ?? line.overrideTotalCents ?? 0, currency);

    doc.text(name, col1, y, { width: 240 });
    doc.text(type, col2, y, { width: 80 });
    doc.text(qty, col3, y, { width: 50, align: "right" });
    doc.text(unit, col4, y, { width: 70, align: "right" });
    doc.text(total, col5, y, { width: right - col5, align: "right" });

    y += 18;

    if (type === "rental" && line.rental) {
      const r = line.rental;
      const rtext =
        `Rental: ${r.duration ?? 1} ${safe(r.unit || "day")}(s)` +
        (r.depositCents ? ` • Deposit: ${fmtMoney(r.depositCents, currency)}` : "");
      doc.fontSize(9).fillColor("#666").text(rtext, col1, y, { width: 400 });
      doc.fillColor("#000").fontSize(10);
      y += 14;
    }

    if (y > 700) {
      doc.addPage();
      y = 60;
    }
  }

  y += 10;
  doc.moveTo(left, y).lineTo(right, y).strokeColor("#ddd").stroke();
  doc.strokeColor("#000");
  y += 12;

  const totalsX = left + 340;
  doc.text("Subtotal", totalsX, y);
  doc.text(fmtMoney(invoice.subtotalCents ?? 0, currency), totalsX, y, { align: "right" });
  y += 14;

  doc.text(`Tax (${Number(invoice.taxRate ?? 0).toFixed(2)}%)`, totalsX, y);
  doc.text(fmtMoney(invoice.taxCents ?? 0, currency), totalsX, y, { align: "right" });
  y += 14;

  doc.fontSize(12).text("Total", totalsX, y);
  doc.text(fmtMoney(invoice.totalCents ?? 0, currency), totalsX, y, { align: "right" });
  doc.fontSize(10);

  doc.fontSize(9).fillColor("#666").text("Thank you.", left, 780, { align: "center" });
  doc.fillColor("#000");

  return doc;
}
