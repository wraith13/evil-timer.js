var EvilTimer;
(function (EvilTimer) {
    var _a;
    var gThis = ((_a = self !== null && self !== void 0 ? self : window) !== null && _a !== void 0 ? _a : global);
    var originalSetTimeout = setTimeout;
    var originalSetInteral = setInterval;
    var styleReplaceMode = "auto";
    var originalEmbeddedStyles = null;
    var originalStyleRules = null;
    // let originalStyleSheets:string[] = null;
    var speedRate = 1.0;
    var isPaused = false;
    var susppendedTasks = [];
    EvilTimer.restore = function () {
        isPaused = false;
        susppendedTasks.forEach(function (i) { return i(); });
        susppendedTasks = [];
    };
    EvilTimer.pause = function () { return isPaused = true; };
    var replaceAnimationDuration = function (css) { return css.replace(/(animation-duration:\s*)([0-9.]+)([a-z]*\s*;)/gmu, function (_m, p1, p2, p3) { return "".concat(p1).concat(parseFloat(p2) / speedRate).concat(p3); }); };
    var updateEmbeddedStyle = function () {
        var styles = Array.from(document.getElementsByTagName("style"));
        if (null === originalEmbeddedStyles) {
            originalEmbeddedStyles = styles.map(function (i) { return i.innerHTML; });
        }
        styles.forEach(function (i, ix) {
            var _a;
            if (0 <= ((_a = originalEmbeddedStyles[ix]) !== null && _a !== void 0 ? _a : "").indexOf("animation-duration")) {
                i.innerHTML = replaceAnimationDuration(originalEmbeddedStyles[ix]);
            }
        });
    };
    var updateStyleRules = function () {
        var styles = Array.from(document.styleSheets);
        if (null === originalStyleRules) {
            originalStyleRules = styles.map(function (stylesheet) {
                try {
                    var rules = Array.from(stylesheet.cssRules).map(function (rule) { return rule.cssText; });
                    if (0 < rules.filter(function (rule) { return 0 <= (rule !== null && rule !== void 0 ? rule : "").indexOf("animation-duration"); }).length) {
                        return rules;
                    }
                }
                catch (_a) {
                    console.error("Can not read: ".concat(stylesheet.href));
                }
                return null;
            });
        }
        styles.forEach(function (stylesheet, ix) {
            if (null !== originalStyleRules[ix]) {
                while (0 < stylesheet.cssRules.length) {
                    stylesheet.deleteRule(0);
                }
                originalStyleRules[ix].forEach(function (rule) { return stylesheet.insertRule(replaceAnimationDuration(rule)); });
            }
        });
    };
    // const updateStyleSheets = () =>
    // {
    //     const styles = <CSSStyleSheet[]>Array.from(document.styleSheets);
    //     if (null === originalStyleSheets)
    //     {
    //         originalStyleSheets = styles.map
    //         (
    //             stylesheet =>
    //             {
    //                 try
    //                 {
    //                     const rules = Array.from(stylesheet.cssRules).map(rule => rule.cssText).join(" ");
    //                     if (0 <= rules.indexOf("animation-duration"))
    //                     {
    //                         return rules;
    //                     }
    //                 }
    //                 catch
    //                 {
    //                     console.error(`Can not read: ${stylesheet.href}`);
    //                 }
    //                 return null;
    //             }
    //         );
    //     }
    //     styles.forEach
    //     (
    //         (stylesheet, ix) =>
    //         {
    //             if (null !== originalStyleSheets[ix])
    //             {
    //                 (<any>stylesheet).replaceSync(replaceAnimationDuration(originalStyleSheets[ix]));
    //             }
    //         }
    //     );
    // };
    // const isChromium = () => !! (<any>window).chrome;
    var isEmbeddedStyleOnly = function () {
        return Array.from(document.getElementsByTagName("link"))
            .filter(function (i) { return "stylesheet" === i.rel; }).length <= 0;
    };
    EvilTimer.getStyleReplaceMode = function () {
        switch (styleReplaceMode) {
            case "auto":
                // if (isChromium())
                // {
                //     return "sheets";
                // }
                if (isEmbeddedStyleOnly()) {
                    return "embedded";
                }
                return "rules";
            default:
                return styleReplaceMode;
        }
    };
    EvilTimer.setStyleReplaceMode = function (mode) {
        switch (mode) {
            case "auto":
            case "disabled":
            case "embedded":
            case "rules":
                // case "sheets":
                styleReplaceMode = mode;
                break;
            default:
                styleReplaceMode = "auto";
                break;
        }
    };
    EvilTimer.setSpeedRate = function (rate) {
        speedRate = Math.max(Math.min(rate, 1000), 0.001);
        switch (EvilTimer.getStyleReplaceMode()) {
            case "embedded":
                updateEmbeddedStyle();
                break;
            case "rules":
                updateStyleRules();
                break;
            // case "sheets":
            //     updateStyleSheets();
            //     break;
        }
    };
    EvilTimer.setTimeoutEx = function (callback, wait) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return originalSetTimeout(function () {
            if (isPaused) {
                susppendedTasks.push(function () { return callback.apply(void 0, args); });
            }
            else {
                callback.apply(void 0, args);
            }
        }, wait / speedRate);
    };
    EvilTimer.setIntervalEx = function (callback, wait) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var pushed = false;
        return originalSetInteral(function () {
            if (isPaused) {
                if (!pushed) {
                    susppendedTasks.push(function () { return callback.apply(void 0, args); });
                    pushed = true;
                }
            }
            else {
                pushed = false;
                callback.apply(void 0, args);
            }
        }, wait);
    };
    EvilTimer.timeout = function (wait) { return new Promise(function (resolve) { return EvilTimer.setTimeoutEx(resolve, wait); }); };
    gThis.EvilTimer = EvilTimer;
    gThis.setInterval = EvilTimer.setIntervalEx;
    gThis.setTimeout = EvilTimer.setTimeoutEx;
    if (!gThis.disabledEvilTimerLoadMessage) {
        console.log("evil-timer.js is loaded. You can use EvilTimer commands. see: https://github.com/wraith13/evil-timer.js");
    }
})(EvilTimer || (EvilTimer = {}));
//# sourceMappingURL=index.js.map