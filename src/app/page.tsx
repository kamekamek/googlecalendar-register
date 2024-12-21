'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import EventInput from '../../google-calendar-api/src/app/components/EventInput';
import EventList from '../../google-calendar-api/src/app/components/EventList';
import { CalendarEvent } from '../lib/eventParser';
import { addEventsToCalendar } from '../lib/googleCalendar';

export default function Home() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleEventsGenerated = (newEvents: CalendarEvent[]) => {
    setEvents(newEvents);
  };

  const handleSubmitToCalendar = async () => {
    if (!session?.accessToken) {
      alert('Googleアカウントでログインしてください');
      return;
    }

    setIsLoading(true);
    try {
      const results = await addEventsToCalendar(session.accessToken as string, events);
      const successCount = results.filter((r) => r.success).length;
      alert(`${successCount}件のイベントを登録しました`);
      setEvents([]); // イベントリストをクリア
    } catch (error) {
      console.error('Error:', error);
      alert('イベントの登録中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Googleカレンダー一括登録
          </h1>
          {status === 'loading' ? (
            <p>Loading...</p>
          ) : session ? (
            <div className="flex items-center justify-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user?.email}としてログイン中
              </span>
              <button
                onClick={() => signOut()}
                className="text-sm text-red-600 hover:text-red-500"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Googleアカウントでログイン
            </button>
          )}
        </div>

        {session && (
          <>
            <EventInput onEventsGenerated={handleEventsGenerated} />
            <EventList
              events={events}
              onSubmit={handleSubmitToCalendar}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </main>
  );
} 