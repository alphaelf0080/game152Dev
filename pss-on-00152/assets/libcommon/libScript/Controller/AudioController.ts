import { _decorator, Component, AudioSource, AudioClip, NodePool, Node } from 'cc';
import { BundleType, LSInst } from '../Common/LoadSource';
import { logCtrl, LogType } from './LogController';
import { Mode } from './DataController';

/**
 * 點擊按鍵名稱統一，如音檔名稱不同，請修改音檔名稱
 */
export const BtnClickAudioName = "BtnClick";
export const BetClickAudioName = "BetClick";
export const CheckClickAudioName = "CheckClick";
export const FestBetAudioName = "FestBet";
export const TurboClickAudioName = "TurboClick";

export enum AudioType {
    Music,
    SFX,
}

const { ccclass, property } = _decorator;
@ccclass('AudioController')
export class AudioController extends Component {
    private _isSetSource: boolean = false;

    protected _musicVol: number = 1;
    protected _sfxVol: number = 1;
    protected _isMusicOn: boolean = true;
    protected _isSfxOn: boolean = true;
    protected _isStartTimer: boolean = false;
    protected _isClearTimer: boolean = false;

    protected _soundMap: Map<string, AudioClip> = new Map<string, AudioClip>();
    protected _sfxAudiosMap: Map<string, AudioSource> = new Map<string, AudioSource>();
    private _curBgmClip: string = '';

    private _audioPool: NodePool = null;
    private _audioPoolSize: number = 50;

    private _fadeMusicCb: Function = null;
    private _fadeTimerCb: Function = null;

    public get musicAudio(): AudioSource {
        return this.node.getComponent(AudioSource);
    }

    public get isMusicPlaying(): boolean {
        return this.musicAudio.playing;
    }

    public get isMute(): boolean {
        return !this.isMusicOn && !this.isSfxOn;
    }

    public get isMusicOn(): boolean {
        return this._isMusicOn;
    }

    public get isSfxOn(): boolean {
        return this._isSfxOn;
    }

    protected start() {
        this._initNodePool();
    }

    protected onDestroy(): void {
        this._soundMap.clear();
        this._audioPool.clear();
    }

    /**
     * @returns Promise<void>
     */
    public async loadBsAudioSrcs(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await LSInst.loadBundleDir(BundleType.BsSound, "", AudioClip, (assets) => { 
                this.setSoundMap(assets); 
            });
            //logCtrl.log(LogType.At, "this._soundMap:", this._soundMap);
            this._isSetSource = true;
            resolve();
        });
    }

    public async loadFsAudioSrcs(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            await LSInst.loadBundleDir(BundleType.FsSound, "", AudioClip, (assets) => { 
                this.setSoundMap(assets); 
            });
            //logCtrl.log(LogType.At, "this._soundMap:", this._soundMap);
            resolve();
        });
    }

    public setSoundMap(assets: AudioClip[]) {
        for (let i = 0; i < assets.length; i++) {
            let clip: AudioClip = assets[i];
            this._soundMap.set(clip.name, clip);
        }
    }

    private _initNodePool() {
        this._audioPool = new NodePool();
        for (let i = 0; i < this._audioPoolSize; i++) {
            this._audioPool.put(this._creatSFXAudioNode());
        }
    }

    private _creatSFXAudioNode(): Node {
        let node = new Node("audioSfx");
        let audioSrc = node.addComponent(AudioSource);
        audioSrc.playOnAwake = false;
        this._audioPool.put(node);
        return node;
    }

    private _getSFXAudioNode(): Node {
        if (this._audioPool.size() <= 0) {
            return this._creatSFXAudioNode();
        }
        return this._audioPool.get();
    }

    /**
    * 播放音樂
    * @param clipName clip名稱
    * @param loop 是否loop
    * @returns 
    */
    public playBgm(clipName: string, loop: boolean) {
        if (!this._isSetSource) return;
        if (this._curBgmClip === clipName) return;

        let clip: AudioClip = this.getSfxClip(clipName) as AudioClip;
        if (clip) {
            this.musicAudio.stop();
            this.musicAudio.clip = clip;
            this.musicAudio.loop = loop;
            this.musicAudio.play();
            this._curBgmClip = clipName;
        }
    }

    public stopBgm() {
        if (!this.isMusicPlaying) return;
        this.musicAudio.stop();
    }

    public pauseBgm() {
        if (!this.isMusicPlaying) return;
        this.musicAudio.pause();
    }

    public resumeBgm() {
        if (this.isMusicPlaying) return;
        this.musicAudio.play();
    }

    /**
     * 播放音效
     * @param clipName clip名稱
     * @param loop 是否loop
     * @param audioName audio節點名稱，從map刪除與查找使用，有用到的名稱必須不同。
     * 如果這個音效需要之後做停止、暫停或恢復才需傳此參數。
     * @returns 
     */
    public playSfx(clipName: string, loop: boolean, audioNodeName: string = null) {
        return new Promise<void>((resolve, reject) => {
            if (!this._isSetSource) return;

            let clip: AudioClip = this.getSfxClip(clipName) as AudioClip;
            if (clip) {
                let audioNode: Node = this._getSFXAudioNode();
                let audioComp = audioNode.getComponent(AudioSource);
                audioNode.setParent(this.node);
                audioComp.clip = clip;
                audioComp.loop = loop;
                audioComp.volume = this._sfxVol;
                audioComp.node.name = (audioNodeName) ? audioNodeName : clipName;
                if(audioNodeName) this._sfxAudiosMap.set(audioNodeName, audioComp);

                audioComp.play();
                audioNode.on(AudioSource.EventType.ENDED, () => {
                    if (!loop) this._recycleAudioNode(audioComp);
                    resolve();
                });
            }
        });
    }

    /**
     * 用cocos的playOneShot撥放，不能暫停或停止。
     * 如果一次要大量撥放不需暫停或停止的音效用這個
     * @param clipName clip名稱
     * @returns 
     */
    public playSfxOneShot(clipName: string) {
        if (!this._isSetSource) return;

        let clip: AudioClip = this.getSfxClip(clipName) as AudioClip;
        if (clip) {
            let audioNode: Node = this._getSFXAudioNode();
            let audioComp = audioNode.getComponent(AudioSource);
            audioNode.setParent(this.node);
            audioComp.volume = this._sfxVol;

            audioComp.playOneShot(clip);
            this.scheduleOnce(() => {
                this._recycleAudioNode(audioComp,false);
            }, clip.getDuration());
        }
    }

    public stopSfx(audioName: string) {
        let audio: AudioSource = this._sfxAudiosMap.get(audioName);
        if (audio) {
            this._recycleAudioNode(audio);
            audio = null;
        }
    }

    public pauseSfx(audioName: string) {
        let audio: AudioSource = this._sfxAudiosMap.get(audioName);
        if (audio) audio.pause();
    }

    public resumeSfx(audioName: string) {
        let audio: AudioSource = this._sfxAudiosMap.get(audioName);
        if (audio) audio.play();
    }

    // 背景音樂計時淡出用
    public startTimer(delayTime: number = 5, fadeOutTime: number = 1) {
        if (this._isStartTimer) return;

        this._isStartTimer = true;
        this._isClearTimer = false;

        if (this._fadeTimerCb) {
            this.unschedule(this._fadeTimerCb);
            this._fadeTimerCb = null;
        }
        this._fadeTimerCb = this._hideMusic.bind(this, fadeOutTime);
        this.schedule(this._fadeTimerCb, 0, 0, delayTime);
    }

    public clearTimer() {
        if (this._isClearTimer) return;

        this._isStartTimer = false;
        this._isClearTimer = true;

        if (this._fadeMusicCb) {
            this.unschedule(this._fadeMusicCb);
            this._fadeMusicCb = null;
        }

        if (this._fadeTimerCb) {
            this.unschedule(this._fadeTimerCb);
            this._fadeTimerCb = null;
        }
        this.setVoice(AudioType.Music, this.isMute ? 0 : 1);
    }

    private _hideMusic(time: number) {
        this.fadeVol(time, 0);
    }

    // 目前for音樂，有音效需要淡入淡出時再修改
    public fadeVol(time: number, targetVol: number) {
        let curVol: number = this.musicAudio.volume;
        let fadetimes: number = Math.round(Math.abs(targetVol - curVol) / 0.1);
        let interval = time / fadetimes;

        if (this._fadeMusicCb) {
            this.unschedule(this._fadeMusicCb);
            this._fadeMusicCb = null;
        }
        this._fadeMusicCb = this._setFadeV.bind(this, curVol, targetVol);
        this.schedule(this._fadeMusicCb, interval, fadetimes - 1)
    }

    private _setFadeV(curVol: number, targetVol: number) {
        let vol: number = this.musicAudio.volume + (curVol > targetVol ? -1 : curVol < targetVol ? 1 : 0) * 0.1;
        vol = vol <= 0 ? 0 : vol >= 1 ? 1 : vol;
        vol = Mode.formatDecimal(vol, 1)
        this.setVoice(AudioType.Music, vol);
    }

    private _recycleAudioNode(audio: AudioSource, isDeleteMap: boolean = true) {
        let node: Node = audio.node;
        let audioNodeName:string = node.name;
        node.targetOff(AudioSource);
        audio.stop();
        audio.clip = null;
        node.setParent(null);
        node.name = "audioSfx";

        this._audioPool.put(node);
        if(isDeleteMap && this._sfxAudiosMap.has(audioNodeName)) this._sfxAudiosMap.delete(audioNodeName);
    }

    public getSfxClip(clipname?: string): AudioClip | AudioClip[] {
        return clipname ? this._soundMap.get(clipname) : Array.from(this._soundMap).map(e => e[1]);
    }

    public setMute(isMute: boolean) {
        this.setMusicOn(!isMute);
        this.setSfxOn(!isMute);
    }

    public setMusicOn(isMusicOn: boolean) {
        this._isMusicOn = isMusicOn;
        this.setVoice(AudioType.Music, this._isMusicOn ? 1 : 0);
    }

    public setSfxOn(isSfxOn: boolean) {
        this._isSfxOn = isSfxOn;
        this.setVoice(AudioType.SFX, this._isSfxOn ? 1 : 0);
    }

    public setVoice(audioType: AudioType, vol: number) {
        if (audioType === AudioType.Music) {
            this._musicVol = vol;
            this.musicAudio.volume = this._musicVol;
        }
        else {
            this._sfxVol = vol;
        }
    }

    public getVol(audioType: AudioType): number {
        return audioType === AudioType.Music ? this._musicVol : this._sfxVol;
    }
}

