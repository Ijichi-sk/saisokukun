/**
 * 催促くん - バリデーション
 */

import { VALIDATION } from './constants.js';

/**
 * お金の催促フォーム（複数人対応）のバリデーション
 */
export function validateMoneyForm(data) {
    const errors = [];

    // メンバー
    if (!data.members || data.members.length === 0) {
        errors.push({ field: 'memberList', message: '相手を1人以上追加してください' });
    } else {
        data.members.forEach((m, i) => {
            if (!m.name || m.name.trim() === '') {
                errors.push({ field: `memberName-${i}`, message: `${i + 1}人目の名前を入力してください` });
            } else if (m.name.length > VALIDATION.targetName.maxLength) {
                errors.push({ field: `memberName-${i}`, message: `名前は${VALIDATION.targetName.maxLength}文字以内です` });
            }
            if (data.splitMode === 'individual') {
                const amt = parseInt(m.amount, 10);
                if (!m.amount || m.amount === '') {
                    errors.push({ field: `memberAmount-${i}`, message: `${i + 1}人目の金額を入力してください` });
                } else if (isNaN(amt) || amt < VALIDATION.amount.min) {
                    errors.push({ field: `memberAmount-${i}`, message: '1円以上の金額を入力してください' });
                } else if (amt > VALIDATION.amount.max) {
                    errors.push({ field: `memberAmount-${i}`, message: `金額は¥${VALIDATION.amount.max.toLocaleString()}以下です` });
                }
            }
        });
    }

    // 件名
    if (!data.subject || data.subject === '') {
        errors.push({ field: 'subject', message: '件名を選択してください' });
    } else if (data.subject === 'その他（自由入力）') {
        if (!data.customSubject || data.customSubject.trim() === '') {
            errors.push({ field: 'customSubject', message: '件名を入力してください' });
        } else if (data.customSubject.length > VALIDATION.customSubject.maxLength) {
            errors.push({ field: 'customSubject', message: `件名は${VALIDATION.customSubject.maxLength}文字以内です` });
        }
    }

    // 割り勘モードの場合の総額
    if (data.splitMode === 'even') {
        const total = parseInt(data.totalAmount, 10);
        if (!data.totalAmount || data.totalAmount === '') {
            errors.push({ field: 'totalAmount', message: '総額を入力してください' });
        } else if (isNaN(total) || total < VALIDATION.amount.min) {
            errors.push({ field: 'totalAmount', message: '1円以上の金額を入力してください' });
        } else if (total > VALIDATION.amount.max) {
            errors.push({ field: 'totalAmount', message: `金額は¥${VALIDATION.amount.max.toLocaleString()}以下です` });
        }
    }

    // 支払期日
    if (!data.dueDate || data.dueDate === '') {
        errors.push({ field: 'dueDate', message: '支払期日を選択してください' });
    }

    return errors;
}

/**
 * 出欠確認フォームのバリデーション
 */
export function validateAttendanceForm(data) {
    const errors = [];

    // イベント名
    if (!data.eventName || data.eventName.trim() === '') {
        errors.push({ field: 'eventName', message: 'イベント名を入力してください' });
    } else if (data.eventName.length > VALIDATION.eventName.maxLength) {
        errors.push({ field: 'eventName', message: `イベント名は${VALIDATION.eventName.maxLength}文字以内です` });
    }

    // 日時
    if (!data.eventDate || data.eventDate === '') {
        errors.push({ field: 'eventDate', message: '日付を選択してください' });
    }

    // 場所（任意なのでバリデーションは文字数のみ）
    if (data.place && data.place.length > VALIDATION.place.maxLength) {
        errors.push({ field: 'place', message: `場所は${VALIDATION.place.maxLength}文字以内です` });
    }

    // メンバー
    if (!data.members || data.members.length === 0) {
        errors.push({ field: 'memberList', message: '参加者を1人以上追加してください' });
    } else {
        data.members.forEach((name, i) => {
            if (!name || name.trim() === '') {
                errors.push({ field: `memberName-${i}`, message: `${i + 1}人目の名前を入力してください` });
            } else if (name.length > VALIDATION.memberName.maxLength) {
                errors.push({ field: `memberName-${i}`, message: `名前は${VALIDATION.memberName.maxLength}文字以内です` });
            }
        });
    }

    // 回答期限
    if (!data.deadline || data.deadline === '') {
        errors.push({ field: 'deadline', message: '回答期限を選択してください' });
    }

    return errors;
}

/**
 * エラーをUIに表示する
 */
export function showErrors(errors) {
    clearErrors();
    errors.forEach(({ field, message }) => {
        const input = document.getElementById(field);
        if (input) {
            input.classList.add('is-error');
        }
        const errorEl = document.getElementById(`${field}-error`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    });
}

/**
 * 全エラー表示をクリアする
 */
export function clearErrors() {
    document.querySelectorAll('.is-error').forEach((el) => el.classList.remove('is-error'));
    document.querySelectorAll('.error-message').forEach((el) => {
        el.textContent = '';
        el.style.display = 'none';
    });
}
