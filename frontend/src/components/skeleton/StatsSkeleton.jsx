// components/StatsSkeleton.jsx
export default function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
}