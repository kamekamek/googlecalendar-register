'use client';

import { CalendarEvent } from '@/lib/googleCalendar';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';

interface EventListProps {
  events: CalendarEvent[];
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function EventList({ events, onSubmit, isLoading = false }: EventListProps) {
  if (events.length === 0) {
    return null;
  }

  const formatDateTime = (dateTimeStr: string) => {
    return format(parseISO(dateTimeStr), 'M/d HH:mm', { locale: ja });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">解析されたイベント</h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <h3 className="font-medium text-gray-900">{event.summary}</h3>
            <p className="text-sm text-gray-500">
              {formatDateTime(event.start.dateTime ?? '')} - {formatDateTime(event.end.dateTime ?? '')}
            </p>
            {event.description && (
              <a
                href={event.description}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-500 break-all"
              >
                {event.description}
              </a>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'カレンダーに登録中...' : 'Googleカレンダーに登録'}
      </button>
    </div>
  );
} 