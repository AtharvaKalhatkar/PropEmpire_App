import { useState, useRef } from 'react';
import { Image, Download, Share2, Plus, X, MapPin, Home, Bed, IndianRupee, Building2 } from 'lucide-react';
import logoImg from '../assets/COMPANY_LOGO.png';

const CARD_THEMES = [
  { name: 'Royal Blue', bg: 'linear-gradient(135deg, #0A2540 0%, #1a4e7a 50%, #0d3b66 100%)', accent: '#3b82f6', text: '#ffffff' },
  { name: 'Emerald', bg: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)', accent: '#34d399', text: '#ffffff' },
  { name: 'Midnight', bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', accent: '#818cf8', text: '#ffffff' },
  { name: 'Sunset', bg: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 50%, #9a3412 100%)', accent: '#fb923c', text: '#ffffff' },
  { name: 'Charcoal', bg: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%)', accent: '#f59e0b', text: '#ffffff' },
];

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
];

export default function PropertyCards() {
  const cardRef = useRef(null);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    config: '',
    price: '',
    highlight1: 'RERA Registered',
    highlight2: 'Ready to Move',
    tagline: 'Book Your Dream Home Today!',
  });

  const theme = CARD_THEMES[selectedTheme];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      const link = document.createElement('a');
      link.download = `PropEmpire_${formData.projectName.replace(/\s+/g, '_') || 'Property'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleShareCard = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });
      canvas.toBlob(async (blob) => {
        const file = new File([blob], `PropEmpire_${formData.projectName.replace(/\s+/g, '_') || 'Property'}.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: formData.projectName || 'PropEmpire Property',
            text: `🏠 ${formData.projectName}\n📍 ${formData.location}\n💰 ${formData.price}\n\nContact PropEmpire for details!`
          });
        } else {
          // Fallback: download + open WhatsApp
          const link = document.createElement('a');
          link.download = `PropEmpire_${formData.projectName.replace(/\s+/g, '_') || 'Property'}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
          alert('Image downloaded! You can now share it on WhatsApp, Instagram, or any platform.');
        }
        setIsSharing(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing:', err);
      setIsSharing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Property Cards</h1>
          <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Create & share beautiful property cards</p>
        </div>
      </div>

      {/* Card Preview */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div ref={cardRef} style={{ width: '360px', minHeight: '480px', borderRadius: '16px', overflow: 'hidden', background: theme.bg, color: theme.text, position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          
          {/* Property Image */}
          <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
            <img src={PROPERTY_IMAGES[selectedImage]} alt="Property" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: `linear-gradient(to top, ${theme.bg.includes('#0A2540') ? '#0A2540' : theme.bg.includes('#064e3b') ? '#064e3b' : theme.bg.includes('#1e1b4b') ? '#1e1b4b' : theme.bg.includes('#7c2d12') ? '#7c2d12' : '#1f2937'}, transparent)` }} />
            {/* Price Badge */}
            {formData.price && (
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: theme.accent, color: '#fff', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                ₹ {formData.price}
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: '20px 24px 16px' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>
              {formData.projectName || 'Project Name'}
            </h2>
            
            {formData.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', opacity: 0.85, fontSize: '0.85rem' }}>
                <MapPin size={14} /> {formData.location}
              </div>
            )}

            {/* Config & Details */}
            {formData.config && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {formData.config.split(',').map((c, i) => (
                  <span key={i} style={{ padding: '5px 12px', borderRadius: '8px', border: `1px solid ${theme.accent}40`, fontSize: '0.8rem', fontWeight: '600', backgroundColor: `${theme.accent}15` }}>
                    {c.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Highlights */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.8rem' }}>
              {formData.highlight1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: theme.accent }}>✓</span> {formData.highlight1}
                </div>
              )}
              {formData.highlight2 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: theme.accent }}>✓</span> {formData.highlight2}
                </div>
              )}
            </div>

            {/* Tagline */}
            {formData.tagline && (
              <p style={{ margin: '0 0 16px', fontSize: '0.9rem', fontWeight: '600', color: theme.accent, fontStyle: 'italic' }}>
                "{formData.tagline}"
              </p>
            )}
          </div>

          {/* Footer Branding */}
          <div style={{ padding: '12px 24px', borderTop: `1px solid ${theme.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src={logoImg} alt="Logo" crossOrigin="anonymous" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              <span style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '-0.01em' }}>PropEmpire</span>
            </div>
            <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>A Trusted Home Base</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '360px', margin: '0 auto 1.5rem' }}>
        <button className="btn btn-primary" onClick={handleDownloadCard} disabled={isSharing} style={{ justifyContent: 'center', gap: '0.5rem' }}>
          <Download size={18} /> {isSharing ? 'Processing...' : 'Download'}
        </button>
        <button className="btn btn-primary" onClick={handleShareCard} disabled={isSharing} style={{ justifyContent: 'center', gap: '0.5rem', backgroundColor: '#25D366', borderColor: '#25D366' }}>
          <Share2 size={18} /> Share
        </button>
      </div>

      {/* Theme Selector */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem', display: 'block' }}>Card Theme</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CARD_THEMES.map((t, i) => (
            <button key={i} onClick={() => setSelectedTheme(i)} style={{ width: '48px', height: '32px', borderRadius: '8px', background: t.bg, border: selectedTheme === i ? '3px solid var(--primary-blue)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s', transform: selectedTheme === i ? 'scale(1.1)' : 'scale(1)' }} title={t.name} />
          ))}
        </div>
      </div>

      {/* Image Selector */}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem', display: 'block' }}>Property Image</label>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {PROPERTY_IMAGES.map((img, i) => (
            <img key={i} src={img} alt={`Option ${i+1}`} onClick={() => setSelectedImage(i)} style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer', border: selectedImage === i ? '3px solid var(--primary-blue)' : '2px solid transparent', transition: 'all 0.2s', flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Property Details</h2>
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Project Name *</label>
            <input type="text" className="form-input" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="e.g. Royal Crown Estate" />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" className="form-input" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Baner, Pune" />
          </div>
          <div className="form-group">
            <label className="form-label">Configuration</label>
            <input type="text" className="form-input" name="config" value={formData.config} onChange={handleChange} placeholder="e.g. 1 BHK, 2 BHK, 3 BHK" />
          </div>
          <div className="form-group">
            <label className="form-label">Price</label>
            <input type="text" className="form-input" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 45L - 1.2Cr" />
          </div>
          <div className="form-group">
            <label className="form-label">Highlight 1</label>
            <input type="text" className="form-input" name="highlight1" value={formData.highlight1} onChange={handleChange} placeholder="e.g. RERA Registered" />
          </div>
          <div className="form-group">
            <label className="form-label">Highlight 2</label>
            <input type="text" className="form-input" name="highlight2" value={formData.highlight2} onChange={handleChange} placeholder="e.g. Ready to Move" />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Tagline</label>
            <input type="text" className="form-input" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="e.g. Book Your Dream Home Today!" />
          </div>
        </div>
      </div>
    </div>
  );
}
