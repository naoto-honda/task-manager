# タスク管理アプリ（task-manager）

## 概要

このプロジェクトは、React + TypeScript + Firebase を用いたタスク管理アプリです。ユーザーはタスクの登録・編集・削除・検索・完了管理ができ、月別・タグ別・カテゴリ別のタスク一覧や統計情報も閲覧できます。認証・データ管理には Firebase（Authentication, Firestore）を利用し、Vercel でデプロイ可能です。

## 主な機能

- メールアドレス/パスワードによるユーザー認証（Firebase Auth）
- タスクの新規作成・編集・削除
- タスクの完了/未完了切り替え
- タスクの優先度・期限・説明・タグ・カテゴリ管理
- 今日のタスク、全タスクの一覧表示
- 月別・タグ別・カテゴリ別のタスク一覧
- タスク検索機能
- 統計カードによる進捗・件数表示
- レスポンシブな UI（Tailwind CSS）
- ログイン・ログアウト・新規登録

## 技術スタック

- フロントエンド: React 19, TypeScript 4.9, React Router DOM 7
- スタイリング: Tailwind CSS 3, PostCSS, Autoprefixer
- バックエンド/BaaS: Firebase (Authentication, Cloud Firestore)
- デプロイ: Vercel
- その他: ESLint, Prettier

## セットアップ手順

1. **リポジトリのクローン**

```bash
git clone git@github.com:naoto-honda/task-manager.git
cd task-manager
```

2. **依存パッケージのインストール**

```bash
npm install
```

3. **Firebase 設定**

- `src/firebase.ts` の `firebaseConfig` をご自身の Firebase プロジェクトの値に書き換えてください。
- Firebase コンソールで Authentication（メール/パスワード）と Firestore Database を有効化してください。

4. **開発サーバーの起動**

```bash
npm start
```

5. **ビルド**

```bash
npm run build
```

## Firebase 連携方法

- Firebase プロジェクトを作成し、Web アプリを追加して構成情報（apiKey 等）を取得します。
- Firestore のセキュリティルールは開発中は緩めに設定されていますが、本番運用時は必ず適切なルールに変更してください。

例：

```
match /databases/{database}/documents {
  match /{document=**} {
    allow read, write: if request.auth != null;
  }
}
```

## Vercel へのデプロイ

1. [Vercel](https://vercel.com/) にサインアップし、GitHub リポジトリと連携します。
2. プロジェクトをインポートし、ビルドコマンドは `npm run build`、出力ディレクトリは `build` を指定してください。
3. TypeScript のバージョンは `4.9.5` で固定してください（`package.json` 参照）。
4. Firebase の環境変数は Vercel の「Environment Variables」機能で設定できます。

## ディレクトリ構成

```
├── src/
│   ├── components/      # 共通UIコンポーネント
│   ├── pages/           # 各ページ（Login, Dashboard, MonthTasks, TagTasks, CategoryTasks）
│   ├── utils/           # ユーティリティ関数
│   ├── firebase.ts      # Firebase初期化
│   ├── App.tsx          # ルーティング・認証管理
│   └── index.tsx        # エントリポイント
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 注意事項

- 本アプリは学習・個人利用を想定しています。商用利用時はセキュリティやパフォーマンスに十分ご注意ください。
- Firebase の無料枠には制限があります。

## ライセンス

MIT License
