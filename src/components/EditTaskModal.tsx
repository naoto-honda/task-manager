import React, { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  description?: string;
  tags?: string[];
  category?: string;
}

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, updatedTask: Omit<Task, 'id'>) => void;
  task: Task | null;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');

  // タスクが変更されたときにフォームを更新
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setDueDate(task.dueDate || '');
      setDescription(task.description || '');
      setTags(task.tags ? task.tags.join(',') : '');
      setCategory(task.category || '');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !title.trim()) return;

    onSubmit(task.id, {
      title: title.trim(),
      completed: task.completed,
      priority,
      dueDate: dueDate || undefined,
      description: description.trim() || undefined,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      category: category.trim(),
    });

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">タスクを編集</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* タイトル */}
            <div>
              <label
                htmlFor="edit-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                タスクタイトル *
              </label>
              <input
                type="text"
                id="edit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="タスクのタイトルを入力"
              />
            </div>

            {/* 優先度 */}
            <div>
              <label
                htmlFor="edit-priority"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                優先度
              </label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as 'low' | 'medium' | 'high')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>

            {/* 期限 */}
            <div>
              <label
                htmlFor="edit-dueDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                期限
              </label>
              <input
                type="date"
                id="edit-dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* 説明 */}
            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                説明
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="タスクの詳細を入力（任意）"
              />
            </div>

            {/* タグ */}
            <div>
              <label
                htmlFor="edit-tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                タグ（カンマ区切りで複数指定可）
              </label>
              <input
                type="text"
                id="edit-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例：重要,至急,会議"
              />
            </div>

            {/* カテゴリ */}
            <div>
              <label
                htmlFor="edit-category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                カテゴリ（1つ指定）
              </label>
              <input
                type="text"
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例：仕事、プライベート"
              />
            </div>

            {/* ボタン */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                更新
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
