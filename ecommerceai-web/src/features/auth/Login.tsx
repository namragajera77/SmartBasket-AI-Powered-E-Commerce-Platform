import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { getRoleHomePath } from "../../auth/roleHome";
import { useAuth } from "../../auth/AuthContext";
import { useToast } from "../../components/feedback/ToastProvider";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { getSessionRole } from "../../utils/storage";

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => login({ email, password }),
    onSuccess: () => {
      const destination =
        (location.state as { from?: string } | null)?.from ??
        getRoleHomePath(getSessionRole() as "Admin" | "Customer" | "Delivery" | null);
      showToast({
        title: "Welcome back",
        description: "You are now signed in.",
        variant: "success",
      });
      navigate(destination);
    },
    onError: (error) => {
      showToast({
        title: "Login failed",
        description: error.message,
        variant: "error",
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
        <p className="text-sm text-gray-600">Sign in to manage orders, products, and AI tools.</p>

        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            loginMutation.mutate();
          }}
        >
          <Input id="email" label="Email" type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input id="password" label="Password" type="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" value={password} onChange={(event) => setPassword(event.target.value)} />
          {loginMutation.isError ? <ErrorMessage message={loginMutation.error.message} /> : null}
          <Button type="submit" disabled={loginMutation.isPending || !email || !password}>
            {loginMutation.isPending ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-gray-600">
          New here?{" "}
          <Link to="/register" className="font-semibold text-blue-600 transition-all hover:text-blue-700">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}

