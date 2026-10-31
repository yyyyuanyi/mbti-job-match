/*
 * main.js — 页面流程控制（编排层）
 * 依赖：mbti.js（题目）、jobs.js（岗位）、filter.js（过滤）、match.js（打分）、report.js（报告）
 */
(function () {
  "use strict";

  var QUESTIONS = window.APP_DATA.QUESTIONS || [];
  var OPTIONS = window.APP_DATA.OPTIONS || [];

  var DIM_ORDER = ["EI", "SN", "TF", "JP"];
  var DIM_LETTER = { EI: ["E", "I"], SN: ["S", "N"], TF: ["T", "F"], JP: ["J", "P"] };

  var state = {
    userProfile: null,
    answers: {},
    mbtiType: "",
    matchedJobs: [],
    categories: [],
    reportText: ""
  };

  /* ============ 页面切换：隐藏所有页面，显示指定页面 ============ */
  function showPage(pageId) {
    var pages = document.querySelectorAll(".page");
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove("active");
    }
    var el = document.getElementById(pageId);
    if (el) el.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    onPageEnter(pageId);
  }

  /* ============ 马里奥液体进度条 ============ */

  function createProgressBar() {
    var wrap = document.createElement("div");
    wrap.className = "progress-wrap";
    wrap.setAttribute("data-progress-bar", "");
    var bubbles = "";
    for (var i = 0; i < 7; i++) bubbles += '<span class="bubble" style="--i:' + i + '"></span>';
    wrap.innerHTML =
      '<div class="progress-track">'
      + '<div class="progress-liquid" data-progress-fill>' + bubbles + '</div>'
      + '</div>'
      + '<div class="progress-mario" data-progress-mario>'
      + '<div class="mario-inner">'
      + '<img class="mario-img" src="./assets/mario.png" alt="马里奥" />'
      + '</div></div>';
    return wrap;
  }

  function initProgressBars() {
    var titles = document.querySelectorAll(".page .page-title");
    for (var i = 0; i < titles.length; i++) {
      titles[i].insertAdjacentElement("afterend", createProgressBar());
    }
  }

  function getFormProgress() {
    var checks = [
      !!document.getElementById("education").value,
      !!document.getElementById("gender").value,
      !!document.getElementById("strengths").value.trim(),
      !!document.getElementById("experience").value.trim(),
      !!document.getElementById("certificates").value.trim(),
      !!document.getElementById("health").value.trim(),
      (function () {
        var checked = document.querySelector('input[name="has-major"]:checked');
        if (!checked) return false;
        if (checked.value === "no") return true;
        return !!document.getElementById("major").value.trim();
      })()
    ];
    var filled = 0;
    checks.forEach(function (ok) { if (ok) filled++; });
    return Math.round(30 * filled / checks.length);
  }

  function getQuizProgress() {
    var total = QUESTIONS.length || 1;
    var answered = 0;
    QUESTIONS.forEach(function (q) { if (state.answers[q.id]) answered++; });
    return Math.round(30 + 50 * answered / total);
  }

  function pageProgress(pageId) {
    if (pageId === "page-form") return getFormProgress();
    if (pageId === "page-quiz") return getQuizProgress();
    if (pageId === "page-search") return searchPercent;
    if (pageId === "page-mode") return 100;
    if (pageId === "page-report") return 100;
    return 0;
  }

  function setBarProgress(bar, percent) {
    if (!bar) return;
    var fill = bar.querySelector("[data-progress-fill]");
    var mario = bar.querySelector("[data-progress-mario]");
    var track = bar.querySelector(".progress-track");
    if (!fill || !mario || !track) return;
    fill.style.width = percent + "%";
    var trackW = track.clientWidth;
    var x = trackW * percent / 100;
    x = Math.max(0, Math.min(trackW, x));
    mario.style.left = x + "px";
  }

  var celebrationTimer = null;
  function showCelebration() {
    var overlay = document.getElementById("celebration-overlay");
    if (!overlay) return;
    var frame = overlay.querySelector(".celebration-frame");
    var text = overlay.querySelector(".celebration-text");

    overlay.classList.remove("is-active");

    // 先按 1 倍大小测量文字，计算最多能放大到测评框边界的倍数
    var maxScale = 1.5;
    if (frame && text) {
      var fw = frame.clientWidth;
      var fh = frame.clientHeight;
      var tw = text.offsetWidth;
      var th = text.offsetHeight;
      if (tw > 0 && th > 0) {
        maxScale = Math.min(fw / tw, fh / th);
        maxScale = Math.max(1, Math.min(maxScale, 4));
      }
    }
    overlay.style.setProperty("--celebration-scale", maxScale.toFixed(3));

    void overlay.offsetWidth;
    overlay.classList.add("is-active");
    clearTimeout(celebrationTimer);
    celebrationTimer = setTimeout(function () { overlay.classList.remove("is-active"); }, 2700);
  }

  /* 进入页面：进度归位、马里奥跳一下并转身面对用户 */
  function onPageEnter(pageId) {
    var page = document.getElementById(pageId);
    if (!page) return;
    var bar = page.querySelector("[data-progress-bar]");
    if (!bar) return;

    setBarProgress(bar, pageProgress(pageId));

    bar.classList.add("is-front");
    bar.classList.remove("is-walking", "is-jumping");
    void bar.offsetWidth;
    bar.classList.add("is-jumping");
    setTimeout(function () { bar.classList.remove("is-jumping"); }, 820);

    if (pageId === "page-mode") {
      // 检索完成进入模式选择页后，稍作停顿再播放 Celebration
      setTimeout(showCelebration, 260);
    }
  }

  /* 用户填写/作答：液体增长，马里奥侧身走路 */
  function updateActiveProgress() {
    var page = document.querySelector(".page.active");
    if (!page) return;
    if (page.id !== "page-form" && page.id !== "page-quiz") return;
    var bar = page.querySelector("[data-progress-bar]");
    if (!bar) return;

    setBarProgress(bar, pageProgress(page.id));
    bar.classList.remove("is-front");
    bar.classList.add("is-walking");
    clearTimeout(bar._walkTimer);
    bar._walkTimer = setTimeout(function () { bar.classList.remove("is-walking"); }, 550);
  }

  /* ============ 岗位检索动画 ============ */
  var MAP_W = 1003;
  var MAP_H = 675;
  var START_POINT = { name: "武汉", x: 650, y: 420 };
  var searchRaf = null;
  var searchRunning = false;
  var searchPercent = 80;
  var searchTimer = null;

  /* 地图上已有标注的城市使用手工坐标，其余按经纬度投影 */
  var MANUAL_POS = {
    "北京": { x: 710, y: 255 },
    "上海": { x: 795, y: 405 },
    "广州": { x: 660, y: 555 },
    "深圳": { x: 692, y: 585 },
    "武汉": { x: 650, y: 420 },
    "哈尔滨": { x: 880, y: 140 },
    "呼和浩特": { x: 650, y: 230 },
    "乌鲁木齐": { x: 255, y: 210 },
    "兰州": { x: 485, y: 335 },
    "拉萨": { x: 250, y: 420 },
    "昆明": { x: 460, y: 530 }
  };

  var CITY_DB = {
    "一线城市": [
      { name: "北京", lon: 116.41, lat: 39.90 },
      { name: "上海", lon: 121.47, lat: 31.23 },
      { name: "广州", lon: 113.26, lat: 23.13 },
      { name: "深圳", lon: 114.06, lat: 22.55 }
    ],
    "新一线城市": [
      { name: "成都", lon: 104.07, lat: 30.57 },
      { name: "杭州", lon: 120.15, lat: 30.27 },
      { name: "重庆", lon: 106.55, lat: 29.56 },
      { name: "武汉", lon: 114.30, lat: 30.59 },
      { name: "苏州", lon: 120.58, lat: 31.30 },
      { name: "西安", lon: 108.94, lat: 34.34 },
      { name: "南京", lon: 118.80, lat: 32.06 },
      { name: "长沙", lon: 112.94, lat: 28.23 },
      { name: "天津", lon: 117.20, lat: 39.13 },
      { name: "郑州", lon: 113.63, lat: 34.75 },
      { name: "东莞", lon: 113.75, lat: 23.02 },
      { name: "青岛", lon: 120.38, lat: 36.07 },
      { name: "昆明", lon: 102.83, lat: 24.88 },
      { name: "宁波", lon: 121.55, lat: 29.87 },
      { name: "合肥", lon: 117.23, lat: 31.82 }
    ],
    "二线城市": [
      { name: "佛山", lon: 113.12, lat: 23.02 },
      { name: "沈阳", lon: 123.43, lat: 41.80 },
      { name: "无锡", lon: 120.31, lat: 31.49 },
      { name: "济南", lon: 117.00, lat: 36.65 },
      { name: "厦门", lon: 118.09, lat: 24.48 },
      { name: "福州", lon: 119.30, lat: 26.08 },
      { name: "温州", lon: 120.70, lat: 28.00 },
      { name: "哈尔滨", lon: 126.53, lat: 45.80 },
      { name: "石家庄", lon: 114.51, lat: 38.04 },
      { name: "大连", lon: 121.61, lat: 38.91 },
      { name: "南宁", lon: 108.37, lat: 22.82 },
      { name: "泉州", lon: 118.68, lat: 24.87 },
      { name: "金华", lon: 119.65, lat: 29.08 },
      { name: "贵阳", lon: 106.63, lat: 26.65 },
      { name: "常州", lon: 119.97, lat: 31.81 },
      { name: "长春", lon: 125.32, lat: 43.82 },
      { name: "南昌", lon: 115.89, lat: 28.68 },
      { name: "南通", lon: 120.89, lat: 31.98 },
      { name: "嘉兴", lon: 120.76, lat: 30.75 },
      { name: "徐州", lon: 117.18, lat: 34.26 },
      { name: "惠州", lon: 114.42, lat: 23.11 },
      { name: "太原", lon: 112.55, lat: 37.87 },
      { name: "台州", lon: 121.42, lat: 28.66 },
      { name: "绍兴", lon: 120.58, lat: 30.00 },
      { name: "保定", lon: 115.46, lat: 38.87 },
      { name: "中山", lon: 113.39, lat: 22.52 },
      { name: "潍坊", lon: 119.16, lat: 36.71 },
      { name: "临沂", lon: 118.36, lat: 35.10 },
      { name: "珠海", lon: 113.58, lat: 22.27 },
      { name: "烟台", lon: 121.45, lat: 37.46 },
      { name: "兰州", lon: 103.83, lat: 36.06 },
      { name: "海口", lon: 110.20, lat: 20.04 },
      { name: "乌鲁木齐", lon: 87.62, lat: 43.82 },
      { name: "呼和浩特", lon: 111.75, lat: 40.84 },
      { name: "银川", lon: 106.23, lat: 38.49 },
      { name: "西宁", lon: 101.78, lat: 36.62 },
      { name: "拉萨", lon: 91.11, lat: 29.65 }
    ],
    "三线城市": [
      { name: "洛阳", lon: 112.45, lat: 34.62 },
      { name: "唐山", lon: 118.18, lat: 39.63 },
      { name: "廊坊", lon: 116.68, lat: 39.54 },
      { name: "汕头", lon: 116.68, lat: 23.35 },
      { name: "湛江", lon: 110.36, lat: 21.27 },
      { name: "桂林", lon: 110.29, lat: 25.27 },
      { name: "柳州", lon: 109.42, lat: 24.33 },
      { name: "株洲", lon: 113.13, lat: 27.83 },
      { name: "岳阳", lon: 113.13, lat: 29.36 },
      { name: "宜昌", lon: 111.29, lat: 30.69 },
      { name: "襄阳", lon: 112.14, lat: 32.04 },
      { name: "赣州", lon: 114.94, lat: 25.83 },
      { name: "漳州", lon: 117.65, lat: 24.51 },
      { name: "芜湖", lon: 118.38, lat: 31.33 },
      { name: "蚌埠", lon: 117.39, lat: 32.92 }
    ],
    "四五线城市": [
      { name: "大理", lon: 100.23, lat: 25.60 },
      { name: "丽江", lon: 100.23, lat: 26.86 },
      { name: "三亚", lon: 109.51, lat: 18.25 },
      { name: "敦煌", lon: 94.66, lat: 40.14 },
      { name: "喀什", lon: 75.99, lat: 39.47 },
      { name: "满洲里", lon: 117.45, lat: 49.60 },
      { name: "丹东", lon: 124.38, lat: 40.13 },
      { name: "威海", lon: 122.12, lat: 37.51 },
      { name: "咸阳", lon: 108.71, lat: 34.33 },
      { name: "开封", lon: 114.31, lat: 34.80 }
    ]
  };

  function projectCity(city) {
    if (MANUAL_POS[city.name]) return MANUAL_POS[city.name];
    var x = 16.03 * city.lon - 1149.2;
    var y = -18.28 * city.lat + 977.2;
    return {
      x: Math.max(30, Math.min(975, x)),
      y: Math.max(45, Math.min(650, y))
    };
  }

  function clearSearchMarkers() {
    var box = document.getElementById("city-markers");
    if (box) box.innerHTML = "";
  }

  var PULSE_COLORS = ["pulse-red", "pulse-yellow", "pulse-blue", "pulse-green"];

  function renderCityMarkers(cities) {
    var box = document.getElementById("city-markers");
    if (!box) return;
    clearSearchMarkers();
    cities.forEach(function (city, i) {
      var el = document.createElement("div");
      el.className = "city-marker " + PULSE_COLORS[i % PULSE_COLORS.length];
      el.style.left = (city.x / MAP_W * 100) + "%";
      el.style.top = (city.y / MAP_H * 100) + "%";
      el.innerHTML = '<span class="city-pulse"></span><span class="city-tag">' + city.name + '</span>';
      box.appendChild(el);
    });
  }

  function setPlanePos(plane, x, y, angle) {
    plane.style.left = (x / MAP_W * 100) + "%";
    plane.style.top = (y / MAP_H * 100) + "%";
    plane.style.transform = "translate(-50%, -50%) rotate(" + angle + "deg)";
  }

  function easeInOut(t) {
    return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  var searchBarShown = -1;
  function updateSearchBar(percent) {
    var v = Math.round(percent);
    if (v === searchBarShown) return;
    searchBarShown = v;
    var page = document.getElementById("page-search");
    var bar = page ? page.querySelector("[data-progress-bar]") : null;
    if (bar) setBarProgress(bar, v);
  }

  function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /* 从武汉出发的最近邻路线，避免在城市间来回穿插 */
  function orderCities(cities) {
    var remaining = cities.slice();
    var ordered = [];
    var current = START_POINT;
    while (remaining.length) {
      var best = 0;
      var bestD = Infinity;
      for (var i = 0; i < remaining.length; i++) {
        var d = distance(current, remaining[i]);
        if (d < bestD) { bestD = d; best = i; }
      }
      var next = remaining.splice(best, 1)[0];
      ordered.push(next);
      current = next;
    }
    return ordered;
  }

  function buildSegments(cities) {
    var byName = {};
    cities.forEach(function (c, i) { byName[c.name] = i; });

    var visit = cities.filter(function (c) { return c.name !== START_POINT.name; });
    visit = orderCities(visit);

    var segments = [];
    segments.push({ type: "stop", point: START_POINT, duration: 1000, cityIndex: byName[START_POINT.name] });

    var current = START_POINT;
    visit.forEach(function (city) {
      var d = distance(current, city);
      segments.push({
        type: "fly",
        from: { x: current.x, y: current.y },
        to: { x: city.x, y: city.y },
        duration: Math.min(520, 220 + d * 0.55),
        toName: city.name
      });
      segments.push({ type: "stop", point: city, duration: 1000, cityIndex: byName[city.name] });
      current = city;
    });

    // 飞回武汉
    segments.push({
      type: "fly",
      from: { x: current.x, y: current.y },
      to: { x: START_POINT.x, y: START_POINT.y },
      duration: Math.min(800, 240 + distance(current, START_POINT) * 0.6),
      returning: true
    });
    segments.push({ type: "stop", point: START_POINT, duration: 500, cityIndex: byName[START_POINT.name] });

    // 总时长控制在 55 秒以内：只压缩飞行时间，城市停留仍为 1 秒
    var stopTotal = 0;
    var flyTotal = 0;
    segments.forEach(function (s) {
      if (s.type === "stop") stopTotal += s.duration;
      else flyTotal += s.duration;
    });
    var MAX_TOTAL = 55000;
    if (stopTotal + flyTotal > MAX_TOTAL && flyTotal > 0) {
      var k = Math.max(0.2, (MAX_TOTAL - stopTotal) / flyTotal);
      segments.forEach(function (s) { if (s.type === "fly") s.duration *= k; });
    }
    return segments;
  }

  function startJobSearch(done) {
    if (searchRunning) return;
    searchRunning = true;
    if (searchTimer) { clearTimeout(searchTimer); searchTimer = null; }

    var stage = document.getElementById("search-stage");
    var plane = document.getElementById("search-plane");
    var status = document.getElementById("search-status");
    if (!stage || !plane) {
      searchRunning = false;
      done();
      return;
    }

    var tier = (state.userProfile && state.userProfile.cityTier) || "二线城市";
    var rawCities = CITY_DB[tier] || CITY_DB["二线城市"];
    var cities = rawCities.map(function (c) {
      var p = projectCity(c);
      return { name: c.name, x: p.x, y: p.y };
    });

    searchPercent = 80;
    searchBarShown = -1;
    updateSearchBar(80);
    stage.classList.remove("is-done");
    stage.classList.toggle("is-dense", cities.length > 20);
    renderCityMarkers(cities);

    var markers = Array.prototype.slice.call(document.querySelectorAll("#city-markers .city-marker"));
    var activeMarker = -1;
    function activate(idx) {
      if (idx == null || !markers[idx]) return;
      if (activeMarker >= 0 && activeMarker !== idx && markers[activeMarker]) {
        markers[activeMarker].classList.remove("is-active");
      }
      markers[idx].classList.add("is-active");
      activeMarker = idx;
    }
    function deactivateMarker() {
      if (activeMarker >= 0 && markers[activeMarker]) {
        markers[activeMarker].classList.remove("is-active");
      }
      activeMarker = -1;
    }

    var segments = buildSegments(cities);
    var total = 0;
    segments.forEach(function (s) {
      s.start = total;
      total += s.duration;
    });

    function finish() {
      searchPercent = 100;
      updateSearchBar(100);
      var bar = document.querySelector("#page-search [data-progress-bar]");
      if (bar) {
        bar.classList.remove("is-front", "is-walking", "is-jumping");
        void bar.offsetWidth;
        bar.classList.add("is-jumping");
      }
      if (status) status.textContent = "检索完成，正在生成结果…";
      searchTimer = setTimeout(function () {
        stage.classList.add("is-done");
        searchTimer = setTimeout(function () {
          searchRunning = false;
          done();
        }, 280);
      }, 850);
    }

    var startTime = 0;
    var lastAngle = 0;
    setPlanePos(plane, START_POINT.x, START_POINT.y, 0);

    function frame(now) {
      if (!startTime) startTime = now;
      var elapsed = Math.min(total, now - startTime);

      var seg = segments[segments.length - 1];
      for (var i = 0; i < segments.length; i++) {
        if (elapsed < segments[i].start + segments[i].duration) {
          seg = segments[i];
          break;
        }
      }
      var local = Math.min(1, (elapsed - seg.start) / seg.duration);

      if (seg.type === "fly") {
        var eased = easeInOut(local);
        var x = seg.from.x + (seg.to.x - seg.from.x) * eased;
        var y = seg.from.y + (seg.to.y - seg.from.y) * eased;
        lastAngle = Math.atan2(seg.to.y - seg.from.y, seg.to.x - seg.from.x) * 180 / Math.PI;
        setPlanePos(plane, x, y, lastAngle);
        // 飞机离开后，上一个城市的标签恢复原大小
        deactivateMarker();
        if (status) {
          if (seg.returning) status.textContent = "正在返回武汉…";
          else if (seg.toName) status.innerHTML = "正在检索 <strong>" + seg.toName + "</strong> 的岗位…";
        }
      } else {
        setPlanePos(plane, seg.point.x, seg.point.y, lastAngle);
        if (seg.cityIndex != null) activate(seg.cityIndex);
        else deactivateMarker();
        if (status) {
          if (seg === segments[0]) {
            status.textContent = "正在武汉检索…";
          } else if (seg === segments[segments.length - 1]) {
            status.textContent = "检索完成…";
          } else if (seg.cityIndex != null && cities[seg.cityIndex]) {
            status.innerHTML = "正在检索 <strong>" + cities[seg.cityIndex].name + "</strong> 的岗位…";
          }
        }
      }

      searchPercent = (seg === segments[segments.length - 1]) ? 100 : 80 + 20 * (elapsed / total);
      updateSearchBar(searchPercent);

      if (elapsed < total) {
        searchRaf = requestAnimationFrame(frame);
      } else {
        finish();
      }
    }

    searchRaf = requestAnimationFrame(frame);
  }

  /* ============ 意向专业显隐 ============ */
  function initMajorToggle() {
    var wrapper = document.getElementById("major-wrapper");
    var input = document.getElementById("major");
    var radios = document.querySelectorAll('input[name="has-major"]');

    function sync() {
      var checked = document.querySelector('input[name="has-major"]:checked');
      var isYes = checked && checked.value === "yes";
      wrapper.style.display = isYes ? "block" : "none";
      if (!isYes) input.value = "";
    }
    for (var i = 0; i < radios.length; i++) radios[i].addEventListener("change", sync);
    sync();
  }

  /* ============ 手势提示文案切换（暂不接摄像头） ============ */
  var GESTURE_HINT_OFF = "开启摄像头可以进行隔空手势交互哦";
  var GESTURE_HINT_ON = "手往下移=页面下滑　手往上抬=页面上滑　手悬停两秒=选中";

  function initGestureHint() {
    var btn = document.getElementById("btn-gesture-toggle");
    var text = document.getElementById("gesture-hint-text");
    if (!btn || !text) return;
    var enabled = false;
    btn.addEventListener("click", function () {
      enabled = !enabled;
      text.textContent = enabled ? GESTURE_HINT_ON : GESTURE_HINT_OFF;
      btn.textContent = enabled ? "关闭" : "开启";
    });
  }

  /* ============ 渲染问卷（选项值：非常符合=5 … 完全不符合=1） ============ */
  function renderQuestions() {
    var container = document.getElementById("questions-container");
    container.innerHTML = "";

    QUESTIONS.forEach(function (q, idx) {
      var item = document.createElement("div");
      item.className = "question";
      item.id = "q-" + q.id;

      var header = document.createElement("div");
      header.className = "question-header";
      var num = document.createElement("span");
      num.className = "question-num";
      num.textContent = "Q" + (idx + 1);
      var tag = document.createElement("span");
      tag.className = "question-dim";
      tag.textContent = q.dim;
      header.appendChild(num);
      header.appendChild(tag);

      var text = document.createElement("p");
      text.className = "question-text";
      text.textContent = q.text;

      var opts = document.createElement("div");
      opts.className = "options";
      OPTIONS.forEach(function (opt, oi) {
        var label = document.createElement("label");
        label.className = "option";
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "question-" + q.id;
        radio.value = String(5 - oi);
        radio.addEventListener("change", function () {
          state.answers[q.id] = 5 - oi;
          item.classList.remove("error");
        });
        var span = document.createElement("span");
        span.textContent = opt;
        label.appendChild(radio);
        label.appendChild(span);
        opts.appendChild(label);
      });

      item.appendChild(header);
      item.appendChild(text);
      item.appendChild(opts);
      container.appendChild(item);
    });
  }

  /* ============ 计算 MBTI 类型 ============ */
  function calculateMBTI(answers) {
    var type = "";
    DIM_ORDER.forEach(function (dim) {
      var qs = QUESTIONS.filter(function (q) { return q.dim === dim; });
      var sum = 0;
      qs.forEach(function (q) { sum += answers[q.id] || 0; });
      type += (sum >= 15 ? DIM_LETTER[dim][0] : DIM_LETTER[dim][1]);
    });
    return type;
  }

  /* ============ 表单收集与校验 ============ */
  function collectUserProfile() {
    state.userProfile = {
      education: document.getElementById("education").value,
      cityTier: document.getElementById("city-tier").value,
      gender: document.getElementById("gender").value,
      major: document.getElementById("major").value.trim(),
      certificates: document.getElementById("certificates").value.trim(),
      strengths: document.getElementById("strengths").value.trim(),
      experience: document.getElementById("experience").value.trim(),
      health: document.getElementById("health").value.trim()
    };
  }

  function validateForm() {
    if (!document.getElementById("education").value) { alert("请先选择学历。"); return false; }
    if (!document.getElementById("gender").value) { alert("请选择性别。"); return false; }
    if (!document.getElementById("strengths").value.trim()) { alert("「个人特长」为必填项，请填写后再继续。"); return false; }
    return true;
  }

  function validateQuiz() {
    var missing = QUESTIONS.filter(function (q) { return !state.answers[q.id]; });
    if (missing.length) {
      alert("还有 " + missing.length + " 题未作答，请完成全部题目后提交。");
      missing.forEach(function (q) { document.getElementById("q-" + q.id).classList.add("error"); });
      document.getElementById("q-" + missing[0].id).scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  /* ============ 过滤 + 匹配 ============ */
  function extractCategories(jobs) {
    var result = [];
    var seen = {};
    jobs.forEach(function (j) {
      var c = j.category;
      if (c && !seen[c]) {
        seen[c] = true;
        var count = jobs.filter(function (x) { return x.category === c; }).length;
        result.push({ name: c, count: count });
      }
    });
    return result;
  }

  function runMatching() {
    var jobs = window.APP_DATA.JOBS || [];
    var filtered = (typeof window.filterJobs === "function")
      ? window.filterJobs(jobs, state.userProfile)
      : jobs;
    state.filteredJobs = filtered;
    state.matchedJobs = (typeof window.matchJobs === "function")
      ? window.matchJobs(filtered, state.userProfile, state.mbtiType)
      : filtered.slice(0, 10);
    state.categories = extractCategories(state.matchedJobs);
  }

  /* ============ 报告渲染 ============ */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* 行内 Markdown 链接 [文字](url) → 可点击链接（输入已转义） */
  function inlineMarkdown(s) {
    return s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, function (m, label, url) {
      return '<a class="report-link" href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
    });
  }

  /* 简易 Markdown → HTML：把报告文本渲染成带标题层级和列表的排版 */
  function markdownToHtml(text) {
    var lines = escapeHtml(text).split("\n");
    var out = [];
    var inList = false;
    function closeList() { if (inList) { out.push("</ul>"); inList = false; } }
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (/^### /.test(line)) { closeList(); out.push("<h3>" + line.slice(4) + "</h3>"); }
      else if (/^## /.test(line)) { closeList(); out.push("<h2>" + line.slice(3) + "</h2>"); }
      else if (/^# /.test(line)) { closeList(); out.push("<h1>" + line.slice(2) + "</h1>"); }
      else if (/^[-·] /.test(line)) { if (!inList) { out.push("<ul>"); inList = true; } out.push("<li>" + inlineMarkdown(line.slice(2)) + "</li>"); }
      else if (line === "") { closeList(); }
      else { closeList(); out.push("<div class=\"report-para\">" + inlineMarkdown(line) + "</div>"); }
    }
    closeList();
    return out.join("");
  }

  /* ============ 岗位胶囊 + 展开详情 ============ */
  function ownershipBadge(job) {
    if (job && job.category === "国企央企岗") return { text: "央国企", cls: "is-soe" };
    if (job && String(job.category || "").indexOf("机关/事业单位") === 0) return { text: "机关/事业", cls: "is-other" };
    return { text: "企业", cls: "is-other" };
  }

  function buildJobDetailHtml(job, index, userProfile) {
    var H = window.REPORT_HELPERS || {};
    var mbti = job.mbtiTypes || job.mbti;
    var missingCert = H.hasMissingCert ? H.hasMissingCert(job, userProfile) : false;
    var coef = H.getCityCoefficient ? H.getCityCoefficient(userProfile.cityTier) : 1;
    var cityLabel = H.citySalaryLabel ? H.citySalaryLabel(userProfile.cityTier) : "";
    var ageLimit = H.getJobAgeLimit ? H.getJobAgeLimit(job) : "18-60岁（以招聘公告为准）";
    var links = H.getJobSearchLinks ? H.getJobSearchLinks(job) : [];

    var html = [];
    html.push('<h3>' + (index + 1) + '. ' + escapeHtml(job.name || "未命名岗位") + (missingCert ? "（缺少证书）" : "") + '</h3>');
    html.push('<div class="job-detail-line">✅学历适配：' + escapeHtml(H.educationFit ? H.educationFit(userProfile.education, job.minEducation || job.education) : "—") + '</div>');
    html.push('<div class="job-detail-line">🧠人格适配：' + escapeHtml(Array.isArray(mbti) ? mbti.join("、") : (mbti || "不限")) + '（仅职业偏好参考）</div>');
    html.push('<div class="job-detail-line">🎖证书奖项适配：' + escapeHtml(job.certificates || "无硬性要求") + '</div>');
    html.push('<div class="job-detail-line">💪个人特长适配：' + escapeHtml(userProfile.strengths || "未填写") + '</div>');
    html.push('<div class="job-detail-line">📌真实工作内容：' + escapeHtml(job.work || "以企业招聘官网JD为准") + '</div>');
    html.push('<div class="job-detail-line">⏰标准上班工时：' + escapeHtml(job.workTime || "以企业招聘官网JD为准") + '</div>');
    html.push('<div class="job-detail-line">💰市场薪资参考：' + escapeHtml(H.formatSalary ? H.formatSalary(job.salary, coef) : (job.salary || "面议")) + '（' + escapeHtml(cityLabel) + '，市场参考）</div>');
    html.push('<div class="job-detail-line">🧓年龄限制：' + escapeHtml(ageLimit) + '</div>');
    html.push('<div class="job-detail-line">🧭身体/环境限制：' + escapeHtml(job.restrictions || "无特殊限制") + '</div>');

    var linkHtml = links.map(function (l) {
      return '<a class="job-link" href="' + escapeHtml(l.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(l.label) + '</a>';
    }).join("");
    html.push('<div class="job-detail-links">🔗更多详细参考：' + (linkHtml || "以企业招聘官网JD为准") + '</div>');
    return html.join("");
  }

  function buildJobsSectionHtml(jobs, userProfile) {
    var list = (jobs || []).filter(Boolean);
    var html = '<h2>四、最优适配岗位推荐</h2>';

    if (!list.length) {
      html += '<div class="report-para">暂未匹配到完全适配的岗位，建议放宽条件后重新测评。</div>';
      return html;
    }

    html += '<div class="report-para">点击下方岗位胶囊查看详细内容；央国企岗位仅提供官方招聘平台入口，具体以目标单位官网公告为准。</div>';
    html += '<div class="job-pill-grid">';
    list.forEach(function (job, i) {
      var badge = ownershipBadge(job);
      html += '<button type="button" class="job-pill" data-job-idx="' + i + '">'
        + '<span class="job-pill-name">' + escapeHtml(job.name || "未命名岗位") + '</span>'
        + '<span class="job-pill-badge ' + badge.cls + '">' + badge.text + '</span>'
        + '</button>';
    });
    html += '</div><div class="job-detail-wrap">';
    list.forEach(function (job, i) {
      html += '<div class="job-detail-panel" data-job-panel="' + i + '" hidden>'
        + buildJobDetailHtml(job, i, userProfile)
        + '</div>';
    });
    html += '</div>';
    return html;
  }

  /* 把报告文本按「四、最优适配岗位推荐」拆开，岗位部分用胶囊+折叠详情渲染 */
  function renderReportHtml(text, jobs, userProfile) {
    var marker = "## 四、最优适配岗位推荐";
    var start = text.indexOf(marker);
    if (start === -1) return markdownToHtml(text);

    var lineEnd = text.indexOf("\n", start);
    var nextSection = lineEnd === -1 ? -1 : text.indexOf("\n## ", lineEnd);
    var before = text.slice(0, start);
    var after = nextSection === -1 ? "" : text.slice(nextSection);

    return markdownToHtml(before) + buildJobsSectionHtml(jobs, userProfile) + markdownToHtml(after);
  }

  function bindJobPills(container) {
    var pills = container.querySelectorAll(".job-pill");
    var panels = container.querySelectorAll(".job-detail-panel");

    function closeAll() {
      for (var i = 0; i < panels.length; i++) {
        panels[i].hidden = true;
        if (pills[i]) pills[i].classList.remove("active");
      }
    }

    for (var i = 0; i < pills.length; i++) {
      (function (idx) {
        pills[idx].addEventListener("click", function () {
          var wasActive = pills[idx].classList.contains("active");
          closeAll();
          if (!wasActive && panels[idx]) {
            panels[idx].hidden = false;
            pills[idx].classList.add("active");
            panels[idx].scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      })(i);
    }
  }

  /* 清理动态按钮（查看详情 / 返回分类） */
  function clearDynamicButtons() {
    ["btn-show-jobs", "btn-back-categories"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });
  }

  function renderFullReport() {
    clearDynamicButtons();

    var container = document.getElementById("report-content");
    if (typeof window.generateReport === "function") {
      state.reportText = window.generateReport(state.userProfile, state.mbtiType, state.matchedJobs, state.filteredJobs);
    } else {
      state.reportText = "报告模块未加载。";
    }
    // 把 Markdown 报告文本转成 HTML 排版后渲染；岗位推荐区用胶囊+折叠详情
    container.innerHTML = renderReportHtml(state.reportText, state.matchedJobs, state.userProfile);
    bindJobPills(container);
    document.getElementById("btn-copy").style.display = "block";
  }

  function renderCategories() {
    clearDynamicButtons();

    var container = document.getElementById("report-content");
    document.getElementById("btn-copy").style.display = "none";

    var html = '<p class="report-text-block">以下是从你的匹配结果中提取的适配职业大类，点击分类可查看该类岗位：</p>';
    html += '<div class="job-grid">';
    if (state.categories.length) {
      state.categories.forEach(function (c, idx) {
        html += '<div class="job-card job-card-clickable" data-idx="' + idx + '">'
          + '<div class="job-card-head">'
          + '<span class="job-card-title">' + escapeHtml(c.name) + '</span>'
          + '<span class="job-card-match">' + c.count + ' 个岗位</span>'
          + '</div></div>';
      });
    } else {
      html += '<p class="report-text-block">暂未匹配到岗位，建议放宽条件后重新测评。</p>';
    }
    html += '</div>';
    container.innerHTML = html;

    // 给分类卡片绑定点击：查看该分类下的岗位
    var cards = container.querySelectorAll(".job-card-clickable");
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-idx"), 10);
        renderCategoryJobs(state.categories[idx].name);
      });
    }

    if (state.categories.length) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-primary btn-block";
      btn.id = "btn-show-jobs";
      btn.textContent = "查看推荐岗位详情";
      btn.addEventListener("click", renderFullReport);
      container.after(btn);
    }
  }

  /* 分步探索：点击某个职业分类，展示该分类下的岗位 */
  function renderCategoryJobs(categoryName) {
    clearDynamicButtons();

    var container = document.getElementById("report-content");
    document.getElementById("btn-copy").style.display = "none";

    var categoryMatched = (state.matchedJobs || []).filter(function (j) {
      return j.category === categoryName;
    });
    var categoryFiltered = (state.filteredJobs || []).filter(function (j) {
      return j.category === categoryName;
    });

    if (typeof window.generateReport === "function") {
      state.reportText = window.generateReport(state.userProfile, state.mbtiType, categoryMatched, categoryFiltered);
    } else {
      state.reportText = "报告模块未加载。";
    }
    container.innerHTML = renderReportHtml(state.reportText, categoryMatched, state.userProfile);
    bindJobPills(container);

    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "btn btn-ghost btn-block";
    backBtn.id = "btn-back-categories";
    backBtn.textContent = "← 返回职业分类";
    backBtn.addEventListener("click", renderCategories);
    container.after(backBtn);

    document.getElementById("btn-copy").style.display = "block";
  }

  /* ============ 复制报告 ============ */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function copyReport() {
    var text = state.reportText || "";
    if (!text) return;
    function done() {
      var btn = document.getElementById("btn-copy");
      var old = btn.textContent;
      btn.textContent = "已复制 ✓";
      setTimeout(function () { btn.textContent = old; }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  /* ============ 事件绑定 ============ */
  function bindEvents() {
    document.getElementById("btn-next").addEventListener("click", function () {
      if (!validateForm()) return;
      collectUserProfile();
      showPage("page-quiz");
    });

    document.getElementById("btn-submit").addEventListener("click", function () {
      if (!validateQuiz()) return;
      state.mbtiType = calculateMBTI(state.answers);
      runMatching();
      searchPercent = 80;
      showPage("page-search");
      startJobSearch(function () { showPage("page-mode"); });
    });

    document.getElementById("btn-explore").addEventListener("click", function () {
      renderCategories();
      showPage("page-report");
    });

    document.getElementById("btn-direct").addEventListener("click", function () {
      renderFullReport();
      showPage("page-report");
    });

    document.getElementById("btn-copy").addEventListener("click", copyReport);

    document.getElementById("btn-restart").addEventListener("click", function () {
      location.reload();
    });
  }

  /* ============ 初始化：默认显示填表页 ============ */
  function init() {
    initProgressBars();
    showPage("page-form");
    document.getElementById("btn-copy").style.display = "none";
    initMajorToggle();
    initGestureHint();
    renderQuestions();
    bindEvents();

    document.addEventListener("input", updateActiveProgress);
    document.addEventListener("change", updateActiveProgress);
    window.addEventListener("resize", function () {
      var page = document.querySelector(".page.active");
      if (!page) return;
      var bar = page.querySelector("[data-progress-bar]");
      if (bar) setBarProgress(bar, pageProgress(page.id));
    });
  }

  document.addEventListener("DOMContentLoaded", init);

  window.calculateMBTI = calculateMBTI;
})();
