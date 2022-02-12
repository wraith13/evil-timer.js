# evil-timer.js

evil-timer.js is an auxiliary script for debugging and tuning CSS.

## How to use

```html
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```

Must be loaded before `setTimeout` and `setInterval` are used.

## Commands

You can use the following commands from the console of your web browser.

### EvilTimer.pase()

```javascript
EvilTimer.pase();
```

Pause `setTimeout` tasks and `setInterval` tasks.

### EvilTimer.restore()

```javascript
EvilTimer.restore();
```

Restore `setTimeout` tasks and `setInterval` tasks.

### EvilTimer.setSpeedRate()

- min: 0.001
- max: 1000

```javascript
EvilTimer.setSpeedRate(2);
```

Halve the `setTimeout` time and the` animation-duration` time. ( speed up )

```javascript
EvilTimer.setSpeedRate(0.5);
```

Double the `setTimeout` time and the` animation-duration` time. ( speed down )


### EvilTimer.setStyleReplaceMode()

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
