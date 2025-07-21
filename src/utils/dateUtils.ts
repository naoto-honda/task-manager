// 日付フォーマット用のユーティリティ関数

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);

  // 無効な日付の場合は空文字を返す
  if (isNaN(date.getTime())) return '';

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // 日付を比較するための関数
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 今日
  if (isSameDay(date, today)) {
    return '今日';
  }

  // 明日
  if (isSameDay(date, tomorrow)) {
    return '明日';
  }

  // 昨日
  if (isSameDay(date, yesterday)) {
    return '昨日';
  }

  // 今週内
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  if (date >= weekStart && date <= weekEnd) {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()] + '曜日';
  }

  // それ以外は日付を表示
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 今年の場合は年月を省略
  if (year === today.getFullYear()) {
    return `${month}/${day}`;
  }

  return `${year}/${month}/${day}`;
};

export const isOverdue = (dateString: string): boolean => {
  if (!dateString) return false;

  const date = new Date(dateString);
  const today = new Date();

  // 無効な日付の場合はfalseを返す
  if (isNaN(date.getTime())) return false;

  // 今日の00:00:00と比較
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  return date < today;
};

export const getDaysUntilDue = (dateString: string): number => {
  if (!dateString) return 0;

  const date = new Date(dateString);
  const today = new Date();

  // 無効な日付の場合は0を返す
  if (isNaN(date.getTime())) return 0;

  // 日付を00:00:00に設定して比較
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
