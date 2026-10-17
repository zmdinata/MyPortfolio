import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  FiSave,
  FiRefreshCw,
  FiZap,
  FiCheckCircle,
  FiInfo,
  FiUpload,
  FiImage,
  FiUser,
  FiGlobe,
  FiLayers,
  FiMail,
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiStar,
} from 'react-icons/fi';
import { LATEST_CV_PROFILE } from '../../data/latestCvData';
import { uploadPortfolioFile } from '../../lib/portfolioMedia';
import {
  getLocalProfileConfig,
  saveLocalProfileConfig,
  fetchFullProfile,
  DEFAULT_PROFILE_CONFIG,
  PROFILE_SQL_MIGRATION,
} from '../../lib/profileConfig';
import '../../styles/pages/admin-manage.css';
import '../../styles/pages/admin-profile.css';

const ManageProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    id: 1,
    available_for_hire: true,
    hero_description_en: '',
    hero_description_id: '',
    about_description_en: '',
    about_description_id: '',
    avatar_url: '/assets/images/photo.png',
    full_name: 'Zacky Muhammad Dinata',
    hero_role: 'AI Engineer & Multi-Agent Architect',
    email: 'zmdinata@gmail.com',
    chips_string: 'PyTorch, LLMs & RAG, Computer Vision, Fullstack',
    lang_id: 'Indonesian (Native)',
    lang_en: 'English (Professional Working)',
    decks: DEFAULT_PROFILE_CONFIG.specialization_decks,
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const fullProfile = await fetchFullProfile();
      setFormData({
        id: 1,
        available_for_hire: fullProfile.available_for_hire ?? true,
        hero_description_en: fullProfile.hero_description_en || LATEST_CV_PROFILE.hero_description_en,
        hero_description_id: fullProfile.hero_description_id || LATEST_CV_PROFILE.hero_description_id,
        about_description_en: fullProfile.about_description_en || LATEST_CV_PROFILE.about_description_en,
        about_description_id: fullProfile.about_description_id || LATEST_CV_PROFILE.about_description_id,
        avatar_url: fullProfile.avatar_url || DEFAULT_PROFILE_CONFIG.avatar_url,
        full_name: fullProfile.full_name || DEFAULT_PROFILE_CONFIG.full_name,
        hero_role: fullProfile.hero_role || DEFAULT_PROFILE_CONFIG.hero_role,
        email: fullProfile.email || DEFAULT_PROFILE_CONFIG.email,
        chips_string: (fullProfile.chips || DEFAULT_PROFILE_CONFIG.chips).join(', '),
        lang_id: fullProfile.languages?.id || DEFAULT_PROFILE_CONFIG.languages.id,
        lang_en: fullProfile.languages?.en || DEFAULT_PROFILE_CONFIG.languages.en,
        decks: fullProfile.specialization_decks || DEFAULT_PROFILE_CONFIG.specialization_decks,
      });
    } catch (err) {
      console.warn('Error loading profile in ManageProfile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setStatusMsg(null);

    try {
      // 1. Instant local preview
      const localPreviewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, avatar_url: localPreviewUrl }));

      // 2. Upload to Supabase Storage
      const uploadedUrl = await uploadPortfolioFile(file, 'profile/avatars');
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, avatar_url: uploadedUrl }));
        setStatusMsg({
          type: 'success',
          text: 'Foto profil berhasil diunggah ke Supabase Storage!',
        });
      }
    } catch (uploadErr) {
      console.warn('Supabase storage upload note, using local preview:', uploadErr);
      // Fallback: convert to base64 data URL so it persists
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({ ...prev, avatar_url: event.target.result }));
        }
      };
      reader.readAsDataURL(file);

      setStatusMsg({
        type: 'info',
        text: 'Foto disimpan ke sesi lokal. Klik "Simpan Perubahan Profil" untuk menerapkan.',
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleFillLatest = () => {
    setFormData((prev) => ({
      ...prev,
      available_for_hire: LATEST_CV_PROFILE.available_for_hire,
      hero_description_en: LATEST_CV_PROFILE.hero_description_en,
      hero_description_id: LATEST_CV_PROFILE.hero_description_id,
      about_description_en: LATEST_CV_PROFILE.about_description_en,
      about_description_id: LATEST_CV_PROFILE.about_description_id,
      full_name: 'Zacky Muhammad Dinata',
      hero_role: 'AI Engineer & Multi-Agent Architect',
      chips_string: 'PyTorch, LLMs & RAG, Computer Vision, Fullstack',
      decks: DEFAULT_PROFILE_CONFIG.specialization_decks,
    }));
    setStatusMsg({
      type: 'info',
      text: 'Form diisi dengan preset CV AI Engineer terbaru. Klik "Simpan Perubahan Profil" untuk menyimpan.',
    });
  };

  const handleDeckChange = (index, field, value) => {
    setFormData((prev) => {
      const nextDecks = [...prev.decks];
      nextDecks[index] = {
        ...nextDecks[index],
        [field]: value,
      };
      return { ...prev, decks: nextDecks };
    });
  };

  const handleCopyMigrationSql = () => {
    navigator.clipboard.writeText(PROFILE_SQL_MIGRATION);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const chipsArray = formData.chips_string
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const fullConfig = {
      available_for_hire: formData.available_for_hire,
      hero_description_en: formData.hero_description_en,
      hero_description_id: formData.hero_description_id,
      about_description_en: formData.about_description_en,
      about_description_id: formData.about_description_id,
      avatar_url: formData.avatar_url,
      full_name: formData.full_name,
      hero_role: formData.hero_role,
      email: formData.email,
      chips: chipsArray,
      languages: {
        id: formData.lang_id,
        en: formData.lang_en,
      },
      specialization_decks: formData.decks,
    };

    // 1. Simpan ke local cache & broadcast update ke seluruh UI instan
    saveLocalProfileConfig(fullConfig);

    // 2. Simpan ke Supabase database
    try {
      // Upsert base standard profile
      const { error: baseError } = await supabase
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

      if (baseError) throw baseError;

      // Coba simpan extended fields ke Supabase jika kolom tersedia
      try {
        await supabase
          .from('profile')
          .update({
            avatar_url: formData.avatar_url,
            full_name: formData.full_name,
            hero_role: formData.hero_role,
            email: formData.email,
            chips: chipsArray,
            languages: fullConfig.languages,
            specialization_decks: formData.decks,
          })
          .eq('id', 1);
      } catch (schemaErr) {
        console.info('Notice: Extended profile columns not yet present in Supabase table schema, using client store.');
      }

      setStatusMsg({
        type: 'success',
        text: 'Profil, foto avatar, dan kartu spesialisasi berhasil diperbarui dan disinkronkan ke Landing Page!',
      });
    } catch (err) {
      console.warn('Supabase upsert notice:', err);
      setStatusMsg({
        type: 'info',
        text: 'Perubahan berhasil disimpan ke sesi lokal dan langsung aktif di Landing Page.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Memuat data profil & hero bio...</div>;

  return (
    <div className="manage-container">
      {/* Top Action Bar */}
      <div className="action-bar">
        <div>
          <h2>Kelola Profil & Hero Bio</h2>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Atur foto profil, identitas hero, 3 tab kartu spesialisasi, dan deskripsi ringkasan AI Engineer Anda.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="add-btn"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            onClick={handleCopyMigrationSql}
            title="Salin skrip SQL untuk menambahkan kolom profile di Supabase SQL Editor"
          >
            {copiedSql ? <FiCheck /> : <FiCopy />} {copiedSql ? 'SQL Tersalin!' : 'Skrip SQL Supabase'}
          </button>
          <button
            type="button"
            className="add-btn"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
            onClick={handleFillLatest}
            title="Isi otomatis dengan data CV AI terbaru"
          >
            <FiRefreshCw /> Preset CV 2026
          </button>
          <Link
            to="/admin/quick-editor"
            className="add-btn"
            style={{ background: '#00d2ff', color: '#000', textDecoration: 'none' }}
          >
            <FiZap /> Quick Editor (Live Preview)
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMsg && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            background: statusMsg.type === 'success' ? 'rgba(46,213,115,0.12)' : 'rgba(0,210,255,0.1)',
            border: `1px solid ${statusMsg.type === 'success' ? 'rgba(46,213,115,0.3)' : 'rgba(0,210,255,0.3)'}`,
            color: statusMsg.type === 'success' ? '#2ed573' : '#00d2ff',
          }}
        >
          {statusMsg.type === 'success' ? <FiCheckCircle /> : <FiInfo />}
          <span>{statusMsg.text}</span>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSubmit} className="form-card profile-form">
        {/* Section 1: Foto Profil & Avatar */}
        <div className="form-section">
          <h3>
            <FiImage /> Foto Profil (Avatar)
          </h3>
          <p className="section-desc">
            Foto yang tampil pada kartu profil Bento beranda dengan cincin cahaya glowing.
          </p>

          <div className="avatar-edit-layout">
            <div className="avatar-preview-box">
              <img
                src={formData.avatar_url || '/assets/images/photo.png'}
                alt="Avatar Preview"
                className="avatar-preview-img"
                onError={(e) => {
                  e.currentTarget.src = '/assets/images/photo.png';
                }}
              />
              <span className="avatar-online-dot" />
            </div>

            <div className="avatar-controls">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarFileChange}
              />
              <button
                type="button"
                className="upload-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
              >
                <FiUpload /> {uploadingAvatar ? 'Mengunggah...' : 'Pilih Foto Baru'}
              </button>
              <button
                type="button"
                className="reset-avatar-btn"
                onClick={() => setFormData({ ...formData, avatar_url: '/assets/images/photo.png' })}
              >
                Reset ke Default
              </button>
              <small className="avatar-hint">
                Format: JPG, PNG, WEBP. Otomatis disinkronkan ke Supabase Storage (`portfolio-media`).
              </small>
            </div>
          </div>
        </div>

        {/* Section 2: Identitas Utama & Header */}
        <div className="form-section">
          <h3>
            <FiUser /> Identitas & Judul Header
          </h3>
          <div className="form-grid-2">
            <div className="form-group">
              <label>Nama Lengkap (Full Name)</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Zacky Muhammad Dinata"
                required
              />
            </div>
            <div className="form-group">
              <label>Peran Hero / Subtitle Role</label>
              <input
                type="text"
                value={formData.hero_role}
                onChange={(e) => setFormData({ ...formData, hero_role: e.target.value })}
                placeholder="AI Engineer & Multi-Agent Architect"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Kontak</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="zmdinata@gmail.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Tag Keahlian Cepat (Chips di bawah foto - pisahkan dengan koma)</label>
              <input
                type="text"
                value={formData.chips_string}
                onChange={(e) => setFormData({ ...formData, chips_string: e.target.value })}
                placeholder="PyTorch, LLMs & RAG, Computer Vision, Fullstack"
              />
            </div>
          </div>

          <div className="form-grid-2" style={{ marginTop: '14px' }}>
            <div className="form-group">
              <label>Badge Bahasa 1 (Indonesia)</label>
              <input
                type="text"
                value={formData.lang_id}
                onChange={(e) => setFormData({ ...formData, lang_id: e.target.value })}
                placeholder="Indonesian (Native)"
              />
            </div>
            <div className="form-group">
              <label>Badge Bahasa 2 (English)</label>
              <input
                type="text"
                value={formData.lang_en}
                onChange={(e) => setFormData({ ...formData, lang_en: e.target.value })}
                placeholder="English (Professional Working)"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Status Ketersediaan Kerja */}
        <div className="form-section">
          <h3>
            <FiZap /> Status Ketersediaan Kerja (Available for Hire)
          </h3>
          <div className="toggle-group">
            <label className="switch">
              <input
                type="checkbox"
                checked={formData.available_for_hire}
                onChange={(e) => setFormData({ ...formData, available_for_hire: e.target.checked })}
              />
              <span className="slider round"></span>
            </label>
            <span style={{ color: formData.available_for_hire ? '#00d2ff' : 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
              {formData.available_for_hire ? '● Tersedia untuk Kerja (Available for Hire)' : '○ Sedang Tidak Mencari Pekerjaan'}
            </span>
          </div>
          <p className="toggle-hint" style={{ marginTop: '10px' }}>
            Mengaktifkan badge hijau "AVAILABLE FOR HIRE" di kartu identitas dan menyesuaikan CTA percakapan bot Agent-Z.
          </p>
        </div>

        {/* Section 4: 3 Tab Kartu Spesialisasi (Specialization Decks) */}
        <div className="form-section">
          <h3>
            <FiLayers /> 3 Tab Kartu Spesialisasi (Profile Showcase Deck)
          </h3>
          <p className="section-desc">
            Kelola detail konten interaktif pada 3 tab spesialisasi di kartu profil Bento beranda.
          </p>

          <div className="decks-admin-grid">
            {(formData.decks || []).map((deck, idx) => (
              <div key={deck.id || idx} className="deck-admin-card">
                <div className="deck-admin-header">
                  <span className="deck-admin-badge" style={{ borderColor: deck.color, color: deck.color }}>
                    TAB #{idx + 1}: {deck.tabLabel}
                  </span>
                </div>

                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>Label Tab</label>
                  <input
                    type="text"
                    value={deck.tabLabel}
                    onChange={(e) => handleDeckChange(idx, 'tabLabel', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Badge Header (Pill)</label>
                  <input
                    type="text"
                    value={deck.badge}
                    onChange={(e) => handleDeckChange(idx, 'badge', e.target.value)}
                    placeholder="e.g. ThinkPad T440 Homelab"
                  />
                </div>

                <div className="form-group">
                  <label>Judul Unggulan (Title)</label>
                  <input
                    type="text"
                    value={deck.title}
                    onChange={(e) => handleDeckChange(idx, 'title', e.target.value)}
                    placeholder="e.g. Agent-Z Autonomous Orchestrator"
                  />
                </div>

                <div className="form-group">
                  <label>Sub-Metrik / Status (Metric Line)</label>
                  <input
                    type="text"
                    value={deck.metric}
                    onChange={(e) => handleDeckChange(idx, 'metric', e.target.value)}
                    placeholder="e.g. 3 Agents Running • Nous Hermes & OpenClaw"
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi (English)</label>
                  <textarea
                    rows="2"
                    value={deck.descEn || deck.desc}
                    onChange={(e) => handleDeckChange(idx, 'descEn', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Deskripsi (Indonesia)</label>
                  <textarea
                    rows="2"
                    value={deck.desc}
                    onChange={(e) => handleDeckChange(idx, 'desc', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Tech Stack (pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={(deck.stack || []).join(', ')}
                    onChange={(e) =>
                      handleDeckChange(
                        idx,
                        'stack',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Link Eksternal Proyek</label>
                  <input
                    type="text"
                    value={deck.link}
                    onChange={(e) => handleDeckChange(idx, 'link', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Deskripsi Hero Subtitle */}
        <div className="form-section">
          <h3>
            <FiGlobe /> Deskripsi Hero (Subtitle Profil)
          </h3>
          <div className="form-group">
            <label>English (EN)</label>
            <textarea
              rows="3"
              value={formData.hero_description_en}
              onChange={(e) => setFormData({ ...formData, hero_description_en: e.target.value })}
              placeholder="e.g. AI Engineer & Autonomous Agent Architect | LLM Automation..."
            />
            <div className="char-count">{formData.hero_description_en.length} karakter</div>
          </div>

          <div className="form-group" style={{ marginTop: '15px' }}>
            <label>Bahasa Indonesia (ID)</label>
            <textarea
              rows="3"
              value={formData.hero_description_id}
              onChange={(e) => setFormData({ ...formData, hero_description_id: e.target.value })}
              placeholder="contoh: AI Engineer & Arsitek Agen Mandiri | Otomasi LLM..."
            />
            <div className="char-count">{formData.hero_description_id.length} karakter</div>
          </div>
        </div>

        {/* Section 6: Deskripsi Lengkap (About Me) */}
        <div className="form-section" style={{ borderBottom: 'none' }}>
          <h3>
            <FiUser /> Deskripsi Lengkap (About Me)
          </h3>
          <div className="form-group">
            <label>English (EN)</label>
            <textarea
              rows="5"
              value={formData.about_description_en}
              onChange={(e) => setFormData({ ...formData, about_description_en: e.target.value })}
              placeholder="Detail profil dan ringkasan keahlian dalam bahasa Inggris..."
            />
            <div className="char-count">{formData.about_description_en.length} karakter</div>
          </div>

          <div className="form-group" style={{ marginTop: '15px' }}>
            <label>Bahasa Indonesia (ID)</label>
            <textarea
              rows="5"
              value={formData.about_description_id}
              onChange={(e) => setFormData({ ...formData, about_description_id: e.target.value })}
              placeholder="Detail profil dan ringkasan keahlian dalam bahasa Indonesia..."
            />
            <div className="char-count">{formData.about_description_id.length} karakter</div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="form-actions" style={{ marginTop: '20px', display: 'flex', gap: '14px' }}>
          <button
            type="submit"
            className="save-btn"
            disabled={saving}
            style={{
              padding: '12px 28px',
              background: '#00d2ff',
              color: '#050b14',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <FiSave /> {saving ? 'Menyimpan ke Supabase & Web...' : 'Simpan Semua Perubahan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageProfile;
