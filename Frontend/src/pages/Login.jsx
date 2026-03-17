import { z } from "zod";
import { setUser } from "@/lib/auth";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Link } from "react-router";
import { HandCoins } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@/lib/password-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/components/ui/password-input";

export function LoginPage() {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().trim().min(1, "The email field is required"),
    password: z.string().trim().min(1, "The password field is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/api/login");
      setUser(res.data.data);
      setLoading(false);
    } catch (errors) {
      toast.error(errors.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="space-y-7">
        <div className="flex flex-col items-center gap-3">
          <Link to={"/"}>
            <div className="w-10 h-10">
              <HandCoins className="bg-primary p-2 w-full h-full rounded-md text-white" />
            </div>
          </Link>
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-medium">Log in to your account</h1>
            <p className="text-center text-sm text-muted-foreground">
              Enter your email and password below to log in
            </p>
          </div>
        </div>
        <FieldGroup className="w-100">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input
                    type="email"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="email@example.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <PasswordInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Password"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Field>
              <Button type="submit">
                {loading ? <Spinner /> : ""}
                Log in
              </Button>
            </Field>
          </form>
        </FieldGroup>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className="underline decoration-gray-400 underline-offset-3 font-medium duration-200 hover:underline hover:decoration-foreground text-foreground"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
