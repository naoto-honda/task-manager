import { User } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import TaskItem from '../components/TaskItem';
import { db } from '../firebase';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  description?: string;
  tags?: string[];
  category?: string;
  createdAt?: any;
}

interface TagTasksProps {
  onLogout: () => void;
  user: User | null;
}

const TagTasks: React.FC<TagTasksProps> = ({ onLogout, user }) => {
  const { tagName } = useParams<{ tagName: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError('');

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        // タグでフィルタリング
        const filteredTasks = tasksData.filter((task) =>
          task.tags?.includes(decodeURIComponent(tagName || ''))
        );

        // 作成日時でソート
        const sortedTasks = filteredTasks.sort((a, b) => {
          if (!a.createdAt && b.createdAt) return 1;
          if (a.createdAt && !b.createdAt) return -1;
          if (!a.createdAt && !b.createdAt) return 0;
          return (
            b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()
          );
        });

        setTasks(sortedTasks);
        setLoading(false);
      },
      (err) => {
        setError('タスクの取得に失敗しました: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tagName, user]);

  // タスク操作の関数
  const handleToggleTask = async (taskId: string) => {
    // 実装は省略（Dashboard.tsxと同じ）
  };

  const handleEditTask = (taskId: string) => {
    // 実装は省略（Dashboard.tsxと同じ）
  };

  const handleDeleteTask = async (taskId: string) => {
    // 実装は省略（Dashboard.tsxと同じ）
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout} user={user} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            タグ: {decodeURIComponent(tagName || '')}
          </h1>
          <p className="text-gray-600">
            タグ「{decodeURIComponent(tagName || '')}」が付いているタスク一覧
          </p>
        </div>

        {/* サイドバー＋タスクリスト */}
        <div className="flex gap-8">
          <Sidebar />

          {/* タスクリスト */}
          <div className="flex-1 bg-white rounded-lg shadow">
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
                  tags={task.tags}
                  category={task.category}
                  onToggle={handleToggleTask}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
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
                  タスクがありません
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  このタグが付いているタスクはありません。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagTasks;
