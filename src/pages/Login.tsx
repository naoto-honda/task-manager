import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../firebase';

interface LoginProps {
  onLogin: (user?: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        // 新規登録
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // displayNameを設定
        if (displayName) {
          await updateProfile(userCredential.user, {
            displayName: displayName,
          });
          // displayNameの即時反映のためreload
          await userCredential.user.reload();
          // 最新のユーザー情報を渡す
          onLogin(auth.currentUser);
          return;
        }
        onLogin(auth.currentUser);
        return;
      } else {
        // ログイン
        await signInWithEmailAndPassword(auth, email, password);
        onLogin();
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('このメールアドレスは既に使用されています');
      } else if (err.code === 'auth/invalid-email') {
        setError('メールアドレスの形式が正しくありません');
      } else if (err.code === 'auth/weak-password') {
        setError('パスワードは6文字以上で入力してください');
      } else if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        setError('メールアドレスまたはパスワードが間違っています');
      } else {
        setError('エラーが発生しました: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600">タスク管理を効率化しましょう</p>
        </div>

        {/* ログイン/新規登録フォーム */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 新規登録時のみユーザー名 */}
            {isRegister && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ユーザー名（任意）
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="例：山田太郎"
                  autoComplete="username"
                />
              </div>
            )}
            {/* メールアドレス */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@email.com"
                autoComplete="email"
              />
            </div>

            {/* パスワード */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="パスワードを入力"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>

            {/* エラー表示 */}
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            {/* ログイン/新規登録ボタン */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? '処理中...' : isRegister ? '新規登録' : 'ログイン'}
              </button>
            </div>
          </form>

          {/* 新規登録/ログイン切り替え */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              {isRegister
                ? 'アカウントをお持ちの方はこちら（ログイン）'
                : '新規登録はこちら'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
