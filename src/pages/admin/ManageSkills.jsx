import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch } from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import CustomSelect from '../../components/admin/CustomSelect';
import '../../styles/pages/admin-manage.css';

// Pre-load icon keys for performance
const ALL_ICONS = [
  ...Object.keys(FaIcons).map(name => ({ name, type: 'fa' })),
  ...Object.keys(FiIcons).map(name => ({ name, type: 'fi' }))
];

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iconSearch, setIconSearch] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    icon: 'FaChartBar',
    description_en: '',
    description_id: ''
  });
  const [editingId, setEditingId] = useState(null);


  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true });

    if (error) console.error(error);
    else setSkills(data || []);
    setLoading(false);
  };

  const handleOpenModal = (skill = null) => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        icon: skill.icon || 'FaChartBar',
        description_en: skill.description_en || '',
        description_id: skill.description_id || ''
      });
      setEditingId(skill.id);
    } else {
      setFormData({
        name: '', icon: 'FaCode',
        description_en: '', description_id: ''
      });
      setEditingId(null);
    }
    setIconSearch('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      await supabase.from('skills').delete().eq('id', id);
      fetchSkills();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('skills').update(formData).eq('id', editingId);
    } else {
      await supabase.from('skills').insert([formData]);
    }
    setIsModalOpen(false);
    fetchSkills();
  };

  const renderIcon = (iconName) => {
    const IconComponent = FaIcons[iconName] || FiIcons[iconName];
    return IconComponent ? <IconComponent /> : <span>?</span>;
  };

  // Filter icons based on search (limit to 60 for performance)
  const filteredIcons = useMemo(() => {
    if (!iconSearch) return ALL_ICONS.slice(0, 60);
    return ALL_ICONS.filter(i => i.name.toLowerCase().includes(iconSearch.toLowerCase())).slice(0, 60);
  }, [iconSearch]);

  return (
    <div className="manage-container">
      <div className="action-bar">
        <h2>Manage Skills</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Skill
        </button>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Skill Name / Category</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => (
                <tr key={skill.id}>
                  <td style={{ fontSize: '1.5rem', color: '#00d2ff' }}>
                    {renderIcon(skill.icon)}
                  </td>
                  <td><strong>{skill.name}</strong></td>
                  <td style={{ maxWidth: '300px', opacity: 0.8 }}>{skill.description_en || skill.description_id}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleOpenModal(skill)} className="edit-icon"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(skill.id)} className="delete-icon"><FiTrash2 /></button>
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
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Skill Name / Category (e.g. Web3 & Blockchain)</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description (English) - Max 100 chars</label>
                  <textarea 
                    value={formData.description_en} 
                    onChange={e => setFormData({...formData, description_en: e.target.value})} 
                    maxLength={100} 
                    rows="2" 
                  />
                  <div className="char-count">{formData.description_en.length}/100</div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description (Indonesian) - Max 100 chars</label>
                  <textarea 
                    value={formData.description_id} 
                    onChange={e => setFormData({...formData, description_id: e.target.value})} 
                    maxLength={100} 
                    rows="2" 
                  />
                  <div className="char-count">{formData.description_id.length}/100</div>
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Select Icon (FontAwesome & Lucide)</label>
                  <div className="search-box" style={{ marginBottom: '10px' }}>
                    <FiSearch />
                    <input 
                      type="text" 
                      className="search-input"
                      placeholder="Search icons (e.g. react, python, database)" 
                      value={iconSearch}
                      onChange={e => setIconSearch(e.target.value)}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxHeight: '180px', overflowY: 'auto', padding: '5px' }}>
                    {filteredIcons.map(iconObj => (
                      <div 
                        key={iconObj.name}
                        onClick={() => setFormData({...formData, icon: iconObj.name})}
                        style={{
                          padding: '12px',
                          border: formData.icon === iconObj.name ? '2px solid #00d2ff' : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          background: formData.icon === iconObj.name ? 'rgba(0, 210, 255, 0.1)' : '#161616',
                          color: formData.icon === iconObj.name ? '#00d2ff' : '#fff'
                        }}
                        title={iconObj.name}
                      >
                        {renderIcon(iconObj.name)}
                      </div>
                    ))}
                    {filteredIcons.length === 0 && <span style={{ opacity: 0.5 }}>No icons found</span>}
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '0.8rem', opacity: 0.5 }}>
                    Selected: <strong>{formData.icon}</strong>
                  </div>
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

export default ManageSkills;
