module EvilTimer
{
    const gThis = (self ?? window ?? global);
    const originalSetTimeout = setTimeout;
    const originalSetInteral = setInterval;
    // export type StyleReplaceModeType = "auto" | "embedded" | "rules" | "sheets";
    export type StyleReplaceModeType = "auto" | "disabled" | "embedded" | "rules";
    let styleReplaceMode: StyleReplaceModeType = "auto";
    let originalEmbeddedStyles:string[] = null;
    let originalStyleRules:string[][] = null;
    // let originalStyleSheets:string[] = null;
    let speedRate = 1.0;
    let isPaused = false;
    let susppendedTasks = <(()=>unknown)[]>[];
    export const restore = () =>
    {
        isPaused = false;
        susppendedTasks.forEach(i => i());
        susppendedTasks = [];
    };
    export const pause = () => isPaused = true;
    const replaceAnimationDuration = (css: string) => css.replace
    (
        /(animation-duration:\s*)([0-9.]+)([a-z]*\s*;)/gmu,
        (_m, p1, p2, p3) => `${p1}${parseFloat(p2) / speedRate}${p3}`
    );
    const updateEmbeddedStyle = () =>
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
                if (0 <= (originalEmbeddedStyles[ix] ?? "").indexOf("animation-duration"))
                {
                    i.innerHTML = replaceAnimationDuration(originalEmbeddedStyles[ix]);
                }
            }
        );
    };
    const updateStyleRules = () =>
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
                        if (0 < rules.filter(rule => 0 <= (rule ?? "").indexOf("animation-duration")).length)
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
                        rule => stylesheet.insertRule(replaceAnimationDuration(rule))
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
    export const setStyleReplaceMode = (mode: StyleReplaceModeType) =>
    {
        switch(mode)
        {
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
    export const setSpeedRate = (rate: number) =>
    {
        speedRate = Math.max(Math.min(rate, 1000), 0.001);
        switch(getStyleReplaceMode())
        {
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
    export const setTimeoutEx = (callback: Function, wait?: number, ...args: any) => originalSetTimeout
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
        wait / speedRate
    );
    export const setIntervalEx = (callback: Function, wait?: number, ...args: any) =>
    {
        let pushed = false;
        return originalSetInteral
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
            wait
        );
    };
    export const timeout = (wait: number) => new Promise<void>
    (
        resolve => setTimeoutEx(resolve, wait)
    );
    declare var global: any;
    gThis.EvilTimer = EvilTimer;
    gThis.setInterval = setIntervalEx;
    gThis.setTimeout = setTimeoutEx;
    if ( ! gThis.disabledEvilTimerLoadMessage)
    {
        console.log("evil-timer.js is loaded. You can use EvilTimer commands. see: https://github.com/wraith13/evil-timer.js");
    }
}
