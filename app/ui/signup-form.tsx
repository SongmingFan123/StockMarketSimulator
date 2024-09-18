"use client";
import { useFormState } from "react-dom";
import { signUp } from "../lib/actions";
import Button from "./button";
import ErrorMessageContainer from "./error";
import InputField from "./input-field";
import { error } from "console";
const initialState = {
  errors: null,
  message: "",
};
export default function SignUpForm() {
  const [state, formAction] = useFormState(signUp, initialState);
  return (
    <form
      action={formAction}
      className="min-w-[100px] m-2 sm:w-[600px] sm:mx-0 flex flex-col gap-5 bg-white p-12 rounded-lg border border-indigo-500"
    >
      <h1 className="text-2xl">Sign up</h1>
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
        <label htmlFor="confirmPassword">Confirm Password</label>
        <InputField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
        />
      </div>
      {state.errors?.username && (
        <ErrorMessageContainer errorMessage={state.errors.username[0]} />
      )}
      {state.errors?.email && (
        <ErrorMessageContainer errorMessage={state.errors.email[0]} />
      )}
      {state.errors?.password && (
        <ErrorMessageContainer errorMessage={state.errors.password[0]} />
      )}
      {state.errors?.confirmPassword && (
        <ErrorMessageContainer errorMessage={state.errors.confirmPassword[0]} />
      )}
      {state.message && <ErrorMessageContainer errorMessage={state.message} />}
      <Button label="Sign Up" type="submit" />
    </form>
  );
}
