/**
 * Graphics Editor 主入口
 */

declare const Editor: any;

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
    }
};
