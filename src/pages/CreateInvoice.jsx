import { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, Home, Download, Share2, MessageCircle, X, Eye } from 'lucide-react';
import InvoiceTemplate from '../components/InvoiceTemplate';
import { generateInvoicePdfBlob } from '../utils/invoiceTemplate';
import { saveInvoice, getProfile, getInvoices } from '../db';
import { downloadPdfBlob } from '../utils/pdf';

const defaultForm = {
  invoiceNo: '1',
  date: new Date().toISOString().split('T')[0],
  billedToName: '',
  billedToAddress: '',
  billedToGstin: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  projectName: '',
  tower: '',
  flatNo: '',
  agreementValue: 0,
  brokeragePercent: 3,
  executiveBonus: 0,
};

const defaultProfile = {
  agentName: '', email: '', mobile: '', reraNo: '', panNo: '',
  bankFavouringName: '', bankName: '', accountType: 'Saving', accountNo: '', ifscCode: '', logoImage: '',
};

export default function CreateInvoice({ onNavigate, editingInvoice, setEditingInvoice }) {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    getProfile().then(data => setProfile(data || defaultProfile)).catch(() => setProfile(defaultProfile));
    if (!editingInvoice) {
      getInvoices().then(invoices => {
        const nums = invoices.map(i => parseInt(i.invoiceNo, 10)).filter(n => !isNaN(n) && n < 1000);
        const next = nums.length ? Math.max(...nums) + 1 : invoices.length + 1;
        setForm(prev => ({ ...prev, invoiceNo: String(next) }));
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (editingInvoice) setForm(editingInvoice);
  }, [editingInvoice]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const calcBroker = () => (Number(form.agreementValue) * Number(form.brokeragePercent)) / 100;
  const calcTotal = () => calcBroker() + Number(form.executiveBonus);

  const ensureSaved = async () => {
    if (!form.customerName) { alert('Please enter customer name'); return false; }
    try {
      const saved = await saveInvoice(form);
      if (!form.id && saved?.id) setForm(prev => ({ ...prev, id: saved.id }));
      return true;
    } catch (e) { alert('Failed to save: ' + e.message); return false; }
  };

  const handleGenerate = async () => {
    if (!form.customerName) { alert('Please enter customer name'); return; }
    const saved = await ensureSaved();
    if (saved) setShowModal(true);
  };

  const getFileName = () => `Invoice_${(form.customerName || 'PropEmpire').replace(/\s+/g, '_')}.pdf`;

  const genPdfBlob = async () => {
    if (!(await ensureSaved())) return null;
    return generateInvoicePdfBlob({
      data: form, profile,
      brokerageAmount: calcBroker(),
      totalAmount: calcTotal(),
      executiveBonus: Number(form.executiveBonus),
    });
  };

  const handleOpenPdf = async () => {
    setIsGenerating(true);
    const blob = await genPdfBlob();
    if (blob) window.open(URL.createObjectURL(blob), '_blank');
    setIsGenerating(false);
  };

  const handleSavePdf = async () => {
    setIsGenerating(true);
    const blob = await genPdfBlob();
    if (blob) downloadPdfBlob(blob, getFileName());
    setIsGenerating(false);
  };

  const handleWhatsApp = async () => {
    const phone = form.customerPhone?.replace(/\D/g, '');
    const waUrl = `https://wa.me/${phone?.length === 10 ? '91' + phone : phone || ''}?text=${encodeURIComponent(`Hello ${form.customerName},\n\nPlease find attached the invoice for ${form.projectName}.\n\nRegards,\nPropEmpire`)}`;
    setIsGenerating(true);
    const blob = await genPdfBlob();
    if (blob) {
      const file = new File([blob], getFileName(), { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Invoice' });
      } else {
        downloadPdfBlob(blob, getFileName());
        window.open(waUrl, '_blank');
      }
    }
    setIsGenerating(false);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <h1 style={{ margin: 0 }}>{editingInvoice ? 'Edit Invoice' : 'New Invoice'}</h1>
        {editingInvoice && (
          <button className="btn btn-secondary" onClick={() => setEditingInvoice(null)} style={{ fontSize: 12, padding: '6px 12px' }}>
            <X size={14} /> Cancel
          </button>
        )}
      </div>

      <div className="card mb-16">
        <div className="section-title">Invoice</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Invoice No.</label>
            <input type="text" className="form-input" name="invoiceNo" value={form.invoiceNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" name="date" value={form.date} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="card mb-16">
        <div className="section-title">Billed To (Developer)</div>
        <div className="form-group">
          <label className="form-label">Company / Developer Name</label>
          <input type="text" className="form-input" name="billedToName" value={form.billedToName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea className="form-input" name="billedToAddress" rows="2" value={form.billedToAddress} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">GSTIN</label>
          <input type="text" className="form-input" name="billedToGstin" value={form.billedToGstin} onChange={handleChange} />
        </div>
      </div>

      <div className="card mb-16">
        <div className="section-title">Customer & Property</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input type="text" className="form-input" name="customerName" value={form.customerName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input type="text" className="form-input" name="customerPhone" value={form.customerPhone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Project</label>
            <input type="text" className="form-input" name="projectName" value={form.projectName} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Tower</label>
            <input type="text" className="form-input" name="tower" value={form.tower} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Flat No</label>
            <input type="text" className="form-input" name="flatNo" value={form.flatNo} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" className="form-input" name="customerEmail" value={form.customerEmail} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="card mb-16">
        <div className="section-title">Financials</div>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Agreement Value (₹)</label>
            <input type="number" className="form-input" name="agreementValue" value={form.agreementValue} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Brokerage (%)</label>
            <input type="number" step="0.1" className="form-input" name="brokeragePercent" value={form.brokeragePercent} onChange={handleChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Executive Bonus (₹)</label>
          <input type="number" className="form-input" name="executiveBonus" value={form.executiveBonus} onChange={handleChange} />
        </div>
        <div style={{ marginTop: 16, padding: 12, background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
          <div className="flex justify-between mb-8">
            <span className="text-sm">Brokerage</span>
            <strong>₹ {calcBroker().toLocaleString('en-IN')}</strong>
          </div>
          <div className="flex justify-between mb-8">
            <span className="text-sm">Bonus</span>
            <strong>₹ {Number(form.executiveBonus).toLocaleString('en-IN')}</strong>
          </div>
          <div className="flex justify-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 8, fontSize: 16 }}>
            <strong>Total</strong>
            <strong className="amount">₹ {calcTotal().toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      <button className="btn btn-primary w-full" style={{ padding: 12, fontSize: 16 }} onClick={handleGenerate}>
        <FileText size={20} /> {editingInvoice ? 'Update & Generate' : 'Generate Invoice'}
      </button>

      <div style={{ position: 'absolute', top: 0, left: '-10000px', pointerEvents: 'none' }}>
        <div id="printable-invoice" style={{ width: '904px', minWidth: '904px', height: '1280px', backgroundColor: '#fff' }}>
          <InvoiceTemplate data={form} profile={profile} brokerageAmount={calcBroker()} totalAmount={calcTotal()} executiveBonus={Number(form.executiveBonus)} />
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h2>Invoice Created!</h2>
            <p className="mb-20">Invoice #{form.invoiceNo} saved successfully</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-primary w-full" onClick={handleOpenPdf} disabled={isGenerating}>
                <Eye size={18} /> {isGenerating ? 'Generating...' : 'Open PDF'}
              </button>
              <button className="btn btn-success w-full" onClick={handleWhatsApp} disabled={isGenerating}>
                <MessageCircle size={18} /> Share on WhatsApp
              </button>
              <button className="btn btn-secondary w-full" onClick={() => { setShowModal(false); setEditingInvoice?.(null); onNavigate('dashboard'); }}>
                <Home size={18} /> Go to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
