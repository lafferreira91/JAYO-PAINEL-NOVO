import React, { useState } from 'react';
import { Invoice } from '../types';
import { Plus, Search, Check, AlertCircle, Clock, Trash2, Filter } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
  onAddInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  onDeleteInvoice: (id: string) => void;
  onToggleStatus: (id: string) => void;
  searchQuery: string;
}

export default function InvoiceTable({ 
  invoices, 
  onAddInvoice, 
  onDeleteInvoice, 
  onToggleStatus,
  searchQuery 
}: InvoiceTableProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PAID' | 'OVERDUE' | 'PENDING'>('ALL');
  
  // States for new invoice form
  const [formData, setFormData] = useState({
    invoiceNo: '',
    clientName: '',
    clientEmail: '',
    amount: '',
    status: 'PAID' as 'PAID' | 'OVERDUE' | 'PENDING',
    dateCreated: ''
  });

  const [formError, setFormError] = useState('');

  // Handle addition
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.invoiceNo || !formData.clientName || !formData.amount) {
      setFormError('Please fill up all required fields.');
      return;
    }
    
    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('Please enter a valid valid amount.');
      return;
    }

    const defaultDate = formData.dateCreated 
      ? new Date(formData.dateCreated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    onAddInvoice({
      invoiceNo: formData.invoiceNo.toUpperCase(),
      dateCreated: defaultDate,
      client: {
        name: formData.clientName,
        email: formData.clientEmail || 'client@example.com'
      },
      amount: parsedAmount,
      status: formData.status
    });

    // Reset formData
    setFormData({
      invoiceNo: '',
      clientName: '',
      clientEmail: '',
      amount: '',
      status: 'PAID',
      dateCreated: ''
    });
    setIsAdding(false);
    setFormError('');
  };

  const generateRandomInvoiceNumber = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let seq = '';
    for (let i = 0; i < 2; i++) seq += letters.charAt(Math.floor(Math.random() * letters.length));
    seq += '-';
    for (let i = 0; i < 4; i++) seq += numbers.charAt(Math.floor(Math.random() * numbers.length));
    seq += letters.charAt(Math.floor(Math.random() * letters.length));
    setFormData(prev => ({ ...prev, invoiceNo: seq }));
  };

  // Filter invoices based on Search Query and Status Filter
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#f1f3f7] select-none h-full flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#111827] tracking-tight">Recent Invoices</h3>
            <p className="text-xs text-gray-400 font-medium">Manage and generate invoice records</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter Pill Bar */}
            <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 gap-1">
              {(['ALL', 'PAID', 'OVERDUE', 'PENDING'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    statusFilter === filter
                      ? 'bg-white text-[#1a56db] shadow-xs font-semibold'
                      : 'text-gray-400 hover:text-gray-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Trigger Button */}
            <button
              onClick={() => {
                setIsAdding(true);
                generateRandomInvoiceNumber();
              }}
              className="bg-[#1a56db] text-white hover:bg-blue-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Create Invoice Popup Drawer/Modal */}
        {isAdding && (
          <div className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-50 max-w-md w-full overflow-hidden animate-[#fade-in_0.2s_ease-out]">
              <div className="bg-[#1a56db] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold">New Invoice Creator</h4>
                  <p className="text-xs text-blue-100">Add an invoice directly to Invo</p>
                </div>
                <button 
                  onClick={() => { setIsAdding(false); setFormError(''); }}
                  className="text-white bg-white/10 hover:bg-white/20 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {formError && (
                  <p className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 p-2.5 rounded-lg">
                    {formError}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Invoice Number *</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        placeholder="PQ-4491C"
                        value={formData.invoiceNo}
                        onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                        className="w-full text-sm font-semibold tracking-wide uppercase px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Issue Date</label>
                    <input 
                      type="date" 
                      value={formData.dateCreated}
                      onChange={(e) => setFormData({ ...formData, dateCreated: e.target.value })}
                      className="w-full text-sm font-medium px-3 py-1.5 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Client Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Daniel Padilla"
                    value={formData.clientName}
                    required
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full text-sm font-semibold px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Client Email</label>
                  <input 
                    type="email" 
                    placeholder="e.g. daniel@padilla.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full text-sm font-medium px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Amount ($ USD) *</label>
                    <input 
                      type="number" 
                      placeholder="2450"
                      value={formData.amount}
                      required
                      min="1"
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full text-sm font-semibold px-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full text-sm font-semibold px-2 py-2 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="OVERDUE">OVERDUE</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-50">
                  <button 
                    type="button"
                    onClick={() => { setIsAdding(false); setFormError(''); }}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 px-4 py-2 hover:bg-gray-50 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#1a56db] text-white hover:bg-blue-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer shadow-sm"
                  >
                    Generate Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tablet / Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#f1f3f7] text-[12px] font-bold text-[#9ca3af] uppercase tracking-wider">
                <th className="py-4 font-semibold">No</th>
                <th className="py-4 font-semibold">Date Created</th>
                <th className="py-4 font-semibold">Client</th>
                <th className="py-4 font-semibold">Amount</th>
                <th className="py-4 font-semibold">Status</th>
                <th className="py-4 font-semibold text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr 
                    key={inv.id} 
                    className="border-b border-gray-100/70 text-[14px] text-gray-700 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Invoice ID / No */}
                    <td className="py-4 font-bold text-gray-900 tracking-tight">
                      {inv.invoiceNo}
                    </td>

                    {/* Date Created */}
                    <td className="py-4 text-[#4b5563] font-medium">
                      {inv.dateCreated}
                    </td>

                    {/* Client */}
                    <td className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#1a56db]/5 text-[#1a56db] flex items-center justify-center font-bold text-xs">
                          {inv.client.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{inv.client.name}</span>
                          <span className="text-[11px] text-gray-400 font-medium -mt-0.5">{inv.client.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 font-bold text-gray-900">
                      ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}
                    </td>

                    {/* Status with dynamic design badge */}
                    <td className="py-4">
                      <button 
                        onClick={() => onToggleStatus(inv.id)}
                        title="Click to cycle status"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                          inv.status === 'PAID'
                            ? 'bg-[#12b76a]/10 text-[#12b76a]'
                            : inv.status === 'OVERDUE'
                            ? 'bg-[#f43f5e]/10 text-[#f43f5e]'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {inv.status === 'PAID' && <Check className="w-3 h-3" strokeWidth={3} />}
                        {inv.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                        {inv.status === 'PENDING' && <Clock className="w-3 h-3" />}
                        <span>{inv.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 text-right pr-2">
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        className="p-1 px-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 font-semibold text-sm">
                    No invoicing logs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-gray-50 pt-3.5 flex items-center justify-between text-xs text-gray-400 font-medium">
        <span>Showing {filteredInvoices.length} entries</span>
        <span>Click statuses inside table to toggle</span>
      </div>
    </div>
  );
}
