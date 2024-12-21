'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { CalendarEvent } from '@/lib/googleCalendar';

export default function Home() {
  const { data: session, status } = useSession();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) {
      setResult({
        success: false,
        message: 'Googleアカウントでログインしてください。',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({
          success: true,
          message: `${data.events.length}件のイベントを登録しました。`,
        });
      } else {
        setResult({
          success: false,
          message: data.error || 'エラーが発生しました。',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: '通信エラーが発生しました。',
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Googleカレンダー一括登録</h1>
        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{session.user?.email}</span>
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
            className="bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Googleアカウントでログイン
          </button>
        )}
      </div>
      
      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              イベントテキスト
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 p-2 border rounded-md"
              placeholder="例：会議: 2024/01/08 13:00-14:00 [会議室A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-600">
          イベントを登録するには、Googleアカウントでログインしてください。
        </p>
      )}

      {result && (
        <div
          className={`mt-4 p-4 rounded-md ${
            result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {result.message}
        </div>
      )}
    </main>
  );
} 