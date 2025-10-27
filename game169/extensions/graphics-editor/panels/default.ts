/**
 * Graphics Editor 面板腳本 - 帶背景圖片和坐標系統
 */

declare const Editor: any;

export const template = `
<div class="container">
    <!-- 工具欄 -->
    <div class="toolbar">
        <!-- 背景圖片 -->
        <div class="toolbar-section">
            <label>背景圖:</label>
            <ui-button id="btnLoadBg">載入背景</ui-button>
            <ui-button id="btnClearBg">清除背景</ui-button>
            <ui-checkbox id="showGrid" checked>顯示網格</ui-checkbox>
        </div>

        <!-- 坐標系統 -->
        <div class="toolbar-section">
            <label>坐標原點:</label>
            <ui-select id="originMode">
                <option value="center">中心 (0,0)</option>
                <option value="bottomLeft">左下 (Cocos 預設)</option>
                <option value="topLeft">左上</option>
            </ui-select>
        </div>

        <!-- 繪圖工具 -->
        <div class="toolbar-section">
            <label>工具:</label>
            <ui-button class="tool-btn active" id="btnRect">矩形</ui-button>
            <ui-button class="tool-btn" id="btnCircle">圓形</ui-button>
            <ui-button class="tool-btn" id="btnLine">線條</ui-button>
            <ui-button class="tool-btn" id="btnPolyline">折線</ui-button>
        </div>

        <!-- 顏色設置 -->
        <div class="toolbar-section">
            <label>填充:</label>
            <input type="color" id="fillColor" value="#ff0000">
            <label>透明度:</label>
            <ui-num-input id="fillAlpha" value="255" min="0" max="255" step="1"></ui-num-input>
        </div>

        <!-- 描邊設置 -->
        <div class="toolbar-section">
            <label>描邊:</label>
            <input type="color" id="strokeColor" value="#000000">
            <label>透明度:</label>
            <ui-num-input id="strokeAlpha" value="255" min="0" max="255" step="1"></ui-num-input>
        </div>

        <!-- 線寬 -->
        <div class="toolbar-section">
            <label>線寬:</label>
            <ui-num-input id="lineWidth" value="2" min="0" max="20"></ui-num-input>
        </div>

        <!-- 填充模式 -->
        <div class="toolbar-section">
            <ui-checkbox id="fillMode" checked>填充</ui-checkbox>
            <ui-checkbox id="strokeMode" checked>描邊</ui-checkbox>
        </div>

        <!-- 視圖控制 -->
        <div class="toolbar-section">
            <label>視圖:</label>
            <ui-button id="btnZoomIn">放大 (+)</ui-button>
            <ui-button id="btnZoomOut">縮小 (-)</ui-button>
            <ui-button id="btnZoomFit">適應 (F)</ui-button>
            <ui-button id="btnZoomReset">重置 (R)</ui-button>
            <span id="zoomLevel" style="margin-left: 5px; font-size: 11px;">100%</span>
        </div>

        <!-- 操作按鈕 -->
        <div class="toolbar-section">
            <ui-button id="btnUndo">撤銷</ui-button>
            <ui-button id="btnClear">清空</ui-button>
            <ui-button id="btnClosePolyline" style="display:none;">完成折線 (ESC)</ui-button>
        </div>
    </div>

    <!-- 主要工作區 -->
    <div class="main-area">
        <!-- 畫布區域 -->
        <div class="canvas-area" id="canvasArea">
            <div class="canvas-container" id="canvasContainer">
                <div class="canvas-wrapper" id="canvasWrapper">
                    <canvas id="bgCanvas"></canvas>
                    <canvas id="gridCanvas"></canvas>
                    <canvas id="drawCanvas"></canvas>
                </div>
            </div>
            <div id="coordDisplay" class="coord-display"></div>
            <div id="viewInfo" class="view-info"></div>
        </div>

        <!-- 側邊欄 -->
        <div class="sidebar">
            <h3>畫布設置</h3>
            <div class="canvas-settings">
                <label>畫布寬度:</label>
                <ui-num-input id="canvasWidth" value="600" min="100" max="2000"></ui-num-input>
                <label>畫布高度:</label>
                <ui-num-input id="canvasHeight" value="400" min="100" max="2000"></ui-num-input>
                <ui-button id="btnApplySize">應用尺寸</ui-button>
            </div>

            <h3>繪圖命令記錄</h3>
            <div class="command-list" id="commandList">
                <div style="color: #6a9955;">// 繪圖命令將顯示在這裡</div>
            </div>

            <div class="export-section">
                <h3>生成的腳本代碼</h3>
                <ui-code id="codePreview" language="typescript">// TypeScript 代碼將顯示在這裡</ui-code>
                <ui-button id="btnCopyCode" class="green">複製代碼</ui-button>
                <ui-button id="btnExport" class="blue">導出為 TypeScript 腳本</ui-button>
                <ui-button id="btnExportMask" class="purple">導出為 Mask 腳本</ui-button>
                <ui-button id="btnClearAll" class="red">清空所有繪圖</ui-button>
            </div>
        </div>
    </div>
</div>
`;

export const style = `
.container {
    display: flex;
    height: 100%;
    flex-direction: column;
}

.toolbar {
    padding: 10px;
    border-bottom: 1px solid var(--color-normal-border);
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.toolbar-section {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 5px;
    border-right: 1px solid var(--color-normal-border);
}

.toolbar-section:last-child {
    border-right: none;
}

.toolbar label {
    margin-right: 5px;
    font-size: 12px;
}

.tool-btn.active {
    background: var(--color-info-fill);
}

.main-area {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.canvas-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-normal-fill-emphasis);
    position: relative;
    overflow: hidden;
}

.canvas-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    cursor: grab;
}

.canvas-container.panning {
    cursor: grabbing;
}

.canvas-wrapper {
    position: absolute;
    transform-origin: 0 0;
    transition: transform 0.1s ease-out;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
}

#bgCanvas, #gridCanvas, #drawCanvas {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
}

#bgCanvas {
    z-index: 1;
    background: #fff;
}

#gridCanvas {
    z-index: 2;
    pointer-events: none;
}

#drawCanvas {
    z-index: 3;
    cursor: crosshair;
}

.coord-display {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 11px;
    z-index: 10;
    pointer-events: none;
}

.view-info {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0,0,0,0.7);
    color: #fff;
    padding: 5px 10px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 11px;
    z-index: 10;
    pointer-events: none;
}

.sidebar {
    width: 350px;
    border-left: 1px solid var(--color-normal-border);
    padding: 15px;
    overflow-y: auto;
}

.sidebar h3 {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 14px;
}

.canvas-settings {
    border: 1px solid var(--color-normal-border);
    border-radius: 3px;
    padding: 10px;
    margin-bottom: 20px;
}

.canvas-settings label {
    display: block;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 12px;
}

.canvas-settings ui-num-input {
    width: 100%;
}

.canvas-settings ui-button {
    width: 100%;
    margin-top: 10px;
}

.command-list {
    border: 1px solid var(--color-normal-border);
    border-radius: 3px;
    padding: 10px;
    max-height: 300px;
    overflow-y: auto;
    font-family: monospace;
    font-size: 11px;
    margin-bottom: 20px;
}

.command-item {
    padding: 3px 0;
}

.export-section {
    margin-top: 20px;
}

#codePreview {
    max-height: 200px;
    margin-bottom: 10px;
}

ui-button {
    margin-bottom: 5px;
}

ui-button.green {
    background: var(--color-success-fill);
}

ui-button.blue {
    background: var(--color-info-fill);
}

ui-button.purple {
    background: #9b59b6;
    color: white;
}

ui-button.red {
    background: var(--color-danger-fill);
}
`;

export const $ = {
    btnLoadBg: '#btnLoadBg',
    btnClearBg: '#btnClearBg',
    showGrid: '#showGrid',
    originMode: '#originMode',
    btnRect: '#btnRect',
    btnCircle: '#btnCircle',
    btnLine: '#btnLine',
    btnPolyline: '#btnPolyline',
    fillColor: '#fillColor',
    fillAlpha: '#fillAlpha',
    strokeColor: '#strokeColor',
    strokeAlpha: '#strokeAlpha',
    lineWidth: '#lineWidth',
    fillMode: '#fillMode',
    strokeMode: '#strokeMode',
    btnZoomIn: '#btnZoomIn',
    btnZoomOut: '#btnZoomOut',
    btnZoomFit: '#btnZoomFit',
    btnZoomReset: '#btnZoomReset',
    zoomLevel: '#zoomLevel',
    btnUndo: '#btnUndo',
    btnClear: '#btnClear',
    btnClosePolyline: '#btnClosePolyline',
    btnCopyCode: '#btnCopyCode',
    btnExport: '#btnExport',
    btnExportMask: '#btnExportMask',
    btnClearAll: '#btnClearAll',
    canvasWidth: '#canvasWidth',
    canvasHeight: '#canvasHeight',
    btnApplySize: '#btnApplySize',
    canvasArea: '#canvasArea',
    canvasContainer: '#canvasContainer',
    canvasWrapper: '#canvasWrapper',
    bgCanvas: '#bgCanvas',
    gridCanvas: '#gridCanvas',
    drawCanvas: '#drawCanvas',
    coordDisplay: '#coordDisplay',
    viewInfo: '#viewInfo',
    commandList: '#commandList',
    codePreview: '#codePreview'
};

// Graphics 編輯器邏輯
class GraphicsEditorLogic {
    private bgCanvas: HTMLCanvasElement;
    private gridCanvas: HTMLCanvasElement;
    private drawCanvas: HTMLCanvasElement;
    private bgCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private drawCtx: CanvasRenderingContext2D;
    
    private currentTool: string = 'rect';
    private isDrawing: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private shapes: any[] = [];
    private commands: string[] = [];
    
    private fillColor: string = '#ff0000';
    private fillAlpha: number = 255;
    private strokeColor: string = '#000000';
    private strokeAlpha: number = 255;
    private lineWidth: number = 2;
    private fillMode: boolean = true;
    private strokeMode: boolean = true;

    private bgImage: HTMLImageElement | null = null;
    private bgOffsetX: number = 0; // 背景圖 X 偏移
    private bgOffsetY: number = 0; // 背景圖 Y 偏移
    private skipOffsetCalculation: boolean = false; // 跳過偏移計算標記
    private showGrid: boolean = true;
    private originMode: string = 'bottomLeft';
    private canvasWidth: number = 600;
    private canvasHeight: number = 400;

    // 折線相關
    private isDrawingPolyline: boolean = false;
    private polylinePoints: Array<{x: number, y: number}> = [];

    // 視圖控制
    private zoom: number = 1.0;
    private minZoom: number = 0.1;
    private maxZoom: number = 10.0;
    private panX: number = 0;
    private panY: number = 0;
    private isPanning: boolean = false;
    private lastPanX: number = 0;
    private lastPanY: number = 0;
    private canvasContainer: HTMLElement;
    private canvasWrapper: HTMLElement;

    constructor(private panel: any) {}

    init() {
        this.bgCanvas = this.panel.$.bgCanvas as HTMLCanvasElement;
        this.gridCanvas = this.panel.$.gridCanvas as HTMLCanvasElement;
        this.drawCanvas = this.panel.$.drawCanvas as HTMLCanvasElement;
        this.canvasContainer = this.panel.$.canvasContainer as HTMLElement;
        this.canvasWrapper = this.panel.$.canvasWrapper as HTMLElement;
        
        if (!this.bgCanvas || !this.gridCanvas || !this.drawCanvas) {
            console.error('[Graphics Editor] Canvas not found!');
            return;
        }

        this.bgCtx = this.bgCanvas.getContext('2d')!;
        this.gridCtx = this.gridCanvas.getContext('2d')!;
        this.drawCtx = this.drawCanvas.getContext('2d')!;
        
        this.applyCanvasSize();
        this.drawGrid();
        this.bindEvents();
        this.updateCodePreview();
        this.updateViewTransform();
        this.centerCanvas();
    }

    applyCanvasSize() {
        const oldWidth = this.bgCanvas.style.width ? parseInt(this.bgCanvas.style.width) : this.canvasWidth;
        const oldHeight = this.bgCanvas.style.height ? parseInt(this.bgCanvas.style.height) : this.canvasHeight;
        const newWidth = this.canvasWidth;
        const newHeight = this.canvasHeight;
        
        // 根據座標原點模式計算背景圖偏移（除非標記跳過）
        if (this.bgImage && !this.skipOffsetCalculation) {
            const deltaWidth = newWidth - oldWidth;
            const deltaHeight = newHeight - oldHeight;
            
            switch(this.originMode) {
                case 'center':
                    // 中心擴展：從中心向四周擴展
                    this.bgOffsetX += deltaWidth / 2;
                    this.bgOffsetY += deltaHeight / 2;
                    break;
                case 'bottomLeft':
                    // 左下擴展：向右和向上擴展
                    // X 不變，Y 向上移動
                    this.bgOffsetY += deltaHeight;
                    break;
                case 'topLeft':
                    // 左上擴展：向右和向下擴展
                    // X 和 Y 都不變（默認行為）
                    break;
            }
        }
        
        // 重置標記
        this.skipOffsetCalculation = false;
        
        const width = this.canvasWidth;
        const height = this.canvasHeight;
        
        // 使用設備像素比來提高清晰度
        const dpr = window.devicePixelRatio || 1;

        [this.bgCanvas, this.gridCanvas, this.drawCanvas].forEach(canvas => {
            // 設置實際繪製尺寸（考慮 DPR）
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            
            // 設置顯示尺寸
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            
            // 縮放繪製上下文以匹配 DPR
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(dpr, dpr);
                // 啟用圖像平滑和高質量渲染
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
            }
        });

        this.drawGrid();
        this.redrawBackground();
        this.redraw();
    }

    drawGrid() {
        if (!this.showGrid) {
            this.gridCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            return;
        }

        this.gridCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.gridCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.gridCtx.lineWidth = 1;

        const gridSize = 50;
        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;

        // 繪製網格線
        for (let x = 0; x <= this.canvasWidth; x += gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, this.canvasHeight);
            this.gridCtx.stroke();
        }

        for (let y = 0; y <= this.canvasHeight; y += gridSize) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, y);
            this.gridCtx.lineTo(this.canvasWidth, y);
            this.gridCtx.stroke();
        }

        // 計算原點位置
        let originX = 0, originY = 0;
        
        switch(this.originMode) {
            case 'center':
                originX = centerX;
                originY = centerY;
                break;
            case 'bottomLeft':
                originX = 0;
                originY = this.canvasHeight;
                break;
            case 'topLeft':
                originX = 0;
                originY = 0;
                break;
        }

        // X軸（紅色）
        this.gridCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.gridCtx.lineWidth = 2;
        this.gridCtx.beginPath();
        this.gridCtx.moveTo(0, originY);
        this.gridCtx.lineTo(this.canvasWidth, originY);
        this.gridCtx.stroke();

        // Y軸（綠色）
        this.gridCtx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        this.gridCtx.beginPath();
        this.gridCtx.moveTo(originX, 0);
        this.gridCtx.lineTo(originX, this.canvasHeight);
        this.gridCtx.stroke();

        // 標註原點
        this.gridCtx.fillStyle = 'rgba(0, 0, 255, 0.7)';
        this.gridCtx.font = '12px monospace';
        this.gridCtx.fillText('(0, 0)', originX + 5, originY - 5);

        // 標註坐標刻度
        this.gridCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.gridCtx.font = '10px monospace';
        
        for (let x = gridSize; x < this.canvasWidth; x += gridSize) {
            const cocosX = this.canvasToCocosX(x);
            this.gridCtx.fillText(cocosX.toString(), x + 2, Math.max(15, Math.min(this.canvasHeight - 5, originY + 15)));
        }
        
        for (let y = gridSize; y < this.canvasHeight; y += gridSize) {
            const cocosY = this.canvasToCocosY(y);
            this.gridCtx.fillText(cocosY.toString(), Math.max(5, originX + 5), y + 12);
        }
    }

    // ==================== 視圖控制方法 ====================
    
    updateViewTransform() {
        const transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
        this.canvasWrapper.style.transform = transform;
        
        // 更新縮放顯示
        this.panel.$.zoomLevel.textContent = Math.round(this.zoom * 100) + '%';
        this.panel.$.viewInfo.textContent = `Zoom: ${Math.round(this.zoom * 100)}% | Pan: (${Math.round(this.panX)}, ${Math.round(this.panY)})`;
    }

    centerCanvas() {
        const containerRect = this.canvasContainer.getBoundingClientRect();
        const canvasW = this.canvasWidth * this.zoom;
        const canvasH = this.canvasHeight * this.zoom;
        
        this.panX = (containerRect.width - canvasW) / 2;
        this.panY = (containerRect.height - canvasH) / 2;
        
        this.updateViewTransform();
    }

    zoomIn() {
        const oldZoom = this.zoom;
        this.zoom = Math.min(this.maxZoom, this.zoom * 1.2);
        this.adjustPanAfterZoom(oldZoom);
    }

    zoomOut() {
        const oldZoom = this.zoom;
        this.zoom = Math.max(this.minZoom, this.zoom / 1.2);
        this.adjustPanAfterZoom(oldZoom);
    }

    zoomFit() {
        const containerRect = this.canvasContainer.getBoundingClientRect();
        const scaleX = (containerRect.width - 40) / this.canvasWidth;
        const scaleY = (containerRect.height - 40) / this.canvasHeight;
        
        this.zoom = Math.min(scaleX, scaleY, 1.0); // 不超過 100%
        this.centerCanvas();
    }

    zoomReset() {
        this.zoom = 1.0;
        this.centerCanvas();
    }

    adjustPanAfterZoom(oldZoom: number) {
        // 以畫布中心為縮放中心
        const containerRect = this.canvasContainer.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        const canvasCenterX = (centerX - this.panX) / oldZoom;
        const canvasCenterY = (centerY - this.panY) / oldZoom;
        
        this.panX = centerX - canvasCenterX * this.zoom;
        this.panY = centerY - canvasCenterY * this.zoom;
        
        this.updateViewTransform();
    }

    screenToCanvas(screenX: number, screenY: number): {x: number, y: number} {
        const rect = this.drawCanvas.getBoundingClientRect();
        return {
            x: (screenX - rect.left) / this.zoom,
            y: (screenY - rect.top) / this.zoom
        };
    }

    // ==================== 坐標轉換方法 ====================

    canvasToCocosX(canvasX: number): number {
        switch(this.originMode) {
            case 'center':
                return Math.round(canvasX - this.canvasWidth / 2);
            case 'bottomLeft':
            case 'topLeft':
                return Math.round(canvasX);
            default:
                return Math.round(canvasX);
        }
    }

    canvasToCocosY(canvasY: number): number {
        switch(this.originMode) {
            case 'center':
                return Math.round(this.canvasHeight / 2 - canvasY);
            case 'bottomLeft':
                return Math.round(this.canvasHeight - canvasY);
            case 'topLeft':
                return Math.round(-canvasY);
            default:
                return Math.round(canvasY);
        }
    }

    loadBackgroundImage() {
        // 創建隱藏的文件輸入元素
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png,image/jpeg,image/jpg,image/webp';
        
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            
            reader.onload = (event: any) => {
                const img = new Image();
                
                img.onload = () => {
                    this.bgImage = img;
                    console.log('[Graphics Editor] 背景圖片已載入:', file.name, `${img.width}x${img.height}`);
                    
                    // 載入背景時，自動調整畫布尺寸為圖片尺寸
                    this.canvasWidth = img.width;
                    this.canvasHeight = img.height;
                    this.panel.$.canvasWidth.value = img.width;
                    this.panel.$.canvasHeight.value = img.height;
                    
                    // 以中心 (0,0) 方式載入：背景圖左上角對齊畫布左上角
                    // 因為畫布尺寸等於圖片尺寸，所以偏移為 0
                    this.bgOffsetX = 0;
                    this.bgOffsetY = 0;
                    
                    // 跳過 applyCanvasSize 中的偏移計算
                    this.skipOffsetCalculation = true;
                    
                    // 強制設置為中心模式
                    this.originMode = 'center';
                    this.panel.$.originMode.value = 'center';
                    
                    this.applyCanvasSize();
                    this.drawGrid();
                    this.zoomFit();
                    
                    console.log('[Graphics Editor] 座標系統已設為中心模式，畫布中心 = 背景圖中心 = (0, 0)');
                };
                
                img.onerror = () => {
                    console.error('[Graphics Editor] 背景圖片載入失敗');
                };

                img.src = event.target.result;
            };
            
            reader.readAsDataURL(file);
        };
        
        input.click();
    }

    redrawBackground() {
        this.bgCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        if (this.bgImage) {
            // 使用偏移量繪製背景圖，保持原始尺寸
            this.bgCtx.drawImage(this.bgImage, this.bgOffsetX, this.bgOffsetY);
        } else {
            this.bgCtx.fillStyle = '#ffffff';
            this.bgCtx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }

    clearBackground() {
        this.bgImage = null;
        this.bgOffsetX = 0;
        this.bgOffsetY = 0;
        this.redrawBackground();
    }

    bindEvents() {
        // 背景圖片
        this.panel.$.btnLoadBg.addEventListener('click', () => this.loadBackgroundImage());
        this.panel.$.btnClearBg.addEventListener('click', () => this.clearBackground());
        
        // 視圖控制
        this.panel.$.btnZoomIn.addEventListener('click', () => this.zoomIn());
        this.panel.$.btnZoomOut.addEventListener('click', () => this.zoomOut());
        this.panel.$.btnZoomFit.addEventListener('click', () => this.zoomFit());
        this.panel.$.btnZoomReset.addEventListener('click', () => this.zoomReset());
        
        // 網格
        this.panel.$.showGrid.addEventListener('change', (e: any) => {
            this.showGrid = e.target.checked;
            this.drawGrid();
        });

        // 坐標系統
        this.panel.$.originMode.addEventListener('change', (e: any) => {
            this.originMode = e.target.value;
            this.drawGrid();
            this.updateCodePreview();
        });

        // 畫布尺寸
        this.panel.$.canvasWidth.addEventListener('change', (e: any) => {
            this.canvasWidth = parseInt(e.target.value);
        });
        this.panel.$.canvasHeight.addEventListener('change', (e: any) => {
            this.canvasHeight = parseInt(e.target.value);
        });
        this.panel.$.btnApplySize.addEventListener('click', () => {
            this.applyCanvasSize();
            this.centerCanvas();
        });

        // 工具
        this.panel.$.btnRect.addEventListener('click', () => this.selectTool('rect', this.panel.$.btnRect));
        this.panel.$.btnCircle.addEventListener('click', () => this.selectTool('circle', this.panel.$.btnCircle));
        this.panel.$.btnLine.addEventListener('click', () => this.selectTool('line', this.panel.$.btnLine));
        this.panel.$.btnPolyline.addEventListener('click', () => this.selectTool('polyline', this.panel.$.btnPolyline));
        
        // 完成折線
        this.panel.$.btnClosePolyline.addEventListener('click', () => this.closePolyline());

        // 顏色
        this.panel.$.fillColor.addEventListener('change', (e: any) => {
            this.fillColor = e.target.value;
        });
        this.panel.$.fillAlpha.addEventListener('change', (e: any) => {
            this.fillAlpha = parseInt(e.target.value);
        });
        this.panel.$.strokeColor.addEventListener('change', (e: any) => {
            this.strokeColor = e.target.value;
        });
        this.panel.$.strokeAlpha.addEventListener('change', (e: any) => {
            this.strokeAlpha = parseInt(e.target.value);
        });

        // 線寬
        this.panel.$.lineWidth.addEventListener('change', (e: any) => {
            this.lineWidth = parseInt(e.target.value);
        });

        // 填充模式
        this.panel.$.fillMode.addEventListener('change', (e: any) => {
            this.fillMode = e.target.checked;
        });
        this.panel.$.strokeMode.addEventListener('change', (e: any) => {
            this.strokeMode = e.target.checked;
        });

        // Canvas 容器平移事件
        this.canvasContainer.addEventListener('mousedown', (e: MouseEvent) => {
            // 只有空格鍵或中鍵才啟動平移
            if (e.button === 1 || (e.button === 0 && e.target === this.canvasContainer)) {
                e.preventDefault();
                this.isPanning = true;
                this.lastPanX = e.clientX;
                this.lastPanY = e.clientY;
                this.canvasContainer.classList.add('panning');
            }
        });

        this.canvasContainer.addEventListener('mousemove', (e: MouseEvent) => {
            if (this.isPanning) {
                const deltaX = e.clientX - this.lastPanX;
                const deltaY = e.clientY - this.lastPanY;
                
                this.panX += deltaX;
                this.panY += deltaY;
                
                this.lastPanX = e.clientX;
                this.lastPanY = e.clientY;
                
                this.updateViewTransform();
                return;
            }
        });

        this.canvasContainer.addEventListener('mouseup', () => {
            if (this.isPanning) {
                this.isPanning = false;
                this.canvasContainer.classList.remove('panning');
            }
        });

        this.canvasContainer.addEventListener('mouseleave', () => {
            if (this.isPanning) {
                this.isPanning = false;
                this.canvasContainer.classList.remove('panning');
            }
        });

        // 滾輪縮放
        this.canvasContainer.addEventListener('wheel', (e: WheelEvent) => {
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const oldZoom = this.zoom;
            this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * delta));
            
            // 以滑鼠位置為中心縮放
            const rect = this.canvasContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const canvasX = (mouseX - this.panX) / oldZoom;
            const canvasY = (mouseY - this.panY) / oldZoom;
            
            this.panX = mouseX - canvasX * this.zoom;
            this.panY = mouseY - canvasY * this.zoom;
            
            this.updateViewTransform();
        }, { passive: false });

        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (this.isDrawingPolyline) {
                    e.preventDefault();
                    this.closePolyline();
                }
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.zoomIn();
            } else if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                this.zoomOut();
            } else if (e.key.toLowerCase() === 'f') {
                e.preventDefault();
                this.zoomFit();
            } else if (e.key.toLowerCase() === 'r') {
                e.preventDefault();
                this.zoomReset();
            }
        });

        // 畫布繪圖事件
        this.drawCanvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.drawCanvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.drawCanvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.drawCanvas.addEventListener('mouseleave', () => {
            this.panel.$.coordDisplay.textContent = '';
        });

        // 操作
        this.panel.$.btnUndo.addEventListener('click', () => this.undo());
        this.panel.$.btnClear.addEventListener('click', () => this.undo());
        this.panel.$.btnCopyCode.addEventListener('click', () => this.copyCode());
        this.panel.$.btnExport.addEventListener('click', () => this.exportScript());
        this.panel.$.btnExportMask.addEventListener('click', () => this.exportMaskScript());
        this.panel.$.btnClearAll.addEventListener('click', () => this.clearAll());
    }

    selectTool(tool: string, button: any) {
        [this.panel.$.btnRect, this.panel.$.btnCircle, this.panel.$.btnLine, this.panel.$.btnPolyline].forEach((btn: any) => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        this.currentTool = tool;
        
        // 如果不是折線工具，關閉任何正在進行的折線繪製
        if (tool !== 'polyline' && this.isDrawingPolyline) {
            this.closePolyline();
        }
    }

    onMouseDown(e: MouseEvent) {
        const pos = this.screenToCanvas(e.clientX, e.clientY);
        
        // 折線模式：點擊添加點
        if (this.currentTool === 'polyline') {
            if (!this.isDrawingPolyline) {
                this.startPolyline();
            }
            this.addPolylinePoint(pos.x, pos.y);
            return;
        }

        // 其他工具：正常繪製
        this.isDrawing = true;
        this.startX = pos.x;
        this.startY = pos.y;
    }

    onMouseMove(e: MouseEvent) {
        const pos = this.screenToCanvas(e.clientX, e.clientY);
        const currentX = pos.x;
        const currentY = pos.y;

        // 更新坐標顯示
        const cocosX = this.canvasToCocosX(currentX);
        const cocosY = this.canvasToCocosY(currentY);
        this.panel.$.coordDisplay.textContent = `Canvas: (${Math.round(currentX)}, ${Math.round(currentY)}) → Cocos: (${cocosX}, ${cocosY})`;

        if (!this.isDrawing) return;

        this.redraw();
        
        // 應用透明度的顏色
        this.drawCtx.strokeStyle = this.getRgbaColor(this.strokeColor, this.strokeAlpha);
        this.drawCtx.fillStyle = this.getRgbaColor(this.fillColor, this.fillAlpha);
        this.drawCtx.lineWidth = this.lineWidth;

        switch(this.currentTool) {
            case 'rect':
                this.previewRect(this.startX, this.startY, currentX, currentY);
                break;
            case 'circle':
                this.previewCircle(this.startX, this.startY, currentX, currentY);
                break;
            case 'line':
                this.previewLine(this.startX, this.startY, currentX, currentY);
                break;
        }
    }

    onMouseUp(e: MouseEvent) {
        if (!this.isDrawing) return;
        this.isDrawing = false;

        const pos = this.screenToCanvas(e.clientX, e.clientY);
        const endX = pos.x;
        const endY = pos.y;

        const shape = {
            tool: this.currentTool,
            startX: this.startX,
            startY: this.startY,
            endX: endX,
            endY: endY,
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            strokeColor: this.strokeColor,
            strokeAlpha: this.strokeAlpha,
            lineWidth: this.lineWidth,
            fillMode: this.fillMode,
            strokeMode: this.strokeMode
        };

        this.shapes.push(shape);
        this.addCommand(shape);
        this.redraw();
        this.updateCodePreview();
    }

    previewRect(x1: number, y1: number, x2: number, y2: number) {
        const width = x2 - x1;
        const height = y2 - y1;
        
        if (this.fillMode) {
            this.drawCtx.fillRect(x1, y1, width, height);
        }
        if (this.strokeMode) {
            this.drawCtx.strokeRect(x1, y1, width, height);
        }
    }

    previewCircle(x1: number, y1: number, x2: number, y2: number) {
        const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        this.drawCtx.beginPath();
        this.drawCtx.arc(x1, y1, radius, 0, Math.PI * 2);
        if (this.fillMode) this.drawCtx.fill();
        if (this.strokeMode) this.drawCtx.stroke();
    }

    previewLine(x1: number, y1: number, x2: number, y2: number) {
        this.drawCtx.beginPath();
        this.drawCtx.moveTo(x1, y1);
        this.drawCtx.lineTo(x2, y2);
        this.drawCtx.stroke();
    }

    redraw() {
        this.drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        this.shapes.forEach(shape => {
            // 應用透明度的顏色
            const strokeAlpha = shape.strokeAlpha !== undefined ? shape.strokeAlpha : 255;
            const fillAlpha = shape.fillAlpha !== undefined ? shape.fillAlpha : 255;
            this.drawCtx.strokeStyle = this.getRgbaColor(shape.strokeColor, strokeAlpha);
            this.drawCtx.fillStyle = this.getRgbaColor(shape.fillColor, fillAlpha);
            this.drawCtx.lineWidth = shape.lineWidth;

            switch(shape.tool) {
                case 'rect':
                    const width = shape.endX - shape.startX;
                    const height = shape.endY - shape.startY;
                    if (shape.fillMode) this.drawCtx.fillRect(shape.startX, shape.startY, width, height);
                    if (shape.strokeMode) this.drawCtx.strokeRect(shape.startX, shape.startY, width, height);
                    break;
                case 'circle':
                    const radius = Math.sqrt(Math.pow(shape.endX - shape.startX, 2) + Math.pow(shape.endY - shape.startY, 2));
                    this.drawCtx.beginPath();
                    this.drawCtx.arc(shape.startX, shape.startY, radius, 0, Math.PI * 2);
                    if (shape.fillMode) this.drawCtx.fill();
                    if (shape.strokeMode) this.drawCtx.stroke();
                    break;
                case 'line':
                    this.drawCtx.beginPath();
                    this.drawCtx.moveTo(shape.startX, shape.startY);
                    this.drawCtx.lineTo(shape.endX, shape.endY);
                    this.drawCtx.stroke();
                    break;
                case 'polyline':
                    if (shape.points && shape.points.length > 1) {
                        this.drawCtx.beginPath();
                        this.drawCtx.moveTo(shape.points[0].x, shape.points[0].y);
                        for (let i = 1; i < shape.points.length; i++) {
                            this.drawCtx.lineTo(shape.points[i].x, shape.points[i].y);
                        }
                        if (shape.strokeMode) this.drawCtx.stroke();
                        if (shape.fillMode && shape.isClosed) this.drawCtx.fill();
                    }
                    break;
            }
        });

        // 繪製正在進行的折線預覽
        if (this.isDrawingPolyline) {
            this.drawPolylinePreview();
        }
    }

    addCommand(shape: any) {
        const cocosStartX = this.canvasToCocosX(shape.startX);
        const cocosStartY = this.canvasToCocosY(shape.startY);
        const cocosEndX = this.canvasToCocosX(shape.endX);
        const cocosEndY = this.canvasToCocosY(shape.endY);

        let commandText = '';
        switch(shape.tool) {
            case 'rect':
                const width = cocosEndX - cocosStartX;
                const height = cocosEndY - cocosStartY;
                commandText = `g.rect(${cocosStartX}, ${cocosStartY}, ${width}, ${height});`;
                break;
            case 'circle':
                const radius = Math.round(Math.sqrt(Math.pow(cocosEndX - cocosStartX, 2) + Math.pow(cocosEndY - cocosStartY, 2)));
                commandText = `g.circle(${cocosStartX}, ${cocosStartY}, ${radius});`;
                break;
            case 'line':
                commandText = `g.moveTo(${cocosStartX}, ${cocosStartY}); g.lineTo(${cocosEndX}, ${cocosEndY});`;
                break;
        }
        this.commands.push(commandText);
        this.updateCommandList();
    }

    updateCommandList() {
        const list = this.panel.$.commandList;
        list.innerHTML = this.commands.map((cmd: string, i: number) => 
            `<div class="command-item">${i + 1}. ${cmd}</div>`
        ).join('');
    }

    updateCodePreview() {
        const code = this.generateTypeScriptCode();
        this.panel.$.codePreview.value = code;
    }

    generateTypeScriptCode(): string {
        if (this.shapes.length === 0) {
            return '// 請先繪製一些圖形';
        }

        let code = `import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: ${this.getOriginModeName()}
 */
@ccclass('CustomGraphics')
export class CustomGraphics extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    start() {
        this.drawShapes();
    }

    private drawShapes() {
        const g = this.graphics;
        g.clear();
        
`;

        this.shapes.forEach((shape: any, i: number) => {
            const cocosStartX = this.canvasToCocosX(shape.startX);
            const cocosStartY = this.canvasToCocosY(shape.startY);
            const cocosEndX = this.canvasToCocosX(shape.endX);
            const cocosEndY = this.canvasToCocosY(shape.endY);

            code += `        // 形狀 ${i + 1}: ${this.getShapeName(shape.tool)}\n`;
            code += `        g.lineWidth = ${shape.lineWidth};\n`;
            
            if (shape.fillMode) {
                const fillRGB = this.hexToRgb(shape.fillColor);
                const fillAlpha = shape.fillAlpha !== undefined ? shape.fillAlpha : 255;
                code += `        g.fillColor = new Color(${fillRGB.r}, ${fillRGB.g}, ${fillRGB.b}, ${fillAlpha});\n`;
            }
            
            if (shape.strokeMode) {
                const strokeRGB = this.hexToRgb(shape.strokeColor);
                const strokeAlpha = shape.strokeAlpha !== undefined ? shape.strokeAlpha : 255;
                code += `        g.strokeColor = new Color(${strokeRGB.r}, ${strokeRGB.g}, ${strokeRGB.b}, ${strokeAlpha});\n`;
            }

            switch(shape.tool) {
                case 'rect':
                    const width = cocosEndX - cocosStartX;
                    const height = cocosEndY - cocosStartY;
                    code += `        g.rect(${cocosStartX}, ${cocosStartY}, ${width}, ${height});\n`;
                    if (shape.fillMode) code += `        g.fill();\n`;
                    if (shape.strokeMode) code += `        g.stroke();\n`;
                    break;
                case 'circle':
                    const radius = Math.round(Math.sqrt(Math.pow(cocosEndX - cocosStartX, 2) + Math.pow(cocosEndY - cocosStartY, 2)));
                    code += `        g.circle(${cocosStartX}, ${cocosStartY}, ${radius});\n`;
                    if (shape.fillMode) code += `        g.fill();\n`;
                    if (shape.strokeMode) code += `        g.stroke();\n`;
                    break;
                case 'line':
                    code += `        g.moveTo(${cocosStartX}, ${cocosStartY});\n`;
                    code += `        g.lineTo(${cocosEndX}, ${cocosEndY});\n`;
                    code += `        g.stroke();\n`;
                    break;
                case 'polyline':
                    if (shape.points && shape.points.length > 0) {
                        const firstPoint = shape.points[0];
                        const cocosFirstX = this.canvasToCocosX(firstPoint.x);
                        const cocosFirstY = this.canvasToCocosY(firstPoint.y);
                        code += `        g.moveTo(${cocosFirstX}, ${cocosFirstY});\n`;
                        
                        for (let j = 1; j < shape.points.length; j++) {
                            const point = shape.points[j];
                            const cocosX = this.canvasToCocosX(point.x);
                            const cocosY = this.canvasToCocosY(point.y);
                            code += `        g.lineTo(${cocosX}, ${cocosY});\n`;
                        }
                        
                        if (shape.strokeMode) code += `        g.stroke();\n`;
                        if (shape.fillMode && shape.isClosed) code += `        g.fill();\n`;
                    }
                    break;
            }
            code += '\n';
        });

        code += `    }
}\n`;
        return code;
    }

    generateMaskTypeScriptCode(): string {
        if (this.shapes.length === 0) {
            return '// 請先繪製一些圖形';
        }

        let code = `import { _decorator, Component, Graphics, Mask } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Graphics Editor 生成的 Mask（遮罩）代碼
 * 坐標系統: ${this.getOriginModeName()}
 * 
 * 使用說明：
 * 1. 將此腳本掛載到節點上
 * 2. 添加 Graphics 組件
 * 3. 添加 Mask 組件（Type: GRAPHICS_STENCIL）
 * 4. 在 Mask 節點下添加子節點作為被遮罩的內容
 */
@ccclass('CustomMask')
export class CustomMask extends Component {
    
    @property(Graphics)
    graphics: Graphics | null = null;
    
    @property(Mask)
    mask: Mask | null = null;
    
    @property({
        displayName: '顯示遮罩區域（除錯）',
        tooltip: '勾選後會用半透明紅色顯示遮罩形狀，方便調試'
    })
    debugMode: boolean = false;
    
    start() {
        // 自動獲取組件
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
        
        if (!this.mask) {
            this.mask = this.getComponent(Mask);
        }
        
        // 繪製遮罩
        this.drawMaskShape();
    }
    
    /**
     * 繪製遮罩形狀
     */
    drawMaskShape() {
        const g = this.graphics;
        if (!g) {
            console.error('[CustomMask] Graphics 組件未找到！');
            return;
        }
        
        g.clear();
        
        // Mask 必須使用白色（除錯模式除外）
        if (this.debugMode) {
            // 除錯模式：紅色半透明
            g.fillColor.set(255, 0, 0, 128);
        } else {
            // 正常模式：白色完全不透明
            g.fillColor.set(255, 255, 255, 255);
        }
        
`;

        this.shapes.forEach((shape: any, i: number) => {
            const cocosStartX = this.canvasToCocosX(shape.startX);
            const cocosStartY = this.canvasToCocosY(shape.startY);
            const cocosEndX = this.canvasToCocosX(shape.endX);
            const cocosEndY = this.canvasToCocosY(shape.endY);

            code += `        // 遮罩形狀 ${i + 1}: ${this.getShapeName(shape.tool)}\n`;

            switch(shape.tool) {
                case 'rect':
                    const width = cocosEndX - cocosStartX;
                    const height = cocosEndY - cocosStartY;
                    code += `        g.rect(${cocosStartX}, ${cocosStartY}, ${width}, ${height});\n`;
                    code += `        g.fill();\n`;
                    break;
                case 'circle':
                    const radius = Math.round(Math.sqrt(Math.pow(cocosEndX - cocosStartX, 2) + Math.pow(cocosEndY - cocosStartY, 2)));
                    code += `        g.circle(${cocosStartX}, ${cocosStartY}, ${radius});\n`;
                    code += `        g.fill();\n`;
                    break;
                case 'line':
                    // 線條不適合做遮罩，轉換為路徑
                    code += `        // ⚠️ 注意：單一線條無法形成遮罩區域\n`;
                    code += `        g.moveTo(${cocosStartX}, ${cocosStartY});\n`;
                    code += `        g.lineTo(${cocosEndX}, ${cocosEndY});\n`;
                    break;
                case 'polyline':
                    if (shape.points && shape.points.length > 0) {
                        const firstPoint = shape.points[0];
                        const cocosFirstX = this.canvasToCocosX(firstPoint.x);
                        const cocosFirstY = this.canvasToCocosY(firstPoint.y);
                        code += `        g.moveTo(${cocosFirstX}, ${cocosFirstY});\n`;
                        
                        for (let j = 1; j < shape.points.length; j++) {
                            const point = shape.points[j];
                            const cocosX = this.canvasToCocosX(point.x);
                            const cocosY = this.canvasToCocosY(point.y);
                            code += `        g.lineTo(${cocosX}, ${cocosY});\n`;
                        }
                        
                        // 折線必須閉合才能形成遮罩區域
                        if (shape.isClosed) {
                            code += `        g.close(); // 閉合路徑\n`;
                        } else {
                            code += `        // ⚠️ 警告：未閉合的折線無法形成遮罩區域\n`;
                            code += `        // g.close(); // 取消註釋以閉合路徑\n`;
                        }
                        code += `        g.fill();\n`;
                    }
                    break;
            }
            code += '\n';
        });

        code += `    }
}
`;
        return code;
    }

    getOriginModeName(): string {
        const names: any = {
            'center': '中心 (0,0)',
            'bottomLeft': '左下 - Cocos Creator 預設',
            'topLeft': '左上'
        };
        return names[this.originMode] || this.originMode;
    }

    getShapeName(tool: string): string {
        const names: any = {
            'rect': '矩形',
            'circle': '圓形',
            'line': '線條',
            'polyline': '折線'
        };
        return names[tool] || tool;
    }

    hexToRgb(hex: string) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {r: 0, g: 0, b: 0};
    }

    getRgbaColor(hex: string, alpha: number): string {
        const rgb = this.hexToRgb(hex);
        const alphaValue = alpha / 255; // 轉換為 0-1 範圍
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alphaValue})`;
    }

    undo() {
        if (this.shapes.length > 0) {
            this.shapes.pop();
            this.commands.pop();
            this.redraw();
            this.updateCommandList();
            this.updateCodePreview();
        }
    }

    clearAll() {
        this.shapes = [];
        this.commands = [];
        this.drawCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.updateCommandList();
        this.updateCodePreview();
    }

    copyCode() {
        const code = this.generateTypeScriptCode();
        
        // 使用 Clipboard API 複製代碼
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(() => {
                console.log('[Graphics Editor] 代碼已複製到剪貼板');
                // 可選：顯示提示
                this.showCopyNotification();
            }).catch(err => {
                console.error('[Graphics Editor] 複製失敗:', err);
                // 降級方案：使用 textarea
                this.copyCodeFallback(code);
            });
        } else {
            // 舊瀏覽器降級方案
            this.copyCodeFallback(code);
        }
    }

    copyCodeFallback(code: string) {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            console.log('[Graphics Editor] 代碼已複製到剪貼板（降級方案）');
            this.showCopyNotification();
        } catch (err) {
            console.error('[Graphics Editor] 複製失敗:', err);
        }
        document.body.removeChild(textarea);
    }

    showCopyNotification() {
        // 簡單的提示訊息
        const originalText = this.panel.$.btnCopyCode.textContent;
        this.panel.$.btnCopyCode.textContent = '✓ 已複製！';
        setTimeout(() => {
            this.panel.$.btnCopyCode.textContent = originalText;
        }, 2000);
    }

    async exportScript() {
        const code = this.generateTypeScriptCode();
        
        try {
            // 使用 Editor API 打開文件保存對話框
            if (typeof Editor !== 'undefined' && Editor.Dialog) {
                const result = await Editor.Dialog.save({
                    title: '導出 TypeScript 腳本',
                    defaultPath: 'CustomGraphics.ts',
                    buttonLabel: '保存',
                    filters: [
                        { name: 'TypeScript 文件', extensions: ['ts'] },
                        { name: '所有文件', extensions: ['*'] }
                    ]
                });
                
                if (result.filePath) {
                    // 使用文件系統寫入
                    try {
                        console.log('[Graphics Editor] 準備寫入文件:', result.filePath);
                        
                        // 直接通過主進程寫入文件系統
                        const writeResult = await Editor.Message.request('graphics-editor', 'write-file', result.filePath, code);
                        
                        if (writeResult && writeResult.success) {
                            console.log('[Graphics Editor] ✓ 腳本已保存到:', writeResult.path);
                            this.showExportNotification();
                        } else {
                            console.error('[Graphics Editor] ✗ 寫入失敗:', writeResult?.error);
                            alert('導出失敗: ' + (writeResult?.error || '未知錯誤'));
                        }
                    } catch (writeErr) {
                        console.error('[Graphics Editor] ✗ 寫入文件失敗:', writeErr);
                        alert('導出失敗: ' + writeErr);
                    }
                } else {
                    console.log('[Graphics Editor] 用戶取消了保存');
                }
            } else {
                // 降級方案：瀏覽器下載
                this.exportScriptFallback(code);
            }
        } catch (err) {
            console.error('[Graphics Editor] 導出失敗:', err);
            // 最終降級方案：瀏覽器下載
            this.exportScriptFallback(code);
        }
    }

    async exportMaskScript() {
        const code = this.generateMaskTypeScriptCode();
        
        try {
            // 使用 Editor API 打開文件保存對話框
            if (typeof Editor !== 'undefined' && Editor.Dialog) {
                const result = await Editor.Dialog.save({
                    title: '導出 Mask（遮罩）腳本',
                    defaultPath: 'CustomMask.ts',
                    buttonLabel: '保存',
                    filters: [
                        { name: 'TypeScript 文件', extensions: ['ts'] },
                        { name: '所有文件', extensions: ['*'] }
                    ]
                });
                
                if (result.filePath) {
                    // 使用文件系統寫入
                    try {
                        console.log('[Graphics Editor] 準備寫入 Mask 文件:', result.filePath);
                        
                        // 直接通過主進程寫入文件系統
                        const writeResult = await Editor.Message.request('graphics-editor', 'write-file', result.filePath, code);
                        
                        if (writeResult && writeResult.success) {
                            console.log('[Graphics Editor] ✓ Mask 腳本已保存到:', writeResult.path);
                            this.showExportNotification('✓ Mask 已導出！', this.panel.$.btnExportMask);
                        } else {
                            console.error('[Graphics Editor] ✗ 寫入失敗:', writeResult?.error);
                            alert('導出 Mask 腳本失敗: ' + (writeResult?.error || '未知錯誤'));
                        }
                    } catch (writeErr) {
                        console.error('[Graphics Editor] ✗ 寫入 Mask 文件失敗:', writeErr);
                        alert('導出 Mask 腳本失敗: ' + writeErr);
                    }
                } else {
                    console.log('[Graphics Editor] 用戶取消了保存');
                }
            } else {
                // 降級方案：瀏覽器下載
                this.exportScriptFallback(code, 'CustomMask.ts');
            }
        } catch (err) {
            console.error('[Graphics Editor] 導出 Mask 腳本失敗:', err);
            // 最終降級方案：瀏覽器下載
            this.exportScriptFallback(code, 'CustomMask.ts');
        }
    }

    exportScriptFallback(code: string, filename: string = 'CustomGraphics.ts') {
        try {
            // 創建下載連結
            const blob = new Blob([code], { type: 'text/typescript' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'CustomGraphics.ts';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            
            // 延遲移除以確保下載完成
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('[Graphics Editor] TypeScript 腳本已導出（瀏覽器下載）');
            this.showExportNotification();
        } catch (err) {
            console.error('[Graphics Editor] 下載失敗:', err);
            // 最終降級：複製到剪貼板
            this.showCodeInDialog(code);
        }
    }

    showExportNotification(message: string = '✓ 已導出！', button: any = null) {
        const targetButton = button || this.panel.$.btnExport;
        const originalText = targetButton.textContent;
        targetButton.textContent = message;
        setTimeout(() => {
            targetButton.textContent = originalText;
        }, 2000);
    }

    showCodeInDialog(code: string) {
        // 如果下載失敗，至少複製到剪貼板
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(() => {
                console.log('[Graphics Editor] 代碼已複製到剪貼板（導出降級）');
                alert('無法直接下載文件，代碼已複製到剪貼板，請手動貼到文件中。');
            });
        } else {
            alert('導出失敗，請使用「複製代碼」按鈕。');
        }
    }

    // ==================== 折線相關方法 ====================

    startPolyline() {
        this.isDrawingPolyline = true;
        this.polylinePoints = [];
        this.panel.$.btnClosePolyline.style.display = 'block';
        console.log('[Graphics Editor] 開始繪製折線，單擊添加點，ESC 鍵或點擊「完成折線」完成');
    }

    addPolylinePoint(x: number, y: number) {
        this.polylinePoints.push({x, y});
        this.redraw();
        this.drawPolylinePreview();
    }

    drawPolylinePreview() {
        if (this.polylinePoints.length < 1) return;
        
        // 應用透明度
        this.drawCtx.strokeStyle = this.getRgbaColor(this.strokeColor, this.strokeAlpha);
        this.drawCtx.lineWidth = this.lineWidth;
        this.drawCtx.fillStyle = this.getRgbaColor(this.fillColor, this.fillAlpha);

        // 繪製折線
        if (this.polylinePoints.length > 1) {
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(this.polylinePoints[0].x, this.polylinePoints[0].y);
            
            for (let i = 1; i < this.polylinePoints.length; i++) {
                this.drawCtx.lineTo(this.polylinePoints[i].x, this.polylinePoints[i].y);
            }
            
            if (this.strokeMode) {
                this.drawCtx.stroke();
            }
        }

        // 繪製關鍵點
        this.drawCtx.fillStyle = 'rgba(0, 0, 255, 0.7)';
        for (const point of this.polylinePoints) {
            this.drawCtx.beginPath();
            this.drawCtx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            this.drawCtx.fill();
        }
    }

    closePolyline() {
        if (this.polylinePoints.length < 2) {
            console.warn('[Graphics Editor] 折線必須至少有 2 個點');
            return;
        }

        // 創建折線形狀
        const shape = {
            tool: 'polyline',
            points: [...this.polylinePoints],
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            strokeColor: this.strokeColor,
            strokeAlpha: this.strokeAlpha,
            lineWidth: this.lineWidth,
            fillMode: this.fillMode,
            strokeMode: this.strokeMode,
            isClosed: true // 表示已閉合的折線
        };

        this.shapes.push(shape);
        this.addPolylineCommand(shape);
        this.redraw();
        this.updateCodePreview();

        // 重置折線狀態
        this.isDrawingPolyline = false;
        this.polylinePoints = [];
        this.panel.$.btnClosePolyline.style.display = 'none';
        
        console.log('[Graphics Editor] 折線已完成，包含', shape.points.length, '個點');
    }

    addPolylineCommand(shape: any) {
        let commandText = 'g.moveTo(';
        const pointsStr = shape.points.map((p: any) => `(${Math.round(p.x)}, ${Math.round(p.y)})`).join(' → ');
        commandText = `折線: ${pointsStr} [${shape.points.length}個點]`;
        
        this.commands.push(commandText);
        this.updateCommandList();
    }
}

let editorLogic: GraphicsEditorLogic | null = null;

export async function ready(this: any) {
    console.log('[Graphics Editor] 面板已就緒');
    editorLogic = new GraphicsEditorLogic(this);
    editorLogic.init();
}

export function close() {
    console.log('[Graphics Editor] 面板已關閉');
    editorLogic = null;
}
