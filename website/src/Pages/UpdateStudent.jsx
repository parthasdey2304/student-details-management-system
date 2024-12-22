import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';

const UpdateStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    parent_name: '',
    phone: '',
    fees: '',
    class_name: '',
    subjects: ''
  });

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/students/${id}`);
      const data = await response.json();
      setFormData({
        name: data.name,
        parent_name: data.parent_name,
        phone: data.phone,
        fees: data.fees,
        class_name: data.class_name,
        subjects: data.subjects
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
      alert('Error fetching student data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
     
      if (response.ok) {
        alert('Student updated successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Error updating student');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Update Student Details</h2>
      <Form.Root onSubmit={handleSubmit} className="space-y-6">
        <Form.Field name="name">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Student Name
            </Label.Root>
            <Form.Control asChild>
              <input
                className="w-full px-3 py-2 border rounded-md"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="parent_name">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Parent's Name
            </Label.Root>
            <Form.Control asChild>
              <input
                className="w-full px-3 py-2 border rounded-md"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="phone">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Phone Number
            </Label.Root>
            <Form.Control asChild>
              <input
                className="w-full px-3 py-2 border rounded-md"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="fees">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Monthly Fees
            </Label.Root>
            <Form.Control asChild>
              <input
                className="w-full px-3 py-2 border rounded-md"
                type="number"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="class_name">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Class
            </Label.Root>
            <Form.Control asChild>
              <input
                className="w-full px-3 py-2 border rounded-md"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="subjects">
          <div className="space-y-2">
            <Label.Root className="text-sm font-medium">
              Subjects
            </Label.Root>
            <Form.Control asChild>
              <input
                className="w-full px-3 py-2 border rounded-md"
                name="subjects"
                value={formData.subjects}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <div className="flex space-x-4">
          <Form.Submit asChild>
            <button
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Student
            </button>
          </Form.Submit>
          <button
            type="button"
            className="flex-1 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
        </div>
      </Form.Root>
    </div>
  );
};

export default UpdateStudent;
