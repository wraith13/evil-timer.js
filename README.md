# evil-timer.js

evil-timer.js is an auxiliary script for JavaScript debugging and tuning CSS **with your own risk**.

- [🇯🇵 日本語 README](./README.ja.md)

## How to embed

Write as follows in the `head` tag of HTML. ( You can also copy the JavaScript file and embed the contents directly into the HTML file. )

```html
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```

Must be loaded before `Date`, `setTimeout`, `setInterval`, `window.requestAnimationFrame` are used.

## How to use

You can control the time with URL arguments like `?evil-timer={"speed":100}`, or call the command EvilTimer.* from JavaScript console of web browser.

`setTimeout` and `setInterval` cannot be affected later, so if you want to control the speed of time, it is recommended to specify it with a URL argument.

## About URL arguments

URL arguments are disabled by default. This is to prevent malicious links from being created and spread by third parties.

Once you access it with a web browser and execute the following command from the JavaScript console, the specification by the URL argument will be effective.

```js
EvilTimer.debugOn();
```

You can use the URL argument from the beginning if you set it as follows in the HTML, but it is possible for third persons to create and spread malicious links. It is not recommended to do this. ( By the way, if `debug` is set to `false` in this form, even if `EvilTimer.debugOn()` is executed, the debug mode will be turned off every time HTML is loaded, so the use of URL arguments is prohibited. )

```html
<script>
const evilTimerConfig =
{
    debug: true,
};
</script>
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```

## Commands

You can use the following commands from JavaScript console of web browser.

### EvilTimer.set()

#### define

```typescript
module EvilTimer
{
    ...
    export type StyleReplaceModeType = "auto" | "disabled" | "embedded" | "rules";
    ...
    export type EvilTimerConfigType =
    {
        disabled?: boolean;
        debug?: boolean;
        disabledLoadMessage?: boolean;
        date?: "evil" | "vanilla" | boolean | Date | number | string;
        speed?: number;
        pause?: boolean;
        styleReplaceMode?: StyleReplaceModeType;
    };
    export const set = (config: EvilTimerConfigType | boolean) => { ... };
    ...
}
```

#### on Web browser JavaScript console

```javascript
EvilTimer.set(false); // Disable EvilTimer
EvilTimer.set(true); // Enable EvilTimer
EvilTimer.set({ disabled: true, }); // Same EvilTimer.set(false);
EvilTimer.set({ disabled: false, }); // Same EvilTimer.set(true);
EvilTimer.set({ debug: true, }); // Same EvilTimer.debugOn();
EvilTimer.set({ debug: false, }); // Same EvilTimer.debugOff();
EvilTimer.set({ disabledLoadMessage: true, }); // Actually, this usage doesn't make sense because it is after the message is output.
EvilTimer.set({ date: new Date(2022,1,22,22,22,22), });
EvilTimer.set({ date: "2022-02-22T22:22:22", });
EvilTimer.set({ date: 1645536142000, });
EvilTimer.set({ date: "evil", }); // Same EvilTimer.setDateMode("evil");
EvilTimer.set({ date: "vanilla", }); // Same EvilTimer.setDateMode("vanilla");
EvilTimer.set({ date: true, }); // Same EvilTimer.setDateMode("evil");
EvilTimer.set({ date: false, }); // Same EvilTimer.setDateMode("vanilla");
EvilTimer.set({ speed: 100, });
EvilTimer.set({ pause: true, });
EvilTimer.set({ pause: false, });
EvilTimer.set({ styleReplaceMode: "auto", });
EvilTimer.set({ styleReplaceMode: "disabled", });
EvilTimer.set({ styleReplaceMode: "embedded", });
EvilTimer.set({ styleReplaceMode: "rules", });
EvilTimer.set({ date: "2022-02-22T22:22:22", speed: 100, styleReplaceMode: "auto", });
```

#### on HTML

```html
<script>
const evilTimerConfig = false; // Disable EvilTimer
</script>
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```
```html
<script>
const evilTimerConfig =
{
    speed: 100,
};
</script>
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```
```html
<script>
const evilTimerConfig =
{
    disabledLoadMessage: true,
    date: "2022-02-22T22:22:22",
    styleReplaceMode: "auto",
};
</script>
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```

#### on URL

The same data as the argument of `EvilTimer.set` in JavaScript console of web browser is available as the `evil-timer` argument in the URL. Note that the arguments here must be valid as JSON.( 🚫 `...?evil-timer={speed:100,}` → ✅ `...?evil-timer={"speed":100}` )

```url
https://example.com/your-page-path?evil-timer=false
```

```url
https://example.com/your-page-path?evil-timer={"speed":100}
```

```url
https://example.com/your-page-path?evil-timer={"disabledLoadMessage":true,"date":"2022-02-22T22:22:22","styleReplaceMode":"auto"}
```

### EvilTimer.setDateMode()

default: "evil"

```javascript
EvilTimer.setDateMode("evil"); // Date is EvilDate
EvilTimer.setDateMode("vanilla"); // Date is vanilla Date
```

Switch implementation of Date class. The system original Date class is used by ```EvilTimer.setDateMode("vanilla");```, custom Date class of evil-timer.js is used by ```EvilTimer.setDateMode("evil");```. Normally, there is no need to toggle this setting. see **Alternate vanilla objects**

### EvilTimer.setDate()

```javascript
EvilTimer.setDate(new Date(2022,1,22,22,22,22));
EvilTimer.setDate("2022-02-22T22:22:22");
EvilTimer.setDate(1645536142000);
EvilTimer.setDate(true); // Same EvilTimer.setDateMode("evil");
EvilTimer.setDate(false); // Same EvilTimer.setDateMode("vanilla");
```

Sets the current date and time returned by `new Date()`. If it is not in `puase` state, time automatically passes according to `speed`.

### EvilTimer.resetDate()

```javascript
EvilTimer.resetDate();
```

Sets the current date and time returned by `new Date()` to system time. If it is not in `puase` state, time automatically passes according to `speed`.

### EvilTimer.pause()

```javascript
EvilTimer.pause();
```

Pause those `setTimeout` tasks and `setInterval` tasks and `Date`. ( The JavaScript code works, but time stops. )

### EvilTimer.unpause()

```javascript
EvilTimer.unpause();
```

Unpause those `setTimeout` tasks and `setInterval` tasks and `Date`. ( Release the time stop by `EvilTimer.pause()`. The time indicated by `new Date()` remains delayed by the amount of time that the time was stopped. )

### EvilTimer.step()

```javascript
EvilTimer.step();
EvilTimer.step(2); // === EvilTimer.step(); EvilTimer.step();
```

Executes the first task suspended by `EvilTimer.pause()` and returns the number of remaining suspended tasks.

### EvilTimer.stepAll()

```javascript
EvilTimer.stepAll();
```

Executes all tasks suspended by `EvilTimer.pause()`. It does not execute newly suspended tasks during processing.

### EvilTimer.stepOut()

```javascript
EvilTimer.stepOut();
```

Executes all tasks suspended by `EvilTimer.pause()`. It executes newly suspended tasks during processing.

### EvilTimer.restore()

```javascript
EvilTimer.restore();
```

Unpause and reset `Date` and `speed`. It is recommended to reload the page rather than using this command.

### EvilTimer.setSpeed()

default: 1

```javascript
EvilTimer.setSpeed(2);
```

Double the speed of `setTimeout`, `setInterval`, `Date`, CSS(`animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`).

```javascript
EvilTimer.setSpeed(0.5);
```

Halve the speed of `setTimeout`, `setInterval`, `Date`, CSS(`animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`).

```javascript
EvilTimer.setSpeed(0);
```

`EvilTimer.pause()` is called.

### EvilTimer.setStyleReplaceMode()

This feature is an experimental feature and has limited usefulness.

default: "disabled"

|mode|description|
|---|---|
|`auto`|If there is no style specified by the link tag, it will be treated as `embedded`, otherwise it will be treated as `rules`.|
|`disabled`|No CSS speed control.|
|`embedded`|Only speed control the things specified in the `style` tag.|
|`rules`|Perform speed control on the `rules` object.|

```javascript
EvilTimer.setStyleReplaceMode("auto");
```

```javascript
EvilTimer.setStyleReplaceMode("disabled");
```

```javascript
EvilTimer.setStyleReplaceMode("embedded");
```

```javascript
EvilTimer.setStyleReplaceMode("rules");
```

### EvilTimer.debugOn()

```javascript
EvilTimer.debugOn();
```

Turn on debug mode. (URL arguments are enabled.)

### EvilTimer.debugOff()

```javascript
EvilTimer.debugOff();
```

Turn off debug mode. (URL arguments are disabled.)

### EvilTimer.isDebug()

```javascript
EvilTimer.isDebug();
```

Returns true if debug mode is on, false otherwise.

### EvilTimer.getStatus()

It returns JSON like this:

```json
{
    "enabled": true,
    "debug": false,
    "speed": 1000,
    "isPaused": true,
    "susppendedTasksCount": 2,
    "date":
    {
        "vanilla":
        {
            "text": "2023/5/29 23:54:41",
            "tick": 1685372081785
        },
        "evil":
        {
            "text": "2023/5/31 16:06:07",
            "tick": 1685516767640
        }
    }
}
```

## Alternate vanilla objects

evil-timer.js replaces `Date`, `setTimeout`, `setInteral` with their own implementations.

If you want to use the original `Date`, `setTimeout`, `setInteral` functionality, use the following.

- `EvilTimer.Vanilla.Date`
- `EvilTimer.Vanilla.setTimeout`
- `EvilTimer.Vanilla.setInteral`

## Sample sites

- [Clockworks](https://wraith13.github.io/clockworks/) ( 🚧 under development )
- [Cyclic Todo](https://wraith13.github.io/cyclic-todo/) ( 🚧 under development )

## How to build

requires: [Node.js](https://nodejs.org/), [TypeScript Compiler](https://www.npmjs.com/package/typescript)

`tsc -P .` or `tsc -P . -w`

### In VS Code

You can use automatic build. Run `Tasks: Allow Automatic Tasks in Folder` command from command palette ( Mac: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>, Windows and Linux: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>P</kbd>), and restart VS Code.

## License

[Boost Software License](LICENSE_1_0.txt)
