import Sidebar from "../../components/dashboard/Sidebar";
import TopNav from "../../components/dashboard/TopNav";
import SystemOverview from "../../components/dashboard/SystemOverview";
import ActivityLog from "../../components/dashboard/ActivityLog";
import ActiveProjects from "../../components/dashboard/ActiveProjects";
import ResourceUsage from "../../components/dashboard/ResourceUsage";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen bg-[#050810] text-white p-4 font-sans overflow-hidden">
            {/* Glassmorphic App Container */}
            <div className="flex w-full h-full bg-[#0d1424]/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

                <Sidebar />

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 p-6 overflow-y-auto">
                    <TopNav />

                    {/* Bento Box Grid Layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                        <SystemOverview />
                        <ActivityLog />
                        <ActiveProjects />
                        <ResourceUsage />
                    </div>
                </div>

            </div>
        </div>
    );
}