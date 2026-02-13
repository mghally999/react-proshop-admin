import * as txService from "./transactions.service.js";

export async function listTransactions(req, res, next) {
  try {
    const { type, status, page, limit } = req.query;
    const data = await txService.list({ type, status, page, limit });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function createTransaction(req, res, next) {
  try {
    const adminId = req.user?.id || null;
    const data = await txService.create(req.body, adminId);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function getTransaction(req, res, next) {
  try {
    const data = await txService.getById(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function markReturned(req, res, next) {
  try {
    const adminId = req.user?.id || null;
    const data = await txService.markReturned(req.params.id, adminId);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
