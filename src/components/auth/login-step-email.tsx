"use client";

import { useState } from "react";
import CustomInput from "../layout/custom-input";
import { Button } from "../ui/button";
import z from "zod";
import { api } from "@/lib/axios";

const schema = z.object({
  email: z.email("Invalid email."),
});

type Props = {
  onValidate: (hasEmail: boolean, email: string) => void;
};

export default function LoginStepEmail({ onValidate }: Props) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [emailField, setEmailField] = useState("");

  async function handleContinue() {
    setErrors(null);
    const validData = schema.safeParse({
      email: emailField,
    });
    if (!validData.success) {
      setErrors(validData.error.flatten().fieldErrors);
      return false;
    }

    try {
      setLoading(true);
      const emailReq = await api.post("/auth/validate_email", {
        email: validData.data.email,
      });
      setLoading(false);

      onValidate(emailReq.data.exists ? true : false, validData.data.email);
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <>
      <div>
        <p className="mb-2">Enter your email address to proceed.</p>
        <CustomInput
          name="email"
          errors={errors}
          disabled={loading}
          type="email"
          value={emailField}
          onChange={(e) => setEmailField(e.target.value)}
        />
      </div>

      <Button
        onClick={handleContinue}
        disabled={loading}
        className="cursor-pointer"
      >
        Continue
      </Button>
    </>
  );
}
