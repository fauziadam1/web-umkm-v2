import { Layout } from "@/components/Layout";
import { ProfileInfo } from "@/components/ProfileInfo";

export default function Profile() {
  return (
    <div className="w-full h-screen bg-white">
      <Layout />
      <div className="pt-20 w-full max-w-xl mx-auto">
        <div>
          <ProfileInfo />
        </div>
      </div>
    </div>
  );
}
