import { User } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ onLogout, user }) => {
  // ユーザー名を取得（未設定の場合は'User'を表示）
  const userName = user?.displayName || 'User';
  useEffect(() => {
    console.log('userName', userName);
  }, [userName]);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* 左側：ロゴ */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* タスク管理ロゴ（チェックリストアイコン） */}
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              <span className="text-xl font-bold text-gray-900">
                Task Manager
              </span>
            </Link>
          </div>

          {/* 右側：ユーザー情報とログアウト */}
          <div className="flex items-center space-x-4">
            {/* ユーザー名 */}
            <span className="text-gray-700">{userName}</span>

            {/* ログアウトボタン */}
            <button
              onClick={onLogout}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
