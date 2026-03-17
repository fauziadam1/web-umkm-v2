import z from "zod";
import { Link } from "react-router";
import { HandCoins } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@/lib/password-schema";

export function LoginPage() {
  const formSchema = z.object({
    name: z.string().trim().min(1, "The name field is required"),
    email: z.string().trim().min(1, "The email field is required"),
    password: PasswordSchema,
    password_confirmation: z
      .string()
      .trim()
      .min(1, "The confirm field is required"),
  });
  z.refine((values) => values.password === values.password_confirmation, {
    message: "The confirm password does not match",
    path: ["password_confirmation"],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  return (
    <div className="w-full h-screen">
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
    </div>
  );
}
