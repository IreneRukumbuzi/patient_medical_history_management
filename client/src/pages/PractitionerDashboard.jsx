import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Table, Spin } from "antd";
import Select from "react-select";
import { format } from "date-fns";
import { BarChartOutlined, LogoutOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getDashboardOverview,
  getAllMedicalRecords,
  saveMedicalRecord,
  getPatients,
} from "../api/practitioner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PractitionerDashboard = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userOptions, setUserOptions] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [file, setFile] = useState(null);
  const [allergies, setAllergies] = useState("");
  const [prescriptions, setPrescriptions] = useState("");
  const [labOrders, setLabOrders] = useState("");
  const [labResults, setLabResults] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const overviewResponse = await getDashboardOverview();
      setDashboardData(overviewResponse);

      const data = await getAllMedicalRecords(pagination);
      setMedicalRecords(data.records);
      setTotalRecords(data.total);

      const patientsData = await getPatients();
      setUserOptions(
        patientsData.map((patient) => ({
          value: patient.id,
          label: `${patient.username} (${patient.id})`,
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    fetchData();
  }, [pagination, fetchData]);

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("allergies", JSON.stringify(allergies));
      formData.append("prescription", prescriptions);
      formData.append("labOrders", JSON.stringify(labOrders));
      formData.append("labResults", JSON.stringify(labResults));
      if (file) formData.append("file", file);

      setIsLoading(true);
      try {
        await saveMedicalRecord(selectedPatient.value, formData);
        setSelectedPatient(null);
        setAllergies([]);
        setPrescriptions("");
        setLabOrders([]);
        setLabResults([]);
        setFile(null);
        handleCloseModal();
        fetchData();
      } catch (error) {
        alert("Error adding medical record");
      } finally {
        setIsLoading(false);
      }
    },
    [
      selectedPatient,
      allergies,
      prescriptions,
      labOrders,
      labResults,
      file,
      fetchData,
    ]
  );

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => setIsModalVisible(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/login";
  };

  const formatDate = (date) => format(new Date(date), "dd MMM yyyy");

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
      title: "User",
      dataIndex: "User",
      key: "username",
      render: (user) => user?.username,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => formatDate(createdAt),
    },
  ];

  const recordTypesBarData = {
    labels: ["Allergies", "Prescriptions", "Lab Results", "Lab Orders"],
    datasets: [
      {
        label: "Records by Type",
        data: dashboardData
          ? [
              dashboardData?.recordTypesCount?.allergies || 0,
              dashboardData?.recordTypesCount?.prescription || 0,
              dashboardData?.recordTypesCount?.labResults || 0,
              dashboardData?.recordTypesCount?.labOrders || 0,
            ]
          : [0, 0, 0, 0],
        backgroundColor: ["#FF5733", "#33C3FF", "#33FF57", "#FFC300"],
      },
    ],
  };

  const recordsPerMonthLineData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Records Per Month",
        data: dashboardData?.recordsPerMonth || Array(12).fill(0),
        borderColor: "#33C3FF",
        backgroundColor: "rgba(51, 195, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="bg-blue-800 text-white w-64 p-4 flex flex-col justify-between h-screen">
        <div>
          <h2 className="text-xl font-bold">Practitioner Dashboard</h2>
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
        <div className="mt-2 flex justify-end">
          <Button type="primary" onClick={handleOpenModal} className="mb-4">
            Add New Record
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="pt-2 pl-6 bg-white shadow rounded-md">
            <h3 className="text-lg font-semibold">Total Patients</h3>
            <p className="text-2xl font-bold text-blue-800">
              {loading ? <Spin /> : dashboardData?.totalPatients || 0}
            </p>
          </div>
          <div className="pt-2 pl-6 bg-white shadow rounded-md">
            <h3 className="text-lg font-semibold">Total Records</h3>
            <p className="text-2xl font-bold text-blue-800">
              {loading ? <Spin /> : dashboardData?.totalRecords || 0}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow rounded-md p-4">
            <h3 className="text-lg font-semibold">Record Types</h3>
            {loading ? <Spin /> : <Bar data={recordTypesBarData} />}
          </div>
          <div className="bg-white shadow rounded-md p-4">
            <h3 className="text-lg font-semibold">Records Per Month</h3>
            {loading ? <Spin /> : <Line data={recordsPerMonthLineData} />}
          </div>
        </div>

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

      <Modal
        title="Add New Record"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="patient"
            >
              Search and Select Patient
            </label>
            <Select
              id="patient"
              options={userOptions}
              value={selectedPatient}
              onChange={(selectedOption) => setSelectedPatient(selectedOption)}
              placeholder="Search and select a patient"
              isClearable
              isSearchable
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="allergies"
            >
              Allergies
            </label>
            <textarea
              id="allergies"
              placeholder="Enter allergies"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="prescriptions"
            >
              Prescriptions
            </label>
            <textarea
              id="prescriptions"
              placeholder="Enter prescriptions"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={prescriptions}
              onChange={(e) => setPrescriptions(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="labOrders"
            >
              Lab Orders
            </label>
            <textarea
              id="labOrders"
              placeholder="Enter lab orders"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={labOrders}
              onChange={(e) => setLabOrders(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="labResults"
            >
              Lab Results
            </label>
            <textarea
              id="labResults"
              placeholder="Enter lab results"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={labResults}
              onChange={(e) => setLabResults(e.target.value)}
            />
          </div>

          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              Upload File
            </label>
            <input
              type="file"
              id="file"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Record"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PractitionerDashboard;
