#!/usr/bin/env python3
"""
遊戲 Spin Server - FastAPI 後端伺服器
接收前端 spin 請求並回傳遊戲結果資料

啟動方法:
    python spin_server.py

API 端點:
    POST /api/spin - 執行遊戲旋轉並回傳結果
    GET /api/health - 健康檢查
    GET /api/status - 取得伺服器狀態

測試方法:
    curl -X POST http://localhost:8000/api/spin \
         -H "Content-Type: application/json" \
         -d '{"bet": 50, "spin_type": "normal"}'
"""

import sys
import os
from typing import Dict, Any, Optional
from datetime import datetime
import json
import logging
from contextlib import asynccontextmanager

# 設定日誌
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 添加專案根目錄到路徑
project_root = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_root)

from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

from core.game_engine import GameEngine, SpinType
from protocol.simple_data_exporter import SimpleDataExporter
from protocol.simple_proto import (
    EMSGID, StatusCode, ESTATEID,
    LoginRecall, StateRecall, ResultRecall, SlotResult,
    parse_protobuf_message
)


# ==================== 資料模型 ====================

class SpinRequest(BaseModel):
    """Spin 請求資料結構"""
    bet: int = Field(default=50, ge=1, le=10000, description="下注金額")
    spin_type: str = Field(default="normal", description="旋轉類型: normal, feature_60x, feature_80x, feature_100x")
    player_id: Optional[str] = Field(default=None, description="玩家ID（可選）")
    session_id: Optional[str] = Field(default=None, description="會話ID（可選）")


class InitBoardResponse(BaseModel):
    """初始盤面回應資料結構"""
    success: bool = Field(description="是否成功")
    message: str = Field(description="回應訊息")
    data: Dict[str, Any] = Field(description="初始盤面資料")
    timestamp: str = Field(description="時間戳記")
    session_id: Optional[str] = Field(default=None, description="會話ID")


class SpinResponse(BaseModel):
    """Spin 回應資料結構"""
    success: bool = Field(description="是否成功")
    data: Optional[Dict[str, Any]] = Field(default=None, description="遊戲結果資料")
    error: Optional[str] = Field(default=None, description="錯誤訊息")
    timestamp: str = Field(description="時間戳記")
    session_id: Optional[str] = Field(default=None, description="會話ID")


class HealthResponse(BaseModel):
    """健康檢查回應"""
    status: str
    timestamp: str
    version: str


class StatusResponse(BaseModel):
    """伺服器狀態回應"""
    status: str
    total_spins: int
    total_wins: int
    uptime_seconds: float
    engine_ready: bool


# ==================== 全域變數 ====================

game_engine: Optional[GameEngine] = None
simple_exporter: Optional[SimpleDataExporter] = None
server_stats = {
    "total_spins": 0,
    "total_wins": 0,
    "start_time": datetime.now()
}


# ==================== 生命週期管理 ====================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """伺服器生命週期管理"""
    global game_engine, simple_exporter, server_stats
    
    # 啟動
    try:
        print("🎮 初始化遊戲引擎...")
        game_engine = GameEngine()
        simple_exporter = SimpleDataExporter()
        server_stats['start_time'] = datetime.now()
        print("✅ 遊戲引擎初始化成功！")
    except Exception as e:
        print(f"❌ 遊戲引擎初始化失敗: {e}")
        raise
    
    yield
    
    # 關閉
    print(f"\n📊 伺服器統計:")
    print(f"   總旋轉次數: {server_stats['total_spins']}")
    print(f"   總贏分次數: {server_stats['total_wins']}")
    print(f"   運行時長: {(datetime.now() - server_stats['start_time']).total_seconds():.2f} 秒")


# ==================== FastAPI 應用 ====================

app = FastAPI(
    title="好運咚咚 Spin Server",
    description="遊戲旋轉後端伺服器 API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS 設定 - 允許前端跨域請求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生產環境建議設定具體的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== API 端點 ====================

@app.get("/", tags=["Root"])
async def root():
    """根路徑"""
    return {
        "message": "好運咚咚 Spin Server",
        "version": "1.0.0",
        "endpoints": {
            "spin": "POST /api/spin",
            "health": "GET /api/health",
            "status": "GET /api/status"
        }
    }


@app.get("/api/health", response_model=HealthResponse, tags=["System"])
async def health():
    """健康檢查端點"""
    return HealthResponse(
        status="ok",
        timestamp=datetime.now().isoformat(),
        version="1.0.0"
    )


@app.get("/api/init", response_model=InitBoardResponse, tags=["Game"])
async def get_initial_board(session_id: Optional[str] = None):
    """
    獲取初始盤面資料
    
    當遊戲初始化時調用，返回一個固定的初始盤面供前端顯示
    
    Returns:
        InitBoardResponse: 初始盤面資料
        
    Example:
        GET /api/init?session_id=xxx
    """
    
    # 固定的初始盤面資料 (3x5 盤面，無贏分)
    initial_board = {
        "module_id": "BS",
        "credit": 0,
        "rng": [
            7, 8, 9,      # 第1輪: H2, H3, H4
            5, 6, 7,      # 第2輪: H1, H2, H3
            3, 4, 5,      # 第3輪: M2, M3, H1
            1, 2, 3,      # 第4輪: M1, L2, M2
            0, 1, 2       # 第5輪: L1, M1, L2
        ],
        "win": 0,
        "winLineGrp": [],
        "multiplierAlone": 1,
        "mulitplierPattern": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "next_module": "BS",
        "winBonusGrp": [],
        "jp_count": 0,
        "jp": 0
    }
    
    print(f"📋 返回初始盤面資料 - session: {session_id or 'N/A'}")
    
    return InitBoardResponse(
        success=True,
        message="初始盤面資料獲取成功",
        data=initial_board,
        timestamp=datetime.now().isoformat(),
        session_id=session_id
    )


@app.get("/api/status", response_model=StatusResponse, tags=["System"])
async def get_status():
    """取得伺服器狀態"""
    uptime = (datetime.now() - server_stats['start_time']).total_seconds()
    
    return StatusResponse(
        status="running",
        total_spins=server_stats['total_spins'],
        total_wins=server_stats['total_wins'],
        uptime_seconds=uptime,
        engine_ready=game_engine is not None
    )


@app.post("/api/spin", response_model=SpinResponse, tags=["Game"])
async def spin(request: SpinRequest):
    """
    執行遊戲旋轉並回傳結果
    
    Args:
        request: Spin 請求資料
        
    Returns:
        SpinResponse: 遊戲結果資料
        
    Example:
        POST /api/spin
        {
            "bet": 50,
            "spin_type": "normal",
            "player_id": "player123",
            "session_id": "session456"
        }
    """
    
    # 檢查遊戲引擎是否已初始化
    if game_engine is None:
        raise HTTPException(status_code=500, detail="遊戲引擎未初始化")
    
    try:
        # 解析 spin_type
        spin_type_map = {
            "normal": SpinType.NORMAL,
            "feature_60x": SpinType.FEATURE_BUY_60X,
            "feature_80x": SpinType.FEATURE_BUY_80X,
            "feature_100x": SpinType.FEATURE_BUY_100X
        }
        
        spin_type = spin_type_map.get(request.spin_type.lower(), SpinType.NORMAL)
        
        # 執行遊戲旋轉
        print(f"🎲 執行 Spin - bet: {request.bet}, type: {request.spin_type}")
        
        # 設定下注金額
        game_engine.current_bet = request.bet
        
        # 執行旋轉
        if game_engine.free_spins_remaining > 0:
            # 如果有剩餘免費旋轉，執行免費旋轉
            spin_result = game_engine.spin_free_game()
        else:
            # 否則執行正常旋轉
            spin_result = game_engine.spin(spin_type)
        
        # 轉換為輸出格式
        game_result = {
            "module_id": "BS",  # 基礎遊戲
            "player_balance": game_engine.player_credit,
            "rng": _convert_reels_to_rng(spin_result.reel_result),
            "total_win": spin_result.total_credit,
            "win_lines": _convert_win_lines(spin_result.win_lines),
            "multiplier": spin_result.multiplier,
            "next_module": "BS",
            "free_spins": {
                "remaining": game_engine.free_spins_remaining,
                "awarded": spin_result.free_spins_awarded
            } if spin_result.is_feature_trigger or game_engine.free_spins_remaining > 0 else None
        }
        
        # 使用 SimpleDataExporter 轉換格式
        output_data = simple_exporter._convert_game_result(game_result)
        
        # 更新統計
        server_stats['total_spins'] += 1
        if spin_result.total_credit > 0:
            server_stats['total_wins'] += 1
        
        # 回傳結果
        return SpinResponse(
            success=True,
            data=output_data,
            error=None,
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id
        )
        
    except Exception as e:
        print(f"❌ Spin 執行錯誤: {e}")
        import traceback
        traceback.print_exc()
        
        return SpinResponse(
            success=False,
            data=None,
            error=str(e),
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id
        )


# ==================== 輔助函數 ====================

def _convert_reels_to_rng(reel_result: list) -> list:
    """
    將 5x3 滾輪結果轉換為一維 RNG 陣列
    
    Args:
        reel_result: 5x3 滾輪結果 [[sym1, sym2, sym3], ...]
        
    Returns:
        一維陣列 [sym1, sym2, sym3, sym4, ...]
    """
    rng = []
    # 轉置：從按列到按行
    for row_idx in range(3):  # 3 rows
        for col_idx in range(5):  # 5 reels
            if col_idx < len(reel_result) and row_idx < len(reel_result[col_idx]):
                rng.append(reel_result[col_idx][row_idx])
    return rng


def _convert_win_lines(win_lines: list) -> list:
    """
    轉換贏線格式
    
    Args:
        win_lines: WinLine 物件列表
        
    Returns:
        轉換後的贏線資料
    """
    converted = []
    for line in win_lines:
        converted.append({
            "symbol_id": line.symbol_id,
            "count": line.count,
            "positions": line.positions,
            "credit": line.credit,
            "multiplier": 1  # 可根據需要調整
        })
    return converted


# ==================== WebSocket 端點 ====================

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket 端點 - 使用 Protobuf 格式通訊
    
    接收: Protobuf 二進制訊息 (LoginCall, StateCall)
    發送: Protobuf 二進制訊息 (LoginRecall, StateRecall)
    """
    await websocket.accept()
    logger.info(f"🔌 WebSocket 連接建立: {websocket.client}")
    
    # 存儲最後一次 Spin 結果（用於 ResultCall）
    last_spin_result = None
    
    try:
        while True:
            # 接收訊息（可能是 bytes 或 text）
            message_data = await websocket.receive()
            
            # 檢查訊息類型
            if "bytes" in message_data:
                data = message_data["bytes"]
                logger.info(f"📨 收到 Protobuf 訊息 ({len(data)} bytes)")
            elif "text" in message_data:
                # 如果收到 text，記錄並跳過
                text_data = message_data["text"]
                logger.warning(f"⚠️ 收到文字訊息: {text_data[:100] if len(text_data) > 100 else text_data}")
                continue
            else:
                logger.error("❌ 未知的訊息類型")
                continue
            
            try:
                # 解析 Protobuf 訊息
                message = parse_protobuf_message(data)
                msgid = message.get("msgid", 0)
                
                logger.info(f"🔍 解析訊息: msgid={msgid}, data={message}")
                
                # 處理不同的訊息類型
                if msgid == EMSGID.eLoginCall:
                    # 登入請求
                    logger.info("🔐 處理登入請求")
                    login_recall = LoginRecall(
                        msgid=EMSGID.eLoginRecall,
                        status_code=StatusCode.kSuccess,
                        token=message.get("token", "")
                    )
                    response_data = login_recall.SerializeToString()
                    await websocket.send_bytes(response_data)
                    logger.info(f"✅ 登入成功 - 發送 {len(response_data)} bytes")
                
                elif msgid == EMSGID.eStateCall:
                    # 狀態請求（包含 spin）
                    stateid = message.get("stateid", 0)
                    logger.info(f"🎮 StateCall - stateid={stateid}")
                    
                    if stateid == ESTATEID.K_SPIN:
                        # 執行 spin
                        bet = message.get("bet", 50)
                        spin_type = message.get("spin_type", "normal")
                        
                        logger.info(f"🎰 執行 Spin: bet={bet}, type={spin_type}")
                        
                        # 執行遊戲邏輯
                        if game_engine is None:
                            logger.error("❌ 遊戲引擎未初始化")
                            state_recall = StateRecall(
                                msgid=EMSGID.eStateRecall,
                                status_code=StatusCode.kInvalid
                            )
                            await websocket.send_bytes(state_recall.SerializeToString())
                            continue
                        
                        # 執行旋轉
                        try:
                            spin_type_enum = SpinType.NORMAL
                            if spin_type == "feature_60x":
                                spin_type_enum = SpinType.FEATURE_60X
                            elif spin_type == "feature_80x":
                                spin_type_enum = SpinType.FEATURE_80X
                            elif spin_type == "feature_100x":
                                spin_type_enum = SpinType.FEATURE_100X
                            
                            
                            result = game_engine.execute_spin(bet, spin_type_enum)
                            
                            # 轉換結果為簡化格式
                            result_data = simple_exporter.export_spin_result(result)
                            
                            # 存儲結果供 ResultCall 使用
                            last_spin_result = {
                                'reel_results': result_data.get('reel_results', []),
                                'total_win': result_data.get('win', 0),
                                'player_credit': 1000000  # 暫時固定
                            }
                            
                            # 更新統計
                            server_stats['total_spins'] += 1
                            if result_data.get('win', 0) > 0:
                                server_stats['total_wins'] += 1
                            
                            # 發送 StateRecall (Protobuf)
                            state_recall = StateRecall(
                                msgid=EMSGID.eStateRecall,
                                status_code=StatusCode.kSuccess
                            )
                            response_data = state_recall.SerializeToString()
                            await websocket.send_bytes(response_data)
                            logger.info(f"✅ Spin 完成 - Win: {result_data.get('win', 0)}, 發送 {len(response_data)} bytes")
                            
                        except Exception as e:
                            logger.error(f"❌ Spin 執行失敗: {str(e)}")
                            state_recall = StateRecall(
                                msgid=EMSGID.eStateRecall,
                                status_code=StatusCode.kInvalid
                            )
                            await websocket.send_bytes(state_recall.SerializeToString())
                    
                    else:
                        # 其他狀態，直接回覆成功
                        logger.info(f"📋 其他狀態: {stateid}")
                        state_recall = StateRecall(
                            msgid=EMSGID.eStateRecall,
                            status_code=StatusCode.kSuccess
                        )
                        await websocket.send_bytes(state_recall.SerializeToString())
                
                # 處理 ResultCall
                elif msgid == EMSGID.eResultCall:
                    logger.info("🎮 處理 ResultCall")
                    
                    if last_spin_result is None:
                        logger.error("❌ 沒有可用的 Spin 結果")
                        # 發送錯誤回應
                        slot_result = SlotResult(rng=[], credit=0)
                        result_recall = ResultRecall(
                            msgid=EMSGID.eResultRecall,
                            status_code=StatusCode.kInvalid,
                            result=slot_result,
                            player_cent=0
                        )
                    else:
                        # 使用存儲的 Spin 結果
                        logger.info(f"📊 Spin 結果: reel={last_spin_result['reel_results']}, win={last_spin_result['total_win']}")
                        slot_result = SlotResult(
                            rng=last_spin_result['reel_results'],
                            credit=last_spin_result['total_win']
                        )
                        result_recall = ResultRecall(
                            msgid=EMSGID.eResultRecall,
                            status_code=StatusCode.kSuccess,
                            result=slot_result,
                            player_cent=last_spin_result.get('player_credit', 1000000)
                        )
                    
                    response_data = result_recall.SerializeToString()
                    await websocket.send_bytes(response_data)
                    logger.info(f"✅ ResultRecall 發送 - {len(response_data)} bytes, rng count: {len(last_spin_result.get('reel_results', []))}")
                
                else:
                    # 未知訊息類型
                    logger.warning(f"⚠️ 未知的訊息類型: {msgid}")
                    state_recall = StateRecall(
                        msgid=EMSGID.eStateRecall,
                        status_code=StatusCode.kInvalid
                    )
                    await websocket.send_bytes(state_recall.SerializeToString())
            
            except Exception as e:
                logger.error(f"❌ 解析訊息失敗: {str(e)}")
                logger.error(f"原始資料: {data.hex()}")
                state_recall = StateRecall(
                    msgid=EMSGID.eStateRecall,
                    status_code=StatusCode.kInvalid
                )
                await websocket.send_bytes(state_recall.SerializeToString())
    
    except WebSocketDisconnect:
        logger.info(f"🔌 WebSocket 連接斷開: {websocket.client}")
    except Exception as e:
        logger.error(f"❌ WebSocket 錯誤: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
    finally:
        logger.info("🔌 清理 WebSocket 連接")


# ==================== 主程式 ====================

def main():
    """啟動伺服器"""
    print("\n" + "=" * 60)
    print("🎮 好運咚咚 Spin Server")
    print("=" * 60)
    print(f"📍 位置: {os.getcwd()}")
    print(f"🚀 啟動中...")
    print("=" * 60 + "\n")
    
    # 啟動 FastAPI 伺服器
    uvicorn.run(
        app,
        host="0.0.0.0",  # 監聽所有網路介面
        port=8000,
        log_level="info"
    )


if __name__ == "__main__":
    main()
