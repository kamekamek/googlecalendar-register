'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [language, setLanguage] = useState<'en' | 'ja'>('en');

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          {language === 'en' ? 'Back to Home' : 'ホームに戻る'}
        </Link>
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors text-black"
        >
          {language === 'en' ? '日本語' : 'English'}
        </button>
      </div>

      {language === 'en' ? (
        // English Content
        <>
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="mb-4">
              This Privacy Policy explains how our Google Calendar Batch Registration application (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;app&rdquo;) 
              collects, uses, and protects your information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information Collection and Use</h2>
            <h3 className="text-xl font-bold mb-2">2.1 Google Account Information</h3>
            <p className="mb-4">
              When you sign in with your Google account, we receive access to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Your email address</li>
              <li>Your Google Calendar data (limited to the scope described below)</li>
            </ul>

            <h3 className="text-xl font-bold mb-2">2.2 Google Calendar API Scope</h3>
            <p className="mb-4">
              We use the following Google Calendar API scope:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded text-black">
                  https://www.googleapis.com/auth/calendar.events
                </code>
                <p className="mt-1">
                  This scope allows our application to add events to your Google Calendar.
                </p>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Data Storage and Processing</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>We do not store any of your calendar data or event information permanently.</li>
              <li>Event information is only processed temporarily to create calendar events.</li>
              <li>Authentication tokens are stored only temporarily during your active session.</li>
              <li>We do not share your information with any third parties.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. User Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Revoke access to your Google Calendar at any time through your Google Account settings</li>
              <li>Request information about how your data is processed</li>
              <li>Log out and remove your session data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Protection</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to ensure a level of security 
              appropriate to the risk, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Secure HTTPS connections</li>
              <li>Session-based authentication</li>
              <li>Minimal data collection and processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us through email address nagare.0913@gmail.com.
            </p>
          </section>
        </>
      ) : (
        // Japanese Content
        <>
          <h1 className="text-3xl font-bold mb-8">プライバシーポリシー</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. はじめに</h2>
            <p className="mb-4">
              このプライバシーポリシーは、Google Calendar一括登録アプリケーション（以下、「当アプリ」）が、
              サービスの利用時にどのように情報を収集、使用、保護するかを説明するものです。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. 情報の収集と使用</h2>
            <h3 className="text-xl font-bold mb-2">2.1 Googleアカウント情報</h3>
            <p className="mb-4">
              Googleアカウントでサインインする際、以下の情報にアクセスします：
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>メールアドレス</li>
              <li>Googleカレンダーデータ（以下に説明する範囲に限定）</li>
            </ul>

            <h3 className="text-xl font-bold mb-2">2.2 Google Calendar APIのスコープ</h3>
            <p className="mb-4">
              以下のGoogle Calendar APIスコープを使用します：
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <code className="bg-gray-100 px-2 py-1 rounded text-black">
                  https://www.googleapis.com/auth/calendar.events
                </code>
                <p className="mt-1">
                  このスコープにより、当アプリはあなたのGoogleカレンダーにイベントを追加することができます。
                </p>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. データの保存と処理</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>カレンダーデータやイベント情報を永続的に保存することはありません。</li>
              <li>イベント情報は、カレンダーイベントの作成時に一時的に処理されるのみです。</li>
              <li>認証トークンは、アクティブセッション中のみ一時的に保存されます。</li>
              <li>お客様の情報を第三者と共有することはありません。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. ユーザーの権利</h2>
            <p className="mb-4">ユーザーには以下の権利があります：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Googleアカウントの設定からいつでもGoogleカレンダーへのアクセスを取り消すことができます</li>
              <li>データの処理方法に関する情報を請求することができます</li>
              <li>ログアウトしてセッションデータを削除することができます</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. データ保護</h2>
            <p className="mb-4">
              リスクに応じた適切な技術的・組織的対策を実施しています：
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>セキュアなHTTPS接続</li>
              <li>セッションベースの認証</li>
              <li>最小限のデータ収集と処理</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. プライバシーポリシーの変更</h2>
            <p className="mb-4">
              プライバシーポリシーは随時更新される場合があります。変更があった場合は、
              このページに新しいプライバシーポリシーを掲載することでお知らせします。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. お問い合わせ</h2>
            <p className="mb-4">
              このプライバシーポリシーについてご質問がある場合は、メールアドレス nagare.0913@gmail.com までお問い合わせください。
            </p>
          </section>
        </>
      )}
    </main>
  );
} 