import SideBar from "@/components/sidebar";
import TopNav from "@/components/topnav";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-800">
        <SideBar />
      </div>
      <main className="md:pl-72 h-full bg-blue-800">
        <TopNav />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
