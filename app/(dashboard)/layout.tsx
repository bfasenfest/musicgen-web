import SideBar from "@/components/navigation/sidebar";
import TopNav from "@/components/navigation/topnav";
import { ModalProvider } from "@/components/modals/modal-provider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" relative min-h-screen bg-[D9D9D9]">
      <ModalProvider />

      <TopNav />
      {children}
    </div>
  );
};

export default DashboardLayout;
