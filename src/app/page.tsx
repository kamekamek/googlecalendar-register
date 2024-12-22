'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaEnvelope } from 'react-icons/fa';
import Modal from 'react-modal';

export default function Home() {
  const { data: session, status } = useSession();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <FaEnvelope className="text-gray-100 cursor-pointer" onClick={() => setIsModalOpen(true)} />
            <Modal
              isOpen={isModalOpen}
              onRequestClose={() => setIsModalOpen(false)}
              contentLabel="Email Modal"
              className="bg-white p-4 rounded-md shadow-lg"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <h2 className="text-lg font-bold mb-2">メールアドレス</h2>
              <p className="text-gray-800">{session.user?.email}</p>
              <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                閉じる
              </button>
            </Modal>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-400 hover:text-red-300"
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
            <label htmlFor="text" className="block text-base font-medium mb-2 text-gray-100">
              イベントテキスト
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-[600px] p-4 border rounded-md bg-gray-800 text-gray-100 placeholder-gray-400"
              placeholder="例：会議: 2024/01/08 13:00-14:00 [会議室A]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-400">
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