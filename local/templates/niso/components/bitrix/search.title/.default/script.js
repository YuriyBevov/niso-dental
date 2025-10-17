function JCTitleSearch(arParams) {
  var _this = this;

  this.arParams = {
    AJAX_PAGE: arParams.AJAX_PAGE,
    CONTAINER_ID: arParams.CONTAINER_ID,
    INPUT_ID: arParams.INPUT_ID,
    MIN_QUERY_LEN: parseInt(arParams.MIN_QUERY_LEN, 10),
  };
  if (arParams.WAIT_IMAGE) {
    this.arParams.WAIT_IMAGE = arParams.WAIT_IMAGE;
  }

  if (this.arParams.MIN_QUERY_LEN <= 0) {
    this.arParams.MIN_QUERY_LEN = 1;
  }

  this.cache = [];
  this.cache_key = null;
  this.startText = "";
  this.running = false;
  this.runningCall = false;
  this.currentIndex = -1;
  this.RESULT = null;
  this.CONTAINER = null;
  this.INPUT = null;
  this.WAIT = null;

  this.ShowResult = function (result) {
    if (BX.type.isString(result)) {
      _this.RESULT.innerHTML = result;
    }

    _this.RESULT.style.display =
      _this.RESULT.innerHTML === "" ? "none" : "block";

    _this.adjustResultNode();
  };

  this.onKeyPress = function (keyCode) {
    const items = BX.findChildren(
      _this.RESULT,
      { class: "search-result__item" },
      true
    );
    if (!items || !items.length) return false;

    switch (keyCode) {
      case 27: // ESC — закрыть окно
        _this.RESULT.style.display = "none";
        _this.currentIndex = -1;
        _this.UnSelectAll();
        return true;

      case 40: // стрелка вниз
        if (_this.RESULT.style.display == "none") {
          _this.RESULT.style.display = "block";
        }

        _this.UnSelectAll();
        _this.currentIndex++;
        if (_this.currentIndex >= items.length) _this.currentIndex = 0;
        items[_this.currentIndex].classList.add("search-result__item--active");
        return true;

      case 38: // стрелка вверх
        if (_this.RESULT.style.display == "none") {
          _this.RESULT.style.display = "block";
        }

        _this.UnSelectAll();
        _this.currentIndex--;
        if (_this.currentIndex < 0) _this.currentIndex = items.length - 1;
        items[_this.currentIndex].classList.add("search-result__item--active");
        return true;

      case 13: // Enter
        if (_this.RESULT.style.display == "block" && _this.currentIndex >= 0) {
          const link = BX.findChild(
            items[_this.currentIndex],
            { tag: "a" },
            true
          );
          if (link) {
            window.location = link.href;
            return true;
          }
        }
        return false;
    }

    return false;
  };

  this.UnSelectAll = function () {
    const items = BX.findChildren(
      _this.RESULT,
      { class: "search-result__item" },
      true
    );
    if (items) {
      items.forEach((item) =>
        item.classList.remove("search-result__item--active")
      );
    }
  };

  this.EnableMouseEvents = function () {
    const items = BX.findChildren(
      _this.RESULT,
      { class: "search-result__item" },
      true
    );
    if (items) {
      items.forEach((item, index) => {
        item.onmouseover = function () {
          _this.UnSelectAll();
          this.classList.add("search-result__item--active");
          _this.currentIndex = index;
        };
        item.onmouseout = function () {
          this.classList.remove("search-result__item--active");
          _this.currentIndex = -1;
        };
      });
    }
  };

  this.onTimeout = function () {
    _this.onChange(function () {
      setTimeout(_this.onTimeout, 500);
    });
  };

  this.onChange = function (callback) {
    if (_this.running) {
      _this.runningCall = true;
      return;
    }
    _this.running = true;

    if (
      _this.INPUT.value != _this.oldValue &&
      _this.INPUT.value != _this.startText
    ) {
      _this.oldValue = _this.INPUT.value;
      if (_this.INPUT.value.length >= _this.arParams.MIN_QUERY_LEN) {
        _this.cache_key = _this.arParams.INPUT_ID + "|" + _this.INPUT.value;
        if (_this.cache[_this.cache_key] == null) {
          if (_this.WAIT) {
            var pos = BX.pos(_this.INPUT);
            var height = pos.bottom - pos.top - 2;
            _this.WAIT.style.top = pos.top + 1 + "px";
            _this.WAIT.style.height = height + "px";
            _this.WAIT.style.width = height + "px";
            _this.WAIT.style.left = pos.right - height + 2 + "px";
            _this.WAIT.style.display = "block";
          }

          BX.ajax.post(
            _this.arParams.AJAX_PAGE,
            {
              ajax_call: "y",
              INPUT_ID: _this.arParams.INPUT_ID,
              q: _this.INPUT.value,
              l: _this.arParams.MIN_QUERY_LEN,
            },
            function (result) {
              _this.cache[_this.cache_key] = result;
              _this.ShowResult(result);
              _this.currentIndex = -1;
              _this.EnableMouseEvents();
              if (_this.WAIT) {
                _this.WAIT.style.display = "none";
              }

              if (!!callback) callback();
              _this.running = false;

              if (_this.runningCall) {
                _this.runningCall = false;
                _this.onChange();
              }
            }
          );

          return;
        }

        _this.ShowResult(_this.cache[_this.cache_key]);
        _this.currentIndex = -1;
        _this.EnableMouseEvents();
      } else {
        _this.RESULT.style.display = "none";
        _this.currentIndex = -1;
        _this.UnSelectAll();
      }
    }

    if (!!callback) callback();
    _this.running = false;
  };

  this.onFocusLost = function () {
    setTimeout(function () {
      _this.RESULT.style.display = "none";
    }, 250);
  };

  this.onFocusGain = function () {
    if (_this.RESULT.innerHTML.length > 0) {
      _this.ShowResult();
    }
  };

  this.onKeyDown = function (e) {
    if (!e) e = window.event;
    if (_this.RESULT.style.display == "block" && _this.onKeyPress(e.keyCode)) {
      return BX.PreventDefault(e);
    }
  };

  this.adjustResultNode = function () {
    if (
      !(
        BX.type.isElementNode(_this.RESULT) &&
        BX.type.isElementNode(_this.CONTAINER)
      )
    ) {
      return;
    }

    var pos = BX.pos(_this.CONTAINER);
    _this.RESULT.style.position = "absolute";
    _this.RESULT.style.top = pos.bottom + 10 + "px";
    _this.RESULT.style.left = pos.left + "px";
    _this.RESULT.style.width = pos.width + "px";
  };

  this.Init = function () {
    this.CONTAINER = document.getElementById(this.arParams.CONTAINER_ID);
    this.RESULT = document.body.appendChild(document.createElement("DIV"));
    this.RESULT.className = "search-result__modal";
    this.RESULT.style.display = "none";
    this.INPUT = document.getElementById(this.arParams.INPUT_ID);
    this.startText = this.INPUT.value;
    this.oldValue = this.INPUT.value;

    BX.bind(this.INPUT, "focus", function () {
      _this.onFocusGain();
    });
    BX.bind(this.INPUT, "blur", function () {
      _this.onFocusLost();
    });
    this.INPUT.onkeydown = this.onKeyDown;

    if (this.arParams.WAIT_IMAGE) {
      this.WAIT = document.body.appendChild(document.createElement("DIV"));
      this.WAIT.style.backgroundImage =
        "url('" + this.arParams.WAIT_IMAGE + "')";
      this.WAIT.style.display = "none";
      this.WAIT.style.position = "absolute";
      this.WAIT.style.zIndex = "1100";
    }

    BX.bind(this.INPUT, "bxchange", function () {
      _this.onChange();
    });
  };

  BX.ready(function () {
    _this.Init(arParams);
  });
}
