import { Layout } from "@/components/Layout";
import z from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { FileUploud } from "@/lib/file";
import { useNavigate } from "react-router";

export default function LoanForm() {
  const navigate = useNavigate();
  const { reset } = useForm();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const tenor = [
    "3 bulan",
    "6 bulan",
    "9 bulan",
    "12 bulan",
    "18 bulan",
    "24 bulan",
  ];

  const formSchema = z.object({
    firstname: z.string().trim().min(1, "Kolom nama depan wajib diisi"),
    lastname: z.string().trim().min(1, "Kolom nama belakang wajib diisi"),
    telp: z.string().trim().min(1, "Kolom nomor telepon wajib diisi"),
    email: z.string().email().min(1, "Kolom email wajib diisi"),
    request_date: z.string(),
    business_name: z
      .string()
      .trim()
      .min(1, "Kolom nama perusahaan wajib diisi"),
    address: z.string().trim().min(1, "Kolom alamat perusahaan wajib diisi"),
    purpose: z.string().trim().min(1, "Kolom tujuan wajib diisi"),
    amount: z
      .number()
      .min(1, "Kolom jumlah peminjaman wajib diisi")
      .max(500_000_000, "Maksimal pengajuan Rp 500.000.000"),
    tenor: z.string().trim().min(1, "Kolom tenor wajib diisi"),
    ktp: z
      .array(z.instanceof(File))
      .min(1, "Harus mengupload minimal 1 file KTP"),
    npwp: z
      .array(z.instanceof(File))
      .min(1, "Harus mengupload minimal 1 file NPWP"),
    business_photo: z
      .array(z.instanceof(File))
      .min(1, "Harus mengupload minimal 1 foto perusahaan"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      telp: "",
      email: "",
      request_date: today,
      business_name: "",
      address: "",
      purpose: "",
      amount: "",
      tenor: "",
      revenue: "",
      ktp: [],
      npwp: [],
      business_photo: [],
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      for (const key in data) {
        const value = data[key];

        if (Array.isArray(value)) {
          value.forEach((file) => {
            formData.append(key, file);
          });
        } else {
          formData.append(key, value);
        }
      }

      await api.post("/api/loan", formData);
      setLoading(false);
      navigate("/");
      reset();
      toast.info("Pengajuan berhasil di kirim. Tunggu informasi selanjutnya");
    } catch (errors) {
      toast.error(errors.response.data.message);
      setLoading(false);
    }
  };

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  }

  return (
    <div className="w-full bg-white flex items-start justify-center">
      <Layout />
      <FieldGroup className="max-w-md md:max-w-3xl py-20">
        <FieldSet>
          <FieldLegend>Form Pengajuan</FieldLegend>
          <FieldDescription>
            Lengkapi data berikut untuk mengajukan pinjaman usaha. Data Anda
            akan digunakan untuk verifikasi.
          </FieldDescription>
        </FieldSet>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="firstname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Name Depan</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nama Depan"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Name Belakang</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nama Belakang"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="business_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nama PT/CV</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Nama PT/CV "
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="telp"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Nomor Telepon</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      placeholder="Nomor Telepon"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                    <FieldDescription>
                      Pastikan nomor terhubung dengan WhatsApp
                    </FieldDescription>
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Alamat Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="email@example.com"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Alamat Perusahaan</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Alamat Perusahaan"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="purpose"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Tujuan</FieldLabel>
                  <Input {...field} placeholder="Tujuan" autoComplete="off" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="amount"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Jumlah Peminjaman</FieldLabel>
                  <Input
                    {...field}
                    value={formatRupiah(field.value)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "");
                      field.onChange(raw ? parseInt(raw) : 0);
                    }}
                    placeholder="500.000.000"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="tenor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Tenor</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenor.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <FieldLabel>Tanggal Pengajuan</FieldLabel>
                <Input
                  type="date"
                  className="text-sm"
                  value={form.watch("request_date")}
                  readOnly
                />
              </Field>
            </div>
            <Controller
              name="ktp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>KTP</FieldLabel>
                  <FileUploud
                    value={field.value}
                    onChange={field.onChange}
                    maxFiles={3}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="npwp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>NPWP</FieldLabel>
                  <FileUploud
                    value={field.value}
                    onChange={field.onChange}
                    maxFiles={3}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="business_photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Foto Perusahaan</FieldLabel>
                  <FileUploud
                    value={field.value}
                    onChange={field.onChange}
                    maxFiles={3}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : ""}Submit
            </Button>
          </FieldGroup>
        </form>
      </FieldGroup>
    </div>
  );
}
