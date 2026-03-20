import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "./ui/field";
import z from "zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserDelete } from "./UserDelete";

export function ProfileInfo() {
  const { login } = useAuth();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string(),
    email: z.string().email("Email tidak valid"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const update = async () => {
    setLoading(true);
    try {
      const res = await api.put("/api/user", form.watch());
      login({
        ...user,
        ...res.data.data,
      });
      setLoading(false);
    } catch (errors) {
      toast.error(errors.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <FieldGroup>
        <form onSubmit={form.handleSubmit(update)}>
          <FieldGroup>
            <Field>
              <FieldSet>
                <FieldLegend>Profile Information</FieldLegend>
                <FieldDescription>
                  Update your name and email address
                </FieldDescription>
              </FieldSet>
            </Field>
            <FieldGroup>
              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input name="name" {...form.register("name")} />
              </Field>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input name="email" {...form.register("email")} />
              </Field>
            </FieldGroup>
            <Field orientation="horizontal">
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner /> : ""}
                Save
              </Button>
            </Field>
          </FieldGroup>
        </form>
        <Field>
          <UserDelete />
        </Field>
      </FieldGroup>
    </div>
  );
}
