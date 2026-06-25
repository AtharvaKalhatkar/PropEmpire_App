import { useState, useEffect } from 'react';
import { Plus, Phone, Trash2, Search, MessageCircle, Radio, ChevronDown, ChevronUp, FileText, FileUp, CheckSquare, Square, Send, X, Users } from 'lucide-react';
import { getClients, addClient, deleteClient, updateClientStatus } from '../db';
import { exportRowsToXlsx, parseImportedXlsx } from '../utils/spreadsheet';

const initialForm = { name: '', phone: '', email: '', project: '', status: 'Lead', budget: '', propertyType: '', leadSource: '', nextFollowUp: '', notes: '' };

const MESSAGE_TEMPLATES = [
  {
    label: 'New Launch',
    text: `🏗️ *New Project Launch Alert!*\n\nHello {name},\n\nWe are excited to introduce a brand new project:\n\n🏢 *Project:* [Enter Project]\n📍 *Location:* [Enter Location]\n🛏️ *Config:* 1/2/3 BHK\n💰 *Starting:* ₹ [Price]\n\nBook your FREE site visit now!\n\n— *PropEmpire*`
  },
  {
    label: 'Special Offer',
    text: `🔥 *Exclusive Offer!*\n\nHi {name},\n\nGreat news! We have a special offer on:\n\n🏢 *Project:* [Enter Project]\n🎁 *Offer:* [e.g. No Stamp Duty]\n⏳ *Valid Till:* [Date]\n\nDon't miss out!\n\n— *PropEmpire*`
  },
  {
    label: 'Follow-up',
    text: `Hello {name},\n\nThis is a gentle follow-up from *PropEmpire*.\n\nWould you like to schedule a site visit this weekend?\n\nLet us know your convenient time.\n\nRegards,\n*PropEmpire*`
  },
  { label: 'Custom', text: '' },
];

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [broadcastMsg, setBroadcastMsg] = useState(MESSAGE_TEMPLATES[0].text);
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(0);

  const loadClients = () => getClients().then(setClients);
  useEffect(() => { loadClients(); }, []);

  const filtered = clients.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone && c.phone.includes(search)));

  const handleAdd = async e => {
    e.preventDefault();
    if (!form.name) return;
    try {
      await addClient(form);
      setForm(initialForm);
      setIsAdding(false);
      loadClients();
    } catch (err) { alert('Failed to save client'); }
  };

  const handleDelete = async id => {
    try {
      await deleteClient(id);
      setDeleteTarget(null);
      loadClients();
    } catch { alert('Failed to delete'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateClientStatus(id, status);
      loadClients();
    } catch { alert('Failed to update status'); }
  };

  const handleExport = () => {
    if (!clients.length) return alert('No clients to export');
    const data = clients.map((c, i) => ({
      '#': i + 1, 'Name': c.name, 'Phone': c.phone, 'Email': c.email || '',
      'Status': c.status, 'Project': c.project || '', 'Type': c.propertyType || '',
      'Budget': c.budget || '', 'Source': c.leadSource || '',
      'Follow-up': c.nextFollowUp ? new Date(c.nextFollowUp).toLocaleDateString('en-GB') : '',
      'Notes': c.notes || '',
    }));
    exportRowsToXlsx({ rows: data, sheetName: 'Clients', fileName: 'PropEmpire_Clients.xlsx' });
  };

  const handleImport = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await parseImportedXlsx(file);
      if (!data?.length) return alert('No data found');
      let count = 0;
      for (const row of data) {
        const getVal = (keys) => { for (const k of Object.keys(row)) { if (keys.some(key => k.toLowerCase().includes(key))) return row[k]?.toString() || ''; } return ''; };
        const name = getVal(['name', 'client', 'customer']);
        if (!name) continue;
        await addClient({ name, phone: getVal(['phone', 'mobile']), email: getVal(['email']), project: getVal(['project']), status: 'Lead', budget: getVal(['budget']), propertyType: getVal(['type', 'bhk']), leadSource: 'Imported', notes: getVal(['note']) });
        count++;
      }
      alert(`Imported ${count} clients`);
      loadClients();
    } catch { alert('Import failed'); }
    e.target.value = '';
  };

  const formatWa = p => { const d = p.replace(/\D/g, ''); return d.length === 10 ? `91${d}` : d; };

  const toggleSelect = id => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleBroadcastSend = async () => {
    const targets = clients.filter(c => selectedIds.includes(c.id) && c.phone);
    if (!targets.length) return alert('Select clients with phone numbers');
    if (!broadcastMsg.trim()) return alert('Enter a message');
    setBroadcastSending(true);
    setBroadcastSent(0);
    for (let i = 0; i < targets.length; i++) {
      const msg = broadcastMsg.replace(/\{name\}/g, targets[i].name || 'there');
      window.open(`https://wa.me/${formatWa(targets[i].phone)}?text=${encodeURIComponent(msg)}`, '_blank');
      setBroadcastSent(i + 1);
      if (i < targets.length - 1) await new Promise(r => setTimeout(r, 800));
    }
    setBroadcastSending(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <h1 style={{ margin: 0 }}>Clients</h1>
        <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
          <input type="file" accept=".xlsx" onChange={handleImport} style={{ display: 'none' }} id="import-excel" />
          <label htmlFor="import-excel" className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 10px', cursor: 'pointer' }}><FileUp size={14} /> Import</label>
          <button className="btn btn-secondary" onClick={handleExport} style={{ fontSize: 12, padding: '6px 10px' }}><FileText size={14} /> Export</button>
          <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)} style={{ fontSize: 12, padding: '6px 10px' }}><Plus size={14} /> Add</button>
        </div>
      </div>

      <div className="search-input-wrap">
        <Search size={16} />
        <input className="form-input" placeholder="Search name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <button className="btn btn-secondary w-full mb-16" onClick={() => { setSelectedIds([]); setBroadcastMsg(MESSAGE_TEMPLATES[0].text); setBroadcastSent(0); setBroadcastSending(false); setShowBroadcast(true); }} style={{ color: 'var(--success)', borderColor: '#bbf7d0', background: '#f0fdf4' }}>
        <Radio size={16} /> WhatsApp Broadcast
      </button>

      {isAdding && (
        <form className="card mb-16" onSubmit={handleAdd}>
          <div className="section-title">New Client</div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input type="text" className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="Lead">Lead</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed">Closed</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Project</label>
              <input type="text" className="form-input" value={form.project} onChange={e => setForm({...form, project: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Budget</label>
              <input type="text" className="form-input" placeholder="e.g. 50 Lacs" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select className="form-input" value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}>
                <option value="">Select</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Lead Source</label>
              <select className="form-input" value={form.leadSource} onChange={e => setForm({...form, leadSource: e.target.value})}>
                <option value="">Select</option>
                <option value="Walk-in">Walk-in</option>
                <option value="Reference">Reference</option>
                <option value="Social Media">Social Media</option>
                <option value="Portal">Portal</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Follow-up Date</label>
              <input type="date" className="form-input" value={form.nextFollowUp} onChange={e => setForm({...form, nextFollowUp: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows="2" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-between" style={{ gap: 8 }}>
            <button type="button" className="btn btn-secondary flex-1" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-1">Save Client</button>
          </div>
        </form>
      )}

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={40} />
            <p>{clients.length === 0 ? 'No clients yet' : 'No matches'}</p>
          </div>
        ) : (
          filtered.map(client => (
            <div key={client.id} className="client-item" style={{ padding: '12px 16px' }}>
              <div className="client-info">
                <div className="flex items-center gap-8">
                  <span className="client-name">{client.name}</span>
                  {client.status === 'Closed' && <span className="badge badge-green">Done</span>}
                  {client.status === 'Lost' && <span className="badge badge-red">Lost</span>}
                </div>
                {client.phone && <div className="client-phone">{client.phone}</div>}
                <div className="client-meta">
                  {client.project && <span>{client.project}</span>}
                  {client.nextFollowUp && <span style={{ color: 'var(--warning)' }}>Follow-up: {new Date(client.nextFollowUp).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="client-actions">
                <select className="form-input" value={client.status} onChange={e => handleStatus(client.id, e.target.value)}
                  style={{ padding: '4px 6px', fontSize: 11, width: 90, marginBottom: 0 }}>
                  <option value="Lead">Lead</option>
                  <option value="Site Visit">Visit</option>
                  <option value="Negotiation">Negot.</option>
                  <option value="Closed">Closed</option>
                  <option value="Lost">Lost</option>
                </select>
                <button onClick={() => setExpandedId(expandedId === client.id ? null : client.id)} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: 11 }}>
                  {expandedId === client.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <button onClick={() => setDeleteTarget(client)} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: 11, color: 'var(--danger)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {expandedId && (() => {
        const c = filtered.find(x => x.id === expandedId);
        if (!c) return null;
        return (
          <div className="card mt-12 animate-fade-in">
            <div className="flex items-center gap-8 mb-8">
              {c.phone && <a href={`tel:${c.phone}`} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12 }}><Phone size={14} /> Call</a>}
              {c.phone && <a href={`https://wa.me/${formatWa(c.phone)}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12, color: 'var(--success)' }}><MessageCircle size={14} /> WhatsApp</a>}
            </div>
            <div className="form-grid-2 text-sm">
              <div><strong>Email:</strong> {c.email || 'N/A'}</div>
              <div><strong>Type:</strong> {c.propertyType || 'N/A'}</div>
              <div><strong>Budget:</strong> {c.budget || 'N/A'}</div>
              <div><strong>Source:</strong> {c.leadSource || 'N/A'}</div>
              <div style={{ gridColumn: '1 / -1' }}><strong>Notes:</strong> {c.notes || 'N/A'}</div>
            </div>
          </div>
        );
      })()}

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'var(--danger)' }}>Delete Client</h2>
            <p>Delete <strong>{deleteTarget.name}</strong> permanently?</p>
            <div className="flex justify-between" style={{ gap: 8, marginTop: 16 }}>
              <button className="btn btn-secondary flex-1" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger flex-1" onClick={() => handleDelete(deleteTarget.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showBroadcast && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="flex items-center justify-between mb-16">
              <h2>WhatsApp Broadcast</h2>
              <button onClick={() => setShowBroadcast(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div className="mb-12">
              <label className="form-label">Template</label>
              <div className="flex gap-8 flex-wrap">
                {MESSAGE_TEMPLATES.map((t, i) => (
                  <button key={i} onClick={() => setBroadcastMsg(t.text)}
                    style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid var(--border)`, background: broadcastMsg === t.text ? 'var(--primary)' : 'var(--bg)', color: broadcastMsg === t.text ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Message (use {'{name}'} for personalization)</label>
              <textarea className="form-input" rows="5" value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} />
            </div>
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <label className="form-label" style={{ margin: 0 }}>Select Clients ({selectedIds.length})</label>
                <button onClick={() => { const withPhone = filtered.filter(c => c.phone); setSelectedIds(selectedIds.length === withPhone.length ? [] : withPhone.map(c => c.id)); }}
                  style={{ fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Select All</button>
              </div>
              <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                {filtered.filter(c => c.phone).map(client => (
                  <div key={client.id} onClick={() => toggleSelect(client.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selectedIds.includes(client.id) ? 'var(--primary-light)' : 'transparent' }}>
                    {selectedIds.includes(client.id) ? <CheckSquare size={16} color="var(--primary)" /> : <Square size={16} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{client.name}</div>
                      <div className="text-sm text-muted">{client.phone}</div>
                    </div>
                    <span className="badge badge-blue">{client.status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex" style={{ gap: 8 }}>
              <button className="btn btn-secondary flex-1" onClick={() => setShowBroadcast(false)}>Cancel</button>
              <button className="btn btn-primary flex-1" onClick={handleBroadcastSend} disabled={!selectedIds.length || broadcastSending}
                style={{ background: '#25D366', borderColor: '#25D366' }}>
                <Send size={16} /> {broadcastSending ? `Sending ${broadcastSent}/${selectedIds.length}` : `Send to ${selectedIds.length}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
