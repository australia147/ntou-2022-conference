// =============================================================
// 內容資料載入工具（給 Alpine.js 使用）
// =============================================================

// 簡易 markdown：支援 **粗體** 與換行
window.md = function (text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
};

// 根據 body 的 data-depth 判斷現在在第幾層，自動補 ../
window.dataPath = function (filename) {
  const depth = parseInt(document.body.dataset.depth || '0', 10);
  return '../'.repeat(depth) + 'data/' + filename;
};

// 解析媒體路徑（CMS 上傳的圖片公開路徑是 /assets/images/...）
window.mediaPath = function (path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path; // 已是完整網址
  const depth = parseInt(document.body.dataset.depth || '0', 10);
  return '../'.repeat(depth) + path.replace(/^\//, '');
};

// 載入 JSON 檔（回傳 Promise）
window.loadJSON = async function (filename) {
  try {
    const res = await fetch(window.dataPath(filename));
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.error('[loadJSON] 無法載入 ' + filename + '：', e);
    return null;
  }
};

// =============================================================
// 在 DOM 完成後初始化 UI 行為
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
  // ===== 行動版選單切換 =====
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // ===== Navbar 滾動陰影 =====
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 8) {
        navbar.classList.add('shadow-md', 'bg-white/95');
        navbar.classList.remove('bg-white/80');
      } else {
        navbar.classList.remove('shadow-md', 'bg-white/95');
        navbar.classList.add('bg-white/80');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});

// =============================================================
// 入場動畫：簡單版（直接顯示，靠 CSS transition 帶過動畫）
// 不用 IntersectionObserver，因為 x-cloak 會破壞觀察時機
// =============================================================
window.initFadeUp = function () {
  document.querySelectorAll('.fade-up:not(.is-visible)').forEach((el) => {
    el.classList.add('is-visible');
  });
};

// 預設先掃一輪（給靜態元素用）
document.addEventListener('DOMContentLoaded', () => window.initFadeUp());

// =============================================================
// Alpine.js 啟動後再掃一次（給動態渲染的元素用）
// 同時呼叫 lucide.createIcons() 讓動態渲染的圖示也顯示
// =============================================================
document.addEventListener('alpine:initialized', () => {
  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons();
    window.initFadeUp();
  }, 50);
});

// =============================================================
// 卡片 / 統計區的視覺樣式（依索引決定漸層、圖示）
// =============================================================
const CARD_STYLES = [
  { icon: 'presentation', gradient: 'from-ocean-cyan to-ocean-blue',     shadow: 'shadow-cyan-500/20',   link: 'text-ocean-cyan' },
  { icon: 'users',        gradient: 'from-ocean-teal to-emerald-600',    shadow: 'shadow-teal-500/20',   link: 'text-ocean-teal' },
  { icon: 'compass',      gradient: 'from-amber-400 to-orange-500',      shadow: 'shadow-orange-500/20', link: 'text-coral' },
  { icon: 'bus',          gradient: 'from-sky-500 to-indigo-600',        shadow: 'shadow-sky-500/20',    link: 'text-ocean-blue' }
];
window.cardStyle = (i) => CARD_STYLES[i % CARD_STYLES.length];

const STAT_GRADIENTS = [
  'from-ocean-cyan to-ocean-deep',
  'from-ocean-teal to-emerald-600',
  'from-amber-500 to-orange-500',
  'from-sky-500 to-indigo-600'
];
window.statGradient = (i) => STAT_GRADIENTS[i % STAT_GRADIENTS.length];

// 依場次數量動態決定 grid 欄數
window.gridCols = function (n) {
  if (n >= 3) return 'grid sm:grid-cols-3 gap-3';
  if (n === 2) return 'grid sm:grid-cols-2 gap-3';
  return 'space-y-3';
};

// 場域踏查路線視覺主題
const ROUTE_THEMES = [
  {
    badge_class: 'bg-orange-100 text-orange-700',
    icon: 'ship',
    title_grad: 'from-orange-500 to-amber-500',
    line_grad: 'from-orange-400 to-amber-300',
    start_grad: 'from-orange-500 to-orange-600 shadow-orange-500/30',
    end_grad: 'from-amber-500 to-amber-600 shadow-amber-500/30',
    middle_class: 'bg-white border-2 border-orange-400 text-orange-600',
    blob: 'bg-orange-100/40',
    tag: 'tag tag-coral'
  },
  {
    badge_class: 'bg-sky-100 text-sky-700',
    icon: 'anchor',
    title_grad: 'from-sky-500 to-cyan-500',
    line_grad: 'from-sky-400 to-cyan-300',
    start_grad: 'from-sky-500 to-sky-600 shadow-sky-500/30',
    end_grad: 'from-cyan-500 to-cyan-600 shadow-cyan-500/30',
    middle_class: 'bg-white border-2 border-sky-400 text-sky-600',
    blob: 'bg-sky-100/40',
    tag: 'tag tag-ocean'
  }
];
window.routeTheme = (i) => ROUTE_THEMES[i % ROUTE_THEMES.length];

// 大眾運輸選項主題
const PT_THEMES = [
  { icon: 'train-front', bg: 'bg-sky-100', text: 'text-sky-600' },
  { icon: 'bus', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { icon: 'route', bg: 'bg-purple-100', text: 'text-purple-600' },
  { icon: 'car', bg: 'bg-amber-100', text: 'text-amber-600' }
];
window.publicTransportTheme = (i) => PT_THEMES[i % PT_THEMES.length];

// 承辦人卡片主題（依索引交替）
const CONTACT_THEMES = [
  { grad: 'from-ocean-cyan to-ocean-blue', shadow: 'shadow-cyan-500/20', accent: 'text-ocean-cyan' },
  { grad: 'from-ocean-teal to-emerald-600', shadow: 'shadow-teal-500/20', accent: 'text-ocean-teal' },
  { grad: 'from-amber-500 to-orange-500', shadow: 'shadow-orange-500/20', accent: 'text-coral' },
  { grad: 'from-sky-500 to-indigo-600', shadow: 'shadow-sky-500/20', accent: 'text-ocean-blue' }
];
window.contactTheme = (i) => CONTACT_THEMES[i % CONTACT_THEMES.length];

// 將 sessions 依 is_day_header 旗標切成多日
// 回傳 [{ header: {...}|null, sessions: [...] }, ...]
window.groupSessionsByDay = function (sessions) {
  if (!sessions || !sessions.length) return [];
  const days = [];
  let cur = null;
  sessions.forEach(function (s) {
    if (s.is_day_header) {
      if (cur) days.push(cur);
      cur = { header: s, sessions: [] };
    } else {
      if (!cur) cur = { header: null, sessions: [] };
      cur.sessions.push(s);
    }
  });
  if (cur) days.push(cur);
  return days;
};

// tag CSS class（依顏色名）
window.tagClass = function (color) {
  const map = {
    ocean: 'tag tag-ocean',
    teal: 'tag tag-teal',
    sand: 'tag tag-sand',
    coral: 'tag tag-coral'
  };
  return map[color] || 'tag tag-ocean';
};

// =============================================================
// 各頁面的 Alpine 資料工廠
// 每個頁面 body 上會 x-data="xxxData()" 觸發
// =============================================================
function pageDataFactory(files) {
  return function () {
    const obj = {};
    Object.keys(files).forEach((k) => (obj[k] = {}));
    return Object.assign(obj, {
      async init() {
        console.log('[CMS] init() 開始，準備載入：', files);
        try {
          const entries = Object.entries(files);
          for (const [key, filename] of entries) {
            const data = await loadJSON(filename);
            if (data) {
              // 用 Object.assign 在原本的 reactive proxy 上加屬性，確保 Alpine 偵測得到
              Object.assign(this[key], data);
              console.log('[CMS] 已載入', filename, '→', Object.keys(data).length, '個欄位');
            } else {
              console.warn('[CMS] 載入失敗：', filename);
            }
          }
          await this.$nextTick();
          if (window.lucide) lucide.createIcons();
          if (window.initFadeUp) window.initFadeUp();
          console.log('[CMS] 全部載入完成 ✓');
        } catch (err) {
          console.error('[CMS] init() 失敗：', err);
        }
      }
    });
  };
}

window.homeData     = pageDataFactory({ event: 'event.json',     page: 'homepage.json'    });
window.agendaData   = pageDataFactory({ event: 'event.json',     page: 'agenda.json'      });
window.fieldTripData= pageDataFactory({ event: 'event.json',     page: 'field-trip.json'  });
window.transportData= pageDataFactory({ event: 'event.json',     page: 'transport.json'   });
window.contactData  = pageDataFactory({ event: 'event.json',     page: 'contact.json'     });
