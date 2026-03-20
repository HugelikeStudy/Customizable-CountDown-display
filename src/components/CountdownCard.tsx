import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { CountdownEvent } from '../lib/supabase';

interface CountdownCardProps {
  event: CountdownEvent;
  onDelete: (id: string) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const colorClasses: Record<string, { bg: string; gradient: string; text: string }> = {
  blue: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-400 to-blue-600',
    text: 'text-blue-600',
  },
  purple: {
    bg: 'bg-purple-500',
    gradient: 'from-purple-400 to-purple-600',
    text: 'text-purple-600',
  },
  pink: {
    bg: 'bg-pink-500',
    gradient: 'from-pink-400 to-pink-600',
    text: 'text-pink-600',
  },
  green: {
    bg: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
    text: 'text-green-600',
  },
  orange: {
    bg: 'bg-orange-500',
    gradient: 'from-orange-400 to-orange-600',
    text: 'text-orange-600',
  },
  red: {
    bg: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
    text: 'text-red-600',
  },
};

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function CountdownCard({ event, onDelete }: CountdownCardProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(event.target_date)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(event.target_date));
    }, 1000);

    return () => clearInterval(interval);
  }, [event.target_date]);

  const colors = colorClasses[event.color] || colorClasses.blue;

  return (
    <div className="relative group">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
      />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{event.title}</h3>
            {event.description && (
              <p className="text-gray-500 text-sm">{event.description}</p>
            )}
          </div>
          <button
            onClick={() => onDelete(event.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
            aria-label="Delete event"
          >
            <Trash2 size={20} />
          </button>
        </div>

        {timeRemaining.isExpired ? (
          <div className="text-center py-8">
            <p className="text-3xl font-bold text-gray-400">Time's Up!</p>
            <p className="text-gray-500 mt-2">This event has passed</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div
                className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-4 shadow-lg transform transition-transform hover:scale-105`}
              >
                <div className="text-3xl font-bold text-white">{timeRemaining.days}</div>
              </div>
              <div className={`text-sm font-medium mt-2 ${colors.text}`}>Days</div>
            </div>
            <div className="text-center">
              <div
                className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-4 shadow-lg transform transition-transform hover:scale-105`}
              >
                <div className="text-3xl font-bold text-white">
                  {String(timeRemaining.hours).padStart(2, '0')}
                </div>
              </div>
              <div className={`text-sm font-medium mt-2 ${colors.text}`}>Hours</div>
            </div>
            <div className="text-center">
              <div
                className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-4 shadow-lg transform transition-transform hover:scale-105`}
              >
                <div className="text-3xl font-bold text-white">
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </div>
              </div>
              <div className={`text-sm font-medium mt-2 ${colors.text}`}>Minutes</div>
            </div>
            <div className="text-center">
              <div
                className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-4 shadow-lg transform transition-transform hover:scale-105`}
              >
                <div className="text-3xl font-bold text-white">
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
              </div>
              <div className={`text-sm font-medium mt-2 ${colors.text}`}>Seconds</div>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            {event.calendar_type === 'lunar' && event.lunar_date_display && (
              <span className="block mb-1">农历: {event.lunar_date_display}</span>
            )}
            Target: {new Date(event.target_date).toLocaleString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
