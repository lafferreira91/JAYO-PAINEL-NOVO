import React, { useState } from 'react';

export interface MonthData {
  month: string;
  value: number;
}

const MONTHS_DATA: MonthData[] = [
  { month: 'Mar', value: 8700 },
  { month: 'Apr', value: 11500 },
  { month: 'May', value: 5200 },
  { month: 'Jun', value: 15000 },
  { month: 'Jul', value: 9800 },
  { month: 'Aug', value: 11200 },
  { month: 'Sep', value: 7900 },
  { month: 'Oct', value: 12400 },
  { month: 'Nov', value: 10100 },
];

export default function RevenueChart() {
  const [selectedMonth, setSelectedMonth] = useState<string>('Jun');
  const activeData = MONTHS_DATA.find((item) => item.month === selectedMonth) || MONTHS_DATA[3];

  const maxValue = 15000;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#f1f3f7] select-none h-full flex flex-col justify-between relative">
      <div>
        <span className="text-[14px] font-bold text-[#6b7280] tracking-wide block mb-1">
          Monthly Revenue
        </span>
        <div className="text-[32px] font-extrabold text-[#111827] tracking-tight">
          $<span className="ml-1.5">{activeData.value.toLocaleString()}</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative pt-12 pb-2 px-1 flex items-end justify-between h-48 border-b border-[#fafafa]">
        {MONTHS_DATA.map((item, index) => {
          const isSelected = item.month === selectedMonth;
          const percentage = (item.value / maxValue) * 100;
          
          return (
            <div 
              key={item.month} 
              className="flex flex-col items-center flex-1 group cursor-pointer"
              onClick={() => setSelectedMonth(item.month)}
            >
              {/* Tooltip precisely floating above */}
              {isSelected && (
                <div className="absolute -top-1 animate-[#tooltip-bounce] transform -translate-y-full flex flex-col items-center z-10">
                  <div className="bg-[#111827] text-white font-bold text-[13px] px-3.5 py-2 rounded-xl shadow-lg border border-gray-800 tracking-wide text-center">
                    ${item.value.toLocaleString()}
                  </div>
                  {/* Small arrow pointing down */}
                  <div className="w-3 h-3 bg-[#111827] rotate-45 -mt-1.5 shadow-sm" />
                </div>
              )}

              {/* Bar */}
              <div className="w-full max-w-[36px] px-1 h-32 flex items-end justify-center">
                <div 
                  className={`w-full rounded-lg transition-all duration-300 relative ${
                    isSelected 
                      ? 'bg-[#1a56db] shadow-md shadow-blue-100' 
                      : 'bg-[#e5e7eb] hover:bg-gray-300'
                  }`}
                  style={{ height: `${percentage}%` }}
                />
              </div>

              {/* Month label */}
              <span className={`text-[12.5px] font-bold mt-3 transition-colors duration-200 ${
                isSelected ? 'text-[#111827] font-semibold' : 'text-[#9ca3af]'
              }`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Helper click instructions (humble, user-focused label) */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-medium">
        <span>Click any column to view specific metrics</span>
        <span className="text-[#1a56db] font-semibold">Invo Analytics Suite</span>
      </div>
    </div>
  );
}
