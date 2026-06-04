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
  // Styles mirroring the specific layout requested but with clean, professional typography and borders
  const styles = {
    wrapper: {
      position: 'relative',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1f2937',
      width: '100%',
      minWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      lineHeight: '1.5',
      boxSizing: 'border-box',
      borderTop: '8px solid #0A2540' // Sleek top branding bar
    },
    watermark: {
      position: 'absolute',
      top: '20%',
      left: '15%',
      right: '15%',
      bottom: '20%',
      backgroundImage: `url(${logoImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      opacity: 0.03,
      pointerEvents: 'none',
      zIndex: 0
    },
    content: {
      position: 'relative',
      zIndex: 1,
      padding: '40px 48px' // Luxurious padding
    },
    headerBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '32px'
    },
    logoImage: {
      maxHeight: '75px',
      maxWidth: '220px',
      objectFit: 'contain'
    },
    agentSection: {
      textAlign: 'right'
    },
    agentName: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#0A2540',
      textTransform: 'uppercase',
      marginBottom: '6px',
      letterSpacing: '1px'
    },
    agentContactRow: {
      fontSize: '12px',
      color: '#4b5563',
      marginBottom: '2px'
    },
    taxBanner: {
      backgroundColor: '#f8fafc',
      color: '#0A2540',
      textAlign: 'left',
      fontWeight: '800',
      fontSize: '24px',
      padding: '12px 16px',
      borderLeft: '4px solid #D4AF37', // Gold accent
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    metaText: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#6b7280',
      letterSpacing: '0.5px'
    },
    metaValue: {
      color: '#111827',
      fontWeight: '700',
      fontSize: '14px'
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '32px',
      marginBottom: '32px'
    },
    box: {
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0'
    },
    boxTitle: {
      fontSize: '11px',
      textTransform: 'uppercase',
      fontWeight: '700',
      color: '#6b7280',
      marginBottom: '8px',
      letterSpacing: '1px'
    },
    customerName: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#0A2540',
      marginBottom: '4px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '24px',
      textAlign: 'left'
    },
    th: {
      backgroundColor: '#0A2540',
      color: '#ffffff',
      padding: '14px 16px',
      fontWeight: '600',
      fontSize: '13px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid #e2e8f0',
      verticalAlign: 'top'
    },
    particularsGrid: {
      display: 'grid',
      gridTemplateColumns: '140px auto',
      gap: '8px',
      marginTop: '12px',
      fontSize: '13px',
      color: '#374151'
    },
    totalsBox: {
      width: '100%',
      maxWidth: '350px',
      marginLeft: 'auto',
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      marginBottom: '32px'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingBottom: '12px',
      marginBottom: '12px',
      borderBottom: '1px solid #e2e8f0',
      fontSize: '14px',
      fontWeight: '500'
    },
    grandTotalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '18px',
      fontWeight: '800',
      color: '#0A2540'
    },
    amountWords: {
      padding: '12px 16px',
      backgroundColor: '#eff6ff', // Light blue
      borderLeft: '4px solid #3b82f6',
      fontWeight: '600',
      fontSize: '13px',
      color: '#1e3a8a',
      marginBottom: '40px'
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: '40px',
      paddingTop: '32px',
      borderTop: '2px solid #e2e8f0'
    },
    bankDetails: {
      fontSize: '12px',
      lineHeight: '1.6'
    },
    bankTitle: {
      fontSize: '13px',
      fontWeight: '700',
      color: '#0A2540',
      marginBottom: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    bankRow: {
      display: 'grid',
      gridTemplateColumns: '120px auto',
      gap: '8px',
      marginBottom: '4px'
    },
    signatureBox: {
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.watermark}></div>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.headerBox}>
          <div>
            <img src={logoImg} alt="PropEmpire" style={styles.logoImage} />
          </div>
          
          <div style={styles.agentSection}>
            <div style={styles.agentName}>{profile.agentName || 'SAURABH SHIVAJI GADE'}</div>
            <div style={styles.agentContactRow}>
              <strong>Email:</strong> {profile.email || 'saurabhgade32@gmail.com'}
            </div>
            <div style={styles.agentContactRow}>
              <strong>Mobile:</strong> {profile.mobile || '9730953309'}
            </div>
            {profile.reraNo && (
              <div style={styles.agentContactRow}>
                <strong>RERA No:</strong> {profile.reraNo}
              </div>
            )}
          </div>
        </div>

        {/* Banner with Invoice Info */}
        <div style={styles.taxBanner}>
          <div>TAX INVOICE</div>
          <div style={{ display: 'flex', gap: '32px', textAlign: 'right' }}>
            <div>
              <div style={styles.metaText}>INVOICE NO</div>
              <div style={styles.metaValue}>{data.invoiceNo}</div>
            </div>
            <div>
              <div style={styles.metaText}>DATE</div>
              <div style={styles.metaValue}>{data.date ? new Date(data.date).toLocaleDateString('en-GB') : ''}</div>
            </div>
          </div>
        </div>

        {/* Billed To & Channel Partner Details */}
        <div style={styles.grid2}>
          <div style={styles.box}>
            <div style={styles.boxTitle}>Billed To</div>
            <div style={styles.customerName}>
              {data.billedToName || data.customerName || 'Developer Name'}
            </div>
            <div style={{ color: '#4b5563', lineHeight: '1.6' }}>
              {data.billedToAddress && <div>{data.billedToAddress}</div>}
              {data.billedToGstin && <div style={{ marginTop: '8px' }}><strong>GSTIN:</strong> {data.billedToGstin}</div>}
            </div>
          </div>

          <div style={styles.box}>
            <div style={styles.boxTitle}>Channel Partner Details</div>
            <div style={{ color: '#4b5563', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>REAP ID:</span> <strong>NA</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GaTIN:</span> <strong>NA</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>SAC Code:</span> <strong>MAHARASHTRA</strong>
              </div>
              {profile.panNo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                  <span>PAN No:</span> <strong>{profile.panNo}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '50px', borderTopLeftRadius: '6px' }}>#</th>
              <th style={styles.th}>Particulars</th>
              <th style={{ ...styles.th, width: '120px', textAlign: 'center' }}>Tax Rate</th>
              <th style={{ ...styles.th, width: '160px', textAlign: 'right', borderTopRightRadius: '6px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...styles.td, fontWeight: '700', color: '#0A2540' }}>01</td>
              <td style={styles.td}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#0A2540', marginBottom: '8px' }}>
                  Description of service provided
                </div>
                
                <div style={styles.particularsGrid}>
                  <div style={{ fontWeight: '600' }}>Customer Name:</div>
                  <div>{data.customerName}</div>
                  
                  <div style={{ fontWeight: '600' }}>Project Name:</div>
                  <div>{data.projectName}</div>
                  
                  <div style={{ fontWeight: '600' }}>Tower & Flat:</div>
                  <div>{data.tower} - {data.flatNo}</div>
                  
                  <div style={{ fontWeight: '600' }}>Agreement Value:</div>
                  <div>₹ {Number(data.agreementValue).toLocaleString('en-IN')}</div>
                  
                  <div style={{ fontWeight: '600' }}>Brokerage Rate:</div>
                  <div>{data.brokeragePercent}%</div>
                </div>
              </td>
              <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600', verticalAlign: 'middle' }}>
                {data.brokeragePercent}%
              </td>
              <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', verticalAlign: 'middle', fontSize: '14px' }}>
                ₹ {brokerageAmount.toLocaleString('en-IN')}
              </td>
            </tr>
            
            {Number(data.executiveBonus) > 0 && (
              <tr>
                <td style={{ ...styles.td, fontWeight: '700', color: '#0A2540' }}>02</td>
                <td style={styles.td}>
                  <div style={{ fontWeight: '700', fontSize: '14px', color: '#0A2540' }}>
                    Executive Bonus
                  </div>
                </td>
                <td style={{ ...styles.td, textAlign: 'center' }}>-</td>
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600', fontSize: '14px' }}>
                  ₹ {Number(data.executiveBonus).toLocaleString('en-IN')}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Section */}
        <div style={styles.totalsBox}>
          <div style={styles.totalRow}>
            <span style={{ color: '#6b7280' }}>Subtotal</span>
            <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div style={styles.grandTotalRow}>
            <span>Total Amount</span>
            <span>₹ {totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Amount in words */}
        <div style={styles.amountWords}>
          Amount in words: {numberToWords(totalAmount)}
        </div>

        {/* Footer */}
        <div style={styles.footerGrid}>
          <div style={styles.bankDetails}>
            <div style={styles.bankTitle}>Bank Details for NEFT / RTGS</div>
            
            <div style={styles.bankRow}>
              <div style={{ color: '#6b7280' }}>Account Name:</div>
              <div style={{ fontWeight: '700' }}>{profile.bankFavouringName}</div>
            </div>
            
            <div style={styles.bankRow}>
              <div style={{ color: '#6b7280' }}>Bank Name & Addr:</div>
              <div style={{ fontWeight: '600' }}>{profile.bankName}</div>
            </div>
            
            <div style={styles.bankRow}>
              <div style={{ color: '#6b7280' }}>Account Type:</div>
              <div style={{ fontWeight: '600' }}>{profile.accountType}</div>
            </div>
            
            <div style={styles.bankRow}>
              <div style={{ color: '#6b7280' }}>Account No:</div>
              <div style={{ fontWeight: '700', color: '#0A2540' }}>{profile.accountNo}</div>
            </div>
            
            <div style={styles.bankRow}>
              <div style={{ color: '#6b7280' }}>IFSC Code:</div>
              <div style={{ fontWeight: '700', color: '#0A2540' }}>{profile.ifscCode}</div>
            </div>
          </div>

          <div style={styles.signatureBox}>
            <div style={{ height: '80px', borderBottom: '1px solid #000', width: '100%', marginBottom: '8px' }}>
              {/* Signature goes here */}
            </div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: '#0A2540' }}>Authorised Signatory</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
              As per RERA: {profile.agentName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
