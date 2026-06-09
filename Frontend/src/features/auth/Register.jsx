import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../auth/AuthContext";
import { getRoleHomePath } from "../../auth/roleHome";
import { useToast } from "../../components/feedback/ToastProvider";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { getSessionRole } from "../../utils/storage";

export function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const registerMutation = useMutation({
    mutationFn: () =>
      register({ firstName, lastName, email, password, phoneNumber }),
    onSuccess: () => {
      showToast({
        title: "Account created",
        description: "Your account is ready to use.",
        variant: "success",
      });
      navigate(getRoleHomePath(getSessionRole()));
    },
    onError: (error) => {
      showToast({
        title: "Registration failed",
        description: error.message,
        variant: "error",
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-sm text-gray-600">
          Join EcommerceAI to access intelligent commerce workflows.
        </p>

        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            registerMutation.mutate();
          }}
        >
          <Input
            id="firstName"
            label="First Name"
            placeholder="Jane"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <Input
            id="lastName"
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
          <div className="sm:col-span-2">
            <Input
              id="registerEmail"
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              id="registerPassword"
              label="Password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Input
              id="phone"
              label="Phone (Optional)"
              placeholder="0300xxxxxxx"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </div>
          {registerMutation.isError ? (
            <ErrorMessage message={registerMutation.error.message} />
          ) : null}
          <div className="sm:col-span-2">
            <Button
              type="submit"
              className="w-full"
              disabled={
                registerMutation.isPending ||
                !firstName ||
                !lastName ||
                !email ||
                !password
              }
            >
              {registerMutation.isPending ? "Creating account..." : "Register"}
            </Button>
          </div>
        </form>

        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 transition-all hover:text-blue-700"
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
