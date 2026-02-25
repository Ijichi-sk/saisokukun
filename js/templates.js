/**
 * 催促くん - テンプレート生成
 */

import { TEMPLATES, SITE_URL } from './constants.js';

/**
 * 金額をカンマ区切りにフォーマット
 * @param {number} num
 * @returns {string}
 */
export function formatAmount(num) {
    return Number(num).toLocaleString('ja-JP');
}

/**
 * ISO日付文字列を「〇月〇日まで」に変換
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {string}
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日まで`;
}

/**
 * 入力データから3種テンプレートを生成
 * @param {Object} data - { targetName, subject, customSubject, amount, dueDate }
 * @returns {Array<{id: string, label: string, description: string, text: string}>}
 */
export function generateTemplates(data) {
    const subject = data.subject === 'その他（自由入力）' ? data.customSubject : data.subject;
    const params = {
        targetName: data.targetName.trim(),
        subject: subject,
        amount: formatAmount(data.amount),
        dueDate: formatDate(data.dueDate),
        siteUrl: SITE_URL,
    };

    return TEMPLATES.map((tmpl) => ({
        id: tmpl.id,
        label: tmpl.label,
        description: tmpl.description,
        text: tmpl.generate(params),
    }));
}
