'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 flex justify-between items-center z-50">
      <p className="text-sm">
        このアプリをホーム画面に追加しますか？
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setShowBanner(false)}
          className="px-3 py-1 text-sm bg-transparent border border-white rounded hover:bg-blue-700"
        >
          あとで
        </button>
        <button
          onClick={handleInstallClick}
          className="px-3 py-1 text-sm bg-white text-blue-600 rounded hover:bg-gray-100"
        >
          インストール
        </button>
      </div>
    </div>
  );
}
