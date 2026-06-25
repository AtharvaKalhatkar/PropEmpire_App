import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, DollarSign, Eye, X, MessageCircle, Mail } from 'lucide-react';
import { getInvoices, getProfile, deleteInvoice } from '../db';
import { generateInvoicePdfBlob } from '../utils/invoiceTemplate';
import { downloadPdfBlob } from '../utils/pdf';
import { Edit2 } from 'lucide-react';
import { exportRowsToXlsx } from '../utils/spreadsheet';

export default function Deals({ onEditInvoice }) {
  const [invoices, setInvoices] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const loadInvoices = () => getInvoices().then(setInvoices);

  useEffect(() => {
    loadInvoices();
    getProfile().then(p => setProfile(p || {}));
  }, []);

  const filteredInvoices = invoices.filter(inv => inv.date?.startsWith(selectedMonth));

  const totalRevenue = filteredInvoices.reduce((sum, inv) => {
    const broker = (Number(inv.agreementValue) * Number(inv.brokeragePercent)) / 100;
    return sum + broker + Number(inv.executiveBonus);
  }, 0);

  const calcBroker = (inv) => (Number(inv.agreementValue) * Number(inv.brokeragePercent)) / 100;
  const calcTotal = (inv) => calcBroker(inv) + Number(inv.executiveBonus);

  const genPdf = async (inv) => {
    if (!profile) return null;
    return generateInvoicePdfBlob({
      data: inv, profile,
      brokerageAmount: calcBroker(inv),
      totalAmount: calcTotal(inv),
      executiveBonus: Number(inv.executiveBonus),
    });
  };

  const handleDownload = async (inv) => {
    setIsGeneratingPdf(true);
    try {
      const blob = await genPdf(inv);
      if (blob) downloadPdfBlob(blob, `Invoice_${(inv.customerName || '').replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      alert('Failed to generate PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleView = async (inv) => {
    setIsGeneratingPdf(true);
    try {
      const blob = await genPdf(inv);
      if (blob) window.open(URL.createObjectURL(blob), '_blank');
    } catch (e) {
      alert('Failed to generate PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleWhatsApp = async (inv) => {
    const phone = inv.customerPhone?.replace(/\D/g, '');
    const waUrl = `https://wa.me/${phone?.length === 10 ? '91' + phone : phone || ''}?text=${encodeURIComponent(`Hello ${inv.customerName},\n\nPlease find attached the invoice for ${inv.projectName}.\n\nRegards,\nPropEmpire`)}`;
    setIsGeneratingPdf(true);
    try {
      const blob = await genPdf(inv);
      const file = new File([blob], `Invoice_${inv.customerName?.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Invoice', text: `Invoice for ${inv.projectName}` });
      } else {
        handleDownload(inv);
        window.open(waUrl, '_blank');
      }
    } catch {
      handleDownload(inv);
      window.open(waUrl, '_blank');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleEmail = async (inv) => {
    const subject = encodeURIComponent(`Invoice for ${inv.projectName}`);
    const body = encodeURIComponent(`Hello ${inv.customerName},\n\nPlease find the attached invoice.\n\nRegards,\n${profile?.agentName || 'PropEmpire'}`);
    setIsGeneratingPdf(true);
    try {
      const blob = await genPdf(inv);
      const file = new File([blob], `Invoice_${inv.customerName?.replace(/\s+/g, '_')}.pdf`, { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Invoice' });
      } else {
        handleDownload(inv);
        window.location.href = `mailto:${inv.customerEmail || ''}?subject=${subject}&body=${body}`;
      }
    } catch {
      handleDownload(inv);
      window.location.href = `mailto:${inv.customerEmail || ''}?subject=${subject}&body=${body}`;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDelete = async (inv) => {
    if (window.confirm(`Delete invoice #${inv.invoiceNo} for ${inv.customerName}?`)) {
      try {
        await deleteInvoice(inv.id);
        loadInvoices();
      } catch { alert('Failed to delete invoice'); }
    }
  };

  const handleExport = () => {
    if (!filteredInvoices.length) return alert('No invoices to export');
    const data = filteredInvoices.map(inv => ({
      'Invoice No': inv.invoiceNo,
      'Date': inv.date ? new Date(inv.date).toLocaleDateString('en-GB') : '',
      'Customer': inv.customerName,
      'Project': inv.projectName,
      'Tower': inv.tower || '',
      'Flat': inv.flatNo || '',
      'Agreement Value': Number(inv.agreementValue),
      'Brokerage %': inv.brokeragePercent,
      'Brokerage Amt': calcBroker(inv),
      'Bonus': Number(inv.executiveBonus) || 0,
      'Total': calcTotal(inv),
    }));
    exportRowsToXlsx({ rows: data, sheetName: 'Invoices', fileName: `Invoices_${selectedMonth}.xlsx` });
  };

  const monthLabel = new Date(selectedMonth + '-01').toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-16">
        <h1 style={{ margin: 0 }}>Deals</h1>
      </div>

      <div className="flex items-center gap-8 mb-16">
        <div className="flex items-center gap-8" style={{ background: 'var(--bg)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
          <Calendar size={16} style={{ color: 'var(--primary)' }} />
          <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 600, fontSize: 14, color: 'var(--text)' }} />
        </div>
        <button className="btn btn-secondary" onClick={handleExport} style={{ padding: '6px 12px', fontSize: 12 }}>
          <FileText size={14} /> Export
        </button>
      </div>

      <div className="card mb-16" style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
        <div className="flex items-center gap-12">
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: 10 }}>
            <DollarSign size={24} />
          </div>
          <div>
            <div className="text-sm" style={{ opacity: 0.9 }}>Revenue ({monthLabel})</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>₹ {Math.round(totalRevenue).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <FileText size={40} />
            <p>No invoices this month</p>
          </div>
        ) : (
          <div>
            {filteredInvoices.map(inv => (
              <div key={inv.id} className="invoice-row" style={{ padding: '12px 16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="flex items-center gap-8">
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{inv.customerName}</span>
                    <span className="badge badge-blue">#{inv.invoiceNo}</span>
                  </div>
                  <div className="text-sm text-muted">{inv.projectName} • {new Date(inv.date).toLocaleDateString('en-GB')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="amount">₹ {Math.round(calcTotal(inv)).toLocaleString('en-IN')}</div>
                  <div className="flex gap-8" style={{ marginTop: 4, justifyContent: 'flex-end' }}>
                    <button onClick={() => setViewingInvoice(inv)} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: 11 }}><Eye size={12} /></button>
                    <button onClick={() => onEditInvoice?.(inv)} className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: 11, color: 'var(--primary)' }}><Edit2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {viewingInvoice && profile && (
        <div className="modal-overlay" onClick={() => setViewingInvoice(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-16">
              <h2>Invoice #{viewingInvoice.invoiceNo}</h2>
              <button onClick={() => setViewingInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>
            <div className="grid-2">
              <button className="btn btn-primary" onClick={() => handleDownload(viewingInvoice)} disabled={isGeneratingPdf}>
                <Download size={16} /> Save PDF
              </button>
              <button className="btn btn-primary" onClick={() => handleView(viewingInvoice)} disabled={isGeneratingPdf} style={{ background: '#f59e0b' }}>
                <Eye size={16} /> View
              </button>
              <button className="btn btn-success" onClick={() => handleWhatsApp(viewingInvoice)} disabled={isGeneratingPdf}>
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button className="btn btn-secondary" onClick={() => handleEmail(viewingInvoice)} disabled={isGeneratingPdf}>
                <Mail size={16} /> Email
              </button>
            </div>
          </div>
        </div>
      )}

      {isGeneratingPdf && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center' }}>
            <p>Generating PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
}
