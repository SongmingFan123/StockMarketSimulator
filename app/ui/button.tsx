'use client';
import React from "react"
import { useFormStatus } from "react-dom"
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    label: string
    // handleClick: () => void,
}
export default function Button ({label, ...rest} : ButtonProps) {
    const {pending} = useFormStatus();
    return <button
    {...rest}
    disabled={pending}
    className="text-center bg-indigo-500 py-2 px-2 text-white rounded-lg border border-indigo-500  hover:text-indigo-500 hover:bg-white"
  >
    {label}
  </button>
}