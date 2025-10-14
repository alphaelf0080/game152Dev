import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventController')
export class EventController extends Component {
    @property({ type: Node }) BsArrary = [];

    @property({ type: Node }) FsArrary = [];


    HandleBroadcast(type: string, data: any) {
        if (type == "BS") {
            for (let i = 0; i < this.BsArrary.length; i++) {
                let Coms = this.BsArrary[i].getComponents(Component);
                for (let j = 0; j < Coms.length; j++) {
                    if (Coms[j].HandleBroadcast) {
                        Coms[j].HandleBroadcast(data);
                    }
                }
            }
        }
        else if (type == "FS") {
            for (let i = 0; i < this.FsArrary.length; i++) {
                let Coms = this.FsArrary[i].getComponents(Component);
                for (let j = 0; j < Coms.length; j++) {
                    if (Coms[j].HandleBroadcast) {
                        Coms[j].HandleBroadcast(data);
                    }
                }
            }

        }
        else if (type == "All") {
            for (let i = 0; i < this.BsArrary.length + this.FsArrary.length; i++) {
                let Coms;
                if (i >= this.BsArrary.length) {
                    Coms = this.FsArrary[(i - this.BsArrary.length)].getComponents(Component);
                } else {
                    Coms = this.BsArrary[i].getComponents(Component);
                }
                for (let j = 0; j < Coms.length; j++) {
                    if (Coms[j].HandleBroadcast) {
                        Coms[j].HandleBroadcast(data);
                    }
                }
            }
        }
        console.log("EventController GET Event : " + data.EnventID + " / type : " + type)
    }

    setGroupLyVisiable(sceneid: string, visible: boolean) {
        if (sceneid == "BS") {
            for (let i = 0; i < this.BsArrary.length; i++) {
                this.BsArrary[i].active = visible;
            }
        }
        else if (sceneid == "FS") {
            for (let i = 0; i < this.FsArrary.length; i++) {
                this.FsArrary[i].active = visible;
            }
        }
        else if (sceneid == "All") {
            for (let i = 0; i < this.BsArrary.length; i++) {
                this.BsArrary[i].active = visible;
            }
            for (let i = 0; i < this.FsArrary.length; i++) {
                this.FsArrary[i].active = visible;
            }
        }
    }
}


