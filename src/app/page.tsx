'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FaEnvelope } from 'react-icons/fa';
import Modal from 'react-modal';
import BackgroundGradient from '@/components/BackgroundGradient';

if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

export default function Home() {
  const { data: session, status } = useSession();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsTermsModalOpen(true);
  };

  const handleAgreeAndLogin = () => {
    setIsTermsModalOpen(false);
    signIn('google');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) {
      setResult({
        success: false,
        message: 'Googleアカウントでログインしてください。',
      });
      return;
    }

    if (session.error === 'RefreshAccessTokenError') {
      setResult({
        success: false,
        message: '認証の有効期限が切れました。再度ログインしてください。',
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
      console.error('Error submitting event:', error);
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
    <>
      <BackgroundGradient />
      <main className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">Googleカレンダー一括登録</h1>
            <div className="text-gray-100 space-y-2">
              <p>📝 入力欄に日付・時刻・予定を文章で入力するだけで簡単に予定が登録できます！</p>
              <p>📅 複数の予定を登録する場合は、行間を1行開けて入力してください。</p>
              <p className="text-yellow-400">※ 日付は2024/1/8、2024/01/08、1/8など柔軟に対応</p>
              <p className="text-yellow-400">※ 時刻は13:00-14:00、13時から14時、13:00～14:00など柔軟に対応</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              Privacy Policy
            </a>
            <Modal
              isOpen={isTermsModalOpen}
              onRequestClose={() => setIsTermsModalOpen(false)}
              contentLabel="Terms and Privacy"
              className="bg-white p-8 rounded-md shadow-lg max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
              overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Terms of Service</h2>
              
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">1. APIスコープ</h3>
                <p className="mb-4 text-gray-700">このアプリケーションは以下のGoogle Calendar APIスコープを使用します：</p>
                <ul className="list-disc pl-6 mb-4">
                  <li className="mb-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">
                      https://www.googleapis.com/auth/calendar.events
                    </code>
                    <p className="mt-1 text-gray-600">
                      このスコープにより、アプリケーションはあなたのGoogleカレンダーにイベントを追加することができます。
                    </p>
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-900">2. 免責事項</h3>
                <p className="mb-4 text-gray-700">
                  開発者は、このアプリケーションの使用によって生じたいかなる損害についても責任を負いません。
                  イベントの登録前に、詳細を必ずご確認ください。
                </p>
                <p className="mb-4 text-gray-700">
                  データの取り扱いについての詳細は、{' '}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    プライバシーポリシー
                  </a>
                  .
                </p>
              </section>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsTermsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  キャンセル
                </button>
                {!session && (
                  <button
                    onClick={handleAgreeAndLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    同意してログイン
                  </button>
                )}
                {session && (
                  <button
                    onClick={() => setIsTermsModalOpen(false)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    閉じる
                  </button>
                )}
              </div>
            </Modal>

            {session ? (
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2 order-1 sm:order-none">
                  {session.user?.image && (
                    <img 
                      src={session.user.image} 
                      alt="User Icon" 
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                  <span className="text-gray-100 text-sm sm:text-base hidden sm:inline-block">
                    {session.user?.name || session.user?.email}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-gray-100 cursor-pointer hover:text-gray-300 transition-colors" onClick={() => setIsModalOpen(true)} />
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
                <Modal
                  isOpen={isModalOpen}
                  onRequestClose={() => setIsModalOpen(false)}
                  contentLabel="Email Modal"
                  className="bg-white p-4 rounded-md shadow-lg max-w-sm mx-auto"
                  overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
                >
                  <h2 className="text-lg font-bold mb-2 text-gray-900">メールアドレス</h2>
                  <p className="text-gray-700 break-all">{session.user?.email}</p>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
                  >
                    閉じる
                  </button>
                </Modal>
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-white text-gray-600 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Googleアカウントでログイン
              </button>
            )}
          </div>
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
    </>
  );
}  