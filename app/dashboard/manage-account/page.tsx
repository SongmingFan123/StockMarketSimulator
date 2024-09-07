"use client";
import { updatePassword, updateUsername } from "@/app/lib/actions";
import Button from "@/app/ui/button";
import ErrorMessageContainer from "@/app/ui/error";
import InputField from "@/app/ui/input-field";
import React from "react";
import { useFormState } from "react-dom";
const initialState = {
  success: false,
  message: "",
};
export default function ManageAccount() {
  const [updatePasswordStatus, updatePasswordFormAction] = useFormState(
    updatePassword,
    initialState
  );
  const [updateUsernameStatus, updateUsernameFormAction] = useFormState(
    updateUsername,
    initialState
  );
  return (
    <main>
      <div className="flex flex-col items-center p-2 gap-2">
        <form
          action={updatePasswordFormAction}
          className="w-full flex flex-col gap-2"
        >
          <InputField
            type="password"
            placeholder="New Password"
            id="password"
            name="password"
          />
          <Button
            type="submit"
            label={"Update Password"}
          />
        </form>
        <form
          action={updateUsernameFormAction}
          className="w-full flex flex-col gap-2"
        >
          <InputField
            type="text"
            placeholder="New Username"
            id="username"
            name="username"
          />
          <Button type="submit" label={"Update Username"} />
        </form>
        {updatePasswordStatus?.message && updatePasswordStatus.success ? (
          <p>{updatePasswordStatus.message}</p>
        ) : (
          updatePasswordStatus?.message && (
            <ErrorMessageContainer
              errorMessage={updatePasswordStatus.message}
            />
          )
        )}

        {updateUsernameStatus?.message && updateUsernameStatus.success ? (
          <p>{updateUsernameStatus.message}</p>
        ) : (
          updateUsernameStatus?.message && (
            <ErrorMessageContainer
              errorMessage={updateUsernameStatus.message}
            />
          )
        )}
      </div>
    </main>
  );
}
