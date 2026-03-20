import { Layout } from "@/components/Layout";
import z from "zod";
import {
  Field,
  FieldDescription,
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

export default function LoanForm() {
  const revenues = [
    "Rp 300 Juta - 499 Juta per bulan",
    "Rp 500 Juta - 1 Miliar per bulan",
    "Rp 2 - 5 Miliar per bulan ",
    "> 5 Miliar per bulan",
  ];

  const tenor = [
    "3 bulan",
    "6 bulan",
    "9 bulan",
    "12 bulan",
    "18 bulan",
    "24 bulan",
  ];

  const formSchema = z.object({
    firstname: z.string().trim().min(1, "The "),
    lastname: "",
    telp: "",
    email: "",
    request_date: "",
    business_name: "",
    address: "",
    purpose: "",
    amount: "",
    tenor: "",
    revenue: "",
  });

  return (
    <div className="w-full h-screen bg-white flex items-start justify-center">
      <Layout />
      <FieldGroup className="max-w-3xl pt-20">
        <FieldSet>
          <FieldLegend>Form Pengajuan</FieldLegend>
          <FieldDescription>
            Lengkapi data berikut untuk mengajukan pinjaman usaha. Data Anda
            akan digunakan untuk verifikasi.
          </FieldDescription>
        </FieldSet>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Name Depan</FieldLabel>
              <Input />
            </Field>
            <Field>
              <FieldLabel>Name Belakang</FieldLabel>
              <Input />
            </Field>
          </div>
          <Field>
            <FieldLabel>Nama PT/CV</FieldLabel>
            <Input />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>No Telp</FieldLabel>
              <Input />
              <FieldDescription>
                Pastikan nomor terhubung dengan WhatsApp
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input />
            </Field>
          </div>
          <Field>
            <FieldLabel>Alamat Perusahaan</FieldLabel>
            <Input />
          </Field>
          <Field>
            <FieldLabel>Tujuan</FieldLabel>
            <Input />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Omset Perusahaan</FieldLabel>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {revenues.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Tenor</FieldLabel>
              <Select>
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
            </Field>
          </div>
        </FieldGroup>
      </FieldGroup>
    </div>
  );
}
