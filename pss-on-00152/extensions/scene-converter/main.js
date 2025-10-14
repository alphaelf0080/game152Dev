/**
 * Scene Converter Extension - 簡化的 JavaScript 版本
 */

const { join } = require('path');
const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');

exports.methods = {
    /**
     * 打開面板
     */
    openPanel() {
        Editor.Panel.open('scene-converter');
    },

    /**
     * 測試場景 API（調試用）
     */
    async testSceneAPI() {
        console.log('[Scene Converter] ===== 測試場景 API =====');
        
        // 測試各種可能的 API
        const tests = [
            'query-scene',
            'query-current-scene',
            'query-nodes',
            'query-all-nodes',
            'query-scene-root'
        ];
        
        for (const api of tests) {
            try {
                const result = await Editor.Message.request('scene', api);
                console.log(`[Scene Converter] ✓ ${api}:`, result);
            } catch (err) {
                console.log(`[Scene Converter] ✗ ${api}: 不支持或錯誤`);
            }
        }
        
        console.log('[Scene Converter] ===== 測試完成 =====');
    },

    /**
     * 導出當前場景結構
     */
    async exportScene() {
        try {
            console.log('[Scene Converter] 開始導出場景...');
            
            // 獲取當前場景 UUID
            const sceneUuid = await Editor.Message.request('scene', 'query-current-scene');
            console.log('[Scene Converter] 場景 UUID:', sceneUuid);
            
            if (!sceneUuid) {
                return { success: false, error: '無法獲取當前場景 UUID' };
            }
            
            // 查詢場景節點
            const scene = await Editor.Message.request('scene', 'query-node', sceneUuid);
            console.log('[Scene Converter] 場景節點:', scene);
            
            if (!scene) {
                return { success: false, error: '無法查詢場景節點' };
            }
            
            // 打印場景結構以便調試
            console.log('[Scene Converter] 場景名稱:', scene.name ? scene.name.value : 'Unknown');
            console.log('[Scene Converter] 場景 children:', scene.children);
            console.log('[Scene Converter] children 類型:', typeof scene.children);
            console.log('[Scene Converter] children 是數組?:', Array.isArray(scene.children));
            
            // 檢查 children 結構
            let childrenArray = null;
            if (Array.isArray(scene.children)) {
                // children 直接是數組
                childrenArray = scene.children;
                console.log('[Scene Converter] children 直接是數組，長度:', childrenArray.length);
            } else if (scene.children && scene.children.value) {
                // children 是對象，有 value 屬性
                childrenArray = scene.children.value;
                console.log('[Scene Converter] children.value 是數組，長度:', childrenArray.length);
            } else {
                console.warn('[Scene Converter] 無法解析 children 結構');
            }
            
            // 構建場景數據
            const sceneData = {
                name: scene.name ? scene.name.value : 'Scene',
                uuid: sceneUuid,
                children: []
            };
            
            // 處理場景的所有子節點
            if (childrenArray && Array.isArray(childrenArray) && childrenArray.length > 0) {
                console.log('[Scene Converter] 開始處理', childrenArray.length, '個根節點');
                
                for (let i = 0; i < childrenArray.length; i++) {
                    const childItem = childrenArray[i];
                    
                    try {
                        // 提取 UUID（統一處理所有嵌套情況）
                        let childUuid = childItem;
                        
                        // 首先嘗試提取 uuid 或 value
                        if (typeof childItem === 'object' && childItem !== null) {
                            if (childItem.uuid) {
                                childUuid = childItem.uuid;
                            } else if (childItem.value) {
                                childUuid = childItem.value;
                            }
                        }
                        
                        // 統一的遞歸提取循環（無論從哪個分支來的）
                        while (typeof childUuid === 'object' && childUuid !== null) {
                            if (childUuid.uuid) {
                                childUuid = childUuid.uuid;
                            } else if (childUuid.value) {
                                childUuid = childUuid.value;
                            } else {
                                console.log(`[Scene Converter] ⚠️ UUID 對象沒有 uuid 或 value 屬性，keys:`, Object.keys(childUuid));
                                break;
                            }
                        }
                        
                        const child = await Editor.Message.request('scene', 'query-node', childUuid);
                        
                        if (child) {
                            const childName = child.name ? (child.name.value || child.name) : 'Unknown';
                            console.log(`[Scene Converter] ✓ 處理根節點 ${i + 1}/${childrenArray.length}: ${childName}`);
                            
                            const childData = await exports.methods.traverseNode(child, 0);
                            sceneData.children.push(childData);
                        } else {
                            console.warn(`[Scene Converter] ✗ 無法查詢根節點 ${i + 1}，UUID: ${childUuid}`);
                        }
                    } catch (e) {
                        console.error(`[Scene Converter] ✗ 處理第 ${i + 1} 個根節點異常:`, e.message);
                    }
                }
                
                console.log('[Scene Converter] ✅ 所有根節點處理完成，共', sceneData.children.length, '個');
                
                // 統計節點樹信息
                const stats = exports.methods.calculateTreeStats(sceneData.children);
                console.log('[Scene Converter] 📊 節點樹統計:');
                console.log(`  - 總節點數: ${stats.totalNodes}`);
                console.log(`  - 最大深度: ${stats.maxDepth}`);
                console.log(`  - 葉子節點: ${stats.leafNodes}`);
                console.log(`  - 有子節點的節點: ${stats.parentNodes}`);
            } else {
                console.warn('[Scene Converter] ⚠️ 場景沒有子節點');
            }
            
            // 保存 JSON
            const exportDir = join(Editor.Project.path, 'scene-exports');
            if (!existsSync(exportDir)) {
                mkdirSync(exportDir, { recursive: true });
            }
            
            const timestamp = Date.now();
            const filename = `scene-${timestamp}.json`;
            const exportPath = join(exportDir, filename);
            
            writeFileSync(exportPath, JSON.stringify(sceneData, null, 2), 'utf-8');
            
            console.log('[Scene Converter] ✅ 導出成功:', exportPath);
            
            return { 
                success: true, 
                path: exportPath,
                filename: filename,
                data: sceneData 
            };
            
        } catch (error) {
            console.error('[Scene Converter] 導出失敗:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * 遍歷節點（支援任意深度的節點樹）
     * @param {Object} node - 節點對象
     * @param {number} depth - 當前深度（用於日誌追踪）
     */
    async traverseNode(node, depth = 0) {
        const nodeName = node.name ? (node.name.value || node.name) : 'Unknown';
        const indent = '  '.repeat(depth); // 縮排顯示層級
        
        const nodeData = {
            uuid: node.uuid ? (node.uuid.value || node.uuid) : '',
            name: nodeName,
            position: node.position ? (node.position.value || node.position) : { x: 0, y: 0, z: 0 },
            rotation: node.rotation ? (node.rotation.value || node.rotation) : { x: 0, y: 0, z: 0, w: 1 },
            scale: node.scale ? (node.scale.value || node.scale) : { x: 1, y: 1, z: 1 },
            active: node.active ? (node.active.value !== undefined ? node.active.value : node.active) : true,
            layer: node.layer ? (node.layer.value !== undefined ? node.layer.value : node.layer) : 0,
            components: [],
            children: []
        };

        // 提取組件
        console.log(`${indent}[Scene Converter] 檢查節點 ${nodeName} 的組件...`);
        console.log(`${indent}  - node.__comps__:`, node.__comps__ ? '存在' : '不存在');
        
        if (node.__comps__) {
            console.log(`${indent}  - __comps__ 類型:`, typeof node.__comps__);
            console.log(`${indent}  - __comps__.value:`, node.__comps__.value ? `存在 (${Array.isArray(node.__comps__.value) ? '數組' : typeof node.__comps__.value})` : '不存在');
            
            let compsArray = null;
            if (Array.isArray(node.__comps__)) {
                compsArray = node.__comps__;
            } else if (node.__comps__.value && Array.isArray(node.__comps__.value)) {
                compsArray = node.__comps__.value;
            }
            
            if (compsArray && compsArray.length > 0) {
                console.log(`${indent}  - 組件數量: ${compsArray.length}`);
                console.log(`${indent}  - 第一個組件:`, compsArray[0]);
                
                for (let i = 0; i < compsArray.length; i++) {
                    const compItem = compsArray[i];
                    try {
                        // 提取組件 UUID
                        let compUuid = compItem;
                        if (typeof compItem === 'object' && compItem !== null) {
                            if (compItem.uuid) {
                                compUuid = compItem.uuid;
                            } else if (compItem.value) {
                                compUuid = compItem.value;
                            }
                        }
                        
                        // 遞歸提取 UUID
                        while (typeof compUuid === 'object' && compUuid !== null) {
                            if (compUuid.uuid) {
                                compUuid = compUuid.uuid;
                            } else if (compUuid.value) {
                                compUuid = compUuid.value;
                            } else {
                                break;
                            }
                        }
                        
                        console.log(`${indent}    [${i + 1}] 查詢組件 UUID: ${compUuid}`);
                        const comp = await Editor.Message.request('scene', 'query-component', compUuid);
                        
                        if (comp) {
                            console.log(`${indent}    ✓ 組件類型: ${comp.__type__}`);
                            const compData = exports.methods.extractComponent(comp);
                            if (compData) {
                                nodeData.components.push(compData);
                            }
                        } else {
                            console.warn(`${indent}    ✗ 無法查詢組件: ${compUuid}`);
                        }
                    } catch (e) {
                        console.warn(`${indent}    ✗ 查詢組件異常:`, e.message);
                    }
                }
            } else {
                console.log(`${indent}  - 此節點沒有組件`);
            }
        }

        // 遞歸處理子節點（支援任意深度）
        let childrenArray = null;
        if (Array.isArray(node.children)) {
            childrenArray = node.children;
        } else if (node.children && node.children.value) {
            if (Array.isArray(node.children.value)) {
                childrenArray = node.children.value;
            }
        }
        
        if (childrenArray && Array.isArray(childrenArray) && childrenArray.length > 0) {
            console.log(`${indent}[Scene Converter] 層級 ${depth}: ${nodeData.name} 有 ${childrenArray.length} 個子節點`);
            
            for (let i = 0; i < childrenArray.length; i++) {
                const childItem = childrenArray[i];
                try {
                    // 提取 UUID（統一處理所有嵌套情況）
                    let childUuid = childItem;
                    
                    // 首先嘗試提取 uuid 或 value
                    if (typeof childItem === 'object' && childItem !== null) {
                        if (childItem.uuid) {
                            childUuid = childItem.uuid;
                        } else if (childItem.value) {
                            childUuid = childItem.value;
                        }
                    }
                    
                    // 統一的遞歸提取循環（無論從哪個分支來的）
                    while (typeof childUuid === 'object' && childUuid !== null) {
                        if (childUuid.uuid) {
                            childUuid = childUuid.uuid;
                        } else if (childUuid.value) {
                            childUuid = childUuid.value;
                        } else {
                            break;
                        }
                    }
                    
                    // 查詢子節點並遞歸處理
                    const child = await Editor.Message.request('scene', 'query-node', childUuid);
                    if (child) {
                        const childName = child.name ? (child.name.value || child.name) : 'Unknown';
                        console.log(`${indent}  └─ [${i + 1}/${childrenArray.length}] ${childName}`);
                        
                        // 遞歸遍歷子節點，傳遞深度 + 1
                        const childData = await exports.methods.traverseNode(child, depth + 1);
                        nodeData.children.push(childData);
                    } else {
                        console.warn(`${indent}  └─ ⚠️ 無法查詢子節點 UUID: ${childUuid}`);
                    }
                } catch (e) {
                    console.error(`${indent}  └─ ✗ 處理子節點失敗:`, e.message);
                }
            }
            
            console.log(`${indent}[Scene Converter] ✓ 層級 ${depth}: ${nodeData.name} 的 ${nodeData.children.length} 個子節點處理完成`);
        }

        return nodeData;
    },

    /**
     * 計算節點樹統計信息
     * @param {Array} nodes - 節點數組
     * @param {number} currentDepth - 當前深度
     */
    calculateTreeStats(nodes, currentDepth = 0) {
        let stats = {
            totalNodes: 0,
            maxDepth: currentDepth,
            leafNodes: 0,
            parentNodes: 0
        };

        for (const node of nodes) {
            stats.totalNodes++;
            
            if (node.children && node.children.length > 0) {
                stats.parentNodes++;
                // 遞歸計算子節點
                const childStats = exports.methods.calculateTreeStats(node.children, currentDepth + 1);
                stats.totalNodes += childStats.totalNodes;
                stats.maxDepth = Math.max(stats.maxDepth, childStats.maxDepth);
                stats.leafNodes += childStats.leafNodes;
                stats.parentNodes += childStats.parentNodes;
            } else {
                stats.leafNodes++;
            }
        }

        return stats;
    },

    /**
     * 提取組件資料
     */
    extractComponent(comp) {
        const type = comp.__type__;
        const compData = {
            type: type,
            enabled: comp.enabled ? comp.enabled.value : true,
            properties: {}
        };

        // 根據組件類型提取特定屬性
        if (type === 'cc.Sprite') {
            compData.properties.spriteFrame = comp.spriteFrame ? comp.spriteFrame.value : null;
            compData.properties.type = comp.type ? comp.type.value : 0;
            compData.properties.sizeMode = comp.sizeMode ? comp.sizeMode.value : 0;
            compData.properties.is2D = true; // 標記為 2D Sprite
        } else if (type === 'cc.UITransform') {
            compData.properties.contentSize = comp.contentSize ? comp.contentSize.value : { width: 100, height: 100 };
            compData.properties.anchorPoint = comp.anchorPoint ? comp.anchorPoint.value : { x: 0.5, y: 0.5 };
        } else if (type === 'cc.Widget') {
            compData.properties.isAlignTop = comp.isAlignTop ? comp.isAlignTop.value : false;
            compData.properties.isAlignBottom = comp.isAlignBottom ? comp.isAlignBottom.value : false;
            compData.properties.isAlignLeft = comp.isAlignLeft ? comp.isAlignLeft.value : false;
            compData.properties.isAlignRight = comp.isAlignRight ? comp.isAlignRight.value : false;
            compData.properties.top = comp.top ? comp.top.value : 0;
            compData.properties.bottom = comp.bottom ? comp.bottom.value : 0;
            compData.properties.left = comp.left ? comp.left.value : 0;
            compData.properties.right = comp.right ? comp.right.value : 0;
        } else if (type === 'cc.Camera') {
            compData.properties.priority = comp.priority ? comp.priority.value : 0;
            compData.properties.visibility = comp.visibility ? comp.visibility.value : 0xffffffff;
            compData.properties.clearFlags = comp.clearFlags ? comp.clearFlags.value : 7;
        }

        return compData;
    },

    /**
     * 導入場景
     */
    async importScene(jsonPath) {
        try {
            console.log('[Scene Converter] 開始導入:', jsonPath);
            
            const jsonData = readFileSync(jsonPath, 'utf-8');
            const sceneData = JSON.parse(jsonData);
            
            console.log('[Scene Converter] 場景數據:', sceneData.name);
            console.log('[Scene Converter] 根節點數量:', sceneData.children ? sceneData.children.length : 0);
            
            // 獲取當前場景根節點 UUID
            const currentSceneUuid = await Editor.Message.request('scene', 'query-current-scene');
            console.log('[Scene Converter] 當前場景 UUID:', currentSceneUuid);
            
            // 遍歷並創建所有根節點
            if (sceneData.children && Array.isArray(sceneData.children)) {
                for (let i = 0; i < sceneData.children.length; i++) {
                    const rootNode = sceneData.children[i];
                    console.log(`[Scene Converter] 創建根節點 ${i + 1}/${sceneData.children.length}: ${rootNode.name}`);
                    await exports.methods.createNodes(rootNode, currentSceneUuid);
                }
            }
            
            console.log('[Scene Converter] ✅ 導入完成');
            return { success: true };
            
        } catch (error) {
            console.error('[Scene Converter] 導入失敗:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * 創建節點（遞歸）
     */
    async createNodes(nodeData, parentUuid) {
        try {
            if (!nodeData || !nodeData.name) {
                console.error('[Scene Converter] ✗ 節點數據無效:', nodeData);
                return null;
            }
            
            // 創建節點
            const createResult = await Editor.Message.request('scene', 'create-node', {
                parent: parentUuid
            });

            if (!createResult) {
                console.error('[Scene Converter] ✗ 創建節點失敗:', nodeData.name);
                return null;
            }

            const nodeUuid = createResult;

            // 設置節點名稱
            await Editor.Message.request('scene', 'set-property', {
                uuid: nodeUuid,
                path: 'name',
                dump: { value: nodeData.name }
            });

            // 設置位置
            if (nodeData.position) {
                await Editor.Message.request('scene', 'set-property', {
                    uuid: nodeUuid,
                    path: 'position',
                    dump: { value: nodeData.position }
                });
            }

            // 設置旋轉
            if (nodeData.rotation) {
                await Editor.Message.request('scene', 'set-property', {
                    uuid: nodeUuid,
                    path: 'rotation',
                    dump: { value: nodeData.rotation }
                });
            }

            // 設置縮放
            if (nodeData.scale) {
                await Editor.Message.request('scene', 'set-property', {
                    uuid: nodeUuid,
                    path: 'scale',
                    dump: { value: nodeData.scale }
                });
            }

            // 設置 active 狀態
            if (nodeData.active !== undefined) {
                await Editor.Message.request('scene', 'set-property', {
                    uuid: nodeUuid,
                    path: 'active',
                    dump: { value: nodeData.active }
                });
            }

            // 設置 layer
            if (nodeData.layer !== undefined) {
                await Editor.Message.request('scene', 'set-property', {
                    uuid: nodeUuid,
                    path: 'layer',
                    dump: { value: nodeData.layer }
                });
            }

            const childCount = nodeData.children ? nodeData.children.length : 0;
            const compCount = nodeData.components ? nodeData.components.length : 0;
            
            console.log(`[Scene Converter] ✓ 已創建節點: ${nodeData.name} (組件: ${compCount}, 子節點: ${childCount})`);

            // 添加組件
            if (nodeData.components && Array.isArray(nodeData.components) && nodeData.components.length > 0) {
                for (let i = 0; i < nodeData.components.length; i++) {
                    const compData = nodeData.components[i];
                    try {
                        console.log(`[Scene Converter]   添加組件 [${i + 1}/${nodeData.components.length}]: ${compData.type}`);
                        
                        // 添加組件到節點
                        const addResult = await Editor.Message.request('scene', 'create-component', {
                            uuid: nodeUuid,
                            component: compData.type
                        });
                        
                        if (addResult) {
                            console.log(`[Scene Converter]   ✓ 組件已添加: ${compData.type}`);
                            
                            // 設置組件屬性
                            if (compData.properties) {
                                for (const propName in compData.properties) {
                                    try {
                                        await Editor.Message.request('scene', 'set-property', {
                                            uuid: addResult,
                                            path: propName,
                                            dump: { value: compData.properties[propName] }
                                        });
                                    } catch (e) {
                                        console.warn(`[Scene Converter]   ⚠️ 設置屬性 ${propName} 失敗:`, e.message);
                                    }
                                }
                            }
                        } else {
                            console.warn(`[Scene Converter]   ✗ 無法添加組件: ${compData.type}`);
                        }
                    } catch (e) {
                        console.error(`[Scene Converter]   ✗ 添加組件異常:`, e.message);
                    }
                }
            }

            // 遞歸創建子節點
            if (nodeData.children && Array.isArray(nodeData.children)) {
                for (let i = 0; i < nodeData.children.length; i++) {
                    const childData = nodeData.children[i];
                    await exports.methods.createNodes(childData, nodeUuid);
                }
            }

            return nodeUuid;
            
        } catch (error) {
            console.error('[Scene Converter] ✗ 創建節點異常:', nodeData ? nodeData.name : 'Unknown', error.message);
            return null;
        }
    }
};

/**
 * 擴展載入
 */
exports.load = function() {
    console.log('[Scene Converter] Extension loaded');
};

/**
 * 擴展卸載
 */
exports.unload = function() {
    console.log('[Scene Converter] Extension unloaded');
};
