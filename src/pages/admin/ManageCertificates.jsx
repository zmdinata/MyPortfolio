import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import CustomSelect from '../../components/admin/CustomSelect';
import '../../styles/pages/admin-manage.css';

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    file_path: '/assets/certificates/',
    preview_path: '/assets/certificates/previews/',
    type: 'pdf'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    else setCertificates(data || []);
    setLoading(false);
  };

  const handleOpenModal = (cert = null) => {
    if (cert) {
      setFormData({
        title: cert.title,
        file_path: cert.file_path,
        preview_path: cert.preview_path,
        type: cert.type
      });
      setEditingId(cert.id);
    } else {
      setFormData({
        title: '', file_path: '/assets/certificates/', preview_path: '/assets/certificates/previews/', type: 'pdf'
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this certificate?')) {
      await supabase.from('certificates').delete().eq('id', id);
      fetchCertificates();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await supabase.from('certificates').update(formData).eq('id', editingId);
    } else {
      await supabase.from('certificates').insert([formData]);
    }
    setIsModalOpen(false);
    fetchCertificates();
  };

  return (
    <div className="manage-container">
      <div className="action-bar">
        <h2>Manage Certificates</h2>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Certificate
        </button>
      </div>

      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(cert => (
                <tr key={cert.id}>
                  <td>
                    <img src={cert.preview_path} alt={cert.title} className="table-preview" onError={(e) => e.target.style.display = 'none'} />
                  </td>
                  <td><strong>{cert.title}</strong></td>
                  <td><span className="badge">{cert.type}</span></td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleOpenModal(cert)} className="edit-icon"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(cert.id)} className="delete-icon"><FiTrash2 /></button>
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
              <h2>{editingId ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Certificate Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <CustomSelect 
                    label="File Type"
                    value={formData.type}
                    options={[
                      { value: 'pdf', label: 'PDF Document' },
                      { value: 'image', label: 'Image (PNG/JPG)' }
                    ]}
                    onChange={(val) => setFormData({...formData, type: val})}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>File Path (e.g. /assets/certificates/sertif1.pdf)</label>
                  <input type="text" value={formData.file_path} onChange={e => setFormData({...formData, file_path: e.target.value})} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Preview Image Path (e.g. /assets/certificates/previews/sertif1.png)</label>
                  <input type="text" value={formData.preview_path} onChange={e => setFormData({...formData, preview_path: e.target.value})} required />
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

export default ManageCertificates;
