import React, { useState } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    parent_name: '',
    phone: '',
    fees: '',
    class_name: '',
    subjects: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/students/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
     
      if (response.ok) {
        alert('Student added successfully!');
        setFormData({
          name: '',
          parent_name: '',
          phone: '',
          fees: '',
          class_name: '',
          subjects: ''
        });
      }
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Error adding student');
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
      <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
      <Form.Root onSubmit={handleSubmit} className="space-y-4">
        <Form.Field name="name">
          <div className="space-y-2">
            <Label.Root htmlFor="name" className="text-sm font-medium">
              Student Name
            </Label.Root>
            <Form.Control asChild>
              <input
                id="name"
                name="name"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="parent_name">
          <div className="space-y-2">
            <Label.Root htmlFor="parent_name" className="text-sm font-medium">
              Parent's Name
            </Label.Root>
            <Form.Control asChild>
              <input
                id="parent_name"
                name="parent_name"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.parent_name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="phone">
          <div className="space-y-2">
            <Label.Root htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label.Root>
            <Form.Control asChild>
              <input
                id="phone"
                name="phone"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="fees">
          <div className="space-y-2">
            <Label.Root htmlFor="fees" className="text-sm font-medium">
              Monthly Fees
            </Label.Root>
            <Form.Control asChild>
              <input
                id="fees"
                name="fees"
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.fees}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="class_name">
          <div className="space-y-2">
            <Label.Root htmlFor="class_name" className="text-sm font-medium">
              Class
            </Label.Root>
            <Form.Control asChild>
              <input
                id="class_name"
                name="class_name"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.class_name}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="subjects">
          <div className="space-y-2">
            <Label.Root htmlFor="subjects" className="text-sm font-medium">
              Subjects
            </Label.Root>
            <Form.Control asChild>
              <input
                id="subjects"
                name="subjects"
                className="w-full px-3 py-2 border rounded-md"
                value={formData.subjects}
                onChange={handleChange}
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
            Add Student
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default AddStudent;
