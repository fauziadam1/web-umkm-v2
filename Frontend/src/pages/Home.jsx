import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { items } from "@/components/ItemSuggest";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="w-full h-screen bg-white">
      <Layout />
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-15">
          <span className="flex flex-col items-center gap-2">
            <Badge variant="secondary">
              <ShieldCheck />
              Terdaftar & Diawasi OJK
            </Badge>
            <h1 className="font-semibold text-6xl max-w-3xl text-center">
              Wujudkan Pertumbuhan <span className="text-primary">UMKM</span>{" "}
              Anda Bersama DanaKu
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl text-center">
              Platform pembiayaan digital yang cepat, mudah, dan terpercaya.
              Dapatkan pinjaman hingga Rp 5 Miliar untuk mengembangkan usaha
              Anda.
            </p>
            <Link to={'/loan'}>
              <Button>
                Ajukan Sekarang <ArrowRight />
              </Button>
            </Link>
          </span>
          <div className="grid grid-cols-3 gap-13">
            {items.map((i) => (
              <span className="flex flex-col items-center gap-5">
                <div className="w-15 h-15 rounded-2xl bg-secondary">
                  <span className="w-full h-full flex items-center justify-center">
                    {i.icon}
                  </span>
                </div>
                <span className="space-y-1 text-center">
                  <p className="text-sm text-gray-400">{i.title}</p>
                  <h1 className="font-semibold dark:text-white">
                    {i.description}
                  </h1>
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
