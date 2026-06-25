import { useState, useEffect } from 'react';
import { Save, User, Building, Image as ImageIcon } from 'lucide-react';
import { getProfile, saveProfile } from '../db';

const defaults = {
  agentName: '', email: '', mobile: '', reraNo: '', panNo: '',
  bankFavouringName: '', bankName: '', accountType: 'Saving', accountNo: '', ifscCode: '', logoImage: '',
};

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile().then(d => setProfile({ ...defaults, ...(d || {}) })).catch(() => setProfile(defaults));
  }, []);

  const handleChange = e => setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile(prev => ({ ...prev, logoImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveProfile(profile);
    setSaving(false);
    alert('Profile saved!');
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <h1 style={{ margin: 0 }}>Settings</h1>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ fontSize: 12, padding: '6px 12px' }}>
          <Save size={14} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="card mb-16">
        <div className="section-title flex items-center gap-8"><User size={16} /> Agent Details</div>
        <div className="form-group">
          <label className="form-label">Agent Name</label>
          <input type="text" className="form-input" name="agentName" value={profile.agentName} onChange={handleChange} />
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" name="email" value={profile.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile</label>
            <input type="text" className="form-input" name="mobile" value={profile.mobile} onChange={handleChange} />
          </div>
        </div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">RERA No.</label>
            <input type="text" className="form-input" name="reraNo" value={profile.reraNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">PAN No.</label>
            <input type="text" className="form-input" name="panNo" value={profile.panNo} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="card mb-16">
        <div className="section-title flex items-center gap-8"><Building size={16} /> Bank Details</div>
        <div className="form-group">
          <label className="form-label">Cheque Favouring</label>
          <input type="text" className="form-input" name="bankFavouringName" value={profile.bankFavouringName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Bank & Branch</label>
          <textarea className="form-input" name="bankName" rows="2" value={profile.bankName} onChange={handleChange} />
        </div>
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select className="form-input" name="accountType" value={profile.accountType} onChange={handleChange}>
              <option value="Saving">Saving</option>
              <option value="Current">Current</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Account No.</label>
            <input type="text" className="form-input" name="accountNo" value={profile.accountNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">IFSC</label>
            <input type="text" className="form-input" name="ifscCode" value={profile.ifscCode} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-title flex items-center gap-8"><ImageIcon size={16} /> Logo</div>
        {profile.logoImage && (
          <div style={{ width: 100, height: 100, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 4, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
            <img src={profile.logoImage} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImage} style={{ fontSize: 13 }} />
        {profile.logoImage && (
          <button onClick={() => setProfile(prev => ({ ...prev, logoImage: '' }))} style={{ display: 'block', marginTop: 8, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: 12 }}>
            Remove Logo
          </button>
        )}
      </div>
    </div>
  );
}
