import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import DatePicker from './DatePicker';

interface AddEventFormProps {
  onAdd: (event: {
    title: string;
    target_date: string;
    description: string;
    color: string;
    calendar_type: string;
    lunar_date_display: string;
  }) => void;
}

const colors = [
  { name: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { name: 'green', label: 'Green', class: 'bg-green-500' },
  { name: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { name: 'red', label: 'Red', class: 'bg-red-500' },
  { name: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { name: 'pink', label: 'Pink', class: 'bg-pink-500' },
];

export default function AddEventForm({ onAdd }: AddEventFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [calendarType, setCalendarType] = useState<'gregorian' | 'lunar'>('gregorian');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetDate) return;

    const targetDateObj = new Date(targetDate);
    let lunarDisplay = '';
    if (calendarType === 'lunar') {
      const { gregorianToLunar, formatLunarDateShort } = require('../utils/lunarCalendar');
      const lunar = gregorianToLunar(targetDateObj);
      lunarDisplay = formatLunarDateShort(lunar);
    }

    onAdd({
      title,
      target_date: targetDateObj.toISOString(),
      description,
      color: selectedColor,
      calendar_type: calendarType,
      lunar_date_display: lunarDisplay,
    });

    setTitle('');
    setTargetDate('');
    setDescription('');
    setSelectedColor('blue');
    setCalendarType('gregorian');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all duration-300 z-10"
        aria-label="Add new countdown"
      >
        <Plus size={32} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Countdown</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., College Entrance Exam, Birthday"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date & Time
            </label>
            <DatePicker
              value={targetDate}
              onChange={setTargetDate}
              calendarType={calendarType}
              onCalendarTypeChange={setCalendarType}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some notes about this event..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Color Theme
            </label>
            <div className="grid grid-cols-6 gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`${color.class} w-12 h-12 rounded-lg shadow-md hover:shadow-lg transform transition-all hover:scale-110 ${
                    selectedColor === color.name
                      ? 'ring-4 ring-offset-2 ring-gray-800 scale-110'
                      : ''
                  }`}
                  aria-label={color.label}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Add Countdown
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
