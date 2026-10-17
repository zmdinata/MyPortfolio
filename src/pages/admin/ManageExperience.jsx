import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiMinus, FiCalendar, FiZap, FiAlertCircle, FiCopy, FiCheck } from 'react-icons/fi';
import CustomSelect from '../../components/admin/CustomSelect';
import { LATEST_CV_EXPERIENCE } from '../../data/latestCvData';
import '../../styles/pages/admin-manage.css';

const ManageExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    role_en: '',
    role_id: '',
    date_start: '',
    date_end: '', // Empty means 'Present'
    location_en: '',
    location_id: '',
    company_en: '',
    company_id: '',
    work_type: 'Remote',
    description_en: '',
    description_id: '',
    responsibilities: [],
    achievements: [],
    year: new Date().getFullYear()
  });
  const [respInput, setRespInput] = useState('');
  const [achvInput, setAchvInput] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('date_start', { ascending: false });

    if (error) console.error(error);
    else setExperiences(data || []);
    setLoading(false);
  };

  const calculateDuration = (start, end) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    months = Math.max(1, months); // Minimum 1 month

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let result = '';
    if (years > 0) result += `${years} yr${years > 1 ? 's' : ''} `;
    if (remainingMonths > 0) result += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
    return result.trim();
  };

  const handleOpenModal = (exp = null) => {
    setErrorMessage(null);
    setSaving(false);
    if (exp) {
      setFormData({
        role_en: exp.role_en || '',
        role_id: exp.role_id || '',
        date_start: exp.date_start || '',
        date_end: exp.date_end || '',
        location_en: exp.location_en || '',
        location_id: exp.location_id || '',
        company_en: exp.company_en || '',
        company_id: exp.company_id || '',
        work_type: exp.work_type || 'Remote',
        description_en: exp.description_en || '',
        description_id: exp.description_id || '',
        responsibilities: exp.responsibilities || [],
        achievements: exp.achievements || [],
        year: exp.year || new Date().getFullYear()
      });
      setEditingId(exp.id);
    } else {
      setFormData({
        role_en: '', role_id: '', date_start: '', date_end: '', 
        location_en: 'Global', location_id: 'Global', company_en: '', company_id: '',
        work_type: 'Remote', description_en: '', description_id: '', 
        responsibilities: [], achievements: [],
        year: new Date().getFullYear()
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const applyLatestPreset = (preset) => {
    setFormData(prev => ({
      ...prev,
      role_en: preset.role,
      role_id: preset.role,
      company_en: preset.company,
      company_id: preset.company,
      date_start: preset.date_start,
      date_end: preset.date_end || '',
      work_type: preset.work_type || 'Remote',
      location_en: 'Global',
      location_id: 'Global',
      description_en: preset.description,
      description_id: preset.description,
      responsibilities: [],
      achievements: [],
      year: preset.date_start ? new Date(preset.date_start).getFullYear() : prev.year
    }));
    setErrorMessage(null);
  };

  const addResponsibility = () => {
    if (respInput.trim() && respInput.length <= 250) {
      setFormData({...formData, responsibilities: [...formData.responsibilities, respInput.trim()]});
      setRespInput('');
    }
  };

  const removeResponsibility = (index) => {
    const newResps = formData.responsibilities.filter((_, i) => i !== index);
    setFormData({ ...formData, responsibilities: newResps });
  };

  const addAchievement = () => {
    if (achvInput.trim() && achvInput.length <= 250) {
      setFormData({...formData, achievements: [...formData.achievements, achvInput.trim()]});
      setAchvInput('');
    }
  };

  const removeAchievement = (index) => {
    const newAchvs = formData.achievements.filter((_, i) => i !== index);
    setFormData({ ...formData, achievements: newAchvs });
  };

  const handleDelete = async (id, roleName) => {
    if (!window.confirm(`Yakin ingin menghapus pengalaman "${roleName || 'ini'}"?`)) {
      return;
    }

    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) {
      console.error('Error deleting experience:', error);
      alert(`Gagal menghapus pengalaman: ${error.message}`);
      return;
    }

    window.dispatchEvent(new CustomEvent('portfolio-cache-invalidated'));
    await fetchExperiences();
  };

  const handleCopyRlsSql = () => {
    const sql = `-- Aktifkan izin CRUD penuh (INSERT, UPDATE, DELETE) untuk tabel experience di Supabase
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "experience_all_policy" ON public.experience;
CREATE POLICY "experience_all_policy" ON public.experience
FOR ALL TO anon, authenticated
USING (true)
WITH CHECK (true);`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    const payload = {
      role_en: formData.role_en?.trim(),
      role_id: formData.role_id?.trim() || formData.role_en?.trim(),
      date_start: formData.date_start,
      date_end: formData.date_end ? formData.date_end : null,
      location_en: formData.location_en?.trim() || 'Global',
      location_id: formData.location_id?.trim() || formData.location_en?.trim() || 'Global',
      company_en: formData.company_en?.trim() || '',
      company_id: formData.company_id?.trim() || formData.company_en?.trim() || '',
      work_type: formData.work_type || 'Remote',
      description_en: formData.description_en?.trim() || '',
      description_id: formData.description_id?.trim() || formData.description_en?.trim() || '',
      responsibilities: Array.isArray(formData.responsibilities) ? formData.responsibilities : [],
      achievements: Array.isArray(formData.achievements) ? formData.achievements : [],
      year: formData.date_start ? new Date(formData.date_start).getFullYear() : (formData.year || new Date().getFullYear())
    };

    try {
      const request = editingId
        ? supabase.from('experience').update(payload).eq('id', editingId).select()
        : supabase.from('experience').insert([payload]).select();

      const { data, error } = await request;

      if (error) {
        console.error('Error saving experience:', error);
        if (error.code === '42501' || error.message?.includes('row-level security')) {
          setErrorMessage('Database Supabase menolak penambahan data (Error 42501 - Row Level Security). Izin INSERT belum diaktifkan di Supabase Cloud. Klik tombol "Salin SQL Izin RLS" di bawah dan jalankan di SQL Editor Supabase untuk membukanya.');
        } else {
          setErrorMessage(`Gagal menyimpan: ${error.message} (Code: ${error.code || 'unknown'})`);
        }
        setSaving(false);
        return;
      }

      if (editingId && (!data || data.length === 0)) {
        setErrorMessage('Peringatan: 0 baris diperbarui di Supabase (RLS UPDATE belum aktif). Klik tombol "Salin SQL Izin RLS" di bawah dan jalankan di SQL Editor Supabase agar perubahan tersimpan permanen.');
        setSaving(false);
        return;
      }

      setIsModalOpen(false);
      setSaving(false);
      window.dispatchEvent(new CustomEvent('portfolio-cache-invalidated'));
      await fetchExperiences();
    } catch (err) {
      console.error('Unexpected error saving experience:', err);
      setErrorMessage(`Terjadi kesalahan sistem: ${err.message}`);
      setSaving(false);
    }
  };

  return (
    <div className="manage-container">
      <div className="action-bar">
        <div>
          <h2>Manage Experience</h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Kelola riwayat pekerjaan, kontribusi hackathon, dan program beasiswa AI.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="add-btn"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            onClick={handleCopyRlsSql}
            title="Salin skrip SQL untuk membuka izin Save & Add di Supabase"
          >
            {copiedSql ? <FiCheck style={{ color: '#00d2ff' }} /> : <FiCopy />}
            {copiedSql ? 'SQL RLS Tersalin!' : 'Salin SQL Izin RLS'}
          </button>
          <button className="add-btn" onClick={() => handleOpenModal()}>
            <FiPlus /> Add Experience
          </button>
        </div>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Role (EN/ID)</th>
                <th>Location</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {experiences.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <div className="title-cell">
                      <div className="date-badge">
                        <FiCalendar /> {exp.date_start} - {exp.date_end || 'Present'}
                      </div>
                      <span style={{ color: '#00d2ff', marginTop: '5px' }}>{calculateDuration(exp.date_start, exp.date_end)}</span>
                    </div>
                  </td>
                  <td>
                    <div className="title-cell">
                      <strong>{exp.role_en}</strong>
                      <span>{exp.company_en || '-'}</span>
                    </div>
                  </td>
                  <td>{exp.location_en}</td>
                  <td><span className="badge">{exp.work_type}</span></td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleOpenModal(exp)} className="edit-icon" title="Edit"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(exp.id, exp.role_en)} className="delete-icon" title="Hapus"><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <div>
                <h2>{editingId ? 'Edit Experience' : 'Add Experience'}</h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                  {editingId ? 'Perbarui detail riwayat pengalaman kerja.' : 'Tambahkan riwayat pengalaman kerja atau kontribusi hackathon.'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>

            {!editingId && LATEST_CV_EXPERIENCE && LATEST_CV_EXPERIENCE.length > 0 && (
              <div style={{ background: 'rgba(0, 210, 255, 0.08)', border: '1px solid rgba(0, 210, 255, 0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#00d2ff', marginBottom: '8px' }}>
                  <FiZap /> Preset Cepat CV (Klik untuk mengisi otomatis):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {LATEST_CV_EXPERIENCE.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyLatestPreset(preset)}
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      + {preset.role.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {errorMessage && (
              <div style={{ background: 'rgba(255, 71, 87, 0.15)', border: '1px solid #ff4757', color: '#ff6b81', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <FiAlertCircle style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div>{errorMessage}</div>
                    <button
                      type="button"
                      onClick={handleCopyRlsSql}
                      style={{
                        marginTop: '10px',
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.25)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {copiedSql ? <FiCheck style={{ color: '#00d2ff' }} /> : <FiCopy />}
                      {copiedSql ? 'Tersalin! Buka Supabase > SQL Editor' : 'Salin SQL Izin RLS (Supabase)'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                {/* Basic Info */}
                <div className="form-group">
                  <label>Role (English)</label>
                  <input type="text" value={formData.role_en} onChange={e => setFormData({...formData, role_en: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Role (Indonesian)</label>
                  <input type="text" value={formData.role_id} onChange={e => setFormData({...formData, role_id: e.target.value})} required />
                </div>

                {/* Dates */}
                <div className="form-group">
                  <label>Date Start</label>
                  <input type="date" value={formData.date_start} onChange={e => setFormData({...formData, date_start: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Date End (Leave empty for 'Present')</label>
                  <input type="date" value={formData.date_end} onChange={e => setFormData({...formData, date_end: e.target.value})} />
                </div>

                {/* Company, Location & Type */}
                <div className="form-group">
                  <label>Company (English)</label>
                  <input type="text" value={formData.company_en} onChange={e => setFormData({...formData, company_en: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Company (Indonesian)</label>
                  <input type="text" value={formData.company_id} onChange={e => setFormData({...formData, company_id: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Location (English) e.g. 'Indonesia'</label>
                  <input type="text" value={formData.location_en} onChange={e => setFormData({...formData, location_en: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Location (Indonesian) e.g. 'Indonesia'</label>
                  <input type="text" value={formData.location_id} onChange={e => setFormData({...formData, location_id: e.target.value})} required />
                </div>
                <div className="form-group">
                  <CustomSelect 
                    label="Work Type"
                    value={formData.work_type}
                    options={[
                      { value: 'WFO', label: 'WFO (Work From Office)' },
                      { value: 'Hybrid', label: 'Hybrid' },
                      { value: 'Remote', label: 'Remote' }
                    ]}
                    onChange={(val) => setFormData({...formData, work_type: val})}
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Calculated)</label>
                  <input type="text" value={calculateDuration(formData.date_start, formData.date_end)} readOnly disabled style={{ opacity: 0.7 }} />
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description (English) - Max 400 chars</label>
                  <textarea 
                    value={formData.description_en} 
                    onChange={e => setFormData({...formData, description_en: e.target.value})} 
                    maxLength={400} 
                    rows="2" 
                  />
                  <div className="char-count">{formData.description_en.length}/400</div>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description (Indonesian) - Max 400 chars</label>
                  <textarea 
                    value={formData.description_id} 
                    onChange={e => setFormData({...formData, description_id: e.target.value})} 
                    maxLength={400} 
                    rows="2" 
                  />
                  <div className="char-count">{formData.description_id.length}/400</div>
                </div>

                {/* Responsibilities */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Key Responsibilities (Max 250 chars per point)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      value={respInput} 
                      onChange={e => setRespInput(e.target.value)} 
                      placeholder="Add a responsibility point..."
                      maxLength={250}
                    />
                    <button type="button" onClick={addResponsibility} className="add-btn" style={{ padding: '0 15px' }}><FiPlus /></button>
                  </div>
                  <div className="char-count">{respInput.length}/250</div>
                  
                  <ul style={{ marginTop: '10px', listStyle: 'none', padding: 0 }}>
                    {formData.responsibilities.map((resp, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.9rem' }}>• {resp}</span>
                        <button type="button" onClick={() => removeResponsibility(index)} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer' }}><FiMinus /></button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Key Achievements (Max 250 chars per point)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      value={achvInput} 
                      onChange={e => setAchvInput(e.target.value)} 
                      placeholder="Add an achievement point..."
                      maxLength={250}
                    />
                    <button type="button" onClick={addAchievement} className="add-btn" style={{ padding: '0 15px' }}><FiPlus /></button>
                  </div>
                  <div className="char-count">{achvInput.length}/250</div>
                  
                  <ul style={{ marginTop: '10px', listStyle: 'none', padding: 0 }}>
                    {formData.achievements.map((achv, index) => (
                      <li key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '0.9rem' }}>• {achv}</span>
                        <button type="button" onClick={() => removeAchievement(index)} style={{ background: 'none', border: 'none', color: '#ff4757', cursor: 'pointer' }}><FiMinus /></button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn" disabled={saving}>Cancel</button>
                <button type="submit" className="save-btn" disabled={saving}>
                  <FiSave /> {saving ? 'Menyimpan...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageExperience;
