import { useMemo, useState } from "react";
import Button from "@shared/ui/primitives/Button.jsx";
import Input from "@shared/ui/primitives/Input.jsx";
import { useUsers, useImportFakeStoreUsers, useCreateUser } from "@shared/api/users/users.queries.js";

function userId(u) {
  return String(u?.id ?? u?._id ?? "");
}

function userFullName(u) {
  const n = u?.name;
  if (!n) return "—";
  if (typeof n === "string") return n;
  const first = n?.firstname ?? n?.firstName ?? "";
  const last = n?.lastname ?? n?.lastName ?? "";
  const full = `${first} ${last}`.trim();
  return full || "—";
}

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useUsers({ search, limit: 200 });
  const importUsers = useImportFakeStoreUsers();
  const createUser = useCreateUser();

  // Your backend might return:
  // - array: [...]
  // - or { items: [...] }
  const users = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.items)) return data.items;
    return [];
  }, [data]);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    city: "",
    phone: "",
  });

  async function onImport() {
    await importUsers.mutateAsync();
  }

  async function onCreate(e) {
    e.preventDefault();
    await createUser.mutateAsync({
      source: "manual",
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: { city: form.city.trim() },
      name: { firstname: form.firstname.trim(), lastname: form.lastname.trim() },
    });

    setForm({ firstname: "", lastname: "", email: "", city: "", phone: "" });
  }

  return (
    <div style={{ padding: 18, display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>Users</div>
          <div style={{ opacity: 0.7, fontSize: 13 }}>
            Import FakeStore users once into MongoDB (safe to re-run).
          </div>
        </div>

        <Button
          onClick={onImport}
          loading={importUsers.isPending}
          variant="secondary"
        >
          Import FakeStore Users
        </Button>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Input
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Name or email…"
        />
        <div style={{ opacity: 0.7, marginTop: 18 }}>
          Total: {users.length}
        </div>
      </div>

      <div style={{ border: "1px solid var(--stroke)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.6fr 0.9fr 0.9fr", padding: 12, background: "var(--panel)", fontWeight: 600 }}>
          <div>Name</div>
          <div>Email</div>
          <div>Source</div>
          <div>City</div>
        </div>

        {isLoading && <div style={{ padding: 12, opacity: 0.7 }}>Loading…</div>}
        {error && <div style={{ padding: 12, color: "tomato" }}>Error loading users.</div>}

        {!isLoading && !error && users.length === 0 && (
          <div style={{ padding: 12, opacity: 0.7 }}>No users yet.</div>
        )}

        {users.map((u) => (
          <div
            key={userId(u)}
            style={{ display: "grid", gridTemplateColumns: "1.2fr 1.6fr 0.9fr 0.9fr", padding: 12, borderTop: "1px solid var(--stroke)" }}
          >
            <div>{userFullName(u)}</div>
            <div>{u.email ?? "—"}</div>
            <div>{u.source ?? "local"}</div>
            <div>{u.address?.city ?? u.city ?? "—"}</div>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid var(--stroke)", borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Add User</div>

        <form onSubmit={onCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Input label="First name" value={form.firstname} onChange={(e) => setForm((s) => ({ ...s, firstname: e.target.value }))} />
          <Input label="Last name" value={form.lastname} onChange={(e) => setForm((s) => ({ ...s, lastname: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
          <Input label="City" value={form.city} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} />

          <div style={{ display: "flex", alignItems: "end" }}>
            <Button type="submit" loading={createUser.isPending} variant="primary" disabled={!form.email}>
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
