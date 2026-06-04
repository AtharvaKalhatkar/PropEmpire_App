import React from 'react';
import logoImg from '../assets/COMPANY_LOGO.png';

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
  return inWords(Math.round(num));
};

export default function InvoicePreview({ data, profile, brokerageAmount, totalAmount }) {
  // Use uploaded logo from profile if available, otherwise use default
  const displayLogo = profile?.logoImage || logoImg;

  // All inline styles for A4 PDF rendering — no external CSS dependency
  const s = {
    page: {
      width: '100%', height: '100%',
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      color: '#000', fontSize: '11px', lineHeight: 1.4,
      boxSizing: 'border-box',
      padding: '40px 40px', // Big A4 margin
      display: 'flex', flexDirection: 'column',
    },
    border: {
      border: '1.5px solid #000',
      display: 'flex', flexDirection: 'column',
      position: 'relative',
      boxSizing: 'border-box',
    },
    watermark: {
      position: 'absolute', top: '65%', left: '50%', transform: 'translate(-50%, -50%)',
      opacity: 0.1, pointerEvents: 'none', zIndex: 0,
      width: '500px', height: '500px',
    },
    watermarkImg: {
      width: '100%', height: '100%', objectFit: 'contain',
    },
    inner: {
      position: 'relative', zIndex: 1,
      display: 'flex', flexDirection: 'column',
    },

    // --- HEADER ---
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '12px 14px 8px 14px',
    },
    logo: { maxHeight: '80px', maxWidth: '180px', objectFit: 'contain' },
    agentBlock: { textAlign: 'right' },
    agentName: {
      fontSize: '26px', fontWeight: 'bold', color: '#1a4e7a', // Match the blue color in reference
      textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px',
    },
    agentContact: { fontSize: '12px', fontWeight: 'bold', color: '#1a4e7a', marginTop: '4px' }, // Blue color for contact too

    // --- TAX INVOICE BANNER ---
    banner: {
      backgroundColor: '#a3c3cc', textAlign: 'center',
      fontWeight: 'bold', fontSize: '20px', color: '#000',
      padding: '4px 0',
      borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000',
    },

    // --- META ROW ---
    metaRow: {
      display: 'flex', justifyContent: 'space-between',
      padding: '4px 14px', fontSize: '12px', fontWeight: 'bold',
      borderBottom: '1.5px solid #000',
    },

    // --- TO SECTION ---
    toBox: {
      padding: '6px 14px', fontSize: '11px', lineHeight: 1.4,
      borderBottom: '1.5px solid #000',
    },

    // --- CHANNEL PARTNER META ---
    cpRow: {
      display: 'flex', borderBottom: '1.5px solid #000', fontSize: '9px',
    },
    cpLeft: {
      flex: 1.3, padding: '4px 10px', borderRight: '1.5px solid #000', lineHeight: 1.3,
    },
    cpRight: {
      flex: 1, padding: '4px 10px', fontWeight: 'bold', lineHeight: 1.6, textAlign: 'right',
    },

    // --- TABLE ---
    table: {
      width: '100%',
      borderCollapse: 'collapse', fontSize: '11px',
    },
    th: {
      borderBottom: '1.5px solid #000', borderRight: '1.5px solid #000', padding: '6px 8px',
      fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff',
    },
    thLast: {
      borderBottom: '1.5px solid #000', padding: '6px 8px',
      fontWeight: 'bold', textAlign: 'center', backgroundColor: '#fff',
    },
    td: {
      borderRight: '1.5px solid #000', padding: '6px 10px',
      verticalAlign: 'top',
    },
    tdLast: {
      padding: '6px 10px',
      verticalAlign: 'top',
    },
    pItem: {
      display: 'grid', gridTemplateColumns: '130px 20px auto',
      margin: '3px 0', lineHeight: 1.4,
    },

    // --- FOOTER (OUTSIDE BORDER) ---
    footer: {
      display: 'flex', justifyContent: 'space-between',
      marginTop: '10px',
      fontSize: '11px', lineHeight: 1.5,
      paddingLeft: '2px', paddingRight: '10px'
    },
    bankBlock: { flex: 1.5 },
    sigBlock: {
      flex: 1, display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', alignItems: 'center', textAlign: 'center', fontWeight: 'bold',
      fontSize: '11px'
    },
  };

  return (
    <div style={s.page}>
      <div style={s.border}>
        {/* ======= WATERMARK LOGO (CENTER) ======= */}
        <div style={s.watermark}>
          <img src={displayLogo} alt="" style={s.watermarkImg} />
        </div>
        <div style={s.inner}>

          {/* ======= HEADER ======= */}
          <div style={s.header}>
            <img src={displayLogo} alt="PropEmpire" style={s.logo} />
            <div style={s.agentBlock}>
              <div style={s.agentName}>{profile?.agentName || 'SAURABH SHIVAJI GADE'}</div>
              <div style={s.agentContact}>Email id :- {profile?.email || 'saurabhgade32@gmail.com'}</div>
              <div style={s.agentContact}>Mobile :- {profile?.mobile || '9730953309'}</div>
            </div>
          </div>

          {/* ======= TAX INVOICE BANNER ======= */}
          <div style={s.banner}>TAX INVOICE</div>

          {/* ======= INVOICE NO / DATE ======= */}
          <div style={s.metaRow}>
            <div>Invoice No :- {data.invoiceNo}</div>
            <div>Date :- {data.date ? new Date(data.date).toLocaleDateString('en-GB') : ''}</div>
          </div>

          {/* ======= TO (BILLED TO) ======= */}
          <div style={s.toBox}>
            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
              To - {data.billedToName || data.customerName || ''}
            </div>
            {data.billedToAddress && (
              <div style={{ paddingLeft: '28px', whiteSpace: 'pre-line', marginTop: '1px' }}>
                {data.billedToAddress}
              </div>
            )}
            {data.billedToGstin && (
              <div style={{ paddingLeft: '28px', fontWeight: 'bold', marginTop: '3px' }}>
                GSTIN : {data.billedToGstin}
              </div>
            )}
          </div>

          {/* ======= CHANNEL PARTNER DETAILS ======= */}
          <div style={s.cpRow}>
            <div style={s.cpLeft}>
              <div style={{ fontWeight: 'bold' }}>• Channel Partner REAP ID : NA</div>
              <div style={{ fontWeight: 'bold' }}>• Channel Partner GaTIN &nbsp;&nbsp;: NA</div>
              <div style={{ fontWeight: 'bold' }}>• Service Account Code &nbsp;&nbsp;: MAHARASHTRA</div>
              <div style={{ fontSize: '7.5px', fontStyle: 'italic', color: '#333', marginTop: '2px' }}>
                ( Building sales on a fee i commission basis or contract basis )
              </div>
              <div style={{ fontSize: '7.5px', fontStyle: 'italic', color: '#333' }}>
                Place of flat sold ( it should mention state where service is rendered )
              </div>
            </div>
            <div style={s.cpRight}>
              <div>Channel Partner Rera No :- {profile?.reraNo || 'A52100041995'}</div>
              <div>Channel Partner Pan No :- {profile?.panNo || 'DDHPG6896K'}</div>
            </div>
          </div>

          {/* ======= MAIN TABLE ======= */}
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: '50px' }}>Sr.No</th>
                <th style={{ ...s.th, textAlign: 'left', paddingLeft: '12px' }}>Particulars</th>
                <th style={{ ...s.th, width: '80px' }}>Tax Rate</th>
                <th style={{ ...s.thLast, width: '120px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 — Main service */}
              <tr>
                <td style={{ ...s.td, textAlign: 'center', paddingTop: '14px', fontSize: '12px' }}>1.</td>
                <td style={s.td}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '9px' }}>■</span> Description of service provided
                  </div>
                  <div style={{ marginLeft: '12px', marginTop: '10px' }}>
                    <div style={s.pItem}><span>Customer Name</span><span>:-</span><span style={{ fontWeight: 'bold' }}>{data.customerName}</span></div>
                    <div style={s.pItem}><span>Project Name.</span><span>:-</span><span style={{ fontWeight: 'bold' }}>{data.projectName}</span></div>
                    <div style={s.pItem}><span>Tower</span><span>:-</span><span style={{ fontWeight: 'bold' }}>{data.tower}</span></div>
                    <div style={s.pItem}><span>Flat No</span><span>:-</span><span style={{ fontWeight: 'bold' }}>{data.flatNo}</span></div>
                    <div style={s.pItem}><span>Considerable Value</span><span>:-</span><span style={{ fontWeight: 'bold' }}>{Number(data.agreementValue).toLocaleString('en-IN')} /-</span></div>
                    <div style={s.pItem}><span>Brokerage</span><span>:-</span><span style={{ fontWeight: 'bold' }}>{data.brokeragePercent} %</span></div>
                  </div>
                </td>
                <td style={{ ...s.td, textAlign: 'center', fontWeight: 'bold', verticalAlign: 'middle', fontSize: '12px' }}>
                  {data.brokeragePercent} %
                </td>
                <td style={{ ...s.tdLast, padding: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '190px', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'right', fontWeight: 'bold', padding: '14px 10px 0 0', fontSize: '12px' }}>
                      {brokerageAmount.toLocaleString('en-IN')} /-
                    </div>
                    <div style={{ borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000', textAlign: 'right', fontWeight: 'bold', padding: '6px 10px', fontSize: '12px' }}>
                      {brokerageAmount.toLocaleString('en-IN')} /-
                    </div>
                  </div>
                </td>
              </tr>

              {/* Row 2 — Executive Bonus (conditional) */}
              {Number(data.executiveBonus) > 0 && (
                <tr>
                  <td style={{ ...s.td, textAlign: 'center', fontSize: '12px', paddingTop: '10px', paddingBottom: '14px' }}>2.</td>
                  <td style={{ ...s.td, fontWeight: 'bold', fontSize: '12px', paddingTop: '10px', paddingBottom: '14px' }}>
                    Executive Bonus &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number(data.executiveBonus).toLocaleString('en-IN')} /–
                  </td>
                  <td style={{ ...s.td, textAlign: 'center', paddingBottom: '14px' }}></td>
                  <td style={{ ...s.tdLast, textAlign: 'right', fontWeight: 'bold', fontSize: '12px', paddingTop: '10px', paddingBottom: '14px' }}>
                    {Number(data.executiveBonus).toLocaleString('en-IN')} /-
                  </td>
                </tr>
              )}

              {/* Total row */}
              <tr style={{ borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000' }}>
                <td style={{ ...s.td, borderRight: 'none' }}></td>
                <td style={{ ...s.td, borderLeft: 'none', borderRight: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>Total</td>
                <td style={{ ...s.td, borderLeft: 'none', borderRight: '1.5px solid #000' }}></td>
                <td style={{ ...s.tdLast, textAlign: 'right', fontWeight: 'bold', fontSize: '13px' }}>
                  {totalAmount.toLocaleString('en-IN')} /-
                </td>
              </tr>

              {/* Amount in words */}
              <tr>
                <td colSpan="4" style={{ fontWeight: 'bold', fontSize: '11px', padding: '6px 10px', textAlign: 'center' }}>
                  Amount in words :- {numberToWords(totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
