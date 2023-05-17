# evil-timer.js

evil-timer.js は**あなた自身の責任**において利用できる JavaScript の デバッグや CSS 調整の為の補助的なスクリプトです。

- [🇬🇧 English README](./README.md)

## 組み込み方

```html
<script src="https://wraith13.github.io/evil-timer.js/index.js"></script>
```

`Date`, `setTimeout`, `setInterval` を使用する前に読み込ませる必要があります。

## 使い方

`?evil-timer={"speed":100}` のような URL 引数で時間をコントールしたり、 Web ブラウザのコンソールから EvilTimer.* のコマンドを呼び出して使います。

`setTimeout`, `setInterval` に対して後から影響を及ぼす事はできないので、時間のスピードをコントロールしたい場合は URL 引数での指定を推奨します。

## コマンド

以下のコマンドを Web ブラウザの JavaScript コンソールから使用できます。

### EvilTimer.set()

#### 定義

```typescript
module EvilTimer
{
    ...
    export type StyleReplaceModeType = "auto" | "disabled" | "embedded" | "rules";
    ...
    export type EvilTimerConfigType =
    {
        disabled?: boolean;
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

#### Web ブラウザの JavaScript コンソールで

```javascript
EvilTimer.set(false); // Disable EvilTimer
EvilTimer.set(true); // Enable EvilTimer
EvilTimer.set({ disabled: true, }); // Same EvilTimer.set(false);
EvilTimer.set({ disabled: false, }); // Same EvilTimer.set(true);
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

#### HTML で

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

#### URL で

Web ブラウザの JavaScript コンソールで `EvilTimer.set` の引数と同じデータを URL の `evil-timer` 引数として利用できます。ここでの引数は JSON として有効である必要な事に注意してください。( 🚫 `...?evil-timer={speed:100,}` → ✅ `...?evil-timer={"speed":100}` )

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

Date クラスの実装を切り替えます。 ```EvilTimer.setDateMode("vanilla");``` でシステムオリジナルの Date クラスが使用され、```EvilTimer.setDateMode("evil");``` で evil-timer.js のカスタム Date クラスが使用されます。通常、この設定を切り替える必要はありません。**代替 vanilla オブジェクト** を参照してください。

### EvilTimer.setDate()

```javascript
EvilTimer.setDate(new Date(2022,1,22,22,22,22));
EvilTimer.setDate("2022-02-22T22:22:22");
EvilTimer.setDate(1645536142000);
EvilTimer.setDate(true); // Same EvilTimer.setDateMode("evil");
EvilTimer.setDate(false); // Same EvilTimer.setDateMode("vanilla");
```

`new Date()` で返される現在日時を設定します。 `puase` 状態でなければ `speed` に応じて自動的に時間は経過します。

### EvilTimer.resetDate()

```javascript
EvilTimer.resetDate();
```

`new Date()` で返される現在日時をシステム時刻で設定します。 `puase` 状態でなければ `speed` に応じて自動的に時間は経過します。

### EvilTimer.pause()

```javascript
EvilTimer.pause();
```

`setTimeout` タスク と `setInterval` タスク と `Date` を止めます。 ( JavaScript のコードは動作しますが、時間が停止した状態になります。 )

### EvilTimer.unpause()

```javascript
EvilTimer.unpause();
```

`setTimeout` タスク と `setInterval` タスク と `Date` の停止状態を解除します。 ( `EvilTimer.pause()` による時間停止状態を解除します。停止していた時間分、 `new Date()` の指し示す時刻は遅れたままになります。 )

### EvilTimer.step()

```javascript
EvilTimer.step();
EvilTimer.step(2); // === EvilTimer.step(); EvilTimer.step();
```

`EvilTimer.pause()` によってサスペンドされてる先頭のタスクを１つ実行し、残りのサスペンドされてるタスクの数を返します。

### EvilTimer.stepAll()

```javascript
EvilTimer.stepAll();
```

`EvilTimer.pause()` によってサスペンドされてるタスクを全て実行します。処理中に新たにサスペンドされたタスクは実行しません。

### EvilTimer.stepOut()

```javascript
EvilTimer.allStep();
```

`EvilTimer.pause()` によってサスペンドされてるタスクを全て実行します。処理中に新たにサスペンドされたタスクも実行します。

### EvilTimer.restore()

```javascript
EvilTimer.restore();
```

停止状態を解除し、`Date` and `speed` をリセットします。このコマンドを使うより、ページをリロードする事を推奨します。

### EvilTimer.setSpeed()

default: 1

```javascript
EvilTimer.setSpeed(2);
```

`setTimeout`、`setInterval`、`Date`、CSS(`animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`)のスピードを２倍にします。

```javascript
EvilTimer.setSpeed(0.5);
```

`setTimeout`、`setInterval`、`Date`、CSS(`animation-duration`, `animation-delay`, `transition-duration`, `transition-delay`)のスピードを半分にします。

```javascript
EvilTimer.setSpeed(0);
```

`EvilTimer.pause()` が呼びされます。

### EvilTimer.setStyleReplaceMode()

この機能は試験的な機能であり、有効に機能する範囲は限定的です。

default: "disabled"

|mode|説明|
|---|---|
|`auto`|linkタグによるスタイル指定が無い場合に `embedded` 扱いになり、そうでない場合は `rules` 扱いになります。|
|`disabled`|CSSのスピードコントロールを行いません。|
|`embedded`|`style` タグで指定されているモノについてのみスピードコントロールを行います。|
|`rules`|`rules` オブジェクトに対してスピードコントロールを行います。|

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

## 代替 vanilla オブジェクト

evil-timer.js は `Date`, `setTimeout`, `setInteral` を独自実装のモノに差し替えます。

オリジナルの `Date`, `setTimeout`, `setInteral` の機能を利用したい場合は以下のものを利用してください。

- `EvilTimer.Vanilla.Date`
- `EvilTimer.Vanilla.setTimeout`
- `EvilTimer.Vanilla.setInteral`

## サンプルサイト

- [Clockworks](https://wraith13.github.io/clockworks/) ( 🚧 開発中 )
- [Cyclic Todo](https://wraith13.github.io/cyclic-todo/) ( 🚧 開発中 )

## ビルド方法

必要なソフトウェア: [Node.js](https://nodejs.org/), [TypeScript Compiler](https://www.npmjs.com/package/typescript)

`tsc -P .` あるいは `tsc -P . -w`

### VS Code の場合

You can use automatic build. Run `Tasks: Allow Automatic Tasks in Folder` command from command palette ( Mac: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Command</kbd>+<kbd>P</kbd>, Windows and Linux: <kbd>F1</kbd> or <kbd>Shift</kbd>+<kbd>Ctrl</kbd>+<kbd>P</kbd>), and restart VS Code.

## ライセンス

[Boost Software License](LICENSE_1_0.txt)
