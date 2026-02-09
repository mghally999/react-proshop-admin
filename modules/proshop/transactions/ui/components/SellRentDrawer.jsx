import { useState } from "react";
import { Drawer } from "../../../../../shared/ui/composites/Drawer";
import Button from "../../../../../shared/ui/primitives/Button";
import Select from "../../../../../shared/ui/primitives/Select";
import { useCreateTransaction } from "../../../../proshop/transactions/api/transactions.mutations";

export default function SellRentDrawer({ open, onClose }) {
  const [type, setType] = useState("sale");
  const mutation = useCreateTransaction();

  const submit = () => {
    mutation.mutate({
      type,
      productName: "Demo Product",
      price: type === "sale" ? 500 : 100,
      duration: type === "rent" ? 5 : null,
    });
    onClose();
  };

  return (
    <Drawer open={open} onClose={onClose} title="Sell / Rent">
      <Select
        label="Transaction Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        options={[
          { value: "sale", label: "Sell" },
          { value: "rent", label: "Rent" },
        ]}
      />

      <Button onClick={submit} loading={mutation.isLoading}>
        Confirm
      </Button>
    </Drawer>
  );
}
