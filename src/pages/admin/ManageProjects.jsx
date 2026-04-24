import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiSearch } from 'react-icons/fi';
import CustomSelect from '../../components/admin/CustomSelect';
import '../../styles/pages/admin-manage.css';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    category: 'data',
    title_en: '',
    title_id: '',
    file: '',
    preview: '',
    type: 'pdf'
  });
  const [editingId, setEditingId] = useState(null);

  const categories = ['data', 'lomba', 'tugas', 'web', 'desain', 'web3'];
  const types = ['pdf', 'image', 'external', 'iframe'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching projects:', error);
    else setProjects(data || []);
    setLoading(false);
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setFormData({
        id: project.id_string || '', // Use a separate string ID if needed, or just the DB UUID
        category: project.category,
        title_en: project.title_en,
        title_id: project.title_id,
        file: project.file,
        preview: project.preview,
        type: project.type
      });
      setEditingId(project.id);
    } else {
      setFormData({
        id: '',
        category: 'data',
        title_en: '',
        title_id: '',
        file: '',
        preview: '',
        type: 'pdf'
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchProjects();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      id_string: formData.id,
      category: formData.category,
      title_en: formData.title_en,
      title_id: formData.title_id,
      file: formData.file,
      preview: formData.preview,
      type: formData.type
    };

    if (editingId) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editingId);
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.from('projects').insert([payload]);
      if (error) alert(error.message);
    }

    setIsModalOpen(false);
    fetchProjects();
  };

  const filteredProjects = projects.filter(p => 
    p.title_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.title_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="manage-container">
      <div className="action-bar">
        <div className="search-box">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-btn" onClick={() => handleOpenModal()}>
          <FiPlus /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title (EN/ID)</th>
                <th>Category</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <img src={project.preview} alt="" className="table-preview" />
                  </td>
                  <td>
                    <div className="title-cell">
                      <strong>{project.title_en}</strong>
                      <span>{project.title_id}</span>
                    </div>
                  </td>
                  <td><span className="badge">{project.category}</span></td>
                  <td>{project.type}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleOpenModal(project)} className="edit-icon"><FiEdit2 /></button>
                      <button onClick={() => handleDelete(project.id)} className="delete-icon"><FiTrash2 /></button>
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
              <h2>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Project ID (Slug)</label>
                  <input 
                    type="text" 
                    value={formData.id} 
                    onChange={(e) => setFormData({...formData, id: e.target.value})}
                    placeholder="e.g. data-1"
                    required
                  />
                </div>
                <div className="form-group">
                  <CustomSelect 
                    label="Category"
                    value={formData.category}
                    options={categories.map(cat => ({ value: cat, label: cat }))}
                    onChange={(val) => setFormData({...formData, category: val})}
                  />
                </div>
                <div className="form-group">
                  <label>Title (English)</label>
                  <input 
                    type="text" 
                    value={formData.title_en} 
                    onChange={(e) => setFormData({...formData, title_en: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Title (Indonesia)</label>
                  <input 
                    type="text" 
                    value={formData.title_id} 
                    onChange={(e) => setFormData({...formData, title_id: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>File/Link URL</label>
                  <input 
                    type="text" 
                    value={formData.file} 
                    onChange={(e) => setFormData({...formData, file: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preview Image URL</label>
                  <input 
                    type="text" 
                    value={formData.preview} 
                    onChange={(e) => setFormData({...formData, preview: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <CustomSelect 
                    label="Type"
                    value={formData.type}
                    options={types.map(t => ({ value: t, label: t }))}
                    onChange={(val) => setFormData({...formData, type: val})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn"><FiSave /> Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
