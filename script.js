/* ============================================================
   蕭羽呈 × 劉雅蘭 ｜ 電子喜帖
   1. 開封動畫（同時觸發音樂）
   2. 日期刮刮卡
   3. 倒數計時
   4. 音樂開關
   ============================================================ */

(function () {
  'use strict';

  /* ==== 可修改的設定 ======================================= */
  var WEDDING_TIME = '2026-11-22T11:30:00+08:00'; // 入席時間（台灣時間）
  var SCRATCH_RATIO = 0.5;                        // 刮開多少比例就自動全部揭曉
  /* ========================================================= */

  var $ = function (s) { return document.querySelector(s); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. 開封 ---------- */

  var stage = $('#stage');
  var seal = $('#seal');
  var main = $('#main');
  var opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    startMusic();                       // 必須在點擊事件內呼叫，瀏覽器才允許播放
    stage.classList.add('opened');

    var wait = reduceMotion ? 100 : 1750;
    setTimeout(function () {
      stage.classList.add('gone');
      document.body.classList.remove('is-sealed');
      main.classList.add('on');
      setTimeout(function () { stage.remove(); }, 800);
    }, wait);
  }

  seal.addEventListener('click', openEnvelope);

  /* ---------- 2. 刮刮卡 ---------- */

  var cells = document.querySelectorAll('.sc-cell');

  function paintCover(canvas) {
    var cell = canvas.parentNode;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = cell.clientWidth, h = cell.clientHeight;
    if (!w || !h) return null;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    // 米白紙面 + 斜向珠光
    var g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#F0E7DA');
    g.addColorStop(0.45, '#FBF6EE');
    g.addColorStop(1, '#E4D9C9');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(199,154,139,.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6.5, 6.5, w - 13, h - 13);

    ctx.globalCompositeOperation = 'destination-out';
    return ctx;
  }

  function markDone(cell) {
    cell.classList.add('done');
  }

  function ratioCleared(ctx, canvas) {
    var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    var clear = 0, total = 0;
    for (var i = 3; i < data.length; i += 4 * 24) { // 抽樣，省效能
      total++;
      if (data[i] < 40) clear++;
    }
    return total ? clear / total : 0;
  }

  cells.forEach(function (cell) {
    var canvas = cell.querySelector('.sc-cover');
    var ctx = paintCover(canvas);
    if (!ctx) { markDone(cell); return; }

    var drawing = false, checkTick = 0;

    function pos(e) {
      var r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    function scratch(e) {
      var p = pos(e);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
      ctx.fill();
      if (++checkTick % 8 === 0 && ratioCleared(ctx, canvas) > SCRATCH_RATIO) markDone(cell);
    }

    canvas.addEventListener('pointerdown', function (e) {
      drawing = true;
      canvas.setPointerCapture(e.pointerId);
      scratch(e);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (drawing) scratch(e);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      canvas.addEventListener(ev, function () {
        if (!drawing) return;
        drawing = false;
        if (ratioCleared(ctx, canvas) > 0.22) markDone(cell); // 有誠意刮過就給過
      });
    });
  });

  // 轉向或改變視窗大小時重畫尚未刮開的卡
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cells.forEach(function (cell) {
        if (!cell.classList.contains('done')) paintCover(cell.querySelector('.sc-cover'));
      });
    }, 250);
  });

  /* ---------- 3. 倒數 ---------- */

  var target = new Date(WEDDING_TIME).getTime();
  var elD = $('#cD'), elH = $('#cH'), elM = $('#cM'), elS = $('#cS');
  var note = $('#countNote');
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };

  function tick() {
    var left = target - Date.now();
    if (left <= 0) {
      elD.textContent = elH.textContent = elM.textContent = elS.textContent = '00';
      note.textContent = '謝謝你陪我們走到這一天';
      clearInterval(timer);
      return;
    }
    var s = Math.floor(left / 1000);
    elD.textContent = Math.floor(s / 86400);
    elH.textContent = pad(Math.floor(s / 3600) % 24);
    elM.textContent = pad(Math.floor(s / 60) % 60);
    elS.textContent = pad(s % 60);
  }
  tick();
  var timer = setInterval(tick, 1000);

  /* ---------- 4. 音樂 ---------- */

  var bgm = $('#bgm');
  var musicBtn = $('#musicBtn');
  var hasAudio = true;

  bgm.addEventListener('error', function () {
    hasAudio = false;
    musicBtn.hidden = true;
  });

  function startMusic() {
    if (!hasAudio) return;
    bgm.volume = 0;
    var p = bgm.play();
    if (p && p.catch) p.catch(function () { musicBtn.classList.add('paused'); });
    musicBtn.hidden = false;

    // 音量緩緩淡入，避免嚇到人
    var v = 0;
    var fade = setInterval(function () {
      v += 0.04;
      if (v >= 0.6) { v = 0.6; clearInterval(fade); }
      bgm.volume = v;
    }, 90);
  }

  musicBtn.addEventListener('click', function () {
    if (bgm.paused) {
      bgm.play();
      musicBtn.classList.remove('paused');
      musicBtn.setAttribute('aria-label', '暫停音樂');
    } else {
      bgm.pause();
      musicBtn.classList.add('paused');
      musicBtn.setAttribute('aria-label', '播放音樂');
    }
  });

})();
