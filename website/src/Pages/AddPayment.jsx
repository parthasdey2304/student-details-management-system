import React, { useState, useEffect } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';

const AddPayment = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    payment_mode: 'online',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8000/dashboard/');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/payments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseInt(formData.amount),
          student_id: parseInt(formData.student_id)
        }),
      });
     
      if (response.ok) {
        alert('Payment recorded successfully!');
        setFormData({
          ...formData,
          student_id: '',
          amount: ''
        });
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment');
    }
  };

  const handleStudentChange = (value) => {
    const selectedStudent = students.find(s => s.id === parseInt(value));
    setFormData({
      ...formData,
      student_id: value,
      amount: selectedStudent ? selectedStudent.fees.toString() : ''
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Record Payment</h2>
      <Form.Root onSubmit={handleSubmit} className="space-y-6">
        <Form.Field name="student">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Select Student
            </Label.Root>
            <Select.Root onValueChange={handleStudentChange} value={formData.student_id}>
              <Select.Trigger className="w-full px-3 py-2 border rounded-md flex justify-between items-center">
                <Select.Value placeholder="Select a student" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg">
                  <Select.Viewport>
                    {students.map((student) => (
                      <Select.Item
                        key={student.id}
                        value={student.id.toString()}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Select.ItemText>{student.name} - Class {student.class_name}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </Form.Field>

        <Form.Field name="amount">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Amount
            </Label.Root>
            <Form.Control asChild>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="payment_mode">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Payment Mode
            </Label.Root>
            <Select.Root onValueChange={(value) => setFormData({ ...formData, payment_mode: value })} value={formData.payment_mode}>
              <Select.Trigger className="w-full px-3 py-2 border rounded-md flex justify-between items-center">
                <Select.Value />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg">
                  <Select.Viewport>
                    <Select.Item value="online" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <Select.ItemText>Online</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="cash" className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <Select.ItemText>Cash</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </Form.Field>

        <Form.Field name="month">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Month
            </Label.Root>
            <Select.Root onValueChange={(value) => setFormData({ ...formData, month: value })} value={formData.month}>
              <Select.Trigger className="w-full px-3 py-2 border rounded-md flex justify-between items-center">
                <Select.Value />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg">
                  <Select.Viewport>
                    {months.map((month) => (
                      <Select.Item
                        key={month}
                        value={month}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <Select.ItemText>{month}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </Form.Field>

        <Form.Field name="year">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Year
            </Label.Root>
            <Form.Control asChild>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Submit asChild>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Record Payment
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default AddPayment;
