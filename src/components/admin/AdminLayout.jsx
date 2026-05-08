import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FiGrid, FiBriefcase, FiAward, FiEye, FiLogOut, FiHome, FiUser, FiBook, FiStar, FiFolder, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import '../../styles/components/admin-layout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard' },
    { path: '/admin/profile', icon: <FiUser />, label: 'Profile (Hero & About)' },
    { path: '/admin/experience', icon: <FiBriefcase />, label: 'Experience' },
    { path: '/admin/education', icon: <FiBook />, label: 'Education' },
    { path: '/admin/skills', icon: <FiStar />, label: 'Skills' },
    { path: '/admin/projects', icon: <FiFolder />, label: 'Projects' },
    { path: '/admin/certificates', icon: <FiAward />, label: 'Certificates' },
    { path: '/admin/honors', icon: <FiEye />, label: 'Honors' },
  ];

  return (
    <div className="admin-container">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={closeSidebar}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="nav-divider"></div>
          
          <Link to="/" className="nav-item">
            <FiHome />
            <span>View Site</span>
          </Link>
          
          <button onClick={handleLogout} className="nav-item logout-btn">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <header className="content-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <h1>{navItems.find(i => i.path === location.pathname)?.label || 'Admin'}</h1>
        </header>
        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
