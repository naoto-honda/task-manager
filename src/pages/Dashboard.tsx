import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import CreateTaskModal from '../components/CreateTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TaskItem from '../components/TaskItem';
import { auth, db } from '../firebase';

interface DashboardProps {
  onLogout: () => void;
  user: User | null;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  description?: string;
  tags?: string[];
  category?: string;
  userId?: string;
  createdAt?: any;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, user }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchKeywordToday, setSearchKeywordToday] = useState('');
  const [searchKeywordAll, setSearchKeywordAll] = useState('');

  // Firestoreからタスクをリアルタイム取得
  useEffect(() => {
    setLoading(true);
    setError('');
    const user = auth.currentUser;
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
      // orderBy('createdAt', 'desc') は外す
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
        // 画面側で新しい順にソート
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
  }, []);

  // 今日の日付（YYYY-MM-DD）
  const todayStr = new Date().toISOString().split('T')[0];

  // 今日のタスクのみ抽出
  const todaysTasks = tasks.filter(
    (task) =>
      task.dueDate === todayStr &&
      (!searchKeywordToday.trim() ||
        task.title
          .toLowerCase()
          .includes(searchKeywordToday.trim().toLowerCase()) ||
        (task.description &&
          task.description
            .toLowerCase()
            .includes(searchKeywordToday.trim().toLowerCase())))
  );
  // 全タスク（フィルタ済み）
  const allTasks = tasks.filter(
    (task) =>
      !searchKeywordAll.trim() ||
      task.title
        .toLowerCase()
        .includes(searchKeywordAll.trim().toLowerCase()) ||
      (task.description &&
        task.description
          .toLowerCase()
          .includes(searchKeywordAll.trim().toLowerCase()))
  );

  // 動的統計情報の計算
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const inProgressTasks = totalTasks - completedTasks;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  }).length;

  const stats = [
    {
      title: '総タスク数',
      value: totalTasks,
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
      color: 'blue' as const,
      change: { value: 0, isPositive: true },
    },
    {
      title: '完了済み',
      value: completedTasks,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'green' as const,
      change: { value: 0, isPositive: true },
    },
    {
      title: '進行中',
      value: inProgressTasks,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'yellow' as const,
      change: { value: 0, isPositive: false },
    },
    {
      title: '完了率',
      value: `${completionRate}%`,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      color: 'purple' as const,
      change: { value: 0, isPositive: true },
    },
  ];

  // タスク追加
  const handleCreateTask = async (newTask: {
    title: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
    description: string;
    category: string;
    tags: string[];
  }) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      // dueDateをYYYY-MM-DD形式で保存
      const dueDateStr = newTask.dueDate
        ? new Date(newTask.dueDate).toISOString().split('T')[0]
        : null;

      // タグの整形（スペースを除去し、空の要素を削除）
      const cleanedTags = newTask.tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        title: newTask.title,
        completed: false,
        priority: newTask.priority,
        dueDate: dueDateStr,
        description: newTask.description || '',
        createdAt: serverTimestamp(),
        category: newTask.category,
        tags: cleanedTags,
      });
    } catch (err) {
      alert('タスクの追加に失敗しました');
    }
  };

  // タスク編集
  const handleUpdateTask = async (
    taskId: string,
    updatedTask: Omit<Task, 'id'>
  ) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        title: updatedTask.title,
        completed: updatedTask.completed,
        priority: updatedTask.priority,
        dueDate: updatedTask.dueDate || null,
        description: updatedTask.description || '',
      });
    } catch (err) {
      alert('タスクの更新に失敗しました');
    }
  };

  // タスク削除
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('このタスクを削除しますか？')) return;
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
    } catch (err) {
      alert('タスクの削除に失敗しました');
    }
  };

  // 完了トグル
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !task.completed,
      });
    } catch (err) {
      alert('完了状態の更新に失敗しました');
    }
  };

  // 編集モーダルを開く
  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsEditModalOpen(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-lg">{error}エラーです</div>
      </div>
    );
  }

  if (!loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={onLogout} user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ダッシュボードヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ダッシュボード
            </h1>
            <p className="text-gray-600 mb-4">タスク管理の概要を確認できます</p>
          </div>

          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                change={stat.change}
              />
            ))}
          </div>

          {/* サイドバー＋タスクリスト 2カラム */}
          <div className="flex gap-8">
            {/* サイドバー */}
            <Sidebar />

            {/* タスクリスト（今日のタスク＋全タスク） */}
            <div className="flex-1 min-w-0">
              {/* 今日のタスク一覧 */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      今日のタスク
                    </h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {todaysTasks.filter((t) => t.completed).length}/
                        {todaysTasks.length} 完了
                      </span>
                      {overdueTasks > 0 && (
                        <span className="text-sm text-red-600 font-medium">
                          {overdueTasks}件期限切れ
                        </span>
                      )}
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        新規タスク
                      </button>
                    </div>
                  </div>
                  {/* 今日のタスク用検索欄 */}
                  <div className="mt-4 mx-6 flex items-center">
                    <input
                      type="text"
                      value={searchKeywordToday}
                      onChange={(e) => setSearchKeywordToday(e.target.value)}
                      placeholder="今日のタスクを検索..."
                      className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {todaysTasks.map((task) => (
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
                {todaysTasks.length === 0 && (
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
                      今日のタスクはありません
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      新しいタスクを作成して始めましょう。
                    </p>
                  </div>
                )}
              </div>

              {/* 全タスク一覧 */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    全タスク
                  </h2>
                  {/* 全タスク用検索欄 */}
                  <div className="mt-4 flex items-center">
                    <input
                      type="text"
                      value={searchKeywordAll}
                      onChange={(e) => setSearchKeywordAll(e.target.value)}
                      placeholder="全タスクを検索..."
                      className="w-full md:w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {allTasks.map((task) => (
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
                {allTasks.length === 0 && (
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
                      新しいタスクを作成して始めましょう。
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 新規タスク作成モーダル */}
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTask}
        />

        {/* タスク編集モーダル */}
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleUpdateTask}
          task={editingTask}
        />
      </div>
    );
  }
};

export default Dashboard;
