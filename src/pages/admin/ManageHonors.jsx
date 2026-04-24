import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import '../../styles/pages/admin-manage.css';

const ManageHonors = () => {
  const [honors, setHonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title_en: '',
    title_id: '',
    image_path: '/assets/honors/',
    type: 'image'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHonors();
  }, []);

  const fetchHonors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('honors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setHonors(data || []);
    setLoading(false);
  };

  const handleOpenModal = (honor = null) => {
    if (honor) {
      setFormData({
        title_en: honor.title_en,
        title_id: honor.title_id,
        image_path: honor.image_path,
        type: honor.type
      });
      setEditingId(honor.id);
    } else {
      setFormData({
        title_en: '', title_id: '', image_path: '/assets/honors/', type: 'image'
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this honor/award?')) {
      await supabase.from('honors').delete().eq('id', id);
      fetchHonors();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('honors').update(formData).eq('id', editingId);
    } else {
      await supabase.from('honors').insert([formData]);
    }
    setIsModalOpen(false);
    fetchHonors();
  };

  return (
    <div className="manage-container">
      <div className="action-bar">
        <h2>Manage Honors & Awards</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Honor
        </button>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title (EN)</th>
                <th>Title (ID)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {honors.map(honor => (
                <tr key={honor.id}>
                  <td>
                    <img src={honor.image_path} alt={honor.title_en} className="table-preview" onError={(e) => e.target.style.display = 'none'} />
                  </td>
                  <td><strong>{honor.title_en}</strong></td>
                  <td>{honor.title_id}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleOpenModal(honor)} className="edit-icon"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(honor.id)} className="delete-icon"><FiTrash2 /></button>
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
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingId ? 'Edit Honor' : 'Add Honor'}</h2>
              <button onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Title (English)</label>
                  <input type="text" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Title (Indonesian)</label>
                  <input type="text" value={formData.title_id} onChange={e => setFormData({...formData, title_id: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Image Path (e.g. /assets/honors/honor1.jpeg)</label>
                  <input type="text" value={formData.image_path} onChange={e => setFormData({...formData, image_path: e.target.value})} required />
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

export default ManageHonors;
