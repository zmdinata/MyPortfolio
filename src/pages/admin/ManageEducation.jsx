import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiCalendar } from 'react-icons/fi';
import CustomSelect from '../../components/admin/CustomSelect';
import '../../styles/pages/admin-manage.css';

const ManageEducation = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    school: '',
    level_en: '',
    level_id: '',
    major_en: '',
    major_id: '',
    date_start: '',
    date_end: '',
    grade_type: 'IPK',
    grade_value: '',
    description_en: '',
    description_id: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('date_start', { ascending: false });

    if (error) console.error(error);
    else setEducation(data || []);
    setLoading(false);
  };

  const handleOpenModal = (edu = null) => {
    if (edu) {
      setFormData({
        school: edu.school || '',
        level_en: edu.level_en || '',
        level_id: edu.level_id || '',
        major_en: edu.major_en || '',
        major_id: edu.major_id || '',
        date_start: edu.date_start || '',
        date_end: edu.date_end || '',
        grade_type: edu.grade_type || 'IPK',
        grade_value: edu.grade_value || '',
        description_en: edu.description_en || '',
        description_id: edu.description_id || ''
      });
      setEditingId(edu.id);
    } else {
      setFormData({
        school: '', level_en: '', level_id: '', major_en: '', major_id: '',
        date_start: '', date_end: '', grade_type: 'IPK', grade_value: '',
        description_en: '', description_id: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this education entry?')) {
      await supabase.from('education').delete().eq('id', id);
      fetchEducation();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('education').update(formData).eq('id', editingId);
    } else {
      await supabase.from('education').insert([formData]);
    }
    setIsModalOpen(false);
    fetchEducation();
  };

  return (
    <div className="manage-container">
      <div className="action-bar">
        <h2>Manage Education</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Education
        </button>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>School</th>
                <th>Level & Major</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {education.map(edu => (
                <tr key={edu.id}>
                  <td>
                    <div className="date-badge">
                      <FiCalendar /> {edu.date_start} - {edu.date_end || 'Present'}
                    </div>
                  </td>
                  <td><strong>{edu.school}</strong></td>
                  <td>
                    <div className="title-cell">
                      <strong>{edu.level_en}</strong>
                      <span>{edu.major_en || '-'}</span>
                    </div>
                  </td>
                  <td>
                    {edu.grade_type !== 'None' ? (
                      <span className="badge">{edu.grade_type}: {edu.grade_value}</span>
                    ) : '-'}
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleOpenModal(edu)} className="edit-icon"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(edu.id)} className="delete-icon"><FiTrash2 /></button>
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
              <h2>{editingId ? 'Edit Education' : 'Add Education'}</h2>
              <button onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>School / University Name</label>
                  <input type="text" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} required />
                </div>
                
                {/* Level */}
                <div className="form-group">
                  <label>Level (English) e.g. 'Bachelor'</label>
                  <input type="text" value={formData.level_en} onChange={e => setFormData({...formData, level_en: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Level (Indonesian) e.g. 'Sarjana'</label>
                  <input type="text" value={formData.level_id} onChange={e => setFormData({...formData, level_id: e.target.value})} required />
                </div>

                {/* Major */}
                <div className="form-group">
                  <label>Major (English) - Optional</label>
                  <input type="text" value={formData.major_en} onChange={e => setFormData({...formData, major_en: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Major (Indonesian) - Optional</label>
                  <input type="text" value={formData.major_id} onChange={e => setFormData({...formData, major_id: e.target.value})} />
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

                {/* Grades */}
                <div className="form-group">
                  <CustomSelect 
                    label="Grade Type"
                    value={formData.grade_type}
                    options={[
                      { value: 'IPK', label: 'IPK (GPA)' },
                      { value: 'Nilai', label: 'Nilai (Score)' },
                      { value: 'None', label: 'None' }
                    ]}
                    onChange={(val) => setFormData({...formData, grade_type: val})}
                  />
                </div>
                <div className="form-group">
                  <label>Grade Value (e.g. 3.33)</label>
                  <input 
                    type="text" 
                    value={formData.grade_value} 
                    onChange={e => setFormData({...formData, grade_value: e.target.value})} 
                    disabled={formData.grade_type === 'None'}
                    style={{ opacity: formData.grade_type === 'None' ? 0.5 : 1 }}
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description (English) - Max 350 chars</label>
                  <textarea 
                    value={formData.description_en} 
                    onChange={e => setFormData({...formData, description_en: e.target.value})} 
                    maxLength={350} 
                    rows="3" 
                  />
                  <div className="char-count">{formData.description_en.length}/350</div>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description (Indonesian) - Max 350 chars</label>
                  <textarea 
                    value={formData.description_id} 
                    onChange={e => setFormData({...formData, description_id: e.target.value})} 
                    maxLength={350} 
                    rows="3" 
                  />
                  <div className="char-count">{formData.description_id.length}/350</div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn"><FiSave /> Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEducation;
