import { z } from "zod";
import * as usersService from "./users.service.js";

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(1),
  phone: z.string().optional(),
  city: z.string().optional(),
  source: z.enum(["local", "fakestore"]).optional(),
  sourceId: z.string().optional(),
});

export async function listUsers(req, res, next) {
  try {
    const data = await usersService.listUsers(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getUserById(req, res, next) {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function createUser(req, res, next) {
  try {
    const payload = CreateUserSchema.parse(req.body);
    const created = await usersService.createUser(payload);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
}

export async function importFakeStoreUsers(req, res, next) {
  try {
    const result = await usersService.importFakeStoreUsers();
    res.json(result);
  } catch (e) {
    next(e);
  }
}
