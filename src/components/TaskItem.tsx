import React, { useState } from 'react';
import { formatDate, isOverdue } from '../utils/dateUtils';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  description?: string;
  tags?: string[];
  category?: string;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  completed,
  priority,
  dueDate,
  description,
  tags,
  category,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const [showDescription, setShowDescription] = useState(false);

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const priorityLabels = {
    low: '低',
    medium: '中',
    high: '高',
  };

  const formattedDate = dueDate ? formatDate(dueDate) : '';
  const isTaskOverdue = dueDate ? isOverdue(dueDate) : false;

  return (
    <div
      className={`flex items-start p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        completed ? 'opacity-75' : ''
      }`}
    >
      {/* チェックボックス */}
      <div className="flex items-center mr-4 mt-1">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
      </div>

      {/* タスク内容 */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span
              className={`text-sm font-medium ${
                completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {title}
            </span>

            {/* 優先度バッジ */}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[priority]}`}
            >
              {priorityLabels[priority]}
            </span>

            {/* カテゴリバッジ（優先度の横に移動） */}
            {category && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-200 text-blue-800">
                <svg
                  className="inline w-3 h-3 mr-1 -mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 21V7a2 2 0 00-2-2H6a2 2 0 00-2 2v14"
                  />
                </svg>
                {category}
              </span>
            )}
          </div>

          {/* 期限 */}
          {dueDate && (
            <div
              className={`flex items-center space-x-1 text-sm ${
                isTaskOverdue && !completed
                  ? 'text-red-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {formattedDate}
                {isTaskOverdue && !completed && (
                  <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                    期限切れ
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* タグ表示（下部にアイコン＋チップ） */}
        {tags && tags.length > 0 && (
          <div className="mb-2 flex items-center flex-wrap gap-2">
            <span className="text-gray-500 text-xs flex items-center mr-2">
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
                  d="M7 7a4 4 0 015.657 0l6.364 6.364a4 4 0 010 5.657l-3.535 3.535a4 4 0 01-5.657 0L3.05 13.05a4 4 0 010-5.657L6.586 3.05a4 4 0 015.657 0z"
                />
              </svg>
              タグ:
            </span>
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-block bg-gray-300 text-gray-800 text-xs px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 説明 */}
        {description && (
          <div className="mb-2">
            <button
              onClick={() => setShowDescription(!showDescription)}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  showDescription ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>詳細を{showDescription ? '隠す' : '表示'}</span>
            </button>

            {showDescription && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex items-center space-x-2 ml-4">
        <button
          onClick={() => onEdit(id)}
          className="text-gray-400 hover:text-gray-600 p-1"
          title="編集"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="text-gray-400 hover:text-red-600 p-1"
          title="削除"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
