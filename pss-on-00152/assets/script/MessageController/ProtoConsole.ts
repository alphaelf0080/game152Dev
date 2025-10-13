import { APIController } from "../LibCreator/libLoadingInit/APIController";
import Proto from "../LibCreator/libProto/gap.js";
import ProtoModule from "../LibCreator/libProto/module_common.js";
import { _decorator, Component, find, instantiate, Node, log, Label, macro, dynamicAtlasManager, game, assetManager, Prefab } from 'cc';
import { UIController } from "../LibCreator/libUIController/UIController";
import { Data, Mode } from "../DataController";
import { MarqueeData } from "../LibCreator/libScript/MarqueeScript/Marquee";
import { ActiveItem1 } from "../LibCreator/libScript/JackpotScript/RedPacketActivity/ActiveItem1";
import { CommonVariableData } from "../LibCreator/libScript/CommonVariable";
import { UCoin } from "../LibCreator/libScript/JackpotScript/UCoin/UCoin";
import { AutoPages } from "../LibCreator/libUIController/AutoBtn";
import { JackPot } from "../../Jackpot/script/JackPot";
import { EventController } from "./EventController";


const { ccclass, property } = _decorator;
let API: APIController = null;
let MessageConsole: Node = null;
let JackpotConsole: ActiveItem1 = null;
var UcoinConsole: UCoin = null;
let DropSymbolMap = null;
let Marquee: MarqueeData = null;
let JackPotNode: JackPot = null;

macro.CLEANUP_IMAGE_CACHE = false;
dynamicAtlasManager.enabled = true;

interface WinPosObj {
    pos: number[],        //存放贏分位置
    credit: number,       //存放單局credit
    mul: number,          //存放倍率
    change: boolean,      //是否變盤
    symbolId: number,     //變盤symbolId
    isFiveLine: boolean,  //是否五連線
}

@ccclass('ProtoConsole')
export class ProtoConsole extends Component {
    start() {
        MessageConsole = find("MessageController");
        DropSymbolMap = Data.Library.GameData.DropSymbolMap;
        Marquee = find("Canvas/Marquee").getComponent(MarqueeData);


        if (find("APIConsole")) {
            API = find("APIConsole").getComponent(APIController);
        }
        if (find("Canvas/JackPot")) {
            JackpotConsole = find("Canvas/JackPot").getComponent(ActiveItem1);
        }
        if (find("Canvas/Ucoin")) {
            UcoinConsole = find("Canvas/Ucoin").getComponent(UCoin);
        }

        CreateSocket();
    }

    protected onLoad(): void {
        if (Data.Library.ProtoData === null) {
            Data.Library.ProtoData = this;
        }
        else {
            this.destroy();
        }
    }

    SendMsg(msgid, evt) {
        action_dispatch(msgid, evt);
    }

    FillWinData(win_data, slot_result_proto) {
        FillWinData(win_data, slot_result_proto);
    }
}

let gToken = '';
let socket_call_back = {
    onopen: function () {
        netlog("Connected");
        send_msg(Proto.encodeEMSGID.eLoginCall);
    },
    onclose: function () {
        Data.Library.ErrorData.bklog("Socket Close");
        netlog("Disconnected"); DropSymbolMap
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.NetDisconnect, Data.Library.ErrorData.Type.ALARM);
        Mode.ErrorInLoading(Data.Library.ErrorData.Code.NetDisconnect.toString());
        // find("Canvas/Notice/BlackBg").active = true;
        // find("Canvas/Notice/InfoBg").active = true;
    },
    onmessage: function (evt) {
        try {
            dispatch_msg(evt);
        }
        catch (err) {
            console.log(err);
            netlog("Error" + err);
        }
    }
};

let socket: WebSocket;
let socketUrl = "ws://dev-gs.iplaystar.net:81/slot";
let CreateSocket = function () {
    if (window["psapi"] !== undefined) {
        socketUrl = API.GameSocket[0];
    }
    socket = new WebSocket(socketUrl);
    socket.binaryType = "arraybuffer"; // We are talking binary
    for (let key in socket_call_back) {
        socket[key] = socket_call_back[key]
    }
    let socketOpen = function () {
        var mockEvent = new Event('open');
        if (typeof socket.onopen === 'function') {
            socket.onopen(mockEvent);
        }
        var connDiv = document.getElementById('conn-div');
        if (connDiv) {
            connDiv.remove();
        }
    }
    socketOpen();
};

let send_msg = function (msgid) {
    action_dispatch(msgid, null);
};

let action_dispatch = function (msgid, evt) {
    switch (msgid) {
        case Proto.encodeEMSGID.eLoginCall:
            LoginCall();
            break;
        case Proto.encodeEMSGID.eLoginRecall:
            LoginRecall(evt);
            break;
        case Proto.encodeEMSGID.eConfigCall:
            ConfigCall();
            break;
        case Proto.encodeEMSGID.eConfigRecall:
            ConfigRecall(evt);
            break;
        case Proto.encodeEMSGID.eStripsCall:
            StripsCall();
            break;
        case Proto.encodeEMSGID.eStripsRecall:
            StripsRecall(evt);
            break;
        case Proto.encodeEMSGID.eResultCall:
            ResultCall(evt);
            break;
        case Proto.encodeEMSGID.eResultRecall:
            ResultRecall(evt);
            break;
        case Proto.encodeEMSGID.eDataCall:
            DataCall();
            break;
        case Proto.encodeEMSGID.eDataRecall:
            DataRecall(evt);
            break;
        case Proto.encodeEMSGID.eStateCall:
            StateCall();
            break;
        case Proto.encodeEMSGID.eStateRecall:
            StateRecall(evt);
            break;
        case Proto.encodeEMSGID.eJackpotInfo:
            GetJackpotInfo(evt);
            break;
        case Proto.encodeEMSGID.eJackpotNotify:
            GetJackpotNotify(evt);
            break;
        default:
            netlog("[@action_dispatch] not found " + msgid);
            break;
    }
};

let LoginCall = function () {
    gToken = Data.Library.CommonLibScript.GetURLParameter('access_token');
    let msg = {
        msgid: "eLoginCall",
        member_id: "brian",
        password: "1234",
        machine_id: "LK00010",
        token: gToken
    };
    if (find("APIConsole")) {
        msg = {
            msgid: "eLoginCall",
            member_id: "guest",
            password: "",
            machine_id: "LK00010",
            token: gToken
        };
    }
    const message = Proto.encodeLoginCall(msg);
    bksend(message);
};

let LoginRecall = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeLoginRecall(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    netlog("[@LoginRecall] status_code " + StatusCode);
    if (StatusCode == Proto.encodeStatusCode.kSuccess) {
        g_getCreditmode();
        g_getDigimode();
        send_msg(Proto.encodeEMSGID.eConfigCall);
    }
    else {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.LoginError, Data.Library.ErrorData.Type.ALARM);
        Mode.ErrorInLoading(Data.Library.ErrorData.Code.LoginError.toString());
    }
};

let ConfigCall = function () {
    let msg = {
        msgid: "eConfigCall",
        token: gToken,
        gameid: Data.Library.DEF_GAMEID,
        clear_power_cycle:false,
        version: 1,
        subgame_id: 0
    };
    let subid = parseInt(Data.Library.CommonLibScript.GetURLParameter("subid"));
    if (!isNaN(subid))
        msg.subgame_id = subid;
    const message = Proto.encodeConfigCall(msg);
    bksend(message);
};

let reelRow = Data.Library.REEL_CONFIG.REEL_ROW;
let reelCol = Data.Library.REEL_CONFIG.REEL_COL;

let ConfigRecall = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeConfigRecall(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    netlog("[@ConfigRecall] status_code " + StatusCode);
    console.log(message)
    if (StatusCode == Proto.encodeStatusCode.kSuccess) {
        Data.Library.StateConsole.BetArray = message.bet_5_arr;
        Data.Library.StateConsole.LineArray = message.line_5_arr;
        Data.Library.StateConsole.RateArray = message.rate_arr;
        Data.Library.StateConsole.RateIndex = message.rate_default_index;
        Data.Library.StateConsole.LngArray = message.language_list;
        Data.Library.StateConsole.LngIndex = message.language_default_index;
        Data.Library.StateConsole.PlayerCent = 0;
        for (let i = 0; i < Data.Library.StateConsole.BetArray.length; i++) {
            for (let j = 0; j < Data.Library.StateConsole.RateArray.length; j++) {
                let total = Data.Library.StateConsole.BetArray[i] * Data.Library.StateConsole.RateArray[j] * Data.Library.StateConsole.LineArray[0];
                if (Data.Library.StateConsole.TotalArray.includes(total) == false) {
                    Data.Library.StateConsole.TotalArray.push(total);
                    Data.Library.StateConsole.TotalArrayX.push([i, j]);
                }
            }
        }
        Data.Library.StateConsole.TotalArray.sort((a, b) => { return a - b; });
        Data.Library.StateConsole.TotalArrayX.sort(function (a, b) {
            return Data.Library.StateConsole.BetArray[a[0]] * Data.Library.StateConsole.RateArray[a[1]] - Data.Library.StateConsole.BetArray[b[0]] * Data.Library.StateConsole.RateArray[b[1]];
        });

        if (message.player_cent) {
            let cent = Long(message.player_cent.low, message.player_cent.high, message.player_cent.unsigned);
            if (TestOverFlow(cent) == true) {
                Data.Library.StateConsole.PlayerCent = cent;
            }
            console.log('credit ' + Data.Library.StateConsole.PlayerCent);
        }
        Data.Library.StateConsole.MaxBet = Data.Library.StateConsole.BetArray[Data.Library.StateConsole.BetArray.length - 1] * Data.Library.StateConsole.RateArray[Data.Library.StateConsole.RateArray.length - 1] * Data.Library.StateConsole.LineArray[0];

        if (message.accounting_unit != null)
            Data.Library.StateConsole.AccountingUnit = message.accounting_unit;
        console.log('accounting unit ' + Data.Library.StateConsole.AccountingUnit);

        if (message.has_lobby_logged != null)
            Data.Library.StateConsole.LobbyLogged = message.has_lobby_logged;

        Data.Library.StateConsole.LastPay = [];
        if (message.last_bs_result && message.last_bs_result.strip_index !== null) {
            Data.Library.StateConsole.LastRng = message.last_bs_result.rng;
            // Data.Library.StateConsole.LastStripIndex = message.last_bs_result.strip_index;
            console.log('last rng ' + Data.Library.StateConsole.LastRng);

            // let payOfPos = message.last_bs_result.full_symbol_pattern;
            // if (message.last_bs_result.bonus_star_times && message.last_bs_result.bonus_star_times.length > 0) {
            //     Data.Library.StateConsole.LastRng = message.last_bs_result.sub_result[(message.last_bs_result.bonus_star_times.length - 1)].rng;
            //     payOfPos = message.last_bs_result.total_star_times[(message.last_bs_result.bonus_star_times.length - 1)].times;
            // }

            // PickReelInfo(payOfPos, Data.Library.StateConsole.LastPay)
            // console.log(Data.Library.StateConsole.LastPay)
        }
        else {
            Data.Library.StateConsole.LastRng = [1, 3, 12, 23, 13, 13, 1];
            Data.Library.StateConsole.LastPay = [0, 0, 1, 0, 0, 1, 0, 0, 0, 4, 12, 0, 5, 12, 0, 0, 0, 3, 7, 0,
                2, 2, 2, 2, 3, 8, 2, 2];
        }

        Data.Library.StateConsole.isFreeGame = message.is_free_game;
        console.log('is_free_game = ' + Data.Library.StateConsole.isFreeGame);

        if (Data.Library.StateConsole.isFreeGame && message.free_game_info != null) {
            Data.Library.StateConsole.FreeGameInfo.played_times = message.free_game_info.played_times;
            Data.Library.StateConsole.FreeGameInfo.total_times = message.free_game_info.total_times;
            let total_win = Long(message.free_game_info.total_win.low, message.free_game_info.total_win.high, message.free_game_info.total_win.unsigned);
            Data.Library.StateConsole.FreeGameInfo.total_win = total_win;
            Data.Library.StateConsole.FreeGameInfo.ini_cent = Data.Library.StateConsole.PlayerCent;
        }

        if (message.common_datas && message.common_datas[0])
            Data.Library.DEF_FEATUREBUY_MULTIPLE = message.common_datas[0].data;

        if (message.lucky_strike_block_rate !== undefined) {
            Data.Library.LuckyStrikeMaxBetting = message.lucky_strike_block_rate;
            if (Data.Library.LuckyStrikeMaxBetting === 0) {
                find("Canvas/BaseGame/Layer/Shake/UI/BsUI/FeatureBuyButton").active = false;
            }
        }

        Data.Library.StateConsole.ServerRecoverData = message.recover_data;
        if (Data.Library.StateConsole.ServerRecoverData) {
            Data.Library.StateConsole.BetIndex = Data.Library.StateConsole.ServerRecoverData.player_data.bet_index;
            Data.Library.StateConsole.RateIndex = Data.Library.StateConsole.ServerRecoverData.player_data.rate_index;
        }

        if (message.marquee_data && message.marquee_data.length) {
            if (Mode.isEqual(Marquee.currentMarqueeData, message.marquee_data))
                return;
            Marquee.currentMarqueeData = message.marquee_data;
            log(message.marquee_data);
            Marquee.InitMarqueeData();
            Marquee.setMarqueeData(message.marquee_data);
        }

        if (message.law_min_bet != null) {
            Data.Library.StateConsole.miniSpinCost = message.law_min_bet;
        }

        if (message.ups_data) {
            UcoinConsole.initData(message.ups_data);
        }
        else {
            UcoinConsole.enabled = false;
            UcoinConsole.node.active = false;
        }

        send_msg(Proto.encodeEMSGID.eStripsCall);
    }
    else {
        if (StatusCode == Proto.encodeStatusCode.kHostError) {
            Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.HostError, Data.Library.ErrorData.Type.ALARM);
            Mode.ErrorInLoading(Data.Library.ErrorData.Code.HostError.toString());
        }
        else if (StatusCode == Proto.encodeStatusCode.kOutOfDate) {
            Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.OutOfDate, Data.Library.ErrorData.Type.ALARM);
            Mode.ErrorInLoading(Data.Library.ErrorData.Code.OutOfDate.toString());
        }
        else {
            Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.SetConfigError, Data.Library.ErrorData.Type.ALARM);
            Mode.ErrorInLoading(Data.Library.ErrorData.Code.SetConfigError.toString());
        }
    }
};

let StripsCall = function () {
    gToken = Data.Library.CommonLibScript.GetURLParameter('access_token');
    let msg = {
        msgid: "eStripsCall",
        token: gToken
    };
    const message = Proto.encodeStripsCall(msg);
    bksend(message);
};

let StripsRecall = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeStripsRecall(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    netlog("[@StripsRecall] status_code " + StatusCode);
    if (StatusCode == Proto.encodeStatusCode.kSuccess) {
        Data.Library.MathConsole.Striptables = [];
        Data.Library.MathConsole.Striptables.length = 0;
        let allstrips = message.allstrips;
        for (let i = 0; i < allstrips.length; i++) {
            let strips = [];
            let dataArray = allstrips[i];
            let striptable = instantiate(Data.Library.MathConsole.StripTable);
            striptable._id = dataArray.module_id;
            if (dataArray.multi_strips != null && dataArray.multi_strips.length !== 0) {
                for (let j = 0; j < dataArray.multi_strips.length; j++) {
                    for (let k = 0; k < dataArray.multi_strips[j].strips.length; k++) {
                        let tempstrip = [];
                        for (let g = 0; g < dataArray.multi_strips[j].strips[k].strip_arr.length; g++) {
                            if (dataArray.multi_strips[j].strips[k].strip_arr[g] === 0) {
                                tempstrip.push(Data.Library.GameData.SPACEArr[Math.floor(Math.random() * Data.Library.GameData.SPACEArr.length)]);
                            }
                            else {
                                tempstrip.push(dataArray.multi_strips[j].strips[k].strip_arr[g]);
                            }
                        }
                        strips.push(tempstrip);
                    }
                }
            }
            else {
                for (let j = 0; j < dataArray.strips.length; j++) {
                    let tempstrip = [];
                    for (let k = 0; k < dataArray.strips[j].strip_arr.length; k++) {
                        tempstrip.push(dataArray.strips[j].strip_arr[k]);
                    }
                    strips.push(tempstrip);
                }
            }
            striptable.setStrips(strips);
            Data.Library.MathConsole.Striptables.push(striptable);
            Data.Library.MathConsole.Paytables.push({
                _id: striptable._id
            });
        }
        Data.Library.MathConsole.CurModuleid = Data.Library.MathConsole.Striptables[0]._id;
        Data.Library.StateConsole.NetInitReady();
        netlog("[@StripsRecall] status_code ");
    }
    else {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.SetStripError, Data.Library.ErrorData.Type.ALARM);
        Mode.ErrorInLoading(Data.Library.ErrorData.Code.SetStripError.toString());
    }
};

let ResultCall = function (buy) {
    Data.Library.StateConsole.BuyFs = false;
    gToken = Data.Library.CommonLibScript.GetURLParameter('access_token');
    let msg = {
        msgid: "eResultCall",
        token: gToken,
        module_id: Data.Library.MathConsole.CurModuleid,
        bet: Data.Library.StateConsole.BetIndex,
        line: Data.Library.StateConsole.LineIndex,
        rate: Data.Library.StateConsole.RateIndex,
        orientation: 1,
        module_command: []
    };
    if (Data.Library.MathConsole.CurModuleid == "BS") {
        let moudle = {
            id: "kSetMultiBet",
            MultiBetList: [CommonVariableData.playerAction(), Data.Library.StateConsole.minifps]
        };
        let module = ProtoModule.encodeSetMultiBetCommand(moudle);
        msg.module_command.push(module);
    }
    let sdx = 255;
    if (buy == true) {
        sdx = Data.Library.StateConsole.featureBuyType;
    }
    let moudle = {
        id: "kSpinIndex",
        spin_idx: sdx
    };
    let module = ProtoModule.encodeSpinIndexCommand(moudle);
    msg.module_command.push(module);

    console.log("ResultCall");
    const message = Proto.encodeResultCall(msg);
    bksend(message);
};


let ResultRecall = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeResultRecall(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    netlog("[@ResultRecall] status_code " + StatusCode);
    if (StatusCode == Proto.encodeStatusCode.kSuccess) {
        Data.Library.StateConsole.minifps = 60;
        let windata = Data.Library.MathConsole.getWinData();
        let cent = Long(message.player_cent.low, message.player_cent.high, message.player_cent.unsigned);
        if (TestOverFlow(cent) == true) {
            if (Data.Library.StateConsole.CurState == Mode.FSM.K_SPIN) {
                Data.Library.StateConsole.PlayerCent = cent;
                if (Data.Library.StateConsole.isFreeGame == true) {
                    Data.Library.StateConsole.FreeGameInfo.ini_cent = cent;
                    let win = Data.Library.StateConsole.FreeGameInfo.total_win;
                    Data.Library.StateConsole.PlayerCent = cent + win;
                }
            }
        }

        let totalWin = Long(message.result.credit.low, message.result.credit.high, message.result.credit.unsigned);
        let jackpotWin: number = 0;
        if (Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE) {
            Data.Jackpot.jackpotCentIn = [];
            Data.RedPacket.RedPackCentIn = [];
            if (Data.Jackpot.preJpWinMoney > 0) {
                if (!UCoin.running) Data.Library.StateConsole.PlayerCent -= Data.Jackpot.preJpWinMoney;
                jackpotWin = jackpotWin + Data.Jackpot.preJpWinMoney;
            }
            if (message.result.cent_in_ask && message.result.cent_in_ask.length > 0) {
                for (let i = 0; i < message.result.cent_in_ask.length; i++) {
                    if (message.result.cent_in_ask[i].type == 'eJackpot') {
                        Data.Jackpot.jackpotCentIn.push(message.result.cent_in_ask[i]);
                        Data.Jackpot.jackpotCentIn[i].cent = Long(Data.Jackpot.jackpotCentIn[i].cent.low, Data.Jackpot.jackpotCentIn[i].cent.high, Data.Jackpot.jackpotCentIn[i].cent.unsigned);
                        Data.Jackpot.jackpotCentIn[i].tid = Long(Data.Jackpot.jackpotCentIn[i].tid.low, Data.Jackpot.jackpotCentIn[i].tid.high, Data.Jackpot.jackpotCentIn[i].tid.unsigned);
                        if (!UCoin.running) Data.Library.StateConsole.PlayerCent -= Data.Jackpot.jackpotCentIn[i].cent;
                        jackpotWin += Data.Jackpot.jackpotCentIn[i].cent;
                        netlog("JackpotCentIn " + Data.Jackpot.jackpotCentIn[i].cent);
                    } else if (message.result.cent_in_ask[i].type == 'eRedPacket') {
                        Data.RedPacket.RedPackCentIn.push(message.result.cent_in_ask[i]);
                        Data.RedPacket.RedPackCentIn[i].cent = Long(Data.RedPacket.RedPackCentIn[i].cent.low, Data.RedPacket.RedPackCentIn[i].cent.high, Data.RedPacket.RedPackCentIn[i].cent.unsigned);
                        Data.RedPacket.RedPackCentIn[i].tid = Long(Data.RedPacket.RedPackCentIn[i].tid.low, Data.RedPacket.RedPackCentIn[i].tid.high, Data.RedPacket.RedPackCentIn[i].tid.unsigned);
                        /**後端說紅包金額不會加進UCOIN */
                        Data.Library.StateConsole.PlayerCent -= Data.RedPacket.RedPackCentIn[i].cent;
                        netlog("JackpotCentIn " + Data.RedPacket.RedPackCentIn[i].cent);
                    }
                }
            }
        }
        if (message.ups_data && Data.Library.StateConsole.CurScene == Mode.SCENE_ID.BASE) {
            UcoinConsole.updateData(message.ups_data, message.next_module, totalWin, jackpotWin);
        }
        netlog("PlayerCent " + Data.Library.StateConsole.PlayerCent);
        FillWinData(windata, message.result);
        windata._nextmodule = message.next_module;
        Data.Library.MathConsole.NextModuleid = message.next_module;
        Data.Library.StateConsole.NetReceiveResult();

        if (message.marquee_data && message.marquee_data.length) {
            if (Mode.isEqual(Marquee.currentMarqueeData, message.marquee_data))
                return;
            Marquee.currentMarqueeData = message.marquee_data;
            log(message.marquee_data);
            Marquee.InitMarqueeData();
            Marquee.setMarqueeData(message.marquee_data);
        }
    } else {
        if (StatusCode == 3) {
            let cent = Long(message.player_cent.low, message.player_cent.high, message.player_cent.unsigned);
            Data.Library.StateConsole.PlayerCent = cent;
            Data.Library.StateConsole.setCredit(Data.Library.StateConsole.PlayerCent);
            find("Canvas/BaseGame/Layer/Shake/UI/InfoController/WinBtn/Win").getComponent(Label).string = Data.Library.StateConsole.NumberToCent(0);
            find("Canvas/Notice/BlackBg").active = true;
            find("Canvas/Notice/InfoNoBalance").active = true;

            if (Data.Library.StateConsole.isAutoPlay == true) {
                find("Canvas/BaseGame/Page/AutoPage").getComponent(AutoPages).AutoStop();
            }
            Data.Library.MathConsole.ResetWinData();
            Data.Library.StateConsole.CurState = Mode.FSM.K_IDLE;
            Data.Library.StateConsole.reelPassSpin();
            Data.Library.StateConsole.notifyStateChange();
        } else {
            Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.GetResultError, Data.Library.ErrorData.Type.ALARM);
            Mode.ErrorInLoading(Data.Library.ErrorData.Code.GetResultError.toString());
        }
    }
};

let DataCall = function () {
    gToken = Data.Library.CommonLibScript.GetURLParameter('access_token');
    let msg = {
        msgid: "eDataCall",
        token: gToken
    };
    const message = Proto.encodeDataCall(msg);
    bksend(message);
};

let DataRecall = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeDataRecall(uint8);
    if (message.ups_data) {
        if (message.ups_data.is_transfer == true) {
            UcoinConsole.updateData(message.ups_data, "CK", Data.Library.StateConsole.FeatureTotalWin);
        }
    }
};

let StateCall = function () {
    gToken = Data.Library.CommonLibScript.GetURLParameter('access_token');
    let msg = {
        msgid: "eStateCall",
        token: gToken,
        stateid: Mode.FSM[Data.Library.StateConsole.CurState],
        reserved: 0
    };
    netlog("STATEConsole.CurState : " + Mode.FSM[Data.Library.StateConsole.CurState]);
    const message = Proto.encodeStateCall(msg);
    bksend(message);
};

let StateRecall = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeStateRecall(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    netlog("[@StateRecall] status_code " + StatusCode);
    if (StatusCode != Proto.encodeStatusCode.kSuccess) {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.SetStateError, Data.Library.ErrorData.Type.ALARM);
        Mode.ErrorInLoading(Data.Library.ErrorData.Code.SetStateError.toString());
    }
};

let PickReelInfo = function(ary96: number[], ansAry: number[]): void {  //將陣列96個數字處理成所需要的滾輪數量並放入所需求的位置
    if(ary96.length == 0) { return }

    let tmpAry: number[] = [];
    let dataLen = 8;

    let count = 1;
    for(let i = 0; i < ary96.length; i++) {  //如果滾輪上面有多一排 需修改
        let index = i + 8;
        if(index % dataLen == 7) { continue; }
        if(index >= dataLen * (reelRow + 1)) { break; }
        if(index % dataLen == 6) {
            tmpAry.push(ary96[count++]);
            continue;
        }
        tmpAry.push(ary96[index])
    }

    for(let i = 0; i <  reelRow * reelCol; i++){
        let _pos = Math.floor(i / reelRow) + (i % reelRow) * reelCol;  //把橫的答案轉成跟滾輪一樣是直的
        ansAry.push(tmpAry[_pos]);
    }
}

let FillWinData = function (win_data, slot_result_proto) {
    console.log(slot_result_proto)
    win_data._rng = slot_result_proto.rng;

    win_data.strip_index = slot_result_proto.strip_index != undefined ?slot_result_proto.strip_index :0

    Data.Library.MathConsole.getWinData()._scatter_sound = [-1, -1, -1, -1, -1];
    Data.Library.MathConsole.getWinData()._slowmotion_flag = [0, 0, 0, 0, 0];

    if (slot_result_proto.win_bonus_group && slot_result_proto.win_bonus_group.length) {
        win_data._triggerTimes = slot_result_proto.win_bonus_group[0].times;
    }

    //確認slowmotion: 別的遊戲此區需修改
    let check = 0;
    let check2 = 0;
    let stripStart = win_data.strip_index * reelCol;
    let TempStrip = Data.Library.MathConsole.getStriptable(slot_result_proto.module_id)._strips;
    for (let i = 0; i < Data.Library.REEL_CONFIG.REEL_COL_FAKE; i++) {
        let RngStart = slot_result_proto.rng[i] - 1;
        if (check == 2 && i == 2) { //check == 2 是因為確認前面已經有兩個bonus symbol, i == 2 是因為此遊戲只有前三排有機率出現bonus symbol
            check2 += 1;
            Data.Library.MathConsole.getWinData()._slowmotion_flag[i] = check2;
        }
        for (let j = 0; j < reelRow; j++) {
            let stripIndex = (RngStart + j + TempStrip[(stripStart + i)].length) % TempStrip[(stripStart + i)].length;
            console.log(TempStrip[(stripStart + i)][stripIndex])
            if (TempStrip[(stripStart + i)][stripIndex] == 1) {  //等於多少要確認! 有些遊戲Bonus strip是1 有些是0
                console.log(i, j)
                check++;
                Data.Library.MathConsole.getWinData()._scatter_sound[i] = check;
            }
        }
    }

    DropSymbolMap.CurrIndex = 0;
    
    DropSymbolMap.Multiplier = [];  //倍率
    DropSymbolMap.WinLineGroup = [];  //單條線資料
    DropSymbolMap.HaveChange = false;//是否有變盤資料

    DropSymbolMap.Multiplier.push(slot_result_proto.multiplier_alone);

    win_data._scatterWin = 0;
    win_data._wintotalcredit = 0;

    let totalCredit_long = slot_result_proto.credit;
    let totalCredit = Long(totalCredit_long.low, totalCredit_long.high, totalCredit_long.unsigned);
    if (!TestOverFlow(totalCredit)){ totalCredit = 0; }
    win_data._wintotalcredit = totalCredit;
    
    let winLineAry = slot_result_proto.win_line_group;
    if(winLineAry && winLineAry.length > 0) {
        for(let i = 0; i < winLineAry.length; i++) {
            let obj: WinPosObj = {
                pos: [],
                credit: 0,
                mul: 0,
                change: false,
                symbolId: -1,
                isFiveLine: false,
            }

            let fiveLineCheckAry = [];

            for(let j = 0; j < winLineAry[i].pos.length; j++) {  //將後端給的值轉成滾輪的值
                let pos = winLineAry[i].pos[j];
                let col = Math.floor(pos / 10);
                let row = pos % 10;

                let index = col * 5 + row;
                obj.pos.push(index);

                if(fiveLineCheckAry.indexOf(col) == -1) { fiveLineCheckAry.push(col); }
            }

            let credit_long = winLineAry[i].credit_long;
            let credit = Long(credit_long.low, credit_long.high, credit_long.unsigned);
            if (!TestOverFlow(credit)){ credit = 0; }  //超過1兆就變回0
            
            obj.credit = credit;

            if(winLineAry[i].multiplier != null) { obj.mul = winLineAry[i].multiplier; }

            obj.symbolId = winLineAry[i].symbol_id;
            if(winLineAry[i].line_no == 999) {  //如果line_no 為999 則需要變盤
                obj.change = true;            
                DropSymbolMap.HaveChange=true; 
            }

            if(fiveLineCheckAry.length >= reelCol) {  
                obj.isFiveLine = true;                 
            }            

            if(obj.symbolId==1 || winLineAry[i].line_no == 999){
                DropSymbolMap.WinLineGroup.push(obj);
            }else{
                DropSymbolMap.WinLineGroup.unshift(obj);
            }

            //沒有triggerTimes仍能進K_FEATURE_RETRIGGER
            if(obj.symbolId==1){
                win_data._wintype = Mode.PAYTYPE.K_xTOTALBET_BONUSTIMES;
            }
        }
    }
    console.log(DropSymbolMap)
}


let GetJackpotInfo = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeJackpotInfo(uint8);
    let StatusCode = Proto.encodeStatusCode[message.status_code];
    netlog("[@JackpotInfo] status_code " + StatusCode);
    if (StatusCode == Proto.encodeStatusCode.kSuccess) {
        log(message)
        if (message.lucky_draw_config) {
            Data.RedPacket.LuckyDraw = message.lucky_draw_config;
            if (message.type == "eRedPacket" || message.type == "eLuckyDraw") {
                Data.RedPacket.LuckyDraw.end_time = Long(Data.RedPacket.LuckyDraw.end_time.low, Data.RedPacket.LuckyDraw.end_time.high, Data.RedPacket.LuckyDraw.end_time.unsigned);
                Data.RedPacket.LuckyDraw.begin_time = Long(Data.RedPacket.LuckyDraw.begin_time.low, Data.RedPacket.LuckyDraw.begin_time.high, Data.RedPacket.LuckyDraw.begin_time.unsigned);
                Data.RedPacket.LuckyDraw.server_time = Long(Data.RedPacket.LuckyDraw.server_time.low, Data.RedPacket.LuckyDraw.server_time.high, Data.RedPacket.LuckyDraw.server_time.unsigned);
            }
            JackpotConsole.updateData();
        }

        if (message.type == 'eJackpot' && message.pool_list[0].enable) {
            if(!JackPotNode) {
                assetManager.loadBundle('Jackpot/jackpotDynamic', (err, bundle) => {
                    if(err) {
                        console.error("Jackpot Bundle 加載失败:", err);
                        return;
                    }

                    bundle.load('prefab/JackPotX', Prefab, (err, prefab) => {
                        let node = instantiate(prefab);

                        let canvas = find("Canvas")
                        canvas.addChild(node);

                        let JackPotX = canvas.getChildByName("JackPotX")
                        JackPotX.setSiblingIndex(canvas.getChildByName("Activity").getSiblingIndex() + 1);
                        find("EventController").getComponent(EventController).BsArrary.push(JackPotX)

                        JackPotNode = JackPotX.getComponent(JackPot)
                        let jpmode = typeof window["psapi"] !== 'undefined' ?window["psapi"].hostInfo.host_resource.jp_mode :0;
                        let mode = g_getJackpotmode();
                        JackPotNode.jackpotFrameInit(message.pool_list, jpmode, mode);
                        JackPotNode.node.active = true;
                    })
                })
            } else {
                JackPotNode.compareNewValue(message.pool_list);
            }
        }
    } else if (StatusCode == 2) {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.JackpotServerOffline, Data.Library.ErrorData.Type.ALARM);
        Mode.ErrorInLoading(Data.Library.ErrorData.Code.JackpotServerOffline.toString());
    } else {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.JackpotDataError, Data.Library.ErrorData.Type.ALARM);
        Mode.ErrorInLoading(Data.Library.ErrorData.Code.JackpotDataError.toString());
    }
};

let GetJackpotNotify = function (evt) {  //獲取WinBy資訊
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeJackpotNotify(uint8);
    console.log(message)
    if (message.pool_id != 3 && message.type == 0) {
        JackPotNode.showWinBy(true, message.pool_id);
    }
}

enum JPMode {
    CENT = 0,
    KMBT = 1
}

let g_getJackpotmode=function(){
    var mode = Data.Library.CommonLibScript.GetURLParameter("sm");
    if(mode.length == 0){
        //for local test
        return  JPMode.CENT;
    }

    if(mode.substr(2,1) == '1' || mode.substr(2,1) == '2' || mode.substr(2,1) == '3' || mode.substr(2,1) == '4') {
        return  JPMode.KMBT;
    } else {
        return  JPMode.CENT;
    }
};

let g_getCreditmode = function () {
    let mode = Data.Library.CommonLibScript.GetURLParameter("sm");
    if (mode.length == 0) {
        Data.Library.CREDITMODE = Mode.CreditMode.Cent;
    }
    else if (mode.substr(0, 1) == '0') {
        Data.Library.CREDITMODE = Mode.CreditMode.Cent;
    }
    else if (mode.substr(0, 1) == '1') {
        Data.Library.CREDITMODE = Mode.CreditMode.Dollar;
    }
    else if (mode.substr(0, 1) == '2') {
        Data.Library.CREDITMODE = Mode.CreditMode.Credit;
    }
};

let g_getDigimode = function () {
    let mode = Data.Library.CommonLibScript.GetURLParameter("sm");
    if (mode.length == 0) {
        Data.Library.DIGIMODE = Mode.DigiMode.DOT;
    }
    else if (mode.substr(1, 1) == '1') {
        Data.Library.DIGIMODE = Mode.DigiMode.COMMA;
    }
    else {
        Data.Library.DIGIMODE = Mode.DigiMode.DOT;
    }
};


let bksend = function (msg) {
    if (socket.readyState == WebSocket.OPEN) {
        socket.send(msg);
    }
    else {
        netlog("Not Connected");
    }
};

let dispatch_msg = function (evt) {
    let uint8 = RecombineBuffer(evt.data);
    const message = Proto.decodeHeader(uint8);
    action_dispatch(Proto.encodeEMSGID[message.msgid], evt);
};

let netlog = function (str) {
    console.log("*netlog* -> " + str);
};

let RecombineBuffer = function (buf) {
    return new Uint8Array(buf);
}

let Long = function (low, high, unsigned) {
    low = low | 0;
    high = high | 0;
    unsigned = !!unsigned;
    if (unsigned)
        return ((high >>> 0) * 4294967296) + (low >>> 0);
    return high * 4294967296 + (low >>> 0);
}

let TestOverFlow = function (num) {
    if (num >= 1000000000000) {
        Data.Library.ErrorData.bklog(Data.Library.ErrorData.Code.Overflow, Data.Library.ErrorData.Type.ALARM);
        return false;
    }
    return true;
};