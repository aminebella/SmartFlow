import TopNavbar from "@/components/layout/TopNavbar.js";
export default function ProjectLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar />
      <main>{children}</main>
    </div>
  );
}