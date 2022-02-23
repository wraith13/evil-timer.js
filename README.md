# evil-timer.js

evil-timer.js is an auxiliary script for debugging and tuning CSS **with your own risk**.

## How to use

```html
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```

Must be loaded before `Date`, `setTimeout`, `setInterval` are used.

## Pseudo vanilla objects

- `EvilTimer.Vanilla.Date` is pseudo vanilla Date.
- `EvilTimer.Vanilla.setTimeout` is pseudo vanilla setTimeout.
- `EvilTimer.Vanilla.setInteral` is pseudo vanilla setInterval.

## Commands

You can use the following commands from the console of your web browser.

### EvilTimer.set()

on Web browser JavaScript console

```javascript
EvilTimer.set(false); // Diable EvilTimer
EvilTimer.set(true); // Enable EvilTimer
EvilTimer.set({ disabled: true, }); // Same EvilTimer.set(false);
EvilTimer.set({ disabled: false, }); // Same EvilTimer.set(true);
EvilTimer.set({ disabledLoadMessage: true, }); // Actually, this usage doesn't make sense.
EvilTimer.set({ date: new Date(2022,1,22,22,22,22), });
EvilTimer.set({ date: "2022-02-22T22:22:22", });
EvilTimer.set({ date: 1645536142000, });
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

on HTML

```html
<script>
const evilTimerConfig = false;
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

on URL

```url
https://example.com/your-page-path?evil-timer=false
```

```url
https://example.com/your-page-path?evil-timer={"disabledLoadMessage":true,"date":"2022-02-22T22:22:22","styleReplaceMode":"auto",}
```

### EvilTimer.setDateMode()

default: "evil"

```javascript
EvilTimer.setDateMode("evil"); // Date is EvilDate
EvilTimer.setDateMode("vanilla"); // Date is vanilla Date
```

### EvilTimer.setDate()

```javascript
EvilTimer.setDate(new Date(2022,1,22,22,22,22));
EvilTimer.setDate("2022-02-22T22:22:22");
EvilTimer.setDate(1645536142000);
EvilTimer.setDate(true); // Same EvilTimer.setDateMode("evil");
EvilTimer.setDate(false); // Same EvilTimer.setDateMode("vanilla");
```

### EvilTimer.resetDate()

```javascript
EvilTimer.resetDate();
```

### EvilTimer.pause()

```javascript
EvilTimer.pause();
```

Pause that `setTimeout` tasks and `setInterval` tasks and `Date`.

### EvilTimer.unpause()

```javascript
EvilTimer.unpause();
```

Unpause that `setTimeout` tasks and `setInterval` tasks and `Date`.

### EvilTimer.restore()

```javascript
EvilTimer.restore();
```

Unpause and reset `Date` and ```speed```. It is recommended to reload the page rather than using this command.

### EvilTimer.setSpeed()

default: 1

```javascript
EvilTimer.setSpeed(2);
```

Halve that `setTimeout` time, `setInterval` time,`Date`, CSS(`animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`). ( speed up )

```javascript
EvilTimer.setSpeed(0.5);
```

Double that `setTimeout` time, `setInterval` time,`Date`, CSS(`animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`). ( speed down )

### EvilTimer.setStyleReplaceMode()

default: "disabled"

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

## How to build

requires: [Node.js](https://nodejs.org/), [TypeScript Compiler](https://www.npmjs.com/package/typescript)

`tsc -P .` or `tsc -P . -w`

### In VS Code

You can use automatic build. Run `Tasks: Allow Automatic Tasks in Folder` command from command palette ( Mac: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>, Windows and Linux: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>P</kbd>), and restart VS Code.

## License

[Boost Software License](LICENSE_1_0.txt)
