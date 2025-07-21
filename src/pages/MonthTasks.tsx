import { User } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import TaskItem from '../components/TaskItem';
import { auth, db } from '../firebase';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  description?: string;
  userId?: string;
  createdAt?: any;
}

interface MonthTasksProps {
  onLogout: () => void;
  user: User | null;
}

const MonthTasks: React.FC<MonthTasksProps> = ({ onLogout, user }) => {
  const { yearMonth } = useParams<{ yearMonth: string }>(); // 例: 2024-07
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const user = auth.currentUser;
    if (!user || !yearMonth) {
      setTasks([]);
      setLoading(false);
      return;
    }
    // 指定月のタスクのみ取得（dueDateが"2024-07"で始まるもの）
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
      // Firestoreは部分一致検索ができないため、全件取得して前方一致で絞る
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let data: Task[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : null,
          } as Task;
        });
        // dueDateが"2024-07"で始まるものだけに絞る
        data = data.filter(
          (task) => task.dueDate && task.dueDate.startsWith(yearMonth)
        );
        // 新しい順にソート
        data = data.sort((a, b) => {
          if (!a.createdAt && b.createdAt) return 1;
          if (a.createdAt && !b.createdAt) return -1;
          if (!a.createdAt && !b.createdAt) return 0;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        setTasks(data);
        setLoading(false);
      },
      (err) => {
        setError('タスクの取得に失敗しました: ' + err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [yearMonth]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={onLogout} user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-gray-600 text-lg">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout} user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 text-indigo-700">
          {yearMonth?.replace('-', '年')}月のタスク
        </h1>
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y divide-gray-100">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                completed={task.completed}
                priority={task.priority}
                dueDate={task.dueDate}
                description={task.description}
                onToggle={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
          {tasks.length === 0 && (
            <div className="px-6 py-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                この月のタスクはありません
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                新しいタスクを作成して始めましょう。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthTasks;
