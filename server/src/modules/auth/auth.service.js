import bcrypt from "bcryptjs";
import { AuthUser } from "./auth.model.js";

const DEFAULT_ADMIN = {
  email: "admin@proshop.com",
  password: "admin123",
  name: "Admin",
  role: "admin",
};

export async function ensureSeedAdmin() {
  const exists = await AuthUser.findOne({ email: DEFAULT_ADMIN.email });
  if (exists) return;

  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
  await AuthUser.create({
    email: DEFAULT_ADMIN.email,
    name: DEFAULT_ADMIN.name,
    role: DEFAULT_ADMIN.role,
    passwordHash,
  });

  console.log(
    "[auth] seeded admin:",
    DEFAULT_ADMIN.email,
    "pass:",
    DEFAULT_ADMIN.password
  );
}

export async function loginWithEmailPassword({ email, password }) {
  const user = await AuthUser.findOne({ email: String(email).toLowerCase() });
  if (!user || !user.isActive) {
    const e = new Error("Invalid credentials");
    e.statusCode = 401;
    throw e;
  }

  const ok = await bcrypt.compare(String(password), user.passwordHash);
  if (!ok) {
    const e = new Error("Invalid credentials");
    e.statusCode = 401;
    throw e;
  }

  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function createAdminUser({ email, password, name }) {
  const existing = await AuthUser.findOne({
    email: String(email).toLowerCase(),
  });
  if (existing) {
    const e = new Error("Email already exists");
    e.statusCode = 409;
    throw e;
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await AuthUser.create({
    email: String(email).toLowerCase(),
    name: name ?? "Admin",
    role: "admin",
    passwordHash,
  });

  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
