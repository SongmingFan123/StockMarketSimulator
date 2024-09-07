import React from "react";
interface PeriodButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange: () => void;
  selectedValue?: string;
}
export default function PeriodButton({
  onChange,
  label,
  value,
  id,
  selectedValue,
}: PeriodButtonProps) {
  return (
    <div>
      <input
        type="radio"
        id={id}
        className="peer hidden"
        name="period"
        value={value}
        onChange={onChange}
        defaultChecked={selectedValue === value}
      />
      <label
        htmlFor={id}
        className={`cursor-pointer rounded-full p-2 text-center text-indigo-500 peer-checked:bg-indigo-500 peer-checked:text-white`}
      >
        {label}
      </label>
    </div>
  );
}
