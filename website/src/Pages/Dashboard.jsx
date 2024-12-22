import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    fees: '',
    paymentStatus: '',
    lastPayment: '',
    paymentMode: '',
    month: ''
  });

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
      <span className="px-8 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
        Paid
      </span>
    );
  };

  const handleFilterChange = (e, field) => {
    setFilters({
      ...filters,
      [field]: e.target.value
    });
  };

  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      student.fees.toString().includes(filters.fees) &&
      (filters.paymentStatus === '' || 
        (filters.paymentStatus === 'Paid' && getPaymentStatus(student).props.children === 'Paid') ||
        (filters.paymentStatus === 'Not Received' && getPaymentStatus(student).props.children === 'Not Received') ||
        (filters.paymentStatus === 'Overdue' && getPaymentStatus(student).props.children === 'Overdue')
      ) &&
      (filters.lastPayment === '' || (student.last_payment_date || '').includes(filters.lastPayment)) &&
      (filters.paymentMode === '' || (student.payment_mode || '').toLowerCase().includes(filters.paymentMode.toLowerCase())) &&
      (filters.month === '' || (student.month || '').toLowerCase().includes(filters.month.toLowerCase()))
    );
  });

  return (
    <>
      <div className="w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>
        <div className="grid grid-cols-6 gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by name"
            className="p-2 border rounded"
            value={filters.name}
            onChange={(e) => handleFilterChange(e, 'name')}
          />
          <input
            type="text"
            placeholder="Filter by fees"
            className="p-2 border rounded"
            value={filters.fees}
            onChange={(e) => handleFilterChange(e, 'fees')}
          />
          <select
            className="p-2 border rounded"
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange(e, 'paymentStatus')}
          >
            <option value="">All Payment Status</option>
            <option value="Paid">Paid</option>
            <option value="Not Received">Not Received</option>
            <option value="Overdue">Overdue</option>
          </select>
          <input
            type="text"
            placeholder="Filter by last payment"
            className="p-2 border rounded"
            value={filters.lastPayment}
            onChange={(e) => handleFilterChange(e, 'lastPayment')}
          />
          <input
            type="text"
            placeholder="Filter by payment mode"
            className="p-2 border rounded"
            value={filters.paymentMode}
            onChange={(e) => handleFilterChange(e, 'paymentMode')}
          />
          <input
            type="text"
            placeholder="Filter by month"
            className="p-2 border rounded"
            value={filters.month}
            onChange={(e) => handleFilterChange(e, 'month')}
          />
        </div>
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

              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-50 font-semibold">
                  <td className="p-4">{student.name}</td>
                  <td className="p-4">₹{student.fees}</td>
                  <td className="p-4 pl-7">{getPaymentStatus(student)}</td>
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