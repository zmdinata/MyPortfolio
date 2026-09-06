import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  FiCheckCircle,
  FiExternalLink,
  FiEye,
  FiGlobe,
  FiLayers,
  FiMonitor,
  FiRefreshCw,
  FiSave,
  FiSmartphone,
  FiUser,
  FiZap,
} from 'react-icons/fi';
import { LATEST_CV_PROFILE, LATEST_CV_PROJECTS } from '../../data/latestCvData';
import '../../styles/pages/admin-quick-editor.css';

export default function QuickEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success'|'error'|'info', message: '' }
  const [previewLang, setPreviewLang] = useState('en'); // 'en' or 'id'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' or 'mobile'

  const [formData, setFormData] = useState({
    id: 1,
    available_for_hire: true,
    hero_description_en: '',
    hero_description_id: '',
    about_description_en: '',
    about_description_id: '',
  });

  const [featuredProjects, setFeaturedProjects] = useState(LATEST_CV_PROJECTS);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .single();

      if (data) {
        setFormData({
          id: 1,
          available_for_hire: data.available_for_hire ?? true,
          hero_description_en: data.hero_description_en || LATEST_CV_PROFILE.hero_description_en,
          hero_description_id: data.hero_description_id || LATEST_CV_PROFILE.hero_description_id,
          about_description_en: data.about_description_en || LATEST_CV_PROFILE.about_description_en,
          about_description_id: data.about_description_id || LATEST_CV_PROFILE.about_description_id,
        });
      } else {
        // Use latest CV defaults
        setFormData(LATEST_CV_PROFILE);
      }
    } catch (err) {
      console.warn('Using local fallback for profile:', err);
      setFormData(LATEST_CV_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLatestCv = () => {
    setFormData(LATEST_CV_PROFILE);
    setFeaturedProjects(LATEST_CV_PROJECTS);
    setSaveStatus({
      type: 'info',
      message: 'Form diisi dengan data CV AI Engineer terbaru. Klik "Simpan Perubahan" untuk menyimpan ke Supabase.',
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    try {
      const { error: upsertError } = await supabase
        .from('profile')
        .upsert(
          {
            id: 1,
            available_for_hire: formData.available_for_hire,
            hero_description_en: formData.hero_description_en,
            hero_description_id: formData.hero_description_id,
            about_description_en: formData.about_description_en,
            about_description_id: formData.about_description_id,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (upsertError) {
        throw upsertError;
      }

      setSaveStatus({
        type: 'success',
        message: 'Perubahan berhasil disimpan ke Supabase!',
      });
    } catch (err) {
      console.error('Error saving profile to Supabase:', err);
      setSaveStatus({
        type: 'info',
        message:
          'Data tersimpan di sesi lokal. Jika Supabase RLS aktif, Anda dapat menggunakan menu "Database Hub" untuk menyalin skrip SQL langsung ke Supabase.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="quick-editor-loading">
        <FiRefreshCw className="spin" />
        <p>Memuat editor data portofolio...</p>
      </div>
    );
  }

  const currentHero =
    previewLang === 'en'
      ? formData.hero_description_en || LATEST_CV_PROFILE.hero_description_en
      : formData.hero_description_id || LATEST_CV_PROFILE.hero_description_id;

  const currentAbout =
    previewLang === 'en'
      ? formData.about_description_en || LATEST_CV_PROFILE.about_description_en
      : formData.about_description_id || LATEST_CV_PROFILE.about_description_id;

  return (
    <div className="quick-editor-wrapper">
      {/* Top Header & Actions */}
      <div className="qe-top-bar">
        <div>
          <h2 className="qe-title">
            <FiZap className="qe-title-icon" /> Split-Screen Quick Editor
          </h2>
          <p className="qe-subtitle">
            Edit profil & proyek di sisi kiri, lihat pratinjau live kartu portofolio di sisi kanan secara real-time.
          </p>
        </div>

        <div className="qe-top-actions">
          <button
            type="button"
            className="qe-btn-outline"
            onClick={handleApplyLatestCv}
            title="Isi otomatis form dengan data CV terbaru"
          >
            <FiRefreshCw /> Isi Data CV Terbaru
          </button>
          <button
            type="button"
            className="qe-btn-primary"
            onClick={handleSubmit}
            disabled={saving}
          >
            <FiSave /> {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>

      {/* Save Status Notification */}
      {saveStatus && (
        <div className={`qe-alert-banner ${saveStatus.type}`}>
          <FiCheckCircle />
          <span>{saveStatus.message}</span>
          <button type="button" onClick={() => setSaveStatus(null)} className="qe-alert-close">
            ×
          </button>
        </div>
      )}

      {/* Split-Screen Main Layout */}
      <div className="qe-split-grid">
        {/* Left Side: Forms */}
        <div className="qe-pane-left">
          <form onSubmit={handleSubmit} className="qe-form">
            {/* Status & Availability Card */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiUser className="qe-card-icon" />
                <div>
                  <h3>Status Ketersediaan Kerja</h3>
                  <p>Menentukan apakah tombol "Available for Hire" muncul pada landing page</p>
                </div>
              </div>
              <div className="qe-toggle-row">
                <label className="qe-switch">
                  <input
                    type="checkbox"
                    checked={formData.available_for_hire}
                    onChange={(e) =>
                      setFormData({ ...formData, available_for_hire: e.target.checked })
                    }
                  />
                  <span className="qe-slider round"></span>
                </label>
                <div className="qe-toggle-info">
                  <span className={`qe-status-badge ${formData.available_for_hire ? 'active' : 'inactive'}`}>
                    {formData.available_for_hire ? '● Tersedia untuk Kerja (Available for Hire)' : '○ Sedang Tidak Mencari Pekerjaan'}
                  </span>
                  <small>AI Chatbot Agent-Z juga akan otomatis menyesuaikan tawaran CTA sesuai status ini.</small>
                </div>
              </div>
            </div>

            {/* Hero Section Card */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiGlobe className="qe-card-icon" />
                <div>
                  <h3>Deskripsi Hero (Subtitle Profil)</h3>
                  <p>Teks ringkas yang muncul tepat di bawah nama Anda pada bagian paling atas portofolio</p>
                </div>
              </div>

              <div className="qe-field-group">
                <label>
                  Bahasa Inggris (English) <span className="qe-lang-tag">EN</span>
                </label>
                <textarea
                  rows="2"
                  value={formData.hero_description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_description_en: e.target.value })
                  }
                  placeholder="e.g. Results-driven AI Engineer | LLM Automation..."
                />
              </div>

              <div className="qe-field-group">
                <label>
                  Bahasa Indonesia (ID) <span className="qe-lang-tag">ID</span>
                </label>
                <textarea
                  rows="2"
                  value={formData.hero_description_id}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_description_id: e.target.value })
                  }
                  placeholder="contoh: Results-driven AI Engineer | Otomasi LLM..."
                />
              </div>
            </div>

            {/* About Me Card */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiEye className="qe-card-icon" />
                <div>
                  <h3>Deskripsi Lengkap (About Me)</h3>
                  <p>Ringkasan komprehensif tentang keahlian AI, latar belakang IBM SkillsBuild, dan spesialisasi Anda</p>
                </div>
              </div>

              <div className="qe-field-group">
                <div className="qe-label-row">
                  <label>
                    Tentang Saya (English) <span className="qe-lang-tag">EN</span>
                  </label>
                  <span className="qe-char-counter">
                    {formData.about_description_en?.length || 0} karakter
                  </span>
                </div>
                <textarea
                  rows="4"
                  value={formData.about_description_en}
                  onChange={(e) =>
                    setFormData({ ...formData, about_description_en: e.target.value })
                  }
                  placeholder="Detail profil dalam Bahasa Inggris..."
                />
              </div>

              <div className="qe-field-group">
                <div className="qe-label-row">
                  <label>
                    Tentang Saya (Indonesian) <span className="qe-lang-tag">ID</span>
                  </label>
                  <span className="qe-char-counter">
                    {formData.about_description_id?.length || 0} karakter
                  </span>
                </div>
                <textarea
                  rows="4"
                  value={formData.about_description_id}
                  onChange={(e) =>
                    setFormData({ ...formData, about_description_id: e.target.value })
                  }
                  placeholder="Detail profil dalam Bahasa Indonesia..."
                />
              </div>
            </div>

            {/* Featured Projects Card */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiLayers className="qe-card-icon" />
                <div>
                  <h3>Proyek AI Unggulan (Featured Bento)</h3>
                  <p>3 proyek utama yang disorot di Bento Grid beranda</p>
                </div>
              </div>

              <div className="qe-projects-list">
                {featuredProjects.map((p, idx) => (
                  <div key={p.id_string || idx} className="qe-project-row">
                    <span className="qe-project-badge">#{idx + 1}</span>
                    <div className="qe-project-details">
                      <strong>{p.title_en}</strong>
                      <span className="qe-project-meta">
                        {p.category.toUpperCase()} • {p.file}
                      </span>
                      <div className="qe-project-tags">
                        {p.tech_stack?.map((tech) => (
                          <span key={tech} className="qe-tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Live Interactive Preview */}
        <div className="qe-pane-right">
          <div className="qe-preview-container">
            {/* Preview Toolbar */}
            <div className="qe-preview-toolbar">
              <div className="qe-preview-title">
                <span className="qe-live-dot"></span> Pratinjau Langsung (Live Preview)
              </div>

              <div className="qe-preview-controls">
                {/* Language Toggle */}
                <div className="qe-pill-toggle">
                  <button
                    type="button"
                    className={previewLang === 'en' ? 'active' : ''}
                    onClick={() => setPreviewLang('en')}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    type="button"
                    className={previewLang === 'id' ? 'active' : ''}
                    onClick={() => setPreviewLang('id')}
                  >
                    🇮🇩 ID
                  </button>
                </div>

                {/* Device Toggle */}
                <div className="qe-pill-toggle">
                  <button
                    type="button"
                    className={previewDevice === 'desktop' ? 'active' : ''}
                    onClick={() => setPreviewDevice('desktop')}
                    title="Tampilan Layar Komputer"
                  >
                    <FiMonitor />
                  </button>
                  <button
                    type="button"
                    className={previewDevice === 'mobile' ? 'active' : ''}
                    onClick={() => setPreviewDevice('mobile')}
                    title="Tampilan Layar HP"
                  >
                    <FiSmartphone />
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Viewport Frame */}
            <div className={`qe-preview-viewport ${previewDevice}`}>
              {/* Preview Hero Mockup */}
              <div className="qe-mock-hero">
                <div className="qe-mock-status-pill">
                  <span className={`qe-pulse-dot ${formData.available_for_hire ? 'green' : 'gray'}`}></span>
                  <span>{formData.available_for_hire ? 'AVAILABLE FOR HIRE' : 'CURRENTLY ENGAGED'}</span>
                </div>

                <h1 className="qe-mock-name">ZACKY MUHAMMAD DINATA</h1>
                <p className="qe-mock-role">{currentHero}</p>

                <div className="qe-mock-cta-row">
                  <button type="button" className="qe-mock-btn-primary">
                    Lihat Proyek
                  </button>
                  <button type="button" className="qe-mock-btn-secondary">
                    Hubungi Saya
                  </button>
                </div>
              </div>

              {/* Preview About Me Card Mockup */}
              <div className="qe-mock-section">
                <h4 className="qe-mock-section-title">
                  {previewLang === 'en' ? 'About Me' : 'Tentang Saya'}
                </h4>
                <div className="qe-mock-about-card">
                  <p>{currentAbout}</p>
                </div>
              </div>

              {/* Preview Featured Projects Mockup */}
              <div className="qe-mock-section">
                <h4 className="qe-mock-section-title">
                  {previewLang === 'en' ? 'Featured AI Work' : 'Karya AI Unggulan'}
                </h4>
                <div className="qe-mock-bento-grid">
                  {featuredProjects.map((p, idx) => (
                    <div key={idx} className="qe-mock-bento-card">
                      <div className="qe-mock-card-top">
                        <span className="qe-mock-category-pill">{p.category}</span>
                        <FiExternalLink className="qe-mock-ext-icon" />
                      </div>
                      <h5 className="qe-mock-card-title">
                        {previewLang === 'en' ? p.title_en : p.title_id}
                      </h5>
                      <p className="qe-mock-card-desc">
                        {previewLang === 'en' ? p.description_en : p.description_id}
                      </p>
                      <div className="qe-mock-card-stack">
                        {p.tech_stack?.slice(0, 3).map((t) => (
                          <span key={t} className="qe-mock-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
