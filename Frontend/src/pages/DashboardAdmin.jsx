import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheck, Clock, Eye, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import DialogDetailLoanAdmin from "./DialogDetailLoanAdmin";

export default function DashboardAdmin() {
  const [loan, setLoan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchLoan = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/loans");
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

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  }

  const filteredData = loan.filter((l) => {
    if (filterStatus === "all") return true;
    return l.status === filterStatus;
  });

  return (
    <div className="w-full h-screen bg-white ">
      <Layout />
      <div className="py-20 px-5 space-y-8">
        <div className="space-y-5">
          <span className="flex flex-col">
            <h1 className="font-semibold text-2xl">Dashboard Admin</h1>
            <p className="text-muted-foreground text-sm">
              Kelola pengajuan peminjaman dana UMKM
            </p>
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center gap-5">
                <span className="w-12 h-12 bg-amber-100 text-amber-600 flex items-center justify-center rounded-xl">
                  <Clock />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Menunggu Review
                  </p>
                  <h1 className="text-xl font-semibold">
                    {loan.filter((l) => l.status === "pending").length}
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-5">
                <span className="w-12 h-12 bg-secondary text-primary flex items-center justify-center rounded-xl">
                  <CircleCheck />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">Disetujui</p>
                  <h1 className="text-xl font-semibold">
                    {loan.filter((l) => l.status === "approved").length}
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-5">
                <span className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-xl">
                  <CircleCheck />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Peminjaman Berhasil
                  </p>
                  <h1 className="text-xl font-semibold">
                    {loan.filter((l) => l.status === "superapproved").length}
                  </h1>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-5">
                <span className="w-12 h-12 bg-secondary text-primary flex items-center justify-center rounded-xl">
                  <UserRound />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">
                    Total Pinjaman
                  </p>
                  <h1 className="text-xl font-semibold">{loan.length}</h1>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold">Daftar Pinjaman</h1>
            <Select
              defaultValue="all"
              onValueChange={(value) => setFilterStatus(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="approved">Disetujui</SelectItem>
                  <SelectItem value="superapproved">
                    Peminjaman Berhasil
                  </SelectItem>
                  <SelectItem value="reject">Ditolak</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            {filteredData.map((l) => (
              <Card key={l.id}>
                <CardContent className="grid grid-cols-6 relative items-center">
                  <h1 className="font-medium">{l.loan_code}</h1>
                  <span>
                    <p className="font-medium">{l.business_name}</p>
                    <p className="text-xs text-muted-foreground">{l.name}</p>
                  </span>
                  <p>Rp {formatRupiah(l.amount)}</p>
                  <p>{l.tenor} bulan</p>
                  <p>{l.telp}</p>
                  <span className="flex items-center justify-between">
                    <p
                      className={`px-3 py-1 inline-flex rounded-xl ${l.status === "pending" ? "bg-amber-100 border border-amber-200 text-amber-600" : l.status === "approved" ? "bg-blue-100 border border-blue-200 text-blue-600" : l.status === "superapproved" ? "bg-green-100 border border-green-200 text-green-600" : "bg-red-100 border border-red-200 text-destructive"}`}
                    >
                      {l.status === "pending"
                        ? "Menunggu"
                        : l.status === "approved"
                          ? "Disetujui"
                          : l.status === "superapproved"
                            ? "Pinjaman Berhasil"
                            : "Ditolak"}
                    </p>
                    <DialogDetailLoanAdmin loan={l} refreshData={fetchLoan}/>
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
