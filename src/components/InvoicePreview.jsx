import React from 'react';
import logoImg from '../assets/hero.png';

const numberToWords = (num) => {
  if (num === 0) return 'Zero';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'overflow';
    let nArray = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArray) return; 
    let str = '';
    str += (nArray[1] != 0) ? (a[Number(nArray[1])] || b[nArray[1][0]] + ' ' + a[nArray[1][1]]) + 'Crore ' : '';
    str += (nArray[2] != 0) ? (a[Number(nArray[2])] || b[nArray[2][0]] + ' ' + a[nArray[2][1]]) + 'Lakh ' : '';
    str += (nArray[3] != 0) ? (a[Number(nArray[3])] || b[nArray[3][0]] + ' ' + a[nArray[3][1]]) + 'Thousand ' : '';
    str += (nArray[4] != 0) ? (a[Number(nArray[4])] || b[nArray[4][0]] + ' ' + a[nArray[4][1]]) + 'Hundred ' : '';
    str += (nArray[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(nArray[5])] || b[nArray[5][0]] + ' ' + a[nArray[5][1]]) : '';
    return str.trim();
  };
  return inWords(num) + ' Rupees Only';
};

export default function InvoicePreview({ data, profile, brokerageAmount, totalAmount }) {
  // Premium Corporate Invoice Styles
  const styles = {
    wrapper: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      color: '#374151',
      width: '100%',
      minWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      fontSize: '13px',
      lineHeight: '1.6',
      padding: '50px 60px',
      boxSizing: 'border-box'
    },
    headerBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '40px'
    },
    logoImage: {
      maxHeight: '70px',
      maxWidth: '220px',
      objectFit: 'contain',
      marginBottom: '15px'
    },
    companyMeta: {
      color: '#6b7280',
      fontSize: '12px',
      lineHeight: '1.5'
    },
    invoiceTitle: {
      fontSize: '42px',
      fontWeight: '300',
      color: '#111827',
      letterSpacing: '6px',
      textTransform: 'uppercase',
      margin: '0 0 15px 0',
      lineHeight: '1'
    },
    invoiceMetaGrid: {
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      gap: '8px 24px',
      justifyContent: 'end',
      textAlign: 'right'
    },
    metaLabel: {
      color: '#9ca3af',
      fontWeight: '600',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    metaValue: {
      color: '#111827',
      fontWeight: '600',
      fontSize: '13px'
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #e5e7eb',
      margin: '30px 0'
    },
    sectionLabel: {
      color: '#9ca3af',
      fontWeight: '700',
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px'
    },
    clientName: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '4px'
    },
    clientDetails: {
      color: '#4b5563',
      fontSize: '13px',
      lineHeight: '1.6'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '40px',
      marginBottom: '30px'
    },
    th: {
      borderBottom: '2px solid #111827',
      color: '#111827',
      padding: '12px 8px',
      textAlign: 'left',
      fontWeight: '700',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    thRight: {
      borderBottom: '2px solid #111827',
      color: '#111827',
      padding: '12px 8px',
      textAlign: 'right',
      fontWeight: '700',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: {
      padding: '24px 8px',
      borderBottom: '1px solid #f3f4f6',
      verticalAlign: 'top'
    },
    tdRight: {
      padding: '24px 8px',
      borderBottom: '1px solid #f3f4f6',
      verticalAlign: 'top',
      textAlign: 'right'
    },
    itemTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '6px'
    },
    itemDetail: {
      color: '#6b7280',
      fontSize: '13px',
      display: 'flex',
      gap: '4px'
    },
    totalsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginTop: '10px'
    },
    paymentInfoBox: {
      width: '50%',
      paddingRight: '40px'
    },
    totalsBox: {
      width: '350px'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 8px',
      color: '#4b5563',
      fontSize: '14px'
    },
    grandTotalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 8px',
      marginTop: '8px',
      borderTop: '2px solid #111827',
      borderBottom: '2px solid #111827',
      color: '#111827',
      fontWeight: '800',
      fontSize: '20px'
    },
    amountWords: {
      marginTop: '30px',
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '4px',
      borderLeft: '3px solid #cbd5e1'
    },
    signBox: {
      marginTop: '80px',
      display: 'flex',
      justifyContent: 'flex-end'
    },
    signLine: {
      width: '250px',
      borderTop: '1px solid #9ca3af',
      paddingTop: '8px',
      textAlign: 'center',
      color: '#4b5563',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }
  };

  return (
    <div style={styles.wrapper}>
      
      {/* Header Area */}
      <div style={styles.headerBox}>
        <div>
          <img src={logoImg} alt="PropEmpire" style={styles.logoImage} />
          <div style={styles.companyMeta}>
            {profile.agentName && <div style={{ fontWeight: '600', color: '#111827' }}>{profile.agentName}</div>}
            {profile.email && <div>{profile.email}</div>}
            {profile.mobile && <div>+91 {profile.mobile}</div>}
            {profile.reraNo && <div style={{ marginTop: '4px' }}>RERA: {profile.reraNo}</div>}
          </div>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <h1 style={styles.invoiceTitle}>Invoice</h1>
          <div style={styles.invoiceMetaGrid}>
            <div style={styles.metaLabel}>Invoice No</div>
            <div style={styles.metaValue}>{data.invoiceNo}</div>
            
            <div style={styles.metaLabel}>Date</div>
            <div style={styles.metaValue}>{data.date ? new Date(data.date).toLocaleDateString('en-GB') : ''}</div>
          </div>
        </div>
      </div>

      <hr style={styles.divider} />

      {/* Bill To */}
      <div>
        <div style={styles.sectionLabel}>Billed To</div>
        <div style={styles.clientName}>{data.customerName || 'Client Name'}</div>
        <div style={styles.clientDetails}>
          {data.billedToAddress && <div>{data.billedToAddress}</div>}
          {data.billedToGstin && <div style={{ marginTop: '4px', color: '#111827', fontWeight: '600' }}>GSTIN: {data.billedToGstin}</div>}
        </div>
      </div>

      {/* Items Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Description</th>
            <th style={styles.thRight}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}>
              <div style={styles.itemTitle}>Professional Real Estate Brokerage</div>
              <div style={styles.itemDetail}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Project:</span> {data.projectName}
              </div>
              <div style={styles.itemDetail}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Unit details:</span> {data.tower} - {data.flatNo}
              </div>
              <div style={styles.itemDetail}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Agreement Value:</span> ₹{Number(data.agreementValue).toLocaleString('en-IN')}
              </div>
              <div style={styles.itemDetail}>
                <span style={{ fontWeight: '600', color: '#374151' }}>Brokerage Fee:</span> {data.brokeragePercent}%
              </div>
            </td>
            <td style={{ ...styles.tdRight, fontWeight: '600', color: '#111827', fontSize: '15px' }}>
              ₹ {brokerageAmount.toLocaleString('en-IN')}
            </td>
          </tr>
          {Number(data.executiveBonus) > 0 && (
            <tr>
              <td style={styles.td}>
                <div style={styles.itemTitle}>Executive Bonus / Additional Services</div>
              </td>
              <td style={{ ...styles.tdRight, fontWeight: '600', color: '#111827', fontSize: '15px' }}>
                ₹ {Number(data.executiveBonus).toLocaleString('en-IN')}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Totals & Payments */}
      <div style={styles.totalsContainer}>
        
        <div style={styles.paymentInfoBox}>
          <div style={styles.sectionLabel}>Payment Instructions</div>
          <div style={{ color: '#4b5563', fontSize: '13px', lineHeight: '1.8' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
              <div style={{ fontWeight: '600', color: '#374151' }}>Bank Name:</div>
              <div>{profile.bankName || 'N/A'}</div>
              
              <div style={{ fontWeight: '600', color: '#374151' }}>Account Name:</div>
              <div>{profile.bankFavouringName || 'N/A'}</div>
              
              <div style={{ fontWeight: '600', color: '#374151' }}>Account No:</div>
              <div>{profile.accountNo || 'N/A'} ({profile.accountType || 'Saving'})</div>
              
              <div style={{ fontWeight: '600', color: '#374151' }}>IFSC Code:</div>
              <div>{profile.ifscCode || 'N/A'}</div>

              {profile.panNo && (
                <>
                  <div style={{ fontWeight: '600', color: '#374151' }}>PAN No:</div>
                  <div>{profile.panNo}</div>
                </>
              )}
            </div>
          </div>
          
          <div style={styles.amountWords}>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Amount in Words</div>
            <div style={{ fontStyle: 'italic', color: '#111827', fontWeight: '500' }}>{numberToWords(totalAmount)}</div>
          </div>
        </div>

        <div style={styles.totalsBox}>
          <div style={styles.totalRow}>
            <span>Subtotal</span>
            <span style={{ fontWeight: '600', color: '#111827' }}>₹ {totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={styles.grandTotalRow}>
            <span>Total Due</span>
            <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

      {/* Signatory */}
      <div style={styles.signBox}>
        <div style={styles.signLine}>
          Authorized Signatory
        </div>
      </div>

    </div>
  );
}
