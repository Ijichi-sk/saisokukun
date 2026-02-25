/**
 * 催促くん - メインアプリケーション
 */

import { SUBJECT_OPTIONS } from './constants.js';
import { validateForm, showErrors, clearErrors } from './validation.js';
import { generateTemplates } from './templates.js';
import { copyToClipboard } from './clipboard.js';

document.addEventListener('DOMContentLoaded', () => {
    // DOM要素参照
    const formSection = document.getElementById('formSection');
    const resultSection = document.getElementById('resultSection');
    const form = document.getElementById('saisokuForm');
    const subjectSelect = document.getElementById('subject');
    const customSubjectGroup = document.getElementById('customSubjectGroup');
    const customSubjectInput = document.getElementById('customSubject');
    const resultContainer = document.getElementById('resultContainer');
    const resetBtn = document.getElementById('resetBtn');

    // ── 件名プルダウンの動的生成 ──
    initSubjectSelect(subjectSelect);

    // ── 「その他」選択時にカスタム入力を表示 ──
    subjectSelect.addEventListener('change', () => {
        const isCustom = subjectSelect.value === 'その他（自由入力）';
        customSubjectGroup.style.display = isCustom ? 'block' : 'none';
        if (!isCustom) {
            customSubjectInput.value = '';
        }
    });

    // ── フォーム送信 ──
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const formData = {
            targetName: document.getElementById('targetName').value,
            subject: subjectSelect.value,
            customSubject: customSubjectInput.value,
            amount: document.getElementById('amount').value,
            dueDate: document.getElementById('dueDate').value,
        };

        const errors = validateForm(formData);
        if (errors.length > 0) {
            showErrors(errors);
            // 最初のエラー要素にスクロール
            const firstErrorField = document.getElementById(errors[0].field);
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // テンプレート生成
        const templates = generateTemplates(formData);
        renderResults(templates, resultContainer);

        // 画面切り替え
        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ── 最初からやり直す ──
    resetBtn.addEventListener('click', () => {
        form.reset();
        customSubjectGroup.style.display = 'none';
        clearErrors();
        resultContainer.innerHTML = '';
        resultSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

/**
 * 件名プルダウンを動的生成
 */
function initSubjectSelect(selectEl) {
    // デフォルトoption
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = '-- 選択してください --';
    defaultOpt.disabled = true;
    defaultOpt.selected = true;
    selectEl.appendChild(defaultOpt);

    SUBJECT_OPTIONS.forEach((group) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.group;
        group.items.forEach((item) => {
            const opt = document.createElement('option');
            opt.value = item;
            opt.textContent = item;
            optgroup.appendChild(opt);
        });
        selectEl.appendChild(optgroup);
    });
}

/**
 * 生成結果をDOMにレンダリング
 */
function renderResults(templates, container) {
    container.innerHTML = '';

    templates.forEach((tmpl) => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const header = document.createElement('div');
        header.className = 'result-card__header';

        const label = document.createElement('h3');
        label.className = 'result-card__label';
        label.textContent = `テンプレート：${tmpl.label}`;

        const desc = document.createElement('p');
        desc.className = 'result-card__desc';
        desc.textContent = tmpl.description;

        header.appendChild(label);
        header.appendChild(desc);

        const body = document.createElement('pre');
        body.className = 'result-card__body';
        body.textContent = tmpl.text;

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn--copy';
        copyBtn.textContent = 'この文面をコピー';
        copyBtn.addEventListener('click', () => {
            copyToClipboard(tmpl.text, copyBtn);
        });

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(copyBtn);
        container.appendChild(card);
    });
}
