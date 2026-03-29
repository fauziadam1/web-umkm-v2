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
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router";
import { File as FileIcon, FileText } from "lucide-react";

function FileUpload({ value = [], onChange }) {
  const inputRef = useRef(null);

  function handleAddFile(fileList) {
    const newFile = [...value, ...Array.from(fileList)];
    onChange(newFile);
  }

  function handleRemove(index) {
    const newFile = value.filter((_, i) => i !== index);
    onChange(newFile);
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current.click()}
      >
        <FileIcon className="size-4" /> Choose File
      </Button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          handleAddFile(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="flex gap-3 mt-3 flex-wrap">
        {value.map((file, index) => {
          const isImage = file.type.startsWith("image/");

          return (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50"
            >
              {isImage ? (
                <div className="flex items-center justify-center gap-2 text-sm p-2">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-8 h-8 object-cover rounded"
                  />
                  <span className="truncate">{file.name}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm p-2">
                  <FileText className="size-5" />
                  <span className="truncate">{file.name}</span>
                </div>
              )}

              <Button
                size="icon"
                type="buton"
                onClick={() => handleRemove(index)}
                className="rounded-full size-7 mr-2"
              >
                ×
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LoanForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const tenor = [3, 6, 9, 12, 18, 24];

  const formSchema = z.object({
    name: z.string().trim().min(1, "Kolom nama wajib diisi"),
    norek: z.string().trim().min(1, "Kolom nomor rekening wajib diisi"),
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
    tenor: z.number().min(1, "Kolom tenor wajib diisi"),
    ktp: z.array(z.instanceof(File)).min(1, "Harus upload minimal 1 file KTP"),
    npwp: z
      .array(z.instanceof(File))
      .min(1, "Harus upload minimal 1 file NPWP"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      telp: "",
      email: "",
      request_date: today,
      business_name: "",
      address: "",
      purpose: "",
      amount: "",
      norek: "",
      tenor: "",
      revenue: "",
      ktp: [],
      npwp: [],
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("norek", data.norek);
      formData.append("email", data.email);
      formData.append("telp", data.telp);
      formData.append("business_name", data.business_name);
      formData.append("address", data.address);
      formData.append("purpose", data.purpose);
      formData.append("amount", data.amount);
      formData.append("tenor", data.tenor);

      (data.ktp || []).forEach((file) => {
        formData.append("ktp[]", file);
      });

      (data.npwp || []).forEach((file) => {
        formData.append("npwp[]", file);
      });

      await api.post("/api/loan", formData);
      setLoading(false);
      toast.info("Pengajuan berhasil di kirim. Tunggu informasi selanjutnya");
      navigate("/");
      form();
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
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nama</FieldLabel>
                  <Input {...field} placeholder="Nama" autoComplete="off" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="business_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Nama Usaha, PT/CV</FieldLabel>
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
            <div className="grid grid-cols-2 gap-4">
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
              <Controller
                name="norek"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Nomor Rekening</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Nomor Rekening"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="tenor"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Tenor</FieldLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {tenor.map((t) => (
                          <SelectItem key={t} value={t.toString()}>
                            {t} bulan
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
                  <FileUpload
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
                  <FileUpload
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
