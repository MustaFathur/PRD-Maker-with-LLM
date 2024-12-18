import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import api from '../../utils/api';

const Dashboard = () => {
  const isAuthenticated = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/prd/dashboard', { withCredentials: true });

        if (response.status !== 200) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = response.data;
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboardData) return <div>Loading...</div>;

  return isAuthenticated ? (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-start justify-center p-4 mt-8">
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
            <h2 className="text-xl font-bold text-center mb-8">Welcome, {dashboardData.user.name} 😊</h2>
            <div className="flex justify-center stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <h2 className="stat-title">Personil Total</h2>
                <p className="stat-value">{dashboardData.personilTotal}</p>
              </div>
              <div className="stat">
                <h2 className="stat-title">PRD Made in Draft</h2>
                <p className="stat-value">{dashboardData.prdDraftTotal}</p>
              </div>
              <div className="stat">
                <h2 className="stat-title">PRD Total</h2>
                <p className="stat-value">{dashboardData.prdTotal}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default Dashboard;