// ← loads project, checks project role


// This layout fetches the project and makes the projectRole available
// Manager sees everything; member sees read-only backlog/board
// The pages inside check: if (projectRole !== 'MANAGER') show read-only view
import TopNavbar from "@/components/layout/TopNavbar.js";
export default function ProjectLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar />
      <main>{children}</main>
    </div>
  );
}