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
            <ui-button class="tool-btn" id="btnBezier">貝茲曲線</ui-button>
        </div>

        <!-- 顏色設置 -->
        <div class="toolbar-section">
            <label>填充:</label>
            <input type="color" id="fillColor" value="#ff0000">
            <label>透明度:</label>
            <ui-num-input id="fillAlpha" value="255" min="0" max="255" step="1"></ui-num-input>
        </div>

        <!-- 漸層填充選項 -->
        <div class="toolbar-section">
            <ui-checkbox id="enableGradient">漸層填充</ui-checkbox>
            <label>顏色1:</label>
            <input type="color" id="gradientStartColor" value="#ff0000">
            <label>顏色2:</label>
            <input type="color" id="gradientEndColor" value="#0000ff">
            <label>角度°:</label>
            <ui-num-input id="gradientAngle" value="0" min="0" max="360" step="1"></ui-num-input>
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

        <!-- 變換相關選項 -->
        <div class="toolbar-section">
            <label>變換:</label>
            <ui-checkbox id="snapToPixel" checked>對齊像素</ui-checkbox>
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

        <!-- 圓角設置（針對選中矩形） -->
        <div class="toolbar-section" id="cornerRadiusSection" style="display:none;">
            <label>矩形圓角:</label>
            <ui-checkbox id="useUniformRadius" checked>統一圓角</ui-checkbox>
            <div id="uniformRadiusInput" style="display: inline-flex; align-items: center; gap: 5px;">
                <ui-num-input id="cornerRadius" value="10" min="0" max="100"></ui-num-input>
                <span style="font-size: 11px; color: #888;">px</span>
            </div>
            <div id="individualRadiusInputs" style="display: none; margin-left: 10px;">
                <span style="font-size: 10px; color: #aaa;">左上:</span>
                <ui-num-input id="cornerRadiusTL" value="10" min="0" max="100" style="width: 60px;"></ui-num-input>
                <span style="font-size: 10px; color: #aaa;">右上:</span>
                <ui-num-input id="cornerRadiusTR" value="10" min="0" max="100" style="width: 60px;"></ui-num-input>
                <span style="font-size: 10px; color: #aaa;">右下:</span>
                <ui-num-input id="cornerRadiusBR" value="10" min="0" max="100" style="width: 60px;"></ui-num-input>
                <span style="font-size: 10px; color: #aaa;">左下:</span>
                <ui-num-input id="cornerRadiusBL" value="10" min="0" max="100" style="width: 60px;"></ui-num-input>
            </div>
            <ui-button id="btnApplyCornerRadius" style="margin-left: 5px;">應用圓角</ui-button>
        </div>

        <!-- 操作按鈕 -->
        <div class="toolbar-section">
            <ui-button id="btnUndo">撤銷</ui-button>
            <ui-button id="btnClear">清空</ui-button>
            <ui-button id="btnDelete" style="display:none;" class="red">刪除選中 (Del)</ui-button>
            <ui-button id="btnClosePolyline" style="display:none;">完成折線 (Enter)</ui-button>
            <ui-button id="btnPolylineUndo" style="display:none;">撤銷點 (Ctrl+Z)</ui-button>
            <ui-button id="btnPolylineRedo" style="display:none;">重做點 (Ctrl+Y)</ui-button>
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
                
                <!-- 导出选项 -->
                <div style="margin-bottom: 10px; padding: 8px; background: #2d2d2d; border-radius: 4px;">
                    <label style="display: flex; align-items: center; margin-bottom: 5px;">
                        <ui-checkbox id="syncInspectorColors" checked></ui-checkbox>
                        <span style="margin-left: 5px;">使用 Inspector 顏色</span>
                        <span style="font-size: 10px; color: #888; margin-left: 5px;">（運行時讀取 Graphics 組件顏色）</span>
                    </label>
                    <div id="syncColorHint" style="font-size: 11px; color: #aaa; padding-left: 20px;">
                        ✓ 勾選：運行時使用 Inspector 中 Graphics 組件的 fillColor / strokeColor<br>
                        ✗ 不勾選：使用下方面板設定的顏色（固定寫入腳本）
                    </div>
                </div>
                
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
    btnBezier: '#btnBezier',
    fillColor: '#fillColor',
    fillAlpha: '#fillAlpha',
    strokeColor: '#strokeColor',
    strokeAlpha: '#strokeAlpha',
    lineWidth: '#lineWidth',
    fillMode: '#fillMode',
    strokeMode: '#strokeMode',
    enableGradient: '#enableGradient',
    gradientStartColor: '#gradientStartColor',
    gradientEndColor: '#gradientEndColor',
    gradientAngle: '#gradientAngle',
    snapToPixel: '#snapToPixel',
    btnZoomIn: '#btnZoomIn',
    btnZoomOut: '#btnZoomOut',
    btnZoomFit: '#btnZoomFit',
    btnZoomReset: '#btnZoomReset',
    zoomLevel: '#zoomLevel',
    btnUndo: '#btnUndo',
    btnClear: '#btnClear',
    btnDelete: '#btnDelete',
    btnClosePolyline: '#btnClosePolyline',
    btnPolylineUndo: '#btnPolylineUndo',
    btnPolylineRedo: '#btnPolylineRedo',
    btnCopyCode: '#btnCopyCode',
    btnExport: '#btnExport',
    btnExportMask: '#btnExportMask',
    btnClearAll: '#btnClearAll',
    syncInspectorColors: '#syncInspectorColors',
    syncColorHint: '#syncColorHint',
    cornerRadiusSection: '#cornerRadiusSection',
    useUniformRadius: '#useUniformRadius',
    uniformRadiusInput: '#uniformRadiusInput',
    individualRadiusInputs: '#individualRadiusInputs',
    cornerRadius: '#cornerRadius',
    cornerRadiusTL: '#cornerRadiusTL',
    cornerRadiusTR: '#cornerRadiusTR',
    cornerRadiusBR: '#cornerRadiusBR',
    cornerRadiusBL: '#cornerRadiusBL',
    btnApplyCornerRadius: '#btnApplyCornerRadius',
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
    // 漸層相關
    private enableGradient: boolean = false;
    private gradientStartColor: string = '#ff0000';
    private gradientEndColor: string = '#0000ff';
    private gradientAngle: number = 0; // 0-360 度
    private gradientSteps: number = 64; // 內部繪製步數（生成代碼會用到）

    private bgImage: HTMLImageElement | null = null;
    private bgOffsetX: number = 0; // 背景圖 X 偏移
    private bgOffsetY: number = 0; // 背景圖 Y 偏移
    private skipOffsetCalculation: boolean = false; // 跳過偏移計算標記
    private showGrid: boolean = true;
    private originMode: string = 'bottomLeft';
    private canvasWidth: number = 600;
    private canvasHeight: number = 400;
    private syncInspectorColors: boolean = true; // 是否同步 Inspector 颜色

    // 折線相關
    private isDrawingPolyline: boolean = false;
    private polylinePoints: Array<{x: number, y: number}> = [];
    private polylineHistory: Array<Array<{x: number, y: number}>> = []; // 折線點的歷史記錄
    private polylineHistoryIndex: number = -1; // 當前歷史索引
    private polylinePreviewX: number = 0; // 折線預覽鼠標 X 坐標
    private polylinePreviewY: number = 0; // 折線預覽鼠標 Y 坐標

    // 貝茲曲線相關
    private isDrawingBezier: boolean = false;
    private bezierSegments: Array<{start: {x: number, y: number}, cp1: {x: number, y: number}, cp2: {x: number, y: number}, end: {x: number, y: number}}> = [];
    private bezierCurrentPoint: {x: number, y: number} | null = null; // 當前起點
    private bezierCP1: {x: number, y: number} | null = null; // 控制點1
    private bezierCP2: {x: number, y: number} | null = null; // 控制點2
    private bezierPreviewX: number = 0;
    private bezierPreviewY: number = 0;
    private bezierClickCount: number = 0; // 0=起點, 1=CP1, 2=CP2, 3=終點（然後重置）
    
    // 貝茲曲線控制點編輯相關
    private isEditingBezierControl: boolean = false;
    private editingSegmentIndex: number = -1; // 正在編輯的段落索引
    private editingControlType: string = ''; // 'start', 'cp1', 'cp2', 'end'
    private bezierEditStartX: number = 0;
    private bezierEditStartY: number = 0;
    
    // 貝茲曲線繪製過程中的即時控制點編輯
    private isEditingBezierDrawingCP: boolean = false;
    private editingDrawingCP: 'cp1' | 'cp2' | null = null;

    // 選取相關
    private selectedShapeIndex: number = -1; // 選中的圖形索引
    private cornerRadius: number = 10; // 圓角半徑（統一模式）
    private useUniformRadius: boolean = true; // 是否使用統一圓角
    private cornerRadiusTL: number = 10; // 左上角半徑
    private cornerRadiusTR: number = 10; // 右上角半徑
    private cornerRadiusBR: number = 10; // 右下角半徑
    private cornerRadiusBL: number = 10; // 左下角半徑

    // 圖形變換相關
    private isTransforming: boolean = false; // 是否正在變換
    private transformMode: string = ''; // 變換模式: 'move', 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
    private transformStartX: number = 0;
    private transformStartY: number = 0;
    private transformStartShape: any = null; // 變換前的圖形副本
    private snapToPixel: boolean = true; // 是否 snap to pixel
    private keepAspectRatio: boolean = false; // 是否保持寬高比例
    private transformFromCenter: boolean = false; // 是否從中心變換
    private handleSize: number = 8; // 調整句柄大小

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
        this.updateSyncColorHint();
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
                return Math.round(canvasY - this.canvasHeight / 2);
            case 'bottomLeft':
                return Math.round(canvasY);
            case 'topLeft':
                return Math.round(canvasY);
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
        this.panel.$.btnBezier.addEventListener('click', () => this.selectTool('bezier', this.panel.$.btnBezier));
        
        // 折線操作
        this.panel.$.btnClosePolyline.addEventListener('click', () => this.closePolyline());
        this.panel.$.btnPolylineUndo.addEventListener('click', () => this.polylineUndo());
        this.panel.$.btnPolylineRedo.addEventListener('click', () => this.polylineRedo());

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

        // 漸層填充
        this.panel.$.enableGradient.addEventListener('change', (e: any) => {
            this.enableGradient = e.target.checked;
            this.updateSyncColorHint();
            this.updateCodePreview();
        });
        this.panel.$.gradientStartColor.addEventListener('change', (e: any) => {
            this.gradientStartColor = e.target.value;
            if (this.enableGradient) this.updateCodePreview();
        });
        this.panel.$.gradientEndColor.addEventListener('change', (e: any) => {
            this.gradientEndColor = e.target.value;
            if (this.enableGradient) this.updateCodePreview();
        });
        this.panel.$.gradientAngle.addEventListener('change', (e: any) => {
            this.gradientAngle = parseInt(e.target.value);
            if (this.enableGradient) this.updateCodePreview();
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

        // 像素對齊
        this.panel.$.snapToPixel.addEventListener('change', (e: any) => {
            this.snapToPixel = e.target.checked;
            console.log('[Graphics Editor] Snap to pixel:', this.snapToPixel ? '啟用' : '禁用');
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
            // 折線繪製中的快捷鍵
            if (this.isDrawingPolyline) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.closePolyline();
                    return;
                } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.polylineUndo();
                    return;
                } else if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.polylineRedo();
                    return;
                }
            }
            
            // 通用快捷鍵
            if (e.key === 'Escape') {
                if (this.selectedShapeIndex !== -1) {
                    // 取消選取
                    this.deselectShape();
                }
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                // 刪除選中的圖形
                if (this.selectedShapeIndex !== -1) {
                    e.preventDefault();
                    this.deleteSelectedShape();
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
            } else if (e.key === 'Enter') {
                // Enter：確認變換或完成折線/貝茲曲線
                if (this.isTransforming) {
                    e.preventDefault();
                    this.isTransforming = false;
                    this.transformMode = '';
                    this.updateCodePreview();
                } else if (this.isDrawingPolyline) {
                    e.preventDefault();
                    // 完成折線繪製 - 閉合折線
                    this.isDrawingPolyline = false;
                    const polylineShape = {
                        tool: 'polyline',
                        points: this.polylinePoints,
                        isClosed: true,  // 按 Enter 時應該閉合
                        fillColor: this.fillColor,
                        fillAlpha: this.fillAlpha,
                        strokeColor: this.strokeColor,
                        strokeAlpha: this.strokeAlpha,
                        lineWidth: this.lineWidth,
                        fillMode: this.fillMode,
                        strokeMode: this.strokeMode
                    };
                    this.shapes.push(polylineShape);
                    this.polylinePoints = [];
                    this.redraw();
                    this.updateCodePreview();
                } else if (this.isDrawingBezier) {
                    e.preventDefault();
                    // 完成貝茲曲線繪製 - 閉合曲線
                    this.closeBezier();
                }
            } else if (e.key === 'Escape') {
                // Esc：取消變換
                if (this.isTransforming) {
                    e.preventDefault();
                    // 恢復到變換前的狀態
                    this.shapes[this.selectedShapeIndex] = JSON.parse(JSON.stringify(this.transformStartShape));
                    this.isTransforming = false;
                    this.transformMode = '';
                    this.redraw();
                } else if (this.isDrawingPolyline) {
                    e.preventDefault();
                    // 清除折線繪製
                    this.isDrawingPolyline = false;
                    this.polylinePoints = [];
                    this.redraw();
                } else if (this.isDrawingBezier) {
                    e.preventDefault();
                    // 清除貝茲曲線繪製
                    this.isDrawingBezier = false;
                    this.bezierSegments = [];
                    this.bezierCurrentPoint = null;
                    this.bezierCP1 = null;
                    this.bezierCP2 = null;
                    this.bezierClickCount = 0;
                    this.redraw();
                }
            } else if (e.key === 'Delete') {
                // Delete：刪除選中的圖形
                if (this.selectedShapeIndex !== -1 && !this.isTransforming && !this.isDrawingPolyline && !this.isDrawingBezier) {
                    e.preventDefault();
                    this.deleteSelectedShape();
                }
            } else if (e.key === 'Backspace') {
                // Backspace：貝茲曲線退回上一個點
                if (this.isDrawingBezier) {
                    e.preventDefault();
                    this.bezierUndoPoint();
                }
            }
        });

        // 畫布繪圖事件
        this.drawCanvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.drawCanvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.drawCanvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.drawCanvas.addEventListener('contextmenu', (e) => {
            // 禁用右鍵菜單，用於選取功能
            e.preventDefault();
        });
        this.drawCanvas.addEventListener('mouseleave', () => {
            this.panel.$.coordDisplay.textContent = '';
        });

        // 操作
        this.panel.$.btnUndo.addEventListener('click', () => this.undo());
        this.panel.$.btnClear.addEventListener('click', () => this.undo());
        this.panel.$.btnDelete.addEventListener('click', () => this.deleteSelectedShape());
        this.panel.$.btnCopyCode.addEventListener('click', () => this.copyCode());
        this.panel.$.btnExport.addEventListener('click', () => this.exportScript());
        this.panel.$.btnExportMask.addEventListener('click', () => this.exportMaskScript());
        this.panel.$.btnClearAll.addEventListener('click', () => this.clearAll());

        // 圓角化
        this.panel.$.useUniformRadius.addEventListener('change', (e: any) => {
            this.useUniformRadius = e.target.checked;
            this.toggleRadiusInputMode();
        });
        
        this.panel.$.cornerRadius.addEventListener('change', (e: any) => {
            this.cornerRadius = parseInt(e.target.value);
            if (this.useUniformRadius) {
                // 統一模式下，同步所有角的值
                this.cornerRadiusTL = this.cornerRadius;
                this.cornerRadiusTR = this.cornerRadius;
                this.cornerRadiusBR = this.cornerRadius;
                this.cornerRadiusBL = this.cornerRadius;
            }
        });
        
        this.panel.$.cornerRadiusTL.addEventListener('change', (e: any) => {
            this.cornerRadiusTL = parseInt(e.target.value);
        });
        this.panel.$.cornerRadiusTR.addEventListener('change', (e: any) => {
            this.cornerRadiusTR = parseInt(e.target.value);
        });
        this.panel.$.cornerRadiusBR.addEventListener('change', (e: any) => {
            this.cornerRadiusBR = parseInt(e.target.value);
        });
        this.panel.$.cornerRadiusBL.addEventListener('change', (e: any) => {
            this.cornerRadiusBL = parseInt(e.target.value);
        });
        
        this.panel.$.btnApplyCornerRadius.addEventListener('click', () => this.applyCornerRadius());

        // 同步 Inspector 颜色选项
        this.panel.$.syncInspectorColors.addEventListener('change', (e: any) => {
            this.syncInspectorColors = e.target.checked;
            console.log('[Graphics Editor] 同步 Inspector 颜色:', this.syncInspectorColors ? '启用' : '禁用');
            // 更新代码预览
            const code = this.generateTypeScriptCode();
            this.panel.$.codePreview.value = code;
        });
    }

    selectTool(tool: string, button: any) {
        [this.panel.$.btnRect, this.panel.$.btnCircle, this.panel.$.btnLine, this.panel.$.btnPolyline, this.panel.$.btnBezier].forEach((btn: any) => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        this.currentTool = tool;
        
        // 如果不是折線工具，關閉任何正在進行的折線繪製
        if (tool !== 'polyline' && this.isDrawingPolyline) {
            this.closePolyline();
        }
        
        // 如果不是貝茲曲線工具，關閉任何正在進行的貝茲曲線繪製
        if (tool !== 'bezier' && this.isDrawingBezier) {
            this.closeBezier();
        }
    }

    onMouseDown(e: MouseEvent) {
        const pos = this.screenToCanvas(e.clientX, e.clientY);
        
        // 中鍵用於 Pan 平移，不要進行繪製操作
        if (e.button === 1) {
            e.preventDefault();
            return;
        }
        
        // 第一優先級：檢查選中的貝茲曲線是否有被點擊的控制點（隨時可調整）
        if (this.selectedShapeIndex !== -1 && !this.isDrawingPolyline && !this.isDrawingBezier) {
            const shape = this.shapes[this.selectedShapeIndex];
            
            if (shape.tool === 'bezier') {
                const controlPoint = this.getBezierControlAtPosition(pos.x, pos.y);
                if (controlPoint) {
                    // 開始編輯控制點
                    this.isEditingBezierControl = true;
                    this.editingSegmentIndex = controlPoint.segmentIndex;
                    this.editingControlType = controlPoint.type;
                    this.bezierEditStartX = pos.x;
                    this.bezierEditStartY = pos.y;
                    this.transformStartShape = JSON.parse(JSON.stringify(shape)); // 深複製
                    e.preventDefault();
                    return;
                }
            }
        }
        
        // 第二優先級：貝茲曲線繪製過程中，允許拖動控制點來即時調整
        if (this.isDrawingBezier && !this.isEditingBezierDrawingCP) {
            // 檢查是否點擊到 CP1 或 CP2
            if (this.bezierCP1) {
                const distCP1 = Math.sqrt(
                    Math.pow(pos.x - this.bezierCP1.x, 2) + 
                    Math.pow(pos.y - this.bezierCP1.y, 2)
                );
                if (distCP1 <= 8) {
                    this.isEditingBezierDrawingCP = true;
                    this.editingDrawingCP = 'cp1';
                    e.preventDefault();
                    return;
                }
            }
            
            if (this.bezierCP2) {
                const distCP2 = Math.sqrt(
                    Math.pow(pos.x - this.bezierCP2.x, 2) + 
                    Math.pow(pos.y - this.bezierCP2.y, 2)
                );
                if (distCP2 <= 8) {
                    this.isEditingBezierDrawingCP = true;
                    this.editingDrawingCP = 'cp2';
                    e.preventDefault();
                    return;
                }
            }
        }
        
        // 第三優先級：檢查其他圖形的變換句柄
        if (this.selectedShapeIndex !== -1 && !this.isDrawingPolyline && !this.isDrawingBezier) {
            const shape = this.shapes[this.selectedShapeIndex];
            
            // 檢查是否點擊到變換句柄
            const handleMode = this.getHandleAtPosition(pos.x, pos.y);
            if (handleMode) {
                // 開始變換
                this.isTransforming = true;
                this.transformMode = handleMode;
                this.transformStartX = pos.x;
                this.transformStartY = pos.y;
                this.transformStartShape = JSON.parse(JSON.stringify(shape)); // 深複製
                e.preventDefault();
                return;
            }
        }
        
        // 檢查是否點擊到已有的圖形（用於選取）
        // 按住 Ctrl/Cmd 或者右鍵點擊可以選取
        if (e.button === 2 || e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.trySelectShape(pos.x, pos.y);
            return;
        }
        
        // 折線模式：點擊添加點
        if (this.currentTool === 'polyline') {
            if (!this.isDrawingPolyline) {
                this.startPolyline();
            }
            
            let clickX = pos.x;
            let clickY = pos.y;
            
            // 按住 Shift 鍵：限制為水平或垂直線
            if (e.shiftKey && this.polylinePoints.length > 0) {
                const lastPoint = this.polylinePoints[this.polylinePoints.length - 1];
                const dx = Math.abs(clickX - lastPoint.x);
                const dy = Math.abs(clickY - lastPoint.y);
                
                // 判斷是水平還是垂直
                if (dx > dy) {
                    // 水平線
                    clickY = lastPoint.y;
                } else {
                    // 垂直線
                    clickX = lastPoint.x;
                }
            }
            
            this.addPolylinePoint(clickX, clickY);
            return;
        }
        
        // 貝茲曲線模式：點擊添加點（起點 -> CP1 -> CP2 -> 終點，循環）
        if (this.currentTool === 'bezier') {
            if (!this.isDrawingBezier) {
                this.startBezier();
            }
            
            this.addBezierPoint(pos.x, pos.y);
            return;
        }

        // 取消之前的選取
        if (this.selectedShapeIndex !== -1) {
            this.deselectShape();
        }

        // 其他工具：正常繪製
        this.isDrawing = true;
        this.startX = pos.x;
        this.startY = pos.y;
    }

    onMouseMove(e: MouseEvent) {
        const pos = this.screenToCanvas(e.clientX, e.clientY);
        let currentX = pos.x;
        let currentY = pos.y;

        // 處理貝茲曲線繪製過程中的控制點拖動
        if (this.isEditingBezierDrawingCP) {
            const snapX = this.snapToPixel ? Math.round(currentX) : currentX;
            const snapY = this.snapToPixel ? Math.round(currentY) : currentY;
            
            if (this.editingDrawingCP === 'cp1' && this.bezierCP1) {
                this.bezierCP1.x = snapX;
                this.bezierCP1.y = snapY;
            } else if (this.editingDrawingCP === 'cp2' && this.bezierCP2) {
                this.bezierCP2.x = snapX;
                this.bezierCP2.y = snapY;
            }
            
            this.redraw();
            this.drawBezierPreview();
            return;
        }

        // 處理貝茲曲線選中後的控制點編輯
        if (this.isEditingBezierControl) {
            const shape = this.shapes[this.selectedShapeIndex];
            if (shape && shape.segments && this.editingSegmentIndex >= 0) {
                const segment = shape.segments[this.editingSegmentIndex];
                const snapX = this.snapToPixel ? Math.round(currentX) : currentX;
                const snapY = this.snapToPixel ? Math.round(currentY) : currentY;
                
                // 更新對應的控制點或轉折點
                switch (this.editingControlType) {
                    case 'cp1':
                        segment.cp1.x = snapX;
                        segment.cp1.y = snapY;
                        break;
                    case 'cp2':
                        segment.cp2.x = snapX;
                        segment.cp2.y = snapY;
                        break;
                    case 'start':
                        // 移動起點，同時需要更新前一段的終點（如果存在）
                        segment.start.x = snapX;
                        segment.start.y = snapY;
                        if (this.editingSegmentIndex > 0) {
                            shape.segments[this.editingSegmentIndex - 1].end.x = snapX;
                            shape.segments[this.editingSegmentIndex - 1].end.y = snapY;
                        }
                        break;
                    case 'end':
                        // 移動終點，同時需要更新下一段的起點（如果存在）
                        segment.end.x = snapX;
                        segment.end.y = snapY;
                        if (this.editingSegmentIndex < shape.segments.length - 1) {
                            shape.segments[this.editingSegmentIndex + 1].start.x = snapX;
                            shape.segments[this.editingSegmentIndex + 1].start.y = snapY;
                        }
                        break;
                }
                
                // 更新邊界框
                this.updateBezierBounds(shape);
                
                this.redraw();
            }
            return;
        }

        // 處理圖形變換
        if (this.isTransforming) {
            const deltaX = currentX - this.transformStartX;
            const deltaY = currentY - this.transformStartY;
            this.updateShapeTransform(deltaX, deltaY, e);
            this.redraw();
            return;
        }

        // 更新光標顯示當前句柄
        if (this.selectedShapeIndex !== -1 && !this.isDrawingPolyline && !this.isDrawingBezier) {
            const shape = this.shapes[this.selectedShapeIndex];
            
            // 第一優先級：檢查是否在貝茲曲線控制點上（隨時可調整）
            if (shape.tool === 'bezier') {
                const controlPoint = this.getBezierControlAtPosition(currentX, currentY);
                if (controlPoint) {
                    this.drawCanvas.style.cursor = 'pointer';
                    return;
                }
            }
            
            // 第二優先級：檢查變換句柄
            const handleMode = this.getHandleAtPosition(currentX, currentY);
            if (handleMode) {
                let cursor = 'move';
                switch(handleMode) {
                    case 'nw': case 'se': cursor = 'nwse-resize'; break;
                    case 'ne': case 'sw': cursor = 'nesw-resize'; break;
                    case 'n': case 's': cursor = 'ns-resize'; break;
                    case 'e': case 'w': cursor = 'ew-resize'; break;
                }
                this.drawCanvas.style.cursor = cursor;
            } else {
                this.drawCanvas.style.cursor = 'crosshair';
            }
        } else {
            this.drawCanvas.style.cursor = 'crosshair';
        }
        
        // 折線繪製中：處理 Shift 鍵約束和預覽
        if (this.isDrawingPolyline && this.polylinePoints.length > 0) {
            const lastPoint = this.polylinePoints[this.polylinePoints.length - 1];
            
            // 按住 Shift 鍵：限制為水平或垂直線
            if (e.shiftKey) {
                const dx = Math.abs(currentX - lastPoint.x);
                const dy = Math.abs(currentY - lastPoint.y);
                
                // 判斷是水平還是垂直
                if (dx > dy) {
                    // 水平線
                    currentY = lastPoint.y;
                } else {
                    // 垂直線
                    currentX = lastPoint.x;
                }
            }
            
            // 保存預覽坐標
            this.polylinePreviewX = currentX;
            this.polylinePreviewY = currentY;
            
            // 重繪以顯示預覽線
            this.redraw();
            this.drawPolylinePreview();
            return;
        }
        
        // 貝茲曲線繪製中：更新預覽點座標
        if (this.isDrawingBezier) {
            this.bezierPreviewX = currentX;
            this.bezierPreviewY = currentY;
            this.redraw();
            this.drawBezierPreview();
            return;
        }

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
        // 完成貝茲曲線繪製過程中的控制點拖動
        if (this.isEditingBezierDrawingCP) {
            this.isEditingBezierDrawingCP = false;
            this.editingDrawingCP = null;
            this.redraw();
            this.drawBezierPreview();
            return;
        }
        
        // 完成貝茲曲線選中後的控制點編輯
        if (this.isEditingBezierControl) {
            this.isEditingBezierControl = false;
            this.editingSegmentIndex = -1;
            this.editingControlType = '';
            this.updateCodePreview();
            return;
        }
        
        // 完成圖形變換
        if (this.isTransforming) {
            this.isTransforming = false;
            this.transformMode = '';
            this.updateCodePreview();
            return;
        }

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
                    
                    // 檢查是否有個別圓角半徑
                    if (shape.radiusTL !== undefined || shape.radiusTR !== undefined || 
                        shape.radiusBR !== undefined || shape.radiusBL !== undefined) {
                        // 繪製個別圓角矩形
                        const rTL = shape.radiusTL || 0;
                        const rTR = shape.radiusTR || 0;
                        const rBR = shape.radiusBR || 0;
                        const rBL = shape.radiusBL || 0;
                        this.drawIndividualRoundedRect(shape.startX, shape.startY, width, height, 
                            rTL, rTR, rBR, rBL, shape.fillMode, shape.strokeMode);
                    } else if (shape.radius && shape.radius > 0) {
                        // 繪製統一圓角矩形
                        this.drawRoundedRect(shape.startX, shape.startY, width, height, shape.radius, shape.fillMode, shape.strokeMode);
                    } else {
                        // 繪製普通矩形
                        if (shape.fillMode) this.drawCtx.fillRect(shape.startX, shape.startY, width, height);
                        if (shape.strokeMode) this.drawCtx.strokeRect(shape.startX, shape.startY, width, height);
                    }
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
                        // 如果是閉合的折線，返回起點，使 stroke 和 fill 都能正確封閉
                        if (shape.isClosed) {
                            this.drawCtx.lineTo(shape.points[0].x, shape.points[0].y);
                        }
                        if (shape.strokeMode) this.drawCtx.stroke();
                        if (shape.fillMode && shape.isClosed) this.drawCtx.fill();
                    }
                    break;
                case 'bezier':
                    if (shape.segments && shape.segments.length > 0) {
                        this.drawCtx.beginPath();
                        // 移動到第一段的起點
                        this.drawCtx.moveTo(shape.segments[0].start.x, shape.segments[0].start.y);
                        
                        // 繪製所有貝茲曲線段
                        for (const segment of shape.segments) {
                            this.drawCtx.bezierCurveTo(
                                segment.cp1.x, segment.cp1.y,
                                segment.cp2.x, segment.cp2.y,
                                segment.end.x, segment.end.y
                            );
                        }
                        
                        // 如果是閉合的，返回起點
                        if (shape.isClosed && shape.segments.length > 0) {
                            this.drawCtx.lineTo(shape.segments[0].start.x, shape.segments[0].start.y);
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
        
        // 繪製正在進行的貝茲曲線預覽
        if (this.isDrawingBezier) {
            this.drawBezierPreview();
        }

        // 繪製選中圖形的高亮邊框
        if (this.selectedShapeIndex !== -1) {
            this.drawSelectionHighlight();
            // 如果選中的是貝茲曲線，繪製控制點
            const shape = this.shapes[this.selectedShapeIndex];
            if (shape && shape.tool === 'bezier' && !this.isTransforming) {
                this.drawBezierControlPoints();
            }
        }
    }

    // ==================== 圖形變換相關方法 ====================

    /**
     * 檢測鼠標是否在調整句柄上，返回句柄模式
     */
    private getHandleAtPosition(x: number, y: number): string | null {
        if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.shapes.length) {
            return null;
        }

        const shape = this.shapes[this.selectedShapeIndex];
        let bounds: any = null;

        // 計算邊界框
        switch(shape.tool) {
            case 'rect':
                bounds = {
                    x: Math.min(shape.startX, shape.endX),
                    y: Math.min(shape.startY, shape.endY),
                    width: Math.abs(shape.endX - shape.startX),
                    height: Math.abs(shape.endY - shape.startY)
                };
                break;
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(shape.endX - shape.startX, 2) + 
                    Math.pow(shape.endY - shape.startY, 2)
                );
                bounds = {
                    x: shape.startX - radius,
                    y: shape.startY - radius,
                    width: radius * 2,
                    height: radius * 2
                };
                break;
            case 'line':
                bounds = {
                    x: Math.min(shape.startX, shape.endX),
                    y: Math.min(shape.startY, shape.endY),
                    width: Math.abs(shape.endX - shape.startX),
                    height: Math.abs(shape.endY - shape.startY)
                };
                break;
            case 'polyline':
                if (shape.points && shape.points.length > 0) {
                    let minX = shape.points[0].x, maxX = shape.points[0].x;
                    let minY = shape.points[0].y, maxY = shape.points[0].y;
                    for (const p of shape.points) {
                        minX = Math.min(minX, p.x);
                        maxX = Math.max(maxX, p.x);
                        minY = Math.min(minY, p.y);
                        maxY = Math.max(maxY, p.y);
                    }
                    bounds = {
                        x: minX,
                        y: minY,
                        width: maxX - minX,
                        height: maxY - minY
                    };
                }
                break;
            case 'bezier':
                // 使用已存儲的邊界框
                if (shape.startX !== undefined && shape.endX !== undefined) {
                    bounds = {
                        x: shape.startX,
                        y: shape.startY,
                        width: shape.endX - shape.startX,
                        height: shape.endY - shape.startY
                    };
                }
                break;
        }

        if (!bounds) return null;

        const h = this.handleSize;
        const hh = h / 2;
        const tolerance = hh + 3;

        // 檢查8個角
        const corners = [
            { x: bounds.x, y: bounds.y, mode: 'nw' },
            { x: bounds.x + bounds.width, y: bounds.y, mode: 'ne' },
            { x: bounds.x, y: bounds.y + bounds.height, mode: 'sw' },
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height, mode: 'se' }
        ];

        // 檢查4個邊的中點
        const edges = [
            { x: bounds.x + bounds.width / 2, y: bounds.y, mode: 'n' },
            { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height, mode: 's' },
            { x: bounds.x, y: bounds.y + bounds.height / 2, mode: 'w' },
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2, mode: 'e' }
        ];

        // 檢查中心點（用於移動）
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        const distToCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        if (distToCenter <= tolerance) {
            return 'move';
        }

        // 檢查角的句柄
        for (const handle of corners) {
            const dist = Math.sqrt(Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2));
            if (dist <= tolerance) {
                return handle.mode;
            }
        }

        // 檢查邊的句柄
        for (const handle of edges) {
            const dist = Math.sqrt(Math.pow(x - handle.x, 2) + Math.pow(y - handle.y, 2));
            if (dist <= tolerance) {
                return handle.mode;
            }
        }

        return null;
    }

    /**
     * 更新圖形的變換（移動、調整大小）
     */
    private updateShapeTransform(deltaX: number, deltaY: number, e: MouseEvent) {
        if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.shapes.length) {
            return;
        }

        const shape = this.shapes[this.selectedShapeIndex];
        const origShape = this.transformStartShape;

        // 支援 Shift 鍵保持寬高比例
        if (e.shiftKey) {
            this.keepAspectRatio = true;
        } else {
            this.keepAspectRatio = false;
        }

        // 支援 Alt 鍵從中心變換
        if (e.altKey) {
            this.transformFromCenter = true;
        } else {
            this.transformFromCenter = false;
        }

        const snapPixel = this.snapToPixel ? Math.round : (x: number) => x;

        switch(this.transformMode) {
            case 'move':
                // 移動整個圖形
                shape.startX = snapPixel(origShape.startX + deltaX);
                shape.startY = snapPixel(origShape.startY + deltaY);
                shape.endX = snapPixel(origShape.endX + deltaX);
                shape.endY = snapPixel(origShape.endY + deltaY);
                
                // 處理折線移動
                if (shape.points) {
                    shape.points = origShape.points.map((p: any) => ({
                        x: snapPixel(p.x + deltaX),
                        y: snapPixel(p.y + deltaY)
                    }));
                }
                
                // 處理貝茲曲線移動
                if (shape.segments) {
                    shape.segments = origShape.segments.map((seg: any) => ({
                        start: {x: snapPixel(seg.start.x + deltaX), y: snapPixel(seg.start.y + deltaY)},
                        cp1: {x: snapPixel(seg.cp1.x + deltaX), y: snapPixel(seg.cp1.y + deltaY)},
                        cp2: {x: snapPixel(seg.cp2.x + deltaX), y: snapPixel(seg.cp2.y + deltaY)},
                        end: {x: snapPixel(seg.end.x + deltaX), y: snapPixel(seg.end.y + deltaY)}
                    }));
                }
                break;

            case 'nw': // 左上角
                if (this.transformFromCenter) {
                    shape.startX = snapPixel(origShape.startX + deltaX * 2);
                    shape.startY = snapPixel(origShape.startY + deltaY * 2);
                } else {
                    shape.startX = snapPixel(origShape.startX + deltaX);
                    shape.startY = snapPixel(origShape.startY + deltaY);
                }
                
                if (this.keepAspectRatio && shape.tool === 'rect') {
                    const origW = origShape.endX - origShape.startX;
                    const origH = origShape.endY - origShape.startY;
                    const ratio = Math.abs(origW) / Math.abs(origH);
                    const newW = shape.endX - shape.startX;
                    const newH = Math.abs(newW) / ratio;
                    shape.endY = snapPixel(shape.startY + newH * (origH > 0 ? 1 : -1));
                }
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;

            case 'ne': // 右上角
                if (this.transformFromCenter) {
                    shape.endX = snapPixel(origShape.endX + deltaX * 2);
                    shape.startY = snapPixel(origShape.startY + deltaY * 2);
                } else {
                    shape.endX = snapPixel(origShape.endX + deltaX);
                    shape.startY = snapPixel(origShape.startY + deltaY);
                }
                
                if (this.keepAspectRatio && shape.tool === 'rect') {
                    const origW = origShape.endX - origShape.startX;
                    const origH = origShape.endY - origShape.startY;
                    const ratio = Math.abs(origW) / Math.abs(origH);
                    const newW = shape.endX - shape.startX;
                    const newH = Math.abs(newW) / ratio;
                    shape.endY = snapPixel(shape.startY + newH * (origH > 0 ? 1 : -1));
                }
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;

            case 'sw': // 左下角
                if (this.transformFromCenter) {
                    shape.startX = snapPixel(origShape.startX + deltaX * 2);
                    shape.endY = snapPixel(origShape.endY + deltaY * 2);
                } else {
                    shape.startX = snapPixel(origShape.startX + deltaX);
                    shape.endY = snapPixel(origShape.endY + deltaY);
                }
                
                if (this.keepAspectRatio && shape.tool === 'rect') {
                    const origW = origShape.endX - origShape.startX;
                    const origH = origShape.endY - origShape.startY;
                    const ratio = Math.abs(origW) / Math.abs(origH);
                    const newW = shape.endX - shape.startX;
                    const newH = Math.abs(newW) / ratio;
                    shape.endY = snapPixel(shape.startY + newH * (origH > 0 ? 1 : -1));
                }
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;

            case 'se': // 右下角
                if (this.transformFromCenter) {
                    shape.endX = snapPixel(origShape.endX + deltaX * 2);
                    shape.endY = snapPixel(origShape.endY + deltaY * 2);
                } else {
                    shape.endX = snapPixel(origShape.endX + deltaX);
                    shape.endY = snapPixel(origShape.endY + deltaY);
                }
                
                if (this.keepAspectRatio && shape.tool === 'rect') {
                    const origW = origShape.endX - origShape.startX;
                    const origH = origShape.endY - origShape.startY;
                    const ratio = Math.abs(origW) / Math.abs(origH);
                    const newW = shape.endX - shape.startX;
                    const newH = Math.abs(newW) / ratio;
                    shape.endY = snapPixel(shape.startY + newH * (origH > 0 ? 1 : -1));
                }
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;

            case 'n': // 上邊中點
                shape.startY = snapPixel(origShape.startY + deltaY);
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;

            case 's': // 下邊中點
                shape.endY = snapPixel(origShape.endY + deltaY);
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;

            case 'w': // 左邊中點
                shape.startX = snapPixel(origShape.startX + deltaX);
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;

            case 'e': // 右邊中點
                shape.endX = snapPixel(origShape.endX + deltaX);
                
                // 處理折線縮放
                if (shape.points && origShape.points) {
                    this.scalePolylinePoints(shape, origShape);
                }
                // 處理貝茲曲線縮放
                if (shape.segments && origShape.segments) {
                    this.scaleBezierSegments(shape, origShape);
                }
                break;
        }
    }

    /**
     * 縮放折線的所有點
     */
    private scalePolylinePoints(shape: any, origShape: any) {
        if (!shape.points || !origShape.points) return;

        const snapPixel = this.snapToPixel ? Math.round : (x: number) => x;

        // 計算原始邊界框
        let origMinX = origShape.points[0].x, origMaxX = origShape.points[0].x;
        let origMinY = origShape.points[0].y, origMaxY = origShape.points[0].y;
        for (const p of origShape.points) {
            origMinX = Math.min(origMinX, p.x);
            origMaxX = Math.max(origMaxX, p.x);
            origMinY = Math.min(origMinY, p.y);
            origMaxY = Math.max(origMaxY, p.y);
        }
        
        const origWidth = origMaxX - origMinX;
        const origHeight = origMaxY - origMinY;
        
        // 新的邊界框 - 從 shape.startX/endX 或 從 shape.points 計算
        let newMinX, newMaxX, newMinY, newMaxY;
        
        if (shape.startX !== undefined && shape.endX !== undefined) {
            // 如果有 startX/endX，使用這些值
            newMinX = Math.min(shape.startX, shape.endX);
            newMaxX = Math.max(shape.startX, shape.endX);
            newMinY = Math.min(shape.startY, shape.endY);
            newMaxY = Math.max(shape.startY, shape.endY);
        } else {
            // 否則從當前的 points 計算（這種情況不應該發生，但作為後備）
            newMinX = shape.points[0].x;
            newMaxX = shape.points[0].x;
            newMinY = shape.points[0].y;
            newMaxY = shape.points[0].y;
            for (const p of shape.points) {
                newMinX = Math.min(newMinX, p.x);
                newMaxX = Math.max(newMaxX, p.x);
                newMinY = Math.min(newMinY, p.y);
                newMaxY = Math.max(newMaxY, p.y);
            }
        }
        
        const newWidth = newMaxX - newMinX;
        const newHeight = newMaxY - newMinY;
        
        // 計算縮放比例
        const scaleX = origWidth !== 0 ? newWidth / origWidth : 1;
        const scaleY = origHeight !== 0 ? newHeight / origHeight : 1;
        
        // 縮放每個點
        shape.points = origShape.points.map((p: any) => {
            // 計算點在原始邊界框中的相對位置 (0-1)
            const relX = origWidth !== 0 ? (p.x - origMinX) / origWidth : 0;
            const relY = origHeight !== 0 ? (p.y - origMinY) / origHeight : 0;
            
            // 應用到新的邊界框
            return {
                x: snapPixel(newMinX + relX * newWidth),
                y: snapPixel(newMinY + relY * newHeight)
            };
        });
        
        // 更新 shape 的 startX/Y 和 endX/Y 以匹配新的邊界
        shape.startX = newMinX;
        shape.startY = newMinY;
        shape.endX = newMaxX;
        shape.endY = newMaxY;
    }

    /**
     * 縮放貝茲曲線的所有段落
     */
    private scaleBezierSegments(shape: any, origShape: any) {
        if (!shape.segments || !origShape.segments) return;

        const snapPixel = this.snapToPixel ? Math.round : (x: number) => x;

        // 計算原始邊界框
        let origMinX = origShape.segments[0].start.x;
        let origMaxX = origMinX;
        let origMinY = origShape.segments[0].start.y;
        let origMaxY = origMinY;
        
        origShape.segments.forEach((seg: any) => {
            [seg.start, seg.cp1, seg.cp2, seg.end].forEach((p: any) => {
                origMinX = Math.min(origMinX, p.x);
                origMaxX = Math.max(origMaxX, p.x);
                origMinY = Math.min(origMinY, p.y);
                origMaxY = Math.max(origMaxY, p.y);
            });
        });
        
        const origWidth = origMaxX - origMinX;
        const origHeight = origMaxY - origMinY;
        
        // 新的邊界框
        const newMinX = Math.min(shape.startX, shape.endX);
        const newMaxX = Math.max(shape.startX, shape.endX);
        const newMinY = Math.min(shape.startY, shape.endY);
        const newMaxY = Math.max(shape.startY, shape.endY);
        
        const newWidth = newMaxX - newMinX;
        const newHeight = newMaxY - newMinY;
        
        // 計算縮放比例
        const scaleX = origWidth !== 0 ? newWidth / origWidth : 1;
        const scaleY = origHeight !== 0 ? newHeight / origHeight : 1;
        
        // 縮放每個段落的所有點
        shape.segments = origShape.segments.map((seg: any) => {
            const scalePoint = (p: any) => {
                const relX = origWidth !== 0 ? (p.x - origMinX) / origWidth : 0;
                const relY = origHeight !== 0 ? (p.y - origMinY) / origHeight : 0;
                return {
                    x: snapPixel(newMinX + relX * newWidth),
                    y: snapPixel(newMinY + relY * newHeight)
                };
            };
            
            return {
                start: scalePoint(seg.start),
                cp1: scalePoint(seg.cp1),
                cp2: scalePoint(seg.cp2),
                end: scalePoint(seg.end)
            };
        });
        
        // 更新 shape 的 startX/Y 和 endX/Y
        shape.startX = newMinX;
        shape.startY = newMinY;
        shape.endX = newMaxX;
        shape.endY = newMaxY;
    }

    // ==================== 選取相關方法 ====================

    /**
     * 嘗試選取點擊位置的圖形
     */
    trySelectShape(x: number, y: number) {
        // 從後往前遍歷（後繪製的圖形在上層）
        for (let i = this.shapes.length - 1; i >= 0; i--) {
            if (this.isPointInShape(x, y, this.shapes[i])) {
                this.selectShape(i);
                return;
            }
        }
        // 如果沒有點擊到任何圖形，取消選取
        this.deselectShape();
    }

    /**
     * 檢測點是否在圖形內
     */
    isPointInShape(x: number, y: number, shape: any): boolean {
        const tolerance = 5; // 點擊容差

        switch(shape.tool) {
            case 'rect':
                const minX = Math.min(shape.startX, shape.endX) - tolerance;
                const maxX = Math.max(shape.startX, shape.endX) + tolerance;
                const minY = Math.min(shape.startY, shape.endY) - tolerance;
                const maxY = Math.max(shape.startY, shape.endY) + tolerance;
                return x >= minX && x <= maxX && y >= minY && y <= maxY;
                
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(shape.endX - shape.startX, 2) + 
                    Math.pow(shape.endY - shape.startY, 2)
                );
                const distance = Math.sqrt(
                    Math.pow(x - shape.startX, 2) + 
                    Math.pow(y - shape.startY, 2)
                );
                return distance <= radius + tolerance;
                
            case 'line':
                // 線條：計算點到線段的距離
                const lineDistance = this.pointToLineDistance(
                    x, y, 
                    shape.startX, shape.startY, 
                    shape.endX, shape.endY
                );
                return lineDistance <= tolerance + shape.lineWidth / 2;
                
            case 'polyline':
                if (!shape.points || shape.points.length < 2) return false;
                
                // 如果是閉合的折線且有填充，檢查是否在多邊形內
                if (shape.isClosed && shape.fillMode) {
                    return this.isPointInPolygon(x, y, shape.points);
                }
                
                // 否則檢查是否在任何線段附近
                for (let i = 0; i < shape.points.length - 1; i++) {
                    const dist = this.pointToLineDistance(
                        x, y,
                        shape.points[i].x, shape.points[i].y,
                        shape.points[i + 1].x, shape.points[i + 1].y
                    );
                    if (dist <= tolerance + shape.lineWidth / 2) {
                        return true;
                    }
                }
                return false;
                
            case 'bezier':
                // 貝茲曲線：檢查邊界框或任何段落
                if (!shape.segments || shape.segments.length === 0) return false;
                
                // 首先檢查邊界框
                const bezMinX = Math.min(shape.startX, shape.endX) - tolerance;
                const bezMaxX = Math.max(shape.startX, shape.endX) + tolerance;
                const bezMinY = Math.min(shape.startY, shape.endY) - tolerance;
                const bezMaxY = Math.max(shape.startY, shape.endY) + tolerance;
                
                if (x < bezMinX || x > bezMaxX || y < bezMinY || y > bezMaxY) {
                    return false;
                }
                
                // 如果是閉合的且有填充，檢查是否在多邊形內
                if (shape.isClosed && shape.fillMode) {
                    // 對於貝茲曲線，使用近似的多邊形檢測
                    // 這裡簡化處理，只返回邊界框檢測結果
                    return true;
                }
                
                // 否則檢查是否在曲線附近（近似）
                // 簡化處理：如果在邊界框內且任何控制點附近，則認為在曲線上
                for (const segment of shape.segments) {
                    const points = [segment.start, segment.cp1, segment.cp2, segment.end];
                    for (const p of points) {
                        const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
                        if (dist <= tolerance * 2) {
                            return true;
                        }
                    }
                }
                return false;
        }
        return false;
    }

    /**
     * 計算點到線段的距離
     */
    pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        
        if (lenSq !== 0) {
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * 檢測點是否在多邊形內（射線法）
     */
    isPointInPolygon(x: number, y: number, points: Array<{x: number, y: number}>): boolean {
        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x, yi = points[i].y;
            const xj = points[j].x, yj = points[j].y;
            
            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }

    /**
     * 選取圖形
     */
    selectShape(index: number) {
        this.selectedShapeIndex = index;
        this.panel.$.btnDelete.style.display = 'block';
        
        // 如果是矩形，顯示圓角化選項
        const shape = this.shapes[index];
        if (shape && shape.tool === 'rect') {
            this.panel.$.cornerRadiusSection.style.display = 'block';
            
            // 檢查是統一圓角還是個別圓角
            if (shape.radiusTL !== undefined || shape.radiusTR !== undefined || 
                shape.radiusBR !== undefined || shape.radiusBL !== undefined) {
                // 個別圓角模式
                this.useUniformRadius = false;
                this.panel.$.useUniformRadius.checked = false;
                this.cornerRadiusTL = shape.radiusTL || 0;
                this.cornerRadiusTR = shape.radiusTR || 0;
                this.cornerRadiusBR = shape.radiusBR || 0;
                this.cornerRadiusBL = shape.radiusBL || 0;
                this.panel.$.cornerRadiusTL.value = String(this.cornerRadiusTL);
                this.panel.$.cornerRadiusTR.value = String(this.cornerRadiusTR);
                this.panel.$.cornerRadiusBR.value = String(this.cornerRadiusBR);
                this.panel.$.cornerRadiusBL.value = String(this.cornerRadiusBL);
            } else if (shape.radius !== undefined && shape.radius > 0) {
                // 統一圓角模式
                this.useUniformRadius = true;
                this.panel.$.useUniformRadius.checked = true;
                this.cornerRadius = shape.radius;
                this.panel.$.cornerRadius.value = String(shape.radius);
            }
            
            this.toggleRadiusInputMode();
        } else {
            this.panel.$.cornerRadiusSection.style.display = 'none';
        }
        
        // 如果是折線，確保有 startX/endX/startY/endY 屬性（用於變換）
        if (shape && shape.tool === 'polyline' && shape.points && shape.points.length > 0) {
            if (shape.startX === undefined || shape.endX === undefined) {
                let minX = shape.points[0].x, maxX = shape.points[0].x;
                let minY = shape.points[0].y, maxY = shape.points[0].y;
                for (const p of shape.points) {
                    minX = Math.min(minX, p.x);
                    maxX = Math.max(maxX, p.x);
                    minY = Math.min(minY, p.y);
                    maxY = Math.max(maxY, p.y);
                }
                shape.startX = minX;
                shape.endX = maxX;
                shape.startY = minY;
                shape.endY = maxY;
            }
        }
        
        // 如果是貝茲曲線，確保有 startX/endX/startY/endY 屬性（用於變換）
        if (shape && shape.tool === 'bezier' && shape.segments && shape.segments.length > 0) {
            if (shape.startX === undefined || shape.endX === undefined) {
                this.updateBezierBounds(shape);
            }
        }
        
        this.redraw();
        console.log('[Graphics Editor] 已選取圖形', index + 1, '(' + shape.tool + ')');
    }

    /**
     * 取消選取
     */
    deselectShape() {
        this.selectedShapeIndex = -1;
        this.panel.$.btnDelete.style.display = 'none';
        this.panel.$.cornerRadiusSection.style.display = 'none';
        this.redraw();
    }

    /**
     * 繪製選中圖形的高亮邊框和變換句柄
     */
    drawSelectionHighlight() {
        if (this.selectedShapeIndex < 0 || this.selectedShapeIndex >= this.shapes.length) {
            return;
        }

        const shape = this.shapes[this.selectedShapeIndex];
        this.drawCtx.save();
        
        // 高亮邊框樣式
        this.drawCtx.strokeStyle = '#00BFFF'; // 亮藍色
        this.drawCtx.lineWidth = 2;
        this.drawCtx.setLineDash([5, 5]); // 虛線

        let bounds: any = null;

        switch(shape.tool) {
            case 'rect':
                bounds = {
                    x: Math.min(shape.startX, shape.endX),
                    y: Math.min(shape.startY, shape.endY),
                    width: Math.abs(shape.endX - shape.startX),
                    height: Math.abs(shape.endY - shape.startY)
                };
                this.drawCtx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
                break;
                
            case 'circle':
                const radius = Math.sqrt(
                    Math.pow(shape.endX - shape.startX, 2) + 
                    Math.pow(shape.endY - shape.startY, 2)
                );
                this.drawCtx.beginPath();
                this.drawCtx.arc(shape.startX, shape.startY, radius, 0, Math.PI * 2);
                this.drawCtx.stroke();
                
                // 圓形的邊界框
                bounds = {
                    x: shape.startX - radius,
                    y: shape.startY - radius,
                    width: radius * 2,
                    height: radius * 2
                };
                break;
                
            case 'line':
                this.drawCtx.beginPath();
                this.drawCtx.moveTo(shape.startX, shape.startY);
                this.drawCtx.lineTo(shape.endX, shape.endY);
                this.drawCtx.stroke();
                
                // 線條的邊界框
                bounds = {
                    x: Math.min(shape.startX, shape.endX),
                    y: Math.min(shape.startY, shape.endY),
                    width: Math.abs(shape.endX - shape.startX),
                    height: Math.abs(shape.endY - shape.startY)
                };
                break;
                
            case 'polyline':
                if (shape.points && shape.points.length > 1) {
                    this.drawCtx.beginPath();
                    this.drawCtx.moveTo(shape.points[0].x, shape.points[0].y);
                    for (let i = 1; i < shape.points.length; i++) {
                        this.drawCtx.lineTo(shape.points[i].x, shape.points[i].y);
                    }
                    if (shape.isClosed) {
                        this.drawCtx.closePath();
                    }
                    this.drawCtx.stroke();
                    
                    // 折線的邊界框
                    let minX = shape.points[0].x, maxX = shape.points[0].x;
                    let minY = shape.points[0].y, maxY = shape.points[0].y;
                    for (const p of shape.points) {
                        minX = Math.min(minX, p.x);
                        maxX = Math.max(maxX, p.x);
                        minY = Math.min(minY, p.y);
                        maxY = Math.max(maxY, p.y);
                    }
                    bounds = {
                        x: minX,
                        y: minY,
                        width: maxX - minX,
                        height: maxY - minY
                    };
                }
                break;
        }

        // 繪製調整句柄
        if (bounds) {
            this.drawTransformHandles(bounds);
        }

        this.drawCtx.restore();
    }

    /**
     * 繪製變換句柄（8個角 + 4個邊中點）
     */
    private drawTransformHandles(bounds: any) {
        this.drawCtx.save();
        this.drawCtx.fillStyle = '#FFFFFF'; // 白色
        this.drawCtx.strokeStyle = '#00BFFF'; // 亮藍色
        this.drawCtx.lineWidth = 1;
        this.drawCtx.setLineDash([]); // 實線

        const h = this.handleSize;
        const hh = h / 2;

        // 8個角
        const corners = [
            { x: bounds.x, y: bounds.y, cursor: 'nwse-resize', mode: 'nw' },
            { x: bounds.x + bounds.width, y: bounds.y, cursor: 'nesw-resize', mode: 'ne' },
            { x: bounds.x, y: bounds.y + bounds.height, cursor: 'nesw-resize', mode: 'sw' },
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height, cursor: 'nwse-resize', mode: 'se' }
        ];

        // 4個邊中點
        const edges = [
            { x: bounds.x + bounds.width / 2, y: bounds.y, cursor: 'ns-resize', mode: 'n' },
            { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height, cursor: 'ns-resize', mode: 's' },
            { x: bounds.x, y: bounds.y + bounds.height / 2, cursor: 'ew-resize', mode: 'w' },
            { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2, cursor: 'ew-resize', mode: 'e' }
        ];

        // 繪製角的句柄
        for (const handle of corners) {
            this.drawCtx.fillRect(handle.x - hh, handle.y - hh, h, h);
            this.drawCtx.strokeRect(handle.x - hh, handle.y - hh, h, h);
        }

        // 繪製邊的句柄
        for (const handle of edges) {
            this.drawCtx.fillRect(handle.x - hh, handle.y - hh, h, h);
            this.drawCtx.strokeRect(handle.x - hh, handle.y - hh, h, h);
        }

        // 繪製中心點（用於移動）
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        this.drawCtx.beginPath();
        this.drawCtx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        this.drawCtx.fillStyle = '#FFD700'; // 金色
        this.drawCtx.fill();
        this.drawCtx.strokeStyle = '#00BFFF';
        this.drawCtx.stroke();

        // 繪製尺寸標籤
        this.drawCtx.fillStyle = '#FFFFFF';
        this.drawCtx.strokeStyle = '#00BFFF';
        this.drawCtx.lineWidth = 1;
        this.drawCtx.font = '12px Arial';
        this.drawCtx.textAlign = 'center';
        this.drawCtx.textBaseline = 'middle';

        // 寬度標籤
        const widthLabel = `W: ${Math.round(bounds.width)}`;
        const widthLabelY = bounds.y - 10;
        this.drawCtx.strokeText(widthLabel, centerX, widthLabelY);
        this.drawCtx.fillText(widthLabel, centerX, widthLabelY);

        // 高度標籤
        const heightLabel = `H: ${Math.round(bounds.height)}`;
        const heightLabelX = bounds.x - 30;
        this.drawCtx.save();
        this.drawCtx.translate(heightLabelX, centerY);
        this.drawCtx.rotate(-Math.PI / 2);
        this.drawCtx.strokeText(heightLabel, 0, 0);
        this.drawCtx.fillText(heightLabel, 0, 0);
        this.drawCtx.restore();

        this.drawCtx.restore();
    }

    /**
     * 繪製貝茲曲線的控制點（當選中貝茲曲線時）
     */
    private drawBezierControlPoints() {
        if (this.selectedShapeIndex === -1) return;
        
        const shape = this.shapes[this.selectedShapeIndex];
        if (shape.tool !== 'bezier' || !shape.segments) return;

        this.drawCtx.save();
        
        // 繪製每個段落的控制點和控制線
        shape.segments.forEach((segment: any, index: number) => {
            // 繪製控制線（虛線）
            this.drawCtx.setLineDash([4, 4]);
            this.drawCtx.strokeStyle = 'rgba(100, 100, 255, 0.5)';
            this.drawCtx.lineWidth = 1;
            
            // 起點到 CP1 的線
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(segment.start.x, segment.start.y);
            this.drawCtx.lineTo(segment.cp1.x, segment.cp1.y);
            this.drawCtx.stroke();
            
            // 終點到 CP2 的線
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(segment.end.x, segment.end.y);
            this.drawCtx.lineTo(segment.cp2.x, segment.cp2.y);
            this.drawCtx.stroke();
            
            this.drawCtx.setLineDash([]);
            
            // 繪製控制點（藍色方塊）
            this.drawCtx.fillStyle = 'rgba(100, 100, 255, 0.8)';
            this.drawCtx.strokeStyle = 'rgba(50, 50, 200, 1)';
            this.drawCtx.lineWidth = 1;
            
            const cpSize = 8;
            const cpHalf = cpSize / 2;
            
            // CP1
            this.drawCtx.fillRect(segment.cp1.x - cpHalf, segment.cp1.y - cpHalf, cpSize, cpSize);
            this.drawCtx.strokeRect(segment.cp1.x - cpHalf, segment.cp1.y - cpHalf, cpSize, cpSize);
            
            // CP2
            this.drawCtx.fillRect(segment.cp2.x - cpHalf, segment.cp2.y - cpHalf, cpSize, cpSize);
            this.drawCtx.strokeRect(segment.cp2.x - cpHalf, segment.cp2.y - cpHalf, cpSize, cpSize);
            
            // 繪製轉折點（綠色圓形 - 段落的起點和終點）
            this.drawCtx.fillStyle = 'rgba(50, 200, 50, 0.8)';
            this.drawCtx.strokeStyle = 'rgba(20, 150, 20, 1)';
            
            const pointSize = 6;
            
            // 起點（只繪製第一個段落的起點，或連接點）
            if (index === 0 || 
                segment.start.x !== shape.segments[index - 1].end.x || 
                segment.start.y !== shape.segments[index - 1].end.y) {
                this.drawCtx.beginPath();
                this.drawCtx.arc(segment.start.x, segment.start.y, pointSize, 0, Math.PI * 2);
                this.drawCtx.fill();
                this.drawCtx.stroke();
            }
            
            // 終點
            this.drawCtx.beginPath();
            this.drawCtx.arc(segment.end.x, segment.end.y, pointSize, 0, Math.PI * 2);
            this.drawCtx.fill();
            this.drawCtx.stroke();
        });
        
        this.drawCtx.restore();
    }

    /**
     * 檢測鼠標是否在貝茲曲線的控制點上
     * 返回 {segmentIndex, type} 或 null
     */
    private getBezierControlAtPosition(x: number, y: number): {segmentIndex: number, type: string} | null {
        if (this.selectedShapeIndex === -1) return null;
        
        const shape = this.shapes[this.selectedShapeIndex];
        if (shape.tool !== 'bezier' || !shape.segments) return null;
        
        const threshold = 8; // 點擊檢測範圍
        
        // 檢查每個段落的控制點
        for (let i = 0; i < shape.segments.length; i++) {
            const segment = shape.segments[i];
            
            // 檢查 CP1
            const distCP1 = Math.sqrt(
                Math.pow(x - segment.cp1.x, 2) + 
                Math.pow(y - segment.cp1.y, 2)
            );
            if (distCP1 <= threshold) {
                return {segmentIndex: i, type: 'cp1'};
            }
            
            // 檢查 CP2
            const distCP2 = Math.sqrt(
                Math.pow(x - segment.cp2.x, 2) + 
                Math.pow(y - segment.cp2.y, 2)
            );
            if (distCP2 <= threshold) {
                return {segmentIndex: i, type: 'cp2'};
            }
            
            // 檢查起點（轉折點）
            const distStart = Math.sqrt(
                Math.pow(x - segment.start.x, 2) + 
                Math.pow(y - segment.start.y, 2)
            );
            if (distStart <= threshold) {
                return {segmentIndex: i, type: 'start'};
            }
            
            // 檢查終點（轉折點）
            const distEnd = Math.sqrt(
                Math.pow(x - segment.end.x, 2) + 
                Math.pow(y - segment.end.y, 2)
            );
            if (distEnd <= threshold) {
                return {segmentIndex: i, type: 'end'};
            }
        }
        
        return null;
    }

    /**
     * 更新貝茲曲線的邊界框
     */
    private updateBezierBounds(shape: any) {
        if (!shape.segments || shape.segments.length === 0) return;
        
        let minX = shape.segments[0].start.x;
        let maxX = minX;
        let minY = shape.segments[0].start.y;
        let maxY = minY;
        
        shape.segments.forEach((seg: any) => {
            [seg.start, seg.cp1, seg.cp2, seg.end].forEach((p: any) => {
                minX = Math.min(minX, p.x);
                maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y);
                maxY = Math.max(maxY, p.y);
            });
        });
        
        shape.startX = minX;
        shape.endX = maxX;
        shape.startY = minY;
        shape.endY = maxY;
    }

    /**
     * 刪除選中的圖形
     */
    deleteSelectedShape() {
        if (this.selectedShapeIndex === -1) {
            return;
        }

        console.log('[Graphics Editor] 刪除圖形', this.selectedShapeIndex + 1);
        
        // 刪除圖形和對應的命令
        this.shapes.splice(this.selectedShapeIndex, 1);
        this.commands.splice(this.selectedShapeIndex, 1);
        
        // 取消選取
        this.selectedShapeIndex = -1;
        this.panel.$.btnDelete.style.display = 'none';
        
        // 重繪和更新
        this.redraw();
        this.updateCommandList();
        this.updateCodePreview();
    }

    /**
     * 切換圓角輸入模式（統一 vs 個別）
     */
    toggleRadiusInputMode() {
        if (this.useUniformRadius) {
            this.panel.$.uniformRadiusInput.style.display = 'inline-flex';
            this.panel.$.individualRadiusInputs.style.display = 'none';
        } else {
            this.panel.$.uniformRadiusInput.style.display = 'none';
            this.panel.$.individualRadiusInputs.style.display = 'inline-flex';
            // 初始化個別角的值為當前統一值
            this.cornerRadiusTL = this.cornerRadius;
            this.cornerRadiusTR = this.cornerRadius;
            this.cornerRadiusBR = this.cornerRadius;
            this.cornerRadiusBL = this.cornerRadius;
            this.panel.$.cornerRadiusTL.value = String(this.cornerRadiusTL);
            this.panel.$.cornerRadiusTR.value = String(this.cornerRadiusTR);
            this.panel.$.cornerRadiusBR.value = String(this.cornerRadiusBR);
            this.panel.$.cornerRadiusBL.value = String(this.cornerRadiusBL);
        }
    }

    /**
     * 為選中的矩形應用圓角
     */
    applyCornerRadius() {
        if (this.selectedShapeIndex === -1) {
            return;
        }

        const shape = this.shapes[this.selectedShapeIndex];
        if (!shape || shape.tool !== 'rect') {
            console.warn('[Graphics Editor] 只能為矩形應用圓角');
            return;
        }

        if (this.useUniformRadius) {
            // 統一圓角模式
            shape.radius = this.cornerRadius;
            shape.radiusTL = undefined;
            shape.radiusTR = undefined;
            shape.radiusBR = undefined;
            shape.radiusBL = undefined;
            console.log('[Graphics Editor] 已為矩形應用統一圓角半徑:', this.cornerRadius);
        } else {
            // 個別圓角模式
            shape.radius = undefined; // 清除統一半徑
            shape.radiusTL = this.cornerRadiusTL;
            shape.radiusTR = this.cornerRadiusTR;
            shape.radiusBR = this.cornerRadiusBR;
            shape.radiusBL = this.cornerRadiusBL;
            console.log('[Graphics Editor] 已為矩形應用個別圓角半徑:', 
                `TL=${this.cornerRadiusTL}, TR=${this.cornerRadiusTR}, BR=${this.cornerRadiusBR}, BL=${this.cornerRadiusBL}`);
        }

        // 重繪和更新
        this.redraw();
        this.updateCommandList();
        this.updateCodePreview();
    }

    /**
     * 繪製圓角矩形（支援統一圓角）
     */
    private drawRoundedRect(x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
        // 確保 radius 不超過矩形尺寸的一半
        const maxRadius = Math.min(Math.abs(width) / 2, Math.abs(height) / 2);
        const r = Math.min(Math.abs(radius), maxRadius);

        // 處理負寬度/高度的情況
        const actualX = width < 0 ? x + width : x;
        const actualY = height < 0 ? y + height : y;
        const actualWidth = Math.abs(width);
        const actualHeight = Math.abs(height);

        this.drawCtx.beginPath();
        
        // 左上角圓弧起點
        this.drawCtx.moveTo(actualX + r, actualY);
        
        // 上邊線
        this.drawCtx.lineTo(actualX + actualWidth - r, actualY);
        
        // 右上角圓弧
        this.drawCtx.arc(actualX + actualWidth - r, actualY + r, r, -Math.PI / 2, 0, false);
        
        // 右邊線
        this.drawCtx.lineTo(actualX + actualWidth, actualY + actualHeight - r);
        
        // 右下角圓弧
        this.drawCtx.arc(actualX + actualWidth - r, actualY + actualHeight - r, r, 0, Math.PI / 2, false);
        
        // 下邊線
        this.drawCtx.lineTo(actualX + r, actualY + actualHeight);
        
        // 左下角圓弧
        this.drawCtx.arc(actualX + r, actualY + actualHeight - r, r, Math.PI / 2, Math.PI, false);
        
        // 左邊線
        this.drawCtx.lineTo(actualX, actualY + r);
        
        // 左上角圓弧
        this.drawCtx.arc(actualX + r, actualY + r, r, Math.PI, -Math.PI / 2, false);
        
        this.drawCtx.closePath();

        if (fill) {
            this.drawCtx.fill();
        }
        if (stroke) {
            this.drawCtx.stroke();
        }
    }

    /**
     * 繪製個別圓角矩形
     */
    private drawIndividualRoundedRect(x: number, y: number, width: number, height: number, 
        radiusTL: number, radiusTR: number, radiusBR: number, radiusBL: number, 
        fill: boolean, stroke: boolean) {
        
        // 處理負寬度/高度的情況
        const actualX = width < 0 ? x + width : x;
        const actualY = height < 0 ? y + height : y;
        const actualWidth = Math.abs(width);
        const actualHeight = Math.abs(height);

        // 確保每個角的半徑不超過矩形尺寸
        const maxRadius = Math.min(actualWidth / 2, actualHeight / 2);
        const rTL = Math.min(Math.abs(radiusTL), maxRadius);
        const rTR = Math.min(Math.abs(radiusTR), maxRadius);
        const rBR = Math.min(Math.abs(radiusBR), maxRadius);
        const rBL = Math.min(Math.abs(radiusBL), maxRadius);

        this.drawCtx.beginPath();
        
        // 從左上角圓弧起點開始
        this.drawCtx.moveTo(actualX + rTL, actualY);
        
        // 上邊線到右上角
        this.drawCtx.lineTo(actualX + actualWidth - rTR, actualY);
        
        // 右上角圓弧
        if (rTR > 0) {
            this.drawCtx.quadraticCurveTo(actualX + actualWidth, actualY, actualX + actualWidth, actualY + rTR);
        }
        
        // 右邊線到右下角
        this.drawCtx.lineTo(actualX + actualWidth, actualY + actualHeight - rBR);
        
        // 右下角圓弧
        if (rBR > 0) {
            this.drawCtx.quadraticCurveTo(actualX + actualWidth, actualY + actualHeight, actualX + actualWidth - rBR, actualY + actualHeight);
        }
        
        // 下邊線到左下角
        this.drawCtx.lineTo(actualX + rBL, actualY + actualHeight);
        
        // 左下角圓弧
        if (rBL > 0) {
            this.drawCtx.quadraticCurveTo(actualX, actualY + actualHeight, actualX, actualY + actualHeight - rBL);
        }
        
        // 左邊線到左上角
        this.drawCtx.lineTo(actualX, actualY + rTL);
        
        // 左上角圓弧
        if (rTL > 0) {
            this.drawCtx.quadraticCurveTo(actualX, actualY, actualX + rTL, actualY);
        }
        
        this.drawCtx.closePath();

        if (fill) {
            this.drawCtx.fill();
        }
        if (stroke) {
            this.drawCtx.stroke();
        }
    }

    // ==================== 命令相關方法 ====================

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

    updateSyncColorHint() {
        const hint = this.panel.$.syncColorHint;
        if (!hint) return;
        
        if (this.enableGradient) {
            // 漸層模式：填充色由漸層屬性控制，只有描邊色受此選項影響
            hint.innerHTML = `
                ✓ 勾選：描邊顏色使用 Inspector 中 Graphics 組件的 strokeColor（填充使用漸層屬性）<br>
                ✗ 不勾選：描邊顏色使用面板設定的顏色（填充使用漸層屬性）<br>
                <span style="color: #ff9800;">⚠ 漸層模式下，填充顏色由「漸層起始/結束顏色」屬性控制</span>
            `;
        } else {
            // 一般模式：填充色和描邊色都受此選項影響
            hint.innerHTML = `
                ✓ 勾選：運行時使用 Inspector 中 Graphics 組件的 fillColor / strokeColor<br>
                ✗ 不勾選：使用下方面板設定的顏色（固定寫入腳本）
            `;
        }
    }

    generateTypeScriptCode(): string {
        if (this.shapes.length === 0) {
            return '// 請先繪製一些圖形';
        }

        // 若啟用漸層填充，改用漸層版生成器
        if (this.enableGradient) {
            return this.generateGradientTypeScriptCode();
        }

        const syncMode = this.syncInspectorColors;
        
        let code = `import { _decorator, Component, Graphics, Color } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * 使用 Graphics Editor 生成的圖形代碼
 * 坐標系統: ${this.getOriginModeName()}
 * 颜色模式: ${syncMode ? '同步 Inspector 中的 Graphics 组件颜色' : '使用导出时的颜色'}
 * 
 * @executeInEditMode - 在編輯器模式下也會執行，可以在 Scene 視窗中預覽圖形
 */
@ccclass('CustomGraphics')
@executeInEditMode(true)
export class CustomGraphics extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    @property({ tooltip: '同步 Inspector 顏色（fillColor / strokeColor）' })
    syncInspectorColors: boolean = ${syncMode ? 'true' : 'false'};

    private _lastStrokeKey: string = '';
    private _lastFillKey: string = '';
    private _lastSync: boolean = ${syncMode ? 'true' : 'false'};

    onLoad() {
        // 在編輯器和運行時都執行繪製
        this.drawShapes();
        this.cacheColors();
    }

    start() {
        this.drawShapes();
        this.cacheColors();
    }

    update() {
        if (!this.graphics) return;
        // 在編輯器中即時同步 Inspector 顏色或切換模式
        const strokeKey = this.colorKey(this.graphics.strokeColor);
        const fillKey = this.colorKey(this.graphics.fillColor);
        if (this._lastStrokeKey !== strokeKey || this._lastFillKey !== fillKey || this._lastSync !== this.syncInspectorColors) {
            this._lastStrokeKey = strokeKey;
            this._lastFillKey = fillKey;
            this._lastSync = this.syncInspectorColors;
            this.drawShapes();
        }
    }

    private cacheColors() {
        if (!this.graphics) return;
        this._lastStrokeKey = this.colorKey(this.graphics.strokeColor);
        this._lastFillKey = this.colorKey(this.graphics.fillColor);
    }

    private colorKey(c: Color): string {
        return c ? (c.r + ',' + c.g + ',' + c.b + ',' + c.a) : '';
    }

    private drawShapes() {
        if (!this.graphics) {
            console.warn('[CustomGraphics] Graphics component not found');
            return;
        }
        
        const g = this.graphics;
        g.clear();
        
`;

        this.shapes.forEach((shape: any, i: number) => {
            code += `        // 形狀 ${i + 1}: ${this.getShapeName(shape.tool)}\n`;
            code += `        g.lineWidth = ${shape.lineWidth};\n`;
            
            // 🎨 根據屬性決定是否覆蓋 Inspector 顏色
            code += `        if (!this.syncInspectorColors) {\n`;
            if (shape.fillMode) {
                const fillRGB = this.hexToRgb(shape.fillColor);
                const fillAlpha = shape.fillAlpha !== undefined ? shape.fillAlpha : 255;
                code += `            g.fillColor = new Color(${fillRGB.r}, ${fillRGB.g}, ${fillRGB.b}, ${fillAlpha});\n`;
            }
            if (shape.strokeMode) {
                const strokeRGB = this.hexToRgb(shape.strokeColor);
                const strokeAlpha = shape.strokeAlpha !== undefined ? shape.strokeAlpha : 255;
                code += `            g.strokeColor = new Color(${strokeRGB.r}, ${strokeRGB.g}, ${strokeRGB.b}, ${strokeAlpha});\n`;
            }
            code += `        } else {\n`;
            code += `            // 使用 Inspector 中的 fillColor / strokeColor\n`;
            code += `        }\n`;

            switch(shape.tool) {
                case 'rect':
                    // 轉換為 Cocos 坐標系統
                    const cocosStartX = this.canvasToCocosX(shape.startX);
                    const cocosStartY = this.canvasToCocosY(shape.startY);
                    const cocosEndX = this.canvasToCocosX(shape.endX);
                    const cocosEndY = this.canvasToCocosY(shape.endY);
                    const width = cocosEndX - cocosStartX;
                    const height = cocosEndY - cocosStartY;
                    
                    // 🔧 檢查是否有個別圓角半徑
                    if (shape.radiusTL !== undefined || shape.radiusTR !== undefined || 
                        shape.radiusBR !== undefined || shape.radiusBL !== undefined) {
                        // 使用個別圓角
                        const rTL = Math.round(shape.radiusTL || 0);
                        const rTR = Math.round(shape.radiusTR || 0);
                        const rBR = Math.round(shape.radiusBR || 0);
                        const rBL = Math.round(shape.radiusBL || 0);
                        
                        // 計算實際坐標（處理負寬高）
                        const actualX = Math.min(cocosStartX, cocosEndX);
                        const actualY = Math.min(cocosStartY, cocosEndY);
                        const actualW = Math.abs(width);
                        const actualH = Math.abs(height);
                        
                        code += `        // 個別圓角矩形 (TL=${rTL}, TR=${rTR}, BR=${rBR}, BL=${rBL})\n`;
                        code += `        const x = ${actualX}, y = ${actualY};\n`;
                        code += `        const w = ${actualW}, h = ${actualH};\n`;
                        code += `        const rTL = ${rTL}, rTR = ${rTR}, rBR = ${rBR}, rBL = ${rBL};\n`;
                        code += `        g.moveTo(x + rTL, y);\n`;
                        code += `        g.lineTo(x + w - rTR, y);\n`;
                        code += `        if (rTR > 0) g.quadraticCurveTo(x + w, y, x + w, y + rTR);\n`;
                        code += `        g.lineTo(x + w, y + h - rBR);\n`;
                        code += `        if (rBR > 0) g.quadraticCurveTo(x + w, y + h, x + w - rBR, y + h);\n`;
                        code += `        g.lineTo(x + rBL, y + h);\n`;
                        code += `        if (rBL > 0) g.quadraticCurveTo(x, y + h, x, y + h - rBL);\n`;
                        code += `        g.lineTo(x, y + rTL);\n`;
                        code += `        if (rTL > 0) g.quadraticCurveTo(x, y, x + rTL, y);\n`;
                        code += `        g.close();\n`;
                    } else if (shape.radius && shape.radius > 0) {
                        // 使用統一圓角
                        const radius = Math.round(shape.radius);
                        code += `        g.roundRect(${cocosStartX}, ${cocosStartY}, ${width}, ${height}, ${radius});\n`;
                    } else {
                        // 使用普通矩形
                        code += `        g.rect(${cocosStartX}, ${cocosStartY}, ${width}, ${height});\n`;
                    }
                    
                    if (shape.fillMode) code += `        g.fill();\n`;
                    if (shape.strokeMode) code += `        g.stroke();\n`;
                    break;
                case 'circle':
                    const circleCocosX = this.canvasToCocosX(shape.startX);
                    const circleCocosY = this.canvasToCocosY(shape.startY);
                    const circleCocosEndX = this.canvasToCocosX(shape.endX);
                    const circleCocosEndY = this.canvasToCocosY(shape.endY);
                    const circleRadius = Math.round(Math.sqrt(Math.pow(circleCocosEndX - circleCocosX, 2) + Math.pow(circleCocosEndY - circleCocosY, 2)));
                    code += `        g.circle(${circleCocosX}, ${circleCocosY}, ${circleRadius});\n`;
                    if (shape.fillMode) code += `        g.fill();\n`;
                    if (shape.strokeMode) code += `        g.stroke();\n`;
                    break;
                case 'line':
                    const lineStartCocosX = this.canvasToCocosX(shape.startX);
                    const lineStartCocosY = this.canvasToCocosY(shape.startY);
                    const lineEndCocosX = this.canvasToCocosX(shape.endX);
                    const lineEndCocosY = this.canvasToCocosY(shape.endY);
                    code += `        g.moveTo(${lineStartCocosX}, ${lineStartCocosY});\n`;
                    code += `        g.lineTo(${lineEndCocosX}, ${lineEndCocosY});\n`;
                    code += `        g.stroke();\n`;

                    break;
                case 'polyline':
                    if (shape.points && shape.points.length > 0) {
                        const firstPoint = shape.points[0];
                        const firstCocosX = this.canvasToCocosX(firstPoint.x);
                        const firstCocosY = this.canvasToCocosY(firstPoint.y);
                        code += `        g.moveTo(${firstCocosX}, ${firstCocosY});\n`;
                        
                        for (let j = 1; j < shape.points.length; j++) {
                            const point = shape.points[j];
                            const ptCocosX = this.canvasToCocosX(point.x);
                            const ptCocosY = this.canvasToCocosY(point.y);
                            code += `        g.lineTo(${ptCocosX}, ${ptCocosY});\n`;
                        }
                        
                        // 如果是閉合的折線，返回起點
                        if (shape.isClosed) {
                            code += `        g.lineTo(${firstCocosX}, ${firstCocosY});\n`;
                        }
                        
                        if (shape.strokeMode) code += `        g.stroke();\n`;
                        if (shape.fillMode && shape.isClosed) code += `        g.fill();\n`;
                    }
                    break;
                case 'bezier':
                    if (shape.segments && shape.segments.length > 0) {
                        const firstSeg = shape.segments[0];
                        const firstStartCocosX = this.canvasToCocosX(firstSeg.start.x);
                        const firstStartCocosY = this.canvasToCocosY(firstSeg.start.y);
                        code += `        g.moveTo(${firstStartCocosX}, ${firstStartCocosY});\n`;
                        
                        for (const segment of shape.segments) {
                            const cp1CocosX = this.canvasToCocosX(segment.cp1.x);
                            const cp1CocosY = this.canvasToCocosY(segment.cp1.y);
                            const cp2CocosX = this.canvasToCocosX(segment.cp2.x);
                            const cp2CocosY = this.canvasToCocosY(segment.cp2.y);
                            const endCocosX = this.canvasToCocosX(segment.end.x);
                            const endCocosY = this.canvasToCocosY(segment.end.y);
                            code += `        g.bezierCurveTo(${cp1CocosX}, ${cp1CocosY}, ${cp2CocosX}, ${cp2CocosY}, ${endCocosX}, ${endCocosY});\n`;
                        }
                        
                        // 如果是閉合的貝茲曲線，返回起點
                        if (shape.isClosed) {
                            code += `        g.lineTo(${firstStartCocosX}, ${firstStartCocosY});\n`;
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

    // 生成支援漸層填充的 TypeScript 腳本（使用 Mask + 子節點 Graphics 直條近似線性漸層）
    generateGradientTypeScriptCode(): string {
        const syncMode = this.syncInspectorColors;
        const startRGB = this.hexToRgb(this.gradientStartColor);
        const endRGB = this.hexToRgb(this.gradientEndColor);
        const angle = this.gradientAngle;
        const steps = this.gradientSteps;

        let code = `import { _decorator, Component, Graphics, Color, Node, Mask } from 'cc';\n`;
        code += `const { ccclass, property, executeInEditMode } = _decorator;\n\n`;
        code += `/**\n * 使用 Graphics Editor 生成的圖形代碼（漸層填充版）\n * 坐標系統: ${this.getOriginModeName()}\n * 颜色模式: ${syncMode ? '同步 Inspector 顏色（僅描邊）' : '使用導出時顏色'}\n *\n * 原理：\n * - 本節點：Graphics 作為 Mask（GRAPHICS_STENCIL），繪製圖形輪廓並 fill() 形成遮罩\n * - 子節點：Graphics 畫多條直條矩形以近似線性漸層，並旋轉子節點配合角度，顏色取漸層\n * - 描邊：於父節點以另一個 Graphics 疊加描邊（避免與遮罩共用）\n */\n`;
        code += `@ccclass('CustomGraphics')\n@executeInEditMode(true)\n`;
        code += `export class CustomGraphics extends Component {\n`;
        code += `  @property(Graphics) graphics: Graphics = null;\n`;
        code += `  @property({ tooltip: '同步 Inspector 顏色（僅描邊適用）' }) syncInspectorColors: boolean = ${syncMode ? 'true' : 'false'};\n`;
        code += `  @property({ tooltip: '（可選）用於描邊的 Graphics，避免與遮罩共用' }) strokeGraphics: Graphics = null;\n`;
        code += `  @property({ tooltip: '漸層起始顏色' }) gradientStart: Color = new Color(${startRGB.r}, ${startRGB.g}, ${startRGB.b}, 255);\n`;
        code += `  @property({ tooltip: '漸層結束顏色' }) gradientEnd: Color = new Color(${endRGB.r}, ${endRGB.g}, ${endRGB.b}, 255);\n`;
        code += `  @property({ tooltip: '漸層角度（度數，0=左→右）' }) gradientAngle: number = ${angle};\n`;
        code += `  @property({ tooltip: '漸層細分步數（越大越平滑）' }) gradientSteps: number = ${steps};\n`;
        code += `\n  onLoad() { this.drawShapes(); }\n  start() { this.drawShapes(); }\n  update() { this.drawShapes(); }\n`;
        code += `\n  private lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }\n`;
        code += `\n  private drawShapes() {\n`;
        code += `    const g = this.graphics; if (!g) { console.warn('[CustomGraphics] Graphics not found'); return; }\n`;
        code += `    g.clear();\n`;
        code += `    let mask = this.node.getComponent(Mask); if (!mask) mask = this.node.addComponent(Mask); mask.type = Mask.Type.GRAPHICS_STENCIL;\n`;
        code += `    // 先繪製遮罩形狀（填充為白色）\n`;
        code += `    g.fillColor = new Color(255, 255, 255, 255);\n`;

        // 生成圖形路徑並記錄邊界
        code += `    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;\n`;
        this.shapes.forEach((shape: any, i: number) => {
            const sx = shape.startX;
            const sy = shape.startY;
            const ex = shape.endX;
            const ey = shape.endY;
            code += `    // 形狀 ${i + 1}: ${this.getShapeName(shape.tool)}\n`;
            code += `    g.lineWidth = ${shape.lineWidth};\n`;
            if (shape.tool === 'rect') {
                const w = ex - sx; const h = ey - sy;
                const x0 = Math.min(sx, sx + w); const y0 = Math.min(sy, sy + h);
                const x1 = Math.max(sx, sx + w); const y1 = Math.max(sy, sy + h);
                
                if (shape.radiusTL !== undefined || shape.radiusTR !== undefined || 
                    shape.radiusBR !== undefined || shape.radiusBL !== undefined) {
                    // 個別圓角矩形
                    const rTL = Math.round(shape.radiusTL || 0);
                    const rTR = Math.round(shape.radiusTR || 0);
                    const rBR = Math.round(shape.radiusBR || 0);
                    const rBL = Math.round(shape.radiusBL || 0);
                    const actualW = Math.abs(w);
                    const actualH = Math.abs(h);
                    
                    code += `    // 個別圓角矩形 (TL=${rTL}, TR=${rTR}, BR=${rBR}, BL=${rBL})\n`;
                    code += `    const x = ${x0}, y = ${y0}, w = ${actualW}, h = ${actualH};\n`;
                    code += `    const rTL = ${rTL}, rTR = ${rTR}, rBR = ${rBR}, rBL = ${rBL};\n`;
                    code += `    g.moveTo(x + rTL, y);\n`;
                    code += `    g.lineTo(x + w - rTR, y);\n`;
                    code += `    if (rTR > 0) g.quadraticCurveTo(x + w, y, x + w, y + rTR);\n`;
                    code += `    g.lineTo(x + w, y + h - rBR);\n`;
                    code += `    if (rBR > 0) g.quadraticCurveTo(x + w, y + h, x + w - rBR, y + h);\n`;
                    code += `    g.lineTo(x + rBL, y + h);\n`;
                    code += `    if (rBL > 0) g.quadraticCurveTo(x, y + h, x, y + h - rBL);\n`;
                    code += `    g.lineTo(x, y + rTL);\n`;
                    code += `    if (rTL > 0) g.quadraticCurveTo(x, y, x + rTL, y);\n`;
                    code += `    g.close();\n`;
                } else if (shape.radius && shape.radius > 0) {
                    const r = Math.round(shape.radius);
                    code += `    g.roundRect(${sx}, ${sy}, ${w}, ${h}, ${r});\n`;
                } else {
                    code += `    g.rect(${sx}, ${sy}, ${w}, ${h});\n`;
                }
                
                if (shape.fillMode) code += `    g.fill();\n`;
                if (shape.strokeMode) code += `    /* stroke overlay later */\n`;
                code += `    minX = Math.min(minX, ${x0}); minY = Math.min(minY, ${y0}); maxX = Math.max(maxX, ${x1}); maxY = Math.max(maxY, ${y1});\n`;
            } else if (shape.tool === 'circle') {
                const r = Math.round(Math.hypot(ex - sx, ey - sy));
                code += `    g.circle(${sx}, ${sy}, ${r}); if (${shape.fillMode ? 'true' : 'false'}) g.fill();\n`;
                code += `    minX = Math.min(minX, ${sx} - ${r}); minY = Math.min(minY, ${sy} - ${r}); maxX = Math.max(maxX, ${sx} + ${r}); maxY = Math.max(maxY, ${sy} + ${r});\n`;
            } else if (shape.tool === 'line') {
                code += `    g.moveTo(${sx}, ${sy}); g.lineTo(${ex}, ${ey});\n`;
                code += `    // 線條不參與填充邊界（仍計入描邊邊界）\n`;
                code += `    minX = Math.min(minX, ${sx}, ${ex}); minY = Math.min(minY, ${sy}, ${ey}); maxX = Math.max(maxX, ${sx}, ${ex}); maxY = Math.max(maxY, ${sy}, ${ey});\n`;
            } else if (shape.tool === 'polyline') {
                if (shape.points && shape.points.length > 0) {
                    const first = shape.points[0];
                    code += `    g.moveTo(${first.x}, ${first.y});\n`;
                    shape.points.slice(1).forEach((p: any) => {
                        code += `    g.lineTo(${p.x}, ${p.y});\n`;
                    });
                    if (shape.isClosed && shape.fillMode) {
                        code += `    g.lineTo(${first.x}, ${first.y}); g.fill();\n`;
                    }
                    // 更新邊界
                    shape.points.forEach((p: any) => {
                        code += `    minX = Math.min(minX, ${p.x}); minY = Math.min(minY, ${p.y}); maxX = Math.max(maxX, ${p.x}); maxY = Math.max(maxY, ${p.y});\n`;
                    });
                }
            } else if (shape.tool === 'bezier') {
                if (shape.segments && shape.segments.length > 0) {
                    const firstSeg = shape.segments[0];
                    code += `    g.moveTo(${firstSeg.start.x}, ${firstSeg.start.y});\n`;
                    shape.segments.forEach((seg: any) => {
                        code += `    g.bezierCurveTo(${seg.cp1.x}, ${seg.cp1.y}, ${seg.cp2.x}, ${seg.cp2.y}, ${seg.end.x}, ${seg.end.y});\n`;
                        [seg.start, seg.cp1, seg.cp2, seg.end].forEach((pt: any) => {
                            code += `    minX = Math.min(minX, ${pt.x}); minY = Math.min(minY, ${pt.y}); maxX = Math.max(maxX, ${pt.x}); maxY = Math.max(maxY, ${pt.y});\n`;
                        });
                    });
                    // 若該貝茲曲線需要填充且閉合，補回起點並填充
                    if (shape.isClosed && shape.fillMode) {
                        code += `    g.lineTo(${firstSeg.start.x}, ${firstSeg.start.y}); g.fill();\n`;
                    }
                }
            }
        });

        // 建立或更新漸層層
        code += `    let gradientNode = this.node.getChildByName('GradientFill');\n`;
        code += `    if (!gradientNode) { gradientNode = new Node('GradientFill'); this.node.addChild(gradientNode); }\n`;
        code += `    let gradG = gradientNode.getComponent(Graphics); if (!gradG) gradG = gradientNode.addComponent(Graphics);\n`;
        code += `    gradG.clear();\n`;
        code += `    const cx = (minX + maxX) / 2; const cy = (minY + maxY) / 2;\n`;
        code += `    gradientNode.setPosition(cx, cy); gradientNode.angle = this.gradientAngle;\n`;
        code += `    const bw = Math.max(1, (maxX - minX)); const bh = Math.max(1, (maxY - minY));\n`;
        code += `    const L = Math.sqrt(bw * bw + bh * bh) * 2; const n = Math.max(2, Math.floor(this.gradientSteps)); const stripW = L / n;\n`;
        code += `    for (let i = 0; i < n; i++) { const t = i / (n - 1); const r = Math.round(this.lerp(this.gradientStart.r, this.gradientEnd.r, t)); const g2 = Math.round(this.lerp(this.gradientStart.g, this.gradientEnd.g, t)); const b = Math.round(this.lerp(this.gradientStart.b, this.gradientEnd.b, t)); gradG.fillColor = new Color(r, g2, b, 255); const x = -L / 2 + i * stripW; gradG.rect(x, -L / 2, stripW + 0.5, L); gradG.fill(); }\n`;

        // 描邊覆蓋層
        if (this.shapes.some((s: any) => s.strokeMode)) {
            code += `    if (!this.strokeGraphics) this.strokeGraphics = this.node.addComponent(Graphics); const s = this.strokeGraphics; s.clear();\n`;
            this.shapes.forEach((shape: any) => {
                const sx = this.canvasToCocosX(shape.startX);
                const sy = this.canvasToCocosY(shape.startY);
                const ex = this.canvasToCocosX(shape.endX);
                const ey = this.canvasToCocosY(shape.endY);
                code += `    s.lineWidth = ${shape.lineWidth};\n`;
                code += `    if (!this.syncInspectorColors) {\n`;
                if (shape.strokeMode) {
                    const sRGB = this.hexToRgb(shape.strokeColor);
                    const sA = shape.strokeAlpha !== undefined ? shape.strokeAlpha : 255;
                    code += `      s.strokeColor = new Color(${sRGB.r}, ${sRGB.g}, ${sRGB.b}, ${sA});\n`;
                }
                code += `    }\n`;
                if (shape.tool === 'rect') {
                    const w = ex - sx; const h = ey - sy;
                    if (shape.strokeMode) {
                        if (shape.radius && shape.radius > 0) {
                            const r = Math.round(shape.radius);
                            code += `    s.roundRect(${sx}, ${sy}, ${w}, ${h}, ${r}); s.stroke();\n`;
                        } else {
                            code += `    s.rect(${sx}, ${sy}, ${w}, ${h}); s.stroke();\n`;
                        }
                    }
                } else if (shape.tool === 'circle') {
                    const r = Math.round(Math.hypot(ex - sx, ey - sy)); if (shape.strokeMode) code += `    s.circle(${sx}, ${sy}, ${r}); s.stroke();\n`;
                } else if (shape.tool === 'line') {
                    code += `    s.moveTo(${sx}, ${sy}); s.lineTo(${ex}, ${ey}); s.stroke();\n`;
                } else if (shape.tool === 'polyline') {
                    if (shape.points && shape.points.length > 0 && shape.strokeMode) {
                        const first = shape.points[0]; const fx = this.canvasToCocosX(first.x); const fy = this.canvasToCocosY(first.y);
                        code += `    s.moveTo(${fx}, ${fy});\n`;
                        shape.points.slice(1).forEach((p: any) => { const px = this.canvasToCocosX(p.x); const py = this.canvasToCocosY(p.y); code += `    s.lineTo(${px}, ${py});\n`; });
                        code += `    s.stroke();\n`;
                    }
                } else if (shape.tool === 'bezier') {
                    if (shape.segments && shape.segments.length > 0 && shape.strokeMode) {
                        const firstSeg = shape.segments[0]; const fx = this.canvasToCocosX(firstSeg.start.x); const fy = this.canvasToCocosY(firstSeg.start.y);
                        code += `    s.moveTo(${fx}, ${fy});\n`;
                        shape.segments.forEach((seg: any) => { const cp1x = this.canvasToCocosX(seg.cp1.x); const cp1y = this.canvasToCocosY(seg.cp1.y); const cp2x = this.canvasToCocosX(seg.cp2.x); const cp2y = this.canvasToCocosY(seg.cp2.y); const ex2 = this.canvasToCocosX(seg.end.x); const ey2 = this.canvasToCocosY(seg.end.y); code += `    s.bezierCurveTo(${cp1x}, ${cp1y}, ${cp2x}, ${cp2y}, ${ex2}, ${ey2});\n`; });
                        code += `    s.stroke();\n`;
                    }
                }
            });
        }

        code += `  }\n}\n`;

        return code;
    }

    generateMaskTypeScriptCode(): string {
        if (this.shapes.length === 0) {
            return '// 請先繪製一些圖形';
        }

        let code = `import { _decorator, Component, Graphics, Mask } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

/**
 * Graphics Editor 生成的 Mask（遮罩）代碼
 * 坐標系統: ${this.getOriginModeName()}
 * 
 * 使用說明：
 * 1. 將此腳本掛載到節點上
 * 2. 添加 Graphics 組件
 * 3. 添加 Mask 組件（Type: GRAPHICS_STENCIL）
 * 4. 在 Mask 節點下添加子節點作為被遮罩的內容
 * 
 * @executeInEditMode - 在編輯器模式下也會執行，可以在 Scene 視窗中預覽遮罩形狀
 */
@ccclass('CustomMask')
@executeInEditMode(true)
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
    
    onLoad() {
        // 在編輯器和運行時都執行初始化
        this.initComponents();
        this.drawMaskShape();
    }
    
    start() {
        // 自動獲取組件
        this.initComponents();
        
        // 繪製遮罩
        this.drawMaskShape();
    }
    
    /**
     * 初始化組件引用
     */
    private initComponents() {
        if (!this.graphics) {
            this.graphics = this.getComponent(Graphics);
        }
        
        if (!this.mask) {
            this.mask = this.getComponent(Mask);
        }
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
                    
                    // 🔧 检查是否有圆角半径
                    if (shape.radius && shape.radius > 0) {
                        // 使用 roundRect 绘制圆角矩形
                        const radius = Math.round(shape.radius);
                        code += `        g.roundRect(${cocosStartX}, ${cocosStartY}, ${width}, ${height}, ${radius});\n`;
                    } else {
                        // 使用普通 rect 绘制矩形
                        code += `        g.rect(${cocosStartX}, ${cocosStartY}, ${width}, ${height});\n`;
                    }
                    
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
            'polyline': '折線',
            'bezier': '貝茲曲線'
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
        this.polylineHistory = [];
        this.polylineHistoryIndex = -1;
        this.polylinePreviewX = 0;
        this.polylinePreviewY = 0;
        this.panel.$.btnClosePolyline.style.display = 'block';
        this.panel.$.btnPolylineUndo.style.display = 'block';
        this.panel.$.btnPolylineRedo.style.display = 'block';
        this.updatePolylineButtons();
        console.log('[Graphics Editor] 開始繪製折線，單擊添加點，按住 Shift 畫水平/垂直線，Enter 鍵完成，Ctrl+Z/Y 撤銷/重做');
    }

    addPolylinePoint(x: number, y: number) {
        this.polylinePoints.push({x, y});
        
        // 保存到歷史記錄
        // 如果當前不在歷史末尾，移除後續歷史
        if (this.polylineHistoryIndex < this.polylineHistory.length - 1) {
            this.polylineHistory = this.polylineHistory.slice(0, this.polylineHistoryIndex + 1);
        }
        
        // 深拷貝當前點數組
        this.polylineHistory.push(JSON.parse(JSON.stringify(this.polylinePoints)));
        this.polylineHistoryIndex++;
        
        this.updatePolylineButtons();
        this.redraw();
        this.drawPolylinePreview();
    }
    
    polylineUndo() {
        if (!this.isDrawingPolyline) return;
        
        if (this.polylineHistoryIndex > 0) {
            this.polylineHistoryIndex--;
            this.polylinePoints = JSON.parse(JSON.stringify(this.polylineHistory[this.polylineHistoryIndex]));
            this.updatePolylineButtons();
            this.redraw();
            this.drawPolylinePreview();
            console.log('[Graphics Editor] 折線撤銷，當前點數:', this.polylinePoints.length);
        } else if (this.polylineHistoryIndex === 0) {
            // 回到起始狀態（空）
            this.polylineHistoryIndex = -1;
            this.polylinePoints = [];
            this.updatePolylineButtons();
            this.redraw();
            console.log('[Graphics Editor] 折線撤銷到起始狀態');
        }
    }
    
    polylineRedo() {
        if (!this.isDrawingPolyline) return;
        
        if (this.polylineHistoryIndex < this.polylineHistory.length - 1) {
            this.polylineHistoryIndex++;
            this.polylinePoints = JSON.parse(JSON.stringify(this.polylineHistory[this.polylineHistoryIndex]));
            this.updatePolylineButtons();
            this.redraw();
            this.drawPolylinePreview();
            console.log('[Graphics Editor] 折線重做，當前點數:', this.polylinePoints.length);
        }
    }
    
    updatePolylineButtons() {
        if (!this.isDrawingPolyline) return;
        
        // 更新撤銷按鈕狀態
        if (this.polylineHistoryIndex >= 0) {
            this.panel.$.btnPolylineUndo.removeAttribute('disabled');
        } else {
            this.panel.$.btnPolylineUndo.setAttribute('disabled', '');
        }
        
        // 更新重做按鈕狀態
        if (this.polylineHistoryIndex < this.polylineHistory.length - 1) {
            this.panel.$.btnPolylineRedo.removeAttribute('disabled');
        } else {
            this.panel.$.btnPolylineRedo.setAttribute('disabled', '');
        }
        
        // 更新完成按鈕狀態（至少需要2個點）
        if (this.polylinePoints.length >= 2) {
            this.panel.$.btnClosePolyline.removeAttribute('disabled');
        } else {
            this.panel.$.btnClosePolyline.setAttribute('disabled', '');
        }
    }

    drawPolylinePreview() {
        if (this.polylinePoints.length < 1) return;
        
        // 應用透明度
        this.drawCtx.strokeStyle = this.getRgbaColor(this.strokeColor, this.strokeAlpha);
        this.drawCtx.lineWidth = this.lineWidth;
        this.drawCtx.fillStyle = this.getRgbaColor(this.fillColor, this.fillAlpha);

        // 繪製已確定的折線
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

        // 繪製預覽線（從最後一個點到鼠標位置）
        if (this.polylinePoints.length > 0 && (this.polylinePreviewX !== 0 || this.polylinePreviewY !== 0)) {
            const lastPoint = this.polylinePoints[this.polylinePoints.length - 1];
            
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(lastPoint.x, lastPoint.y);
            this.drawCtx.lineTo(this.polylinePreviewX, this.polylinePreviewY);
            
            // 使用虛線繪製預覽線
            this.drawCtx.setLineDash([5, 5]);
            this.drawCtx.strokeStyle = 'rgba(255, 165, 0, 0.8)'; // 橙色預覽線
            this.drawCtx.stroke();
            this.drawCtx.setLineDash([]); // 重置虛線
        }

        // 繪製已確定的關鍵點
        this.drawCtx.fillStyle = 'rgba(0, 0, 255, 0.7)';
        for (const point of this.polylinePoints) {
            this.drawCtx.beginPath();
            this.drawCtx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            this.drawCtx.fill();
        }
        
        // 繪製預覽點（當前鼠標位置）
        if (this.polylinePreviewX !== 0 || this.polylinePreviewY !== 0) {
            this.drawCtx.fillStyle = 'rgba(255, 165, 0, 0.7)'; // 橙色預覽點
            this.drawCtx.beginPath();
            this.drawCtx.arc(this.polylinePreviewX, this.polylinePreviewY, 4, 0, Math.PI * 2);
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
        this.polylineHistory = [];
        this.polylineHistoryIndex = -1;
        this.polylinePreviewX = 0;
        this.polylinePreviewY = 0;
        this.panel.$.btnClosePolyline.style.display = 'none';
        this.panel.$.btnPolylineUndo.style.display = 'none';
        this.panel.$.btnPolylineRedo.style.display = 'none';
        
        console.log('[Graphics Editor] 折線已完成，包含', shape.points.length, '個點');
    }

    addPolylineCommand(shape: any) {
        let commandText = 'g.moveTo(';
        const pointsStr = shape.points.map((p: any) => `(${Math.round(p.x)}, ${Math.round(p.y)})`).join(' → ');
        commandText = `折線: ${pointsStr} [${shape.points.length}個點]`;
        
        this.commands.push(commandText);
        this.updateCommandList();
    }

    // ==================== 貝茲曲線相關方法 ====================

    startBezier() {
        this.isDrawingBezier = true;
        this.bezierSegments = [];
        this.bezierCurrentPoint = null;
        this.bezierCP1 = null;
        this.bezierCP2 = null;
        this.bezierClickCount = 0;
        this.isEditingBezierDrawingCP = false;
        this.editingDrawingCP = null;
        console.log('[Graphics Editor] 開始繪製貝茲曲線');
        console.log('[操作指南]');
        console.log('  1. 第1次點擊：設置曲線起點');
        console.log('  2. 第2次點擊：設置控制點1（可拖動調整）');
        console.log('  3. 第3次點擊：設置控制點2（可拖動調整）');
        console.log('  4. 第4次點擊：設置終點（自動成為下一段的起點）');
        console.log('  5. 重複 2-4 步以添加更多段落');
        console.log('  6. 按 Enter 鍵完成並閉合曲線');
        console.log('  7. 按 Esc 鍵取消當前繪製');
    }

    addBezierPoint(x: number, y: number) {
        const snapX = this.snapToPixel ? Math.round(x) : x;
        const snapY = this.snapToPixel ? Math.round(y) : y;

        switch (this.bezierClickCount) {
            case 0: // 起點
                this.bezierCurrentPoint = {x: snapX, y: snapY};
                this.bezierClickCount = 1;
                console.log(`[貝茲曲線] 起點: (${snapX}, ${snapY})`);
                break;
            
            case 1: // 控制點1
                this.bezierCP1 = {x: snapX, y: snapY};
                this.bezierClickCount = 2;
                console.log(`[貝茲曲線] 控制點1: (${snapX}, ${snapY})`);
                break;
            
            case 2: // 控制點2
                this.bezierCP2 = {x: snapX, y: snapY};
                this.bezierClickCount = 3;
                console.log(`[貝茲曲線] 控制點2: (${snapX}, ${snapY})`);
                break;
            
            case 3: // 終點，完成一段曲線
                const endPoint = {x: snapX, y: snapY};
                console.log(`[貝茲曲線] 終點: (${snapX}, ${snapY})`);
                
                // 保存這段貝茲曲線
                this.bezierSegments.push({
                    start: this.bezierCurrentPoint!,
                    cp1: this.bezierCP1!,
                    cp2: this.bezierCP2!,
                    end: endPoint
                });
                
                console.log(`[貝茲曲線] 第 ${this.bezierSegments.length} 段完成`);
                console.log('[提示] 可以繼續點擊 CP1、CP2、終點 來添加下一段曲線，或按 Enter 完成');
                
                // 自動為下一段設置起點為當前終點
                this.bezierCurrentPoint = endPoint;
                this.bezierCP1 = null;
                this.bezierCP2 = null;
                this.bezierClickCount = 1; // 重置為控制點1
                break;
        }
        
        this.redraw();
        this.drawBezierPreview();
    }

    bezierUndoPoint() {
        if (!this.isDrawingBezier) return;

        // 根据当前的点击计数，退回到上一个状态
        switch (this.bezierClickCount) {
            case 0: // 还没开始，不能退回
                console.log('[貝茲曲線] 沒有可以退回的點');
                break;
            
            case 1: // 已有起点，退回则删除整个起点，回到状态0
                if (this.bezierSegments.length > 0) {
                    // 如果有之前的段落，退回到上一段的终点
                    const lastSeg = this.bezierSegments[this.bezierSegments.length - 1];
                    this.bezierCurrentPoint = {x: lastSeg.end.x, y: lastSeg.end.y};
                    console.log('[貝茲曲線] 取消當前起點，回到上一段終點');
                } else {
                    // 如果没有段落，清除起点
                    this.bezierCurrentPoint = null;
                    this.bezierClickCount = 0;
                    console.log('[貝茲曲線] 取消起點');
                }
                break;
            
            case 2: // 已有起点和CP1，退回到只有起点
                this.bezierCP1 = null;
                this.bezierClickCount = 1;
                console.log('[貝茲曲線] 退回控制點1');
                break;
            
            case 3: // 已有起点、CP1和CP2，退回到只有起点和CP1
                this.bezierCP2 = null;
                this.bezierClickCount = 2;
                console.log('[貝茲曲線] 退回控制點2');
                break;
        }
        
        this.redraw();
        this.drawBezierPreview();
    }

    drawBezierPreview() {
        if (!this.isDrawingBezier) return;

        this.drawCtx.strokeStyle = 'rgba(255, 165, 0, 0.8)'; // 橙色預覽
        this.drawCtx.fillStyle = 'rgba(255, 165, 0, 0.5)';
        this.drawCtx.lineWidth = 1;
        this.drawCtx.setLineDash([5, 5]);

        // 繪製已完成的段落
        this.bezierSegments.forEach(segment => {
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(segment.start.x, segment.start.y);
            this.drawCtx.bezierCurveTo(
                segment.cp1.x, segment.cp1.y,
                segment.cp2.x, segment.cp2.y,
                segment.end.x, segment.end.y
            );
            this.drawCtx.stroke();
            
            // 繪製已完成段落的控制點和控制線
            this.drawCtx.setLineDash([2, 2]);
            this.drawCtx.strokeStyle = 'rgba(100, 100, 255, 0.5)';
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(segment.start.x, segment.start.y);
            this.drawCtx.lineTo(segment.cp1.x, segment.cp1.y);
            this.drawCtx.moveTo(segment.end.x, segment.end.y);
            this.drawCtx.lineTo(segment.cp2.x, segment.cp2.y);
            this.drawCtx.stroke();
            
            // 繪製已完成段落的控制點
            this.drawCtx.fillStyle = 'rgba(100, 100, 255, 0.7)';
            this.drawCtx.fillRect(segment.cp1.x - 4, segment.cp1.y - 4, 8, 8);
            this.drawCtx.fillRect(segment.cp2.x - 4, segment.cp2.y - 4, 8, 8);
            
            // 繪製已完成段落的轉折點
            this.drawCtx.fillStyle = 'rgba(0, 200, 0, 0.7)';
            this.drawCtx.beginPath();
            this.drawCtx.arc(segment.end.x, segment.end.y, 5, 0, Math.PI * 2);
            this.drawCtx.fill();
            
            this.drawCtx.setLineDash([5, 5]);
            this.drawCtx.strokeStyle = 'rgba(255, 165, 0, 0.8)';
        });

        // 繪製當前正在編輯的段落
        if (this.bezierCurrentPoint) {
            // 繪製起點
            this.drawCtx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            this.drawCtx.fillRect(this.bezierCurrentPoint.x - 5, this.bezierCurrentPoint.y - 5, 10, 10);
            this.drawCtx.strokeStyle = 'rgba(0, 150, 0, 1)';
            this.drawCtx.lineWidth = 2;
            this.drawCtx.strokeRect(this.bezierCurrentPoint.x - 5, this.bezierCurrentPoint.y - 5, 10, 10);
        }
        
        if (this.bezierCP1) {
            // 繪製 CP1
            this.drawCtx.fillStyle = 'rgba(100, 100, 255, 0.8)';
            this.drawCtx.fillRect(this.bezierCP1.x - 5, this.bezierCP1.y - 5, 10, 10);
            
            // 繪製从起点到 CP1 的控制线
            this.drawCtx.setLineDash([3, 3]);
            this.drawCtx.strokeStyle = 'rgba(100, 100, 255, 0.6)';
            this.drawCtx.lineWidth = 1;
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(this.bezierCurrentPoint!.x, this.bezierCurrentPoint!.y);
            this.drawCtx.lineTo(this.bezierCP1.x, this.bezierCP1.y);
            this.drawCtx.stroke();
            
            // 提示信息
            this.drawCtx.fillStyle = 'rgba(255, 165, 0, 0.9)';
            this.drawCtx.font = '11px monospace';
            this.drawCtx.fillText('CP1 (可拖動)', this.bezierCP1.x + 8, this.bezierCP1.y);
            
            this.drawCtx.setLineDash([5, 5]);
        }
        
        if (this.bezierCP2) {
            // 繪製 CP2
            this.drawCtx.fillStyle = 'rgba(100, 100, 255, 0.8)';
            this.drawCtx.fillRect(this.bezierCP2.x - 5, this.bezierCP2.y - 5, 10, 10);
            
            // 繪製到預覽終點的控制線
            if (this.bezierClickCount === 3) {
                this.drawCtx.setLineDash([3, 3]);
                this.drawCtx.strokeStyle = 'rgba(100, 100, 255, 0.6)';
                this.drawCtx.lineWidth = 1;
                this.drawCtx.beginPath();
                this.drawCtx.moveTo(this.bezierPreviewX, this.bezierPreviewY);
                this.drawCtx.lineTo(this.bezierCP2.x, this.bezierCP2.y);
                this.drawCtx.stroke();
                this.drawCtx.setLineDash([5, 5]);
            }
            
            // 提示信息
            this.drawCtx.fillStyle = 'rgba(255, 165, 0, 0.9)';
            this.drawCtx.font = '11px monospace';
            this.drawCtx.fillText('CP2 (可拖動)', this.bezierCP2.x + 8, this.bezierCP2.y);
        }
        
        // 繪製預覽曲線（從起點經過 CP1、CP2 到鼠標位置）
        if (this.bezierCP1 && this.bezierCP2) {
            this.drawCtx.setLineDash([4, 4]);
            this.drawCtx.strokeStyle = 'rgba(255, 165, 0, 0.9)';
            this.drawCtx.lineWidth = 2;
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(this.bezierCurrentPoint!.x, this.bezierCurrentPoint!.y);
            this.drawCtx.bezierCurveTo(
                this.bezierCP1.x, this.bezierCP1.y,
                this.bezierCP2.x, this.bezierCP2.y,
                this.bezierPreviewX, this.bezierPreviewY
            );
            this.drawCtx.stroke();
            
            // 繪製預覽終點
            this.drawCtx.fillStyle = 'rgba(255, 165, 0, 0.7)';
            this.drawCtx.beginPath();
            this.drawCtx.arc(this.bezierPreviewX, this.bezierPreviewY, 5, 0, Math.PI * 2);
            this.drawCtx.fill();
        } else if (this.bezierCP1) {
            // 只有 CP1 時，繪製臨時預覽線
            this.drawCtx.setLineDash([3, 3]);
            this.drawCtx.strokeStyle = 'rgba(255, 165, 0, 0.6)';
            this.drawCtx.lineWidth = 1;
            this.drawCtx.beginPath();
            this.drawCtx.moveTo(this.bezierCurrentPoint!.x, this.bezierCurrentPoint!.y);
            this.drawCtx.lineTo(this.bezierPreviewX, this.bezierPreviewY);
            this.drawCtx.stroke();
        }

        this.drawCtx.setLineDash([]);
    }

    closeBezier() {
        // 檢查是否有完成的段落
        if (this.bezierSegments.length === 0) {
            console.warn('[Graphics Editor] 貝茲曲線必須至少有 1 段');
            this.isDrawingBezier = false;
            return;
        }
        
        // 如果當前段落進行到一半（已設置CP1或CP2但未完成）
        // bezierClickCount === 1 表示已完成段落，準備下一段（只有起點）
        // bezierClickCount === 2 或 3 表示正在設置控制點，段落未完成
        if (this.bezierClickCount === 2 || this.bezierClickCount === 3) {
            console.warn('[Graphics Editor] 當前段落未完成（需要4個點），無法關閉曲線');
            console.log('[提示] 請繼續點擊完成當前段落，或按 Esc 取消');
            return;
        }

        // 創建貝茲曲線形狀
        const shape: any = {
            tool: 'bezier',
            segments: [...this.bezierSegments],
            fillColor: this.fillColor,
            fillAlpha: this.fillAlpha,
            strokeColor: this.strokeColor,
            strokeAlpha: this.strokeAlpha,
            lineWidth: this.lineWidth,
            fillMode: this.fillMode,
            strokeMode: this.strokeMode,
            isClosed: true
        };

        // 計算邊界框（用於變換）
        let minX = this.bezierSegments[0].start.x;
        let maxX = minX;
        let minY = this.bezierSegments[0].start.y;
        let maxY = minY;
        
        this.bezierSegments.forEach(seg => {
            [seg.start, seg.cp1, seg.cp2, seg.end].forEach(p => {
                minX = Math.min(minX, p.x);
                maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y);
                maxY = Math.max(maxY, p.y);
            });
        });
        
        shape.startX = minX;
        shape.endX = maxX;
        shape.startY = minY;
        shape.endY = maxY;

        this.shapes.push(shape);
        this.redraw();
        this.updateCodePreview();

        // 重置貝茲曲線狀態
        this.isDrawingBezier = false;
        this.bezierSegments = [];
        this.bezierCurrentPoint = null;
        this.bezierCP1 = null;
        this.bezierCP2 = null;
        this.bezierClickCount = 0;
        
        console.log('[Graphics Editor] 貝茲曲線已完成，共', shape.segments.length, '段');
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
