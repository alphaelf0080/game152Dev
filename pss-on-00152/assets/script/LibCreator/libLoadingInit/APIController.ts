import { _decorator, Component, screen, game, view, find, sp, SpriteFrame, Label, sys, View, EventKeyboard, KeyCode, Input, input, macro } from 'cc';
import { Data } from '../../DataController';
import { IActivityRuleTextLine, IRedPacketConfig, IActivityUI } from '../libScript/Interface/CommonInterface';
const { ccclass, property } = _decorator;

@ccclass('APIController')
export class APIController extends Component {
    @property({ type: sp.SkeletonData, displayName: "活動橫幅" })
    public ActBannerJson: sp.SkeletonData = new sp.SkeletonData();

    public RedpackData: IRedPacketConfig = {
        RpsymSprite: null,
        SymbolBtnSprite: null,
        BoardAnm: null,
        PickOneAnm: null,
        SymbolBgAnm: null,
        SymbolAnm: null,
        ActivityCollectAnm: null,
        Dialog: null
    }

    public ActivityUI: IActivityUI = { close: null, rule: null, };
    public ActivityText: IActivityRuleTextLine[] = [];
    public ActivityGame: SpriteFrame[] = [];
    public ActivityTextMax: number = 70;
    public GameSocket: string[] = [];
    public RedpacketType: number = 0;

    protected override start() {
        this.setupInputHandlers();
    }

    private setupInputHandlers() {
        const handleKeyDown = (event: EventKeyboard) => {
            if (sys.isMobile && sys.os !== sys.OS.IOS) {
                if (event.keyCode === KeyCode.MOBILE_BACK) {
                    screen.exitFullScreen();
                }
            }
        };
        input.on(Input.EventType.KEY_DOWN, handleKeyDown, this);
    }

    getGoHome = function () {
        switch (window["psapi"].hostInfo.return_type) {
            case 0: // DO NOTHING
                break;
            case 1: // RETURN TO URL
            case 2: // [obsolete] CLOSE WINDOW
            case 4: // [obsolete] For Android App (WebView)
                this.handleReturnToUrl();
                break;
            case 3: // PS Lobby
                window["psapi"].openLobby();
                break;
        }
    }

    private handleReturnToUrl() {
        const return_url = this.getURLParameter("return_url");
        if (return_url) {
            if (window["psapi"].platform.isWebView) {
                document.location = decodeURIComponent(return_url);
            } else {
                const return_target = this.getURLParameter("return_target");
                let win = this.getWindowByTarget(return_target);
                win.location.replace(decodeURIComponent(return_url));
            }
        } else {
            window.top.close();
        }
    }

    private getWindowByTarget(target: string): Window {
        switch (target) {
            case "parent":
                return window.parent;
            case "top":
                return window.top;
            case "self":
                return window.self;
            default:
                return window.top;
        }
    }

    getURLParameter = function (param: string): string {
        return window["psapi"].queryString.hasOwnProperty(param) ? window["psapi"].queryString[param] : '';
    }

    getHostImages = function () {
        return window["getHostImages"]();
    }

    getPsImages = function () {
        if (typeof window["getPSImages"] === "function") {
            if (window["getPSImages"]().type[4] === 1) {
                this.RedpacketType = 1;
                return {
                    mode: window["getPSImages"]().mode,
                    type: [0, 0, 0, 1, 0]
                }
            }
            return window["getPSImages"]();
        }
        return {
            mode: "101",
            type: [0, 0, 0, 0, 0]
        }
    }

    getPSEvents = function () {
        if (typeof window["getPSEvents"] === "function")
            return window["getPSEvents"]();
        else
            console.log("no get PsEventdata");
    }

    getGameID = function () {
        return window["psapi"].hostInfo.game_id;
    }


    goRecord = function () {
        // unused
        // if (!Data.Library.StateConsole.isAutoPlay) {
        //     window["openRecord"]();
        // }
    }

    goHome = function () {
        window["goHome"]()
    }

    getHostSocket = function () {
        const game_type = window["psapi"].hostInfo.game_type.toLowerCase();
        const serverInfo = window["psapi"].hostInfo.server_info[game_type];
        if (Array.isArray(serverInfo)) {
            serverInfo.forEach(info => {
                this.GameSocket.push(info.replace("@ORIGIN_DOMAIN@", location.hostname));
            });
        } else {
            this.GameSocket.push(serverInfo.replace("@ORIGIN_DOMAIN@", location.hostname));
        }
        for (let i = 0; i < this.GameSocket.length; i++) {
            this.GameSocket[0] = `${this.GameSocket[0]}/${game_type.replace('-', '/')}`;
        }
    }
}