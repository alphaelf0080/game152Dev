/**
 * Scene Converter Extension for Cocos Creator
 * 場景轉換器 - 在 2D 和 3D 項目之間轉換場景
 */

export const methods = {
    /**
     * 打開面板
     */
    openPanel() {
        Editor.Panel.open('scene-converter');
    },

    /**
     * 導出當前場景結構
     */
    async exportScene(scenePath: string) {
        try {
            console.log('[Scene Converter] 開始導出場景:', scenePath);
            
            // 獲取場景資源
            const scene = await Editor.Message.request('scene', 'query-scene');
            if (!scene) {
                console.error('[Scene Converter] 無法獲取場景資料');
                return { success: false, error: '無法獲取場景' };
            }

            // 遍歷場景節點
            const sceneData = await this.traverseNode(scene);
            
            // 保存為 JSON
            const fs = require('fs');
            const path = require('path');
            const exportPath = path.join(Editor.Project.path, 'scene-exports', `${Date.now()}-scene-data.json`);
            
            // 確保目錄存在
            const dir = path.dirname(exportPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(exportPath, JSON.stringify(sceneData, null, 2), 'utf-8');
            
            console.log('[Scene Converter] ✅ 導出完成:', exportPath);
            return { success: true, path: exportPath, data: sceneData };
            
        } catch (error) {
            console.error('[Scene Converter] 導出失敗:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * 遍歷節點並提取資訊
     */
    async traverseNode(node: any): Promise<any> {
        const nodeData: any = {
            name: node.name,
            position: node.position,
            rotation: node.rotation,
            scale: node.scale,
            active: node.active,
            layer: node.layer,
            components: [],
            children: []
        };

        // 提取組件資訊
        if (node.__comps__) {
            for (const comp of node.__comps__) {
                const compData = await this.extractComponentData(comp);
                if (compData) {
                    nodeData.components.push(compData);
                }
            }
        }

        // 遞歸處理子節點
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                const childData = await this.traverseNode(child);
                nodeData.children.push(childData);
            }
        }

        return nodeData;
    },

    /**
     * 提取組件資料
     */
    async extractComponentData(comp: any): Promise<any> {
        const type = comp.__type__;
        const compData: any = {
            type: type,
            enabled: comp.enabled
        };

        // 根據不同組件類型提取特定資料
        switch (type) {
            case 'cc.Sprite':
                compData.spriteFrame = comp.spriteFrame ? comp.spriteFrame.uuid : null;
                compData.sizeMode = comp.sizeMode;
                compData.type = comp.type;
                compData.color = comp.color;
                compData.is2D = true; // 標記這是 2D Sprite
                break;

            case 'cc.UITransform':
                compData.contentSize = comp.contentSize;
                compData.anchorPoint = comp.anchorPoint;
                break;

            case 'cc.Widget':
                compData.isAlignTop = comp.isAlignTop;
                compData.isAlignBottom = comp.isAlignBottom;
                compData.isAlignLeft = comp.isAlignLeft;
                compData.isAlignRight = comp.isAlignRight;
                compData.top = comp.top;
                compData.bottom = comp.bottom;
                compData.left = comp.left;
                compData.right = comp.right;
                break;

            case 'cc.Camera':
                compData.priority = comp.priority;
                compData.visibility = comp.visibility;
                compData.clearFlags = comp.clearFlags;
                compData.backgroundColor = comp.backgroundColor;
                compData.projection = comp.projection;
                break;

            case 'cc.MeshRenderer':
                compData.mesh = comp.mesh ? comp.mesh.uuid : null;
                compData.materials = comp.materials ? comp.materials.map((m: any) => m.uuid) : [];
                break;

            default:
                // 對於自定義組件，嘗試序列化所有屬性
                compData.properties = {};
                for (const key in comp) {
                    if (key.startsWith('_') || key === '__type__') continue;
                    try {
                        compData.properties[key] = comp[key];
                    } catch (e) {
                        // 忽略無法序列化的屬性
                    }
                }
                break;
        }

        return compData;
    },

    /**
     * 導入場景結構到當前項目
     */
    async importScene(jsonPath: string) {
        try {
            console.log('[Scene Converter] 開始導入場景:', jsonPath);
            
            const fs = require('fs');
            const sceneData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            
            // 在當前場景中創建節點
            const result = await this.createNodesInScene(sceneData);
            
            console.log('[Scene Converter] ✅ 導入完成');
            return { success: true, result };
            
        } catch (error) {
            console.error('[Scene Converter] 導入失敗:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * 在場景中創建節點
     */
    async createNodesInScene(nodeData: any, parentUuid?: string) {
        // 創建節點
        const createNodeResult = await Editor.Message.request('scene', 'create-node', {
            parent: parentUuid,
            assetUuid: 'db://internal/node' // Node 預製體
        });

        if (!createNodeResult) {
            console.error('[Scene Converter] 創建節點失敗');
            return null;
        }

        const nodeUuid = createNodeResult.uuid;

        // 設置節點屬性
        await Editor.Message.request('scene', 'set-property', {
            uuid: nodeUuid,
            path: 'name',
            dump: { value: nodeData.name }
        });

        await Editor.Message.request('scene', 'set-property', {
            uuid: nodeUuid,
            path: 'position',
            dump: { value: nodeData.position }
        });

        await Editor.Message.request('scene', 'set-property', {
            uuid: nodeUuid,
            path: 'rotation',
            dump: { value: nodeData.rotation }
        });

        await Editor.Message.request('scene', 'set-property', {
            uuid: nodeUuid,
            path: 'scale',
            dump: { value: nodeData.scale }
        });

        // 添加組件
        for (const compData of nodeData.components) {
            await this.createComponent(nodeUuid, compData);
        }

        // 遞歸創建子節點
        for (const childData of nodeData.children) {
            await this.createNodesInScene(childData, nodeUuid);
        }

        return nodeUuid;
    },

    /**
     * 創建組件
     */
    async createComponent(nodeUuid: string, compData: any) {
        try {
            // 特殊處理: 2D Sprite 轉 3D (使用 MeshRenderer + Material)
            if (compData.type === 'cc.Sprite' && compData.is2D) {
                console.log('[Scene Converter] 檢測到 2D Sprite，建議手動轉換為 3D 物件');
                // 可以選擇創建 MeshRenderer 或保持為 Sprite（3D 項目也支援 Sprite）
                // 這裡我們保持為 Sprite，因為 3D 項目也可以使用 2D Sprite
            }

            // 添加組件
            const addCompResult = await Editor.Message.request('scene', 'create-component', {
                uuid: nodeUuid,
                component: compData.type
            });

            if (!addCompResult) {
                console.warn(`[Scene Converter] 無法添加組件: ${compData.type}`);
                return;
            }

            // 設置組件屬性
            for (const key in compData) {
                if (key === 'type' || key === 'enabled' || key === 'is2D') continue;
                
                try {
                    await Editor.Message.request('scene', 'set-property', {
                        uuid: nodeUuid,
                        path: `${compData.type}.${key}`,
                        dump: { value: compData[key] }
                    });
                } catch (e) {
                    console.warn(`[Scene Converter] 無法設置屬性 ${key}:`, e.message);
                }
            }

        } catch (error) {
            console.error('[Scene Converter] 創建組件失敗:', error);
        }
    }
};

/**
 * 擴展載入時調用
 */
export function load() {
    console.log('[Scene Converter] Extension loaded');
}

/**
 * 擴展卸載時調用
 */
export function unload() {
    console.log('[Scene Converter] Extension unloaded');
}
