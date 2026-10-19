/*
 * 根页语言跳转 + 语言偏好记忆。
 *
 * 只用 ES5 特性：老浏览器、node --test 都能直接跑。
 * 规则（与 README 里的说明一致）：
 *   1. 只有根页（/ 或 /index.html）会跳转，内容页永不改动地址；
 *   2. 优先级：?lang= 显式指定 > localStorage 里的偏好 > navigator.language > 默认 en；
 *   3. 跳转后记住选择，避免下次再被浏览器语言拉回去；
 *   4. localStorage 不可用（隐私模式等）时静默降级，不影响跳转。
 */
(function () {
  'use strict';

  var LANGUAGES = ['zh', 'en'];
  var DEFAULT_LANGUAGE = 'en';
  var STORAGE_KEY = 'lang';

  // 'zh' / 'zh-CN' / 'zh-TW' / 'zh-Hans' -> 'zh'；'en-US' -> 'en'；其它 -> null
  function normalize(tag) {
    if (tag === null || tag === undefined) {
      return null;
    }
    var value = String(tag).toLowerCase();
    for (var i = 0; i < LANGUAGES.length; i++) {
      if (value.indexOf(LANGUAGES[i]) === 0) {
        return LANGUAGES[i];
      }
    }
    return null;
  }

  function choose(explicit, stored, navigatorLanguage) {
    return (
      normalize(explicit) ||
      normalize(stored) ||
      normalize(navigatorLanguage) ||
      DEFAULT_LANGUAGE
    );
  }

  function readQueryLanguage(search) {
    var match = /[?&]lang=([^&#]*)/.exec(search || '');
    if (!match) {
      return null;
    }
    try {
      return decodeURIComponent(match[1].replace(/\+/g, ' '));
    } catch (error) {
      return match[1];
    }
  }

  function isRootPage(pathname) {
    return pathname === '/' || pathname === '/index.html';
  }

  function targetFor(language, hash) {
    return '/' + language + '/' + (hash || '');
  }

  function storageGet() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storageSet(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      /* 隐私模式或存储被禁用：记住偏好只是锦上添花，失败不影响使用 */
    }
  }

  function redirectIfNeeded() {
    if (!isRootPage(window.location.pathname)) {
      return false;
    }

    var language = choose(
      readQueryLanguage(window.location.search),
      storageGet(),
      window.navigator && window.navigator.language
    );
    storageSet(language);

    var target = targetFor(language, window.location.hash);
    if (target !== window.location.pathname + window.location.hash) {
      window.location.replace(target);
    }
    return true;
  }

  // 内容页上的语言切换链接：点击时记下偏好（链接本身照常跳转，不依赖 JS）
  function bindLanguageLinks() {
    var links = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        var value = normalize(this.getAttribute('data-set-lang'));
        if (value) {
          storageSet(value);
        }
      });
    }
  }

  function main() {
    if (redirectIfNeeded()) {
      return;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindLanguageLinks);
    } else {
      bindLanguageLinks();
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    // 供 node --test 使用；浏览器里没有 module，走下面的 main()
    module.exports = {
      LANGUAGES: LANGUAGES,
      DEFAULT_LANGUAGE: DEFAULT_LANGUAGE,
      STORAGE_KEY: STORAGE_KEY,
      normalize: normalize,
      choose: choose,
      readQueryLanguage: readQueryLanguage,
      isRootPage: isRootPage,
      targetFor: targetFor
    };
  } else {
    main();
  }
})();
