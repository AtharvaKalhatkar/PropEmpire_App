import { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, Users, MapPin, Image } from 'lucide-react';
import { getInvoices, getClients } from '../db';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({ earnings: 0, activeLeads: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);

  useEffect(() => {
    Promise.all([getInvoices(), getClients()]).then(([invoices, clients]) => {
      const totalEarnings = invoices.reduce((sum, inv) => {
        const broker = (Number(inv.agreementValue) * Number(inv.brokeragePercent)) / 100;
        return sum + broker + Number(inv.executiveBonus);
      }, 0);
      setStats({ earnings: totalEarnings, activeLeads: clients.filter(c => c.status !== 'Closed').length });
      setRecentInvoices(invoices.slice(0, 5));
    });
  }, []);

  const quickActions = [
    { icon: PlusCircle, label: 'New Invoice', color: '#2563eb', bg: '#eff6ff', tab: 'invoice' },
    { icon: MapPin, label: 'Log Visit', color: '#16a34a', bg: '#f0fdf4', tab: 'visited' },
    { icon: Users, label: 'Clients', color: '#ef4444', bg: '#fef2f2', tab: 'clients' },
    { icon: Image, label: 'Share Cards', color: '#ea580c', bg: '#fff7ed', tab: 'cards' },
  ];

  return (
    <div>
      <h1>Overview</h1>
      <p className="mb-16">Your business at a glance</p>

      <div className="grid-2 mb-20">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <div className="value">₹ {Math.round(stats.earnings).toLocaleString('en-IN')}</div>
        </div>
        <div className="stat-card-2">
          <h3>Active Leads</h3>
          <div className="value">{stats.activeLeads}</div>
        </div>
      </div>

      <div className="mb-20">
        <div className="section-title">Quick Actions</div>
        <div className="grid-2">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <button key={action.label} className="quick-action" onClick={() => onNavigate(action.tab)}>
                <div className="icon-wrap" style={{ background: action.bg, color: action.color }}>
                  <Icon size={24} />
                </div>
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="section-title">Recent Invoices</div>
        <div className="card">
          {recentInvoices.length === 0 ? (
            <div className="empty-state">
              <p>No invoices yet</p>
            </div>
          ) : (
            recentInvoices.map(inv => {
              const broker = (Number(inv.agreementValue) * Number(inv.brokeragePercent)) / 100;
              const total = broker + Number(inv.executiveBonus);
              return (
                <div key={inv.id} className="invoice-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{inv.customerName}</div>
                    <div className="text-sm text-muted">{inv.projectName} • #{inv.invoiceNo}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="amount">₹ {Math.round(total).toLocaleString('en-IN')}</div>
                    <div className="text-sm text-muted">{new Date(inv.date).toLocaleDateString('en-GB')}</div>
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
