"use client";

import { useAuth } from "@/stores/auth";
import { useState } from "react";
import z from "zod";
import CustomInput from "../layout/custom-input";
import { Button } from "../ui/button";
import { api } from "@/lib/axios";

const schema = z
  .object({
    name: z.string().min(2, "Required field."),
    email: z.email("Invalid email."),
    password: z.string().min(4, "Minimum of 4 characters."),
    passwordConfirm: z.string().min(4, "Minimum of 4 characters."),
  })
  .refine((data: any) => data.password === data.passwordConfirm, {
    message: "Passwords are not the same.",
    path: ["passwordConfirm"],
  });

type Props = {
  email: string;
};

export default function LoginStepSignup({ email }: Props) {
  const auth = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);

  const [nameField, setNameField] = useState("");
  const [emailField, setEmailField] = useState(email);
  const [passwordField, setPasswordField] = useState("");
  const [passwordConfirmField, setPasswordConfirmField] = useState("");

  async function handleContinue() {
    setErrors(null);
    const validData = schema.safeParse({
      name: nameField,
      email: emailField,
      password: passwordField,
      passwordConfirm: passwordConfirmField,
    });
    if (!validData.success) {
      setErrors(validData.error.flatten().fieldErrors);
      return false;
    }

    try {
      setLoading(true);
      const signupReq = await api.post("/auth/signup", {
        name: validData.data.name,
        email: validData.data.email,
        password: validData.data.password,
      });
      setLoading(false);
      if (!signupReq.data.token) {
        alert(signupReq.data.error);
      } else {
        auth.setToken(signupReq.data.token);
        auth.setOpen(false);
      }
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <p className="mb-2">Enter your name.</p>
        <CustomInput
          name="name"
          errors={errors}
          disabled={loading}
          type="text"
          value={nameField}
          onChange={(e) => setNameField(e.target.value)}
          autoFocus
        />
      </div>
      <div>
        <p className="mb-2">Enter your email.</p>
        <CustomInput
          name="email"
          errors={errors}
          disabled={true}
          type="email"
          value={emailField}
          onChange={(e) => setEmailField(e.target.value)}
        />
      </div>
      <div>
        <p className="mb-2">Enter your password.</p>
        <CustomInput
          name="password"
          errors={errors}
          disabled={loading}
          type="password"
          value={passwordField}
          onChange={(e) => setPasswordField(e.target.value)}
        />
      </div>
      <div>
        <p className="mb-2">Confirm your password.</p>
        <CustomInput
          name="passwordConfirm"
          errors={errors}
          disabled={loading}
          type="password"
          value={passwordConfirmField}
          onChange={(e) => setPasswordConfirmField(e.target.value)}
        />
      </div>

      <Button
        disabled={loading}
        onClick={handleContinue}
        className="cursor-pointer"
      >
        Continue
      </Button>
    </>
  );
}
