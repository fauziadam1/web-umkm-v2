import { Layout } from "@/components/Layout";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Clock, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardUser() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loan, setLoan] = useState([]);

  const fetchLoan = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/loans");
      setLoading(false);
      setLoan(res.data.data);
    } catch (errors) {
      toast.error(errors.data.response.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, []);

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  const total = loan.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="w-full min-h-screen bg-white">
      <Layout />
      <div className="py-20 px-5 space-y-10">
        <div className="space-y-4">
          <span className="flex flex-col">
            <h1 className="font-semibold text-2xl">Dashboard Peminjaman</h1>
            <p className="text-muted-foreground text-sm">
              Selamat datang, {user.name}
            </p>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center gap-5">
                <span className="w-12 h-12 bg-secondary text-primary flex items-center justify-center rounded-xl">
                  <Wallet />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Total Pinjaman
                  </p>
                  <h1 className="text-xl font-semibold">
                    {formatRupiah(total)}
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-5">
                <span className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-xl">
                  <TrendingUp />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Pinjaman Aktif
                  </p>
                  <h1 className="text-xl font-semibold">
                    {loan.filter((l) => l.status === "superapproved").length}
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-5">
                <span className="w-12 h-12 bg-amber-100 text-amber-600 flex items-center justify-center rounded-xl">
                  <Clock />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Menunggu Persetujuan
                  </p>
                  <h1 className="text-xl font-semibold">
                    {
                      loan.filter(
                        (l) =>
                          l.status === "pending" || l.status === "approved",
                      ).length
                    }
                  </h1>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-medium">Status Peminjaman</h1>
          <div className="grid grid-cols-3 gap-4">
            {loan.map((l) => (
              <Card key={l.id}>
                <CardHeader>
                  <CardTitle>{l.loan_code}</CardTitle>
                  <CardDescription>{l.purpose}</CardDescription>
                  <CardAction>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        l.status === "pending"
                          ? "bg-amber-100 border border-amber-200 text-amber-600"
                          : l.status === "approved"
                            ? "bg-amber-100 border border-amber-200 text-amber-600"
                            : l.status === "superapproved"
                              ? "bg-green-100 border border-green-200 text-green-600"
                              : "bg-destructive"
                      }`}
                    >
                      {l.status === "pending"
                        ? "Menunggu"
                        : l.status === "approved"
                          ? "Menunggu"
                          : l.status === "superapproved"
                            ? "Pinjaman Berhasil"
                            : "Ditolak"}
                    </span>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 grid-rows-2 gap-4">
                    <span>
                      <p className="text-muted-foreground text-xs">
                        Jumlah Pinjaman
                      </p>
                      <h1 className="font-medium">
                        Rp {formatRupiah(l.amount)}
                      </h1>
                    </span>
                    <span>
                      <p className="text-muted-foreground text-xs">
                        Tanggal Peminjaman
                      </p>
                      <h1 className="font-medium">{l.request_date}</h1>
                    </span>
                    <span>
                      <p className="text-muted-foreground text-xs">Tenor</p>
                      <h1 className="font-medium">{l.tenor} bulan</h1>
                    </span>
                    {l.installments?.[0] && (
                      <span>
                        <p className="text-muted-foreground text-xs">
                          Cicilan/bulan
                        </p>
                        <h1 className="font-medium">
                          Rp {formatRupiah(l.installments[0].amount)}
                        </h1>
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-medium">Cicilan</h1>
          <div className="flex flex-col gap-4">
            {loan
              .filter((l) => l.status === "superapproved")
              .map((l) => (
                <Card key={l}>
                  <CardContent className="flex items-center justify-between">
                    <span>
                      <h1 className="font-medium">{l.loan_code}</h1>
                      <p className="text-muted-foreground text-xs">
                        {l.purpose}
                      </p>
                    </span>
                    <span>
                      <h1 className="font-medium">Rp {formatRupiah(l.installments[0].amount)}</h1>
                    </span>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
