import React, { useState, useEffect } from "react";
import { getPatientHistory } from "../api/patient";
import { format } from "date-fns";
import { Table, Spin } from "antd";
import { BarChartOutlined, LogoutOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const PatientDashboard = () => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getPatientHistory(pagination);
        setMedicalRecords(data.records);
        setTotalRecords(data.total);
      } catch (err) {
        console.error("Failed to fetch medical history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [pagination]);

  const formatDate = (date) => format(new Date(date), "dd MMM yyyy");

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/login";
  };

  const columns = [
    {
      title: "Allergies",
      dataIndex: "allergies",
      key: "allergies",
    },
    {
      title: "Prescription",
      dataIndex: "prescription",
      key: "prescription",
    },
    {
      title: "Lab Orders",
      dataIndex: "labOrders",
      key: "labOrders",
    },
    {
      title: "Lab Results",
      dataIndex: "labResults",
      key: "labResults",
    },
    {
      title: "File",
      dataIndex: "filePath",
      key: "filePath",
      render: (filePath) => {
        if (!filePath) return "No File";
        return (
          <a href={filePath} target="_blank" rel="noopener noreferrer" download>
            View File
          </a>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="bg-blue-800 text-white w-64 p-4 flex flex-col justify-between h-screen">
        <div>
          <h2 className="text-xl font-bold">Patient's Dashboard</h2>
          <ul className="space-y-4 mt-6">
            <li className="flex items-center">
              <BarChartOutlined className="mr-3" />
              Dashboard
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-white hover:underline"
        >
          <LogoutOutlined className="text-lg" />
          <span>Logout</span>
        </button>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4">Medical Records</h3>
          {loading ? (
            <Spin />
          ) : medicalRecords.length === 0 ? (
            <p>No medical records available</p>
          ) : (
            <div>
              <Table
                columns={columns}
                dataSource={medicalRecords}
                pagination={{
                  current: pagination.current,
                  pageSize: pagination.pageSize,
                  total: totalRecords,
                  showTotal: (total) => `Total ${total} records`,
                }}
                onChange={handleTableChange}
                rowKey="id"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
