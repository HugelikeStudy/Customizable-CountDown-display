import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { supabase, type CountdownEvent } from './lib/supabase';
import CountdownCard from './components/CountdownCard';
import AddEventForm from './components/AddEventForm';

function App() {
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('countdown_events')
        .select('*')
        .order('target_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (eventData: {
    title: string;
    target_date: string;
    description: string;
    color: string;
    calendar_type: string;
    lunar_date_display: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('countdown_events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEvents([...events, data]);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('countdown_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Calendar className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            Countdown Timer
          </h1>
          <p className="text-gray-600 text-lg">
            Track important dates and never miss a moment
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
              <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Countdowns Yet
              </h2>
              <p className="text-gray-500 mb-6">
                Start by adding your first countdown event!
              </p>
              <p className="text-sm text-gray-400">
                Click the + button to create a new countdown
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {events.map((event) => (
              <CountdownCard
                key={event.id}
                event={event}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>

      <AddEventForm onAdd={handleAddEvent} />
    </div>
  );
}

export default App;
