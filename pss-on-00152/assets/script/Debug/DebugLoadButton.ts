import { _decorator, Component, Button, Label } from 'cc';
import { DebugJSONLoader } from './DebugJSONLoader';
const { ccclass, property } = _decorator;

@ccclass('DebugLoadButton')
export class DebugLoadButton extends Component {
    @property(DebugJSONLoader)
    jsonLoader: DebugJSONLoader = null;
    
    @property(Button)
    loadButton: Button = null;
    
    @property(Button)
    stopButton: Button = null;
    
    @property(Label)
    infoLabel: Label = null;
    
    start() {
        if (this.loadButton) {
            this.loadButton.node.on('click', this.onLoadClick, this);
        }
        
        if (this.stopButton) {
            this.stopButton.node.on('click', this.onStopClick, this);
        }
        
        this.schedule(this.updateInfo, 0.5);
    }
    
    onLoadClick() {
        if (this.jsonLoader) {
            this.jsonLoader.onLoadButtonClick();
        }
    }
    
    onStopClick() {
        if (this.jsonLoader) {
            this.jsonLoader.stopLoopPlayback();
        }
    }
    
    updateInfo() {
        if (!this.jsonLoader || !this.infoLabel) return;
        
        const info = this.jsonLoader.getLoadedInfo();
        this.infoLabel.string = `Results: ${info.currentIndex}/${info.totalResults}\n` +
                                 `Playing: ${info.isPlaying}`;
    }
}