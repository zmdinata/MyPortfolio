import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FiBriefcase, FiAward, FiEye } from 'react-icons/fi';
import '../../styles/pages/admin-dashboard.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    honors: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { count: projectCount } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });
        
      const { count: certCount } = await supabase
        .from('certificates')
        .select('*', { count: 'exact', head: true });

      const { count: honorCount } = await supabase
        .from('honors')
        .select('*', { count: 'exact', head: true });

      setStats({
        projects: projectCount || 0,
        certificates: certCount || 0,
        honors: honorCount || 0
      });
    };

    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Projects', value: stats.projects, icon: <FiBriefcase />, color: '#00d2ff' },
    { label: 'Certificates', value: stats.certificates, icon: <FiAward />, color: '#ffd700' },
    { label: 'Honors', value: stats.honors, icon: <FiEye />, color: '#4cd137' },
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card, index) => (
        <div key={index} className="stat-card" style={{ '--card-color': card.color }}>
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-info">
            <h3>{card.label}</h3>
            <p>{card.value}</p>
          </div>
        </div>
      ))}
      
      <div className="welcome-card">
        <h2>Welcome back, Admin!</h2>
        <p>You can manage your portfolio content from this dashboard. Changes made here will be reflected on your public site immediately.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
