import { useState, useEffect } from 'react';
import { MapPin, UserPlus, Phone, Trash2, Calendar, FileText, ChevronDown, ChevronUp, Search, MessageCircle, CheckSquare, Square, Filter } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getVisitedClients, saveVisitedClient, deleteVisitedClient } from '../db';

export default function VisitedClients() {
  const [clients, setClients] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilterFrom, setDateFilterFrom] = useState('');
  const [dateFilterTo, setDateFilterTo] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  
  const initialForm = { 
    visit_date: todayStr,
    name: '', 
    phone: '', 
    project: '', 
    properties: [], // Array for multiple options
    budget: '',
    notes: '' 
  };
  const [newClient, setNewClient] = useState(initialForm);
  const [clientToDelete, setClientToDelete] = useState(null);

  const loadClients = async () => {
    const data = await getVisitedClients();
    setClients(data);
  };

  const handleExportExcel = () => {
    if (clients.length === 0) {
      alert("No clients to export.");
      return;
    }
    const exportData = clients.map((client, index) => {
      let propsString = '';
      if (Array.isArray(client.properties)) {
        propsString = client.properties.join(', ');
      } else if (typeof client.properties === 'string') {
        try {
          const parsed = JSON.parse(client.properties);
          if (Array.isArray(parsed)) propsString = parsed.join(', ');
          else propsString = client.properties;
        } catch(e) {
          propsString = client.properties;
        }
      }

      return {
        'Sr. No.': index + 1,
        'Visit Date': client.visit_date ? new Date(client.visit_date).toLocaleDateString('en-GB') : '',
        'Full Name': client.name || '',
        'Mobile No': client.phone || '',
        'Project Showed': client.project || '',
        'Property Showed': propsString,
        'Budget': client.budget || '',
        'Notes': client.notes || ''
      };
    });
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visited Clients');
    XLSX.writeFile(workbook, 'PropEmpire_Visited_Clients.xlsx');
  };

  const handleExportCSV = () => {
    if (clients.length === 0) {
      alert("No clients to export.");
      return;
    }
    const exportData = clients.map((client, index) => {
      let propsString = '';
      if (Array.isArray(client.properties)) {
        propsString = client.properties.join(', ');
      } else if (typeof client.properties === 'string') {
        try {
          const parsed = JSON.parse(client.properties);
          if (Array.isArray(parsed)) propsString = parsed.join(', ');
          else propsString = client.properties;
        } catch(e) {
          propsString = client.properties;
        }
      }

      return {
        'Sr. No.': index + 1,
        'Visit Date': client.visit_date ? new Date(client.visit_date).toLocaleDateString('en-GB') : '',
        'Full Name': client.name || '',
        'Mobile No': client.phone || '',
        'Project Showed': client.project || '',
        'Property Showed': propsString,
        'Budget': client.budget || '',
        'Notes': client.notes || ''
      };
    });
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "PropEmpire_Visited_Clients.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newClient.name) return;
    try {
      // Store array as JSON string for simple Supabase compatibility if needed
      const dataToSave = { 
        ...newClient, 
        properties: JSON.stringify(newClient.properties) 
      };
      await saveVisitedClient(dataToSave);
      setNewClient(initialForm);
      setIsAdding(false);
      loadClients();
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save visited client.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVisitedClient(id);
      setClientToDelete(null);
      loadClients();
    } catch (err) {
      console.error(err);
      alert("Failed to delete visited client: " + err.message);
    }
  };

  const toggleExpand = (id) => {
    if (expandedId === id) setExpandedId(null);
    else setExpandedId(id);
  }

  const toggleProperty = (propOption) => {
    setNewClient(prev => {
      const isSelected = prev.properties.includes(propOption);
      if (isSelected) {
        return { ...prev, properties: prev.properties.filter(p => p !== propOption) };
      } else {
        return { ...prev, properties: [...prev.properties, propOption] };
      }
    });
  };

  const propertyOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Villa', 'Plot', 'Commercial'];

  const filteredClients = clients.filter(client => {
    // Text search
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (client.phone && client.phone.includes(searchQuery));
    
    // Date filter
    let matchesDate = true;
    if (dateFilterFrom || dateFilterTo) {
      const clientDate = new Date(client.visit_date);
      clientDate.setHours(0,0,0,0);
      
      if (dateFilterFrom) {
        const fromD = new Date(dateFilterFrom);
        fromD.setHours(0,0,0,0);
        if (clientDate < fromD) matchesDate = false;
      }
      if (dateFilterTo) {
        const toD = new Date(dateFilterTo);
        toD.setHours(0,0,0,0);
        if (clientDate > toD) matchesDate = false;
      }
    }

    return matchesSearch && matchesDate;
  });

  const formatWaNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return `91${digits}`;
    return digits;
  };

  const renderProperties = (propsData) => {
    if (!propsData) return 'N/A';
    let arr = [];
    if (Array.isArray(propsData)) arr = propsData;
    else if (typeof propsData === 'string') {
      try {
        arr = JSON.parse(propsData);
        if (!Array.isArray(arr)) arr = [propsData];
      } catch(e) {
        arr = [propsData];
      }
    }
    
    if (arr.length === 0) return 'N/A';
    return arr.map((p, i) => (
      <span key={i} style={{ display: 'inline-block', background: 'var(--primary-blue)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', marginRight: '4px', marginBottom: '4px' }}>
        {p}
      </span>
    ));
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={24} /> Visited Clients</h1>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportExcel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} /> Export Excel
          </button>
          <button className="btn btn-primary" onClick={() => setIsAdding(!isAdding)}>
            <UserPlus size={16} /> Add Visit
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 200px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search name or mobile..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '34px', marginBottom: 0 }}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Filter size={16} color="var(--text-muted)" />
            <input 
              type="date" 
              className="form-input" 
              style={{ width: 'auto', marginBottom: 0 }}
              value={dateFilterFrom}
              onChange={(e) => setDateFilterFrom(e.target.value)}
              title="From Date"
            />
            <span style={{ color: 'var(--text-muted)' }}>to</span>
            <input 
              type="date" 
              className="form-input" 
              style={{ width: 'auto', marginBottom: 0 }}
              value={dateFilterTo}
              onChange={(e) => setDateFilterTo(e.target.value)}
              title="To Date"
            />
            {(dateFilterFrom || dateFilterTo) && (
              <button 
                onClick={() => { setDateFilterFrom(''); setDateFilterTo(''); }} 
                style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {isAdding && (
        <form className="card animate-fade-in" style={{ marginBottom: '2rem' }} onSubmit={handleAdd}>
          <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Log New Site Visit</h2>
          
          <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Visit Date *</label>
              <input type="date" className="form-input" value={newClient.visit_date} onChange={e => setNewClient({...newClient, visit_date: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Client Name *</label>
              <input type="text" className="form-input" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mobile No *</label>
              <input type="text" className="form-input" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Project Showed</label>
              <input type="text" className="form-input" placeholder="e.g. Mangalam Marvel" value={newClient.project} onChange={e => setNewClient({...newClient, project: e.target.value})} />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
              <label className="form-label">Property Showed (Select multiple)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
                {propertyOptions.map(opt => {
                  const isSelected = newClient.properties.includes(opt);
                  return (
                    <div 
                      key={opt} 
                      onClick={() => toggleProperty(opt)}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.25rem', 
                        cursor: 'pointer', padding: '0.25rem 0.5rem',
                        border: isSelected ? '1px solid var(--primary-blue)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isSelected ? 'var(--bg-color)' : 'transparent',
                        fontSize: '0.875rem'
                      }}
                    >
                      {isSelected ? <CheckSquare size={16} color="var(--primary-blue)" /> : <Square size={16} color="var(--text-muted)" />}
                      <span style={{ color: isSelected ? 'var(--primary-blue)' : 'var(--text-main)' }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Client Budget</label>
              <input type="text" className="form-input" placeholder="e.g. 50 Lacs" value={newClient.budget} onChange={e => setNewClient({...newClient, budget: e.target.value})} />
            </div>
            <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
              <label className="form-label">Notes / Feedback</label>
              <textarea className="form-input" rows="2" placeholder="Any specific requirements or comments..." value={newClient.notes} onChange={e => setNewClient({...newClient, notes: e.target.value})}></textarea>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Visited Client</button>
          </div>
        </form>
      )}

      <div className="card" style={{ padding: 0 }}>
        {filteredClients.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <MapPin size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <p>{clients.length === 0 ? 'No visited clients yet. Start by logging a visit!' : 'No clients match your filters.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredClients.map(client => (
              <div key={client.id} style={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <Calendar size={14} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                        {new Date(client.visit_date).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }} onClick={() => toggleExpand(client.id)}>
                      {client.name} 
                    </h3>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {client.phone && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <a href={`tel:${client.phone}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' }}>
                            <Phone size={14} /> Call
                          </a>
                          <a href={`https://wa.me/${formatWaNumber(client.phone)}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem', color: '#16a34a', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}>
                            <MessageCircle size={14} /> WhatsApp
                          </a>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)', flexWrap: 'wrap' }} onClick={() => toggleExpand(client.id)}>
                      {client.project && <span>🏢 {client.project}</span>}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button onClick={() => toggleExpand(client.id)} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', padding: '0.25rem' }}>
                        {expandedId === client.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                      <button onClick={() => setClientToDelete(client)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Row */}
                {expandedId === client.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)', fontSize: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div><strong style={{color:'var(--text-muted)', display: 'block', marginBottom: '4px'}}>Property Showed:</strong> {renderProperties(client.properties)}</div>
                    <div><strong style={{color:'var(--text-muted)', display: 'block', marginBottom: '4px'}}>Budget:</strong> {client.budget || 'N/A'}</div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <strong style={{color:'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem'}}><FileText size={14}/> Notes:</strong> 
                      <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{client.notes || 'No notes added.'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {clientToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--surface-color)' }}>
            <h3 style={{ marginTop: 0, color: '#ef4444' }}>Delete Visit</h3>
            <p style={{ margin: '1rem 0' }}>Are you sure you want to permanently delete this visit for <strong>{clientToDelete.name}</strong>?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setClientToDelete(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ backgroundColor: '#ef4444', border: 'none' }} onClick={() => handleDelete(clientToDelete.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
