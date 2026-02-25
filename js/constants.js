/**
 * 催促くん - 定数定義
 * 件名選択肢・テンプレート文字列・バリデーションルール
 */

// 件名選択肢（グループ分け）
export const SUBJECT_OPTIONS = [
  {
    group: '飲食',
    items: ['飲み会代', '食事代', 'ランチ代', 'ディナー代', '二次会代', 'カフェ代'],
  },
  {
    group: '娯楽・イベント',
    items: [
      'チケット代', '映画代', 'カラオケ代', 'スポーツ観戦代',
      'ライブ・コンサート代', 'ゲーム代', 'アミューズメント代',
    ],
  },
  {
    group: '旅行・移動',
    items: ['旅行代', '宿泊費', '交通費', 'タクシー代', 'ガソリン代', '高速代'],
  },
  {
    group: 'その他',
    items: ['プレゼント代', '買い物代', '日用品代', '会費', '立替金', 'その他（自由入力）'],
  },
];

// サイトURL（ネタバラシ文言用）
export const SITE_URL = 'https://saisokukun.example.com';

// テンプレート定義
export const TEMPLATES = [
  {
    id: 'polite',
    label: '丁寧系',
    description: '礼儀正しく，お願いベースの文体',
    generate: ({ targetName, subject, amount, dueDate, siteUrl }) =>
      `${targetName}さん，先日の${subject}の件ですが，\n¥${amount}のお振込みを${dueDate}までにお願いできますでしょうか．\nよろしくお願いいたします．\n\n※本通知は催促くん（${siteUrl}）により自動生成されています`,
  },
  {
    id: 'formal',
    label: '事務的系',
    description: '感情を排した業務通知口調',
    generate: ({ targetName, subject, amount, dueDate, siteUrl }) =>
      `【自動通知】支払期日のご案内\n\n対象者：${targetName} 様\n件　名：${subject}\n金　額：¥${amount}\n期　日：${dueDate}\n\nお手数ですが期日までのお手続きをお願いいたします．\n\n※本通知は催促くん（${siteUrl}）により自動生成されています`,
  },
  {
    id: 'pressure',
    label: '圧力系',
    description: '法的通知書・督促状風の硬い文体',
    generate: ({ targetName, subject, amount, dueDate, siteUrl }) =>
      `支払督促通知書\n\n受取人　${targetName} 殿\n\n上記の者に対し，${subject}として立替済みの\n金¥${amount}也を${dueDate}までに支払うよう通知する．\n\n※本通知は催促くん（${siteUrl}）により自動生成されています`,
  },
];

// バリデーションルール
export const VALIDATION = {
  targetName: { maxLength: 30 },
  customSubject: { maxLength: 30 },
  amount: { min: 1, max: 9999999 },
};
