import SideBar from "@/components/navigation/sidebar";
import TopNav from "@/components/navigation/topnav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" relative min-h-screen bg-blue-200">
      <TopNav />
      {children}
    </div>
  );
};

export default DashboardLayout;
