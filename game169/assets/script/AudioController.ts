import { _decorator, Component, Node, find, AudioSource, JsonAsset, resources, error, macro } from 'cc';
import { Data, Mode } from './DataController';
import { AllNode } from './LibCreator/libScript/CommonLibScript';

const { ccclass, property } = _decorator;
let MessageConsole: Node = null;


@ccclass('AudioController')
export class AudioController extends Component {
    WaitTime = 0;
    BsVolume = 0;
    FsVolume = 0;
    MusicState = -1;

    @property({ type: AudioSource }) soundOsIdle = [];

    @property({ type: AudioSource }) soundOsWin = [];

    @property({ type: AudioSource }) soundOsBigWin = [];

    
    start() {
        MessageConsole = find("MessageController");
    }

    update(deltaTime: number) {
        if (Data.Library.StateConsole.CurState == Mode.FSM.K_IDLE) {
            if (this.WaitTime >= 5 && this.BsVolume > 0) {
                this.MusicState = 2;
                this.WaitTime = 0;
            } else {
                this.WaitTime += deltaTime;
            }
        } else {
            this.WaitTime = 0;
        }

        if (this.MusicState == 0) {
            this.MusicState = -1;

            this.BsVolume = 0;
            this.FsVolume = 0;
        } else if (this.MusicState == 1) {
            this.BsVolume = this.BsVolume + deltaTime / 2;
            if (this.BsVolume >= 1) {
                this.BsVolume = 1;
                this.MusicState = -1;
            }
            this.FsVolume = 0;
        } else if (this.MusicState == 2) {
            if (this.BsVolume > 0) {
                this.BsVolume = this.BsVolume - deltaTime / 2;
                if (this.BsVolume <= 0) {
                    this.BsVolume = 0;
                    this.node.getChildByName("BsMusic").getComponent(AudioSource).stop();
                }
            }
            if (this.FsVolume > 0) {
                this.FsVolume = this.FsVolume - deltaTime / 2;
                if (this.FsVolume <= 0) {
                    this.FsVolume = 0;
                    this.node.getChildByName("BsMusic").getComponent(AudioSource).stop();
                }
            }
            if (this.BsVolume == 0 && this.FsVolume == 0) {
                this.MusicState = -1;
            }
        } else if (this.MusicState == 3) {
            this.BsVolume = this.BsVolume - deltaTime;
            if (this.BsVolume <= 0) {
                this.BsVolume = 0;
                this.node.getChildByName("BsMusic").getComponent(AudioSource).stop();
            }
            this.FsVolume = this.FsVolume + deltaTime / 2;
            if (this.FsVolume >= 1) {
                this.FsVolume = 1;
                this.MusicState = -1;
            }
        } else if (this.MusicState == 4) {
            this.MusicState = -1;

            this.BsVolume = 0;
            this.FsVolume = 1;
        }

        if (Data.Library.StateConsole.isMute == true) {
            if (this.node.getComponent(AudioSource).volume > 0) {
                this.ControllerVolume(this.node, 0);
            }
        } else {
            if (this.node.getComponent(AudioSource).volume == 0) {
                this.ControllerVolume(this.node, 1);
            }
            this.node.getChildByName("BsMusic").getComponent(AudioSource).volume = this.BsVolume;
            this.node.getChildByName("FsMusic").getComponent(AudioSource).volume = this.FsVolume;
        }
    }

    ControllerVolume(node, volumeValue) {
        let audioSource = node.getComponent(AudioSource);
        if (audioSource) {
            audioSource.volume = volumeValue;
        }

        node.children.forEach(element => {
            this.ControllerVolume(element, volumeValue);
        }, this);
    }

    HandleBroadcast(data: any) {
        switch(data.EnventID) {
            case Data.Library.EVENTID[Mode.EVENTTYPE.COMMON].eNETREADY: 
                this.PlayingRandomSound();
                break;

            case Data.Library.EVENTID[Mode.EVENTTYPE.STATE].eSTATECHANGE:
                this.HandleStateChange(data.EnventData);
                break;

            default: break;
        }
    }

    HandleStateChange(state) {
        switch (state) {
            case Mode.FSM.K_SPIN:
                if (this.node.getChildByName("BsMusic").getComponent(AudioSource).playing == false) {
                    this.node.getChildByName("BsMusic").getComponent(AudioSource).play();
                    this.MusicState = 1;
                }
                break;
           
            case Mode.FSM.K_FEATURE_WAIT_START:
            case Mode.FSM.K_FEATURE_SPIN:
                if (this.node.getChildByName("FsMusic").getComponent(AudioSource).playing == false) {
                    this.node.getChildByName("FsMusic").getComponent(AudioSource).play();
                    this.MusicState = 3;
                }
                break;

            case Mode.FSM.K_FEATURE_SPINSTOPING: break;

            case Mode.FSM.K_FEATURE_RETRIGGER: break;

            case Mode.FSM.K_FEATURE_CHEKRESULT:
                this.node.getChildByName("FsMusic").getComponent(AudioSource).stop();
                break;
                
            default:
                break;
        }
    }

    PlayingRandomSound() {
        if(!Data.Library.StateConsole.isBgmSoundPlayed){
            this.schedule(() => {
                if(Data.Library.StateConsole.CurState == Mode.FSM.K_IDLE) {
                    let ran = Math.floor(Math.random() * this.soundOsIdle.length);
    
                    this.soundOsIdle[ran].getComponent(AudioSource).play();
                }
            }, 10, macro.REPEAT_FOREVER, 0)
        }
        Data.Library.StateConsole.isBgmSoundPlayed=true;        
    }

    PlayingRandomWinSound() {
                    let ran = Math.floor(Math.random() * this.soundOsWin.length);    
                    this.soundOsWin[ran].getComponent(AudioSource).play();
    }

    PlayingRandomBigWinSound() {
        let ran = Math.floor(Math.random() * this.soundOsBigWin.length);    
        this.soundOsBigWin[ran].getComponent(AudioSource).play();
}
}