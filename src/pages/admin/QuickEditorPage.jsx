import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { getCachedProjects, invalidatePortfolioCache } from '../../lib/portfolioCache';
import {
  FiCheckCircle,
  FiExternalLink,
  FiGlobe,
  FiLayers,
  FiMonitor,
  FiRefreshCw,
  FiSave,
  FiSmartphone,
  FiTablet,
  FiUser,
  FiZap,
  FiStar,
  FiInfo,
  FiArrowRight,
} from 'react-icons/fi';
import { LATEST_CV_PROFILE } from '../../data/latestCvData';
import '../../styles/pages/admin-quick-editor.css';

export default function QuickEditorPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success'|'error'|'info', message: '' }
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [iframeKey, setIframeKey] = useState(Date.now());

  const [formData, setFormData] = useState({
    id: 1,
    available_for_hire: true,
    hero_description_en: '',
    hero_description_id: '',
    about_description_en: '',
    about_description_id: '',
  });

  const [allProjects, setAllProjects] = useState([]);
  const [featuredSlots, setFeaturedSlots] = useState({
    slot1: '',
    slot2: '',
    slot3: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile from Supabase
      const { data: profileData } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .single();

      if (profileData) {
        setFormData({
          id: 1,
          available_for_hire: profileData.available_for_hire ?? true,
          hero_description_en: profileData.hero_description_en || LATEST_CV_PROFILE.hero_description_en,
          hero_description_id: profileData.hero_description_id || LATEST_CV_PROFILE.hero_description_id,
          about_description_en: profileData.about_description_en || LATEST_CV_PROFILE.about_description_en,
          about_description_id: profileData.about_description_id || LATEST_CV_PROFILE.about_description_id,
        });
      } else {
        setFormData(LATEST_CV_PROFILE);
      }

      // 2. Fetch Projects from Cache/Supabase
      const { projects } = await getCachedProjects();
      const projList = projects || [];
      setAllProjects(projList);

      // Identify the 3 featured projects from database
      const featured = projList
        .filter((p) => p.is_featured)
        .sort((a, b) => (a.featured_order ?? 999) - (b.featured_order ?? 999));

      setFeaturedSlots({
        slot1: featured[0]?.id || projList[0]?.id || '',
        slot2: featured[1]?.id || projList[1]?.id || '',
        slot3: featured[2]?.id || projList[2]?.id || '',
      });
    } catch (err) {
      console.warn('Error fetching Quick Editor data:', err);
      setFormData(LATEST_CV_PROFILE);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLatestCv = () => {
    setFormData(LATEST_CV_PROFILE);
    // Find matching AI projects for slots
    const ai0 = allProjects.find((p) => p.id === 'ai-0' || p.source_key === 'static:ai-0' || String(p.title_en).includes('AutoOverlay'));
    const ai1 = allProjects.find((p) => p.id === 'ai-1' || p.source_key === 'static:ai-1' || String(p.title_en).includes('Agent-Z'));
    const ai2 = allProjects.find((p) => p.id === 'ai-2' || p.source_key === 'static:ai-2' || String(p.title_en).includes('LestariRimba'));

    setFeaturedSlots({
      slot1: ai0?.id || featuredSlots.slot1,
      slot2: ai1?.id || featuredSlots.slot2,
      slot3: ai2?.id || featuredSlots.slot3,
    });

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
      // 1. Simpan Profil ke Supabase
      const { error: profileError } = await supabase
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

      if (profileError) throw profileError;

      // 2. Sinkronkan Status Featured Bento ke Supabase (tabel projects)
      const selectedSlotIds = [
        featuredSlots.slot1,
        featuredSlots.slot2,
        featuredSlots.slot3,
      ].filter(Boolean);

      const updatePromises = allProjects.map((proj) => {
        const slotIndex = selectedSlotIds.indexOf(proj.id);
        const shouldBeFeatured = slotIndex !== -1;
        const newOrder = shouldBeFeatured ? slotIndex + 1 : null;

        // Cek apakah ada perubahan
        if (proj.is_featured !== shouldBeFeatured || proj.featured_order !== newOrder) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(proj.id));
          if (isUuid) {
            return supabase
              .from('projects')
              .update({ is_featured: shouldBeFeatured, featured_order: newOrder })
              .eq('id', proj.id);
          } else if (proj.source_key) {
            return supabase
              .from('projects')
              .update({ is_featured: shouldBeFeatured, featured_order: newOrder })
              .eq('source_key', proj.source_key);
          }
        }
        return Promise.resolve(null);
      });

      await Promise.all(updatePromises);

      // 3. Invalidate in-memory cache agar HomePage & ManageProjects membaca data terbaru
      invalidatePortfolioCache('projects');

      // 4. Update state lokal
      setAllProjects((prev) =>
        prev.map((proj) => {
          const slotIndex = selectedSlotIds.indexOf(proj.id);
          const shouldBeFeatured = slotIndex !== -1;
          const newOrder = shouldBeFeatured ? slotIndex + 1 : null;
          return {
            ...proj,
            is_featured: shouldBeFeatured,
            featured_order: newOrder,
          };
        })
      );

      // 5. Muat ulang iframe live preview
      setIframeKey(Date.now());

      setSaveStatus({
        type: 'success',
        message: 'Perubahan berhasil disimpan! Profil dan 3 Proyek Unggulan telah tersinkronisasi ke Supabase & Live Preview.',
      });
    } catch (err) {
      console.error('Error saving in Quick Editor:', err);
      setSaveStatus({
        type: 'info',
        message:
          'Data tersimpan di sesi lokal. Jika Supabase RLS aktif, gunakan menu Dashboard untuk menyalin skrip SQL sinkronisasi.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshPreview = () => {
    setIframeKey(Date.now());
  };

  const getProject = (id) => allProjects.find((p) => String(p.id) === String(id));

  const previewUrl = `${window.location.origin}${window.location.pathname}#/?preview=${iframeKey}`;

  if (loading) {
    return (
      <div className="quick-editor-loading">
        <FiRefreshCw className="spin" />
        <p>Menghubungkan Quick Editor dengan database Supabase...</p>
      </div>
    );
  }

  return (
    <div className="quick-editor-wrapper">
      {/* Top Header & Actions */}
      <div className="qe-top-bar">
        <div>
          <h2 className="qe-title">
            <FiZap className="qe-title-icon" /> Split-Screen Quick Editor (Sinkron Supabase)
          </h2>
          <p className="qe-subtitle">
            Edit profil & pilih 3 Proyek AI Unggulan Bento di sisi kiri, lihat pratinjau live website 1:1 di sisi kanan.
          </p>
        </div>

        <div className="qe-top-actions">
          <button
            type="button"
            className="qe-btn-outline"
            onClick={handleApplyLatestCv}
            title="Isi otomatis form dengan preset CV AI Engineer terbaru"
          >
            <FiRefreshCw /> Preset CV AI 2026
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
        {/* Left Side: Forms & Supabase Bento Selector */}
        <div className="qe-pane-left">
          <form onSubmit={handleSubmit} className="qe-form">
            {/* Status & Availability Card */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiUser className="qe-card-icon" />
                <div>
                  <h3>Status Ketersediaan Kerja</h3>
                  <p>Sinkron dengan database profil & tombol status CTA di landing page</p>
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
                  <small>Agent-Z chatbot juga otomatis menyesuaikan penawaran rekrutmen sesuai status ini.</small>
                </div>
              </div>
            </div>

            {/* Hero Section Card */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiGlobe className="qe-card-icon" />
                <div>
                  <h3>Deskripsi Hero (Subtitle Profil)</h3>
                  <p>Teks ringkas yang muncul tepat di bawah nama Anda pada beranda utama</p>
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
                  placeholder="e.g. AI Engineer & Autonomous Agent Architect | LLM Automation..."
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
                  placeholder="contoh: AI Engineer & Arsitek Agen Mandiri | Otomasi LLM..."
                />
              </div>
            </div>

            {/* About Me Card */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiUser className="qe-card-icon" />
                <div>
                  <h3>Deskripsi Lengkap (About Me)</h3>
                  <p>Ringkasan komprehensif keahlian AI, latar belakang beasiswa, dan spesialisasi Anda</p>
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

            {/* Live Database Bento Selector */}
            <div className="qe-card">
              <div className="qe-card-header">
                <FiLayers className="qe-card-icon" />
                <div>
                  <h3>Proyek AI Unggulan (Featured Bento) — Terhubung Supabase</h3>
                  <p>Pilih 3 proyek dari database untuk ditampilkan pada Bento Grid beranda</p>
                </div>
              </div>

              <div className="qe-bento-slots-container">
                {/* Slot 1: Primary Featured Bento */}
                <div className="qe-bento-slot">
                  <div className="qe-slot-header">
                    <span className="qe-slot-badge slot-1">
                      <FiStar /> SLOT #1 (UTAMA - BENTO BESAR)
                    </span>
                    <small>Proyek unggulan pertama dengan visibilitas paling menonjol</small>
                  </div>
                  <select
                    className="qe-slot-select"
                    value={featuredSlots.slot1}
                    onChange={(e) => setFeaturedSlots({ ...featuredSlots, slot1: e.target.value })}
                  >
                    <option value="">-- Pilih Proyek untuk Slot #1 --</option>
                    {allProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title_en} ({p.category ? p.category.toUpperCase() : 'PROJECT'})
                      </option>
                    ))}
                  </select>
                  {getProject(featuredSlots.slot1) && (
                    <div className="qe-slot-preview-card">
                      <div className="qe-slot-preview-title">
                        {getProject(featuredSlots.slot1)?.title_en}
                      </div>
                      <div className="qe-slot-preview-meta">
                        Kategori: <strong>{getProject(featuredSlots.slot1)?.category || 'General'}</strong> • Tipe: {getProject(featuredSlots.slot1)?.type}
                      </div>
                    </div>
                  )}
                </div>

                {/* Slot 2: Secondary Featured Bento */}
                <div className="qe-bento-slot">
                  <div className="qe-slot-header">
                    <span className="qe-slot-badge slot-2">SLOT #2 (KARTU KEDUA)</span>
                    <small>Proyek unggulan kedua pada grid portofolio</small>
                  </div>
                  <select
                    className="qe-slot-select"
                    value={featuredSlots.slot2}
                    onChange={(e) => setFeaturedSlots({ ...featuredSlots, slot2: e.target.value })}
                  >
                    <option value="">-- Pilih Proyek untuk Slot #2 --</option>
                    {allProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title_en} ({p.category ? p.category.toUpperCase() : 'PROJECT'})
                      </option>
                    ))}
                  </select>
                  {getProject(featuredSlots.slot2) && (
                    <div className="qe-slot-preview-card">
                      <div className="qe-slot-preview-title">
                        {getProject(featuredSlots.slot2)?.title_en}
                      </div>
                      <div className="qe-slot-preview-meta">
                        Kategori: <strong>{getProject(featuredSlots.slot2)?.category || 'General'}</strong> • Tipe: {getProject(featuredSlots.slot2)?.type}
                      </div>
                    </div>
                  )}
                </div>

                {/* Slot 3: Tertiary Featured Bento */}
                <div className="qe-bento-slot">
                  <div className="qe-slot-header">
                    <span className="qe-slot-badge slot-3">SLOT #3 (KARTU KETIGA)</span>
                    <small>Proyek unggulan ketiga pada grid portofolio</small>
                  </div>
                  <select
                    className="qe-slot-select"
                    value={featuredSlots.slot3}
                    onChange={(e) => setFeaturedSlots({ ...featuredSlots, slot3: e.target.value })}
                  >
                    <option value="">-- Pilih Proyek untuk Slot #3 --</option>
                    {allProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title_en} ({p.category ? p.category.toUpperCase() : 'PROJECT'})
                      </option>
                    ))}
                  </select>
                  {getProject(featuredSlots.slot3) && (
                    <div className="qe-slot-preview-card">
                      <div className="qe-slot-preview-title">
                        {getProject(featuredSlots.slot3)?.title_en}
                      </div>
                      <div className="qe-slot-preview-meta">
                        Kategori: <strong>{getProject(featuredSlots.slot3)?.category || 'General'}</strong> • Tipe: {getProject(featuredSlots.slot3)?.type}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="qe-bento-footer-hint">
                <FiInfo />
                <span>
                  Ingin menambah proyek baru atau mengubah file media? Kelola secara penuh di{' '}
                  <Link to="/admin/projects" className="qe-link">
                    Menu Proyek Portofolio <FiArrowRight />
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: True Interactive Engine Viewport (Real Live Site 1:1) */}
        <div className="qe-pane-right">
          <div className="qe-preview-container">
            {/* Viewport Toolbar */}
            <div className="qe-preview-toolbar">
              <div className="qe-preview-title">
                <span className="qe-live-dot"></span>
                <span>Pratinjau Langsung (Live Website 1:1)</span>
              </div>

              <div className="qe-preview-controls">
                {/* Device Switcher */}
                <div className="qe-pill-toggle">
                  <button
                    type="button"
                    className={previewDevice === 'desktop' ? 'active' : ''}
                    onClick={() => setPreviewDevice('desktop')}
                    title="Layar Desktop (100%)"
                  >
                    <FiMonitor /> Desktop
                  </button>
                  <button
                    type="button"
                    className={previewDevice === 'tablet' ? 'active' : ''}
                    onClick={() => setPreviewDevice('tablet')}
                    title="Layar Tablet (768px)"
                  >
                    <FiTablet /> Tablet
                  </button>
                  <button
                    type="button"
                    className={previewDevice === 'mobile' ? 'active' : ''}
                    onClick={() => setPreviewDevice('mobile')}
                    title="Layar Ponsel (390px)"
                  >
                    <FiSmartphone /> Mobile
                  </button>
                </div>

                {/* Reload Viewport */}
                <button
                  type="button"
                  className="qe-btn-icon"
                  onClick={handleRefreshPreview}
                  title="Muat Ulang Tampilan Pratinjau"
                >
                  <FiRefreshCw />
                </button>

                {/* Open Fullsite in New Tab */}
                <a
                  href={`${window.location.origin}${window.location.pathname}#/`}
                  target="_blank"
                  rel="noreferrer"
                  className="qe-btn-icon"
                  title="Buka Website di Tab Baru"
                >
                  <FiExternalLink />
                </a>
              </div>
            </div>

            {/* Simulated Browser Address Bar */}
            <div className="qe-browser-bar">
              <div className="qe-browser-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="qe-browser-url">
                <FiGlobe className="url-icon" />
                <span>{window.location.host}/#/ (Live Engine)</span>
              </div>
              <div className="qe-browser-badge">
                TERHUBUNG SUPABASE
              </div>
            </div>

            {/* Real Viewport Frame */}
            <div className={`qe-viewport-wrapper ${previewDevice}`}>
              <iframe
                key={iframeKey}
                src={previewUrl}
                title="Portofolio Live Preview"
                className="qe-live-iframe"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
