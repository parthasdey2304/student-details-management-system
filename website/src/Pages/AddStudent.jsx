import React, { useState } from 'react';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    parent_name: '',
    phone: '',
    fees: '',
    class_name: '',
    subjects: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          subjects: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error adding student. Please check your connection.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-md p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Student</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'parent_name', 'phone', 'fees', 'class_name', 'subjects'].map((field) => (
          <div key={field} className="space-y-2">
            <label htmlFor={field} className="block font-medium">
              {field.replace('_', ' ').toUpperCase()}
            </label>
            <input
              type="text"
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Add Student
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
