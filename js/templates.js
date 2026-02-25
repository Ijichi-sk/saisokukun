/**
 * 催促くん - テンプレート生成
 */

import { MONEY_TEMPLATES, MONEY_GROUP_TEMPLATES, ATTENDANCE_TEMPLATES, SITE_URL } from './constants.js';

/**
 * 金額をカンマ区切りにフォーマット
 */
export function formatAmount(num) {
    return Number(num).toLocaleString('ja-JP');
}

/**
 * ISO日付文字列を「〇月〇日まで」に変換
 */
export function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
}

/**
 * 時刻文字列を読みやすく変換
 */
export function formatTime(timeStr) {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    return `${parseInt(h)}時${m !== '00' ? m + '分' : ''}`;
}

/**
 * 入力データから単体用お金テンプレート3種を生成
 */
export function generateMoneyTemplates(data) {
    const subject = data.subject === 'その他（自由入力）' ? data.customSubject : data.subject;
    const params = {
        targetName: data.targetName.trim(),
        subject: subject,
        amount: formatAmount(data.amount),
        dueDate: formatDate(data.dueDate),
        siteUrl: SITE_URL,
    };

    return MONEY_TEMPLATES.map((tmpl) => ({
        id: tmpl.id,
        label: tmpl.label,
        description: tmpl.description,
        text: tmpl.generate(params),
    }));
}

/**
 * 複数人用お金テンプレート生成
 * @param {Object} data - { members: [{name, amount}], subject, customSubject, dueDate, splitMode }
 */
export function generateMoneyGroupTemplates(data) {
    const subject = data.subject === 'その他（自由入力）' ? data.customSubject : data.subject;
    const dueDate = formatDate(data.dueDate);

    // メンバー行を構築
    const memberLines = data.members
        .map((m) => `・${m.name}さん：¥${formatAmount(m.amount)}`)
        .join('\n');

    const params = {
        subject,
        dueDate,
        memberLines,
        siteUrl: SITE_URL,
    };

    return MONEY_GROUP_TEMPLATES.map((tmpl) => ({
        id: tmpl.id,
        label: tmpl.label,
        description: tmpl.description,
        text: tmpl.generate(params),
    }));
}

/**
 * 出欠確認テンプレート生成
 * @param {Object} data - { eventName, eventDate, eventTime, place, deadline, members: [name] }
 */
export function generateAttendanceTemplates(data) {
    const memberLines = data.members
        .map((name, i) => `${i + 1}. ${name}さん ── ◯ / ✕`)
        .join('\n');

    const params = {
        eventName: data.eventName.trim(),
        eventDate: formatDate(data.eventDate),
        eventTime: data.eventTime ? formatTime(data.eventTime) : '',
        place: data.place ? data.place.trim() : '',
        deadline: formatDate(data.deadline),
        memberLines,
        siteUrl: SITE_URL,
    };

    return ATTENDANCE_TEMPLATES.map((tmpl) => ({
        id: tmpl.id,
        label: tmpl.label,
        description: tmpl.description,
        text: tmpl.generate(params),
    }));
}
