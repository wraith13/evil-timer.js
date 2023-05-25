var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var EvilTimer;
(function (EvilTimer) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var gThis = ((_a = self !== null && self !== void 0 ? self : window) !== null && _a !== void 0 ? _a : global);
    var VanillaDate = Date;
    var vanillaSetTimeout = setTimeout;
    var vanillaSetInteral = setInterval;
    var dateMode = "evil";
    EvilTimer.setDateMode = function (mode) {
        switch (mode) {
            case "vanilla":
            case "evil":
                dateMode = mode;
                break;
            default:
                console.error("setDateMode(".concat(JSON.stringify(mode), " as \"vanilla\" | \"evil\");"));
                break;
        }
    };
    var styleReplaceMode = "disabled";
    var originalEmbeddedStyles = null;
    var originalStyleRules = null;
    // let originalStyleSheets:string[] = null;
    var speed = 1;
    var isRegularSpeed = function () { return 1 === speed; };
    var isPaused = false;
    var susppendedTasks = [];
    var ankerAt = {
        vanilla: 0,
        evil: 0,
    };
    EvilTimer.getVanillaNow = function () { return new VanillaDate().getTime(); };
    EvilTimer.getEvilNow = function () {
        return !isAnkered() ?
            EvilTimer.getVanillaNow() :
            ankerAt.evil + (isPaused ? 0 : (speed * (EvilTimer.getVanillaNow() - ankerAt.vanilla)));
    };
    var isAnkered = function () { return 0 !== ankerAt.vanilla; };
    var setAnkerAt = function (evil) { return ankerAt =
        {
            vanilla: EvilTimer.getVanillaNow(),
            evil: evil !== null && evil !== void 0 ? evil : EvilTimer.getEvilNow(),
        }; };
    var resetAnkerAt = function (vanilla) {
        if (vanilla === void 0) { vanilla = isRegularSpeed() ? 0 : EvilTimer.getVanillaNow(); }
        return ankerAt =
            {
                vanilla: vanilla,
                evil: vanilla,
            };
    };
    /*
    remain for support to timezone and locale.
    class EvilDateBody
    {
        vanilla: Date;
        constructor();
        constructor(value: number | string);
        constructor(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number);
        constructor(year?: number | string, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number)
        {
            if (undefined !== year)
            {
                if ("number" === typeof year && undefined !== month)
                {
                    this.vanilla = new VanillaDate(year, month, date, hours, minutes, seconds, ms);
                }
                else
                {
                    this.vanilla = new VanillaDate(year);
                }
            }
            else
            {
                this.vanilla = new VanillaDate(getEvilNow());
            }
        }
        toString = () => this.vanilla.toString();
        toDateString = () => this.vanilla.toDateString();
        toTimeString = () => this.vanilla.toTimeString();
        toLocaleString = () => this.vanilla.toLocaleString();
        toLocaleDateString = () => this.vanilla.toLocaleDateString();
        toLocaleTimeString = () => this.vanilla.toLocaleTimeString();
        valueOf = () => this.vanilla.valueOf();
        getTime = () => this.vanilla.getTime();
        getFullYear = () => this.vanilla.getFullYear();
        getUTCFullYear = () => this.vanilla.getUTCFullYear();
        getMonth = () => this.vanilla.getMonth();
        getUTCMonth = () => this.vanilla.getUTCMonth();
        getDate = () => this.vanilla.getDate();
        getUTCDate = () => this.vanilla.getUTCDate();
        getDay = () => this.vanilla.getDay();
        getUTCDay = () => this.vanilla.getUTCDay();
        getHours = () => this.vanilla.getHours();
        getUTCHours = () => this.vanilla.getUTCHours();
        getMinutes = () => this.vanilla.getMinutes();
        getUTCMinutes = () => this.vanilla.getUTCMinutes();
        getSeconds = () => this.vanilla.getSeconds();
        getUTCSeconds = () => this.vanilla.getUTCSeconds();
        getMilliseconds = () => this.vanilla.getMilliseconds();
        getUTCMilliseconds = () => this.vanilla.getUTCMilliseconds();
        getTimezoneOffset = () => this.vanilla.getTimezoneOffset();
        setTime = (time: number) => this.vanilla.setTime(time);
        setMilliseconds = (ms: number) => this.vanilla.setMilliseconds(ms);
        setUTCMilliseconds = (ms: number) => this.vanilla.setUTCMilliseconds(ms);
        setSeconds = (sec: number, ms?: number) => this.vanilla.setSeconds(sec, ms);
        setUTCSeconds = (sec: number, ms?: number) => this.vanilla.setUTCSeconds(sec, ms);
        setMinutes = (min: number, sec?: number, ms?: number) => this.vanilla.setMinutes(min, sec, ms);
        setUTCMinutes = (min: number, sec?: number, ms?: number) => this.vanilla.setUTCMinutes(min, sec, ms);
        setHours = (hours: number, min?: number, sec?: number, ms?: number) => this.vanilla.setHours(hours, min, sec, ms);
        setUTCHours = (hours: number, min?: number, sec?: number, ms?: number) => this.vanilla.setUTCHours(hours, min, sec, ms);
        setDate = (date: number) => this.vanilla.setDate(date);
        setUTCDate = (date: number) => this.vanilla.setUTCDate(date);
        setMonth = (month: number, date?: number) => this.vanilla.setMonth(month, date);
        setUTCMonth = (month: number, date?: number) => this.vanilla.setUTCMonth(month, date);
        setFullYear = (year: number, month?: number, date?: number) => this.vanilla.setFullYear(year, month, date);
        setUTCFullYear = (year: number, month?: number, date?: number) => this.vanilla.setUTCFullYear(year, month, date);
        toUTCString = () => this.vanilla.toUTCString();
        toISOString = () => this.vanilla.toISOString();
        toJSON = (key?: any) => this.vanilla.toJSON(key);
        static parse = (s: string) => VanillaDate.parse(s);
        static UTC = (year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number) => VanillaDate.UTC(year, month, date, hours, minutes, seconds, ms);
        static now = () => new EvilDateBody().getTime();
    }
    */
    EvilTimer.EvilDate = function _j() {
        var _newTarget = this && this instanceof _j ? this.constructor : void 0;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if ("evil" === dateMode && isAnkered() && 0 === args.length) {
            return _newTarget ?
                new VanillaDate(EvilTimer.getEvilNow()) :
                new VanillaDate(EvilTimer.getEvilNow()).toString();
        }
        else {
            return _newTarget ? new (VanillaDate.bind.apply(VanillaDate, __spreadArray([void 0], args, false)))() : VanillaDate.apply(void 0, args);
        }
    };
    EvilTimer.EvilDate.parse = VanillaDate.parse;
    EvilTimer.EvilDate.UTC = VanillaDate.UTC;
    EvilTimer.EvilDate.now = EvilTimer.getEvilNow;
    EvilTimer.setDate = function (date) {
        if ("boolean" === typeof date) {
            EvilTimer.setDateMode(date ? "evil" : "vanilla");
        }
        else {
            EvilTimer.setDateMode("evil");
            setAnkerAt("number" === typeof date ? date :
                "string" === typeof date ? VanillaDate.parse(date) :
                    date.getTime());
        }
    };
    EvilTimer.resetDate = function () { return resetAnkerAt(); };
    EvilTimer.restore = function () {
        EvilTimer.setSpeed(1);
        EvilTimer.unpause();
        resetAnkerAt();
    };
    EvilTimer.pause = function () {
        setAnkerAt();
        isPaused = true;
    };
    EvilTimer.unpause = function () {
        setAnkerAt();
        isPaused = false;
        EvilTimer.stepOut();
    };
    EvilTimer.step = function (count) {
        var _a;
        if (count === void 0) { count = 1; }
        for (var i = 0; i < count; ++i) {
            (_a = susppendedTasks.shift()) === null || _a === void 0 ? void 0 : _a();
        }
        return susppendedTasks.length;
    };
    EvilTimer.stepAll = function () {
        EvilTimer.step(susppendedTasks.length);
    };
    EvilTimer.stepOut = function () {
        while (0 < EvilTimer.step())
            ;
    };
    var styleTimerRegExp = /((?:animation|transition)(?:-duration|-delay)?\s*:)([\+\-0-9A-Za-z.\s]+);/gmu;
    var hasTimer = function (css) { return styleTimerRegExp.test(css); };
    var replaceTimer = function (rate, css) { return css.replace(styleTimerRegExp, function (_m, p1, p2) { return "".concat(p1).concat(p2.replace(/([\+\-]?[0-9.]+)(m?s)/gmu, function (_m, p1, p2) { return (parseFloat(p1) / Math.abs(rate)).toLocaleString("en") + p2; }), ";"); }); };
    var updateEmbeddedStyle = function (rate) {
        if (rate === void 0) { rate = speed; }
        var styles = Array.from(document.getElementsByTagName("style"));
        if (null === originalEmbeddedStyles) {
            originalEmbeddedStyles = styles.map(function (i) { return i.innerHTML; });
        }
        styles.forEach(function (i, ix) {
            var _a, _b;
            if (hasTimer((_a = originalEmbeddedStyles === null || originalEmbeddedStyles === void 0 ? void 0 : originalEmbeddedStyles[ix]) !== null && _a !== void 0 ? _a : "")) {
                i.innerHTML = replaceTimer(rate, (_b = originalEmbeddedStyles === null || originalEmbeddedStyles === void 0 ? void 0 : originalEmbeddedStyles[ix]) !== null && _b !== void 0 ? _b : "");
            }
        });
    };
    var updateStyleRules = function (rate) {
        if (rate === void 0) { rate = speed; }
        var styles = Array.from(document.styleSheets);
        if (null === originalStyleRules) {
            originalStyleRules = styles.map(function (stylesheet) {
                try {
                    var rules = Array.from(stylesheet.cssRules).map(function (rule) { return rule.cssText; });
                    if (0 < rules.filter(function (rule) { return hasTimer(rule !== null && rule !== void 0 ? rule : ""); }).length) {
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
            var _a;
            if (null !== (originalStyleRules === null || originalStyleRules === void 0 ? void 0 : originalStyleRules[ix])) {
                while (0 < stylesheet.cssRules.length) {
                    stylesheet.deleteRule(0);
                }
                (_a = originalStyleRules === null || originalStyleRules === void 0 ? void 0 : originalStyleRules[ix]) === null || _a === void 0 ? void 0 : _a.forEach(function (rule) { return stylesheet.insertRule(replaceTimer(rate, rule)); });
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
    var updateStyle = function (rate) {
        if (rate === void 0) { rate = speed; }
        switch (EvilTimer.getStyleReplaceMode()) {
            case "embedded":
                updateEmbeddedStyle(rate);
                break;
            case "rules":
                updateStyleRules(rate);
                break;
            // case "sheets":
            //     updateStyleSheets();
            //     break;
        }
    };
    EvilTimer.setStyleReplaceMode = function (mode) {
        switch (mode) {
            case "auto":
            case "disabled":
            case "embedded":
            case "rules":
                // case "sheets":
                if (styleReplaceMode !== mode) {
                    if ("disabled" !== styleReplaceMode && 1 !== speed) {
                        updateStyle(1);
                    }
                    styleReplaceMode = mode;
                    if ("disabled" !== styleReplaceMode && 1 !== speed) {
                        updateStyle();
                    }
                }
                break;
            default:
                console.error("setStyleReplaceMode(".concat(JSON.stringify(mode), " as \"auto\" | \"disabled\" | \"embedded\" | \"rules\");"));
                break;
        }
    };
    EvilTimer.setSpeed = function (rate) {
        if (0 == rate) {
            EvilTimer.pause();
        }
        else {
            setAnkerAt();
            speed = rate;
            updateStyle();
        }
    };
    EvilTimer.evilSetTimeout = function (callback, wait) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return vanillaSetTimeout(function () {
            if (isPaused) {
                susppendedTasks.push(function () { return callback.apply(void 0, args); });
            }
            else {
                callback.apply(void 0, args);
            }
        }, undefined === wait ? wait : wait / Math.abs(speed));
    };
    EvilTimer.evilSetInterval = function (callback, wait) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var pushed = false;
        return vanillaSetInteral(function () {
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
        }, undefined === wait ? wait : wait / Math.abs(speed));
    };
    var Vanilla;
    (function (Vanilla) {
        Vanilla.Date = function _a() {
            var _newTarget = this && this instanceof _a ? this.constructor : void 0;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _newTarget ? new (VanillaDate.bind.apply(VanillaDate, __spreadArray([void 0], args, false)))() : VanillaDate.apply(void 0, args);
        };
        Vanilla.Date.parse = VanillaDate.parse;
        Vanilla.Date.UTC = VanillaDate.UTC;
        Vanilla.Date.now = VanillaDate.now;
        Vanilla.setTimeout = function (callback, wait) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return vanillaSetTimeout.apply(void 0, __spreadArray([callback,
                wait], args, false));
        };
        Vanilla.setInterval = function (callback, wait) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return vanillaSetInteral.apply(void 0, __spreadArray([callback,
                wait], args, false));
        };
    })(Vanilla = EvilTimer.Vanilla || (EvilTimer.Vanilla = {}));
    EvilTimer.set = function (config) {
        if ("boolean" === typeof config) {
            if (config) {
                gThis.EvilTimer = EvilTimer;
                gThis.Date = EvilTimer.EvilDate;
                gThis.setTimeout = EvilTimer.evilSetTimeout;
                gThis.setInterval = EvilTimer.evilSetInterval;
            }
            else {
                // delete gThis.EvilTimer;
                gThis.Date = VanillaDate;
                gThis.setTimeout = vanillaSetTimeout;
                gThis.setInterval = vanillaSetInteral;
            }
        }
        else {
            if (undefined !== config.disabled && "boolean" === typeof config.disabled) {
                EvilTimer.set(!config.disabled);
            }
            if (undefined !== config.styleReplaceMode) {
                EvilTimer.setStyleReplaceMode(config.styleReplaceMode);
            }
            if (undefined !== config.date) {
                EvilTimer.setDate(config.date);
            }
            if (undefined !== config.speed) {
                EvilTimer.setSpeed(config.speed);
            }
            if (undefined !== config.pause) {
                if (config.pause) {
                    EvilTimer.pause();
                }
                else {
                    EvilTimer.unpause();
                }
            }
        }
    };
    var configFromUrl = (_e = (_d = (_c = (_b = location.href
        .split("#")[0]
        .split("?")[1]) === null || _b === void 0 ? void 0 : _b.split("&")) === null || _c === void 0 ? void 0 : _c.filter(function (i) { return i.startsWith("evil-timer="); })) === null || _d === void 0 ? void 0 : _d.map(function (i) { return JSON.parse(decodeURIComponent(i.substr("evil-timer=".length))); })) === null || _e === void 0 ? void 0 : _e[0];
    var configOrBoolean = ((_f = configFromUrl !== null && configFromUrl !== void 0 ? configFromUrl : gThis.evilTimerConfig) !== null && _f !== void 0 ? _f : true);
    var evilTimerConfig = "boolean" === typeof configOrBoolean ? { disabled: !configOrBoolean, } : configOrBoolean;
    if (!((_g = evilTimerConfig.disabled) !== null && _g !== void 0 ? _g : false)) {
        EvilTimer.set(true);
        if (!((_h = evilTimerConfig.disabledLoadMessage) !== null && _h !== void 0 ? _h : false)) {
            console.log("evil-timer.js is loaded. You can use EvilTimer commands with your own risk. see: https://github.com/wraith13/evil-timer.js");
        }
        EvilTimer.set(evilTimerConfig);
    }
})(EvilTimer || (EvilTimer = {}));
//# sourceMappingURL=index.js.map