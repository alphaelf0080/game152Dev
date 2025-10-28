/**
 * 動畫控制器測試示例
 * 
 * 這是一個示例腳本，展示如何使用 AnimationClipController
 */

import { _decorator, Component, Node, Button, Label } from 'cc';
import { AnimationClipController } from './AnimationClipController';

const { ccclass, property } = _decorator;

@ccclass('AnimationControllerTest')
export class AnimationControllerTest extends Component {
    @property(AnimationClipController)
    private animController: AnimationClipController | null = null;

    @property(Label)
    private labelStatus: Label | null = null;

    private testIndex: number = 0;

    onLoad() {
        this.initializeUI();
    }

    /**
     * 初始化 UI 和按鈕
     */
    private initializeUI() {
        console.log('[AnimationControllerTest] 初始化完成');
        this.updateStatus('準備就緒');
    }

    /**
     * 播放下一個動畫
     */
    public playNext() {
        if (this.animController) {
            this.animController.nextClip();
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`播放: ${info.name} (${info.index}/${info.total})`);
        }
    }

    /**
     * 播放上一個動畫
     */
    public playPrev() {
        if (this.animController) {
            this.animController.prevClip();
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`播放: ${info.name} (${info.index}/${info.total})`);
        }
    }

    /**
     * 暫停動畫
     */
    public pauseAnimation() {
        if (this.animController) {
            this.animController.pauseClip();
            this.updateStatus('已暫停');
        }
    }

    /**
     * 恢復播放
     */
    public resumeAnimation() {
        if (this.animController) {
            this.animController.playCurrentClip();
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`繼續播放: ${info.name}`);
        }
    }

    /**
     * 停止動畫
     */
    public stopAnimation() {
        if (this.animController) {
            this.animController.stopClip();
            this.updateStatus('已停止');
        }
    }

    /**
     * 加速播放
     */
    public speedUp() {
        if (this.animController) {
            const currentSpeed = this.animController['playbackSpeed'] || 1.0;
            const newSpeed = Math.min(currentSpeed + 0.25, 3.0);
            this.animController.setPlaybackSpeed(newSpeed);
            this.updateStatus(`速度: ${newSpeed.toFixed(2)}x`);
        }
    }

    /**
     * 減速播放
     */
    public speedDown() {
        if (this.animController) {
            const currentSpeed = this.animController['playbackSpeed'] || 1.0;
            const newSpeed = Math.max(currentSpeed - 0.25, 0.1);
            this.animController.setPlaybackSpeed(newSpeed);
            this.updateStatus(`速度: ${newSpeed.toFixed(2)}x`);
        }
    }

    /**
     * 顯示所有動畫列表
     */
    public showAnimationList() {
        if (this.animController) {
            const clips = this.animController.getAllClips();
            let listText = '可用動畫:\\n';
            clips.forEach((clip, index) => {
                listText += `${index + 1}. ${clip.name}\\n`;
            });
            this.updateStatus(listText);
            console.log(listText);
        }
    }

    /**
     * 循環播放所有動畫（演示用）
     */
    public async playAllSequentially() {
        if (!this.animController) return;

        const count = this.animController.getClipCount();
        this.updateStatus(`開始循環播放 (共 ${count} 個動畫)...`);

        for (let i = 0; i < count; i++) {
            this.animController.jumpToClip(i);
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`播放 ${i + 1}/${count}: ${info.name}`);

            // 等待 2.5 秒後播放下一個
            await this.wait(2500);
        }

        this.updateStatus('循環播放完成！');
    }

    /**
     * 跳轉到指定動畫
     */
    public jumpToAnimation(index: number) {
        if (this.animController) {
            this.animController.jumpToClip(index);
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`跳轉至: ${info.name} (${info.index}/${info.total})`);
        }
    }

    /**
     * 更新狀態標籤
     */
    private updateStatus(text: string) {
        if (this.labelStatus) {
            this.labelStatus.string = text;
        }
        console.log(`[狀態] ${text}`);
    }

    /**
     * 等待函數
     */
    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 獲取動畫控制器（供外部訪問）
     */
    public getAnimationController(): AnimationClipController | null {
        return this.animController;
    }
}
