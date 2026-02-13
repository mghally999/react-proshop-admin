import {Invoice} from "./invoices.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";

export async function listInvoices(req, res) {
  const invoices = await Invoice.find().sort({ createdAt: -1 });
  res.json(invoices);
}

export async function getInvoice(req, res) {
  const invoice = await Invoice.findById(req.params.id)
    .populate("user")
    .populate("transaction");

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.json(invoice);
}

export async function downloadInvoicePdf(req, res) {
  const invoice = await Invoice.findById(req.params.id)
    .populate("user")
    .populate("transaction");

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  const doc = new PDFDocument();
  const fileName = `invoice-${invoice._id}.pdf`;

  res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.text(`Invoice ID: ${invoice._id}`);
  doc.text(`User: ${invoice.user?.email}`);
  doc.text(`Total: AED ${(invoice.totalCents / 100).toFixed(2)}`);
  doc.text(`Date: ${invoice.createdAt}`);

  doc.end();
}
