/**
 * 催促くん - クリップボードコピー機能
 */

const FEEDBACK_DURATION_MS = 2000;

/**
 * テキストをクリップボードにコピーし、ボタンのフィードバックを表示
 * @param {string} text - コピーするテキスト
 * @param {HTMLButtonElement} buttonEl - フィードバックを表示するボタン要素
 */
export async function copyToClipboard(text, buttonEl) {
    const originalLabel = buttonEl.textContent;

    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
        } else {
            // フォールバック: execCommand
            fallbackCopy(text);
        }

        // 成功フィードバック
        buttonEl.textContent = '✔ コピーしました';
        buttonEl.classList.add('is-copied');
        buttonEl.disabled = true;

        setTimeout(() => {
            buttonEl.textContent = originalLabel;
            buttonEl.classList.remove('is-copied');
            buttonEl.disabled = false;
        }, FEEDBACK_DURATION_MS);
    } catch (err) {
        // clipboard API失敗時のフォールバック
        try {
            fallbackCopy(text);
            buttonEl.textContent = '✔ コピーしました';
            buttonEl.classList.add('is-copied');
            buttonEl.disabled = true;

            setTimeout(() => {
                buttonEl.textContent = originalLabel;
                buttonEl.classList.remove('is-copied');
                buttonEl.disabled = false;
            }, FEEDBACK_DURATION_MS);
        } catch (fallbackErr) {
            buttonEl.textContent = '⚠ コピーに失敗しました';
            setTimeout(() => {
                buttonEl.textContent = originalLabel;
            }, FEEDBACK_DURATION_MS);
        }
    }
}

/**
 * execCommand を使ったフォールバックコピー
 * @param {string} text
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
