'use client';

import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

export default function InputGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative mb-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
      >
        <FaInfoCircle className="mr-1" />
        入力ガイド {isOpen ? '▲' : '▼'}
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-gray-800 border border-gray-700 rounded-md text-sm">
          <h3 className="font-bold mb-2 text-gray-200">入力フォーマット例</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-300">基本形式</p>
              <pre className="bg-gray-900 p-2 rounded mt-1">1/15(月) 19:00〜21:00 新年会＠渋谷</pre>
            </div>
            <div>
              <p className="font-medium text-gray-300">URLや備考を含む場合</p>
              <pre className="bg-gray-900 p-2 rounded mt-1">1/15(月) 19:00〜21:00 新年会＠渋谷{'\n'}https://example.com/event{'\n'}※会費：5000円</pre>
            </div>
            <div>
              <p className="font-medium text-gray-300">終日イベントの場合</p>
              <pre className="bg-gray-900 p-2 rounded mt-1">1/20 スキー旅行 @野沢温泉スキー場</pre>
            </div>
            <div>
              <p className="font-medium text-gray-300">複数イベントの区切り方</p>
              <p className="text-xs text-gray-400 mt-1">各イベント間に空行を入れてください</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
