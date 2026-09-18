# 《皇帝》Redesign — Phase 1a

Spiritual successor prototype（唔抄全崴素材）。本目錄為 **Phase 1a** 可玩網頁原型：

- 宣政殿 HUD（身體四維、Realm、年月旬、本旬剩餘行動）
- 六部門禁（吏 open；戶／兵 locked_slice；禮／刑／工 grey）
- 吏部任命／罷免（齊人開局 19 職＋pool≥2；禮／刑／工尚書 `locked_later`）
- 旬循環：`lifespan−1`、行動重置、無成功吏部動作才體力回復
- 存讀：`localStorage` + 下載／匯入 JSON（`saveVersion=1`）

**唔包含 Phase 1b**（稅／募兵結算）。

規格來源（本機）：`/workspace/emperor-redesign/specs/phase1-slice-xuanzheng-libu.md`、`ui-tokens-v1.md`。

## 如何執行

需要本機靜態伺服器（ES modules）。在專案根目錄：

```bash
# 推薦
npx --yes serve -l 5173

# 或
python3 -m http.server 8080
```

然後用瀏覽器開：

- `http://127.0.0.1:5173`（serve）
- 或 `http://127.0.0.1:8080`（python）

直接用 `file://` 開 `index.html` 可能因 CORS／module 而失敗，請用上述方式。

## 驗收路徑（約 3–5 旬）

1. 開局宣政殿 → 點「吏」→ 見中央 11＋畿內 8 全 filled；禮／刑／工尚書無罷免鈕  
2. 罷免布政使 → 虛位＋「省實收 ×0.6…」  
3. 自候選池任命補上  
4. 「結束本旬」→ 壽命 −1、行動回到 2/2  
5. 存檔 → 改人事 → 讀檔還原  

## 目錄

```
index.html
css/tokens.css   # Designer v0.4.2 tokens
css/app.css
js/data.js       # 職缺／掛鉤／開局人事
js/game.js       # 規則、存讀
js/ui.js         # 宣政殿＋吏部 UI
js/main.js
```

## 授權備註

Spiritual successor；唔使用全崴《皇帝》原作素材或代碼。
