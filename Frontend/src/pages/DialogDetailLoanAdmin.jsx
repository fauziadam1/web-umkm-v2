import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  CircleCheck,
  CircleX,
  Download,
  Eye,
  FileText,
} from "lucide-react";

export default function DialogDetailLoanAdmin({ loan }) {
  const [document, setDocument] = useState([]);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  function formatRupiah(value) {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
  }

  const fethDocument = async () => {
    setDialogLoading(true);
    try {
      const res = await api.get(`/api/document/${loan.id}`);
      setDialogLoading(false);
      setDocument(res.data.data);
    } catch (errors) {
      toast.error(errors.data.response.message);
      setDialogLoading(false);
    }
  };

  const handleApproved = async () => {
    setApprovedLoading(true);
    try {
      await api.put(`/api/admin/loan/${loan.id}`, {
        status: "approved",
      });
      setApprovedLoading(false);
    } catch (errors) {
      toast.error(errors.data.response.message);
      setApprovedLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => open && fethDocument()}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Lihat <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl">
        <DialogHeader>
          <DialogTitle>Detail Pinjaman</DialogTitle>
          <DialogDescription>{loan.loan_code}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 space-y-4">
          <span>
            <h1 className="font-medium">Nama Depan</h1>
            <p className="text-sm text-muted-foreground">{loan.firstname}</p>
          </span>
          <span>
            <h1 className="font-medium">Nama Belakang</h1>
            <p className="text-sm text-muted-foreground">{loan.lastname}</p>
          </span>
          <span>
            <h1 className="font-medium">No Telepon</h1>
            <p className="text-sm text-muted-foreground">{loan.telp}</p>
          </span>
          <span>
            <h1 className="font-medium">Alamat Email</h1>
            <p className="text-sm text-muted-foreground">{loan.email}</p>
          </span>
          <span>
            <h1 className="font-medium">Nama Usaha, PT/CV</h1>
            <p className="text-sm text-muted-foreground">
              {loan.business_name}
            </p>
          </span>
          <span>
            <h1 className="font-medium">Alamat</h1>
            <p className="text-sm text-muted-foreground">{loan.address}</p>
          </span>
          <span>
            <h1 className="font-medium">Tujuan</h1>
            <p className="text-sm text-muted-foreground">{loan.purpose}</p>
          </span>
          <span>
            <h1 className="font-medium">Jumlah Pinjaman</h1>
            <p className="text-sm text-muted-foreground">
              Rp {formatRupiah(loan.amount)}
            </p>
          </span>
          <span>
            <h1 className="font-medium">Tenor</h1>
            <p className="text-sm text-muted-foreground">{loan.tenor}</p>
          </span>
        </div>
        <div>
          <h1 className="font-medium">Dokumen Perusahaan</h1>

          {dialogLoading ? (
            <div className="w=full flex items-center justify-center py-10">
              <Spinner />
            </div>
          ) : document?.length ? (
            <div className="grid grid-cols-3 gap-3 mt-2">
              {document.map((d) => {
                const fileName = d.path?.split("/").pop();

                return (
                  <div
                    key={d.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <FileText className="size-6 text-muted-foreground" />
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <p className="text-sm font-medium">
                        {d.type === "ktp"
                          ? "KTP"
                          : d.type === "npwp"
                            ? "NPWP"
                            : d.type === "business_photo"
                              ? "Foto Perusahaan"
                              : d.type}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {fileName}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        window.open(
                          `http://localhost:8000/api/document/download/${d.id}`,
                          "_blank",
                        );
                      }}
                    >
                      <Download className="size-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada dokumen</p>
          )}
        </div>
        <span className="inline-flex items-center gap-2">
          <Calendar className="size-4" />
          {loan.request_date}
        </span>
        {loan.status === "pending" && (
          <DialogFooter>
            <Button variant="destructive">
              Tolak <CircleX />
            </Button>
            <Button onClick={() => handleApproved()} disabled={approvedLoading}>
              Setujui {approvedLoading ? <Spinner /> : <CircleCheck />}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
