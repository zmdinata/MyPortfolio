import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  FiGrid,
  FiZap,
  FiBriefcase,
  FiAward,
  FiEye,
  FiLogOut,
  FiHome,
  FiUser,
  FiBook,
  FiStar,
  FiFolder,
  FiMenu,
  FiX,
  FiDatabase,
  FiExternalLink,
} from 'react-icons/fi';
import '../../styles/components/admin-layout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  useEffect(() => {
    // Quick probe for connection
    supabase
      .from('profile')
      .select('id')
      .limit(1)
      .then(({ error }) => {
        setDbConnected(!error);
      })
      .catch(() => setDbConnected(false));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const navSections = [
    {
      heading: 'Ringkasan & Aksi Cepat',
      items: [
        { path: '/admin/dashboard', icon: <FiGrid />, label: 'Dashboard & Hub' },
        { path: '/admin/quick-editor', icon: <FiZap />, label: 'Quick Editor (Live Preview)', badge: 'New' },
      ],
    },
    {
      heading: 'Konten Utama',
      items: [
        { path: '/admin/profile', icon: <FiUser />, label: 'Profile & Hero Bio' },
        { path: '/admin/projects', icon: <FiFolder />, label: 'Proyek Portofolio' },
      ],
    },
    {
      heading: 'Kredensial & Riwayat',
      items: [
        { path: '/admin/experience', icon: <FiBriefcase />, label: 'Pengalaman & Beasiswa' },
        { path: '/admin/education', icon: <FiBook />, label: 'Pendidikan & Prestasi' },
        { path: '/admin/skills', icon: <FiStar />, label: 'Keahlian (Skills)' },
        { path: '/admin/certificates', icon: <FiAward />, label: 'Sertifikasi' },
        { path: '/admin/honors', icon: <FiEye />, label: 'Honors & Penghargaan' },
      ],
    },
  ];

  // Find active label for the header
  let activeLabel = 'Admin Command Center';
  for (const sec of navSections) {
    const found = sec.items.find((i) => i.path === location.pathname);
    if (found) {
      activeLabel = found.label;
      break;
    }
  }

  return (
    <div className="admin-container">
      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-dot"></span>
            <h2>Agent-Z Admin</h2>
          </div>
          <span className="sidebar-role-tag">AI Engineer Suite</span>
        </div>

        <nav className="sidebar-nav">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="nav-group">
              <span className="nav-group-title">{sec.heading}</span>
              {sec.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={closeSidebar}
                  >
                    <span className="nav-item-icon">{item.icon}</span>
                    <span className="nav-item-text">{item.label}</span>
                    {item.badge && <span className="nav-item-badge">{item.badge}</span>}
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="nav-divider"></div>

          <a href="/" target="_blank" rel="noreferrer" className="nav-item">
            <span className="nav-item-icon"><FiHome /></span>
            <span className="nav-item-text">Buka Web Publik</span>
            <FiExternalLink className="nav-ext-icon" />
          </a>

          <button onClick={handleLogout} className="nav-item logout-btn">
            <span className="nav-item-icon"><FiLogOut /></span>
            <span className="nav-item-text">Keluar (Logout)</span>
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        <header className="content-header">
          <div className="header-left">
            <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle navigation">
              {isSidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h1 className="header-page-title">{activeLabel}</h1>
          </div>

          <div className="header-right">
            <div className="header-db-pill">
              <span className={`db-status-dot ${dbConnected ? 'online' : 'warn'}`}></span>
              <span className="db-status-label">{dbConnected ? 'Supabase Connected' : 'Supabase Fallback'}</span>
            </div>

            <a href="/" target="_blank" rel="noreferrer" className="header-visit-btn">
              <FiHome /> <span>Lihat Web</span>
            </a>
          </div>
        </header>

        <div className="content-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
