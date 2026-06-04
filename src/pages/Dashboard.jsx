import { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { getInvoices, getClients } from '../db';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({ earnings: 0, activeLeads: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const invoices = await getInvoices();
      const clients = await getClients();
      
      const totalEarnings = invoices.reduce((sum, inv) => {
        const broker = (Number(inv.agreementValue) * Number(inv.brokeragePercent)) / 100;
        return sum + broker + Number(inv.executiveBonus);
      }, 0);
      
      const activeLeads = clients.filter(c => c.status !== 'Closed').length;
      
      setStats({ earnings: totalEarnings, activeLeads });
      setRecentInvoices(invoices.slice(0, 3)); // top 3
    };
    
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ marginBottom: '0.5rem' }}>Overview</h1>
        <p>Welcome back! Here's your business at a glance.</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <TrendingUp size={20} />
            <h3 style={{ fontSize: '1rem', color: 'inherit' }}>Total Earnings</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-blue)', margin: 0 }}>₹ {stats.earnings.toLocaleString('en-IN')}</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <Users size={20} />
            <h3 style={{ fontSize: '1rem', color: 'inherit' }}>Active Leads</h3>
          </div>
          <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-blue)', margin: 0 }}>{stats.activeLeads}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => onNavigate('invoice')}
          >
            <PlusCircle size={20} />
            New Invoice
          </button>
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', justifyContent: 'flex-start' }}
            onClick={() => onNavigate('clients')}
          >
            <Users size={20} />
            Manage Clients
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Recent Invoices</h2>
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentInvoices.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No invoices generated yet.</p>
          ) : (
            recentInvoices.map(inv => {
              const broker = (Number(inv.agreementValue) * Number(inv.brokeragePercent)) / 100;
              const total = broker + Number(inv.executiveBonus);
              return (
                <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-main)' }}>{inv.customerName}</h4>
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>{inv.projectName} • Inv #{inv.invoiceNo}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: '600', color: 'var(--primary-blue)' }}>₹ {total.toLocaleString('en-IN')}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem' }}>{new Date(inv.date).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
