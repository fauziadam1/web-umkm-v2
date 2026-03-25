import z from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "./ui/button";
import { PasswordInput } from "./ui/password-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError } from "./ui/field";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { useAuth } from "@/lib/auth";

export function UserDelete() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [delLoading, setDelLoading] = useState(false);

  const formSchema = z.object({
    password: z.string().trim().min(1, "The password field is required"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const deleteUser = async () => {
    setDelLoading(true);
    try {
      await api.delete("/api/user", {
        data: form.getValues(),
      });
      setDelLoading(false);
      logout();
      navigate("/");
    } catch (errors) {
      toast.error(errors.response.data.message);
      setDelLoading(false);
    }
  };

  return (
    <div className="bg-destructive/5 border border-destructive/10 p-5 rounded-xl flex flex-col items-start gap-4">
      <span className="text-destructive flex flex-col gap-1">
        <h1 className="font-medium text-lg">Warning</h1>
        <p className="text-sm">
          Please proceed with caution, this cannot be undone.
        </p>
      </span>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive">Delete Account</Button>
        </DialogTrigger>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Anda yakin ingin menghapus akun Anda?</DialogTitle>
            <DialogDescription>
              Setelah akun Anda dihapus, semua sumber daya dan data di dalamnya
              juga akan dihapus secara permanen. Silakan masukkan kata sandi
              Anda untuk mengkonfirmasi bahwa Anda ingin menghapus akun Anda
              secara permanen.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(deleteUser)}>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mb-4">
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
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <Button type="submit" variant="destructive" disabled={delLoading}>
                {delLoading ? <Spinner /> : ""}
                Delete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
