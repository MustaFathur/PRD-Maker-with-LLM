import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../Layout/Sidebar';
import Navbar from '../Layout/Navbar';
import api from '../../utils/api';

const PRDDetail = () => {
  const { id } = useParams();
  const [prdData, setPrdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPRD = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/prd/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch PRD data');
        }

        const data = await response.json();
        setPrdData(data);
      } catch (error) {
        console.error('Error fetching PRD data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPRD();
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await api.get(`/prd/download/${id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PRD_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PRD:', error);
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!prdData) return <div>No PRD data found</div>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-8 bg-gray-50 min-h-screen flex flex-col items-center">
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg relative">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              PRD Details
            </h1>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">PRD Identity</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <tbody>
                    <tr>
                      <td className="font-bold">Document Version</td>
                      <td>{prdData.document_version}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Product Name</td>
                      <td>{prdData.product_name}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Document Owner</td>
                      <td>{prdData.document_owner}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Developer</td>
                      <td>{prdData.developer}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Stakeholder</td>
                      <td>{prdData.stakeholder}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Project Overview</td>
                      <td>{prdData.project_overview}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">Start Date</td>
                      <td>{new Date(prdData.start_date).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <td className="font-bold">End Date</td>
                      <td>{new Date(prdData.end_date).toLocaleDateString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">DARCI Roles</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Personil</th>
                      <th>Guidelines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.darciRoles.map((role, index) => (
                      <tr key={index}>
                        <td>{role.role}</td>
                        <td>{role.personil_name || 'N/A'}</td>
                        <td>{role.guidelines}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Project Timeline</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Time Period</th>
                      <th>Activity</th>
                      <th>PIC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.timelines.map((timeline, index) => (
                      <tr key={index}>
                        <td>{timeline.time_period}</td>
                        <td>{timeline.activity}</td>
                        <td>{timeline.pic}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Success Metrics</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Definition</th>
                      <th>Current</th>
                      <th>Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.successMetrics.map((metric, index) => (
                      <tr key={index}>
                        <td>{metric.name}</td>
                        <td>{metric.definition}</td>
                        <td>{metric.current}</td>
                        <td>{metric.target}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">User Stories</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>User Story</th>
                      <th>Acceptance Criteria</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.userStories.map((story, index) => (
                      <tr key={index}>
                        <td>{story.title}</td>
                        <td>{story.user_story}</td>
                        <td>{story.acceptance_criteria}</td>
                        <td>{story.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end">
              <Link to={`/prd/${prdData.prd_id}/edit`} className="btn btn-secondary">Edit PRD</Link>
              <button className="btn btn-primary ml-2" onClick={handleDownload}>Download PRD</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDetail;