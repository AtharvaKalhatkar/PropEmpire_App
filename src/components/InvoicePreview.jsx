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
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
      color: '#111827',
      width: '100%',
      minWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      lineHeight: '1.4',
      border: '1px solid #4b5563', // Outer border matching the image
      boxSizing: 'border-box'
    },
    watermark: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${logoImg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center 50%',
      backgroundSize: '60%',
      opacity: 0.04, // Very faint watermark
      pointerEvents: 'none',
      zIndex: 0
    },
    content: {
      position: 'relative',
      zIndex: 1
    },
    headerBox: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 30px'
    },
    logoImage: {
      maxHeight: '100px',
      maxWidth: '220px',
      objectFit: 'contain'
    },
    agentSection: {
      textAlign: 'right'
    },
    agentName: {
      fontSize: '26px',
      fontWeight: '800',
      color: '#0f4c81',
      textTransform: 'uppercase',
      marginBottom: '6px',
      letterSpacing: '0.5px'
    },
    agentContactRow: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#0f4c81',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '4px',
      marginBottom: '2px'
    },
    taxBanner: {
      backgroundColor: '#86aeb9', // Teal color from the image
      color: '#000000',
      textAlign: 'center',
      fontWeight: '800',
      fontSize: '20px',
      padding: '8px 0',
      borderTop: '2px solid #374151',
      borderBottom: '2px solid #374151',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    invoiceMetaRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 30px',
      borderBottom: '2px solid #374151',
      fontWeight: '700',
      fontSize: '14px'
    },
    toSection: {
      padding: '10px 30px',
      borderBottom: '1px solid #374151',
      fontSize: '12px'
    },
    detailsBlock: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 30px',
      borderBottom: '1px solid #374151',
      fontSize: '10px',
      fontWeight: '600',
      lineHeight: '1.4'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    },
    th: {
      borderBottom: '2px solid #374151',
      borderRight: '1px solid #374151',
      padding: '12px 10px',
      fontWeight: '800',
      fontSize: '14px',
      textAlign: 'center'
    },
    thLast: {
      borderBottom: '2px solid #374151',
      padding: '12px 10px',
      fontWeight: '800',
      fontSize: '14px',
      textAlign: 'center'
    },
    td: {
      borderRight: '1px solid #374151',
      padding: '10px',
      verticalAlign: 'top'
    },
    tdLast: {
      padding: '10px',
      verticalAlign: 'top',
      textAlign: 'center',
      fontWeight: '700',
      fontSize: '14px'
    },
    particularsGrid: {
      display: 'grid',
      gridTemplateColumns: '150px auto',
      gap: '4px 12px',
      marginTop: '15px',
      paddingLeft: '20px',
      fontSize: '12px'
    },
    totalsRow: {
      borderTop: '2px solid #374151',
      borderBottom: '1px solid #374151'
    },
    totalsLabel: {
      padding: '10px',
      textAlign: 'center',
      fontWeight: '800',
      fontSize: '15px'
    },
    amountWords: {
      padding: '8px 30px',
      borderBottom: '1px solid #374151',
      textAlign: 'center',
      fontWeight: '500',
      fontSize: '13px'
    },
    footerSection: {
      padding: '15px 30px',
      fontSize: '11px',
      lineHeight: '1.6'
    },
    bankRow: {
      display: 'grid',
      gridTemplateColumns: '140px auto',
      gap: '8px',
      marginTop: '6px'
    },
    signatureBox: {
      textAlign: 'center',
      marginTop: '-20px', // Pull it up a bit to align with bank details horizontally
      float: 'right',
      width: '300px'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.watermark}></div>
      
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.headerBox}>
          <div style={{ flex: 1 }}>
            <img src={logoImg} alt="PropEmpire" style={styles.logoImage} />
          </div>
          
          <div style={styles.agentSection}>
            <div style={styles.agentName}>{profile.agentName || 'SAURABH SHIVAJI GADE'}</div>
            <div style={styles.agentContactRow}>
              <span style={{ color: '#111827' }}>Email id :-</span> {profile.email || 'saurabhgade32@gmail.com'}
            </div>
            <div style={styles.agentContactRow}>
              <span style={{ color: '#111827' }}>Mobile :-</span> {profile.mobile || '9730953309'}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div style={styles.taxBanner}>TAX INVOICE</div>

        {/* Invoice Meta */}
        <div style={styles.invoiceMetaRow}>
          <div>Invoice No :- {data.invoiceNo}</div>
          <div>Date :- {data.date ? new Date(data.date).toLocaleDateString('en-GB') : ''}</div>
        </div>

        {/* Bill To */}
        <div style={styles.toSection}>
          <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
            To - <span style={{ fontWeight: '600' }}>{data.customerName || 'Client Name'}</span>
          </div>
          <div style={{ paddingLeft: '32px', color: '#374151', lineHeight: '1.5' }}>
            {data.billedToAddress && <div>{data.billedToAddress}</div>}
            {data.billedToGstin && <div style={{ fontWeight: '700', marginTop: '4px', color: '#000' }}>GSTIN : {data.billedToGstin}</div>}
          </div>
        </div>

        {/* Channel Partner Details Block */}
        <div style={styles.detailsBlock}>
          <div>
            <div>• Channel Partner REAP ID : NA</div>
            <div>• Channel Partner GaTIN : NA</div>
            <div>• Service Account Code : MAHARASHTRA</div>
            <div style={{ fontSize: '9px', fontStyle: 'italic', marginTop: '2px' }}>
              ( Building sales on a fee / commission basis or contract basis )<br/>
              Place of flat sold ( it should mention state where service is rendered )
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div>Channel Partner Rera No :- <span style={{ fontWeight: '500' }}>{profile.reraNo || 'NA'}</span></div>
            <div style={{ marginTop: '8px' }}>Channel Partner Pan No :- <span style={{ fontWeight: '500' }}>{profile.panNo || 'NA'}</span></div>
          </div>
        </div>

        {/* Main Table */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: '60px' }}>Sr.No</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Particulars</th>
              <th style={{ ...styles.th, width: '100px' }}>Tax Rate</th>
              <th style={styles.thLast}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>1.</td>
              <td style={styles.td}>
                <div style={{ fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', backgroundColor: '#000' }}></div>
                  Description of service provided
                </div>
                
                <div style={styles.particularsGrid}>
                  <div>Customer Name</div>
                  <div>:- {data.customerName}</div>
                  
                  <div>Project Name.</div>
                  <div>:- {data.projectName}</div>
                  
                  <div>Tower</div>
                  <div>:- {data.tower}</div>
                  
                  <div>Flat No</div>
                  <div>:- {data.flatNo}</div>
                  
                  <div>Agreement Value (AV)</div>
                  <div>:- {Number(data.agreementValue).toLocaleString('en-IN')} /-</div>
                  
                  <div>Brokerage</div>
                  <div>:- {data.brokeragePercent} %</div>
                </div>
              </td>
              <td style={{ ...styles.td, textAlign: 'center', fontWeight: '800', fontSize: '14px', verticalAlign: 'middle' }}>
                {data.brokeragePercent} %
              </td>
              <td style={{ ...styles.tdLast, verticalAlign: 'bottom' }}>
                <div style={{ borderBottom: '1px solid #000', paddingBottom: '4px', marginBottom: '4px' }}>
                  {brokerageAmount.toLocaleString('en-IN')} /-
                </div>
                <div>{brokerageAmount.toLocaleString('en-IN')} /-</div>
              </td>
            </tr>
            
            {Number(data.executiveBonus) > 0 && (
              <tr>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '600' }}>2.</td>
                <td style={styles.td}>
                  <div style={{ display: 'grid', gridTemplateColumns: '150px auto', gap: '12px', paddingLeft: '20px' }}>
                    <div>Executive Bonus</div>
                    <div>:- {Number(data.executiveBonus).toLocaleString('en-IN')} /-</div>
                  </div>
                </td>
                <td style={styles.td}></td>
                <td style={{ ...styles.tdLast, verticalAlign: 'middle' }}>
                  {Number(data.executiveBonus).toLocaleString('en-IN')} /-
                </td>
              </tr>
            )}

            <tr style={styles.totalsRow}>
              <td colSpan="3" style={{ ...styles.td, ...styles.totalsLabel, borderRight: '1px solid #374151' }}>
                Total
              </td>
              <td style={{ ...styles.tdLast, fontWeight: '800', fontSize: '16px' }}>
                {totalAmount.toLocaleString('en-IN')}/-
              </td>
            </tr>
          </tbody>
        </table>

        {/* Amount in words */}
        <div style={styles.amountWords}>
          Amount in words :- {numberToWords(totalAmount)}
        </div>

        {/* Footer */}
        <div style={styles.footerSection}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px auto', gap: '8px', fontWeight: '700', fontSize: '12px', marginBottom: '15px' }}>
            <div>Channel Partner Cheque favouring Name</div>
            <div>: {profile.bankFavouringName}</div>
            
            <div style={{ color: '#4b5563', fontWeight: '600' }}>As Per RERA Certificate Name</div>
            <div style={{ color: '#4b5563', fontWeight: '600' }}>: {profile.agentName}</div>
          </div>
          
          <div style={{ fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>
            For NEFT / RTGS - Bank A/C details.........
          </div>
          
          <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: '#374151', marginBottom: '15px' }}>
            <div>Bank Name & Address :-</div>
            <div>{profile.bankName}</div>
          </div>

          <div style={styles.bankRow}>
            <div style={{ fontWeight: '800' }}>Account Type</div>
            <div style={{ fontWeight: '800' }}>: {profile.accountType}</div>
            
            <div style={{ fontWeight: '800' }}>Account No</div>
            <div style={{ fontWeight: '800' }}>: {profile.accountNo}</div>
            
            <div style={{ fontWeight: '800' }}>IFSC Code</div>
            <div style={{ fontWeight: '800' }}>: {profile.ifscCode}</div>
          </div>

          <div style={styles.signatureBox}>
            <div style={{ fontWeight: '700', fontSize: '12px' }}>(Stampandsignatureofchannelpartner)</div>
            <div style={{ fontWeight: '800', fontSize: '12px', marginTop: '4px' }}>Authorised Signatory</div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
