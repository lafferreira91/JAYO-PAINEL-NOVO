import React from 'react';
import { PlayCircle, ShieldCheck, Mail, Send, Bell } from 'lucide-react';
import { Activity } from '../types';

interface ActivityLogProps {
  activities: Activity[];
  onClearActivities?: () => void;
}

export default function ActivityLog({ activities, onClearActivities }: ActivityLogProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#f1f3f7] select-none h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#111827] tracking-tight">Activities</h3>
          {onClearActivities && activities.length > 2 && (
            <button 
              onClick={onClearActivities}
              className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Timeline List */}
        <div className="relative pl-2">
          {activities.map((activity, index) => {
            const isLast = index === activities.length - 1;

            return (
              <div key={activity.id} className="relative flex gap-4 pb-6 group">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute left-[18px] top-9 bottom-0 w-0.5 bg-gray-100 group-hover:bg-blue-100 transition-colors" />
                )}

                {/* Avatar / Icon Container */}
                <div className="relative flex-shrink-0 z-10">
                  {activity.user && activity.user.avatarUrl ? (
                    <img
                      src={activity.user.avatarUrl}
                      alt={activity.user.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-white shadow-sm ${activity.iconBgColor}`}>
                      {activity.type === 'reminder' ? (
                        <Bell className="w-4 h-4 text-white" />
                      ) : (
                        <Send className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}

                  {/* Tiny Status Indicator Badge inside the avatar */}
                  {activity.type === 'new_invoice' && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center" />
                  )}
                </div>

                {/* Text Content */}
                <div className="flex flex-col pt-0.5">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Badge */}
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                      activity.type === 'new_invoice' 
                        ? 'bg-[#12b76a]/15 text-[#12b76a]'
                        : activity.type === 'reminder'
                        ? 'bg-amber-500/15 text-amber-600'
                        : 'bg-blue-500/15 text-blue-600'
                    }`}>
                      {activity.type === 'new_invoice' ? 'New Invoice' : activity.type === 'reminder' ? 'Reminder' : 'Log'}
                    </span>
                  </div>
                  <p className="text-[14px] text-gray-700 font-medium leading-relaxed">
                    <span className="font-bold text-gray-900">{activity.title}</span>{' '}
                    {activity.description}
                  </p>
                  <span className="text-xs font-semibold text-gray-400 mt-1">
                    {activity.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-50 pt-3.5 text-center">
        <span className="text-xs text-gray-400 font-medium tracking-wide block">
          Timeline updates reactively on operations
        </span>
      </div>
    </div>
  );
}
