import Input from "@/shared/ui/primitives/Input";

export default function RentalDuration({ value, onChange }) {
  return (
    <Input
      label="Rental Days"
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
