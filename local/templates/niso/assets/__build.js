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
	const noExtend = ["__proto__", "constructor", "prototype"];
	Object.keys(src)
		.filter((key) => noExtend.indexOf(key) < 0)
		.forEach((key) => {
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
	CustomEvent: function CustomEvent() {
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
		.filter((c) => !!c.trim());
}
function deleteProps(obj) {
	const object = obj;
	Object.keys(object).forEach((key) => {
		try {
			object[key] = null;
		} catch (e) {}
		try {
			delete object[key];
		} catch (e) {}
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
				.map((a) => a.replace(",", "."))
				.join(", ");
		}
		transformMatrix = new window2.WebKitCSSMatrix(
			curTransform === "none" ? "" : curTransform,
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
function isObject$1(o) {
	return (
		typeof o === "object" &&
		o !== null &&
		o.constructor &&
		Object.prototype.toString.call(o).slice(8, -1) === "Object"
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
	for (let i = 1; i < arguments.length; i += 1) {
		const nextSource = i < 0 || arguments.length <= i ? void 0 : arguments[i];
		if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
			const keysArray = Object.keys(Object(nextSource)).filter(
				(key) => noExtend.indexOf(key) < 0,
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
	const window2 = getWindow();
	const children = [...element.children];
	if (window2.HTMLSlotElement && element instanceof HTMLSlotElement) {
		children.push(...element.assignedElements());
	}
	if (!selector3) {
		return children;
	}
	return children.filter((el) => el.matches(selector3));
}
function elementIsChildOfSlot(el, slot) {
	const elementsQueue = [slot];
	while (elementsQueue.length > 0) {
		const elementToCheck = elementsQueue.shift();
		if (el === elementToCheck) {
			return true;
		}
		elementsQueue.push(
			...elementToCheck.children,
			...(elementToCheck.shadowRoot ? elementToCheck.shadowRoot.children : []),
			...(elementToCheck.assignedElements
				? elementToCheck.assignedElements()
				: []),
		);
	}
}
function elementIsChildOf(el, parent) {
	const window2 = getWindow();
	let isChild = parent.contains(el);
	if (
		!isChild &&
		window2.HTMLSlotElement &&
		parent instanceof HTMLSlotElement
	) {
		const children = [...parent.assignedElements()];
		isChild = children.includes(el);
		if (!isChild) {
			isChild = elementIsChildOfSlot(el, parent);
		}
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
		...(Array.isArray(classes2) ? classes2 : classesToTokens(classes2)),
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
	let i;
	if (child) {
		i = 0;
		while ((child = child.previousSibling) !== null) {
			if (child.nodeType === 1) i += 1;
		}
		return i;
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
	function fireCallBack(e) {
		if (e.target !== el) return;
		callback.call(el, e);
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
					.getPropertyValue(size === "width" ? "margin-right" : "margin-top"),
			) +
			parseFloat(
				window2
					.getComputedStyle(el, null)
					.getPropertyValue(size === "width" ? "margin-left" : "margin-bottom"),
			)
		);
	}
}
function makeElementsArray(el) {
	return (Array.isArray(el) ? el : [el]).filter((e) => !!e);
}
function setInnerHTML(el, html) {
	if (html === void 0) {
		html = "";
	}
	if (typeof trustedTypes !== "undefined") {
		el.innerHTML = trustedTypes
			.createPolicy("html", {
				createHTML: (s) => s,
			})
			.createHTML(html);
	} else {
		el.innerHTML = html;
	}
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
		window2.navigator.userAgent,
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
			for (let i = 0; i < containerParents.length; i += 1) {
				attach(containerParents[i]);
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
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		const method = priority ? "unshift" : "push";
		events2.split(" ").forEach((event) => {
			if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
			self.eventsListeners[event][method](handler);
		});
		return self;
	},
	once(events2, handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		function onceHandler() {
			self.off(events2, onceHandler);
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
			handler.apply(self, args);
		}
		onceHandler.__emitterProxy = handler;
		return self.on(events2, onceHandler, priority);
	},
	onAny(handler, priority) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (typeof handler !== "function") return self;
		const method = priority ? "unshift" : "push";
		if (self.eventsAnyListeners.indexOf(handler) < 0) {
			self.eventsAnyListeners[method](handler);
		}
		return self;
	},
	offAny(handler) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsAnyListeners) return self;
		const index = self.eventsAnyListeners.indexOf(handler);
		if (index >= 0) {
			self.eventsAnyListeners.splice(index, 1);
		}
		return self;
	},
	off(events2, handler) {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsListeners) return self;
		events2.split(" ").forEach((event) => {
			if (typeof handler === "undefined") {
				self.eventsListeners[event] = [];
			} else if (self.eventsListeners[event]) {
				self.eventsListeners[event].forEach((eventHandler, index) => {
					if (
						eventHandler === handler ||
						(eventHandler.__emitterProxy &&
							eventHandler.__emitterProxy === handler)
					) {
						self.eventsListeners[event].splice(index, 1);
					}
				});
			}
		});
		return self;
	},
	emit() {
		const self = this;
		if (!self.eventsListeners || self.destroyed) return self;
		if (!self.eventsListeners) return self;
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
			context3 = self;
		} else {
			events2 = args[0].events;
			data = args[0].data;
			context3 = args[0].context || self;
		}
		data.unshift(context3);
		const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
		eventsArray.forEach((event) => {
			if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
				self.eventsAnyListeners.forEach((eventHandler) => {
					eventHandler.apply(context3, [event, ...data]);
				});
			}
			if (self.eventsListeners && self.eventsListeners[event]) {
				self.eventsListeners[event].forEach((eventHandler) => {
					eventHandler.apply(context3, data);
				});
			}
		});
		return self;
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
			node.getPropertyValue(swiper.getDirectionLabel(label)) || 0,
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
		`.${swiper.params.slideClass}, swiper-slide`,
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
	for (let i = 0; i < slidesLength; i += 1) {
		slideSize = 0;
		let slide2;
		if (slides[i]) slide2 = slides[i];
		if (gridEnabled) {
			swiper.grid.updateSlide(i, slide2, slides);
		}
		if (slides[i] && elementStyle(slide2, "display") === "none") continue;
		if (params.slidesPerView === "auto") {
			if (shouldResetSlideSize) {
				slides[i].style[swiper.getDirectionLabel("width")] = ``;
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
					"padding-left",
				);
				const paddingRight = getDirectionPropertyValue(
					slideStyles,
					"padding-right",
				);
				const marginLeft = getDirectionPropertyValue(
					slideStyles,
					"margin-left",
				);
				const marginRight = getDirectionPropertyValue(
					slideStyles,
					"margin-right",
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
			if (slides[i]) {
				slides[i].style[swiper.getDirectionLabel("width")] = `${slideSize}px`;
			}
		}
		if (slides[i]) {
			slides[i].swiperSlideSize = slideSize;
		}
		slidesSizesGrid.push(slideSize);
		if (params.centeredSlides) {
			slidePosition =
				slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
			if (prevSlideSize === 0 && i !== 0)
				slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
			if (i === 0)
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
		wrapperEl.style[swiper.getDirectionLabel("width")] = `${
			swiper.virtualSize + spaceBetween
		}px`;
	}
	if (gridEnabled) {
		swiper.grid.updateWrapperSize(slideSize, snapGrid);
	}
	if (!params.centeredSlides) {
		const newSlidesGrid = [];
		for (let i = 0; i < snapGrid.length; i += 1) {
			let slidesGridItem = snapGrid[i];
			if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);
			if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
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
					params.slidesPerGroup,
			);
			const groupSize = size * params.slidesPerGroup;
			for (let i = 0; i < groups; i += 1) {
				snapGrid.push(snapGrid[snapGrid.length - 1] + groupSize);
			}
		}
		for (
			let i = 0;
			i < swiper.virtual.slidesBefore + swiper.virtual.slidesAfter;
			i += 1
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
			.filter((_, slideIndex) => {
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
			`${-snapGrid[0]}px`,
		);
		setCSSProperty(
			wrapperEl,
			"--swiper-centered-offset-after",
			`${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`,
		);
		const addToSnapGrid = -swiper.snapGrid[0];
		const addToSlidesGrid = -swiper.slidesGrid[0];
		swiper.snapGrid = swiper.snapGrid.map((v) => v + addToSnapGrid);
		swiper.slidesGrid = swiper.slidesGrid.map((v) => v + addToSlidesGrid);
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
	let i;
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
			for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
				const index = swiper.activeIndex + i;
				if (index > swiper.slides.length && !isVirtual) break;
				activeSlides.push(getSlideByIndex(index));
			}
		}
	} else {
		activeSlides.push(getSlideByIndex(swiper.activeIndex));
	}
	for (i = 0; i < activeSlides.length; i += 1) {
		if (typeof activeSlides[i] !== "undefined") {
			const height = activeSlides[i].offsetHeight;
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
	for (let i = 0; i < slides.length; i += 1) {
		slides[i].swiperSlideOffset =
			(swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop) -
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
	for (let i = 0; i < slides.length; i += 1) {
		const slide2 = slides[i];
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
		const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
		const isFullyVisible =
			slideBefore >= 0 &&
			slideBefore <= swiper.size - swiper.slidesSizesGrid[i];
		const isVisible =
			(slideBefore >= 0 && slideBefore < swiper.size - 1) ||
			(slideAfter > 1 && slideAfter <= swiper.size) ||
			(slideBefore <= 0 && slideAfter >= swiper.size);
		if (isVisible) {
			swiper.visibleSlides.push(slide2);
			swiper.visibleSlidesIndexes.push(i);
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
			`.${params.slideClass}${selector3}, swiper-slide${selector3}`,
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
				`[data-swiper-slide-index="${slideIndex}"]`,
			);
		} else {
			activeSlide = getFilteredSlide(
				`[data-swiper-slide-index="${activeIndex}"]`,
			);
		}
	} else {
		if (gridEnabled) {
			activeSlide = slides.find((slideEl) => slideEl.column === activeIndex);
			nextSlide = slides.find((slideEl) => slideEl.column === activeIndex + 1);
			prevSlide = slides.find((slideEl) => slideEl.column === activeIndex - 1);
		} else {
			activeSlide = slides[activeIndex];
		}
	}
	if (activeSlide) {
		if (!gridEnabled) {
			nextSlide = elementNextAll(
				activeSlide,
				`.${params.slideClass}, swiper-slide`,
			)[0];
			if (params.loop && !nextSlide) {
				nextSlide = slides[0];
			}
			prevSlide = elementPrevAll(
				activeSlide,
				`.${params.slideClass}, swiper-slide`,
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
			params.slideActiveClass,
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
					`.${swiper.params.lazyPreloaderClass}`,
				);
			} else {
				requestAnimationFrame(() => {
					if (slideEl.shadowRoot) {
						lazyEl = slideEl.shadowRoot.querySelector(
							`.${swiper.params.lazyPreloaderClass}`,
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
			}).map((_, i) => {
				return activeColumn + slidesPerView + i;
			}),
		);
		swiper.slides.forEach((slideEl, i) => {
			if (preloadColumns.includes(slideEl.column)) unlazy(swiper, i);
		});
		return;
	}
	const slideIndexLastInView = activeIndex + slidesPerView - 1;
	if (swiper.params.rewind || swiper.params.loop) {
		for (
			let i = activeIndex - amount;
			i <= slideIndexLastInView + amount;
			i += 1
		) {
			const realIndex = ((i % len) + len) % len;
			if (realIndex < activeIndex || realIndex > slideIndexLastInView)
				unlazy(swiper, realIndex);
		}
	} else {
		for (
			let i = Math.max(activeIndex - amount, 0);
			i <= Math.min(slideIndexLastInView + amount, len - 1);
			i += 1
		) {
			if (i !== activeIndex && (i > slideIndexLastInView || i < activeIndex)) {
				unlazy(swiper, i);
			}
		}
	}
};
function getActiveIndexByTranslate(swiper) {
	const { slidesGrid, params } = swiper;
	const translate2 = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
	let activeIndex;
	for (let i = 0; i < slidesGrid.length; i += 1) {
		if (typeof slidesGrid[i + 1] !== "undefined") {
			if (
				translate2 >= slidesGrid[i] &&
				translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2
			) {
				activeIndex = i;
			} else if (
				translate2 >= slidesGrid[i] &&
				translate2 < slidesGrid[i + 1]
			) {
				activeIndex = i + 1;
			}
		} else if (translate2 >= slidesGrid[i]) {
			activeIndex = i;
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
		const firstSlideInColumn = swiper.slides.find(
			(slideEl) => slideEl.column === activeIndex,
		);
		let activeSlideIndex = parseInt(
			firstSlideInColumn.getAttribute("data-swiper-slide-index"),
			10,
		);
		if (Number.isNaN(activeSlideIndex)) {
			activeSlideIndex = Math.max(swiper.slides.indexOf(firstSlideInColumn), 0);
		}
		realIndex = Math.floor(activeSlideIndex / params.grid.rows);
	} else if (swiper.slides[activeIndex]) {
		const slideIndex = swiper.slides[activeIndex].getAttribute(
			"data-swiper-slide-index",
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
		for (let i = 0; i < swiper.slides.length; i += 1) {
			if (swiper.slides[i] === slide2) {
				slideFound = true;
				slideIndex = i;
				break;
			}
		}
	}
	if (slide2 && slideFound) {
		swiper.clickedSlide = slide2;
		if (swiper.virtual && swiper.params.virtual.enabled) {
			swiper.clickedIndex = parseInt(
				slide2.getAttribute("data-swiper-slide-index"),
				10,
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
	let x = 0;
	let y = 0;
	const z = 0;
	if (swiper.isHorizontal()) {
		x = rtl ? -translate2 : translate2;
	} else {
		y = translate2;
	}
	if (params.roundLengths) {
		x = Math.floor(x);
		y = Math.floor(y);
	}
	swiper.previousTranslate = swiper.translate;
	swiper.translate = swiper.isHorizontal() ? x : y;
	if (params.cssMode) {
		wrapperEl[swiper.isHorizontal() ? "scrollLeft" : "scrollTop"] =
			swiper.isHorizontal() ? -x : -y;
	} else if (!params.virtualTranslate) {
		if (swiper.isHorizontal()) {
			x -= swiper.cssOverflowAdjustment();
		} else {
			y -= swiper.cssOverflowAdjustment();
		}
		wrapperEl.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
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
	internal,
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
				swiper.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
					if (!swiper || swiper.destroyed) return;
					if (e.target !== this) return;
					swiper.wrapperEl.removeEventListener(
						"transitionend",
						swiper.onTranslateToWrapperTransitionEnd,
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
				swiper.onTranslateToWrapperTransitionEnd,
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
	if (runCallbacks && dir === "reset") {
		swiper.emit(`slideResetTransition${step}`);
	} else if (runCallbacks && activeIndex !== previousIndex) {
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
		for (let i = 0; i < slidesGrid.length; i += 1) {
			const normalizedTranslate = -Math.floor(translate2 * 100);
			const normalizedGrid = Math.floor(slidesGrid[i] * 100);
			const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
			if (typeof slidesGrid[i + 1] !== "undefined") {
				if (
					normalizedTranslate >= normalizedGrid &&
					normalizedTranslate <
						normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2
				) {
					slideIndex = i;
				} else if (
					normalizedTranslate >= normalizedGrid &&
					normalizedTranslate < normalizedGridNext
				) {
					slideIndex = i + 1;
				}
			} else if (normalizedTranslate >= normalizedGrid) {
				slideIndex = i;
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
		const t = rtl ? translate2 : -translate2;
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
					wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
				});
			} else {
				wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
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
					targetPosition: t,
					side: isH ? "left" : "top",
				});
				return true;
			}
			wrapperEl.scrollTo({
				[isH ? "left" : "top"]: t,
				behavior: "smooth",
			});
		}
		return true;
	}
	const browser2 = getBrowser();
	const isSafari = browser2.isSafari;
	if (isVirtual && !initial && isSafari && swiper.isElement) {
		swiper.virtual.update(false, false, slideIndex);
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
			swiper.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
				if (!swiper || swiper.destroyed) return;
				if (e.target !== this) return;
				swiper.wrapperEl.removeEventListener(
					"transitionend",
					swiper.onSlideToWrapperTransitionEnd,
				);
				swiper.onSlideToWrapperTransitionEnd = null;
				delete swiper.onSlideToWrapperTransitionEnd;
				swiper.transitionEnd(runCallbacks, direction);
			};
		}
		swiper.wrapperEl.addEventListener(
			"transitionend",
			swiper.onSlideToWrapperTransitionEnd,
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
				targetSlideIndex = swiper.slides.find(
					(slideEl) =>
						slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex,
				).column;
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
				newIndex = swiper.slides.find(
					(slideEl) =>
						slideEl.getAttribute("data-swiper-slide-index") * 1 === slideIndex,
				).column;
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
					internal,
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
		internal,
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
	const isFreeMode = params.freeMode && params.freeMode.enabled;
	let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
	if (typeof prevSnap === "undefined" && (params.cssMode || isFreeMode)) {
		let prevSnapIndex;
		snapGrid.forEach((snap3, snapIndex) => {
			if (normalizedTranslate >= snap3) {
				prevSnapIndex = snapIndex;
			}
		});
		if (typeof prevSnapIndex !== "undefined") {
			prevSnap = isFreeMode
				? snapGrid[prevSnapIndex]
				: snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
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
			10,
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
						`${slideSelector}[data-swiper-slide-index="${realIndex}"]`,
					)[0],
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
					`${slideSelector}[data-swiper-slide-index="${realIndex}"]`,
				)[0],
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
function loopCreate(slideRealIndex, initial) {
	const swiper = this;
	const { params, slidesEl } = swiper;
	if (!params.loop || (swiper.virtual && swiper.params.virtual.enabled)) return;
	const initSlides = () => {
		const slides = elementChildren(
			slidesEl,
			`.${params.slideClass}, swiper-slide`,
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
		for (let i = 0; i < amountOfSlides; i += 1) {
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
				"Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)",
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
				"Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)",
			);
		}
		initSlides();
	} else {
		initSlides();
	}
	swiper.loopFix({
		slideRealIndex,
		direction: params.centeredSlides ? void 0 : "next",
		initial,
	});
}
function loopFix(_temp) {
	let {
		slideRealIndex,
		slideTo: slideTo2 = true,
		direction,
		setTranslate: setTranslate2,
		activeSlideIndex,
		initial,
		byController,
		byMousewheel,
	} = _temp === void 0 ? {} : _temp;
	const swiper = this;
	if (!swiper.params.loop) return;
	swiper.emit("beforeLoopFix");
	const { slides, allowSlidePrev, allowSlideNext, slidesEl, params } = swiper;
	const { centeredSlides, initialSlide } = params;
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
					true,
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
	if (
		slides.length < slidesPerView + loopedSlides ||
		(swiper.params.effect === "cards" &&
			slides.length < slidesPerView + loopedSlides * 2)
	) {
		showWarning(
			"Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters",
		);
	} else if (gridEnabled && params.grid.fill === "row") {
		showWarning(
			"Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`",
		);
	}
	const prependSlidesIndexes = [];
	const appendSlidesIndexes = [];
	const cols = gridEnabled
		? Math.ceil(slides.length / params.grid.rows)
		: slides.length;
	const isInitialOverflow =
		initial && cols - initialSlide < slidesPerView && !centeredSlides;
	let activeIndex = isInitialOverflow ? initialSlide : swiper.activeIndex;
	if (typeof activeSlideIndex === "undefined") {
		activeSlideIndex = swiper.getSlideIndex(
			slides.find((el) => el.classList.contains(params.slideActiveClass)),
		);
	} else {
		activeIndex = activeSlideIndex;
	}
	const isNext = direction === "next" || !direction;
	const isPrev = direction === "prev" || !direction;
	let slidesPrepended = 0;
	let slidesAppended = 0;
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
			slidesPerGroup,
		);
		for (let i = 0; i < loopedSlides - activeColIndexWithShift; i += 1) {
			const index = i - Math.floor(i / cols) * cols;
			if (gridEnabled) {
				const colIndexToPrepend = cols - index - 1;
				for (let i2 = slides.length - 1; i2 >= 0; i2 -= 1) {
					if (slides[i2].column === colIndexToPrepend)
						prependSlidesIndexes.push(i2);
				}
			} else {
				prependSlidesIndexes.push(cols - index - 1);
			}
		}
	} else if (activeColIndexWithShift + slidesPerView > cols - loopedSlides) {
		slidesAppended = Math.max(
			activeColIndexWithShift - (cols - loopedSlides * 2),
			slidesPerGroup,
		);
		if (isInitialOverflow) {
			slidesAppended = Math.max(
				slidesAppended,
				slidesPerView - cols + initialSlide + 1,
			);
		}
		for (let i = 0; i < slidesAppended; i += 1) {
			const index = i - Math.floor(i / cols) * cols;
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
	if (
		swiper.params.effect === "cards" &&
		slides.length < slidesPerView + loopedSlides * 2
	) {
		if (appendSlidesIndexes.includes(activeSlideIndex)) {
			appendSlidesIndexes.splice(
				appendSlidesIndexes.indexOf(activeSlideIndex),
				1,
			);
		}
		if (prependSlidesIndexes.includes(activeSlideIndex)) {
			prependSlidesIndexes.splice(
				prependSlidesIndexes.indexOf(activeSlideIndex),
				1,
			);
		}
	}
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
						true,
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
			swiper.controller.control.forEach((c) => {
				if (!c.destroyed && c.params.loop)
					c.loopFix({
						...loopParams,
						slideTo:
							c.params.slidesPerView === params.slidesPerView
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
	if (
		!params.loop ||
		!slidesEl ||
		(swiper.virtual && swiper.params.virtual.enabled)
	)
		return;
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
	let e = event;
	if (e.originalEvent) e = e.originalEvent;
	const data = swiper.touchEventsData;
	if (e.type === "pointerdown") {
		if (data.pointerId !== null && data.pointerId !== e.pointerId) {
			return;
		}
		data.pointerId = e.pointerId;
	} else if (e.type === "touchstart" && e.targetTouches.length === 1) {
		data.touchId = e.targetTouches[0].identifier;
	}
	if (e.type === "touchstart") {
		preventEdgeSwipe(swiper, e, e.targetTouches[0].pageX);
		return;
	}
	const { params, touches, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && e.pointerType === "mouse") return;
	if (swiper.animating && params.preventInteractionOnTransition) {
		return;
	}
	if (!swiper.animating && params.cssMode && params.loop) {
		swiper.loopFix();
	}
	let targetEl = e.target;
	if (params.touchEventsTarget === "wrapper") {
		if (!elementIsChildOf(targetEl, swiper.wrapperEl)) return;
	}
	if ("which" in e && e.which === 3) return;
	if ("button" in e && e.button > 0) return;
	if (data.isTouched && data.isMoved) return;
	const swipingClassHasValue =
		!!params.noSwipingClass && params.noSwipingClass !== "";
	const eventPath = e.composedPath ? e.composedPath() : e.path;
	if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
		targetEl = eventPath[0];
	}
	const noSwipingSelector = params.noSwipingSelector
		? params.noSwipingSelector
		: `.${params.noSwipingClass}`;
	const isTargetShadow = !!(e.target && e.target.shadowRoot);
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
	touches.currentX = e.pageX;
	touches.currentY = e.pageY;
	const startX = touches.currentX;
	const startY = touches.currentY;
	if (!preventEdgeSwipe(swiper, e, startX)) {
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
		(e.pointerType === "mouse" ||
			(e.pointerType !== "mouse" && !targetEl.matches(data.focusableElements)))
	) {
		document2.activeElement.blur();
	}
	const shouldPreventDefault =
		preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;
	if (
		(params.touchStartForcePreventDefault || shouldPreventDefault) &&
		!targetEl.isContentEditable
	) {
		e.preventDefault();
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
	swiper.emit("touchStart", e);
}
function onTouchMove(event) {
	const document2 = getDocument();
	const swiper = this;
	const data = swiper.touchEventsData;
	const { params, touches, rtlTranslate: rtl, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && event.pointerType === "mouse") return;
	let e = event;
	if (e.originalEvent) e = e.originalEvent;
	if (e.type === "pointermove") {
		if (data.touchId !== null) return;
		const id = e.pointerId;
		if (id !== data.pointerId) return;
	}
	let targetTouch;
	if (e.type === "touchmove") {
		targetTouch = [...e.changedTouches].find(
			(t) => t.identifier === data.touchId,
		);
		if (!targetTouch || targetTouch.identifier !== data.touchId) return;
	} else {
		targetTouch = e;
	}
	if (!data.isTouched) {
		if (data.startMoving && data.isScrolling) {
			swiper.emit("touchMoveOpposite", e);
		}
		return;
	}
	const pageX = targetTouch.pageX;
	const pageY = targetTouch.pageY;
	if (e.preventedByNestedSwiper) {
		touches.startX = pageX;
		touches.startY = pageY;
		return;
	}
	if (!swiper.allowTouchMove) {
		if (!e.target.matches(data.focusableElements)) {
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
			rtl &&
			((pageX > touches.startX && -swiper.translate <= swiper.maxTranslate()) ||
				(pageX < touches.startX && -swiper.translate >= swiper.minTranslate()))
		) {
			return;
		} else if (
			!rtl &&
			((pageX < touches.startX && swiper.translate <= swiper.maxTranslate()) ||
				(pageX > touches.startX && swiper.translate >= swiper.minTranslate()))
		) {
			return;
		}
	}
	if (
		document2.activeElement &&
		document2.activeElement.matches(data.focusableElements) &&
		document2.activeElement !== e.target &&
		e.pointerType !== "mouse"
	) {
		document2.activeElement.blur();
	}
	if (document2.activeElement) {
		if (
			e.target === document2.activeElement &&
			e.target.matches(data.focusableElements)
		) {
			data.isMoved = true;
			swiper.allowClick = false;
			return;
		}
	}
	if (data.allowTouchCallbacks) {
		swiper.emit("touchMove", e);
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
		swiper.emit("touchMoveOpposite", e);
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
		(e.type === "touchmove" && data.preventTouchMoveFromPointerMove)
	) {
		data.isTouched = false;
		return;
	}
	if (!data.startMoving) {
		return;
	}
	swiper.allowClick = false;
	if (!params.cssMode && e.cancelable) {
		e.preventDefault();
	}
	if (params.touchMoveStopPropagation && !params.nested) {
		e.stopPropagation();
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
		swiper.emit("sliderFirstMove", e);
	}
	/* @__PURE__ */ new Date().getTime();
	if (
		params._loopSwapReset !== false &&
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
	swiper.emit("sliderMove", e);
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
			true &&
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
			true &&
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
		e.preventedByNestedSwiper = true;
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
	let e = event;
	if (e.originalEvent) e = e.originalEvent;
	let targetTouch;
	const isTouchEvent = e.type === "touchend" || e.type === "touchcancel";
	if (!isTouchEvent) {
		if (data.touchId !== null) return;
		if (e.pointerId !== data.pointerId) return;
		targetTouch = e;
	} else {
		targetTouch = [...e.changedTouches].find(
			(t) => t.identifier === data.touchId,
		);
		if (!targetTouch || targetTouch.identifier !== data.touchId) return;
	}
	if (
		["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(
			e.type,
		)
	) {
		const proceed =
			["pointercancel", "contextmenu"].includes(e.type) &&
			(swiper.browser.isSafari || swiper.browser.isWebView);
		if (!proceed) {
			return;
		}
	}
	data.pointerId = null;
	data.touchId = null;
	const { params, touches, rtlTranslate: rtl, slidesGrid, enabled } = swiper;
	if (!enabled) return;
	if (!params.simulateTouch && e.pointerType === "mouse") return;
	if (data.allowTouchCallbacks) {
		swiper.emit("touchEnd", e);
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
		const pathTree = e.path || (e.composedPath && e.composedPath());
		swiper.updateClickedSlide((pathTree && pathTree[0]) || e.target, pathTree);
		swiper.emit("tap click", e);
		if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
			swiper.emit("doubleTap doubleClick", e);
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
		let i = 0;
		i < slidesGrid.length;
		i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup
	) {
		const increment2 =
			i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
		if (typeof slidesGrid[i + increment2] !== "undefined") {
			if (
				swipeToLast ||
				(currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2])
			) {
				stopIndex = i;
				groupSize = slidesGrid[i + increment2] - slidesGrid[i];
			}
		} else if (swipeToLast || currentPos >= slidesGrid[i]) {
			stopIndex = i;
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
						: stopIndex + increment,
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
			(e.target === swiper.navigation.nextEl ||
				e.target === swiper.navigation.prevEl);
		if (!isNavButtonTarget) {
			if (swiper.swipeDirection === "next") {
				swiper.slideTo(
					rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment,
				);
			}
			if (swiper.swipeDirection === "prev") {
				swiper.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
			}
		} else if (e.target === swiper.navigation.nextEl) {
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
function onClick(e) {
	const swiper = this;
	if (!swiper.enabled) return;
	if (!swiper.allowClick) {
		if (swiper.params.preventClicks) e.preventDefault();
		if (swiper.params.preventClicksPropagation && swiper.animating) {
			e.stopPropagation();
			e.stopImmediatePropagation();
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
function onLoad(e) {
	const swiper = this;
	processLazyPreloader(swiper, e.target);
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
			true,
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
	const document2 = getDocument();
	const breakpointsBase =
		params.breakpointsBase === "window" || !params.breakpointsBase
			? params.breakpointsBase
			: "container";
	const breakpointContainer =
		["window", "container"].includes(params.breakpointsBase) ||
		!params.breakpointsBase
			? swiper.el
			: document2.querySelector(params.breakpointsBase);
	const breakpoint = swiper.getBreakpoint(
		breakpoints2,
		breakpointsBase,
		breakpointContainer,
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
			`${params.containerModifierClass}grid-column`,
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
	points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
	for (let i = 0; i < points.length; i += 1) {
		const { point, value } = points[i];
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
		params.containerModifierClass,
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
			`.${params.slideClass}, swiper-slide`,
		);
		const firstSlideIndex = elementIndex(slides[0]);
		return elementIndex(slideEl) - firstSlideIndex;
	}
	getSlideIndexByData(index) {
		return this.getSlideIndex(
			this.slides.find(
				(slideEl) =>
					slideEl.getAttribute("data-swiper-slide-index") * 1 === index,
			),
		);
	}
	recalcSlides() {
		const swiper = this;
		const { slidesEl, params } = swiper;
		swiper.slides = elementChildren(
			slidesEl,
			`.${params.slideClass}, swiper-slide`,
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
			for (let i = activeIndex + 1; i < slides.length; i += 1) {
				if (slides[i] && !breakLoop) {
					slideSize += Math.ceil(slides[i].swiperSlideSize);
					spv += 1;
					if (slideSize > swiperSize) breakLoop = true;
				}
			}
			for (let i = activeIndex - 1; i >= 0; i -= 1) {
				if (slides[i] && !breakLoop) {
					slideSize += slides[i].swiperSlideSize;
					spv += 1;
					if (slideSize > swiperSize) breakLoop = true;
				}
			}
		} else {
			if (view === "current") {
				for (let i = activeIndex + 1; i < slides.length; i += 1) {
					const slideInView = exact
						? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] <
						  swiperSize
						: slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
					if (slideInView) {
						spv += 1;
					}
				}
			} else {
				for (let i = activeIndex - 1; i >= 0; i -= 1) {
					const slideInView =
						slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
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
				swiper.minTranslate(),
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
			`${swiper.params.containerModifierClass}${currentDirection}`,
		);
		swiper.el.classList.add(
			`${swiper.params.containerModifierClass}${newDirection}`,
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
			return `.${(swiper.params.wrapperClass || "")
				.trim()
				.split(" ")
				.join(".")}`;
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
				true,
			);
		} else {
			swiper.slideTo(
				swiper.params.initialSlide,
				0,
				swiper.params.runCallbacksOnInit,
				false,
				true,
			);
		}
		if (swiper.params.loop) {
			swiper.loopCreate(void 0, true);
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
				imageEl.addEventListener("load", (e) => {
					processLazyPreloader(swiper, e.target);
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
						params.slidePrevClass,
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
			module.forEach((m) => Swiper.installModule(m));
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
					...params.disabledClass.split(" "),
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
	function onPrevClick(e) {
		e.preventDefault();
		if (swiper.isBeginning && !swiper.params.loop && !swiper.params.rewind)
			return;
		swiper.slidePrev();
		emit("navigationPrev");
	}
	function onNextClick(e) {
		e.preventDefault();
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
			},
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
					dir === "next" ? onNextClick : onPrevClick,
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
				dir === "next" ? onNextClick : onPrevClick,
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
	on("click", (_s, e) => {
		let { nextEl, prevEl } = swiper.navigation;
		nextEl = makeElementsArray(nextEl);
		prevEl = makeElementsArray(prevEl);
		const targetEl = e.target;
		let targetIsButton = prevEl.includes(targetEl) || nextEl.includes(targetEl);
		if (swiper.isElement && !targetIsButton) {
			const path = e.path || (e.composedPath && e.composedPath());
			if (path) {
				targetIsButton = path.find(
					(pathEl) => nextEl.includes(pathEl) || prevEl.includes(pathEl),
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
					swiper.params.navigation.hiddenClass,
				);
			} else if (prevEl.length) {
				isHidden = prevEl[0].classList.contains(
					swiper.params.navigation.hiddenClass,
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
					el.classList.toggle(swiper.params.navigation.hiddenClass),
				);
		}
	});
	const enable = () => {
		swiper.el.classList.remove(
			...swiper.params.navigation.navigationDisabledClass.split(" "),
		);
		init4();
		update2();
	};
	const disable = () => {
		swiper.el.classList.add(
			...swiper.params.navigation.navigationDisabledClass.split(" "),
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
	function onBulletClick(e) {
		const bulletEl = e.target.closest(
			classesToSelector(swiper.params.pagination.bulletClass),
		);
		if (!bulletEl) {
			return;
		}
		e.preventDefault();
		const index = elementIndex(bulletEl) * swiper.params.slidesPerGroup;
		if (swiper.params.loop) {
			if (swiper.realIndex === index) return;
			const moveDirection = getMoveDirection(
				swiper.realIndex,
				index,
				swiper.slides.length,
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
					swiper.isHorizontal() ? "width" : "height",
				);
				el.forEach((subEl) => {
					subEl.style[swiper.isHorizontal() ? "width" : "height"] = `${
						bulletSize * (params.dynamicMainBullets + 4)
					}px`;
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
						(suffix) => `${params.bulletActiveClass}${suffix}`,
					),
				]
					.map((s) =>
						typeof s === "string" && s.includes(" ") ? s.split(" ") : s,
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
								...`${params.bulletActiveClass}-main`.split(" "),
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
							bulletIndex === current ? "bullet-active" : "bullet",
						);
					});
				}
				if (params.dynamicBullets) {
					const firstDisplayedBullet = bullets[firstIndex];
					const lastDisplayedBullet = bullets[lastIndex];
					for (let i = firstIndex; i <= lastIndex; i += 1) {
						if (bullets[i]) {
							bullets[i].classList.add(
								...`${params.bulletActiveClass}-main`.split(" "),
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
					params.dynamicMainBullets + 4,
				);
				const bulletsOffset =
					(bulletSize * dynamicBulletsLength - bulletSize) / 2 -
					midIndex * bulletSize;
				const offsetProp = rtl ? "right" : "left";
				bullets.forEach((bullet) => {
					bullet.style[
						swiper.isHorizontal() ? offsetProp : "top"
					] = `${bulletsOffset}px`;
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
				setInnerHTML(subEl, params.renderCustom(swiper, current + 1, total));
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
			for (let i = 0; i < numberOfBullets; i += 1) {
				if (params.renderBullet) {
					paginationHTML += params.renderBullet.call(
						swiper,
						i,
						params.bulletClass,
					);
				} else {
					paginationHTML += `<${params.bulletElement} ${
						swiper.isElement ? 'part="bullet"' : ""
					} class="${params.bulletClass}"></${params.bulletElement}>`;
				}
			}
		}
		if (params.type === "fraction") {
			if (params.renderFraction) {
				paginationHTML = params.renderFraction.call(
					swiper,
					params.currentClass,
					params.totalClass,
				);
			} else {
				paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
			}
		}
		if (params.type === "progressbar") {
			if (params.renderProgressbar) {
				paginationHTML = params.renderProgressbar.call(
					swiper,
					params.progressbarFillClass,
				);
			} else {
				paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
			}
		}
		swiper.pagination.bullets = [];
		el.forEach((subEl) => {
			if (params.type !== "custom") {
				setInnerHTML(subEl, paginationHTML || "");
			}
			if (params.type === "bullets") {
				swiper.pagination.bullets.push(
					...subEl.querySelectorAll(classesToSelector(params.bulletClass)),
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
			},
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
				el = el.find((subEl) => {
					if (elementParents(subEl, ".swiper")[0] !== swiper.el) return false;
					return true;
				});
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
				swiper.isHorizontal() ? params.horizontalClass : params.verticalClass,
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
					swiper.isHorizontal() ? params.horizontalClass : params.verticalClass,
				);
				if (params.clickable) {
					subEl.classList.remove(...(params.clickableClass || "").split(" "));
					subEl.removeEventListener("click", onBulletClick);
				}
			});
		}
		if (swiper.pagination.bullets)
			swiper.pagination.bullets.forEach((subEl) =>
				subEl.classList.remove(...params.bulletActiveClass.split(" ")),
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
				swiper.isHorizontal() ? params.horizontalClass : params.verticalClass,
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
					swiper.params.pagination.lockClass,
				),
			);
		}
	});
	on("lock unlock", () => {
		update2();
	});
	on("click", (_s, e) => {
		const targetEl = e.target;
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
				swiper.params.pagination.hiddenClass,
			);
			if (isHidden === true) {
				emit("paginationShow");
			} else {
				emit("paginationHide");
			}
			el.forEach((subEl) =>
				subEl.classList.toggle(swiper.params.pagination.hiddenClass),
			);
		}
	});
	const enable = () => {
		swiper.el.classList.remove(
			swiper.params.pagination.paginationDisabledClass,
		);
		let { el } = swiper.pagination;
		if (el) {
			el = makeElementsArray(el);
			el.forEach((subEl) =>
				subEl.classList.remove(
					swiper.params.pagination.paginationDisabledClass,
				),
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
				subEl.classList.add(swiper.params.pagination.paginationDisabledClass),
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
	function onTransitionEnd(e) {
		if (!swiper || swiper.destroyed || !swiper.wrapperEl) return;
		if (e.target !== swiper.wrapperEl) return;
		swiper.wrapperEl.removeEventListener("transitionend", onTransitionEnd);
		if (pausedByPointerEnter || (e.detail && e.detail.bySwiperTouchMove)) {
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
			activeSlideEl = swiper.slides.find((slideEl) =>
				slideEl.classList.contains("swiper-slide-active"),
			);
		} else {
			activeSlideEl = swiper.slides[swiper.activeIndex];
		}
		if (!activeSlideEl) return void 0;
		const currentSlideDelay = parseInt(
			activeSlideEl.getAttribute("data-swiper-autoplay"),
			10,
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
			delay - (/* @__PURE__ */ new Date().getTime() - autoplayStartTime);
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
	const onPointerEnter = (e) => {
		if (e.pointerType !== "mouse") return;
		pausedByInteraction = true;
		pausedByPointerEnter = true;
		if (swiper.animating || swiper.autoplay.paused) return;
		pause(true);
	};
	const onPointerLeave = (e) => {
		if (e.pointerType !== "mouse") return;
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
				swiper.params.thumbs.slideThumbActiveClass,
			)
		)
			return;
		if (typeof clickedIndex === "undefined" || clickedIndex === null) return;
		let slideToIndex;
		if (thumbsSwiper.params.loop) {
			slideToIndex = parseInt(
				thumbsSwiper.clickedSlide.getAttribute("data-swiper-slide-index"),
				10,
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
			if (thumbsParams.swiper.destroyed) {
				initialized = false;
				return false;
			}
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
			swiper.params.thumbs.thumbsContainerClass,
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
			slideEl.classList.remove(thumbActiveClass),
		);
		if (
			thumbsSwiper.params.loop ||
			(thumbsSwiper.params.virtual && thumbsSwiper.params.virtual.enabled)
		) {
			for (let i = 0; i < thumbsToActivate; i += 1) {
				elementChildren(
					thumbsSwiper.slidesEl,
					`[data-swiper-slide-index="${swiper.realIndex + i}"]`,
				).forEach((slideEl) => {
					slideEl.classList.add(thumbActiveClass);
				});
			}
		} else {
			for (let i = 0; i < thumbsToActivate; i += 1) {
				if (thumbsSwiper.slides[swiper.realIndex + i]) {
					thumbsSwiper.slides[swiper.realIndex + i].classList.add(
						thumbActiveClass,
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
				const newThumbsSlide = thumbsSwiper.slides.find(
					(slideEl) =>
						slideEl.getAttribute("data-swiper-slide-index") ===
						`${swiper.realIndex}`,
				);
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
					const onThumbsSwiper = (e) => {
						thumbs2.swiper = e.detail[0];
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
	on("setTranslate _virtualUpdated", () => {
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
						".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left",
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
	let { swiper, duration, transformElements } = _ref;
	const { activeIndex } = swiper;
	if (swiper.params.virtualTranslate && duration !== 0) {
		let eventTriggered = false;
		let transitionEndTarget;
		{
			transitionEndTarget = transformElements;
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
		for (let i = 0; i < slides.length; i += 1) {
			const slideEl = swiper.slides[i];
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
			getSlideTransformEl(slideEl),
		);
		transformElements.forEach((el) => {
			el.style.transitionDuration = `${duration}ms`;
		});
		effectVirtualTransitionEnd({
			swiper,
			duration,
			transformElements,
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
	new Swiper(slider$1, {
		modules: [Navigation],
		slidesPerView: 1,
		spaceBetween: 20,
		navigation: {
			nextEl: btnNext ? btnNext : null,
			prevEl: btnPrev ? btnPrev : null,
		},
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
function _assertThisInitialized(self) {
	if (self === void 0) {
		throw new ReferenceError(
			"this hasn't been initialised - super() hasn't been called",
		);
	}
	return self;
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
			"Missing plugin? gsap.registerPlugin()",
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
			i;
		_isObject(target) || _isFunction(target) || (targets = [targets]);
		if (!(harnessPlugin = (target._gsap || {}).harness)) {
			i = _harnessPlugins.length;
			while (i-- && !_harnessPlugins[i].targetTest(target)) {}
			harnessPlugin = _harnessPlugins[i];
		}
		i = targets.length;
		while (i--) {
			(targets[i] &&
				(targets[i]._gsap ||
					(targets[i]._gsap = new GSCache(targets[i], harnessPlugin)))) ||
				targets.splice(i, 1);
		}
		return targets;
	},
	_getCache = function _getCache2(target) {
		return target._gsap || _harness(toArray(target))[0]._gsap;
	},
	_getProperty = function _getProperty2(target, property, v) {
		return (v = target[property]) && _isFunction(v)
			? target[property]()
			: (_isUndefined(v) &&
					target.getAttribute &&
					target.getAttribute(property)) ||
					v;
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
		var l = toFind.length,
			i = 0;
		for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l; ) {}
		return i < l;
	},
	_lazyRender = function _lazyRender2() {
		var l = _lazyTweens.length,
			a = _lazyTweens.slice(0),
			i,
			tween;
		_lazyLookup = {};
		_lazyTweens.length = 0;
		for (i = 0; i < l; i++) {
			tween = a[i];
			tween &&
				tween._lazy &&
				(tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
		}
	},
	_lazySafeRender = function _lazySafeRender2(
		animation,
		time,
		suppressEvents,
		force,
	) {
		_lazyTweens.length && !_reverting$1 && _lazyRender();
		animation.render(
			time,
			suppressEvents,
			_reverting$1 && time < 0 && (animation._initted || animation._startAt),
		);
		_lazyTweens.length && !_reverting$1 && _lazyRender();
	},
	_numericIfPossible = function _numericIfPossible2(value) {
		var n = parseFloat(value);
		return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2
			? n
			: _isString(value)
			? value.trim()
			: value;
	},
	_passThrough = function _passThrough2(p) {
		return p;
	},
	_setDefaults = function _setDefaults2(obj, defaults3) {
		for (var p in defaults3) {
			p in obj || (obj[p] = defaults3[p]);
		}
		return obj;
	},
	_setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
		return function (obj, defaults3) {
			for (var p in defaults3) {
				p in obj ||
					(p === "duration" && excludeDuration) ||
					p === "ease" ||
					(obj[p] = defaults3[p]);
			}
		};
	},
	_merge = function _merge2(base, toMerge) {
		for (var p in toMerge) {
			base[p] = toMerge[p];
		}
		return base;
	},
	_mergeDeep = function _mergeDeep2(base, toMerge) {
		for (var p in toMerge) {
			p !== "__proto__" &&
				p !== "constructor" &&
				p !== "prototype" &&
				(base[p] = _isObject(toMerge[p])
					? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p])
					: toMerge[p]);
		}
		return base;
	},
	_copyExcluding = function _copyExcluding2(obj, excluding) {
		var copy = {},
			p;
		for (p in obj) {
			p in excluding || (copy[p] = obj[p]);
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
		var i = a1.length,
			match = i === a2.length;
		while (match && i-- && a1[i] === a2[i]) {}
		return i < 0;
	},
	_addLinkedListItem = function _addLinkedListItem2(
		parent,
		child,
		firstProp,
		lastProp,
		sortBy,
	) {
		var prev = parent[lastProp],
			t;
		if (sortBy) {
			t = child[sortBy];
			while (prev && prev[sortBy] > t) {
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
		lastProp,
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
		onlyIfParentHasAutoRemove,
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
			var a = animation;
			while (a) {
				a._dirty = 1;
				a = a.parent;
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
		force,
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
					(animation = animation.duration() + animation._rDelay),
			  ) * animation
			: 0;
	},
	_animationCycle = function _animationCycle2(tTime, cycleDuration) {
		var whole = Math.floor((tTime /= cycleDuration));
		return tTime && whole === tTime ? whole - 1 : whole;
	},
	_parentToChildTotalTime = function _parentToChildTotalTime2(
		parentTime,
		child,
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
					Math.abs(animation._ts || animation._rts || _tinyNum) || 0),
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
						  -animation._ts),
			);
			_setEnd(animation);
			parent._dirty || _uncache(parent, animation);
		}
		return animation;
	},
	_postAddChecks = function _postAddChecks2(timeline2, child) {
		var t;
		if (child._time || (child._initted && !child._dur)) {
			t = _parentToChildTotalTime(timeline2.rawTime(), child);
			if (
				!child._dur ||
				_clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum
			) {
				child.render(t, true);
			}
		}
		if (
			_uncache(timeline2, child)._dp &&
			timeline2._initted &&
			timeline2._time >= timeline2._dur &&
			timeline2._ts
		) {
			if (timeline2._dur < timeline2.duration()) {
				t = timeline2;
				while (t._dp) {
					t.rawTime() >= 0 && t.totalTime(t._tTime);
					t = t._dp;
				}
			}
			timeline2._zTime = -_tinyNum;
		}
	},
	_addToTimeline = function _addToTimeline2(
		timeline2,
		child,
		position,
		skipChecks,
	) {
		child.parent && _removeFromParent(child);
		child._start = _roundPrecise(
			(_isNumber(position)
				? position
				: position || timeline2 !== _globalTimeline
				? _parsePosition(timeline2, position, child)
				: timeline2._time) + child._delay,
		);
		child._end = _roundPrecise(
			child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0),
		);
		_addLinkedListItem(
			timeline2,
			child,
			"_first",
			"_last",
			timeline2._sort ? "_start" : 0,
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
		tTime,
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
		force,
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
			pt,
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
			pt = tween._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
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
		time,
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
		leavePlayhead,
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
				(animation._tTime = animation._tDur * totalProgress),
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
		percentAnimation,
	) {
		var labels = animation.labels,
			recent = animation._recent || _zeroPosition,
			clippedDuration =
				animation.duration() >= _bigNum$1
					? recent.endTime(false)
					: animation._dur,
			i,
			offset,
			isPercent;
		if (_isString(position) && (isNaN(position) || position in labels)) {
			offset = position.charAt(0);
			isPercent = position.substr(-1) === "%";
			i = position.indexOf("=");
			if (offset === "<" || offset === ">") {
				i >= 0 && (position = position.replace(/=/, ""));
				return (
					(offset === "<"
						? recent._start
						: recent.endTime(recent._repeat >= 0)) +
					(parseFloat(position.substr(1)) || 0) *
						(isPercent
							? (i < 0 ? recent : percentAnimation).totalDuration() / 100
							: 1)
				);
			}
			if (i < 0) {
				position in labels || (labels[position] = clippedDuration);
				return labels[position];
			}
			offset = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
			if (isPercent && percentAnimation) {
				offset =
					(offset / 100) *
					(_isArray(percentAnimation)
						? percentAnimation[0]
						: percentAnimation
					).totalDuration();
			}
			return i > 1
				? _parsePosition2(
						animation,
						position.substr(0, i - 1),
						percentAnimation,
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
	getUnit = function getUnit2(value, v) {
		return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
	},
	clamp = function clamp2(min, max, value) {
		return _conditionalReturn(value, function (v) {
			return _clamp(min, max, v);
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
							toArray(value),
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
		return function (v) {
			var el = value.current || value.nativeElement || value;
			return toArray(
				v,
				el.querySelectorAll
					? el
					: el === value
					? _warn("Invalid scope") || _doc$1.createElement("div")
					: value,
			);
		};
	},
	shuffle = function shuffle2(a) {
		return a.sort(function () {
			return 0.5 - Math.random();
		});
	},
	distribute = function distribute2(v) {
		if (_isFunction(v)) {
			return v;
		}
		var vars = _isObject(v)
				? v
				: {
						each: v,
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
		return function (i, target, a) {
			var l = (a || vars).length,
				distances = cache[l],
				originX,
				originY,
				x,
				y,
				d,
				j,
				max,
				min,
				wrapAt;
			if (!distances) {
				wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$1])[1];
				if (!wrapAt) {
					max = -_bigNum$1;
					while (
						max < (max = a[wrapAt++].getBoundingClientRect().left) &&
						wrapAt < l
					) {}
					wrapAt--;
				}
				distances = cache[l] = [];
				originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt;
				originY =
					wrapAt === _bigNum$1
						? 0
						: ratios
						? (l * ratioY) / wrapAt - 0.5
						: (from / wrapAt) | 0;
				max = 0;
				min = _bigNum$1;
				for (j = 0; j < l; j++) {
					x = (j % wrapAt) - originX;
					y = originY - ((j / wrapAt) | 0);
					distances[j] = d = !axis
						? _sqrt(x * x + y * y)
						: Math.abs(axis === "y" ? y : x);
					d > max && (max = d);
					d < min && (min = d);
				}
				from === "random" && shuffle(distances);
				distances.max = max - min;
				distances.min = min;
				distances.v = l =
					(parseFloat(vars.amount) ||
						parseFloat(vars.each) *
							(wrapAt > l
								? l - 1
								: !axis
								? Math.max(wrapAt, l / wrapAt)
								: axis === "y"
								? l / wrapAt
								: wrapAt) ||
						0) * (from === "edges" ? -1 : 1);
				distances.b = l < 0 ? base - l : base;
				distances.u = getUnit(vars.amount || vars.each) || 0;
				ease = ease && l < 0 ? _invertEase(ease) : ease;
			}
			l = (distances[i] - distances.min) / distances.max || 0;
			return (
				_roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) +
				distances.u
			);
		};
	},
	_roundModifier = function _roundModifier2(v) {
		var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
		return function (raw) {
			var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
			return (n - (n % 1)) / p + (_isNumber(raw) ? 0 : getUnit(raw));
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
						var x = parseFloat(is2D ? raw.x : raw),
							y = parseFloat(is2D ? raw.y : 0),
							min = _bigNum$1,
							closest = 0,
							i = snapTo.length,
							dx,
							dy;
						while (i--) {
							if (is2D) {
								dx = snapTo[i].x - x;
								dy = snapTo[i].y - y;
								dx = dx * dx + dy * dy;
							} else {
								dx = Math.abs(snapTo[i] - x);
							}
							if (dx < min) {
								min = dx;
								closest = i;
							}
						}
						closest = !radius || min <= radius ? snapTo[closest] : raw;
						return is2D || closest === raw || _isNumber(raw)
							? closest
							: closest + getUnit(raw);
				  },
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
										roundingIncrement,
								) *
									roundingIncrement *
									returnFunction,
							) / returnFunction;
			},
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
			return functions.reduce(function (v, f) {
				return f(v);
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
	_wrapArray = function _wrapArray2(a, wrapper, value) {
		return _conditionalReturn(value, function (index) {
			return a[~~wrapper(index)];
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
			s = "",
			i,
			nums,
			end,
			isArray;
		while (~(i = value.indexOf("random(", prev))) {
			end = value.indexOf(")", i);
			isArray = value.charAt(i + 7) === "[";
			nums = value
				.substr(i + 7, end - i - 7)
				.match(isArray ? _delimitedValueExp : _strictNumExp);
			s +=
				value.substr(prev, i - prev) +
				random(
					isArray ? nums : +nums[0],
					isArray ? 0 : +nums[1],
					+nums[2] || 1e-5,
				);
			prev = end + 1;
		}
		return s + value.substr(prev, value.length - prev);
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
			: function (p2) {
					return (1 - p2) * start + p2 * end;
			  };
		if (!func) {
			var isString2 = _isString(start),
				master = {},
				p,
				i,
				interpolators,
				l,
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
				l = start.length;
				il = l - 2;
				for (i = 1; i < l; i++) {
					interpolators.push(interpolate2(start[i - 1], start[i]));
				}
				l--;
				func = function func2(p2) {
					p2 *= l;
					var i2 = Math.min(il, ~~p2);
					return interpolators[i2](p2 - i2);
				};
				progress = end;
			} else if (!mutate) {
				start = _merge(_isArray(start) ? [] : {}, start);
			}
			if (!interpolators) {
				for (p in end) {
					_addPropTween.call(master, start, p, "get", end[p]);
				}
				func = function func2(p2) {
					return _renderPropTweens(p2, master) || (isString2 ? start.p : start);
				};
			}
		}
		return _conditionalReturn(progress, func);
	},
	_getLabelInDirection = function _getLabelInDirection2(
		timeline2,
		fromTime,
		backward,
	) {
		var labels = timeline2.labels,
			min = _bigNum$1,
			p,
			distance,
			label;
		for (p in labels) {
			distance = labels[p] - fromTime;
			if (
				distance < 0 === !!backward &&
				distance &&
				min > (distance = Math.abs(distance))
			) {
				label = p;
				min = distance;
			}
		}
		return label;
	},
	_callback = function _callback2(animation, type, executeLazyFirst) {
		var v = animation.vars,
			callback = v[type],
			prevContext = _context,
			context3 = animation._ctx,
			params,
			scope,
			result;
		if (!callback) {
			return;
		}
		params = v[type + "Params"];
		scope = v.callbackScope || animation;
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
				_setDefaults(_copyExcluding(config3, instanceDefaults), statics),
			);
			_merge(
				Plugin.prototype,
				_merge(instanceDefaults, _copyExcluding(config3, statics)),
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
	_hue = function _hue2(h, m1, m2) {
		h += h < 0 ? 1 : h > 1 ? -1 : 0;
		return (
			((h * 6 < 1
				? m1 + (m2 - m1) * h * 6
				: h < 0.5
				? m2
				: h * 3 < 2
				? m1 + (m2 - m1) * (2 / 3 - h) * 6
				: m1) *
				_255 +
				0.5) |
			0
		);
	},
	splitColor = function splitColor2(v, toHSL, forceAlpha) {
		var a = !v
				? _colorLookup.black
				: _isNumber(v)
				? [v >> 16, (v >> 8) & _255, v & _255]
				: 0,
			r,
			g,
			b,
			h,
			s,
			l,
			max,
			min,
			d,
			wasHSL;
		if (!a) {
			if (v.substr(-1) === ",") {
				v = v.substr(0, v.length - 1);
			}
			if (_colorLookup[v]) {
				a = _colorLookup[v];
			} else if (v.charAt(0) === "#") {
				if (v.length < 6) {
					r = v.charAt(1);
					g = v.charAt(2);
					b = v.charAt(3);
					v =
						"#" +
						r +
						r +
						g +
						g +
						b +
						b +
						(v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
				}
				if (v.length === 9) {
					a = parseInt(v.substr(1, 6), 16);
					return [
						a >> 16,
						(a >> 8) & _255,
						a & _255,
						parseInt(v.substr(7), 16) / 255,
					];
				}
				v = parseInt(v.substr(1), 16);
				a = [v >> 16, (v >> 8) & _255, v & _255];
			} else if (v.substr(0, 3) === "hsl") {
				a = wasHSL = v.match(_strictNumExp);
				if (!toHSL) {
					h = (+a[0] % 360) / 360;
					s = +a[1] / 100;
					l = +a[2] / 100;
					g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
					r = l * 2 - g;
					a.length > 3 && (a[3] *= 1);
					a[0] = _hue(h + 1 / 3, r, g);
					a[1] = _hue(h, r, g);
					a[2] = _hue(h - 1 / 3, r, g);
				} else if (~v.indexOf("=")) {
					a = v.match(_numExp);
					forceAlpha && a.length < 4 && (a[3] = 1);
					return a;
				}
			} else {
				a = v.match(_strictNumExp) || _colorLookup.transparent;
			}
			a = a.map(Number);
		}
		if (toHSL && !wasHSL) {
			r = a[0] / _255;
			g = a[1] / _255;
			b = a[2] / _255;
			max = Math.max(r, g, b);
			min = Math.min(r, g, b);
			l = (max + min) / 2;
			if (max === min) {
				h = s = 0;
			} else {
				d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				h =
					max === r
						? (g - b) / d + (g < b ? 6 : 0)
						: max === g
						? (b - r) / d + 2
						: (r - g) / d + 4;
				h *= 60;
			}
			a[0] = ~~(h + 0.5);
			a[1] = ~~(s * 100 + 0.5);
			a[2] = ~~(l * 100 + 0.5);
		}
		forceAlpha && a.length < 4 && (a[3] = 1);
		return a;
	},
	_colorOrderData = function _colorOrderData2(v) {
		var values = [],
			c = [],
			i = -1;
		v.split(_colorExp).forEach(function (v2) {
			var a = v2.match(_numWithUnitExp) || [];
			values.push.apply(values, a);
			c.push((i += a.length + 1));
		});
		values.c = c;
		return values;
	},
	_formatColors = function _formatColors2(s, toHSL, orderMatchData) {
		var result = "",
			colors = (s + result).match(_colorExp),
			type = toHSL ? "hsla(" : "rgba(",
			i = 0,
			c,
			shell,
			d,
			l;
		if (!colors) {
			return s;
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
			d = _colorOrderData(s);
			c = orderMatchData.c;
			if (c.join(result) !== d.c.join(result)) {
				shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
				l = shell.length - 1;
				for (; i < l; i++) {
					result +=
						shell[i] +
						(~c.indexOf(i)
							? colors.shift() || type + "0,0,0,0)"
							: (d.length
									? d
									: colors.length
									? colors
									: orderMatchData
							  ).shift());
				}
			}
		}
		if (!shell) {
			shell = s.split(_colorExp);
			l = shell.length - 1;
			for (; i < l; i++) {
				result += shell[i] + colors[i];
			}
		}
		return result + shell[l];
	},
	_colorExp = (function () {
		var s =
				"(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
			p;
		for (p in _colorLookup) {
			s += "|" + p + "\\b";
		}
		return new RegExp(s + ")", "gi");
	})(),
	_hslExp = /hsl[a]?\(/,
	_colorStringFilter = function _colorStringFilter2(a) {
		var combined = a.join(" "),
			toHSL;
		_colorExp.lastIndex = 0;
		if (_colorExp.test(combined)) {
			toHSL = _hslExp.test(combined);
			a[1] = _formatColors(a[1], toHSL);
			a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
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
			_tick = function _tick2(v) {
				var elapsed = _getTime() - _lastUpdate,
					manual = v === true,
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
						_listeners2[_i](time, _delta, frame, v);
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
							gsap.version,
						);
						_install(
							_installScope ||
								_win$1.GreenSockGlobals ||
								(!_win$1.gsap && _win$1) ||
								{},
						);
						_raf = _win$1.requestAnimationFrame;
					}
					_id && _self.sleep();
					_req =
						_raf ||
						function (f) {
							return setTimeout(f, (_nextTime - _self.time * 1e3 + 1) | 0);
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
					? function (t, d, f, v) {
							callback(t, d, f, v);
							_self.remove(func);
					  }
					: callback;
				_self.remove(callback);
				_listeners2[prioritize ? "unshift" : "push"](func);
				_wake();
				return func;
			},
			remove: function remove(callback, i) {
				~(i = _listeners2.indexOf(callback)) &&
					_listeners2.splice(i, 1) &&
					_i >= i &&
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
			i = 1,
			l = split.length,
			index,
			val,
			parsedVal;
		for (; i < l; i++) {
			val = split[i];
			index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
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
			~nested && nested < close ? value.indexOf(")", close + 1) : close,
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
						: _valueInParentheses(name).split(",").map(_numericIfPossible),
			  )
			: _easeMap._CE && _customEaseExp.test(name)
			? _easeMap._CE("", name)
			: ease;
	},
	_invertEase = function _invertEase2(ease) {
		return function (p) {
			return 1 - ease(1 - p);
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
			easeOut = function easeOut2(p) {
				return 1 - easeIn(1 - p);
			};
		}
		if (easeInOut === void 0) {
			easeInOut = function easeInOut2(p) {
				return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
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
			for (var p in ease) {
				_easeMap[
					lowercaseName +
						(p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")
				] = _easeMap[name + "." + p] = ease[p];
			}
		});
		return ease;
	},
	_easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
		return function (p) {
			return p < 0.5
				? (1 - easeOut(1 - p * 2)) / 2
				: 0.5 + easeOut((p - 0.5) * 2) / 2;
		};
	},
	_configElastic = function _configElastic2(type, amplitude, period) {
		var p1 = amplitude >= 1 ? amplitude : 1,
			p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1),
			p3 = (p2 / _2PI) * (Math.asin(1 / p1) || 0),
			easeOut = function easeOut2(p) {
				return p === 1
					? 1
					: p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
			},
			ease =
				type === "out"
					? easeOut
					: type === "in"
					? function (p) {
							return 1 - easeOut(1 - p);
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
		var easeOut = function easeOut2(p) {
				return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
			},
			ease =
				type === "out"
					? easeOut
					: type === "in"
					? function (p) {
							return 1 - easeOut(1 - p);
					  }
					: _easeInOutFromOut(easeOut);
		ease.config = function (overshoot2) {
			return _configBack2(type, overshoot2);
		};
		return ease;
	};
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
	var power = i < 5 ? i + 1 : i;
	_insertEase(
		name + ",Power" + (power - 1),
		i
			? function (p) {
					return Math.pow(p, power);
			  }
			: function (p) {
					return p;
			  },
		function (p) {
			return 1 - Math.pow(1 - p, power);
		},
		function (p) {
			return p < 0.5
				? Math.pow(p * 2, power) / 2
				: 1 - Math.pow((1 - p) * 2, power) / 2;
		},
	);
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase(
	"Elastic",
	_configElastic("in"),
	_configElastic("out"),
	_configElastic(),
);
(function (n, c) {
	var n1 = 1 / c,
		n2 = 2 * n1,
		n3 = 2.5 * n1,
		easeOut = function easeOut2(p) {
			return p < n1
				? n * p * p
				: p < n2
				? n * Math.pow(p - 1.5 / c, 2) + 0.75
				: p < n3
				? n * (p -= 2.25 / c) * p + 0.9375
				: n * Math.pow(p - 2.625 / c, 2) + 0.984375;
		};
	_insertEase(
		"Bounce",
		function (p) {
			return 1 - easeOut(1 - p);
		},
		easeOut,
	);
})(7.5625, 2.75);
_insertEase("Expo", function (p) {
	return p ? Math.pow(2, 10 * (p - 1)) : 0;
});
_insertEase("Circ", function (p) {
	return -(_sqrt(1 - p * p) - 1);
});
_insertEase("Sine", function (p) {
	return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
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
				return function (p) {
					return (((p2 * _clamp(0, max, p)) | 0) + p3) * p1;
				};
			},
		};
_defaults.ease = _easeMap["quad.out"];
_forEachName(
	"onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",
	function (name) {
		return (_callbackNames += name + "," + name + "Params,");
	},
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
						: value,
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
				: (value - this._repeat * this._rDelay) / (this._repeat + 1),
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
					suppressEvents,
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
					suppressEvents,
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
						(this._tTime -= _tinyNum),
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
			  (!this._ts || (this._repeat && this._time && this.totalProgress() < 1))
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
			_isNotFalse(suppressEvents),
		);
	};
	_proto.restart = function restart(includeDelay, suppressEvents) {
		return this.play().totalTime(
			includeDelay ? -this._delay : 0,
			_isNotFalse(suppressEvents),
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
		var self = this;
		return new Promise(function (resolve) {
			var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
				_resolve = function _resolve2() {
					var _then = self.then;
					self.then = null;
					_isFunction(f) &&
						(f = f(self)) &&
						(f.then || f === self) &&
						(self.then = _then);
					resolve(f);
					self.then = _then;
				};
			if (
				(self._initted && self.totalProgress() === 1 && self._ts >= 0) ||
				(!self._tTime && self._ts < 0)
			) {
				_resolve();
			} else {
				self._prom = _resolve;
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
				position,
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
			position,
		);
	};
	_proto2.staggerTo = function staggerTo(
		targets,
		duration,
		vars,
		stagger,
		position,
		onCompleteAll,
		onCompleteAllParams,
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
		onCompleteAllParams,
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
			onCompleteAllParams,
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
		onCompleteAllParams,
	) {
		toVars.startAt = fromVars;
		_inheritDefaults(toVars).immediateRender = _isNotFalse(
			toVars.immediateRender,
		);
		return this.staggerTo(
			targets,
			duration,
			toVars,
			stagger,
			position,
			onCompleteAll,
			onCompleteAllParams,
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
						force,
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
						!dur,
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
					_roundPrecise(time),
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
							force,
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
							force || (_reverting$1 && (child._initted || child._startAt)),
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
								true,
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
		ignoreBeforeTime,
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
		var a = [],
			child = this._first;
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				if (child instanceof Tween) {
					tweens && a.push(child);
				} else {
					timelines && a.push(child);
					nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
				}
			}
			child = child._next;
		}
		return a;
	};
	_proto2.getById = function getById2(id) {
		var animations = this.getChildren(1, 1, 1),
			i = animations.length;
		while (i--) {
			if (animations[i].vars.id === id) {
				return animations[i];
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
						: (this.totalDuration() - _totalTime2) / -this._ts),
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
		var t = Tween.delayedCall(0, callback || _emptyFunc, params);
		t.data = "isPause";
		this._hasPause = 1;
		return _addToTimeline(this, t, _parsePosition(this, position));
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
			i = tweens.length;
		while (i--) {
			_overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
		}
		return this;
	};
	_proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
		var a = [],
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
					a.push(child);
				}
			} else if (
				(children = child.getTweensOf(parsedTargets, onlyActive)).length
			) {
				a.push.apply(a, children);
			}
			child = child._next;
		}
		return a;
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
									tl.timeScale(),
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
											tl.timeScale(),
									);
								tween._dur !== duration &&
									_setDuration(tween, duration, 0, 1).render(
										tween._time,
										true,
										true,
									);
								initted = 1;
							}
							_onStart && _onStart.apply(tween, onStartParams || []);
						},
					},
					vars,
				),
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
				vars,
			),
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
		ignoreBeforeTime,
	) {
		if (ignoreBeforeTime === void 0) {
			ignoreBeforeTime = 0;
		}
		var child = this._first,
			labels = this.labels,
			p;
		while (child) {
			if (child._start >= ignoreBeforeTime) {
				child._start += amount;
				child._end += amount;
			}
			child = child._next;
		}
		if (adjustLabels) {
			for (p in labels) {
				if (labels[p] >= ignoreBeforeTime) {
					labels[p] += amount;
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
			self = this,
			child = self._last,
			prevStart = _bigNum$1,
			prev,
			start,
			parent;
		if (arguments.length) {
			return self.timeScale(
				(self._repeat < 0 ? self.duration() : self.totalDuration()) /
					(self.reversed() ? -value : value),
			);
		}
		if (self._dirty) {
			parent = self.parent;
			while (child) {
				prev = child._prev;
				child._dirty && child.totalDuration();
				start = child._start;
				if (start > prevStart && self._sort && child._ts && !self._lock) {
					self._lock = 1;
					_addToTimeline(self, child, start - child._delay, 1)._lock = 0;
				} else {
					prevStart = start;
				}
				if (start < 0 && child._ts) {
					max -= start;
					if ((!parent && !self._dp) || (parent && parent.smoothChildTiming)) {
						self._start += start / self._ts;
						self._time -= start;
						self._tTime -= start;
					}
					self.shiftChildren(-start, false, -Infinity);
					prevStart = 0;
				}
				child._end > max && child._ts && (max = child._end);
				child = prev;
			}
			_setDuration(
				self,
				self === _globalTimeline && self._time > max ? self._time : max,
				1,
				1,
			);
			self._dirty = 0;
		}
		return self._tDur;
	};
	Timeline2.updateRoot = function updateRoot(time) {
		if (_globalTimeline._ts) {
			_lazySafeRender(
				_globalTimeline,
				_parentToChildTotalTime(time, _globalTimeline),
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
		funcParam,
	) {
		var pt = new PropTween(
				this._pt,
				target,
				prop,
				0,
				1,
				_renderComplexString,
				null,
				setter,
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
			a;
		pt.b = start;
		pt.e = end;
		start += "";
		end += "";
		if ((hasRandom = ~end.indexOf("random("))) {
			end = _replaceRandom(end);
		}
		if (stringFilter) {
			a = [start, end];
			stringFilter(a, target, prop);
			start = a[0];
			end = a[1];
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
				pt._pt = {
					_next: pt._pt,
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
		pt.c = index < end.length ? end.substring(index, end.length) : "";
		pt.fp = funcParam;
		if (_relExp.test(end) || hasRandom) {
			pt.e = 0;
		}
		this._pt = pt;
		return pt;
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
		optional,
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
			pt;
		if (_isString(end)) {
			if (~end.indexOf("random(")) {
				end = _replaceRandom(end);
			}
			if (end.charAt(1) === "=") {
				pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
				if (pt || pt === 0) {
					end = pt;
				}
			}
		}
		if (!optional || parsedStart !== end || _forceAllPropTweens) {
			if (!isNaN(parsedStart * end) && end !== "") {
				pt = new PropTween(
					this._pt,
					target,
					prop,
					+parsedStart || 0,
					end - (parsedStart || 0),
					typeof currentValue === "boolean" ? _renderBoolean : _renderPlain,
					0,
					setter,
				);
				funcParam && (pt.fp = funcParam);
				modifier && pt.modifier(modifier, this, target);
				return (this._pt = pt);
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
				funcParam,
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
			p;
		for (p in vars) {
			copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
		}
		return copy;
	},
	_checkPlugin = function _checkPlugin2(
		property,
		vars,
		tween,
		index,
		target,
		targets,
	) {
		var plugin, pt, ptLookup, i;
		if (
			_plugins[property] &&
			(plugin = new _plugins[property]()).init(
				target,
				plugin.rawVars
					? vars[property]
					: _processVars(vars[property], index, target, targets, tween),
				tween,
				index,
				targets,
			) !== false
		) {
			tween._pt = pt = new PropTween(
				tween._pt,
				target,
				property,
				0,
				1,
				plugin.render,
				plugin,
				0,
				plugin.priority,
			);
			if (tween !== _quickTween) {
				ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
				i = plugin._props.length;
				while (i--) {
					ptLookup[plugin._props[i]] = pt;
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
			i,
			p,
			pt,
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
					_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease),
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
							runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig,
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
							startAt,
						),
					)),
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
					p = _setDefaults(
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
						cleanVars,
					);
					harnessVars && (p[harness.prop] = harnessVars);
					_removeFromParent((tween._startAt = Tween.set(targets, p)));
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
			for (i = 0; i < targets.length; i++) {
				target = targets[i];
				gsData = target._gsap || _harness(targets)[i]._gsap;
				tween._ptLookup[i] = ptLookup = {};
				_lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
				index = fullTargets === targets ? i : fullTargets.indexOf(target);
				if (
					harness &&
					(plugin = new harness()).init(
						target,
						harnessVars || cleanVars,
						tween,
						index,
						fullTargets,
					) !== false
				) {
					tween._pt = pt = new PropTween(
						tween._pt,
						target,
						plugin.name,
						0,
						1,
						plugin.render,
						plugin,
						0,
						plugin.priority,
					);
					plugin._props.forEach(function (name) {
						ptLookup[name] = pt;
					});
					plugin.priority && (hasPriority = 1);
				}
				if (!harness || harnessVars) {
					for (p in cleanVars) {
						if (
							_plugins[p] &&
							(plugin = _checkPlugin(
								p,
								cleanVars,
								tween,
								index,
								target,
								fullTargets,
							))
						) {
							plugin.priority && (hasPriority = 1);
						} else {
							ptLookup[p] = pt = _addPropTween.call(
								tween,
								target,
								p,
								"get",
								cleanVars[p],
								index,
								fullTargets,
								0,
								vars.stringFilter,
							);
						}
					}
				}
				tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
				if (autoOverwrite && tween._pt) {
					_overwritingTween = tween;
					_globalTimeline.killTweensOf(
						target,
						ptLookup,
						tween.globalTime(time),
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
		time,
	) {
		var ptCache = ((tween._pt && tween._ptCache) || (tween._ptCache = {}))[
				property
			],
			pt,
			rootPT,
			lookup,
			i;
		if (!ptCache) {
			ptCache = tween._ptCache[property] = [];
			lookup = tween._ptLookup;
			i = tween._targets.length;
			while (i--) {
				pt = lookup[i][property];
				if (pt && pt.d && pt.d._pt) {
					pt = pt.d._pt;
					while (pt && pt.p !== property && pt.fp !== property) {
						pt = pt._next;
					}
				}
				if (!pt) {
					_forceAllPropTweens = 1;
					tween.vars[property] = "+=0";
					_initTween(tween, time);
					_forceAllPropTweens = 0;
					return 1;
				}
				ptCache.push(pt);
			}
		}
		i = ptCache.length;
		while (i--) {
			rootPT = ptCache[i];
			pt = rootPT._pt || rootPT;
			pt.s =
				(start || start === 0) && !startIsRelative
					? start
					: pt.s + (start || 0) + ratio * pt.c;
			pt.c = value - pt.s;
			rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
			rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
		}
	},
	_addAliasesToVars = function _addAliasesToVars2(targets, vars) {
		var harness = targets[0] ? _getCache(targets[0]).harness : 0,
			propertyAliases = harness && harness.aliases,
			copy,
			p,
			i,
			aliases;
		if (!propertyAliases) {
			return vars;
		}
		copy = _merge({}, vars);
		for (p in propertyAliases) {
			if (p in copy) {
				aliases = propertyAliases[p].split(",");
				i = aliases.length;
				while (i--) {
					copy[aliases[i]] = copy[p];
				}
			}
		}
		return copy;
	},
	_parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
		var ease = obj.ease || easeEach || "power1.inOut",
			p,
			a;
		if (_isArray(obj)) {
			a = allProps[prop] || (allProps[prop] = []);
			obj.forEach(function (value, i) {
				return a.push({
					t: (i / (obj.length - 1)) * 100,
					v: value,
					e: ease,
				});
			});
		} else {
			for (p in obj) {
				a = allProps[p] || (allProps[p] = []);
				p === "ease" ||
					a.push({
						t: parseFloat(prop),
						v: obj[p],
						e: ease,
					});
			}
		}
	},
	_parseFuncOrString = function _parseFuncOrString2(
		value,
		tween,
		i,
		target,
		targets,
	) {
		return _isFunction(value)
			? value.call(tween, i, target, targets)
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
	},
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
			i,
			copy,
			l,
			p,
			curTarget,
			staggerFunc,
			staggerVarsToMerge;
		_this3._targets = parsedTargets.length
			? _harness(parsedTargets)
			: _warn(
					"GSAP target " + targets + " not found. https://greensock.com",
					!_config.nullTargetWarn,
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
				l = parsedTargets.length;
				staggerFunc = stagger && distribute(stagger);
				if (_isObject(stagger)) {
					for (p in stagger) {
						if (~_staggerTweenProps.indexOf(p)) {
							staggerVarsToMerge || (staggerVarsToMerge = {});
							staggerVarsToMerge[p] = stagger[p];
						}
					}
				}
				for (i = 0; i < l; i++) {
					copy = _copyExcluding(vars, _staggerPropsToSkip);
					copy.stagger = 0;
					yoyoEase && (copy.yoyoEase = yoyoEase);
					staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
					curTarget = parsedTargets[i];
					copy.duration = +_parseFuncOrString(
						duration,
						_assertThisInitialized(_this3),
						i,
						curTarget,
						parsedTargets,
					);
					copy.delay =
						(+_parseFuncOrString(
							delay,
							_assertThisInitialized(_this3),
							i,
							curTarget,
							parsedTargets,
						) || 0) - _this3._delay;
					if (!stagger && l === 1 && copy.delay) {
						_this3._delay = delay = copy.delay;
						_this3._start += delay;
						copy.delay = 0;
					}
					tl.to(
						curTarget,
						copy,
						staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0,
					);
					tl._ease = _easeMap.none;
				}
				tl.duration() ? (duration = delay = 0) : (_this3.timeline = 0);
			} else if (keyframes) {
				_inheritDefaults(
					_setDefaults(tl.vars.defaults, {
						ease: "none",
					}),
				);
				tl._ease = _parseEase(keyframes.ease || vars.ease || "none");
				var time = 0,
					a,
					kf,
					v;
				if (_isArray(keyframes)) {
					keyframes.forEach(function (frame) {
						return tl.to(parsedTargets, frame, ">");
					});
					tl.duration();
				} else {
					copy = {};
					for (p in keyframes) {
						p === "ease" ||
							p === "easeEach" ||
							_parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
					}
					for (p in copy) {
						a = copy[p].sort(function (a2, b) {
							return a2.t - b.t;
						});
						time = 0;
						for (i = 0; i < a.length; i++) {
							kf = a[i];
							v = {
								ease: kf.e,
								duration: ((kf.t - (i ? a[i - 1].t : 0)) / 100) * duration,
							};
							v[p] = kf.v;
							tl.to(parsedTargets, v, time);
							time += v.duration;
						}
					}
					tl.duration() < duration &&
						tl.to(
							{},
							{
								duration: duration - tl.duration(),
							},
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
			pt,
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
						force,
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
							true,
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
						tTime,
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
			pt = this._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
			(timeline2 &&
				timeline2.render(
					totalTime < 0
						? totalTime
						: !time && isYoyo
						? -_tinyNum
						: timeline2._dur * timeline2._ease(time / this._dur),
					suppressEvents,
					force,
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
						true,
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
				time,
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
				this._dp._sort ? "_start" : 0,
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
				_overwritingTween && _overwritingTween.vars.overwrite !== true,
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
			p,
			pt,
			i;
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
				p = {};
				_forEachName(vars, function (name) {
					return (p[name] = 1);
				});
				vars = p;
			}
			vars = _addAliasesToVars(parsedTargets, vars);
		}
		i = parsedTargets.length;
		while (i--) {
			if (~killingTargets.indexOf(parsedTargets[i])) {
				curLookup = propTweenLookup[i];
				if (vars === "all") {
					overwrittenProps[i] = vars;
					props = curLookup;
					curOverwriteProps = {};
				} else {
					curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
					props = vars;
				}
				for (p in props) {
					pt = curLookup && curLookup[p];
					if (pt) {
						if (!("kill" in pt.d) || pt.d.kill(p) === true) {
							_removeLinkedListItem(this, pt, "_pt");
						}
						delete curLookup[p];
					}
					if (curOverwriteProps !== "all") {
						curOverwriteProps[p] = 1;
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
		data,
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
			data,
		);
	},
	_renderBoolean = function _renderBoolean2(ratio, data) {
		return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
	},
	_renderComplexString = function _renderComplexString2(ratio, data) {
		var pt = data._pt,
			s = "";
		if (!ratio && data.b) {
			s = data.b;
		} else if (ratio === 1 && data.e) {
			s = data.e;
		} else {
			while (pt) {
				s =
					pt.p +
					(pt.m
						? pt.m(pt.s + pt.c * ratio)
						: Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) +
					s;
				pt = pt._next;
			}
			s += data.c;
		}
		data.set(data.t, data.p, s, data);
	},
	_renderPropTweens = function _renderPropTweens2(ratio, data) {
		var pt = data._pt;
		while (pt) {
			pt.r(ratio, pt.d);
			pt = pt._next;
		}
	},
	_addPluginModifier = function _addPluginModifier2(
		modifier,
		tween,
		target,
		property,
	) {
		var pt = this._pt,
			next;
		while (pt) {
			next = pt._next;
			pt.p === property && pt.modifier(modifier, tween, target);
			pt = next;
		}
	},
	_killPropTweensOf = function _killPropTweensOf2(property) {
		var pt = this._pt,
			hasNonDependentRemaining,
			next;
		while (pt) {
			next = pt._next;
			if ((pt.p === property && !pt.op) || pt.op === property) {
				_removeLinkedListItem(this, pt, "_pt");
			} else if (!pt.dep) {
				hasNonDependentRemaining = 1;
			}
			pt = next;
		}
		return !hasNonDependentRemaining;
	},
	_setterWithModifier = function _setterWithModifier2(
		target,
		property,
		value,
		data,
	) {
		data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
	},
	_sortPropTweensByPriority = function _sortPropTweensByPriority2(parent) {
		var pt = parent._pt,
			next,
			pt2,
			first,
			last;
		while (pt) {
			next = pt._next;
			pt2 = first;
			while (pt2 && pt2.pr > pt.pr) {
				pt2 = pt2._next;
			}
			if ((pt._prev = pt2 ? pt2._prev : last)) {
				pt._prev._next = pt;
			} else {
				first = pt;
			}
			if ((pt._next = pt2)) {
				pt2._prev = pt;
			} else {
				last = pt;
			}
			pt = next;
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
		priority,
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
	},
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
		return (_listeners[type] || _emptyArray).map(function (f) {
			return f();
		});
	},
	_onMediaChange = function _onMediaChange2() {
		var time = Date.now(),
			matches = [];
		if (time - _lastMediaTime > 2) {
			_dispatch("matchMediaInit");
			_media.forEach(function (c) {
				var queries = c.queries,
					conditions = c.conditions,
					match,
					p,
					anyMatch,
					toggled;
				for (p in queries) {
					match = _win$1.matchMedia(queries[p]).matches;
					match && (anyMatch = 1);
					if (match !== conditions[p]) {
						conditions[p] = match;
						toggled = 1;
					}
				}
				if (toggled) {
					c.revert();
					anyMatch && matches.push(c);
				}
			});
			_dispatch("matchMediaRevert");
			matches.forEach(function (c) {
				return c.onMatch(c);
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
		var self = this,
			f = function f2() {
				var prev = _context,
					prevSelector = self.selector,
					result;
				prev && prev !== self && prev.data.push(self);
				scope && (self.selector = selector(scope));
				_context = self;
				result = func.apply(self, arguments);
				_isFunction(result) && self._r.push(result);
				_context = prev;
				self.selector = prevSelector;
				self.isReverted = false;
				return result;
			};
		self.last = f;
		return name === _isFunction ? f(self) : name ? (self[name] = f) : f;
	};
	_proto5.ignore = function ignore(func) {
		var prev = _context;
		_context = null;
		func(this);
		_context = prev;
	};
	_proto5.getTweens = function getTweens() {
		var a = [];
		this.data.forEach(function (e) {
			return e instanceof Context2
				? a.push.apply(a, e.getTweens())
				: e instanceof Tween &&
						!(e.parent && e.parent.data === "nested") &&
						a.push(e);
		});
		return a;
	};
	_proto5.clear = function clear() {
		this._r.length = this.data.length = 0;
	};
	_proto5.kill = function kill(revert, matchMedia2) {
		var _this4 = this;
		if (revert) {
			var tweens = this.getTweens();
			this.data.forEach(function (t) {
				if (t.data === "isFlip") {
					t.revert();
					t.getChildren(true, true, false).forEach(function (tween) {
						return tweens.splice(tweens.indexOf(tween), 1);
					});
				}
			});
			tweens
				.map(function (t) {
					return {
						g: t.globalTime(0),
						t,
					};
				})
				.sort(function (a, b) {
					return b.g - a.g || -1;
				})
				.forEach(function (o) {
					return o.t.revert(revert);
				});
			this.data.forEach(function (e) {
				return !(e instanceof Animation) && e.revert && e.revert(revert);
			});
			this._r.forEach(function (f) {
				return f(revert, _this4);
			});
			this.isReverted = true;
		} else {
			this.data.forEach(function (e) {
				return e.kill && e.kill();
			});
		}
		this.clear();
		if (matchMedia2) {
			var i = _media.indexOf(this);
			!!~i && _media.splice(i, 1);
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
			p,
			active;
		this.contexts.push(context3);
		func = context3.add("onMatch", func);
		context3.queries = conditions;
		for (p in conditions) {
			if (p === "all") {
				active = 1;
			} else {
				mq = _win$1.matchMedia(conditions[p]);
				if (mq) {
					_media.indexOf(context3) < 0 && _media.push(context3);
					(cond[p] = mq.matches) && (active = 1);
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
		this.contexts.forEach(function (c) {
			return c.kill(revert, true);
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
							uncache2,
						),
					);
			  }
			: format(
					((_plugins[property] && _plugins[property].get) || getter)(
						target,
						property,
						unit,
						uncache,
					),
			  );
	},
	quickSetter: function quickSetter(target, property, unit) {
		target = toArray(target);
		if (target.length > 1) {
			var setters = target.map(function (t) {
					return gsap.quickSetter(t, property, unit);
				}),
				l = setters.length;
			return function (value) {
				var i = l;
				while (i--) {
					setters[i](value);
				}
			};
		}
		target = target[0] || {};
		var Plugin = _plugins[property],
			cache = _getCache(target),
			p =
				(cache.harness && (cache.harness.aliases || {})[property]) || property,
			setter = Plugin
				? function (value) {
						var p2 = new Plugin();
						_quickTween._pt = 0;
						p2.init(target, unit ? value + unit : value, _quickTween, 0, [
							target,
						]);
						p2.render(1, p2);
						_quickTween._pt && _renderPropTweens(1, _quickTween);
				  }
				: cache.set(target, p);
		return Plugin
			? setter
			: function (value) {
					return setter(target, p, unit ? value + unit : value, cache, 1);
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
					vars || {},
				),
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
						this,
					),
					position,
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
			_media.forEach(function (c) {
				var cond = c.conditions,
					found,
					p;
				for (p in cond) {
					if (cond[p]) {
						cond[p] = false;
						found = 1;
					}
				}
				found && c.revert();
			}) || _onMediaChange()
		);
	},
	addEventListener: function addEventListener(type, callback) {
		var a = _listeners[type] || (_listeners[type] = []);
		~a.indexOf(callback) || a.push(callback);
	},
	removeEventListener: function removeEventListener(type, callback) {
		var a = _listeners[type],
			i = a && a.indexOf(callback);
		i >= 0 && a.splice(i, 1);
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
	},
);
var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
		var pt = plugin._pt;
		while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
			pt = pt._next;
		}
		return pt;
	},
	_addModifiers = function _addModifiers2(tween, modifiers) {
		var targets = tween._targets,
			p,
			i,
			pt;
		for (p in modifiers) {
			i = targets.length;
			while (i--) {
				pt = tween._ptLookup[i][p];
				if (pt && (pt = pt.d)) {
					if (pt._pt) {
						pt = _getPluginPropTween(pt, p);
					}
					pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
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
					var temp, p;
					if (_isString(vars)) {
						temp = {};
						_forEachName(vars, function (name2) {
							return (temp[name2] = 1);
						});
						vars = temp;
					}
					if (modifier) {
						temp = {};
						for (p in vars) {
							temp[p] = modifier(vars[p]);
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
				var p, pt, v;
				this.tween = tween;
				for (p in vars) {
					v = target.getAttribute(p) || "";
					pt = this.add(
						target,
						"setAttribute",
						(v || 0) + "",
						vars[p],
						index,
						targets,
						0,
						0,
						p,
					);
					pt.op = p;
					pt.b = v;
					this._props.push(p);
				}
			},
			render: function render(ratio, data) {
				var pt = data._pt;
				while (pt) {
					_reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
					pt = pt._next;
				}
			},
		},
		{
			name: "endArray",
			init: function init2(target, value) {
				var i = value.length;
				while (i--) {
					this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
				}
			},
		},
		_buildModifierPlugin("roundProps", _roundModifier),
		_buildModifierPlugin("modifiers"),
		_buildModifierPlugin("snap", snap),
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
			data,
		);
	},
	_renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
		return data.set(
			data.t,
			data.p,
			ratio === 1
				? data.e
				: Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u,
			data,
		);
	},
	_renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(
		ratio,
		data,
	) {
		return data.set(
			data.t,
			data.p,
			ratio
				? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u
				: data.b,
			data,
		);
	},
	_renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
		var value = data.s + data.c * ratio;
		data.set(
			data.t,
			data.p,
			~~(value + (value < 0 ? -0.5 : 0.5)) + data.u,
			data,
		);
	},
	_renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
		return data.set(data.t, data.p, ratio ? data.e : data.b, data);
	},
	_renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(
		ratio,
		data,
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
		ratio,
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
		ratio,
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
					? property.split(",").forEach(function (a) {
							return (_this.tfm[a] = _get(target, a));
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
			i,
			p;
		for (i = 0; i < props.length; i += 3) {
			props[i + 1]
				? (target[props[i]] = props[i + 2])
				: props[i + 2]
				? (style[props[i]] = props[i + 2])
				: style.removeProperty(props[i].replace(_capsExp, "-$1").toLowerCase());
		}
		if (this.tfm) {
			for (p in this.tfm) {
				cache[p] = this.tfm[p];
			}
			if (cache.svg) {
				cache.renderTransform();
				target.setAttribute("data-svg-origin", this.svgo || "");
			}
			i = _reverting();
			if (i && !i.isStart && !style[_transformProp]) {
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
			properties.split(",").forEach(function (p) {
				return saver.save(p);
			});
		return saver;
	},
	_supports3D,
	_createElement = function _createElement2(type, ns) {
		var e = _doc.createElementNS
			? _doc.createElementNS(
					(ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"),
					type,
			  )
			: _doc.createElement(type);
		return e.style ? e : _doc.createElement(type);
	},
	_getComputedProperty = function _getComputedProperty2(
		target,
		property,
		skipPrefixFallback,
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
					1,
				)) ||
			""
		);
	},
	_prefixes = "O,Moz,ms,Ms,Webkit".split(","),
	_checkPropPrefix = function _checkPropPrefix2(
		property,
		element,
		preferPrefix,
	) {
		var e = element || _tempDiv,
			s = e.style,
			i = 5;
		if (property in s && !preferPrefix) {
			return property;
		}
		property = property.charAt(0).toUpperCase() + property.substr(1);
		while (i-- && !(_prefixes[i] + property in s)) {}
		return i < 0
			? null
			: (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
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
					"http://www.w3.org/2000/svg",
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
			} catch (e) {}
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
		attributesArray,
	) {
		var i = attributesArray.length;
		while (i--) {
			if (target.hasAttribute(attributesArray[i])) {
				return target.getAttribute(attributesArray[i]);
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
	_isSVG = function _isSVG2(e) {
		return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
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
		onlySetAtEnd,
	) {
		var pt = new PropTween(
			plugin._pt,
			target,
			property,
			0,
			1,
			onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue,
		);
		plugin._pt = pt;
		pt.b = beginning;
		pt.e = end;
		plugin._props.push(property);
		return pt;
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
				toPercent ? (curValue / px) * amount : (curValue / 100) * px,
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
				: 0,
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
					: _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) +
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
		end,
	) {
		if (!start || start === "none") {
			var p = _checkPropPrefix(prop, target, 1),
				s = p && _getComputedProperty(target, p, 1);
			if (s && s !== start) {
				prop = p;
				start = s;
			} else if (prop === "borderColor") {
				start = _getComputedProperty(target, "borderTopColor");
			}
		}
		var pt = new PropTween(
				this._pt,
				target.style,
				prop,
				0,
				1,
				_renderComplexString,
			),
			index = 0,
			matchIndex = 0,
			a,
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
		pt.b = start;
		pt.e = end;
		start += "";
		end += "";
		if (end === "auto") {
			target.style[prop] = end;
			end = _getComputedProperty(target, prop) || end;
			target.style[prop] = start;
		}
		a = [start, end];
		_colorStringFilter(a);
		start = a[0];
		end = a[1];
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
							pt.e += endUnit;
						}
					}
					if (startUnit !== endUnit) {
						startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
					}
					pt._pt = {
						_next: pt._pt,
						p: chunk || matchIndex === 1 ? chunk : ",",
						//note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
						s: startNum,
						c: endNum - startNum,
						m: (color && color < 4) || prop === "zIndex" ? Math.round : 0,
					};
				}
			}
			pt.c = index < end.length ? end.substring(index, end.length) : "";
		} else {
			pt.r =
				prop === "display" && end === "none"
					? _renderNonTweeningValueOnlyAtEnd
					: _renderNonTweeningValue;
		}
		_relExp.test(end) && (pt.e = 0);
		this._pt = pt;
		return pt;
	},
	_keywordToPercent = {
		top: "0%",
		bottom: "100%",
		left: "0%",
		right: "100%",
		center: "50%",
	},
	_convertKeywordsToPercentages = function _convertKeywordsToPercentages2(
		value,
	) {
		var split = value.split(" "),
			x = split[0],
			y = split[1] || "50%";
		if (x === "top" || x === "bottom" || y === "left" || y === "right") {
			value = x;
			x = y;
			y = value;
		}
		split[0] = _keywordToPercent[x] || x;
		split[1] = _keywordToPercent[y] || y;
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
				i;
			if (props === "all" || props === true) {
				style.cssText = "";
				clearTransforms = 1;
			} else {
				props = props.split(",");
				i = props.length;
				while (--i > -1) {
					prop = props[i];
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
				var pt = (plugin._pt = new PropTween(
					plugin._pt,
					target,
					property,
					0,
					0,
					_renderClearProps,
				));
				pt.u = endValue;
				pt.pr = -10;
				pt.tween = tween;
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
		pluginToAddPropTweensTo,
	) {
		var cache = target._gsap,
			matrix = matrixArray || _getMatrix(target, true),
			xOriginOld = cache.xOrigin || 0,
			yOriginOld = cache.yOrigin || 0,
			xOffsetOld = cache.xOffset || 0,
			yOffsetOld = cache.yOffset || 0,
			a = matrix[0],
			b = matrix[1],
			c = matrix[2],
			d = matrix[3],
			tx = matrix[4],
			ty = matrix[5],
			originSplit = origin.split(" "),
			xOrigin = parseFloat(originSplit[0]) || 0,
			yOrigin = parseFloat(originSplit[1]) || 0,
			bounds,
			determinant,
			x,
			y;
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
		} else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
			x =
				xOrigin * (d / determinant) +
				yOrigin * (-c / determinant) +
				(c * ty - d * tx) / determinant;
			y =
				xOrigin * (-b / determinant) +
				yOrigin * (a / determinant) -
				(a * ty - b * tx) / determinant;
			xOrigin = x;
			yOrigin = y;
		}
		if (smooth || (smooth !== false && cache.smooth)) {
			tx = xOrigin - xOriginOld;
			ty = yOrigin - yOriginOld;
			cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
			cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
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
				xOrigin,
			);
			_addNonTweeningPT(
				pluginToAddPropTweensTo,
				cache,
				"yOrigin",
				yOriginOld,
				yOrigin,
			);
			_addNonTweeningPT(
				pluginToAddPropTweensTo,
				cache,
				"xOffset",
				xOffsetOld,
				cache.xOffset,
			);
			_addNonTweeningPT(
				pluginToAddPropTweensTo,
				cache,
				"yOffset",
				yOffsetOld,
				cache.yOffset,
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
			x,
			y,
			z,
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
			a,
			b,
			c,
			d,
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
		x =
			y =
			z =
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
				matrix,
			);
		}
		xOrigin = cache.xOrigin || 0;
		yOrigin = cache.yOrigin || 0;
		if (matrix !== _identity2DMatrix) {
			a = matrix[0];
			b = matrix[1];
			c = matrix[2];
			d = matrix[3];
			x = a12 = matrix[4];
			y = a22 = matrix[5];
			if (matrix.length === 6) {
				scaleX = Math.sqrt(a * a + b * b);
				scaleY = Math.sqrt(d * d + c * c);
				rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
				skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
				skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
				if (cache.svg) {
					x -= xOrigin - (xOrigin * a + yOrigin * c);
					y -= yOrigin - (xOrigin * b + yOrigin * d);
				}
			} else {
				a32 = matrix[6];
				a42 = matrix[7];
				a13 = matrix[8];
				a23 = matrix[9];
				a33 = matrix[10];
				a43 = matrix[11];
				x = matrix[12];
				y = matrix[13];
				z = matrix[14];
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
				angle = _atan2(-c, a33);
				rotationY = angle * _RAD2DEG;
				if (angle) {
					cos = Math.cos(-angle);
					sin = Math.sin(-angle);
					t1 = a * cos - a13 * sin;
					t2 = b * cos - a23 * sin;
					t3 = c * cos - a33 * sin;
					a43 = d * sin + a43 * cos;
					a = t1;
					b = t2;
					c = t3;
				}
				angle = _atan2(b, a);
				rotation = angle * _RAD2DEG;
				if (angle) {
					cos = Math.cos(angle);
					sin = Math.sin(angle);
					t1 = a * cos + b * sin;
					t2 = a12 * cos + a22 * sin;
					b = b * cos - a * sin;
					a22 = a22 * cos - a12 * sin;
					a = t1;
					a12 = t2;
				}
				if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
					rotationX = rotation = 0;
					rotationY = 180 - rotationY;
				}
				scaleX = _round(Math.sqrt(a * a + b * b + c * c));
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
			x -
			((cache.xPercent =
				x &&
				((!uncache && cache.xPercent) ||
					(Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0)))
				? (target.offsetWidth * cache.xPercent) / 100
				: 0) +
			px;
		cache.y =
			y -
			((cache.yPercent =
				y &&
				((!uncache && cache.yPercent) ||
					(Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0)))
				? (target.offsetHeight * cache.yPercent) / 100
				: 0) +
			px;
		cache.z = z + px;
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
					parseFloat(_convertToUnit(target, "x", value + "px", unit)),
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
			x = _ref.x,
			y = _ref.y,
			z = _ref.z,
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
			x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
			y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
			z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
		}
		if (transformPerspective !== _zeroPx) {
			transforms += "perspective(" + transformPerspective + _endParenthesis;
		}
		if (xPercent || yPercent) {
			transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
		}
		if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
			transforms +=
				z !== _zeroPx || use3D
					? "translate3d(" + x + ", " + y + ", " + z + ") "
					: "translate(" + x + ", " + y + _endParenthesis;
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
			x = _ref2.x,
			y = _ref2.y,
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
			tx = parseFloat(x),
			ty = parseFloat(y),
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
		if ((tx && !~(x + "").indexOf("px")) || (ty && !~(y + "").indexOf("px"))) {
			tx = _convertToUnit(target, "x", x, "px");
			ty = _convertToUnit(target, "y", y, "px");
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
		endValue,
	) {
		var cap = 360,
			isString2 = _isString(endValue),
			endNum =
				parseFloat(endValue) *
				(isString2 && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
			change = endNum - startNum,
			finalValue = startNum + change + "deg",
			direction,
			pt;
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
		plugin._pt = pt = new PropTween(
			plugin._pt,
			target,
			property,
			startNum,
			change,
			_renderPropWithEnd,
		);
		pt.e = finalValue;
		pt.u = "deg";
		plugin._props.push(property);
		return pt;
	},
	_assign = function _assign2(target, source) {
		for (var p in source) {
			target[p] = source[p];
		}
		return target;
	},
	_addRawTransformPTs = function _addRawTransformPTs2(
		plugin,
		transforms,
		target,
	) {
		var startCache = _assign({}, target._gsap),
			exclude = "perspective,force3D,transformOrigin,svgOrigin",
			style = target.style,
			endCache,
			p,
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
		for (p in _transformProps) {
			startValue = startCache[p];
			endValue = endCache[p];
			if (startValue !== endValue && exclude.indexOf(p) < 0) {
				startUnit = getUnit(startValue);
				endUnit = getUnit(endValue);
				startNum =
					startUnit !== endUnit
						? _convertToUnit(target, p, startValue, endUnit)
						: parseFloat(startValue);
				endNum = parseFloat(endValue);
				plugin._pt = new PropTween(
					plugin._pt,
					endCache,
					p,
					startNum,
					endNum - startNum,
					_renderCSSProp,
				);
				plugin._pt.u = endUnit || 0;
				plugin._props.push(p);
			}
		}
		_assign(endCache, startCache);
	};
_forEachName("padding,margin,Width,Radius", function (name, index) {
	var t = "Top",
		r = "Right",
		b = "Bottom",
		l = "Left",
		props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(
			function (side) {
				return index < 2 ? name + side : "border" + side + name;
			},
		);
	_specialProps[index > 1 ? "border" + name : name] = function (
		plugin,
		target,
		property,
		endValue,
		tween,
	) {
		var a, vars;
		if (arguments.length < 4) {
			a = props.map(function (prop) {
				return _get(plugin, prop, property);
			});
			vars = a.join(" ");
			return vars.split(a[0]).length === 5 ? a[0] : vars;
		}
		a = (endValue + "").split(" ");
		vars = {};
		props.forEach(function (prop, i) {
			return (vars[prop] = a[i] = a[i] || a[((i - 1) / 2) | 0]);
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
			p,
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
		for (p in vars) {
			if (p === "autoRound") {
				continue;
			}
			endValue = vars[p];
			if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
				continue;
			}
			type = typeof endValue;
			specialProp = _specialProps[p];
			if (type === "function") {
				endValue = endValue.call(tween, index, target, targets);
				type = typeof endValue;
			}
			if (type === "string" && ~endValue.indexOf("random(")) {
				endValue = _replaceRandom(endValue);
			}
			if (specialProp) {
				specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
			} else if (p.substr(0, 2) === "--") {
				startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
				endValue += "";
				_colorExp.lastIndex = 0;
				if (!_colorExp.test(startValue)) {
					startUnit = getUnit(startValue);
					endUnit = getUnit(endValue);
				}
				endUnit
					? startUnit !== endUnit &&
					  (startValue =
							_convertToUnit(target, p, startValue, endUnit) + endUnit)
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
					p,
				);
				props.push(p);
				inlineProps.push(p, 0, style[p]);
			} else if (type !== "undefined") {
				if (startAt && p in startAt) {
					startValue =
						typeof startAt[p] === "function"
							? startAt[p].call(tween, index, target, targets)
							: startAt[p];
					_isString(startValue) &&
						~startValue.indexOf("random(") &&
						(startValue = _replaceRandom(startValue));
					getUnit(startValue + "") ||
						(startValue += _config.units[p] || getUnit(_get(target, p)) || "");
					(startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
				} else {
					startValue = _get(target, p);
				}
				startNum = parseFloat(startValue);
				relative =
					type === "string" &&
					endValue.charAt(1) === "=" &&
					endValue.substr(0, 2);
				relative && (endValue = endValue.substr(2));
				endNum = parseFloat(endValue);
				if (p in _propertyAliases) {
					if (p === "autoAlpha") {
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
							!endNum,
						);
					}
					if (p !== "scale" && p !== "transform") {
						p = _propertyAliases[p];
						~p.indexOf(",") && (p = p.split(",")[0]);
					}
				}
				isTransformRelated = p in _transformProps;
				if (isTransformRelated) {
					this.styles.save(p);
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
							-1,
						);
						transformPropTween.dep = 1;
					}
					if (p === "scale") {
						this._pt = new PropTween(
							this._pt,
							cache,
							"scaleY",
							cache.scaleY,
							(relative
								? _parseRelative(cache.scaleY, relative + endNum)
								: endNum) - cache.scaleY || 0,
							_renderCSSProp,
						);
						this._pt.u = 0;
						props.push("scaleY", p);
						p += "X";
					} else if (p === "transformOrigin") {
						inlineProps.push(
							_transformOriginProp,
							0,
							style[_transformOriginProp],
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
									endUnit,
								);
							_addNonTweeningPT(
								this,
								style,
								p,
								_firstTwoOnly(startValue),
								_firstTwoOnly(endValue),
							);
						}
						continue;
					} else if (p === "svgOrigin") {
						_applySVGOrigin(target, endValue, 1, smooth, 0, this);
						continue;
					} else if (p in _rotationalProperties) {
						_addRotationalPropTween(
							this,
							cache,
							p,
							startNum,
							relative
								? _parseRelative(startNum, relative + endValue)
								: endValue,
						);
						continue;
					} else if (p === "smoothOrigin") {
						_addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
						continue;
					} else if (p === "force3D") {
						cache[p] = endValue;
						continue;
					} else if (p === "transform") {
						_addRawTransformPTs(this, endValue, target);
						continue;
					}
				} else if (!(p in style)) {
					p = _checkPropPrefix(p) || p;
				}
				if (
					isTransformRelated ||
					((endNum || endNum === 0) &&
						(startNum || startNum === 0) &&
						!_complexExp.test(endValue) &&
						p in style)
				) {
					startUnit = (startValue + "").substr((startNum + "").length);
					endNum || (endNum = 0);
					endUnit =
						getUnit(endValue) ||
						(p in _config.units ? _config.units[p] : startUnit);
					startUnit !== endUnit &&
						(startNum = _convertToUnit(target, p, startValue, endUnit));
					this._pt = new PropTween(
						this._pt,
						isTransformRelated ? cache : style,
						p,
						startNum,
						(relative ? _parseRelative(startNum, relative + endNum) : endNum) -
							startNum,
						!isTransformRelated &&
						(endUnit === "px" || p === "zIndex") &&
						vars.autoRound !== false
							? _renderRoundedCSSProp
							: _renderCSSProp,
					);
					this._pt.u = endUnit || 0;
					if (startUnit !== endUnit && endUnit !== "%") {
						this._pt.b = startValue;
						this._pt.r = _renderCSSPropWithBeginning;
					}
				} else if (!(p in style)) {
					if (p in target) {
						this.add(
							target,
							p,
							startValue || target[p],
							relative ? relative + endValue : endValue,
							index,
							targets,
						);
					} else if (p !== "parseTransform") {
						_missingPlugin(p, endValue);
						continue;
					}
				} else {
					_tweenComplexCSSString.call(
						this,
						target,
						p,
						startValue,
						relative ? relative + endValue : endValue,
					);
				}
				isTransformRelated ||
					(p in style
						? inlineProps.push(p, 0, style[p])
						: inlineProps.push(p, 1, startValue || target[p]));
				props.push(p);
			}
		}
		hasPriority && _sortPropTweensByPriority(this);
	},
	render: function render2(ratio, data) {
		if (data.tween._time || !_reverting()) {
			var pt = data._pt;
			while (pt) {
				pt.r(ratio, pt.d);
				pt = pt._next;
			}
		} else {
			data.styles.revert();
		}
	},
	get: _get,
	aliases: _propertyAliases,
	getSetter: function getSetter(target, property, plugin) {
		var p = _propertyAliases[property];
		p && p.indexOf(",") < 0 && (property = p);
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
		},
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
	"0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY",
);
_forEachName(
	"x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",
	function (name) {
		_config.units[name] = "px";
	},
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
				this.focusableElements,
			)[0];
			const focusableContent = this.modal.querySelectorAll(
				this.focusableElements,
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
						this.modal.querySelectorAll("form").forEach((f) => f.reset());
					},
				},
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
				},
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
				},
			);
		});
		this.preventBodyLock = options.preventBodyLock ? true : false;
		this.modal = modal;
		this.overlay = this.modal.parentNode;
		this.close = this.modal.querySelector(".modal-closer");
		this.id = this.modal.getAttribute("id");
		this.openers = document.querySelectorAll(
			'[data-modal-opener="' + this.id + '"]',
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
				"Не добавлена кнопка открытия модального окна, либо в ней не прописан аттр-т: data-modal-opener={modal-id} ",
			);
		}
	}
}
function limitStr(str, n) {
	if (str.length > n) {
		return str.slice(0, n) + "...";
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
		{ display: "block", opacity: 1, duration: 0.4 },
	);
	tl.fromTo(
		".mobile-menu__wrapper",
		{ x: "-100vw", opacity: 0 },
		{ opacity: 1, x: 0, duration: 0.4 },
		"-=.2",
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
					},
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
					},
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
	if (Array.isArray(keys)) return pick(obj, (_, k) => keys.includes(k));
	return Object.entries(obj).reduce((acc, _ref) => {
		let [k, v] = _ref;
		if (keys(v, k)) acc[k] = v;
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
function objectIncludes(b, a) {
	if (a === b) return true;
	const arrA = Array.isArray(a),
		arrB = Array.isArray(b);
	let i;
	if (arrA && arrB) {
		if (a.length != b.length) return false;
		for (i = 0; i < a.length; i++)
			if (!objectIncludes(a[i], b[i])) return false;
		return true;
	}
	if (arrA != arrB) return false;
	if (a && b && typeof a === "object" && typeof b === "object") {
		const dateA = a instanceof Date,
			dateB = b instanceof Date;
		if (dateA && dateB) return a.getTime() == b.getTime();
		if (dateA != dateB) return false;
		const regexpA = a instanceof RegExp,
			regexpB = b instanceof RegExp;
		if (regexpA && regexpB) return a.toString() == b.toString();
		if (regexpA != regexpB) return false;
		const keys = Object.keys(a);
		for (i = 0; i < keys.length; i++)
			if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
		for (i = 0; i < keys.length; i++)
			if (!objectIncludes(b[keys[i]], a[keys[i]])) return false;
		return true;
	} else if (a && b && typeof a === "function" && typeof b === "function") {
		return a.toString() === b.toString();
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
			0,
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
				...pick(mask, (_, k) => !k.startsWith("_")),
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
				", appropriate module needs to be imported manually before creating mask.",
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
	_onKeydown(e) {
		if (
			this._handlers.redo &&
			((e.keyCode === KEY_Z && e.shiftKey && (e.metaKey || e.ctrlKey)) ||
				(e.keyCode === KEY_Y && e.ctrlKey))
		) {
			e.preventDefault();
			return this._handlers.redo(e);
		}
		if (
			this._handlers.undo &&
			e.keyCode === KEY_Z &&
			(e.metaKey || e.ctrlKey)
		) {
			e.preventDefault();
			return this._handlers.undo(e);
		}
		if (!e.isComposing) this._handlers.selectionChange(e);
	}
	_onBeforeinput(e) {
		if (e.inputType === "historyUndo" && this._handlers.undo) {
			e.preventDefault();
			return this._handlers.undo(e);
		}
		if (e.inputType === "historyRedo" && this._handlers.redo) {
			e.preventDefault();
			return this._handlers.redo(e);
		}
	}
	_onCompositionEnd(e) {
		this._handlers.input(e);
	}
	_onInput(e) {
		if (!e.isComposing) this._handlers.input(e);
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
			this.states.length - 1,
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
	_fireEvent(ev, e) {
		const listeners = this._listeners[ev];
		if (!listeners) return;
		listeners.forEach((l) => l(e));
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
				"Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.",
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
			this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT),
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
	_onInput(e) {
		this._inputEvent = e;
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
			},
		).offset;
		const removeDirection =
			oldRawValue === this.masked.rawInputValue
				? details.removeDirection
				: DIRECTION.NONE;
		let cursorPos = this.masked.nearestInputPos(
			details.startChangePos + offset,
			removeDirection,
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
			details,
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
			fromPos,
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
					for (let i = 0; i < details.rawInserted.length; ++i) {
						checkTail.unshift(this.displayValue.length - details.tailShift);
					}
				}
				let tailDetails = this.appendTail(checkTail);
				appended =
					tailDetails.rawInserted.length === checkTail.toString().length;
				if (!(appended && tailDetails.inserted) && this.overwrite === "shift") {
					this.state = beforeTailState;
					consistentTail = checkTail.state;
					for (let i = 0; i < details.rawInserted.length; ++i) {
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
			const d = this._appendChar(str[ci], flags, checkTail);
			if (!d.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail))
				break;
			details.aggregate(d);
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
			this.prepare ? this.prepare(str, this, flags) : str,
		);
	}
	/** Prepares each char before mask processing */
	doPrepareChar(str, flags) {
		if (flags === void 0) {
			flags = {};
		}
		return ChangeDetails.normalize(
			this.prepareChar ? this.prepareChar(str, this, flags) : str,
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
					: removeDirection,
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
							}),
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
						}),
					);
			} else {
				details.aggregate(
					masked.append(chunk.toString(), {
						tail: true,
					}),
				);
			}
		}
		return details;
	}
	get state() {
		return {
			chunks: this.chunks.map((c) => c.state),
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
	set state(s) {
		Object.assign(this, s);
	}
	pushState() {
		this._log.push(this.state);
	}
	popState() {
		const s = this._log.pop();
		if (s) this.state = s;
		return s;
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
				DIRECTION.FORCE_LEFT,
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
				DIRECTION.FORCE_RIGHT,
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
				opts == null ? void 0 : opts.definitions,
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
		for (let i = 0; i < pattern.length; ++i) {
			if (this.blocks) {
				const p = pattern.slice(i);
				const bNames = Object.keys(this.blocks).filter(
					(bName2) => p.indexOf(bName2) === 0,
				);
				bNames.sort((a, b) => b.length - a.length);
				const bName = bNames[0];
				if (bName) {
					const { expose, repeat, ...bOpts } = normalizeOpts(
						this.blocks[bName],
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
									blockOpts,
									/* TODO */
							  )
							: createMask(blockOpts);
					if (maskedBlock) {
						this._blocks.push(maskedBlock);
						if (expose) this.exposeBlock = maskedBlock;
						if (!this._maskedBlocks[bName]) this._maskedBlocks[bName] = [];
						this._maskedBlocks[bName].push(this._blocks.length - 1);
					}
					i += bName.length - 1;
					continue;
				}
			}
			let char = pattern[i];
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
				++i;
				char = pattern[i];
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
			_blocks: this._blocks.map((b) => b.state),
		};
	}
	set state(state) {
		if (!state) {
			this.reset();
			return;
		}
		const { _blocks, ...maskedState } = state;
		this._blocks.forEach((b, bi) => (b.state = _blocks[bi]));
		super.state = maskedState;
	}
	reset() {
		super.reset();
		this._blocks.forEach((b) => b.reset());
	}
	get isComplete() {
		return this.exposeBlock
			? this.exposeBlock.isComplete
			: this._blocks.every((b) => b.isComplete);
	}
	get isFilled() {
		return this._blocks.every((b) => b.isFilled);
	}
	get isFixed() {
		return this._blocks.every((b) => b.isFixed);
	}
	get isOptional() {
		return this._blocks.every((b) => b.isOptional);
	}
	doCommit() {
		this._blocks.forEach((b) => b.doCommit());
		super.doCommit();
	}
	get unmaskedValue() {
		return this.exposeBlock
			? this.exposeBlock.unmaskedValue
			: this._blocks.reduce((str, b) => (str += b.unmaskedValue), "");
	}
	set unmaskedValue(unmaskedValue) {
		if (this.exposeBlock) {
			const tail = this.extractTail(
				this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
					this.exposeBlock.displayValue.length,
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
			  this._blocks.reduce((str, b) => (str += b.value), "");
	}
	set value(value) {
		if (this.exposeBlock) {
			const tail = this.extractTail(
				this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) +
					this.exposeBlock.displayValue.length,
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
					this.exposeBlock.displayValue.length,
			);
			this.exposeBlock.typedValue = value;
			this.appendTail(tail);
			this.doCommit();
		} else super.typedValue = value;
	}
	get displayValue() {
		return this._blocks.reduce((str, b) => (str += b.displayValue), "");
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
			const d = this._blocks[bi]._appendEager();
			if (!d.inserted) break;
			details.aggregate(d);
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
		this._forEachBlocksInRange(fromPos, toPos, (b, bi, bFromPos, bToPos) => {
			const blockChunk = b.extractTail(bFromPos, bToPos);
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
		this._forEachBlocksInRange(fromPos, toPos, (b, _, fromPos2, toPos2) => {
			input += b.extractInput(fromPos2, toPos2, flags);
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
		this._blocks.slice(startBlockIndex, endBlockIndex).forEach((b) => {
			if (!b.lazy || toBlockIndex != null) {
				var _blocks2;
				details.aggregate(
					b._appendPlaceholder(
						(_blocks2 = b._blocks) == null ? void 0 : _blocks2.length,
					),
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
			.reduce((pos, b) => (pos += b.displayValue.length), 0);
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
				fromBlockEndPos,
			);
			if (toBlockIter && !isSameBlock) {
				for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
					fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
				}
				fn(
					this._blocks[toBlockIter.index],
					toBlockIter.index,
					0,
					toBlockIter.offset,
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
		this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
			removeDetails.aggregate(b.remove(bFromPos, bToPos));
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
		this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
			total += b.totalInputPositions(bFromPos, bToPos);
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
		this._forEachBlocksInRange(0, this.displayValue.length, (b) =>
			details.aggregate(b.pad(flags)),
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
			for (let i = 0; i < padLength; ++i) {
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
			}),
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
				? opts.mask.map((m) => {
						const { expose, ...maskOpts } = normalizeOpts(m);
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
				this.currentMask._appendChar(ch, this.currentMaskFlags(flags)),
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
			tail,
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
				: super.appendTail(tail),
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
		let [s, details] = super.doPrepare(str, flags);
		if (this.currentMask) {
			let currentDetails;
			[s, currentDetails] = super.doPrepare(s, this.currentMaskFlags(flags));
			details = details.aggregate(currentDetails);
		}
		return [s, details];
	}
	doPrepareChar(str, flags) {
		if (flags === void 0) {
			flags = {};
		}
		let [s, details] = super.doPrepareChar(str, flags);
		if (this.currentMask) {
			let currentDetails;
			[s, currentDetails] = super.doPrepareChar(
				s,
				this.currentMaskFlags(flags),
			);
			details = details.aggregate(currentDetails);
		}
		return [s, details];
	}
	reset() {
		var _this$currentMask;
		(_this$currentMask = this.currentMask) == null || _this$currentMask.reset();
		this.compiledMasks.forEach((m) => m.reset());
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
				: _this$currentMask2.isComplete,
		);
	}
	get isFilled() {
		var _this$currentMask3;
		return Boolean(
			(_this$currentMask3 = this.currentMask) == null
				? void 0
				: _this$currentMask3.isFilled,
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
			compiledMasks: this.compiledMasks.map((m) => m.state),
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
			this.compiledMasks.forEach((m, mi) => (m.state = compiledMasks[mi]));
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
			? this.compiledMasks.every((m, mi) => {
					if (!mask[mi]) return;
					const { mask: oldMask, ...restOpts } = mask[mi];
					return objectIncludes(m, restOpts) && m.maskEquals(oldMask);
			  })
			: super.maskEquals(mask);
	}
	typedValueEquals(value) {
		var _this$currentMask5;
		return Boolean(
			(_this$currentMask5 = this.currentMask) == null
				? void 0
				: _this$currentMask5.typedValueEquals(value),
		);
	}
}
MaskedDynamic.DEFAULTS = {
	...Masked.DEFAULTS,
	dispatch: (appended, masked, flags, tail) => {
		if (!masked.compiledMasks.length) return;
		const inputValue = masked.rawInputValue;
		const inputs = masked.compiledMasks.map((m, index) => {
			const isCurrent = masked.currentMask === m;
			const startInputPos = isCurrent
				? m.displayValue.length
				: m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT);
			if (m.rawInputValue !== inputValue) {
				m.reset();
				m.append(inputValue, {
					raw: true,
				});
			} else if (!isCurrent) {
				m.remove(startInputPos);
			}
			m.append(appended, masked.currentMaskFlags(flags));
			m.appendTail(tail);
			return {
				index,
				weight: m.rawInputValue.length,
				totalInputPositions: m.totalInputPositions(
					0,
					Math.max(
						startInputPos,
						m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT),
					),
				),
			};
		});
		inputs.sort(
			(i1, i2) =>
				i2.weight - i1.weight ||
				i2.totalInputPositions - i1.totalInputPositions,
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
			const lengths = enum_.map((e) => e.length);
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
			this.value.length,
		);
		const matches = this.enum.filter((e) =>
			this.matchValue(e, this.unmaskedValue + ch, matchFrom),
		);
		if (matches.length) {
			if (matches.length === 1) {
				this._forEachBlocksInRange(0, this.value.length, (b, bi) => {
					const mch = matches[0][bi];
					if (bi >= this.value.length || mch === b.value) return;
					b.reset();
					b._appendChar(mch, flags);
				});
			}
			const d = super._appendCharRaw(matches[0][this.value.length], flags);
			if (matches.length === 1) {
				matches[0]
					.slice(this.unmaskedValue.length)
					.split("")
					.forEach((mch) => d.aggregate(super._appendCharRaw(mch)));
			}
			return d;
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
			this.value.length,
		);
		let pos;
		for (pos = fromPos; pos >= 0; --pos) {
			const matches = this.enum.filter((e) =>
				this.matchValue(e, this.value.slice(matchFrom, pos), matchFrom),
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
			"g",
		);
		this._thousandsSeparatorRegExp = new RegExp(
			escapeRegExp(this.thousandsSeparator),
			"g",
		);
	}
	_removeThousandsSeparators(value) {
		return value.replace(this._thousandsSeparatorRegExp, "");
	}
	_insertThousandsSeparators(value) {
		const parts = value.split(this.radix);
		parts[0] = parts[0].replace(
			/\B(?=(\d{3})+(?!\d))/g,
			this.thousandsSeparator,
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
					: ch,
			),
			flags,
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
			true,
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
			super.extractInput(fromPos, toPos, flags),
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
						this.radix,
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
				searchFrom,
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
			valueBeforePos.length,
		);
		this._value = this._insertThousandsSeparators(
			this._removeThousandsSeparators(valueBeforePos + valueAfterPos),
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
			(match, sign, zeros, num) => sign + num,
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
			this._normalizeZeros(this.value),
		).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
	}
	set unmaskedValue(unmaskedValue) {
		super.unmaskedValue = unmaskedValue;
	}
	get typedValue() {
		return this.parse(this.unmaskedValue, this);
	}
	set typedValue(n) {
		this.rawInputValue = this.format(n, this).replace(
			MaskedNumber.UNMASKED_RADIX,
			this.radix,
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
	format: (n) =>
		n.toLocaleString("en-US", {
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
		masked.runIsolated((m) => {
			m[from] = value;
			return m[to];
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
					this.repeatFrom,
				),
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
							this.displayValue.length,
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
			0,
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
			i,
			wrapper;
		for (i = 0; i < length; i++) {
			wrapper = document.createElement("div");
			wrapper.setAttribute("class", "table-wrapper");
			tables[i].parentNode.insertBefore(wrapper, tables[i]);
			wrapper.appendChild(tables[i]);
		}
	}
});
const items = document.querySelectorAll(".rate__wrapper input");
if (items.length) {
	const fillStars = (index) => {
		items.forEach((item, i) => {
			if (i <= index) {
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
	for (let i = 4; i >= 0; i--) {
		if (items[i].checked) {
			fillStars(i);
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
	'[data-component="image-comparison-slider"]',
);
if (imageComparisonSliders.length) {
	let setSliderstate = function (e, element) {
			const sliderRange = element.querySelector(
				"[data-image-comparison-range]",
			);
			if (e.type === "input") {
				sliderRange.classList.add("image-comparison__range--active");
				return;
			}
			sliderRange.classList.remove("image-comparison__range--active");
			element.removeEventListener("mousemove", moveSliderThumb);
		},
		moveSliderThumb = function (evt) {
			const target = evt.target.closest(
				"[data-component='image-comparison-slider']",
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
				"[data-image-comparison-overlay]",
			);
			slider2.style.left = `${value}%`;
			imageWrapperOverlay.style.width = `${value}%`;
			element.addEventListener("mousemove", moveSliderThumb);
			setSliderstate(evt, element);
		},
		init4 = function (element) {
			console.log("inited");
			const sliderRange = element.querySelector(
				"[data-image-comparison-range]",
			);
			if ("ontouchstart" in window === false) {
				sliderRange.addEventListener("mouseup", (evt) =>
					setSliderstate(evt, element),
				);
				sliderRange.addEventListener("mousedown", moveSliderThumb);
			}
			sliderRange.addEventListener("input", (evt) =>
				moveSliderRange(evt, element),
			);
			sliderRange.addEventListener("change", (evt) =>
				moveSliderRange(evt, element),
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
