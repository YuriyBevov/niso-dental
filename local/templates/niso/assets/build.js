var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __publicField = (obj, key, value) =>
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function isObject$2(obj) {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "constructor" in obj &&
    obj.constructor === Object
  );
}
function extend$1(target, src) {
  if (target === void 0) {
    target = {};
  }
  if (src === void 0) {
    src = {};
  }
  Object.keys(src).forEach((key) => {
    if (typeof target[key] === "undefined") target[key] = src[key];
    else if (
      isObject$2(src[key]) &&
      isObject$2(target[key]) &&
      Object.keys(src[key]).length > 0
    ) {
      extend$1(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {},
  removeEventListener() {},
  activeElement: {
    blur() {},
    nodeName: "",
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {},
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {},
      getElementsByTagName() {
        return [];
      },
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
};
function getDocument() {
  const doc = typeof document !== "undefined" ? document : {};
  extend$1(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: "",
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
  history: {
    replaceState() {},
    pushState() {},
    go() {},
    back() {},
  },
  CustomEvent: function CustomEvent2() {
    return this;
  },
  addEventListener() {},
  removeEventListener() {},
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      },
    };
  },
  Image() {},
  Date() {},
  screen: {},
  setTimeout() {},
  clearTimeout() {},
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === "undefined") {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === "undefined") {
      return;
    }
    clearTimeout(id);
  },
};
function getWindow() {
  const win = typeof window !== "undefined" ? window : {};
  extend$1(win, ssrWindow);
  return win;
}
function classesToTokens(classes2) {
  if (classes2 === void 0) {
    classes2 = "";
  }
  return classes2
    .trim()
    .split(" ")
    .filter((c2) => !!c2.trim());
}
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e2) {}
    try {
      delete object[key];
    } catch (e2) {}
  });
}
function nextTick(callback, delay) {
  if (delay === void 0) {
    delay = 0;
  }
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window2 = getWindow();
  let style;
  if (window2.getComputedStyle) {
    style = window2.getComputedStyle(el, null);
  }
  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }
  if (!style) {
    style = el.style;
  }
  return style;
}
function getTranslate(el, axis) {
  if (axis === void 0) {
    axis = "x";
  }
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform
        .split(", ")
        .map((a2) => a2.replace(",", "."))
        .join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(
      curTransform === "none" ? "" : curTransform
    );
  } else {
    transformMatrix =
      curStyle.MozTransform ||
      curStyle.OTransform ||
      curStyle.MsTransform ||
      curStyle.msTransform ||
      curStyle.transform ||
      curStyle
        .getPropertyValue("transform")
        .replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m41;
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
    else curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix) curTransform = transformMatrix.m42;
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
    else curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject$1(o2) {
  return (
    typeof o2 === "object" &&
    o2 !== null &&
    o2.constructor &&
    Object.prototype.toString.call(o2).slice(8, -1) === "Object"
  );
}
function isNode(node) {
  if (
    typeof window !== "undefined" &&
    typeof window.HTMLElement !== "undefined"
  ) {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend() {
  const to = Object(arguments.length <= 0 ? void 0 : arguments[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i2 = 1; i2 < arguments.length; i2 += 1) {
    const nextSource =
      i2 < 0 || arguments.length <= i2 ? void 0 : arguments[i2];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter(
        (key) => noExtend.indexOf(key) < 0
      );
      for (
        let nextIndex = 0, len = keysArray.length;
        nextIndex < len;
        nextIndex += 1
      ) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else if (
            !isObject$1(to[nextKey]) &&
            isObject$1(nextSource[nextKey])
          ) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll(_ref) {
  let { swiper, targetPosition, side } = _ref;
  const window2 = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current, target) => {
    return (
      (dir === "next" && current >= target) ||
      (dir === "prev" && current <= target)
    );
  };
  const animate = () => {
    time = /* @__PURE__ */ new Date().getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition =
      startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper.wrapperEl.scrollTo({
      [side]: currentPosition,
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = "hidden";
      swiper.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = "";
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition,
        });
      });
      window2.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }
    swiper.cssModeFrameID = window2.requestAnimationFrame(animate);
  };
  animate();
}
function getSlideTransformEl(slideEl) {
  return (
    slideEl.querySelector(".swiper-slide-transform") ||
    (slideEl.shadowRoot &&
      slideEl.shadowRoot.querySelector(".swiper-slide-transform")) ||
    slideEl
  );
}
function elementChildren(element, selector3) {
  if (selector3 === void 0) {
    selector3 = "";
  }
  const children = [...element.children];
  if (element instanceof HTMLSlotElement) {
    children.push(...element.assignedElements());
  }
  if (!selector3) {
    return children;
  }
  return children.filter((el) => el.matches(selector3));
}
function elementIsChildOf(el, parent) {
  const isChild = parent.contains(el);
  if (!isChild && parent instanceof HTMLSlotElement) {
    const children = [...parent.assignedElements()];
    return children.includes(el);
  }
  return isChild;
}
function showWarning(text) {
  try {
    console.warn(text);
    return;
  } catch (err) {}
}
function createElement(tag, classes2) {
  if (classes2 === void 0) {
    classes2 = [];
  }
  const el = document.createElement(tag);
  el.classList.add(
    ...(Array.isArray(classes2) ? classes2 : classesToTokens(classes2))
  );
  return el;
}
function elementPrevAll(el, selector3) {
  const prevEls = [];
  while (el.previousElementSibling) {
    const prev = el.previousElementSibling;
    if (selector3) {
      if (prev.matches(selector3)) prevEls.push(prev);
    } else prevEls.push(prev);
    el = prev;
  }
  return prevEls;
}
function elementNextAll(el, selector3) {
  const nextEls = [];
  while (el.nextElementSibling) {
    const next = el.nextElementSibling;
    if (selector3) {
      if (next.matches(selector3)) nextEls.push(next);
    } else nextEls.push(next);
    el = next;
  }
  return nextEls;
}
function elementStyle(el, prop) {
  const window2 = getWindow();
  return window2.getComputedStyle(el, null).getPropertyValue(prop);
}
function elementIndex(el) {
  let child = el;
  let i2;
  if (child) {
    i2 = 0;
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i2 += 1;
    }
    return i2;
  }
  return void 0;
}
function elementParents(el, selector3) {
  const parents = [];
  let parent = el.parentElement;
  while (parent) {
    if (selector3) {
      if (parent.matches(selector3)) parents.push(parent);
    } else {
      parents.push(parent);
    }
    parent = parent.parentElement;
  }
  return parents;
}
function elementTransitionEnd(el, callback) {
  function fireCallBack(e2) {
    if (e2.target !== el) return;
    callback.call(el, e2);
    el.removeEventListener("transitionend", fireCallBack);
  }
  if (callback) {
    el.addEventListener("transitionend", fireCallBack);
  }
}
function elementOuterSize(el, size, includeMargins) {
  const window2 = getWindow();
  {
    return (
      el[size === "width" ? "offsetWidth" : "offsetHeight"] +
      parseFloat(
        window2
          .getComputedStyle(el, null)
          .getPropertyValue(size === "width" ? "margin-right" : "margin-top")
      ) +
      parseFloat(
        window2
          .getComputedStyle(el, null)
          .getPropertyValue(size === "width" ? "margin-left" : "margin-bottom")
      )
    );
  }
}
function makeElementsArray(el) {
  return (Array.isArray(el) ? el : [el]).filter((e2) => !!e2);
}
let support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll:
      document2.documentElement &&
      document2.documentElement.style &&
      "scrollBehavior" in document2.documentElement.style,
    touch: !!(
      "ontouchstart" in window2 ||
      (window2.DocumentTouch && document2 instanceof window2.DocumentTouch)
    ),
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
let deviceCached;
function calcDevice(_temp) {
  let { userAgent } = _temp === void 0 ? {} : _temp;
  const support2 = getSupport();
  const window2 = getWindow();
  const platform = window2.navigator.platform;
  const ua = userAgent || window2.navigator.userAgent;
  const device = {
    ios: false,
    android: false,
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === "Win32";
  let macos = platform === "MacIntel";
  const iPadScreens = [
    "1024x1366",
    "1366x1024",
    "834x1194",
    "1194x834",
    "834x1112",
    "1112x834",
    "768x1024",
    "1024x768",
    "820x1180",
    "1180x820",
    "810x1080",
    "1080x810",
  ];
  if (
    !ipad &&
    macos &&
    support2.touch &&
    iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0
  ) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device.os = "android";
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  return device;
}
function getDevice(overrides) {
  if (overrides === void 0) {
    overrides = {};
  }
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
let browser;
function calcBrowser() {
  const window2 = getWindow();
  const device = getDevice();
  let needPerspectiveFix = false;
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return (
      ua.indexOf("safari") >= 0 &&
      ua.indexOf("chrome") < 0 &&
      ua.indexOf("android") < 0
    );
  }
  if (isSafari()) {
    const ua = String(window2.navigator.userAgent);
    if (ua.includes("Version/")) {
      const [major, minor] = ua
        .split("Version/")[1]
        .split(" ")[0]
        .split(".")
        .map((num) => Number(num));
      needPerspectiveFix = major < 16 || (major === 16 && minor < 2);
    }
  }
  const isWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
    window2.navigator.userAgent
  );
  const isSafariBrowser = isSafari();
  const need3dFix = isSafariBrowser || (isWebView && device.ios);
  return {
    isSafari: needPerspectiveFix || isSafariBrowser,
    needPerspectiveFix,
    need3dFix,
    isWebView,
  };
}
function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }
  return browser;
}
function Resize(_ref) {
  let { swiper, on, emit } = _ref;
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const { width, height } = swiper;
        let newWidth = width;
        let newHeight = height;
        entries.forEach((_ref2) => {
          let { contentBoxSize, contentRect, target } = _ref2;
          if (target && target !== swiper.el) return;
          newWidth = contentRect
            ? contentRect.width
            : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect
            ? contentRect.height
            : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit("orientationchange");
  };
  on("init", () => {
    if (
      swiper.params.resizeObserver &&
      typeof window2.ResizeObserver !== "undefined"
    ) {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer(_ref) {
  let { swiper, extendParams, on, emit } = _ref;
  const observers = [];
  const window2 = getWindow();
  const attach = function (target, options) {
    if (options === void 0) {
      options = {};
    }
    const ObserverFunc =
      window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (swiper.__preventObserver__) return;
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes:
        typeof options.attributes === "undefined" ? true : options.attributes,
      childList:
        swiper.isElement ||
        (typeof options.childList === "undefined" ? true : options).childList,
      characterData:
        typeof options.characterData === "undefined"
          ? true
          : options.characterData,
    });
    observers.push(observer);
  };
  const init4 = () => {
    if (!swiper.params.observer) return;
    if (swiper.params.observeParents) {
      const containerParents = elementParents(swiper.hostEl);
      for (let i2 = 0; i2 < containerParents.length; i2 += 1) {
        attach(containerParents[i2]);
      }
    }
    attach(swiper.hostEl, {
      childList: swiper.params.observeSlideChildren,
    });
    attach(swiper.wrapperEl, {
      attributes: false,
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false,
  });
  on("init", init4);
  on("destroy", destroy);
}
var eventsEmitter = {
  on(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed) return self2;
    if (typeof handler !== "function") return self2;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event) => {
      if (!self2.eventsListeners[event]) self2.eventsListeners[event] = [];
      self2.eventsListeners[event][method](handler);
    });
    return self2;
  },
  once(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed) return self2;
    if (typeof handler !== "function") return self2;
    function onceHandler() {
      self2.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }
      handler.apply(self2, args);
    }
    onceHandler.__emitterProxy = handler;
    return self2.on(events2, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed) return self2;
    if (typeof handler !== "function") return self2;
    const method = priority ? "unshift" : "push";
    if (self2.eventsAnyListeners.indexOf(handler) < 0) {
      self2.eventsAnyListeners[method](handler);
    }
    return self2;
  },
  offAny(handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed) return self2;
    if (!self2.eventsAnyListeners) return self2;
    const index = self2.eventsAnyListeners.indexOf(handler);
    if (index >= 0) {
      self2.eventsAnyListeners.splice(index, 1);
    }
    return self2;
  },
  off(events2, handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed) return self2;
    if (!self2.eventsListeners) return self2;
    events2.split(" ").forEach((event) => {
      if (typeof handler === "undefined") {
        self2.eventsListeners[event] = [];
      } else if (self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler, index) => {
          if (
            eventHandler === handler ||
            (eventHandler.__emitterProxy &&
              eventHandler.__emitterProxy === handler)
          ) {
            self2.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self2;
  },
  emit() {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed) return self2;
    if (!self2.eventsListeners) return self2;
    let events2;
    let data;
    let context3;
    for (
      var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2];
    }
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data = args.slice(1, args.length);
      context3 = self2;
    } else {
      events2 = args[0].events;
      data = args[0].data;
      context3 = args[0].context || self2;
    }
    data.unshift(context3);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event) => {
      if (self2.eventsAnyListeners && self2.eventsAnyListeners.length) {
        self2.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context3, [event, ...data]);
        });
      }
      if (self2.eventsListeners && self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler) => {
          eventHandler.apply(context3, data);
        });
      }
    });
    return self2;
  },
};
function updateSize() {
  const swiper = this;
  let width;
  let height;
  const el = swiper.el;
  if (
    typeof swiper.params.width !== "undefined" &&
    swiper.params.width !== null
  ) {
    width = swiper.params.width;
  } else {
    width = el.clientWidth;
  }
  if (
    typeof swiper.params.height !== "undefined" &&
    swiper.params.height !== null
  ) {
    height = swiper.params.height;
  } else {
    height = el.clientHeight;
  }
  if (
    (width === 0 && swiper.isHorizontal()) ||
    (height === 0 && swiper.isVertical())
  ) {
    return;
  }
  width =
    width -
    parseInt(elementStyle(el, "padding-left") || 0, 10) -
    parseInt(elementStyle(el, "padding-right") || 0, 10);
  height =
    height -
    parseInt(elementStyle(el, "padding-top") || 0, 10) -
    parseInt(elementStyle(el, "padding-bottom") || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height,
  });
}
function updateSlides() {
  const swiper = this;
  function getDirectionPropertyValue(node, label) {
    return parseFloat(
      node.getPropertyValue(swiper.getDirectionLabel(label)) || 0
    );
  }
  const params = swiper.params;
  const {
    wrapperEl,
    slidesEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL,
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual
    ? swiper.virtual.slides.length
    : swiper.slides.length;
  const slides = elementChildren(
    slidesEl,
    `.${swiper.params.slideClass}, swiper-slide`
  );
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }
  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween =
      (parseFloat(spaceBetween.replace("%", "")) / 100) * swiperSize;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  swiper.virtualSize = -spaceBetween;
  slides.forEach((slideEl) => {
    if (rtl) {
      slideEl.style.marginLeft = "";
    } else {
      slideEl.style.marginRight = "";
    }
    slideEl.style.marginBottom = "";
    slideEl.style.marginTop = "";
  });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;
  if (gridEnabled) {
    swiper.grid.initSlides(slides);
  } else if (swiper.grid) {
    swiper.grid.unsetSlides();
  }
  let slideSize;
  const shouldResetSlideSize =
    params.slidesPerView === "auto" &&
    params.breakpoints &&
    Object.keys(params.breakpoints).filter((key) => {
      return typeof params.breakpoints[key].slidesPerView !== "undefined";
    }).length > 0;
  for (let i2 = 0; i2 < slidesLength; i2 += 1) {
    slideSize = 0;
    let slide2;
    if (slides[i2]) slide2 = slides[i2];
    if (gridEnabled) {
      swiper.grid.updateSlide(i2, slide2, slides);
    }
    if (slides[i2] && elementStyle(slide2, "display") === "none") continue;
    if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slides[i2].style[swiper.getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2);
      const currentTransform = slide2.style.transform;
      const currentWebKitTransform = slide2.style.webkitTransform;
      if (currentTransform) {
        slide2.style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper.isHorizontal()
          ? elementOuterSize(slide2, "width")
          : elementOuterSize(slide2, "height");
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(
          slideStyles,
          "padding-left"
        );
        const paddingRight = getDirectionPropertyValue(
          slideStyles,
          "padding-right"
        );
        const marginLeft = getDirectionPropertyValue(
          slideStyles,
          "margin-left"
        );
        const marginRight = getDirectionPropertyValue(
          slideStyles,
          "margin-right"
        );
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const { clientWidth, offsetWidth } = slide2;
          slideSize =
            width +
            paddingLeft +
            paddingRight +
            marginLeft +
            marginRight +
            (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2.style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2.style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize =
        (swiperSize - (params.slidesPerView - 1) * spaceBetween) /
        params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);
      if (slides[i2]) {
        slides[i2].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slides[i2]) {
      slides[i2].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition =
        slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i2 !== 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i2 === 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (
        (index - Math.min(swiper.params.slidesPerGroupSkip, index)) %
          swiper.params.slidesPerGroup ===
        0
      )
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }
  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;
  if (
    rtl &&
    wrongRTL &&
    (params.effect === "slide" || params.effect === "coverflow")
  ) {
    wrapperEl.style.width = `${swiper.virtualSize + spaceBetween}px`;
  }
  if (params.setWrapperSize) {
    wrapperEl.style[swiper.getDirectionLabel("width")] =
      `${swiper.virtualSize + spaceBetween}px`;
  }
  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i2 = 0; i2 < snapGrid.length; i2 += 1) {
      let slidesGridItem = snapGrid[i2];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i2] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (
      Math.floor(swiper.virtualSize - swiperSize) -
        Math.floor(snapGrid[snapGrid.length - 1]) >
      1
    ) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }
  if (isVirtual && params.loop) {
    const size = slidesSizesGrid[0] + spaceBetween;
    if (params.slidesPerGroup > 1) {
      const groups = Math.ceil(
        (swiper.virtual.slidesBefore + swiper.virtual.slidesAfter) /
          params.slidesPerGroup
      );
      const groupSize = size * params.slidesPerGroup;
      for (let i2 = 0; i2 < groups; i2 += 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
      }
    }
    for (
      let i2 = 0;
      i2 < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter;
      i2 += 1
    ) {
      if (params.slidesPerGroup === 1) {
        snapGrid.push(snapGrid[snapGrid.length - 1] + size);
      }
      slidesGrid.push(slidesGrid[slidesGrid.length - 1] + size);
      swiper.virtualSize += size;
    }
  }
  if (snapGrid.length === 0) snapGrid = [0];
  if (spaceBetween !== 0) {
    const key =
      swiper.isHorizontal() && rtl
        ? "marginLeft"
        : swiper.getDirectionLabel("marginRight");
    slides
      .filter((_2, slideIndex) => {
        if (!params.cssMode || params.loop) return true;
        if (slideIndex === slides.length - 1) {
          return false;
        }
        return true;
      })
      .forEach((slideEl) => {
        slideEl.style[key] = `${spaceBetween}px`;
      });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const maxSnap = allSlidesSize > swiperSize ? allSlidesSize - swiperSize : 0;
    snapGrid = snapGrid.map((snap3) => {
      if (snap3 <= 0) return -offsetBefore;
      if (snap3 > maxSnap) return maxSnap + offsetAfter;
      return snap3;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (spaceBetween || 0);
    });
    allSlidesSize -= spaceBetween;
    const offsetSize =
      (params.slidesOffsetBefore || 0) + (params.slidesOffsetAfter || 0);
    if (allSlidesSize + offsetSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize - offsetSize) / 2;
      snapGrid.forEach((snap3, snapIndex) => {
        snapGrid[snapIndex] = snap3 - allSlidesOffset;
      });
      slidesGrid.forEach((snap3, snapIndex) => {
        slidesGrid[snapIndex] = snap3 + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid,
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(
      wrapperEl,
      "--swiper-centered-offset-before",
      `${-snapGrid[0]}px`
    );
    setCSSProperty(
      wrapperEl,
      "--swiper-centered-offset-after",
      `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`
    );
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map((v2) => v2 + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map((v2) => v2 + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  swiper.emit("slidesUpdated");
  if (
    !isVirtual &&
    !params.cssMode &&
    (params.effect === "slide" || params.effect === "fade")
  ) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded =
      swiper.el.classList.contains(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded)
        swiper.el.classList.add(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper.el.classList.remove(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i2;
  if (typeof speed === "number") {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }
  const getSlideByIndex = (index) => {
    if (isVirtual) {
      return swiper.slides[swiper.getSlideIndexByData(index)];
    }
    return swiper.slides[index];
  };
  if (
    swiper.params.slidesPerView !== "auto" &&
    swiper.params.slidesPerView > 1
  ) {
    if (swiper.params.centeredSlides) {
      (swiper.visibleSlides || []).forEach((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i2 = 0; i2 < Math.ceil(swiper.params.slidesPerView); i2 += 1) {
        const index = swiper.activeIndex + i2;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  }
  for (i2 = 0; i2 < activeSlides.length; i2 += 1) {
    if (typeof activeSlides[i2] !== "undefined") {
      const height = activeSlides[i2].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0)
    swiper.wrapperEl.style.height = `${newHeight}px`;
}
function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;
  const minusOffset = swiper.isElement
    ? swiper.isHorizontal()
      ? swiper.wrapperEl.offsetLeft
      : swiper.wrapperEl.offsetTop
    : 0;
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    slides[i2].swiperSlideOffset =
      (swiper.isHorizontal() ? slides[i2].offsetLeft : slides[i2].offsetTop) -
      minusOffset -
      swiper.cssOverflowAdjustment();
  }
}
const toggleSlideClasses$1 = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesProgress(translate2) {
  if (translate2 === void 0) {
    translate2 = (this && this.translate) || 0;
  }
  const swiper = this;
  const params = swiper.params;
  const { slides, rtlTranslate: rtl, snapGrid } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === "undefined")
    swiper.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl) offsetCenter = translate2;
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];
  let spaceBetween = params.spaceBetween;
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween =
      (parseFloat(spaceBetween.replace("%", "")) / 100) * swiper.size;
  } else if (typeof spaceBetween === "string") {
    spaceBetween = parseFloat(spaceBetween);
  }
  for (let i2 = 0; i2 < slides.length; i2 += 1) {
    const slide2 = slides[i2];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress =
      (offsetCenter +
        (params.centeredSlides ? swiper.minTranslate() : 0) -
        slideOffset) /
      (slide2.swiperSlideSize + spaceBetween);
    const originalSlideProgress =
      (offsetCenter -
        snapGrid[0] +
        (params.centeredSlides ? swiper.minTranslate() : 0) -
        slideOffset) /
      (slide2.swiperSlideSize + spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i2];
    const isFullyVisible =
      slideBefore >= 0 &&
      slideBefore <= swiper.size - swiper.slidesSizesGrid[i2];
    const isVisible =
      (slideBefore >= 0 && slideBefore < swiper.size - 1) ||
      (slideAfter > 1 && slideAfter <= swiper.size) ||
      (slideBefore <= 0 && slideAfter >= swiper.size);
    if (isVisible) {
      swiper.visibleSlides.push(slide2);
      swiper.visibleSlidesIndexes.push(i2);
    }
    toggleSlideClasses$1(slide2, isVisible, params.slideVisibleClass);
    toggleSlideClasses$1(slide2, isFullyVisible, params.slideFullyVisibleClass);
    slide2.progress = rtl ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl
      ? -originalSlideProgress
      : originalSlideProgress;
  }
}
function updateProgress(translate2) {
  const swiper = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper.rtlTranslate ? -1 : 1;
    translate2 =
      (swiper && swiper.translate && swiper.translate * multiplier) || 0;
  }
  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let { progress, isBeginning, isEnd, progressLoop } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper.minTranslate()) / translatesDiff;
    const isBeginningRounded = Math.abs(translate2 - swiper.minTranslate()) < 1;
    const isEndRounded = Math.abs(translate2 - swiper.maxTranslate()) < 1;
    isBeginning = isBeginningRounded || progress <= 0;
    isEnd = isEndRounded || progress >= 1;
    if (isBeginningRounded) progress = 0;
    if (isEndRounded) progress = 1;
  }
  if (params.loop) {
    const firstSlideIndex = swiper.getSlideIndexByData(0);
    const lastSlideIndex = swiper.getSlideIndexByData(swiper.slides.length - 1);
    const firstSlideTranslate = swiper.slidesGrid[firstSlideIndex];
    const lastSlideTranslate = swiper.slidesGrid[lastSlideIndex];
    const translateMax = swiper.slidesGrid[swiper.slidesGrid.length - 1];
    const translateAbs = Math.abs(translate2);
    if (translateAbs >= firstSlideTranslate) {
      progressLoop = (translateAbs - firstSlideTranslate) / translateMax;
    } else {
      progressLoop =
        (translateAbs + translateMax - lastSlideTranslate) / translateMax;
    }
    if (progressLoop > 1) progressLoop -= 1;
  }
  Object.assign(swiper, {
    progress,
    progressLoop,
    isBeginning,
    isEnd,
  });
  if (
    params.watchSlidesProgress ||
    (params.centeredSlides && params.autoHeight)
  )
    swiper.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper.emit("reachEnd toEdge");
  }
  if ((wasBeginning && !isBeginning) || (wasEnd && !isEnd)) {
    swiper.emit("fromEdge");
  }
  swiper.emit("progress", progress);
}
const toggleSlideClasses = (slideEl, condition, className) => {
  if (condition && !slideEl.classList.contains(className)) {
    slideEl.classList.add(className);
  } else if (!condition && slideEl.classList.contains(className)) {
    slideEl.classList.remove(className);
  }
};
function updateSlidesClasses() {
  const swiper = this;
  const { slides, params, slidesEl, activeIndex } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const getFilteredSlide = (selector3) => {
    return elementChildren(
      slidesEl,
      `.${params.slideClass}${selector3}, swiper-slide${selector3}`
    )[0];
  };
  let activeSlide;
  let prevSlide;
  let nextSlide;
  if (isVirtual) {
    if (params.loop) {
      let slideIndex = activeIndex - swiper.virtual.slidesBefore;
      if (slideIndex < 0)
        slideIndex = swiper.virtual.slides.length + slideIndex;
      if (slideIndex >= swiper.virtual.slides.length)
        slideIndex -= swiper.virtual.slides.length;
      activeSlide = getFilteredSlide(
        `[data-swiper-slide-index="${slideIndex}"]`
      );
    } else {
      activeSlide = getFilteredSlide(
        `[data-swiper-slide-index="${activeIndex}"]`
      );
    }
  } else {
    if (gridEnabled) {
      activeSlide = slides.filter(
        (slideEl) => slideEl.column === activeIndex
      )[0];
      nextSlide = slides.filter(
        (slideEl) => slideEl.column === activeIndex + 1
      )[0];
      prevSlide = slides.filter(
        (slideEl) => slideEl.column === activeIndex - 1
      )[0];
    } else {
      activeSlide = slides[activeIndex];
    }
  }
  if (activeSlide) {
    if (!gridEnabled) {
      nextSlide = elementNextAll(
        activeSlide,
        `.${params.slideClass}, swiper-slide`
      )[0];
      if (params.loop && !nextSlide) {
        nextSlide = slides[0];
      }
      prevSlide = elementPrevAll(
        activeSlide,
        `.${params.slideClass}, swiper-slide`
      )[0];
      if (params.loop && !prevSlide === 0) {
        prevSlide = slides[slides.length - 1];
      }
    }
  }
  slides.forEach((slideEl) => {
    toggleSlideClasses(
      slideEl,
      slideEl === activeSlide,
      params.slideActiveClass
    );
    toggleSlideClasses(slideEl, slideEl === nextSlide, params.slideNextClass);
    toggleSlideClasses(slideEl, slideEl === prevSlide, params.slidePrevClass);
  });
  swiper.emitSlidesClasses();
}
const processLazyPreloader = (swiper, imageEl) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  const slideSelector = () =>
    swiper.isElement ? `swiper-slide` : `.${swiper.params.slideClass}`;
  const slideEl = imageEl.closest(slideSelector());
  if (slideEl) {
    let lazyEl = slideEl.querySelector(`.${swiper.params.lazyPreloaderClass}`);
    if (!lazyEl && swiper.isElement) {
      if (slideEl.shadowRoot) {
        lazyEl = slideEl.shadowRoot.querySelector(
          `.${swiper.params.lazyPreloaderClass}`
        );
      } else {
        requestAnimationFrame(() => {
          if (slideEl.shadowRoot) {
            lazyEl = slideEl.shadowRoot.querySelector(
              `.${swiper.params.lazyPreloaderClass}`
            );
            if (lazyEl) lazyEl.remove();
          }
        });
      }
    }
    if (lazyEl) lazyEl.remove();
  }
};
const unlazy = (swiper, index) => {
  if (!swiper.slides[index]) return;
  const imageEl = swiper.slides[index].querySelector('[loading="lazy"]');
  if (imageEl) imageEl.removeAttribute("loading");
};
const preload = (swiper) => {
  if (!swiper || swiper.destroyed || !swiper.params) return;
  let amount = swiper.params.lazyPreloadPrevNext;
  const len = swiper.slides.length;
  if (!len || !amount || amount < 0) return;
  amount = Math.min(amount, len);
  const slidesPerView =
    swiper.params.slidesPerView === "auto"
      ? swiper.slidesPerViewDynamic()
      : Math.ceil(swiper.params.slidesPerView);
  const activeIndex = swiper.activeIndex;
  if (swiper.params.grid && swiper.params.grid.rows > 1) {
    const activeColumn = activeIndex;
    const preloadColumns = [activeColumn - amount];
    preloadColumns.push(
      ...Array.from({
        length: amount,
      }).map((_2, i2) => {
        return activeColumn + slidesPerView + i2;
      })
    );
    swiper.slides.forEach((slideEl, i2) => {
      if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i2);
    });
    return;
  }
  const slideIndexLastInView = activeIndex + slidesPerView - 1;
  if (swiper.params.rewind || swiper.params.loop) {
    for (
      let i2 = activeIndex - amount;
      i2 <= slideIndexLastInView + amount;
      i2 += 1
    ) {
      const realIndex = ((i2 % len) + len) % len;
      if (realIndex < activeIndex || realIndex > slideIndexLastInView)
        unlazy(swiper, realIndex);
    }
  } else {
    for (
      let i2 = Math.max(activeIndex - amount, 0);
      i2 <= Math.min(slideIndexLastInView + amount, len - 1);
      i2 += 1
    ) {
      if (
        i2 !== activeIndex &&
        (i2 > slideIndexLastInView || i2 < activeIndex)
      ) {
        unlazy(swiper, i2);
      }
    }
  }
};
function getActiveIndexByTranslate(swiper) {
  const { slidesGrid, params } = swiper;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  let activeIndex;
  for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
    if (typeof slidesGrid[i2 + 1] !== "undefined") {
      if (
        translate2 >= slidesGrid[i2] &&
        translate2 <
          slidesGrid[i2 + 1] - (slidesGrid[i2 + 1] - slidesGrid[i2]) / 2
      ) {
        activeIndex = i2;
      } else if (
        translate2 >= slidesGrid[i2] &&
        translate2 < slidesGrid[i2 + 1]
      ) {
        activeIndex = i2 + 1;
      }
    } else if (translate2 >= slidesGrid[i2]) {
      activeIndex = i2;
    }
  }
  if (params.normalizeSlideIndex) {
    if (activeIndex < 0 || typeof activeIndex === "undefined") activeIndex = 0;
  }
  return activeIndex;
}
function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex,
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;
  const getVirtualRealIndex = (aIndex) => {
    let realIndex2 = aIndex - swiper.virtual.slidesBefore;
    if (realIndex2 < 0) {
      realIndex2 = swiper.virtual.slides.length + realIndex2;
    }
    if (realIndex2 >= swiper.virtual.slides.length) {
      realIndex2 -= swiper.virtual.slides.length;
    }
    return realIndex2;
  };
  if (typeof activeIndex === "undefined") {
    activeIndex = getActiveIndexByTranslate(swiper);
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex && !swiper.params.loop) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit("snapIndexChange");
    }
    return;
  }
  if (
    activeIndex === previousIndex &&
    swiper.params.loop &&
    swiper.virtual &&
    swiper.params.virtual.enabled
  ) {
    swiper.realIndex = getVirtualRealIndex(activeIndex);
    return;
  }
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  let realIndex;
  if (swiper.virtual && params.virtual.enabled && params.loop) {
    realIndex = getVirtualRealIndex(activeIndex);
  } else if (gridEnabled) {
    const firstSlideInColumn = swiper.slides.filter(
      (slideEl) => slideEl.column === activeIndex
    )[0];
    let activeSlideIndex = parseInt(
      firstSlideInColumn.getAttribute("data-swiper-slide-index"),
      10
    );
    if (Number.isNaN(activeSlideIndex)) {
      activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
    }
    realIndex = Math.floor(activeSlideIndex / params.grid.rows);
  } else if (swiper.slides[activeIndex]) {
    const slideIndex = swiper.slides[activeIndex].getAttribute(
      "data-swiper-slide-index"
    );
    if (slideIndex) {
      realIndex = parseInt(slideIndex, 10);
    } else {
      realIndex = activeIndex;
    }
  } else {
    realIndex = activeIndex;
  }
  Object.assign(swiper, {
    previousSnapIndex,
    snapIndex,
    previousRealIndex,
    realIndex,
    previousIndex,
    activeIndex,
  });
  if (swiper.initialized) {
    preload(swiper);
  }
  swiper.emit("activeIndexChange");
  swiper.emit("snapIndexChange");
  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    if (previousRealIndex !== realIndex) {
      swiper.emit("realIndexChange");
    }
    swiper.emit("slideChange");
  }
}
function updateClickedSlide(el, path) {
  const swiper = this;
  const params = swiper.params;
  let slide2 = el.closest(`.${params.slideClass}, swiper-slide`);
  if (
    !slide2 &&
    swiper.isElement &&
    path &&
    path.length > 1 &&
    path.includes(el)
  ) {
    [...path.slice(path.indexOf(el) + 1, path.length)].forEach((pathEl) => {
      if (
        !slide2 &&
        pathEl.matches &&
        pathEl.matches(`.${params.slideClass}, swiper-slide`)
      ) {
        slide2 = pathEl;
      }
    });
  }
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i2 = 0; i2 < swiper.slides.length; i2 += 1) {
      if (swiper.slides[i2] === slide2) {
        slideFound = true;
        slideIndex = i2;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper.clickedSlide = slide2;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt(
        slide2.getAttribute("data-swiper-slide-index"),
        10
      );
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = void 0;
    swiper.clickedIndex = void 0;
    return;
  }
  if (
    params.slideToClickedSlide &&
    swiper.clickedIndex !== void 0 &&
    swiper.clickedIndex !== swiper.activeIndex
  ) {
    swiper.slideToClickedSlide();
  }
}
var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide,
};
function getSwiperTranslate(axis) {
  if (axis === void 0) {
    axis = this.isHorizontal() ? "x" : "y";
  }
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate: translate2,
    wrapperEl,
  } = swiper;
  if (params.virtualTranslate) {
    return rtl ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate(wrapperEl, axis);
  currentTranslate += swiper.cssOverflowAdjustment();
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper = this;
  const { rtlTranslate: rtl, params, wrapperEl, progress } = swiper;
  let x2 = 0;
  let y2 = 0;
  const z2 = 0;
  if (swiper.isHorizontal()) {
    x2 = rtl ? -translate2 : translate2;
  } else {
    y2 = translate2;
  }
  if (params.roundLengths) {
    x2 = Math.floor(x2);
    y2 = Math.floor(y2);
  }
  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x2 : y2;
  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] =
      swiper.isHorizontal() ? -x2 : -y2;
  } else if (!params.virtualTranslate) {
    if (swiper.isHorizontal()) {
      x2 -= swiper.cssOverflowAdjustment();
    } else {
      y2 -= swiper.cssOverflowAdjustment();
    }
    wrapperEl.style.transform = `translate3d(${x2}px, ${y2}px, ${z2}px)`;
  }
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper.updateProgress(translate2);
  }
  swiper.emit("setTranslate", swiper.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(
  translate2,
  speed,
  runCallbacks,
  translateBounds,
  internal
) {
  if (translate2 === void 0) {
    translate2 = 0;
  }
  if (speed === void 0) {
    speed = this.params.speed;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (translateBounds === void 0) {
    translateBounds = true;
  }
  const swiper = this;
  const { params, wrapperEl } = swiper;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper.minTranslate();
  const maxTranslate2 = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2)
    newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2)
    newTranslate = maxTranslate2;
  else newTranslate = translate2;
  swiper.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top",
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth",
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionEnd");
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper.emit("beforeTransitionStart", speed, internal);
      swiper.emit("transitionStart");
    }
    if (!swiper.animating) {
      swiper.animating = true;
      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e2) {
          if (!swiper || swiper.destroyed) return;
          if (e2.target !== this) return;
          swiper.wrapperEl.removeEventListener(
            "transitionend",
            swiper.onTranslateToWrapperTransitionEnd
          );
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;
          swiper.animating = false;
          if (runCallbacks) {
            swiper.emit("transitionEnd");
          }
        };
      }
      swiper.wrapperEl.addEventListener(
        "transitionend",
        swiper.onTranslateToWrapperTransitionEnd
      );
    }
  }
  return true;
}
var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo,
};
function setTransition(duration, byController) {
  const swiper = this;
  if (!swiper.params.cssMode) {
    swiper.wrapperEl.style.transitionDuration = `${duration}ms`;
    swiper.wrapperEl.style.transitionDelay = duration === 0 ? `0ms` : "";
  }
  swiper.emit("setTransition", duration, byController);
}
function transitionEmit(_ref) {
  let { swiper, runCallbacks, direction, step } = _ref;
  const { activeIndex, previousIndex } = swiper;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex) dir = "next";
    else if (activeIndex < previousIndex) dir = "prev";
    else dir = "reset";
  }
  swiper.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === "reset") {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }
    swiper.emit(`slideChangeTransition${step}`);
    if (dir === "next") {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const { params } = swiper;
  if (params.cssMode) return;
  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "Start",
  });
}
function transitionEnd(runCallbacks, direction) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const { params } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: "End",
  });
}
var transition = {
  setTransition,
  transitionStart,
  transitionEnd,
};
function slideTo(index, speed, runCallbacks, internal, initial) {
  if (index === void 0) {
    index = 0;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === "string") {
    index = parseInt(index, 10);
  }
  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled,
  } = swiper;
  if (
    (!enabled && !internal && !initial) ||
    swiper.destroyed ||
    (swiper.animating && params.preventInteractionOnTransition)
  ) {
    return false;
  }
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex =
    skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;
  const translate2 = -snapGrid[snapIndex];
  if (params.normalizeSlideIndex) {
    for (let i2 = 0; i2 < slidesGrid.length; i2 += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i2] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i2 + 1] * 100);
      if (typeof slidesGrid[i2 + 1] !== "undefined") {
        if (
          normalizedTranslate >= normalizedGrid &&
          normalizedTranslate <
            normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2
        ) {
          slideIndex = i2;
        } else if (
          normalizedTranslate >= normalizedGrid &&
          normalizedTranslate < normalizedGridNext
        ) {
          slideIndex = i2 + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i2;
      }
    }
  }
  if (swiper.initialized && slideIndex !== activeIndex) {
    if (
      !swiper.allowSlideNext &&
      (rtl
        ? translate2 > swiper.translate && translate2 > swiper.minTranslate()
        : translate2 < swiper.translate && translate2 < swiper.minTranslate())
    ) {
      return false;
    }
    if (
      !swiper.allowSlidePrev &&
      translate2 > swiper.translate &&
      translate2 > swiper.maxTranslate()
    ) {
      if ((activeIndex || 0) !== slideIndex) {
        return false;
      }
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper.emit("beforeSlideChangeStart");
  }
  swiper.updateProgress(translate2);
  let direction;
  if (slideIndex > activeIndex) direction = "next";
  else if (slideIndex < activeIndex) direction = "prev";
  else direction = "reset";
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  const isInitialVirtual = isVirtual && initial;
  if (
    !isInitialVirtual &&
    ((rtl && -translate2 === swiper.translate) ||
      (!rtl && translate2 === swiper.translate))
  ) {
    swiper.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }
    swiper.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t2 = rtl ? translate2 : -translate2;
    if (speed === 0) {
      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = "none";
        swiper._immediateVirtual = true;
      }
      if (
        isVirtual &&
        !swiper._cssModeVirtualInitialSet &&
        swiper.params.initialSlide > 0
      ) {
        swiper._cssModeVirtualInitialSet = true;
        requestAnimationFrame(() => {
          wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
        });
      } else {
        wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t2;
      }
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = "";
          swiper._immediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t2,
          side: isH ? "left" : "top",
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t2,
        behavior: "smooth",
      });
    }
    return true;
  }
  swiper.setTransition(speed);
  swiper.setTranslate(translate2);
  swiper.updateActiveIndex(slideIndex);
  swiper.updateSlidesClasses();
  swiper.emit("beforeTransitionStart", speed, internal);
  swiper.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper.transitionEnd(runCallbacks, direction);
  } else if (!swiper.animating) {
    swiper.animating = true;
    if (!swiper.onSlideToWrapperTransitionEnd) {
      swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e2) {
        if (!swiper || swiper.destroyed) return;
        if (e2.target !== this) return;
        swiper.wrapperEl.removeEventListener(
          "transitionend",
          swiper.onSlideToWrapperTransitionEnd
        );
        swiper.onSlideToWrapperTransitionEnd = null;
        delete swiper.onSlideToWrapperTransitionEnd;
        swiper.transitionEnd(runCallbacks, direction);
      };
    }
    swiper.wrapperEl.addEventListener(
      "transitionend",
      swiper.onSlideToWrapperTransitionEnd
    );
  }
  return true;
}
function slideToLoop(index, speed, runCallbacks, internal) {
  if (index === void 0) {
    index = 0;
  }
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (typeof index === "string") {
    const indexAsNumber = parseInt(index, 10);
    index = indexAsNumber;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const gridEnabled =
    swiper.grid && swiper.params.grid && swiper.params.grid.rows > 1;
  let newIndex = index;
  if (swiper.params.loop) {
    if (swiper.virtual && swiper.params.virtual.enabled) {
      newIndex = newIndex + swiper.virtual.slidesBefore;
    } else {
      let targetSlideIndex;
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        targetSlideIndex = swiper.slides.filter(
          (slideEl) =>
            slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex
        )[0].column;
      } else {
        targetSlideIndex = swiper.getSlideIndexByData(newIndex);
      }
      const cols = gridEnabled
        ? Math.ceil(swiper.slides.length / swiper.params.grid.rows)
        : swiper.slides.length;
      const { centeredSlides } = swiper.params;
      let slidesPerView = swiper.params.slidesPerView;
      if (slidesPerView === "auto") {
        slidesPerView = swiper.slidesPerViewDynamic();
      } else {
        slidesPerView = Math.ceil(parseFloat(swiper.params.slidesPerView, 10));
        if (centeredSlides && slidesPerView % 2 === 0) {
          slidesPerView = slidesPerView + 1;
        }
      }
      let needLoopFix = cols - targetSlideIndex < slidesPerView;
      if (centeredSlides) {
        needLoopFix =
          needLoopFix || targetSlideIndex < Math.ceil(slidesPerView / 2);
      }
      if (
        internal &&
        centeredSlides &&
        swiper.params.slidesPerView !== "auto" &&
        !gridEnabled
      ) {
        needLoopFix = false;
      }
      if (needLoopFix) {
        const direction = centeredSlides
          ? targetSlideIndex < swiper.activeIndex
            ? "prev"
            : "next"
          : targetSlideIndex - swiper.activeIndex - 1 <
              swiper.params.slidesPerView
            ? "next"
            : "prev";
        swiper.loopFix({
          direction,
          slideTo: true,
          activeSlideIndex:
            direction === "next"
              ? targetSlideIndex + 1
              : targetSlideIndex - cols + 1,
          slideRealIndex: direction === "next" ? swiper.realIndex : void 0,
        });
      }
      if (gridEnabled) {
        const slideIndex = newIndex * swiper.params.grid.rows;
        newIndex = swiper.slides.filter(
          (slideEl) =>
            slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex
        )[0].column;
      } else {
        newIndex = swiper.getSlideIndexByData(newIndex);
      }
    }
  }
  requestAnimationFrame(() => {
    swiper.slideTo(newIndex, speed, runCallbacks, internal);
  });
  return swiper;
}
function slideNext(speed, runCallbacks, internal) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const { enabled, params, animating } = swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  let perGroup = params.slidesPerGroup;
  if (
    params.slidesPerView === "auto" &&
    params.slidesPerGroup === 1 &&
    params.slidesPerGroupAuto
  ) {
    perGroup = Math.max(swiper.slidesPerViewDynamic("current", true), 1);
  }
  const increment =
    swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: "next",
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
    if (swiper.activeIndex === swiper.slides.length - 1 && params.cssMode) {
      requestAnimationFrame(() => {
        swiper.slideTo(
          swiper.activeIndex + increment,
          speed,
          runCallbacks,
          internal
        );
      });
      return true;
    }
  }
  if (params.rewind && swiper.isEnd) {
    return swiper.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper.slideTo(
    swiper.activeIndex + increment,
    speed,
    runCallbacks,
    internal
  );
}
function slidePrev(speed, runCallbacks, internal) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  const { params, snapGrid, slidesGrid, rtlTranslate, enabled, animating } =
    swiper;
  if (!enabled || swiper.destroyed) return swiper;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  const isVirtual = swiper.virtual && params.virtual.enabled;
  if (params.loop) {
    if (animating && !isVirtual && params.loopPreventsSliding) return false;
    swiper.loopFix({
      direction: "prev",
    });
    swiper._clientLeft = swiper.wrapperEl.clientLeft;
  }
  const translate2 = rtlTranslate ? swiper.translate : -swiper.translate;
  function normalize3(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize3(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize3(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap3, snapIndex) => {
      if (normalizedTranslate >= snap3) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap =
        snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;
    if (
      params.slidesPerView === "auto" &&
      params.slidesPerGroup === 1 &&
      params.slidesPerGroupAuto
    ) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper.isBeginning) {
    const lastIndex =
      swiper.params.virtual && swiper.params.virtual.enabled && swiper.virtual
        ? swiper.virtual.slides.length - 1
        : swiper.slides.length - 1;
    return swiper.slideTo(lastIndex, speed, runCallbacks, internal);
  } else if (params.loop && swiper.activeIndex === 0 && params.cssMode) {
    requestAnimationFrame(() => {
      swiper.slideTo(prevIndex, speed, runCallbacks, internal);
    });
    return true;
  }
  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed, runCallbacks, internal) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed, runCallbacks, internal, threshold) {
  if (runCallbacks === void 0) {
    runCallbacks = true;
  }
  if (threshold === void 0) {
    threshold = 0.5;
  }
  const swiper = this;
  if (swiper.destroyed) return;
  if (typeof speed === "undefined") {
    speed = swiper.params.speed;
  }
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex =
    skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  if (translate2 >= swiper.snapGrid[snapIndex]) {
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }
  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper = this;
  if (swiper.destroyed) return;
  const { params, slidesEl } = swiper;
  const slidesPerView =
    params.slidesPerView === "auto"
      ? swiper.slidesPerViewDynamic()
      : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;
  const slideSelector = swiper.isElement
    ? `swiper-slide`
    : `.${params.slideClass}`;
  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt(
      swiper.clickedSlide.getAttribute("data-swiper-slide-index"),
      10
    );
    if (params.centeredSlides) {
      if (
        slideToIndex < swiper.loopedSlides - slidesPerView / 2 ||
        slideToIndex >
          swiper.slides.length - swiper.loopedSlides + slidesPerView / 2
      ) {
        swiper.loopFix();
        slideToIndex = swiper.getSlideIndex(
          elementChildren(
            slidesEl,
            `${slideSelector}[data-swiper-slide-index="${realIndex}"]`
          )[0]
        );
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = swiper.getSlideIndex(
        elementChildren(
          slidesEl,
          `${slideSelector}[data-swiper-slide-index="${realIndex}"]`
        )[0]
      );
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}
var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide,
};
function loopCreate(slideRealIndex) {
  const swiper = this;
  const { params, slidesEl } = swiper;
  if (!params.loop || (swiper.virtual && swiper.params.virtual.enabled)) return;
  const initSlides = () => {
    const slides = elementChildren(
      slidesEl,
      `.${params.slideClass}, swiper-slide`
    );
    slides.forEach((el, index) => {
      el.setAttribute("data-swiper-slide-index", index);
    });
  };
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  const slidesPerGroup =
    params.slidesPerGroup * (gridEnabled ? params.grid.rows : 1);
  const shouldFillGroup = swiper.slides.length % slidesPerGroup !== 0;
  const shouldFillGrid =
    gridEnabled && swiper.slides.length % params.grid.rows !== 0;
  const addBlankSlides = (amountOfSlides) => {
    for (let i2 = 0; i2 < amountOfSlides; i2 += 1) {
      const slideEl = swiper.isElement
        ? createElement("swiper-slide", [params.slideBlankClass])
        : createElement("div", [params.slideClass, params.slideBlankClass]);
      swiper.slidesEl.append(slideEl);
    }
  };
  if (shouldFillGroup) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd =
        slidesPerGroup - (swiper.slides.length % slidesPerGroup);
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning(
        "Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)"
      );
    }
    initSlides();
  } else if (shouldFillGrid) {
    if (params.loopAddBlankSlides) {
      const slidesToAdd =
        params.grid.rows - (swiper.slides.length % params.grid.rows);
      addBlankSlides(slidesToAdd);
      swiper.recalcSlides();
      swiper.updateSlides();
    } else {
      showWarning(
        "Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)"
      );
    }
    initSlides();
  } else {
    initSlides();
  }
  swiper.loopFix({
    slideRealIndex,
    direction: params.centeredSlides ? void 0 : "next",
  });
}
function loopFix(_temp) {
  let {
    slideRealIndex,
    slideTo: slideTo2 = true,
    direction,
    setTranslate: setTranslate2,
    activeSlideIndex,
    byController,
    byMousewheel,
  } = _temp === void 0 ? {} : _temp;
  const swiper = this;
  if (!swiper.params.loop) return;
  swiper.emit("beforeLoopFix");
  const { slides, allowSlidePrev, allowSlideNext, slidesEl, params } = swiper;
  const { centeredSlides } = params;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  if (swiper.virtual && params.virtual.enabled) {
    if (slideTo2) {
      if (!params.centeredSlides && swiper.snapIndex === 0) {
        swiper.slideTo(swiper.virtual.slides.length, 0, false, true);
      } else if (
        params.centeredSlides &&
        swiper.snapIndex < params.slidesPerView
      ) {
        swiper.slideTo(
          swiper.virtual.slides.length + swiper.snapIndex,
          0,
          false,
          true
        );
      } else if (swiper.snapIndex === swiper.snapGrid.length - 1) {
        swiper.slideTo(swiper.virtual.slidesBefore, 0, false, true);
      }
    }
    swiper.allowSlidePrev = allowSlidePrev;
    swiper.allowSlideNext = allowSlideNext;
    swiper.emit("loopFix");
    return;
  }
  let slidesPerView = params.slidesPerView;
  if (slidesPerView === "auto") {
    slidesPerView = swiper.slidesPerViewDynamic();
  } else {
    slidesPerView = Math.ceil(parseFloat(params.slidesPerView, 10));
    if (centeredSlides && slidesPerView % 2 === 0) {
      slidesPerView = slidesPerView + 1;
    }
  }
  const slidesPerGroup = params.slidesPerGroupAuto
    ? slidesPerView
    : params.slidesPerGroup;
  let loopedSlides = slidesPerGroup;
  if (loopedSlides % slidesPerGroup !== 0) {
    loopedSlides += slidesPerGroup - (loopedSlides % slidesPerGroup);
  }
  loopedSlides += params.loopAdditionalSlides;
  swiper.loopedSlides = loopedSlides;
  const gridEnabled = swiper.grid && params.grid && params.grid.rows > 1;
  if (slides.length < slidesPerView + loopedSlides) {
    showWarning(
      "Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled and not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"
    );
  } else if (gridEnabled && params.grid.fill === "row") {
    showWarning(
      "Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`"
    );
  }
  const prependSlidesIndexes = [];
  const appendSlidesIndexes = [];
  let activeIndex = swiper.activeIndex;
  if (typeof activeSlideIndex === "undefined") {
    activeSlideIndex = swiper.getSlideIndex(
      slides.filter((el) => el.classList.contains(params.slideActiveClass))[0]
    );
  } else {
    activeIndex = activeSlideIndex;
  }
  const isNext = direction === "next" || !direction;
  const isPrev = direction === "prev" || !direction;
  let slidesPrepended = 0;
  let slidesAppended = 0;
  const cols = gridEnabled
    ? Math.ceil(slides.length / params.grid.rows)
    : slides.length;
  const activeColIndex = gridEnabled
    ? slides[activeSlideIndex].column
    : activeSlideIndex;
  const activeColIndexWithShift =
    activeColIndex +
    (centeredSlides && typeof setTranslate2 === "undefined"
      ? -slidesPerView / 2 + 0.5
      : 0);
  if (activeColIndexWithShift < loopedSlides) {
    slidesPrepended = Math.max(
      loopedSlides - activeColIndexWithShift,
      slidesPerGroup
    );
    for (let i2 = 0; i2 < loopedSlides - activeColIndexWithShift; i2 += 1) {
      const index = i2 - Math.floor(i2 / cols) * cols;
      if (gridEnabled) {
        const colIndexToPrepend = cols - index - 1;
        for (let i3 = slides.length - 1; i3 >= 0; i3 -= 1) {
          if (slides[i3].column === colIndexToPrepend)
            prependSlidesIndexes.push(i3);
        }
      } else {
        prependSlidesIndexes.push(cols - index - 1);
      }
    }
  } else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
    slidesAppended = Math.max(
      activeColIndexWithShift - (cols - loopedSlides * 2),
      slidesPerGroup
    );
    for (let i2 = 0; i2 < slidesAppended; i2 += 1) {
      const index = i2 - Math.floor(i2 / cols) * cols;
      if (gridEnabled) {
        slides.forEach((slide2, slideIndex) => {
          if (slide2.column === index) appendSlidesIndexes.push(slideIndex);
        });
      } else {
        appendSlidesIndexes.push(index);
      }
    }
  }
  swiper.__preventObserver__ = true;
  requestAnimationFrame(() => {
    swiper.__preventObserver__ = false;
  });
  if (isPrev) {
    prependSlidesIndexes.forEach((index) => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.prepend(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  if (isNext) {
    appendSlidesIndexes.forEach((index) => {
      slides[index].swiperLoopMoveDOM = true;
      slidesEl.append(slides[index]);
      slides[index].swiperLoopMoveDOM = false;
    });
  }
  swiper.recalcSlides();
  if (params.slidesPerView === "auto") {
    swiper.updateSlides();
  } else if (
    gridEnabled &&
    ((prependSlidesIndexes.length > 0 && isPrev) ||
      (appendSlidesIndexes.length > 0 && isNext))
  ) {
    swiper.slides.forEach((slide2, slideIndex) => {
      swiper.grid.updateSlide(slideIndex, slide2, swiper.slides);
    });
  }
  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
  if (slideTo2) {
    if (prependSlidesIndexes.length > 0 && isPrev) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate =
          swiper.slidesGrid[activeIndex + slidesPrepended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(
            activeIndex + Math.ceil(slidesPrepended),
            0,
            false,
            true
          );
          if (setTranslate2) {
            swiper.touchEventsData.startTranslate =
              swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate =
              swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        if (setTranslate2) {
          const shift = gridEnabled
            ? prependSlidesIndexes.length / params.grid.rows
            : prependSlidesIndexes.length;
          swiper.slideTo(swiper.activeIndex + shift, 0, false, true);
          swiper.touchEventsData.currentTranslate = swiper.translate;
        }
      }
    } else if (appendSlidesIndexes.length > 0 && isNext) {
      if (typeof slideRealIndex === "undefined") {
        const currentSlideTranslate = swiper.slidesGrid[activeIndex];
        const newSlideTranslate =
          swiper.slidesGrid[activeIndex - slidesAppended];
        const diff = newSlideTranslate - currentSlideTranslate;
        if (byMousewheel) {
          swiper.setTranslate(swiper.translate - diff);
        } else {
          swiper.slideTo(activeIndex - slidesAppended, 0, false, true);
          if (setTranslate2) {
            swiper.touchEventsData.startTranslate =
              swiper.touchEventsData.startTranslate - diff;
            swiper.touchEventsData.currentTranslate =
              swiper.touchEventsData.currentTranslate - diff;
          }
        }
      } else {
        const shift = gridEnabled
          ? appendSlidesIndexes.length / params.grid.rows
          : appendSlidesIndexes.length;
        swiper.slideTo(swiper.activeIndex - shift, 0, false, true);
      }
    }
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.controller && swiper.controller.control && !byController) {
    const loopParams = {
      slideRealIndex,
      direction,
      setTranslate: setTranslate2,
      activeSlideIndex,
      byController: true,
    };
    if (Array.isArray(swiper.controller.control)) {
      swiper.controller.control.forEach((c2) => {
        if (!c2.destroyed && c2.params.loop)
          c2.loopFix({
            ...loopParams,
            slideTo:
              c2.params.slidesPerView === params.slidesPerView
                ? slideTo2
                : false,
          });
      });
    } else if (
      swiper.controller.control instanceof swiper.constructor &&
      swiper.controller.control.params.loop
    ) {
      swiper.controller.control.loopFix({
        ...loopParams,
        slideTo:
          swiper.controller.control.params.slidesPerView ===
          params.slidesPerView
            ? slideTo2
            : false,
      });
    }
  }
  swiper.emit("loopFix");
}
function loopDestroy() {
  const swiper = this;
  const { params, slidesEl } = swiper;
  if (!params.loop || (swiper.virtual && swiper.params.virtual.enabled)) return;
  swiper.recalcSlides();
  const newSlidesOrder = [];
  swiper.slides.forEach((slideEl) => {
    const index =
      typeof slideEl.swiperSlideIndex === "undefined"
        ? slideEl.getAttribute("data-swiper-slide-index") * 1
        : slideEl.swiperSlideIndex;
    newSlidesOrder[index] = slideEl;
  });
  swiper.slides.forEach((slideEl) => {
    slideEl.removeAttribute("data-swiper-slide-index");
  });
  newSlidesOrder.forEach((slideEl) => {
    slidesEl.append(slideEl);
  });
  swiper.recalcSlides();
  swiper.slideTo(swiper.realIndex, 0);
}
var loop = {
  loopCreate,
  loopFix,
  loopDestroy,
};
function setGrabCursor(moving) {
  const swiper = this;
  if (
    !swiper.params.simulateTouch ||
    (swiper.params.watchOverflow && swiper.isLocked) ||
    swiper.params.cssMode
  )
    return;
  const el =
    swiper.params.touchEventsTarget === "container"
      ? swiper.el
      : swiper.wrapperEl;
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
function unsetGrabCursor() {
  const swiper = this;
  if (
    (swiper.params.watchOverflow && swiper.isLocked) ||
    swiper.params.cssMode
  ) {
    return;
  }
  if (swiper.isElement) {
    swiper.__preventObserver__ = true;
  }
  swiper[
    swiper.params.touchEventsTarget === "container" ? "el" : "wrapperEl"
  ].style.cursor = "";
  if (swiper.isElement) {
    requestAnimationFrame(() => {
      swiper.__preventObserver__ = false;
    });
  }
}
var grabCursor = {
  setGrabCursor,
  unsetGrabCursor,
};
function closestElement(selector3, base) {
  if (base === void 0) {
    base = this;
  }
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector3);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function preventEdgeSwipe(swiper, event, startX) {
  const window2 = getWindow();
  const { params } = swiper;
  const edgeSwipeDetection = params.edgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold;
  if (
    edgeSwipeDetection &&
    (startX <= edgeSwipeThreshold ||
      startX >= window2.innerWidth - edgeSwipeThreshold)
  ) {
    if (edgeSwipeDetection === "prevent") {
      event.preventDefault();
      return true;
    }
    return false;
  }
  return true;
}
function onTouchStart(event) {
  const swiper = this;
  const document2 = getDocument();
  let e2 = event;
  if (e2.originalEvent) e2 = e2.originalEvent;
  const data = swiper.touchEventsData;
  if (e2.type === "pointerdown") {
    if (data.pointerId !== null && data.pointerId !== e2.pointerId) {
      return;
    }
    data.pointerId = e2.pointerId;
  } else if (e2.type === "touchstart" && e2.targetTouches.length === 1) {
    data.touchId = e2.targetTouches[0].identifier;
  }
  if (e2.type === "touchstart") {
    preventEdgeSwipe(swiper, e2, e2.targetTouches[0].pageX);
    return;
  }
  const { params, touches, enabled } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e2.pointerType === "mouse") return;
  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }
  let targetEl = e2.target;
  if (params.touchEventsTarget === "wrapper") {
    if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
  }
  if ("which" in e2 && e2.which === 3) return;
  if ("button" in e2 && e2.button > 0) return;
  if (data.isTouched && data.isMoved) return;
  const swipingClassHasValue =
    !!params.noSwipingClass && params.noSwipingClass !== "";
  const eventPath = e2.composedPath ? e2.composedPath() : e2.path;
  if (swipingClassHasValue && e2.target && e2.target.shadowRoot && eventPath) {
    targetEl = eventPath[0];
  }
  const noSwipingSelector = params.noSwipingSelector
    ? params.noSwipingSelector
    : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e2.target && e2.target.shadowRoot);
  if (
    params.noSwiping &&
    (isTargetShadow
      ? closestElement(noSwipingSelector, targetEl)
      : targetEl.closest(noSwipingSelector))
  ) {
    swiper.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!targetEl.closest(params.swipeHandler)) return;
  }
  touches.currentX = e2.pageX;
  touches.currentY = e2.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  if (!preventEdgeSwipe(swiper, e2, startX)) {
    return;
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0,
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = void 0;
  if (params.threshold > 0) data.allowThresholdMove = false;
  let preventDefault = true;
  if (targetEl.matches(data.focusableElements)) {
    preventDefault = false;
    if (targetEl.nodeName === "SELECT") {
      data.isTouched = false;
    }
  }
  if (
    document2.activeElement &&
    document2.activeElement.matches(data.focusableElements) &&
    document2.activeElement !== targetEl &&
    (e2.pointerType === "mouse" ||
      (e2.pointerType !== "mouse" && !targetEl.matches(data.focusableElements)))
  ) {
    document2.activeElement.blur();
  }
  const shouldPreventDefault =
    preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
  if (
    (params.touchStartForcePreventDefault || shouldPreventDefault) &&
    !targetEl.isContentEditable
  ) {
    e2.preventDefault();
  }
  if (
    params.freeMode &&
    params.freeMode.enabled &&
    swiper.freeMode &&
    swiper.animating &&
    !params.cssMode
  ) {
    swiper.freeMode.onTouchStart();
  }
  swiper.emit("touchStart", e2);
}
function onTouchMove(event) {
  const document2 = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const { params, touches, rtlTranslate: rtl, enabled } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && event.pointerType === "mouse") return;
  let e2 = event;
  if (e2.originalEvent) e2 = e2.originalEvent;
  if (e2.type === "pointermove") {
    if (data.touchId !== null) return;
    const id = e2.pointerId;
    if (id !== data.pointerId) return;
  }
  let targetTouch;
  if (e2.type === "touchmove") {
    targetTouch = [...e2.changedTouches].filter(
      (t2) => t2.identifier === data.touchId
    )[0];
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  } else {
    targetTouch = e2;
  }
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit("touchMoveOpposite", e2);
    }
    return;
  }
  const pageX = targetTouch.pageX;
  const pageY = targetTouch.pageY;
  if (e2.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper.allowTouchMove) {
    if (!e2.target.matches(data.focusableElements)) {
      swiper.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY,
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      if (
        (pageY < touches.startY && swiper.translate <= swiper.maxTranslate()) ||
        (pageY > touches.startY && swiper.translate >= swiper.minTranslate())
      ) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (
      (pageX < touches.startX && swiper.translate <= swiper.maxTranslate()) ||
      (pageX > touches.startX && swiper.translate >= swiper.minTranslate())
    ) {
      return;
    }
  }
  if (
    document2.activeElement &&
    document2.activeElement.matches(data.focusableElements) &&
    document2.activeElement !== e2.target &&
    e2.pointerType !== "mouse"
  ) {
    document2.activeElement.blur();
  }
  if (document2.activeElement) {
    if (
      e2.target === document2.activeElement &&
      e2.target.matches(data.focusableElements)
    ) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper.emit("touchMove", e2);
  }
  touches.previousX = touches.currentX;
  touches.previousY = touches.currentY;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (
    swiper.params.threshold &&
    Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold
  )
    return;
  if (typeof data.isScrolling === "undefined") {
    let touchAngle;
    if (
      (swiper.isHorizontal() && touches.currentY === touches.startY) ||
      (swiper.isVertical() && touches.currentX === touches.startX)
    ) {
      data.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle =
          (Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180) / Math.PI;
        data.isScrolling = swiper.isHorizontal()
          ? touchAngle > params.touchAngle
          : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper.emit("touchMoveOpposite", e2);
  }
  if (typeof data.startMoving === "undefined") {
    if (
      touches.currentX !== touches.startX ||
      touches.currentY !== touches.startY
    ) {
      data.startMoving = true;
    }
  }
  if (
    data.isScrolling ||
    (e2.type === "touchmove" && data.preventTouchMoveFromPointerMove)
  ) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper.allowClick = false;
  if (!params.cssMode && e2.cancelable) {
    e2.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e2.stopPropagation();
  }
  let diff = swiper.isHorizontal() ? diffX : diffY;
  let touchesDiff = swiper.isHorizontal()
    ? touches.currentX - touches.previousX
    : touches.currentY - touches.previousY;
  if (params.oneWayMovement) {
    diff = Math.abs(diff) * (rtl ? 1 : -1);
    touchesDiff = Math.abs(touchesDiff) * (rtl ? 1 : -1);
  }
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) {
    diff = -diff;
    touchesDiff = -touchesDiff;
  }
  const prevTouchesDirection = swiper.touchesDirection;
  swiper.swipeDirection = diff > 0 ? "prev" : "next";
  swiper.touchesDirection = touchesDiff > 0 ? "prev" : "next";
  const isLoop = swiper.params.loop && !params.cssMode;
  const allowLoopFix =
    (swiper.touchesDirection === "next" && swiper.allowSlideNext) ||
    (swiper.touchesDirection === "prev" && swiper.allowSlidePrev);
  if (!data.isMoved) {
    if (isLoop && allowLoopFix) {
      swiper.loopFix({
        direction: swiper.swipeDirection,
      });
    }
    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);
    if (swiper.animating) {
      const evt = new window.CustomEvent("transitionend", {
        bubbles: true,
        cancelable: true,
        detail: {
          bySwiperTouchMove: true,
        },
      });
      swiper.wrapperEl.dispatchEvent(evt);
    }
    data.allowMomentumBounce = false;
    if (
      params.grabCursor &&
      (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)
    ) {
      swiper.setGrabCursor(true);
    }
    swiper.emit("sliderFirstMove", e2);
  }
  let loopFixed;
  /* @__PURE__ */ new Date().getTime();
  if (
    data.isMoved &&
    data.allowThresholdMove &&
    prevTouchesDirection !== swiper.touchesDirection &&
    isLoop &&
    allowLoopFix &&
    Math.abs(diff) >= 1
  ) {
    Object.assign(touches, {
      startX: pageX,
      startY: pageY,
      currentX: pageX,
      currentY: pageY,
      startTranslate: data.currentTranslate,
    });
    data.loopSwapReset = true;
    data.startTranslate = data.currentTranslate;
    return;
  }
  swiper.emit("sliderMove", e2);
  data.isMoved = true;
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0) {
    if (
      isLoop &&
      allowLoopFix &&
      !loopFixed &&
      data.allowThresholdMove &&
      data.currentTranslate >
        (params.centeredSlides
          ? swiper.minTranslate() -
            swiper.slidesSizesGrid[swiper.activeIndex + 1] -
            (params.slidesPerView !== "auto" &&
            swiper.slides.length - params.slidesPerView >= 2
              ? swiper.slidesSizesGrid[swiper.activeIndex + 1] +
                swiper.params.spaceBetween
              : 0) -
            swiper.params.spaceBetween
          : swiper.minTranslate())
    ) {
      swiper.loopFix({
        direction: "prev",
        setTranslate: true,
        activeSlideIndex: 0,
      });
    }
    if (data.currentTranslate > swiper.minTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate =
          swiper.minTranslate() -
          1 +
          (-swiper.minTranslate() + data.startTranslate + diff) **
            resistanceRatio;
      }
    }
  } else if (diff < 0) {
    if (
      isLoop &&
      allowLoopFix &&
      !loopFixed &&
      data.allowThresholdMove &&
      data.currentTranslate <
        (params.centeredSlides
          ? swiper.maxTranslate() +
            swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] +
            swiper.params.spaceBetween +
            (params.slidesPerView !== "auto" &&
            swiper.slides.length - params.slidesPerView >= 2
              ? swiper.slidesSizesGrid[swiper.slidesSizesGrid.length - 1] +
                swiper.params.spaceBetween
              : 0)
          : swiper.maxTranslate())
    ) {
      swiper.loopFix({
        direction: "next",
        setTranslate: true,
        activeSlideIndex:
          swiper.slides.length -
          (params.slidesPerView === "auto"
            ? swiper.slidesPerViewDynamic()
            : Math.ceil(parseFloat(params.slidesPerView, 10))),
      });
    }
    if (data.currentTranslate < swiper.maxTranslate()) {
      disableParentSwiper = false;
      if (params.resistance) {
        data.currentTranslate =
          swiper.maxTranslate() +
          1 -
          (swiper.maxTranslate() - data.startTranslate - diff) **
            resistanceRatio;
      }
    }
  }
  if (disableParentSwiper) {
    e2.preventedByNestedSwiper = true;
  }
  if (
    !swiper.allowSlideNext &&
    swiper.swipeDirection === "next" &&
    data.currentTranslate < data.startTranslate
  ) {
    data.currentTranslate = data.startTranslate;
  }
  if (
    !swiper.allowSlidePrev &&
    swiper.swipeDirection === "prev" &&
    data.currentTranslate > data.startTranslate
  ) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal()
          ? touches.currentX - touches.startX
          : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode) return;
  if (
    (params.freeMode && params.freeMode.enabled && swiper.freeMode) ||
    params.watchSlidesProgress
  ) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  if (params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  }
  swiper.updateProgress(data.currentTranslate);
  swiper.setTranslate(data.currentTranslate);
}
function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  let e2 = event;
  if (e2.originalEvent) e2 = e2.originalEvent;
  let targetTouch;
  const isTouchEvent = e2.type === "touchend" || e2.type === "touchcancel";
  if (!isTouchEvent) {
    if (data.touchId !== null) return;
    if (e2.pointerId !== data.pointerId) return;
    targetTouch = e2;
  } else {
    targetTouch = [...e2.changedTouches].filter(
      (t2) => t2.identifier === data.touchId
    )[0];
    if (!targetTouch || targetTouch.identifier !== data.touchId) return;
  }
  if (
    ["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(
      e2.type
    )
  ) {
    const proceed =
      ["pointercancel", "contextmenu"].includes(e2.type) &&
      (swiper.browser.isSafari || swiper.browser.isWebView);
    if (!proceed) {
      return;
    }
  }
  data.pointerId = null;
  data.touchId = null;
  const { params, touches, rtlTranslate: rtl, slidesGrid, enabled } = swiper;
  if (!enabled) return;
  if (!params.simulateTouch && e2.pointerType === "mouse") return;
  if (data.allowTouchCallbacks) {
    swiper.emit("touchEnd", e2);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  if (
    params.grabCursor &&
    data.isMoved &&
    data.isTouched &&
    (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)
  ) {
    swiper.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;
  if (swiper.allowClick) {
    const pathTree = e2.path || (e2.composedPath && e2.composedPath());
    swiper.updateClickedSlide((pathTree && pathTree[0]) || e2.target, pathTree);
    swiper.emit("tap click", e2);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit("doubleTap doubleClick", e2);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });
  if (
    !data.isTouched ||
    !data.isMoved ||
    !swiper.swipeDirection ||
    (touches.diff === 0 && !data.loopSwapReset) ||
    (data.currentTranslate === data.startTranslate && !data.loopSwapReset)
  ) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos,
    });
    return;
  }
  const swipeToLast =
    currentPos >= -swiper.maxTranslate() && !swiper.params.loop;
  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];
  for (
    let i2 = 0;
    i2 < slidesGrid.length;
    i2 += i2 < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup
  ) {
    const increment2 =
      i2 < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i2 + increment2] !== "undefined") {
      if (
        swipeToLast ||
        (currentPos >= slidesGrid[i2] &&
          currentPos < slidesGrid[i2 + increment2])
      ) {
        stopIndex = i2;
        groupSize = slidesGrid[i2 + increment2] - slidesGrid[i2];
      }
    } else if (swipeToLast || currentPos >= slidesGrid[i2]) {
      stopIndex = i2;
      groupSize =
        slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper.isBeginning) {
      rewindLastIndex =
        params.virtual && params.virtual.enabled && swiper.virtual
          ? swiper.virtual.slides.length - 1
          : swiper.slides.length - 1;
    } else if (swiper.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment =
    stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    if (swiper.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio)
        swiper.slideTo(
          params.rewind && swiper.isEnd
            ? rewindFirstIndex
            : stopIndex + increment
        );
      else swiper.slideTo(stopIndex);
    }
    if (swiper.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper.slideTo(stopIndex + increment);
      } else if (
        rewindLastIndex !== null &&
        ratio < 0 &&
        Math.abs(ratio) > params.longSwipesRatio
      ) {
        swiper.slideTo(rewindLastIndex);
      } else {
        swiper.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }
    const isNavButtonTarget =
      swiper.navigation &&
      (e2.target === swiper.navigation.nextEl ||
        e2.target === swiper.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === "next") {
        swiper.slideTo(
          rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment
        );
      }
      if (swiper.swipeDirection === "prev") {
        swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e2.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper = this;
  const { params, el } = swiper;
  if (el && el.offsetWidth === 0) return;
  if (params.breakpoints) {
    swiper.setBreakpoint();
  }
  const { allowSlideNext, allowSlidePrev, snapGrid } = swiper;
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();
  const isVirtualLoop = isVirtual && params.loop;
  if (
    (params.slidesPerView === "auto" || params.slidesPerView > 1) &&
    swiper.isEnd &&
    !swiper.isBeginning &&
    !swiper.params.centeredSlides &&
    !isVirtualLoop
  ) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    if (swiper.params.loop && !isVirtual) {
      swiper.slideToLoop(swiper.realIndex, 0, false, true);
    } else {
      swiper.slideTo(swiper.activeIndex, 0, false, true);
    }
  }
  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    clearTimeout(swiper.autoplay.resizeTimeout);
    swiper.autoplay.resizeTimeout = setTimeout(() => {
      if (
        swiper.autoplay &&
        swiper.autoplay.running &&
        swiper.autoplay.paused
      ) {
        swiper.autoplay.resume();
      }
    }, 500);
  }
  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}
function onClick(e2) {
  const swiper = this;
  if (!swiper.enabled) return;
  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e2.preventDefault();
    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e2.stopPropagation();
      e2.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper = this;
  const { wrapperEl, rtlTranslate, enabled } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;
  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  }
  if (swiper.translate === 0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }
  swiper.emit("setTranslate", swiper.translate, false);
}
function onLoad(e2) {
  const swiper = this;
  processLazyPreloader(swiper, e2.target);
  if (
    swiper.params.cssMode ||
    (swiper.params.slidesPerView !== "auto" && !swiper.params.autoHeight)
  ) {
    return;
  }
  swiper.update();
}
function onDocumentTouchStart() {
  const swiper = this;
  if (swiper.documentTouchHandlerProceeded) return;
  swiper.documentTouchHandlerProceeded = true;
  if (swiper.params.touchReleaseOnEdges) {
    swiper.el.style.touchAction = "auto";
  }
}
const events = (swiper, method) => {
  const document2 = getDocument();
  const { params, el, wrapperEl, device } = swiper;
  const capture = !!params.nested;
  const domMethod =
    method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  if (!el || typeof el === "string") return;
  document2[domMethod]("touchstart", swiper.onDocumentTouchStart, {
    passive: false,
    capture,
  });
  el[domMethod]("touchstart", swiper.onTouchStart, {
    passive: false,
  });
  el[domMethod]("pointerdown", swiper.onTouchStart, {
    passive: false,
  });
  document2[domMethod]("touchmove", swiper.onTouchMove, {
    passive: false,
    capture,
  });
  document2[domMethod]("pointermove", swiper.onTouchMove, {
    passive: false,
    capture,
  });
  document2[domMethod]("touchend", swiper.onTouchEnd, {
    passive: true,
  });
  document2[domMethod]("pointerup", swiper.onTouchEnd, {
    passive: true,
  });
  document2[domMethod]("pointercancel", swiper.onTouchEnd, {
    passive: true,
  });
  document2[domMethod]("touchcancel", swiper.onTouchEnd, {
    passive: true,
  });
  document2[domMethod]("pointerout", swiper.onTouchEnd, {
    passive: true,
  });
  document2[domMethod]("pointerleave", swiper.onTouchEnd, {
    passive: true,
  });
  document2[domMethod]("contextmenu", swiper.onTouchEnd, {
    passive: true,
  });
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper[swiperMethod](
      device.ios || device.android
        ? "resize orientationchange observerUpdate"
        : "resize observerUpdate",
      onResize,
      true
    );
  } else {
    swiper[swiperMethod]("observerUpdate", onResize, true);
  }
  el[domMethod]("load", swiper.onLoad, {
    capture: true,
  });
};
function attachEvents() {
  const swiper = this;
  const { params } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);
  swiper.onDocumentTouchStart = onDocumentTouchStart.bind(swiper);
  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }
  swiper.onClick = onClick.bind(swiper);
  swiper.onLoad = onLoad.bind(swiper);
  events(swiper, "on");
}
function detachEvents() {
  const swiper = this;
  events(swiper, "off");
}
var events$1 = {
  attachEvents,
  detachEvents,
};
const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper = this;
  const { realIndex, initialized, params, el } = swiper;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || (breakpoints2 && Object.keys(breakpoints2).length === 0))
    return;
  const breakpoint = swiper.getBreakpoint(
    breakpoints2,
    swiper.params.breakpointsBase,
    swiper.el
  );
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams =
    breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasGrabCursor = swiper.params.grabCursor;
  const isGrabCursor = breakpointParams.grabCursor;
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    el.classList.remove(
      `${params.containerModifierClass}grid`,
      `${params.containerModifierClass}grid-column`
    );
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    el.classList.add(`${params.containerModifierClass}grid`);
    if (
      (breakpointParams.grid.fill && breakpointParams.grid.fill === "column") ||
      (!breakpointParams.grid.fill && params.grid.fill === "column")
    ) {
      el.classList.add(`${params.containerModifierClass}grid-column`);
    }
    swiper.emitContainerClasses();
  }
  if (wasGrabCursor && !isGrabCursor) {
    swiper.unsetGrabCursor();
  } else if (!wasGrabCursor && isGrabCursor) {
    swiper.setGrabCursor();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    if (typeof breakpointParams[prop] === "undefined") return;
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled =
      breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper[prop].enable();
    }
  });
  const directionChanged =
    breakpointParams.direction &&
    breakpointParams.direction !== params.direction;
  const needsReLoop =
    params.loop &&
    (breakpointParams.slidesPerView !== params.slidesPerView ||
      directionChanged);
  const wasLoop = params.loop;
  if (directionChanged && initialized) {
    swiper.changeDirection();
  }
  extend(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  const hasLoop = swiper.params.loop;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev,
  });
  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }
  swiper.currentBreakpoint = breakpoint;
  swiper.emit("_beforeBreakpoint", breakpointParams);
  if (initialized) {
    if (needsReLoop) {
      swiper.loopDestroy();
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (!wasLoop && hasLoop) {
      swiper.loopCreate(realIndex);
      swiper.updateSlides();
    } else if (wasLoop && !hasLoop) {
      swiper.loopDestroy();
    }
  }
  swiper.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base, containerEl) {
  if (base === void 0) {
    base = "window";
  }
  if (!breakpoints2 || (base === "container" && !containerEl)) return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight =
    base === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point,
      };
    }
    return {
      value: point,
      point,
    };
  });
  points.sort((a2, b2) => parseInt(a2.value, 10) - parseInt(b2.value, 10));
  for (let i2 = 0; i2 < points.length; i2 += 1) {
    const { point, value } = points[i2];
    if (base === "window") {
      if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
var breakpoints = {
  setBreakpoint,
  getBreakpoint,
};
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper = this;
  const { classNames, params, rtl, el, device } = swiper;
  const suffixes = prepareClasses(
    [
      "initialized",
      params.direction,
      {
        "free-mode": swiper.params.freeMode && params.freeMode.enabled,
      },
      {
        autoheight: params.autoHeight,
      },
      {
        rtl: rtl,
      },
      {
        grid: params.grid && params.grid.rows > 1,
      },
      {
        "grid-column":
          params.grid && params.grid.rows > 1 && params.grid.fill === "column",
      },
      {
        android: device.android,
      },
      {
        ios: device.ios,
      },
      {
        "css-mode": params.cssMode,
      },
      {
        centered: params.cssMode && params.centeredSlides,
      },
      {
        "watch-progress": params.watchSlidesProgress,
      },
    ],
    params.containerModifierClass
  );
  classNames.push(...suffixes);
  el.classList.add(...classNames);
  swiper.emitContainerClasses();
}
function removeClasses() {
  const swiper = this;
  const { el, classNames } = swiper;
  if (!el || typeof el === "string") return;
  el.classList.remove(...classNames);
  swiper.emitContainerClasses();
}
var classes = {
  addClasses,
  removeClasses,
};
function checkOverflow() {
  const swiper = this;
  const { isLocked: wasLocked, params } = swiper;
  const { slidesOffsetBefore } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge =
      swiper.slidesGrid[lastSlideIndex] +
      swiper.slidesSizesGrid[lastSlideIndex] +
      slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }
  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }
  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? "lock" : "unlock");
  }
}
var checkOverflow$1 = {
  checkOverflow,
};
var defaults = {
  init: true,
  direction: "horizontal",
  oneWayMovement: false,
  swiperElementNodeName: "SWIPER-CONTAINER",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  eventsPrefix: "swiper",
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 5,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // loop
  loop: false,
  loopAddBlankSlides: true,
  loopAdditionalSlides: 0,
  loopPreventsSliding: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-blank",
  slideActiveClass: "swiper-slide-active",
  slideVisibleClass: "swiper-slide-visible",
  slideFullyVisibleClass: "swiper-slide-fully-visible",
  slideNextClass: "swiper-slide-next",
  slidePrevClass: "swiper-slide-prev",
  wrapperClass: "swiper-wrapper",
  lazyPreloaderClass: "swiper-lazy-preloader",
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false,
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj) {
    if (obj === void 0) {
      obj = {};
    }
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true,
      };
    }
    if (
      moduleParamName === "navigation" &&
      params[moduleParamName] &&
      params[moduleParamName].enabled &&
      !params[moduleParamName].prevEl &&
      !params[moduleParamName].nextEl
    ) {
      params[moduleParamName].auto = true;
    }
    if (
      ["pagination", "scrollbar"].indexOf(moduleParamName) >= 0 &&
      params[moduleParamName] &&
      params[moduleParamName].enabled &&
      !params[moduleParamName].el
    ) {
      params[moduleParamName].auto = true;
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend(allModulesParams, obj);
      return;
    }
    if (
      typeof params[moduleParamName] === "object" &&
      !("enabled" in params[moduleParamName])
    ) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName])
      params[moduleParamName] = {
        enabled: false,
      };
    extend(allModulesParams, obj);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes,
};
const extendedDefaults = {};
class Swiper {
  constructor() {
    let el;
    let params;
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }
    if (
      args.length === 1 &&
      args[0].constructor &&
      Object.prototype.toString.call(args[0]).slice(8, -1) === "Object"
    ) {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params) params = {};
    params = extend({}, params);
    if (el && !params.el) params.el = el;
    const document2 = getDocument();
    if (
      params.el &&
      typeof params.el === "string" &&
      document2.querySelectorAll(params.el).length > 1
    ) {
      const swipers = [];
      document2.querySelectorAll(params.el).forEach((containerEl) => {
        const newParams = extend({}, params, {
          el: containerEl,
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    }
    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent,
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper.modules.forEach((mod) => {
      mod({
        params,
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper),
      });
    });
    const swiperParams = extend({}, defaults, allModulesParams);
    swiper.params = extend({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend({}, swiper.params);
    swiper.passedParams = extend({}, params);
    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach((eventName) => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }
    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    }
    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper.params.direction === "horizontal";
      },
      isVertical() {
        return swiper.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      cssOverflowAdjustment() {
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        startMoving: void 0,
        pointerId: null,
        touchId: null,
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0,
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0,
    });
    swiper.emit("_swiper");
    if (swiper.params.init) {
      swiper.init();
    }
    return swiper;
  }
  getDirectionLabel(property) {
    if (this.isHorizontal()) {
      return property;
    }
    return {
      width: "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      marginRight: "marginBottom",
    }[property];
  }
  getSlideIndex(slideEl) {
    const { slidesEl, params } = this;
    const slides = elementChildren(
      slidesEl,
      `.${params.slideClass}, swiper-slide`
    );
    const firstSlideIndex = elementIndex(slides[0]);
    return elementIndex(slideEl) - firstSlideIndex;
  }
  getSlideIndexByData(index) {
    return this.getSlideIndex(
      this.slides.filter(
        (slideEl) =>
          slideEl.getAttribute("data-swiper-slide-index") * 1 === index
      )[0]
    );
  }
  recalcSlides() {
    const swiper = this;
    const { slidesEl, params } = swiper;
    swiper.slides = elementChildren(
      slidesEl,
      `.${params.slideClass}, swiper-slide`
    );
  }
  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;
    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }
    swiper.emit("enable");
  }
  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;
    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }
    swiper.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(" ").filter((className) => {
      return (
        className.indexOf("swiper") === 0 ||
        className.indexOf(swiper.params.containerModifierClass) === 0
      );
    });
    swiper.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper = this;
    if (swiper.destroyed) return "";
    return slideEl.className
      .split(" ")
      .filter((className) => {
        return (
          className.indexOf("swiper-slide") === 0 ||
          className.indexOf(swiper.params.slideClass) === 0
        );
      })
      .join(" ");
  }
  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.forEach((slideEl) => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames,
      });
      swiper.emit("_slideClass", slideEl, classNames);
    });
    swiper.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view, exact) {
    if (view === void 0) {
      view = "current";
    }
    if (exact === void 0) {
      exact = false;
    }
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex,
    } = swiper;
    let spv = 1;
    if (typeof params.slidesPerView === "number") return params.slidesPerView;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex]
        ? Math.ceil(slides[activeIndex].swiperSlideSize)
        : 0;
      let breakLoop;
      for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += Math.ceil(slides[i2].swiperSlideSize);
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
      for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
        if (slides[i2] && !breakLoop) {
          slideSize += slides[i2].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i2 = activeIndex + 1; i2 < slides.length; i2 += 1) {
          const slideInView = exact
            ? slidesGrid[i2] + slidesSizesGrid[i2] - slidesGrid[activeIndex] <
              swiperSize
            : slidesGrid[i2] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i2 = activeIndex - 1; i2 >= 0; i2 -= 1) {
          const slideInView =
            slidesGrid[activeIndex] - slidesGrid[i2] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const { snapGrid, params } = swiper;
    if (params.breakpoints) {
      swiper.setBreakpoint();
    }
    [...swiper.el.querySelectorAll('[loading="lazy"]')].forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      }
    });
    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper.rtlTranslate
        ? swiper.translate * -1
        : swiper.translate;
      const newTranslate = Math.min(
        Math.max(translateValue, swiper.maxTranslate()),
        swiper.minTranslate()
      );
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }
    let translated;
    if (params.freeMode && params.freeMode.enabled && !params.cssMode) {
      setTranslate2();
      if (params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if (
        (params.slidesPerView === "auto" || params.slidesPerView > 1) &&
        swiper.isEnd &&
        !params.centeredSlides
      ) {
        const slides =
          swiper.virtual && params.virtual.enabled
            ? swiper.virtual.slides
            : swiper.slides;
        translated = swiper.slideTo(slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }
    swiper.emit("update");
  }
  changeDirection(newDirection, needUpdate) {
    if (needUpdate === void 0) {
      needUpdate = true;
    }
    const swiper = this;
    const currentDirection = swiper.params.direction;
    if (!newDirection) {
      newDirection =
        currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (
      newDirection === currentDirection ||
      (newDirection !== "horizontal" && newDirection !== "vertical")
    ) {
      return swiper;
    }
    swiper.el.classList.remove(
      `${swiper.params.containerModifierClass}${currentDirection}`
    );
    swiper.el.classList.add(
      `${swiper.params.containerModifierClass}${newDirection}`
    );
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.forEach((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper.emit("changeDirection");
    if (needUpdate) swiper.update();
    return swiper;
  }
  changeLanguageDirection(direction) {
    const swiper = this;
    if (
      (swiper.rtl && direction === "rtl") ||
      (!swiper.rtl && direction === "ltr")
    )
      return;
    swiper.rtl = direction === "rtl";
    swiper.rtlTranslate =
      swiper.params.direction === "horizontal" && swiper.rtl;
    if (swiper.rtl) {
      swiper.el.classList.add(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "rtl";
    } else {
      swiper.el.classList.remove(`${swiper.params.containerModifierClass}rtl`);
      swiper.el.dir = "ltr";
    }
    swiper.update();
  }
  mount(element) {
    const swiper = this;
    if (swiper.mounted) return true;
    let el = element || swiper.params.el;
    if (typeof el === "string") {
      el = document.querySelector(el);
    }
    if (!el) {
      return false;
    }
    el.swiper = swiper;
    if (
      el.parentNode &&
      el.parentNode.host &&
      el.parentNode.host.nodeName ===
        swiper.params.swiperElementNodeName.toUpperCase()
    ) {
      swiper.isElement = true;
    }
    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = el.shadowRoot.querySelector(getWrapperSelector());
        return res;
      }
      return elementChildren(el, getWrapperSelector())[0];
    };
    let wrapperEl = getWrapper();
    if (!wrapperEl && swiper.params.createElements) {
      wrapperEl = createElement("div", swiper.params.wrapperClass);
      el.append(wrapperEl);
      elementChildren(el, `.${swiper.params.slideClass}`).forEach((slideEl) => {
        wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper, {
      el,
      wrapperEl,
      slidesEl:
        swiper.isElement && !el.parentNode.host.slideSlots
          ? el.parentNode.host
          : wrapperEl,
      hostEl: swiper.isElement ? el.parentNode.host : el,
      mounted: true,
      // RTL
      rtl:
        el.dir.toLowerCase() === "rtl" ||
        elementStyle(el, "direction") === "rtl",
      rtlTranslate:
        swiper.params.direction === "horizontal" &&
        (el.dir.toLowerCase() === "rtl" ||
          elementStyle(el, "direction") === "rtl"),
      wrongRTL: elementStyle(wrapperEl, "display") === "-webkit-box",
    });
    return true;
  }
  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit("beforeInit");
    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    }
    swiper.addClasses();
    swiper.updateSize();
    swiper.updateSlides();
    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    }
    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }
    if (swiper.params.loop && swiper.virtual && swiper.params.virtual.enabled) {
      swiper.slideTo(
        swiper.params.initialSlide + swiper.virtual.slidesBefore,
        0,
        swiper.params.runCallbacksOnInit,
        false,
        true
      );
    } else {
      swiper.slideTo(
        swiper.params.initialSlide,
        0,
        swiper.params.runCallbacksOnInit,
        false,
        true
      );
    }
    if (swiper.params.loop) {
      swiper.loopCreate();
    }
    swiper.attachEvents();
    const lazyElements = [...swiper.el.querySelectorAll('[loading="lazy"]')];
    if (swiper.isElement) {
      lazyElements.push(...swiper.hostEl.querySelectorAll('[loading="lazy"]'));
    }
    lazyElements.forEach((imageEl) => {
      if (imageEl.complete) {
        processLazyPreloader(swiper, imageEl);
      } else {
        imageEl.addEventListener("load", (e2) => {
          processLazyPreloader(swiper, e2.target);
        });
      }
    });
    preload(swiper);
    swiper.initialized = true;
    preload(swiper);
    swiper.emit("init");
    swiper.emit("afterInit");
    return swiper;
  }
  destroy(deleteInstance, cleanStyles) {
    if (deleteInstance === void 0) {
      deleteInstance = true;
    }
    if (cleanStyles === void 0) {
      cleanStyles = true;
    }
    const swiper = this;
    const { params, el, wrapperEl, slides } = swiper;
    if (typeof swiper.params === "undefined" || swiper.destroyed) {
      return null;
    }
    swiper.emit("beforeDestroy");
    swiper.initialized = false;
    swiper.detachEvents();
    if (params.loop) {
      swiper.loopDestroy();
    }
    if (cleanStyles) {
      swiper.removeClasses();
      if (el && typeof el !== "string") {
        el.removeAttribute("style");
      }
      if (wrapperEl) {
        wrapperEl.removeAttribute("style");
      }
      if (slides && slides.length) {
        slides.forEach((slideEl) => {
          slideEl.classList.remove(
            params.slideVisibleClass,
            params.slideFullyVisibleClass,
            params.slideActiveClass,
            params.slideNextClass,
            params.slidePrevClass
          );
          slideEl.removeAttribute("style");
          slideEl.removeAttribute("data-swiper-slide-index");
        });
      }
    }
    swiper.emit("destroy");
    Object.keys(swiper.eventsListeners).forEach((eventName) => {
      swiper.off(eventName);
    });
    if (deleteInstance !== false) {
      if (swiper.el && typeof swiper.el !== "string") {
        swiper.el.swiper = null;
      }
      deleteProps(swiper);
    }
    swiper.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === "function" && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m2) => Swiper.installModule(m2));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);
function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0];
        if (!element) {
          element = createElement("div", checkProps[key]);
          element.className = checkProps[key];
          swiper.el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}
function Navigation(_ref) {
  let { swiper, extendParams, on, emit } = _ref;
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled",
    },
  });
  swiper.navigation = {
    nextEl: null,
    prevEl: null,
  };
  function getEl(el) {
    let res;
    if (el && typeof el === "string" && swiper.isElement) {
      res = swiper.el.querySelector(el) || swiper.hostEl.querySelector(el);
      if (res) return res;
    }
    if (el) {
      if (typeof el === "string") res = [...document.querySelectorAll(el)];
      if (
        swiper.params.uniqueNavElements &&
        typeof el === "string" &&
        res &&
        res.length > 1 &&
        swiper.el.querySelectorAll(el).length === 1
      ) {
        res = swiper.el.querySelector(el);
      } else if (res && res.length === 1) {
        res = res[0];
      }
    }
    if (el && !res) return el;
    return res;
  }
  function toggleEl(el, disabled) {
    const params = swiper.params.navigation;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (subEl) {
        subEl.classList[disabled ? "add" : "remove"](
          ...params.disabledClass.split(" ")
        );
        if (subEl.tagName === "BUTTON") subEl.disabled = disabled;
        if (swiper.params.watchOverflow && swiper.enabled) {
          subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
        }
      }
    });
  }
  function update2() {
    const { nextEl, prevEl } = swiper.navigation;
    if (swiper.params.loop) {
      toggleEl(prevEl, false);
      toggleEl(nextEl, false);
      return;
    }
    toggleEl(prevEl, swiper.isBeginning && !swiper.params.rewind);
    toggleEl(nextEl, swiper.isEnd && !swiper.params.rewind);
  }
  function onPrevClick(e2) {
    e2.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
      return;
    swiper.slidePrev();
    emit("navigationPrev");
  }
  function onNextClick(e2) {
    e2.preventDefault();
    if (swiper.isEnd && !swiper.params.loop && !swiper.params.rewind) return;
    swiper.slideNext();
    emit("navigationNext");
  }
  function init4() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(
      swiper,
      swiper.originalParams.navigation,
      swiper.params.navigation,
      {
        nextEl: "swiper-button-next",
        prevEl: "swiper-button-prev",
      }
    );
    if (!(params.nextEl || params.prevEl)) return;
    let nextEl = getEl(params.nextEl);
    let prevEl = getEl(params.prevEl);
    Object.assign(swiper.navigation, {
      nextEl,
      prevEl,
    });
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const initButton = (el, dir) => {
      if (el) {
        el.addEventListener(
          "click",
          dir === "next" ? onNextClick : onPrevClick
        );
      }
      if (!swiper.enabled && el) {
        el.classList.add(...params.lockClass.split(" "));
      }
    };
    nextEl.forEach((el) => initButton(el, "next"));
    prevEl.forEach((el) => initButton(el, "prev"));
  }
  function destroy() {
    let { nextEl, prevEl } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const destroyButton = (el, dir) => {
      el.removeEventListener(
        "click",
        dir === "next" ? onNextClick : onPrevClick
      );
      el.classList.remove(...swiper.params.navigation.disabledClass.split(" "));
    };
    nextEl.forEach((el) => destroyButton(el, "next"));
    prevEl.forEach((el) => destroyButton(el, "prev"));
  }
  on("init", () => {
    if (swiper.params.navigation.enabled === false) {
      disable();
    } else {
      init4();
      update2();
    }
  });
  on("toEdge fromEdge lock unlock", () => {
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let { nextEl, prevEl } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    if (swiper.enabled) {
      update2();
      return;
    }
    [...nextEl, ...prevEl]
      .filter((el) => !!el)
      .forEach((el) => el.classList.add(swiper.params.navigation.lockClass));
  });
  on("click", (_s, e2) => {
    let { nextEl, prevEl } = swiper.navigation;
    nextEl = makeElementsArray(nextEl);
    prevEl = makeElementsArray(prevEl);
    const targetEl = e2.target;
    let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
    if (swiper.isElement && !targetIsButton) {
      const path = e2.path || (e2.composedPath && e2.composedPath());
      if (path) {
        targetIsButton = path.find(
          (pathEl) => nextEl.includes(pathEl) || prevEl.includes(pathEl)
        );
      }
    }
    if (swiper.params.navigation.hideOnClick && !targetIsButton) {
      if (
        swiper.pagination &&
        swiper.params.pagination &&
        swiper.params.pagination.clickable &&
        (swiper.pagination.el === targetEl ||
          swiper.pagination.el.contains(targetEl))
      )
        return;
      let isHidden;
      if (nextEl.length) {
        isHidden = nextEl[0].classList.contains(
          swiper.params.navigation.hiddenClass
        );
      } else if (prevEl.length) {
        isHidden = prevEl[0].classList.contains(
          swiper.params.navigation.hiddenClass
        );
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      [...nextEl, ...prevEl]
        .filter((el) => !!el)
        .forEach((el) =>
          el.classList.toggle(swiper.params.navigation.hiddenClass)
        );
    }
  });
  const enable = () => {
    swiper.el.classList.remove(
      ...swiper.params.navigation.navigationDisabledClass.split(" ")
    );
    init4();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(
      ...swiper.params.navigation.navigationDisabledClass.split(" ")
    );
    destroy();
  };
  Object.assign(swiper.navigation, {
    enable,
    disable,
    update: update2,
    init: init4,
    destroy,
  });
}
function classesToSelector(classes2) {
  if (classes2 === void 0) {
    classes2 = "";
  }
  return `.${classes2
    .trim()
    .replace(/([\.:!+\/])/g, "\\$1")
    .replace(/ /g, ".")}`;
}
function Pagination(_ref) {
  let { swiper, extendParams, on, emit } = _ref;
  const pfx = "swiper-pagination";
  extendParams({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: "bullets",
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: (number) => number,
      formatFractionTotal: (number) => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`,
    },
  });
  swiper.pagination = {
    el: null,
    bullets: [],
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  function isPaginationDisabled() {
    return (
      !swiper.params.pagination.el ||
      !swiper.pagination.el ||
      (Array.isArray(swiper.pagination.el) && swiper.pagination.el.length === 0)
    );
  }
  function setSideBullets(bulletEl, position) {
    const { bulletActiveClass } = swiper.params.pagination;
    if (!bulletEl) return;
    bulletEl =
      bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
    if (bulletEl) {
      bulletEl.classList.add(`${bulletActiveClass}-${position}`);
      bulletEl =
        bulletEl[`${position === "prev" ? "previous" : "next"}ElementSibling`];
      if (bulletEl) {
        bulletEl.classList.add(`${bulletActiveClass}-${position}-${position}`);
      }
    }
  }
  function getMoveDirection(prevIndex, nextIndex, length) {
    prevIndex = prevIndex % length;
    nextIndex = nextIndex % length;
    if (nextIndex === prevIndex + 1) {
      return "next";
    } else if (nextIndex === prevIndex - 1) {
      return "previous";
    }
    return;
  }
  function onBulletClick(e2) {
    const bulletEl = e2.target.closest(
      classesToSelector(swiper.params.pagination.bulletClass)
    );
    if (!bulletEl) {
      return;
    }
    e2.preventDefault();
    const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
    if (swiper.params.loop) {
      if (swiper.realIndex === index) return;
      const moveDirection = getMoveDirection(
        swiper.realIndex,
        index,
        swiper.slides.length
      );
      if (moveDirection === "next") {
        swiper.slideNext();
      } else if (moveDirection === "previous") {
        swiper.slidePrev();
      } else {
        swiper.slideToLoop(index);
      }
    } else {
      swiper.slideTo(index);
    }
  }
  function update2() {
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let current;
    let previousIndex;
    const slidesLength =
      swiper.virtual && swiper.params.virtual.enabled
        ? swiper.virtual.slides.length
        : swiper.slides.length;
    const total = swiper.params.loop
      ? Math.ceil(slidesLength / swiper.params.slidesPerGroup)
      : swiper.snapGrid.length;
    if (swiper.params.loop) {
      previousIndex = swiper.previousRealIndex || 0;
      current =
        swiper.params.slidesPerGroup > 1
          ? Math.floor(swiper.realIndex / swiper.params.slidesPerGroup)
          : swiper.realIndex;
    } else if (typeof swiper.snapIndex !== "undefined") {
      current = swiper.snapIndex;
      previousIndex = swiper.previousSnapIndex;
    } else {
      previousIndex = swiper.previousIndex || 0;
      current = swiper.activeIndex || 0;
    }
    if (
      params.type === "bullets" &&
      swiper.pagination.bullets &&
      swiper.pagination.bullets.length > 0
    ) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = elementOuterSize(
          bullets[0],
          swiper.isHorizontal() ? "width" : "height"
        );
        el.forEach((subEl) => {
          subEl.style[swiper.isHorizontal() ? "width" : "height"] =
            `${bulletSize * (params.dynamicMainBullets + 4)}px`;
        });
        if (params.dynamicMainBullets > 1 && previousIndex !== void 0) {
          dynamicBulletIndex += current - (previousIndex || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex =
          firstIndex +
          (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.forEach((bulletEl) => {
        const classesToRemove = [
          ...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map(
            (suffix) => `${params.bulletActiveClass}${suffix}`
          ),
        ]
          .map((s2) =>
            typeof s2 === "string" && s2.includes(" ") ? s2.split(" ") : s2
          )
          .flat();
        bulletEl.classList.remove(...classesToRemove);
      });
      if (el.length > 1) {
        bullets.forEach((bullet) => {
          const bulletIndex = elementIndex(bullet);
          if (bulletIndex === current) {
            bullet.classList.add(...params.bulletActiveClass.split(" "));
          } else if (swiper.isElement) {
            bullet.setAttribute("part", "bullet");
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              bullet.classList.add(
                ...`${params.bulletActiveClass}-main`.split(" ")
              );
            }
            if (bulletIndex === firstIndex) {
              setSideBullets(bullet, "prev");
            }
            if (bulletIndex === lastIndex) {
              setSideBullets(bullet, "next");
            }
          }
        });
      } else {
        const bullet = bullets[current];
        if (bullet) {
          bullet.classList.add(...params.bulletActiveClass.split(" "));
        }
        if (swiper.isElement) {
          bullets.forEach((bulletEl, bulletIndex) => {
            bulletEl.setAttribute(
              "part",
              bulletIndex === current ? "bullet-active" : "bullet"
            );
          });
        }
        if (params.dynamicBullets) {
          const firstDisplayedBullet = bullets[firstIndex];
          const lastDisplayedBullet = bullets[lastIndex];
          for (let i2 = firstIndex; i2 <= lastIndex; i2 += 1) {
            if (bullets[i2]) {
              bullets[i2].classList.add(
                ...`${params.bulletActiveClass}-main`.split(" ")
              );
            }
          }
          setSideBullets(firstDisplayedBullet, "prev");
          setSideBullets(lastDisplayedBullet, "next");
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(
          bullets.length,
          params.dynamicMainBullets + 4
        );
        const bulletsOffset =
          (bulletSize * dynamicBulletsLength - bulletSize) / 2 -
          midIndex * bulletSize;
        const offsetProp = rtl ? "right" : "left";
        bullets.forEach((bullet) => {
          bullet.style[swiper.isHorizontal() ? offsetProp : "top"] =
            `${bulletsOffset}px`;
        });
      }
    }
    el.forEach((subEl, subElIndex) => {
      if (params.type === "fraction") {
        subEl
          .querySelectorAll(classesToSelector(params.currentClass))
          .forEach((fractionEl) => {
            fractionEl.textContent = params.formatFractionCurrent(current + 1);
          });
        subEl
          .querySelectorAll(classesToSelector(params.totalClass))
          .forEach((totalEl) => {
            totalEl.textContent = params.formatFractionTotal(total);
          });
      }
      if (params.type === "progressbar") {
        let progressbarDirection;
        if (params.progressbarOpposite) {
          progressbarDirection = swiper.isHorizontal()
            ? "vertical"
            : "horizontal";
        } else {
          progressbarDirection = swiper.isHorizontal()
            ? "horizontal"
            : "vertical";
        }
        const scale = (current + 1) / total;
        let scaleX = 1;
        let scaleY = 1;
        if (progressbarDirection === "horizontal") {
          scaleX = scale;
        } else {
          scaleY = scale;
        }
        subEl
          .querySelectorAll(classesToSelector(params.progressbarFillClass))
          .forEach((progressEl) => {
            progressEl.style.transform = `translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`;
            progressEl.style.transitionDuration = `${swiper.params.speed}ms`;
          });
      }
      if (params.type === "custom" && params.renderCustom) {
        subEl.innerHTML = params.renderCustom(swiper, current + 1, total);
        if (subElIndex === 0) emit("paginationRender", subEl);
      } else {
        if (subElIndex === 0) emit("paginationRender", subEl);
        emit("paginationUpdate", subEl);
      }
      if (swiper.params.watchOverflow && swiper.enabled) {
        subEl.classList[swiper.isLocked ? "add" : "remove"](params.lockClass);
      }
    });
  }
  function render3() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength =
      swiper.virtual && swiper.params.virtual.enabled
        ? swiper.virtual.slides.length
        : swiper.grid && swiper.params.grid.rows > 1
          ? swiper.slides.length / Math.ceil(swiper.params.grid.rows)
          : swiper.slides.length;
    let el = swiper.pagination.el;
    el = makeElementsArray(el);
    let paginationHTML = "";
    if (params.type === "bullets") {
      let numberOfBullets = swiper.params.loop
        ? Math.ceil(slidesLength / swiper.params.slidesPerGroup)
        : swiper.snapGrid.length;
      if (
        swiper.params.freeMode &&
        swiper.params.freeMode.enabled &&
        numberOfBullets > slidesLength
      ) {
        numberOfBullets = slidesLength;
      }
      for (let i2 = 0; i2 < numberOfBullets; i2 += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(
            swiper,
            i2,
            params.bulletClass
          );
        } else {
          paginationHTML += `<${params.bulletElement} ${swiper.isElement ? 'part="bullet"' : ""} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
    }
    if (params.type === "fraction") {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(
          swiper,
          params.currentClass,
          params.totalClass
        );
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
      }
    }
    if (params.type === "progressbar") {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(
          swiper,
          params.progressbarFillClass
        );
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
    }
    swiper.pagination.bullets = [];
    el.forEach((subEl) => {
      if (params.type !== "custom") {
        subEl.innerHTML = paginationHTML || "";
      }
      if (params.type === "bullets") {
        swiper.pagination.bullets.push(
          ...subEl.querySelectorAll(classesToSelector(params.bulletClass))
        );
      }
    });
    if (params.type !== "custom") {
      emit("paginationRender", el[0]);
    }
  }
  function init4() {
    swiper.params.pagination = createElementIfNotDefined(
      swiper,
      swiper.originalParams.pagination,
      swiper.params.pagination,
      {
        el: "swiper-pagination",
      }
    );
    const params = swiper.params.pagination;
    if (!params.el) return;
    let el;
    if (typeof params.el === "string" && swiper.isElement) {
      el = swiper.el.querySelector(params.el);
    }
    if (!el && typeof params.el === "string") {
      el = [...document.querySelectorAll(params.el)];
    }
    if (!el) {
      el = params.el;
    }
    if (!el || el.length === 0) return;
    if (
      swiper.params.uniqueNavElements &&
      typeof params.el === "string" &&
      Array.isArray(el) &&
      el.length > 1
    ) {
      el = [...swiper.el.querySelectorAll(params.el)];
      if (el.length > 1) {
        el = el.filter((subEl) => {
          if (elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
          return true;
        })[0];
      }
    }
    if (Array.isArray(el) && el.length === 1) el = el[0];
    Object.assign(swiper.pagination, {
      el,
    });
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      if (params.type === "bullets" && params.clickable) {
        subEl.classList.add(...(params.clickableClass || "").split(" "));
      }
      subEl.classList.add(params.modifierClass + params.type);
      subEl.classList.add(
        swiper.isHorizontal() ? params.horizontalClass : params.verticalClass
      );
      if (params.type === "bullets" && params.dynamicBullets) {
        subEl.classList.add(`${params.modifierClass}${params.type}-dynamic`);
        dynamicBulletIndex = 0;
        if (params.dynamicMainBullets < 1) {
          params.dynamicMainBullets = 1;
        }
      }
      if (params.type === "progressbar" && params.progressbarOpposite) {
        subEl.classList.add(params.progressbarOppositeClass);
      }
      if (params.clickable) {
        subEl.addEventListener("click", onBulletClick);
      }
      if (!swiper.enabled) {
        subEl.classList.add(params.lockClass);
      }
    });
  }
  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    let el = swiper.pagination.el;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) => {
        subEl.classList.remove(params.hiddenClass);
        subEl.classList.remove(params.modifierClass + params.type);
        subEl.classList.remove(
          swiper.isHorizontal() ? params.horizontalClass : params.verticalClass
        );
        if (params.clickable) {
          subEl.classList.remove(...(params.clickableClass || "").split(" "));
          subEl.removeEventListener("click", onBulletClick);
        }
      });
    }
    if (swiper.pagination.bullets)
      swiper.pagination.bullets.forEach((subEl) =>
        subEl.classList.remove(...params.bulletActiveClass.split(" "))
      );
  }
  on("changeDirection", () => {
    if (!swiper.pagination || !swiper.pagination.el) return;
    const params = swiper.params.pagination;
    let { el } = swiper.pagination;
    el = makeElementsArray(el);
    el.forEach((subEl) => {
      subEl.classList.remove(params.horizontalClass, params.verticalClass);
      subEl.classList.add(
        swiper.isHorizontal() ? params.horizontalClass : params.verticalClass
      );
    });
  });
  on("init", () => {
    if (swiper.params.pagination.enabled === false) {
      disable();
    } else {
      init4();
      render3();
      update2();
    }
  });
  on("activeIndexChange", () => {
    if (typeof swiper.snapIndex === "undefined") {
      update2();
    }
  });
  on("snapIndexChange", () => {
    update2();
  });
  on("snapGridLengthChange", () => {
    render3();
    update2();
  });
  on("destroy", () => {
    destroy();
  });
  on("enable disable", () => {
    let { el } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) =>
        subEl.classList[swiper.enabled ? "remove" : "add"](
          swiper.params.pagination.lockClass
        )
      );
    }
  });
  on("lock unlock", () => {
    update2();
  });
  on("click", (_s, e2) => {
    const targetEl = e2.target;
    const el = makeElementsArray(swiper.pagination.el);
    if (
      swiper.params.pagination.el &&
      swiper.params.pagination.hideOnClick &&
      el &&
      el.length > 0 &&
      !targetEl.classList.contains(swiper.params.pagination.bulletClass)
    ) {
      if (
        swiper.navigation &&
        ((swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl) ||
          (swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl))
      )
        return;
      const isHidden = el[0].classList.contains(
        swiper.params.pagination.hiddenClass
      );
      if (isHidden === true) {
        emit("paginationShow");
      } else {
        emit("paginationHide");
      }
      el.forEach((subEl) =>
        subEl.classList.toggle(swiper.params.pagination.hiddenClass)
      );
    }
  });
  const enable = () => {
    swiper.el.classList.remove(
      swiper.params.pagination.paginationDisabledClass
    );
    let { el } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) =>
        subEl.classList.remove(swiper.params.pagination.paginationDisabledClass)
      );
    }
    init4();
    render3();
    update2();
  };
  const disable = () => {
    swiper.el.classList.add(swiper.params.pagination.paginationDisabledClass);
    let { el } = swiper.pagination;
    if (el) {
      el = makeElementsArray(el);
      el.forEach((subEl) =>
        subEl.classList.add(swiper.params.pagination.paginationDisabledClass)
      );
    }
    destroy();
  };
  Object.assign(swiper.pagination, {
    enable,
    disable,
    render: render3,
    update: update2,
    init: init4,
    destroy,
  });
}
function Autoplay(_ref) {
  let { swiper, extendParams, on, emit, params } = _ref;
  swiper.autoplay = {
    running: false,
    paused: false,
    timeLeft: 0,
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3e3,
      waitForTransition: true,
      disableOnInteraction: false,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false,
    },
  });
  let timeout;
  let raf;
  let autoplayDelayTotal =
    params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayDelayCurrent =
    params && params.autoplay ? params.autoplay.delay : 3e3;
  let autoplayTimeLeft;
  let autoplayStartTime = /* @__PURE__ */ new Date().getTime();
  let wasPaused;
  let isTouched;
  let pausedByTouch;
  let touchStartTimeout;
  let slideChanged;
  let pausedByInteraction;
  let pausedByPointerEnter;
  function onTransitionEnd(e2) {
    if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
    if (e2.target !== swiper.wrapperEl) return;
    swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
    if (pausedByPointerEnter || (e2.detail && e2.detail.bySwiperTouchMove)) {
      return;
    }
    resume();
  }
  const calcTimeLeft = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.autoplay.paused) {
      wasPaused = true;
    } else if (wasPaused) {
      autoplayDelayCurrent = autoplayTimeLeft;
      wasPaused = false;
    }
    const timeLeft = swiper.autoplay.paused
      ? autoplayTimeLeft
      : autoplayStartTime +
        autoplayDelayCurrent -
        /* @__PURE__ */ new Date().getTime();
    swiper.autoplay.timeLeft = timeLeft;
    emit("autoplayTimeLeft", timeLeft, timeLeft / autoplayDelayTotal);
    raf = requestAnimationFrame(() => {
      calcTimeLeft();
    });
  };
  const getSlideDelay = () => {
    let activeSlideEl;
    if (swiper.virtual && swiper.params.virtual.enabled) {
      activeSlideEl = swiper.slides.filter((slideEl) =>
        slideEl.classList.contains("swiper-slide-active")
      )[0];
    } else {
      activeSlideEl = swiper.slides[swiper.activeIndex];
    }
    if (!activeSlideEl) return void 0;
    const currentSlideDelay = parseInt(
      activeSlideEl.getAttribute("data-swiper-autoplay"),
      10
    );
    return currentSlideDelay;
  };
  const run = (delayForce) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    cancelAnimationFrame(raf);
    calcTimeLeft();
    let delay =
      typeof delayForce === "undefined"
        ? swiper.params.autoplay.delay
        : delayForce;
    autoplayDelayTotal = swiper.params.autoplay.delay;
    autoplayDelayCurrent = swiper.params.autoplay.delay;
    const currentSlideDelay = getSlideDelay();
    if (
      !Number.isNaN(currentSlideDelay) &&
      currentSlideDelay > 0 &&
      typeof delayForce === "undefined"
    ) {
      delay = currentSlideDelay;
      autoplayDelayTotal = currentSlideDelay;
      autoplayDelayCurrent = currentSlideDelay;
    }
    autoplayTimeLeft = delay;
    const speed = swiper.params.speed;
    const proceed = () => {
      if (!swiper || swiper.destroyed) return;
      if (swiper.params.autoplay.reverseDirection) {
        if (!swiper.isBeginning || swiper.params.loop || swiper.params.rewind) {
          swiper.slidePrev(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(swiper.slides.length - 1, speed, true, true);
          emit("autoplay");
        }
      } else {
        if (!swiper.isEnd || swiper.params.loop || swiper.params.rewind) {
          swiper.slideNext(speed, true, true);
          emit("autoplay");
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          swiper.slideTo(0, speed, true, true);
          emit("autoplay");
        }
      }
      if (swiper.params.cssMode) {
        autoplayStartTime = /* @__PURE__ */ new Date().getTime();
        requestAnimationFrame(() => {
          run();
        });
      }
    };
    if (delay > 0) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        proceed();
      }, delay);
    } else {
      requestAnimationFrame(() => {
        proceed();
      });
    }
    return delay;
  };
  const start = () => {
    autoplayStartTime = /* @__PURE__ */ new Date().getTime();
    swiper.autoplay.running = true;
    run();
    emit("autoplayStart");
  };
  const stop = () => {
    swiper.autoplay.running = false;
    clearTimeout(timeout);
    cancelAnimationFrame(raf);
    emit("autoplayStop");
  };
  const pause = (internal, reset) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    clearTimeout(timeout);
    if (!internal) {
      pausedByInteraction = true;
    }
    const proceed = () => {
      emit("autoplayPause");
      if (swiper.params.autoplay.waitForTransition) {
        swiper.wrapperEl.addEventListener("transitionend", onTransitionEnd);
      } else {
        resume();
      }
    };
    swiper.autoplay.paused = true;
    if (reset) {
      if (slideChanged) {
        autoplayTimeLeft = swiper.params.autoplay.delay;
      }
      slideChanged = false;
      proceed();
      return;
    }
    const delay = autoplayTimeLeft || swiper.params.autoplay.delay;
    autoplayTimeLeft =
      delay - /* @__PURE__ */ (new Date().getTime() - autoplayStartTime);
    if (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) return;
    if (autoplayTimeLeft < 0) autoplayTimeLeft = 0;
    proceed();
  };
  const resume = () => {
    if (
      (swiper.isEnd && autoplayTimeLeft < 0 && !swiper.params.loop) ||
      swiper.destroyed ||
      !swiper.autoplay.running
    )
      return;
    autoplayStartTime = /* @__PURE__ */ new Date().getTime();
    if (pausedByInteraction) {
      pausedByInteraction = false;
      run(autoplayTimeLeft);
    } else {
      run();
    }
    swiper.autoplay.paused = false;
    emit("autoplayResume");
  };
  const onVisibilityChange = () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    const document2 = getDocument();
    if (document2.visibilityState === "hidden") {
      pausedByInteraction = true;
      pause(true);
    }
    if (document2.visibilityState === "visible") {
      resume();
    }
  };
  const onPointerEnter = (e2) => {
    if (e2.pointerType !== "mouse") return;
    pausedByInteraction = true;
    pausedByPointerEnter = true;
    if (swiper.animating || swiper.autoplay.paused) return;
    pause(true);
  };
  const onPointerLeave = (e2) => {
    if (e2.pointerType !== "mouse") return;
    pausedByPointerEnter = false;
    if (swiper.autoplay.paused) {
      resume();
    }
  };
  const attachMouseEvents = () => {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.el.addEventListener("pointerenter", onPointerEnter);
      swiper.el.addEventListener("pointerleave", onPointerLeave);
    }
  };
  const detachMouseEvents = () => {
    if (swiper.el && typeof swiper.el !== "string") {
      swiper.el.removeEventListener("pointerenter", onPointerEnter);
      swiper.el.removeEventListener("pointerleave", onPointerLeave);
    }
  };
  const attachDocumentEvents = () => {
    const document2 = getDocument();
    document2.addEventListener("visibilitychange", onVisibilityChange);
  };
  const detachDocumentEvents = () => {
    const document2 = getDocument();
    document2.removeEventListener("visibilitychange", onVisibilityChange);
  };
  on("init", () => {
    if (swiper.params.autoplay.enabled) {
      attachMouseEvents();
      attachDocumentEvents();
      start();
    }
  });
  on("destroy", () => {
    detachMouseEvents();
    detachDocumentEvents();
    if (swiper.autoplay.running) {
      stop();
    }
  });
  on("_freeModeStaticRelease", () => {
    if (pausedByTouch || pausedByInteraction) {
      resume();
    }
  });
  on("_freeModeNoMomentumRelease", () => {
    if (!swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on("beforeTransitionStart", (_s, speed, internal) => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (internal || !swiper.params.autoplay.disableOnInteraction) {
      pause(true, true);
    } else {
      stop();
    }
  });
  on("sliderFirstMove", () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
      return;
    }
    isTouched = true;
    pausedByTouch = false;
    pausedByInteraction = false;
    touchStartTimeout = setTimeout(() => {
      pausedByInteraction = true;
      pausedByTouch = true;
      pause(true);
    }, 200);
  });
  on("touchEnd", () => {
    if (swiper.destroyed || !swiper.autoplay.running || !isTouched) return;
    clearTimeout(touchStartTimeout);
    clearTimeout(timeout);
    if (swiper.params.autoplay.disableOnInteraction) {
      pausedByTouch = false;
      isTouched = false;
      return;
    }
    if (pausedByTouch && swiper.params.cssMode) resume();
    pausedByTouch = false;
    isTouched = false;
  });
  on("slideChange", () => {
    if (swiper.destroyed || !swiper.autoplay.running) return;
    slideChanged = true;
  });
  Object.assign(swiper.autoplay, {
    start,
    stop,
    pause,
    resume,
  });
}
function Thumb(_ref) {
  let { swiper, extendParams, on } = _ref;
  extendParams({
    thumbs: {
      swiper: null,
      multipleActiveThumbs: true,
      autoScrollOffset: 0,
      slideThumbActiveClass: "swiper-slide-thumb-active",
      thumbsContainerClass: "swiper-thumbs",
    },
  });
  let initialized = false;
  let swiperCreated = false;
  swiper.thumbs = {
    swiper: null,
  };
  function onThumbClick() {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const clickedIndex = thumbsSwiper.clickedIndex;
    const clickedSlide = thumbsSwiper.clickedSlide;
    if (
      clickedSlide &&
      clickedSlide.classList.contains(
        swiper.params.thumbs.slideThumbActiveClass
      )
    )
      return;
    if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
    let slideToIndex;
    if (thumbsSwiper.params.loop) {
      slideToIndex = parseInt(
        thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"),
        10
      );
    } else {
      slideToIndex = clickedIndex;
    }
    if (swiper.params.loop) {
      swiper.slideToLoop(slideToIndex);
    } else {
      swiper.slideTo(slideToIndex);
    }
  }
  function init4() {
    const { thumbs: thumbsParams } = swiper.params;
    if (initialized) return false;
    initialized = true;
    const SwiperClass = swiper.constructor;
    if (thumbsParams.swiper instanceof SwiperClass) {
      swiper.thumbs.swiper = thumbsParams.swiper;
      Object.assign(swiper.thumbs.swiper.originalParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false,
      });
      Object.assign(swiper.thumbs.swiper.params, {
        watchSlidesProgress: true,
        slideToClickedSlide: false,
      });
      swiper.thumbs.swiper.update();
    } else if (isObject$1(thumbsParams.swiper)) {
      const thumbsSwiperParams = Object.assign({}, thumbsParams.swiper);
      Object.assign(thumbsSwiperParams, {
        watchSlidesProgress: true,
        slideToClickedSlide: false,
      });
      swiper.thumbs.swiper = new SwiperClass(thumbsSwiperParams);
      swiperCreated = true;
    }
    swiper.thumbs.swiper.el.classList.add(
      swiper.params.thumbs.thumbsContainerClass
    );
    swiper.thumbs.swiper.on("tap", onThumbClick);
    return true;
  }
  function update2(initial) {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    const slidesPerView =
      thumbsSwiper.params.slidesPerView === "auto"
        ? thumbsSwiper.slidesPerViewDynamic()
        : thumbsSwiper.params.slidesPerView;
    let thumbsToActivate = 1;
    const thumbActiveClass = swiper.params.thumbs.slideThumbActiveClass;
    if (swiper.params.slidesPerView > 1 && !swiper.params.centeredSlides) {
      thumbsToActivate = swiper.params.slidesPerView;
    }
    if (!swiper.params.thumbs.multipleActiveThumbs) {
      thumbsToActivate = 1;
    }
    thumbsToActivate = Math.floor(thumbsToActivate);
    thumbsSwiper.slides.forEach((slideEl) =>
      slideEl.classList.remove(thumbActiveClass)
    );
    if (
      thumbsSwiper.params.loop ||
      (thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled)
    ) {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        elementChildren(
          thumbsSwiper.slidesEl,
          `[data-swiper-slide-index="${swiper.realIndex + i2}"]`
        ).forEach((slideEl) => {
          slideEl.classList.add(thumbActiveClass);
        });
      }
    } else {
      for (let i2 = 0; i2 < thumbsToActivate; i2 += 1) {
        if (thumbsSwiper.slides[swiper.realIndex + i2]) {
          thumbsSwiper.slides[swiper.realIndex + i2].classList.add(
            thumbActiveClass
          );
        }
      }
    }
    const autoScrollOffset = swiper.params.thumbs.autoScrollOffset;
    const useOffset = autoScrollOffset && !thumbsSwiper.params.loop;
    if (swiper.realIndex !== thumbsSwiper.realIndex || useOffset) {
      const currentThumbsIndex = thumbsSwiper.activeIndex;
      let newThumbsIndex;
      let direction;
      if (thumbsSwiper.params.loop) {
        const newThumbsSlide = thumbsSwiper.slides.filter(
          (slideEl) =>
            slideEl.getAttribute("data-swiper-slide-index") ===
            `${swiper.realIndex}`
        )[0];
        newThumbsIndex = thumbsSwiper.slides.indexOf(newThumbsSlide);
        direction = swiper.activeIndex > swiper.previousIndex ? "next" : "prev";
      } else {
        newThumbsIndex = swiper.realIndex;
        direction = newThumbsIndex > swiper.previousIndex ? "next" : "prev";
      }
      if (useOffset) {
        newThumbsIndex +=
          direction === "next" ? autoScrollOffset : -1 * autoScrollOffset;
      }
      if (
        thumbsSwiper.visibleSlidesIndexes &&
        thumbsSwiper.visibleSlidesIndexes.indexOf(newThumbsIndex) < 0
      ) {
        if (thumbsSwiper.params.centeredSlides) {
          if (newThumbsIndex > currentThumbsIndex) {
            newThumbsIndex = newThumbsIndex - Math.floor(slidesPerView / 2) + 1;
          } else {
            newThumbsIndex = newThumbsIndex + Math.floor(slidesPerView / 2) - 1;
          }
        } else if (
          newThumbsIndex > currentThumbsIndex &&
          thumbsSwiper.params.slidesPerGroup === 1
        );
        thumbsSwiper.slideTo(newThumbsIndex, initial ? 0 : void 0);
      }
    }
  }
  on("beforeInit", () => {
    const { thumbs: thumbs2 } = swiper.params;
    if (!thumbs2 || !thumbs2.swiper) return;
    if (
      typeof thumbs2.swiper === "string" ||
      thumbs2.swiper instanceof HTMLElement
    ) {
      const document2 = getDocument();
      const getThumbsElementAndInit = () => {
        const thumbsElement =
          typeof thumbs2.swiper === "string"
            ? document2.querySelector(thumbs2.swiper)
            : thumbs2.swiper;
        if (thumbsElement && thumbsElement.swiper) {
          thumbs2.swiper = thumbsElement.swiper;
          init4();
          update2(true);
        } else if (thumbsElement) {
          const eventName = `${swiper.params.eventsPrefix}init`;
          const onThumbsSwiper = (e2) => {
            thumbs2.swiper = e2.detail[0];
            thumbsElement.removeEventListener(eventName, onThumbsSwiper);
            init4();
            update2(true);
            thumbs2.swiper.update();
            swiper.update();
          };
          thumbsElement.addEventListener(eventName, onThumbsSwiper);
        }
        return thumbsElement;
      };
      const watchForThumbsToAppear = () => {
        if (swiper.destroyed) return;
        const thumbsElement = getThumbsElementAndInit();
        if (!thumbsElement) {
          requestAnimationFrame(watchForThumbsToAppear);
        }
      };
      requestAnimationFrame(watchForThumbsToAppear);
    } else {
      init4();
      update2(true);
    }
  });
  on("slideChange update resize observerUpdate", () => {
    update2();
  });
  on("setTransition", (_s, duration) => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    thumbsSwiper.setTransition(duration);
  });
  on("beforeDestroy", () => {
    const thumbsSwiper = swiper.thumbs.swiper;
    if (!thumbsSwiper || thumbsSwiper.destroyed) return;
    if (swiperCreated) {
      thumbsSwiper.destroy();
    }
  });
  Object.assign(swiper.thumbs, {
    init: init4,
    update: update2,
  });
}
function effectInit(params) {
  const {
    effect,
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    overwriteParams,
    perspective,
    recreateShadows,
    getEffectParams,
  } = params;
  on("beforeInit", () => {
    if (swiper.params.effect !== effect) return;
    swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`);
    if (perspective && perspective()) {
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);
    }
    const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
    Object.assign(swiper.params, overwriteParamsResult);
    Object.assign(swiper.originalParams, overwriteParamsResult);
  });
  on("setTranslate", () => {
    if (swiper.params.effect !== effect) return;
    setTranslate2();
  });
  on("setTransition", (_s, duration) => {
    if (swiper.params.effect !== effect) return;
    setTransition2(duration);
  });
  on("transitionEnd", () => {
    if (swiper.params.effect !== effect) return;
    if (recreateShadows) {
      if (!getEffectParams || !getEffectParams().slideShadows) return;
      swiper.slides.forEach((slideEl) => {
        slideEl
          .querySelectorAll(
            ".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left"
          )
          .forEach((shadowEl) => shadowEl.remove());
      });
      recreateShadows();
    }
  });
  let requireUpdateOnVirtual;
  on("virtualUpdate", () => {
    if (swiper.params.effect !== effect) return;
    if (!swiper.slides.length) {
      requireUpdateOnVirtual = true;
    }
    requestAnimationFrame(() => {
      if (requireUpdateOnVirtual && swiper.slides && swiper.slides.length) {
        setTranslate2();
        requireUpdateOnVirtual = false;
      }
    });
  });
}
function effectTarget(effectParams, slideEl) {
  const transformEl = getSlideTransformEl(slideEl);
  if (transformEl !== slideEl) {
    transformEl.style.backfaceVisibility = "hidden";
    transformEl.style["-webkit-backface-visibility"] = "hidden";
  }
  return transformEl;
}
function effectVirtualTransitionEnd(_ref) {
  let { swiper, duration, transformElements, allSlides } = _ref;
  const { activeIndex } = swiper;
  const getSlide = (el) => {
    if (!el.parentElement) {
      const slide2 = swiper.slides.filter(
        (slideEl) => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode
      )[0];
      return slide2;
    }
    return el.parentElement;
  };
  if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    let transitionEndTarget;
    if (allSlides) {
      transitionEndTarget = transformElements;
    } else {
      transitionEndTarget = transformElements.filter((transformEl) => {
        const el = transformEl.classList.contains("swiper-slide-transform")
          ? getSlide(transformEl)
          : transformEl;
        return swiper.getSlideIndex(el) === activeIndex;
      });
    }
    transitionEndTarget.forEach((el) => {
      elementTransitionEnd(el, () => {
        if (eventTriggered) return;
        if (!swiper || swiper.destroyed) return;
        eventTriggered = true;
        swiper.animating = false;
        const evt = new window.CustomEvent("transitionend", {
          bubbles: true,
          cancelable: true,
        });
        swiper.wrapperEl.dispatchEvent(evt);
      });
    });
  }
}
function EffectFade(_ref) {
  let { swiper, extendParams, on } = _ref;
  extendParams({
    fadeEffect: {
      crossFade: false,
    },
  });
  const setTranslate2 = () => {
    const { slides } = swiper;
    const params = swiper.params.fadeEffect;
    for (let i2 = 0; i2 < slides.length; i2 += 1) {
      const slideEl = swiper.slides[i2];
      const offset = slideEl.swiperSlideOffset;
      let tx = -offset;
      if (!swiper.params.virtualTranslate) tx -= swiper.translate;
      let ty = 0;
      if (!swiper.isHorizontal()) {
        ty = tx;
        tx = 0;
      }
      const slideOpacity = swiper.params.fadeEffect.crossFade
        ? Math.max(1 - Math.abs(slideEl.progress), 0)
        : 1 + Math.min(Math.max(slideEl.progress, -1), 0);
      const targetEl = effectTarget(params, slideEl);
      targetEl.style.opacity = slideOpacity;
      targetEl.style.transform = `translate3d(${tx}px, ${ty}px, 0px)`;
    }
  };
  const setTransition2 = (duration) => {
    const transformElements = swiper.slides.map((slideEl) =>
      getSlideTransformEl(slideEl)
    );
    transformElements.forEach((el) => {
      el.style.transitionDuration = `${duration}ms`;
    });
    effectVirtualTransitionEnd({
      swiper,
      duration,
      transformElements,
      allSlides: true,
    });
  };
  effectInit({
    effect: "fade",
    swiper,
    on,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper.params.cssMode,
    }),
  });
}
const slider$1 = document.querySelector(".top-banner-slider");
if (slider$1) {
  const btnNext = slider$1.querySelector(".swiper-button-next");
  const btnPrev = slider$1.querySelector(".swiper-button-prev");
  const swiper = new Swiper(slider$1, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 4e3,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: btnNext ? btnNext : null,
      prevEl: btnPrev ? btnPrev : null,
    },
    pagination: {
      dynamicBullets: true,
      el: ".top-banner-slider .swiper-pagination",
      clickable: true,
    },
  });
  swiper.el.addEventListener("click", (evt) => {
    swiper.autoplay.stop();
  });
  swiper.on("touchStart", () => {
    swiper.autoplay.stop();
  });
}
const sliders$3 = document.querySelectorAll(".base-cards-slider");
if (sliders$3.length) {
  sliders$3.forEach((slider2) => {
    const sideSlider = slider2.classList.contains("side-slider");
    const pagination = slider2.querySelector(".swiper-pagination");
    const btnNext = slider2.querySelector(".swiper-button-next");
    const btnPrev = slider2.querySelector(".swiper-button-prev");
    new Swiper(slider2, {
      modules: [Navigation, Pagination, Autoplay, EffectFade],
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: {
        delay: 5e3,
        disableOnInteraction: false,
      },
      // effect: sideSlider ? "fade" : null,
      loop: sideSlider ? true : false,
      breakpoints: !sideSlider
        ? {
            640: {
              slidesPerView: 2,
            },
            960: {
              slidesPerView: 3,
            },
          }
        : null,
      navigation: {
        nextEl: btnNext ? btnNext : null,
        prevEl: btnPrev ? btnPrev : null,
      },
      pagination: {
        el: pagination ? pagination : null,
        dynamicBullets: true,
      },
    });
  });
}
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self2;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.11.4
 * https://greensock.com
 *
 * @license Copyright 2008-2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */
var _config = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: "",
    },
  },
  _defaults = {
    duration: 0.5,
    overwrite: false,
    delay: 0,
  },
  _suppressOverwrites,
  _reverting$1,
  _context,
  _bigNum$1 = 1e8,
  _tinyNum = 1 / _bigNum$1,
  _2PI = Math.PI * 2,
  _HALF_PI = _2PI / 4,
  _gsID = 0,
  _sqrt = Math.sqrt,
  _cos = Math.cos,
  _sin = Math.sin,
  _isString = function _isString2(value) {
    return typeof value === "string";
  },
  _isFunction = function _isFunction2(value) {
    return typeof value === "function";
  },
  _isNumber = function _isNumber2(value) {
    return typeof value === "number";
  },
  _isUndefined = function _isUndefined2(value) {
    return typeof value === "undefined";
  },
  _isObject = function _isObject2(value) {
    return typeof value === "object";
  },
  _isNotFalse = function _isNotFalse2(value) {
    return value !== false;
  },
  _windowExists$1 = function _windowExists() {
    return typeof window !== "undefined";
  },
  _isFuncOrString = function _isFuncOrString2(value) {
    return _isFunction(value) || _isString(value);
  },
  _isTypedArray =
    (typeof ArrayBuffer === "function" && ArrayBuffer.isView) || function () {},
  _isArray = Array.isArray,
  _strictNumExp = /(?:-?\.?\d|\.)+/gi,
  _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
  _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
  _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
  _relExp = /[+-]=-?[.\d]+/,
  _delimitedValueExp = /[^,'"\[\]\s]+/gi,
  _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
  _globalTimeline,
  _win$1,
  _coreInitted,
  _doc$1,
  _globals = {},
  _installScope = {},
  _coreReady,
  _install = function _install2(scope) {
    return (_installScope = _merge(scope, _globals)) && gsap;
  },
  _missingPlugin = function _missingPlugin2(property, value) {
    return console.warn(
      "Invalid property",
      property,
      "set to",
      value,
      "Missing plugin? gsap.registerPlugin()"
    );
  },
  _warn = function _warn2(message, suppress) {
    return !suppress && console.warn(message);
  },
  _addGlobal = function _addGlobal2(name, obj) {
    return (
      (name &&
        (_globals[name] = obj) &&
        _installScope &&
        (_installScope[name] = obj)) ||
      _globals
    );
  },
  _emptyFunc = function _emptyFunc2() {
    return 0;
  },
  _startAtRevertConfig = {
    suppressEvents: true,
    isStart: true,
    kill: false,
  },
  _revertConfigNoKill = {
    suppressEvents: true,
    kill: false,
  },
  _revertConfig = {
    suppressEvents: true,
  },
  _reservedProps = {},
  _lazyTweens = [],
  _lazyLookup = {},
  _lastRenderedFrame,
  _plugins = {},
  _effects = {},
  _nextGCFrame = 30,
  _harnessPlugins = [],
  _callbackNames = "",
  _harness = function _harness2(targets) {
    var target = targets[0],
      harnessPlugin,
      i2;
    _isObject(target) || _isFunction(target) || (targets = [targets]);
    if (!(harnessPlugin = (target._gsap || {}).harness)) {
      i2 = _harnessPlugins.length;
      while (i2-- && !_harnessPlugins[i2].targetTest(target)) {}
      harnessPlugin = _harnessPlugins[i2];
    }
    i2 = targets.length;
    while (i2--) {
      (targets[i2] &&
        (targets[i2]._gsap ||
          (targets[i2]._gsap = new GSCache(targets[i2], harnessPlugin)))) ||
        targets.splice(i2, 1);
    }
    return targets;
  },
  _getCache = function _getCache2(target) {
    return target._gsap || _harness(toArray(target))[0]._gsap;
  },
  _getProperty = function _getProperty2(target, property, v2) {
    return (v2 = target[property]) && _isFunction(v2)
      ? target[property]()
      : (_isUndefined(v2) &&
          target.getAttribute &&
          target.getAttribute(property)) ||
          v2;
  },
  _forEachName = function _forEachName2(names, func) {
    return (names = names.split(",")).forEach(func) || names;
  },
  _round = function _round2(value) {
    return Math.round(value * 1e5) / 1e5 || 0;
  },
  _roundPrecise = function _roundPrecise2(value) {
    return Math.round(value * 1e7) / 1e7 || 0;
  },
  _parseRelative = function _parseRelative2(start, value) {
    var operator = value.charAt(0),
      end = parseFloat(value.substr(2));
    start = parseFloat(start);
    return operator === "+"
      ? start + end
      : operator === "-"
        ? start - end
        : operator === "*"
          ? start * end
          : start / end;
  },
  _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
    var l2 = toFind.length,
      i2 = 0;
    for (; toSearch.indexOf(toFind[i2]) < 0 && ++i2 < l2; ) {}
    return i2 < l2;
  },
  _lazyRender = function _lazyRender2() {
    var l2 = _lazyTweens.length,
      a2 = _lazyTweens.slice(0),
      i2,
      tween;
    _lazyLookup = {};
    _lazyTweens.length = 0;
    for (i2 = 0; i2 < l2; i2++) {
      tween = a2[i2];
      tween &&
        tween._lazy &&
        (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
    }
  },
  _lazySafeRender = function _lazySafeRender2(
    animation,
    time,
    suppressEvents,
    force
  ) {
    _lazyTweens.length && !_reverting$1 && _lazyRender();
    animation.render(
      time,
      suppressEvents,
      _reverting$1 && time < 0 && (animation._initted || animation._startAt)
    );
    _lazyTweens.length && !_reverting$1 && _lazyRender();
  },
  _numericIfPossible = function _numericIfPossible2(value) {
    var n2 = parseFloat(value);
    return (n2 || n2 === 0) && (value + "").match(_delimitedValueExp).length < 2
      ? n2
      : _isString(value)
        ? value.trim()
        : value;
  },
  _passThrough = function _passThrough2(p2) {
    return p2;
  },
  _setDefaults = function _setDefaults2(obj, defaults3) {
    for (var p2 in defaults3) {
      p2 in obj || (obj[p2] = defaults3[p2]);
    }
    return obj;
  },
  _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
    return function (obj, defaults3) {
      for (var p2 in defaults3) {
        p2 in obj ||
          (p2 === "duration" && excludeDuration) ||
          p2 === "ease" ||
          (obj[p2] = defaults3[p2]);
      }
    };
  },
  _merge = function _merge2(base, toMerge) {
    for (var p2 in toMerge) {
      base[p2] = toMerge[p2];
    }
    return base;
  },
  _mergeDeep = function _mergeDeep2(base, toMerge) {
    for (var p2 in toMerge) {
      p2 !== "__proto__" &&
        p2 !== "constructor" &&
        p2 !== "prototype" &&
        (base[p2] = _isObject(toMerge[p2])
          ? _mergeDeep2(base[p2] || (base[p2] = {}), toMerge[p2])
          : toMerge[p2]);
    }
    return base;
  },
  _copyExcluding = function _copyExcluding2(obj, excluding) {
    var copy = {},
      p2;
    for (p2 in obj) {
      p2 in excluding || (copy[p2] = obj[p2]);
    }
    return copy;
  },
  _inheritDefaults = function _inheritDefaults2(vars) {
    var parent = vars.parent || _globalTimeline,
      func = vars.keyframes
        ? _setKeyframeDefaults(_isArray(vars.keyframes))
        : _setDefaults;
    if (_isNotFalse(vars.inherit)) {
      while (parent) {
        func(vars, parent.vars.defaults);
        parent = parent.parent || parent._dp;
      }
    }
    return vars;
  },
  _arraysMatch = function _arraysMatch2(a1, a2) {
    var i2 = a1.length,
      match = i2 === a2.length;
    while (match && i2-- && a1[i2] === a2[i2]) {}
    return i2 < 0;
  },
  _addLinkedListItem = function _addLinkedListItem2(
    parent,
    child,
    firstProp,
    lastProp,
    sortBy
  ) {
    var prev = parent[lastProp],
      t2;
    if (sortBy) {
      t2 = child[sortBy];
      while (prev && prev[sortBy] > t2) {
        prev = prev._prev;
      }
    }
    if (prev) {
      child._next = prev._next;
      prev._next = child;
    } else {
      child._next = parent[firstProp];
      parent[firstProp] = child;
    }
    if (child._next) {
      child._next._prev = child;
    } else {
      parent[lastProp] = child;
    }
    child._prev = prev;
    child.parent = child._dp = parent;
    return child;
  },
  _removeLinkedListItem = function _removeLinkedListItem2(
    parent,
    child,
    firstProp,
    lastProp
  ) {
    if (firstProp === void 0) {
      firstProp = "_first";
    }
    if (lastProp === void 0) {
      lastProp = "_last";
    }
    var prev = child._prev,
      next = child._next;
    if (prev) {
      prev._next = next;
    } else if (parent[firstProp] === child) {
      parent[firstProp] = next;
    }
    if (next) {
      next._prev = prev;
    } else if (parent[lastProp] === child) {
      parent[lastProp] = prev;
    }
    child._next = child._prev = child.parent = null;
  },
  _removeFromParent = function _removeFromParent2(
    child,
    onlyIfParentHasAutoRemove
  ) {
    child.parent &&
      (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) &&
      child.parent.remove(child);
    child._act = 0;
  },
  _uncache = function _uncache2(animation, child) {
    if (
      animation &&
      (!child || child._end > animation._dur || child._start < 0)
    ) {
      var a2 = animation;
      while (a2) {
        a2._dirty = 1;
        a2 = a2.parent;
      }
    }
    return animation;
  },
  _recacheAncestors = function _recacheAncestors2(animation) {
    var parent = animation.parent;
    while (parent && parent.parent) {
      parent._dirty = 1;
      parent.totalDuration();
      parent = parent.parent;
    }
    return animation;
  },
  _rewindStartAt = function _rewindStartAt2(
    tween,
    totalTime,
    suppressEvents,
    force
  ) {
    return (
      tween._startAt &&
      (_reverting$1
        ? tween._startAt.revert(_revertConfigNoKill)
        : (tween.vars.immediateRender && !tween.vars.autoRevert) ||
          tween._startAt.render(totalTime, true, force))
    );
  },
  _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
    return (
      !animation || (animation._ts && _hasNoPausedAncestors2(animation.parent))
    );
  },
  _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
    return animation._repeat
      ? _animationCycle(
          animation._tTime,
          (animation = animation.duration() + animation._rDelay)
        ) * animation
      : 0;
  },
  _animationCycle = function _animationCycle2(tTime, cycleDuration) {
    var whole = Math.floor((tTime /= cycleDuration));
    return tTime && whole === tTime ? whole - 1 : whole;
  },
  _parentToChildTotalTime = function _parentToChildTotalTime2(
    parentTime,
    child
  ) {
    return (
      (parentTime - child._start) * child._ts +
      (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur)
    );
  },
  _setEnd = function _setEnd2(animation) {
    return (animation._end = _roundPrecise(
      animation._start +
        (animation._tDur /
          Math.abs(animation._ts || animation._rts || _tinyNum) || 0)
    ));
  },
  _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
    var parent = animation._dp;
    if (parent && parent.smoothChildTiming && animation._ts) {
      animation._start = _roundPrecise(
        parent._time -
          (animation._ts > 0
            ? totalTime / animation._ts
            : ((animation._dirty
                ? animation.totalDuration()
                : animation._tDur) -
                totalTime) /
              -animation._ts)
      );
      _setEnd(animation);
      parent._dirty || _uncache(parent, animation);
    }
    return animation;
  },
  _postAddChecks = function _postAddChecks2(timeline2, child) {
    var t2;
    if (child._time || (child._initted && !child._dur)) {
      t2 = _parentToChildTotalTime(timeline2.rawTime(), child);
      if (
        !child._dur ||
        _clamp(0, child.totalDuration(), t2) - child._tTime > _tinyNum
      ) {
        child.render(t2, true);
      }
    }
    if (
      _uncache(timeline2, child)._dp &&
      timeline2._initted &&
      timeline2._time >= timeline2._dur &&
      timeline2._ts
    ) {
      if (timeline2._dur < timeline2.duration()) {
        t2 = timeline2;
        while (t2._dp) {
          t2.rawTime() >= 0 && t2.totalTime(t2._tTime);
          t2 = t2._dp;
        }
      }
      timeline2._zTime = -_tinyNum;
    }
  },
  _addToTimeline = function _addToTimeline2(
    timeline2,
    child,
    position,
    skipChecks
  ) {
    child.parent && _removeFromParent(child);
    child._start = _roundPrecise(
      (_isNumber(position)
        ? position
        : position || timeline2 !== _globalTimeline
          ? _parsePosition(timeline2, position, child)
          : timeline2._time) + child._delay
    );
    child._end = _roundPrecise(
      child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0)
    );
    _addLinkedListItem(
      timeline2,
      child,
      "_first",
      "_last",
      timeline2._sort ? "_start" : 0
    );
    _isFromOrFromStart(child) || (timeline2._recent = child);
    skipChecks || _postAddChecks(timeline2, child);
    timeline2._ts < 0 && _alignPlayhead(timeline2, timeline2._tTime);
    return timeline2;
  },
  _scrollTrigger = function _scrollTrigger2(animation, trigger) {
    return (
      (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) &&
      _globals.ScrollTrigger.create(trigger, animation)
    );
  },
  _attemptInitTween = function _attemptInitTween2(
    tween,
    time,
    force,
    suppressEvents,
    tTime
  ) {
    _initTween(tween, time, tTime);
    if (!tween._initted) {
      return 1;
    }
    if (
      !force &&
      tween._pt &&
      !_reverting$1 &&
      ((tween._dur && tween.vars.lazy !== false) ||
        (!tween._dur && tween.vars.lazy)) &&
      _lastRenderedFrame !== _ticker.frame
    ) {
      _lazyTweens.push(tween);
      tween._lazy = [tTime, suppressEvents];
      return 1;
    }
  },
  _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
    var parent = _ref.parent;
    return (
      parent &&
      parent._ts &&
      parent._initted &&
      !parent._lock &&
      (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent))
    );
  },
  _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
    var data = _ref2.data;
    return data === "isFromStart" || data === "isStart";
  },
  _renderZeroDurationTween = function _renderZeroDurationTween2(
    tween,
    totalTime,
    suppressEvents,
    force
  ) {
    var prevRatio = tween.ratio,
      ratio =
        totalTime < 0 ||
        (!totalTime &&
          ((!tween._start &&
            _parentPlayheadIsBeforeStart(tween) &&
            !(!tween._initted && _isFromOrFromStart(tween))) ||
            ((tween._ts < 0 || tween._dp._ts < 0) &&
              !_isFromOrFromStart(tween))))
          ? 0
          : 1,
      repeatDelay = tween._rDelay,
      tTime = 0,
      pt2,
      iteration,
      prevIteration;
    if (repeatDelay && tween._repeat) {
      tTime = _clamp(0, tween._tDur, totalTime);
      iteration = _animationCycle(tTime, repeatDelay);
      tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
      if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
        prevRatio = 1 - ratio;
        tween.vars.repeatRefresh && tween._initted && tween.invalidate();
      }
    }
    if (
      ratio !== prevRatio ||
      _reverting$1 ||
      force ||
      tween._zTime === _tinyNum ||
      (!totalTime && tween._zTime)
    ) {
      if (
        !tween._initted &&
        _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)
      ) {
        return;
      }
      prevIteration = tween._zTime;
      tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
      suppressEvents || (suppressEvents = totalTime && !prevIteration);
      tween.ratio = ratio;
      tween._from && (ratio = 1 - ratio);
      tween._time = 0;
      tween._tTime = tTime;
      pt2 = tween._pt;
      while (pt2) {
        pt2.r(ratio, pt2.d);
        pt2 = pt2._next;
      }
      totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
      tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
      tTime &&
        tween._repeat &&
        !suppressEvents &&
        tween.parent &&
        _callback(tween, "onRepeat");
      if (
        (totalTime >= tween._tDur || totalTime < 0) &&
        tween.ratio === ratio
      ) {
        ratio && _removeFromParent(tween, 1);
        if (!suppressEvents && !_reverting$1) {
          _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
          tween._prom && tween._prom();
        }
      }
    } else if (!tween._zTime) {
      tween._zTime = totalTime;
    }
  },
  _findNextPauseTween = function _findNextPauseTween2(
    animation,
    prevTime,
    time
  ) {
    var child;
    if (time > prevTime) {
      child = animation._first;
      while (child && child._start <= time) {
        if (child.data === "isPause" && child._start > prevTime) {
          return child;
        }
        child = child._next;
      }
    } else {
      child = animation._last;
      while (child && child._start >= time) {
        if (child.data === "isPause" && child._start < prevTime) {
          return child;
        }
        child = child._prev;
      }
    }
  },
  _setDuration = function _setDuration2(
    animation,
    duration,
    skipUncache,
    leavePlayhead
  ) {
    var repeat = animation._repeat,
      dur = _roundPrecise(duration) || 0,
      totalProgress = animation._tTime / animation._tDur;
    totalProgress &&
      !leavePlayhead &&
      (animation._time *= dur / animation._dur);
    animation._dur = dur;
    animation._tDur = !repeat
      ? dur
      : repeat < 0
        ? 1e10
        : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
    totalProgress > 0 &&
      !leavePlayhead &&
      _alignPlayhead(
        animation,
        (animation._tTime = animation._tDur * totalProgress)
      );
    animation.parent && _setEnd(animation);
    skipUncache || _uncache(animation.parent, animation);
    return animation;
  },
  _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
    return animation instanceof Timeline
      ? _uncache(animation)
      : _setDuration(animation, animation._dur);
  },
  _zeroPosition = {
    _start: 0,
    endTime: _emptyFunc,
    totalDuration: _emptyFunc,
  },
  _parsePosition = function _parsePosition2(
    animation,
    position,
    percentAnimation
  ) {
    var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration =
        animation.duration() >= _bigNum$1
          ? recent.endTime(false)
          : animation._dur,
      i2,
      offset,
      isPercent;
    if (_isString(position) && (isNaN(position) || position in labels)) {
      offset = position.charAt(0);
      isPercent = position.substr(-1) === "%";
      i2 = position.indexOf("=");
      if (offset === "<" || offset === ">") {
        i2 >= 0 && (position = position.replace(/=/, ""));
        return (
          (offset === "<"
            ? recent._start
            : recent.endTime(recent._repeat >= 0)) +
          (parseFloat(position.substr(1)) || 0) *
            (isPercent
              ? (i2 < 0 ? recent : percentAnimation).totalDuration() / 100
              : 1)
        );
      }
      if (i2 < 0) {
        position in labels || (labels[position] = clippedDuration);
        return labels[position];
      }
      offset = parseFloat(position.charAt(i2 - 1) + position.substr(i2 + 1));
      if (isPercent && percentAnimation) {
        offset =
          (offset / 100) *
          (_isArray(percentAnimation)
            ? percentAnimation[0]
            : percentAnimation
          ).totalDuration();
      }
      return i2 > 1
        ? _parsePosition2(
            animation,
            position.substr(0, i2 - 1),
            percentAnimation
          ) + offset
        : clippedDuration + offset;
    }
    return position == null ? clippedDuration : +position;
  },
  _createTweenType = function _createTweenType2(type, params, timeline2) {
    var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars,
      parent;
    isLegacy && (vars.duration = params[1]);
    vars.parent = timeline2;
    if (type) {
      irVars = vars;
      parent = timeline2;
      while (parent && !("immediateRender" in irVars)) {
        irVars = parent.vars.defaults || {};
        parent = _isNotFalse(parent.vars.inherit) && parent.parent;
      }
      vars.immediateRender = _isNotFalse(irVars.immediateRender);
      type < 2
        ? (vars.runBackwards = 1)
        : (vars.startAt = params[varsIndex - 1]);
    }
    return new Tween(params[0], vars, params[varsIndex + 1]);
  },
  _conditionalReturn = function _conditionalReturn2(value, func) {
    return value || value === 0 ? func(value) : func;
  },
  _clamp = function _clamp2(min, max, value) {
    return value < min ? min : value > max ? max : value;
  },
  getUnit = function getUnit2(value, v2) {
    return !_isString(value) || !(v2 = _unitExp.exec(value)) ? "" : v2[1];
  },
  clamp = function clamp2(min, max, value) {
    return _conditionalReturn(value, function (v2) {
      return _clamp(min, max, v2);
    });
  },
  _slice = [].slice,
  _isArrayLike = function _isArrayLike2(value, nonEmpty) {
    return (
      value &&
      _isObject(value) &&
      "length" in value &&
      ((!nonEmpty && !value.length) ||
        (value.length - 1 in value && _isObject(value[0]))) &&
      !value.nodeType &&
      value !== _win$1
    );
  },
  _flatten = function _flatten2(ar, leaveStrings, accumulator) {
    if (accumulator === void 0) {
      accumulator = [];
    }
    return (
      ar.forEach(function (value) {
        var _accumulator;
        return (_isString(value) && !leaveStrings) || _isArrayLike(value, 1)
          ? (_accumulator = accumulator).push.apply(
              _accumulator,
              toArray(value)
            )
          : accumulator.push(value);
      }) || accumulator
    );
  },
  toArray = function toArray2(value, scope, leaveStrings) {
    return _context && !scope && _context.selector
      ? _context.selector(value)
      : _isString(value) && !leaveStrings && (_coreInitted || !_wake())
        ? _slice.call((scope || _doc$1).querySelectorAll(value), 0)
        : _isArray(value)
          ? _flatten(value, leaveStrings)
          : _isArrayLike(value)
            ? _slice.call(value, 0)
            : value
              ? [value]
              : [];
  },
  selector = function selector2(value) {
    value = toArray(value)[0] || _warn("Invalid scope") || {};
    return function (v2) {
      var el = value.current || value.nativeElement || value;
      return toArray(
        v2,
        el.querySelectorAll
          ? el
          : el === value
            ? _warn("Invalid scope") || _doc$1.createElement("div")
            : value
      );
    };
  },
  shuffle = function shuffle2(a2) {
    return a2.sort(function () {
      return 0.5 - Math.random();
    });
  },
  distribute = function distribute2(v2) {
    if (_isFunction(v2)) {
      return v2;
    }
    var vars = _isObject(v2)
        ? v2
        : {
            each: v2,
          },
      ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;
    if (_isString(from)) {
      ratioX = ratioY =
        {
          center: 0.5,
          edges: 0.5,
          end: 1,
        }[from] || 0;
    } else if (!isDecimal && ratios) {
      ratioX = from[0];
      ratioY = from[1];
    }
    return function (i2, target, a2) {
      var l2 = (a2 || vars).length,
        distances = cache[l2],
        originX,
        originY,
        x2,
        y2,
        d2,
        j2,
        max,
        min,
        wrapAt;
      if (!distances) {
        wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$1])[1];
        if (!wrapAt) {
          max = -_bigNum$1;
          while (
            max < (max = a2[wrapAt++].getBoundingClientRect().left) &&
            wrapAt < l2
          ) {}
          wrapAt--;
        }
        distances = cache[l2] = [];
        originX = ratios ? Math.min(wrapAt, l2) * ratioX - 0.5 : from % wrapAt;
        originY =
          wrapAt === _bigNum$1
            ? 0
            : ratios
              ? (l2 * ratioY) / wrapAt - 0.5
              : (from / wrapAt) | 0;
        max = 0;
        min = _bigNum$1;
        for (j2 = 0; j2 < l2; j2++) {
          x2 = (j2 % wrapAt) - originX;
          y2 = originY - ((j2 / wrapAt) | 0);
          distances[j2] = d2 = !axis
            ? _sqrt(x2 * x2 + y2 * y2)
            : Math.abs(axis === "y" ? y2 : x2);
          d2 > max && (max = d2);
          d2 < min && (min = d2);
        }
        from === "random" && shuffle(distances);
        distances.max = max - min;
        distances.min = min;
        distances.v = l2 =
          (parseFloat(vars.amount) ||
            parseFloat(vars.each) *
              (wrapAt > l2
                ? l2 - 1
                : !axis
                  ? Math.max(wrapAt, l2 / wrapAt)
                  : axis === "y"
                    ? l2 / wrapAt
                    : wrapAt) ||
            0) * (from === "edges" ? -1 : 1);
        distances.b = l2 < 0 ? base - l2 : base;
        distances.u = getUnit(vars.amount || vars.each) || 0;
        ease = ease && l2 < 0 ? _invertEase(ease) : ease;
      }
      l2 = (distances[i2] - distances.min) / distances.max || 0;
      return (
        _roundPrecise(distances.b + (ease ? ease(l2) : l2) * distances.v) +
        distances.u
      );
    };
  },
  _roundModifier = function _roundModifier2(v2) {
    var p2 = Math.pow(10, ((v2 + "").split(".")[1] || "").length);
    return function (raw) {
      var n2 = _roundPrecise(Math.round(parseFloat(raw) / v2) * v2 * p2);
      return (n2 - (n2 % 1)) / p2 + (_isNumber(raw) ? 0 : getUnit(raw));
    };
  },
  snap = function snap2(snapTo, value) {
    var isArray = _isArray(snapTo),
      radius,
      is2D;
    if (!isArray && _isObject(snapTo)) {
      radius = isArray = snapTo.radius || _bigNum$1;
      if (snapTo.values) {
        snapTo = toArray(snapTo.values);
        if ((is2D = !_isNumber(snapTo[0]))) {
          radius *= radius;
        }
      } else {
        snapTo = _roundModifier(snapTo.increment);
      }
    }
    return _conditionalReturn(
      value,
      !isArray
        ? _roundModifier(snapTo)
        : _isFunction(snapTo)
          ? function (raw) {
              is2D = snapTo(raw);
              return Math.abs(is2D - raw) <= radius ? is2D : raw;
            }
          : function (raw) {
              var x2 = parseFloat(is2D ? raw.x : raw),
                y2 = parseFloat(is2D ? raw.y : 0),
                min = _bigNum$1,
                closest = 0,
                i2 = snapTo.length,
                dx,
                dy;
              while (i2--) {
                if (is2D) {
                  dx = snapTo[i2].x - x2;
                  dy = snapTo[i2].y - y2;
                  dx = dx * dx + dy * dy;
                } else {
                  dx = Math.abs(snapTo[i2] - x2);
                }
                if (dx < min) {
                  min = dx;
                  closest = i2;
                }
              }
              closest = !radius || min <= radius ? snapTo[closest] : raw;
              return is2D || closest === raw || _isNumber(raw)
                ? closest
                : closest + getUnit(raw);
            }
    );
  },
  random = function random2(min, max, roundingIncrement, returnFunction) {
    return _conditionalReturn(
      _isArray(min)
        ? !max
        : roundingIncrement === true
          ? !!(roundingIncrement = 0)
          : !returnFunction,
      function () {
        return _isArray(min)
          ? min[~~(Math.random() * min.length)]
          : (roundingIncrement = roundingIncrement || 1e-5) &&
              (returnFunction =
                roundingIncrement < 1
                  ? Math.pow(10, (roundingIncrement + "").length - 2)
                  : 1) &&
              Math.floor(
                Math.round(
                  (min -
                    roundingIncrement / 2 +
                    Math.random() * (max - min + roundingIncrement * 0.99)) /
                    roundingIncrement
                ) *
                  roundingIncrement *
                  returnFunction
              ) / returnFunction;
      }
    );
  },
  pipe$1 = function pipe() {
    for (
      var _len = arguments.length, functions = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      functions[_key] = arguments[_key];
    }
    return function (value) {
      return functions.reduce(function (v2, f2) {
        return f2(v2);
      }, value);
    };
  },
  unitize = function unitize2(func, unit) {
    return function (value) {
      return func(parseFloat(value)) + (unit || getUnit(value));
    };
  },
  normalize = function normalize2(min, max, value) {
    return mapRange(min, max, 0, 1, value);
  },
  _wrapArray = function _wrapArray2(a2, wrapper, value) {
    return _conditionalReturn(value, function (index) {
      return a2[~~wrapper(index)];
    });
  },
  wrap = function wrap2(min, max, value) {
    var range = max - min;
    return _isArray(min)
      ? _wrapArray(min, wrap2(0, min.length), max)
      : _conditionalReturn(value, function (value2) {
          return ((range + ((value2 - min) % range)) % range) + min;
        });
  },
  wrapYoyo = function wrapYoyo2(min, max, value) {
    var range = max - min,
      total = range * 2;
    return _isArray(min)
      ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max)
      : _conditionalReturn(value, function (value2) {
          value2 = (total + ((value2 - min) % total)) % total || 0;
          return min + (value2 > range ? total - value2 : value2);
        });
  },
  _replaceRandom = function _replaceRandom2(value) {
    var prev = 0,
      s2 = "",
      i2,
      nums,
      end,
      isArray;
    while (~(i2 = value.indexOf("random(", prev))) {
      end = value.indexOf(")", i2);
      isArray = value.charAt(i2 + 7) === "[";
      nums = value
        .substr(i2 + 7, end - i2 - 7)
        .match(isArray ? _delimitedValueExp : _strictNumExp);
      s2 +=
        value.substr(prev, i2 - prev) +
        random(
          isArray ? nums : +nums[0],
          isArray ? 0 : +nums[1],
          +nums[2] || 1e-5
        );
      prev = end + 1;
    }
    return s2 + value.substr(prev, value.length - prev);
  },
  mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
    var inRange = inMax - inMin,
      outRange = outMax - outMin;
    return _conditionalReturn(value, function (value2) {
      return outMin + (((value2 - inMin) / inRange) * outRange || 0);
    });
  },
  interpolate = function interpolate2(start, end, progress, mutate) {
    var func = isNaN(start + end)
      ? 0
      : function (p3) {
          return (1 - p3) * start + p3 * end;
        };
    if (!func) {
      var isString2 = _isString(start),
        master = {},
        p2,
        i2,
        interpolators,
        l2,
        il;
      progress === true && (mutate = 1) && (progress = null);
      if (isString2) {
        start = {
          p: start,
        };
        end = {
          p: end,
        };
      } else if (_isArray(start) && !_isArray(end)) {
        interpolators = [];
        l2 = start.length;
        il = l2 - 2;
        for (i2 = 1; i2 < l2; i2++) {
          interpolators.push(interpolate2(start[i2 - 1], start[i2]));
        }
        l2--;
        func = function func2(p3) {
          p3 *= l2;
          var i3 = Math.min(il, ~~p3);
          return interpolators[i3](p3 - i3);
        };
        progress = end;
      } else if (!mutate) {
        start = _merge(_isArray(start) ? [] : {}, start);
      }
      if (!interpolators) {
        for (p2 in end) {
          _addPropTween.call(master, start, p2, "get", end[p2]);
        }
        func = function func2(p3) {
          return _renderPropTweens(p3, master) || (isString2 ? start.p : start);
        };
      }
    }
    return _conditionalReturn(progress, func);
  },
  _getLabelInDirection = function _getLabelInDirection2(
    timeline2,
    fromTime,
    backward
  ) {
    var labels = timeline2.labels,
      min = _bigNum$1,
      p2,
      distance,
      label;
    for (p2 in labels) {
      distance = labels[p2] - fromTime;
      if (
        distance < 0 === !!backward &&
        distance &&
        min > (distance = Math.abs(distance))
      ) {
        label = p2;
        min = distance;
      }
    }
    return label;
  },
  _callback = function _callback2(animation, type, executeLazyFirst) {
    var v2 = animation.vars,
      callback = v2[type],
      prevContext = _context,
      context3 = animation._ctx,
      params,
      scope,
      result;
    if (!callback) {
      return;
    }
    params = v2[type + "Params"];
    scope = v2.callbackScope || animation;
    executeLazyFirst && _lazyTweens.length && _lazyRender();
    context3 && (_context = context3);
    result = params ? callback.apply(scope, params) : callback.call(scope);
    _context = prevContext;
    return result;
  },
  _interrupt = function _interrupt2(animation) {
    _removeFromParent(animation);
    animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
    animation.progress() < 1 && _callback(animation, "onInterrupt");
    return animation;
  },
  _quickTween,
  _createPlugin = function _createPlugin2(config3) {
    config3 = (!config3.name && config3["default"]) || config3;
    var name = config3.name,
      isFunc = _isFunction(config3),
      Plugin =
        name && !isFunc && config3.init
          ? function () {
              this._props = [];
            }
          : config3,
      instanceDefaults = {
        init: _emptyFunc,
        render: _renderPropTweens,
        add: _addPropTween,
        kill: _killPropTweensOf,
        modifier: _addPluginModifier,
        rawVars: 0,
      },
      statics = {
        targetTest: 0,
        get: 0,
        getSetter: _getSetter,
        aliases: {},
        register: 0,
      };
    _wake();
    if (config3 !== Plugin) {
      if (_plugins[name]) {
        return;
      }
      _setDefaults(
        Plugin,
        _setDefaults(_copyExcluding(config3, instanceDefaults), statics)
      );
      _merge(
        Plugin.prototype,
        _merge(instanceDefaults, _copyExcluding(config3, statics))
      );
      _plugins[(Plugin.prop = name)] = Plugin;
      if (config3.targetTest) {
        _harnessPlugins.push(Plugin);
        _reservedProps[name] = 1;
      }
      name =
        (name === "css"
          ? "CSS"
          : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }
    _addGlobal(name, Plugin);
    config3.register && config3.register(gsap, Plugin, PropTween);
  },
  _255 = 255,
  _colorLookup = {
    aqua: [0, _255, _255],
    lime: [0, _255, 0],
    silver: [192, 192, 192],
    black: [0, 0, 0],
    maroon: [128, 0, 0],
    teal: [0, 128, 128],
    blue: [0, 0, _255],
    navy: [0, 0, 128],
    white: [_255, _255, _255],
    olive: [128, 128, 0],
    yellow: [_255, _255, 0],
    orange: [_255, 165, 0],
    gray: [128, 128, 128],
    purple: [128, 0, 128],
    green: [0, 128, 0],
    red: [_255, 0, 0],
    pink: [_255, 192, 203],
    cyan: [0, _255, _255],
    transparent: [_255, _255, _255, 0],
  },
  _hue = function _hue2(h2, m1, m2) {
    h2 += h2 < 0 ? 1 : h2 > 1 ? -1 : 0;
    return (
      ((h2 * 6 < 1
        ? m1 + (m2 - m1) * h2 * 6
        : h2 < 0.5
          ? m2
          : h2 * 3 < 2
            ? m1 + (m2 - m1) * (2 / 3 - h2) * 6
            : m1) *
        _255 +
        0.5) |
      0
    );
  },
  splitColor = function splitColor2(v2, toHSL, forceAlpha) {
    var a2 = !v2
        ? _colorLookup.black
        : _isNumber(v2)
          ? [v2 >> 16, (v2 >> 8) & _255, v2 & _255]
          : 0,
      r2,
      g2,
      b2,
      h2,
      s2,
      l2,
      max,
      min,
      d2,
      wasHSL;
    if (!a2) {
      if (v2.substr(-1) === ",") {
        v2 = v2.substr(0, v2.length - 1);
      }
      if (_colorLookup[v2]) {
        a2 = _colorLookup[v2];
      } else if (v2.charAt(0) === "#") {
        if (v2.length < 6) {
          r2 = v2.charAt(1);
          g2 = v2.charAt(2);
          b2 = v2.charAt(3);
          v2 =
            "#" +
            r2 +
            r2 +
            g2 +
            g2 +
            b2 +
            b2 +
            (v2.length === 5 ? v2.charAt(4) + v2.charAt(4) : "");
        }
        if (v2.length === 9) {
          a2 = parseInt(v2.substr(1, 6), 16);
          return [
            a2 >> 16,
            (a2 >> 8) & _255,
            a2 & _255,
            parseInt(v2.substr(7), 16) / 255,
          ];
        }
        v2 = parseInt(v2.substr(1), 16);
        a2 = [v2 >> 16, (v2 >> 8) & _255, v2 & _255];
      } else if (v2.substr(0, 3) === "hsl") {
        a2 = wasHSL = v2.match(_strictNumExp);
        if (!toHSL) {
          h2 = (+a2[0] % 360) / 360;
          s2 = +a2[1] / 100;
          l2 = +a2[2] / 100;
          g2 = l2 <= 0.5 ? l2 * (s2 + 1) : l2 + s2 - l2 * s2;
          r2 = l2 * 2 - g2;
          a2.length > 3 && (a2[3] *= 1);
          a2[0] = _hue(h2 + 1 / 3, r2, g2);
          a2[1] = _hue(h2, r2, g2);
          a2[2] = _hue(h2 - 1 / 3, r2, g2);
        } else if (~v2.indexOf("=")) {
          a2 = v2.match(_numExp);
          forceAlpha && a2.length < 4 && (a2[3] = 1);
          return a2;
        }
      } else {
        a2 = v2.match(_strictNumExp) || _colorLookup.transparent;
      }
      a2 = a2.map(Number);
    }
    if (toHSL && !wasHSL) {
      r2 = a2[0] / _255;
      g2 = a2[1] / _255;
      b2 = a2[2] / _255;
      max = Math.max(r2, g2, b2);
      min = Math.min(r2, g2, b2);
      l2 = (max + min) / 2;
      if (max === min) {
        h2 = s2 = 0;
      } else {
        d2 = max - min;
        s2 = l2 > 0.5 ? d2 / (2 - max - min) : d2 / (max + min);
        h2 =
          max === r2
            ? (g2 - b2) / d2 + (g2 < b2 ? 6 : 0)
            : max === g2
              ? (b2 - r2) / d2 + 2
              : (r2 - g2) / d2 + 4;
        h2 *= 60;
      }
      a2[0] = ~~(h2 + 0.5);
      a2[1] = ~~(s2 * 100 + 0.5);
      a2[2] = ~~(l2 * 100 + 0.5);
    }
    forceAlpha && a2.length < 4 && (a2[3] = 1);
    return a2;
  },
  _colorOrderData = function _colorOrderData2(v2) {
    var values = [],
      c2 = [],
      i2 = -1;
    v2.split(_colorExp).forEach(function (v3) {
      var a2 = v3.match(_numWithUnitExp) || [];
      values.push.apply(values, a2);
      c2.push((i2 += a2.length + 1));
    });
    values.c = c2;
    return values;
  },
  _formatColors = function _formatColors2(s2, toHSL, orderMatchData) {
    var result = "",
      colors = (s2 + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i2 = 0,
      c2,
      shell,
      d2,
      l2;
    if (!colors) {
      return s2;
    }
    colors = colors.map(function (color) {
      return (
        (color = splitColor(color, toHSL, 1)) &&
        type +
          (toHSL
            ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3]
            : color.join(",")) +
          ")"
      );
    });
    if (orderMatchData) {
      d2 = _colorOrderData(s2);
      c2 = orderMatchData.c;
      if (c2.join(result) !== d2.c.join(result)) {
        shell = s2.replace(_colorExp, "1").split(_numWithUnitExp);
        l2 = shell.length - 1;
        for (; i2 < l2; i2++) {
          result +=
            shell[i2] +
            (~c2.indexOf(i2)
              ? colors.shift() || type + "0,0,0,0)"
              : (d2.length
                  ? d2
                  : colors.length
                    ? colors
                    : orderMatchData
                ).shift());
        }
      }
    }
    if (!shell) {
      shell = s2.split(_colorExp);
      l2 = shell.length - 1;
      for (; i2 < l2; i2++) {
        result += shell[i2] + colors[i2];
      }
    }
    return result + shell[l2];
  },
  _colorExp = (function () {
    var s2 =
        "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      p2;
    for (p2 in _colorLookup) {
      s2 += "|" + p2 + "\\b";
    }
    return new RegExp(s2 + ")", "gi");
  })(),
  _hslExp = /hsl[a]?\(/,
  _colorStringFilter = function _colorStringFilter2(a2) {
    var combined = a2.join(" "),
      toHSL;
    _colorExp.lastIndex = 0;
    if (_colorExp.test(combined)) {
      toHSL = _hslExp.test(combined);
      a2[1] = _formatColors(a2[1], toHSL);
      a2[0] = _formatColors(a2[0], toHSL, _colorOrderData(a2[1]));
      return true;
    }
  },
  _tickerActive,
  _ticker = (function () {
    var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1e3 / 240,
      _nextTime = _gap,
      _listeners2 = [],
      _id,
      _req,
      _raf,
      _self,
      _delta,
      _i,
      _tick = function _tick2(v2) {
        var elapsed = _getTime() - _lastUpdate,
          manual = v2 === true,
          overlap,
          dispatch,
          time,
          frame;
        elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
        _lastUpdate += elapsed;
        time = _lastUpdate - _startTime;
        overlap = time - _nextTime;
        if (overlap > 0 || manual) {
          frame = ++_self.frame;
          _delta = time - _self.time * 1e3;
          _self.time = time = time / 1e3;
          _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
          dispatch = 1;
        }
        manual || (_id = _req(_tick2));
        if (dispatch) {
          for (_i = 0; _i < _listeners2.length; _i++) {
            _listeners2[_i](time, _delta, frame, v2);
          }
        }
      };
    _self = {
      time: 0,
      frame: 0,
      tick: function tick() {
        _tick(true);
      },
      deltaRatio: function deltaRatio(fps) {
        return _delta / (1e3 / (fps || 60));
      },
      wake: function wake() {
        if (_coreReady) {
          if (!_coreInitted && _windowExists$1()) {
            _win$1 = _coreInitted = window;
            _doc$1 = _win$1.document || {};
            _globals.gsap = gsap;
            (_win$1.gsapVersions || (_win$1.gsapVersions = [])).push(
              gsap.version
            );
            _install(
              _installScope ||
                _win$1.GreenSockGlobals ||
                (!_win$1.gsap && _win$1) ||
                {}
            );
            _raf = _win$1.requestAnimationFrame;
          }
          _id && _self.sleep();
          _req =
            _raf ||
            function (f2) {
              return setTimeout(f2, (_nextTime - _self.time * 1e3 + 1) | 0);
            };
          _tickerActive = 1;
          _tick(2);
        }
      },
      sleep: function sleep() {
        (_raf ? _win$1.cancelAnimationFrame : clearTimeout)(_id);
        _tickerActive = 0;
        _req = _emptyFunc;
      },
      lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
        _lagThreshold = threshold || Infinity;
        _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
      },
      fps: function fps(_fps) {
        _gap = 1e3 / (_fps || 240);
        _nextTime = _self.time * 1e3 + _gap;
      },
      add: function add(callback, once, prioritize) {
        var func = once
          ? function (t2, d2, f2, v2) {
              callback(t2, d2, f2, v2);
              _self.remove(func);
            }
          : callback;
        _self.remove(callback);
        _listeners2[prioritize ? "unshift" : "push"](func);
        _wake();
        return func;
      },
      remove: function remove(callback, i2) {
        ~(i2 = _listeners2.indexOf(callback)) &&
          _listeners2.splice(i2, 1) &&
          _i >= i2 &&
          _i--;
      },
      _listeners: _listeners2,
    };
    return _self;
  })(),
  _wake = function _wake2() {
    return !_tickerActive && _ticker.wake();
  },
  _easeMap = {},
  _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
  _quotesExp = /["']/g,
  _parseObjectInString = function _parseObjectInString2(value) {
    var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i2 = 1,
      l2 = split.length,
      index,
      val,
      parsedVal;
    for (; i2 < l2; i2++) {
      val = split[i2];
      index = i2 !== l2 - 1 ? val.lastIndexOf(",") : val.length;
      parsedVal = val.substr(0, index);
      obj[key] = isNaN(parsedVal)
        ? parsedVal.replace(_quotesExp, "").trim()
        : +parsedVal;
      key = val.substr(index + 1).trim();
    }
    return obj;
  },
  _valueInParentheses = function _valueInParentheses2(value) {
    var open = value.indexOf("(") + 1,
      close = value.indexOf(")"),
      nested = value.indexOf("(", open);
    return value.substring(
      open,
      ~nested && nested < close ? value.indexOf(")", close + 1) : close
    );
  },
  _configEaseFromString = function _configEaseFromString2(name) {
    var split = (name + "").split("("),
      ease = _easeMap[split[0]];
    return ease && split.length > 1 && ease.config
      ? ease.config.apply(
          null,
          ~name.indexOf("{")
            ? [_parseObjectInString(split[1])]
            : _valueInParentheses(name).split(",").map(_numericIfPossible)
        )
      : _easeMap._CE && _customEaseExp.test(name)
        ? _easeMap._CE("", name)
        : ease;
  },
  _invertEase = function _invertEase2(ease) {
    return function (p2) {
      return 1 - ease(1 - p2);
    };
  },
  _propagateYoyoEase = function _propagateYoyoEase2(timeline2, isYoyo) {
    var child = timeline2._first,
      ease;
    while (child) {
      if (child instanceof Timeline) {
        _propagateYoyoEase2(child, isYoyo);
      } else if (
        child.vars.yoyoEase &&
        (!child._yoyo || !child._repeat) &&
        child._yoyo !== isYoyo
      ) {
        if (child.timeline) {
          _propagateYoyoEase2(child.timeline, isYoyo);
        } else {
          ease = child._ease;
          child._ease = child._yEase;
          child._yEase = ease;
          child._yoyo = isYoyo;
        }
      }
      child = child._next;
    }
  },
  _parseEase = function _parseEase2(ease, defaultEase) {
    return !ease
      ? defaultEase
      : (_isFunction(ease)
          ? ease
          : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
  },
  _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
    if (easeOut === void 0) {
      easeOut = function easeOut2(p2) {
        return 1 - easeIn(1 - p2);
      };
    }
    if (easeInOut === void 0) {
      easeInOut = function easeInOut2(p2) {
        return p2 < 0.5 ? easeIn(p2 * 2) / 2 : 1 - easeIn((1 - p2) * 2) / 2;
      };
    }
    var ease = {
        easeIn,
        easeOut,
        easeInOut,
      },
      lowercaseName;
    _forEachName(names, function (name) {
      _easeMap[name] = _globals[name] = ease;
      _easeMap[(lowercaseName = name.toLowerCase())] = easeOut;
      for (var p2 in ease) {
        _easeMap[
          lowercaseName +
            (p2 === "easeIn" ? ".in" : p2 === "easeOut" ? ".out" : ".inOut")
        ] = _easeMap[name + "." + p2] = ease[p2];
      }
    });
    return ease;
  },
  _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
    return function (p2) {
      return p2 < 0.5
        ? (1 - easeOut(1 - p2 * 2)) / 2
        : 0.5 + easeOut((p2 - 0.5) * 2) / 2;
    };
  },
  _configElastic = function _configElastic2(type, amplitude, period) {
    var p1 = amplitude >= 1 ? amplitude : 1,
      p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1),
      p3 = (p2 / _2PI) * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut2(p4) {
        return p4 === 1
          ? 1
          : p1 * Math.pow(2, -10 * p4) * _sin((p4 - p3) * p2) + 1;
      },
      ease =
        type === "out"
          ? easeOut
          : type === "in"
            ? function (p4) {
                return 1 - easeOut(1 - p4);
              }
            : _easeInOutFromOut(easeOut);
    p2 = _2PI / p2;
    ease.config = function (amplitude2, period2) {
      return _configElastic2(type, amplitude2, period2);
    };
    return ease;
  },
  _configBack = function _configBack2(type, overshoot) {
    if (overshoot === void 0) {
      overshoot = 1.70158;
    }
    var easeOut = function easeOut2(p2) {
        return p2 ? --p2 * p2 * ((overshoot + 1) * p2 + overshoot) + 1 : 0;
      },
      ease =
        type === "out"
          ? easeOut
          : type === "in"
            ? function (p2) {
                return 1 - easeOut(1 - p2);
              }
            : _easeInOutFromOut(easeOut);
    ease.config = function (overshoot2) {
      return _configBack2(type, overshoot2);
    };
    return ease;
  };
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i2) {
  var power = i2 < 5 ? i2 + 1 : i2;
  _insertEase(
    name + ",Power" + (power - 1),
    i2
      ? function (p2) {
          return Math.pow(p2, power);
        }
      : function (p2) {
          return p2;
        },
    function (p2) {
      return 1 - Math.pow(1 - p2, power);
    },
    function (p2) {
      return p2 < 0.5
        ? Math.pow(p2 * 2, power) / 2
        : 1 - Math.pow((1 - p2) * 2, power) / 2;
    }
  );
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase(
  "Elastic",
  _configElastic("in"),
  _configElastic("out"),
  _configElastic()
);
(function (n2, c2) {
  var n1 = 1 / c2,
    n22 = 2 * n1,
    n3 = 2.5 * n1,
    easeOut = function easeOut2(p2) {
      return p2 < n1
        ? n2 * p2 * p2
        : p2 < n22
          ? n2 * Math.pow(p2 - 1.5 / c2, 2) + 0.75
          : p2 < n3
            ? n2 * (p2 -= 2.25 / c2) * p2 + 0.9375
            : n2 * Math.pow(p2 - 2.625 / c2, 2) + 0.984375;
    };
  _insertEase(
    "Bounce",
    function (p2) {
      return 1 - easeOut(1 - p2);
    },
    easeOut
  );
})(7.5625, 2.75);
_insertEase("Expo", function (p2) {
  return p2 ? Math.pow(2, 10 * (p2 - 1)) : 0;
});
_insertEase("Circ", function (p2) {
  return -(_sqrt(1 - p2 * p2) - 1);
});
_insertEase("Sine", function (p2) {
  return p2 === 1 ? 1 : -_cos(p2 * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase =
  _easeMap.steps =
  _globals.SteppedEase =
    {
      config: function config(steps, immediateStart) {
        if (steps === void 0) {
          steps = 1;
        }
        var p1 = 1 / steps,
          p2 = steps + (immediateStart ? 0 : 1),
          p3 = immediateStart ? 1 : 0,
          max = 1 - _tinyNum;
        return function (p4) {
          return (((p2 * _clamp(0, max, p4)) | 0) + p3) * p1;
        };
      },
    };
_defaults.ease = _easeMap["quad.out"];
_forEachName(
  "onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
  function (name) {
    return (_callbackNames += name + "," + name + "Params,");
  }
);
var GSCache = function GSCache2(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
var Animation = /* @__PURE__ */ (function () {
  function Animation2(vars) {
    this.vars = vars;
    this._delay = +vars.delay || 0;
    if ((this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0)) {
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }
    this._ts = 1;
    _setDuration(this, +vars.duration, 1, 1);
    this.data = vars.data;
    if (_context) {
      this._ctx = _context;
      _context.data.push(this);
    }
    _tickerActive || _ticker.wake();
  }
  var _proto = Animation2.prototype;
  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent &&
        this.parent.smoothChildTiming &&
        this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }
    return this._delay;
  };
  _proto.duration = function duration(value) {
    return arguments.length
      ? this.totalDuration(
          this._repeat > 0
            ? value + (value + this._rDelay) * this._repeat
            : value
        )
      : this.totalDuration() && this._dur;
  };
  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }
    this._dirty = 0;
    return _setDuration(
      this,
      this._repeat < 0
        ? value
        : (value - this._repeat * this._rDelay) / (this._repeat + 1)
    );
  };
  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();
    if (!arguments.length) {
      return this._tTime;
    }
    var parent = this._dp;
    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);
      !parent._dp || parent.parent || _postAddChecks(parent, this);
      while (parent && parent.parent) {
        if (
          parent.parent._time !==
          parent._start +
            (parent._ts >= 0
              ? parent._tTime / parent._ts
              : (parent.totalDuration() - parent._tTime) / -parent._ts)
        ) {
          parent.totalTime(parent._tTime, true);
        }
        parent = parent.parent;
      }
      if (
        !this.parent &&
        this._dp.autoRemoveChildren &&
        ((this._ts > 0 && _totalTime < this._tDur) ||
          (this._ts < 0 && _totalTime > 0) ||
          (!this._tDur && !_totalTime))
      ) {
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }
    if (
      this._tTime !== _totalTime ||
      (!this._dur && !suppressEvents) ||
      (this._initted && Math.abs(this._zTime) === _tinyNum) ||
      (!_totalTime && !this._initted && (this.add || this._ptLookup))
    ) {
      this._ts || (this._pTime = _totalTime);
      _lazySafeRender(this, _totalTime, suppressEvents);
    }
    return this;
  };
  _proto.time = function time(value, suppressEvents) {
    return arguments.length
      ? this.totalTime(
          Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) %
            (this._dur + this._rDelay) || (value ? this._dur : 0),
          suppressEvents
        )
      : this._time;
  };
  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length
      ? this.totalTime(this.totalDuration() * value, suppressEvents)
      : this.totalDuration()
        ? Math.min(1, this._tTime / this._tDur)
        : this.ratio;
  };
  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length
      ? this.totalTime(
          this.duration() *
            (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) +
            _elapsedCycleDuration(this),
          suppressEvents
        )
      : this.duration()
        ? Math.min(1, this._time / this._dur)
        : this.ratio;
  };
  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;
    return arguments.length
      ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents)
      : this._repeat
        ? _animationCycle(this._tTime, cycleDuration) + 1
        : 1;
  };
  _proto.timeScale = function timeScale(value) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts;
    }
    if (this._rts === value) {
      return this;
    }
    var tTime =
      this.parent && this._ts
        ? _parentToChildTotalTime(this.parent._time, this)
        : this._tTime;
    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
    this.totalTime(_clamp(-this._delay, this._tDur, tTime), true);
    _setEnd(this);
    return _recacheAncestors(this);
  };
  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }
    if (this._ps !== value) {
      this._ps = value;
      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
        this._ts = this._act = 0;
      } else {
        _wake();
        this._ts = this._rts;
        this.totalTime(
          this.parent && !this.parent.smoothChildTiming
            ? this.rawTime()
            : this._tTime || this._pTime,
          this.progress() === 1 &&
            Math.abs(this._zTime) !== _tinyNum &&
            (this._tTime -= _tinyNum)
        );
      }
    }
    return this;
  };
  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent &&
        (parent._sort || !this.parent) &&
        _addToTimeline(parent, this, value - this._delay);
      return this;
    }
    return this._start;
  };
  _proto.endTime = function endTime(includeRepeats) {
    return (
      this._start +
      (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) /
        Math.abs(this._ts || 1)
    );
  };
  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp;
    return !parent
      ? this._tTime
      : wrapRepeats &&
          (!this._ts ||
            (this._repeat && this._time && this.totalProgress() < 1))
        ? this._tTime % (this._dur + this._rDelay)
        : !this._ts
          ? this._tTime
          : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };
  _proto.revert = function revert(config3) {
    if (config3 === void 0) {
      config3 = _revertConfig;
    }
    var prevIsReverting = _reverting$1;
    _reverting$1 = config3;
    if (this._initted || this._startAt) {
      this.timeline && this.timeline.revert(config3);
      this.totalTime(-0.01, config3.suppressEvents);
    }
    this.data !== "nested" && config3.kill !== false && this.kill();
    _reverting$1 = prevIsReverting;
    return this;
  };
  _proto.globalTime = function globalTime(rawTime) {
    var animation = this,
      time = arguments.length ? rawTime : animation.rawTime();
    while (animation) {
      time = animation._start + time / (animation._ts || 1);
      animation = animation._dp;
    }
    return !this.parent && this._sat
      ? this._sat.vars.immediateRender
        ? -1
        : this._sat.globalTime(rawTime)
      : time;
  };
  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }
    return this._repeat === -2 ? Infinity : this._repeat;
  };
  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      var time = this._time;
      this._rDelay = value;
      _onUpdateTotalDuration(this);
      return time ? this.time(time) : this;
    }
    return this._rDelay;
  };
  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }
    return this._yoyo;
  };
  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(
      _parsePosition(this, position),
      _isNotFalse(suppressEvents)
    );
  };
  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(
      includeDelay ? -this._delay : 0,
      _isNotFalse(suppressEvents)
    );
  };
  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };
  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };
  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };
  _proto.resume = function resume() {
    return this.paused(false);
  };
  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() &&
        this.timeScale(-this._rts || (value ? -_tinyNum : 0));
      return this;
    }
    return this._rts < 0;
  };
  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };
  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp,
      start = this._start,
      rawTime;
    return !!(
      !parent ||
      (this._ts &&
        this._initted &&
        parent.isActive() &&
        (rawTime = parent.rawTime(true)) >= start &&
        rawTime < this.endTime(true) - _tinyNum)
    );
  };
  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;
    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }
      return this;
    }
    return vars[type];
  };
  _proto.then = function then(onFulfilled) {
    var self2 = this;
    return new Promise(function (resolve) {
      var f2 = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
        _resolve = function _resolve2() {
          var _then = self2.then;
          self2.then = null;
          _isFunction(f2) &&
            (f2 = f2(self2)) &&
            (f2.then || f2 === self2) &&
            (self2.then = _then);
          resolve(f2);
          self2.then = _then;
        };
      if (
        (self2._initted && self2.totalProgress() === 1 && self2._ts >= 0) ||
        (!self2._tTime && self2._ts < 0)
      ) {
        _resolve();
      } else {
        self2._prom = _resolve;
      }
    });
  };
  _proto.kill = function kill() {
    _interrupt(this);
  };
  return Animation2;
})();
_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1,
});
var Timeline = /* @__PURE__ */ (function (_Animation) {
  _inheritsLoose(Timeline2, _Animation);
  function Timeline2(vars, position) {
    var _this;
    if (vars === void 0) {
      vars = {};
    }
    _this = _Animation.call(this, vars) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _globalTimeline &&
      _addToTimeline(
        vars.parent || _globalTimeline,
        _assertThisInitialized(_this),
        position
      );
    vars.reversed && _this.reverse();
    vars.paused && _this.paused(true);
    vars.scrollTrigger &&
      _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }
  var _proto2 = Timeline2.prototype;
  _proto2.to = function to(targets, vars, position) {
    _createTweenType(0, arguments, this);
    return this;
  };
  _proto2.from = function from(targets, vars, position) {
    _createTweenType(1, arguments, this);
    return this;
  };
  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    _createTweenType(2, arguments, this);
    return this;
  };
  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };
  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(
      this,
      Tween.delayedCall(0, callback, params),
      position
    );
  };
  _proto2.staggerTo = function staggerTo(
    targets,
    duration,
    vars,
    stagger,
    position,
    onCompleteAll,
    onCompleteAllParams
  ) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };
  _proto2.staggerFrom = function staggerFrom(
    targets,
    duration,
    vars,
    stagger,
    position,
    onCompleteAll,
    onCompleteAllParams
  ) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(
      targets,
      duration,
      vars,
      stagger,
      position,
      onCompleteAll,
      onCompleteAllParams
    );
  };
  _proto2.staggerFromTo = function staggerFromTo(
    targets,
    duration,
    fromVars,
    toVars,
    stagger,
    position,
    onCompleteAll,
    onCompleteAllParams
  ) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(
      toVars.immediateRender
    );
    return this.staggerTo(
      targets,
      duration,
      toVars,
      stagger,
      position,
      onCompleteAll,
      onCompleteAllParams
    );
  };
  _proto2.render = function render3(totalTime, suppressEvents, force) {
    var prevTime = this._time,
      tDur = this._dirty ? this.totalDuration() : this._tDur,
      dur = this._dur,
      tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime),
      crossingStart =
        this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
      time,
      child,
      next,
      iteration,
      cycleDuration,
      prevPaused,
      pauseTween,
      timeScale,
      prevStart,
      prevIteration,
      yoyo,
      isYoyo;
    this !== _globalTimeline &&
      tTime > tDur &&
      totalTime >= 0 &&
      (tTime = tDur);
    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }
      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;
      if (crossingStart) {
        dur || (prevTime = this._zTime);
        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }
      if (this._repeat) {
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(
            cycleDuration * 100 + totalTime,
            suppressEvents,
            force
          );
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime &&
          this._tTime &&
          prevIteration !== iteration &&
          (prevIteration = iteration);
        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
            doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : dur;
          this._lock = 1;
          this.render(
            prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)),
            suppressEvents,
            !dur
          )._lock = 0;
          this._tTime = tTime;
          !suppressEvents && this.parent && _callback(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
          if (
            (prevTime && prevTime !== this._time) ||
            prevPaused !== !this._ts ||
            (this.vars.onRepeat && !this.parent && !this._act)
          ) {
            return this;
          }
          dur = this._dur;
          tDur = this._tDur;
          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -1e-4;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }
          this._lock = 0;
          if (!this._ts && !prevPaused) {
            return this;
          }
          _propagateYoyoEase(this, isYoyo);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(
          this,
          _roundPrecise(prevTime),
          _roundPrecise(time)
        );
        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }
      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale;
      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0;
      }
      if (!prevTime && time && !suppressEvents) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      if (time >= prevTime && totalTime >= 0) {
        child = this._first;
        while (child) {
          next = child._next;
          if (
            (child._act || time >= child._start) &&
            child._ts &&
            pauseTween !== child
          ) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(
              child._ts > 0
                ? (time - child._start) * child._ts
                : (child._dirty ? child.totalDuration() : child._tDur) +
                    (time - child._start) * child._ts,
              suppressEvents,
              force
            );
            if (time !== this._time || (!this._ts && !prevPaused)) {
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum);
              break;
            }
          }
          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time;
        while (child) {
          next = child._prev;
          if (
            (child._act || adjustedTime <= child._end) &&
            child._ts &&
            pauseTween !== child
          ) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(
              child._ts > 0
                ? (adjustedTime - child._start) * child._ts
                : (child._dirty ? child.totalDuration() : child._tDur) +
                    (adjustedTime - child._start) * child._ts,
              suppressEvents,
              force || (_reverting$1 && (child._initted || child._startAt))
            );
            if (time !== this._time || (!this._ts && !prevPaused)) {
              pauseTween = 0;
              next &&
                (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
              break;
            }
          }
          child = next;
        }
      }
      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime =
          time >= prevTime ? 1 : -1;
        if (this._ts) {
          this._start = prevStart;
          _setEnd(this);
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (
        (tTime === tDur && this._tTime >= this.totalDuration()) ||
        (!tTime && prevTime)
      ) {
        if (
          prevStart === this._start ||
          Math.abs(timeScale) !== Math.abs(this._ts)
        ) {
          if (!this._lock) {
            (totalTime || !dur) &&
              ((tTime === tDur && this._ts > 0) || (!tTime && this._ts < 0)) &&
              _removeFromParent(this, 1);
            if (
              !suppressEvents &&
              !(totalTime < 0 && !prevTime) &&
              (tTime || prevTime || !tDur)
            ) {
              _callback(
                this,
                tTime === tDur && totalTime >= 0
                  ? "onComplete"
                  : "onReverseComplete",
                true
              );
              this._prom &&
                !(tTime < tDur && this.timeScale() > 0) &&
                this._prom();
            }
          }
        }
      }
    }
    return this;
  };
  _proto2.add = function add(child, position) {
    var _this2 = this;
    _isNumber(position) || (position = _parsePosition(this, position, child));
    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return this;
      }
      if (_isString(child)) {
        return this.addLabel(child, position);
      }
      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }
    return this !== child ? _addToTimeline(this, child, position) : this;
  };
  _proto2.getChildren = function getChildren(
    nested,
    tweens,
    timelines,
    ignoreBeforeTime
  ) {
    if (nested === void 0) {
      nested = true;
    }
    if (tweens === void 0) {
      tweens = true;
    }
    if (timelines === void 0) {
      timelines = true;
    }
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum$1;
    }
    var a2 = [],
      child = this._first;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a2.push(child);
        } else {
          timelines && a2.push(child);
          nested &&
            a2.push.apply(a2, child.getChildren(true, tweens, timelines));
        }
      }
      child = child._next;
    }
    return a2;
  };
  _proto2.getById = function getById2(id) {
    var animations = this.getChildren(1, 1, 1),
      i2 = animations.length;
    while (i2--) {
      if (animations[i2].vars.id === id) {
        return animations[i2];
      }
    }
  };
  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }
    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }
    _removeLinkedListItem(this, child);
    if (child === this._recent) {
      this._recent = this._last;
    }
    return _uncache(this);
  };
  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }
    this._forcing = 1;
    if (!this._dp && this._ts) {
      this._start = _roundPrecise(
        _ticker.time -
          (this._ts > 0
            ? _totalTime2 / this._ts
            : (this.totalDuration() - _totalTime2) / -this._ts)
      );
    }
    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
    this._forcing = 0;
    return this;
  };
  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };
  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };
  _proto2.addPause = function addPause(position, callback, params) {
    var t2 = Tween.delayedCall(0, callback || _emptyFunc, params);
    t2.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t2, _parsePosition(this, position));
  };
  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);
    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }
      child = child._next;
    }
  };
  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
      i2 = tweens.length;
    while (i2--) {
      _overwritingTween !== tweens[i2] && tweens[i2].kill(targets, props);
    }
    return this;
  };
  _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
    var a2 = [],
      parsedTargets = toArray(targets),
      child = this._first,
      isGlobalTime = _isNumber(onlyActive),
      children;
    while (child) {
      if (child instanceof Tween) {
        if (
          _arrayContainsAny(child._targets, parsedTargets) &&
          (isGlobalTime
            ? (!_overwritingTween || (child._initted && child._ts)) &&
              child.globalTime(0) <= onlyActive &&
              child.globalTime(child.totalDuration()) > onlyActive
            : !onlyActive || child.isActive())
        ) {
          a2.push(child);
        }
      } else if (
        (children = child.getTweensOf(parsedTargets, onlyActive)).length
      ) {
        a2.push.apply(a2, children);
      }
      child = child._next;
    }
    return a2;
  };
  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};
    var tl = this,
      endTime = _parsePosition(tl, position),
      _vars = vars,
      startAt = _vars.startAt,
      _onStart = _vars.onStart,
      onStartParams = _vars.onStartParams,
      immediateRender = _vars.immediateRender,
      initted,
      tween = Tween.to(
        tl,
        _setDefaults(
          {
            ease: vars.ease || "none",
            lazy: false,
            immediateRender: false,
            time: endTime,
            overwrite: "auto",
            duration:
              vars.duration ||
              Math.abs(
                (endTime -
                  (startAt && "time" in startAt ? startAt.time : tl._time)) /
                  tl.timeScale()
              ) ||
              _tinyNum,
            onStart: function onStart() {
              tl.pause();
              if (!initted) {
                var duration =
                  vars.duration ||
                  Math.abs(
                    (endTime -
                      (startAt && "time" in startAt
                        ? startAt.time
                        : tl._time)) /
                      tl.timeScale()
                  );
                tween._dur !== duration &&
                  _setDuration(tween, duration, 0, 1).render(
                    tween._time,
                    true,
                    true
                  );
                initted = 1;
              }
              _onStart && _onStart.apply(tween, onStartParams || []);
            },
          },
          vars
        )
      );
    return immediateRender ? tween.render(0) : tween;
  };
  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(
      toPosition,
      _setDefaults(
        {
          startAt: {
            time: _parsePosition(this, fromPosition),
          },
        },
        vars
      )
    );
  };
  _proto2.recent = function recent() {
    return this._recent;
  };
  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };
  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };
  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length
      ? this.seek(value, true)
      : this.previousLabel(this._time + _tinyNum);
  };
  _proto2.shiftChildren = function shiftChildren(
    amount,
    adjustLabels,
    ignoreBeforeTime
  ) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }
    var child = this._first,
      labels = this.labels,
      p2;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }
      child = child._next;
    }
    if (adjustLabels) {
      for (p2 in labels) {
        if (labels[p2] >= ignoreBeforeTime) {
          labels[p2] += amount;
        }
      }
    }
    return _uncache(this);
  };
  _proto2.invalidate = function invalidate(soft) {
    var child = this._first;
    this._lock = 0;
    while (child) {
      child.invalidate(soft);
      child = child._next;
    }
    return _Animation.prototype.invalidate.call(this, soft);
  };
  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }
    var child = this._first,
      next;
    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }
    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };
  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
      self2 = this,
      child = self2._last,
      prevStart = _bigNum$1,
      prev,
      start,
      parent;
    if (arguments.length) {
      return self2.timeScale(
        (self2._repeat < 0 ? self2.duration() : self2.totalDuration()) /
          (self2.reversed() ? -value : value)
      );
    }
    if (self2._dirty) {
      parent = self2.parent;
      while (child) {
        prev = child._prev;
        child._dirty && child.totalDuration();
        start = child._start;
        if (start > prevStart && self2._sort && child._ts && !self2._lock) {
          self2._lock = 1;
          _addToTimeline(self2, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }
        if (start < 0 && child._ts) {
          max -= start;
          if ((!parent && !self2._dp) || (parent && parent.smoothChildTiming)) {
            self2._start += start / self2._ts;
            self2._time -= start;
            self2._tTime -= start;
          }
          self2.shiftChildren(-start, false, -Infinity);
          prevStart = 0;
        }
        child._end > max && child._ts && (max = child._end);
        child = prev;
      }
      _setDuration(
        self2,
        self2 === _globalTimeline && self2._time > max ? self2._time : max,
        1,
        1
      );
      self2._dirty = 0;
    }
    return self2._tDur;
  };
  Timeline2.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(
        _globalTimeline,
        _parentToChildTotalTime(time, _globalTimeline)
      );
      _lastRenderedFrame = _ticker.frame;
    }
    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) {
        if (_config.autoSleep && _ticker._listeners.length < 2) {
          while (child && !child._ts) {
            child = child._next;
          }
          child || _ticker.sleep();
        }
      }
    }
  };
  return Timeline2;
})(Animation);
_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0,
});
var _addComplexStringPropTween = function _addComplexStringPropTween2(
    target,
    prop,
    start,
    end,
    setter,
    stringFilter,
    funcParam
  ) {
    var pt2 = new PropTween(
        this._pt,
        target,
        prop,
        0,
        1,
        _renderComplexString,
        null,
        setter
      ),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a2;
    pt2.b = start;
    pt2.e = end;
    start += "";
    end += "";
    if ((hasRandom = ~end.indexOf("random("))) {
      end = _replaceRandom(end);
    }
    if (stringFilter) {
      a2 = [start, end];
      stringFilter(a2, target, prop);
      start = a2[0];
      end = a2[1];
    }
    startNums = start.match(_complexStringNumExp) || [];
    while ((result = _complexStringNumExp.exec(end))) {
      endNum = result[0];
      chunk = end.substring(index, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(") {
        color = 1;
      }
      if (endNum !== startNums[matchIndex++]) {
        startNum = parseFloat(startNums[matchIndex - 1]) || 0;
        pt2._pt = {
          _next: pt2._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c:
            endNum.charAt(1) === "="
              ? _parseRelative(startNum, endNum) - startNum
              : parseFloat(endNum) - startNum,
          m: color && color < 4 ? Math.round : 0,
        };
        index = _complexStringNumExp.lastIndex;
      }
    }
    pt2.c = index < end.length ? end.substring(index, end.length) : "";
    pt2.fp = funcParam;
    if (_relExp.test(end) || hasRandom) {
      pt2.e = 0;
    }
    this._pt = pt2;
    return pt2;
  },
  _addPropTween = function _addPropTween2(
    target,
    prop,
    start,
    end,
    index,
    targets,
    modifier,
    stringFilter,
    funcParam,
    optional
  ) {
    _isFunction(end) && (end = end(index || 0, target, targets));
    var currentValue = target[prop],
      parsedStart =
        start !== "get"
          ? start
          : !_isFunction(currentValue)
            ? currentValue
            : funcParam
              ? target[
                  prop.indexOf("set") ||
                  !_isFunction(target["get" + prop.substr(3)])
                    ? prop
                    : "get" + prop.substr(3)
                ](funcParam)
              : target[prop](),
      setter = !_isFunction(currentValue)
        ? _setterPlain
        : funcParam
          ? _setterFuncWithParam
          : _setterFunc,
      pt2;
    if (_isString(end)) {
      if (~end.indexOf("random(")) {
        end = _replaceRandom(end);
      }
      if (end.charAt(1) === "=") {
        pt2 = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
        if (pt2 || pt2 === 0) {
          end = pt2;
        }
      }
    }
    if (!optional || parsedStart !== end || _forceAllPropTweens) {
      if (!isNaN(parsedStart * end) && end !== "") {
        pt2 = new PropTween(
          this._pt,
          target,
          prop,
          +parsedStart || 0,
          end - (parsedStart || 0),
          typeof currentValue === "boolean" ? _renderBoolean : _renderPlain,
          0,
          setter
        );
        funcParam && (pt2.fp = funcParam);
        modifier && pt2.modifier(modifier, this, target);
        return (this._pt = pt2);
      }
      !currentValue && !(prop in target) && _missingPlugin(prop, end);
      return _addComplexStringPropTween.call(
        this,
        target,
        prop,
        parsedStart,
        end,
        setter,
        stringFilter || _config.stringFilter,
        funcParam
      );
    }
  },
  _processVars = function _processVars2(vars, index, target, targets, tween) {
    _isFunction(vars) &&
      (vars = _parseFuncOrString(vars, tween, index, target, targets));
    if (
      !_isObject(vars) ||
      (vars.style && vars.nodeType) ||
      _isArray(vars) ||
      _isTypedArray(vars)
    ) {
      return _isString(vars)
        ? _parseFuncOrString(vars, tween, index, target, targets)
        : vars;
    }
    var copy = {},
      p2;
    for (p2 in vars) {
      copy[p2] = _parseFuncOrString(vars[p2], tween, index, target, targets);
    }
    return copy;
  },
  _checkPlugin = function _checkPlugin2(
    property,
    vars,
    tween,
    index,
    target,
    targets
  ) {
    var plugin, pt2, ptLookup, i2;
    if (
      _plugins[property] &&
      (plugin = new _plugins[property]()).init(
        target,
        plugin.rawVars
          ? vars[property]
          : _processVars(vars[property], index, target, targets, tween),
        tween,
        index,
        targets
      ) !== false
    ) {
      tween._pt = pt2 = new PropTween(
        tween._pt,
        target,
        property,
        0,
        1,
        plugin.render,
        plugin,
        0,
        plugin.priority
      );
      if (tween !== _quickTween) {
        ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
        i2 = plugin._props.length;
        while (i2--) {
          ptLookup[plugin._props[i2]] = pt2;
        }
      }
    }
    return plugin;
  },
  _overwritingTween,
  _forceAllPropTweens,
  _initTween = function _initTween2(tween, time, tTime) {
    var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      onUpdateParams = vars.onUpdateParams,
      callbackScope = vars.callbackScope,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets =
        parent && parent.data === "nested" ? parent.vars.targets : targets,
      autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites,
      tl = tween.timeline,
      cleanVars,
      i2,
      p2,
      pt2,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars,
      overwritten;
    tl && (!keyframes || !ease) && (ease = "none");
    tween._ease = _parseEase(ease, _defaults.ease);
    tween._yEase = yoyoEase
      ? _invertEase(
          _parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)
        )
      : 0;
    if (yoyoEase && tween._yoyo && !tween._repeat) {
      yoyoEase = tween._yEase;
      tween._yEase = tween._ease;
      tween._ease = yoyoEase;
    }
    tween._from = !tl && !!vars.runBackwards;
    if (!tl || (keyframes && !vars.stagger)) {
      harness = targets[0] ? _getCache(targets[0]).harness : 0;
      harnessVars = harness && vars[harness.prop];
      cleanVars = _copyExcluding(vars, _reservedProps);
      if (prevStartAt) {
        prevStartAt._zTime < 0 && prevStartAt.progress(1);
        time < 0 && runBackwards && immediateRender && !autoRevert
          ? prevStartAt.render(-1, true)
          : prevStartAt.revert(
              runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig
            );
        prevStartAt._lazy = 0;
      }
      if (startAt) {
        _removeFromParent(
          (tween._startAt = Tween.set(
            targets,
            _setDefaults(
              {
                data: "isStart",
                overwrite: false,
                parent,
                immediateRender: true,
                lazy: !prevStartAt && _isNotFalse(lazy),
                startAt: null,
                delay: 0,
                onUpdate,
                onUpdateParams,
                callbackScope,
                stagger: 0,
              },
              startAt
            )
          ))
        );
        tween._startAt._dp = 0;
        tween._startAt._sat = tween;
        time < 0 &&
          (_reverting$1 || (!immediateRender && !autoRevert)) &&
          tween._startAt.revert(_revertConfigNoKill);
        if (immediateRender) {
          if (dur && time <= 0 && tTime <= 0) {
            time && (tween._zTime = time);
            return;
          }
        }
      } else if (runBackwards && dur) {
        if (!prevStartAt) {
          time && (immediateRender = false);
          p2 = _setDefaults(
            {
              overwrite: false,
              data: "isFromStart",
              //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
              lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
              immediateRender,
              //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
              stagger: 0,
              parent,
              //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})
            },
            cleanVars
          );
          harnessVars && (p2[harness.prop] = harnessVars);
          _removeFromParent((tween._startAt = Tween.set(targets, p2)));
          tween._startAt._dp = 0;
          tween._startAt._sat = tween;
          time < 0 &&
            (_reverting$1
              ? tween._startAt.revert(_revertConfigNoKill)
              : tween._startAt.render(-1, true));
          tween._zTime = time;
          if (!immediateRender) {
            _initTween2(tween._startAt, _tinyNum, _tinyNum);
          } else if (!time) {
            return;
          }
        }
      }
      tween._pt = tween._ptCache = 0;
      lazy = (dur && _isNotFalse(lazy)) || (lazy && !dur);
      for (i2 = 0; i2 < targets.length; i2++) {
        target = targets[i2];
        gsData = target._gsap || _harness(targets)[i2]._gsap;
        tween._ptLookup[i2] = ptLookup = {};
        _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
        index = fullTargets === targets ? i2 : fullTargets.indexOf(target);
        if (
          harness &&
          (plugin = new harness()).init(
            target,
            harnessVars || cleanVars,
            tween,
            index,
            fullTargets
          ) !== false
        ) {
          tween._pt = pt2 = new PropTween(
            tween._pt,
            target,
            plugin.name,
            0,
            1,
            plugin.render,
            plugin,
            0,
            plugin.priority
          );
          plugin._props.forEach(function (name) {
            ptLookup[name] = pt2;
          });
          plugin.priority && (hasPriority = 1);
        }
        if (!harness || harnessVars) {
          for (p2 in cleanVars) {
            if (
              _plugins[p2] &&
              (plugin = _checkPlugin(
                p2,
                cleanVars,
                tween,
                index,
                target,
                fullTargets
              ))
            ) {
              plugin.priority && (hasPriority = 1);
            } else {
              ptLookup[p2] = pt2 = _addPropTween.call(
                tween,
                target,
                p2,
                "get",
                cleanVars[p2],
                index,
                fullTargets,
                0,
                vars.stringFilter
              );
            }
          }
        }
        tween._op && tween._op[i2] && tween.kill(target, tween._op[i2]);
        if (autoOverwrite && tween._pt) {
          _overwritingTween = tween;
          _globalTimeline.killTweensOf(
            target,
            ptLookup,
            tween.globalTime(time)
          );
          overwritten = !tween.parent;
          _overwritingTween = 0;
        }
        tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
      }
      hasPriority && _sortPropTweensByPriority(tween);
      tween._onInit && tween._onInit(tween);
    }
    tween._onUpdate = onUpdate;
    tween._initted = (!tween._op || tween._pt) && !overwritten;
    keyframes && time <= 0 && tl.render(_bigNum$1, true, true);
  },
  _updatePropTweens = function _updatePropTweens2(
    tween,
    property,
    value,
    start,
    startIsRelative,
    ratio,
    time
  ) {
    var ptCache = ((tween._pt && tween._ptCache) || (tween._ptCache = {}))[
        property
      ],
      pt2,
      rootPT,
      lookup,
      i2;
    if (!ptCache) {
      ptCache = tween._ptCache[property] = [];
      lookup = tween._ptLookup;
      i2 = tween._targets.length;
      while (i2--) {
        pt2 = lookup[i2][property];
        if (pt2 && pt2.d && pt2.d._pt) {
          pt2 = pt2.d._pt;
          while (pt2 && pt2.p !== property && pt2.fp !== property) {
            pt2 = pt2._next;
          }
        }
        if (!pt2) {
          _forceAllPropTweens = 1;
          tween.vars[property] = "+=0";
          _initTween(tween, time);
          _forceAllPropTweens = 0;
          return 1;
        }
        ptCache.push(pt2);
      }
    }
    i2 = ptCache.length;
    while (i2--) {
      rootPT = ptCache[i2];
      pt2 = rootPT._pt || rootPT;
      pt2.s =
        (start || start === 0) && !startIsRelative
          ? start
          : pt2.s + (start || 0) + ratio * pt2.c;
      pt2.c = value - pt2.s;
      rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
      rootPT.b && (rootPT.b = pt2.s + getUnit(rootPT.b));
    }
  },
  _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
    var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p2,
      i2,
      aliases;
    if (!propertyAliases) {
      return vars;
    }
    copy = _merge({}, vars);
    for (p2 in propertyAliases) {
      if (p2 in copy) {
        aliases = propertyAliases[p2].split(",");
        i2 = aliases.length;
        while (i2--) {
          copy[aliases[i2]] = copy[p2];
        }
      }
    }
    return copy;
  },
  _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
    var ease = obj.ease || easeEach || "power1.inOut",
      p2,
      a2;
    if (_isArray(obj)) {
      a2 = allProps[prop] || (allProps[prop] = []);
      obj.forEach(function (value, i2) {
        return a2.push({
          t: (i2 / (obj.length - 1)) * 100,
          v: value,
          e: ease,
        });
      });
    } else {
      for (p2 in obj) {
        a2 = allProps[p2] || (allProps[p2] = []);
        p2 === "ease" ||
          a2.push({
            t: parseFloat(prop),
            v: obj[p2],
            e: ease,
          });
      }
    }
  },
  _parseFuncOrString = function _parseFuncOrString2(
    value,
    tween,
    i2,
    target,
    targets
  ) {
    return _isFunction(value)
      ? value.call(tween, i2, target, targets)
      : _isString(value) && ~value.indexOf("random(")
        ? _replaceRandom(value)
        : value;
  },
  _staggerTweenProps =
    _callbackNames +
    "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
  _staggerPropsToSkip = {};
_forEachName(
  _staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger",
  function (name) {
    return (_staggerPropsToSkip[name] = 1);
  }
);
var Tween = /* @__PURE__ */ (function (_Animation2) {
  _inheritsLoose(Tween2, _Animation2);
  function Tween2(targets, vars, position, skipInherit) {
    var _this3;
    if (typeof vars === "number") {
      position.duration = vars;
      vars = position;
      position = null;
    }
    _this3 =
      _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) ||
      this;
    var _this3$vars = _this3.vars,
      duration = _this3$vars.duration,
      delay = _this3$vars.delay,
      immediateRender = _this3$vars.immediateRender,
      stagger = _this3$vars.stagger,
      overwrite = _this3$vars.overwrite,
      keyframes = _this3$vars.keyframes,
      defaults3 = _this3$vars.defaults,
      scrollTrigger = _this3$vars.scrollTrigger,
      yoyoEase = _this3$vars.yoyoEase,
      parent = vars.parent || _globalTimeline,
      parsedTargets = (
        _isArray(targets) || _isTypedArray(targets)
          ? _isNumber(targets[0])
          : "length" in vars
      )
        ? [targets]
        : toArray(targets),
      tl,
      i2,
      copy,
      l2,
      p2,
      curTarget,
      staggerFunc,
      staggerVarsToMerge;
    _this3._targets = parsedTargets.length
      ? _harness(parsedTargets)
      : _warn(
          "GSAP target " + targets + " not found. https://greensock.com",
          !_config.nullTargetWarn
        ) || [];
    _this3._ptLookup = [];
    _this3._overwrite = overwrite;
    if (
      keyframes ||
      stagger ||
      _isFuncOrString(duration) ||
      _isFuncOrString(delay)
    ) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults3 || {},
        targets:
          parent && parent.data === "nested"
            ? parent.vars.targets
            : parsedTargets,
      });
      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;
      if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        l2 = parsedTargets.length;
        staggerFunc = stagger && distribute(stagger);
        if (_isObject(stagger)) {
          for (p2 in stagger) {
            if (~_staggerTweenProps.indexOf(p2)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p2] = stagger[p2];
            }
          }
        }
        for (i2 = 0; i2 < l2; i2++) {
          copy = _copyExcluding(vars, _staggerPropsToSkip);
          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i2];
          copy.duration = +_parseFuncOrString(
            duration,
            _assertThisInitialized(_this3),
            i2,
            curTarget,
            parsedTargets
          );
          copy.delay =
            (+_parseFuncOrString(
              delay,
              _assertThisInitialized(_this3),
              i2,
              curTarget,
              parsedTargets
            ) || 0) - _this3._delay;
          if (!stagger && l2 === 1 && copy.delay) {
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }
          tl.to(
            curTarget,
            copy,
            staggerFunc ? staggerFunc(i2, curTarget, parsedTargets) : 0
          );
          tl._ease = _easeMap.none;
        }
        tl.duration() ? (duration = delay = 0) : (_this3.timeline = 0);
      } else if (keyframes) {
        _inheritDefaults(
          _setDefaults(tl.vars.defaults, {
            ease: "none",
          })
        );
        tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
        var time = 0,
          a2,
          kf,
          v2;
        if (_isArray(keyframes)) {
          keyframes.forEach(function (frame) {
            return tl.to(parsedTargets, frame, ">");
          });
          tl.duration();
        } else {
          copy = {};
          for (p2 in keyframes) {
            p2 === "ease" ||
              p2 === "easeEach" ||
              _parseKeyframe(p2, keyframes[p2], copy, keyframes.easeEach);
          }
          for (p2 in copy) {
            a2 = copy[p2].sort(function (a3, b2) {
              return a3.t - b2.t;
            });
            time = 0;
            for (i2 = 0; i2 < a2.length; i2++) {
              kf = a2[i2];
              v2 = {
                ease: kf.e,
                duration: ((kf.t - (i2 ? a2[i2 - 1].t : 0)) / 100) * duration,
              };
              v2[p2] = kf.v;
              tl.to(parsedTargets, v2, time);
              time += v2.duration;
            }
          }
          tl.duration() < duration &&
            tl.to(
              {},
              {
                duration: duration - tl.duration(),
              }
            );
        }
      }
      duration || _this3.duration((duration = tl.duration()));
    } else {
      _this3.timeline = 0;
    }
    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);
      _globalTimeline.killTweensOf(parsedTargets);
      _overwritingTween = 0;
    }
    _addToTimeline(parent, _assertThisInitialized(_this3), position);
    vars.reversed && _this3.reverse();
    vars.paused && _this3.paused(true);
    if (
      immediateRender ||
      (!duration &&
        !keyframes &&
        _this3._start === _roundPrecise(parent._time) &&
        _isNotFalse(immediateRender) &&
        _hasNoPausedAncestors(_assertThisInitialized(_this3)) &&
        parent.data !== "nested")
    ) {
      _this3._tTime = -_tinyNum;
      _this3.render(Math.max(0, -delay) || 0);
    }
    scrollTrigger &&
      _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }
  var _proto3 = Tween2.prototype;
  _proto3.render = function render3(totalTime, suppressEvents, force) {
    var prevTime = this._time,
      tDur = this._tDur,
      dur = this._dur,
      isNegative = totalTime < 0,
      tTime =
        totalTime > tDur - _tinyNum && !isNegative
          ? tDur
          : totalTime < _tinyNum
            ? 0
            : totalTime,
      time,
      pt2,
      iteration,
      cycleDuration,
      prevIteration,
      isYoyo,
      ratio,
      timeline2,
      yoyoEase;
    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (
      tTime !== this._tTime ||
      !totalTime ||
      force ||
      (!this._initted && this._tTime) ||
      (this._startAt && this._zTime < 0 !== isNegative)
    ) {
      time = tTime;
      timeline2 = this.timeline;
      if (this._repeat) {
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && isNegative) {
          return this.totalTime(
            cycleDuration * 100 + totalTime,
            suppressEvents,
            force
          );
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        isYoyo = this._yoyo && iteration & 1;
        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        if (time === prevTime && !force && this._initted) {
          this._tTime = tTime;
          return this;
        }
        if (iteration !== prevIteration) {
          timeline2 && this._yEase && _propagateYoyoEase(timeline2, isYoyo);
          if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
            this._lock = force = 1;
            this.render(
              _roundPrecise(cycleDuration * iteration),
              true
            ).invalidate()._lock = 0;
          }
        }
      }
      if (!this._initted) {
        if (
          _attemptInitTween(
            this,
            isNegative ? totalTime : time,
            force,
            suppressEvents,
            tTime
          )
        ) {
          this._tTime = 0;
          return this;
        }
        if (prevTime !== this._time) {
          return this;
        }
        if (dur !== this._dur) {
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._tTime = tTime;
      this._time = time;
      if (!this._act && this._ts) {
        this._act = 1;
        this._lazy = 0;
      }
      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }
      if (time && !prevTime && !suppressEvents) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      pt2 = this._pt;
      while (pt2) {
        pt2.r(ratio, pt2.d);
        pt2 = pt2._next;
      }
      (timeline2 &&
        timeline2.render(
          totalTime < 0
            ? totalTime
            : !time && isYoyo
              ? -_tinyNum
              : timeline2._dur * timeline2._ease(time / this._dur),
          suppressEvents,
          force
        )) ||
        (this._startAt && (this._zTime = totalTime));
      if (this._onUpdate && !suppressEvents) {
        isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
        _callback(this, "onUpdate");
      }
      this._repeat &&
        iteration !== prevIteration &&
        this.vars.onRepeat &&
        !suppressEvents &&
        this.parent &&
        _callback(this, "onRepeat");
      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        isNegative &&
          !this._onUpdate &&
          _rewindStartAt(this, totalTime, true, true);
        (totalTime || !dur) &&
          ((tTime === this._tDur && this._ts > 0) ||
            (!tTime && this._ts < 0)) &&
          _removeFromParent(this, 1);
        if (
          !suppressEvents &&
          !(isNegative && !prevTime) &&
          (tTime || prevTime || isYoyo)
        ) {
          _callback(
            this,
            tTime === tDur ? "onComplete" : "onReverseComplete",
            true
          );
          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }
    return this;
  };
  _proto3.targets = function targets() {
    return this._targets;
  };
  _proto3.invalidate = function invalidate(soft) {
    (!soft || !this.vars.runBackwards) && (this._startAt = 0);
    this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate(soft);
    return _Animation2.prototype.invalidate.call(this, soft);
  };
  _proto3.resetTo = function resetTo(property, value, start, startIsRelative) {
    _tickerActive || _ticker.wake();
    this._ts || this.play();
    var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts),
      ratio;
    this._initted || _initTween(this, time);
    ratio = this._ease(time / this._dur);
    if (
      _updatePropTweens(
        this,
        property,
        value,
        start,
        startIsRelative,
        ratio,
        time
      )
    ) {
      return this.resetTo(property, value, start, startIsRelative);
    }
    _alignPlayhead(this, 0);
    this.parent ||
      _addLinkedListItem(
        this._dp,
        this,
        "_first",
        "_last",
        this._dp._sort ? "_start" : 0
      );
    return this.render(0);
  };
  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }
    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      return this.parent ? _interrupt(this) : this;
    }
    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(
        targets,
        vars,
        _overwritingTween && _overwritingTween.vars.overwrite !== true
      )._first || _interrupt(this);
      this.parent &&
        tDur !== this.timeline.totalDuration() &&
        _setDuration(this, (this._dur * this.timeline._tDur) / tDur, 0, 1);
      return this;
    }
    var parsedTargets = this._targets,
      killingTargets = targets ? toArray(targets) : parsedTargets,
      propTweenLookup = this._ptLookup,
      firstPT = this._pt,
      overwrittenProps,
      curLookup,
      curOverwriteProps,
      props,
      p2,
      pt2,
      i2;
    if (
      (!vars || vars === "all") &&
      _arraysMatch(parsedTargets, killingTargets)
    ) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }
    overwrittenProps = this._op = this._op || [];
    if (vars !== "all") {
      if (_isString(vars)) {
        p2 = {};
        _forEachName(vars, function (name) {
          return (p2[name] = 1);
        });
        vars = p2;
      }
      vars = _addAliasesToVars(parsedTargets, vars);
    }
    i2 = parsedTargets.length;
    while (i2--) {
      if (~killingTargets.indexOf(parsedTargets[i2])) {
        curLookup = propTweenLookup[i2];
        if (vars === "all") {
          overwrittenProps[i2] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i2] = overwrittenProps[i2] || {};
          props = vars;
        }
        for (p2 in props) {
          pt2 = curLookup && curLookup[p2];
          if (pt2) {
            if (!("kill" in pt2.d) || pt2.d.kill(p2) === true) {
              _removeLinkedListItem(this, pt2, "_pt");
            }
            delete curLookup[p2];
          }
          if (curOverwriteProps !== "all") {
            curOverwriteProps[p2] = 1;
          }
        }
      }
    }
    this._initted && !this._pt && firstPT && _interrupt(this);
    return this;
  };
  Tween2.to = function to(targets, vars) {
    return new Tween2(targets, vars, arguments[2]);
  };
  Tween2.from = function from(targets, vars) {
    return _createTweenType(1, arguments);
  };
  Tween2.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween2(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope,
    });
  };
  Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
    return _createTweenType(2, arguments);
  };
  Tween2.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween2(targets, vars);
  };
  Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };
  return Tween2;
})(Animation);
_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0,
});
_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
      params = _slice.call(arguments, 0);
    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
var _setterPlain = function _setterPlain2(target, property, value) {
    return (target[property] = value);
  },
  _setterFunc = function _setterFunc2(target, property, value) {
    return target[property](value);
  },
  _setterFuncWithParam = function _setterFuncWithParam2(
    target,
    property,
    value,
    data
  ) {
    return target[property](data.fp, value);
  },
  _setterAttribute = function _setterAttribute2(target, property, value) {
    return target.setAttribute(property, value);
  },
  _getSetter = function _getSetter2(target, property) {
    return _isFunction(target[property])
      ? _setterFunc
      : _isUndefined(target[property]) && target.setAttribute
        ? _setterAttribute
        : _setterPlain;
  },
  _renderPlain = function _renderPlain2(ratio, data) {
    return data.set(
      data.t,
      data.p,
      Math.round((data.s + data.c * ratio) * 1e6) / 1e6,
      data
    );
  },
  _renderBoolean = function _renderBoolean2(ratio, data) {
    return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
  },
  _renderComplexString = function _renderComplexString2(ratio, data) {
    var pt2 = data._pt,
      s2 = "";
    if (!ratio && data.b) {
      s2 = data.b;
    } else if (ratio === 1 && data.e) {
      s2 = data.e;
    } else {
      while (pt2) {
        s2 =
          pt2.p +
          (pt2.m
            ? pt2.m(pt2.s + pt2.c * ratio)
            : Math.round((pt2.s + pt2.c * ratio) * 1e4) / 1e4) +
          s2;
        pt2 = pt2._next;
      }
      s2 += data.c;
    }
    data.set(data.t, data.p, s2, data);
  },
  _renderPropTweens = function _renderPropTweens2(ratio, data) {
    var pt2 = data._pt;
    while (pt2) {
      pt2.r(ratio, pt2.d);
      pt2 = pt2._next;
    }
  },
  _addPluginModifier = function _addPluginModifier2(
    modifier,
    tween,
    target,
    property
  ) {
    var pt2 = this._pt,
      next;
    while (pt2) {
      next = pt2._next;
      pt2.p === property && pt2.modifier(modifier, tween, target);
      pt2 = next;
    }
  },
  _killPropTweensOf = function _killPropTweensOf2(property) {
    var pt2 = this._pt,
      hasNonDependentRemaining,
      next;
    while (pt2) {
      next = pt2._next;
      if ((pt2.p === property && !pt2.op) || pt2.op === property) {
        _removeLinkedListItem(this, pt2, "_pt");
      } else if (!pt2.dep) {
        hasNonDependentRemaining = 1;
      }
      pt2 = next;
    }
    return !hasNonDependentRemaining;
  },
  _setterWithModifier = function _setterWithModifier2(
    target,
    property,
    value,
    data
  ) {
    data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
  },
  _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
    var pt2 = parent._pt,
      next,
      pt22,
      first,
      last;
    while (pt2) {
      next = pt2._next;
      pt22 = first;
      while (pt22 && pt22.pr > pt2.pr) {
        pt22 = pt22._next;
      }
      if ((pt2._prev = pt22 ? pt22._prev : last)) {
        pt2._prev._next = pt2;
      } else {
        first = pt2;
      }
      if ((pt2._next = pt22)) {
        pt22._prev = pt2;
      } else {
        last = pt2;
      }
      pt2 = next;
    }
    parent._pt = first;
  };
var PropTween = /* @__PURE__ */ (function () {
  function PropTween2(
    next,
    target,
    prop,
    start,
    change,
    renderer,
    data,
    setter,
    priority
  ) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;
    if (next) {
      next._prev = this;
    }
  }
  var _proto4 = PropTween2.prototype;
  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set;
    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target;
    this.tween = tween;
  };
  return PropTween2;
})();
_forEachName(
  _callbackNames +
    "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger",
  function (name) {
    return (_reservedProps[name] = 1);
  }
);
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true,
});
_config.stringFilter = _colorStringFilter;
var _media = [],
  _listeners = {},
  _emptyArray = [],
  _lastMediaTime = 0,
  _dispatch = function _dispatch2(type) {
    return (_listeners[type] || _emptyArray).map(function (f2) {
      return f2();
    });
  },
  _onMediaChange = function _onMediaChange2() {
    var time = Date.now(),
      matches = [];
    if (time - _lastMediaTime > 2) {
      _dispatch("matchMediaInit");
      _media.forEach(function (c2) {
        var queries = c2.queries,
          conditions = c2.conditions,
          match,
          p2,
          anyMatch,
          toggled;
        for (p2 in queries) {
          match = _win$1.matchMedia(queries[p2]).matches;
          match && (anyMatch = 1);
          if (match !== conditions[p2]) {
            conditions[p2] = match;
            toggled = 1;
          }
        }
        if (toggled) {
          c2.revert();
          anyMatch && matches.push(c2);
        }
      });
      _dispatch("matchMediaRevert");
      matches.forEach(function (c2) {
        return c2.onMatch(c2);
      });
      _lastMediaTime = time;
      _dispatch("matchMedia");
    }
  };
var Context = /* @__PURE__ */ (function () {
  function Context2(func, scope) {
    this.selector = scope && selector(scope);
    this.data = [];
    this._r = [];
    this.isReverted = false;
    func && this.add(func);
  }
  var _proto5 = Context2.prototype;
  _proto5.add = function add(name, func, scope) {
    if (_isFunction(name)) {
      scope = func;
      func = name;
      name = _isFunction;
    }
    var self2 = this,
      f2 = function f3() {
        var prev = _context,
          prevSelector = self2.selector,
          result;
        prev && prev !== self2 && prev.data.push(self2);
        scope && (self2.selector = selector(scope));
        _context = self2;
        result = func.apply(self2, arguments);
        _isFunction(result) && self2._r.push(result);
        _context = prev;
        self2.selector = prevSelector;
        self2.isReverted = false;
        return result;
      };
    self2.last = f2;
    return name === _isFunction ? f2(self2) : name ? (self2[name] = f2) : f2;
  };
  _proto5.ignore = function ignore(func) {
    var prev = _context;
    _context = null;
    func(this);
    _context = prev;
  };
  _proto5.getTweens = function getTweens() {
    var a2 = [];
    this.data.forEach(function (e2) {
      return e2 instanceof Context2
        ? a2.push.apply(a2, e2.getTweens())
        : e2 instanceof Tween &&
            !(e2.parent && e2.parent.data === "nested") &&
            a2.push(e2);
    });
    return a2;
  };
  _proto5.clear = function clear() {
    this._r.length = this.data.length = 0;
  };
  _proto5.kill = function kill(revert, matchMedia2) {
    var _this4 = this;
    if (revert) {
      var tweens = this.getTweens();
      this.data.forEach(function (t2) {
        if (t2.data === "isFlip") {
          t2.revert();
          t2.getChildren(true, true, false).forEach(function (tween) {
            return tweens.splice(tweens.indexOf(tween), 1);
          });
        }
      });
      tweens
        .map(function (t2) {
          return {
            g: t2.globalTime(0),
            t: t2,
          };
        })
        .sort(function (a2, b2) {
          return b2.g - a2.g || -1;
        })
        .forEach(function (o2) {
          return o2.t.revert(revert);
        });
      this.data.forEach(function (e2) {
        return !(e2 instanceof Animation) && e2.revert && e2.revert(revert);
      });
      this._r.forEach(function (f2) {
        return f2(revert, _this4);
      });
      this.isReverted = true;
    } else {
      this.data.forEach(function (e2) {
        return e2.kill && e2.kill();
      });
    }
    this.clear();
    if (matchMedia2) {
      var i2 = _media.indexOf(this);
      !!~i2 && _media.splice(i2, 1);
    }
  };
  _proto5.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  return Context2;
})();
var MatchMedia = /* @__PURE__ */ (function () {
  function MatchMedia2(scope) {
    this.contexts = [];
    this.scope = scope;
  }
  var _proto6 = MatchMedia2.prototype;
  _proto6.add = function add(conditions, func, scope) {
    _isObject(conditions) ||
      (conditions = {
        matches: conditions,
      });
    var context3 = new Context(0, scope || this.scope),
      cond = (context3.conditions = {}),
      mq,
      p2,
      active;
    this.contexts.push(context3);
    func = context3.add("onMatch", func);
    context3.queries = conditions;
    for (p2 in conditions) {
      if (p2 === "all") {
        active = 1;
      } else {
        mq = _win$1.matchMedia(conditions[p2]);
        if (mq) {
          _media.indexOf(context3) < 0 && _media.push(context3);
          (cond[p2] = mq.matches) && (active = 1);
          mq.addListener
            ? mq.addListener(_onMediaChange)
            : mq.addEventListener("change", _onMediaChange);
        }
      }
    }
    active && func(context3);
    return this;
  };
  _proto6.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  _proto6.kill = function kill(revert) {
    this.contexts.forEach(function (c2) {
      return c2.kill(revert, true);
    });
  };
  return MatchMedia2;
})();
var _gsap = {
  registerPlugin: function registerPlugin() {
    for (
      var _len2 = arguments.length, args = new Array(_len2), _key2 = 0;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2] = arguments[_key2];
    }
    args.forEach(function (config3) {
      return _createPlugin(config3);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString(target) && (target = toArray(target)[0]);
    var getter = _getCache(target || {}).get,
      format = unit ? _passThrough : _numericIfPossible;
    unit === "native" && (unit = "");
    return !target
      ? target
      : !property
        ? function (property2, unit2, uncache2) {
            return format(
              ((_plugins[property2] && _plugins[property2].get) || getter)(
                target,
                property2,
                unit2,
                uncache2
              )
            );
          }
        : format(
            ((_plugins[property] && _plugins[property].get) || getter)(
              target,
              property,
              unit,
              uncache
            )
          );
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);
    if (target.length > 1) {
      var setters = target.map(function (t2) {
          return gsap.quickSetter(t2, property, unit);
        }),
        l2 = setters.length;
      return function (value) {
        var i2 = l2;
        while (i2--) {
          setters[i2](value);
        }
      };
    }
    target = target[0] || {};
    var Plugin = _plugins[property],
      cache = _getCache(target),
      p2 =
        (cache.harness && (cache.harness.aliases || {})[property]) || property,
      setter = Plugin
        ? function (value) {
            var p3 = new Plugin();
            _quickTween._pt = 0;
            p3.init(target, unit ? value + unit : value, _quickTween, 0, [
              target,
            ]);
            p3.render(1, p3);
            _quickTween._pt && _renderPropTweens(1, _quickTween);
          }
        : cache.set(target, p2);
    return Plugin
      ? setter
      : function (value) {
          return setter(target, p2, unit ? value + unit : value, cache, 1);
        };
  },
  quickTo: function quickTo(target, property, vars) {
    var _merge22;
    var tween = gsap.to(
        target,
        _merge(
          ((_merge22 = {}),
          (_merge22[property] = "+=0.1"),
          (_merge22.paused = true),
          _merge22),
          vars || {}
        )
      ),
      func = function func2(value, start, startIsRelative) {
        return tween.resetTo(property, value, start, startIsRelative);
      };
    func.tween = tween;
    return func;
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults2(value) {
    value &&
      value.ease &&
      (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config2(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref3) {
    var name = _ref3.name,
      effect = _ref3.effect,
      plugins = _ref3.plugins,
      defaults3 = _ref3.defaults,
      extendTimeline = _ref3.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return (
        pluginName &&
        !_plugins[pluginName] &&
        !_globals[pluginName] &&
        _warn(name + " effect requires " + pluginName + " plugin.")
      );
    });
    _effects[name] = function (targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults3), tl);
    };
    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(
          _effects[name](
            targets,
            _isObject(vars) ? vars : (position = vars) && {},
            this
          ),
          position
        );
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }
    var tl = new Timeline(vars),
      child,
      next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
    _globalTimeline.remove(tl);
    tl._dp = 0;
    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;
    while (child) {
      next = child._next;
      if (
        includeDelayedCalls ||
        !(
          !child._dur &&
          child instanceof Tween &&
          child.vars.onComplete === child._targets[0]
        )
      ) {
        _addToTimeline(tl, child, child._start - child._delay);
      }
      child = next;
    }
    _addToTimeline(_globalTimeline, tl, 0);
    return tl;
  },
  context: function context(func, scope) {
    return func ? new Context(func, scope) : _context;
  },
  matchMedia: function matchMedia(scope) {
    return new MatchMedia(scope);
  },
  matchMediaRefresh: function matchMediaRefresh() {
    return (
      _media.forEach(function (c2) {
        var cond = c2.conditions,
          found,
          p2;
        for (p2 in cond) {
          if (cond[p2]) {
            cond[p2] = false;
            found = 1;
          }
        }
        found && c2.revert();
      }) || _onMediaChange()
    );
  },
  addEventListener: function addEventListener(type, callback) {
    var a2 = _listeners[type] || (_listeners[type] = []);
    ~a2.indexOf(callback) || a2.push(callback);
  },
  removeEventListener: function removeEventListener(type, callback) {
    var a2 = _listeners[type],
      i2 = a2 && a2.indexOf(callback);
    i2 >= 0 && a2.splice(i2, 1);
  },
  utils: {
    wrap,
    wrapYoyo,
    distribute,
    random,
    snap,
    normalize,
    getUnit,
    clamp,
    splitColor,
    toArray,
    selector,
    mapRange,
    pipe: pipe$1,
    unitize,
    interpolate,
    shuffle,
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween,
    globals: _addGlobal,
    Tween,
    Timeline,
    Animation,
    getCache: _getCache,
    _removeLinkedListItem,
    reverting: function reverting() {
      return _reverting$1;
    },
    context: function context2(toAdd) {
      if (toAdd && _context) {
        _context.data.push(toAdd);
        toAdd._ctx = _context;
      }
      return _context;
    },
    suppressOverwrites: function suppressOverwrites(value) {
      return (_suppressOverwrites = value);
    },
  },
};
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return (_gsap[name] = Tween[name]);
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to(
  {},
  {
    duration: 0,
  }
);
var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
    var pt2 = plugin._pt;
    while (pt2 && pt2.p !== prop && pt2.op !== prop && pt2.fp !== prop) {
      pt2 = pt2._next;
    }
    return pt2;
  },
  _addModifiers = function _addModifiers2(tween, modifiers) {
    var targets = tween._targets,
      p2,
      i2,
      pt2;
    for (p2 in modifiers) {
      i2 = targets.length;
      while (i2--) {
        pt2 = tween._ptLookup[i2][p2];
        if (pt2 && (pt2 = pt2.d)) {
          if (pt2._pt) {
            pt2 = _getPluginPropTween(pt2, p2);
          }
          pt2 &&
            pt2.modifier &&
            pt2.modifier(modifiers[p2], tween, targets[i2], p2);
        }
      }
    }
  },
  _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
    return {
      name,
      rawVars: 1,
      //don't pre-process function-based values or "random()" strings.
      init: function init4(target, vars, tween) {
        tween._onInit = function (tween2) {
          var temp, p2;
          if (_isString(vars)) {
            temp = {};
            _forEachName(vars, function (name2) {
              return (temp[name2] = 1);
            });
            vars = temp;
          }
          if (modifier) {
            temp = {};
            for (p2 in vars) {
              temp[p2] = modifier(vars[p2]);
            }
            vars = temp;
          }
          _addModifiers(tween2, vars);
        };
      },
    };
  };
var gsap =
  _gsap.registerPlugin(
    {
      name: "attr",
      init: function init(target, vars, tween, index, targets) {
        var p2, pt2, v2;
        this.tween = tween;
        for (p2 in vars) {
          v2 = target.getAttribute(p2) || "";
          pt2 = this.add(
            target,
            "setAttribute",
            (v2 || 0) + "",
            vars[p2],
            index,
            targets,
            0,
            0,
            p2
          );
          pt2.op = p2;
          pt2.b = v2;
          this._props.push(p2);
        }
      },
      render: function render(ratio, data) {
        var pt2 = data._pt;
        while (pt2) {
          _reverting$1
            ? pt2.set(pt2.t, pt2.p, pt2.b, pt2)
            : pt2.r(ratio, pt2.d);
          pt2 = pt2._next;
        }
      },
    },
    {
      name: "endArray",
      init: function init2(target, value) {
        var i2 = value.length;
        while (i2--) {
          this.add(target, i2, target[i2] || 0, value[i2], 0, 0, 0, 0, 0, 1);
        }
      },
    },
    _buildModifierPlugin("roundProps", _roundModifier),
    _buildModifierPlugin("modifiers"),
    _buildModifierPlugin("snap", snap)
  ) || _gsap;
Tween.version = Timeline.version = gsap.version = "3.11.4";
_coreReady = 1;
_windowExists$1() && _wake();
_easeMap.Power0;
_easeMap.Power1;
_easeMap.Power2;
_easeMap.Power3;
_easeMap.Power4;
_easeMap.Linear;
_easeMap.Quad;
_easeMap.Cubic;
_easeMap.Quart;
_easeMap.Quint;
_easeMap.Strong;
_easeMap.Elastic;
_easeMap.Back;
_easeMap.SteppedEase;
_easeMap.Bounce;
_easeMap.Sine;
_easeMap.Expo;
_easeMap.Circ;
/*!
 * CSSPlugin 3.11.4
 * https://greensock.com
 *
 * Copyright 2008-2022, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */
var _win,
  _doc,
  _docElement,
  _pluginInitted,
  _tempDiv,
  _recentSetterPlugin,
  _reverting,
  _windowExists2 = function _windowExists3() {
    return typeof window !== "undefined";
  },
  _transformProps = {},
  _RAD2DEG = 180 / Math.PI,
  _DEG2RAD = Math.PI / 180,
  _atan2 = Math.atan2,
  _bigNum = 1e8,
  _capsExp = /([A-Z])/g,
  _horizontalExp = /(left|right|width|margin|padding|x)/i,
  _complexExp = /[\s,\(]\S/,
  _propertyAliases = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity",
  },
  _renderCSSProp = function _renderCSSProp2(ratio, data) {
    return data.set(
      data.t,
      data.p,
      Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u,
      data
    );
  },
  _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
    return data.set(
      data.t,
      data.p,
      ratio === 1
        ? data.e
        : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u,
      data
    );
  },
  _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(
    ratio,
    data
  ) {
    return data.set(
      data.t,
      data.p,
      ratio
        ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u
        : data.b,
      data
    );
  },
  _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
    var value = data.s + data.c * ratio;
    data.set(
      data.t,
      data.p,
      ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u,
      data
    );
  },
  _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
    return data.set(data.t, data.p, ratio ? data.e : data.b, data);
  },
  _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(
    ratio,
    data
  ) {
    return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
  },
  _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
    return (target.style[property] = value);
  },
  _setterCSSProp = function _setterCSSProp2(target, property, value) {
    return target.style.setProperty(property, value);
  },
  _setterTransform = function _setterTransform2(target, property, value) {
    return (target._gsap[property] = value);
  },
  _setterScale = function _setterScale2(target, property, value) {
    return (target._gsap.scaleX = target._gsap.scaleY = value);
  },
  _setterScaleWithRender = function _setterScaleWithRender2(
    target,
    property,
    value,
    data,
    ratio
  ) {
    var cache = target._gsap;
    cache.scaleX = cache.scaleY = value;
    cache.renderTransform(ratio, cache);
  },
  _setterTransformWithRender = function _setterTransformWithRender2(
    target,
    property,
    value,
    data,
    ratio
  ) {
    var cache = target._gsap;
    cache[property] = value;
    cache.renderTransform(ratio, cache);
  },
  _transformProp = "transform",
  _transformOriginProp = _transformProp + "Origin",
  _saveStyle = function _saveStyle2(property, isNotCSS) {
    var _this = this;
    var target = this.target,
      style = target.style;
    if (property in _transformProps) {
      this.tfm = this.tfm || {};
      if (property !== "transform") {
        property = _propertyAliases[property] || property;
        ~property.indexOf(",")
          ? property.split(",").forEach(function (a2) {
              return (_this.tfm[a2] = _get(target, a2));
            })
          : (this.tfm[property] = target._gsap.x
              ? target._gsap[property]
              : _get(target, property));
      }
      if (this.props.indexOf(_transformProp) >= 0) {
        return;
      }
      if (target._gsap.svg) {
        this.svgo = target.getAttribute("data-svg-origin");
        this.props.push(_transformOriginProp, isNotCSS, "");
      }
      property = _transformProp;
    }
    (style || isNotCSS) && this.props.push(property, isNotCSS, style[property]);
  },
  _removeIndependentTransforms = function _removeIndependentTransforms2(style) {
    if (style.translate) {
      style.removeProperty("translate");
      style.removeProperty("scale");
      style.removeProperty("rotate");
    }
  },
  _revertStyle = function _revertStyle2() {
    var props = this.props,
      target = this.target,
      style = target.style,
      cache = target._gsap,
      i2,
      p2;
    for (i2 = 0; i2 < props.length; i2 += 3) {
      props[i2 + 1]
        ? (target[props[i2]] = props[i2 + 2])
        : props[i2 + 2]
          ? (style[props[i2]] = props[i2 + 2])
          : style.removeProperty(
              props[i2].replace(_capsExp, "-$1").toLowerCase()
            );
    }
    if (this.tfm) {
      for (p2 in this.tfm) {
        cache[p2] = this.tfm[p2];
      }
      if (cache.svg) {
        cache.renderTransform();
        target.setAttribute("data-svg-origin", this.svgo || "");
      }
      i2 = _reverting();
      if (i2 && !i2.isStart && !style[_transformProp]) {
        _removeIndependentTransforms(style);
        cache.uncache = 1;
      }
    }
  },
  _getStyleSaver = function _getStyleSaver2(target, properties) {
    var saver = {
      target,
      props: [],
      revert: _revertStyle,
      save: _saveStyle,
    };
    properties &&
      properties.split(",").forEach(function (p2) {
        return saver.save(p2);
      });
    return saver;
  },
  _supports3D,
  _createElement = function _createElement2(type, ns) {
    var e2 = _doc.createElementNS
      ? _doc.createElementNS(
          (ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"),
          type
        )
      : _doc.createElement(type);
    return e2.style ? e2 : _doc.createElement(type);
  },
  _getComputedProperty = function _getComputedProperty2(
    target,
    property,
    skipPrefixFallback
  ) {
    var cs = getComputedStyle(target);
    return (
      cs[property] ||
      cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) ||
      cs.getPropertyValue(property) ||
      (!skipPrefixFallback &&
        _getComputedProperty2(
          target,
          _checkPropPrefix(property) || property,
          1
        )) ||
      ""
    );
  },
  _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
  _checkPropPrefix = function _checkPropPrefix2(
    property,
    element,
    preferPrefix
  ) {
    var e2 = element || _tempDiv,
      s2 = e2.style,
      i2 = 5;
    if (property in s2 && !preferPrefix) {
      return property;
    }
    property = property.charAt(0).toUpperCase() + property.substr(1);
    while (i2-- && !(_prefixes[i2] + property in s2)) {}
    return i2 < 0
      ? null
      : (i2 === 3 ? "ms" : i2 >= 0 ? _prefixes[i2] : "") + property;
  },
  _initCore = function _initCore2() {
    if (_windowExists2() && window.document) {
      _win = window;
      _doc = _win.document;
      _docElement = _doc.documentElement;
      _tempDiv = _createElement("div") || {
        style: {},
      };
      _createElement("div");
      _transformProp = _checkPropPrefix(_transformProp);
      _transformOriginProp = _transformProp + "Origin";
      _tempDiv.style.cssText =
        "border-width:0;line-height:0;position:absolute;padding:0";
      _supports3D = !!_checkPropPrefix("perspective");
      _reverting = gsap.core.reverting;
      _pluginInitted = 1;
    }
  },
  _getBBoxHack = function _getBBoxHack2(swapIfPossible) {
    var svg = _createElement(
        "svg",
        (this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns")) ||
          "http://www.w3.org/2000/svg"
      ),
      oldParent = this.parentNode,
      oldSibling = this.nextSibling,
      oldCSS = this.style.cssText,
      bbox;
    _docElement.appendChild(svg);
    svg.appendChild(this);
    this.style.display = "block";
    if (swapIfPossible) {
      try {
        bbox = this.getBBox();
        this._gsapBBox = this.getBBox;
        this.getBBox = _getBBoxHack2;
      } catch (e2) {}
    } else if (this._gsapBBox) {
      bbox = this._gsapBBox();
    }
    if (oldParent) {
      if (oldSibling) {
        oldParent.insertBefore(this, oldSibling);
      } else {
        oldParent.appendChild(this);
      }
    }
    _docElement.removeChild(svg);
    this.style.cssText = oldCSS;
    return bbox;
  },
  _getAttributeFallbacks = function _getAttributeFallbacks2(
    target,
    attributesArray
  ) {
    var i2 = attributesArray.length;
    while (i2--) {
      if (target.hasAttribute(attributesArray[i2])) {
        return target.getAttribute(attributesArray[i2]);
      }
    }
  },
  _getBBox = function _getBBox2(target) {
    var bounds;
    try {
      bounds = target.getBBox();
    } catch (error) {
      bounds = _getBBoxHack.call(target, true);
    }
    (bounds && (bounds.width || bounds.height)) ||
      target.getBBox === _getBBoxHack ||
      (bounds = _getBBoxHack.call(target, true));
    return bounds && !bounds.width && !bounds.x && !bounds.y
      ? {
          x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
          y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
          width: 0,
          height: 0,
        }
      : bounds;
  },
  _isSVG = function _isSVG2(e2) {
    return !!(
      e2.getCTM &&
      (!e2.parentNode || e2.ownerSVGElement) &&
      _getBBox(e2)
    );
  },
  _removeProperty = function _removeProperty2(target, property) {
    if (property) {
      var style = target.style;
      if (property in _transformProps && property !== _transformOriginProp) {
        property = _transformProp;
      }
      if (style.removeProperty) {
        if (
          property.substr(0, 2) === "ms" ||
          property.substr(0, 6) === "webkit"
        ) {
          property = "-" + property;
        }
        style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
      } else {
        style.removeAttribute(property);
      }
    }
  },
  _addNonTweeningPT = function _addNonTweeningPT2(
    plugin,
    target,
    property,
    beginning,
    end,
    onlySetAtEnd
  ) {
    var pt2 = new PropTween(
      plugin._pt,
      target,
      property,
      0,
      1,
      onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue
    );
    plugin._pt = pt2;
    pt2.b = beginning;
    pt2.e = end;
    plugin._props.push(property);
    return pt2;
  },
  _nonConvertibleUnits = {
    deg: 1,
    rad: 1,
    turn: 1,
  },
  _nonStandardLayouts = {
    grid: 1,
    flex: 1,
  },
  _convertToUnit = function _convertToUnit2(target, property, value, unit) {
    var curValue = parseFloat(value) || 0,
      curUnit = (value + "").trim().substr((curValue + "").length) || "px",
      style = _tempDiv.style,
      horizontal = _horizontalExp.test(property),
      isRootSVG = target.tagName.toLowerCase() === "svg",
      measureProperty =
        (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
      amount = 100,
      toPixels = unit === "px",
      toPercent = unit === "%",
      px,
      parent,
      cache,
      isSVG;
    if (
      unit === curUnit ||
      !curValue ||
      _nonConvertibleUnits[unit] ||
      _nonConvertibleUnits[curUnit]
    ) {
      return curValue;
    }
    curUnit !== "px" &&
      !toPixels &&
      (curValue = _convertToUnit2(target, property, value, "px"));
    isSVG = target.getCTM && _isSVG(target);
    if (
      (toPercent || curUnit === "%") &&
      (_transformProps[property] || ~property.indexOf("adius"))
    ) {
      px = isSVG
        ? target.getBBox()[horizontal ? "width" : "height"]
        : target[measureProperty];
      return _round(
        toPercent ? (curValue / px) * amount : (curValue / 100) * px
      );
    }
    style[horizontal ? "width" : "height"] =
      amount + (toPixels ? curUnit : unit);
    parent =
      ~property.indexOf("adius") ||
      (unit === "em" && target.appendChild && !isRootSVG)
        ? target
        : target.parentNode;
    if (isSVG) {
      parent = (target.ownerSVGElement || {}).parentNode;
    }
    if (!parent || parent === _doc || !parent.appendChild) {
      parent = _doc.body;
    }
    cache = parent._gsap;
    if (
      cache &&
      toPercent &&
      cache.width &&
      horizontal &&
      cache.time === _ticker.time &&
      !cache.uncache
    ) {
      return _round((curValue / cache.width) * amount);
    } else {
      (toPercent || curUnit === "%") &&
        !_nonStandardLayouts[_getComputedProperty(parent, "display")] &&
        (style.position = _getComputedProperty(target, "position"));
      parent === target && (style.position = "static");
      parent.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent.removeChild(_tempDiv);
      style.position = "absolute";
      if (horizontal && toPercent) {
        cache = _getCache(parent);
        cache.time = _ticker.time;
        cache.width = parent[measureProperty];
      }
    }
    return _round(
      toPixels
        ? (px * curValue) / amount
        : px && curValue
          ? (amount / px) * curValue
          : 0
    );
  },
  _get = function _get2(target, property, unit, uncache) {
    var value;
    _pluginInitted || _initCore();
    if (property in _propertyAliases && property !== "transform") {
      property = _propertyAliases[property];
      if (~property.indexOf(",")) {
        property = property.split(",")[0];
      }
    }
    if (_transformProps[property] && property !== "transform") {
      value = _parseTransform(target, uncache);
      value =
        property !== "transformOrigin"
          ? value[property]
          : value.svg
            ? value.origin
            : _firstTwoOnly(
                _getComputedProperty(target, _transformOriginProp)
              ) +
              " " +
              value.zOrigin +
              "px";
    } else {
      value = target.style[property];
      if (
        !value ||
        value === "auto" ||
        uncache ||
        ~(value + "").indexOf("calc(")
      ) {
        value =
          (_specialProps[property] &&
            _specialProps[property](target, property, unit)) ||
          _getComputedProperty(target, property) ||
          _getProperty(target, property) ||
          (property === "opacity" ? 1 : 0);
      }
    }
    return unit && !~(value + "").trim().indexOf(" ")
      ? _convertToUnit(target, property, value, unit) + unit
      : value;
  },
  _tweenComplexCSSString = function _tweenComplexCSSString2(
    target,
    prop,
    start,
    end
  ) {
    if (!start || start === "none") {
      var p2 = _checkPropPrefix(prop, target, 1),
        s2 = p2 && _getComputedProperty(target, p2, 1);
      if (s2 && s2 !== start) {
        prop = p2;
        start = s2;
      } else if (prop === "borderColor") {
        start = _getComputedProperty(target, "borderTopColor");
      }
    }
    var pt2 = new PropTween(
        this._pt,
        target.style,
        prop,
        0,
        1,
        _renderComplexString
      ),
      index = 0,
      matchIndex = 0,
      a2,
      result,
      startValues,
      startNum,
      color,
      startValue,
      endValue,
      endNum,
      chunk,
      endUnit,
      startUnit,
      endValues;
    pt2.b = start;
    pt2.e = end;
    start += "";
    end += "";
    if (end === "auto") {
      target.style[prop] = end;
      end = _getComputedProperty(target, prop) || end;
      target.style[prop] = start;
    }
    a2 = [start, end];
    _colorStringFilter(a2);
    start = a2[0];
    end = a2[1];
    startValues = start.match(_numWithUnitExp) || [];
    endValues = end.match(_numWithUnitExp) || [];
    if (endValues.length) {
      while ((result = _numWithUnitExp.exec(end))) {
        endValue = result[0];
        chunk = end.substring(index, result.index);
        if (color) {
          color = (color + 1) % 5;
        } else if (
          chunk.substr(-5) === "rgba(" ||
          chunk.substr(-5) === "hsla("
        ) {
          color = 1;
        }
        if (endValue !== (startValue = startValues[matchIndex++] || "")) {
          startNum = parseFloat(startValue) || 0;
          startUnit = startValue.substr((startNum + "").length);
          endValue.charAt(1) === "=" &&
            (endValue = _parseRelative(startNum, endValue) + startUnit);
          endNum = parseFloat(endValue);
          endUnit = endValue.substr((endNum + "").length);
          index = _numWithUnitExp.lastIndex - endUnit.length;
          if (!endUnit) {
            endUnit = endUnit || _config.units[prop] || startUnit;
            if (index === end.length) {
              end += endUnit;
              pt2.e += endUnit;
            }
          }
          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
          }
          pt2._pt = {
            _next: pt2._pt,
            p: chunk || matchIndex === 1 ? chunk : ",",
            //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
            s: startNum,
            c: endNum - startNum,
            m: (color && color < 4) || prop === "zIndex" ? Math.round : 0,
          };
        }
      }
      pt2.c = index < end.length ? end.substring(index, end.length) : "";
    } else {
      pt2.r =
        prop === "display" && end === "none"
          ? _renderNonTweeningValueOnlyAtEnd
          : _renderNonTweeningValue;
    }
    _relExp.test(end) && (pt2.e = 0);
    this._pt = pt2;
    return pt2;
  },
  _keywordToPercent = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%",
  },
  _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(
    value
  ) {
    var split = value.split(" "),
      x2 = split[0],
      y2 = split[1] || "50%";
    if (x2 === "top" || x2 === "bottom" || y2 === "left" || y2 === "right") {
      value = x2;
      x2 = y2;
      y2 = value;
    }
    split[0] = _keywordToPercent[x2] || x2;
    split[1] = _keywordToPercent[y2] || y2;
    return split.join(" ");
  },
  _renderClearProps = function _renderClearProps2(ratio, data) {
    if (data.tween && data.tween._time === data.tween._dur) {
      var target = data.t,
        style = target.style,
        props = data.u,
        cache = target._gsap,
        prop,
        clearTransforms,
        i2;
      if (props === "all" || props === true) {
        style.cssText = "";
        clearTransforms = 1;
      } else {
        props = props.split(",");
        i2 = props.length;
        while (--i2 > -1) {
          prop = props[i2];
          if (_transformProps[prop]) {
            clearTransforms = 1;
            prop =
              prop === "transformOrigin"
                ? _transformOriginProp
                : _transformProp;
          }
          _removeProperty(target, prop);
        }
      }
      if (clearTransforms) {
        _removeProperty(target, _transformProp);
        if (cache) {
          cache.svg && target.removeAttribute("transform");
          _parseTransform(target, 1);
          cache.uncache = 1;
          _removeIndependentTransforms(style);
        }
      }
    }
  },
  _specialProps = {
    clearProps: function clearProps(plugin, target, property, endValue, tween) {
      if (tween.data !== "isFromStart") {
        var pt2 = (plugin._pt = new PropTween(
          plugin._pt,
          target,
          property,
          0,
          0,
          _renderClearProps
        ));
        pt2.u = endValue;
        pt2.pr = -10;
        pt2.tween = tween;
        plugin._props.push(property);
        return 1;
      }
    },
    /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
  },
  _identity2DMatrix = [1, 0, 0, 1, 0, 0],
  _rotationalProperties = {},
  _isNullTransform = function _isNullTransform2(value) {
    return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
  },
  _getComputedTransformMatrixAsArray =
    function _getComputedTransformMatrixAsArray2(target) {
      var matrixString = _getComputedProperty(target, _transformProp);
      return _isNullTransform(matrixString)
        ? _identity2DMatrix
        : matrixString.substr(7).match(_numExp).map(_round);
    },
  _getMatrix = function _getMatrix2(target, force2D) {
    var cache = target._gsap || _getCache(target),
      style = target.style,
      matrix = _getComputedTransformMatrixAsArray(target),
      parent,
      nextSibling,
      temp,
      addedToDOM;
    if (cache.svg && target.getAttribute("transform")) {
      temp = target.transform.baseVal.consolidate().matrix;
      matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
      return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
    } else if (
      matrix === _identity2DMatrix &&
      !target.offsetParent &&
      target !== _docElement &&
      !cache.svg
    ) {
      temp = style.display;
      style.display = "block";
      parent = target.parentNode;
      if (!parent || !target.offsetParent) {
        addedToDOM = 1;
        nextSibling = target.nextElementSibling;
        _docElement.appendChild(target);
      }
      matrix = _getComputedTransformMatrixAsArray(target);
      temp ? (style.display = temp) : _removeProperty(target, "display");
      if (addedToDOM) {
        nextSibling
          ? parent.insertBefore(target, nextSibling)
          : parent
            ? parent.appendChild(target)
            : _docElement.removeChild(target);
      }
    }
    return force2D && matrix.length > 6
      ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]]
      : matrix;
  },
  _applySVGOrigin = function _applySVGOrigin2(
    target,
    origin,
    originIsAbsolute,
    smooth,
    matrixArray,
    pluginToAddPropTweensTo
  ) {
    var cache = target._gsap,
      matrix = matrixArray || _getMatrix(target, true),
      xOriginOld = cache.xOrigin || 0,
      yOriginOld = cache.yOrigin || 0,
      xOffsetOld = cache.xOffset || 0,
      yOffsetOld = cache.yOffset || 0,
      a2 = matrix[0],
      b2 = matrix[1],
      c2 = matrix[2],
      d2 = matrix[3],
      tx = matrix[4],
      ty = matrix[5],
      originSplit = origin.split(" "),
      xOrigin = parseFloat(originSplit[0]) || 0,
      yOrigin = parseFloat(originSplit[1]) || 0,
      bounds,
      determinant,
      x2,
      y2;
    if (!originIsAbsolute) {
      bounds = _getBBox(target);
      xOrigin =
        bounds.x +
        (~originSplit[0].indexOf("%")
          ? (xOrigin / 100) * bounds.width
          : xOrigin);
      yOrigin =
        bounds.y +
        (~(originSplit[1] || originSplit[0]).indexOf("%")
          ? (yOrigin / 100) * bounds.height
          : yOrigin);
    } else if (
      matrix !== _identity2DMatrix &&
      (determinant = a2 * d2 - b2 * c2)
    ) {
      x2 =
        xOrigin * (d2 / determinant) +
        yOrigin * (-c2 / determinant) +
        (c2 * ty - d2 * tx) / determinant;
      y2 =
        xOrigin * (-b2 / determinant) +
        yOrigin * (a2 / determinant) -
        (a2 * ty - b2 * tx) / determinant;
      xOrigin = x2;
      yOrigin = y2;
    }
    if (smooth || (smooth !== false && cache.smooth)) {
      tx = xOrigin - xOriginOld;
      ty = yOrigin - yOriginOld;
      cache.xOffset = xOffsetOld + (tx * a2 + ty * c2) - tx;
      cache.yOffset = yOffsetOld + (tx * b2 + ty * d2) - ty;
    } else {
      cache.xOffset = cache.yOffset = 0;
    }
    cache.xOrigin = xOrigin;
    cache.yOrigin = yOrigin;
    cache.smooth = !!smooth;
    cache.origin = origin;
    cache.originIsAbsolute = !!originIsAbsolute;
    target.style[_transformOriginProp] = "0px 0px";
    if (pluginToAddPropTweensTo) {
      _addNonTweeningPT(
        pluginToAddPropTweensTo,
        cache,
        "xOrigin",
        xOriginOld,
        xOrigin
      );
      _addNonTweeningPT(
        pluginToAddPropTweensTo,
        cache,
        "yOrigin",
        yOriginOld,
        yOrigin
      );
      _addNonTweeningPT(
        pluginToAddPropTweensTo,
        cache,
        "xOffset",
        xOffsetOld,
        cache.xOffset
      );
      _addNonTweeningPT(
        pluginToAddPropTweensTo,
        cache,
        "yOffset",
        yOffsetOld,
        cache.yOffset
      );
    }
    target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
  },
  _parseTransform = function _parseTransform2(target, uncache) {
    var cache = target._gsap || new GSCache(target);
    if ("x" in cache && !uncache && !cache.uncache) {
      return cache;
    }
    var style = target.style,
      invertedScaleX = cache.scaleX < 0,
      px = "px",
      deg = "deg",
      cs = getComputedStyle(target),
      origin = _getComputedProperty(target, _transformOriginProp) || "0",
      x2,
      y2,
      z2,
      scaleX,
      scaleY,
      rotation,
      rotationX,
      rotationY,
      skewX,
      skewY,
      perspective,
      xOrigin,
      yOrigin,
      matrix,
      angle,
      cos,
      sin,
      a2,
      b2,
      c2,
      d2,
      a12,
      a22,
      t1,
      t2,
      t3,
      a13,
      a23,
      a33,
      a42,
      a43,
      a32;
    x2 =
      y2 =
      z2 =
      rotation =
      rotationX =
      rotationY =
      skewX =
      skewY =
      perspective =
        0;
    scaleX = scaleY = 1;
    cache.svg = !!(target.getCTM && _isSVG(target));
    if (cs.translate) {
      if (
        cs.translate !== "none" ||
        cs.scale !== "none" ||
        cs.rotate !== "none"
      ) {
        style[_transformProp] =
          (cs.translate !== "none"
            ? "translate3d(" +
              (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") +
              ") "
            : "") +
          (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") +
          (cs.scale !== "none"
            ? "scale(" + cs.scale.split(" ").join(",") + ") "
            : "") +
          (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
      }
      style.scale = style.rotate = style.translate = "none";
    }
    matrix = _getMatrix(target, cache.svg);
    if (cache.svg) {
      if (cache.uncache) {
        t2 = target.getBBox();
        origin = cache.xOrigin - t2.x + "px " + (cache.yOrigin - t2.y) + "px";
        t1 = "";
      } else {
        t1 = !uncache && target.getAttribute("data-svg-origin");
      }
      _applySVGOrigin(
        target,
        t1 || origin,
        !!t1 || cache.originIsAbsolute,
        cache.smooth !== false,
        matrix
      );
    }
    xOrigin = cache.xOrigin || 0;
    yOrigin = cache.yOrigin || 0;
    if (matrix !== _identity2DMatrix) {
      a2 = matrix[0];
      b2 = matrix[1];
      c2 = matrix[2];
      d2 = matrix[3];
      x2 = a12 = matrix[4];
      y2 = a22 = matrix[5];
      if (matrix.length === 6) {
        scaleX = Math.sqrt(a2 * a2 + b2 * b2);
        scaleY = Math.sqrt(d2 * d2 + c2 * c2);
        rotation = a2 || b2 ? _atan2(b2, a2) * _RAD2DEG : 0;
        skewX = c2 || d2 ? _atan2(c2, d2) * _RAD2DEG + rotation : 0;
        skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
        if (cache.svg) {
          x2 -= xOrigin - (xOrigin * a2 + yOrigin * c2);
          y2 -= yOrigin - (xOrigin * b2 + yOrigin * d2);
        }
      } else {
        a32 = matrix[6];
        a42 = matrix[7];
        a13 = matrix[8];
        a23 = matrix[9];
        a33 = matrix[10];
        a43 = matrix[11];
        x2 = matrix[12];
        y2 = matrix[13];
        z2 = matrix[14];
        angle = _atan2(a32, a33);
        rotationX = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a12 * cos + a13 * sin;
          t2 = a22 * cos + a23 * sin;
          t3 = a32 * cos + a33 * sin;
          a13 = a12 * -sin + a13 * cos;
          a23 = a22 * -sin + a23 * cos;
          a33 = a32 * -sin + a33 * cos;
          a43 = a42 * -sin + a43 * cos;
          a12 = t1;
          a22 = t2;
          a32 = t3;
        }
        angle = _atan2(-c2, a33);
        rotationY = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(-angle);
          sin = Math.sin(-angle);
          t1 = a2 * cos - a13 * sin;
          t2 = b2 * cos - a23 * sin;
          t3 = c2 * cos - a33 * sin;
          a43 = d2 * sin + a43 * cos;
          a2 = t1;
          b2 = t2;
          c2 = t3;
        }
        angle = _atan2(b2, a2);
        rotation = angle * _RAD2DEG;
        if (angle) {
          cos = Math.cos(angle);
          sin = Math.sin(angle);
          t1 = a2 * cos + b2 * sin;
          t2 = a12 * cos + a22 * sin;
          b2 = b2 * cos - a2 * sin;
          a22 = a22 * cos - a12 * sin;
          a2 = t1;
          a12 = t2;
        }
        if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
          rotationX = rotation = 0;
          rotationY = 180 - rotationY;
        }
        scaleX = _round(Math.sqrt(a2 * a2 + b2 * b2 + c2 * c2));
        scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
        angle = _atan2(a12, a22);
        skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
        perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
      }
      if (cache.svg) {
        t1 = target.getAttribute("transform");
        cache.forceCSS =
          target.setAttribute("transform", "") ||
          !_isNullTransform(_getComputedProperty(target, _transformProp));
        t1 && target.setAttribute("transform", t1);
      }
    }
    if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
      if (invertedScaleX) {
        scaleX *= -1;
        skewX += rotation <= 0 ? 180 : -180;
        rotation += rotation <= 0 ? 180 : -180;
      } else {
        scaleY *= -1;
        skewX += skewX <= 0 ? 180 : -180;
      }
    }
    uncache = uncache || cache.uncache;
    cache.x =
      x2 -
      ((cache.xPercent =
        x2 &&
        ((!uncache && cache.xPercent) ||
          (Math.round(target.offsetWidth / 2) === Math.round(-x2) ? -50 : 0)))
        ? (target.offsetWidth * cache.xPercent) / 100
        : 0) +
      px;
    cache.y =
      y2 -
      ((cache.yPercent =
        y2 &&
        ((!uncache && cache.yPercent) ||
          (Math.round(target.offsetHeight / 2) === Math.round(-y2) ? -50 : 0)))
        ? (target.offsetHeight * cache.yPercent) / 100
        : 0) +
      px;
    cache.z = z2 + px;
    cache.scaleX = _round(scaleX);
    cache.scaleY = _round(scaleY);
    cache.rotation = _round(rotation) + deg;
    cache.rotationX = _round(rotationX) + deg;
    cache.rotationY = _round(rotationY) + deg;
    cache.skewX = skewX + deg;
    cache.skewY = skewY + deg;
    cache.transformPerspective = perspective + px;
    if ((cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0)) {
      style[_transformOriginProp] = _firstTwoOnly(origin);
    }
    cache.xOffset = cache.yOffset = 0;
    cache.force3D = _config.force3D;
    cache.renderTransform = cache.svg
      ? _renderSVGTransforms
      : _supports3D
        ? _renderCSSTransforms
        : _renderNon3DTransforms;
    cache.uncache = 0;
    return cache;
  },
  _firstTwoOnly = function _firstTwoOnly2(value) {
    return (value = value.split(" "))[0] + " " + value[1];
  },
  _addPxTranslate = function _addPxTranslate2(target, start, value) {
    var unit = getUnit(start);
    return (
      _round(
        parseFloat(start) +
          parseFloat(_convertToUnit(target, "x", value + "px", unit))
      ) + unit
    );
  },
  _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache) {
    cache.z = "0px";
    cache.rotationY = cache.rotationX = "0deg";
    cache.force3D = 0;
    _renderCSSTransforms(ratio, cache);
  },
  _zeroDeg = "0deg",
  _zeroPx = "0px",
  _endParenthesis = ") ",
  _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache) {
    var _ref = cache || this,
      xPercent = _ref.xPercent,
      yPercent = _ref.yPercent,
      x2 = _ref.x,
      y2 = _ref.y,
      z2 = _ref.z,
      rotation = _ref.rotation,
      rotationY = _ref.rotationY,
      rotationX = _ref.rotationX,
      skewX = _ref.skewX,
      skewY = _ref.skewY,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      transformPerspective = _ref.transformPerspective,
      force3D = _ref.force3D,
      target = _ref.target,
      zOrigin = _ref.zOrigin,
      transforms = "",
      use3D = (force3D === "auto" && ratio && ratio !== 1) || force3D === true;
    if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
      var angle = parseFloat(rotationY) * _DEG2RAD,
        a13 = Math.sin(angle),
        a33 = Math.cos(angle),
        cos;
      angle = parseFloat(rotationX) * _DEG2RAD;
      cos = Math.cos(angle);
      x2 = _addPxTranslate(target, x2, a13 * cos * -zOrigin);
      y2 = _addPxTranslate(target, y2, -Math.sin(angle) * -zOrigin);
      z2 = _addPxTranslate(target, z2, a33 * cos * -zOrigin + zOrigin);
    }
    if (transformPerspective !== _zeroPx) {
      transforms += "perspective(" + transformPerspective + _endParenthesis;
    }
    if (xPercent || yPercent) {
      transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
    }
    if (use3D || x2 !== _zeroPx || y2 !== _zeroPx || z2 !== _zeroPx) {
      transforms +=
        z2 !== _zeroPx || use3D
          ? "translate3d(" + x2 + ", " + y2 + ", " + z2 + ") "
          : "translate(" + x2 + ", " + y2 + _endParenthesis;
    }
    if (rotation !== _zeroDeg) {
      transforms += "rotate(" + rotation + _endParenthesis;
    }
    if (rotationY !== _zeroDeg) {
      transforms += "rotateY(" + rotationY + _endParenthesis;
    }
    if (rotationX !== _zeroDeg) {
      transforms += "rotateX(" + rotationX + _endParenthesis;
    }
    if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
      transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
    }
    if (scaleX !== 1 || scaleY !== 1) {
      transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
    }
    target.style[_transformProp] = transforms || "translate(0, 0)";
  },
  _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache) {
    var _ref2 = cache || this,
      xPercent = _ref2.xPercent,
      yPercent = _ref2.yPercent,
      x2 = _ref2.x,
      y2 = _ref2.y,
      rotation = _ref2.rotation,
      skewX = _ref2.skewX,
      skewY = _ref2.skewY,
      scaleX = _ref2.scaleX,
      scaleY = _ref2.scaleY,
      target = _ref2.target,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xOffset = _ref2.xOffset,
      yOffset = _ref2.yOffset,
      forceCSS = _ref2.forceCSS,
      tx = parseFloat(x2),
      ty = parseFloat(y2),
      a11,
      a21,
      a12,
      a22,
      temp;
    rotation = parseFloat(rotation);
    skewX = parseFloat(skewX);
    skewY = parseFloat(skewY);
    if (skewY) {
      skewY = parseFloat(skewY);
      skewX += skewY;
      rotation += skewY;
    }
    if (rotation || skewX) {
      rotation *= _DEG2RAD;
      skewX *= _DEG2RAD;
      a11 = Math.cos(rotation) * scaleX;
      a21 = Math.sin(rotation) * scaleX;
      a12 = Math.sin(rotation - skewX) * -scaleY;
      a22 = Math.cos(rotation - skewX) * scaleY;
      if (skewX) {
        skewY *= _DEG2RAD;
        temp = Math.tan(skewX - skewY);
        temp = Math.sqrt(1 + temp * temp);
        a12 *= temp;
        a22 *= temp;
        if (skewY) {
          temp = Math.tan(skewY);
          temp = Math.sqrt(1 + temp * temp);
          a11 *= temp;
          a21 *= temp;
        }
      }
      a11 = _round(a11);
      a21 = _round(a21);
      a12 = _round(a12);
      a22 = _round(a22);
    } else {
      a11 = scaleX;
      a22 = scaleY;
      a21 = a12 = 0;
    }
    if (
      (tx && !~(x2 + "").indexOf("px")) ||
      (ty && !~(y2 + "").indexOf("px"))
    ) {
      tx = _convertToUnit(target, "x", x2, "px");
      ty = _convertToUnit(target, "y", y2, "px");
    }
    if (xOrigin || yOrigin || xOffset || yOffset) {
      tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
      ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
    }
    if (xPercent || yPercent) {
      temp = target.getBBox();
      tx = _round(tx + (xPercent / 100) * temp.width);
      ty = _round(ty + (yPercent / 100) * temp.height);
    }
    temp =
      "matrix(" +
      a11 +
      "," +
      a21 +
      "," +
      a12 +
      "," +
      a22 +
      "," +
      tx +
      "," +
      ty +
      ")";
    target.setAttribute("transform", temp);
    forceCSS && (target.style[_transformProp] = temp);
  },
  _addRotationalPropTween = function _addRotationalPropTween2(
    plugin,
    target,
    property,
    startNum,
    endValue
  ) {
    var cap = 360,
      isString2 = _isString(endValue),
      endNum =
        parseFloat(endValue) *
        (isString2 && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
      change = endNum - startNum,
      finalValue = startNum + change + "deg",
      direction,
      pt2;
    if (isString2) {
      direction = endValue.split("_")[1];
      if (direction === "short") {
        change %= cap;
        if (change !== change % (cap / 2)) {
          change += change < 0 ? cap : -cap;
        }
      }
      if (direction === "cw" && change < 0) {
        change = ((change + cap * _bigNum) % cap) - ~~(change / cap) * cap;
      } else if (direction === "ccw" && change > 0) {
        change = ((change - cap * _bigNum) % cap) - ~~(change / cap) * cap;
      }
    }
    plugin._pt = pt2 = new PropTween(
      plugin._pt,
      target,
      property,
      startNum,
      change,
      _renderPropWithEnd
    );
    pt2.e = finalValue;
    pt2.u = "deg";
    plugin._props.push(property);
    return pt2;
  },
  _assign = function _assign2(target, source) {
    for (var p2 in source) {
      target[p2] = source[p2];
    }
    return target;
  },
  _addRawTransformPTs = function _addRawTransformPTs2(
    plugin,
    transforms,
    target
  ) {
    var startCache = _assign({}, target._gsap),
      exclude = "perspective,force3D,transformOrigin,svgOrigin",
      style = target.style,
      endCache,
      p2,
      startValue,
      endValue,
      startNum,
      endNum,
      startUnit,
      endUnit;
    if (startCache.svg) {
      startValue = target.getAttribute("transform");
      target.setAttribute("transform", "");
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      _removeProperty(target, _transformProp);
      target.setAttribute("transform", startValue);
    } else {
      startValue = getComputedStyle(target)[_transformProp];
      style[_transformProp] = transforms;
      endCache = _parseTransform(target, 1);
      style[_transformProp] = startValue;
    }
    for (p2 in _transformProps) {
      startValue = startCache[p2];
      endValue = endCache[p2];
      if (startValue !== endValue && exclude.indexOf(p2) < 0) {
        startUnit = getUnit(startValue);
        endUnit = getUnit(endValue);
        startNum =
          startUnit !== endUnit
            ? _convertToUnit(target, p2, startValue, endUnit)
            : parseFloat(startValue);
        endNum = parseFloat(endValue);
        plugin._pt = new PropTween(
          plugin._pt,
          endCache,
          p2,
          startNum,
          endNum - startNum,
          _renderCSSProp
        );
        plugin._pt.u = endUnit || 0;
        plugin._props.push(p2);
      }
    }
    _assign(endCache, startCache);
  };
_forEachName("padding,margin,Width,Radius", function (name, index) {
  var t2 = "Top",
    r2 = "Right",
    b2 = "Bottom",
    l2 = "Left",
    props = (
      index < 3 ? [t2, r2, b2, l2] : [t2 + l2, t2 + r2, b2 + r2, b2 + l2]
    ).map(function (side) {
      return index < 2 ? name + side : "border" + side + name;
    });
  _specialProps[index > 1 ? "border" + name : name] = function (
    plugin,
    target,
    property,
    endValue,
    tween
  ) {
    var a2, vars;
    if (arguments.length < 4) {
      a2 = props.map(function (prop) {
        return _get(plugin, prop, property);
      });
      vars = a2.join(" ");
      return vars.split(a2[0]).length === 5 ? a2[0] : vars;
    }
    a2 = (endValue + "").split(" ");
    vars = {};
    props.forEach(function (prop, i2) {
      return (vars[prop] = a2[i2] = a2[i2] || a2[((i2 - 1) / 2) | 0]);
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init3(target, vars, tween, index, targets) {
    var props = this._props,
      style = target.style,
      startAt = tween.vars.startAt,
      startValue,
      endValue,
      endNum,
      startNum,
      type,
      specialProp,
      p2,
      startUnit,
      endUnit,
      relative,
      isTransformRelated,
      transformPropTween,
      cache,
      smooth,
      hasPriority,
      inlineProps;
    _pluginInitted || _initCore();
    this.styles = this.styles || _getStyleSaver(target);
    inlineProps = this.styles.props;
    this.tween = tween;
    for (p2 in vars) {
      if (p2 === "autoRound") {
        continue;
      }
      endValue = vars[p2];
      if (
        _plugins[p2] &&
        _checkPlugin(p2, vars, tween, index, target, targets)
      ) {
        continue;
      }
      type = typeof endValue;
      specialProp = _specialProps[p2];
      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }
      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = _replaceRandom(endValue);
      }
      if (specialProp) {
        specialProp(this, target, p2, endValue, tween) && (hasPriority = 1);
      } else if (p2.substr(0, 2) === "--") {
        startValue = (
          getComputedStyle(target).getPropertyValue(p2) + ""
        ).trim();
        endValue += "";
        _colorExp.lastIndex = 0;
        if (!_colorExp.test(startValue)) {
          startUnit = getUnit(startValue);
          endUnit = getUnit(endValue);
        }
        endUnit
          ? startUnit !== endUnit &&
            (startValue =
              _convertToUnit(target, p2, startValue, endUnit) + endUnit)
          : startUnit && (endValue += startUnit);
        this.add(
          style,
          "setProperty",
          startValue,
          endValue,
          index,
          targets,
          0,
          0,
          p2
        );
        props.push(p2);
        inlineProps.push(p2, 0, style[p2]);
      } else if (type !== "undefined") {
        if (startAt && p2 in startAt) {
          startValue =
            typeof startAt[p2] === "function"
              ? startAt[p2].call(tween, index, target, targets)
              : startAt[p2];
          _isString(startValue) &&
            ~startValue.indexOf("random(") &&
            (startValue = _replaceRandom(startValue));
          getUnit(startValue + "") ||
            (startValue +=
              _config.units[p2] || getUnit(_get(target, p2)) || "");
          (startValue + "").charAt(1) === "=" &&
            (startValue = _get(target, p2));
        } else {
          startValue = _get(target, p2);
        }
        startNum = parseFloat(startValue);
        relative =
          type === "string" &&
          endValue.charAt(1) === "=" &&
          endValue.substr(0, 2);
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);
        if (p2 in _propertyAliases) {
          if (p2 === "autoAlpha") {
            if (
              startNum === 1 &&
              _get(target, "visibility") === "hidden" &&
              endNum
            ) {
              startNum = 0;
            }
            inlineProps.push("visibility", 0, style.visibility);
            _addNonTweeningPT(
              this,
              style,
              "visibility",
              startNum ? "inherit" : "hidden",
              endNum ? "inherit" : "hidden",
              !endNum
            );
          }
          if (p2 !== "scale" && p2 !== "transform") {
            p2 = _propertyAliases[p2];
            ~p2.indexOf(",") && (p2 = p2.split(",")[0]);
          }
        }
        isTransformRelated = p2 in _transformProps;
        if (isTransformRelated) {
          this.styles.save(p2);
          if (!transformPropTween) {
            cache = target._gsap;
            (cache.renderTransform && !vars.parseTransform) ||
              _parseTransform(target, vars.parseTransform);
            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new PropTween(
              this._pt,
              style,
              _transformProp,
              0,
              1,
              cache.renderTransform,
              cache,
              0,
              -1
            );
            transformPropTween.dep = 1;
          }
          if (p2 === "scale") {
            this._pt = new PropTween(
              this._pt,
              cache,
              "scaleY",
              cache.scaleY,
              (relative
                ? _parseRelative(cache.scaleY, relative + endNum)
                : endNum) - cache.scaleY || 0,
              _renderCSSProp
            );
            this._pt.u = 0;
            props.push("scaleY", p2);
            p2 += "X";
          } else if (p2 === "transformOrigin") {
            inlineProps.push(
              _transformOriginProp,
              0,
              style[_transformOriginProp]
            );
            endValue = _convertKeywordsToPercentages(endValue);
            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0;
              endUnit !== cache.zOrigin &&
                _addNonTweeningPT(
                  this,
                  cache,
                  "zOrigin",
                  cache.zOrigin,
                  endUnit
                );
              _addNonTweeningPT(
                this,
                style,
                p2,
                _firstTwoOnly(startValue),
                _firstTwoOnly(endValue)
              );
            }
            continue;
          } else if (p2 === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);
            continue;
          } else if (p2 in _rotationalProperties) {
            _addRotationalPropTween(
              this,
              cache,
              p2,
              startNum,
              relative
                ? _parseRelative(startNum, relative + endValue)
                : endValue
            );
            continue;
          } else if (p2 === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
            continue;
          } else if (p2 === "force3D") {
            cache[p2] = endValue;
            continue;
          } else if (p2 === "transform") {
            _addRawTransformPTs(this, endValue, target);
            continue;
          }
        } else if (!(p2 in style)) {
          p2 = _checkPropPrefix(p2) || p2;
        }
        if (
          isTransformRelated ||
          ((endNum || endNum === 0) &&
            (startNum || startNum === 0) &&
            !_complexExp.test(endValue) &&
            p2 in style)
        ) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0);
          endUnit =
            getUnit(endValue) ||
            (p2 in _config.units ? _config.units[p2] : startUnit);
          startUnit !== endUnit &&
            (startNum = _convertToUnit(target, p2, startValue, endUnit));
          this._pt = new PropTween(
            this._pt,
            isTransformRelated ? cache : style,
            p2,
            startNum,
            (relative ? _parseRelative(startNum, relative + endNum) : endNum) -
              startNum,
            !isTransformRelated &&
            (endUnit === "px" || p2 === "zIndex") &&
            vars.autoRound !== false
              ? _renderRoundedCSSProp
              : _renderCSSProp
          );
          this._pt.u = endUnit || 0;
          if (startUnit !== endUnit && endUnit !== "%") {
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p2 in style)) {
          if (p2 in target) {
            this.add(
              target,
              p2,
              startValue || target[p2],
              relative ? relative + endValue : endValue,
              index,
              targets
            );
          } else if (p2 !== "parseTransform") {
            _missingPlugin(p2, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(
            this,
            target,
            p2,
            startValue,
            relative ? relative + endValue : endValue
          );
        }
        isTransformRelated ||
          (p2 in style
            ? inlineProps.push(p2, 0, style[p2])
            : inlineProps.push(p2, 1, startValue || target[p2]));
        props.push(p2);
      }
    }
    hasPriority && _sortPropTweensByPriority(this);
  },
  render: function render2(ratio, data) {
    if (data.tween._time || !_reverting()) {
      var pt2 = data._pt;
      while (pt2) {
        pt2.r(ratio, pt2.d);
        pt2 = pt2._next;
      }
    } else {
      data.styles.revert();
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    var p2 = _propertyAliases[property];
    p2 && p2.indexOf(",") < 0 && (property = p2);
    return property in _transformProps &&
      property !== _transformOriginProp &&
      (target._gsap.x || _get(target, "x"))
      ? plugin && _recentSetterPlugin === plugin
        ? property === "scale"
          ? _setterScale
          : _setterTransform
        : (_recentSetterPlugin = plugin || {}) &&
          (property === "scale"
            ? _setterScaleWithRender
            : _setterTransformWithRender)
      : target.style && !_isUndefined(target.style[property])
        ? _setterCSSStyle
        : ~property.indexOf("-")
          ? _setterCSSProp
          : _getSetter(target, property);
  },
  core: {
    _removeProperty,
    _getMatrix,
  },
};
gsap.utils.checkPrefix = _checkPropPrefix;
gsap.core.getStyleSaver = _getStyleSaver;
(function (positionAndScale, rotation, others, aliases) {
  var all = _forEachName(
    positionAndScale + "," + rotation + "," + others,
    function (name) {
      _transformProps[name] = 1;
    }
  );
  _forEachName(rotation, function (name) {
    _config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  _forEachName(aliases, function (name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})(
  "x,y,z,scale,scaleX,scaleY,xPercent,yPercent",
  "rotation,rotationX,rotationY,skewX,skewY",
  "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",
  "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY"
);
_forEachName(
  "x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",
  function (name) {
    _config.units[name] = "px";
  }
);
gsap.registerPlugin(CSSPlugin);
var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;
gsapWithCSS.core.Tween;
class Modal {
  constructor(modal, options = {}) {
    __publicField(this, "bodyLocker", (bool) => {
      const body = document.querySelector("body");
      if (bool) {
        body.style.overflow = "hidden";
      } else {
        body.style.overflow = "auto";
      }
    });
    __publicField(this, "focusTrap", () => {
      const firstFocusableElement = this.modal.querySelectorAll(
        this.focusableElements
      )[0];
      const focusableContent = this.modal.querySelectorAll(
        this.focusableElements
      );
      const lastFocusableElement =
        focusableContent[focusableContent.length - 1];
      if (focusableContent.length) {
        const onBtnClickHandler = (evt) => {
          const isTabPressed = evt.key === "Tab" || evt.key === 9;
          if (evt.key === "Escape") {
            document.removeEventListener("keydown", onBtnClickHandler);
          }
          if (!isTabPressed) {
            return;
          }
          if (evt.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              evt.preventDefault();
            }
          } else {
            if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              evt.preventDefault();
            }
          }
        };
        document.addEventListener("keydown", onBtnClickHandler);
        firstFocusableElement.focus();
      }
    });
    __publicField(this, "addListeners", () => {
      if (this.openers) {
        this.openers.forEach((opener2) => {
          opener2.removeEventListener("click", this.openModal);
        });
      }
      document.addEventListener("click", this.closeByOverlayClick);
      document.addEventListener("keydown", this.closeByEscBtn);
      if (this.close) {
        this.close.addEventListener("click", this.closeByBtnClick);
      }
    });
    __publicField(this, "refresh", () => {
      document.removeEventListener("click", this.closeByOverlayClick);
      document.removeEventListener("keydown", this.closeByEscBtn);
      if (this.close) {
        this.close.removeEventListener("click", this.closeByBtnClick);
      }
      gsapWithCSS.fromTo(
        this.overlay,
        { display: "flex" },
        {
          opacity: 0,
          display: "none",
          duration: 0.6,
          ease: "ease-in",
          onComplete: () => {
            this.modal.querySelectorAll("form").forEach((f2) => f2.reset());
          },
        }
      );
      !this.preventBodyLock ? this.bodyLocker(false) : null;
      this.preventBodyLock = false;
      if (this.openers) {
        this.openers.forEach((opener2) => {
          opener2.addEventListener("click", this.openModal);
        });
      }
    });
    __publicField(this, "closeByOverlayClick", (evt) => {
      if (evt.target === this.overlay) {
        this.refresh();
      }
    });
    __publicField(this, "closeByEscBtn", (evt) => {
      if (evt.key === "Escape") {
        this.refresh();
      }
    });
    __publicField(this, "closeByBtnClick", () => {
      this.refresh();
    });
    __publicField(this, "openModal", (evt) => {
      evt.preventDefault();
      this.bodyLocker(true);
      gsapWithCSS.fromTo(
        this.overlay,
        { display: "none", opacity: 0 },
        {
          display: "flex",
          opacity: 1,
          duration: 0.6,
          ease: "ease-in",
          onComplete: () => {
            this.addListeners();
            this.focusTrap();
          },
        }
      );
    });
    __publicField(this, "show", () => {
      this.bodyLocker(true);
      gsapWithCSS.fromTo(
        this.overlay,
        { display: "none", opacity: 0 },
        {
          display: "flex",
          opacity: 1,
          duration: 0.6,
          ease: "ease-in",
          onComplete: () => {
            this.addListeners();
            this.focusTrap();
          },
        }
      );
    });
    this.preventBodyLock = options.preventBodyLock ? true : false;
    this.modal = modal;
    this.overlay = this.modal.parentNode;
    this.close = this.modal.querySelector(".modal-closer");
    this.id = this.modal.getAttribute("id");
    this.openers = document.querySelectorAll(
      '[data-modal-opener="' + this.id + '"]'
    );
    this.isInited = false;
    this.focusableElements = [
      "a[href]",
      "input",
      "select",
      "textarea",
      "button",
      "iframe",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"])',
    ];
    this.init();
  }
  init() {
    if (this.openers) {
      this.isInited = true;
      this.openers.forEach((opener2) => {
        opener2.addEventListener("click", this.openModal);
      });
    } else {
      console.error(
        "Не добавлена кнопка открытия модального окна, либо в ней не прописан аттр-т: data-modal-opener={modal-id} "
      );
    }
  }
}
function limitStr(str, n2) {
  if (str.length > n2) {
    return str.slice(0, n2) + "...";
  } else {
    return str;
  }
}
const collapsedItems = document.querySelectorAll("[data-collapsed-text]");
if (collapsedItems.length) {
  const reviewModal = document.querySelector(".review-modal");
  collapsedItems.forEach((item) => {
    item.innerHTML = limitStr(item.innerHTML, item.dataset.collapsedText);
    const length = item.innerHTML.length;
    if (length > item.dataset.collapsedText) {
      const showBtn = document.createElement("button");
      showBtn.innerHTML = item.dataset.collapsedBtnText;
      item.append(showBtn);
      showBtn.addEventListener("click", () => {
        reviewModal.querySelector(".modal-text").innerHTML =
          item.dataset.expandedText;
        new Modal(reviewModal).show();
      });
    }
  });
}
const slider = document.querySelector(".reviews-slider");
if (slider) {
  new Swiper(slider, {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 5e3,
      disableOnInteraction: false,
    },
    pagination: {
      dynamicBullets: true,
      el: ".reviews-slider .swiper-pagination",
      clickable: true,
    },
  });
}
let thumbs = null;
const thumbsSlider = document.querySelector(".staff-preview-slider-thumbs");
if (thumbsSlider) {
  thumbs = new Swiper(thumbsSlider, {
    slidesPerView: "auto",
    spaceBetween: 10,
  });
}
const mainSlider = document.querySelector(".staff-preview-slider");
if (mainSlider) {
  const pagination = mainSlider.querySelector(".swiper-pagination");
  const btnNext = mainSlider.querySelector(".swiper-button-next");
  const btnPrev = mainSlider.querySelector(".swiper-button-prev");
  new Swiper(mainSlider, {
    modules: [Navigation, Pagination, Autoplay, Thumb],
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      600: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 1,
      },
    },
    navigation: {
      nextEl: btnNext ? btnNext : null,
      prevEl: btnPrev ? btnPrev : null,
    },
    pagination: {
      el: pagination ? pagination : null,
      dynamicBullets: true,
    },
    thumbs: {
      swiper: thumbs,
    },
  });
}
const accordeons = document.querySelectorAll(".accordeon");
if (accordeons) {
  accordeons.forEach((accordeon) => {
    const items2 = accordeon.querySelectorAll(".accordeon-header");
    items2.forEach((item) => {
      item.addEventListener("click", () => {
        item.parentNode.classList.toggle("expanded");
      });
    });
  });
}
const items$1 = document.querySelectorAll(".top-menu-inner-opener");
if (items$1.length) {
  items$1.forEach((item) => {
    item.addEventListener("click", (evt) => {
      evt.preventDefault();
      evt.currentTarget.closest("li").classList.toggle("expanded");
    });
  });
}
const opener = document.querySelector(".mobile-menu-opener");
const closer = document.querySelector(".mobile-menu-closer");
const menu = document.querySelector(".mobile-menu");
if (opener && closer && menu) {
  const tl = gsapWithCSS.timeline().pause();
  tl.fromTo(
    ".mobile-menu",
    { opacity: 0 },
    { display: "block", opacity: 1, duration: 0.4 }
  );
  tl.fromTo(
    ".mobile-menu__wrapper",
    { x: "-100vw", opacity: 0 },
    { opacity: 1, x: 0, duration: 0.4 },
    "-=.2"
  );
  const onClickOpenMenu = () => {
    tl.play();
    document.addEventListener("click", onOverlayClickHandler);
    window.addEventListener("keydown", onEscClickHandler);
  };
  const onOverlayClickHandler = (evt) => {
    if (evt.target.classList.contains("mobile-menu")) onClickCloseMenu();
  };
  const onEscClickHandler = (evt) => {
    if (evt.key === "Escape" || evt.code === 27) onClickCloseMenu();
  };
  const onClickCloseMenu = () => {
    tl.reverse();
    document.removeEventListener("click", onOverlayClickHandler);
    window.removeEventListener("keydown", onEscClickHandler);
  };
  closer.addEventListener("click", onClickCloseMenu);
  opener.addEventListener("click", onClickOpenMenu);
}
window.addEventListener("load", () => {
  const btn = document.createElement("button");
  btn.classList.add("scroll-up-btn");
  btn.setAttribute("aria-label", "В начало страницы");
  document.body.append(btn);
  let isActive = false;
  window.addEventListener("scroll", () => {
    const viewportHeight = document.documentElement.clientHeight;
    if (window.scrollY > viewportHeight * 1.3) {
      if (!isActive) {
        isActive = true;
        gsapWithCSS.fromTo(
          btn,
          {
            y: "150px",
          },
          {
            y: "0",
            duration: 0.7,
            ease: "back",
          }
        );
      }
    } else {
      if (isActive) {
        isActive = false;
        gsapWithCSS.fromTo(
          btn,
          {
            y: "0",
          },
          {
            y: "150px",
            duration: 0.5,
            ease: "linear",
          }
        );
      }
    }
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
function isString(str) {
  return typeof str === "string" || str instanceof String;
}
function isObject(obj) {
  var _obj$constructor;
  return (
    typeof obj === "object" &&
    obj != null &&
    (obj == null || (_obj$constructor = obj.constructor) == null
      ? void 0
      : _obj$constructor.name) === "Object"
  );
}
function pick(obj, keys) {
  if (Array.isArray(keys)) return pick(obj, (_2, k2) => keys.includes(k2));
  return Object.entries(obj).reduce((acc, _ref) => {
    let [k2, v2] = _ref;
    if (keys(v2, k2)) acc[k2] = v2;
    return acc;
  }, {});
}
const DIRECTION = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT",
};
function forceDirection(direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      return DIRECTION.FORCE_LEFT;
    case DIRECTION.RIGHT:
      return DIRECTION.FORCE_RIGHT;
    default:
      return direction;
  }
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function objectIncludes(b2, a2) {
  if (a2 === b2) return true;
  const arrA = Array.isArray(a2),
    arrB = Array.isArray(b2);
  let i2;
  if (arrA && arrB) {
    if (a2.length != b2.length) return false;
    for (i2 = 0; i2 < a2.length; i2++)
      if (!objectIncludes(a2[i2], b2[i2])) return false;
    return true;
  }
  if (arrA != arrB) return false;
  if (a2 && b2 && typeof a2 === "object" && typeof b2 === "object") {
    const dateA = a2 instanceof Date,
      dateB = b2 instanceof Date;
    if (dateA && dateB) return a2.getTime() == b2.getTime();
    if (dateA != dateB) return false;
    const regexpA = a2 instanceof RegExp,
      regexpB = b2 instanceof RegExp;
    if (regexpA && regexpB) return a2.toString() == b2.toString();
    if (regexpA != regexpB) return false;
    const keys = Object.keys(a2);
    for (i2 = 0; i2 < keys.length; i2++)
      if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) return false;
    for (i2 = 0; i2 < keys.length; i2++)
      if (!objectIncludes(b2[keys[i2]], a2[keys[i2]])) return false;
    return true;
  } else if (a2 && b2 && typeof a2 === "function" && typeof b2 === "function") {
    return a2.toString() === b2.toString();
  }
  return false;
}
class ActionDetails {
  /** Current input value */
  /** Current cursor position */
  /** Old input value */
  /** Old selection */
  constructor(opts) {
    Object.assign(this, opts);
    while (
      this.value.slice(0, this.startChangePos) !==
      this.oldValue.slice(0, this.startChangePos)
    ) {
      --this.oldSelection.start;
    }
    if (this.insertedCount) {
      while (
        this.value.slice(this.cursorPos) !==
        this.oldValue.slice(this.oldSelection.end)
      ) {
        if (
          this.value.length - this.cursorPos <
          this.oldValue.length - this.oldSelection.end
        )
          ++this.oldSelection.end;
        else ++this.cursorPos;
      }
    }
  }
  /** Start changing position */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  /** Inserted symbols count */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  /** Inserted symbols */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  /** Removed symbols count */
  get removedCount() {
    return Math.max(
      this.oldSelection.end - this.startChangePos || // for Delete
        this.oldValue.length - this.value.length,
      0
    );
  }
  /** Removed symbols */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  /** Unchanged head symbols */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  /** Unchanged tail symbols */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  /** Remove direction */
  get removeDirection() {
    if (!this.removedCount || this.insertedCount) return DIRECTION.NONE;
    return (this.oldSelection.end === this.cursorPos ||
      this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
      this.oldSelection.end === this.oldSelection.start
      ? DIRECTION.RIGHT
      : DIRECTION.LEFT;
  }
}
function IMask(el, opts) {
  return new IMask.InputMask(el, opts);
}
function maskedClass(mask) {
  if (mask == null) throw new Error("mask property should be defined");
  if (mask instanceof RegExp) return IMask.MaskedRegExp;
  if (isString(mask)) return IMask.MaskedPattern;
  if (mask === Date) return IMask.MaskedDate;
  if (mask === Number) return IMask.MaskedNumber;
  if (Array.isArray(mask) || mask === Array) return IMask.MaskedDynamic;
  if (IMask.Masked && mask.prototype instanceof IMask.Masked) return mask;
  if (IMask.Masked && mask instanceof IMask.Masked) return mask.constructor;
  if (mask instanceof Function) return IMask.MaskedFunction;
  console.warn("Mask not found for mask", mask);
  return IMask.Masked;
}
function normalizeOpts(opts) {
  if (!opts) throw new Error("Options in not defined");
  if (IMask.Masked) {
    if (opts.prototype instanceof IMask.Masked)
      return {
        mask: opts,
      };
    const { mask = void 0, ...instanceOpts } =
      opts instanceof IMask.Masked
        ? {
            mask: opts,
          }
        : isObject(opts) && opts.mask instanceof IMask.Masked
          ? opts
          : {};
    if (mask) {
      const _mask = mask.mask;
      return {
        ...pick(mask, (_2, k2) => !k2.startsWith("_")),
        mask: mask.constructor,
        _mask,
        ...instanceOpts,
      };
    }
  }
  if (!isObject(opts))
    return {
      mask: opts,
    };
  return {
    ...opts,
  };
}
function createMask(opts) {
  if (IMask.Masked && opts instanceof IMask.Masked) return opts;
  const nOpts = normalizeOpts(opts);
  const MaskedClass = maskedClass(nOpts.mask);
  if (!MaskedClass)
    throw new Error(
      "Masked class is not found for provided mask " +
        nOpts.mask +
        ", appropriate module needs to be imported manually before creating mask."
    );
  if (nOpts.mask === MaskedClass) delete nOpts.mask;
  if (nOpts._mask) {
    nOpts.mask = nOpts._mask;
    delete nOpts._mask;
  }
  return new MaskedClass(nOpts);
}
IMask.createMask = createMask;
class MaskElement {
  /** */
  /** */
  /** */
  /** Safely returns selection start */
  get selectionStart() {
    let start;
    try {
      start = this._unsafeSelectionStart;
    } catch {}
    return start != null ? start : this.value.length;
  }
  /** Safely returns selection end */
  get selectionEnd() {
    let end;
    try {
      end = this._unsafeSelectionEnd;
    } catch {}
    return end != null ? end : this.value.length;
  }
  /** Safely sets element selection */
  select(start, end) {
    if (
      start == null ||
      end == null ||
      (start === this.selectionStart && end === this.selectionEnd)
    )
      return;
    try {
      this._unsafeSelect(start, end);
    } catch {}
  }
  /** */
  get isActive() {
    return false;
  }
  /** */
  /** */
  /** */
}
IMask.MaskElement = MaskElement;
const KEY_Z = 90;
const KEY_Y = 89;
class HTMLMaskElement extends MaskElement {
  /** HTMLElement to use mask on */
  constructor(input) {
    super();
    this.input = input;
    this._onKeydown = this._onKeydown.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onBeforeinput = this._onBeforeinput.bind(this);
    this._onCompositionEnd = this._onCompositionEnd.bind(this);
  }
  get rootElement() {
    var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
    return (_this$input$getRootNo =
      (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) == null
        ? void 0
        : _this$input$getRootNo2.call(_this$input)) != null
      ? _this$input$getRootNo
      : document;
  }
  /** Is element in focus */
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  /** Binds HTMLElement events to mask internal events */
  bindEvents(handlers) {
    this.input.addEventListener("keydown", this._onKeydown);
    this.input.addEventListener("input", this._onInput);
    this.input.addEventListener("beforeinput", this._onBeforeinput);
    this.input.addEventListener("compositionend", this._onCompositionEnd);
    this.input.addEventListener("drop", handlers.drop);
    this.input.addEventListener("click", handlers.click);
    this.input.addEventListener("focus", handlers.focus);
    this.input.addEventListener("blur", handlers.commit);
    this._handlers = handlers;
  }
  _onKeydown(e2) {
    if (
      this._handlers.redo &&
      ((e2.keyCode === KEY_Z && e2.shiftKey && (e2.metaKey || e2.ctrlKey)) ||
        (e2.keyCode === KEY_Y && e2.ctrlKey))
    ) {
      e2.preventDefault();
      return this._handlers.redo(e2);
    }
    if (
      this._handlers.undo &&
      e2.keyCode === KEY_Z &&
      (e2.metaKey || e2.ctrlKey)
    ) {
      e2.preventDefault();
      return this._handlers.undo(e2);
    }
    if (!e2.isComposing) this._handlers.selectionChange(e2);
  }
  _onBeforeinput(e2) {
    if (e2.inputType === "historyUndo" && this._handlers.undo) {
      e2.preventDefault();
      return this._handlers.undo(e2);
    }
    if (e2.inputType === "historyRedo" && this._handlers.redo) {
      e2.preventDefault();
      return this._handlers.redo(e2);
    }
  }
  _onCompositionEnd(e2) {
    this._handlers.input(e2);
  }
  _onInput(e2) {
    if (!e2.isComposing) this._handlers.input(e2);
  }
  /** Unbinds HTMLElement events to mask internal events */
  unbindEvents() {
    this.input.removeEventListener("keydown", this._onKeydown);
    this.input.removeEventListener("input", this._onInput);
    this.input.removeEventListener("beforeinput", this._onBeforeinput);
    this.input.removeEventListener("compositionend", this._onCompositionEnd);
    this.input.removeEventListener("drop", this._handlers.drop);
    this.input.removeEventListener("click", this._handlers.click);
    this.input.removeEventListener("focus", this._handlers.focus);
    this.input.removeEventListener("blur", this._handlers.commit);
    this._handlers = {};
  }
}
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLInputMaskElement extends HTMLMaskElement {
  /** InputElement to use mask on */
  constructor(input) {
    super(input);
    this.input = input;
  }
  /** Returns InputElement selection start */
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null
      ? this.input.selectionStart
      : this.value.length;
  }
  /** Returns InputElement selection end */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  /** Sets InputElement selection */
  _unsafeSelect(start, end) {
    this.input.setSelectionRange(start, end);
  }
  get value() {
    return this.input.value;
  }
  set value(value) {
    this.input.value = value;
  }
}
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLContenteditableMaskElement extends HTMLMaskElement {
  /** Returns HTMLElement selection start */
  get _unsafeSelectionStart() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (
      focusOffset == null ||
      anchorOffset == null ||
      anchorOffset < focusOffset
    ) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Returns HTMLElement selection end */
  get _unsafeSelectionEnd() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (
      focusOffset == null ||
      anchorOffset == null ||
      anchorOffset > focusOffset
    ) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Sets HTMLElement selection */
  _unsafeSelect(start, end) {
    if (!this.rootElement.createRange) return;
    const range = this.rootElement.createRange();
    range.setStart(this.input.firstChild || this.input, start);
    range.setEnd(this.input.lastChild || this.input, end);
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  /** HTMLElement value */
  get value() {
    return this.input.textContent || "";
  }
  set value(value) {
    this.input.textContent = value;
  }
}
IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
class InputHistory {
  constructor() {
    this.states = [];
    this.currentIndex = 0;
  }
  get currentState() {
    return this.states[this.currentIndex];
  }
  get isEmpty() {
    return this.states.length === 0;
  }
  push(state) {
    if (this.currentIndex < this.states.length - 1)
      this.states.length = this.currentIndex + 1;
    this.states.push(state);
    if (this.states.length > InputHistory.MAX_LENGTH) this.states.shift();
    this.currentIndex = this.states.length - 1;
  }
  go(steps) {
    this.currentIndex = Math.min(
      Math.max(this.currentIndex + steps, 0),
      this.states.length - 1
    );
    return this.currentState;
  }
  undo() {
    return this.go(-1);
  }
  redo() {
    return this.go(1);
  }
  clear() {
    this.states.length = 0;
    this.currentIndex = 0;
  }
}
InputHistory.MAX_LENGTH = 100;
class InputMask {
  /**
    View element
  */
  /** Internal {@link Masked} model */
  constructor(el, opts) {
    this.el =
      el instanceof MaskElement
        ? el
        : el.isContentEditable &&
            el.tagName !== "INPUT" &&
            el.tagName !== "TEXTAREA"
          ? new HTMLContenteditableMaskElement(el)
          : new HTMLInputMaskElement(el);
    this.masked = createMask(opts);
    this._listeners = {};
    this._value = "";
    this._unmaskedValue = "";
    this._rawInputValue = "";
    this.history = new InputHistory();
    this._saveSelection = this._saveSelection.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onUndo = this._onUndo.bind(this);
    this._onRedo = this._onRedo.bind(this);
    this.alignCursor = this.alignCursor.bind(this);
    this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
    this._bindEvents();
    this.updateValue();
    this._onChange();
  }
  maskEquals(mask) {
    var _this$masked;
    return (
      mask == null ||
      ((_this$masked = this.masked) == null
        ? void 0
        : _this$masked.maskEquals(mask))
    );
  }
  /** Masked */
  get mask() {
    return this.masked.mask;
  }
  set mask(mask) {
    if (this.maskEquals(mask)) return;
    if (
      !(mask instanceof IMask.Masked) &&
      this.masked.constructor === maskedClass(mask)
    ) {
      this.masked.updateOptions({
        mask,
      });
      return;
    }
    const masked =
      mask instanceof IMask.Masked
        ? mask
        : createMask({
            mask,
          });
    masked.unmaskedValue = this.masked.unmaskedValue;
    this.masked = masked;
  }
  /** Raw value */
  get value() {
    return this._value;
  }
  set value(str) {
    if (this.value === str) return;
    this.masked.value = str;
    this.updateControl("auto");
  }
  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(str) {
    if (this.unmaskedValue === str) return;
    this.masked.unmaskedValue = str;
    this.updateControl("auto");
  }
  /** Raw input value */
  get rawInputValue() {
    return this._rawInputValue;
  }
  set rawInputValue(str) {
    if (this.rawInputValue === str) return;
    this.masked.rawInputValue = str;
    this.updateControl();
    this.alignCursor();
  }
  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(val) {
    if (this.masked.typedValueEquals(val)) return;
    this.masked.typedValue = val;
    this.updateControl("auto");
  }
  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }
  /** Starts listening to element events */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange,
      undo: this._onUndo,
      redo: this._onRedo,
    });
  }
  /** Stops listening to element events */
  _unbindEvents() {
    if (this.el) this.el.unbindEvents();
  }
  /** Fires custom event */
  _fireEvent(ev, e2) {
    const listeners = this._listeners[ev];
    if (!listeners) return;
    listeners.forEach((l2) => l2(e2));
  }
  /** Current selection start */
  get selectionStart() {
    return this._cursorChanging
      ? this._changingCursorPos
      : this.el.selectionStart;
  }
  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging
      ? this._changingCursorPos
      : this.el.selectionEnd;
  }
  set cursorPos(pos) {
    if (!this.el || !this.el.isActive) return;
    this.el.select(pos, pos);
    this._saveSelection();
  }
  /** Stores current selection */
  _saveSelection() {
    if (this.displayValue !== this.el.value) {
      console.warn(
        "Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly."
      );
    }
    this._selection = {
      start: this.selectionStart,
      end: this.cursorPos,
    };
  }
  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value;
    this._value = this.masked.value;
    this._unmaskedValue = this.masked.unmaskedValue;
    this._rawInputValue = this.masked.rawInputValue;
  }
  /** Syncronizes view from model value, fires change events */
  updateControl(cursorPos) {
    const newUnmaskedValue = this.masked.unmaskedValue;
    const newValue = this.masked.value;
    const newRawInputValue = this.masked.rawInputValue;
    const newDisplayValue = this.displayValue;
    const isChanged =
      this.unmaskedValue !== newUnmaskedValue ||
      this.value !== newValue ||
      this._rawInputValue !== newRawInputValue;
    this._unmaskedValue = newUnmaskedValue;
    this._value = newValue;
    this._rawInputValue = newRawInputValue;
    if (this.el.value !== newDisplayValue) this.el.value = newDisplayValue;
    if (cursorPos === "auto") this.alignCursor();
    else if (cursorPos != null) this.cursorPos = cursorPos;
    if (isChanged) this._fireChangeEvents();
    if (!this._historyChanging && (isChanged || this.history.isEmpty))
      this.history.push({
        unmaskedValue: newUnmaskedValue,
        selection: {
          start: this.selectionStart,
          end: this.cursorPos,
        },
      });
  }
  /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
  updateOptions(opts) {
    const { mask, ...restOpts } = opts;
    const updateMask = !this.maskEquals(mask);
    const updateOpts = this.masked.optionsIsChanged(restOpts);
    if (updateMask) this.mask = mask;
    if (updateOpts) this.masked.updateOptions(restOpts);
    if (updateMask || updateOpts) this.updateControl();
  }
  /** Updates cursor */
  updateCursor(cursorPos) {
    if (cursorPos == null) return;
    this.cursorPos = cursorPos;
    this._delayUpdateCursor(cursorPos);
  }
  /** Delays cursor update to support mobile browsers */
  _delayUpdateCursor(cursorPos) {
    this._abortUpdateCursor();
    this._changingCursorPos = cursorPos;
    this._cursorChanging = setTimeout(() => {
      if (!this.el) return;
      this.cursorPos = this._changingCursorPos;
      this._abortUpdateCursor();
    }, 10);
  }
  /** Fires custom events */
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent);
    if (this.masked.isComplete) this._fireEvent("complete", this._inputEvent);
  }
  /** Aborts delayed cursor update */
  _abortUpdateCursor() {
    if (this._cursorChanging) {
      clearTimeout(this._cursorChanging);
      delete this._cursorChanging;
    }
  }
  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(
      this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT)
    );
  }
  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    if (this.selectionStart !== this.cursorPos) return;
    this.alignCursor();
  }
  /** Adds listener on custom event */
  on(ev, handler) {
    if (!this._listeners[ev]) this._listeners[ev] = [];
    this._listeners[ev].push(handler);
    return this;
  }
  /** Removes custom event listener */
  off(ev, handler) {
    if (!this._listeners[ev]) return this;
    if (!handler) {
      delete this._listeners[ev];
      return this;
    }
    const hIndex = this._listeners[ev].indexOf(handler);
    if (hIndex >= 0) this._listeners[ev].splice(hIndex, 1);
    return this;
  }
  /** Handles view input event */
  _onInput(e2) {
    this._inputEvent = e2;
    this._abortUpdateCursor();
    const details = new ActionDetails({
      // new state
      value: this.el.value,
      cursorPos: this.cursorPos,
      // old state
      oldValue: this.displayValue,
      oldSelection: this._selection,
    });
    const oldRawValue = this.masked.rawInputValue;
    const offset = this.masked.splice(
      details.startChangePos,
      details.removed.length,
      details.inserted,
      details.removeDirection,
      {
        input: true,
        raw: true,
      }
    ).offset;
    const removeDirection =
      oldRawValue === this.masked.rawInputValue
        ? details.removeDirection
        : DIRECTION.NONE;
    let cursorPos = this.masked.nearestInputPos(
      details.startChangePos + offset,
      removeDirection
    );
    if (removeDirection !== DIRECTION.NONE)
      cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
    this.updateControl(cursorPos);
    delete this._inputEvent;
  }
  /** Handles view change event and commits model value */
  _onChange() {
    if (this.displayValue !== this.el.value) this.updateValue();
    this.masked.doCommit();
    this.updateControl();
    this._saveSelection();
  }
  /** Handles view drop event, prevents by default */
  _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  /** Restore last selection on focus */
  _onFocus(ev) {
    this.alignCursorFriendly();
  }
  /** Restore last selection on focus */
  _onClick(ev) {
    this.alignCursorFriendly();
  }
  _onUndo() {
    this._applyHistoryState(this.history.undo());
  }
  _onRedo() {
    this._applyHistoryState(this.history.redo());
  }
  _applyHistoryState(state) {
    if (!state) return;
    this._historyChanging = true;
    this.unmaskedValue = state.unmaskedValue;
    this.el.select(state.selection.start, state.selection.end);
    this._saveSelection();
    this._historyChanging = false;
  }
  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents();
    this._listeners.length = 0;
    delete this.el;
  }
}
IMask.InputMask = InputMask;
class ChangeDetails {
  /** Inserted symbols */
  /** Additional offset if any changes occurred before tail */
  /** Raw inserted is used by dynamic mask */
  /** Can skip chars */
  static normalize(prep) {
    return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
  }
  constructor(details) {
    Object.assign(
      this,
      {
        inserted: "",
        rawInserted: "",
        tailShift: 0,
        skip: false,
      },
      details
    );
  }
  /** Aggregate changes */
  aggregate(details) {
    this.inserted += details.inserted;
    this.rawInserted += details.rawInserted;
    this.tailShift += details.tailShift;
    this.skip = this.skip || details.skip;
    return this;
  }
  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
  get consumed() {
    return Boolean(this.rawInserted) || this.skip;
  }
  equals(details) {
    return (
      this.inserted === details.inserted &&
      this.tailShift === details.tailShift &&
      this.rawInserted === details.rawInserted &&
      this.skip === details.skip
    );
  }
}
IMask.ChangeDetails = ChangeDetails;
class ContinuousTailDetails {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor(value, from, stop) {
    if (value === void 0) {
      value = "";
    }
    if (from === void 0) {
      from = 0;
    }
    this.value = value;
    this.from = from;
    this.stop = stop;
  }
  toString() {
    return this.value;
  }
  extend(tail) {
    this.value += String(tail);
  }
  appendTo(masked) {
    return masked
      .append(this.toString(), {
        tail: true,
      })
      .aggregate(masked._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop,
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
  unshift(beforePos) {
    if (!this.value.length || (beforePos != null && this.from >= beforePos))
      return "";
    const shiftChar = this.value[0];
    this.value = this.value.slice(1);
    return shiftChar;
  }
  shift() {
    if (!this.value.length) return "";
    const shiftChar = this.value[this.value.length - 1];
    this.value = this.value.slice(0, -1);
    return shiftChar;
  }
}
class Masked {
  /** */
  /** */
  /** Transforms value before mask processing */
  /** Transforms each char before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing at the end of editing */
  /** Format typed value to string */
  /** Parse string to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    this._value = "";
    this._update({
      ...Masked.DEFAULTS,
      ...opts,
    });
    this._initialized = true;
  }
  /** Sets and applies new options */
  updateOptions(opts) {
    if (!this.optionsIsChanged(opts)) return;
    this.withValueRefresh(this._update.bind(this, opts));
  }
  /** Sets new options */
  _update(opts) {
    Object.assign(this, opts);
  }
  /** Mask state */
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
    };
  }
  set state(state) {
    this._value = state._value;
  }
  /** Resets value */
  reset() {
    this._value = "";
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this.resolve(value, {
      input: true,
    });
  }
  /** Resolve new value */
  resolve(value, flags) {
    if (flags === void 0) {
      flags = {
        input: true,
      };
    }
    this.reset();
    this.append(value, flags, "");
    this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(value) {
    this.resolve(value, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(value) {
    if (this.format) {
      this.value = this.format(value, this);
    } else {
      this.unmaskedValue = String(value);
    }
  }
  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, {
      raw: true,
    });
  }
  set rawInputValue(value) {
    this.resolve(value, {
      raw: true,
    });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return this.isComplete;
  }
  /** Finds nearest input position in direction */
  nearestInputPos(cursorPos, direction) {
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return Math.min(this.displayValue.length, toPos - fromPos);
  }
  /** Extracts value in range considering flags */
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return this.displayValue.slice(fromPos, toPos);
  }
  /** Extracts tail in range */
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return new ContinuousTailDetails(
      this.extractInput(fromPos, toPos),
      fromPos
    );
  }
  /** Appends tail */
  appendTail(tail) {
    if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(ch, flags) {
    if (!ch) return new ChangeDetails();
    this._value += ch;
    return new ChangeDetails({
      inserted: ch,
      rawInserted: ch,
    });
  }
  /** Appends char */
  _appendChar(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const consistentState = this.state;
    let details;
    [ch, details] = this.doPrepareChar(ch, flags);
    if (ch) {
      details = details.aggregate(this._appendCharRaw(ch, flags));
      if (!details.rawInserted && this.autofix === "pad") {
        const noFixState = this.state;
        this.state = consistentState;
        let fixDetails = this.pad(flags);
        const chDetails = this._appendCharRaw(ch, flags);
        fixDetails = fixDetails.aggregate(chDetails);
        if (chDetails.rawInserted || fixDetails.equals(details)) {
          details = fixDetails;
        } else {
          this.state = noFixState;
        }
      }
    }
    if (details.inserted) {
      let consistentTail;
      let appended = this.doValidate(flags) !== false;
      if (appended && checkTail != null) {
        const beforeTailState = this.state;
        if (this.overwrite === true) {
          consistentTail = checkTail.state;
          for (let i2 = 0; i2 < details.rawInserted.length; ++i2) {
            checkTail.unshift(this.displayValue.length - details.tailShift);
          }
        }
        let tailDetails = this.appendTail(checkTail);
        appended =
          tailDetails.rawInserted.length === checkTail.toString().length;
        if (!(appended && tailDetails.inserted) && this.overwrite === "shift") {
          this.state = beforeTailState;
          consistentTail = checkTail.state;
          for (let i2 = 0; i2 < details.rawInserted.length; ++i2) {
            checkTail.shift();
          }
          tailDetails = this.appendTail(checkTail);
          appended =
            tailDetails.rawInserted.length === checkTail.toString().length;
        }
        if (appended && tailDetails.inserted) this.state = beforeTailState;
      }
      if (!appended) {
        details = new ChangeDetails();
        this.state = consistentState;
        if (checkTail && consistentTail) checkTail.state = consistentTail;
      }
    }
    return details;
  }
  /** Appends optional placeholder at the end */
  _appendPlaceholder() {
    return new ChangeDetails();
  }
  /** Appends optional eager placeholder at the end */
  _appendEager() {
    return new ChangeDetails();
  }
  /** Appends symbols considering flags */
  append(str, flags, tail) {
    if (!isString(str)) throw new Error("value should be string");
    const checkTail = isString(tail)
      ? new ContinuousTailDetails(String(tail))
      : tail;
    if (flags != null && flags.tail) flags._beforeTailState = this.state;
    let details;
    [str, details] = this.doPrepare(str, flags);
    for (let ci = 0; ci < str.length; ++ci) {
      const d2 = this._appendChar(str[ci], flags, checkTail);
      if (!d2.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail))
        break;
      details.aggregate(d2);
    }
    if (
      (this.eager === true || this.eager === "append") &&
      flags != null &&
      flags.input &&
      str
    ) {
      details.aggregate(this._appendEager());
    }
    if (checkTail != null) {
      details.tailShift += this.appendTail(checkTail).tailShift;
    }
    return details;
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    this._value =
      this.displayValue.slice(0, fromPos) + this.displayValue.slice(toPos);
    return new ChangeDetails();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(fn) {
    if (this._refreshing || !this._initialized) return fn();
    this._refreshing = true;
    const rawInput = this.rawInputValue;
    const value = this.value;
    const ret = fn();
    this.rawInputValue = rawInput;
    if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
      this.append(value.slice(this.displayValue.length), {}, "");
      this.doCommit();
    }
    delete this._refreshing;
    return ret;
  }
  runIsolated(fn) {
    if (this._isolated || !this._initialized) return fn(this);
    this._isolated = true;
    const state = this.state;
    const ret = fn(this);
    this.state = state;
    delete this._isolated;
    return ret;
  }
  doSkipInvalid(ch, flags, checkTail) {
    return Boolean(this.skipInvalid);
  }
  /** Prepares string before mask processing */
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(
      this.prepare ? this.prepare(str, this, flags) : str
    );
  }
  /** Prepares each char before mask processing */
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(
      this.prepareChar ? this.prepareChar(str, this, flags) : str
    );
  }
  /** Validates if value is acceptable */
  doValidate(flags) {
    return (
      (!this.validate || this.validate(this.value, this, flags)) &&
      (!this.parent || this.parent.doValidate(flags))
    );
  }
  /** Does additional processing at the end of editing */
  doCommit() {
    if (this.commit) this.commit(this.value, this);
  }
  splice(start, deleteCount, inserted, removeDirection, flags) {
    if (inserted === void 0) {
      inserted = "";
    }
    if (removeDirection === void 0) {
      removeDirection = DIRECTION.NONE;
    }
    if (flags === void 0) {
      flags = {
        input: true,
      };
    }
    const tailPos = start + deleteCount;
    const tail = this.extractTail(tailPos);
    const eagerRemove = this.eager === true || this.eager === "remove";
    let oldRawValue;
    if (eagerRemove) {
      removeDirection = forceDirection(removeDirection);
      oldRawValue = this.extractInput(0, tailPos, {
        raw: true,
      });
    }
    let startChangePos = start;
    const details = new ChangeDetails();
    if (removeDirection !== DIRECTION.NONE) {
      startChangePos = this.nearestInputPos(
        start,
        deleteCount > 1 && start !== 0 && !eagerRemove
          ? DIRECTION.NONE
          : removeDirection
      );
      details.tailShift = startChangePos - start;
    }
    details.aggregate(this.remove(startChangePos));
    if (
      eagerRemove &&
      removeDirection !== DIRECTION.NONE &&
      oldRawValue === this.rawInputValue
    ) {
      if (removeDirection === DIRECTION.FORCE_LEFT) {
        let valLength;
        while (
          oldRawValue === this.rawInputValue &&
          (valLength = this.displayValue.length)
        ) {
          details
            .aggregate(
              new ChangeDetails({
                tailShift: -1,
              })
            )
            .aggregate(this.remove(valLength - 1));
        }
      } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
        tail.unshift();
      }
    }
    return details.aggregate(this.append(inserted, flags, tail));
  }
  maskEquals(mask) {
    return this.mask === mask;
  }
  optionsIsChanged(opts) {
    return !objectIncludes(this, opts);
  }
  typedValueEquals(value) {
    const tval = this.typedValue;
    return (
      value === tval ||
      (Masked.EMPTY_VALUES.includes(value) &&
        Masked.EMPTY_VALUES.includes(tval)) ||
      (this.format
        ? this.format(value, this) === this.format(this.typedValue, this)
        : false)
    );
  }
  pad(flags) {
    return new ChangeDetails();
  }
}
Masked.DEFAULTS = {
  skipInvalid: true,
};
Masked.EMPTY_VALUES = [void 0, null, ""];
IMask.Masked = Masked;
class ChunksTailDetails {
  /** */
  constructor(chunks, from) {
    if (chunks === void 0) {
      chunks = [];
    }
    if (from === void 0) {
      from = 0;
    }
    this.chunks = chunks;
    this.from = from;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(tailChunk) {
    if (!String(tailChunk)) return;
    tailChunk = isString(tailChunk)
      ? new ContinuousTailDetails(String(tailChunk))
      : tailChunk;
    const lastChunk = this.chunks[this.chunks.length - 1];
    const extendLast =
      lastChunk && // if stops are same or tail has no stop
      (lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
      tailChunk.from === lastChunk.from + lastChunk.toString().length;
    if (tailChunk instanceof ContinuousTailDetails) {
      if (extendLast) {
        lastChunk.extend(tailChunk.toString());
      } else {
        this.chunks.push(tailChunk);
      }
    } else if (tailChunk instanceof ChunksTailDetails) {
      if (tailChunk.stop == null) {
        let firstTailChunk;
        while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
          firstTailChunk = tailChunk.chunks.shift();
          firstTailChunk.from += tailChunk.from;
          this.extend(firstTailChunk);
        }
      }
      if (tailChunk.toString()) {
        tailChunk.stop = tailChunk.blockIndex;
        this.chunks.push(tailChunk);
      }
    }
  }
  appendTo(masked) {
    if (!(masked instanceof IMask.MaskedPattern)) {
      const tail = new ContinuousTailDetails(this.toString());
      return tail.appendTo(masked);
    }
    const details = new ChangeDetails();
    for (let ci = 0; ci < this.chunks.length; ++ci) {
      const chunk = this.chunks[ci];
      const lastBlockIter = masked._mapPosToBlock(masked.displayValue.length);
      const stop = chunk.stop;
      let chunkBlock;
      if (
        stop != null && // if block not found or stop is behind lastBlock
        (!lastBlockIter || lastBlockIter.index <= stop)
      ) {
        if (
          chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
          masked._stops.indexOf(stop) >= 0
        ) {
          details.aggregate(masked._appendPlaceholder(stop));
        }
        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
      }
      if (chunkBlock) {
        const tailDetails = chunkBlock.appendTail(chunk);
        details.aggregate(tailDetails);
        const remainChars = chunk
          .toString()
          .slice(tailDetails.rawInserted.length);
        if (remainChars)
          details.aggregate(
            masked.append(remainChars, {
              tail: true,
            })
          );
      } else {
        details.aggregate(
          masked.append(chunk.toString(), {
            tail: true,
          })
        );
      }
    }
    return details;
  }
  get state() {
    return {
      chunks: this.chunks.map((c2) => c2.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex,
    };
  }
  set state(state) {
    const { chunks, ...props } = state;
    Object.assign(this, props);
    this.chunks = chunks.map((cstate) => {
      const chunk =
        "chunks" in cstate
          ? new ChunksTailDetails()
          : new ContinuousTailDetails();
      chunk.state = cstate;
      return chunk;
    });
  }
  unshift(beforePos) {
    if (!this.chunks.length || (beforePos != null && this.from >= beforePos))
      return "";
    const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
    let ci = 0;
    while (ci < this.chunks.length) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.unshift(chunkShiftPos);
      if (chunk.toString()) {
        if (!shiftChar) break;
        ++ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length) return "";
    let ci = this.chunks.length - 1;
    while (0 <= ci) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.shift();
      if (chunk.toString()) {
        if (!shiftChar) break;
        --ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar) return shiftChar;
    }
    return "";
  }
}
class PatternCursor {
  constructor(masked, pos) {
    this.masked = masked;
    this._log = [];
    const { offset, index } =
      masked._mapPosToBlock(pos) ||
      (pos < 0
        ? // first
          {
            index: 0,
            offset: 0,
          }
        : // last
          {
            index: this.masked._blocks.length,
            offset: 0,
          });
    this.offset = offset;
    this.index = index;
    this.ok = false;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok,
    };
  }
  set state(s2) {
    Object.assign(this, s2);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const s2 = this._log.pop();
    if (s2) this.state = s2;
    return s2;
  }
  bindBlock() {
    if (this.block) return;
    if (this.index < 0) {
      this.index = 0;
      this.offset = 0;
    }
    if (this.index >= this.masked._blocks.length) {
      this.index = this.masked._blocks.length - 1;
      this.offset = this.block.displayValue.length;
    }
  }
  _pushLeft(fn) {
    this.pushState();
    for (
      this.bindBlock();
      0 <= this.index;
      --this.index,
        this.offset =
          ((_this$block = this.block) == null
            ? void 0
            : _this$block.displayValue.length) || 0
    ) {
      var _this$block;
      if (fn()) return (this.ok = true);
    }
    return (this.ok = false);
  }
  _pushRight(fn) {
    this.pushState();
    for (
      this.bindBlock();
      this.index < this.masked._blocks.length;
      ++this.index, this.offset = 0
    ) {
      if (fn()) return (this.ok = true);
    }
    return (this.ok = false);
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(
        this.offset,
        DIRECTION.FORCE_LEFT
      );
      if (this.offset !== 0) return true;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (this.block.isFixed) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (this.block.isFixed || (this.block.isOptional && !this.block.value))
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (this.block.isFixed || !this.block.value) return;
      this.offset = this.block.nearestInputPos(
        this.offset,
        DIRECTION.FORCE_RIGHT
      );
      if (this.offset !== this.block.value.length) return true;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (this.block.isFixed) return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (this.block.isFixed || (this.block.isOptional && !this.block.value))
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
}
class PatternFixedDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    Object.assign(this, opts);
    this._value = "";
    this.isFixed = true;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = false;
    this._value = "";
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
    if (!this._value) this._isRawInput = false;
    return new ChangeDetails();
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this._value.length;
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return minPos;
      case DIRECTION.NONE:
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
      default:
        return maxPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    return this._isRawInput ? toPos - fromPos : 0;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    return (
      (flags.raw && this._isRawInput && this._value.slice(fromPos, toPos)) || ""
    );
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return Boolean(this._value);
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (this.isFilled) return new ChangeDetails();
    const appendEager = this.eager === true || this.eager === "append";
    const appended = this.char === ch;
    const isResolved =
      appended &&
      (this.isUnmasking || flags.input || flags.raw) &&
      (!flags.raw || !appendEager) &&
      !flags.tail;
    const details = new ChangeDetails({
      inserted: this.char,
      rawInserted: isResolved ? this.char : "",
    });
    this._value = this.char;
    this._isRawInput = isResolved && (flags.raw || flags.input);
    return details;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: true,
    });
  }
  _appendPlaceholder() {
    const details = new ChangeDetails();
    if (this.isFilled) return details;
    this._value = details.inserted = this.char;
    return details;
  }
  extractTail() {
    return new ContinuousTailDetails("");
  }
  appendTail(tail) {
    if (isString(tail)) tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  append(str, flags, tail) {
    const details = this._appendChar(str[0], flags);
    if (tail != null) {
      details.tailShift += this.appendTail(tail).tailShift;
    }
    return details;
  }
  doCommit() {}
  get state() {
    return {
      _value: this._value,
      _rawInputValue: this.rawInputValue,
    };
  }
  set state(state) {
    this._value = state._value;
    this._isRawInput = Boolean(state._rawInputValue);
  }
  pad(flags) {
    return this._appendPlaceholder();
  }
}
class PatternInputDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    const {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager,
      ...maskOpts
    } = opts;
    this.masked = createMask(maskOpts);
    Object.assign(this, {
      parent,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager,
    });
  }
  reset() {
    this.isFilled = false;
    this.masked.reset();
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    if (fromPos === 0 && toPos >= 1) {
      this.isFilled = false;
      return this.masked.remove(fromPos, toPos);
    }
    return new ChangeDetails();
  }
  get value() {
    return (
      this.masked.value ||
      (this.isFilled && !this.isOptional ? this.placeholderChar : "")
    );
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return (this.masked.value && this.displayChar) || this.value;
  }
  get isComplete() {
    return Boolean(this.masked.value) || this.isOptional;
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (this.isFilled) return new ChangeDetails();
    const state = this.masked.state;
    let details = this.masked._appendChar(ch, this.currentMaskFlags(flags));
    if (details.inserted && this.doValidate(flags) === false) {
      details = new ChangeDetails();
      this.masked.state = state;
    }
    if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
      details.inserted = this.placeholderChar;
    }
    details.skip = !details.inserted && !this.isOptional;
    this.isFilled = Boolean(details.inserted);
    return details;
  }
  append(str, flags, tail) {
    return this.masked.append(str, this.currentMaskFlags(flags), tail);
  }
  _appendPlaceholder() {
    if (this.isFilled || this.isOptional) return new ChangeDetails();
    this.isFilled = true;
    return new ChangeDetails({
      inserted: this.placeholderChar,
    });
  }
  _appendEager() {
    return new ChangeDetails();
  }
  extractTail(fromPos, toPos) {
    return this.masked.extractTail(fromPos, toPos);
  }
  appendTail(tail) {
    return this.masked.appendTail(tail);
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.masked.extractInput(fromPos, toPos, flags);
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this.value.length;
    const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return this.isComplete ? boundPos : minPos;
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
        return this.isComplete ? boundPos : maxPos;
      case DIRECTION.NONE:
      default:
        return boundPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.value.slice(fromPos, toPos).length;
  }
  doValidate(flags) {
    return (
      this.masked.doValidate(this.currentMaskFlags(flags)) &&
      (!this.parent || this.parent.doValidate(this.currentMaskFlags(flags)))
    );
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled,
    };
  }
  set state(state) {
    this.masked.state = state.masked;
    this.isFilled = state.isFilled;
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta;
    return {
      ...flags,
      _beforeTailState:
        (flags == null ||
        (_flags$_beforeTailSta = flags._beforeTailState) == null
          ? void 0
          : _flags$_beforeTailSta.masked) ||
        (flags == null ? void 0 : flags._beforeTailState),
    };
  }
  pad(flags) {
    return new ChangeDetails();
  }
}
PatternInputDefinition.DEFAULT_DEFINITIONS = {
  0: /\d/,
  a: /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./,
};
class MaskedRegExp extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const mask = opts.mask;
    if (mask) opts.validate = (value) => value.search(mask) >= 0;
    super._update(opts);
  }
}
IMask.MaskedRegExp = MaskedRegExp;
class MaskedPattern extends Masked {
  /** */
  /** */
  /** Single char for empty input */
  /** Single char for filled input */
  /** Show placeholder only when needed */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(opts) {
    super({
      ...MaskedPattern.DEFAULTS,
      ...opts,
      definitions: Object.assign(
        {},
        PatternInputDefinition.DEFAULT_DEFINITIONS,
        opts == null ? void 0 : opts.definitions
      ),
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    opts.definitions = Object.assign({}, this.definitions, opts.definitions);
    super._update(opts);
    this._rebuildMask();
  }
  _rebuildMask() {
    const defs = this.definitions;
    this._blocks = [];
    this.exposeBlock = void 0;
    this._stops = [];
    this._maskedBlocks = {};
    const pattern = this.mask;
    if (!pattern || !defs) return;
    let unmaskingBlock = false;
    let optionalBlock = false;
    for (let i2 = 0; i2 < pattern.length; ++i2) {
      if (this.blocks) {
        const p2 = pattern.slice(i2);
        const bNames = Object.keys(this.blocks).filter(
          (bName2) => p2.indexOf(bName2) === 0
        );
        bNames.sort((a2, b2) => b2.length - a2.length);
        const bName = bNames[0];
        if (bName) {
          const { expose, repeat, ...bOpts } = normalizeOpts(
            this.blocks[bName]
          );
          const blockOpts = {
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite,
            autofix: this.autofix,
            ...bOpts,
            repeat,
            parent: this,
          };
          const maskedBlock =
            repeat != null
              ? new IMask.RepeatBlock(
                  blockOpts
                  /* TODO */
                )
              : createMask(blockOpts);
          if (maskedBlock) {
            this._blocks.push(maskedBlock);
            if (expose) this.exposeBlock = maskedBlock;
            if (!this._maskedBlocks[bName]) this._maskedBlocks[bName] = [];
            this._maskedBlocks[bName].push(this._blocks.length - 1);
          }
          i2 += bName.length - 1;
          continue;
        }
      }
      let char = pattern[i2];
      let isInput = char in defs;
      if (char === MaskedPattern.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (char === "{" || char === "}") {
        unmaskingBlock = !unmaskingBlock;
        continue;
      }
      if (char === "[" || char === "]") {
        optionalBlock = !optionalBlock;
        continue;
      }
      if (char === MaskedPattern.ESCAPE_CHAR) {
        ++i2;
        char = pattern[i2];
        if (!char) break;
        isInput = false;
      }
      const def = isInput
        ? new PatternInputDefinition({
            isOptional: optionalBlock,
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            ...normalizeOpts(defs[char]),
            parent: this,
          })
        : new PatternFixedDefinition({
            char,
            eager: this.eager,
            isUnmasking: unmaskingBlock,
          });
      this._blocks.push(def);
    }
  }
  get state() {
    return {
      ...super.state,
      _blocks: this._blocks.map((b2) => b2.state),
    };
  }
  set state(state) {
    if (!state) {
      this.reset();
      return;
    }
    const { _blocks, ...maskedState } = state;
    this._blocks.forEach((b2, bi) => (b2.state = _blocks[bi]));
    super.state = maskedState;
  }
  reset() {
    super.reset();
    this._blocks.forEach((b2) => b2.reset());
  }
  get isComplete() {
    return this.exposeBlock
      ? this.exposeBlock.isComplete
      : this._blocks.every((b2) => b2.isComplete);
  }
  get isFilled() {
    return this._blocks.every((b2) => b2.isFilled);
  }
  get isFixed() {
    return this._blocks.every((b2) => b2.isFixed);
  }
  get isOptional() {
    return this._blocks.every((b2) => b2.isOptional);
  }
  doCommit() {
    this._blocks.forEach((b2) => b2.doCommit());
    super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock
      ? this.exposeBlock.unmaskedValue
      : this._blocks.reduce((str, b2) => (str += b2.unmaskedValue), "");
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeBlock) {
      const tail = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      this.exposeBlock.unmaskedValue = unmaskedValue;
      this.appendTail(tail);
      this.doCommit();
    } else super.unmaskedValue = unmaskedValue;
  }
  get value() {
    return this.exposeBlock
      ? this.exposeBlock.value
      : // TODO return _value when not in change?
        this._blocks.reduce((str, b2) => (str += b2.value), "");
  }
  set value(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      this.exposeBlock.value = value;
      this.appendTail(tail);
      this.doCommit();
    } else super.value = value;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(
        this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
          this.exposeBlock.displayValue.length
      );
      this.exposeBlock.typedValue = value;
      this.appendTail(tail);
      this.doCommit();
    } else super.typedValue = value;
  }
  get displayValue() {
    return this._blocks.reduce((str, b2) => (str += b2.displayValue), "");
  }
  appendTail(tail) {
    return super.appendTail(tail).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var _this$_mapPosToBlock;
    const details = new ChangeDetails();
    let startBlockIndex =
      (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) ==
      null
        ? void 0
        : _this$_mapPosToBlock.index;
    if (startBlockIndex == null) return details;
    if (this._blocks[startBlockIndex].isFilled) ++startBlockIndex;
    for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
      const d2 = this._blocks[bi]._appendEager();
      if (!d2.inserted) break;
      details.aggregate(d2);
    }
    return details;
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const blockIter = this._mapPosToBlock(this.displayValue.length);
    const details = new ChangeDetails();
    if (!blockIter) return details;
    for (let bi = blockIter.index, block; (block = this._blocks[bi]); ++bi) {
      var _flags$_beforeTailSta;
      const blockDetails = block._appendChar(ch, {
        ...flags,
        _beforeTailState:
          (_flags$_beforeTailSta = flags._beforeTailState) == null ||
          (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null
            ? void 0
            : _flags$_beforeTailSta[bi],
      });
      details.aggregate(blockDetails);
      if (blockDetails.consumed) break;
    }
    return details;
  }
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const chunkTail = new ChunksTailDetails();
    if (fromPos === toPos) return chunkTail;
    this._forEachBlocksInRange(fromPos, toPos, (b2, bi, bFromPos, bToPos) => {
      const blockChunk = b2.extractTail(bFromPos, bToPos);
      blockChunk.stop = this._findStopBefore(bi);
      blockChunk.from = this._blockStartPos(bi);
      if (blockChunk instanceof ChunksTailDetails) blockChunk.blockIndex = bi;
      chunkTail.extend(blockChunk);
    });
    return chunkTail;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    if (fromPos === toPos) return "";
    let input = "";
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, fromPos2, toPos2) => {
      input += b2.extractInput(fromPos2, toPos2, flags);
    });
    return input;
  }
  _findStopBefore(blockIndex) {
    let stopBefore;
    for (let si = 0; si < this._stops.length; ++si) {
      const stop = this._stops[si];
      if (stop <= blockIndex) stopBefore = stop;
      else break;
    }
    return stopBefore;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(toBlockIndex) {
    const details = new ChangeDetails();
    if (this.lazy && toBlockIndex == null) return details;
    const startBlockIter = this._mapPosToBlock(this.displayValue.length);
    if (!startBlockIter) return details;
    const startBlockIndex = startBlockIter.index;
    const endBlockIndex =
      toBlockIndex != null ? toBlockIndex : this._blocks.length;
    this._blocks.slice(startBlockIndex, endBlockIndex).forEach((b2) => {
      if (!b2.lazy || toBlockIndex != null) {
        var _blocks2;
        details.aggregate(
          b2._appendPlaceholder(
            (_blocks2 = b2._blocks) == null ? void 0 : _blocks2.length
          )
        );
      }
    });
    return details;
  }
  /** Finds block in pos */
  _mapPosToBlock(pos) {
    let accVal = "";
    for (let bi = 0; bi < this._blocks.length; ++bi) {
      const block = this._blocks[bi];
      const blockStartPos = accVal.length;
      accVal += block.displayValue;
      if (pos <= accVal.length) {
        return {
          index: bi,
          offset: pos - blockStartPos,
        };
      }
    }
  }
  _blockStartPos(blockIndex) {
    return this._blocks
      .slice(0, blockIndex)
      .reduce((pos, b2) => (pos += b2.displayValue.length), 0);
  }
  _forEachBlocksInRange(fromPos, toPos, fn) {
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const fromBlockIter = this._mapPosToBlock(fromPos);
    if (fromBlockIter) {
      const toBlockIter = this._mapPosToBlock(toPos);
      const isSameBlock =
        toBlockIter && fromBlockIter.index === toBlockIter.index;
      const fromBlockStartPos = fromBlockIter.offset;
      const fromBlockEndPos =
        toBlockIter && isSameBlock
          ? toBlockIter.offset
          : this._blocks[fromBlockIter.index].displayValue.length;
      fn(
        this._blocks[fromBlockIter.index],
        fromBlockIter.index,
        fromBlockStartPos,
        fromBlockEndPos
      );
      if (toBlockIter && !isSameBlock) {
        for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
          fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
        }
        fn(
          this._blocks[toBlockIter.index],
          toBlockIter.index,
          0,
          toBlockIter.offset
        );
      }
    }
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const removeDetails = super.remove(fromPos, toPos);
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, bFromPos, bToPos) => {
      removeDetails.aggregate(b2.remove(bFromPos, bToPos));
    });
    return removeDetails;
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    if (!this._blocks.length) return 0;
    const cursor = new PatternCursor(this, cursorPos);
    if (direction === DIRECTION.NONE) {
      if (cursor.pushRightBeforeInput()) return cursor.pos;
      cursor.popState();
      if (cursor.pushLeftBeforeInput()) return cursor.pos;
      return this.displayValue.length;
    }
    if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeFilled();
        if (cursor.ok && cursor.pos === cursorPos) return cursorPos;
        cursor.popState();
      }
      cursor.pushLeftBeforeInput();
      cursor.pushLeftBeforeRequired();
      cursor.pushLeftBeforeFilled();
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeInput();
        cursor.pushRightBeforeRequired();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
        if (cursor.ok && cursor.pos <= cursorPos) return cursor.pos;
        cursor.popState();
      }
      if (cursor.ok) return cursor.pos;
      if (direction === DIRECTION.FORCE_LEFT) return 0;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      return 0;
    }
    if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
      cursor.pushRightBeforeInput();
      cursor.pushRightBeforeRequired();
      if (cursor.pushRightBeforeFilled()) return cursor.pos;
      if (direction === DIRECTION.FORCE_RIGHT) return this.displayValue.length;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      cursor.popState();
      if (cursor.ok) return cursor.pos;
      return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
    }
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    let total = 0;
    this._forEachBlocksInRange(fromPos, toPos, (b2, _2, bFromPos, bToPos) => {
      total += b2.totalInputPositions(bFromPos, bToPos);
    });
    return total;
  }
  /** Get block by name */
  maskedBlock(name) {
    return this.maskedBlocks(name)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(name) {
    const indices = this._maskedBlocks[name];
    if (!indices) return [];
    return indices.map((gi) => this._blocks[gi]);
  }
  pad(flags) {
    const details = new ChangeDetails();
    this._forEachBlocksInRange(0, this.displayValue.length, (b2) =>
      details.aggregate(b2.pad(flags))
    );
    return details;
  }
}
MaskedPattern.DEFAULTS = {
  ...Masked.DEFAULTS,
  lazy: true,
  placeholderChar: "_",
};
MaskedPattern.STOP_CHAR = "`";
MaskedPattern.ESCAPE_CHAR = "\\";
MaskedPattern.InputDefinition = PatternInputDefinition;
MaskedPattern.FixedDefinition = PatternFixedDefinition;
IMask.MaskedPattern = MaskedPattern;
class MaskedRange extends MaskedPattern {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */
  /** Min bound */
  /** Max bound */
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      to = this.to || 0,
      from = this.from || 0,
      maxLength = this.maxLength || 0,
      autofix = this.autofix,
      ...patternOpts
    } = opts;
    this.to = to;
    this.from = from;
    this.maxLength = Math.max(String(to).length, maxLength);
    this.autofix = autofix;
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    let sameCharsCount = 0;
    while (
      sameCharsCount < toStr.length &&
      toStr[sameCharsCount] === fromStr[sameCharsCount]
    )
      ++sameCharsCount;
    patternOpts.mask =
      toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") +
      "0".repeat(this.maxLength - sameCharsCount);
    super._update(patternOpts);
  }
  get isComplete() {
    return super.isComplete && Boolean(this.value);
  }
  boundaries(str) {
    let minstr = "";
    let maxstr = "";
    const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
    if (num) {
      minstr = "0".repeat(placeholder.length) + num;
      maxstr = "9".repeat(placeholder.length) + num;
    }
    minstr = minstr.padEnd(this.maxLength, "0");
    maxstr = maxstr.padEnd(this.maxLength, "9");
    return [minstr, maxstr];
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let details;
    [ch, details] = super.doPrepareChar(ch.replace(/\D/g, ""), flags);
    if (!ch) details.skip = !this.isComplete;
    return [ch, details];
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (!this.autofix || this.value.length + 1 > this.maxLength)
      return super._appendCharRaw(ch, flags);
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    const [minstr, maxstr] = this.boundaries(this.value + ch);
    if (Number(maxstr) < this.from)
      return super._appendCharRaw(fromStr[this.value.length], flags);
    if (Number(minstr) > this.to) {
      if (
        !flags.tail &&
        this.autofix === "pad" &&
        this.value.length + 1 < this.maxLength
      ) {
        return super
          ._appendCharRaw(fromStr[this.value.length], flags)
          .aggregate(this._appendCharRaw(ch, flags));
      }
      return super._appendCharRaw(toStr[this.value.length], flags);
    }
    return super._appendCharRaw(ch, flags);
  }
  doValidate(flags) {
    const str = this.value;
    const firstNonZero = str.search(/[^0]/);
    if (firstNonZero === -1 && str.length <= this._matchFrom) return true;
    const [minstr, maxstr] = this.boundaries(str);
    return (
      this.from <= Number(maxstr) &&
      Number(minstr) <= this.to &&
      super.doValidate(flags)
    );
  }
  pad(flags) {
    const details = new ChangeDetails();
    if (this.value.length === this.maxLength) return details;
    const value = this.value;
    const padLength = this.maxLength - this.value.length;
    if (padLength) {
      this.reset();
      for (let i2 = 0; i2 < padLength; ++i2) {
        details.aggregate(super._appendCharRaw("0", flags));
      }
      value.split("").forEach((ch) => this._appendCharRaw(ch));
    }
    return details;
  }
}
IMask.MaskedRange = MaskedRange;
const DefaultPattern = "d{.}`m{.}`Y";
class MaskedDate extends MaskedPattern {
  static extractPatternOptions(opts) {
    const { mask, pattern, ...patternOpts } = opts;
    return {
      ...patternOpts,
      mask: isString(mask) ? mask : pattern,
    };
  }
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    super(
      MaskedDate.extractPatternOptions({
        ...MaskedDate.DEFAULTS,
        ...opts,
      })
    );
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const { mask, pattern, blocks, ...patternOpts } = {
      ...MaskedDate.DEFAULTS,
      ...opts,
    };
    const patternBlocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
    if (opts.min) patternBlocks.Y.from = opts.min.getFullYear();
    if (opts.max) patternBlocks.Y.to = opts.max.getFullYear();
    if (opts.min && opts.max && patternBlocks.Y.from === patternBlocks.Y.to) {
      patternBlocks.m.from = opts.min.getMonth() + 1;
      patternBlocks.m.to = opts.max.getMonth() + 1;
      if (patternBlocks.m.from === patternBlocks.m.to) {
        patternBlocks.d.from = opts.min.getDate();
        patternBlocks.d.to = opts.max.getDate();
      }
    }
    Object.assign(patternBlocks, this.blocks, blocks);
    super._update({
      ...patternOpts,
      mask: isString(mask) ? mask : pattern,
      blocks: patternBlocks,
    });
  }
  doValidate(flags) {
    const date = this.date;
    return (
      super.doValidate(flags) &&
      (!this.isComplete ||
        (this.isDateExist(this.value) &&
          date != null &&
          (this.min == null || this.min <= date) &&
          (this.max == null || date <= this.max)))
    );
  }
  /** Checks if date is exists */
  isDateExist(str) {
    return this.format(this.parse(str, this), this).indexOf(str) >= 0;
  }
  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(date) {
    this.typedValue = date;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(value) {
    super.typedValue = value;
  }
  maskEquals(mask) {
    return mask === Date || super.maskEquals(mask);
  }
  optionsIsChanged(opts) {
    return super.optionsIsChanged(MaskedDate.extractPatternOptions(opts));
  }
}
MaskedDate.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: MaskedRange,
    from: 1,
    to: 31,
    maxLength: 2,
  },
  m: {
    mask: MaskedRange,
    from: 1,
    to: 12,
    maxLength: 2,
  },
  Y: {
    mask: MaskedRange,
    from: 1900,
    to: 9999,
  },
});
MaskedDate.DEFAULTS = {
  ...MaskedPattern.DEFAULTS,
  mask: Date,
  pattern: DefaultPattern,
  format: (date, masked) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return [day, month, year].join(".");
  },
  parse: (str, masked) => {
    const [day, month, year] = str.split(".").map(Number);
    return new Date(year, month - 1, day);
  },
};
IMask.MaskedDate = MaskedDate;
class MaskedDynamic extends Masked {
  constructor(opts) {
    super({
      ...MaskedDynamic.DEFAULTS,
      ...opts,
    });
    this.currentMask = void 0;
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    if ("mask" in opts) {
      this.exposeMask = void 0;
      this.compiledMasks = Array.isArray(opts.mask)
        ? opts.mask.map((m2) => {
            const { expose, ...maskOpts } = normalizeOpts(m2);
            const masked = createMask({
              overwrite: this._overwrite,
              eager: this._eager,
              skipInvalid: this._skipInvalid,
              ...maskOpts,
            });
            if (expose) this.exposeMask = masked;
            return masked;
          })
        : [];
    }
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = this._applyDispatch(ch, flags);
    if (this.currentMask) {
      details.aggregate(
        this.currentMask._appendChar(ch, this.currentMaskFlags(flags))
      );
    }
    return details;
  }
  _applyDispatch(appended, flags, tail) {
    if (appended === void 0) {
      appended = "";
    }
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    const prevValueBeforeTail =
      flags.tail && flags._beforeTailState != null
        ? flags._beforeTailState._value
        : this.value;
    const inputValue = this.rawInputValue;
    const insertValue =
      flags.tail && flags._beforeTailState != null
        ? flags._beforeTailState._rawInputValue
        : inputValue;
    const tailValue = inputValue.slice(insertValue.length);
    const prevMask = this.currentMask;
    const details = new ChangeDetails();
    const prevMaskState = prevMask == null ? void 0 : prevMask.state;
    this.currentMask = this.doDispatch(
      appended,
      {
        ...flags,
      },
      tail
    );
    if (this.currentMask) {
      if (this.currentMask !== prevMask) {
        this.currentMask.reset();
        if (insertValue) {
          this.currentMask.append(insertValue, {
            raw: true,
          });
          details.tailShift =
            this.currentMask.value.length - prevValueBeforeTail.length;
        }
        if (tailValue) {
          details.tailShift += this.currentMask.append(tailValue, {
            raw: true,
            tail: true,
          }).tailShift;
        }
      } else if (prevMaskState) {
        this.currentMask.state = prevMaskState;
      }
    }
    return details;
  }
  _appendPlaceholder() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendPlaceholder());
    }
    return details;
  }
  _appendEager() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendEager());
    }
    return details;
  }
  appendTail(tail) {
    const details = new ChangeDetails();
    if (tail) details.aggregate(this._applyDispatch("", {}, tail));
    return details.aggregate(
      this.currentMask
        ? this.currentMask.appendTail(tail)
        : super.appendTail(tail)
    );
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
    return {
      ...flags,
      _beforeTailState:
        (((_flags$_beforeTailSta = flags._beforeTailState) == null
          ? void 0
          : _flags$_beforeTailSta.currentMaskRef) === this.currentMask &&
          ((_flags$_beforeTailSta2 = flags._beforeTailState) == null
            ? void 0
            : _flags$_beforeTailSta2.currentMask)) ||
        flags._beforeTailState,
    };
  }
  doDispatch(appended, flags, tail) {
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    return this.dispatch(appended, this, flags, tail);
  }
  doValidate(flags) {
    return (
      super.doValidate(flags) &&
      (!this.currentMask ||
        this.currentMask.doValidate(this.currentMaskFlags(flags)))
    );
  }
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s2, details] = super.doPrepare(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s2, currentDetails] = super.doPrepare(s2, this.currentMaskFlags(flags));
      details = details.aggregate(currentDetails);
    }
    return [s2, details];
  }
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s2, details] = super.doPrepareChar(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s2, currentDetails] = super.doPrepareChar(
        s2,
        this.currentMaskFlags(flags)
      );
      details = details.aggregate(currentDetails);
    }
    return [s2, details];
  }
  reset() {
    var _this$currentMask;
    (_this$currentMask = this.currentMask) == null || _this$currentMask.reset();
    this.compiledMasks.forEach((m2) => m2.reset());
  }
  get value() {
    return this.exposeMask
      ? this.exposeMask.value
      : this.currentMask
        ? this.currentMask.value
        : "";
  }
  set value(value) {
    if (this.exposeMask) {
      this.exposeMask.value = value;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else super.value = value;
  }
  get unmaskedValue() {
    return this.exposeMask
      ? this.exposeMask.unmaskedValue
      : this.currentMask
        ? this.currentMask.unmaskedValue
        : "";
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeMask) {
      this.exposeMask.unmaskedValue = unmaskedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.exposeMask
      ? this.exposeMask.typedValue
      : this.currentMask
        ? this.currentMask.typedValue
        : "";
  }
  set typedValue(typedValue) {
    if (this.exposeMask) {
      this.exposeMask.typedValue = typedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
      return;
    }
    let unmaskedValue = String(typedValue);
    if (this.currentMask) {
      this.currentMask.typedValue = typedValue;
      unmaskedValue = this.currentMask.unmaskedValue;
    }
    this.unmaskedValue = unmaskedValue;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  get isComplete() {
    var _this$currentMask2;
    return Boolean(
      (_this$currentMask2 = this.currentMask) == null
        ? void 0
        : _this$currentMask2.isComplete
    );
  }
  get isFilled() {
    var _this$currentMask3;
    return Boolean(
      (_this$currentMask3 = this.currentMask) == null
        ? void 0
        : _this$currentMask3.isFilled
    );
  }
  remove(fromPos, toPos) {
    const details = new ChangeDetails();
    if (this.currentMask) {
      details
        .aggregate(this.currentMask.remove(fromPos, toPos))
        .aggregate(this._applyDispatch());
    }
    return details;
  }
  get state() {
    var _this$currentMask4;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((m2) => m2.state),
      currentMaskRef: this.currentMask,
      currentMask:
        (_this$currentMask4 = this.currentMask) == null
          ? void 0
          : _this$currentMask4.state,
    };
  }
  set state(state) {
    const { compiledMasks, currentMaskRef, currentMask, ...maskedState } =
      state;
    if (compiledMasks)
      this.compiledMasks.forEach((m2, mi) => (m2.state = compiledMasks[mi]));
    if (currentMaskRef != null) {
      this.currentMask = currentMaskRef;
      this.currentMask.state = currentMask;
    }
    super.state = maskedState;
  }
  extractInput(fromPos, toPos, flags) {
    return this.currentMask
      ? this.currentMask.extractInput(fromPos, toPos, flags)
      : "";
  }
  extractTail(fromPos, toPos) {
    return this.currentMask
      ? this.currentMask.extractTail(fromPos, toPos)
      : super.extractTail(fromPos, toPos);
  }
  doCommit() {
    if (this.currentMask) this.currentMask.doCommit();
    super.doCommit();
  }
  nearestInputPos(cursorPos, direction) {
    return this.currentMask
      ? this.currentMask.nearestInputPos(cursorPos, direction)
      : super.nearestInputPos(cursorPos, direction);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(overwrite) {
    this._overwrite = overwrite;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(eager) {
    this._eager = eager;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(skipInvalid) {
    this._skipInvalid = skipInvalid;
  }
  get autofix() {
    return this.currentMask ? this.currentMask.autofix : this._autofix;
  }
  set autofix(autofix) {
    this._autofix = autofix;
  }
  maskEquals(mask) {
    return Array.isArray(mask)
      ? this.compiledMasks.every((m2, mi) => {
          if (!mask[mi]) return;
          const { mask: oldMask, ...restOpts } = mask[mi];
          return objectIncludes(m2, restOpts) && m2.maskEquals(oldMask);
        })
      : super.maskEquals(mask);
  }
  typedValueEquals(value) {
    var _this$currentMask5;
    return Boolean(
      (_this$currentMask5 = this.currentMask) == null
        ? void 0
        : _this$currentMask5.typedValueEquals(value)
    );
  }
}
MaskedDynamic.DEFAULTS = {
  ...Masked.DEFAULTS,
  dispatch: (appended, masked, flags, tail) => {
    if (!masked.compiledMasks.length) return;
    const inputValue = masked.rawInputValue;
    const inputs = masked.compiledMasks.map((m2, index) => {
      const isCurrent = masked.currentMask === m2;
      const startInputPos = isCurrent
        ? m2.displayValue.length
        : m2.nearestInputPos(m2.displayValue.length, DIRECTION.FORCE_LEFT);
      if (m2.rawInputValue !== inputValue) {
        m2.reset();
        m2.append(inputValue, {
          raw: true,
        });
      } else if (!isCurrent) {
        m2.remove(startInputPos);
      }
      m2.append(appended, masked.currentMaskFlags(flags));
      m2.appendTail(tail);
      return {
        index,
        weight: m2.rawInputValue.length,
        totalInputPositions: m2.totalInputPositions(
          0,
          Math.max(
            startInputPos,
            m2.nearestInputPos(m2.displayValue.length, DIRECTION.FORCE_LEFT)
          )
        ),
      };
    });
    inputs.sort(
      (i1, i2) =>
        i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions
    );
    return masked.compiledMasks[inputs[0].index];
  },
};
IMask.MaskedDynamic = MaskedDynamic;
class MaskedEnum extends MaskedPattern {
  constructor(opts) {
    super({
      ...MaskedEnum.DEFAULTS,
      ...opts,
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const { enum: enum_, ...eopts } = opts;
    if (enum_) {
      const lengths = enum_.map((e2) => e2.length);
      const requiredLength = Math.min(...lengths);
      const optionalLength = Math.max(...lengths) - requiredLength;
      eopts.mask = "*".repeat(requiredLength);
      if (optionalLength) eopts.mask += "[" + "*".repeat(optionalLength) + "]";
      this.enum = enum_;
    }
    super._update(eopts);
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const matchFrom = Math.min(
      this.nearestInputPos(0, DIRECTION.FORCE_RIGHT),
      this.value.length
    );
    const matches = this.enum.filter((e2) =>
      this.matchValue(e2, this.unmaskedValue + ch, matchFrom)
    );
    if (matches.length) {
      if (matches.length === 1) {
        this._forEachBlocksInRange(0, this.value.length, (b2, bi) => {
          const mch = matches[0][bi];
          if (bi >= this.value.length || mch === b2.value) return;
          b2.reset();
          b2._appendChar(mch, flags);
        });
      }
      const d2 = super._appendCharRaw(matches[0][this.value.length], flags);
      if (matches.length === 1) {
        matches[0]
          .slice(this.unmaskedValue.length)
          .split("")
          .forEach((mch) => d2.aggregate(super._appendCharRaw(mch)));
      }
      return d2;
    }
    return new ChangeDetails({
      skip: !this.isComplete,
    });
  }
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return new ContinuousTailDetails("", fromPos);
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    if (fromPos === toPos) return new ChangeDetails();
    const matchFrom = Math.min(
      super.nearestInputPos(0, DIRECTION.FORCE_RIGHT),
      this.value.length
    );
    let pos;
    for (pos = fromPos; pos >= 0; --pos) {
      const matches = this.enum.filter((e2) =>
        this.matchValue(e2, this.value.slice(matchFrom, pos), matchFrom)
      );
      if (matches.length > 1) break;
    }
    const details = super.remove(pos, toPos);
    details.tailShift += pos - fromPos;
    return details;
  }
  get isComplete() {
    return this.enum.indexOf(this.value) >= 0;
  }
}
MaskedEnum.DEFAULTS = {
  ...MaskedPattern.DEFAULTS,
  matchValue: (estr, istr, matchFrom) =>
    estr.indexOf(istr, matchFrom) === matchFrom,
};
IMask.MaskedEnum = MaskedEnum;
class MaskedFunction extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update({
      ...opts,
      validate: opts.mask,
    });
  }
}
IMask.MaskedFunction = MaskedFunction;
var _MaskedNumber;
class MaskedNumber extends Masked {
  /** Single char */
  /** Single char */
  /** Array of single chars */
  /** */
  /** */
  /** Digits after point */
  /** Flag to remove leading and trailing zeros in the end of editing */
  /** Flag to pad trailing zeros after point in the end of editing */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    super({
      ...MaskedNumber.DEFAULTS,
      ...opts,
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    this._updateRegExps();
  }
  _updateRegExps() {
    const start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
    const mid = "\\d*";
    const end =
      (this.scale
        ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?"
        : "") + "$";
    this._numberRegExp = new RegExp(start + mid + end);
    this._mapToRadixRegExp = new RegExp(
      "[" + this.mapToRadix.map(escapeRegExp).join("") + "]",
      "g"
    );
    this._thousandsSeparatorRegExp = new RegExp(
      escapeRegExp(this.thousandsSeparator),
      "g"
    );
  }
  _removeThousandsSeparators(value) {
    return value.replace(this._thousandsSeparatorRegExp, "");
  }
  _insertThousandsSeparators(value) {
    const parts = value.split(this.radix);
    parts[0] = parts[0].replace(
      /\B(?=(\d{3})+(?!\d))/g,
      this.thousandsSeparator
    );
    return parts.join(this.radix);
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const [prepCh, details] = super.doPrepareChar(
      this._removeThousandsSeparators(
        this.scale &&
          this.mapToRadix.length /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */ &&
          ((flags.input && flags.raw) || (!flags.input && !flags.raw))
          ? ch.replace(this._mapToRadixRegExp, this.radix)
          : ch
      ),
      flags
    );
    if (ch && !prepCh) details.skip = true;
    if (prepCh && !this.allowPositive && !this.value && prepCh !== "-")
      details.aggregate(this._appendChar("-"));
    return [prepCh, details];
  }
  _separatorsCount(to, extendOnSeparators) {
    if (extendOnSeparators === void 0) {
      extendOnSeparators = false;
    }
    let count = 0;
    for (let pos = 0; pos < to; ++pos) {
      if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
        ++count;
        if (extendOnSeparators) to += this.thousandsSeparator.length;
      }
    }
    return count;
  }
  _separatorsCountFromSlice(slice) {
    if (slice === void 0) {
      slice = this._value;
    }
    return this._separatorsCount(
      this._removeThousandsSeparators(slice).length,
      true
    );
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    return this._removeThousandsSeparators(
      super.extractInput(fromPos, toPos, flags)
    );
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const prevBeforeTailValue =
      flags.tail && flags._beforeTailState
        ? flags._beforeTailState._value
        : this._value;
    const prevBeforeTailSeparatorsCount =
      this._separatorsCountFromSlice(prevBeforeTailValue);
    this._value = this._removeThousandsSeparators(this.value);
    const oldValue = this._value;
    this._value += ch;
    const num = this.number;
    let accepted = !isNaN(num);
    let skip = false;
    if (accepted) {
      let fixedNum;
      if (this.min != null && this.min < 0 && this.number < this.min)
        fixedNum = this.min;
      if (this.max != null && this.max > 0 && this.number > this.max)
        fixedNum = this.max;
      if (fixedNum != null) {
        if (this.autofix) {
          this._value = this.format(fixedNum, this).replace(
            MaskedNumber.UNMASKED_RADIX,
            this.radix
          );
          skip || (skip = oldValue === this._value && !flags.tail);
        } else {
          accepted = false;
        }
      }
      accepted && (accepted = Boolean(this._value.match(this._numberRegExp)));
    }
    let appendDetails;
    if (!accepted) {
      this._value = oldValue;
      appendDetails = new ChangeDetails();
    } else {
      appendDetails = new ChangeDetails({
        inserted: this._value.slice(oldValue.length),
        rawInserted: skip ? "" : ch,
        skip,
      });
    }
    this._value = this._insertThousandsSeparators(this._value);
    const beforeTailValue =
      flags.tail && flags._beforeTailState
        ? flags._beforeTailState._value
        : this._value;
    const beforeTailSeparatorsCount =
      this._separatorsCountFromSlice(beforeTailValue);
    appendDetails.tailShift +=
      (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) *
      this.thousandsSeparator.length;
    return appendDetails;
  }
  _findSeparatorAround(pos) {
    if (this.thousandsSeparator) {
      const searchFrom = pos - this.thousandsSeparator.length + 1;
      const separatorPos = this.value.indexOf(
        this.thousandsSeparator,
        searchFrom
      );
      if (separatorPos <= pos) return separatorPos;
    }
    return -1;
  }
  _adjustRangeWithSeparators(from, to) {
    const separatorAroundFromPos = this._findSeparatorAround(from);
    if (separatorAroundFromPos >= 0) from = separatorAroundFromPos;
    const separatorAroundToPos = this._findSeparatorAround(to);
    if (separatorAroundToPos >= 0)
      to = separatorAroundToPos + this.thousandsSeparator.length;
    return [from, to];
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    const valueBeforePos = this.value.slice(0, fromPos);
    const valueAfterPos = this.value.slice(toPos);
    const prevBeforeTailSeparatorsCount = this._separatorsCount(
      valueBeforePos.length
    );
    this._value = this._insertThousandsSeparators(
      this._removeThousandsSeparators(valueBeforePos + valueAfterPos)
    );
    const beforeTailSeparatorsCount =
      this._separatorsCountFromSlice(valueBeforePos);
    return new ChangeDetails({
      tailShift:
        (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) *
        this.thousandsSeparator.length,
    });
  }
  nearestInputPos(cursorPos, direction) {
    if (!this.thousandsSeparator) return cursorPos;
    switch (direction) {
      case DIRECTION.NONE:
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT: {
        const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
        if (separatorAtLeftPos >= 0) {
          const separatorAtLeftEndPos =
            separatorAtLeftPos + this.thousandsSeparator.length;
          if (
            cursorPos < separatorAtLeftEndPos ||
            this.value.length <= separatorAtLeftEndPos ||
            direction === DIRECTION.FORCE_LEFT
          ) {
            return separatorAtLeftPos;
          }
        }
        break;
      }
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT: {
        const separatorAtRightPos = this._findSeparatorAround(cursorPos);
        if (separatorAtRightPos >= 0) {
          return separatorAtRightPos + this.thousandsSeparator.length;
        }
      }
    }
    return cursorPos;
  }
  doCommit() {
    if (this.value) {
      const number = this.number;
      let validnum = number;
      if (this.min != null) validnum = Math.max(validnum, this.min);
      if (this.max != null) validnum = Math.min(validnum, this.max);
      if (validnum !== number) this.unmaskedValue = this.format(validnum, this);
      let formatted = this.value;
      if (this.normalizeZeros) formatted = this._normalizeZeros(formatted);
      if (this.padFractionalZeros && this.scale > 0)
        formatted = this._padFractionalZeros(formatted);
      this._value = formatted;
    }
    super.doCommit();
  }
  _normalizeZeros(value) {
    const parts = this._removeThousandsSeparators(value).split(this.radix);
    parts[0] = parts[0].replace(
      /^(\D*)(0*)(\d*)/,
      (match, sign, zeros, num) => sign + num
    );
    if (value.length && !/\d$/.test(parts[0])) parts[0] = parts[0] + "0";
    if (parts.length > 1) {
      parts[1] = parts[1].replace(/0*$/, "");
      if (!parts[1].length) parts.length = 1;
    }
    return this._insertThousandsSeparators(parts.join(this.radix));
  }
  _padFractionalZeros(value) {
    if (!value) return value;
    const parts = value.split(this.radix);
    if (parts.length < 2) parts.push("");
    parts[1] = parts[1].padEnd(this.scale, "0");
    return parts.join(this.radix);
  }
  doSkipInvalid(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const dropFractional =
      this.scale === 0 &&
      ch !== this.thousandsSeparator &&
      (ch === this.radix ||
        ch === MaskedNumber.UNMASKED_RADIX ||
        this.mapToRadix.includes(ch));
    return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(
      this._normalizeZeros(this.value)
    ).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(n2) {
    this.rawInputValue = this.format(n2, this).replace(
      MaskedNumber.UNMASKED_RADIX,
      this.radix
    );
  }
  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(number) {
    this.typedValue = number;
  }
  get allowNegative() {
    return (
      (this.min != null && this.min < 0) || (this.max != null && this.max < 0)
    );
  }
  get allowPositive() {
    return (
      (this.min != null && this.min > 0) || (this.max != null && this.max > 0)
    );
  }
  typedValueEquals(value) {
    return (
      (super.typedValueEquals(value) ||
        (MaskedNumber.EMPTY_VALUES.includes(value) &&
          MaskedNumber.EMPTY_VALUES.includes(this.typedValue))) &&
      !(value === 0 && this.value === "")
    );
  }
}
_MaskedNumber = MaskedNumber;
MaskedNumber.UNMASKED_RADIX = ".";
MaskedNumber.EMPTY_VALUES = [...Masked.EMPTY_VALUES, 0];
MaskedNumber.DEFAULTS = {
  ...Masked.DEFAULTS,
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [_MaskedNumber.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: true,
  padFractionalZeros: false,
  parse: Number,
  format: (n2) =>
    n2.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 20,
    }),
};
IMask.MaskedNumber = MaskedNumber;
const PIPE_TYPE = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue",
};
function createPipe(arg, from, to) {
  if (from === void 0) {
    from = PIPE_TYPE.MASKED;
  }
  if (to === void 0) {
    to = PIPE_TYPE.MASKED;
  }
  const masked = createMask(arg);
  return (value) =>
    masked.runIsolated((m2) => {
      m2[from] = value;
      return m2[to];
    });
}
function pipe2(value, mask, from, to) {
  return createPipe(mask, from, to)(value);
}
IMask.PIPE_TYPE = PIPE_TYPE;
IMask.createPipe = createPipe;
IMask.pipe = pipe2;
class RepeatBlock extends MaskedPattern {
  get repeatFrom() {
    var _ref;
    return (_ref = Array.isArray(this.repeat)
      ? this.repeat[0]
      : this.repeat === Infinity
        ? 0
        : this.repeat) != null
      ? _ref
      : 0;
  }
  get repeatTo() {
    var _ref2;
    return (_ref2 = Array.isArray(this.repeat)
      ? this.repeat[1]
      : this.repeat) != null
      ? _ref2
      : Infinity;
  }
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    var _ref3, _ref4, _this$_blocks;
    const { repeat, ...blockOpts } = normalizeOpts(opts);
    this._blockOpts = Object.assign({}, this._blockOpts, blockOpts);
    const block = createMask(this._blockOpts);
    this.repeat =
      (_ref3 =
        (_ref4 = repeat != null ? repeat : block.repeat) != null
          ? _ref4
          : this.repeat) != null
        ? _ref3
        : Infinity;
    super._update({
      mask: "m".repeat(
        Math.max(
          (this.repeatTo === Infinity &&
            ((_this$_blocks = this._blocks) == null
              ? void 0
              : _this$_blocks.length)) ||
            0,
          this.repeatFrom
        )
      ),
      blocks: {
        m: block,
      },
      eager: block.eager,
      overwrite: block.overwrite,
      skipInvalid: block.skipInvalid,
      lazy: block.lazy,
      placeholderChar: block.placeholderChar,
      displayChar: block.displayChar,
    });
  }
  _allocateBlock(bi) {
    if (bi < this._blocks.length) return this._blocks[bi];
    if (this.repeatTo === Infinity || this._blocks.length < this.repeatTo) {
      this._blocks.push(createMask(this._blockOpts));
      this.mask += "m";
      return this._blocks[this._blocks.length - 1];
    }
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = new ChangeDetails();
    for (
      let bi =
          (_this$_mapPosToBlock$ =
            (_this$_mapPosToBlock = this._mapPosToBlock(
              this.displayValue.length
            )) == null
              ? void 0
              : _this$_mapPosToBlock.index) != null
            ? _this$_mapPosToBlock$
            : Math.max(this._blocks.length - 1, 0),
        block,
        allocated;
      // try to get a block or
      // try to allocate a new block if not allocated already
      (block =
        (_this$_blocks$bi = this._blocks[bi]) != null
          ? _this$_blocks$bi
          : (allocated = !allocated && this._allocateBlock(bi)));
      ++bi
    ) {
      var _this$_mapPosToBlock$,
        _this$_mapPosToBlock,
        _this$_blocks$bi,
        _flags$_beforeTailSta;
      const blockDetails = block._appendChar(ch, {
        ...flags,
        _beforeTailState:
          (_flags$_beforeTailSta = flags._beforeTailState) == null ||
          (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null
            ? void 0
            : _flags$_beforeTailSta[bi],
      });
      if (blockDetails.skip && allocated) {
        this._blocks.pop();
        this.mask = this.mask.slice(1);
        break;
      }
      details.aggregate(blockDetails);
      if (blockDetails.consumed) break;
    }
    return details;
  }
  _trimEmptyTail(fromPos, toPos) {
    var _this$_mapPosToBlock2, _this$_mapPosToBlock3;
    if (fromPos === void 0) {
      fromPos = 0;
    }
    const firstBlockIndex = Math.max(
      ((_this$_mapPosToBlock2 = this._mapPosToBlock(fromPos)) == null
        ? void 0
        : _this$_mapPosToBlock2.index) || 0,
      this.repeatFrom,
      0
    );
    let lastBlockIndex;
    if (toPos != null)
      lastBlockIndex =
        (_this$_mapPosToBlock3 = this._mapPosToBlock(toPos)) == null
          ? void 0
          : _this$_mapPosToBlock3.index;
    if (lastBlockIndex == null) lastBlockIndex = this._blocks.length - 1;
    let removeCount = 0;
    for (
      let blockIndex = lastBlockIndex;
      firstBlockIndex <= blockIndex;
      --blockIndex, ++removeCount
    ) {
      if (this._blocks[blockIndex].unmaskedValue) break;
    }
    if (removeCount) {
      this._blocks.splice(lastBlockIndex - removeCount + 1, removeCount);
      this.mask = this.mask.slice(removeCount);
    }
  }
  reset() {
    super.reset();
    this._trimEmptyTail();
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const removeDetails = super.remove(fromPos, toPos);
    this._trimEmptyTail(fromPos, toPos);
    return removeDetails;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos == null && this.repeatTo === Infinity) return Infinity;
    return super.totalInputPositions(fromPos, toPos);
  }
  get state() {
    return super.state;
  }
  set state(state) {
    this._blocks.length = state._blocks.length;
    this.mask = this.mask.slice(0, this._blocks.length);
    super.state = state;
  }
}
IMask.RepeatBlock = RepeatBlock;
try {
  globalThis.IMask = IMask;
} catch {}
const phoneFields = document.querySelectorAll('[data-type="tel"]');
const maskOptions = {
  mask: "+{7}(000) 000-00-00",
};
phoneFields.forEach((field) => {
  IMask(field, maskOptions);
});
const sliders$2 = document.querySelectorAll(".sort-slider");
if (sliders$2.length) {
  sliders$2.forEach((slider2) => {
    new Swiper(slider2, {
      slidesPerView: "auto",
      spaceBetween: 15,
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const items2 = document.querySelectorAll(".sidemenu__list-item");
  if (items2.length) {
    const onClickToogleItem = (target) => {
      items2.forEach((item) => {
        const active = item.querySelector(".initial");
        active ? active.classList.remove("initial") : null;
        if (target !== item && item.classList.contains("expanded")) {
          item.classList.remove("expanded");
        }
      });
      target.classList.toggle("expanded");
    };
    items2.forEach((item) => {
      item.addEventListener("click", (evt) => {
        if (item.querySelector("ul") && evt.target === item) {
          onClickToogleItem(item);
        }
      });
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  let tables = document.getElementsByTagName("table");
  if (tables.length) {
    let length = tables.length,
      i2,
      wrapper;
    for (i2 = 0; i2 < length; i2++) {
      wrapper = document.createElement("div");
      wrapper.setAttribute("class", "table-wrapper");
      tables[i2].parentNode.insertBefore(wrapper, tables[i2]);
      wrapper.appendChild(tables[i2]);
    }
  }
});
const items = document.querySelectorAll(".rate__wrapper input");
if (items.length) {
  const fillStars = (index) => {
    items.forEach((item, i2) => {
      if (i2 <= index) {
        !item.parentNode.classList.contains("filled")
          ? item.parentNode.classList.add("filled")
          : null;
      } else {
        item.parentNode.classList.contains("filled")
          ? item.parentNode.classList.remove("filled")
          : null;
      }
    });
  };
  for (let i2 = 4; i2 >= 0; i2--) {
    if (items[i2].checked) {
      fillStars(i2);
      break;
    }
  }
  items.forEach((item, index) => {
    item.addEventListener("change", () => {
      fillStars(index);
    });
  });
}
const sliders$1 = document.querySelectorAll(".autofill-slider");
if (sliders$1.length) {
  sliders$1.forEach((slider2) => {
    const pagination = slider2.querySelector(".swiper-pagination");
    const btnNext = slider2.querySelector(".swiper-button-next");
    const btnPrev = slider2.querySelector(".swiper-button-prev");
    new Swiper(slider2, {
      modules: [Navigation, Pagination],
      slidesPerView: "auto",
      spaceBetween: 20,
      navigation: {
        nextEl: btnNext ? btnNext : null,
        prevEl: btnPrev ? btnPrev : null,
      },
      pagination: {
        el: pagination ? pagination : null,
        dynamicBullets: true,
      },
    });
  });
}
const sliders = document.querySelectorAll(".main-slider");
if (sliders.length) {
  sliders.forEach((slider2) => {
    const btnNext = slider2.querySelector(".swiper-button-next");
    const btnPrev = slider2.querySelector(".swiper-button-prev");
    const pagination = slider2.querySelector(".swiper-pagination");
    new Swiper(slider2, {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: {
        nextEl: btnNext ? btnNext : null,
        prevEl: btnPrev ? btnPrev : null,
      },
      pagination: {
        el: pagination ? pagination : null,
        dynamicBullets: true,
        clickable: true,
      },
    });
  });
}
const imageComparisonSliders = document.querySelectorAll(
  '[data-component="image-comparison-slider"]'
);
if (imageComparisonSliders.length) {
  let setSliderstate = function (e2, element) {
      const sliderRange = element.querySelector(
        "[data-image-comparison-range]"
      );
      if (e2.type === "input") {
        sliderRange.classList.add("image-comparison__range--active");
        return;
      }
      sliderRange.classList.remove("image-comparison__range--active");
      element.removeEventListener("mousemove", moveSliderThumb);
    },
    moveSliderThumb = function (evt) {
      const target = evt.target.closest(
        "[data-component='image-comparison-slider']"
      );
      const sliderRange = target.querySelector("[data-image-comparison-range]");
      const thumb = target.querySelector("[data-image-comparison-thumb]");
      let position = evt.layerY - 20;
      if (evt.layerY <= sliderRange.offsetTop) {
        position = -20;
      }
      if (evt.layerY >= sliderRange.offsetHeight) {
        position = sliderRange.offsetHeight - 20;
      }
      thumb.style.top = `${position}px`;
    },
    moveSliderRange = function (evt, element) {
      const value = evt.target.value;
      const slider2 = element.querySelector("[data-image-comparison-slider]");
      const imageWrapperOverlay = element.querySelector(
        "[data-image-comparison-overlay]"
      );
      slider2.style.left = `${value}%`;
      imageWrapperOverlay.style.width = `${value}%`;
      element.addEventListener("mousemove", moveSliderThumb);
      setSliderstate(evt, element);
    },
    init4 = function (element) {
      console.log("inited");
      const sliderRange = element.querySelector(
        "[data-image-comparison-range]"
      );
      if ("ontouchstart" in window === false) {
        sliderRange.addEventListener("mouseup", (evt) =>
          setSliderstate(evt, element)
        );
        sliderRange.addEventListener("mousedown", moveSliderThumb);
      }
      sliderRange.addEventListener("input", (evt) =>
        moveSliderRange(evt, element)
      );
      sliderRange.addEventListener("change", (evt) =>
        moveSliderRange(evt, element)
      );
    };
  var setSliderstate2 = setSliderstate,
    moveSliderThumb2 = moveSliderThumb,
    moveSliderRange2 = moveSliderRange,
    init5 = init4;
  imageComparisonSliders.forEach((imageComparisonSlider) => {
    init4(imageComparisonSlider);
  });
}
const modals = document.querySelectorAll(".modal");
if (modals) {
  modals.forEach((modal) => {
    new Modal(modal);
  });
}
const t = (t2, e2 = 1e4) => (
    (t2 = parseFloat(t2 + "") || 0),
    Math.round((t2 + Number.EPSILON) * e2) / e2
  ),
  e = function (t2) {
    if (!(t2 && t2 instanceof Element && t2.offsetParent)) return false;
    const e2 = t2.scrollHeight > t2.clientHeight,
      i2 = window.getComputedStyle(t2).overflowY,
      n2 = -1 !== i2.indexOf("hidden"),
      s2 = -1 !== i2.indexOf("visible");
    return e2 && !n2 && !s2;
  },
  i = function (t2, n2 = void 0) {
    return (
      !(!t2 || t2 === document.body || (n2 && t2 === n2)) &&
      (e(t2) ? t2 : i(t2.parentElement, n2))
    );
  },
  n = function (t2) {
    var e2 = new DOMParser().parseFromString(t2, "text/html").body;
    if (e2.childElementCount > 1) {
      for (var i2 = document.createElement("div"); e2.firstChild; )
        i2.appendChild(e2.firstChild);
      return i2;
    }
    return e2.firstChild;
  },
  s = (t2) => `${t2 || ""}`.split(" ").filter((t3) => !!t3),
  o = (t2, e2, i2) => {
    t2 &&
      s(e2).forEach((e3) => {
        t2.classList.toggle(e3, i2 || false);
      });
  };
class a {
  constructor(t2) {
    (Object.defineProperty(this, "pageX", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    }),
      Object.defineProperty(this, "pageY", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "clientX", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "clientY", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "id", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "time", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "nativePointer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      (this.nativePointer = t2),
      (this.pageX = t2.pageX),
      (this.pageY = t2.pageY),
      (this.clientX = t2.clientX),
      (this.clientY = t2.clientY),
      (this.id = self.Touch && t2 instanceof Touch ? t2.identifier : -1),
      (this.time = Date.now()));
  }
}
const r = { passive: false };
class l {
  constructor(
    t2,
    { start: e2 = () => true, move: i2 = () => {}, end: n2 = () => {} }
  ) {
    (Object.defineProperty(this, "element", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    }),
      Object.defineProperty(this, "startCallback", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "moveCallback", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "endCallback", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "currentPointers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: [],
      }),
      Object.defineProperty(this, "startPointers", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: [],
      }),
      (this.element = t2),
      (this.startCallback = e2),
      (this.moveCallback = i2),
      (this.endCallback = n2));
    for (const t3 of [
      "onPointerStart",
      "onTouchStart",
      "onMove",
      "onTouchEnd",
      "onPointerEnd",
      "onWindowBlur",
    ])
      this[t3] = this[t3].bind(this);
    (this.element.addEventListener("mousedown", this.onPointerStart, r),
      this.element.addEventListener("touchstart", this.onTouchStart, r),
      this.element.addEventListener("touchmove", this.onMove, r),
      this.element.addEventListener("touchend", this.onTouchEnd),
      this.element.addEventListener("touchcancel", this.onTouchEnd));
  }
  onPointerStart(t2) {
    if (!t2.buttons || 0 !== t2.button) return;
    const e2 = new a(t2);
    this.currentPointers.some((t3) => t3.id === e2.id) ||
      (this.triggerPointerStart(e2, t2) &&
        (window.addEventListener("mousemove", this.onMove),
        window.addEventListener("mouseup", this.onPointerEnd),
        window.addEventListener("blur", this.onWindowBlur)));
  }
  onTouchStart(t2) {
    for (const e2 of Array.from(t2.changedTouches || []))
      this.triggerPointerStart(new a(e2), t2);
    window.addEventListener("blur", this.onWindowBlur);
  }
  onMove(t2) {
    const e2 = this.currentPointers.slice(),
      i2 =
        "changedTouches" in t2
          ? Array.from(t2.changedTouches || []).map((t3) => new a(t3))
          : [new a(t2)],
      n2 = [];
    for (const t3 of i2) {
      const e3 = this.currentPointers.findIndex((e4) => e4.id === t3.id);
      e3 < 0 || (n2.push(t3), (this.currentPointers[e3] = t3));
    }
    n2.length && this.moveCallback(t2, this.currentPointers.slice(), e2);
  }
  onPointerEnd(t2) {
    (t2.buttons > 0 && 0 !== t2.button) ||
      (this.triggerPointerEnd(t2, new a(t2)),
      window.removeEventListener("mousemove", this.onMove),
      window.removeEventListener("mouseup", this.onPointerEnd),
      window.removeEventListener("blur", this.onWindowBlur));
  }
  onTouchEnd(t2) {
    for (const e2 of Array.from(t2.changedTouches || []))
      this.triggerPointerEnd(t2, new a(e2));
  }
  triggerPointerStart(t2, e2) {
    return (
      !!this.startCallback(e2, t2, this.currentPointers.slice()) &&
      (this.currentPointers.push(t2), this.startPointers.push(t2), true)
    );
  }
  triggerPointerEnd(t2, e2) {
    const i2 = this.currentPointers.findIndex((t3) => t3.id === e2.id);
    i2 < 0 ||
      (this.currentPointers.splice(i2, 1),
      this.startPointers.splice(i2, 1),
      this.endCallback(t2, e2, this.currentPointers.slice()));
  }
  onWindowBlur() {
    this.clear();
  }
  clear() {
    for (; this.currentPointers.length; ) {
      const t2 = this.currentPointers[this.currentPointers.length - 1];
      (this.currentPointers.splice(this.currentPointers.length - 1, 1),
        this.startPointers.splice(this.currentPointers.length - 1, 1),
        this.endCallback(
          new Event("touchend", {
            bubbles: true,
            cancelable: true,
            clientX: t2.clientX,
            clientY: t2.clientY,
          }),
          t2,
          this.currentPointers.slice()
        ));
    }
  }
  stop() {
    (this.element.removeEventListener("mousedown", this.onPointerStart, r),
      this.element.removeEventListener("touchstart", this.onTouchStart, r),
      this.element.removeEventListener("touchmove", this.onMove, r),
      this.element.removeEventListener("touchend", this.onTouchEnd),
      this.element.removeEventListener("touchcancel", this.onTouchEnd),
      window.removeEventListener("mousemove", this.onMove),
      window.removeEventListener("mouseup", this.onPointerEnd),
      window.removeEventListener("blur", this.onWindowBlur));
  }
}
function c(t2, e2) {
  return e2
    ? Math.sqrt(
        Math.pow(e2.clientX - t2.clientX, 2) +
          Math.pow(e2.clientY - t2.clientY, 2)
      )
    : 0;
}
function h(t2, e2) {
  return e2
    ? {
        clientX: (t2.clientX + e2.clientX) / 2,
        clientY: (t2.clientY + e2.clientY) / 2,
      }
    : t2;
}
const d = (t2) =>
    "object" == typeof t2 &&
    null !== t2 &&
    t2.constructor === Object &&
    "[object Object]" === Object.prototype.toString.call(t2),
  u = (t2, ...e2) => {
    const i2 = e2.length;
    for (let n2 = 0; n2 < i2; n2++) {
      const i3 = e2[n2] || {};
      Object.entries(i3).forEach(([e3, i4]) => {
        const n3 = Array.isArray(i4) ? [] : {};
        (t2[e3] || Object.assign(t2, { [e3]: n3 }),
          d(i4)
            ? Object.assign(t2[e3], u(n3, i4))
            : Array.isArray(i4)
              ? Object.assign(t2, { [e3]: [...i4] })
              : Object.assign(t2, { [e3]: i4 }));
      });
    }
    return t2;
  },
  p = function (t2, e2) {
    return t2
      .split(".")
      .reduce((t3, e3) => ("object" == typeof t3 ? t3[e3] : void 0), e2);
  };
class f {
  constructor(t2 = {}) {
    (Object.defineProperty(this, "options", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: t2,
    }),
      Object.defineProperty(this, "events", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /* @__PURE__ */ new Map(),
      }),
      this.setOptions(t2));
    for (const t3 of Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
      t3.startsWith("on") &&
        "function" == typeof this[t3] &&
        (this[t3] = this[t3].bind(this));
  }
  setOptions(t2) {
    this.options = t2 ? u({}, this.constructor.defaults, t2) : {};
    for (const [t3, e2] of Object.entries(this.option("on") || {}))
      this.on(t3, e2);
  }
  option(t2, ...e2) {
    let i2 = p(t2, this.options);
    return (
      i2 && "function" == typeof i2 && (i2 = i2.call(this, this, ...e2)),
      i2
    );
  }
  optionFor(t2, e2, i2, ...n2) {
    let s2 = p(e2, t2);
    var o2;
    ("string" != typeof (o2 = s2) ||
      isNaN(o2) ||
      isNaN(parseFloat(o2)) ||
      (s2 = parseFloat(s2)),
      "true" === s2 && (s2 = true),
      "false" === s2 && (s2 = false),
      s2 && "function" == typeof s2 && (s2 = s2.call(this, this, t2, ...n2)));
    let a2 = p(e2, this.options);
    return (
      a2 && "function" == typeof a2
        ? (s2 = a2.call(this, this, t2, ...n2, s2))
        : void 0 === s2 && (s2 = a2),
      void 0 === s2 ? i2 : s2
    );
  }
  cn(t2) {
    const e2 = this.options.classes;
    return (e2 && e2[t2]) || "";
  }
  localize(t2, e2 = []) {
    t2 = String(t2).replace(/\{\{(\w+).?(\w+)?\}\}/g, (t3, e3, i2) => {
      let n2 = "";
      return (
        i2
          ? (n2 = this.option(
              `${e3[0] + e3.toLowerCase().substring(1)}.l10n.${i2}`
            ))
          : e3 && (n2 = this.option(`l10n.${e3}`)),
        n2 || (n2 = t3),
        n2
      );
    });
    for (let i2 = 0; i2 < e2.length; i2++)
      t2 = t2.split(e2[i2][0]).join(e2[i2][1]);
    return (t2 = t2.replace(/\{\{(.*?)\}\}/g, (t3, e3) => e3));
  }
  on(t2, e2) {
    let i2 = [];
    ("string" == typeof t2
      ? (i2 = t2.split(" "))
      : Array.isArray(t2) && (i2 = t2),
      this.events || (this.events = /* @__PURE__ */ new Map()),
      i2.forEach((t3) => {
        let i3 = this.events.get(t3);
        (i3 || (this.events.set(t3, []), (i3 = [])),
          i3.includes(e2) || i3.push(e2),
          this.events.set(t3, i3));
      }));
  }
  off(t2, e2) {
    let i2 = [];
    ("string" == typeof t2
      ? (i2 = t2.split(" "))
      : Array.isArray(t2) && (i2 = t2),
      i2.forEach((t3) => {
        const i3 = this.events.get(t3);
        if (Array.isArray(i3)) {
          const t4 = i3.indexOf(e2);
          t4 > -1 && i3.splice(t4, 1);
        }
      }));
  }
  emit(t2, ...e2) {
    ([...(this.events.get(t2) || [])].forEach((t3) => t3(this, ...e2)),
      "*" !== t2 && this.emit("*", t2, ...e2));
  }
}
(Object.defineProperty(f, "version", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: "5.0.36",
}),
  Object.defineProperty(f, "defaults", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {},
  }));
class g extends f {
  constructor(t2 = {}) {
    (super(t2),
      Object.defineProperty(this, "plugins", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {},
      }));
  }
  attachPlugins(t2 = {}) {
    const e2 = /* @__PURE__ */ new Map();
    for (const [i2, n2] of Object.entries(t2)) {
      const t3 = this.option(i2),
        s2 = this.plugins[i2];
      s2 || false === t3
        ? s2 && false === t3 && (s2.detach(), delete this.plugins[i2])
        : e2.set(i2, new n2(this, t3 || {}));
    }
    for (const [t3, i2] of e2) ((this.plugins[t3] = i2), i2.attach());
  }
  detachPlugins(t2) {
    t2 = t2 || Object.keys(this.plugins);
    for (const e2 of t2) {
      const t3 = this.plugins[e2];
      (t3 && t3.detach(), delete this.plugins[e2]);
    }
    return (this.emit("detachPlugins"), this);
  }
}
var m;
!(function (t2) {
  ((t2[(t2.Init = 0)] = "Init"),
    (t2[(t2.Error = 1)] = "Error"),
    (t2[(t2.Ready = 2)] = "Ready"),
    (t2[(t2.Panning = 3)] = "Panning"),
    (t2[(t2.Mousemove = 4)] = "Mousemove"),
    (t2[(t2.Destroy = 5)] = "Destroy"));
})(m || (m = {}));
const v = ["a", "b", "c", "d", "e", "f"],
  b = {
    PANUP: "Move up",
    PANDOWN: "Move down",
    PANLEFT: "Move left",
    PANRIGHT: "Move right",
    ZOOMIN: "Zoom in",
    ZOOMOUT: "Zoom out",
    TOGGLEZOOM: "Toggle zoom level",
    TOGGLE1TO1: "Toggle zoom level",
    ITERATEZOOM: "Toggle zoom level",
    ROTATECCW: "Rotate counterclockwise",
    ROTATECW: "Rotate clockwise",
    FLIPX: "Flip horizontally",
    FLIPY: "Flip vertically",
    FITX: "Fit horizontally",
    FITY: "Fit vertically",
    RESET: "Reset",
    TOGGLEFS: "Toggle fullscreen",
  },
  y = {
    content: null,
    width: "auto",
    height: "auto",
    panMode: "drag",
    touch: true,
    dragMinThreshold: 3,
    lockAxis: false,
    mouseMoveFactor: 1,
    mouseMoveFriction: 0.12,
    zoom: true,
    pinchToZoom: true,
    panOnlyZoomed: "auto",
    minScale: 1,
    maxScale: 2,
    friction: 0.25,
    dragFriction: 0.35,
    decelFriction: 0.05,
    click: "toggleZoom",
    dblClick: false,
    wheel: "zoom",
    wheelLimit: 7,
    spinner: true,
    bounds: "auto",
    infinite: false,
    rubberband: true,
    bounce: true,
    maxVelocity: 75,
    transformParent: false,
    classes: {
      content: "f-panzoom__content",
      isLoading: "is-loading",
      canZoomIn: "can-zoom_in",
      canZoomOut: "can-zoom_out",
      isDraggable: "is-draggable",
      isDragging: "is-dragging",
      inFullscreen: "in-fullscreen",
      htmlHasFullscreen: "with-panzoom-in-fullscreen",
    },
    l10n: b,
  },
  w = '<circle cx="25" cy="25" r="20"></circle>',
  x =
    '<div class="f-spinner"><svg viewBox="0 0 50 50">' + w + w + "</svg></div>",
  E = (t2) => t2 && null !== t2 && t2 instanceof Element && "nodeType" in t2,
  S = (t2, e2) => {
    t2 &&
      s(e2).forEach((e3) => {
        t2.classList.remove(e3);
      });
  },
  P = (t2, e2) => {
    t2 &&
      s(e2).forEach((e3) => {
        t2.classList.add(e3);
      });
  },
  C = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
  T = 1e5,
  M = 1e4,
  O = "mousemove",
  A = "drag",
  L = "content",
  z = "auto";
let R = null,
  k = null;
class I extends g {
  get fits() {
    return (
      this.contentRect.width - this.contentRect.fitWidth < 1 &&
      this.contentRect.height - this.contentRect.fitHeight < 1
    );
  }
  get isTouchDevice() {
    return (null === k && (k = window.matchMedia("(hover: none)").matches), k);
  }
  get isMobile() {
    return (
      null === R && (R = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)),
      R
    );
  }
  get panMode() {
    return this.options.panMode !== O || this.isTouchDevice ? A : O;
  }
  get panOnlyZoomed() {
    const t2 = this.options.panOnlyZoomed;
    return t2 === z ? this.isTouchDevice : t2;
  }
  get isInfinite() {
    return this.option("infinite");
  }
  get angle() {
    return (180 * Math.atan2(this.current.b, this.current.a)) / Math.PI || 0;
  }
  get targetAngle() {
    return (180 * Math.atan2(this.target.b, this.target.a)) / Math.PI || 0;
  }
  get scale() {
    const { a: t2, b: e2 } = this.current;
    return Math.sqrt(t2 * t2 + e2 * e2) || 1;
  }
  get targetScale() {
    const { a: t2, b: e2 } = this.target;
    return Math.sqrt(t2 * t2 + e2 * e2) || 1;
  }
  get minScale() {
    return this.option("minScale") || 1;
  }
  get fullScale() {
    const { contentRect: t2 } = this;
    return t2.fullWidth / t2.fitWidth || 1;
  }
  get maxScale() {
    return this.fullScale * (this.option("maxScale") || 1) || 1;
  }
  get coverScale() {
    const { containerRect: t2, contentRect: e2 } = this,
      i2 = Math.max(t2.height / e2.fitHeight, t2.width / e2.fitWidth) || 1;
    return Math.min(this.fullScale, i2);
  }
  get isScaling() {
    return Math.abs(this.targetScale - this.scale) > 1e-5 && !this.isResting;
  }
  get isContentLoading() {
    const t2 = this.content;
    return !!(t2 && t2 instanceof HTMLImageElement) && !t2.complete;
  }
  get isResting() {
    if (this.isBouncingX || this.isBouncingY) return false;
    for (const t2 of v) {
      const e2 = "e" == t2 || "f" === t2 ? 1e-4 : 1e-5;
      if (Math.abs(this.target[t2] - this.current[t2]) > e2) return false;
    }
    return !(!this.ignoreBounds && !this.checkBounds().inBounds);
  }
  constructor(t2, e2 = {}, i2 = {}) {
    var s2;
    if (
      (super(e2),
      Object.defineProperty(this, "pointerTracker", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "resizeObserver", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "updateTimer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "clickTimer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "rAF", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "isTicking", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "ignoreBounds", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "isBouncingX", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "isBouncingY", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "clicks", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "trackingPoints", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: [],
      }),
      Object.defineProperty(this, "pwt", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "cwd", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "pmme", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "friction", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: m.Init,
      }),
      Object.defineProperty(this, "isDragging", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "container", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "content", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "spinner", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "containerRect", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: { width: 0, height: 0, innerWidth: 0, innerHeight: 0 },
      }),
      Object.defineProperty(this, "contentRect", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          fullWidth: 0,
          fullHeight: 0,
          fitWidth: 0,
          fitHeight: 0,
          width: 0,
          height: 0,
        },
      }),
      Object.defineProperty(this, "dragStart", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: { x: 0, y: 0, top: 0, left: 0, time: 0 },
      }),
      Object.defineProperty(this, "dragOffset", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: { x: 0, y: 0, time: 0 },
      }),
      Object.defineProperty(this, "current", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: Object.assign({}, C),
      }),
      Object.defineProperty(this, "target", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: Object.assign({}, C),
      }),
      Object.defineProperty(this, "velocity", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 },
      }),
      Object.defineProperty(this, "lockedAxis", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      !t2)
    )
      throw new Error("Container Element Not Found");
    ((this.container = t2),
      this.initContent(),
      this.attachPlugins(Object.assign(Object.assign({}, I.Plugins), i2)),
      this.emit("attachPlugins"),
      this.emit("init"));
    const o2 = this.content;
    if (
      (o2.addEventListener("load", this.onLoad),
      o2.addEventListener("error", this.onError),
      this.isContentLoading)
    ) {
      if (this.option("spinner")) {
        t2.classList.add(this.cn("isLoading"));
        const e3 = n(x);
        !t2.contains(o2) || o2.parentElement instanceof HTMLPictureElement
          ? (this.spinner = t2.appendChild(e3))
          : (this.spinner =
              (null === (s2 = o2.parentElement) || void 0 === s2
                ? void 0
                : s2.insertBefore(e3, o2)) || null);
      }
      this.emit("beforeLoad");
    } else
      queueMicrotask(() => {
        this.enable();
      });
  }
  initContent() {
    const { container: t2 } = this,
      e2 = this.cn(L);
    let i2 = this.option(L) || t2.querySelector(`.${e2}`);
    if (
      (i2 ||
        ((i2 = t2.querySelector("img,picture") || t2.firstElementChild),
        i2 && P(i2, e2)),
      i2 instanceof HTMLPictureElement && (i2 = i2.querySelector("img")),
      !i2)
    )
      throw new Error("No content found");
    this.content = i2;
  }
  onLoad() {
    const { spinner: t2, container: e2, state: i2 } = this;
    (t2 && (t2.remove(), (this.spinner = null)),
      this.option("spinner") && e2.classList.remove(this.cn("isLoading")),
      this.emit("afterLoad"),
      i2 === m.Init ? this.enable() : this.updateMetrics());
  }
  onError() {
    this.state !== m.Destroy &&
      (this.spinner && (this.spinner.remove(), (this.spinner = null)),
      this.stop(),
      this.detachEvents(),
      (this.state = m.Error),
      this.emit("error"));
  }
  getNextScale(t2) {
    const {
      fullScale: e2,
      targetScale: i2,
      coverScale: n2,
      maxScale: s2,
      minScale: o2,
    } = this;
    let a2 = o2;
    switch (t2) {
      case "toggleMax":
        a2 = i2 - o2 < 0.5 * (s2 - o2) ? s2 : o2;
        break;
      case "toggleCover":
        a2 = i2 - o2 < 0.5 * (n2 - o2) ? n2 : o2;
        break;
      case "toggleZoom":
        a2 = i2 - o2 < 0.5 * (e2 - o2) ? e2 : o2;
        break;
      case "iterateZoom":
        let t3 = [1, e2, s2].sort((t4, e3) => t4 - e3),
          r2 = t3.findIndex((t4) => t4 > i2 + 1e-5);
        a2 = t3[r2] || 1;
    }
    return a2;
  }
  attachObserver() {
    var t2;
    const e2 = () => {
      const { container: t3, containerRect: e3 } = this;
      return (
        Math.abs(e3.width - t3.getBoundingClientRect().width) > 0.1 ||
        Math.abs(e3.height - t3.getBoundingClientRect().height) > 0.1
      );
    };
    (this.resizeObserver ||
      void 0 === window.ResizeObserver ||
      (this.resizeObserver = new ResizeObserver(() => {
        this.updateTimer ||
          (e2()
            ? (this.onResize(),
              this.isMobile &&
                (this.updateTimer = setTimeout(() => {
                  (e2() && this.onResize(), (this.updateTimer = null));
                }, 500)))
            : this.updateTimer &&
              (clearTimeout(this.updateTimer), (this.updateTimer = null)));
      })),
      null === (t2 = this.resizeObserver) ||
        void 0 === t2 ||
        t2.observe(this.container));
  }
  detachObserver() {
    var t2;
    null === (t2 = this.resizeObserver) || void 0 === t2 || t2.disconnect();
  }
  attachEvents() {
    const { container: t2 } = this;
    (t2.addEventListener("click", this.onClick, {
      passive: false,
      capture: false,
    }),
      t2.addEventListener("wheel", this.onWheel, { passive: false }),
      (this.pointerTracker = new l(t2, {
        start: this.onPointerDown,
        move: this.onPointerMove,
        end: this.onPointerUp,
      })),
      document.addEventListener(O, this.onMouseMove));
  }
  detachEvents() {
    var t2;
    const { container: e2 } = this;
    (e2.removeEventListener("click", this.onClick, {
      passive: false,
      capture: false,
    }),
      e2.removeEventListener("wheel", this.onWheel, { passive: false }),
      null === (t2 = this.pointerTracker) || void 0 === t2 || t2.stop(),
      (this.pointerTracker = null),
      document.removeEventListener(O, this.onMouseMove),
      document.removeEventListener("keydown", this.onKeydown, true),
      this.clickTimer &&
        (clearTimeout(this.clickTimer), (this.clickTimer = null)),
      this.updateTimer &&
        (clearTimeout(this.updateTimer), (this.updateTimer = null)));
  }
  animate() {
    this.setTargetForce();
    const t2 = this.friction,
      e2 = this.option("maxVelocity");
    for (const i2 of v)
      t2
        ? ((this.velocity[i2] *= 1 - t2),
          e2 &&
            !this.isScaling &&
            (this.velocity[i2] = Math.max(
              Math.min(this.velocity[i2], e2),
              -1 * e2
            )),
          (this.current[i2] += this.velocity[i2]))
        : (this.current[i2] = this.target[i2]);
    (this.setTransform(),
      this.setEdgeForce(),
      !this.isResting || this.isDragging
        ? (this.rAF = requestAnimationFrame(() => this.animate()))
        : this.stop("current"));
  }
  setTargetForce() {
    for (const t2 of v)
      ("e" === t2 && this.isBouncingX) ||
        ("f" === t2 && this.isBouncingY) ||
        (this.velocity[t2] =
          (1 / (1 - this.friction) - 1) * (this.target[t2] - this.current[t2]));
  }
  checkBounds(t2 = 0, e2 = 0) {
    const { current: i2 } = this,
      n2 = i2.e + t2,
      s2 = i2.f + e2,
      o2 = this.getBounds(),
      { x: a2, y: r2 } = o2,
      l2 = a2.min,
      c2 = a2.max,
      h2 = r2.min,
      d2 = r2.max;
    let u2 = 0,
      p2 = 0;
    return (
      l2 !== 1 / 0 && n2 < l2
        ? (u2 = l2 - n2)
        : c2 !== 1 / 0 && n2 > c2 && (u2 = c2 - n2),
      h2 !== 1 / 0 && s2 < h2
        ? (p2 = h2 - s2)
        : d2 !== 1 / 0 && s2 > d2 && (p2 = d2 - s2),
      Math.abs(u2) < 1e-4 && (u2 = 0),
      Math.abs(p2) < 1e-4 && (p2 = 0),
      Object.assign(Object.assign({}, o2), {
        xDiff: u2,
        yDiff: p2,
        inBounds: !u2 && !p2,
      })
    );
  }
  clampTargetBounds() {
    const { target: t2 } = this,
      { x: e2, y: i2 } = this.getBounds();
    (e2.min !== 1 / 0 && (t2.e = Math.max(t2.e, e2.min)),
      e2.max !== 1 / 0 && (t2.e = Math.min(t2.e, e2.max)),
      i2.min !== 1 / 0 && (t2.f = Math.max(t2.f, i2.min)),
      i2.max !== 1 / 0 && (t2.f = Math.min(t2.f, i2.max)));
  }
  calculateContentDim(t2 = this.current) {
    const { content: e2, contentRect: i2 } = this,
      { fitWidth: n2, fitHeight: s2, fullWidth: o2, fullHeight: a2 } = i2;
    let r2 = o2,
      l2 = a2;
    if (this.option("zoom") || 0 !== this.angle) {
      const i3 =
          !(e2 instanceof HTMLImageElement) &&
          ("none" === window.getComputedStyle(e2).maxWidth ||
            "none" === window.getComputedStyle(e2).maxHeight),
        c2 = i3 ? o2 : n2,
        h2 = i3 ? a2 : s2,
        d2 = this.getMatrix(t2),
        u2 = new DOMPoint(0, 0).matrixTransform(d2),
        p2 = new DOMPoint(0 + c2, 0).matrixTransform(d2),
        f2 = new DOMPoint(0 + c2, 0 + h2).matrixTransform(d2),
        g2 = new DOMPoint(0, 0 + h2).matrixTransform(d2),
        m2 = Math.abs(f2.x - u2.x),
        v2 = Math.abs(f2.y - u2.y),
        b2 = Math.abs(g2.x - p2.x),
        y2 = Math.abs(g2.y - p2.y);
      ((r2 = Math.max(m2, b2)), (l2 = Math.max(v2, y2)));
    }
    return { contentWidth: r2, contentHeight: l2 };
  }
  setEdgeForce() {
    if (
      this.ignoreBounds ||
      this.isDragging ||
      this.panMode === O ||
      this.targetScale < this.scale
    )
      return ((this.isBouncingX = false), void (this.isBouncingY = false));
    const { target: t2 } = this,
      { x: e2, y: i2, xDiff: n2, yDiff: s2 } = this.checkBounds();
    const o2 = this.option("maxVelocity");
    let a2 = this.velocity.e,
      r2 = this.velocity.f;
    (0 !== n2
      ? ((this.isBouncingX = true),
        n2 * a2 <= 0
          ? (a2 += 0.14 * n2)
          : ((a2 = 0.14 * n2),
            e2.min !== 1 / 0 && (this.target.e = Math.max(t2.e, e2.min)),
            e2.max !== 1 / 0 && (this.target.e = Math.min(t2.e, e2.max))),
        o2 && (a2 = Math.max(Math.min(a2, o2), -1 * o2)))
      : (this.isBouncingX = false),
      0 !== s2
        ? ((this.isBouncingY = true),
          s2 * r2 <= 0
            ? (r2 += 0.14 * s2)
            : ((r2 = 0.14 * s2),
              i2.min !== 1 / 0 && (this.target.f = Math.max(t2.f, i2.min)),
              i2.max !== 1 / 0 && (this.target.f = Math.min(t2.f, i2.max))),
          o2 && (r2 = Math.max(Math.min(r2, o2), -1 * o2)))
        : (this.isBouncingY = false),
      this.isBouncingX && (this.velocity.e = a2),
      this.isBouncingY && (this.velocity.f = r2));
  }
  enable() {
    const { content: t2 } = this,
      e2 = new DOMMatrixReadOnly(window.getComputedStyle(t2).transform);
    for (const t3 of v) this.current[t3] = this.target[t3] = e2[t3];
    (this.updateMetrics(),
      this.attachObserver(),
      this.attachEvents(),
      (this.state = m.Ready),
      this.emit("ready"));
  }
  onClick(t2) {
    var e2;
    ("click" === t2.type &&
      0 === t2.detail &&
      ((this.dragOffset.x = 0), (this.dragOffset.y = 0)),
      this.isDragging &&
        (null === (e2 = this.pointerTracker) || void 0 === e2 || e2.clear(),
        (this.trackingPoints = []),
        this.startDecelAnim()));
    const i2 = t2.target;
    if (!i2 || t2.defaultPrevented) return;
    if (i2.hasAttribute("disabled"))
      return (t2.preventDefault(), void t2.stopPropagation());
    if (
      (() => {
        const t3 = window.getSelection();
        return t3 && "Range" === t3.type;
      })() &&
      !i2.closest("button")
    )
      return;
    const n2 = i2.closest("[data-panzoom-action]"),
      s2 = i2.closest("[data-panzoom-change]"),
      o2 = n2 || s2,
      a2 = o2 && E(o2) ? o2.dataset : null;
    if (a2) {
      const e3 = a2.panzoomChange,
        i3 = a2.panzoomAction;
      if (((e3 || i3) && t2.preventDefault(), e3)) {
        let t3 = {};
        try {
          t3 = JSON.parse(e3);
        } catch (t4) {
          console && console.warn("The given data was not valid JSON");
        }
        return void this.applyChange(t3);
      }
      if (i3) return void (this[i3] && this[i3]());
    }
    if (Math.abs(this.dragOffset.x) > 3 || Math.abs(this.dragOffset.y) > 3)
      return (t2.preventDefault(), void t2.stopPropagation());
    if (i2.closest("[data-fancybox]")) return;
    const r2 = this.content.getBoundingClientRect(),
      l2 = this.dragStart;
    if (
      l2.time &&
      !this.canZoomOut() &&
      (Math.abs(r2.x - l2.x) > 2 || Math.abs(r2.y - l2.y) > 2)
    )
      return;
    this.dragStart.time = 0;
    const c2 = (e3) => {
        this.option("zoom", t2) &&
          e3 &&
          "string" == typeof e3 &&
          /(iterateZoom)|(toggle(Zoom|Full|Cover|Max)|(zoomTo(Fit|Cover|Max)))/.test(
            e3
          ) &&
          "function" == typeof this[e3] &&
          (t2.preventDefault(), this[e3]({ event: t2 }));
      },
      h2 = this.option("click", t2),
      d2 = this.option("dblClick", t2);
    d2
      ? (this.clicks++,
        1 == this.clicks &&
          (this.clickTimer = setTimeout(() => {
            (1 === this.clicks
              ? (this.emit("click", t2), !t2.defaultPrevented && h2 && c2(h2))
              : (this.emit("dblClick", t2), t2.defaultPrevented || c2(d2)),
              (this.clicks = 0),
              (this.clickTimer = null));
          }, 350)))
      : (this.emit("click", t2), !t2.defaultPrevented && h2 && c2(h2));
  }
  addTrackingPoint(t2) {
    const e2 = this.trackingPoints.filter((t3) => t3.time > Date.now() - 100);
    (e2.push(t2), (this.trackingPoints = e2));
  }
  onPointerDown(t2, e2, i2) {
    var n2;
    if (false === this.option("touch", t2)) return false;
    ((this.pwt = 0),
      (this.dragOffset = { x: 0, y: 0, time: 0 }),
      (this.trackingPoints = []));
    const s2 = this.content.getBoundingClientRect();
    if (
      ((this.dragStart = {
        x: s2.x,
        y: s2.y,
        top: s2.top,
        left: s2.left,
        time: Date.now(),
      }),
      this.clickTimer)
    )
      return false;
    if (this.panMode === O && this.targetScale > 1)
      return (t2.preventDefault(), t2.stopPropagation(), false);
    const o2 = t2.composedPath()[0];
    if (!i2.length) {
      if (
        ["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO", "IFRAME"].includes(
          o2.nodeName
        ) ||
        o2.closest(
          "[contenteditable],[data-selectable],[data-draggable],[data-clickable],[data-panzoom-change],[data-panzoom-action]"
        )
      )
        return false;
      null === (n2 = window.getSelection()) ||
        void 0 === n2 ||
        n2.removeAllRanges();
    }
    if ("mousedown" === t2.type)
      ["A", "BUTTON"].includes(o2.nodeName) || t2.preventDefault();
    else if (Math.abs(this.velocity.a) > 0.3) return false;
    return (
      (this.target.e = this.current.e),
      (this.target.f = this.current.f),
      this.stop(),
      this.isDragging ||
        ((this.isDragging = true),
        this.addTrackingPoint(e2),
        this.emit("touchStart", t2)),
      true
    );
  }
  onPointerMove(e2, n2, s2) {
    if (false === this.option("touch", e2)) return;
    if (!this.isDragging) return;
    if (
      n2.length < 2 &&
      this.panOnlyZoomed &&
      t(this.targetScale) <= t(this.minScale)
    )
      return;
    if ((this.emit("touchMove", e2), e2.defaultPrevented)) return;
    this.addTrackingPoint(n2[0]);
    const { content: o2 } = this,
      a2 = h(s2[0], s2[1]),
      r2 = h(n2[0], n2[1]);
    let l2 = 0,
      d2 = 0;
    if (n2.length > 1) {
      const t2 = o2.getBoundingClientRect();
      ((l2 = a2.clientX - t2.left - 0.5 * t2.width),
        (d2 = a2.clientY - t2.top - 0.5 * t2.height));
    }
    const u2 = c(s2[0], s2[1]),
      p2 = c(n2[0], n2[1]);
    let f2 = u2 ? p2 / u2 : 1,
      g2 = r2.clientX - a2.clientX,
      m2 = r2.clientY - a2.clientY;
    ((this.dragOffset.x += g2),
      (this.dragOffset.y += m2),
      (this.dragOffset.time = Date.now() - this.dragStart.time));
    let v2 =
      t(this.targetScale) === t(this.minScale) && this.option("lockAxis");
    if (v2 && !this.lockedAxis)
      if ("xy" === v2 || "y" === v2 || "touchmove" === e2.type) {
        if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6)
          return void e2.preventDefault();
        const t2 = Math.abs(
          (180 * Math.atan2(this.dragOffset.y, this.dragOffset.x)) / Math.PI
        );
        ((this.lockedAxis = t2 > 45 && t2 < 135 ? "y" : "x"),
          (this.dragOffset.x = 0),
          (this.dragOffset.y = 0),
          (g2 = 0),
          (m2 = 0));
      } else this.lockedAxis = v2;
    if (
      (i(e2.target, this.content) && ((v2 = "x"), (this.dragOffset.y = 0)),
      v2 &&
        "xy" !== v2 &&
        this.lockedAxis !== v2 &&
        t(this.targetScale) === t(this.minScale))
    )
      return;
    (e2.cancelable && e2.preventDefault(),
      this.container.classList.add(this.cn("isDragging")));
    const b2 = this.checkBounds(g2, m2);
    this.option("rubberband")
      ? ("x" !== this.isInfinite &&
          ((b2.xDiff > 0 && g2 < 0) || (b2.xDiff < 0 && g2 > 0)) &&
          (g2 *= Math.max(
            0,
            0.5 - Math.abs((0.75 / this.contentRect.fitWidth) * b2.xDiff)
          )),
        "y" !== this.isInfinite &&
          ((b2.yDiff > 0 && m2 < 0) || (b2.yDiff < 0 && m2 > 0)) &&
          (m2 *= Math.max(
            0,
            0.5 - Math.abs((0.75 / this.contentRect.fitHeight) * b2.yDiff)
          )))
      : (b2.xDiff && (g2 = 0), b2.yDiff && (m2 = 0));
    const y2 = this.targetScale,
      w2 = this.minScale,
      x2 = this.maxScale;
    (y2 < 0.5 * w2 && (f2 = Math.max(f2, w2)),
      y2 > 1.5 * x2 && (f2 = Math.min(f2, x2)),
      "y" === this.lockedAxis && t(y2) === t(w2) && (g2 = 0),
      "x" === this.lockedAxis && t(y2) === t(w2) && (m2 = 0),
      this.applyChange({
        originX: l2,
        originY: d2,
        panX: g2,
        panY: m2,
        scale: f2,
        friction: this.option("dragFriction"),
        ignoreBounds: true,
      }));
  }
  onPointerUp(t2, e2, n2) {
    if (n2.length)
      return (
        (this.dragOffset.x = 0),
        (this.dragOffset.y = 0),
        void (this.trackingPoints = [])
      );
    (this.container.classList.remove(this.cn("isDragging")),
      this.isDragging &&
        (this.addTrackingPoint(e2),
        this.panOnlyZoomed &&
          this.contentRect.width - this.contentRect.fitWidth < 1 &&
          this.contentRect.height - this.contentRect.fitHeight < 1 &&
          (this.trackingPoints = []),
        i(t2.target, this.content) &&
          "y" === this.lockedAxis &&
          (this.trackingPoints = []),
        this.emit("touchEnd", t2),
        (this.isDragging = false),
        (this.lockedAxis = false),
        this.state !== m.Destroy &&
          (t2.defaultPrevented || this.startDecelAnim())));
  }
  startDecelAnim() {
    var e2;
    const i2 = this.isScaling;
    (this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
      (this.isBouncingX = false),
      (this.isBouncingY = false));
    for (const t2 of v) this.velocity[t2] = 0;
    ((this.target.e = this.current.e),
      (this.target.f = this.current.f),
      S(this.container, "is-scaling"),
      S(this.container, "is-animating"),
      (this.isTicking = false));
    const { trackingPoints: n2 } = this,
      s2 = n2[0],
      o2 = n2[n2.length - 1];
    let a2 = 0,
      r2 = 0,
      l2 = 0;
    o2 &&
      s2 &&
      ((a2 = o2.clientX - s2.clientX),
      (r2 = o2.clientY - s2.clientY),
      (l2 = o2.time - s2.time));
    const c2 =
      (null === (e2 = window.visualViewport) || void 0 === e2
        ? void 0
        : e2.scale) || 1;
    1 !== c2 && ((a2 *= c2), (r2 *= c2));
    let h2 = 0,
      d2 = 0,
      u2 = 0,
      p2 = 0,
      f2 = this.option("decelFriction");
    const g2 = this.targetScale;
    if (l2 > 0) {
      ((u2 = Math.abs(a2) > 3 ? a2 / (l2 / 30) : 0),
        (p2 = Math.abs(r2) > 3 ? r2 / (l2 / 30) : 0));
      const t2 = this.option("maxVelocity");
      t2 &&
        ((u2 = Math.max(Math.min(u2, t2), -1 * t2)),
        (p2 = Math.max(Math.min(p2, t2), -1 * t2)));
    }
    (u2 && (h2 = u2 / (1 / (1 - f2) - 1)),
      p2 && (d2 = p2 / (1 / (1 - f2) - 1)),
      ("y" === this.option("lockAxis") ||
        ("xy" === this.option("lockAxis") &&
          "y" === this.lockedAxis &&
          t(g2) === this.minScale)) &&
        (h2 = u2 = 0),
      ("x" === this.option("lockAxis") ||
        ("xy" === this.option("lockAxis") &&
          "x" === this.lockedAxis &&
          t(g2) === this.minScale)) &&
        (d2 = p2 = 0));
    const m2 = this.dragOffset.x,
      b2 = this.dragOffset.y,
      y2 = this.option("dragMinThreshold") || 0;
    (Math.abs(m2) < y2 && Math.abs(b2) < y2 && ((h2 = d2 = 0), (u2 = p2 = 0)),
      ((this.option("zoom") &&
        (g2 < this.minScale - 1e-5 || g2 > this.maxScale + 1e-5)) ||
        (i2 && !h2 && !d2)) &&
        (f2 = 0.35),
      this.applyChange({ panX: h2, panY: d2, friction: f2 }),
      this.emit("decel", u2, p2, m2, b2));
  }
  onWheel(t2) {
    var e2 = [-t2.deltaX || 0, -t2.deltaY || 0, -t2.detail || 0].reduce(
      function (t3, e3) {
        return Math.abs(e3) > Math.abs(t3) ? e3 : t3;
      }
    );
    const i2 = Math.max(-1, Math.min(1, e2));
    if ((this.emit("wheel", t2, i2), this.panMode === O)) return;
    if (t2.defaultPrevented) return;
    const n2 = this.option("wheel");
    "pan" === n2
      ? (t2.preventDefault(),
        (this.panOnlyZoomed && !this.canZoomOut()) ||
          this.applyChange({
            panX: 2 * -t2.deltaX,
            panY: 2 * -t2.deltaY,
            bounce: false,
          }))
      : "zoom" === n2 &&
        false !== this.option("zoom") &&
        this.zoomWithWheel(t2);
  }
  onMouseMove(t2) {
    this.panWithMouse(t2);
  }
  onKeydown(t2) {
    "Escape" === t2.key && this.toggleFS();
  }
  onResize() {
    (this.updateMetrics(), this.checkBounds().inBounds || this.requestTick());
  }
  setTransform() {
    this.emit("beforeTransform");
    const { current: e2, target: i2, content: n2, contentRect: s2 } = this,
      o2 = Object.assign({}, C);
    for (const n3 of v) {
      const s3 = "e" == n3 || "f" === n3 ? M : T;
      ((o2[n3] = t(e2[n3], s3)),
        Math.abs(i2[n3] - e2[n3]) < ("e" == n3 || "f" === n3 ? 0.51 : 1e-3) &&
          (e2[n3] = i2[n3]));
    }
    let { a: a2, b: r2, c: l2, d: c2, e: h2, f: d2 } = o2,
      u2 = `matrix(${a2}, ${r2}, ${l2}, ${c2}, ${h2}, ${d2})`,
      p2 =
        n2.parentElement instanceof HTMLPictureElement ? n2.parentElement : n2;
    if (
      (this.option("transformParent") && (p2 = p2.parentElement || p2),
      p2.style.transform === u2)
    )
      return;
    p2.style.transform = u2;
    const { contentWidth: f2, contentHeight: g2 } = this.calculateContentDim();
    ((s2.width = f2), (s2.height = g2), this.emit("afterTransform"));
  }
  updateMetrics(e2 = false) {
    var i2;
    if (!this || this.state === m.Destroy) return;
    if (this.isContentLoading) return;
    const n2 = Math.max(
        1,
        (null === (i2 = window.visualViewport) || void 0 === i2
          ? void 0
          : i2.scale) || 1
      ),
      { container: s2, content: o2 } = this,
      a2 = o2 instanceof HTMLImageElement,
      r2 = s2.getBoundingClientRect(),
      l2 = getComputedStyle(this.container);
    let c2 = r2.width * n2,
      h2 = r2.height * n2;
    const d2 = parseFloat(l2.paddingTop) + parseFloat(l2.paddingBottom),
      u2 = c2 - (parseFloat(l2.paddingLeft) + parseFloat(l2.paddingRight)),
      p2 = h2 - d2;
    this.containerRect = {
      width: c2,
      height: h2,
      innerWidth: u2,
      innerHeight: p2,
    };
    const f2 =
        parseFloat(o2.dataset.width || "") ||
        ((t2) => {
          let e3 = 0;
          return (
            (e3 =
              t2 instanceof HTMLImageElement
                ? t2.naturalWidth
                : t2 instanceof SVGElement
                  ? t2.width.baseVal.value
                  : Math.max(t2.offsetWidth, t2.scrollWidth)),
            e3 || 0
          );
        })(o2),
      g2 =
        parseFloat(o2.dataset.height || "") ||
        ((t2) => {
          let e3 = 0;
          return (
            (e3 =
              t2 instanceof HTMLImageElement
                ? t2.naturalHeight
                : t2 instanceof SVGElement
                  ? t2.height.baseVal.value
                  : Math.max(t2.offsetHeight, t2.scrollHeight)),
            e3 || 0
          );
        })(o2);
    let v2 = this.option("width", f2) || z,
      b2 = this.option("height", g2) || z;
    const y2 = v2 === z,
      w2 = b2 === z;
    ("number" != typeof v2 && (v2 = f2),
      "number" != typeof b2 && (b2 = g2),
      y2 && (v2 = f2 * (b2 / g2)),
      w2 && (b2 = g2 / (f2 / v2)));
    let x2 =
      o2.parentElement instanceof HTMLPictureElement ? o2.parentElement : o2;
    this.option("transformParent") && (x2 = x2.parentElement || x2);
    const E2 = x2.getAttribute("style") || "";
    (x2.style.setProperty("transform", "none", "important"),
      a2 && ((x2.style.width = ""), (x2.style.height = "")),
      x2.offsetHeight);
    const S2 = o2.getBoundingClientRect();
    let P2 = S2.width * n2,
      C2 = S2.height * n2,
      T2 = P2,
      M2 = C2;
    ((P2 = Math.min(P2, v2)),
      (C2 = Math.min(C2, b2)),
      a2
        ? ({ width: P2, height: C2 } = ((t2, e3, i3, n3) => {
            const s3 = i3 / t2,
              o3 = n3 / e3,
              a3 = Math.min(s3, o3);
            return { width: (t2 *= a3), height: (e3 *= a3) };
          })(v2, b2, P2, C2))
        : ((P2 = Math.min(P2, v2)), (C2 = Math.min(C2, b2))));
    let O2 = 0.5 * (M2 - C2),
      A2 = 0.5 * (T2 - P2);
    ((this.contentRect = Object.assign(Object.assign({}, this.contentRect), {
      top: S2.top - r2.top + O2,
      bottom: r2.bottom - S2.bottom + O2,
      left: S2.left - r2.left + A2,
      right: r2.right - S2.right + A2,
      fitWidth: P2,
      fitHeight: C2,
      width: P2,
      height: C2,
      fullWidth: v2,
      fullHeight: b2,
    })),
      (x2.style.cssText = E2),
      a2 && ((x2.style.width = `${P2}px`), (x2.style.height = `${C2}px`)),
      this.setTransform(),
      true !== e2 && this.emit("refresh"),
      this.ignoreBounds ||
        (t(this.targetScale) < t(this.minScale)
          ? this.zoomTo(this.minScale, { friction: 0 })
          : this.targetScale > this.maxScale
            ? this.zoomTo(this.maxScale, { friction: 0 })
            : this.state === m.Init ||
              this.checkBounds().inBounds ||
              this.requestTick()),
      this.updateControls());
  }
  calculateBounds() {
    const { contentWidth: e2, contentHeight: i2 } = this.calculateContentDim(
        this.target
      ),
      { targetScale: n2, lockedAxis: s2 } = this,
      { fitWidth: o2, fitHeight: a2 } = this.contentRect;
    let r2 = 0,
      l2 = 0,
      c2 = 0,
      h2 = 0;
    const d2 = this.option("infinite");
    if (true === d2 || (s2 && d2 === s2))
      ((r2 = -1 / 0), (c2 = 1 / 0), (l2 = -1 / 0), (h2 = 1 / 0));
    else {
      let { containerRect: s3, contentRect: d3 } = this,
        u2 = t(o2 * n2, M),
        p2 = t(a2 * n2, M),
        { innerWidth: f2, innerHeight: g2 } = s3;
      if (
        (s3.width === u2 && (f2 = s3.width),
        s3.width === p2 && (g2 = s3.height),
        e2 > f2)
      ) {
        ((c2 = 0.5 * (e2 - f2)), (r2 = -1 * c2));
        let t2 = 0.5 * (d3.right - d3.left);
        ((r2 += t2), (c2 += t2));
      }
      if (
        (o2 > f2 &&
          e2 < f2 &&
          ((r2 -= 0.5 * (o2 - f2)), (c2 -= 0.5 * (o2 - f2))),
        i2 > g2)
      ) {
        ((h2 = 0.5 * (i2 - g2)), (l2 = -1 * h2));
        let t2 = 0.5 * (d3.bottom - d3.top);
        ((l2 += t2), (h2 += t2));
      }
      a2 > g2 && i2 < g2 && ((r2 -= 0.5 * (a2 - g2)), (c2 -= 0.5 * (a2 - g2)));
    }
    return { x: { min: r2, max: c2 }, y: { min: l2, max: h2 } };
  }
  getBounds() {
    const t2 = this.option("bounds");
    return t2 !== z ? t2 : this.calculateBounds();
  }
  updateControls() {
    const e2 = this,
      i2 = e2.container,
      { panMode: n2, contentRect: s2, targetScale: a2, minScale: r2 } = e2;
    let l2 = r2,
      c2 = e2.option("click") || false;
    c2 && (l2 = e2.getNextScale(c2));
    let h2 = e2.canZoomIn(),
      d2 = e2.canZoomOut(),
      u2 = n2 === A && !!this.option("touch"),
      p2 = d2 && u2;
    if (
      (u2 &&
        (t(a2) < t(r2) && !this.panOnlyZoomed && (p2 = true),
        (t(s2.width, 1) > t(s2.fitWidth, 1) ||
          t(s2.height, 1) > t(s2.fitHeight, 1)) &&
          (p2 = true)),
      t(s2.width * a2, 1) < t(s2.fitWidth, 1) && (p2 = false),
      n2 === O && (p2 = false),
      o(i2, this.cn("isDraggable"), p2),
      !this.option("zoom"))
    )
      return;
    let f2 = h2 && t(l2) > t(a2),
      g2 = !f2 && !p2 && d2 && t(l2) < t(a2);
    (o(i2, this.cn("canZoomIn"), f2), o(i2, this.cn("canZoomOut"), g2));
    for (const t2 of i2.querySelectorAll("[data-panzoom-action]")) {
      let e3 = false,
        i3 = false;
      switch (t2.dataset.panzoomAction) {
        case "zoomIn":
          h2 ? (e3 = true) : (i3 = true);
          break;
        case "zoomOut":
          d2 ? (e3 = true) : (i3 = true);
          break;
        case "toggleZoom":
        case "iterateZoom":
          h2 || d2 ? (e3 = true) : (i3 = true);
          const n3 = t2.querySelector("g");
          n3 && (n3.style.display = h2 ? "" : "none");
      }
      e3
        ? (t2.removeAttribute("disabled"), t2.removeAttribute("tabindex"))
        : i3 &&
          (t2.setAttribute("disabled", ""), t2.setAttribute("tabindex", "-1"));
    }
  }
  panTo({
    x: t2 = this.target.e,
    y: e2 = this.target.f,
    scale: i2 = this.targetScale,
    friction: n2 = this.option("friction"),
    angle: s2 = 0,
    originX: o2 = 0,
    originY: a2 = 0,
    flipX: r2 = false,
    flipY: l2 = false,
    ignoreBounds: c2 = false,
  }) {
    this.state !== m.Destroy &&
      this.applyChange({
        panX: t2 - this.target.e,
        panY: e2 - this.target.f,
        scale: i2 / this.targetScale,
        angle: s2,
        originX: o2,
        originY: a2,
        friction: n2,
        flipX: r2,
        flipY: l2,
        ignoreBounds: c2,
      });
  }
  applyChange({
    panX: e2 = 0,
    panY: i2 = 0,
    scale: n2 = 1,
    angle: s2 = 0,
    originX: o2 = -this.current.e,
    originY: a2 = -this.current.f,
    friction: r2 = this.option("friction"),
    flipX: l2 = false,
    flipY: c2 = false,
    ignoreBounds: h2 = false,
    bounce: d2 = this.option("bounce"),
  }) {
    const u2 = this.state;
    if (u2 === m.Destroy) return;
    (this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
      (this.friction = r2 || 0),
      (this.ignoreBounds = h2));
    const { current: p2 } = this,
      f2 = p2.e,
      g2 = p2.f,
      b2 = this.getMatrix(this.target);
    let y2 = new DOMMatrix()
      .translate(f2, g2)
      .translate(o2, a2)
      .translate(e2, i2);
    if (this.option("zoom")) {
      if (!h2) {
        const t2 = this.targetScale,
          e3 = this.minScale,
          i3 = this.maxScale;
        (t2 * n2 < e3 && (n2 = e3 / t2), t2 * n2 > i3 && (n2 = i3 / t2));
      }
      y2 = y2.scale(n2);
    }
    ((y2 = y2.translate(-o2, -a2).translate(-f2, -g2).multiply(b2)),
      s2 && (y2 = y2.rotate(s2)),
      l2 && (y2 = y2.scale(-1, 1)),
      c2 && (y2 = y2.scale(1, -1)));
    for (const e3 of v)
      "e" !== e3 &&
      "f" !== e3 &&
      (y2[e3] > this.minScale + 1e-5 || y2[e3] < this.minScale - 1e-5)
        ? (this.target[e3] = y2[e3])
        : (this.target[e3] = t(y2[e3], M));
    ((this.targetScale < this.scale ||
      Math.abs(n2 - 1) > 0.1 ||
      this.panMode === O ||
      false === d2) &&
      !h2 &&
      this.clampTargetBounds(),
      u2 === m.Init
        ? this.animate()
        : this.isResting || ((this.state = m.Panning), this.requestTick()));
  }
  stop(t2 = false) {
    if (this.state === m.Init || this.state === m.Destroy) return;
    const e2 = this.isTicking;
    (this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
      (this.isBouncingX = false),
      (this.isBouncingY = false));
    for (const e3 of v)
      ((this.velocity[e3] = 0),
        "current" === t2
          ? (this.current[e3] = this.target[e3])
          : "target" === t2 && (this.target[e3] = this.current[e3]));
    (this.setTransform(),
      S(this.container, "is-scaling"),
      S(this.container, "is-animating"),
      (this.isTicking = false),
      (this.state = m.Ready),
      e2 && (this.emit("endAnimation"), this.updateControls()));
  }
  requestTick() {
    (this.isTicking ||
      (this.emit("startAnimation"),
      this.updateControls(),
      P(this.container, "is-animating"),
      this.isScaling && P(this.container, "is-scaling")),
      (this.isTicking = true),
      this.rAF || (this.rAF = requestAnimationFrame(() => this.animate())));
  }
  panWithMouse(e2, i2 = this.option("mouseMoveFriction")) {
    if (((this.pmme = e2), this.panMode !== O || !e2)) return;
    if (t(this.targetScale) <= t(this.minScale)) return;
    this.emit("mouseMove", e2);
    const { container: n2, containerRect: s2, contentRect: o2 } = this,
      a2 = s2.width,
      r2 = s2.height,
      l2 = n2.getBoundingClientRect(),
      c2 = (e2.clientX || 0) - l2.left,
      h2 = (e2.clientY || 0) - l2.top;
    let { contentWidth: d2, contentHeight: u2 } = this.calculateContentDim(
      this.target
    );
    const p2 = this.option("mouseMoveFactor");
    p2 > 1 && (d2 !== a2 && (d2 *= p2), u2 !== r2 && (u2 *= p2));
    let f2 = 0.5 * (d2 - a2) - (((c2 / a2) * 100) / 100) * (d2 - a2);
    f2 += 0.5 * (o2.right - o2.left);
    let g2 = 0.5 * (u2 - r2) - (((h2 / r2) * 100) / 100) * (u2 - r2);
    ((g2 += 0.5 * (o2.bottom - o2.top)),
      this.applyChange({
        panX: f2 - this.target.e,
        panY: g2 - this.target.f,
        friction: i2,
      }));
  }
  zoomWithWheel(e2) {
    if (this.state === m.Destroy || this.state === m.Init) return;
    const i2 = Date.now();
    if (i2 - this.pwt < 45) return void e2.preventDefault();
    this.pwt = i2;
    var n2 = [-e2.deltaX || 0, -e2.deltaY || 0, -e2.detail || 0].reduce(
      function (t2, e3) {
        return Math.abs(e3) > Math.abs(t2) ? e3 : t2;
      }
    );
    const s2 = Math.max(-1, Math.min(1, n2)),
      { targetScale: o2, maxScale: a2, minScale: r2 } = this;
    let l2 = (o2 * (100 + 45 * s2)) / 100;
    (t(l2) < t(r2) && t(o2) <= t(r2)
      ? ((this.cwd += Math.abs(s2)), (l2 = r2))
      : t(l2) > t(a2) && t(o2) >= t(a2)
        ? ((this.cwd += Math.abs(s2)), (l2 = a2))
        : ((this.cwd = 0), (l2 = Math.max(Math.min(l2, a2), r2))),
      this.cwd > this.option("wheelLimit") ||
        (e2.preventDefault(),
        t(l2) !== t(o2) && this.zoomTo(l2, { event: e2 })));
  }
  canZoomIn() {
    return (
      this.option("zoom") &&
      (t(this.contentRect.width, 1) < t(this.contentRect.fitWidth, 1) ||
        t(this.targetScale) < t(this.maxScale))
    );
  }
  canZoomOut() {
    return this.option("zoom") && t(this.targetScale) > t(this.minScale);
  }
  zoomIn(t2 = 1.25, e2) {
    this.zoomTo(this.targetScale * t2, e2);
  }
  zoomOut(t2 = 0.8, e2) {
    this.zoomTo(this.targetScale * t2, e2);
  }
  zoomToFit(t2) {
    this.zoomTo("fit", t2);
  }
  zoomToCover(t2) {
    this.zoomTo("cover", t2);
  }
  zoomToFull(t2) {
    this.zoomTo("full", t2);
  }
  zoomToMax(t2) {
    this.zoomTo("max", t2);
  }
  toggleZoom(t2) {
    this.zoomTo(this.getNextScale("toggleZoom"), t2);
  }
  toggleMax(t2) {
    this.zoomTo(this.getNextScale("toggleMax"), t2);
  }
  toggleCover(t2) {
    this.zoomTo(this.getNextScale("toggleCover"), t2);
  }
  iterateZoom(t2) {
    this.zoomTo("next", t2);
  }
  zoomTo(
    t2 = 1,
    { friction: e2 = z, originX: i2 = z, originY: n2 = z, event: s2 } = {}
  ) {
    if (this.isContentLoading || this.state === m.Destroy) return;
    const {
      targetScale: o2,
      fullScale: a2,
      maxScale: r2,
      coverScale: l2,
    } = this;
    if (
      (this.stop(),
      this.panMode === O && (s2 = this.pmme || s2),
      s2 || i2 === z || n2 === z)
    ) {
      const t3 = this.content.getBoundingClientRect(),
        e3 = this.container.getBoundingClientRect(),
        o3 = s2 ? s2.clientX : e3.left + 0.5 * e3.width,
        a3 = s2 ? s2.clientY : e3.top + 0.5 * e3.height;
      ((i2 = o3 - t3.left - 0.5 * t3.width),
        (n2 = a3 - t3.top - 0.5 * t3.height));
    }
    let c2 = 1;
    ("number" == typeof t2
      ? (c2 = t2)
      : "full" === t2
        ? (c2 = a2)
        : "cover" === t2
          ? (c2 = l2)
          : "max" === t2
            ? (c2 = r2)
            : "fit" === t2
              ? (c2 = 1)
              : "next" === t2 && (c2 = this.getNextScale("iterateZoom")),
      (c2 = c2 / o2 || 1),
      (e2 = e2 === z ? (c2 > 1 ? 0.15 : 0.25) : e2),
      this.applyChange({ scale: c2, originX: i2, originY: n2, friction: e2 }),
      s2 && this.panMode === O && this.panWithMouse(s2, e2));
  }
  rotateCCW() {
    this.applyChange({ angle: -90 });
  }
  rotateCW() {
    this.applyChange({ angle: 90 });
  }
  flipX() {
    this.applyChange({ flipX: true });
  }
  flipY() {
    this.applyChange({ flipY: true });
  }
  fitX() {
    this.stop("target");
    const { containerRect: t2, contentRect: e2, target: i2 } = this;
    this.applyChange({
      panX: 0.5 * t2.width - (e2.left + 0.5 * e2.fitWidth) - i2.e,
      panY: 0.5 * t2.height - (e2.top + 0.5 * e2.fitHeight) - i2.f,
      scale: t2.width / e2.fitWidth / this.targetScale,
      originX: 0,
      originY: 0,
      ignoreBounds: true,
    });
  }
  fitY() {
    this.stop("target");
    const { containerRect: t2, contentRect: e2, target: i2 } = this;
    this.applyChange({
      panX: 0.5 * t2.width - (e2.left + 0.5 * e2.fitWidth) - i2.e,
      panY: 0.5 * t2.innerHeight - (e2.top + 0.5 * e2.fitHeight) - i2.f,
      scale: t2.height / e2.fitHeight / this.targetScale,
      originX: 0,
      originY: 0,
      ignoreBounds: true,
    });
  }
  toggleFS() {
    const { container: t2 } = this,
      e2 = this.cn("inFullscreen"),
      i2 = this.cn("htmlHasFullscreen");
    t2.classList.toggle(e2);
    const n2 = t2.classList.contains(e2);
    (n2
      ? (document.documentElement.classList.add(i2),
        document.addEventListener("keydown", this.onKeydown, true))
      : (document.documentElement.classList.remove(i2),
        document.removeEventListener("keydown", this.onKeydown, true)),
      this.updateMetrics(),
      this.emit(n2 ? "enterFS" : "exitFS"));
  }
  getMatrix(t2 = this.current) {
    const { a: e2, b: i2, c: n2, d: s2, e: o2, f: a2 } = t2;
    return new DOMMatrix([e2, i2, n2, s2, o2, a2]);
  }
  reset(t2) {
    if (this.state !== m.Init && this.state !== m.Destroy) {
      this.stop("current");
      for (const t3 of v) this.target[t3] = C[t3];
      ((this.target.a = this.minScale),
        (this.target.d = this.minScale),
        this.clampTargetBounds(),
        this.isResting ||
          ((this.friction = void 0 === t2 ? this.option("friction") : t2),
          (this.state = m.Panning),
          this.requestTick()));
    }
  }
  destroy() {
    (this.stop(),
      (this.state = m.Destroy),
      this.detachEvents(),
      this.detachObserver());
    const { container: t2, content: e2 } = this,
      i2 = this.option("classes") || {};
    for (const e3 of Object.values(i2)) t2.classList.remove(e3 + "");
    (e2 &&
      (e2.removeEventListener("load", this.onLoad),
      e2.removeEventListener("error", this.onError)),
      this.detachPlugins());
  }
}
(Object.defineProperty(I, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: y,
}),
  Object.defineProperty(I, "Plugins", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {},
  }));
const D = function (t2, e2) {
    let i2 = true;
    return (...n2) => {
      i2 &&
        ((i2 = false),
        t2(...n2),
        setTimeout(() => {
          i2 = true;
        }, e2));
    };
  },
  F = (t2, e2) => {
    let i2 = [];
    return (
      t2.childNodes.forEach((t3) => {
        t3.nodeType !== Node.ELEMENT_NODE ||
          (e2 && !t3.matches(e2)) ||
          i2.push(t3);
      }),
      i2
    );
  },
  j = {
    viewport: null,
    track: null,
    enabled: true,
    slides: [],
    axis: "x",
    transition: "fade",
    preload: 1,
    slidesPerPage: "auto",
    initialPage: 0,
    friction: 0.12,
    Panzoom: { decelFriction: 0.12 },
    center: true,
    infinite: true,
    fill: true,
    dragFree: false,
    adaptiveHeight: false,
    direction: "ltr",
    classes: {
      container: "f-carousel",
      viewport: "f-carousel__viewport",
      track: "f-carousel__track",
      slide: "f-carousel__slide",
      isLTR: "is-ltr",
      isRTL: "is-rtl",
      isHorizontal: "is-horizontal",
      isVertical: "is-vertical",
      inTransition: "in-transition",
      isSelected: "is-selected",
    },
    l10n: {
      NEXT: "Next slide",
      PREV: "Previous slide",
      GOTO: "Go to slide #%d",
    },
  };
var B;
!(function (t2) {
  ((t2[(t2.Init = 0)] = "Init"),
    (t2[(t2.Ready = 1)] = "Ready"),
    (t2[(t2.Destroy = 2)] = "Destroy"));
})(B || (B = {}));
const H = (t2) => {
    if ("string" == typeof t2 || t2 instanceof HTMLElement) t2 = { html: t2 };
    else {
      const e2 = t2.thumb;
      void 0 !== e2 &&
        ("string" == typeof e2 && (t2.thumbSrc = e2),
        e2 instanceof HTMLImageElement &&
          ((t2.thumbEl = e2), (t2.thumbElSrc = e2.src), (t2.thumbSrc = e2.src)),
        delete t2.thumb);
    }
    return Object.assign(
      {
        html: "",
        el: null,
        isDom: false,
        class: "",
        customClass: "",
        index: -1,
        dim: 0,
        gap: 0,
        pos: 0,
        transition: false,
      },
      t2
    );
  },
  N = (t2 = {}) =>
    Object.assign({ index: -1, slides: [], dim: 0, pos: -1 }, t2);
class _ extends f {
  constructor(t2, e2) {
    (super(e2),
      Object.defineProperty(this, "instance", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: t2,
      }));
  }
  attach() {}
  detach() {}
}
const $ = {
  classes: {
    list: "f-carousel__dots",
    isDynamic: "is-dynamic",
    hasDots: "has-dots",
    dot: "f-carousel__dot",
    isBeforePrev: "is-before-prev",
    isPrev: "is-prev",
    isCurrent: "is-current",
    isNext: "is-next",
    isAfterNext: "is-after-next",
  },
  dotTpl:
    '<button type="button" data-carousel-page="%i" aria-label="{{GOTO}}"><span class="f-carousel__dot" aria-hidden="true"></span></button>',
  dynamicFrom: 11,
  maxCount: 1 / 0,
  minCount: 2,
};
class W extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "isDynamic", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "list", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }));
  }
  onRefresh() {
    this.refresh();
  }
  build() {
    let t2 = this.list;
    if (!t2) {
      ((t2 = document.createElement("ul")),
        P(t2, this.cn("list")),
        t2.setAttribute("role", "tablist"));
      const e2 = this.instance.container;
      (e2.appendChild(t2), P(e2, this.cn("hasDots")), (this.list = t2));
    }
    return t2;
  }
  refresh() {
    var t2;
    const e2 = this.instance.pages.length,
      i2 = Math.min(2, this.option("minCount")),
      n2 = Math.max(2e3, this.option("maxCount")),
      s2 = this.option("dynamicFrom");
    if (e2 < i2 || e2 > n2) return void this.cleanup();
    const a2 = "number" == typeof s2 && e2 > 5 && e2 >= s2,
      r2 =
        !this.list || this.isDynamic !== a2 || this.list.children.length !== e2;
    r2 && this.cleanup();
    const l2 = this.build();
    if ((o(l2, this.cn("isDynamic"), !!a2), r2))
      for (let t3 = 0; t3 < e2; t3++) l2.append(this.createItem(t3));
    let c2,
      h2 = 0;
    for (const e3 of [...l2.children]) {
      const i3 = h2 === this.instance.page;
      (i3 && (c2 = e3),
        o(e3, this.cn("isCurrent"), i3),
        null === (t2 = e3.children[0]) ||
          void 0 === t2 ||
          t2.setAttribute("aria-selected", i3 ? "true" : "false"));
      for (const t3 of ["isBeforePrev", "isPrev", "isNext", "isAfterNext"])
        S(e3, this.cn(t3));
      h2++;
    }
    if (((c2 = c2 || l2.firstChild), a2 && c2)) {
      const t3 = c2.previousElementSibling,
        e3 = t3 && t3.previousElementSibling;
      (P(t3, this.cn("isPrev")), P(e3, this.cn("isBeforePrev")));
      const i3 = c2.nextElementSibling,
        n3 = i3 && i3.nextElementSibling;
      (P(i3, this.cn("isNext")), P(n3, this.cn("isAfterNext")));
    }
    this.isDynamic = a2;
  }
  createItem(t2 = 0) {
    var e2;
    const i2 = document.createElement("li");
    i2.setAttribute("role", "presentation");
    const s2 = n(
      this.instance
        .localize(this.option("dotTpl"), [["%d", t2 + 1]])
        .replace(/\%i/g, t2 + "")
    );
    return (
      i2.appendChild(s2),
      null === (e2 = i2.children[0]) ||
        void 0 === e2 ||
        e2.setAttribute("role", "tab"),
      i2
    );
  }
  cleanup() {
    (this.list && (this.list.remove(), (this.list = null)),
      (this.isDynamic = false),
      S(this.instance.container, this.cn("hasDots")));
  }
  attach() {
    this.instance.on(["refresh", "change"], this.onRefresh);
  }
  detach() {
    (this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup());
  }
}
Object.defineProperty(W, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: $,
});
const X = "disabled",
  q = "next",
  Y = "prev";
class V extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "container", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "prev", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "next", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "isDom", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }));
  }
  onRefresh() {
    const t2 = this.instance,
      e2 = t2.pages.length,
      i2 = t2.page;
    if (e2 < 2) return void this.cleanup();
    this.build();
    let n2 = this.prev,
      s2 = this.next;
    n2 &&
      s2 &&
      (n2.removeAttribute(X),
      s2.removeAttribute(X),
      t2.isInfinite ||
        (i2 <= 0 && n2.setAttribute(X, ""),
        i2 >= e2 - 1 && s2.setAttribute(X, "")));
  }
  addBtn(t2) {
    var e2;
    const i2 = this.instance,
      n2 = document.createElement("button");
    (n2.setAttribute("tabindex", "0"),
      n2.setAttribute("title", i2.localize(`{{${t2.toUpperCase()}}}`)),
      P(n2, this.cn("button") + " " + this.cn(t2 === q ? "isNext" : "isPrev")));
    const s2 = i2.isRTL ? (t2 === q ? Y : q) : t2;
    var o2;
    return (
      (n2.innerHTML = i2.localize(this.option(`${s2}Tpl`))),
      (n2.dataset[
        `carousel${((o2 = t2), o2 ? (o2.match("^[a-z]") ? o2.charAt(0).toUpperCase() + o2.substring(1) : o2) : "")}`
      ] = "true"),
      null === (e2 = this.container) || void 0 === e2 || e2.appendChild(n2),
      n2
    );
  }
  build() {
    const t2 = this.instance.container,
      e2 = this.cn("container");
    let { container: i2, prev: n2, next: s2 } = this;
    (i2 || ((i2 = t2.querySelector("." + e2)), (this.isDom = !!i2)),
      i2 ||
        ((i2 = document.createElement("div")), P(i2, e2), t2.appendChild(i2)),
      (this.container = i2),
      s2 || (s2 = i2.querySelector("[data-carousel-next]")),
      s2 || (s2 = this.addBtn(q)),
      (this.next = s2),
      n2 || (n2 = i2.querySelector("[data-carousel-prev]")),
      n2 || (n2 = this.addBtn(Y)),
      (this.prev = n2));
  }
  cleanup() {
    (this.isDom ||
      (this.prev && this.prev.remove(),
      this.next && this.next.remove(),
      this.container && this.container.remove()),
      (this.prev = null),
      (this.next = null),
      (this.container = null),
      (this.isDom = false));
  }
  attach() {
    this.instance.on(["refresh", "change"], this.onRefresh);
  }
  detach() {
    (this.instance.off(["refresh", "change"], this.onRefresh), this.cleanup());
  }
}
Object.defineProperty(V, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: {
    classes: {
      container: "f-carousel__nav",
      button: "f-button",
      isNext: "is-next",
      isPrev: "is-prev",
    },
    nextTpl:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>',
    prevTpl:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>',
  },
});
class Z extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "selectedIndex", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "target", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "nav", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }));
  }
  addAsTargetFor(t2) {
    ((this.target = this.instance), (this.nav = t2), this.attachEvents());
  }
  addAsNavFor(t2) {
    ((this.nav = this.instance), (this.target = t2), this.attachEvents());
  }
  attachEvents() {
    const { nav: t2, target: e2 } = this;
    t2 &&
      e2 &&
      ((t2.options.initialSlide = e2.options.initialPage),
      t2.state === B.Ready
        ? this.onNavReady(t2)
        : t2.on("ready", this.onNavReady),
      e2.state === B.Ready
        ? this.onTargetReady(e2)
        : e2.on("ready", this.onTargetReady));
  }
  onNavReady(t2) {
    (t2.on("createSlide", this.onNavCreateSlide),
      t2.on("Panzoom.click", this.onNavClick),
      t2.on("Panzoom.touchEnd", this.onNavTouch),
      this.onTargetChange());
  }
  onTargetReady(t2) {
    (t2.on("change", this.onTargetChange),
      t2.on("Panzoom.refresh", this.onTargetChange),
      this.onTargetChange());
  }
  onNavClick(t2, e2, i2) {
    this.onNavTouch(t2, t2.panzoom, i2);
  }
  onNavTouch(t2, e2, i2) {
    var n2, s2;
    if (Math.abs(e2.dragOffset.x) > 3 || Math.abs(e2.dragOffset.y) > 3) return;
    const o2 = i2.target,
      { nav: a2, target: r2 } = this;
    if (!a2 || !r2 || !o2) return;
    const l2 = o2.closest("[data-index]");
    if ((i2.stopPropagation(), i2.preventDefault(), !l2)) return;
    const c2 = parseInt(l2.dataset.index || "", 10) || 0,
      h2 = r2.getPageForSlide(c2),
      d2 = a2.getPageForSlide(c2);
    (a2.slideTo(d2),
      r2.slideTo(h2, {
        friction:
          (null ===
            (s2 =
              null === (n2 = this.nav) || void 0 === n2
                ? void 0
                : n2.plugins) || void 0 === s2
            ? void 0
            : s2.Sync.option("friction")) || 0,
      }),
      this.markSelectedSlide(c2));
  }
  onNavCreateSlide(t2, e2) {
    e2.index === this.selectedIndex && this.markSelectedSlide(e2.index);
  }
  onTargetChange() {
    var t2, e2;
    const { target: i2, nav: n2 } = this;
    if (!i2 || !n2) return;
    if (n2.state !== B.Ready || i2.state !== B.Ready) return;
    const s2 =
        null ===
          (e2 =
            null === (t2 = i2.pages[i2.page]) || void 0 === t2
              ? void 0
              : t2.slides[0]) || void 0 === e2
          ? void 0
          : e2.index,
      o2 = n2.getPageForSlide(s2);
    (this.markSelectedSlide(s2),
      n2.slideTo(
        o2,
        null === n2.prevPage && null === i2.prevPage ? { friction: 0 } : void 0
      ));
  }
  markSelectedSlide(t2) {
    const e2 = this.nav;
    e2 &&
      e2.state === B.Ready &&
      ((this.selectedIndex = t2),
      [...e2.slides].map((e3) => {
        e3.el &&
          e3.el.classList[e3.index === t2 ? "add" : "remove"](
            "is-nav-selected"
          );
      }));
  }
  attach() {
    const t2 = this;
    let e2 = t2.options.target,
      i2 = t2.options.nav;
    e2 ? t2.addAsNavFor(e2) : i2 && t2.addAsTargetFor(i2);
  }
  detach() {
    const t2 = this,
      e2 = t2.nav,
      i2 = t2.target;
    (e2 &&
      (e2.off("ready", t2.onNavReady),
      e2.off("createSlide", t2.onNavCreateSlide),
      e2.off("Panzoom.click", t2.onNavClick),
      e2.off("Panzoom.touchEnd", t2.onNavTouch)),
      (t2.nav = null),
      i2 &&
        (i2.off("ready", t2.onTargetReady),
        i2.off("refresh", t2.onTargetChange),
        i2.off("change", t2.onTargetChange)),
      (t2.target = null));
  }
}
Object.defineProperty(Z, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: { friction: 0.35 },
});
const U = { Navigation: V, Dots: W, Sync: Z },
  G = "animationend",
  K = "isSelected",
  J = "slide";
class Q extends g {
  get axis() {
    return this.isHorizontal ? "e" : "f";
  }
  get isEnabled() {
    return this.state === B.Ready;
  }
  get isInfinite() {
    let t2 = false;
    const { contentDim: e2, viewportDim: i2, pages: n2, slides: s2 } = this,
      o2 = s2[0];
    return (
      n2.length >= 2 &&
        o2 &&
        e2 + o2.dim >= i2 &&
        (t2 = this.option("infinite")),
      t2
    );
  }
  get isRTL() {
    return "rtl" === this.option("direction");
  }
  get isHorizontal() {
    return "x" === this.option("axis");
  }
  constructor(t2, e2 = {}, i2 = {}) {
    if (
      (super(),
      Object.defineProperty(this, "bp", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "",
      }),
      Object.defineProperty(this, "lp", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "userOptions", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {},
      }),
      Object.defineProperty(this, "userPlugins", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {},
      }),
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: B.Init,
      }),
      Object.defineProperty(this, "page", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "prevPage", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "container", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      Object.defineProperty(this, "viewport", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "track", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "slides", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: [],
      }),
      Object.defineProperty(this, "pages", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: [],
      }),
      Object.defineProperty(this, "panzoom", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "inTransition", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: /* @__PURE__ */ new Set(),
      }),
      Object.defineProperty(this, "contentDim", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "viewportDim", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      "string" == typeof t2 && (t2 = document.querySelector(t2)),
      !t2 || !E(t2))
    )
      throw new Error("No Element found");
    ((this.container = t2),
      (this.slideNext = D(this.slideNext.bind(this), 150)),
      (this.slidePrev = D(this.slidePrev.bind(this), 150)),
      (this.userOptions = e2),
      (this.userPlugins = i2),
      queueMicrotask(() => {
        this.processOptions();
      }));
  }
  processOptions() {
    var t2, e2;
    const i2 = u({}, Q.defaults, this.userOptions);
    let n2 = "";
    const s2 = i2.breakpoints;
    if (s2 && d(s2))
      for (const [t3, e3] of Object.entries(s2))
        window.matchMedia(t3).matches && d(e3) && ((n2 += t3), u(i2, e3));
    (n2 === this.bp && this.state !== B.Init) ||
      ((this.bp = n2),
      this.state === B.Ready &&
        (i2.initialSlide =
          (null ===
            (e2 =
              null === (t2 = this.pages[this.page]) || void 0 === t2
                ? void 0
                : t2.slides[0]) || void 0 === e2
            ? void 0
            : e2.index) || 0),
      this.state !== B.Init && this.destroy(),
      super.setOptions(i2),
      false === this.option("enabled")
        ? this.attachEvents()
        : setTimeout(() => {
            this.init();
          }, 0));
  }
  init() {
    ((this.state = B.Init),
      this.emit("init"),
      this.attachPlugins(
        Object.assign(Object.assign({}, Q.Plugins), this.userPlugins)
      ),
      this.emit("attachPlugins"),
      this.initLayout(),
      this.initSlides(),
      this.updateMetrics(),
      this.setInitialPosition(),
      this.initPanzoom(),
      this.attachEvents(),
      (this.state = B.Ready),
      this.emit("ready"));
  }
  initLayout() {
    const { container: t2 } = this,
      e2 = this.option("classes");
    (P(t2, this.cn("container")),
      o(t2, e2.isLTR, !this.isRTL),
      o(t2, e2.isRTL, this.isRTL),
      o(t2, e2.isVertical, !this.isHorizontal),
      o(t2, e2.isHorizontal, this.isHorizontal));
    let i2 = this.option("viewport") || t2.querySelector(`.${e2.viewport}`);
    (i2 ||
      ((i2 = document.createElement("div")),
      P(i2, e2.viewport),
      i2.append(...F(t2, `.${e2.slide}`)),
      t2.prepend(i2)),
      i2.addEventListener("scroll", this.onScroll));
    let n2 = this.option("track") || t2.querySelector(`.${e2.track}`);
    (n2 ||
      ((n2 = document.createElement("div")),
      P(n2, e2.track),
      n2.append(...Array.from(i2.childNodes))),
      n2.setAttribute("aria-live", "polite"),
      i2.contains(n2) || i2.prepend(n2),
      (this.viewport = i2),
      (this.track = n2),
      this.emit("initLayout"));
  }
  initSlides() {
    const { track: t2 } = this;
    if (!t2) return;
    const e2 = [...this.slides],
      i2 = [];
    [...F(t2, `.${this.cn(J)}`)].forEach((t3) => {
      if (E(t3)) {
        const e3 = H({ el: t3, isDom: true, index: this.slides.length });
        i2.push(e3);
      }
    });
    for (let t3 of [...(this.option("slides", []) || []), ...e2])
      i2.push(H(t3));
    this.slides = i2;
    for (let t3 = 0; t3 < this.slides.length; t3++) this.slides[t3].index = t3;
    for (const t3 of i2)
      (this.emit("beforeInitSlide", t3, t3.index),
        this.emit("initSlide", t3, t3.index));
    this.emit("initSlides");
  }
  setInitialPage() {
    const t2 = this.option("initialSlide");
    this.page =
      "number" == typeof t2
        ? this.getPageForSlide(t2)
        : parseInt(this.option("initialPage", 0) + "", 10) || 0;
  }
  setInitialPosition() {
    const { track: t2, pages: e2, isHorizontal: i2 } = this;
    if (!t2 || !e2.length) return;
    let n2 = this.page;
    e2[n2] || (this.page = n2 = 0);
    const s2 = (e2[n2].pos || 0) * (this.isRTL && i2 ? 1 : -1),
      o2 = i2 ? `${s2}px` : "0",
      a2 = i2 ? "0" : `${s2}px`;
    ((t2.style.transform = `translate3d(${o2}, ${a2}, 0) scale(1)`),
      this.option("adaptiveHeight") && this.setViewportHeight());
  }
  initPanzoom() {
    this.panzoom && (this.panzoom.destroy(), (this.panzoom = null));
    const t2 = this.option("Panzoom") || {};
    ((this.panzoom = new I(
      this.viewport,
      u(
        {},
        {
          content: this.track,
          zoom: false,
          panOnlyZoomed: false,
          lockAxis: this.isHorizontal ? "x" : "y",
          infinite: this.isInfinite,
          click: false,
          dblClick: false,
          touch: (t3) => !(this.pages.length < 2 && !t3.options.infinite),
          bounds: () => this.getBounds(),
          maxVelocity: (t3) =>
            Math.abs(t3.target[this.axis] - t3.current[this.axis]) <
            2 * this.viewportDim
              ? 100
              : 0,
        },
        t2
      )
    )),
      this.panzoom.on("*", (t3, e2, ...i2) => {
        this.emit(`Panzoom.${e2}`, t3, ...i2);
      }),
      this.panzoom.on("decel", this.onDecel),
      this.panzoom.on("refresh", this.onRefresh),
      this.panzoom.on("beforeTransform", this.onBeforeTransform),
      this.panzoom.on("endAnimation", this.onEndAnimation));
  }
  attachEvents() {
    const t2 = this.container;
    (t2 &&
      (t2.addEventListener("click", this.onClick, {
        passive: false,
        capture: false,
      }),
      t2.addEventListener("slideTo", this.onSlideTo)),
      window.addEventListener("resize", this.onResize));
  }
  createPages() {
    let t2 = [];
    const { contentDim: e2, viewportDim: i2 } = this;
    let n2 = this.option("slidesPerPage");
    n2 =
      ("auto" === n2 || e2 <= i2) && false !== this.option("fill")
        ? 1 / 0
        : parseFloat(n2 + "");
    let s2 = 0,
      o2 = 0,
      a2 = 0;
    for (const e3 of this.slides)
      ((!t2.length || o2 + e3.dim - i2 > 0.05 || a2 >= n2) &&
        (t2.push(N()), (s2 = t2.length - 1), (o2 = 0), (a2 = 0)),
        t2[s2].slides.push(e3),
        (o2 += e3.dim + e3.gap),
        a2++);
    return t2;
  }
  processPages() {
    const e2 = this.pages,
      { contentDim: i2, viewportDim: n2, isInfinite: s2 } = this,
      o2 = this.option("center"),
      a2 = this.option("fill"),
      r2 = a2 && o2 && i2 > n2 && !s2;
    if (
      (e2.forEach((t2, e3) => {
        var s3;
        ((t2.index = e3),
          (t2.pos =
            (null === (s3 = t2.slides[0]) || void 0 === s3 ? void 0 : s3.pos) ||
            0),
          (t2.dim = 0));
        for (const [e4, i3] of t2.slides.entries())
          ((t2.dim += i3.dim), e4 < t2.slides.length - 1 && (t2.dim += i3.gap));
        r2 && t2.pos + 0.5 * t2.dim < 0.5 * n2
          ? (t2.pos = 0)
          : r2 && t2.pos + 0.5 * t2.dim >= i2 - 0.5 * n2
            ? (t2.pos = i2 - n2)
            : o2 && (t2.pos += -0.5 * (n2 - t2.dim));
      }),
      e2.forEach((e3) => {
        (a2 &&
          !s2 &&
          i2 > n2 &&
          ((e3.pos = Math.max(e3.pos, 0)),
          (e3.pos = Math.min(e3.pos, i2 - n2))),
          (e3.pos = t(e3.pos, 1e3)),
          (e3.dim = t(e3.dim, 1e3)),
          Math.abs(e3.pos) <= 0.1 && (e3.pos = 0));
      }),
      s2)
    )
      return e2;
    const l2 = [];
    let c2;
    return (
      e2.forEach((t2) => {
        const e3 = Object.assign({}, t2);
        c2 && e3.pos === c2.pos
          ? ((c2.dim += e3.dim), (c2.slides = [...c2.slides, ...e3.slides]))
          : ((e3.index = l2.length), (c2 = e3), l2.push(e3));
      }),
      l2
    );
  }
  getPageFromIndex(t2 = 0) {
    const e2 = this.pages.length;
    let i2;
    return (
      (t2 = parseInt((t2 || 0).toString()) || 0),
      (i2 = this.isInfinite
        ? ((t2 % e2) + e2) % e2
        : Math.max(Math.min(t2, e2 - 1), 0)),
      i2
    );
  }
  getSlideMetrics(e2) {
    var i2, n2;
    const s2 = this.isHorizontal ? "width" : "height";
    let o2 = 0,
      a2 = 0,
      r2 = e2.el;
    const l2 = !(!r2 || r2.parentNode);
    if (
      (r2
        ? (o2 = parseFloat(r2.dataset[s2] || "") || 0)
        : ((r2 = document.createElement("div")),
          (r2.style.visibility = "hidden"),
          (this.track || document.body).prepend(r2)),
      P(r2, this.cn(J) + " " + e2.class + " " + e2.customClass),
      o2)
    )
      ((r2.style[s2] = `${o2}px`),
        (r2.style["width" === s2 ? "height" : "width"] = ""));
    else {
      (l2 && (this.track || document.body).prepend(r2),
        (o2 =
          r2.getBoundingClientRect()[s2] *
          Math.max(
            1,
            (null === (i2 = window.visualViewport) || void 0 === i2
              ? void 0
              : i2.scale) || 1
          )));
      let t2 = r2[this.isHorizontal ? "offsetWidth" : "offsetHeight"];
      t2 - 1 > o2 && (o2 = t2);
    }
    const c2 = getComputedStyle(r2);
    return (
      "content-box" === c2.boxSizing &&
        (this.isHorizontal
          ? ((o2 += parseFloat(c2.paddingLeft) || 0),
            (o2 += parseFloat(c2.paddingRight) || 0))
          : ((o2 += parseFloat(c2.paddingTop) || 0),
            (o2 += parseFloat(c2.paddingBottom) || 0))),
      (a2 =
        parseFloat(c2[this.isHorizontal ? "marginRight" : "marginBottom"]) ||
        0),
      l2
        ? null === (n2 = r2.parentElement) ||
          void 0 === n2 ||
          n2.removeChild(r2)
        : e2.el || r2.remove(),
      { dim: t(o2, 1e3), gap: t(a2, 1e3) }
    );
  }
  getBounds() {
    const { isInfinite: t2, isRTL: e2, isHorizontal: i2, pages: n2 } = this;
    let s2 = { min: 0, max: 0 };
    if (t2) s2 = { min: -1 / 0, max: 1 / 0 };
    else if (n2.length) {
      const t3 = n2[0].pos,
        o2 = n2[n2.length - 1].pos;
      s2 = e2 && i2 ? { min: t3, max: o2 } : { min: -1 * o2, max: -1 * t3 };
    }
    return { x: i2 ? s2 : { min: 0, max: 0 }, y: i2 ? { min: 0, max: 0 } : s2 };
  }
  repositionSlides() {
    let e2,
      {
        isHorizontal: i2,
        isRTL: n2,
        isInfinite: s2,
        viewport: o2,
        viewportDim: a2,
        contentDim: r2,
        page: l2,
        pages: c2,
        slides: h2,
        panzoom: d2,
      } = this,
      u2 = 0,
      p2 = 0,
      f2 = 0,
      g2 = 0;
    (d2 ? (g2 = -1 * d2.current[this.axis]) : c2[l2] && (g2 = c2[l2].pos || 0),
      (e2 = i2 ? (n2 ? "right" : "left") : "top"),
      n2 && i2 && (g2 *= -1));
    for (const i3 of h2) {
      const n3 = i3.el;
      n3
        ? ("top" === e2
            ? ((n3.style.right = ""), (n3.style.left = ""))
            : (n3.style.top = ""),
          i3.index !== u2
            ? (n3.style[e2] = 0 === p2 ? "" : `${t(p2, 1e3)}px`)
            : (n3.style[e2] = ""),
          (f2 += i3.dim + i3.gap),
          u2++)
        : (p2 += i3.dim + i3.gap);
    }
    if (s2 && f2 && o2) {
      let n3 = getComputedStyle(o2),
        s3 = "padding",
        l3 = i2 ? "Right" : "Bottom",
        c3 = parseFloat(n3[s3 + (i2 ? "Left" : "Top")]);
      ((g2 -= c3), (a2 += c3), (a2 += parseFloat(n3[s3 + l3])));
      for (const i3 of h2)
        i3.el &&
          (t(i3.pos) < t(a2) &&
            t(i3.pos + i3.dim + i3.gap) < t(g2) &&
            t(g2) > t(r2 - a2) &&
            (i3.el.style[e2] = `${t(p2 + f2, 1e3)}px`),
          t(i3.pos + i3.gap) >= t(r2 - a2) &&
            t(i3.pos) > t(g2 + a2) &&
            t(g2) < t(a2) &&
            (i3.el.style[e2] = `-${t(f2, 1e3)}px`));
    }
    let m2,
      v2,
      b2 = [...this.inTransition];
    if ((b2.length > 1 && ((m2 = c2[b2[0]]), (v2 = c2[b2[1]])), m2 && v2)) {
      let i3 = 0;
      for (const n3 of h2)
        n3.el
          ? this.inTransition.has(n3.index) &&
            m2.slides.indexOf(n3) < 0 &&
            (n3.el.style[e2] = `${t(i3 + (m2.pos - v2.pos), 1e3)}px`)
          : (i3 += n3.dim + n3.gap);
    }
  }
  createSlideEl(t2) {
    const { track: e2, slides: i2 } = this;
    if (!e2 || !t2) return;
    if (t2.el && t2.el.parentNode) return;
    const n2 = t2.el || document.createElement("div");
    (P(n2, this.cn(J)), P(n2, t2.class), P(n2, t2.customClass));
    const s2 = t2.html;
    s2 &&
      (s2 instanceof HTMLElement
        ? n2.appendChild(s2)
        : (n2.innerHTML = t2.html + ""));
    const o2 = [];
    i2.forEach((t3, e3) => {
      t3.el && o2.push(e3);
    });
    const a2 = t2.index;
    let r2 = null;
    if (o2.length) {
      r2 =
        i2[
          o2.reduce((t3, e3) =>
            Math.abs(e3 - a2) < Math.abs(t3 - a2) ? e3 : t3
          )
        ];
    }
    const l2 =
      r2 && r2.el && r2.el.parentNode
        ? r2.index < t2.index
          ? r2.el.nextSibling
          : r2.el
        : null;
    (e2.insertBefore(n2, e2.contains(l2) ? l2 : null),
      (t2.el = n2),
      this.emit("createSlide", t2));
  }
  removeSlideEl(t2, e2 = false) {
    const i2 = null == t2 ? void 0 : t2.el;
    if (!i2 || !i2.parentNode) return;
    const n2 = this.cn(K);
    if (
      (i2.classList.contains(n2) && (S(i2, n2), this.emit("unselectSlide", t2)),
      t2.isDom && !e2)
    )
      return (
        i2.removeAttribute("aria-hidden"),
        i2.removeAttribute("data-index"),
        void (i2.style.left = "")
      );
    this.emit("removeSlide", t2);
    const s2 = new CustomEvent(G);
    (i2.dispatchEvent(s2), t2.el && (t2.el.remove(), (t2.el = null)));
  }
  transitionTo(t2 = 0, e2 = this.option("transition")) {
    var i2, n2, s2, o2;
    if (!e2) return false;
    const a2 = this.page,
      { pages: r2, panzoom: l2 } = this;
    t2 = parseInt((t2 || 0).toString()) || 0;
    const c2 = this.getPageFromIndex(t2);
    if (
      !l2 ||
      !r2[c2] ||
      r2.length < 2 ||
      Math.abs(
        ((null ===
          (n2 =
            null === (i2 = r2[a2]) || void 0 === i2 ? void 0 : i2.slides[0]) ||
        void 0 === n2
          ? void 0
          : n2.dim) || 0) - this.viewportDim
      ) > 1
    )
      return false;
    let h2 = t2 > a2 ? 1 : -1;
    this.isInfinite &&
      (0 === a2 && t2 === r2.length - 1 && (h2 = -1),
      a2 === r2.length - 1 && 0 === t2 && (h2 = 1));
    const d2 = r2[c2].pos * (this.isRTL ? 1 : -1);
    if (a2 === c2 && Math.abs(d2 - l2.target[this.axis]) < 1) return false;
    this.clearTransitions();
    const u2 = l2.isResting;
    P(this.container, this.cn("inTransition"));
    const p2 =
        (null === (s2 = r2[a2]) || void 0 === s2 ? void 0 : s2.slides[0]) ||
        null,
      f2 =
        (null === (o2 = r2[c2]) || void 0 === o2 ? void 0 : o2.slides[0]) ||
        null;
    (this.inTransition.add(f2.index), this.createSlideEl(f2));
    let g2 = p2.el,
      m2 = f2.el;
    u2 || e2 === J || ((e2 = "fadeFast"), (g2 = null));
    const v2 = this.isRTL ? "next" : "prev",
      b2 = this.isRTL ? "prev" : "next";
    return (
      g2 &&
        (this.inTransition.add(p2.index),
        (p2.transition = e2),
        g2.addEventListener(G, this.onAnimationEnd),
        g2.classList.add(`f-${e2}Out`, `to-${h2 > 0 ? b2 : v2}`)),
      m2 &&
        ((f2.transition = e2),
        m2.addEventListener(G, this.onAnimationEnd),
        m2.classList.add(`f-${e2}In`, `from-${h2 > 0 ? v2 : b2}`)),
      (l2.current[this.axis] = d2),
      (l2.target[this.axis] = d2),
      l2.requestTick(),
      this.onChange(c2),
      true
    );
  }
  manageSlideVisiblity() {
    const t2 = /* @__PURE__ */ new Set(),
      e2 = /* @__PURE__ */ new Set(),
      i2 = this.getVisibleSlides(
        parseFloat(this.option("preload", 0) + "") || 0
      );
    for (const n2 of this.slides) i2.has(n2) ? t2.add(n2) : e2.add(n2);
    for (const e3 of this.inTransition) t2.add(this.slides[e3]);
    for (const e3 of t2) (this.createSlideEl(e3), this.lazyLoadSlide(e3));
    for (const i3 of e2) t2.has(i3) || this.removeSlideEl(i3);
    (this.markSelectedSlides(), this.repositionSlides());
  }
  markSelectedSlides() {
    if (!this.pages[this.page] || !this.pages[this.page].slides) return;
    const t2 = "aria-hidden";
    let e2 = this.cn(K);
    if (e2)
      for (const i2 of this.slides) {
        const n2 = i2.el;
        n2 &&
          ((n2.dataset.index = `${i2.index}`),
          n2.classList.contains("f-thumbs__slide")
            ? this.getVisibleSlides(0).has(i2)
              ? n2.removeAttribute(t2)
              : n2.setAttribute(t2, "true")
            : this.pages[this.page].slides.includes(i2)
              ? (n2.classList.contains(e2) ||
                  (P(n2, e2), this.emit("selectSlide", i2)),
                n2.removeAttribute(t2))
              : (n2.classList.contains(e2) &&
                  (S(n2, e2), this.emit("unselectSlide", i2)),
                n2.setAttribute(t2, "true")));
      }
  }
  flipInfiniteTrack() {
    const {
        axis: t2,
        isHorizontal: e2,
        isInfinite: i2,
        isRTL: n2,
        viewportDim: s2,
        contentDim: o2,
      } = this,
      a2 = this.panzoom;
    if (!a2 || !i2) return;
    let r2 = a2.current[t2],
      l2 = a2.target[t2] - r2,
      c2 = 0,
      h2 = 0.5 * s2;
    (n2 && e2
      ? (r2 < -h2 && ((c2 = -1), (r2 += o2)),
        r2 > o2 - h2 && ((c2 = 1), (r2 -= o2)))
      : (r2 > h2 && ((c2 = 1), (r2 -= o2)),
        r2 < -o2 + h2 && ((c2 = -1), (r2 += o2))),
      c2 && ((a2.current[t2] = r2), (a2.target[t2] = r2 + l2)));
  }
  lazyLoadImg(t2, e2) {
    const i2 = this,
      s2 = "f-fadeIn",
      o2 = "is-preloading";
    let a2 = false,
      r2 = null;
    const l2 = () => {
      a2 ||
        ((a2 = true),
        r2 && (r2.remove(), (r2 = null)),
        S(e2, o2),
        e2.complete &&
          (P(e2, s2),
          setTimeout(() => {
            S(e2, s2);
          }, 350)),
        this.option("adaptiveHeight") &&
          t2.el &&
          this.pages[this.page].slides.indexOf(t2) > -1 &&
          (i2.updateMetrics(), i2.setViewportHeight()),
        this.emit("load", t2));
    };
    (P(e2, o2),
      (e2.src = e2.dataset.lazySrcset || e2.dataset.lazySrc || ""),
      delete e2.dataset.lazySrc,
      delete e2.dataset.lazySrcset,
      e2.addEventListener("error", () => {
        l2();
      }),
      e2.addEventListener("load", () => {
        l2();
      }),
      setTimeout(() => {
        const i3 = e2.parentNode;
        i3 &&
          t2.el &&
          (e2.complete ? l2() : a2 || ((r2 = n(x)), i3.insertBefore(r2, e2)));
      }, 300));
  }
  lazyLoadSlide(t2) {
    const e2 = t2 && t2.el;
    if (!e2) return;
    const i2 = /* @__PURE__ */ new Set();
    let n2 = Array.from(
      e2.querySelectorAll("[data-lazy-src],[data-lazy-srcset]")
    );
    (e2.dataset.lazySrc && n2.push(e2),
      n2.map((t3) => {
        t3 instanceof HTMLImageElement
          ? i2.add(t3)
          : t3 instanceof HTMLElement &&
            t3.dataset.lazySrc &&
            ((t3.style.backgroundImage = `url('${t3.dataset.lazySrc}')`),
            delete t3.dataset.lazySrc);
      }));
    for (const e3 of i2) this.lazyLoadImg(t2, e3);
  }
  onAnimationEnd(t2) {
    var e2;
    const i2 = t2.target,
      n2 = i2 ? parseInt(i2.dataset.index || "", 10) || 0 : -1,
      s2 = this.slides[n2],
      o2 = t2.animationName;
    if (!i2 || !s2 || !o2) return;
    const a2 = !!this.inTransition.has(n2) && s2.transition;
    (a2 &&
      o2.substring(0, a2.length + 2) === `f-${a2}` &&
      this.inTransition.delete(n2),
      this.inTransition.size || this.clearTransitions(),
      n2 === this.page &&
        (null === (e2 = this.panzoom) || void 0 === e2
          ? void 0
          : e2.isResting) &&
        this.emit("settle"));
  }
  onDecel(t2, e2 = 0, i2 = 0, n2 = 0, s2 = 0) {
    if (this.option("dragFree")) return void this.setPageFromPosition();
    const { isRTL: o2, isHorizontal: a2, axis: r2, pages: l2 } = this,
      c2 = l2.length,
      h2 = Math.abs(Math.atan2(i2, e2) / (Math.PI / 180));
    let d2 = 0;
    if (((d2 = h2 > 45 && h2 < 135 ? (a2 ? 0 : i2) : a2 ? e2 : 0), !c2)) return;
    let u2 = this.page,
      p2 = o2 && a2 ? 1 : -1;
    const f2 = t2.current[r2] * p2;
    let { pageIndex: g2 } = this.getPageFromPosition(f2);
    (Math.abs(d2) > 5
      ? (l2[u2].dim <
          document.documentElement[
            "client" + (this.isHorizontal ? "Width" : "Height")
          ] -
            1 && (u2 = g2),
        (u2 = o2 && a2 ? (d2 < 0 ? u2 - 1 : u2 + 1) : d2 < 0 ? u2 + 1 : u2 - 1))
      : (u2 = 0 === n2 && 0 === s2 ? u2 : g2),
      this.slideTo(u2, {
        transition: false,
        friction: t2.option("decelFriction"),
      }));
  }
  onClick(t2) {
    const e2 = t2.target,
      i2 = e2 && E(e2) ? e2.dataset : null;
    let n2, s2;
    (i2 &&
      (void 0 !== i2.carouselPage
        ? ((s2 = "slideTo"), (n2 = i2.carouselPage))
        : void 0 !== i2.carouselNext
          ? (s2 = "slideNext")
          : void 0 !== i2.carouselPrev && (s2 = "slidePrev")),
      s2
        ? (t2.preventDefault(),
          t2.stopPropagation(),
          e2 && !e2.hasAttribute("disabled") && this[s2](n2))
        : this.emit("click", t2));
  }
  onSlideTo(t2) {
    const e2 = t2.detail || 0;
    this.slideTo(this.getPageForSlide(e2), { friction: 0 });
  }
  onChange(t2, e2 = 0) {
    const i2 = this.page;
    ((this.prevPage = i2),
      (this.page = t2),
      this.option("adaptiveHeight") && this.setViewportHeight(),
      t2 !== i2 &&
        (this.markSelectedSlides(), this.emit("change", t2, i2, e2)));
  }
  onRefresh() {
    let t2 = this.contentDim,
      e2 = this.viewportDim;
    (this.updateMetrics(),
      (this.contentDim === t2 && this.viewportDim === e2) ||
        this.slideTo(this.page, { friction: 0, transition: false }));
  }
  onScroll() {
    var t2;
    null === (t2 = this.viewport) || void 0 === t2 || t2.scroll(0, 0);
  }
  onResize() {
    this.option("breakpoints") && this.processOptions();
  }
  onBeforeTransform(t2) {
    (this.lp !== t2.current[this.axis] &&
      (this.flipInfiniteTrack(), this.manageSlideVisiblity()),
      (this.lp = t2.current.e));
  }
  onEndAnimation() {
    this.inTransition.size || this.emit("settle");
  }
  reInit(t2 = null, e2 = null) {
    (this.destroy(),
      (this.state = B.Init),
      (this.prevPage = null),
      (this.userOptions = t2 || this.userOptions),
      (this.userPlugins = e2 || this.userPlugins),
      this.processOptions());
  }
  slideTo(
    t2 = 0,
    {
      friction: e2 = this.option("friction"),
      transition: i2 = this.option("transition"),
    } = {}
  ) {
    if (this.state === B.Destroy) return;
    t2 = parseInt((t2 || 0).toString()) || 0;
    const n2 = this.getPageFromIndex(t2),
      { axis: s2, isHorizontal: o2, isRTL: a2, pages: r2, panzoom: l2 } = this,
      c2 = r2.length,
      h2 = a2 && o2 ? 1 : -1;
    if (!l2 || !c2) return;
    if (this.page !== n2) {
      const e3 = new Event("beforeChange", { bubbles: true, cancelable: true });
      if ((this.emit("beforeChange", e3, t2), e3.defaultPrevented)) return;
    }
    if (this.transitionTo(t2, i2)) return;
    let d2 = r2[n2].pos;
    if (this.isInfinite) {
      const e3 = this.contentDim,
        i3 = l2.target[s2] * h2;
      if (2 === c2) d2 += e3 * Math.floor(parseFloat(t2 + "") / 2);
      else {
        d2 = [d2, d2 - e3, d2 + e3].reduce(function (t3, e4) {
          return Math.abs(e4 - i3) < Math.abs(t3 - i3) ? e4 : t3;
        });
      }
    }
    ((d2 *= h2),
      Math.abs(l2.target[s2] - d2) < 1 ||
        (l2.panTo({ x: o2 ? d2 : 0, y: o2 ? 0 : d2, friction: e2 }),
        this.onChange(n2)));
  }
  slideToClosest(t2) {
    if (this.panzoom) {
      const { pageIndex: e2 } = this.getPageFromPosition();
      this.slideTo(e2, t2);
    }
  }
  slideNext() {
    this.slideTo(this.page + 1);
  }
  slidePrev() {
    this.slideTo(this.page - 1);
  }
  clearTransitions() {
    (this.inTransition.clear(), S(this.container, this.cn("inTransition")));
    const t2 = ["to-prev", "to-next", "from-prev", "from-next"];
    for (const e2 of this.slides) {
      const i2 = e2.el;
      if (i2) {
        (i2.removeEventListener(G, this.onAnimationEnd),
          i2.classList.remove(...t2));
        const n2 = e2.transition;
        n2 && i2.classList.remove(`f-${n2}Out`, `f-${n2}In`);
      }
    }
    this.manageSlideVisiblity();
  }
  addSlide(t2, e2) {
    var i2, n2, s2, o2;
    const a2 = this.panzoom,
      r2 =
        (null === (i2 = this.pages[this.page]) || void 0 === i2
          ? void 0
          : i2.pos) || 0,
      l2 =
        (null === (n2 = this.pages[this.page]) || void 0 === n2
          ? void 0
          : n2.dim) || 0,
      c2 = this.contentDim < this.viewportDim;
    let h2 = Array.isArray(e2) ? e2 : [e2];
    const d2 = [];
    for (const t3 of h2) d2.push(H(t3));
    this.slides.splice(t2, 0, ...d2);
    for (let t3 = 0; t3 < this.slides.length; t3++) this.slides[t3].index = t3;
    for (const t3 of d2) this.emit("beforeInitSlide", t3, t3.index);
    if (
      (this.page >= t2 && (this.page += d2.length), this.updateMetrics(), a2)
    ) {
      const e3 =
          (null === (s2 = this.pages[this.page]) || void 0 === s2
            ? void 0
            : s2.pos) || 0,
        i3 =
          (null === (o2 = this.pages[this.page]) || void 0 === o2
            ? void 0
            : o2.dim) || 0,
        n3 = this.pages.length || 1,
        h3 = this.isRTL ? l2 - i3 : i3 - l2,
        d3 = this.isRTL ? r2 - e3 : e3 - r2;
      c2 && 1 === n3
        ? (t2 <= this.page &&
            ((a2.current[this.axis] -= h3), (a2.target[this.axis] -= h3)),
          a2.panTo({ [this.isHorizontal ? "x" : "y"]: -1 * e3 }))
        : d3 &&
          t2 <= this.page &&
          ((a2.target[this.axis] -= d3),
          (a2.current[this.axis] -= d3),
          a2.requestTick());
    }
    for (const t3 of d2) this.emit("initSlide", t3, t3.index);
  }
  prependSlide(t2) {
    this.addSlide(0, t2);
  }
  appendSlide(t2) {
    this.addSlide(this.slides.length, t2);
  }
  removeSlide(t2) {
    const e2 = this.slides.length;
    t2 = ((t2 % e2) + e2) % e2;
    const i2 = this.slides[t2];
    if (i2) {
      (this.removeSlideEl(i2, true), this.slides.splice(t2, 1));
      for (let t3 = 0; t3 < this.slides.length; t3++)
        this.slides[t3].index = t3;
      (this.updateMetrics(),
        this.slideTo(this.page, { friction: 0, transition: false }),
        this.emit("destroySlide", i2));
    }
  }
  updateMetrics() {
    const {
      panzoom: e2,
      viewport: i2,
      track: n2,
      slides: s2,
      isHorizontal: o2,
      isInfinite: a2,
    } = this;
    if (!n2) return;
    const r2 = o2 ? "width" : "height",
      l2 = o2 ? "offsetWidth" : "offsetHeight";
    if (i2) {
      let e3 = Math.max(i2[l2], t(i2.getBoundingClientRect()[r2], 1e3)),
        n3 = getComputedStyle(i2),
        s3 = "padding",
        a3 = o2 ? "Right" : "Bottom";
      ((e3 -=
        parseFloat(n3[s3 + (o2 ? "Left" : "Top")]) + parseFloat(n3[s3 + a3])),
        (this.viewportDim = e3));
    }
    let c2,
      h2 = 0;
    for (const [e3, i3] of s2.entries()) {
      let n3 = 0,
        o3 = 0;
      (!i3.el && c2
        ? ((n3 = c2.dim), (o3 = c2.gap))
        : (({ dim: n3, gap: o3 } = this.getSlideMetrics(i3)), (c2 = i3)),
        (n3 = t(n3, 1e3)),
        (o3 = t(o3, 1e3)),
        (i3.dim = n3),
        (i3.gap = o3),
        (i3.pos = h2),
        (h2 += n3),
        (a2 || e3 < s2.length - 1) && (h2 += o3));
    }
    ((h2 = t(h2, 1e3)),
      (this.contentDim = h2),
      e2 &&
        ((e2.contentRect[r2] = h2),
        (e2.contentRect[o2 ? "fullWidth" : "fullHeight"] = h2)),
      (this.pages = this.createPages()),
      (this.pages = this.processPages()),
      this.state === B.Init && this.setInitialPage(),
      (this.page = Math.max(0, Math.min(this.page, this.pages.length - 1))),
      this.manageSlideVisiblity(),
      this.emit("refresh"));
  }
  getProgress(e2, i2 = false, n2 = false) {
    void 0 === e2 && (e2 = this.page);
    const s2 = this,
      o2 = s2.panzoom,
      a2 = s2.contentDim,
      r2 = s2.pages[e2] || 0;
    if (!r2 || !o2) return e2 > this.page ? -1 : 1;
    let l2 = -1 * o2.current.e,
      c2 = t((l2 - r2.pos) / (1 * r2.dim), 1e3),
      h2 = c2,
      d2 = c2;
    this.isInfinite &&
      true !== n2 &&
      ((h2 = t((l2 - r2.pos + a2) / (1 * r2.dim), 1e3)),
      (d2 = t((l2 - r2.pos - a2) / (1 * r2.dim), 1e3)));
    let u2 = [c2, h2, d2].reduce(function (t2, e3) {
      return Math.abs(e3) < Math.abs(t2) ? e3 : t2;
    });
    return i2 ? u2 : u2 > 1 ? 1 : u2 < -1 ? -1 : u2;
  }
  setViewportHeight() {
    const { page: t2, pages: e2, viewport: i2, isHorizontal: n2 } = this;
    if (!i2 || !e2[t2]) return;
    let s2 = 0;
    (n2 &&
      this.track &&
      ((this.track.style.height = "auto"),
      e2[t2].slides.forEach((t3) => {
        t3.el && (s2 = Math.max(s2, t3.el.offsetHeight));
      })),
      (i2.style.height = s2 ? `${s2}px` : ""));
  }
  getPageForSlide(t2) {
    for (const e2 of this.pages)
      for (const i2 of e2.slides) if (i2.index === t2) return e2.index;
    return -1;
  }
  getVisibleSlides(t2 = 0) {
    var e2;
    const i2 = /* @__PURE__ */ new Set();
    let {
      panzoom: n2,
      contentDim: s2,
      viewportDim: o2,
      pages: a2,
      page: r2,
    } = this;
    if (o2) {
      s2 =
        s2 +
          (null === (e2 = this.slides[this.slides.length - 1]) || void 0 === e2
            ? void 0
            : e2.gap) || 0;
      let l2 = 0;
      ((l2 =
        n2 && n2.state !== m.Init && n2.state !== m.Destroy
          ? -1 * n2.current[this.axis]
          : (a2[r2] && a2[r2].pos) || 0),
        this.isInfinite && (l2 -= Math.floor(l2 / s2) * s2),
        this.isRTL && this.isHorizontal && (l2 *= -1));
      const c2 = l2 - o2 * t2,
        h2 = l2 + o2 * (t2 + 1),
        d2 = this.isInfinite ? [-1, 0, 1] : [0];
      for (const t3 of this.slides)
        for (const e3 of d2) {
          const n3 = t3.pos + e3 * s2,
            o3 = n3 + t3.dim + t3.gap;
          n3 < h2 && o3 > c2 && i2.add(t3);
        }
    }
    return i2;
  }
  getPageFromPosition(t2) {
    const {
        viewportDim: e2,
        contentDim: i2,
        slides: n2,
        pages: s2,
        panzoom: o2,
      } = this,
      a2 = s2.length,
      r2 = n2.length,
      l2 = n2[0],
      c2 = n2[r2 - 1],
      h2 = this.option("center");
    let d2 = 0,
      u2 = 0,
      p2 = 0,
      f2 =
        void 0 === t2
          ? -1 * ((null == o2 ? void 0 : o2.target[this.axis]) || 0)
          : t2;
    (h2 && (f2 += 0.5 * e2),
      this.isInfinite
        ? (f2 < l2.pos - 0.5 * c2.gap && ((f2 -= i2), (p2 = -1)),
          f2 > c2.pos + c2.dim + 0.5 * c2.gap && ((f2 -= i2), (p2 = 1)))
        : (f2 = Math.max(l2.pos || 0, Math.min(f2, c2.pos))));
    let g2 = c2,
      m2 = n2.find((t3) => {
        const e3 = t3.pos - 0.5 * g2.gap,
          i3 = t3.pos + t3.dim + 0.5 * t3.gap;
        return ((g2 = t3), f2 >= e3 && f2 < i3);
      });
    return (
      m2 || (m2 = c2),
      (u2 = this.getPageForSlide(m2.index)),
      (d2 = u2 + p2 * a2),
      { page: d2, pageIndex: u2 }
    );
  }
  setPageFromPosition() {
    const { pageIndex: t2 } = this.getPageFromPosition();
    this.onChange(t2);
  }
  destroy() {
    if ([B.Destroy].includes(this.state)) return;
    this.state = B.Destroy;
    const {
        container: t2,
        viewport: e2,
        track: i2,
        slides: n2,
        panzoom: s2,
      } = this,
      o2 = this.option("classes");
    (t2.removeEventListener("click", this.onClick, {
      passive: false,
      capture: false,
    }),
      t2.removeEventListener("slideTo", this.onSlideTo),
      window.removeEventListener("resize", this.onResize),
      s2 && (s2.destroy(), (this.panzoom = null)),
      n2 &&
        n2.forEach((t3) => {
          this.removeSlideEl(t3);
        }),
      this.detachPlugins(),
      e2 &&
        (e2.removeEventListener("scroll", this.onScroll),
        e2.offsetParent &&
          i2 &&
          i2.offsetParent &&
          e2.replaceWith(...i2.childNodes)));
    for (const [e3, i3] of Object.entries(o2))
      "container" !== e3 && i3 && t2.classList.remove(i3);
    ((this.track = null),
      (this.viewport = null),
      (this.page = 0),
      (this.slides = []));
    const a2 = this.events.get("ready");
    ((this.events = /* @__PURE__ */ new Map()),
      a2 && this.events.set("ready", a2));
  }
}
(Object.defineProperty(Q, "Panzoom", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: I,
}),
  Object.defineProperty(Q, "defaults", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: j,
  }),
  Object.defineProperty(Q, "Plugins", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: U,
  }));
const tt = function (t2) {
    if (!E(t2)) return 0;
    const e2 = window.scrollY,
      i2 = window.innerHeight,
      n2 = e2 + i2,
      s2 = t2.getBoundingClientRect(),
      o2 = s2.y + e2,
      a2 = s2.height,
      r2 = o2 + a2;
    if (e2 > r2 || n2 < o2) return 0;
    if (e2 < o2 && n2 > r2) return 100;
    if (o2 < e2 && r2 > n2) return 100;
    let l2 = a2;
    (o2 < e2 && (l2 -= e2 - o2), r2 > n2 && (l2 -= r2 - n2));
    const c2 = (l2 / i2) * 100;
    return Math.round(c2);
  },
  et = !(
    "undefined" == typeof window ||
    !window.document ||
    !window.document.createElement
  );
let it;
const nt = [
    "a[href]",
    "area[href]",
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    "select:not([disabled]):not([aria-hidden])",
    "textarea:not([disabled]):not([aria-hidden])",
    "button:not([disabled]):not([aria-hidden]):not(.fancybox-focus-guard)",
    "iframe",
    "object",
    "embed",
    "video",
    "audio",
    "[contenteditable]",
    '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])',
  ].join(","),
  st = (t2) => {
    if (t2 && et) {
      void 0 === it &&
        document.createElement("div").focus({
          get preventScroll() {
            return ((it = true), false);
          },
        });
      try {
        if (it) t2.focus({ preventScroll: true });
        else {
          const e2 = window.scrollY || document.body.scrollTop,
            i2 = window.scrollX || document.body.scrollLeft;
          (t2.focus(),
            document.body.scrollTo({ top: e2, left: i2, behavior: "auto" }));
        }
      } catch (t3) {}
    }
  },
  ot = () => {
    const t2 = document;
    let e2,
      i2 = "",
      n2 = "",
      s2 = "";
    return (
      t2.fullscreenEnabled
        ? ((i2 = "requestFullscreen"),
          (n2 = "exitFullscreen"),
          (s2 = "fullscreenElement"))
        : t2.webkitFullscreenEnabled &&
          ((i2 = "webkitRequestFullscreen"),
          (n2 = "webkitExitFullscreen"),
          (s2 = "webkitFullscreenElement")),
      i2 &&
        (e2 = {
          request: function (e3 = t2.documentElement) {
            return "webkitRequestFullscreen" === i2
              ? e3[i2](Element.ALLOW_KEYBOARD_INPUT)
              : e3[i2]();
          },
          exit: function () {
            return t2[s2] && t2[n2]();
          },
          isFullscreen: function () {
            return t2[s2];
          },
        }),
      e2
    );
  },
  at = {
    animated: true,
    autoFocus: true,
    backdropClick: "close",
    Carousel: {
      classes: {
        container: "fancybox__carousel",
        viewport: "fancybox__viewport",
        track: "fancybox__track",
        slide: "fancybox__slide",
      },
    },
    closeButton: "auto",
    closeExisting: false,
    commonCaption: false,
    compact: () =>
      window.matchMedia("(max-width: 578px), (max-height: 578px)").matches,
    contentClick: "toggleZoom",
    contentDblClick: false,
    defaultType: "image",
    defaultDisplay: "flex",
    dragToClose: true,
    Fullscreen: { autoStart: false },
    groupAll: false,
    groupAttr: "data-fancybox",
    hideClass: "f-fadeOut",
    hideScrollbar: true,
    idle: 3500,
    keyboard: {
      Escape: "close",
      Delete: "close",
      Backspace: "close",
      PageUp: "next",
      PageDown: "prev",
      ArrowUp: "prev",
      ArrowDown: "next",
      ArrowRight: "next",
      ArrowLeft: "prev",
    },
    l10n: Object.assign(Object.assign({}, b), {
      CLOSE: "Close",
      NEXT: "Next",
      PREV: "Previous",
      MODAL: "You can close this modal content with the ESC key",
      ERROR: "Something Went Wrong, Please Try Again Later",
      IMAGE_ERROR: "Image Not Found",
      ELEMENT_NOT_FOUND: "HTML Element Not Found",
      AJAX_NOT_FOUND: "Error Loading AJAX : Not Found",
      AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden",
      IFRAME_ERROR: "Error Loading Page",
      TOGGLE_ZOOM: "Toggle zoom level",
      TOGGLE_THUMBS: "Toggle thumbnails",
      TOGGLE_SLIDESHOW: "Toggle slideshow",
      TOGGLE_FULLSCREEN: "Toggle full-screen mode",
      DOWNLOAD: "Download",
    }),
    parentEl: null,
    placeFocusBack: true,
    showClass: "f-zoomInUp",
    startIndex: 0,
    tpl: {
      closeButton:
        '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg></button>',
      main: '<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">\n    <div class="fancybox__backdrop"></div>\n    <div class="fancybox__carousel"></div>\n    <div class="fancybox__footer"></div>\n  </div>',
    },
    trapFocus: true,
    wheel: "zoom",
  };
var rt, lt;
(!(function (t2) {
  ((t2[(t2.Init = 0)] = "Init"),
    (t2[(t2.Ready = 1)] = "Ready"),
    (t2[(t2.Closing = 2)] = "Closing"),
    (t2[(t2.CustomClosing = 3)] = "CustomClosing"),
    (t2[(t2.Destroy = 4)] = "Destroy"));
})(rt || (rt = {})),
  (function (t2) {
    ((t2[(t2.Loading = 0)] = "Loading"),
      (t2[(t2.Opening = 1)] = "Opening"),
      (t2[(t2.Ready = 2)] = "Ready"),
      (t2[(t2.Closing = 3)] = "Closing"));
  })(lt || (lt = {})));
let ct = "",
  ht = false,
  dt = false,
  ut = null;
const pt = () => {
    let t2 = "",
      e2 = "";
    const i2 = Oe.getInstance();
    if (i2) {
      const n2 = i2.carousel,
        s2 = i2.getSlide();
      if (n2 && s2) {
        let o2 = s2.slug || void 0,
          a2 = s2.triggerEl || void 0;
        ((e2 = o2 || i2.option("slug") || ""),
          !e2 && a2 && a2.dataset && (e2 = a2.dataset.fancybox || ""),
          e2 &&
            "true" !== e2 &&
            (t2 =
              "#" +
              e2 +
              (!o2 && n2.slides.length > 1 ? "-" + (s2.index + 1) : "")));
      }
    }
    return { hash: t2, slug: e2, index: 1 };
  },
  ft = () => {
    const t2 = new URL(document.URL).hash,
      e2 = t2.slice(1).split("-"),
      i2 = e2[e2.length - 1],
      n2 = (i2 && /^\+?\d+$/.test(i2) && parseInt(e2.pop() || "1", 10)) || 1;
    return { hash: t2, slug: e2.join("-"), index: n2 };
  },
  gt = () => {
    const { slug: t2, index: e2 } = ft();
    if (!t2) return;
    let i2 = document.querySelector(`[data-slug="${t2}"]`);
    if (
      (i2 &&
        i2.dispatchEvent(
          new CustomEvent("click", { bubbles: true, cancelable: true })
        ),
      Oe.getInstance())
    )
      return;
    const n2 = document.querySelectorAll(`[data-fancybox="${t2}"]`);
    n2.length &&
      ((i2 = n2[e2 - 1]),
      i2 &&
        i2.dispatchEvent(
          new CustomEvent("click", { bubbles: true, cancelable: true })
        ));
  },
  mt = () => {
    if (false === Oe.defaults.Hash) return;
    const t2 = Oe.getInstance();
    if (false === (null == t2 ? void 0 : t2.options.Hash)) return;
    const { slug: e2, index: i2 } = ft(),
      { slug: n2 } = pt();
    (t2 && (e2 === n2 ? t2.jumpTo(i2 - 1) : ((ht = true), t2.close())), gt());
  },
  vt = () => {
    (ut && clearTimeout(ut),
      queueMicrotask(() => {
        mt();
      }));
  },
  bt = () => {
    (window.addEventListener("hashchange", vt, false),
      setTimeout(() => {
        mt();
      }, 500));
  };
et &&
  (/complete|interactive|loaded/.test(document.readyState)
    ? bt()
    : document.addEventListener("DOMContentLoaded", bt));
const yt = "is-zooming-in";
class wt extends _ {
  onCreateSlide(t2, e2, i2) {
    const n2 = this.instance.optionFor(i2, "src") || "";
    i2.el &&
      "image" === i2.type &&
      "string" == typeof n2 &&
      this.setImage(i2, n2);
  }
  onRemoveSlide(t2, e2, i2) {
    (i2.panzoom && i2.panzoom.destroy(),
      (i2.panzoom = void 0),
      (i2.imageEl = void 0));
  }
  onChange(t2, e2, i2, n2) {
    S(this.instance.container, yt);
    for (const t3 of e2.slides) {
      const e3 = t3.panzoom;
      e3 && t3.index !== i2 && e3.reset(0.35);
    }
  }
  onClose() {
    var t2;
    const e2 = this.instance,
      i2 = e2.container,
      n2 = e2.getSlide();
    if (!i2 || !i2.parentElement || !n2) return;
    const { el: s2, contentEl: o2, panzoom: a2, thumbElSrc: r2 } = n2;
    if (
      !s2 ||
      !r2 ||
      !o2 ||
      !a2 ||
      a2.isContentLoading ||
      a2.state === m.Init ||
      a2.state === m.Destroy
    )
      return;
    a2.updateMetrics();
    let l2 = this.getZoomInfo(n2);
    if (!l2) return;
    ((this.instance.state = rt.CustomClosing),
      i2.classList.remove(yt),
      i2.classList.add("is-zooming-out"),
      (o2.style.backgroundImage = `url('${r2}')`));
    const c2 = i2.getBoundingClientRect();
    1 ===
      ((null === (t2 = window.visualViewport) || void 0 === t2
        ? void 0
        : t2.scale) || 1) &&
      Object.assign(i2.style, {
        position: "absolute",
        top: `${i2.offsetTop + window.scrollY}px`,
        left: `${i2.offsetLeft + window.scrollX}px`,
        bottom: "auto",
        right: "auto",
        width: `${c2.width}px`,
        height: `${c2.height}px`,
        overflow: "hidden",
      });
    const { x: h2, y: d2, scale: u2, opacity: p2 } = l2;
    if (p2) {
      const t3 = ((t4, e3, i3, n3) => {
        const s3 = e3 - t4,
          o3 = n3 - i3;
        return (e4) => i3 + (((e4 - t4) / s3) * o3 || 0);
      })(a2.scale, u2, 1, 0);
      a2.on("afterTransform", () => {
        o2.style.opacity = t3(a2.scale) + "";
      });
    }
    (a2.on("endAnimation", () => {
      e2.destroy();
    }),
      (a2.target.a = u2),
      (a2.target.b = 0),
      (a2.target.c = 0),
      (a2.target.d = u2),
      a2.panTo({
        x: h2,
        y: d2,
        scale: u2,
        friction: p2 ? 0.2 : 0.33,
        ignoreBounds: true,
      }),
      a2.isResting && e2.destroy());
  }
  setImage(t2, e2) {
    const i2 = this.instance;
    ((t2.src = e2),
      this.process(t2, e2).then(
        (e3) => {
          const { contentEl: n2, imageEl: s2, thumbElSrc: o2, el: a2 } = t2;
          if (i2.isClosing() || !n2 || !s2) return;
          n2.offsetHeight;
          const r2 = !!i2.isOpeningSlide(t2) && this.getZoomInfo(t2);
          if (this.option("protected") && a2) {
            a2.addEventListener("contextmenu", (t4) => {
              t4.preventDefault();
            });
            const t3 = document.createElement("div");
            (P(t3, "fancybox-protected"), n2.appendChild(t3));
          }
          if (o2 && r2) {
            const s3 = e3.contentRect,
              a3 = Math.max(s3.fullWidth, s3.fullHeight);
            let c2 = null;
            !r2.opacity &&
              a3 > 1200 &&
              ((c2 = document.createElement("img")),
              P(c2, "fancybox-ghost"),
              (c2.src = o2),
              n2.appendChild(c2));
            const h2 = () => {
              c2 &&
                (P(c2, "f-fadeFastOut"),
                setTimeout(() => {
                  c2 && (c2.remove(), (c2 = null));
                }, 200));
            };
            ((l2 = o2),
            new Promise((t3, e4) => {
              const i3 = new Image();
              ((i3.onload = t3), (i3.onerror = e4), (i3.src = l2));
            })).then(
              () => {
                (i2.hideLoading(t2),
                  (t2.state = lt.Opening),
                  this.instance.emit("reveal", t2),
                  this.zoomIn(t2).then(
                    () => {
                      (h2(), this.instance.done(t2));
                    },
                    () => {}
                  ),
                  c2 &&
                    setTimeout(
                      () => {
                        h2();
                      },
                      a3 > 2500 ? 800 : 200
                    ));
              },
              () => {
                (i2.hideLoading(t2), i2.revealContent(t2));
              }
            );
          } else {
            const n3 = this.optionFor(t2, "initialSize"),
              s3 = this.optionFor(t2, "zoom"),
              o3 = {
                event: i2.prevMouseMoveEvent || i2.options.event,
                friction: s3 ? 0.12 : 0,
              };
            let a3 = i2.optionFor(t2, "showClass") || void 0,
              r3 = true;
            (i2.isOpeningSlide(t2) &&
              ("full" === n3
                ? e3.zoomToFull(o3)
                : "cover" === n3
                  ? e3.zoomToCover(o3)
                  : "max" === n3
                    ? e3.zoomToMax(o3)
                    : (r3 = false),
              e3.stop("current")),
              r3 && a3 && (a3 = e3.isDragging ? "f-fadeIn" : ""),
              i2.hideLoading(t2),
              i2.revealContent(t2, a3));
          }
          var l2;
        },
        () => {
          i2.setError(t2, "{{IMAGE_ERROR}}");
        }
      ));
  }
  process(t2, e2) {
    return new Promise((i2, s2) => {
      var o2;
      const a2 = this.instance,
        r2 = t2.el;
      (a2.clearContent(t2), a2.showLoading(t2));
      let l2 = this.optionFor(t2, "content");
      if (("string" == typeof l2 && (l2 = n(l2)), !l2 || !E(l2))) {
        if (
          ((l2 = document.createElement("img")), l2 instanceof HTMLImageElement)
        ) {
          let i3 = "",
            n2 = t2.caption;
          ((i3 =
            "string" == typeof n2 && n2
              ? n2.replace(/<[^>]+>/gi, "").substring(0, 1e3)
              : `Image ${t2.index + 1} of ${(null === (o2 = a2.carousel) || void 0 === o2 ? void 0 : o2.pages.length) || 1}`),
            (l2.src = e2 || ""),
            (l2.alt = i3),
            (l2.draggable = false),
            t2.srcset && l2.setAttribute("srcset", t2.srcset),
            this.instance.isOpeningSlide(t2) && (l2.fetchPriority = "high"));
        }
        t2.sizes && l2.setAttribute("sizes", t2.sizes);
      }
      (P(l2, "fancybox-image"),
        (t2.imageEl = l2),
        a2.setContent(t2, l2, false));
      t2.panzoom = new I(
        r2,
        u({ transformParent: true }, this.option("Panzoom") || {}, {
          content: l2,
          width: (e3, i3) => a2.optionFor(t2, "width", "auto", i3) || "auto",
          height: (e3, i3) => a2.optionFor(t2, "height", "auto", i3) || "auto",
          wheel: () => {
            const t3 = a2.option("wheel");
            return ("zoom" === t3 || "pan" == t3) && t3;
          },
          click: (e3, i3) => {
            var n2, s3;
            if (a2.isCompact || a2.isClosing()) return false;
            if (
              t2.index !==
              (null === (n2 = a2.getSlide()) || void 0 === n2
                ? void 0
                : n2.index)
            )
              return false;
            if (i3) {
              const t3 = i3.composedPath()[0];
              if (
                [
                  "A",
                  "BUTTON",
                  "TEXTAREA",
                  "OPTION",
                  "INPUT",
                  "SELECT",
                  "VIDEO",
                ].includes(t3.nodeName)
              )
                return false;
            }
            let o3 =
              !i3 ||
              (i3.target &&
                (null === (s3 = t2.contentEl) || void 0 === s3
                  ? void 0
                  : s3.contains(i3.target)));
            return a2.option(o3 ? "contentClick" : "backdropClick") || false;
          },
          dblClick: () =>
            a2.isCompact ? "toggleZoom" : a2.option("contentDblClick") || false,
          spinner: false,
          panOnlyZoomed: true,
          wheelLimit: 1 / 0,
          on: {
            ready: (t3) => {
              i2(t3);
            },
            error: () => {
              s2();
            },
            destroy: () => {
              s2();
            },
          },
        })
      );
    });
  }
  zoomIn(t2) {
    return new Promise((e2, i2) => {
      const n2 = this.instance,
        s2 = n2.container,
        { panzoom: o2, contentEl: a2, el: r2 } = t2;
      o2 && o2.updateMetrics();
      const l2 = this.getZoomInfo(t2);
      if (!(l2 && r2 && a2 && o2 && s2)) return void i2();
      const { x: c2, y: h2, scale: d2, opacity: u2 } = l2,
        p2 = () => {
          t2.state !== lt.Closing &&
            (u2 &&
              (a2.style.opacity =
                Math.max(Math.min(1, 1 - (1 - o2.scale) / (1 - d2)), 0) + ""),
            o2.scale >= 1 && o2.scale > o2.targetScale - 0.1 && e2(o2));
        },
        f2 = (t3) => {
          ((t3.scale < 0.99 || t3.scale > 1.01) && !t3.isDragging) ||
            (S(s2, yt),
            (a2.style.opacity = ""),
            t3.off("endAnimation", f2),
            t3.off("touchStart", f2),
            t3.off("afterTransform", p2),
            e2(t3));
        };
      (o2.on("endAnimation", f2),
        o2.on("touchStart", f2),
        o2.on("afterTransform", p2),
        o2.on(["error", "destroy"], () => {
          i2();
        }),
        o2.panTo({ x: c2, y: h2, scale: d2, friction: 0, ignoreBounds: true }),
        o2.stop("current"));
      const g2 = {
          event:
            "mousemove" === o2.panMode
              ? n2.prevMouseMoveEvent || n2.options.event
              : void 0,
        },
        m2 = this.optionFor(t2, "initialSize");
      (P(s2, yt),
        n2.hideLoading(t2),
        "full" === m2
          ? o2.zoomToFull(g2)
          : "cover" === m2
            ? o2.zoomToCover(g2)
            : "max" === m2
              ? o2.zoomToMax(g2)
              : o2.reset(0.172));
    });
  }
  getZoomInfo(t2) {
    const { el: e2, imageEl: i2, thumbEl: n2, panzoom: s2 } = t2,
      o2 = this.instance,
      a2 = o2.container;
    if (
      !e2 ||
      !i2 ||
      !n2 ||
      !s2 ||
      tt(n2) < 3 ||
      !this.optionFor(t2, "zoom") ||
      !a2 ||
      o2.state === rt.Destroy
    )
      return false;
    if ("0" === getComputedStyle(a2).getPropertyValue("--f-images-zoom"))
      return false;
    const r2 = window.visualViewport || null;
    if (1 !== (r2 ? r2.scale : 1)) return false;
    let {
        top: l2,
        left: c2,
        width: h2,
        height: d2,
      } = n2.getBoundingClientRect(),
      { top: u2, left: p2, fitWidth: f2, fitHeight: g2 } = s2.contentRect;
    if (!(h2 && d2 && f2 && g2)) return false;
    const m2 = s2.container.getBoundingClientRect();
    ((p2 += m2.left), (u2 += m2.top));
    const v2 = -1 * (p2 + 0.5 * f2 - (c2 + 0.5 * h2)),
      b2 = -1 * (u2 + 0.5 * g2 - (l2 + 0.5 * d2)),
      y2 = h2 / f2;
    let w2 = this.option("zoomOpacity") || false;
    return (
      "auto" === w2 && (w2 = Math.abs(h2 / d2 - f2 / g2) > 0.1),
      { x: v2, y: b2, scale: y2, opacity: w2 }
    );
  }
  attach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.on("Carousel.change", t2.onChange),
      e2.on("Carousel.createSlide", t2.onCreateSlide),
      e2.on("Carousel.removeSlide", t2.onRemoveSlide),
      e2.on("close", t2.onClose));
  }
  detach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.off("Carousel.change", t2.onChange),
      e2.off("Carousel.createSlide", t2.onCreateSlide),
      e2.off("Carousel.removeSlide", t2.onRemoveSlide),
      e2.off("close", t2.onClose));
  }
}
(Object.defineProperty(wt, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: {
    initialSize: "fit",
    Panzoom: { maxScale: 1 },
    protected: false,
    zoom: true,
    zoomOpacity: "auto",
  },
}),
  "function" == typeof SuppressedError && SuppressedError);
const xt = "html",
  Et = "image",
  St = "map",
  Pt = "youtube",
  Ct = "vimeo",
  Tt = "html5video",
  Mt = (t2, e2 = {}) => {
    const i2 = new URL(t2),
      n2 = new URLSearchParams(i2.search),
      s2 = new URLSearchParams();
    for (const [t3, i3] of [...n2, ...Object.entries(e2)]) {
      let e3 = i3 + "";
      if ("t" === t3) {
        let t4 = e3.match(/((\d*)m)?(\d*)s?/);
        t4 &&
          s2.set(
            "start",
            60 * parseInt(t4[2] || "0") + parseInt(t4[3] || "0") + ""
          );
      } else s2.set(t3, e3);
    }
    let o2 = s2 + "",
      a2 = t2.match(/#t=((.*)?\d+s)/);
    return (a2 && (o2 += `#t=${a2[1]}`), o2);
  },
  Ot = {
    ajax: null,
    autoSize: true,
    iframeAttr: { allow: "autoplay; fullscreen", scrolling: "auto" },
    preload: true,
    videoAutoplay: true,
    videoRatio: 16 / 9,
    videoTpl: `<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`,
    videoFormat: "",
    vimeo: { byline: 1, color: "00adef", controls: 1, dnt: 1, muted: 0 },
    youtube: { controls: 1, enablejsapi: 1, nocookie: 1, rel: 0, fs: 1 },
  },
  At = [
    "image",
    "html",
    "ajax",
    "inline",
    "clone",
    "iframe",
    "map",
    "pdf",
    "html5video",
    "youtube",
    "vimeo",
  ];
class Lt extends _ {
  onBeforeInitSlide(t2, e2, i2) {
    this.processType(i2);
  }
  onCreateSlide(t2, e2, i2) {
    this.setContent(i2);
  }
  onClearContent(t2, e2) {
    e2.xhr && (e2.xhr.abort(), (e2.xhr = null));
    const i2 = e2.iframeEl;
    i2 &&
      ((i2.onload = i2.onerror = null),
      (i2.src = "//about:blank"),
      (e2.iframeEl = null));
    const n2 = e2.contentEl,
      s2 = e2.placeholderEl;
    if ("inline" === e2.type && n2 && s2)
      (n2.classList.remove("fancybox__content"),
        "none" !== getComputedStyle(n2).getPropertyValue("display") &&
          (n2.style.display = "none"),
        setTimeout(() => {
          s2 &&
            (n2 && s2.parentNode && s2.parentNode.insertBefore(n2, s2),
            s2.remove());
        }, 0),
        (e2.contentEl = void 0),
        (e2.placeholderEl = void 0));
    else
      for (; e2.el && e2.el.firstChild; ) e2.el.removeChild(e2.el.firstChild);
  }
  onSelectSlide(t2, e2, i2) {
    i2.state === lt.Ready && this.playVideo();
  }
  onUnselectSlide(t2, e2, i2) {
    var n2, s2;
    if (i2.type === Tt) {
      try {
        null ===
          (s2 =
            null === (n2 = i2.el) || void 0 === n2
              ? void 0
              : n2.querySelector("video")) ||
          void 0 === s2 ||
          s2.pause();
      } catch (t3) {}
      return;
    }
    let o2;
    (i2.type === Ct
      ? (o2 = { method: "pause", value: "true" })
      : i2.type === Pt && (o2 = { event: "command", func: "pauseVideo" }),
      o2 &&
        i2.iframeEl &&
        i2.iframeEl.contentWindow &&
        i2.iframeEl.contentWindow.postMessage(JSON.stringify(o2), "*"),
      i2.poller && clearTimeout(i2.poller));
  }
  onDone(t2, e2) {
    t2.isCurrentSlide(e2) && !t2.isClosing() && this.playVideo();
  }
  onRefresh(t2, e2) {
    e2.slides.forEach((t3) => {
      t3.el && (this.resizeIframe(t3), this.setAspectRatio(t3));
    });
  }
  onMessage(t2) {
    try {
      let e2 = JSON.parse(t2.data);
      if ("https://player.vimeo.com" === t2.origin) {
        if ("ready" === e2.event)
          for (let e3 of Array.from(
            document.getElementsByClassName("fancybox__iframe")
          ))
            e3 instanceof HTMLIFrameElement &&
              e3.contentWindow === t2.source &&
              (e3.dataset.ready = "true");
      } else if (
        t2.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) &&
        "onReady" === e2.event
      ) {
        const t3 = document.getElementById(e2.id);
        t3 && (t3.dataset.ready = "true");
      }
    } catch (t3) {}
  }
  loadAjaxContent(t2) {
    const e2 = this.instance.optionFor(t2, "src") || "";
    this.instance.showLoading(t2);
    const i2 = this.instance,
      n2 = new XMLHttpRequest();
    (i2.showLoading(t2),
      (n2.onreadystatechange = function () {
        n2.readyState === XMLHttpRequest.DONE &&
          i2.state === rt.Ready &&
          (i2.hideLoading(t2),
          200 === n2.status
            ? i2.setContent(t2, n2.responseText)
            : i2.setError(
                t2,
                404 === n2.status ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}"
              ));
      }));
    const s2 = t2.ajax || null;
    (n2.open(s2 ? "POST" : "GET", e2 + ""),
      n2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
      n2.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
      n2.send(s2),
      (t2.xhr = n2));
  }
  setInlineContent(t2) {
    let e2 = null;
    if (E(t2.src)) e2 = t2.src;
    else if ("string" == typeof t2.src) {
      const i2 = t2.src.split("#", 2).pop();
      e2 = i2 ? document.getElementById(i2) : null;
    }
    if (e2) {
      if ("clone" === t2.type || e2.closest(".fancybox__slide")) {
        e2 = e2.cloneNode(true);
        const i2 = e2.dataset.animationName;
        i2 && (e2.classList.remove(i2), delete e2.dataset.animationName);
        let n2 = e2.getAttribute("id");
        ((n2 = n2 ? `${n2}--clone` : `clone-${this.instance.id}-${t2.index}`),
          e2.setAttribute("id", n2));
      } else if (e2.parentNode) {
        const i2 = document.createElement("div");
        (i2.classList.add("fancybox-placeholder"),
          e2.parentNode.insertBefore(i2, e2),
          (t2.placeholderEl = i2));
      }
      this.instance.setContent(t2, e2);
    } else this.instance.setError(t2, "{{ELEMENT_NOT_FOUND}}");
  }
  setIframeContent(t2) {
    const { src: e2, el: i2 } = t2;
    if (!e2 || "string" != typeof e2 || !i2) return;
    i2.classList.add("is-loading");
    const n2 = this.instance,
      s2 = document.createElement("iframe");
    ((s2.className = "fancybox__iframe"),
      s2.setAttribute("id", `fancybox__iframe_${n2.id}_${t2.index}`));
    for (const [e3, i3] of Object.entries(
      this.optionFor(t2, "iframeAttr") || {}
    ))
      s2.setAttribute(e3, i3);
    ((s2.onerror = () => {
      n2.setError(t2, "{{IFRAME_ERROR}}");
    }),
      (t2.iframeEl = s2));
    const o2 = this.optionFor(t2, "preload");
    if ("iframe" !== t2.type || false === o2)
      return (
        s2.setAttribute("src", t2.src + ""),
        n2.setContent(t2, s2, false),
        this.resizeIframe(t2),
        void n2.revealContent(t2)
      );
    (n2.showLoading(t2),
      (s2.onload = () => {
        if (!s2.src.length) return;
        const e3 = "true" !== s2.dataset.ready;
        ((s2.dataset.ready = "true"),
          this.resizeIframe(t2),
          e3 ? n2.revealContent(t2) : n2.hideLoading(t2));
      }),
      s2.setAttribute("src", e2),
      n2.setContent(t2, s2, false));
  }
  resizeIframe(t2) {
    const { type: e2, iframeEl: i2 } = t2;
    if (e2 === Pt || e2 === Ct) return;
    const n2 = null == i2 ? void 0 : i2.parentElement;
    if (!i2 || !n2) return;
    let s2 = t2.autoSize;
    void 0 === s2 && (s2 = this.optionFor(t2, "autoSize"));
    let o2 = t2.width || 0,
      a2 = t2.height || 0;
    o2 && a2 && (s2 = false);
    const r2 = n2 && n2.style;
    if (false !== t2.preload && false !== s2 && r2)
      try {
        const t3 = window.getComputedStyle(n2),
          e3 = parseFloat(t3.paddingLeft) + parseFloat(t3.paddingRight),
          s3 = parseFloat(t3.paddingTop) + parseFloat(t3.paddingBottom),
          l2 = i2.contentWindow;
        if (l2) {
          const t4 = l2.document,
            i3 = t4.getElementsByTagName(xt)[0],
            n3 = t4.body;
          ((r2.width = ""),
            (n3.style.overflow = "hidden"),
            (o2 = o2 || i3.scrollWidth + e3),
            (r2.width = `${o2}px`),
            (n3.style.overflow = ""),
            (r2.flex = "0 0 auto"),
            (r2.height = `${n3.scrollHeight}px`),
            (a2 = i3.scrollHeight + s3));
        }
      } catch (t3) {}
    if (o2 || a2) {
      const t3 = { flex: "0 1 auto", width: "", height: "" };
      (o2 && "auto" !== o2 && (t3.width = `${o2}px`),
        a2 && "auto" !== a2 && (t3.height = `${a2}px`),
        Object.assign(r2, t3));
    }
  }
  playVideo() {
    const t2 = this.instance.getSlide();
    if (!t2) return;
    const { el: e2 } = t2;
    if (!e2 || !e2.offsetParent) return;
    if (!this.optionFor(t2, "videoAutoplay")) return;
    if (t2.type === Tt)
      try {
        const t3 = e2.querySelector("video");
        if (t3) {
          const e3 = t3.play();
          void 0 !== e3 &&
            e3
              .then(() => {})
              .catch((e4) => {
                ((t3.muted = true), t3.play());
              });
        }
      } catch (t3) {}
    if (t2.type !== Pt && t2.type !== Ct) return;
    const i2 = () => {
      if (t2.iframeEl && t2.iframeEl.contentWindow) {
        let e3;
        if ("true" === t2.iframeEl.dataset.ready)
          return (
            (e3 =
              t2.type === Pt
                ? { event: "command", func: "playVideo" }
                : { method: "play", value: "true" }),
            e3 &&
              t2.iframeEl.contentWindow.postMessage(JSON.stringify(e3), "*"),
            void (t2.poller = void 0)
          );
        t2.type === Pt &&
          ((e3 = { event: "listening", id: t2.iframeEl.getAttribute("id") }),
          t2.iframeEl.contentWindow.postMessage(JSON.stringify(e3), "*"));
      }
      t2.poller = setTimeout(i2, 250);
    };
    i2();
  }
  processType(t2) {
    if (t2.html)
      return ((t2.type = xt), (t2.src = t2.html), void (t2.html = ""));
    const e2 = this.instance.optionFor(t2, "src", "");
    if (!e2 || "string" != typeof e2) return;
    let i2 = t2.type,
      n2 = null;
    if (
      (n2 = e2.match(
        /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i
      ))
    ) {
      const s2 = this.optionFor(t2, Pt),
        { nocookie: o2 } = s2,
        a2 = (function (t3, e3) {
          var i3 = {};
          for (var n3 in t3)
            Object.prototype.hasOwnProperty.call(t3, n3) &&
              e3.indexOf(n3) < 0 &&
              (i3[n3] = t3[n3]);
          if (null != t3 && "function" == typeof Object.getOwnPropertySymbols) {
            var s3 = 0;
            for (n3 = Object.getOwnPropertySymbols(t3); s3 < n3.length; s3++)
              e3.indexOf(n3[s3]) < 0 &&
                Object.prototype.propertyIsEnumerable.call(t3, n3[s3]) &&
                (i3[n3[s3]] = t3[n3[s3]]);
          }
          return i3;
        })(s2, ["nocookie"]),
        r2 = `www.youtube${o2 ? "-nocookie" : ""}.com`,
        l2 = Mt(e2, a2),
        c2 = encodeURIComponent(n2[2]);
      ((t2.videoId = c2),
        (t2.src = `https://${r2}/embed/${c2}?${l2}`),
        (t2.thumbSrc =
          t2.thumbSrc || `https://i.ytimg.com/vi/${c2}/mqdefault.jpg`),
        (i2 = Pt));
    } else if (
      (n2 = e2.match(
        /^.+vimeo.com\/(?:\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/
      ))
    ) {
      const s2 = Mt(e2, this.optionFor(t2, Ct)),
        o2 = encodeURIComponent(n2[1]),
        a2 = n2[4] || "";
      ((t2.videoId = o2),
        (t2.src = `https://player.vimeo.com/video/${o2}?${a2 ? `h=${a2}${s2 ? "&" : ""}` : ""}${s2}`),
        (i2 = Ct));
    }
    if (!i2 && t2.triggerEl) {
      const e3 = t2.triggerEl.dataset.type;
      At.includes(e3) && (i2 = e3);
    }
    (i2 ||
      ("string" == typeof e2 &&
        ("#" === e2.charAt(0)
          ? (i2 = "inline")
          : (n2 = e2.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))
            ? ((i2 = Tt),
              (t2.videoFormat =
                t2.videoFormat || "video/" + ("ogv" === n2[1] ? "ogg" : n2[1])))
            : e2.match(
                  /(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i
                )
              ? (i2 = Et)
              : e2.match(/\.(pdf)((\?|#).*)?$/i) && (i2 = "pdf"))),
      (n2 = e2.match(
        /(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i
      ))
        ? ((t2.src = `https://maps.google.${n2[1]}/?ll=${(n2[2] ? n2[2] + "&z=" + Math.floor(parseFloat(n2[3])) + (n2[4] ? n2[4].replace(/^\//, "&") : "") : n2[4] + "").replace(/\?/, "&")}&output=${n2[4] && n2[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`),
          (i2 = St))
        : (n2 = e2.match(
            /(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i
          )) &&
          ((t2.src = `https://maps.google.${n2[1]}/maps?q=${n2[2].replace("query=", "q=").replace("api=1", "")}&output=embed`),
          (i2 = St)),
      (i2 = i2 || this.instance.option("defaultType")),
      (t2.type = i2),
      i2 === Et && (t2.thumbSrc = t2.thumbSrc || t2.src));
  }
  setContent(t2) {
    const e2 = this.instance.optionFor(t2, "src") || "";
    if (t2 && t2.type && e2) {
      switch (t2.type) {
        case xt:
          this.instance.setContent(t2, e2);
          break;
        case Tt:
          const i2 = this.option("videoTpl");
          i2 &&
            this.instance.setContent(
              t2,
              i2
                .replace(/\{\{src\}\}/gi, e2 + "")
                .replace(
                  /\{\{format\}\}/gi,
                  this.optionFor(t2, "videoFormat") || ""
                )
                .replace(/\{\{poster\}\}/gi, t2.poster || t2.thumbSrc || "")
            );
          break;
        case "inline":
        case "clone":
          this.setInlineContent(t2);
          break;
        case "ajax":
          this.loadAjaxContent(t2);
          break;
        case "pdf":
        case St:
        case Pt:
        case Ct:
          t2.preload = false;
        case "iframe":
          this.setIframeContent(t2);
      }
      this.setAspectRatio(t2);
    }
  }
  setAspectRatio(t2) {
    const e2 = t2.contentEl;
    if (!(t2.el && e2 && t2.type && [Pt, Ct, Tt].includes(t2.type))) return;
    let i2,
      n2 = t2.width || "auto",
      s2 = t2.height || "auto";
    if ("auto" === n2 || "auto" === s2) {
      i2 = this.optionFor(t2, "videoRatio");
      const e3 = (i2 + "").match(/(\d+)\s*\/\s?(\d+)/);
      i2 =
        e3 && e3.length > 2
          ? parseFloat(e3[1]) / parseFloat(e3[2])
          : parseFloat(i2 + "");
    } else n2 && s2 && (i2 = n2 / s2);
    if (!i2) return;
    ((e2.style.aspectRatio = ""),
      (e2.style.width = ""),
      (e2.style.height = ""),
      e2.offsetHeight);
    const o2 = e2.getBoundingClientRect(),
      a2 = o2.width || 1,
      r2 = o2.height || 1;
    ((e2.style.aspectRatio = i2 + ""),
      i2 < a2 / r2
        ? ((s2 = "auto" === s2 ? r2 : Math.min(r2, s2)),
          (e2.style.width = "auto"),
          (e2.style.height = `${s2}px`))
        : ((n2 = "auto" === n2 ? a2 : Math.min(a2, n2)),
          (e2.style.width = `${n2}px`),
          (e2.style.height = "auto")));
  }
  attach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.on("Carousel.beforeInitSlide", t2.onBeforeInitSlide),
      e2.on("Carousel.createSlide", t2.onCreateSlide),
      e2.on("Carousel.selectSlide", t2.onSelectSlide),
      e2.on("Carousel.unselectSlide", t2.onUnselectSlide),
      e2.on("Carousel.Panzoom.refresh", t2.onRefresh),
      e2.on("done", t2.onDone),
      e2.on("clearContent", t2.onClearContent),
      window.addEventListener("message", t2.onMessage));
  }
  detach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.off("Carousel.beforeInitSlide", t2.onBeforeInitSlide),
      e2.off("Carousel.createSlide", t2.onCreateSlide),
      e2.off("Carousel.selectSlide", t2.onSelectSlide),
      e2.off("Carousel.unselectSlide", t2.onUnselectSlide),
      e2.off("Carousel.Panzoom.refresh", t2.onRefresh),
      e2.off("done", t2.onDone),
      e2.off("clearContent", t2.onClearContent),
      window.removeEventListener("message", t2.onMessage));
  }
}
Object.defineProperty(Lt, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: Ot,
});
const zt = "play",
  Rt = "pause",
  kt = "ready";
class It extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: kt,
      }),
      Object.defineProperty(this, "inHover", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "timer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "progressBar", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }));
  }
  get isActive() {
    return this.state !== kt;
  }
  onReady(t2) {
    this.option("autoStart") &&
      (t2.isInfinite || t2.page < t2.pages.length - 1) &&
      this.start();
  }
  onChange() {
    (this.removeProgressBar(), this.pause());
  }
  onSettle() {
    this.resume();
  }
  onVisibilityChange() {
    "visible" === document.visibilityState ? this.resume() : this.pause();
  }
  onMouseEnter() {
    ((this.inHover = true), this.pause());
  }
  onMouseLeave() {
    var t2;
    ((this.inHover = false),
      (null === (t2 = this.instance.panzoom) || void 0 === t2
        ? void 0
        : t2.isResting) && this.resume());
  }
  onTimerEnd() {
    const t2 = this.instance;
    "play" === this.state &&
      (t2.isInfinite || t2.page !== t2.pages.length - 1
        ? t2.slideNext()
        : t2.slideTo(0));
  }
  removeProgressBar() {
    this.progressBar && (this.progressBar.remove(), (this.progressBar = null));
  }
  createProgressBar() {
    var t2;
    if (!this.option("showProgress")) return null;
    this.removeProgressBar();
    const e2 = this.instance,
      i2 =
        (null === (t2 = e2.pages[e2.page]) || void 0 === t2
          ? void 0
          : t2.slides) || [];
    let n2 = this.option("progressParentEl");
    if ((n2 || (n2 = (1 === i2.length ? i2[0].el : null) || e2.viewport), !n2))
      return null;
    const s2 = document.createElement("div");
    return (
      P(s2, "f-progress"),
      n2.prepend(s2),
      (this.progressBar = s2),
      s2.offsetHeight,
      s2
    );
  }
  set() {
    const t2 = this,
      e2 = t2.instance;
    if (e2.pages.length < 2) return;
    if (t2.timer) return;
    const i2 = t2.option("timeout");
    ((t2.state = zt), P(e2.container, "has-autoplay"));
    let n2 = t2.createProgressBar();
    (n2 &&
      ((n2.style.transitionDuration = `${i2}ms`),
      (n2.style.transform = "scaleX(1)")),
      (t2.timer = setTimeout(() => {
        ((t2.timer = null), t2.inHover || t2.onTimerEnd());
      }, i2)),
      t2.emit("set"));
  }
  clear() {
    const t2 = this;
    (t2.timer && (clearTimeout(t2.timer), (t2.timer = null)),
      t2.removeProgressBar());
  }
  start() {
    const t2 = this;
    if ((t2.set(), t2.state !== kt)) {
      if (t2.option("pauseOnHover")) {
        const e2 = t2.instance.container;
        (e2.addEventListener("mouseenter", t2.onMouseEnter, false),
          e2.addEventListener("mouseleave", t2.onMouseLeave, false));
      }
      (document.addEventListener(
        "visibilitychange",
        t2.onVisibilityChange,
        false
      ),
        t2.emit("start"));
    }
  }
  stop() {
    const t2 = this,
      e2 = t2.state,
      i2 = t2.instance.container;
    (t2.clear(),
      (t2.state = kt),
      i2.removeEventListener("mouseenter", t2.onMouseEnter, false),
      i2.removeEventListener("mouseleave", t2.onMouseLeave, false),
      document.removeEventListener(
        "visibilitychange",
        t2.onVisibilityChange,
        false
      ),
      S(i2, "has-autoplay"),
      e2 !== kt && t2.emit("stop"));
  }
  pause() {
    const t2 = this;
    t2.state === zt && ((t2.state = Rt), t2.clear(), t2.emit(Rt));
  }
  resume() {
    const t2 = this,
      e2 = t2.instance;
    if (e2.isInfinite || e2.page !== e2.pages.length - 1)
      if (t2.state !== zt) {
        if (t2.state === Rt && !t2.inHover) {
          const e3 = new Event("resume", { bubbles: true, cancelable: true });
          (t2.emit("resume", e3), e3.defaultPrevented || t2.set());
        }
      } else t2.set();
    else t2.stop();
  }
  toggle() {
    this.state === zt || this.state === Rt ? this.stop() : this.start();
  }
  attach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.on("ready", t2.onReady),
      e2.on("Panzoom.startAnimation", t2.onChange),
      e2.on("Panzoom.endAnimation", t2.onSettle),
      e2.on("Panzoom.touchMove", t2.onChange));
  }
  detach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.off("ready", t2.onReady),
      e2.off("Panzoom.startAnimation", t2.onChange),
      e2.off("Panzoom.endAnimation", t2.onSettle),
      e2.off("Panzoom.touchMove", t2.onChange),
      t2.stop());
  }
}
Object.defineProperty(It, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: {
    autoStart: true,
    pauseOnHover: true,
    progressParentEl: null,
    showProgress: true,
    timeout: 3e3,
  },
});
class Dt extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "ref", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }));
  }
  onPrepare(t2) {
    const e2 = t2.carousel;
    if (!e2) return;
    const i2 = t2.container;
    i2 &&
      ((e2.options.Autoplay = u(
        { autoStart: false },
        this.option("Autoplay") || {},
        {
          pauseOnHover: false,
          timeout: this.option("timeout"),
          progressParentEl: () => this.option("progressParentEl") || null,
          on: {
            start: () => {
              t2.emit("startSlideshow");
            },
            set: (e3) => {
              var n2;
              (i2.classList.add("has-slideshow"),
                (null === (n2 = t2.getSlide()) || void 0 === n2
                  ? void 0
                  : n2.state) !== lt.Ready && e3.pause());
            },
            stop: () => {
              (i2.classList.remove("has-slideshow"),
                t2.isCompact || t2.endIdle(),
                t2.emit("endSlideshow"));
            },
            resume: (e3, i3) => {
              var n2, s2, o2;
              !i3 ||
                !i3.cancelable ||
                ((null === (n2 = t2.getSlide()) || void 0 === n2
                  ? void 0
                  : n2.state) === lt.Ready &&
                  (null ===
                    (o2 =
                      null === (s2 = t2.carousel) || void 0 === s2
                        ? void 0
                        : s2.panzoom) || void 0 === o2
                    ? void 0
                    : o2.isResting)) ||
                i3.preventDefault();
            },
          },
        }
      )),
      e2.attachPlugins({ Autoplay: It }),
      (this.ref = e2.plugins.Autoplay));
  }
  onReady(t2) {
    const e2 = t2.carousel,
      i2 = this.ref;
    i2 &&
      e2 &&
      this.option("playOnStart") &&
      (e2.isInfinite || e2.page < e2.pages.length - 1) &&
      i2.start();
  }
  onDone(t2, e2) {
    const i2 = this.ref,
      n2 = t2.carousel;
    if (!i2 || !n2) return;
    const s2 = e2.panzoom;
    (s2 &&
      s2.on("startAnimation", () => {
        t2.isCurrentSlide(e2) && i2.stop();
      }),
      t2.isCurrentSlide(e2) && i2.resume());
  }
  onKeydown(t2, e2) {
    var i2;
    const n2 = this.ref;
    n2 &&
      e2 === this.option("key") &&
      "BUTTON" !==
        (null === (i2 = document.activeElement) || void 0 === i2
          ? void 0
          : i2.nodeName) &&
      n2.toggle();
  }
  attach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.on("Carousel.init", t2.onPrepare),
      e2.on("Carousel.ready", t2.onReady),
      e2.on("done", t2.onDone),
      e2.on("keydown", t2.onKeydown));
  }
  detach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.off("Carousel.init", t2.onPrepare),
      e2.off("Carousel.ready", t2.onReady),
      e2.off("done", t2.onDone),
      e2.off("keydown", t2.onKeydown));
  }
}
Object.defineProperty(Dt, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: {
    key: " ",
    playOnStart: false,
    progressParentEl: (t2) => {
      var e2;
      return (
        (null === (e2 = t2.instance.container) || void 0 === e2
          ? void 0
          : e2.querySelector(
              ".fancybox__toolbar [data-fancybox-toggle-slideshow]"
            )) || t2.instance.container
      );
    },
    timeout: 3e3,
  },
});
const Ft = {
  classes: {
    container: "f-thumbs f-carousel__thumbs",
    viewport: "f-thumbs__viewport",
    track: "f-thumbs__track",
    slide: "f-thumbs__slide",
    isResting: "is-resting",
    isSelected: "is-selected",
    isLoading: "is-loading",
    hasThumbs: "has-thumbs",
  },
  minCount: 2,
  parentEl: null,
  thumbTpl:
    '<button class="f-thumbs__slide__button" tabindex="0" type="button" aria-label="{{GOTO}}" data-carousel-index="%i"><img class="f-thumbs__slide__img" data-lazy-src="{{%s}}" alt="" /></button>',
  type: "modern",
};
var jt;
!(function (t2) {
  ((t2[(t2.Init = 0)] = "Init"),
    (t2[(t2.Ready = 1)] = "Ready"),
    (t2[(t2.Hidden = 2)] = "Hidden"));
})(jt || (jt = {}));
const Bt = "isResting",
  Ht = "thumbWidth",
  Nt = "thumbHeight",
  _t = "thumbClipWidth";
let $t = class extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "type", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: "modern",
      }),
      Object.defineProperty(this, "container", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "track", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "carousel", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "thumbWidth", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "thumbClipWidth", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "thumbHeight", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "thumbGap", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "thumbExtraGap", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: jt.Init,
      }));
  }
  get isModern() {
    return "modern" === this.type;
  }
  onInitSlide(t2, e2) {
    const i2 = e2.el ? e2.el.dataset : void 0;
    (i2 &&
      ((e2.thumbSrc = i2.thumbSrc || e2.thumbSrc || ""),
      (e2[_t] = parseFloat(i2[_t] || "") || e2[_t] || 0),
      (e2[Nt] = parseFloat(i2.thumbHeight || "") || e2[Nt] || 0)),
      this.addSlide(e2));
  }
  onInitSlides() {
    this.build();
  }
  onChange() {
    var t2;
    if (!this.isModern) return;
    const e2 = this.container,
      i2 = this.instance,
      n2 = i2.panzoom,
      s2 = this.carousel,
      a2 = s2 ? s2.panzoom : null,
      r2 = i2.page;
    if (n2 && s2 && a2) {
      if (n2.isDragging) {
        S(e2, this.cn(Bt));
        let n3 =
          (null === (t2 = s2.pages[r2]) || void 0 === t2 ? void 0 : t2.pos) ||
          0;
        n3 += i2.getProgress(r2) * (this[_t] + this.thumbGap);
        let o2 = a2.getBounds();
        -1 * n3 > o2.x.min &&
          -1 * n3 < o2.x.max &&
          a2.panTo({ x: -1 * n3, friction: 0.12 });
      } else o(e2, this.cn(Bt), n2.isResting);
      this.shiftModern();
    }
  }
  onRefresh() {
    this.updateProps();
    for (const t2 of this.instance.slides || []) this.resizeModernSlide(t2);
    this.shiftModern();
  }
  isDisabled() {
    const t2 = this.option("minCount") || 0;
    if (t2) {
      const e3 = this.instance;
      let i2 = 0;
      for (const t3 of e3.slides || []) t3.thumbSrc && i2++;
      if (i2 < t2) return true;
    }
    const e2 = this.option("type");
    return ["modern", "classic"].indexOf(e2) < 0;
  }
  getThumb(t2) {
    const e2 = this.option("thumbTpl") || "";
    return {
      html: this.instance.localize(e2, [
        ["%i", t2.index],
        ["%d", t2.index + 1],
        [
          "%s",
          t2.thumbSrc ||
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        ],
      ]),
    };
  }
  addSlide(t2) {
    const e2 = this.carousel;
    e2 && e2.addSlide(t2.index, this.getThumb(t2));
  }
  getSlides() {
    const t2 = [];
    for (const e2 of this.instance.slides || []) t2.push(this.getThumb(e2));
    return t2;
  }
  resizeModernSlide(t2) {
    this.isModern &&
      (t2[Ht] =
        t2[_t] && t2[Nt] ? Math.round(this[Nt] * (t2[_t] / t2[Nt])) : this[Ht]);
  }
  updateProps() {
    const t2 = this.container;
    if (!t2) return;
    const e2 = (e3) =>
      parseFloat(getComputedStyle(t2).getPropertyValue("--f-thumb-" + e3)) || 0;
    ((this.thumbGap = e2("gap")),
      (this.thumbExtraGap = e2("extra-gap")),
      (this[Ht] = e2("width") || 40),
      (this[_t] = e2("clip-width") || 40),
      (this[Nt] = e2("height") || 40));
  }
  build() {
    const t2 = this;
    if (t2.state !== jt.Init) return;
    if (t2.isDisabled()) return void t2.emit("disabled");
    const e2 = t2.instance,
      i2 = e2.container,
      n2 = t2.getSlides(),
      s2 = t2.option("type");
    t2.type = s2;
    const o2 = t2.option("parentEl"),
      a2 = t2.cn("container"),
      r2 = t2.cn("track");
    let l2 = null == o2 ? void 0 : o2.querySelector("." + a2);
    (l2 ||
      ((l2 = document.createElement("div")),
      P(l2, a2),
      o2 ? o2.appendChild(l2) : i2.after(l2)),
      P(l2, `is-${s2}`),
      P(i2, t2.cn("hasThumbs")),
      (t2.container = l2),
      t2.updateProps());
    let c2 = l2.querySelector("." + r2);
    (c2 ||
      ((c2 = document.createElement("div")),
      P(c2, t2.cn("track")),
      l2.appendChild(c2)),
      (t2.track = c2));
    const h2 = u(
        {},
        {
          track: c2,
          infinite: false,
          center: true,
          fill: "classic" === s2,
          dragFree: true,
          slidesPerPage: 1,
          transition: false,
          preload: 0.25,
          friction: 0.12,
          Panzoom: { maxVelocity: 0 },
          Dots: false,
          Navigation: false,
          classes: {
            container: "f-thumbs",
            viewport: "f-thumbs__viewport",
            track: "f-thumbs__track",
            slide: "f-thumbs__slide",
          },
        },
        t2.option("Carousel") || {},
        { Sync: { target: e2 }, slides: n2 }
      ),
      d2 = new e2.constructor(l2, h2);
    (d2.on("createSlide", (e3, i3) => {
      (t2.setProps(i3.index), t2.emit("createSlide", i3, i3.el));
    }),
      d2.on("ready", () => {
        (t2.shiftModern(), t2.emit("ready"));
      }),
      d2.on("refresh", () => {
        t2.shiftModern();
      }),
      d2.on("Panzoom.click", (e3, i3, n3) => {
        t2.onClick(n3);
      }),
      (t2.carousel = d2),
      (t2.state = jt.Ready));
  }
  onClick(t2) {
    (t2.preventDefault(), t2.stopPropagation());
    const e2 = this.instance,
      { pages: i2, page: n2 } = e2,
      s2 = (t3) => {
        if (t3) {
          const e3 = t3.closest("[data-carousel-index]");
          if (e3)
            return [parseInt(e3.dataset.carouselIndex || "", 10) || 0, e3];
        }
        return [-1, void 0];
      },
      o2 = (t3, e3) => {
        const i3 = document.elementFromPoint(t3, e3);
        return i3 ? s2(i3) : [-1, void 0];
      };
    let [a2, r2] = s2(t2.target);
    if (a2 > -1) return;
    const l2 = this[_t],
      c2 = t2.clientX,
      h2 = t2.clientY;
    let [d2, u2] = o2(c2 - l2, h2),
      [p2, f2] = o2(c2 + l2, h2);
    (u2 && f2
      ? ((a2 =
          Math.abs(c2 - u2.getBoundingClientRect().right) <
          Math.abs(c2 - f2.getBoundingClientRect().left)
            ? d2
            : p2),
        a2 === n2 && (a2 = a2 === d2 ? p2 : d2))
      : u2
        ? (a2 = d2)
        : f2 && (a2 = p2),
      a2 > -1 && i2[a2] && e2.slideTo(a2));
  }
  getShift(t2) {
    var e2;
    const i2 = this,
      { instance: n2 } = i2,
      s2 = i2.carousel;
    if (!n2 || !s2) return 0;
    const o2 = i2[Ht],
      a2 = i2[_t],
      r2 = i2.thumbGap,
      l2 = i2.thumbExtraGap;
    if (!(null === (e2 = s2.slides[t2]) || void 0 === e2 ? void 0 : e2.el))
      return 0;
    const c2 = 0.5 * (o2 - a2),
      h2 = n2.pages.length - 1;
    let d2 = n2.getProgress(0),
      u2 = n2.getProgress(h2),
      p2 = n2.getProgress(t2, false, true),
      f2 = 0,
      g2 = c2 + l2 + r2;
    const m2 = d2 < 0 && d2 > -1,
      v2 = u2 > 0 && u2 < 1;
    return (
      0 === t2
        ? ((f2 = g2 * Math.abs(d2)),
          v2 && 1 === d2 && (f2 -= g2 * Math.abs(u2)))
        : t2 === h2
          ? ((f2 = g2 * Math.abs(u2) * -1),
            m2 && -1 === u2 && (f2 += g2 * Math.abs(d2)))
          : m2 || v2
            ? ((f2 = -1 * g2),
              (f2 += g2 * Math.abs(d2)),
              (f2 += g2 * (1 - Math.abs(u2))))
            : (f2 = g2 * p2),
      f2
    );
  }
  setProps(e2) {
    var i2;
    const n2 = this;
    if (!n2.isModern) return;
    const { instance: s2 } = n2,
      o2 = n2.carousel;
    if (s2 && o2) {
      const a2 =
        null === (i2 = o2.slides[e2]) || void 0 === i2 ? void 0 : i2.el;
      if (a2 && a2.childNodes.length) {
        let i3 = t(1 - Math.abs(s2.getProgress(e2))),
          o3 = t(n2.getShift(e2));
        (a2.style.setProperty("--progress", i3 ? i3 + "" : ""),
          a2.style.setProperty("--shift", o3 + ""));
      }
    }
  }
  shiftModern() {
    const t2 = this;
    if (!t2.isModern) return;
    const { instance: e2, track: i2 } = t2,
      n2 = e2.panzoom,
      s2 = t2.carousel;
    if (!(e2 && i2 && n2 && s2)) return;
    if (n2.state === m.Init || n2.state === m.Destroy) return;
    for (const i3 of e2.slides) t2.setProps(i3.index);
    let o2 = (t2[_t] + t2.thumbGap) * (s2.slides.length || 0);
    i2.style.setProperty("--width", o2 + "");
  }
  cleanup() {
    const t2 = this;
    (t2.carousel && t2.carousel.destroy(),
      (t2.carousel = null),
      t2.container && t2.container.remove(),
      (t2.container = null),
      t2.track && t2.track.remove(),
      (t2.track = null),
      (t2.state = jt.Init),
      S(t2.instance.container, t2.cn("hasThumbs")));
  }
  attach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.on("initSlide", t2.onInitSlide),
      e2.state === B.Init
        ? e2.on("initSlides", t2.onInitSlides)
        : t2.onInitSlides(),
      e2.on(["change", "Panzoom.afterTransform"], t2.onChange),
      e2.on("Panzoom.refresh", t2.onRefresh));
  }
  detach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.off("initSlide", t2.onInitSlide),
      e2.off("initSlides", t2.onInitSlides),
      e2.off(["change", "Panzoom.afterTransform"], t2.onChange),
      e2.off("Panzoom.refresh", t2.onRefresh),
      t2.cleanup());
  }
};
Object.defineProperty($t, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: Ft,
});
const Wt = Object.assign(Object.assign({}, Ft), {
    key: "t",
    showOnStart: true,
    parentEl: null,
  }),
  Xt = "is-masked",
  qt = "aria-hidden";
class Yt extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "ref", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "hidden", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }));
  }
  get isEnabled() {
    const t2 = this.ref;
    return t2 && !t2.isDisabled();
  }
  get isHidden() {
    return this.hidden;
  }
  onClick(t2, e2) {
    e2.stopPropagation();
  }
  onCreateSlide(t2, e2) {
    var i2, n2, s2;
    const o2 =
        (null ===
          (s2 =
            null ===
              (n2 =
                null === (i2 = this.instance) || void 0 === i2
                  ? void 0
                  : i2.carousel) || void 0 === n2
              ? void 0
              : n2.slides[e2.index]) || void 0 === s2
          ? void 0
          : s2.type) || "",
      a2 = e2.el;
    if (a2 && o2) {
      let t3 = `for-${o2}`;
      (["video", "youtube", "vimeo", "html5video"].includes(o2) &&
        (t3 += " for-video"),
        P(a2, t3));
    }
  }
  onInit() {
    var t2;
    const e2 = this,
      i2 = e2.instance,
      n2 = i2.carousel;
    if (e2.ref || !n2) return;
    const s2 = e2.option("parentEl") || i2.footer || i2.container;
    if (!s2) return;
    const o2 = u({}, e2.options, {
      parentEl: s2,
      classes: { container: "f-thumbs fancybox__thumbs" },
      Carousel: { Sync: { friction: i2.option("Carousel.friction") || 0 } },
      on: {
        ready: (t3) => {
          const i3 = t3.container;
          i3 &&
            this.hidden &&
            (e2.refresh(),
            (i3.style.transition = "none"),
            e2.hide(),
            i3.offsetHeight,
            queueMicrotask(() => {
              ((i3.style.transition = ""), e2.show());
            }));
        },
      },
    });
    ((o2.Carousel = o2.Carousel || {}),
      (o2.Carousel.on = u(
        (null === (t2 = e2.options.Carousel) || void 0 === t2
          ? void 0
          : t2.on) || {},
        { click: this.onClick, createSlide: this.onCreateSlide }
      )),
      (n2.options.Thumbs = o2),
      n2.attachPlugins({ Thumbs: $t }),
      (e2.ref = n2.plugins.Thumbs),
      e2.option("showOnStart") ||
        ((e2.ref.state = jt.Hidden), (e2.hidden = true)));
  }
  onResize() {
    var t2;
    const e2 =
      null === (t2 = this.ref) || void 0 === t2 ? void 0 : t2.container;
    e2 && (e2.style.maxHeight = "");
  }
  onKeydown(t2, e2) {
    const i2 = this.option("key");
    i2 && i2 === e2 && this.toggle();
  }
  toggle() {
    const t2 = this.ref;
    if (t2 && !t2.isDisabled())
      return t2.state === jt.Hidden
        ? ((t2.state = jt.Init), void t2.build())
        : void (this.hidden ? this.show() : this.hide());
  }
  show() {
    const t2 = this.ref;
    if (!t2 || t2.isDisabled()) return;
    const e2 = t2.container;
    e2 &&
      (this.refresh(),
      e2.offsetHeight,
      e2.removeAttribute(qt),
      e2.classList.remove(Xt),
      (this.hidden = false));
  }
  hide() {
    const t2 = this.ref,
      e2 = t2 && t2.container;
    (e2 &&
      (this.refresh(),
      e2.offsetHeight,
      e2.classList.add(Xt),
      e2.setAttribute(qt, "true")),
      (this.hidden = true));
  }
  refresh() {
    const t2 = this.ref;
    if (!t2 || !t2.state) return;
    const e2 = t2.container,
      i2 = (null == e2 ? void 0 : e2.firstChild) || null;
    e2 &&
      i2 &&
      i2.childNodes.length &&
      (e2.style.maxHeight = `${i2.getBoundingClientRect().height}px`);
  }
  attach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.state === rt.Init ? e2.on("Carousel.init", t2.onInit) : t2.onInit(),
      e2.on("resize", t2.onResize),
      e2.on("keydown", t2.onKeydown));
  }
  detach() {
    var t2;
    const e2 = this,
      i2 = e2.instance;
    (i2.off("Carousel.init", e2.onInit),
      i2.off("resize", e2.onResize),
      i2.off("keydown", e2.onKeydown),
      null === (t2 = i2.carousel) ||
        void 0 === t2 ||
        t2.detachPlugins(["Thumbs"]),
      (e2.ref = null));
  }
}
Object.defineProperty(Yt, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: Wt,
});
const Vt = {
  panLeft: {
    icon: '<svg><path d="M5 12h14M5 12l6 6M5 12l6-6"/></svg>',
    change: { panX: -100 },
  },
  panRight: {
    icon: '<svg><path d="M5 12h14M13 18l6-6M13 6l6 6"/></svg>',
    change: { panX: 100 },
  },
  panUp: {
    icon: '<svg><path d="M12 5v14M18 11l-6-6M6 11l6-6"/></svg>',
    change: { panY: -100 },
  },
  panDown: {
    icon: '<svg><path d="M12 5v14M18 13l-6 6M6 13l6 6"/></svg>',
    change: { panY: 100 },
  },
  zoomIn: {
    icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>',
    action: "zoomIn",
  },
  zoomOut: {
    icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
    action: "zoomOut",
  },
  toggle1to1: {
    icon: '<svg><path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/></svg>',
    action: "toggleZoom",
  },
  toggleZoom: {
    icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
    action: "toggleZoom",
  },
  iterateZoom: {
    icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
    action: "iterateZoom",
  },
  rotateCCW: {
    icon: '<svg><path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/></svg>',
    action: "rotateCCW",
  },
  rotateCW: {
    icon: '<svg><path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/></svg>',
    action: "rotateCW",
  },
  flipX: {
    icon: '<svg style="stroke-width: 1.3"><path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/></svg>',
    action: "flipX",
  },
  flipY: {
    icon: '<svg style="stroke-width: 1.3"><path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/></svg>',
    action: "flipY",
  },
  fitX: {
    icon: '<svg><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M10 18H3M21 18h-7M6 15l-3 3 3 3M18 15l3 3-3 3"/></svg>',
    action: "fitX",
  },
  fitY: {
    icon: '<svg><path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M18 14v7M18 3v7M15 18l3 3 3-3M15 6l3-3 3 3"/></svg>',
    action: "fitY",
  },
  reset: {
    icon: '<svg><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>',
    action: "reset",
  },
  toggleFS: {
    icon: '<svg><g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g></svg>',
    action: "toggleFS",
  },
};
var Zt;
!(function (t2) {
  ((t2[(t2.Init = 0)] = "Init"),
    (t2[(t2.Ready = 1)] = "Ready"),
    (t2[(t2.Disabled = 2)] = "Disabled"));
})(Zt || (Zt = {}));
const Ut = {
    absolute: "auto",
    display: {
      left: ["infobar"],
      middle: [],
      right: ["iterateZoom", "slideshow", "fullscreen", "thumbs", "close"],
    },
    enabled: "auto",
    items: {
      infobar: {
        tpl: '<div class="fancybox__infobar" tabindex="-1"><span data-fancybox-current-index></span>/<span data-fancybox-count></span></div>',
      },
      download: {
        tpl: '<a class="f-button" title="{{DOWNLOAD}}" data-fancybox-download href="javasript:;"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></a>',
      },
      prev: {
        tpl: '<button class="f-button" title="{{PREV}}" data-fancybox-prev><svg><path d="m15 6-6 6 6 6"/></svg></button>',
      },
      next: {
        tpl: '<button class="f-button" title="{{NEXT}}" data-fancybox-next><svg><path d="m9 6 6 6-6 6"/></svg></button>',
      },
      slideshow: {
        tpl: '<button class="f-button" title="{{TOGGLE_SLIDESHOW}}" data-fancybox-toggle-slideshow><svg><g><path d="M8 4v16l13 -8z"></path></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>',
      },
      fullscreen: {
        tpl: '<button class="f-button" title="{{TOGGLE_FULLSCREEN}}" data-fancybox-toggle-fullscreen><svg><g><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>',
      },
      thumbs: {
        tpl: '<button class="f-button" title="{{TOGGLE_THUMBS}}" data-fancybox-toggle-thumbs><svg><circle cx="5.5" cy="5.5" r="1"/><circle cx="12" cy="5.5" r="1"/><circle cx="18.5" cy="5.5" r="1"/><circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/><circle cx="5.5" cy="18.5" r="1"/><circle cx="12" cy="18.5" r="1"/><circle cx="18.5" cy="18.5" r="1"/></svg></button>',
      },
      close: {
        tpl: '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg><path d="m19.5 4.5-15 15M4.5 4.5l15 15"/></svg></button>',
      },
    },
    parentEl: null,
  },
  Gt = {
    tabindex: "-1",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  },
  Kt = "has-toolbar",
  Jt = "fancybox__toolbar";
class Qt extends _ {
  constructor() {
    (super(...arguments),
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: Zt.Init,
      }),
      Object.defineProperty(this, "container", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }));
  }
  onReady(t2) {
    var e2;
    if (!t2.carousel) return;
    let i2 = this.option("display"),
      n2 = this.option("absolute"),
      s2 = this.option("enabled");
    if ("auto" === s2) {
      const t3 = this.instance.carousel;
      let e3 = 0;
      if (t3)
        for (const i3 of t3.slides) (i3.panzoom || "image" === i3.type) && e3++;
      e3 || (s2 = false);
    }
    s2 || (i2 = void 0);
    let o2 = 0;
    const a2 = { left: [], middle: [], right: [] };
    if (i2)
      for (const t3 of ["left", "middle", "right"])
        for (const n3 of i2[t3]) {
          const i3 = this.createEl(n3);
          i3 && (null === (e2 = a2[t3]) || void 0 === e2 || e2.push(i3), o2++);
        }
    let r2 = null;
    if ((o2 && (r2 = this.createContainer()), r2)) {
      for (const [t3, e3] of Object.entries(a2)) {
        const i3 = document.createElement("div");
        P(i3, Jt + "__column is-" + t3);
        for (const t4 of e3) i3.appendChild(t4);
        ("auto" !== n2 || "middle" !== t3 || e3.length || (n2 = true),
          r2.appendChild(i3));
      }
      (true === n2 && P(r2, "is-absolute"),
        (this.state = Zt.Ready),
        this.onRefresh());
    } else this.state = Zt.Disabled;
  }
  onClick(t2) {
    var e2, i2;
    const n2 = this.instance,
      s2 = n2.getSlide(),
      o2 = null == s2 ? void 0 : s2.panzoom,
      a2 = t2.target,
      r2 = a2 && E(a2) ? a2.dataset : null;
    if (!r2) return;
    if (void 0 !== r2.fancyboxToggleThumbs)
      return (
        t2.preventDefault(),
        t2.stopPropagation(),
        void (null === (e2 = n2.plugins.Thumbs) || void 0 === e2 || e2.toggle())
      );
    if (void 0 !== r2.fancyboxToggleFullscreen)
      return (
        t2.preventDefault(),
        t2.stopPropagation(),
        void this.instance.toggleFullscreen()
      );
    if (void 0 !== r2.fancyboxToggleSlideshow) {
      (t2.preventDefault(), t2.stopPropagation());
      const e3 =
        null === (i2 = n2.carousel) || void 0 === i2
          ? void 0
          : i2.plugins.Autoplay;
      let s3 = e3.isActive;
      return (
        o2 && "mousemove" === o2.panMode && !s3 && o2.reset(),
        void (s3 ? e3.stop() : e3.start())
      );
    }
    const l2 = r2.panzoomAction,
      c2 = r2.panzoomChange;
    if (((c2 || l2) && (t2.preventDefault(), t2.stopPropagation()), c2)) {
      let t3 = {};
      try {
        t3 = JSON.parse(c2);
      } catch (t4) {}
      o2 && o2.applyChange(t3);
    } else l2 && o2 && o2[l2] && o2[l2]();
  }
  onChange() {
    this.onRefresh();
  }
  onRefresh() {
    if (this.instance.isClosing()) return;
    const t2 = this.container;
    if (!t2) return;
    const e2 = this.instance.getSlide();
    if (!e2 || e2.state !== lt.Ready) return;
    const i2 = e2 && !e2.error && e2.panzoom;
    for (const e3 of t2.querySelectorAll("[data-panzoom-action]"))
      i2
        ? (e3.removeAttribute("disabled"), e3.removeAttribute("tabindex"))
        : (e3.setAttribute("disabled", ""), e3.setAttribute("tabindex", "-1"));
    let n2 = i2 && i2.canZoomIn(),
      s2 = i2 && i2.canZoomOut();
    for (const e3 of t2.querySelectorAll('[data-panzoom-action="zoomIn"]'))
      n2
        ? (e3.removeAttribute("disabled"), e3.removeAttribute("tabindex"))
        : (e3.setAttribute("disabled", ""), e3.setAttribute("tabindex", "-1"));
    for (const e3 of t2.querySelectorAll('[data-panzoom-action="zoomOut"]'))
      s2
        ? (e3.removeAttribute("disabled"), e3.removeAttribute("tabindex"))
        : (e3.setAttribute("disabled", ""), e3.setAttribute("tabindex", "-1"));
    for (const e3 of t2.querySelectorAll(
      '[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]'
    )) {
      s2 || n2
        ? (e3.removeAttribute("disabled"), e3.removeAttribute("tabindex"))
        : (e3.setAttribute("disabled", ""), e3.setAttribute("tabindex", "-1"));
      const t3 = e3.querySelector("g");
      t3 && (t3.style.display = n2 ? "" : "none");
    }
  }
  onDone(t2, e2) {
    var i2;
    (null === (i2 = e2.panzoom) ||
      void 0 === i2 ||
      i2.on("afterTransform", () => {
        this.instance.isCurrentSlide(e2) && this.onRefresh();
      }),
      this.instance.isCurrentSlide(e2) && this.onRefresh());
  }
  createContainer() {
    const t2 = this.instance.container;
    if (!t2) return null;
    const e2 = this.option("parentEl") || t2;
    let i2 = e2.querySelector("." + Jt);
    return (
      i2 || ((i2 = document.createElement("div")), P(i2, Jt), e2.prepend(i2)),
      i2.addEventListener("click", this.onClick, {
        passive: false,
        capture: true,
      }),
      t2 && P(t2, Kt),
      (this.container = i2),
      i2
    );
  }
  createEl(t2) {
    const e2 = this.instance,
      i2 = e2.carousel;
    if (!i2) return null;
    if ("toggleFS" === t2) return null;
    if ("fullscreen" === t2 && !ot()) return null;
    let s2 = null;
    const o2 = i2.slides.length || 0;
    let a2 = 0,
      r2 = 0;
    for (const t3 of i2.slides)
      ((t3.panzoom || "image" === t3.type) && a2++,
        ("image" === t3.type || t3.downloadSrc) && r2++);
    if (o2 < 2 && ["infobar", "prev", "next"].includes(t2)) return s2;
    if (void 0 !== Vt[t2] && !a2) return null;
    if ("download" === t2 && !r2) return null;
    if ("thumbs" === t2) {
      const t3 = e2.plugins.Thumbs;
      if (!t3 || !t3.isEnabled) return null;
    }
    if ("slideshow" === t2) {
      if (!i2.plugins.Autoplay || o2 < 2) return null;
    }
    if (void 0 !== Vt[t2]) {
      const e3 = Vt[t2];
      ((s2 = document.createElement("button")),
        s2.setAttribute(
          "title",
          this.instance.localize(`{{${t2.toUpperCase()}}}`)
        ),
        P(s2, "f-button"),
        e3.action && (s2.dataset.panzoomAction = e3.action),
        e3.change && (s2.dataset.panzoomChange = JSON.stringify(e3.change)),
        s2.appendChild(n(this.instance.localize(e3.icon))));
    } else {
      const e3 = (this.option("items") || [])[t2];
      e3 &&
        ((s2 = n(this.instance.localize(e3.tpl))),
        "function" == typeof e3.click &&
          s2.addEventListener("click", (t3) => {
            (t3.preventDefault(),
              t3.stopPropagation(),
              "function" == typeof e3.click && e3.click.call(this, this, t3));
          }));
    }
    const l2 = null == s2 ? void 0 : s2.querySelector("svg");
    if (l2)
      for (const [t3, e3] of Object.entries(Gt))
        l2.getAttribute(t3) || l2.setAttribute(t3, String(e3));
    return s2;
  }
  removeContainer() {
    const t2 = this.container;
    (t2 && t2.remove(), (this.container = null), (this.state = Zt.Disabled));
    const e2 = this.instance.container;
    e2 && S(e2, Kt);
  }
  attach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.on("Carousel.initSlides", t2.onReady),
      e2.on("done", t2.onDone),
      e2.on(["reveal", "Carousel.change"], t2.onChange),
      t2.onReady(t2.instance));
  }
  detach() {
    const t2 = this,
      e2 = t2.instance;
    (e2.off("Carousel.initSlides", t2.onReady),
      e2.off("done", t2.onDone),
      e2.off(["reveal", "Carousel.change"], t2.onChange),
      t2.removeContainer());
  }
}
Object.defineProperty(Qt, "defaults", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: Ut,
});
const te = {
    Hash: class extends _ {
      onReady() {
        ht = false;
      }
      onChange(t2) {
        ut && clearTimeout(ut);
        const { hash: e2 } = pt(),
          { hash: i2 } = ft(),
          n2 = t2.isOpeningSlide(t2.getSlide());
        (n2 && (ct = i2 === e2 ? "" : i2),
          e2 &&
            e2 !== i2 &&
            (ut = setTimeout(() => {
              try {
                if (t2.state === rt.Ready) {
                  let t3 = "replaceState";
                  (n2 && !dt && ((t3 = "pushState"), (dt = true)),
                    window.history[t3](
                      {},
                      document.title,
                      window.location.pathname + window.location.search + e2
                    ));
                }
              } catch (t3) {}
            }, 300)));
      }
      onClose(t2) {
        if ((ut && clearTimeout(ut), !ht && dt))
          return ((dt = false), (ht = false), void window.history.back());
        if (!ht)
          try {
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.search + (ct || "")
            );
          } catch (t3) {}
      }
      attach() {
        const t2 = this.instance;
        (t2.on("ready", this.onReady),
          t2.on(["Carousel.ready", "Carousel.change"], this.onChange),
          t2.on("close", this.onClose));
      }
      detach() {
        const t2 = this.instance;
        (t2.off("ready", this.onReady),
          t2.off(["Carousel.ready", "Carousel.change"], this.onChange),
          t2.off("close", this.onClose));
      }
      static parseURL() {
        return ft();
      }
      static startFromUrl() {
        gt();
      }
      static destroy() {
        window.removeEventListener("hashchange", vt, false);
      }
    },
    Html: Lt,
    Images: wt,
    Slideshow: Dt,
    Thumbs: Yt,
    Toolbar: Qt,
  },
  ee = "with-fancybox",
  ie = "hide-scrollbar",
  ne = "--fancybox-scrollbar-compensate",
  se = "--fancybox-body-margin",
  oe = "aria-hidden",
  ae = "is-using-tab",
  re = "is-animated",
  le = "is-compact",
  ce = "is-loading",
  he = "is-opening",
  de = "has-caption",
  ue = "disabled",
  pe = "tabindex",
  fe = "download",
  ge = "href",
  me = "src",
  ve = (t2) => "string" == typeof t2,
  be = function () {
    var t2 = window.getSelection();
    return !!t2 && "Range" === t2.type;
  };
let ye,
  we = null,
  xe = null,
  Ee = 0,
  Se = 0,
  Pe = 0,
  Ce = 0;
const Te = /* @__PURE__ */ new Map();
let Me = 0;
class Oe extends g {
  get isIdle() {
    return this.idle;
  }
  get isCompact() {
    return this.option("compact");
  }
  constructor(t2 = [], e2 = {}, i2 = {}) {
    (super(e2),
      Object.defineProperty(this, "userSlides", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: [],
      }),
      Object.defineProperty(this, "userPlugins", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {},
      }),
      Object.defineProperty(this, "idle", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "idleTimer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "clickTimer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "pwt", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "ignoreFocusChange", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "startedFs", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false,
      }),
      Object.defineProperty(this, "state", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: rt.Init,
      }),
      Object.defineProperty(this, "id", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0,
      }),
      Object.defineProperty(this, "container", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "caption", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "footer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "carousel", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "lastFocus", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: null,
      }),
      Object.defineProperty(this, "prevMouseMoveEvent", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: void 0,
      }),
      ye || (ye = ot()),
      (this.id = e2.id || ++Me),
      Te.set(this.id, this),
      (this.userSlides = t2),
      (this.userPlugins = i2),
      queueMicrotask(() => {
        this.init();
      }));
  }
  init() {
    if (this.state === rt.Destroy) return;
    ((this.state = rt.Init),
      this.attachPlugins(
        Object.assign(Object.assign({}, Oe.Plugins), this.userPlugins)
      ),
      this.emit("init"),
      this.emit("attachPlugins"),
      true === this.option("hideScrollbar") &&
        (() => {
          if (!et) return;
          const t3 = document,
            e2 = t3.body,
            i2 = t3.documentElement;
          if (e2.classList.contains(ie)) return;
          let n2 = window.innerWidth - i2.getBoundingClientRect().width;
          const s2 = parseFloat(window.getComputedStyle(e2).marginRight);
          (n2 < 0 && (n2 = 0),
            i2.style.setProperty(ne, `${n2}px`),
            s2 && e2.style.setProperty(se, `${s2}px`),
            e2.classList.add(ie));
        })(),
      this.initLayout(),
      this.scale());
    const t2 = () => {
      (this.initCarousel(this.userSlides),
        (this.state = rt.Ready),
        this.attachEvents(),
        this.emit("ready"),
        setTimeout(() => {
          this.container && this.container.setAttribute(oe, "false");
        }, 16));
    };
    this.option("Fullscreen.autoStart") && ye && !ye.isFullscreen()
      ? ye
          .request()
          .then(() => {
            ((this.startedFs = true), t2());
          })
          .catch(() => t2())
      : t2();
  }
  initLayout() {
    var t2, e2;
    const i2 = this.option("parentEl") || document.body,
      s2 = n(this.localize(this.option("tpl.main") || ""));
    if (s2) {
      if (
        (s2.setAttribute("id", `fancybox-${this.id}`),
        s2.setAttribute("aria-label", this.localize("{{MODAL}}")),
        s2.classList.toggle(le, this.isCompact),
        P(s2, this.option("mainClass") || ""),
        P(s2, he),
        (this.container = s2),
        (this.footer = s2.querySelector(".fancybox__footer")),
        i2.appendChild(s2),
        P(document.documentElement, ee),
        (we && xe) ||
          ((we = document.createElement("span")),
          P(we, "fancybox-focus-guard"),
          we.setAttribute(pe, "0"),
          we.setAttribute(oe, "true"),
          we.setAttribute("aria-label", "Focus guard"),
          (xe = we.cloneNode()),
          null === (t2 = s2.parentElement) ||
            void 0 === t2 ||
            t2.insertBefore(we, s2),
          null === (e2 = s2.parentElement) || void 0 === e2 || e2.append(xe)),
        s2.addEventListener("mousedown", (t3) => {
          ((Ee = t3.pageX), (Se = t3.pageY), S(s2, ae));
        }),
        this.option("closeExisting"))
      )
        for (const t3 of Te.values()) t3.id !== this.id && t3.close();
      else
        this.option("animated") &&
          (P(s2, re),
          setTimeout(() => {
            this.isClosing() || S(s2, re);
          }, 350));
      this.emit("initLayout");
    }
  }
  initCarousel(t2) {
    const i2 = this.container;
    if (!i2) return;
    const n2 = i2.querySelector(".fancybox__carousel");
    if (!n2) return;
    const s2 = (this.carousel = new Q(
      n2,
      u(
        {},
        {
          slides: t2,
          transition: "fade",
          Panzoom: {
            lockAxis: this.option("dragToClose") ? "xy" : "x",
            infinite: !!this.option("dragToClose") && "y",
          },
          Dots: false,
          Navigation: {
            classes: {
              container: "fancybox__nav",
              button: "f-button",
              isNext: "is-next",
              isPrev: "is-prev",
            },
          },
          initialPage: this.option("startIndex"),
          l10n: this.option("l10n"),
        },
        this.option("Carousel") || {}
      )
    ));
    (s2.on("*", (t3, e2, ...i3) => {
      this.emit(`Carousel.${e2}`, t3, ...i3);
    }),
      s2.on(["ready", "change"], () => {
        this.manageCaption();
      }),
      this.on("Carousel.removeSlide", (t3, e2, i3) => {
        (this.clearContent(i3), (i3.state = void 0));
      }),
      s2.on("Panzoom.touchStart", () => {
        var t3, e2;
        (this.isCompact || this.endIdle(),
          (null === (t3 = document.activeElement) || void 0 === t3
            ? void 0
            : t3.closest(".f-thumbs")) &&
            (null === (e2 = this.container) || void 0 === e2 || e2.focus()));
      }),
      s2.on("settle", () => {
        (this.idleTimer ||
          this.isCompact ||
          !this.option("idle") ||
          this.setIdle(),
          this.option("autoFocus") && !this.isClosing && this.checkFocus());
      }),
      this.option("dragToClose") &&
        (s2.on("Panzoom.afterTransform", (t3, i3) => {
          const n3 = this.getSlide();
          if (n3 && e(n3.el)) return;
          const s3 = this.container;
          if (s3) {
            const t4 = Math.abs(i3.current.f),
              e2 =
                t4 < 1
                  ? ""
                  : Math.max(
                      0.5,
                      Math.min(1, 1 - (t4 / i3.contentRect.fitHeight) * 1.5)
                    );
            (s3.style.setProperty("--fancybox-ts", e2 ? "0s" : ""),
              s3.style.setProperty("--fancybox-opacity", e2 + ""));
          }
        }),
        s2.on("Panzoom.touchEnd", (t3, i3, n3) => {
          var s3;
          const o2 = this.getSlide();
          if (o2 && e(o2.el)) return;
          if (
            i3.isMobile &&
            document.activeElement &&
            -1 !==
              ["TEXTAREA", "INPUT"].indexOf(
                null === (s3 = document.activeElement) || void 0 === s3
                  ? void 0
                  : s3.nodeName
              )
          )
            return;
          const a2 = Math.abs(i3.dragOffset.y);
          "y" === i3.lockedAxis &&
            (a2 >= 200 || (a2 >= 50 && i3.dragOffset.time < 300)) &&
            (n3 && n3.cancelable && n3.preventDefault(),
            this.close(n3, "f-throwOut" + (i3.current.f < 0 ? "Up" : "Down")));
        })),
      s2.on("change", (t3) => {
        var e2;
        let i3 =
          null === (e2 = this.getSlide()) || void 0 === e2
            ? void 0
            : e2.triggerEl;
        if (i3) {
          const e3 = new CustomEvent("slideTo", {
            bubbles: true,
            cancelable: true,
            detail: t3.page,
          });
          i3.dispatchEvent(e3);
        }
      }),
      s2.on(["refresh", "change"], (t3) => {
        const e2 = this.container;
        if (!e2) return;
        for (const i4 of e2.querySelectorAll("[data-fancybox-current-index]"))
          i4.innerHTML = t3.page + 1;
        for (const i4 of e2.querySelectorAll("[data-fancybox-count]"))
          i4.innerHTML = t3.pages.length;
        if (!t3.isInfinite) {
          for (const i4 of e2.querySelectorAll("[data-fancybox-next]"))
            t3.page < t3.pages.length - 1
              ? (i4.removeAttribute(ue), i4.removeAttribute(pe))
              : (i4.setAttribute(ue, ""), i4.setAttribute(pe, "-1"));
          for (const i4 of e2.querySelectorAll("[data-fancybox-prev]"))
            t3.page > 0
              ? (i4.removeAttribute(ue), i4.removeAttribute(pe))
              : (i4.setAttribute(ue, ""), i4.setAttribute(pe, "-1"));
        }
        const i3 = this.getSlide();
        if (!i3) return;
        let n3 = i3.downloadSrc || "";
        n3 || "image" !== i3.type || i3.error || !ve(i3[me]) || (n3 = i3[me]);
        for (const t4 of e2.querySelectorAll("[data-fancybox-download]")) {
          const e3 = i3.downloadFilename;
          n3
            ? (t4.removeAttribute(ue),
              t4.removeAttribute(pe),
              t4.setAttribute(ge, n3),
              t4.setAttribute(fe, e3 || n3),
              t4.setAttribute("target", "_blank"))
            : (t4.setAttribute(ue, ""),
              t4.setAttribute(pe, "-1"),
              t4.removeAttribute(ge),
              t4.removeAttribute(fe));
        }
      }),
      this.emit("initCarousel"));
  }
  attachEvents() {
    const t2 = this,
      e2 = t2.container;
    if (!e2) return;
    (e2.addEventListener("click", t2.onClick, {
      passive: false,
      capture: false,
    }),
      e2.addEventListener("wheel", t2.onWheel, {
        passive: false,
        capture: false,
      }),
      document.addEventListener("keydown", t2.onKeydown, {
        passive: false,
        capture: true,
      }),
      document.addEventListener(
        "visibilitychange",
        t2.onVisibilityChange,
        false
      ),
      document.addEventListener("mousemove", t2.onMousemove),
      t2.option("trapFocus") &&
        document.addEventListener("focus", t2.onFocus, true),
      window.addEventListener("resize", t2.onResize));
    const i2 = window.visualViewport;
    i2 &&
      (i2.addEventListener("scroll", t2.onResize),
      i2.addEventListener("resize", t2.onResize));
  }
  detachEvents() {
    const t2 = this,
      e2 = t2.container;
    if (!e2) return;
    (document.removeEventListener("keydown", t2.onKeydown, {
      passive: false,
      capture: true,
    }),
      e2.removeEventListener("wheel", t2.onWheel, {
        passive: false,
        capture: false,
      }),
      e2.removeEventListener("click", t2.onClick, {
        passive: false,
        capture: false,
      }),
      document.removeEventListener("mousemove", t2.onMousemove),
      window.removeEventListener("resize", t2.onResize));
    const i2 = window.visualViewport;
    (i2 &&
      (i2.removeEventListener("resize", t2.onResize),
      i2.removeEventListener("scroll", t2.onResize)),
      document.removeEventListener(
        "visibilitychange",
        t2.onVisibilityChange,
        false
      ),
      document.removeEventListener("focus", t2.onFocus, true));
  }
  scale() {
    const t2 = this.container;
    if (!t2) return;
    const e2 = window.visualViewport,
      i2 = Math.max(1, (null == e2 ? void 0 : e2.scale) || 1);
    let n2 = "",
      s2 = "",
      o2 = "";
    if (e2 && i2 > 1) {
      let t3 = `${e2.offsetLeft}px`,
        a2 = `${e2.offsetTop}px`;
      ((n2 = e2.width * i2 + "px"),
        (s2 = e2.height * i2 + "px"),
        (o2 = `translate3d(${t3}, ${a2}, 0) scale(${1 / i2})`));
    }
    ((t2.style.transform = o2), (t2.style.width = n2), (t2.style.height = s2));
  }
  onClick(t2) {
    var e2;
    const { container: i2, isCompact: n2 } = this;
    if (!i2 || this.isClosing()) return;
    !n2 && this.option("idle") && this.resetIdle();
    const s2 = t2.composedPath()[0];
    if (s2.closest(".fancybox-spinner") || s2.closest("[data-fancybox-close]"))
      return (t2.preventDefault(), void this.close(t2));
    if (s2.closest("[data-fancybox-prev]"))
      return (t2.preventDefault(), void this.prev());
    if (s2.closest("[data-fancybox-next]"))
      return (t2.preventDefault(), void this.next());
    if ("click" === t2.type && 0 === t2.detail) return;
    if (Math.abs(t2.pageX - Ee) > 30 || Math.abs(t2.pageY - Se) > 30) return;
    const o2 = document.activeElement;
    if (be() && o2 && i2.contains(o2)) return;
    if (
      n2 &&
      "image" ===
        (null === (e2 = this.getSlide()) || void 0 === e2 ? void 0 : e2.type)
    )
      return void (this.clickTimer
        ? (clearTimeout(this.clickTimer), (this.clickTimer = null))
        : (this.clickTimer = setTimeout(() => {
            (this.toggleIdle(), (this.clickTimer = null));
          }, 350)));
    if ((this.emit("click", t2), t2.defaultPrevented)) return;
    let a2 = false;
    if (s2.closest(".fancybox__content")) {
      if (o2) {
        if (o2.closest("[contenteditable]")) return;
        s2.matches(nt) || o2.blur();
      }
      if (be()) return;
      a2 = this.option("contentClick");
    } else
      s2.closest(".fancybox__carousel") &&
        !s2.matches(nt) &&
        (a2 = this.option("backdropClick"));
    "close" === a2
      ? (t2.preventDefault(), this.close(t2))
      : "next" === a2
        ? (t2.preventDefault(), this.next())
        : "prev" === a2 && (t2.preventDefault(), this.prev());
  }
  onWheel(t2) {
    const e2 = t2.target;
    let n2 = this.option("wheel", t2);
    e2.closest(".fancybox__thumbs") && (n2 = "slide");
    const s2 = "slide" === n2,
      o2 = [-t2.deltaX || 0, -t2.deltaY || 0, -t2.detail || 0].reduce(
        function (t3, e3) {
          return Math.abs(e3) > Math.abs(t3) ? e3 : t3;
        }
      ),
      a2 = Math.max(-1, Math.min(1, o2)),
      r2 = Date.now();
    this.pwt && r2 - this.pwt < 300
      ? s2 && t2.preventDefault()
      : ((this.pwt = r2),
        this.emit("wheel", t2, a2),
        t2.defaultPrevented ||
          ("close" === n2
            ? (t2.preventDefault(), this.close(t2))
            : "slide" === n2 &&
              (i(e2) ||
                (t2.preventDefault(), this[a2 > 0 ? "prev" : "next"]()))));
  }
  onScroll() {
    window.scrollTo(Pe, Ce);
  }
  onKeydown(t2) {
    if (!this.isTopmost()) return;
    this.isCompact ||
      !this.option("idle") ||
      this.isClosing() ||
      this.resetIdle();
    const e2 = t2.key,
      i2 = this.option("keyboard");
    if (!i2) return;
    const n2 = t2.composedPath()[0],
      s2 = document.activeElement && document.activeElement.classList,
      o2 =
        (s2 && s2.contains("f-button")) ||
        n2.dataset.carouselPage ||
        n2.dataset.carouselIndex;
    if ("Escape" !== e2 && !o2 && E(n2)) {
      if (
        n2.isContentEditable ||
        -1 !==
          ["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(
            n2.nodeName
          )
      )
        return;
    }
    if (
      ("Tab" === t2.key ? P(this.container, ae) : S(this.container, ae),
      t2.ctrlKey || t2.altKey || t2.shiftKey)
    )
      return;
    this.emit("keydown", e2, t2);
    const a2 = i2[e2];
    a2 && "function" == typeof this[a2] && (t2.preventDefault(), this[a2]());
  }
  onResize() {
    const t2 = this.container;
    if (!t2) return;
    const e2 = this.isCompact;
    (t2.classList.toggle(le, e2),
      this.manageCaption(this.getSlide()),
      this.isCompact ? this.clearIdle() : this.endIdle(),
      this.scale(),
      this.emit("resize"));
  }
  onFocus(t2) {
    this.isTopmost() && this.checkFocus(t2);
  }
  onMousemove(t2) {
    ((this.prevMouseMoveEvent = t2),
      !this.isCompact && this.option("idle") && this.resetIdle());
  }
  onVisibilityChange() {
    "visible" === document.visibilityState ? this.checkFocus() : this.endIdle();
  }
  manageCloseBtn(t2) {
    const e2 = this.optionFor(t2, "closeButton") || false;
    if ("auto" === e2) {
      const t3 = this.plugins.Toolbar;
      if (t3 && t3.state === Zt.Ready) return;
    }
    if (!e2) return;
    if (!t2.contentEl || t2.closeBtnEl) return;
    const i2 = this.option("tpl.closeButton");
    if (i2) {
      const e3 = n(this.localize(i2));
      ((t2.closeBtnEl = t2.contentEl.appendChild(e3)),
        t2.el && P(t2.el, "has-close-btn"));
    }
  }
  manageCaption(t2 = void 0) {
    var e2, i2;
    const n2 = "fancybox__caption",
      s2 = this.container;
    if (!s2) return;
    S(s2, de);
    const o2 = this.isCompact || this.option("commonCaption"),
      a2 = !o2;
    if (
      (this.caption && this.stop(this.caption),
      a2 && this.caption && (this.caption.remove(), (this.caption = null)),
      o2 && !this.caption)
    )
      for (const t3 of (null === (e2 = this.carousel) || void 0 === e2
        ? void 0
        : e2.slides) || [])
        t3.captionEl &&
          (t3.captionEl.remove(),
          (t3.captionEl = void 0),
          S(t3.el, de),
          null === (i2 = t3.el) ||
            void 0 === i2 ||
            i2.removeAttribute("aria-labelledby"));
    if ((t2 || (t2 = this.getSlide()), !t2 || (o2 && !this.isCurrentSlide(t2))))
      return;
    const r2 = t2.el;
    let l2 = this.optionFor(t2, "caption", "");
    if (!l2)
      return void (
        o2 &&
        this.caption &&
        this.animate(this.caption, "f-fadeOut", () => {
          this.caption && (this.caption.innerHTML = "");
        })
      );
    let c2 = null;
    if (a2) {
      if (((c2 = t2.captionEl || null), r2 && !c2)) {
        const e3 = n2 + `_${this.id}_${t2.index}`;
        ((c2 = document.createElement("div")),
          P(c2, n2),
          c2.setAttribute("id", e3),
          (t2.captionEl = r2.appendChild(c2)),
          P(r2, de),
          r2.setAttribute("aria-labelledby", e3));
      }
    } else {
      if (((c2 = this.caption), c2 || (c2 = s2.querySelector("." + n2)), !c2)) {
        ((c2 = document.createElement("div")),
          (c2.dataset.fancyboxCaption = ""),
          P(c2, n2));
        (this.footer || s2).prepend(c2);
      }
      (P(s2, de), (this.caption = c2));
    }
    c2 &&
      ((c2.innerHTML = ""),
      ve(l2) || "number" == typeof l2
        ? (c2.innerHTML = l2 + "")
        : l2 instanceof HTMLElement && c2.appendChild(l2));
  }
  checkFocus(t2) {
    this.focus(t2);
  }
  focus(t2) {
    var e2;
    if (this.ignoreFocusChange) return;
    const i2 = document.activeElement || null,
      n2 = (null == t2 ? void 0 : t2.target) || null,
      s2 = this.container,
      o2 =
        null === (e2 = this.carousel) || void 0 === e2 ? void 0 : e2.viewport;
    if (!s2 || !o2) return;
    if (!t2 && i2 && s2.contains(i2)) return;
    const a2 = this.getSlide(),
      r2 = a2 && a2.state === lt.Ready ? a2.el : null;
    if (!r2 || r2.contains(i2) || s2 === i2) return;
    (t2 && t2.cancelable && t2.preventDefault(),
      (this.ignoreFocusChange = true));
    const l2 = Array.from(s2.querySelectorAll(nt));
    let c2 = [],
      h2 = null;
    for (let t3 of l2) {
      const e3 = !t3.offsetParent || !!t3.closest('[aria-hidden="true"]'),
        i3 = r2 && r2.contains(t3),
        n3 = !o2.contains(t3);
      if (t3 === s2 || ((i3 || n3) && !e3)) {
        c2.push(t3);
        const e4 = t3.dataset.origTabindex;
        (void 0 !== e4 && e4 && (t3.tabIndex = parseFloat(e4)),
          t3.removeAttribute("data-orig-tabindex"),
          (!t3.hasAttribute("autoFocus") && h2) || (h2 = t3));
      } else {
        const e4 =
          void 0 === t3.dataset.origTabindex
            ? t3.getAttribute("tabindex") || ""
            : t3.dataset.origTabindex;
        (e4 && (t3.dataset.origTabindex = e4), (t3.tabIndex = -1));
      }
    }
    let d2 = null;
    (t2
      ? (!n2 || c2.indexOf(n2) < 0) &&
        ((d2 = h2 || s2),
        c2.length &&
          (i2 === xe
            ? (d2 = c2[0])
            : (this.lastFocus !== s2 && i2 !== we) || (d2 = c2[c2.length - 1])))
      : (d2 = a2 && "image" === a2.type ? s2 : h2 || s2),
      d2 && st(d2),
      (this.lastFocus = document.activeElement),
      (this.ignoreFocusChange = false));
  }
  next() {
    const t2 = this.carousel;
    t2 && t2.pages.length > 1 && t2.slideNext();
  }
  prev() {
    const t2 = this.carousel;
    t2 && t2.pages.length > 1 && t2.slidePrev();
  }
  jumpTo(...t2) {
    this.carousel && this.carousel.slideTo(...t2);
  }
  isTopmost() {
    var t2;
    return (
      (null === (t2 = Oe.getInstance()) || void 0 === t2 ? void 0 : t2.id) ==
      this.id
    );
  }
  animate(t2 = null, e2 = "", i2) {
    if (!t2 || !e2) return void (i2 && i2());
    this.stop(t2);
    const n2 = (s2) => {
      s2.target === t2 &&
        t2.dataset.animationName &&
        (t2.removeEventListener("animationend", n2),
        delete t2.dataset.animationName,
        i2 && i2(),
        S(t2, e2));
    };
    ((t2.dataset.animationName = e2),
      t2.addEventListener("animationend", n2),
      P(t2, e2));
  }
  stop(t2) {
    t2 &&
      t2.dispatchEvent(
        new CustomEvent("animationend", {
          bubbles: false,
          cancelable: true,
          currentTarget: t2,
        })
      );
  }
  setContent(t2, e2 = "", i2 = true) {
    if (this.isClosing()) return;
    const s2 = t2.el;
    if (!s2) return;
    let o2 = null;
    if (
      (E(e2)
        ? (o2 = e2)
        : ((o2 = n(e2 + "")),
          E(o2) ||
            ((o2 = document.createElement("div")), (o2.innerHTML = e2 + ""))),
      ["img", "picture", "iframe", "video", "audio"].includes(
        o2.nodeName.toLowerCase()
      ))
    ) {
      const t3 = document.createElement("div");
      (t3.appendChild(o2), (o2 = t3));
    }
    (E(o2) && t2.filter && !t2.error && (o2 = o2.querySelector(t2.filter)),
      o2 && E(o2)
        ? (P(o2, "fancybox__content"),
          t2.id && o2.setAttribute("id", t2.id),
          s2.classList.add(`has-${t2.error ? "error" : t2.type || "unknown"}`),
          s2.prepend(o2),
          "none" === o2.style.display && (o2.style.display = ""),
          "none" === getComputedStyle(o2).getPropertyValue("display") &&
            (o2.style.display =
              t2.display || this.option("defaultDisplay") || "flex"),
          (t2.contentEl = o2),
          i2 && this.revealContent(t2),
          this.manageCloseBtn(t2),
          this.manageCaption(t2))
        : this.setError(t2, "{{ELEMENT_NOT_FOUND}}"));
  }
  revealContent(t2, e2) {
    const i2 = t2.el,
      n2 = t2.contentEl;
    i2 &&
      n2 &&
      (this.emit("reveal", t2),
      this.hideLoading(t2),
      (t2.state = lt.Opening),
      (e2 = this.isOpeningSlide(t2)
        ? void 0 === e2
          ? this.optionFor(t2, "showClass")
          : e2
        : "f-fadeIn")
        ? this.animate(n2, e2, () => {
            this.done(t2);
          })
        : this.done(t2));
  }
  done(t2) {
    this.isClosing() ||
      ((t2.state = lt.Ready),
      this.emit("done", t2),
      P(t2.el, "is-done"),
      this.isCurrentSlide(t2) &&
        this.option("autoFocus") &&
        queueMicrotask(() => {
          var e2;
          (null === (e2 = t2.panzoom) || void 0 === e2 || e2.updateControls(),
            this.option("autoFocus") && this.focus());
        }),
      this.isOpeningSlide(t2) &&
        (S(this.container, he),
        !this.isCompact && this.option("idle") && this.setIdle()));
  }
  isCurrentSlide(t2) {
    const e2 = this.getSlide();
    return !(!t2 || !e2) && e2.index === t2.index;
  }
  isOpeningSlide(t2) {
    var e2, i2;
    return (
      null ===
        (null === (e2 = this.carousel) || void 0 === e2
          ? void 0
          : e2.prevPage) &&
      t2 &&
      t2.index ===
        (null === (i2 = this.getSlide()) || void 0 === i2 ? void 0 : i2.index)
    );
  }
  showLoading(t2) {
    t2.state = lt.Loading;
    const e2 = t2.el;
    if (!e2) return;
    (P(e2, ce),
      this.emit("loading", t2),
      t2.spinnerEl ||
        setTimeout(() => {
          if (!this.isClosing() && !t2.spinnerEl && t2.state === lt.Loading) {
            let i2 = n(x);
            (P(i2, "fancybox-spinner"),
              (t2.spinnerEl = i2),
              e2.prepend(i2),
              this.animate(i2, "f-fadeIn"));
          }
        }, 250));
  }
  hideLoading(t2) {
    const e2 = t2.el;
    if (!e2) return;
    const i2 = t2.spinnerEl;
    this.isClosing()
      ? null == i2 || i2.remove()
      : (S(e2, ce),
        i2 &&
          this.animate(i2, "f-fadeOut", () => {
            i2.remove();
          }),
        t2.state === lt.Loading &&
          (this.emit("loaded", t2), (t2.state = lt.Ready)));
  }
  setError(t2, e2) {
    if (this.isClosing()) return;
    const i2 = new Event("error", { bubbles: true, cancelable: true });
    if ((this.emit("error", i2, t2), i2.defaultPrevented)) return;
    ((t2.error = e2), this.hideLoading(t2), this.clearContent(t2));
    const n2 = document.createElement("div");
    (n2.classList.add("fancybox-error"),
      (n2.innerHTML = this.localize(e2 || "<p>{{ERROR}}</p>")),
      this.setContent(t2, n2));
  }
  clearContent(t2) {
    if (void 0 === t2.state) return;
    (this.emit("clearContent", t2),
      t2.contentEl && (t2.contentEl.remove(), (t2.contentEl = void 0)));
    const e2 = t2.el;
    (e2 &&
      (S(e2, "has-error"),
      S(e2, "has-unknown"),
      S(e2, `has-${t2.type || "unknown"}`)),
      t2.closeBtnEl && t2.closeBtnEl.remove(),
      (t2.closeBtnEl = void 0),
      t2.captionEl && t2.captionEl.remove(),
      (t2.captionEl = void 0),
      t2.spinnerEl && t2.spinnerEl.remove(),
      (t2.spinnerEl = void 0));
  }
  getSlide() {
    var t2;
    const e2 = this.carousel;
    return (
      (null ===
        (t2 = null == e2 ? void 0 : e2.pages[null == e2 ? void 0 : e2.page]) ||
      void 0 === t2
        ? void 0
        : t2.slides[0]) || void 0
    );
  }
  close(t2, e2) {
    if (this.isClosing()) return;
    const i2 = new Event("shouldClose", { bubbles: true, cancelable: true });
    if ((this.emit("shouldClose", i2, t2), i2.defaultPrevented)) return;
    t2 && t2.cancelable && (t2.preventDefault(), t2.stopPropagation());
    const n2 = () => {
      this.proceedClose(t2, e2);
    };
    this.startedFs && ye && ye.isFullscreen()
      ? Promise.resolve(ye.exit()).then(() => n2())
      : n2();
  }
  clearIdle() {
    (this.idleTimer && clearTimeout(this.idleTimer), (this.idleTimer = null));
  }
  setIdle(t2 = false) {
    const e2 = () => {
      (this.clearIdle(),
        (this.idle = true),
        P(this.container, "is-idle"),
        this.emit("setIdle"));
    };
    if ((this.clearIdle(), !this.isClosing()))
      if (t2) e2();
      else {
        const t3 = this.option("idle");
        t3 && (this.idleTimer = setTimeout(e2, t3));
      }
  }
  endIdle() {
    (this.clearIdle(),
      this.idle &&
        !this.isClosing() &&
        ((this.idle = false),
        S(this.container, "is-idle"),
        this.emit("endIdle")));
  }
  resetIdle() {
    (this.endIdle(), this.setIdle());
  }
  toggleIdle() {
    this.idle ? this.endIdle() : this.setIdle(true);
  }
  toggleFullscreen() {
    ye &&
      (ye.isFullscreen()
        ? ye.exit()
        : ye.request().then(() => {
            this.startedFs = true;
          }));
  }
  isClosing() {
    return [rt.Closing, rt.CustomClosing, rt.Destroy].includes(this.state);
  }
  proceedClose(t2, e2) {
    var i2, n2;
    ((this.state = rt.Closing), this.clearIdle(), this.detachEvents());
    const s2 = this.container,
      o2 = this.carousel,
      a2 = this.getSlide(),
      r2 =
        a2 && this.option("placeFocusBack")
          ? a2.triggerEl || this.option("triggerEl")
          : null;
    if (
      (r2 && (tt(r2) ? st(r2) : r2.focus()),
      s2 &&
        (S(s2, he),
        P(s2, "is-closing"),
        s2.setAttribute(oe, "true"),
        this.option("animated") && P(s2, re),
        (s2.style.pointerEvents = "none")),
      o2)
    ) {
      (o2.clearTransitions(),
        null === (i2 = o2.panzoom) || void 0 === i2 || i2.destroy(),
        null === (n2 = o2.plugins.Navigation) || void 0 === n2 || n2.detach());
      for (const t3 of o2.slides) {
        ((t3.state = lt.Closing), this.hideLoading(t3));
        const e3 = t3.contentEl;
        e3 && this.stop(e3);
        const i3 = null == t3 ? void 0 : t3.panzoom;
        (i3 && (i3.stop(), i3.detachEvents(), i3.detachObserver()),
          this.isCurrentSlide(t3) || o2.emit("removeSlide", t3));
      }
    }
    ((Pe = window.scrollX),
      (Ce = window.scrollY),
      window.addEventListener("scroll", this.onScroll),
      this.emit("close", t2),
      this.state !== rt.CustomClosing
        ? (void 0 === e2 && a2 && (e2 = this.optionFor(a2, "hideClass")),
          e2 && a2
            ? (this.animate(a2.contentEl, e2, () => {
                o2 && o2.emit("removeSlide", a2);
              }),
              setTimeout(() => {
                this.destroy();
              }, 500))
            : this.destroy())
        : setTimeout(() => {
            this.destroy();
          }, 500));
  }
  destroy() {
    var t2;
    if (this.state === rt.Destroy) return;
    (window.removeEventListener("scroll", this.onScroll),
      (this.state = rt.Destroy),
      null === (t2 = this.carousel) || void 0 === t2 || t2.destroy());
    const e2 = this.container;
    (e2 && e2.remove(), Te.delete(this.id));
    const i2 = Oe.getInstance();
    i2
      ? i2.focus()
      : (we && (we.remove(), (we = null)),
        xe && (xe.remove(), (xe = null)),
        S(document.documentElement, ee),
        (() => {
          if (!et) return;
          const t3 = document,
            e3 = t3.body;
          (e3.classList.remove(ie),
            e3.style.setProperty(se, ""),
            t3.documentElement.style.setProperty(ne, ""));
        })(),
        this.emit("destroy"));
  }
  static bind(t2, e2, i2) {
    if (!et) return;
    let n2,
      s2 = "",
      o2 = {};
    if (
      (void 0 === t2
        ? (n2 = document.body)
        : ve(t2)
          ? ((n2 = document.body),
            (s2 = t2),
            "object" == typeof e2 && (o2 = e2 || {}))
          : ((n2 = t2),
            ve(e2) && (s2 = e2),
            "object" == typeof i2 && (o2 = i2 || {})),
      !n2 || !E(n2))
    )
      return;
    s2 = s2 || "[data-fancybox]";
    const a2 = Oe.openers.get(n2) || /* @__PURE__ */ new Map();
    (a2.set(s2, o2),
      Oe.openers.set(n2, a2),
      1 === a2.size && n2.addEventListener("click", Oe.fromEvent));
  }
  static unbind(t2, e2) {
    let i2,
      n2 = "";
    if (
      (ve(t2)
        ? ((i2 = document.body), (n2 = t2))
        : ((i2 = t2), ve(e2) && (n2 = e2)),
      !i2)
    )
      return;
    const s2 = Oe.openers.get(i2);
    (s2 && n2 && s2.delete(n2),
      (n2 && s2) ||
        (Oe.openers.delete(i2), i2.removeEventListener("click", Oe.fromEvent)));
  }
  static destroy() {
    let t2;
    for (; (t2 = Oe.getInstance()); ) t2.destroy();
    for (const t3 of Oe.openers.keys())
      t3.removeEventListener("click", Oe.fromEvent);
    Oe.openers = /* @__PURE__ */ new Map();
  }
  static fromEvent(t2) {
    if (t2.defaultPrevented) return;
    if (t2.button && 0 !== t2.button) return;
    if (t2.ctrlKey || t2.metaKey || t2.shiftKey) return;
    let e2 = t2.composedPath()[0];
    const i2 = e2.closest("[data-fancybox-trigger]");
    if (i2) {
      const t3 = i2.dataset.fancyboxTrigger || "",
        n3 = document.querySelectorAll(`[data-fancybox="${t3}"]`),
        s3 = parseInt(i2.dataset.fancyboxIndex || "", 10) || 0;
      e2 = n3[s3] || e2;
    }
    if (!(e2 && e2 instanceof Element)) return;
    let n2, s2, o2, a2;
    if (
      ([...Oe.openers].reverse().find(
        ([t3, i3]) =>
          !(
            !t3.contains(e2) ||
            ![...i3].reverse().find(([i4, r3]) => {
              let l3 = e2.closest(i4);
              return !!l3 && ((n2 = t3), (s2 = i4), (o2 = l3), (a2 = r3), true);
            })
          )
      ),
      !n2 || !s2 || !o2)
    )
      return;
    ((a2 = a2 || {}), t2.preventDefault(), (e2 = o2));
    let r2 = [],
      l2 = u({}, at, a2);
    ((l2.event = t2), (l2.triggerEl = e2), (l2.delegate = i2));
    const c2 = l2.groupAll,
      h2 = l2.groupAttr,
      d2 = h2 && e2 ? e2.getAttribute(`${h2}`) : "";
    if (
      ((!e2 || d2 || c2) && (r2 = [].slice.call(n2.querySelectorAll(s2))),
      e2 &&
        !c2 &&
        (r2 = d2 ? r2.filter((t3) => t3.getAttribute(`${h2}`) === d2) : [e2]),
      !r2.length)
    )
      return;
    const p2 = Oe.getInstance();
    return p2 && p2.options.triggerEl && r2.indexOf(p2.options.triggerEl) > -1
      ? void 0
      : (e2 && (l2.startIndex = r2.indexOf(e2)), Oe.fromNodes(r2, l2));
  }
  static fromSelector(t2, e2, i2) {
    let n2 = null,
      s2 = "",
      o2 = {};
    if (
      (ve(t2)
        ? ((n2 = document.body),
          (s2 = t2),
          "object" == typeof e2 && (o2 = e2 || {}))
        : t2 instanceof HTMLElement &&
          ve(e2) &&
          ((n2 = t2), (s2 = e2), "object" == typeof i2 && (o2 = i2 || {})),
      !n2 || !s2)
    )
      return false;
    const a2 = Oe.openers.get(n2);
    return (
      !!a2 &&
      ((o2 = u({}, a2.get(s2) || {}, o2)),
      !!o2 && Oe.fromNodes(Array.from(n2.querySelectorAll(s2)), o2))
    );
  }
  static fromNodes(t2, e2) {
    e2 = u({}, at, e2 || {});
    const i2 = [];
    for (const n2 of t2) {
      const t3 = n2.dataset || {},
        s2 =
          t3[me] ||
          n2.getAttribute(ge) ||
          n2.getAttribute("currentSrc") ||
          n2.getAttribute(me) ||
          void 0;
      let o2;
      const a2 = e2.delegate;
      let r2;
      (a2 &&
        i2.length === e2.startIndex &&
        (o2 =
          a2 instanceof HTMLImageElement
            ? a2
            : a2.querySelector("img:not([aria-hidden])")),
        o2 ||
          (o2 =
            n2 instanceof HTMLImageElement
              ? n2
              : n2.querySelector("img:not([aria-hidden])")),
        o2 &&
          ((r2 = o2.currentSrc || o2[me] || void 0),
          !r2 &&
            o2.dataset &&
            (r2 = o2.dataset.lazySrc || o2.dataset[me] || void 0)));
      const l2 = {
        src: s2,
        triggerEl: n2,
        thumbEl: o2,
        thumbElSrc: r2,
        thumbSrc: r2,
      };
      for (const e3 in t3) {
        let i3 = t3[e3] + "";
        ((i3 = "false" !== i3 && ("true" === i3 || i3)), (l2[e3] = i3));
      }
      i2.push(l2);
    }
    return new Oe(i2, e2);
  }
  static getInstance(t2) {
    if (t2) return Te.get(t2);
    return (
      Array.from(Te.values())
        .reverse()
        .find((t3) => !t3.isClosing() && t3) || null
    );
  }
  static getSlide() {
    var t2;
    return (
      (null === (t2 = Oe.getInstance()) || void 0 === t2
        ? void 0
        : t2.getSlide()) || null
    );
  }
  static show(t2 = [], e2 = {}) {
    return new Oe(t2, e2);
  }
  static next() {
    const t2 = Oe.getInstance();
    t2 && t2.next();
  }
  static prev() {
    const t2 = Oe.getInstance();
    t2 && t2.prev();
  }
  static close(t2 = true, ...e2) {
    if (t2) for (const t3 of Te.values()) t3.close(...e2);
    else {
      const t3 = Oe.getInstance();
      t3 && t3.close(...e2);
    }
  }
}
(Object.defineProperty(Oe, "version", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: "5.0.36",
}),
  Object.defineProperty(Oe, "defaults", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: at,
  }),
  Object.defineProperty(Oe, "Plugins", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: te,
  }),
  Object.defineProperty(Oe, "openers", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /* @__PURE__ */ new Map(),
  }));
const fancy = document.querySelectorAll("[data-fancybox]");
if (fancy.length) {
  Oe.bind("[data-fancybox]", {});
}
