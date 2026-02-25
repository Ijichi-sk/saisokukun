/**
 * 催促くん - お金の催促ページ
 */

import { SUBJECT_OPTIONS } from './constants.js';
import { validateMoneyForm, showErrors, clearErrors } from './validation.js';
import { generateMoneyTemplates, generateMoneyGroupTemplates } from './templates.js';
import { copyToClipboard } from './clipboard.js';

document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.getElementById('formSection');
    const resultSection = document.getElementById('resultSection');
    const form = document.getElementById('moneyForm');
    const subjectSelect = document.getElementById('subject');
    const customSubjectGroup = document.getElementById('customSubjectGroup');
    const customSubjectInput = document.getElementById('customSubject');
    const resultContainer = document.getElementById('resultContainer');
    const resetBtn = document.getElementById('resetBtn');
    const memberList = document.getElementById('memberList');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const totalAmountGroup = document.getElementById('totalAmountGroup');

    let splitMode = 'even';

    // ── 件名プルダウン生成 ──
    initSubjectSelect(subjectSelect);

    // ── 初期メンバー1人追加 ──
    addMember();

    // ── 件名「その他」切り替え ──
    subjectSelect.addEventListener('change', () => {
        const isCustom = subjectSelect.value === 'その他（自由入力）';
        customSubjectGroup.style.display = isCustom ? 'block' : 'none';
        if (!isCustom) customSubjectInput.value = '';
    });

    // ── メンバー追加 ──
    addMemberBtn.addEventListener('click', () => addMember());

    // ── 割り勘/個別 切り替え ──
    document.querySelectorAll('input[name="splitMode"]').forEach((radio) => {
        radio.addEventListener('change', (e) => {
            splitMode = e.target.value;
            totalAmountGroup.style.display = splitMode === 'even' ? 'block' : 'none';
            updateMemberAmountVisibility();
        });
    });

    // ── フォーム送信 ──
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const members = getMembers();
        const formData = {
            members,
            splitMode,
            totalAmount: document.getElementById('totalAmount').value,
            subject: subjectSelect.value,
            customSubject: customSubjectInput.value,
            dueDate: document.getElementById('dueDate').value,
        };

        const errors = validateMoneyForm(formData);
        if (errors.length > 0) {
            showErrors(errors);
            const firstErr = document.getElementById(errors[0].field);
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // 割り勘の場合、金額を自動計算
        if (splitMode === 'even') {
            const total = parseInt(formData.totalAmount, 10);
            const perPerson = Math.ceil(total / members.length);
            formData.members = members.map((m) => ({ ...m, amount: perPerson }));
        }

        // テンプレート生成
        let templates;
        if (formData.members.length === 1) {
            // 単体用テンプレート
            templates = generateMoneyTemplates({
                targetName: formData.members[0].name,
                subject: formData.subject,
                customSubject: formData.customSubject,
                amount: formData.members[0].amount,
                dueDate: formData.dueDate,
            });
        } else {
            // グループ用テンプレート
            templates = generateMoneyGroupTemplates(formData);
        }

        renderResults(templates, resultContainer);
        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ── リセット ──
    resetBtn.addEventListener('click', () => {
        form.reset();
        customSubjectGroup.style.display = 'none';
        memberList.innerHTML = '';
        addMember();
        splitMode = 'even';
        totalAmountGroup.style.display = 'block';
        clearErrors();
        resultContainer.innerHTML = '';
        resultSection.classList.add('hidden');
        formSection.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── ヘルパー関数 ──

    function addMember() {
        const index = memberList.children.length;
        const row = document.createElement('div');
        row.className = 'member-row';
        row.dataset.index = index;

        row.innerHTML = `
            <div class="member-row__fields">
                <input type="text" id="memberName-${index}" class="form-input member-row__name"
                    maxlength="30" placeholder="名前" autocomplete="off">
                <div class="amount-wrapper member-row__amount" style="display: ${splitMode === 'individual' ? 'flex' : 'none'}">
                    <span class="amount-wrapper__prefix">¥</span>
                    <input type="number" id="memberAmount-${index}" class="form-input"
                        min="1" max="9999999" placeholder="金額" inputmode="numeric">
                </div>
                <button type="button" class="member-row__remove" title="削除">✕</button>
            </div>
            <span id="memberName-${index}-error" class="error-message"></span>
            <span id="memberAmount-${index}-error" class="error-message"></span>
        `;

        const removeBtn = row.querySelector('.member-row__remove');
        removeBtn.addEventListener('click', () => {
            if (memberList.children.length > 1) {
                row.remove();
                reindexMembers();
            }
        });

        memberList.appendChild(row);
    }

    function getMembers() {
        const rows = memberList.querySelectorAll('.member-row');
        return Array.from(rows).map((row) => {
            const nameInput = row.querySelector('.member-row__name');
            const amountInput = row.querySelector('.member-row__amount input[type="number"]');
            return {
                name: nameInput ? nameInput.value.trim() : '',
                amount: amountInput ? amountInput.value : '',
            };
        });
    }

    function reindexMembers() {
        const rows = memberList.querySelectorAll('.member-row');
        rows.forEach((row, i) => {
            row.dataset.index = i;
            const nameInput = row.querySelector('.member-row__name');
            if (nameInput) nameInput.id = `memberName-${i}`;
            const amountInput = row.querySelector('.member-row__amount input[type="number"]');
            if (amountInput) amountInput.id = `memberAmount-${i}`;
            const nameErr = row.querySelector('[id$="-error"]:first-of-type');
            if (nameErr) nameErr.id = `memberName-${i}-error`;
        });
    }

    function updateMemberAmountVisibility() {
        const wrappers = memberList.querySelectorAll('.member-row__amount');
        wrappers.forEach((w) => {
            w.style.display = splitMode === 'individual' ? 'flex' : 'none';
        });
    }
});

function initSubjectSelect(selectEl) {
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

function renderResults(templates, container) {
    container.innerHTML = '';
    templates.forEach((tmpl) => {
        const card = document.createElement('div');
        card.className = 'result-card';

        const header = document.createElement('div');
        header.className = 'result-card__header';
        header.innerHTML = `
            <h3 class="result-card__label">テンプレート：${tmpl.label}</h3>
            <p class="result-card__desc">${tmpl.description}</p>
        `;

        const body = document.createElement('pre');
        body.className = 'result-card__body';
        body.textContent = tmpl.text;

        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'btn btn--copy';
        copyBtn.textContent = 'この文面をコピー';
        copyBtn.addEventListener('click', () => copyToClipboard(tmpl.text, copyBtn));

        card.appendChild(header);
        card.appendChild(body);
        card.appendChild(copyBtn);
        container.appendChild(card);
    });
}
