import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';

const Dashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const getPaymentStatus = (student) => {
    if (!student.last_payment_date) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
          Not Received
        </span>
      );
    }

    const lastPayment = new Date(student.last_payment_date);
    const currentDate = new Date();
    const monthDiff =
      currentDate.getMonth() -
      lastPayment.getMonth() +
      12 * (currentDate.getFullYear() - lastPayment.getFullYear());

    if (monthDiff > 1) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
          Overdue
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
        Paid
      </span>
    );
  };

  return (
    <>
      <div className="w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
        <div className="w-full overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 text-left font-medium">Name</th>
                <th className="p-4 text-left font-medium">Fees</th>
                <th className="p-4 text-left font-medium">Payment Status</th>
                <th className="p-4 text-left font-medium">Last Payment</th>
                <th className="p-4 text-left font-medium">Payment Mode</th>
                <th className="p-4 text-left font-medium">Month</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">₹{student.fees}</td>
                  <td className="p-4">{getPaymentStatus(student)}</td>
                  <td className="p-4">{student.last_payment_date || 'No payments'}</td>
                  <td className="p-4">{student.payment_mode || '-'}</td>
                  <td className="p-4">{student.month || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
