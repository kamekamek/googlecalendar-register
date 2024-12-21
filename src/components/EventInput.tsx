'use client';

import { useState } from 'react';
import { parseEvents, CalendarEvent } from '../../../../src/lib/eventParser';

interface EventInputProps {
  onEventsGenerated: (events: CalendarEvent[]) => void;
}

export default function EventInput({ onEventsGenerated }: EventInputProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const events = parseEvents(inputText);
    onEventsGenerated(events);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <label
          htmlFor="eventInput"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          イベントテキストを入力してください
        </label>
        <textarea
          id="eventInput"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="1/8 20:00- イベントタイトル&#13;&#10;https://example.com&#13;&#10;&#13;&#10;1/9 15:00- 別のイベント&#13;&#10;https://example.com"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        イベントを解析
      </button>
    </form>
  );
} 