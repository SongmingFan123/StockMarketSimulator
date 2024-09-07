"use client";
import { useFormState } from "react-dom";
import { signIn } from "../lib/actions";
import Button from "./button";
import ErrorMessageContainer from "./error";
import InputField from "./input-field";
const initialState = {
  message: "",
};
export default function SignInForm() {
  const [state, formAction] = useFormState(signIn, initialState);
  return (
    <form
      action={formAction}
      className="w-[600px] flex flex-col gap-5 bg-white p-12 rounded-lg border border-indigo-500"
    >
      <h1 className="text-2xl">Sign In to <span className="font-semibold text-indigo-700">Stock Market Simulator</span></h1>
      <div>
        <label htmlFor="email">Email</label>
        <InputField id="email" name="email" />
      </div>
      <div>
        <label htmlFor="passwrod">Password</label>
        <InputField id="password" name="password" type="password" />
      </div>
      {state.message && <ErrorMessageContainer errorMessage={state.message} />}
      <Button label="Sign In" type="submit" />
    </form>
  );
}
