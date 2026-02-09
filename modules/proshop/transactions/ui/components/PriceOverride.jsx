import Input from "@/shared/ui/primitives/Input";

export default function PriceOverride({ value, onChange }) {
  return (
    <Input
      label="Override Price"
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
