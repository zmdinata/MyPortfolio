import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FiSave } from 'react-icons/fi';
import '../../styles/pages/admin-manage.css';
import '../../styles/pages/admin-profile.css';

const ManageProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: 1,
    available_for_hire: true,
    hero_description_en: '',
    hero_description_id: '',
    about_description_en: '',
    about_description_id: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setFormData(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Check if profile exists
    const { data: existing } = await supabase.from('profile').select('id').eq('id', 1).single();
    
    let error;
    if (existing) {
      const { error: updateError } = await supabase.from('profile').update(formData).eq('id', 1);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('profile').insert([formData]);
      error = insertError;
    }

    if (error) {
      alert('Error saving profile: ' + error.message);
    } else {
      alert('Profile saved successfully!');
    }
    setSaving(false);
  };

  if (loading) return <div className="loading">Loading profile data...</div>;

  return (
    <div className="manage-container">
      <div className="action-bar">
        <h2>Manage Profile & Hero Section</h2>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="profile-form">
          
          <div className="form-section">
            <h3>Hero Section Settings</h3>
            <div className="form-group toggle-group">
              <label>Available for Hire</label>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={formData.available_for_hire}
                  onChange={(e) => setFormData({...formData, available_for_hire: e.target.checked})}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-hint">
                {formData.available_for_hire ? 'Active: "Available for Hire" button will be shown.' : 'Inactive: Button will be hidden.'}
              </span>
            </div>

            <div className="form-group">
              <label>Hero Description (English)</label>
              <textarea 
                value={formData.hero_description_en || ''} 
                onChange={(e) => setFormData({...formData, hero_description_en: e.target.value})}
                rows="2"
              />
            </div>
            
            <div className="form-group">
              <label>Hero Description (Indonesian)</label>
              <textarea 
                value={formData.hero_description_id || ''} 
                onChange={(e) => setFormData({...formData, hero_description_id: e.target.value})}
                rows="2"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>About Me Section</h3>
            <div className="form-group">
              <label>About Me Description (English) - Max 500 characters</label>
              <textarea 
                value={formData.about_description_en || ''} 
                onChange={(e) => setFormData({...formData, about_description_en: e.target.value})}
                maxLength={500}
                rows="5"
              />
              <div className="char-count">
                {(formData.about_description_en || '').length}/500
              </div>
            </div>

            <div className="form-group">
              <label>About Me Description (Indonesian) - Max 500 characters</label>
              <textarea 
                value={formData.about_description_id || ''} 
                onChange={(e) => setFormData({...formData, about_description_id: e.target.value})}
                maxLength={500}
                rows="5"
              />
              <div className="char-count">
                {(formData.about_description_id || '').length}/500
              </div>
            </div>
          </div>

          <button type="submit" className="save-btn lg" disabled={saving}>
            <FiSave /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManageProfile;
