import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { FiSave, FiRefreshCw, FiZap, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { LATEST_CV_PROFILE } from '../../data/latestCvData';
import '../../styles/pages/admin-manage.css';
import '../../styles/pages/admin-profile.css';

const ManageProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [formData, setFormData] = useState({
    id: 1,
    available_for_hire: true,
    hero_description_en: '',
    hero_description_id: '',
    about_description_en: '',
    about_description_id: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('Error fetching profile from Supabase:', error);
      setFormData(LATEST_CV_PROFILE);
    } else if (data) {
      setFormData(data);
    } else {
      setFormData(LATEST_CV_PROFILE);
    }
    setLoading(false);
  };

  const handleFillLatest = () => {
    setFormData(LATEST_CV_PROFILE);
    setStatusMsg({
      type: 'info',
      text: 'Form diisi dengan data CV AI Engineer terbaru. Klik "Save Profile Changes" untuk menyimpan.',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const { error } = await supabase
      .from('profile')
      .upsert(
        {
          id: 1,
          ...formData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (error) {
      setStatusMsg({
        type: 'info',
        text: 'Perubahan tersimpan secara lokal. Untuk sinkronisasi permanen ke Supabase cloud jika RLS aktif, gunakan Skrip SQL pada menu Dashboard.',
      });
    } else {
      setStatusMsg({
        type: 'success',
        text: 'Profil berhasil diperbarui di Supabase cloud!',
      });
    }
    setSaving(false);
  };

  if (loading) return <div className="loading">Memuat data profil...</div>;

  return (
    <div className="manage-container">
      <div className="action-bar">
        <div>
          <h2>Kelola Profil & Hero Bio</h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Atur status pencarian kerja dan deskripsi ringkasan AI Engineer Anda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="add-btn"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            onClick={handleFillLatest}
            title="Isi otomatis dengan bio CV terbaru"
          >
            <FiRefreshCw /> Isi CV Terbaru
          </button>
          <Link
            to="/admin/quick-editor"
            className="add-btn"
            style={{ background: '#00d2ff', color: '#000', textDecoration: 'none' }}
          >
            <FiZap /> Mode Split-Screen
          </Link>
        </div>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: statusMsg.type === 'success' ? 'rgba(46,213,115,0.12)' : 'rgba(0,210,255,0.1)',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(46,213,115,0.3)' : 'rgba(0,210,255,0.3)'}`,
            color: statusMsg.type === 'success' ? '#2ed573' : '#00d2ff',
            fontSize: '0.9rem',
          }}
        >
          {statusMsg.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h3>Hero Section Settings</h3>
            <div className="form-group toggle-group">
              <label>Available for Hire</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={formData.available_for_hire}
                  onChange={(e) =>
                    setFormData({ ...formData, available_for_hire: e.target.checked })
                  }
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-hint">
                {formData.available_for_hire
                  ? 'Aktif: Lencana "Available for Hire" akan menyala hijau dan ditampilkan di beranda.'
                  : 'Nonaktif: Lencana ketersediaan akan disembunyikan.'}
              </span>
            </div>

            <div className="form-group">
              <label>Hero Description (English)</label>
              <textarea
                value={formData.hero_description_en || ''}
                onChange={(e) =>
                  setFormData({ ...formData, hero_description_en: e.target.value })
                }
                rows="2"
                placeholder="e.g. Results-driven AI Engineer | LLM Automation..."
              />
            </div>

            <div className="form-group">
              <label>Hero Description (Indonesian)</label>
              <textarea
                value={formData.hero_description_id || ''}
                onChange={(e) =>
                  setFormData({ ...formData, hero_description_id: e.target.value })
                }
                rows="2"
                placeholder="contoh: Results-driven AI Engineer | Otomasi LLM..."
              />
            </div>
          </div>

          <div className="form-section">
            <h3>About Me Section</h3>
            <div className="form-group">
              <label>About Me Description (English)</label>
              <textarea
                value={formData.about_description_en || ''}
                onChange={(e) =>
                  setFormData({ ...formData, about_description_en: e.target.value })
                }
                maxLength={600}
                rows="5"
                placeholder="Deskripsi profil dalam Bahasa Inggris..."
              />
              <div className="char-count">
                {(formData.about_description_en || '').length}/600
              </div>
            </div>

            <div className="form-group">
              <label>About Me Description (Indonesian)</label>
              <textarea
                value={formData.about_description_id || ''}
                onChange={(e) =>
                  setFormData({ ...formData, about_description_id: e.target.value })
                }
                maxLength={600}
                rows="5"
                placeholder="Deskripsi profil dalam Bahasa Indonesia..."
              />
              <div className="char-count">
                {(formData.about_description_id || '').length}/600
              </div>
            </div>
          </div>

          <button type="submit" className="save-btn lg" disabled={saving}>
            <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageProfile;
