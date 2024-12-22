import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import AddStudent from './Pages/AddStudent';
import UpdateStudent from './Pages/UpdateStudent';
import AddPayment from './Pages/AddPayment';
import Navbar from './Components/Navbar';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-student" element={<AddStudent />} />
            <Route path="/update-student/:id" element={<UpdateStudent />} />
            <Route path="/add-payment" element={<AddPayment />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
