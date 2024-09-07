import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement>{
  type?: string;
  placeholder?: string;
  id: string,
  name: string,
  minLength?: number,
  required?: boolean,
};
export default function InputField({
  type,
  placeholder,
  id,
  name,
  minLength,
  required,
  ...rest
}: InputFieldProps) {
  return (
    <input
    {...rest}
      className="w-full p-2 text-black outline-none focus:border-none focus:ring-2 focus:ring-indigo-700 border-indigo-500 border rounded-lg"
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
    />
  );
}
