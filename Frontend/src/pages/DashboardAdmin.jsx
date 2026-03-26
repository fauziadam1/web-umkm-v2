import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CircleCheck, Clock, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardAdmin() {
  const [loan, setLoan] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="w-full h-screen bg-white ">
      <Layout />
      <div className="py-20 px-5">
        <div className="space-y-5">
          <span className="flex flex-col">
            <h1 className="font-semibold text-2xl">Dashboard Admin</h1>
            <p className="text-muted-foreground text-sm">
              Kelola pengajuan peminjaman dana UMKM
            </p>
          </span>
          <div className="grid grid-cols-4 gap-4">
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
                <span className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-xl">
                  <CircleCheck />
                </span>
                <div>
                  <p className="text-muted-foreground text-xs">Disetujui</p>
                  <h1 className="text-xl font-semibold">
                    {loan.filter((l) => l.status === "aprroved").length}
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
      </div>
    </div>
  );
}
