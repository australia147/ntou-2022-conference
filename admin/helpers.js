// =============================================================
// CMS 後台輔助工具：自動偵測並跳到錯誤欄位
// =============================================================
(function () {
  'use strict';

  let jumpBtn = null;
  let lastErrorCount = 0;

  function ensureButton() {
    if (jumpBtn) return jumpBtn;
    jumpBtn = document.createElement('button');
    jumpBtn.id = 'cms-jump-to-error';
    jumpBtn.style.cssText = [
      'position:fixed',
      'bottom:24px',
      'right:24px',
      'z-index:99999',
      'background:linear-gradient(135deg,#ef4444,#dc2626)',
      'color:white',
      'padding:14px 22px',
      'border:none',
      'border-radius:999px',
      'font-weight:700',
      'font-size:14px',
      'box-shadow:0 12px 32px -8px rgba(220,38,38,0.55), 0 4px 12px rgba(0,0,0,0.15)',
      'cursor:pointer',
      'display:none',
      'align-items:center',
      'gap:8px',
      'font-family:"Noto Sans TC",system-ui,sans-serif',
      'animation:cms-pulse 2s infinite',
      'transition:transform 0.2s'
    ].join(';');
    jumpBtn.innerHTML = '<span style="font-size:16px">⚠️</span> 跳到錯誤欄位 (<span id="cms-error-count">0</span>)';

    jumpBtn.addEventListener('mouseenter', () => {
      jumpBtn.style.transform = 'translateY(-2px) scale(1.03)';
    });
    jumpBtn.addEventListener('mouseleave', () => {
      jumpBtn.style.transform = '';
    });

    // 注入動畫 keyframes
    if (!document.getElementById('cms-helper-style')) {
      const style = document.createElement('style');
      style.id = 'cms-helper-style';
      style.textContent = `
        @keyframes cms-pulse {
          0%, 100% { box-shadow: 0 12px 32px -8px rgba(220,38,38,0.55), 0 4px 12px rgba(0,0,0,0.15); }
          50% { box-shadow: 0 12px 32px -8px rgba(220,38,38,0.85), 0 0 0 8px rgba(220,38,38,0.15); }
        }
        .cms-error-highlight {
          outline: 3px solid #dc2626 !important;
          outline-offset: 2px !important;
          background: rgba(254, 226, 226, 0.4) !important;
          transition: outline 0.3s, background 0.3s !important;
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(jumpBtn);
    return jumpBtn;
  }

  function findErrors() {
    // 涵蓋常見的錯誤標記方式
    const selectors = [
      '[aria-invalid="true"]',
      '[data-invalid="true"]',
      '.field-error',
      '.invalid',
      '[class*="error"]:not([class*="errorless"])',
      '[role="alert"]'
    ];
    const found = new Set();
    for (const sel of selectors) {
      try {
        document.querySelectorAll(sel).forEach((el) => {
          // 排除我們自己的按鈕
          if (el.id === 'cms-jump-to-error') return;
          // 排除明顯不是欄位錯誤的
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return;
          found.add(el);
        });
      } catch (e) { /* 忽略無效選擇器 */ }
    }
    return Array.from(found);
  }

  function checkErrors() {
    const errors = findErrors();
    const btn = ensureButton();
    const countEl = btn.querySelector('#cms-error-count');

    if (errors.length > 0) {
      btn.style.display = 'inline-flex';
      if (countEl) countEl.textContent = errors.length;

      btn.onclick = () => {
        const target = errors[0];
        // 先展開可能收合的父層
        let parent = target.parentElement;
        while (parent && parent !== document.body) {
          if (parent.tagName === 'DETAILS' && !parent.open) parent.open = true;
          parent = parent.parentElement;
        }

        // 滾動 + 高亮
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('cms-error-highlight');

        // 嘗試 focus 第一個 input
        const input = target.querySelector('input,textarea,select') || target;
        if (input.focus) {
          setTimeout(() => input.focus(), 600);
        }

        setTimeout(() => target.classList.remove('cms-error-highlight'), 3500);
      };
    } else {
      btn.style.display = 'none';
    }

    lastErrorCount = errors.length;
  }

  function startWatching() {
    // 等 Sveltia 介面載入後才開始
    const observer = new MutationObserver(() => {
      // 節流：用 requestAnimationFrame 避免太頻繁
      if (window.__cmsCheckPending) return;
      window.__cmsCheckPending = true;
      requestAnimationFrame(() => {
        window.__cmsCheckPending = false;
        checkErrors();
      });
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-invalid', 'data-invalid', 'class']
    });

    // 初次檢查
    checkErrors();

    // 點按鈕後也檢查（按了 Save / Publish 之後最容易出錯）
    document.addEventListener('click', () => setTimeout(checkErrors, 300), true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWatching);
  } else {
    startWatching();
  }
})();
