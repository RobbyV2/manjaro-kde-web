import { useState } from 'react';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { Icon } from '@/components/Icon';

interface CalendarWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarWidget = ({ isOpen, onClose }: CalendarWidgetProps) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  if (!isOpen) return null;

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDay = startOfMonth.day(); // 0 (Sunday) to 6 (Saturday)
  const daysInMonth = currentDate.daysInMonth();

  const prevMonth = currentDate.subtract(1, 'month');
  const daysInPrevMonth = prevMonth.daysInMonth();

  // Generate calendar grid cells
  const cells = [];
  
  // Previous month's padding days
  for (let i = 0; i < startDay; i++) {
    cells.push({
      day: daysInPrevMonth - startDay + i + 1,
      isCurrentMonth: false,
      date: prevMonth.date(daysInPrevMonth - startDay + i + 1)
    });
  }

  // Current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      day: i,
      isCurrentMonth: true,
      date: currentDate.date(i),
      isToday: dayjs().isSame(currentDate.date(i), 'day')
    });
  }

  // Next month's padding days (fill up to 42 cells - 6 rows)
  const remainingCells = 42 - cells.length;
  const nextMonth = currentDate.add(1, 'month');
  for (let i = 1; i <= remainingCells; i++) {
    cells.push({
      day: i,
      isCurrentMonth: false,
      date: nextMonth.date(i)
    });
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="absolute bottom-14 right-0 w-[20rem] bg-[#2b2e33] rounded shadow-[0_0_1rem_rgba(0,0,0,0.4)] p-4 z-50 text-white font-sans animate-in slide-in-from-bottom-2 duration-200">
       {/* Header */}
       <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setCurrentDate(prev => prev.subtract(1, 'month'))}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Icon name="arrow" size={16} className="rotate-90" />
          </button>
          <span className="font-medium text-lg select-none">
            {currentDate.format('MMMM YYYY')}
          </span>
          <button 
            onClick={() => setCurrentDate(prev => prev.add(1, 'month'))}
            className="p-1 hover:bg-white/10 rounded"
          >
             <Icon name="arrow" size={16} className="-rotate-90" />
          </button>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {/* Weekday Headers */}
          {weekDays.map(d => (
            <div key={d} className="text-gray-400 font-medium py-1">{d}</div>
          ))}

          {/* Days */}
          {cells.map((cell, idx) => (
            <div 
              key={idx}
              className={clsx(
                "h-8 flex items-center justify-center rounded cursor-default transition-colors border border-transparent",
                !cell.isCurrentMonth && "text-gray-600",
                cell.isCurrentMonth && "text-gray-200 hover:bg-[#44bbff]/20 hover:border-[#44bbff]",
                cell.isToday && "bg-[#44bbff] text-white font-bold hover:bg-[#44bbff]"
              )}
            >
               {cell.day}
            </div>
          ))}
       </div>
    </div>
  );
};
