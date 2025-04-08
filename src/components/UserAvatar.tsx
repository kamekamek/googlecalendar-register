'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function UserAvatar() {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);

  if (!session || !session.user) return null;

  return (
    <div className="flex items-center gap-2">
      {session.user.image && !imageError ? (
        <img 
          src={session.user.image} 
          alt={session.user.name || 'User'}
          className="w-10 h-10 rounded-full border-2 border-white shadow-md"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
          {session.user.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      )}
      <div className="hidden md:block">
        <div className="text-sm font-medium text-gray-100">{session.user.name}</div>
        <div className="text-xs text-gray-400">{session.user.email}</div>
      </div>
    </div>
  );
}
