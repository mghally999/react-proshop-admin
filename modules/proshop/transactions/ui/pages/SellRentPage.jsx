import { useState } from "react";
import Button from "../../../../../shared/ui/primitives/Button";
import PageHeader from "../../../../../app/layout/PageHeader";
import SellRentDrawer from "../components/SellRentDrawer";

export default function SellRentPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Sell / Rent Product"
        actions={<Button onClick={() => setOpen(true)}>New Transaction</Button>}
      />

      <SellRentDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
