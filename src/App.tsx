import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import MetricCard from './components/MetricCard';
import RevenueChart from './components/RevenueChart';
import ActivityLog from './components/ActivityLog';
import InvoiceTable from './components/InvoiceTable';
import { Invoice, Metric, Activity } from './types';
import { Search, Bell, Sparkles, User, Info, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  // App-level state for Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNo: 'PQ-4491C',
      dateCreated: '3 Jul, 2020',
      client: {
        name: 'Daniel Padilla',
        email: 'daniel@padilla.dev',
      },
      amount: 2450,
      status: 'PAID'
    },
    {
      id: '2',
      invoiceNo: 'IN-9911J',
      dateCreated: '21 May, 2021',
      client: {
        name: 'Christina Jacobs',
        email: 'c.jacobs@enterprise.co',
      },
      amount: 14810,
      status: 'OVERDUE'
    },
    {
      id: '3',
      invoiceNo: 'UV-2319A',
      dateCreated: '14 Apr, 2020',
      client: {
        name: 'Elizabeth Bailey',
        email: 'elizabeth@baileyinc.com',
      },
      amount: 450,
      status: 'PAID'
    }
  ]);

  // App-level state for Activities
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'act-1',
      type: 'new_invoice',
      title: 'Francisco Gibbs',
      description: 'created invoice PQ-4491C',
      time: 'Just Now',
      iconBgColor: 'bg-green-500',
      user: {
        name: 'Francisco Gibbs',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
      }
    },
    {
      id: 'act-2',
      type: 'reminder',
      title: 'Invoice JL-3432B',
      description: 'reminder was sent to Chester Corp',
      time: 'Friday, 12:26PM',
      iconBgColor: 'bg-amber-500'
    }
  ]);

  // Simulated download success alert
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Stats calculation
  const totalInvoicesCount = useMemo(() => {
    // Start with a large mock baseline of 2221, increment as new database records are added
    return 2221 + (invoices.length - 3);
  }, [invoices]);

  const totalRevenueValueFormatted = useMemo(() => {
    // Start with mock baseline of $216,000, add newly added invoice amounts
    const addedInvoiceAmount = invoices.slice(3).reduce((acc, current) => acc + current.amount, 0);
    const total = 216000 + addedInvoiceAmount;
    
    if (total >= 1000000) {
      return `$ ${(total / 1000000).toFixed(1)}m`;
    }
    return `$ ${(total / 1000).toFixed(0)}k`;
  }, [invoices]);

  const metrics: Metric[] = useMemo(() => [
    {
      id: 'metric-rev',
      title: 'Total Revenue',
      value: totalRevenueValueFormatted,
      trend: '+$341',
      trendDirection: 'up',
      iconType: 'revenue'
    },
    {
      id: 'metric-inv',
      title: 'Invoices',
      value: totalInvoicesCount.toLocaleString(),
      trend: '+121',
      trendDirection: 'up',
      iconType: 'invoices'
    },
    {
      id: 'metric-cli',
      title: 'Clients',
      value: '1,423',
      trend: '+91',
      trendDirection: 'up',
      iconType: 'clients'
    },
    {
      id: 'metric-loy',
      title: 'Loyalty',
      value: '78%',
      trend: '-1%',
      trendDirection: 'down',
      iconType: 'loyalty'
    }
  ], [totalRevenueValueFormatted, totalInvoicesCount]);

  // Add a new invoice handler
  const handleAddInvoice = (newInv: Omit<Invoice, 'id'>) => {
    const id = (Date.now()).toString();
    const invoiceRecord: Invoice = {
      ...newInv,
      id
    };

    setInvoices(prev => [invoiceRecord, ...prev]);

    // Push associated activity log
    const nameParts = newInv.client.name.split(' ');
    const firstName = nameParts[0] || 'Client';

    const activityRecord: Activity = {
      id: `act-${Date.now()}`,
      type: 'new_invoice',
      title: newInv.client.name,
      description: `created invoice ${newInv.invoiceNo}`,
      time: 'Just Now',
      iconBgColor: 'bg-green-500',
      user: {
        name: newInv.client.name,
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=120`
      }
    };

    setActivities(prev => [activityRecord, ...prev]);
    triggerToast(`Invoice ${newInv.invoiceNo} generated successfully for ${newInv.client.name}!`);
  };

  // Toggle invoice status
  const handleToggleStatus = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        const nextStatusMap: Record<'PAID' | 'OVERDUE' | 'PENDING', 'PAID' | 'OVERDUE' | 'PENDING'> = {
          PAID: 'PENDING',
          PENDING: 'OVERDUE',
          OVERDUE: 'PAID'
        };
        const nextStatus = nextStatusMap[inv.status];
        
        // Log activity regarding status change
        const activityRecord: Activity = {
          id: `act-${Date.now()}`,
          type: nextStatus === 'PAID' ? 'payment_received' : 'reminder',
          title: `Invoice ${inv.invoiceNo}`,
          description: `status cycled to ${nextStatus}`,
          time: 'Just Now',
          iconBgColor: nextStatus === 'PAID' ? 'bg-green-500' : 'bg-blue-500'
        };
        setActivities(acts => [activityRecord, ...acts]);
        triggerToast(`${inv.invoiceNo} status updated to ${nextStatus}`);

        return { ...inv, status: nextStatus };
      }
      return inv;
    }));
  };

  // Delete invoice
  const handleDeleteInvoice = (id: string) => {
    const target = invoices.find(i => i.id === id);
    if (!target) return;
    
    if (confirm(`Do you wish to delete the invoice log for ${target.invoiceNo}?`)) {
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      triggerToast(`Removed invoice file ${target.invoiceNo}`);
    }
  };

  const handleClearActivities = () => {
    setActivities([
      {
        id: 'act-1',
        type: 'new_invoice',
        title: 'Francisco Gibbs',
        description: 'created invoice PQ-4491C',
        time: 'Just Now',
        iconBgColor: 'bg-green-500',
        user: {
          name: 'Francisco Gibbs',
          avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
        }
      },
      {
        id: 'act-2',
        type: 'reminder',
        title: 'Invoice JL-3432B',
        description: 'reminder was sent to Chester Corp',
        time: 'Friday, 12:26PM',
        iconBgColor: 'bg-amber-500'
      }
    ]);
    triggerToast('Activities log reset to original mockup sequence');
  };

  // Trigger custom toast notification
  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Download Templates Simulation
  const handleDownloadClick = () => {
    if (downloadProgress !== null) return;
    
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null) {
          clearInterval(interval);
          return null;
        }
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadProgress(null);
            triggerToast('Invoice template bundle (.zip) saved to your device!');
          }, 60000 / 1000); // clear after brief pause
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-[#111827] flex flex-col md:flex-row font-sans">
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white border border-gray-800 rounded-2xl shadow-2xl p-4.5 flex items-center gap-3 max-w-sm animate-bounce text-sm">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          <span className="font-semibold">{showNotification}</span>
        </div>
      )}

      {/* Slide / Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Top Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/50 pb-5 select-none">
          {/* Search bar input linked directly to table filtering */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Tap to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-[14.5px] font-medium text-gray-800 placeholder-gray-400 border border-[#e5e7eb] rounded-xl pl-11 pr-4 py-2.5 outline-none focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] transition-all shadow-xs"
            />
          </div>

          {/* User profile details and notifications box */}
          <div className="flex items-center justify-end gap-6">
            {/* Bell Icon with badge 2 */}
            <button 
              onClick={() => triggerToast('You have secondary push reminders pending review.')}
              className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-white rounded-xl transition cursor-pointer"
            >
              <Bell className="w-5.5 h-5.5" />
              <span className="absolute top-1.5 right-1.5 w-[14px] h-[14px] bg-[#1a56db] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                2
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
                alt="David Spade"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#e5e7eb] flex-shrink-0"
              />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[14.5px] font-bold text-gray-900">David Spade</span>
                <span className="text-xs text-gray-400 font-semibold mt-0.5">Sales Admin</span>
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'home' ? (
          <>
            {/* Row 1: Metrics Counters */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {metrics.map((metric) => (
                <MetricCard 
                  key={metric.id} 
                  metric={metric}
                  onSelect={() => triggerToast(`Navigated metadata statistics for: ${metric.title}`)}
                />
              ))}
            </section>

            {/* Row 2: Monthly Revenue Chart + Campaign Widget */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Revenue Chart */}
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>

              {/* Campaign Widget (Promo Box) */}
              <div className="bg-gradient-to-tr from-[#1a56db] to-[#1e40af] text-white rounded-2xl p-6.5 flex flex-col justify-between relative overflow-hidden shadow-lg shadow-blue-100/50 group select-none min-h-[300px]">
                
                {/* Decorative glowing gradient bottom waves matching mockup */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-tr from-[#00c6ff]/35 to-transparent rounded-b-2xl pointer-events-none transform scale-y-110" />
                <div className="absolute -bottom-10 left-[-20%] w-[140%] h-40 bg-gradient-to-t from-[#06b6d4]/20 via-[#1d4ed8]/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4">
                  {/* "NEW" pill badge */}
                  <div>
                    <span className="inline-flex items-center text-[#1a56db] bg-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      NEW
                    </span>
                  </div>

                  {/* Headers */}
                  <h4 className="text-[25px] font-extrabold leading-tight tracking-tight">
                    We have added new invoicing templates!
                  </h4>

                  <p className="text-blue-100 text-[14px] leading-relaxed max-w-sm">
                    New templates focused on helping you improve your business.
                  </p>
                </div>

                {/* Simulated download state interaction */}
                <div className="pt-6 relative z-10">
                  {downloadProgress !== null ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-blue-100 font-bold">
                        <span>Downloading templates...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-blue-900/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                          style={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleDownloadClick}
                      className="w-full bg-white text-[#1a56db] hover:bg-blue-50 text-[14px] font-bold py-3 px-5 rounded-xl transition duration-300 transform active:scale-[0.98] shadow-md hover:shadow-lg text-center cursor-pointer block"
                    >
                      Download Now
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Row 3: Timeline Activities (Left) + Invoice Table Logs (Right) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Timeline Activities Column */}
              <div className="lg:col-span-1 h-full">
                <ActivityLog 
                  activities={activities} 
                  onClearActivities={handleClearActivities}
                />
              </div>

              {/* Recent Invoices Table Column */}
              <div className="lg:col-span-2">
                <InvoiceTable 
                  invoices={invoices}
                  onAddInvoice={handleAddInvoice}
                  onDeleteInvoice={handleDeleteInvoice}
                  onToggleStatus={handleToggleStatus}
                  searchQuery={searchQuery}
                />
              </div>
            </section>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-[#f1f3f7] select-none text-center py-20 space-y-4">
            <Info className="w-12 h-12 text-[#1a56db] mx-auto animate-pulse" />
            <h3 className="text-xl font-bold text-gray-900 uppercase">
              {activeTab} Module
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
              This panel is fully synthesized. All database operations from the 
              <strong> Invoices Creator </strong> and search filters seamlessly propagate to the statistics, revenue projections, and real-time feeds over on the <strong>Home Hub</strong>.
            </p>
            <button 
              onClick={() => setActiveTab('home')}
              className="mt-6 bg-[#1a56db] text-white px-5 py-2.5 text-xs font-bold rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 cursor-pointer"
            >
              Return to Home Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
