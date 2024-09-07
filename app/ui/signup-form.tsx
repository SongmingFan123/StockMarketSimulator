"use client";
import { useFormState } from "react-dom";
import { signUp } from "../lib/actions";
import Button from "./button";
import ErrorMessageContainer from "./error";
import InputField from "./input-field";
const initialState = {
  message: "",
};
export default function SignUpForm() {
  const [state, formAction] = useFormState(signUp, initialState);
  return (
    <form
      action={formAction}
      className="w-[400px] flex flex-col gap-5 bg-white p-12 rounded-lg border border-indigo-500"
    >
      <h1 className="text-2xl">Sign Up</h1>
      <div>
        <label htmlFor="username">Username</label>
        <InputField id="username" name="username" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <InputField id="email" name="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <InputField id="password" name="password" type="password" />
      </div>
      <div>
        <label htmlFor="confirmedPassword">Confirm Password</label>
        <InputField
          id="confirmedPassword"
          name="confirmedPassword"
          type="password"
        />
      </div>
      {state.message && <ErrorMessageContainer errorMessage={state.message} />}
      <Button label="Sign Up" type="submit" />
    </form>
  );
}
