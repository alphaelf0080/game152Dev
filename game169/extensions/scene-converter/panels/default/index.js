/**
 * Scene Converter Panel
 * 用於在 2D 和 3D 項目之間轉換場景
 */

const { readFileSync } = require('fs');
const { join } = require('path');
const { shell } = require('electron');

// 定義面板
exports.template = readFileSync(join(__dirname, '../../src/panels/default/index.html'), 'utf-8');

exports.style = 'body { margin: 0; padding: 0; }';

// 面板元素選擇器
exports.$ = {
    testApiBtn: '#testApiBtn',
    exportBtn: '#exportBtn',
    openExportFolderBtn: '#openExportFolderBtn',
    importBtn: '#importBtn',
    importFile: '#importFile',
    fileInfo: '#fileInfo',
    exportLog: '#exportLog',
    importLog: '#importLog'
};

// 面板準備就緒
exports.ready = async function() {
    console.log('[Scene Converter] Panel ready');
    
    // 初始化狀態
    this.selectedFile = null;
    
    // 綁定測試 API 按鈕
    this.$.testApiBtn.addEventListener('click', async () => {
        console.log('[Scene Converter Panel] Test API button clicked!');
        try {
            await Editor.Message.request('scene-converter', 'test-scene-api');
        } catch (error) {
            console.error('[Scene Converter Panel] Test API error:', error);
        }
    });
    
    // 綁定導出按鈕
    this.$.exportBtn.addEventListener('click', async () => {
        console.log('[Scene Converter] Export button clicked!');
        this.$.exportLog.style.display = 'block';
        addLog(this.$.exportLog, '開始導出場景...', 'info');
        this.$.exportBtn.disabled = true;

        try {
            const result = await Editor.Message.request('scene-converter', 'export-scene');
            console.log('[Scene Converter] Export result:', result);
            
            if (result && result.success) {
                addLog(this.$.exportLog, `✅ 導出成功！`, 'success');
                addLog(this.$.exportLog, `檔案: ${result.filename}`, 'info');
                addLog(this.$.exportLog, `位置: scene-exports/${result.filename}`, 'info');
                
                if (result.data) {
                    addLog(this.$.exportLog, `節點數: ${countNodes(result.data)}`, 'info');
                }
            } else {
                addLog(this.$.exportLog, `❌ 導出失敗: ${result ? result.error : '未知錯誤'}`, 'error');
            }
        } catch (error) {
            console.error('[Scene Converter] Export error:', error);
            addLog(this.$.exportLog, `❌ 錯誤: ${error.message}`, 'error');
        }

        this.$.exportBtn.disabled = false;
    });
    
    // 綁定打開資料夾按鈕
    this.$.openExportFolderBtn.addEventListener('click', async () => {
        console.log('[Scene Converter] Open folder button clicked!');
        try {
            const exportDir = join(Editor.Project.path, 'scene-exports');
            console.log('[Scene Converter] Opening folder:', exportDir);
            await shell.openPath(exportDir);
        } catch (error) {
            console.error('[Scene Converter] Open folder error:', error);
        }
    });
    
    // 綁定檔案選擇
    this.$.importFile.addEventListener('change', (e) => {
        console.log('[Scene Converter] File selected');
        const file = e.target.files[0];
        if (file) {
            this.selectedFile = file.path;
            this.$.fileInfo.textContent = `已選擇: ${file.name}`;
            this.$.fileInfo.style.color = '#4caf50';
            this.$.importBtn.disabled = false;
            console.log('[Scene Converter] Selected file:', this.selectedFile);
        }
    });
    
    // 綁定導入按鈕
    const self = this; // 保存 this 引用
    this.$.importBtn.addEventListener('click', async () => {
        console.log('[Scene Converter] Import button clicked!');
        if (!self.selectedFile) {
            console.warn('[Scene Converter] No file selected');
            return;
        }

        self.$.importLog.style.display = 'block';
        addLog(self.$.importLog, '開始導入場景...', 'info');
        self.$.importBtn.disabled = true;

        try {
            const result = await Editor.Message.request('scene-converter', 'import-scene', self.selectedFile);
            console.log('[Scene Converter] Import result:', result);
            
            if (result && result.success) {
                addLog(self.$.importLog, `✅ 導入完成！`, 'success');
                addLog(self.$.importLog, `⚠️ 請手動：`, 'warning');
                addLog(self.$.importLog, `  1. 重新連接 Sprite 的 SpriteFrame`, 'warning');
                addLog(self.$.importLog, `  2. 重新連接材質資源`, 'warning');
                addLog(self.$.importLog, `  3. 檢查節點位置`, 'warning');
            } else {
                addLog(self.$.importLog, `❌ 導入失敗: ${result ? result.error : '未知錯誤'}`, 'error');
            }
        } catch (error) {
            console.error('[Scene Converter] Import error:', error);
            addLog(self.$.importLog, `❌ 錯誤: ${error.message}`, 'error');
        }

        self.$.importBtn.disabled = false;
    });
    
    console.log('[Scene Converter] All event handlers bound successfully!');
    
    // 輔助函數
    function addLog(container, message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        const time = new Date().toLocaleTimeString();
        entry.textContent = `[${time}] ${message}`;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;
    }
    
    function countNodes(nodeData) {
        let count = 1;
        if (nodeData.children && nodeData.children.length > 0) {
            for (const child of nodeData.children) {
                count += countNodes(child);
            }
        }
        return count;
    }
};

// 面板關閉
exports.close = function() {
    console.log('[Scene Converter] Panel closed');
};

// 面板關閉
exports.close = function() {
    console.log('[Scene Converter] Panel closed');
};
