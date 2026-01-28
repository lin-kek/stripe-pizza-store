"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "../ui/dialog";
import { useAuth } from "@/stores/auth";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import LoginStepEmail from "./login-step-email";
import LoginStepSignup from "./login-step-signup";
import { getCookie } from "cookies-next/client";
import LoginStepSignin from "./login-step-signin";

type Steps = "EMAIL" | "SIGNUP" | "SIGNIN";

export default function LoginDialog() {
  const auth = useAuth();

  const [step, setStep] = useState<Steps>("EMAIL");

  const [emailField, setEmailField] = useState("");

  useEffect(() => {
    const token = getCookie("token");
    if (token) auth.setToken(token);
  }, []);

  function handleStepEmail(hasEmail: boolean, email: string) {
    setEmailField(email);
    if (hasEmail) {
      setStep("SIGNIN");
    } else {
      setStep("SIGNUP");
    }
  }

  return (
    <Dialog open={auth.open} onOpenChange={(open) => auth.setOpen(open)}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step !== "EMAIL" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setStep("EMAIL")}
              >
                <ArrowLeft className="size-4" />
              </Button>
            )}
            {step === "EMAIL" && "Login or Register"}
            {step === "SIGNUP" && "Register"}
            {step === "SIGNIN" && "Login"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {step === "EMAIL" && <LoginStepEmail onValidate={handleStepEmail} />}
          {step === "SIGNUP" && <LoginStepSignup email={emailField} />}
          {step === "SIGNIN" && <LoginStepSignin email={emailField} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
