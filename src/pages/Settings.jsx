import { useState, useEffect } from 'react';
import { Save, User, Building, Landmark, Image as ImageIcon, QrCode } from 'lucide-react';
import { getProfile, saveProfile } from '../db';

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfile().then(data => {
      setProfile(data || {
        agentName: '',
        email: '',
        mobile: '',
        reraNo: '',
        panNo: '',
        bankFavouringName: '',
        bankName: '',
        accountType: 'Saving',
        accountNo: '',
        ifscCode: '',
        logoImage: ''
      });
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveProfile(profile);
    setIsSaving(false);
    alert('Profile saved successfully!');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Profile & Settings</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          <Save size={20} /> {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          <User size={20} color="var(--primary-blue)" />
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Agent Details</h2>
        </div>
        
        <div className="form-group">
          <label className="form-label">Agent Name</label>
          <input type="text" className="form-input" name="agentName" value={profile.agentName} onChange={handleChange} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Email ID</label>
            <input type="email" className="form-input" name="email" value={profile.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile No</label>
            <input type="text" className="form-input" name="mobile" value={profile.mobile} onChange={handleChange} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">RERA Number</label>
            <input type="text" className="form-input" name="reraNo" value={profile.reraNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">PAN Number</label>
            <input type="text" className="form-input" name="panNo" value={profile.panNo} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Bank Details (For Invoice)</h2>
        <div className="form-group">
          <label className="form-label">Cheque Favouring Name</label>
          <input type="text" className="form-input" name="bankFavouringName" value={profile.bankFavouringName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Bank Name & Branch Address</label>
          <textarea className="form-input" name="bankName" rows="2" value={profile.bankName} onChange={handleChange}></textarea>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select className="form-input" name="accountType" value={profile.accountType} onChange={handleChange}>
              <option value="Saving">Saving</option>
              <option value="Current">Current</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Account No</label>
            <input type="text" className="form-input" name="accountNo" value={profile.accountNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">IFSC Code</label>
            <input type="text" className="form-input" name="ifscCode" value={profile.ifscCode} onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={20} color="var(--primary-blue)" /> Branding & Payments (For Invoices)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Logo Upload */}
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={16} /> Company Logo
            </label>
            {profile.logoImage && (
              <div style={{ width: '120px', height: '120px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                <img src={profile.logoImage} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, 'logoImage')}
              style={{ fontSize: '0.875rem' }}
            />
            {profile.logoImage && <button type="button" onClick={() => setProfile(prev => ({ ...prev, logoImage: '' }))} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>Remove Logo</button>}
          </div>

        </div>
      </div>
    </div>
  );
}
