import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Navbar from "../Layout/Navbar";
import api from "../../utils/api";

const PRDDetail = () => {
  const { id } = useParams();
  const [prdData, setPrdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPRD = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/prd/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch PRD data");
        }

        const data = await response.json();
        setPrdData(data);
      } catch (error) {
        console.error("Error fetching PRD data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPRD();
  }, [id]);

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/prd/download/${id}`);
      const { url } = response.data;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading PRD:", error);
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
            <Link
              to="/prd-list"
              className="text-xl absolute top-4 left-4 btn btn-ghost"
            >
              ←
            </Link>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              PRD Details
            </h1>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">PRD Identity</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs border border-2">
                  <tbody>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">
                        Document Version
                      </td>
                      <td className="border border-2">
                        {prdData.document_version}
                      </td>
                    </tr>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">
                        Product Name
                      </td>
                      <td className="border border-2">
                        {prdData.product_name}
                      </td>
                    </tr>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">
                        Document Owner
                      </td>
                      <td className="border border-2">
                        {prdData.document_owner.join(", ")}
                      </td>
                    </tr>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">Developer</td>
                      <td className="border border-2">
                        {prdData.developer.join(", ")}
                      </td>
                    </tr>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">Stakeholder</td>
                      <td className="border border-2">
                        {prdData.stakeholder.join(", ")}
                      </td>
                    </tr>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">
                        Project Overview
                      </td>
                      <td className="border border-2">
                        {prdData.project_overview}
                      </td>
                    </tr>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">Start Date</td>
                      <td className="border border-2">
                        {new Date(prdData.start_date).toLocaleDateString()}
                      </td>
                    </tr>
                    <tr className="border border-2">
                      <td className="font-bold border border-2">End Date</td>
                      <td className="border border-2">
                        {new Date(prdData.end_date).toLocaleDateString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Problem Statements */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Problem Statements</h2>
              {prdData.problemStatements.map((statement, index) => (
                <p
                  key={index}
                  className="text-sm mb-2 border border-2 p-2 rounded-md"
                >
                  {statement.content}
                </p>
              ))}
            </div>

            {/* Objectives */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Objectives</h2>
              {prdData.objectives.map((objective, index) => (
                <p
                  key={index}
                  className="text-sm mb-2 border border-2 p-2 rounded-md"
                >
                  {objective.content}
                </p>
              ))}
            </div>

            {/* DARCI Roles */}
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">DARCI Roles</h2>
              <div className="overflow-x-auto">
                <table className="table table-xs border border-2">
                  <thead>
                    <tr className="border border-2">
                      <th className="border border-2">Role</th>
                      <th className="border border-2">Personil</th>
                      <th className="border border-2">Guidelines</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prdData.darciRoles.map((role, index) => (
                      <tr key={index} className="border border-2">
                        <td className="border border-2">{role.role}</td>
                        <td className="border border-2">
                          {role.personil_name || "N/A"}
                        </td>
                        <td className="border border-2">{role.guidelines}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

           
            <div className="flex justify-end">
              <Link
                to={`/prd/${prdData.prd_id}/edit`}
                className="btn btn-active"
              >
                Edit PRD
              </Link>
              <button className="btn btn-neutral ml-2" onClick={handleDownload}>
                Download PRD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PRDDetail;
