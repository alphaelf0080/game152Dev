# 遊戲模擬器快速啟動指南

## 5 分鐘快速上手

### 步驟 1: 生成測試數據（如果還沒有）

```bash
cd gameServer
python main.py --json --spins 100
```

這會生成包含 100 次旋轉的 JSON 檔案在 `game_output/` 目錄下。

### 步驟 2: 啟動 JSON 伺服器

在新的終端視窗中運行：

```bash
cd gameServer
python test_simulator_config.py
```

或使用簡單的伺服器：

```bash
cd gameServer
python serve_json.py 9000 game_output
```

伺服器會在 `http://localhost:9000/` 提供 JSON 檔案。

### 步驟 3: 啟動遊戲

在 Cocos Creator 中：
1. 打開專案 `pss-on-00152`
2. 點擊「預覽」按鈕（或按 Ctrl+P）
3. 遊戲會在瀏覽器中打開（通常是 `http://localhost:7456/`）

### 步驟 4: 切換到模擬模式

在瀏覽器網址列中修改 URL：

**使用預設 JSON 檔案**:
```
http://localhost:7456/?sim_mode=local_json
```

**使用特定 JSON 檔案**:
```
http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/batch_results_20251013_175018_500_spins.json
```

按 Enter 重新載入頁面。

### 步驟 5: 開始測試

現在每次點擊 Spin 按鈕時，遊戲會使用 JSON 檔案中的預先生成結果，而不是連接到開發伺服器。

## 常用 URL 模板

### 正常模式（連接伺服器）
```
http://localhost:7456/
```

### 模擬模式（使用預設 JSON）
```
http://localhost:7456/?sim_mode=local_json
```

### 模擬模式（指定 JSON + 關閉循環）
```
http://localhost:7456/?sim_mode=local_json&sim_json=http://localhost:9000/my_test.json&sim_loop=false
```

## 驗證是否正常工作

打開瀏覽器的開發者工具（F12），查看 Console 輸出：

**模擬模式啟用時會看到**:
```
[SimulatorConfig] 初始化配置...
[SimulatorConfig] 模式: LOCAL_JSON
[JsonDataLoader] 正在載入 JSON 檔案...
[JsonDataLoader] 成功載入 500 個結果
[ProtoConsole] 使用本地 JSON 模擬結果
```

**伺服器模式啟用時會看到**:
```
ResultCall
```

## 常見問題快速解答

### Q: JSON 檔案無法載入
**A**: 確認 JSON 伺服器正在運行，並檢查檔案路徑是否正確。

### Q: 結果用完後停止了
**A**: 預設會自動循環。如果停止了，檢查 URL 中是否有 `sim_loop=false`。

### Q: 想切換回伺服器模式
**A**: 移除 URL 中的 `?sim_mode=local_json` 參數，重新載入頁面。

## 更多資訊

- 完整使用指南: `pss-on-00152/assets/script/config/SIMULATOR_GUIDE.md`
- 整合報告: `docs/Simulator-Integration-Report.md`
- JSON 導出指南: `docs/JSON-Export-Guide.md`

## 提示

1. **開發流程**: 先在伺服器模式下正常開發，需要測試特定場景時切換到模擬模式
2. **測試場景**: 可以手動編輯 JSON 檔案創建特定測試場景（如大獎、Free Spin 等）
3. **性能測試**: 使用大量結果的 JSON 檔案測試遊戲在高負載下的表現
4. **回歸測試**: 保存特定的 JSON 檔案用於回歸測試，確保遊戲行為一致
