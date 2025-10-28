/**
 * 3D 骨骼動畫控制器測試示例
 * 
 * 這是一個示例腳本，展示如何使用 SkeletalAnimationController
 * 適用於 FBX、GLB 等 3D 模型
 */

import { _decorator, Component, Node, Label } from 'cc';
import { SkeletalAnimationController } from './SkeletalAnimationController';

const { ccclass, property } = _decorator;

@ccclass('SkeletalAnimationControllerTest')
export class SkeletalAnimationControllerTest extends Component {
    @property(SkeletalAnimationController)
    private animController: SkeletalAnimationController | null = null;

    @property(Label)
    private labelStatus: Label | null = null;

    private updateCounter: number = 0;

    onLoad() {
        this.initializeTest();
    }

    /**
     * 初始化測試
     */
    private initializeTest() {
        console.log('[SkeletalAnimationControllerTest] 初始化完成');
        this.updateStatus('3D 動畫控制器已就緒');
        
        // 列出所有動畫
        this.listAllAnimations();
    }

    /**
     * 播放下一個動畫
     */
    public playNext() {
        if (this.animController) {
            this.animController.nextClip();
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`▶️ 播放: ${info.name} (${info.index}/${info.total})`);
        }
    }

    /**
     * 播放上一個動畫
     */
    public playPrev() {
        if (this.animController) {
            this.animController.prevClip();
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`◀️ 播放: ${info.name} (${info.index}/${info.total})`);
        }
    }

    /**
     * 暫停動畫
     */
    public pauseAnimation() {
        if (this.animController) {
            this.animController.pauseClip();
            this.updateStatus('⏸️ 已暫停');
        }
    }

    /**
     * 恢復播放
     */
    public resumeAnimation() {
        if (this.animController) {
            this.animController.resumeClip();
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`▶️ 繼續播放: ${info.name}`);
        }
    }

    /**
     * 停止動畫
     */
    public stopAnimation() {
        if (this.animController) {
            this.animController.stopClip();
            this.updateStatus('⏹️ 已停止');
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
            this.updateStatus(`⏩ 速度: ${newSpeed.toFixed(2)}x`);
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
            this.updateStatus(`⏪ 速度: ${newSpeed.toFixed(2)}x`);
        }
    }

    /**
     * 設置為正常速度
     */
    public normalSpeed() {
        if (this.animController) {
            this.animController.setPlaybackSpeed(1.0);
            this.updateStatus('🎬 正常速度 (1.0x)');
        }
    }

    /**
     * 啟用循環播放
     */
    public enableLooping() {
        if (this.animController) {
            this.animController.setLooping(true);
            this.updateStatus('🔄 循環播放已啟用');
        }
    }

    /**
     * 禁用循環播放
     */
    public disableLooping() {
        if (this.animController) {
            this.animController.setLooping(false);
            this.updateStatus('⏹️ 循環播放已禁用（播放一次）');
        }
    }

    /**
     * 列出所有動畫
     */
    public listAllAnimations() {
        if (this.animController) {
            const clips = this.animController.getAllClips();
            console.log('\n========== 所有動畫片段 ==========');
            clips.forEach((clip, index) => {
                console.log(`${index + 1}. ${clip.name} (時長: ${clip.duration.toFixed(2)}s)`);
            });
            console.log(`總計: ${clips.length} 個動畫\n`);
            
            this.updateStatus(`📋 已加載 ${clips.length} 個動畫`);
        }
    }

    /**
     * 循環播放所有動畫（演示用）
     */
    public async playAllSequentially() {
        if (!this.animController) return;

        const count = this.animController.getClipCount();
        console.log(`\n========== 開始循環播放所有動畫 ==========`);

        for (let i = 0; i < count; i++) {
            this.animController.jumpToClip(i);
            const info = this.animController.getCurrentClipInfo();
            
            console.log(`[${i + 1}/${count}] 播放: ${info.name} (${info.duration.toFixed(2)}s)`);
            this.updateStatus(`🎬 播放 ${i + 1}/${count}: ${info.name}`);

            // 等待動畫播放完成（加上過度時間）
            await this.wait((info.duration + 0.3) * 1000);
        }

        console.log(`========== 循環播放完成 ==========\n`);
        this.updateStatus('✅ 循環播放完成！');
    }

    /**
     * 跳轉到指定動畫
     */
    public jumpToAnimation(index: number) {
        if (this.animController) {
            this.animController.jumpToClip(index);
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`🎯 跳轉至: ${info.name} (${info.index}/${info.total})`);
        }
    }

    /**
     * 按名稱播放動畫
     */
    public playAnimationByName(name: string) {
        if (this.animController) {
            this.animController.playByName(name);
            const info = this.animController.getCurrentClipInfo();
            this.updateStatus(`🎬 播放: ${info.name}`);
        }
    }

    /**
     * 尋求到指定時間
     */
    public seekToTime(time: number) {
        if (this.animController) {
            this.animController.seek(time);
            const progress = (this.animController.getPlayProgress() * 100).toFixed(0);
            this.updateStatus(`⏱️ 尋求到 ${time.toFixed(2)}s (進度: ${progress}%)`);
        }
    }

    /**
     * 顯示播放進度
     */
    public showPlayProgress() {
        if (this.animController) {
            const progress = this.animController.getPlayProgress();
            const info = this.animController.getCurrentClipInfo();
            const currentTime = progress * info.duration;
            const progressPercent = (progress * 100).toFixed(0);
            
            const status = `⏱️ 進度: ${currentTime.toFixed(2)}s / ${info.duration.toFixed(2)}s (${progressPercent}%)`;
            console.log(status);
            this.updateStatus(status);
        }
    }

    /**
     * 顯示所有動畫詳細信息
     */
    public showDetailedAnimationInfo() {
        if (this.animController) {
            const clips = this.animController.getAllClips();
            let infoText = '📋 動畫詳細信息:\\n';
            
            clips.forEach((clip, index) => {
                infoText += `${index + 1}. ${clip.name}\\n`;
                infoText += `   時長: ${clip.duration.toFixed(2)}s\\n`;
            });
            
            this.updateStatus(infoText);
            console.log(infoText);
        }
    }

    /**
     * 測試交叉淡入淡出轉換
     */
    public testCrossFade() {
        if (this.animController) {
            console.log('\\n========== 測試交叉淡入淡出轉換 ==========');
            
            // 播放第一個動畫
            this.animController.jumpToClip(0);
            console.log(`播放第一個動畫: ${this.animController.getCurrentClipName()}`);
            
            // 1 秒後切換到第二個動畫（觸發交叉淡入淡出）
            setTimeout(() => {
                this.animController?.nextClip();
                console.log(`平滑過度到: ${this.animController?.getCurrentClipName()}`);
                this.updateStatus('✅ 交叉淡入淡出轉換完成');
            }, 1000);
            
            this.updateStatus('⏳ 1 秒後進行交叉淡入淡出轉換...');
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
     * 更新週期顯示播放狀態
     */
    update(deltaTime: number) {
        this.updateCounter++;
        
        // 每 60 幀（約 1 秒）打印一次播放進度
        if (this.updateCounter % 60 === 0) {
            if (this.animController?.getIsPlaying()) {
                const progress = this.animController.getPlayProgress();
                const info = this.animController.getCurrentClipInfo();
                const currentTime = progress * info.duration;
                console.debug(`[播放進度] ${info.name}: ${currentTime.toFixed(2)}s / ${info.duration.toFixed(2)}s`);
            }
        }
    }

    /**
     * 獲取動畫控制器（供外部訪問）
     */
    public getAnimationController(): SkeletalAnimationController | null {
        return this.animController;
    }
}
