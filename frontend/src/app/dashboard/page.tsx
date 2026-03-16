"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { useRouter } from "next/navigation";

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  department_name: string;
  created_at: string;
}

interface DashboardStats {
  total_complaints: number;
  pending_complaints: number;
  resolved_complaints: number;
  high_priority: number;
}

export default function DashboardPage() {
  const { user, loading, getToken } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      // Fetch dashboard stats
      const statsResponse = await fetch("http://localhost:8000/analytics/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent complaints
      const complaintsResponse = await fetch("http://localhost:8000/complaints?limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (complaintsResponse.ok) {
        const complaintsData = await complaintsResponse.json();
        setComplaints(complaintsData.complaints || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to GrievanceGrid Dashboard</h1>
          <p className="text-slate-400">Hello, {user.displayName || user.email}!</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900/70 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Total Complaints</h3>
              <p className="text-3xl font-bold">{stats.total_complaints}</p>
            </div>
            <div className="bg-slate-900/70 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Pending</h3>
              <p className="text-3xl font-bold">{stats.pending_complaints}</p>
            </div>
            <div className="bg-slate-900/70 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Resolved</h3>
              <p className="text-3xl font-bold">{stats.resolved_complaints}</p>
            </div>
            <div className="bg-slate-900/70 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-2">High Priority</h3>
              <p className="text-3xl font-bold">{stats.high_priority}</p>
            </div>
          </div>
        )}

        {/* Recent Complaints */}
        <div className="bg-slate-900/70 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>
          {complaints.length > 0 ? (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="border border-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{complaint.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      complaint.status === 'resolved' ? 'bg-green-900/50 text-green-300' :
                      complaint.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-blue-900/50 text-blue-300'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{complaint.description}</p>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{complaint.department_name}</span>
                    <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No complaints found.</p>
          )}
        </div>
      </div>
    </main>
  );
}