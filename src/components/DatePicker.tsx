import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { gregorianToLunar, lunarToGregorian, formatLunarDateShort } from '../utils/lunarCalendar';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  calendarType: 'gregorian' | 'lunar';
  onCalendarTypeChange: (type: 'gregorian' | 'lunar') => void;
}

export default function DatePicker({
  value,
  onChange,
  calendarType,
  onCalendarTypeChange,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days: (number | null)[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push(-(daysInPrevMonth - i));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(null);
  }

  const handleDateClick = (day: number | null) => {
    if (day === null) return;

    let newDate: Date;

    if (day < 0) {
      newDate = new Date(currentYear, currentMonth - 1, daysInPrevMonth + day + 1);
    } else if (day > daysInMonth) {
      newDate = new Date(currentYear, currentMonth + 1, day - daysInMonth);
    } else {
      newDate = new Date(currentYear, currentMonth, day);
    }

    if (calendarType === 'lunar') {
      const gregorianDate = lunarToGregorian({
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
        day: newDate.getDate(),
        isLeap: false,
      });
      setSelectedDate(gregorianDate);
      onChange(gregorianDate.toISOString().split('T')[0]);
    } else {
      setSelectedDate(newDate);
      onChange(newDate.toISOString().split('T')[0]);
    }
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1));
  };

  const displayDate = new Date(selectedDate);
  const lunarDisplay =
    calendarType === 'lunar'
      ? formatLunarDateShort(gregorianToLunar(displayDate))
      : displayDate.toLocaleDateString('zh-CN');

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月',
  ];

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-transparent bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-lg focus:outline-none transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/50 flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon size={20} className="text-blue-400 group-hover:text-blue-300 transition-colors" />
          <div className="text-left">
            <div className="text-xs text-blue-400">{calendarType === 'lunar' ? '农历' : '公历'}</div>
            <div className="text-sm font-medium">{lunarDisplay}</div>
          </div>
        </div>
        <div className="text-xl text-blue-400 group-hover:rotate-180 transition-transform">⌄</div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-blue-500/50 rounded-lg shadow-2xl shadow-blue-500/20 p-4 z-50">
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => onCalendarTypeChange(calendarType === 'gregorian' ? 'lunar' : 'gregorian')}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:shadow-blue-500/50"
              >
                切换为{calendarType === 'gregorian' ? '农历' : '公历'}
              </button>
            </div>

            <div className="bg-slate-800/50 rounded-lg border border-blue-500/30 p-3">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center flex-1">
                  <div className="text-blue-300 font-semibold">
                    {currentYear}年 {monthNames[currentMonth]}
                  </div>
                  <div className="text-xs text-blue-400 mt-1">
                    {calendarType === 'gregorian' ? '公历' : '农历'}
                  </div>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-blue-300 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  let displayDay = '';
                  let isCurrentMonth = true;
                  let isSelected = false;
                  let isToday = false;

                  if (day === null) {
                    return (
                      <div key={`empty-${index}`} className="aspect-square" />
                    );
                  }

                  if (day < 0) {
                    displayDay = (daysInPrevMonth + day + 1).toString();
                    isCurrentMonth = false;
                  } else if (day > daysInMonth) {
                    displayDay = (day - daysInMonth).toString();
                    isCurrentMonth = false;
                  } else {
                    displayDay = day.toString();

                    const checkDate =
                      calendarType === 'lunar'
                        ? lunarToGregorian({
                            year: currentYear,
                            month: currentMonth + 1,
                            day,
                            isLeap: false,
                          })
                        : new Date(currentYear, currentMonth, day);

                    isSelected =
                      checkDate.getDate() === selectedDate.getDate() &&
                      checkDate.getMonth() === selectedDate.getMonth() &&
                      checkDate.getFullYear() === selectedDate.getFullYear();

                    const now = new Date();
                    isToday =
                      checkDate.getDate() === now.getDate() &&
                      checkDate.getMonth() === now.getMonth() &&
                      checkDate.getFullYear() === now.getFullYear();
                  }

                  return (
                    <button
                      key={`day-${index}`}
                      onClick={() => handleDateClick(day)}
                      disabled={!isCurrentMonth}
                      className={`aspect-square rounded-lg font-medium text-sm transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                          : isToday
                            ? 'bg-blue-500/30 text-blue-300 border-2 border-blue-400'
                            : isCurrentMonth
                              ? 'text-blue-200 hover:bg-blue-500/20'
                              : 'text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {displayDay}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  if (calendarType === 'lunar') {
                    const lunarToday = gregorianToLunar(today);
                    const gregorianToday = lunarToGregorian(lunarToday);
                    setSelectedDate(gregorianToday);
                    onChange(gregorianToday.toISOString().split('T')[0]);
                  } else {
                    setSelectedDate(today);
                    onChange(today.toISOString().split('T')[0]);
                  }
                  setIsOpen(false);
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:shadow-blue-500/50 font-medium"
              >
                今天
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
