import React, { useState, useEffect } from 'react';
import Toast from '../Components/Toast';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    fees: '',
    paymentStatus: '',
  });
  const [toast, setToast] = useState({ show: false, message: '' });

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
      setToast({ show: true, message: 'Error fetching student data' });
    }
  };

  const getPaymentStatus = (student) => {
    if (!student.last_payment_date) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
          Not Received
        </span>
      );
    }

    const lastPayment = new Date(student.last_payment_date);
    const currentDate = new Date();
    const monthDiff = currentDate.getMonth() - lastPayment.getMonth() +
      (12 * (currentDate.getFullYear() - lastPayment.getFullYear()));

    if (monthDiff > 1) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white">
          Overdue
        </span>
      );
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
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

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`http://localhost:5000/students/${studentId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setToast({ show: true, message: 'Student deleted successfully' });
          fetchDashboardData();
        } else {
          setToast({ show: true, message: 'Failed to delete student' });
        }
      } catch (error) {
        setToast({ show: true, message: 'Error deleting student' });
        console.error('Error:', error);
      }
    }
  };

  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      student.fees.toString().includes(filters.fees) &&
      (filters.paymentStatus === '' || 
        (filters.paymentStatus === 'Paid' && getPaymentStatus(student).props.children === 'Paid') ||
        (filters.paymentStatus === 'Not Received' && getPaymentStatus(student).props.children === 'Not Received') ||
        (filters.paymentStatus === 'Overdue' && getPaymentStatus(student).props.children === 'Overdue')
      )
    );
  });

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-lg">
      {toast.show && <Toast message={toast.message} />}
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Student Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.name}
          onChange={(e) => handleFilterChange(e, 'name')}
        />
        <input
          type="text"
          placeholder="Filter by fees"
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.fees}
          onChange={(e) => handleFilterChange(e, 'fees')}
        />
        <select
          className="p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={filters.paymentStatus}
          onChange={(e) => handleFilterChange(e, 'paymentStatus')}
        >
          <option value="">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Not Received">Not Received</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <div className="flex items-center space-x-2">
                {getPaymentStatus(student)}
                <button
                  onClick={() => handleDelete(student.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fees:</span>
                <span className="font-medium">₹{student.fees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Payment:</span>
                <span>{student.last_payment_date || 'No payments'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Mode:</span>
                <span>{student.payment_mode || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span>{student.class_name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.class_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{student.fees}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getPaymentStatus(student)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.last_payment_date || 'No payments'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{student.payment_mode || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
