/*
 * assets/site.js 的单元测试。
 * 运行：node --test tests/
 */
const test = require('node:test');
const assert = require('node:assert');

const site = require('../assets/site.js');

test('normalize 把浏览器语言码收敛到 zh / en / ja / ko', () => {
  assert.equal(site.normalize('zh'), 'zh');
  assert.equal(site.normalize('zh-CN'), 'zh');
  assert.equal(site.normalize('zh-TW'), 'zh');
  assert.equal(site.normalize('zh-Hans'), 'zh');
  assert.equal(site.normalize('ZH-cn'), 'zh');
  assert.equal(site.normalize('en'), 'en');
  assert.equal(site.normalize('en-US'), 'en');
  assert.equal(site.normalize('en-GB'), 'en');
  assert.equal(site.normalize('ja'), 'ja');
  assert.equal(site.normalize('ja-JP'), 'ja');
  assert.equal(site.normalize('ko'), 'ko');
  assert.equal(site.normalize('ko-KR'), 'ko');
  assert.equal(site.normalize('fr-FR'), null);
  assert.equal(site.normalize(''), null);
  assert.equal(site.normalize(null), null);
  assert.equal(site.normalize(undefined), null);
});

test('choose 的优先级：显式 > 已存偏好 > 浏览器 > 默认', () => {
  // 显式指定压过一切
  assert.equal(site.choose('en', 'zh', 'zh-CN'), 'en');
  assert.equal(site.choose('zh', 'en', 'en-US'), 'zh');
  // 已存偏好压过浏览器语言
  assert.equal(site.choose(null, 'zh', 'en-US'), 'zh');
  assert.equal(site.choose(null, 'en', 'zh-CN'), 'en');
  // 浏览器语言
  assert.equal(site.choose(null, null, 'zh-CN'), 'zh');
  assert.equal(site.choose(null, null, 'en-US'), 'en');
  assert.equal(site.choose(null, null, 'ja-JP'), 'ja');
  assert.equal(site.choose(null, null, 'ko-KR'), 'ko');
  assert.equal(site.choose('ja', 'zh', 'en-US'), 'ja');
  // 显式值非法时继续往下找
  assert.equal(site.choose('fr-FR', null, 'zh-CN'), 'zh');
  assert.equal(site.choose('fr-FR', 'en', 'zh-CN'), 'en');
  // 全都不认识时用默认值
  assert.equal(site.choose(null, null, 'fr-FR'), site.DEFAULT_LANGUAGE);
  assert.equal(site.choose(null, null, null), site.DEFAULT_LANGUAGE);
  assert.equal(site.DEFAULT_LANGUAGE, 'en');
});

test('readQueryLanguage 解析 ?lang=', () => {
  assert.equal(site.readQueryLanguage('?lang=zh'), 'zh');
  assert.equal(site.readQueryLanguage('?a=1&lang=en-US'), 'en-US');
  assert.equal(site.readQueryLanguage('?lang=zh&x=1'), 'zh');
  assert.equal(site.readQueryLanguage('?lang=zh#top'), 'zh');
  assert.equal(site.readQueryLanguage('?lang=zh-CN'), 'zh-CN');
  assert.equal(site.readQueryLanguage('?x=1'), null);
  assert.equal(site.readQueryLanguage(''), null);
  assert.equal(site.readQueryLanguage(null), null);
  // 空的 lang 值交给 normalize 兜底
  assert.equal(site.normalize(site.readQueryLanguage('?lang=')), null);
});

test('isRootPage 只在根页返回 true', () => {
  assert.equal(site.isRootPage('/'), true);
  assert.equal(site.isRootPage('/index.html'), true);
  assert.equal(site.isRootPage('/zh/'), false);
  assert.equal(site.isRootPage('/en/'), false);
  assert.equal(site.isRootPage('/ja/'), false);
  assert.equal(site.isRootPage('/ko/'), false);
  assert.equal(site.isRootPage('/zh/index.html'), false);
  assert.equal(site.isRootPage('/assets/site.js'), false);
});

test('targetFor 保留 hash', () => {
  assert.equal(site.targetFor('zh'), '/zh/');
  assert.equal(site.targetFor('en'), '/en/');
  assert.equal(site.targetFor('zh', ''), '/zh/');
  assert.equal(site.targetFor('en', '#top'), '/en/#top');
  assert.equal(site.targetFor('ja'), '/ja/');
  assert.equal(site.targetFor('ko', '#top'), '/ko/#top');
});

test('支持的语言与存储键保持稳定', () => {
  assert.deepEqual(site.LANGUAGES, ['zh', 'en', 'ja', 'ko']);
  assert.equal(site.STORAGE_KEY, 'lang');
});
