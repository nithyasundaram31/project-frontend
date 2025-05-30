import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} />
      <div className="flex flex-1">
        <Sidebar isOpen={isOpen} />
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;