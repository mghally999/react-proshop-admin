import {User} from "./users.model.js";

// FakeStore users endpoint
const FAKESTORE_USERS_URL = "https://fakestoreapi.com/users";

export async function listUsers(query) {
  const limit = Math.min(Number(query?.limit ?? 100), 500);
  const search = String(query?.search ?? "").trim();

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
    ];
  }

  const items = await User.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  const total = await User.countDocuments(filter);

  return { items, total };
}

export async function getUserById(id) {
  const user = await User.findById(id).lean();
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}

export async function createUser(payload) {
  // prevent duplicates
  const exists = await User.findOne({
    $or: [{ email: payload.email }, { username: payload.username }],
  }).lean();

  if (exists) {
    const err = new Error("User with same email/username already exists");
    err.status = 409;
    throw err;
  }

  const created = await User.create({
    name: payload.name,
    email: payload.email,
    username: payload.username,
    phone: payload.phone,
    city: payload.city,
    source: payload.source ?? "local",
    sourceId: payload.sourceId,
  });

  return created.toObject();
}

export async function importFakeStoreUsers() {
  const resp = await fetch(FAKESTORE_USERS_URL);
  if (!resp.ok) throw new Error(`FakeStore fetch failed: ${resp.status}`);

  const users = await resp.json();

  let inserted = 0;
  let updated = 0;

  for (const u of users) {
    const email = u?.email;
    const username = u?.username;
    const name = `${u?.name?.firstname ?? ""} ${u?.name?.lastname ?? ""}`.trim();
    const city = u?.address?.city ?? "";
    const phone = u?.phone ?? "";
    const sourceId = String(u?.id);

    const doc = {
      source: "fakestore",
      sourceId,
      name: name || username || email,
      email,
      username,
      city,
      phone,
    };

    // upsert by source+sourceId (safe re-run)
    const r = await User.updateOne(
      { source: "fakestore", sourceId },
      { $set: doc, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    if (r.upsertedCount > 0) inserted += 1;
    else if (r.modifiedCount > 0) updated += 1;
  }

  return { ok: true, inserted, updated, totalFetched: users.length };
}
