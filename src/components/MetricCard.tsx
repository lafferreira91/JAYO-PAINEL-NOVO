import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Heart } from 'lucide-react';
import { Metric } from '../types';

interface MetricCardProps {
  key?: string;
  metric: Metric;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function MetricCard({ metric, isSelected, onSelect }: MetricCardProps) {
  // Config for each icon type based on exact design colors
  const iconConfigs = {
    revenue: {
      bgColor: 'bg-[#f06e5d]/10 text-[#f06e5d]',
      bgDot: 'bg-[#ee5e49]',
      icon: DollarSign,
    },
    invoices: {
      bgColor: 'bg-[#22c55e]/10 text-[#22c55e]',
      bgDot: 'bg-[#12b76a]',
      icon: FileText,
    },
    clients: {
      bgColor: 'bg-[#1e5adb]/10 text-[#1e5adb]',
      bgDot: 'bg-[#1e5adb]',
      icon: Users,
    },
    loyalty: {
      bgColor: 'bg-[#f43f5e]/10 text-[#f43f5e]',
      bgDot: 'bg-[#f43f5e]',
      icon: Heart,
    }
  };

  const config = iconConfigs[metric.iconType] || iconConfigs.revenue;
  const isTrendUp = metric.trendDirection === 'up';

  return (
    <div 
      onClick={onSelect}
      className={`bg-white rounded-2xl p-6 flex items-center justify-between border select-none transition-all duration-300 hover:shadow-md cursor-pointer ${
        isSelected ? 'border-[#1e5adb] ring-1 ring-[#1e5adb]' : 'border-[#f1f3f7]'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Visual Circle Indicator matching image exactly */}
        <div className="relative flex-shrink-0">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${config.bgColor}`}>
            <div className={`w-4 h-4 rounded-full ${config.bgDot} opacity-85`} />
          </div>
        </div>

        <div>
          <span className="text-[13.5px] font-semibold text-[#6b7280] block mb-1 tracking-wide">
            {metric.title}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] font-bold text-[#111827] tracking-tight">
              {metric.value}
            </span>
            {/* Trend Badge */}
            <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isTrendUp 
                ? 'bg-[#12b76a]/10 text-[#12b76a]' 
                : 'bg-[#f43f5e]/10 text-[#f43f5e]'
            }`}>
              {metric.trend}
              {isTrendUp ? ' ↗' : ' ↘'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
