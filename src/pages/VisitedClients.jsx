import { useState, useEffect } from 'react';
import { MapPin, Plus, Phone, Trash2, Search, MessageCircle, Calendar, FileText, ChevronDown, ChevronUp, Filter, X, CheckSquare, Square } from 'lucide-react';
import { getVisitedClients, saveVisitedClient, deleteVisitedClient } from '../db';
import { exportRowsToXlsx, exportRowsToCsv } from '../utils/spreadsheet';

const initialForm = { visit_date: new Date().toISOString().split('T')[0], name: '', phone: '', project: '', properties: [], budget: '', notes: '' };
const PROPERTY_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa', 'Plot', 'Commercial'];

export default function VisitedClients() {
  const [clients, setClients] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [form, setForm] = useState(initialForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadClients = () => getVisitedClients().then(setClients);
  useEffect(() => { loadClients(); }, []);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone && c.phone.includes(search));
    let matchDate = true;
    if (dateFrom || dateTo) {
      const d = new Date(c.visit_date); d.setHours(0, 0, 0, 0);
      if (dateFrom) { const f = new Date(dateFrom); f.setHours(0,0,0,0); if (d < f) matchDate = false; }
      if (dateTo) { const t = new Date(dateTo); t.setHours(0,0,0,0); if (d > t) matchDate = false; }
    }
    return matchSearch && matchDate;
  });

  const handleAdd = async e => {
    e.preventDefault();
    if (!form.name) return;
    try {
      await saveVisitedClient({ ...form, properties: JSON.stringify(form.properties) });
      setForm(initialForm);
      setIsAdding(false);
      loadClients();
    } catch { alert('Failed to save'); }
  };

  const handleDelete = async id => {
    try {
      await deleteVisitedClient(id);
      setDeleteTarget(null);
      loadClients();
    } catch { alert('Failed to delete'); }
  };

  const toggleProp = opt => setForm(prev => ({
    ...prev,
    properties: prev.properties.includes(opt) ? prev.properties.filter(p => p !== opt) : [...prev.properties, opt],
  }));

  const formatWa = p => { const d = p.replace(/\D/g, ''); return d.length === 10 ? `91${d}` : d; };

  const renderProps = (data) => {
    let arr = [];
    if (Array.isArray(data)) arr = data;
    else if (typeof data === 'string') { try { arr = JSON.parse(data); if (!Array.isArray(arr)) arr = [data]; } catch { arr = [data]; } }
    return arr.length ? arr.map((p, i) => <span key={i} className="badge badge-blue" style={{ marginRight: 4, marginBottom: 4 }}>{p}</span>) : 'N/A';
  };

  const handleExportExcel = () => {
    if (!clients.length) return alert('No data');
    const data = clients.map((c, i) => {
      let props = '';
      if (Array.isArray(c.properties)) props = c.properties.join(', ');
      else if (typeof c.properties === 'string') { try { const p = JSON.parse(c.properties); props = Array.isArray(p) ? p.join(', ') : c.properties; } catch { props = c.properties; } }
      return { '#': i + 1, 'Date': c.visit_date ? new Date(c.visit_date).toLocaleDateString('en-GB') : '', 'Name': c.name, 'Phone': c.phone || '', 'Project': c.project || '', 'Properties': props, 'Budget': c.budget || '', 'Notes': c.notes || '' };
    });
    exportRowsToXlsx({ rows: data, sheetName: 'Visited Clients', fileName: 'PropEmpire_Visited.xlsx' });
  };

  const handleExportCsv = () => {
    if (!clients.length) return alert('No data');
    const data = clients.map((c, i) => {
      let props = '';
      if (Array.isArray(c.properties)) props = c.properties.join(', ');
      else if (typeof c.properties === 'string') { try { const p = JSON.parse(c.properties); props = Array.isArray(p) ? p.join(', ') : c.properties; } catch { props = c.properties; } }
      return { '#': i + 1, 'Date': c.visit_date ? new Date(c.visit_date).toLocaleDateString('en-GB') : '', 'Name': c.name, 'Phone': c.phone || '', 'Project': c.project || '', 'Properties': props, 'Budget': c.budget || '', 'Notes': c.notes || '' };
    });
    exportRowsToCsv({ rows: data, fileName: 'PropEmpire_Visited.csv' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <h1 style={{ margin: 0 }}>Visits</h1>
      </div>

      <div className="grid-2 mb-12">
        <button className="btn btn-secondary" onClick={handleExportCsv} style={{ padding: '8px', fontSize: 12 }}><FileText size={14} /> CSV</button>
        <button className="btn btn-secondary" onClick={handleExportExcel} style={{ padding: '8px', fontSize: 12 }}><FileText size={14} /> Excel</button>
      </div>
      <button className="btn btn-primary w-full mb-16" onClick={() => setIsAdding(!isAdding)}>
        <Plus size={18} /> Log New Visit
      </button>

      <div className="search-input-wrap">
        <Search size={16} />
        <input className="form-input" placeholder="Search name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="flex items-center gap-8 mb-16" style={{ background: 'var(--bg)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, color: 'var(--text)', flex: 1 }} />
        <span className="text-sm text-muted">to</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 12, color: 'var(--text)', flex: 1 }} />
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {isAdding && (
        <form className="card mb-16" onSubmit={handleAdd}>
          <div className="section-title">New Site Visit</div>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.visit_date} onChange={e => setForm({...form, visit_date: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input type="text" className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Project</label>
              <input type="text" className="form-input" value={form.project} onChange={e => setForm({...form, project: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Properties Showed</label>
              <div className="flex gap-8 flex-wrap" style={{ marginTop: 4 }}>
                {PROPERTY_OPTIONS.map(opt => {
                  const sel = form.properties.includes(opt);
                  return (
                    <div key={opt} onClick={() => toggleProp(opt)}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: `1px solid ${sel ? 'var(--primary)' : 'var(--border)'}`, background: sel ? 'var(--primary-light)' : 'transparent', fontSize: 13 }}>
                      {sel ? <CheckSquare size={14} color="var(--primary)" /> : <Square size={14} />}
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Budget</label>
              <input type="text" className="form-input" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notes</label>
              <textarea className="form-input" rows="2" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
            </div>
          </div>
          <div className="flex" style={{ gap: 8 }}>
            <button type="button" className="btn btn-secondary flex-1" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-1">Save Visit</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 40 }}>
            <MapPin size={40} />
            <p>{clients.length === 0 ? 'No visits logged yet' : 'No matches'}</p>
          </div>
        ) : (
          filtered.map(client => (
            <div key={client.id} className="card" style={{ padding: 14 }}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-8" style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)', fontSize: 12, fontWeight: 600 }}>
                  <Calendar size={12} style={{ color: 'var(--primary)' }} />
                  {new Date(client.visit_date).toLocaleDateString('en-GB')}
                </div>
                <div className="flex gap-8">
                  <button onClick={() => setExpandedId(expandedId === client.id ? null : client.id)} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: 11 }}>
                    {expandedId === client.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <button onClick={() => setDeleteTarget(client)} className="btn btn-secondary" style={{ padding: '4px 6px', fontSize: 11, color: 'var(--danger)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{client.name}</div>
              {client.project && <div className="flex items-center gap-8 text-sm text-muted mb-8"><MapPin size={12} /> {client.project}</div>}

              <div className="flex gap-8">
                {client.phone && (
                  <>
                    <a href={`tel:${client.phone}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12, flex: 1 }}>
                      <Phone size={14} /> Call
                    </a>
                    <a href={`https://wa.me/${formatWa(client.phone)}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12, flex: 1, color: 'var(--success)', borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                  </>
                )}
              </div>

              {expandedId === client.id && (
                <div className="animate-fade-in" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border)', fontSize: 13 }}>
                  <div className="form-grid-2">
                    <div><strong className="text-muted">Properties:</strong> <div className="mt-8">{renderProps(client.properties)}</div></div>
                    <div><strong className="text-muted">Budget:</strong> <div className="mt-8">{client.budget || 'N/A'}</div></div>
                    <div style={{ gridColumn: '1 / -1' }}><strong className="text-muted">Notes:</strong> <div className="mt-8">{client.notes || 'N/A'}</div></div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ color: 'var(--danger)' }}>Delete Visit</h2>
            <p>Delete visit for <strong>{deleteTarget.name}</strong>?</p>
            <div className="flex" style={{ gap: 8, marginTop: 16 }}>
              <button className="btn btn-secondary flex-1" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger flex-1" onClick={() => handleDelete(deleteTarget.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
