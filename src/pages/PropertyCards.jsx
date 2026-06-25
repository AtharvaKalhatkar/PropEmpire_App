import { useState, useRef } from 'react';
import { Download, Share2, MapPin, CheckCircle2 } from 'lucide-react';
import logoImg from '../assets/COMPANY_LOGO.png';

const THEMES = [
  { name: 'Navy', bg: 'linear-gradient(145deg, #0f172a, #1e293b)', accent: '#c5a059', text: '#fff', cardBg: '#1e293b' },
  { name: 'Dark', bg: 'linear-gradient(145deg, #121212, #2a2a2a)', accent: '#d4af37', text: '#fff', cardBg: '#2a2a2a' },
  { name: 'White', bg: 'linear-gradient(145deg, #fff, #f1f5f9)', accent: '#b38b42', text: '#1e293b', cardBg: '#f8fafc' },
  { name: 'Green', bg: 'linear-gradient(145deg, #022c22, #064e3b)', accent: '#d4af37', text: '#fff', cardBg: '#064e3b' },
];

const IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
];

export default function PropertyCards() {
  const cardRef = useRef(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    projectName: '', location: '', config: '', price: '',
    highlight1: 'RERA Registered', highlight2: 'Premium Amenities', tagline: 'Experience Luxury Living',
  });

  const theme = THEMES[themeIdx];

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const generateImage = async () => {
    if (!cardRef.current) return null;
    const { default: html2canvas } = await import('html2canvas');
    return html2canvas(cardRef.current, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: null });
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const canvas = await generateImage();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `PropEmpire_${(form.projectName || 'Property').replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch { alert('Failed to generate'); } finally { setLoading(false); }
  };

  const handleShare = async () => {
    setLoading(true);
    try {
      const canvas = await generateImage();
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `PropEmpire_${(form.projectName || 'Property').replace(/\s+/g, '_')}.png`, { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: form.projectName || 'PropEmpire', text: `🏠 ${form.projectName}\n📍 ${form.location}\n💰 ${form.price}` });
        } else {
          const link = document.createElement('a');
          link.download = file.name;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
        setLoading(false);
      });
    } catch { setLoading(false); }
  };

  return (
    <div>
      <div className="mb-16">
        <h1>Share Cards</h1>
        <p>Premium property visuals for social media</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div ref={cardRef} style={{
          width: 360, borderRadius: 20, overflow: 'hidden', background: theme.bg, color: theme.text,
          position: 'relative', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.4)',
          fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif"
        }}>
          <div style={{ height: 5, background: theme.accent }} />
          <div style={{ height: 220, position: 'relative', overflow: 'hidden' }}>
            <img src={IMAGES[imgIdx]} alt="" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: `linear-gradient(to top, ${theme.cardBg}, transparent)` }} />
            {form.price && (
              <div style={{ position: 'absolute', bottom: 12, right: 16, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', color: theme.accent, padding: '6px 14px', borderRadius: 10, fontSize: 16, fontWeight: 800, border: `1px solid ${theme.accent}60` }}>
                ₹ {form.price}
              </div>
            )}
          </div>
          <div style={{ padding: '0 20px 16px', position: 'relative', zIndex: 2 }}>
            <h2 style={{ margin: '8px 0 2px', fontSize: 22, fontWeight: 800, color: theme.text }}>
              {form.projectName || 'Property Name'}
            </h2>
            {form.location && (
              <div className="flex items-center gap-8" style={{ fontSize: 12, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 16 }}>
                <MapPin size={14} color={theme.accent} /> {form.location}
              </div>
            )}
            {form.config && (
              <div className="flex gap-8 flex-wrap" style={{ marginBottom: 16 }}>
                {form.config.split(',').map((c, i) => (
                  <span key={i} style={{ padding: '4px 12px', borderRadius: 20, border: `1px solid ${theme.accent}40`, fontSize: 12, fontWeight: 700, background: `${theme.accent}15` }}>
                    {c.trim()}
                  </span>
                ))}
              </div>
            )}
            <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.9, marginBottom: 16 }}>
              {form.highlight1 && <div className="flex items-center gap-8 mb-8"><CheckCircle2 size={14} color={theme.accent} /> {form.highlight1}</div>}
              {form.highlight2 && <div className="flex items-center gap-8"><CheckCircle2 size={14} color={theme.accent} /> {form.highlight2}</div>}
            </div>
            {form.tagline && (
              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: theme.accent, fontStyle: 'italic', textAlign: 'center' }}>
                "{form.tagline}"
              </p>
            )}
          </div>
          <div style={{ padding: '12px 20px', background: 'rgba(0,0,0,0.15)', borderTop: `1px solid ${theme.accent}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <img src={logoImg} alt="" style={{ width: 24, height: 24, objectFit: 'contain', filter: theme.name === 'White' ? 'none' : 'brightness(0) invert(1)' }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.2 }}>PropEmpire</div>
              <div style={{ fontSize: 9, color: theme.accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Real Estate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-16">
        <button className="btn btn-secondary" onClick={handleDownload} disabled={loading}><Download size={16} /> Download</button>
        <button className="btn btn-primary" onClick={handleShare} disabled={loading} style={{ background: 'linear-gradient(135deg, #d4af37, #b38b42)', border: 'none' }}><Share2 size={16} /> Share</button>
      </div>

      <div className="card mb-16">
        <div className="section-title">Theme</div>
        <div className="flex gap-12">
          {THEMES.map((t, i) => (
            <div key={i} onClick={() => setThemeIdx(i)} style={{ cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.bg, border: themeIdx === i ? `3px solid ${t.accent}` : '2px solid transparent', transition: 'all 0.2s', transform: themeIdx === i ? 'scale(1.1)' : 'scale(1)' }} />
              <span style={{ fontSize: 10, fontWeight: 600, color: themeIdx === i ? 'var(--primary)' : 'var(--text-secondary)' }}>{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-16">
        <div className="section-title">Background Image</div>
        <div className="flex gap-8" style={{ overflowX: 'auto' }}>
          {IMAGES.map((img, i) => (
            <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
              style={{ width: 80, height: 55, objectFit: 'cover', borderRadius: 10, cursor: 'pointer', border: imgIdx === i ? '3px solid var(--primary)' : '2px solid transparent', flexShrink: 0 }} />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Property Details</div>
        <div className="form-grid-2">
          <div className="form-group"><label className="form-label">Project</label><input type="text" className="form-input" name="projectName" value={form.projectName} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Location</label><input type="text" className="form-input" name="location" value={form.location} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Config</label><input type="text" className="form-input" name="config" value={form.config} onChange={handleChange} placeholder="e.g. 2 BHK, 3 BHK" /></div>
          <div className="form-group"><label className="form-label">Price</label><input type="text" className="form-input" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 1.5 Cr" /></div>
          <div className="form-group"><label className="form-label">Highlight 1</label><input type="text" className="form-input" name="highlight1" value={form.highlight1} onChange={handleChange} /></div>
          <div className="form-group"><label className="form-label">Highlight 2</label><input type="text" className="form-input" name="highlight2" value={form.highlight2} onChange={handleChange} /></div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}><label className="form-label">Tagline</label><input type="text" className="form-input" name="tagline" value={form.tagline} onChange={handleChange} /></div>
        </div>
      </div>
    </div>
  );
}
