/**
 * 催促くん - 出欠確認ページ
 */

import { validateAttendanceForm, showErrors, clearErrors } from './validation.js';
import { generateAttendanceTemplates } from './templates.js';
import { copyToClipboard } from './clipboard.js';

document.addEventListener('DOMContentLoaded', () => {
    const formSection = document.getElementById('formSection');
    const resultSection = document.getElementById('resultSection');
    const form = document.getElementById('attendanceForm');
    const resultContainer = document.getElementById('resultContainer');
    const resetBtn = document.getElementById('resetBtn');
    const memberList = document.getElementById('memberList');
    const addMemberBtn = document.getElementById('addMemberBtn');

    // ── 初期メンバー1人追加 ──
    addMember();

    // ── メンバー追加 ──
    addMemberBtn.addEventListener('click', () => addMember());

    // ── フォーム送信 ──
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const members = getMembers();
        const formData = {
            eventName: document.getElementById('eventName').value,
            eventDate: document.getElementById('eventDate').value,
            eventTime: document.getElementById('eventTime').value,
            place: document.getElementById('place').value,
            deadline: document.getElementById('deadline').value,
            members,
        };

        const errors = validateAttendanceForm(formData);
        if (errors.length > 0) {
            showErrors(errors);
            const firstErr = document.getElementById(errors[0].field);
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const templates = generateAttendanceTemplates(formData);
        renderResults(templates, resultContainer);
        formSection.classList.add('hidden');
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ── リセット ──
    resetBtn.addEventListener('click', () => {
        form.reset();
        memberList.innerHTML = '';
        addMember();
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
                <button type="button" class="member-row__remove" title="削除">✕</button>
            </div>
            <span id="memberName-${index}-error" class="error-message"></span>
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
            return nameInput ? nameInput.value.trim() : '';
        });
    }

    function reindexMembers() {
        const rows = memberList.querySelectorAll('.member-row');
        rows.forEach((row, i) => {
            row.dataset.index = i;
            const nameInput = row.querySelector('.member-row__name');
            if (nameInput) nameInput.id = `memberName-${i}`;
            const nameErr = row.querySelector('[id$="-error"]');
            if (nameErr) nameErr.id = `memberName-${i}-error`;
        });
    }
});

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
