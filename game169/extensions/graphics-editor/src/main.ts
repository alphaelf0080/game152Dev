/**
 * Graphics Editor 主入口
 */

declare const Editor: any;
import * as fs from 'fs';
import * as path from 'path';

export function load() {
    console.log('[Graphics Editor] 擴展已加載');
}

export function unload() {
    console.log('[Graphics Editor] 擴展已卸載');
}

export const methods = {
    /**
     * 打開 Graphics 編輯器面板
     */
    openPanel() {
        Editor.Panel.open('graphics-editor');
    },

    /**
     * 導出腳本
     * @param {object} data - 繪圖數據
     */
    async exportScript(data: any) {
        console.log('[Graphics Editor] 導出腳本:', data);
        // 這裡處理導出邏輯
    },

    /**
     * 寫入文件到文件系統
     * @param {string} filePath - 文件路徑
     * @param {string} content - 文件內容
     */
    async writeFile(filePath: string, content: string) {
        try {
            console.log('[Graphics Editor] 準備寫入文件:', filePath);
            
            // 確保目錄存在
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                console.log('[Graphics Editor] 創建目錄:', dir);
                fs.mkdirSync(dir, { recursive: true });
            }
            
            // 寫入文件
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('[Graphics Editor] ✓ 文件寫入成功:', filePath);
            return { success: true, path: filePath };
        } catch (err: any) {
            console.error('[Graphics Editor] ✗ 文件寫入失敗:', err);
            return { success: false, error: err.message };
        }
    }
};
