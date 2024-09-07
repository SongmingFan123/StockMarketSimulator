"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";
import SignInForm from "../ui/signin-form";
export default function SignIn () {
  const router = useRouter();
  return (
    <main className="h-screen flex flex-col justify-center items-center text-indigo-500 overflow-auto">
      <SignInForm/>
      <p>New User?</p>
      <Button
        label="Create a New Account"
        onClick={() => {
          router.push("/signup");
        }}
        type="submit"
      />
    </main>
  );
};
