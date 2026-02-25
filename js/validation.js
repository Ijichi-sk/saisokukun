/**
 * 催促くん - バリデーション
 */

import { VALIDATION } from './constants.js';

/**
 * フォームデータを検証し、エラー配列を返す
 * @param {Object} data - { targetName, subject, customSubject, amount, dueDate }
 * @returns {Array<{field: string, message: string}>}
 */
export function validateForm(data) {
    const errors = [];

    // 相手のお名前
    if (!data.targetName || data.targetName.trim() === '') {
        errors.push({ field: 'targetName', message: '相手のお名前を入力してください' });
    } else if (data.targetName.length > VALIDATION.targetName.maxLength) {
        errors.push({ field: 'targetName', message: `お名前は${VALIDATION.targetName.maxLength}文字以内で入力してください` });
    }

    // 件名
    if (!data.subject || data.subject === '') {
        errors.push({ field: 'subject', message: '件名を選択してください' });
    } else if (data.subject === 'その他（自由入力）') {
        if (!data.customSubject || data.customSubject.trim() === '') {
            errors.push({ field: 'customSubject', message: '件名を入力してください' });
        } else if (data.customSubject.length > VALIDATION.customSubject.maxLength) {
            errors.push({ field: 'customSubject', message: `件名は${VALIDATION.customSubject.maxLength}文字以内で入力してください` });
        }
    }

    // 金額
    const amount = parseInt(data.amount, 10);
    if (!data.amount || data.amount === '') {
        errors.push({ field: 'amount', message: '金額を入力してください' });
    } else if (isNaN(amount) || amount < VALIDATION.amount.min) {
        errors.push({ field: 'amount', message: '1円以上の金額を入力してください' });
    } else if (amount > VALIDATION.amount.max) {
        errors.push({ field: 'amount', message: `金額は¥${VALIDATION.amount.max.toLocaleString()}以下で入力してください` });
    }

    // 支払期日
    if (!data.dueDate || data.dueDate === '') {
        errors.push({ field: 'dueDate', message: '支払期日を選択してください' });
    }

    return errors;
}

/**
 * エラーをUIに表示する
 * @param {Array<{field: string, message: string}>} errors
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
