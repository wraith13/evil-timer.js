module EvilTimer
{
    declare var global: any;
    const gThis = (self ?? window ?? global);
    const VanillaDate = Date;
    const vanillaSetTimeout = setTimeout;
    const vanillaSetInteral = setInterval;
    export type DateModeType = "vanilla" | "evil";
    let dateMode: DateModeType = "evil";
    export const setDateMode = (mode: DateModeType) =>
    {
        switch(mode)
        {
        case "vanilla":
        case "evil":
            dateMode = mode;
            break;
        default:
            console.error(`setDateMode(${JSON.stringify(mode)} as "vanilla" | "evil");`);
            break;
        }
    };
    // export type StyleReplaceModeType = "auto" | "disabled" | "embedded" | "rules" | "sheets";
    export type StyleReplaceModeType = "auto" | "disabled" | "embedded" | "rules";
    let styleReplaceMode: StyleReplaceModeType = "disabled";
    let originalEmbeddedStyles:string[] = null;
    let originalStyleRules:string[][] = null;
    // let originalStyleSheets:string[] = null;
    let speed = 1;
    let isPaused = false;
    let susppendedTasks = <(()=>unknown)[]>[];
    let ankerAt =
    {
        vanilla: 0,
        evil: 0,
    };
    export const getVanillaNow = () => new VanillaDate().getTime();
    export const getEvilNow = function()
    {
        return ! isAnkered() ?
            getVanillaNow():
            ankerAt.evil +(isPaused ? 0: (speed *(getVanillaNow() -ankerAt.vanilla)));
    };
    const isAnkered = () => 0 !== ankerAt.vanilla;
    const setAnkerAt = (evil?: number) => ankerAt =
    {
        vanilla: getVanillaNow(),
        evil: evil ?? getEvilNow(),
    };
    const resetAnkerAt = () => ankerAt =
    {
        vanilla: 0,
        evil: 0,
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
    export const EvilDate = function(...args)
    {
        if ("evil" === dateMode && isAnkered() && 0 === args.length)
        {
            return new.target ?
                new VanillaDate(getEvilNow()):
                new VanillaDate(getEvilNow()).toString();
        }
        else
        {
            return new.target ?
                new VanillaDate(...args):
                VanillaDate(...args);
        }
    } as {
        new (): Date;
        (): string;
    };
    (<any>EvilDate).parse = VanillaDate.parse;
    (<any>EvilDate).UTC = VanillaDate.UTC;
    (<any>EvilDate).now = getEvilNow;
    export const setDate = (date: Date | number | string | boolean) =>
    {
        if ("boolean" === typeof date)
        {
            setDateMode(date ? "evil": "vanilla");
        }
        else
        {
            setDateMode("evil");
            setAnkerAt
            (
                "number" === typeof date ? date:
                "string" === typeof date ? VanillaDate.parse(date):
                date.getTime()
            );
        }
    };
    export const resetDate = () => setAnkerAt(getVanillaNow());
    export const restore = () =>
    {
        setSpeed(1.0);
        unpause();
        resetAnkerAt();
    };
    export const pause = () =>
    {
        setAnkerAt();
        isPaused = true;
    };
    export const unpause = () =>
    {
        setAnkerAt();
        isPaused = false;
        susppendedTasks.forEach(i => i());
        susppendedTasks = [];
    };
    const styleTimerRegExp = /((?:animation|transition)(?:-duration|-delay)?\s*:)([\+\-0-9A-Za-z.\s]+);/gmu;
    const hasTimer = (css: string) => styleTimerRegExp.test(css);
    const replaceTimer = (rate: number, css: string) => css.replace
    (
        styleTimerRegExp,
        (_m, p1, p2) => `${p1}${p2.replace(/([\+\-]?[0-9.]+)(m?s)/gmu, (_m, p1, p2) => (parseFloat(p1) / Math.abs(rate)).toLocaleString("en") +p2)};`
    );
    const updateEmbeddedStyle = (rate: number = speed) =>
    {
        const styles = <HTMLStyleElement[]>Array.from(document.getElementsByTagName("style"));
        if (null === originalEmbeddedStyles)
        {
            originalEmbeddedStyles = styles.map(i => i.innerHTML);
        }
        styles.forEach
        (
            (i, ix) =>
            {
                if (hasTimer(originalEmbeddedStyles[ix] ?? ""))
                {
                    i.innerHTML = replaceTimer(rate, originalEmbeddedStyles[ix]);
                }
            }
        );
    };
    const updateStyleRules = (rate: number = speed) =>
    {
        const styles = <CSSStyleSheet[]>Array.from(document.styleSheets);
        if (null === originalStyleRules)
        {
            originalStyleRules = styles.map
            (
                stylesheet =>
                {
                    try
                    {
                        const rules = Array.from(stylesheet.cssRules).map(rule => rule.cssText);
                        if (0 < rules.filter(rule => hasTimer(rule ?? "")).length)
                        {
                            return rules;
                        }
                    }
                    catch
                    {
                        console.error(`Can not read: ${stylesheet.href}`);
                    }
                    return null;
                }
            );
        }
        styles.forEach
        (
            (stylesheet, ix) =>
            {
                if (null !== originalStyleRules[ix])
                {
                    while(0 < stylesheet.cssRules.length)
                    {
                        stylesheet.deleteRule(0);
                    }
                    originalStyleRules[ix].forEach
                    (
                        rule => stylesheet.insertRule(replaceTimer(rate, rule))
                    );
                }
            }
        );
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
    const isEmbeddedStyleOnly = () =>
        (<HTMLLinkElement[]>Array.from(document.getElementsByTagName("link")))
            .filter(i => "stylesheet" === i.rel).length <= 0;
    export const getStyleReplaceMode = () =>
    {
        switch(styleReplaceMode)
        {
        case "auto":
            // if (isChromium())
            // {
            //     return "sheets";
            // }
            if (isEmbeddedStyleOnly())
            {
                return "embedded";
            }
            return "rules";
        default:
            return styleReplaceMode;
        }
    };
    const updateStyle = (rate: number = speed) =>
    {
        switch(getStyleReplaceMode())
        {
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
    export const setStyleReplaceMode = (mode: StyleReplaceModeType) =>
    {
        switch(mode)
        {
        case "auto":
        case "disabled":
        case "embedded":
        case "rules":
        // case "sheets":
            if (styleReplaceMode !== mode)
            {
                if ("disabled" !== styleReplaceMode && 1 !== speed)
                {
                    updateStyle(1);
                }
                styleReplaceMode = mode;
                if ("disabled" !== styleReplaceMode && 1 !== speed)
                {
                    updateStyle();
                }
            }
            break;
        default:
            console.error(`setStyleReplaceMode(${JSON.stringify(mode)} as "auto" | "disabled" | "embedded" | "rules");`);
            break;
        }
    };
    export const setSpeed = (rate: number) =>
    {
        setAnkerAt();
        speed = rate;
        updateStyle();
    };
    export const evilSetTimeout = (callback: Function, wait?: number, ...args: any) => vanillaSetTimeout
    (
        () =>
        {
            if (isPaused)
            {
                susppendedTasks.push(() => callback(...args));
            }
            else
            {
                callback(...args);
            }
        },
        wait / Math.abs(speed)
    );
    export const evilSetInterval = (callback: Function, wait?: number, ...args: any) =>
    {
        let pushed = false;
        return vanillaSetInteral
        (
            () =>
            {
                if (isPaused)
                {
                    if ( ! pushed)
                    {
                        susppendedTasks.push(() => callback(...args));
                        pushed = true;
                    }
                }
                else
                {
                    pushed = false;
                    callback(...args);
                }
            },
            wait / Math.abs(speed)
        );
    };
    export module Vanilla
    {
        export const Date = function(...args)
        {
            return new.target ?
                new VanillaDate(...args):
                VanillaDate(...args);
        } as {
            new (): Date;
            (): string;
        };
        (<any>Date).parse = VanillaDate.parse;
        (<any>Date).UTC = VanillaDate.UTC;
        (<any>Date).now = VanillaDate.now;
        export const setTimeout = (callback: Function, wait?: number, ...args: any) => vanillaSetTimeout
        (
            callback,
            wait,
            ...args
        );
        export const setInterval = (callback: Function, wait?: number, ...args: any) => vanillaSetInteral
        (
            callback,
            wait,
            ...args
        );
    }
    export type EvilTimerConfigType =
    {
        disabled?: boolean;
        disabledLoadMessage?: boolean;
        date?: Date | number | string | boolean;
        speed?: number;
        pause?: boolean;
        styleReplaceMode?: StyleReplaceModeType;
    };
    export const set = (config: EvilTimerConfigType | boolean) =>
    {
        if ("boolean" === typeof config)
        {
            if (config)
            {
                gThis.EvilTimer = EvilTimer;
                gThis.Date = EvilDate;
                gThis.setTimeout = evilSetTimeout;
                gThis.setInterval = evilSetInterval;
            }
            else
            {
                // delete gThis.EvilTimer;
                gThis.Date = VanillaDate;
                gThis.setTimeout = vanillaSetTimeout;
                gThis.setInterval = vanillaSetInteral;
            }
        }
        else
        {
            if (undefined !== config.disabled && "boolean" === typeof config.disabled)
            {
                set( ! config.disabled);
            }
            if (undefined !== config.styleReplaceMode)
            {
                setStyleReplaceMode(config.styleReplaceMode);
            }
            if (undefined !== config.date)
            {
                setDate(config.date);
            }
            if (undefined !== config.speed)
            {
                setSpeed(config.speed);
            }
            if (undefined !== config.pause)
            {
                if (config.pause)
                {
                    pause();
                }
                else
                {
                    unpause();
                }
            }
        }
    };
    const configFromUrl = location.href
        .split("#")[0]
        .split("?")[1]
        ?.split("&")
        ?.filter(i => i.startsWith("evil-timer="))
        ?.map(i => JSON.parse(decodeURIComponent(i.substr("evil-timer=".length))))
        ?.[0];
    const evilTimerConfig = (configFromUrl ?? gThis.evilTimerConfig) as EvilTimerConfigType;
    if (false !== evilTimerConfig && ! evilTimerConfig?.disabled)
    {
        set(true);
        if ( ! evilTimerConfig?.disabledLoadMessage)
        {
            console.log("evil-timer.js is loaded. You can use EvilTimer commands with your own risk. see: https://github.com/wraith13/evil-timer.js");
        }
        if (evilTimerConfig)
        {
            EvilTimer.set(evilTimerConfig);
        }
    }
}