import * as service from "./products.service.js";

export async function listProducts(req, res, next) {
  try {
    const { search, status, sort, page, pageSize } = req.query;

    const data = await service.list({
      q: search,
      status,
      sort,
      page,
      limit: pageSize,
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const data = await service.getById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const adminId = req.user?.id ?? null;
    const data = await service.create(req.body, adminId);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const data = await service.remove(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function importFakeStoreProducts(req, res, next) {
  try {
    const data = await service.importFakeStore();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
