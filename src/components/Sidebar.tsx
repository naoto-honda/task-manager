import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [tags, setTags] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // 月別リンクの生成
  const monthLinks = Array.from({ length: 12 }).map((_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return {
      path: `/month/${year}-${month}`,
      label: `${year}年${month}月`,
    };
  });

  // タグとカテゴリーの一覧を取得
  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid)
      );

      try {
        const querySnapshot = await getDocs(tasksQuery);
        const uniqueTags = new Set<string>();
        const uniqueCategories = new Set<string>();

        querySnapshot.forEach((doc) => {
          const task = doc.data();
          // タグを追加
          if (task.tags && Array.isArray(task.tags)) {
            task.tags.forEach((tag: string) => uniqueTags.add(tag));
          }
          // カテゴリーを追加
          if (task.category) {
            uniqueCategories.add(task.category);
          }
        });

        setTags(Array.from(uniqueTags).sort());
        setCategories(Array.from(uniqueCategories).sort());
      } catch (error) {
        console.error('Error fetching tags and categories:', error);
      }
    };

    fetchTagsAndCategories();
  }, []);

  return (
    <div className="w-64 bg-white rounded-lg shadow p-4">
      {/* 月別セクション */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">月別</h3>
        <nav className="space-y-2">
          {monthLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 rounded-md text-sm ${
                location.pathname === link.path
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* カテゴリーセクション */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">カテゴリー</h3>
        <nav className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${encodeURIComponent(category)}`}
              className={`block px-3 py-2 rounded-md text-sm ${
                location.pathname ===
                `/category/${encodeURIComponent(category)}`
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
            </Link>
          ))}
        </nav>
      </div>

      {/* タグセクション */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">タグ</h3>
        <nav className="space-y-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              to={`/tag/${encodeURIComponent(tag)}`}
              className={`block px-3 py-2 rounded-md text-sm ${
                location.pathname === `/tag/${encodeURIComponent(tag)}`
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
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
                {tag}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
