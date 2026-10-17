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
  FiSearch,
  FiGrid,
  FiX,
  FiMessageSquare,
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
import {
  CategoryIcon,
  allCategoryIconNames,
  commonCategoryIcons,
  CATEGORY_ICON_GROUPS,
  normalizeIconName,
} from '../../lib/categoryIcons';
import CoverCropperModal from '../../components/ui/CoverCropperModal';
import '../../styles/pages/admin-manage.css';
import '../../styles/pages/admin-profile.css';

const ManageProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperRawSrc, setCropperRawSrc] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const fileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);
  const [tabIconSearch, setTabIconSearch] = useState({ 0: '', 1: '', 2: '' });
  const [iconModal, setIconModal] = useState({
    isOpen: false,
    tabIndex: 0,
    search: '',
    activeCategory: 'all',
  });

  const getFilteredIcons = (searchQuery, categoryId = 'all') => {
    let baseList = allCategoryIconNames;
    if (categoryId !== 'all') {
      const group = CATEGORY_ICON_GROUPS.find((g) => g.id === categoryId);
      if (group) baseList = group.icons;
    } else if (!searchQuery) {
      baseList = commonCategoryIcons;
    }

    const q = String(searchQuery || '').toLowerCase().trim();
    if (!q) {
      return baseList.slice(0, 72);
    }

    return allCategoryIconNames
      .filter((name) => name.includes(q))
      .slice(0, 100);
  };

  const [formData, setFormData] = useState({
    id: 1,
    available_for_hire: true,
    hero_description_en: '',
    hero_description_id: '',
    about_description_en: '',
    about_description_id: '',
    core_architecture_en: DEFAULT_PROFILE_CONFIG.core_architecture_en,
    core_architecture_id: DEFAULT_PROFILE_CONFIG.core_architecture_id,
    production_standard_en: DEFAULT_PROFILE_CONFIG.production_standard_en,
    production_standard_id: DEFAULT_PROFILE_CONFIG.production_standard_id,
    avatar_url: '/assets/images/photo.png',
    cover_url: '',
    full_name: 'Zacky Muhammad Dinata',
    hero_role: 'AI Engineer & Multi-Agent Architect',
    email: 'zmdinata@gmail.com',
    chips_string: 'PyTorch, LLMs & RAG, Computer Vision, Fullstack',
    lang_id: 'Indonesian (Native)',
    lang_en: 'English (Professional Working)',
    decks: DEFAULT_PROFILE_CONFIG.specialization_decks,
    agentz_prompts: DEFAULT_PROFILE_CONFIG.agentz_prompts,
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
        core_architecture_en: fullProfile.core_architecture_en || DEFAULT_PROFILE_CONFIG.core_architecture_en,
        core_architecture_id: fullProfile.core_architecture_id || DEFAULT_PROFILE_CONFIG.core_architecture_id,
        production_standard_en: fullProfile.production_standard_en || DEFAULT_PROFILE_CONFIG.production_standard_en,
        production_standard_id: fullProfile.production_standard_id || DEFAULT_PROFILE_CONFIG.production_standard_id,
        avatar_url: fullProfile.avatar_url || DEFAULT_PROFILE_CONFIG.avatar_url,
        cover_url: fullProfile.cover_url || '',
        full_name: fullProfile.full_name || DEFAULT_PROFILE_CONFIG.full_name,
        hero_role: fullProfile.hero_role || DEFAULT_PROFILE_CONFIG.hero_role,
        email: fullProfile.email || DEFAULT_PROFILE_CONFIG.email,
        chips_string: (fullProfile.chips || DEFAULT_PROFILE_CONFIG.chips).join(', '),
        lang_id: fullProfile.languages?.id || DEFAULT_PROFILE_CONFIG.languages.id,
        lang_en: fullProfile.languages?.en || DEFAULT_PROFILE_CONFIG.languages.en,
        decks: fullProfile.specialization_decks || DEFAULT_PROFILE_CONFIG.specialization_decks,
        agentz_prompts: fullProfile.agentz_prompts || DEFAULT_PROFILE_CONFIG.agentz_prompts,
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

  const handleCoverFileSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setCropperRawSrc(localUrl);
    setCropperOpen(true);
    // Reset file input value so user can re-select same file if needed
    e.target.value = '';
  };

  const handleCoverCropComplete = async ({ file, dataUrl }) => {
    setUploadingCover(true);
    setStatusMsg(null);

    // 1. Instant preview using cropped dataURL
    setFormData((prev) => ({ ...prev, cover_url: dataUrl }));

    // 2. Upload to Supabase Storage
    try {
      const uploadedUrl = await uploadPortfolioFile(file, 'profile/covers');
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, cover_url: uploadedUrl }));
        setStatusMsg({
          type: 'success',
          text: 'Foto sampul HD berhasil dipotong & diunggah ke Supabase Storage!',
        });
      }
    } catch (uploadErr) {
      console.warn('Supabase storage cover upload note, using local dataUrl:', uploadErr);
      setStatusMsg({
        type: 'info',
        text: 'Foto sampul disimpan ke sesi lokal. Klik "Simpan Semua Perubahan Profil" untuk menerapkan.',
      });
    } finally {
      setUploadingCover(false);
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
      core_architecture_en: DEFAULT_PROFILE_CONFIG.core_architecture_en,
      core_architecture_id: DEFAULT_PROFILE_CONFIG.core_architecture_id,
      production_standard_en: DEFAULT_PROFILE_CONFIG.production_standard_en,
      production_standard_id: DEFAULT_PROFILE_CONFIG.production_standard_id,
      full_name: 'Zacky Muhammad Dinata',
      hero_role: 'AI Engineer & Multi-Agent Architect',
      chips_string: 'PyTorch, LLMs & RAG, Computer Vision, Fullstack',
      decks: DEFAULT_PROFILE_CONFIG.specialization_decks,
      agentz_prompts: DEFAULT_PROFILE_CONFIG.agentz_prompts,
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

  const handleAgentzPromptChange = (index, field, value) => {
    setFormData((prev) => {
      const nextPrompts = [...(prev.agentz_prompts || DEFAULT_PROFILE_CONFIG.agentz_prompts)];
      nextPrompts[index] = {
        ...nextPrompts[index],
        [field]: value,
      };
      return { ...prev, agentz_prompts: nextPrompts };
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
      core_architecture_en: formData.core_architecture_en,
      core_architecture_id: formData.core_architecture_id,
      production_standard_en: formData.production_standard_en,
      production_standard_id: formData.production_standard_id,
      avatar_url: formData.avatar_url,
      cover_url: formData.cover_url,
      full_name: formData.full_name,
      hero_role: formData.hero_role,
      email: formData.email,
      chips: chipsArray,
      languages: {
        id: formData.lang_id,
        en: formData.lang_en,
      },
      agentz_prompts: formData.agentz_prompts || DEFAULT_PROFILE_CONFIG.agentz_prompts,
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
            cover_url: formData.cover_url,
            full_name: formData.full_name,
            hero_role: formData.hero_role,
            email: formData.email,
            chips: chipsArray,
            languages: fullConfig.languages,
            core_architecture_en: formData.core_architecture_en,
            core_architecture_id: formData.core_architecture_id,
            production_standard_en: formData.production_standard_en,
            production_standard_id: formData.production_standard_id,
            specialization_decks: formData.decks,
            agentz_prompts: formData.agentz_prompts || DEFAULT_PROFILE_CONFIG.agentz_prompts,
          })
          .eq('id', 1);
      } catch (schemaErr) {
        console.info('Notice: Extended profile columns not yet present in Supabase table schema, using client store.');
      }

      setStatusMsg({
        type: 'success',
        text: 'Profil, foto avatar, kartu spesialisasi, dan pertanyaan Agent-Z berhasil diperbarui dan disinkronkan ke Landing Page!',
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
        {/* Section 0: Foto Sampul (Cover Banner HD 16:5) */}
        <div className="form-section">
          <h3>
            <FiImage /> Foto Sampul (Cover Banner HD)
          </h3>
          <p className="section-desc">
            Foto sampul horizontal pada kartu profil eksekutif beranda dengan rasio aspek tetap (16:5 HD). Dilengkapi fitur crop manual interaktif untuk memilih posisi dan komposisi terbaik.
          </p>

          <div className="cover-edit-layout">
            <div className="cover-preview-box">
              {formData.cover_url ? (
                <img
                  src={formData.cover_url}
                  alt="Cover Banner Preview"
                  className="cover-preview-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.classList.add('cover-preview-fallback');
                  }}
                />
              ) : (
                <div className="cover-preview-empty">
                  <span>Belum ada foto sampul kustom (menggunakan tema gradien atmospheric bawaan)</span>
                </div>
              )}
              <div className="cover-ratio-badge">HD 16:5 Fixed</div>
            </div>

            <div className="cover-controls">
              <input
                type="file"
                ref={coverFileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleCoverFileSelected}
              />
              <button
                type="button"
                className="upload-avatar-btn"
                onClick={() => coverFileInputRef.current?.click()}
                disabled={uploadingCover}
              >
                <FiUpload /> {uploadingCover ? 'Mengunggah Sampul...' : 'Pilih Foto & Crop Sampul'}
              </button>
              {formData.cover_url && (
                <button
                  type="button"
                  className="reset-avatar-btn"
                  onClick={() => setFormData({ ...formData, cover_url: '' })}
                >
                  Hapus / Reset ke Gradien Bawaan
                </button>
              )}
              <small className="avatar-hint">
                Resolusi rekomendasi: 1600x500px atau rasio 16:5. Foto dapat di-zoom dan digeser bebas sebelum disimpan.
              </small>
            </div>
          </div>
        </div>

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
            {(formData.decks || []).map((deck, idx) => {
              const currentIconName = deck.icon || (deck.id === 'workflow' ? 'zap' : deck.id === 'ml' ? 'activity' : 'cpu');

              return (
                <div key={deck.id || idx} className="deck-admin-card">
                  <div className="deck-admin-header">
                    <span
                      className="deck-admin-badge"
                      style={{
                        borderColor: deck.color,
                        color: deck.color,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CategoryIcon name={currentIconName} size={14} />
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

                  {/* Lucide Icon Selector (Interactive Grid & Search) */}
                  <div className="form-group deck-icon-picker-group">
                    <div className="deck-icon-label-row">
                      <label style={{ margin: 0 }}>Ikon Lucide (Tab Icon)</label>
                      <button
                        type="button"
                        className="deck-open-modal-link"
                        onClick={() => setIconModal({ isOpen: true, tabIndex: idx, search: '', activeCategory: 'all' })}
                        title="Buka katalog lengkap 1,700+ ikon Lucide dengan filter kategori"
                      >
                        <FiGrid size={11} /> Katalog Lengkap
                      </button>
                    </div>

                    <div className="search-box icon-search" style={{ margin: '6px 0 8px' }}>
                      <FiSearch />
                      <input
                        className="search-input"
                        type="text"
                        placeholder="Cari ikon: cpu, brain, robot, zap..."
                        value={tabIconSearch[idx] || ''}
                        onChange={(e) => setTabIconSearch({ ...tabIconSearch, [idx]: e.target.value })}
                      />
                    </div>

                    <div className="icon-picker-grid deck-inline-grid">
                      {getFilteredIcons(tabIconSearch[idx]).map((iconName) => (
                        <button
                          type="button"
                          key={iconName}
                          className={`icon-picker-item ${currentIconName === iconName ? 'selected' : ''}`}
                          onClick={() => handleDeckChange(idx, 'icon', iconName)}
                          title={iconName}
                        >
                          <CategoryIcon name={iconName} size={18} />
                        </button>
                      ))}
                    </div>

                    <div className="selected-icon-label" style={{ marginTop: '8px', fontSize: '0.82rem' }}>
                      Terpilih: <CategoryIcon name={currentIconName} size={15} /> <strong>{currentIconName}</strong>
                    </div>
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
            );
          })}
        </div>
        </div>

        {/* Section 5: Pertanyaan Interaktif AI Agent-Z (Ask Agent-Z About Zacky) */}
        <div className="form-section">
          <h3>
            <FiMessageSquare /> Pertanyaan Interaktif AI Agent-Z (Kartu Homelab Live Preview)
          </h3>
          <p className="section-desc">
            Kelola 3 tombol pertanyaan cepat pada kartu "AI Homelab Online" di beranda. Saat pengunjung mengklik salah satu tombol ini, Chatbot Agent-Z akan langsung terbuka otomatis dengan pertanyaan yang Anda tentukan di sini.
          </p>

          <div
            className="agentz-prompts-admin-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            {(formData.agentz_prompts || DEFAULT_PROFILE_CONFIG.agentz_prompts).map((prompt, idx) => (
              <div
                key={idx}
                className="deck-admin-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(0, 210, 255, 0.22)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    className="deck-admin-badge"
                    style={{
                      borderColor: '#00d2ff',
                      color: '#00d2ff',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid #00d2ff',
                      background: 'rgba(0, 210, 255, 0.08)',
                    }}
                  >
                    TOMBOL PERTANYAAN #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                    Trigger Live Chatbot
                  </span>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '4px', color: 'rgba(255,255,255,0.8)' }}>
                    Teks Pertanyaan (Bahasa Indonesia)
                  </label>
                  <input
                    type="text"
                    value={prompt.text_id || ''}
                    onChange={(e) => handleAgentzPromptChange(idx, 'text_id', e.target.value)}
                    placeholder="Contoh: Ceritakan proyek Agent-Z..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '4px', color: 'rgba(255,255,255,0.8)' }}>
                    Question Text (English)
                  </label>
                  <input
                    type="text"
                    value={prompt.text_en || ''}
                    onChange={(e) => handleAgentzPromptChange(idx, 'text_en', e.target.value)}
                    placeholder="Example: Tell me about Agent-Z..."
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(0, 0, 0, 0.35)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Deskripsi Hero Subtitle */}
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

        {/* Section 7: Deskripsi Lengkap (About Me) */}
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

        {/* Section 8: Poin Kunci Ringkasan Eksekutif (Core Architecture & Production Standard) */}
        <div className="form-section" style={{ borderBottom: 'none' }}>
          <h3>
            <FiCheckCircle /> Poin Kunci Ringkasan Eksekutif (Highlights)
          </h3>
          <p className="section-desc">
            Edit teks 2 poin sorotan arsitektur dan standar produksi di bawah ringkasan eksekutif kartu beranda.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginTop: '16px' }}>
            {/* Box 1: Core Architecture */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(0, 221, 179, 0.25)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ddb3', display: 'inline-block' }} />
                <strong style={{ color: '#00ddb3', fontSize: '0.95rem' }}>1. Core Architecture (Arsitektur Utama)</strong>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>Teks English (EN)</label>
                <input
                  type="text"
                  value={formData.core_architecture_en}
                  onChange={(e) => setFormData({ ...formData, core_architecture_en: e.target.value })}
                  placeholder="e.g. Sovereign RAG, Autonomous Swarms, Deterministic Tool Gates"
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>Teks Bahasa Indonesia (ID)</label>
                <input
                  type="text"
                  value={formData.core_architecture_id}
                  onChange={(e) => setFormData({ ...formData, core_architecture_id: e.target.value })}
                  placeholder="contoh: Sovereign RAG, Agen Mandiri, Evaluasi Tool Deterministik"
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Box 2: Production Standard */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d2ff', display: 'inline-block' }} />
                <strong style={{ color: '#00d2ff', fontSize: '0.95rem' }}>2. Production Standard (Standar Produksi)</strong>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>Teks English (EN)</label>
                <input
                  type="text"
                  value={formData.production_standard_en}
                  onChange={(e) => setFormData({ ...formData, production_standard_en: e.target.value })}
                  placeholder="e.g. Sub-second latency (<1.2s), continuous homelab telemetry"
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>Teks Bahasa Indonesia (ID)</label>
                <input
                  type="text"
                  value={formData.production_standard_id}
                  onChange={(e) => setFormData({ ...formData, production_standard_id: e.target.value })}
                  placeholder="contoh: Latensi sub-detik (<1.2s), pemantauan telemetri homelab kontinu"
                  style={{ width: '100%', padding: '9px 12px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>
            </div>
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

      {/* Modal Pemilih Katalog Ikon Lucide Lengkap (1,700+ Ikon) */}
      {iconModal.isOpen && (
        <div className="modal-overlay" onClick={() => setIconModal({ ...iconModal, isOpen: false })}>
          <div
            className="modal-content large-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '820px' }}
          >
            <div className="modal-header">
              <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiGrid style={{ color: '#00d2ff' }} />
                  Katalog Ikon Lucide: TAB #{iconModal.tabIndex + 1} ({formData.decks[iconModal.tabIndex]?.tabLabel || 'Spesialisasi'})
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                  Pilih dari seluruh 1,700+ ikon Lucide atau gunakan filter kategori dan pencarian.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIconModal({ ...iconModal, isOpen: false })}
                title="Tutup Modal"
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.4rem' }}
              >
                <FiX />
              </button>
            </div>

            <div style={{ padding: '20px 30px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflow: 'hidden' }}>
              {/* Category Filter Pills */}
              <div className="modal-icon-categories-bar">
                <button
                  type="button"
                  className={`modal-cat-chip ${iconModal.activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setIconModal({ ...iconModal, activeCategory: 'all' })}
                >
                  Semua ({allCategoryIconNames.length})
                </button>
                {CATEGORY_ICON_GROUPS.map((grp) => (
                  <button
                    key={grp.id}
                    type="button"
                    className={`modal-cat-chip ${iconModal.activeCategory === grp.id ? 'active' : ''}`}
                    onClick={() => setIconModal({ ...iconModal, activeCategory: grp.id })}
                  >
                    {grp.label} ({grp.icons.length})
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="search-box icon-search" style={{ margin: 0 }}>
                <FiSearch />
                <input
                  className="search-input"
                  type="text"
                  placeholder="Ketik kata kunci ikon, misal: brain, robot, server, database, code, cloud, rocket, activity..."
                  value={iconModal.search}
                  onChange={(e) => setIconModal({ ...iconModal, search: e.target.value })}
                  autoFocus
                />
              </div>

              {/* Large Scrollable Icon Grid */}
              <div className="icon-picker-grid modal-icon-grid" style={{ maxHeight: '360px', padding: '6px' }}>
                {getFilteredIcons(iconModal.search, iconModal.activeCategory).map((iconName) => {
                  const currentTabIcon = formData.decks[iconModal.tabIndex]?.icon ||
                    (iconModal.tabIndex === 1 ? 'zap' : iconModal.tabIndex === 2 ? 'activity' : 'cpu');
                  const isSelected = currentTabIcon === iconName;

                  return (
                    <button
                      type="button"
                      key={iconName}
                      className={`icon-picker-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleDeckChange(iconModal.tabIndex, 'icon', iconName)}
                      title={iconName}
                    >
                      <CategoryIcon name={iconName} size={22} />
                    </button>
                  );
                })}
              </div>

              {/* Bottom selection bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="selected-icon-label" style={{ margin: 0 }}>
                  Ikon Terpilih:{' '}
                  <CategoryIcon
                    name={formData.decks[iconModal.tabIndex]?.icon || (iconModal.tabIndex === 1 ? 'zap' : iconModal.tabIndex === 2 ? 'activity' : 'cpu')}
                    size={20}
                  />{' '}
                  <strong style={{ color: '#00d2ff', fontSize: '1rem', marginLeft: '6px' }}>
                    {formData.decks[iconModal.tabIndex]?.icon || (iconModal.tabIndex === 1 ? 'zap' : iconModal.tabIndex === 2 ? 'activity' : 'cpu')}
                  </strong>
                </div>
                <button
                  type="button"
                  className="save-btn"
                  style={{ padding: '8px 24px', borderRadius: '8px', width: 'auto' }}
                  onClick={() => setIconModal({ ...iconModal, isOpen: false })}
                >
                  Terapkan Ikon
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crop Manual Foto Sampul (HD 16:5) */}
      <CoverCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperRawSrc}
        onClose={() => setCropperOpen(false)}
        onCropComplete={handleCoverCropComplete}
      />
    </div>
  );
};

export default ManageProfile;
