exports.encodeEMSGID = {
  eLoginCall: 100,
  eLoginRecall: 101,
  eConfigCall: 102,
  eConfigRecall: 103,
  eStripsCall: 104,
  eStripsRecall: 105,
  eResultCall: 106,
  eResultRecall: 107,
  eOptionCall: 108,
  eOptionRecall: 109,
  eCheckCall: 110,
  eCheckRecall: 111,
  eStateCall: 112,
  eStateRecall: 113,
  eSuicideCall: 114,
  eDataCall: 115,
  eDataRecall: 116,
  eCentInAsk: 200,
  eCentInReask: 201,
  eJackpotInfo: 202,
  eJackpotNotify: 203,
  eMemberInfoAsk: 301,
};

exports.decodeEMSGID = {
  100: "eLoginCall",
  101: "eLoginRecall",
  102: "eConfigCall",
  103: "eConfigRecall",
  104: "eStripsCall",
  105: "eStripsRecall",
  106: "eResultCall",
  107: "eResultRecall",
  108: "eOptionCall",
  109: "eOptionRecall",
  110: "eCheckCall",
  111: "eCheckRecall",
  112: "eStateCall",
  113: "eStateRecall",
  114: "eSuicideCall",
  115: "eDataCall",
  116: "eDataRecall",
  200: "eCentInAsk",
  201: "eCentInReask",
  202: "eJackpotInfo",
  203: "eJackpotNotify",
  301: "eMemberInfoAsk",
};

exports.encodeESTATEID = {
  K_IDLE: 0,
  K_SPIN: 1,
  K_SPINSTOPING: 2,
  K_PRE_SHOWWIN: 3,
  K_SHOWWIN: 4,
  K_WAIT: 5,
  K_FEATURE_TRIGGER: 6,
  K_FEATURE_SHOWSCATTERWIN: 7,
  K_FEATURE_TRANSLATE: 8,
  K_FEATURE_WAIT_START: 9,
  K_FEATURE_SPIN: 10,
  K_FEATURE_SPINSTOPING: 11,
  K_FEATURE_PRE_SHOWWIN: 12,
  K_FEATURE_SHOWWIN: 13,
  K_FEATURE_WAIT: 14,
  K_FEATURE_CHEKRESULT: 15,
  K_FEATURE_RETRIGGER: 16,
  K_FEATURE_SHOW_RETIGGER: 17,
  K_ENDGAME: 18,
  K_USER_DEF1: 19,
  K_USER_DEF2: 20,
  K_USER_DEF3: 21,
  K_USER_DEF4: 22,
  K_USER_DEF5: 23,
  K_USER_DEF6: 24,
  K_USER_DEF7: 25,
  K_USER_DEF8: 26,
  K_USER_DEF9: 27,
  K_USER_DEF10: 28,
  K_USER_DEF11: 29,
  K_USER_DEF12: 30,
  K_USER_DEF13: 31,
  K_USER_DEF14: 32,
  K_USER_DEF15: 33,
  K_USER_DEF16: 34,
  K_USER_DEF17: 35,
  K_USER_DEF18: 36,
  K_USER_DEF19: 37,
  K_USER_DEF20: 38,
  K_USER_DEF21: 39,
  K_USER_DEF22: 40,
  K_USER_DEF23: 41,
  K_USER_DEF24: 42,
  K_USER_DEF25: 43,
  K_USER_DEF26: 44,
  K_USER_DEF27: 45,
  K_USER_DEF28: 46,
  K_USER_DEF29: 47,
  K_USER_DEF30: 48,
};

exports.decodeESTATEID = {
  0: "K_IDLE",
  1: "K_SPIN",
  2: "K_SPINSTOPING",
  3: "K_PRE_SHOWWIN",
  4: "K_SHOWWIN",
  5: "K_WAIT",
  6: "K_FEATURE_TRIGGER",
  7: "K_FEATURE_SHOWSCATTERWIN",
  8: "K_FEATURE_TRANSLATE",
  9: "K_FEATURE_WAIT_START",
  10: "K_FEATURE_SPIN",
  11: "K_FEATURE_SPINSTOPING",
  12: "K_FEATURE_PRE_SHOWWIN",
  13: "K_FEATURE_SHOWWIN",
  14: "K_FEATURE_WAIT",
  15: "K_FEATURE_CHEKRESULT",
  16: "K_FEATURE_RETRIGGER",
  17: "K_FEATURE_SHOW_RETIGGER",
  18: "K_ENDGAME",
  19: "K_USER_DEF1",
  20: "K_USER_DEF2",
  21: "K_USER_DEF3",
  22: "K_USER_DEF4",
  23: "K_USER_DEF5",
  24: "K_USER_DEF6",
  25: "K_USER_DEF7",
  26: "K_USER_DEF8",
  27: "K_USER_DEF9",
  28: "K_USER_DEF10",
  29: "K_USER_DEF11",
  30: "K_USER_DEF12",
  31: "K_USER_DEF13",
  32: "K_USER_DEF14",
  33: "K_USER_DEF15",
  34: "K_USER_DEF16",
  35: "K_USER_DEF17",
  36: "K_USER_DEF18",
  37: "K_USER_DEF19",
  38: "K_USER_DEF20",
  39: "K_USER_DEF21",
  40: "K_USER_DEF22",
  41: "K_USER_DEF23",
  42: "K_USER_DEF24",
  43: "K_USER_DEF25",
  44: "K_USER_DEF26",
  45: "K_USER_DEF27",
  46: "K_USER_DEF28",
  47: "K_USER_DEF29",
  48: "K_USER_DEF30",
};

exports.encodeStatusCode = {
  kSuccess: 0,
  kInvalid: 1,
  kOffline: 2,
  kNoEnoughCredit: 3,
  kHostError: 4,
  kOutOfDate: 5,
  kFreeGameEnd: 6,
  kNoMoreBets: 7,
};

exports.decodeStatusCode = {
  0: "kSuccess",
  1: "kInvalid",
  2: "kOffline",
  3: "kNoEnoughCredit",
  4: "kHostError",
  5: "kOutOfDate",
  6: "kFreeGameEnd",
  7: "kNoMoreBets",
};

exports.encodeWinLineType = {
  kCommon: 0,
  kXTotalBet: 1,
  kXTotalBetTrigger: 2,
};

exports.decodeWinLineType = {
  0: "kCommon",
  1: "kXTotalBet",
  2: "kXTotalBetTrigger",
};

exports.encodeOPTION_MODE = {
  eGetSpins: 1,
  eGetMultiplier: 2,
  eGetSpinandMultiplier: 3,
  eGetLockPattern: 4,
  eGetJp888Option: 5,
  eGetSelectGameOption: 6,
  eGetMoneyMeowOption: 7,
  eGetCreOption: 8,
  eGetCoinMasterOption: 9,
  eGetTamagotchiDinosaurOption: 10,
  eGetTamagotchiSubGame1: 11,
  eGetTamagotchiSubGame2: 12,
  eGetTamagotchiSubGame3: 13,
  eGetFullRandomPay: 14,
};

exports.decodeOPTION_MODE = {
  1: "eGetSpins",
  2: "eGetMultiplier",
  3: "eGetSpinandMultiplier",
  4: "eGetLockPattern",
  5: "eGetJp888Option",
  6: "eGetSelectGameOption",
  7: "eGetMoneyMeowOption",
  8: "eGetCreOption",
  9: "eGetCoinMasterOption",
  10: "eGetTamagotchiDinosaurOption",
  11: "eGetTamagotchiSubGame1",
  12: "eGetTamagotchiSubGame2",
  13: "eGetTamagotchiSubGame3",
  14: "eGetFullRandomPay",
};

exports.encodeECENTINTYPE = {
  eGeneral: 0,
  eJackpot: 1,
  eLuckyDraw: 2,
  eRedPacket: 3,
  eTreasure: 4,
};

exports.decodeECENTINTYPE = {
  0: "eGeneral",
  1: "eJackpot",
  2: "eLuckyDraw",
  3: "eRedPacket",
  4: "eTreasure",
};

exports.encodeMedalCode = {
  kBrown: 0,
  kSilver: 1,
  kGold: 2,
};

exports.decodeMedalCode = {
  0: "kBrown",
  1: "kSilver",
  2: "kGold",
};

exports.encodeLevel = {
  kSilver: 0,
  kGold: 1,
  kRuby: 2,
  kDiamond: 3,
};

exports.decodeLevel = {
  0: "kSilver",
  1: "kGold",
  2: "kRuby",
  3: "kDiamond",
};

exports.encodeType = {
  kGameEnd: 0,
  kTimeout: 1,
  kConfig: 2,
  kUpdate: 3,
};

exports.decodeType = {
  0: "kGameEnd",
  1: "kTimeout",
  2: "kConfig",
  3: "kUpdate",
};

exports.encodeHeader = function (message) {
  var bb = popByteBuffer();
  _encodeHeader(message, bb);
  return toUint8Array(bb);
}

function _encodeHeader(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }
};

exports.decodeHeader = function (binary) {
  return _decodeHeader(wrapByteBuffer(binary));
}

function _decodeHeader(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  return message;
};

exports.encodeStatus = function (message) {
  var bb = popByteBuffer();
  _encodeStatus(message, bb);
  return toUint8Array(bb);
}

function _encodeStatus(message, bb) {
  // required StatusCode msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeStatusCode[$msgid]);
  }
};

exports.decodeStatus = function (binary) {
  return _decodeStatus(wrapByteBuffer(binary));
}

function _decodeStatus(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required StatusCode msgid = 1;
      case 1: {
        message.msgid = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  return message;
};

exports.encodeLoginCall = function (message) {
  var bb = popByteBuffer();
  _encodeLoginCall(message, bb);
  return toUint8Array(bb);
}

function _encodeLoginCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string member_id = 2;
  var $member_id = message.member_id;
  if ($member_id !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $member_id);
  }

  // required string password = 3;
  var $password = message.password;
  if ($password !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $password);
  }

  // required string machine_id = 4;
  var $machine_id = message.machine_id;
  if ($machine_id !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $machine_id);
  }

  // optional string token = 5;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $token);
  }
};

exports.decodeLoginCall = function (binary) {
  return _decodeLoginCall(wrapByteBuffer(binary));
}

function _decodeLoginCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string member_id = 2;
      case 2: {
        message.member_id = readString(bb, readVarint32(bb));
        break;
      }

      // required string password = 3;
      case 3: {
        message.password = readString(bb, readVarint32(bb));
        break;
      }

      // required string machine_id = 4;
      case 4: {
        message.machine_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional string token = 5;
      case 5: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.member_id === undefined)
    throw new Error("Missing required field: member_id");

  if (message.password === undefined)
    throw new Error("Missing required field: password");

  if (message.machine_id === undefined)
    throw new Error("Missing required field: machine_id");

  return message;
};

exports.encodeLoginRecall = function (message) {
  var bb = popByteBuffer();
  _encodeLoginRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeLoginRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }

  // optional string token = 3;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $token);
  }
};

exports.decodeLoginRecall = function (binary) {
  return _decodeLoginRecall(wrapByteBuffer(binary));
}

function _decodeLoginRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      // optional string token = 3;
      case 3: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeConfigCall = function (message) {
  var bb = popByteBuffer();
  _encodeConfigCall(message, bb);
  return toUint8Array(bb);
}

function _encodeConfigCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string token = 2;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $token);
  }

  // required string gameid = 3;
  var $gameid = message.gameid;
  if ($gameid !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $gameid);
  }

  // optional bool clear_power_cycle = 4;
  var $clear_power_cycle = message.clear_power_cycle;
  if ($clear_power_cycle !== undefined) {
    writeVarint32(bb, 32);
    writeByte(bb, $clear_power_cycle ? 1 : 0);
  }

  // optional uint32 version = 5;
  var $version = message.version;
  if ($version !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $version);
  }

  // optional uint32 game_version = 6;
  var $game_version = message.game_version;
  if ($game_version !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $game_version);
  }

  // optional uint32 subgame_id = 7;
  var $subgame_id = message.subgame_id;
  if ($subgame_id !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $subgame_id);
  }
};

exports.decodeConfigCall = function (binary) {
  return _decodeConfigCall(wrapByteBuffer(binary));
}

function _decodeConfigCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string token = 2;
      case 2: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      // required string gameid = 3;
      case 3: {
        message.gameid = readString(bb, readVarint32(bb));
        break;
      }

      // optional bool clear_power_cycle = 4;
      case 4: {
        message.clear_power_cycle = !!readByte(bb);
        break;
      }

      // optional uint32 version = 5;
      case 5: {
        message.version = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 game_version = 6;
      case 6: {
        message.game_version = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 subgame_id = 7;
      case 7: {
        message.subgame_id = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.token === undefined)
    throw new Error("Missing required field: token");

  if (message.gameid === undefined)
    throw new Error("Missing required field: gameid");

  return message;
};

exports.encodeBonusTimesCounter = function (message) {
  var bb = popByteBuffer();
  _encodeBonusTimesCounter(message, bb);
  return toUint8Array(bb);
}

function _encodeBonusTimesCounter(message, bb) {
  // required string module_id = 1;
  var $module_id = message.module_id;
  if ($module_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $module_id);
  }

  // required uint32 played_times = 2;
  var $played_times = message.played_times;
  if ($played_times !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $played_times);
  }

  // required uint32 total_times = 3;
  var $total_times = message.total_times;
  if ($total_times !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $total_times);
  }
};

exports.decodeBonusTimesCounter = function (binary) {
  return _decodeBonusTimesCounter(wrapByteBuffer(binary));
}

function _decodeBonusTimesCounter(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string module_id = 1;
      case 1: {
        message.module_id = readString(bb, readVarint32(bb));
        break;
      }

      // required uint32 played_times = 2;
      case 2: {
        message.played_times = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 total_times = 3;
      case 3: {
        message.total_times = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.module_id === undefined)
    throw new Error("Missing required field: module_id");

  if (message.played_times === undefined)
    throw new Error("Missing required field: played_times");

  if (message.total_times === undefined)
    throw new Error("Missing required field: total_times");

  return message;
};

exports.encodePlayerData = function (message) {
  var bb = popByteBuffer();
  _encodePlayerData(message, bb);
  return toUint8Array(bb);
}

function _encodePlayerData(message, bb) {
  // required int32 bet_index = 3;
  var $bet_index = message.bet_index;
  if ($bet_index !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($bet_index));
  }

  // required int32 line_index = 4;
  var $line_index = message.line_index;
  if ($line_index !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, intToLong($line_index));
  }

  // required int32 rate_index = 5;
  var $rate_index = message.rate_index;
  if ($rate_index !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, intToLong($rate_index));
  }
};

exports.decodePlayerData = function (binary) {
  return _decodePlayerData(wrapByteBuffer(binary));
}

function _decodePlayerData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int32 bet_index = 3;
      case 3: {
        message.bet_index = readVarint32(bb);
        break;
      }

      // required int32 line_index = 4;
      case 4: {
        message.line_index = readVarint32(bb);
        break;
      }

      // required int32 rate_index = 5;
      case 5: {
        message.rate_index = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.bet_index === undefined)
    throw new Error("Missing required field: bet_index");

  if (message.line_index === undefined)
    throw new Error("Missing required field: line_index");

  if (message.rate_index === undefined)
    throw new Error("Missing required field: rate_index");

  return message;
};

exports.encodeWinBonus = function (message) {
  var bb = popByteBuffer();
  _encodeWinBonus(message, bb);
  return toUint8Array(bb);
}

function _encodeWinBonus(message, bb) {
  // required string module_id = 1;
  var $module_id = message.module_id;
  if ($module_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $module_id);
  }

  // required uint32 times = 2;
  var $times = message.times;
  if ($times !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $times);
  }
};

exports.decodeWinBonus = function (binary) {
  return _decodeWinBonus(wrapByteBuffer(binary));
}

function _decodeWinBonus(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string module_id = 1;
      case 1: {
        message.module_id = readString(bb, readVarint32(bb));
        break;
      }

      // required uint32 times = 2;
      case 2: {
        message.times = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.module_id === undefined)
    throw new Error("Missing required field: module_id");

  if (message.times === undefined)
    throw new Error("Missing required field: times");

  return message;
};

exports.encodeReelStackPay = function (message) {
  var bb = popByteBuffer();
  _encodeReelStackPay(message, bb);
  return toUint8Array(bb);
}

function _encodeReelStackPay(message, bb) {
  // required uint32 icon_id = 1;
  var $icon_id = message.icon_id;
  if ($icon_id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $icon_id);
  }

  // required uint32 pay = 2;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $pay);
  }

  // repeated uint32 reel_index = 3;
  var array$reel_index = message.reel_index;
  if (array$reel_index !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$reel_index.length; i++) {
      var value = array$reel_index[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeReelStackPay = function (binary) {
  return _decodeReelStackPay(wrapByteBuffer(binary));
}

function _decodeReelStackPay(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 icon_id = 1;
      case 1: {
        message.icon_id = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 pay = 2;
      case 2: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 reel_index = 3;
      case 3: {
        var values = message.reel_index || (message.reel_index = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.icon_id === undefined)
    throw new Error("Missing required field: icon_id");

  if (message.pay === undefined)
    throw new Error("Missing required field: pay");

  return message;
};

exports.encodeMystery = function (message) {
  var bb = popByteBuffer();
  _encodeMystery(message, bb);
  return toUint8Array(bb);
}

function _encodeMystery(message, bb) {
  // required uint32 to_symbol = 1;
  var $to_symbol = message.to_symbol;
  if ($to_symbol !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $to_symbol);
  }

  // required int32 to_wild_reel = 2;
  var $to_wild_reel = message.to_wild_reel;
  if ($to_wild_reel !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, intToLong($to_wild_reel));
  }
};

exports.decodeMystery = function (binary) {
  return _decodeMystery(wrapByteBuffer(binary));
}

function _decodeMystery(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 to_symbol = 1;
      case 1: {
        message.to_symbol = readVarint32(bb) >>> 0;
        break;
      }

      // required int32 to_wild_reel = 2;
      case 2: {
        message.to_wild_reel = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.to_symbol === undefined)
    throw new Error("Missing required field: to_symbol");

  if (message.to_wild_reel === undefined)
    throw new Error("Missing required field: to_wild_reel");

  return message;
};

exports.encodeCommonDataInfo = function (message) {
  var bb = popByteBuffer();
  _encodeCommonDataInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeCommonDataInfo(message, bb) {
  // optional int32 idata1 = 1;
  var $idata1 = message.idata1;
  if ($idata1 !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($idata1));
  }

  // optional int32 idata2 = 2;
  var $idata2 = message.idata2;
  if ($idata2 !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, intToLong($idata2));
  }

  // optional int32 idata3 = 3;
  var $idata3 = message.idata3;
  if ($idata3 !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($idata3));
  }

  // optional uint32 udata1 = 4;
  var $udata1 = message.udata1;
  if ($udata1 !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $udata1);
  }

  // optional uint32 udata2 = 5;
  var $udata2 = message.udata2;
  if ($udata2 !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $udata2);
  }

  // optional uint32 udata3 = 6;
  var $udata3 = message.udata3;
  if ($udata3 !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $udata3);
  }

  // optional int64 idata64 = 7;
  var $idata64 = message.idata64;
  if ($idata64 !== undefined) {
    writeVarint32(bb, 56);
    writeVarint64(bb, $idata64);
  }

  // optional uint64 udata64 = 8;
  var $udata64 = message.udata64;
  if ($udata64 !== undefined) {
    writeVarint32(bb, 64);
    writeVarint64(bb, $udata64);
  }

  // optional IntDataList i_data_list1 = 9;
  var $i_data_list1 = message.i_data_list1;
  if ($i_data_list1 !== undefined) {
    writeVarint32(bb, 74);
    var nested = popByteBuffer();
    _encodeIntDataList($i_data_list1, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional IntDataList i_data_list2 = 10;
  var $i_data_list2 = message.i_data_list2;
  if ($i_data_list2 !== undefined) {
    writeVarint32(bb, 82);
    var nested = popByteBuffer();
    _encodeIntDataList($i_data_list2, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional UintDataList u_data_list1 = 11;
  var $u_data_list1 = message.u_data_list1;
  if ($u_data_list1 !== undefined) {
    writeVarint32(bb, 90);
    var nested = popByteBuffer();
    _encodeUintDataList($u_data_list1, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional UintDataList u_data_list2 = 12;
  var $u_data_list2 = message.u_data_list2;
  if ($u_data_list2 !== undefined) {
    writeVarint32(bb, 98);
    var nested = popByteBuffer();
    _encodeUintDataList($u_data_list2, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional MultiDataList multi_data_list1 = 13;
  var $multi_data_list1 = message.multi_data_list1;
  if ($multi_data_list1 !== undefined) {
    writeVarint32(bb, 106);
    var nested = popByteBuffer();
    _encodeMultiDataList($multi_data_list1, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional MultiDataList multi_data_list2 = 14;
  var $multi_data_list2 = message.multi_data_list2;
  if ($multi_data_list2 !== undefined) {
    writeVarint32(bb, 114);
    var nested = popByteBuffer();
    _encodeMultiDataList($multi_data_list2, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeCommonDataInfo = function (binary) {
  return _decodeCommonDataInfo(wrapByteBuffer(binary));
}

function _decodeCommonDataInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional int32 idata1 = 1;
      case 1: {
        message.idata1 = readVarint32(bb);
        break;
      }

      // optional int32 idata2 = 2;
      case 2: {
        message.idata2 = readVarint32(bb);
        break;
      }

      // optional int32 idata3 = 3;
      case 3: {
        message.idata3 = readVarint32(bb);
        break;
      }

      // optional uint32 udata1 = 4;
      case 4: {
        message.udata1 = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 udata2 = 5;
      case 5: {
        message.udata2 = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 udata3 = 6;
      case 6: {
        message.udata3 = readVarint32(bb) >>> 0;
        break;
      }

      // optional int64 idata64 = 7;
      case 7: {
        message.idata64 = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional uint64 udata64 = 8;
      case 8: {
        message.udata64 = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional IntDataList i_data_list1 = 9;
      case 9: {
        var limit = pushTemporaryLength(bb);
        message.i_data_list1 = _decodeIntDataList(bb);
        bb.limit = limit;
        break;
      }

      // optional IntDataList i_data_list2 = 10;
      case 10: {
        var limit = pushTemporaryLength(bb);
        message.i_data_list2 = _decodeIntDataList(bb);
        bb.limit = limit;
        break;
      }

      // optional UintDataList u_data_list1 = 11;
      case 11: {
        var limit = pushTemporaryLength(bb);
        message.u_data_list1 = _decodeUintDataList(bb);
        bb.limit = limit;
        break;
      }

      // optional UintDataList u_data_list2 = 12;
      case 12: {
        var limit = pushTemporaryLength(bb);
        message.u_data_list2 = _decodeUintDataList(bb);
        bb.limit = limit;
        break;
      }

      // optional MultiDataList multi_data_list1 = 13;
      case 13: {
        var limit = pushTemporaryLength(bb);
        message.multi_data_list1 = _decodeMultiDataList(bb);
        bb.limit = limit;
        break;
      }

      // optional MultiDataList multi_data_list2 = 14;
      case 14: {
        var limit = pushTemporaryLength(bb);
        message.multi_data_list2 = _decodeMultiDataList(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeWinLine = function (message) {
  var bb = popByteBuffer();
  _encodeWinLine(message, bb);
  return toUint8Array(bb);
}

function _encodeWinLine(message, bb) {
  // required WinLineType win_line_type = 1;
  var $win_line_type = message.win_line_type;
  if ($win_line_type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeWinLineType[$win_line_type]);
  }

  // required int32 line_no = 2;
  var $line_no = message.line_no;
  if ($line_no !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, intToLong($line_no));
  }

  // required int32 symbol_id = 3;
  var $symbol_id = message.symbol_id;
  if ($symbol_id !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($symbol_id));
  }

  // repeated int32 pos = 4;
  var array$pos = message.pos;
  if (array$pos !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pos.length; i++) {
      var value = array$pos[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // required int32 credit = 5;
  var $credit = message.credit;
  if ($credit !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, intToLong($credit));
  }

  // required int32 multiplier = 6;
  var $multiplier = message.multiplier;
  if ($multiplier !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($multiplier));
  }

  // optional uint64 credit_long = 7;
  var $credit_long = message.credit_long;
  if ($credit_long !== undefined) {
    writeVarint32(bb, 56);
    writeVarint64(bb, $credit_long);
  }
};

exports.decodeWinLine = function (binary) {
  return _decodeWinLine(wrapByteBuffer(binary));
}

function _decodeWinLine(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required WinLineType win_line_type = 1;
      case 1: {
        message.win_line_type = exports.decodeWinLineType[readVarint32(bb)];
        break;
      }

      // required int32 line_no = 2;
      case 2: {
        message.line_no = readVarint32(bb);
        break;
      }

      // required int32 symbol_id = 3;
      case 3: {
        message.symbol_id = readVarint32(bb);
        break;
      }

      // repeated int32 pos = 4;
      case 4: {
        var values = message.pos || (message.pos = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // required int32 credit = 5;
      case 5: {
        message.credit = readVarint32(bb);
        break;
      }

      // required int32 multiplier = 6;
      case 6: {
        message.multiplier = readVarint32(bb);
        break;
      }

      // optional uint64 credit_long = 7;
      case 7: {
        message.credit_long = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.win_line_type === undefined)
    throw new Error("Missing required field: win_line_type");

  if (message.line_no === undefined)
    throw new Error("Missing required field: line_no");

  if (message.symbol_id === undefined)
    throw new Error("Missing required field: symbol_id");

  if (message.credit === undefined)
    throw new Error("Missing required field: credit");

  if (message.multiplier === undefined)
    throw new Error("Missing required field: multiplier");

  return message;
};

exports.encodeJPPay = function (message) {
  var bb = popByteBuffer();
  _encodeJPPay(message, bb);
  return toUint8Array(bb);
}

function _encodeJPPay(message, bb) {
  // required uint32 cent = 1;
  var $cent = message.cent;
  if ($cent !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $cent);
  }

  // repeated WinLine win_line_group = 2;
  var array$win_line_group = message.win_line_group;
  if (array$win_line_group !== undefined) {
    for (var i = 0; i < array$win_line_group.length; i++) {
      var value = array$win_line_group[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodeWinLine(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeJPPay = function (binary) {
  return _decodeJPPay(wrapByteBuffer(binary));
}

function _decodeJPPay(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 cent = 1;
      case 1: {
        message.cent = readVarint32(bb) >>> 0;
        break;
      }

      // repeated WinLine win_line_group = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_line_group || (message.win_line_group = []);
        values.push(_decodeWinLine(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.cent === undefined)
    throw new Error("Missing required field: cent");

  return message;
};

exports.encodeGoldenIcon = function (message) {
  var bb = popByteBuffer();
  _encodeGoldenIcon(message, bb);
  return toUint8Array(bb);
}

function _encodeGoldenIcon(message, bb) {
  // required int32 symbol_id = 1;
  var $symbol_id = message.symbol_id;
  if ($symbol_id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($symbol_id));
  }

  // required bool is_golden = 2;
  var $is_golden = message.is_golden;
  if ($is_golden !== undefined) {
    writeVarint32(bb, 16);
    writeByte(bb, $is_golden ? 1 : 0);
  }

  // optional bool is_trig = 3;
  var $is_trig = message.is_trig;
  if ($is_trig !== undefined) {
    writeVarint32(bb, 24);
    writeByte(bb, $is_trig ? 1 : 0);
  }
};

exports.decodeGoldenIcon = function (binary) {
  return _decodeGoldenIcon(wrapByteBuffer(binary));
}

function _decodeGoldenIcon(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int32 symbol_id = 1;
      case 1: {
        message.symbol_id = readVarint32(bb);
        break;
      }

      // required bool is_golden = 2;
      case 2: {
        message.is_golden = !!readByte(bb);
        break;
      }

      // optional bool is_trig = 3;
      case 3: {
        message.is_trig = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.symbol_id === undefined)
    throw new Error("Missing required field: symbol_id");

  if (message.is_golden === undefined)
    throw new Error("Missing required field: is_golden");

  return message;
};

exports.encodeTypedWild = function (message) {
  var bb = popByteBuffer();
  _encodeTypedWild(message, bb);
  return toUint8Array(bb);
}

function _encodeTypedWild(message, bb) {
  // required uint32 type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $type);
  }

  // repeated uint32 value = 2;
  var array$value = message.value;
  if (array$value !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$value.length; i++) {
      var value = array$value[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeTypedWild = function (binary) {
  return _decodeTypedWild(wrapByteBuffer(binary));
}

function _decodeTypedWild(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 type = 1;
      case 1: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 value = 2;
      case 2: {
        var values = message.value || (message.value = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  return message;
};

exports.encodeSubResult = function (message) {
  var bb = popByteBuffer();
  _encodeSubResult(message, bb);
  return toUint8Array(bb);
}

function _encodeSubResult(message, bb) {
  // required uint32 sub_game_id = 1;
  var $sub_game_id = message.sub_game_id;
  if ($sub_game_id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $sub_game_id);
  }

  // required uint64 credit = 2;
  var $credit = message.credit;
  if ($credit !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $credit);
  }

  // repeated WinLine win_line_group = 3;
  var array$win_line_group = message.win_line_group;
  if (array$win_line_group !== undefined) {
    for (var i = 0; i < array$win_line_group.length; i++) {
      var value = array$win_line_group[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeWinLine(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated int32 rng = 4;
  var array$rng = message.rng;
  if (array$rng !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$rng.length; i++) {
      var value = array$rng[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated WinBonus win_bonus_group = 5;
  var array$win_bonus_group = message.win_bonus_group;
  if (array$win_bonus_group !== undefined) {
    for (var i = 0; i < array$win_bonus_group.length; i++) {
      var value = array$win_bonus_group[i];
      writeVarint32(bb, 42);
      var nested = popByteBuffer();
      _encodeWinBonus(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated bool trigger_super_scatter = 6;
  var array$trigger_super_scatter = message.trigger_super_scatter;
  if (array$trigger_super_scatter !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$trigger_super_scatter.length; i++) {
      var value = array$trigger_super_scatter[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 50);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeSubResult = function (binary) {
  return _decodeSubResult(wrapByteBuffer(binary));
}

function _decodeSubResult(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 sub_game_id = 1;
      case 1: {
        message.sub_game_id = readVarint32(bb) >>> 0;
        break;
      }

      // required uint64 credit = 2;
      case 2: {
        message.credit = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // repeated WinLine win_line_group = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_line_group || (message.win_line_group = []);
        values.push(_decodeWinLine(bb));
        bb.limit = limit;
        break;
      }

      // repeated int32 rng = 4;
      case 4: {
        var values = message.rng || (message.rng = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated WinBonus win_bonus_group = 5;
      case 5: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_bonus_group || (message.win_bonus_group = []);
        values.push(_decodeWinBonus(bb));
        bb.limit = limit;
        break;
      }

      // repeated bool trigger_super_scatter = 6;
      case 6: {
        var values = message.trigger_super_scatter || (message.trigger_super_scatter = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.sub_game_id === undefined)
    throw new Error("Missing required field: sub_game_id");

  if (message.credit === undefined)
    throw new Error("Missing required field: credit");

  return message;
};

exports.encodeCascadeResult = function (message) {
  var bb = popByteBuffer();
  _encodeCascadeResult(message, bb);
  return toUint8Array(bb);
}

function _encodeCascadeResult(message, bb) {
  // repeated WinLine win_line_group = 1;
  var array$win_line_group = message.win_line_group;
  if (array$win_line_group !== undefined) {
    for (var i = 0; i < array$win_line_group.length; i++) {
      var value = array$win_line_group[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeWinLine(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated int32 random_syb_pattern = 2;
  var array$random_syb_pattern = message.random_syb_pattern;
  if (array$random_syb_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$random_syb_pattern.length; i++) {
      var value = array$random_syb_pattern[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeCascadeResult = function (binary) {
  return _decodeCascadeResult(wrapByteBuffer(binary));
}

function _decodeCascadeResult(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated WinLine win_line_group = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_line_group || (message.win_line_group = []);
        values.push(_decodeWinLine(bb));
        bb.limit = limit;
        break;
      }

      // repeated int32 random_syb_pattern = 2;
      case 2: {
        var values = message.random_syb_pattern || (message.random_syb_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeBonusBet = function (message) {
  var bb = popByteBuffer();
  _encodeBonusBet(message, bb);
  return toUint8Array(bb);
}

function _encodeBonusBet(message, bb) {
  // required uint32 bet = 1;
  var $bet = message.bet;
  if ($bet !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $bet);
  }

  // required uint32 count = 2;
  var $count = message.count;
  if ($count !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $count);
  }
};

exports.decodeBonusBet = function (binary) {
  return _decodeBonusBet(wrapByteBuffer(binary));
}

function _decodeBonusBet(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 bet = 1;
      case 1: {
        message.bet = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 count = 2;
      case 2: {
        message.count = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.bet === undefined)
    throw new Error("Missing required field: bet");

  if (message.count === undefined)
    throw new Error("Missing required field: count");

  return message;
};

exports.encodeCollectTimes = function (message) {
  var bb = popByteBuffer();
  _encodeCollectTimes(message, bb);
  return toUint8Array(bb);
}

function _encodeCollectTimes(message, bb) {
  // repeated uint32 times = 1;
  var array$times = message.times;
  if (array$times !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$times.length; i++) {
      var value = array$times[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeCollectTimes = function (binary) {
  return _decodeCollectTimes(wrapByteBuffer(binary));
}

function _decodeCollectTimes(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated uint32 times = 1;
      case 1: {
        var values = message.times || (message.times = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodePoolInfo = function (message) {
  var bb = popByteBuffer();
  _encodePoolInfo(message, bb);
  return toUint8Array(bb);
}

function _encodePoolInfo(message, bb) {
  // optional uint32 pool_level = 1;
  var $pool_level = message.pool_level;
  if ($pool_level !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $pool_level);
  }

  // optional uint32 lost_pool_condition = 2;
  var $lost_pool_condition = message.lost_pool_condition;
  if ($lost_pool_condition !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $lost_pool_condition);
  }

  // optional uint64 lost_pool_total = 3;
  var $lost_pool_total = message.lost_pool_total;
  if ($lost_pool_total !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $lost_pool_total);
  }
};

exports.decodePoolInfo = function (binary) {
  return _decodePoolInfo(wrapByteBuffer(binary));
}

function _decodePoolInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 pool_level = 1;
      case 1: {
        message.pool_level = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 lost_pool_condition = 2;
      case 2: {
        message.lost_pool_condition = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint64 lost_pool_total = 3;
      case 3: {
        message.lost_pool_total = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeArcadeMarioBar = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeMarioBar(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeMarioBar(message, bb) {
  // repeated int32 light_bonus_rng = 1;
  var array$light_bonus_rng = message.light_bonus_rng;
  if (array$light_bonus_rng !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$light_bonus_rng.length; i++) {
      var value = array$light_bonus_rng[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional int32 full_award = 2;
  var $full_award = message.full_award;
  if ($full_award !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, intToLong($full_award));
  }

  // repeated WinLine win_line_group = 3;
  var array$win_line_group = message.win_line_group;
  if (array$win_line_group !== undefined) {
    for (var i = 0; i < array$win_line_group.length; i++) {
      var value = array$win_line_group[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeWinLine(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeArcadeMarioBar = function (binary) {
  return _decodeArcadeMarioBar(wrapByteBuffer(binary));
}

function _decodeArcadeMarioBar(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 light_bonus_rng = 1;
      case 1: {
        var values = message.light_bonus_rng || (message.light_bonus_rng = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional int32 full_award = 2;
      case 2: {
        message.full_award = readVarint32(bb);
        break;
      }

      // repeated WinLine win_line_group = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_line_group || (message.win_line_group = []);
        values.push(_decodeWinLine(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeRData = function (message) {
  var bb = popByteBuffer();
  _encodeRData(message, bb);
  return toUint8Array(bb);
}

function _encodeRData(message, bb) {
  // repeated uint32 data = 1;
  var array$data = message.data;
  if (array$data !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$data.length; i++) {
      var value = array$data[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeRData = function (binary) {
  return _decodeRData(wrapByteBuffer(binary));
}

function _decodeRData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated uint32 data = 1;
      case 1: {
        var values = message.data || (message.data = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeSectionData = function (message) {
  var bb = popByteBuffer();
  _encodeSectionData(message, bb);
  return toUint8Array(bb);
}

function _encodeSectionData(message, bb) {
  // required uint32 init_speed = 1;
  var $init_speed = message.init_speed;
  if ($init_speed !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $init_speed);
  }

  // required uint32 differ = 2;
  var $differ = message.differ;
  if ($differ !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $differ);
  }

  // repeated RData result_section = 3;
  var array$result_section = message.result_section;
  if (array$result_section !== undefined) {
    for (var i = 0; i < array$result_section.length; i++) {
      var value = array$result_section[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeRData(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeSectionData = function (binary) {
  return _decodeSectionData(wrapByteBuffer(binary));
}

function _decodeSectionData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 init_speed = 1;
      case 1: {
        message.init_speed = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 differ = 2;
      case 2: {
        message.differ = readVarint32(bb) >>> 0;
        break;
      }

      // repeated RData result_section = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.result_section || (message.result_section = []);
        values.push(_decodeRData(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.init_speed === undefined)
    throw new Error("Missing required field: init_speed");

  if (message.differ === undefined)
    throw new Error("Missing required field: differ");

  return message;
};

exports.encodeArcadeRaceGame = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeRaceGame(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeRaceGame(message, bb) {
  // repeated uint32 rank = 1;
  var array$rank = message.rank;
  if (array$rank !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$rank.length; i++) {
      var value = array$rank[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated RData gold_data = 2;
  var array$gold_data = message.gold_data;
  if (array$gold_data !== undefined) {
    for (var i = 0; i < array$gold_data.length; i++) {
      var value = array$gold_data[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodeRData(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // required SectionData section_data = 3;
  var $section_data = message.section_data;
  if ($section_data !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeSectionData($section_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated uint32 item_wins = 4;
  var array$item_wins = message.item_wins;
  if (array$item_wins !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$item_wins.length; i++) {
      var value = array$item_wins[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // required uint32 gold_win = 5;
  var $gold_win = message.gold_win;
  if ($gold_win !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $gold_win);
  }

  // repeated uint32 next_bet = 6;
  var array$next_bet = message.next_bet;
  if (array$next_bet !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$next_bet.length; i++) {
      var value = array$next_bet[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 50);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 next_max_bet = 7;
  var array$next_max_bet = message.next_max_bet;
  if (array$next_max_bet !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$next_max_bet.length; i++) {
      var value = array$next_max_bet[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 58);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeArcadeRaceGame = function (binary) {
  return _decodeArcadeRaceGame(wrapByteBuffer(binary));
}

function _decodeArcadeRaceGame(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated uint32 rank = 1;
      case 1: {
        var values = message.rank || (message.rank = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated RData gold_data = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.gold_data || (message.gold_data = []);
        values.push(_decodeRData(bb));
        bb.limit = limit;
        break;
      }

      // required SectionData section_data = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.section_data = _decodeSectionData(bb);
        bb.limit = limit;
        break;
      }

      // repeated uint32 item_wins = 4;
      case 4: {
        var values = message.item_wins || (message.item_wins = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // required uint32 gold_win = 5;
      case 5: {
        message.gold_win = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 next_bet = 6;
      case 6: {
        var values = message.next_bet || (message.next_bet = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 next_max_bet = 7;
      case 7: {
        var values = message.next_max_bet || (message.next_max_bet = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.section_data === undefined)
    throw new Error("Missing required field: section_data");

  if (message.gold_win === undefined)
    throw new Error("Missing required field: gold_win");

  return message;
};

exports.encodeBonusHit = function (message) {
  var bb = popByteBuffer();
  _encodeBonusHit(message, bb);
  return toUint8Array(bb);
}

function _encodeBonusHit(message, bb) {
  // required int32 type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($type));
  }

  // required uint32 time = 2;
  var $time = message.time;
  if ($time !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $time);
  }

  // required uint32 win = 3;
  var $win = message.win;
  if ($win !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $win);
  }
};

exports.decodeBonusHit = function (binary) {
  return _decodeBonusHit(wrapByteBuffer(binary));
}

function _decodeBonusHit(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int32 type = 1;
      case 1: {
        message.type = readVarint32(bb);
        break;
      }

      // required uint32 time = 2;
      case 2: {
        message.time = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 win = 3;
      case 3: {
        message.win = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  if (message.time === undefined)
    throw new Error("Missing required field: time");

  if (message.win === undefined)
    throw new Error("Missing required field: win");

  return message;
};

exports.encodeExtraData = function (message) {
  var bb = popByteBuffer();
  _encodeExtraData(message, bb);
  return toUint8Array(bb);
}

function _encodeExtraData(message, bb) {
  // repeated int32 data = 1;
  var array$data = message.data;
  if (array$data !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$data.length; i++) {
      var value = array$data[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeExtraData = function (binary) {
  return _decodeExtraData(wrapByteBuffer(binary));
}

function _decodeExtraData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 data = 1;
      case 1: {
        var values = message.data || (message.data = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeArcadeCoinPusher = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeCoinPusher(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeCoinPusher(message, bb) {
  // repeated ExtraData special_pos = 1;
  var array$special_pos = message.special_pos;
  if (array$special_pos !== undefined) {
    for (var i = 0; i < array$special_pos.length; i++) {
      var value = array$special_pos[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeExtraData(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated uint32 wins = 2;
  var array$wins = message.wins;
  if (array$wins !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$wins.length; i++) {
      var value = array$wins[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // required uint32 total_win = 3;
  var $total_win = message.total_win;
  if ($total_win !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $total_win);
  }

  // repeated BonusHit bonus_hit_data = 4;
  var array$bonus_hit_data = message.bonus_hit_data;
  if (array$bonus_hit_data !== undefined) {
    for (var i = 0; i < array$bonus_hit_data.length; i++) {
      var value = array$bonus_hit_data[i];
      writeVarint32(bb, 34);
      var nested = popByteBuffer();
      _encodeBonusHit(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeArcadeCoinPusher = function (binary) {
  return _decodeArcadeCoinPusher(wrapByteBuffer(binary));
}

function _decodeArcadeCoinPusher(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated ExtraData special_pos = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.special_pos || (message.special_pos = []);
        values.push(_decodeExtraData(bb));
        bb.limit = limit;
        break;
      }

      // repeated uint32 wins = 2;
      case 2: {
        var values = message.wins || (message.wins = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // required uint32 total_win = 3;
      case 3: {
        message.total_win = readVarint32(bb) >>> 0;
        break;
      }

      // repeated BonusHit bonus_hit_data = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        var values = message.bonus_hit_data || (message.bonus_hit_data = []);
        values.push(_decodeBonusHit(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.total_win === undefined)
    throw new Error("Missing required field: total_win");

  return message;
};

exports.encodeCollectSlot = function (message) {
  var bb = popByteBuffer();
  _encodeCollectSlot(message, bb);
  return toUint8Array(bb);
}

function _encodeCollectSlot(message, bb) {
  // required uint32 bar = 1;
  var $bar = message.bar;
  if ($bar !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $bar);
  }

  // required bool enable = 2;
  var $enable = message.enable;
  if ($enable !== undefined) {
    writeVarint32(bb, 16);
    writeByte(bb, $enable ? 1 : 0);
  }

  // repeated int32 pattern = 3;
  var array$pattern = message.pattern;
  if (array$pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pattern.length; i++) {
      var value = array$pattern[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // required uint32 pay = 4;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $pay);
  }
};

exports.decodeCollectSlot = function (binary) {
  return _decodeCollectSlot(wrapByteBuffer(binary));
}

function _decodeCollectSlot(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 bar = 1;
      case 1: {
        message.bar = readVarint32(bb) >>> 0;
        break;
      }

      // required bool enable = 2;
      case 2: {
        message.enable = !!readByte(bb);
        break;
      }

      // repeated int32 pattern = 3;
      case 3: {
        var values = message.pattern || (message.pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // required uint32 pay = 4;
      case 4: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.bar === undefined)
    throw new Error("Missing required field: bar");

  if (message.enable === undefined)
    throw new Error("Missing required field: enable");

  if (message.pay === undefined)
    throw new Error("Missing required field: pay");

  return message;
};

exports.encodeCollectAnm = function (message) {
  var bb = popByteBuffer();
  _encodeCollectAnm(message, bb);
  return toUint8Array(bb);
}

function _encodeCollectAnm(message, bb) {
  // required uint32 bar = 1;
  var $bar = message.bar;
  if ($bar !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $bar);
  }

  // required bool enable = 2;
  var $enable = message.enable;
  if ($enable !== undefined) {
    writeVarint32(bb, 16);
    writeByte(bb, $enable ? 1 : 0);
  }

  // required uint32 type = 3;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $type);
  }

  // required uint32 multiplier = 4;
  var $multiplier = message.multiplier;
  if ($multiplier !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $multiplier);
  }

  // required uint32 pay = 5;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $pay);
  }
};

exports.decodeCollectAnm = function (binary) {
  return _decodeCollectAnm(wrapByteBuffer(binary));
}

function _decodeCollectAnm(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 bar = 1;
      case 1: {
        message.bar = readVarint32(bb) >>> 0;
        break;
      }

      // required bool enable = 2;
      case 2: {
        message.enable = !!readByte(bb);
        break;
      }

      // required uint32 type = 3;
      case 3: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 multiplier = 4;
      case 4: {
        message.multiplier = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 pay = 5;
      case 5: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.bar === undefined)
    throw new Error("Missing required field: bar");

  if (message.enable === undefined)
    throw new Error("Missing required field: enable");

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  if (message.multiplier === undefined)
    throw new Error("Missing required field: multiplier");

  if (message.pay === undefined)
    throw new Error("Missing required field: pay");

  return message;
};

exports.encodeChance = function (message) {
  var bb = popByteBuffer();
  _encodeChance(message, bb);
  return toUint8Array(bb);
}

function _encodeChance(message, bb) {
  // required uint32 type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $type);
  }
};

exports.decodeChance = function (binary) {
  return _decodeChance(wrapByteBuffer(binary));
}

function _decodeChance(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 type = 1;
      case 1: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  return message;
};

exports.encodeFortune = function (message) {
  var bb = popByteBuffer();
  _encodeFortune(message, bb);
  return toUint8Array(bb);
}

function _encodeFortune(message, bb) {
  // required uint32 type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $type);
  }

  // required uint32 multiplier = 2;
  var $multiplier = message.multiplier;
  if ($multiplier !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $multiplier);
  }

  // repeated uint32 pos = 3;
  var array$pos = message.pos;
  if (array$pos !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pos.length; i++) {
      var value = array$pos[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeFortune = function (binary) {
  return _decodeFortune(wrapByteBuffer(binary));
}

function _decodeFortune(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 type = 1;
      case 1: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      // required uint32 multiplier = 2;
      case 2: {
        message.multiplier = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 pos = 3;
      case 3: {
        var values = message.pos || (message.pos = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  if (message.multiplier === undefined)
    throw new Error("Missing required field: multiplier");

  return message;
};

exports.encodeArcadeMonopoly = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeMonopoly(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeMonopoly(message, bb) {
  // repeated int32 light_bonus_rng = 1;
  var array$light_bonus_rng = message.light_bonus_rng;
  if (array$light_bonus_rng !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$light_bonus_rng.length; i++) {
      var value = array$light_bonus_rng[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated WinLine win_line_group = 2;
  var array$win_line_group = message.win_line_group;
  if (array$win_line_group !== undefined) {
    for (var i = 0; i < array$win_line_group.length; i++) {
      var value = array$win_line_group[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodeWinLine(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // required CollectSlot collect_slot = 3;
  var $collect_slot = message.collect_slot;
  if ($collect_slot !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeCollectSlot($collect_slot, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // required CollectAnm collect_anm = 4;
  var $collect_anm = message.collect_anm;
  if ($collect_anm !== undefined) {
    writeVarint32(bb, 34);
    var nested = popByteBuffer();
    _encodeCollectAnm($collect_anm, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // required Chance chance = 5;
  var $chance = message.chance;
  if ($chance !== undefined) {
    writeVarint32(bb, 42);
    var nested = popByteBuffer();
    _encodeChance($chance, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // required Fortune fortune = 6;
  var $fortune = message.fortune;
  if ($fortune !== undefined) {
    writeVarint32(bb, 50);
    var nested = popByteBuffer();
    _encodeFortune($fortune, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeArcadeMonopoly = function (binary) {
  return _decodeArcadeMonopoly(wrapByteBuffer(binary));
}

function _decodeArcadeMonopoly(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 light_bonus_rng = 1;
      case 1: {
        var values = message.light_bonus_rng || (message.light_bonus_rng = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated WinLine win_line_group = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_line_group || (message.win_line_group = []);
        values.push(_decodeWinLine(bb));
        bb.limit = limit;
        break;
      }

      // required CollectSlot collect_slot = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.collect_slot = _decodeCollectSlot(bb);
        bb.limit = limit;
        break;
      }

      // required CollectAnm collect_anm = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        message.collect_anm = _decodeCollectAnm(bb);
        bb.limit = limit;
        break;
      }

      // required Chance chance = 5;
      case 5: {
        var limit = pushTemporaryLength(bb);
        message.chance = _decodeChance(bb);
        bb.limit = limit;
        break;
      }

      // required Fortune fortune = 6;
      case 6: {
        var limit = pushTemporaryLength(bb);
        message.fortune = _decodeFortune(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.collect_slot === undefined)
    throw new Error("Missing required field: collect_slot");

  if (message.collect_anm === undefined)
    throw new Error("Missing required field: collect_anm");

  if (message.chance === undefined)
    throw new Error("Missing required field: chance");

  if (message.fortune === undefined)
    throw new Error("Missing required field: fortune");

  return message;
};

exports.encodeAttackInfo = function (message) {
  var bb = popByteBuffer();
  _encodeAttackInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeAttackInfo(message, bb) {
  // optional string id = 1;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $id);
  }

  // optional uint32 level = 2;
  var $level = message.level;
  if ($level !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $level);
  }

  // repeated uint32 house_level = 3;
  var array$house_level = message.house_level;
  if (array$house_level !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_level.length; i++) {
      var value = array$house_level[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 house_repair_cost = 4;
  var array$house_repair_cost = message.house_repair_cost;
  if (array$house_repair_cost !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_repair_cost.length; i++) {
      var value = array$house_repair_cost[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeAttackInfo = function (binary) {
  return _decodeAttackInfo(wrapByteBuffer(binary));
}

function _decodeAttackInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string id = 1;
      case 1: {
        message.id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 level = 2;
      case 2: {
        message.level = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 house_level = 3;
      case 3: {
        var values = message.house_level || (message.house_level = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 house_repair_cost = 4;
      case 4: {
        var values = message.house_repair_cost || (message.house_repair_cost = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeStealInfo = function (message) {
  var bb = popByteBuffer();
  _encodeStealInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeStealInfo(message, bb) {
  // optional string id = 1;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $id);
  }

  // optional uint32 level = 2;
  var $level = message.level;
  if ($level !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $level);
  }

  // repeated uint32 dig_pay = 3;
  var array$dig_pay = message.dig_pay;
  if (array$dig_pay !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$dig_pay.length; i++) {
      var value = array$dig_pay[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 dig_virtual_coin = 4;
  var array$dig_virtual_coin = message.dig_virtual_coin;
  if (array$dig_virtual_coin !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$dig_virtual_coin.length; i++) {
      var value = array$dig_virtual_coin[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeStealInfo = function (binary) {
  return _decodeStealInfo(wrapByteBuffer(binary));
}

function _decodeStealInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string id = 1;
      case 1: {
        message.id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 level = 2;
      case 2: {
        message.level = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 dig_pay = 3;
      case 3: {
        var values = message.dig_pay || (message.dig_pay = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 dig_virtual_coin = 4;
      case 4: {
        var values = message.dig_virtual_coin || (message.dig_virtual_coin = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeVillageNewsInfo = function (message) {
  var bb = popByteBuffer();
  _encodeVillageNewsInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeVillageNewsInfo(message, bb) {
  // optional uint32 type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $type);
  }

  // optional string id = 2;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $id);
  }

  // optional uint32 pay = 3;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $pay);
  }

  // optional string game_time = 4;
  var $game_time = message.game_time;
  if ($game_time !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $game_time);
  }
};

exports.decodeVillageNewsInfo = function (binary) {
  return _decodeVillageNewsInfo(wrapByteBuffer(binary));
}

function _decodeVillageNewsInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 type = 1;
      case 1: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      // optional string id = 2;
      case 2: {
        message.id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 pay = 3;
      case 3: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      // optional string game_time = 4;
      case 4: {
        message.game_time = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeVillageInforResul = function (message) {
  var bb = popByteBuffer();
  _encodeVillageInforResul(message, bb);
  return toUint8Array(bb);
}

function _encodeVillageInforResul(message, bb) {
  // optional string player_id = 1;
  var $player_id = message.player_id;
  if ($player_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $player_id);
  }

  // optional uint32 player_level = 2;
  var $player_level = message.player_level;
  if ($player_level !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $player_level);
  }

  // optional uint32 virtual_coin = 3;
  var $virtual_coin = message.virtual_coin;
  if ($virtual_coin !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $virtual_coin);
  }

  // optional uint32 shield_value = 4;
  var $shield_value = message.shield_value;
  if ($shield_value !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $shield_value);
  }

  // optional uint32 gain_coin = 5;
  var $gain_coin = message.gain_coin;
  if ($gain_coin !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $gain_coin);
  }

  // optional string steal_player_id = 6;
  var $steal_player_id = message.steal_player_id;
  if ($steal_player_id !== undefined) {
    writeVarint32(bb, 50);
    writeString(bb, $steal_player_id);
  }

  // optional uint32 steal_gain_non_player_bet = 7;
  var $steal_gain_non_player_bet = message.steal_gain_non_player_bet;
  if ($steal_gain_non_player_bet !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $steal_gain_non_player_bet);
  }

  // optional bool is_get_shield = 8;
  var $is_get_shield = message.is_get_shield;
  if ($is_get_shield !== undefined) {
    writeVarint32(bb, 64);
    writeByte(bb, $is_get_shield ? 1 : 0);
  }

  // optional uint32 fighter_value = 9;
  var $fighter_value = message.fighter_value;
  if ($fighter_value !== undefined) {
    writeVarint32(bb, 72);
    writeVarint32(bb, $fighter_value);
  }

  // repeated uint32 house_level = 10;
  var array$house_level = message.house_level;
  if (array$house_level !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_level.length; i++) {
      var value = array$house_level[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 house_update_cost = 11;
  var array$house_update_cost = message.house_update_cost;
  if (array$house_update_cost !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_update_cost.length; i++) {
      var value = array$house_update_cost[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 90);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 house_repair_cost = 12;
  var array$house_repair_cost = message.house_repair_cost;
  if (array$house_repair_cost !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_repair_cost.length; i++) {
      var value = array$house_repair_cost[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 98);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 next_era_update = 13;
  var $next_era_update = message.next_era_update;
  if ($next_era_update !== undefined) {
    writeVarint32(bb, 104);
    writeVarint32(bb, $next_era_update);
  }

  // repeated AttackInfo attack_info = 14;
  var array$attack_info = message.attack_info;
  if (array$attack_info !== undefined) {
    for (var i = 0; i < array$attack_info.length; i++) {
      var value = array$attack_info[i];
      writeVarint32(bb, 114);
      var nested = popByteBuffer();
      _encodeAttackInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional StealInfo steal_info = 15;
  var $steal_info = message.steal_info;
  if ($steal_info !== undefined) {
    writeVarint32(bb, 122);
    var nested = popByteBuffer();
    _encodeStealInfo($steal_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated VillageNewsInfo news_info = 16;
  var array$news_info = message.news_info;
  if (array$news_info !== undefined) {
    for (var i = 0; i < array$news_info.length; i++) {
      var value = array$news_info[i];
      writeVarint32(bb, 130);
      var nested = popByteBuffer();
      _encodeVillageNewsInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeVillageInforResul = function (binary) {
  return _decodeVillageInforResul(wrapByteBuffer(binary));
}

function _decodeVillageInforResul(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string player_id = 1;
      case 1: {
        message.player_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 player_level = 2;
      case 2: {
        message.player_level = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 virtual_coin = 3;
      case 3: {
        message.virtual_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 shield_value = 4;
      case 4: {
        message.shield_value = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 gain_coin = 5;
      case 5: {
        message.gain_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional string steal_player_id = 6;
      case 6: {
        message.steal_player_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 steal_gain_non_player_bet = 7;
      case 7: {
        message.steal_gain_non_player_bet = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool is_get_shield = 8;
      case 8: {
        message.is_get_shield = !!readByte(bb);
        break;
      }

      // optional uint32 fighter_value = 9;
      case 9: {
        message.fighter_value = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 house_level = 10;
      case 10: {
        var values = message.house_level || (message.house_level = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 house_update_cost = 11;
      case 11: {
        var values = message.house_update_cost || (message.house_update_cost = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 house_repair_cost = 12;
      case 12: {
        var values = message.house_repair_cost || (message.house_repair_cost = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 next_era_update = 13;
      case 13: {
        message.next_era_update = readVarint32(bb) >>> 0;
        break;
      }

      // repeated AttackInfo attack_info = 14;
      case 14: {
        var limit = pushTemporaryLength(bb);
        var values = message.attack_info || (message.attack_info = []);
        values.push(_decodeAttackInfo(bb));
        bb.limit = limit;
        break;
      }

      // optional StealInfo steal_info = 15;
      case 15: {
        var limit = pushTemporaryLength(bb);
        message.steal_info = _decodeStealInfo(bb);
        bb.limit = limit;
        break;
      }

      // repeated VillageNewsInfo news_info = 16;
      case 16: {
        var limit = pushTemporaryLength(bb);
        var values = message.news_info || (message.news_info = []);
        values.push(_decodeVillageNewsInfo(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeCombination = function (message) {
  var bb = popByteBuffer();
  _encodeCombination(message, bb);
  return toUint8Array(bb);
}

function _encodeCombination(message, bb) {
  // optional uint32 game_num = 1;
  var $game_num = message.game_num;
  if ($game_num !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $game_num);
  }

  // optional uint32 home_id = 2;
  var $home_id = message.home_id;
  if ($home_id !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $home_id);
  }

  // optional uint32 away_id = 3;
  var $away_id = message.away_id;
  if ($away_id !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $away_id);
  }

  // optional string home_name = 4;
  var $home_name = message.home_name;
  if ($home_name !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $home_name);
  }

  // optional string away_name = 5;
  var $away_name = message.away_name;
  if ($away_name !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $away_name);
  }

  // optional uint32 home_odds = 6;
  var $home_odds = message.home_odds;
  if ($home_odds !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $home_odds);
  }

  // optional uint32 away_odds = 7;
  var $away_odds = message.away_odds;
  if ($away_odds !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $away_odds);
  }

  // optional uint32 tie_odds = 8;
  var $tie_odds = message.tie_odds;
  if ($tie_odds !== undefined) {
    writeVarint32(bb, 64);
    writeVarint32(bb, $tie_odds);
  }
};

exports.decodeCombination = function (binary) {
  return _decodeCombination(wrapByteBuffer(binary));
}

function _decodeCombination(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 game_num = 1;
      case 1: {
        message.game_num = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 home_id = 2;
      case 2: {
        message.home_id = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 away_id = 3;
      case 3: {
        message.away_id = readVarint32(bb) >>> 0;
        break;
      }

      // optional string home_name = 4;
      case 4: {
        message.home_name = readString(bb, readVarint32(bb));
        break;
      }

      // optional string away_name = 5;
      case 5: {
        message.away_name = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 home_odds = 6;
      case 6: {
        message.home_odds = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 away_odds = 7;
      case 7: {
        message.away_odds = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 tie_odds = 8;
      case 8: {
        message.tie_odds = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeArcadeFootBall = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeFootBall(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeFootBall(message, bb) {
  // repeated Combination next_game_Combination = 1;
  var array$next_game_Combination = message.next_game_Combination;
  if (array$next_game_Combination !== undefined) {
    for (var i = 0; i < array$next_game_Combination.length; i++) {
      var value = array$next_game_Combination[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeCombination(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 arcad_unit = 2;
  var $arcad_unit = message.arcad_unit;
  if ($arcad_unit !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $arcad_unit);
  }

  // optional uint32 bet_maximum = 3;
  var $bet_maximum = message.bet_maximum;
  if ($bet_maximum !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $bet_maximum);
  }

  // optional uint32 bet_minimum = 4;
  var $bet_minimum = message.bet_minimum;
  if ($bet_minimum !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $bet_minimum);
  }

  // optional string video_url_prefix = 5;
  var $video_url_prefix = message.video_url_prefix;
  if ($video_url_prefix !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $video_url_prefix);
  }

  // optional string video_url_foldername = 6;
  var $video_url_foldername = message.video_url_foldername;
  if ($video_url_foldername !== undefined) {
    writeVarint32(bb, 50);
    writeString(bb, $video_url_foldername);
  }

  // optional uint32 win_pay = 7;
  var $win_pay = message.win_pay;
  if ($win_pay !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $win_pay);
  }
};

exports.decodeArcadeFootBall = function (binary) {
  return _decodeArcadeFootBall(wrapByteBuffer(binary));
}

function _decodeArcadeFootBall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Combination next_game_Combination = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.next_game_Combination || (message.next_game_Combination = []);
        values.push(_decodeCombination(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 arcad_unit = 2;
      case 2: {
        message.arcad_unit = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 bet_maximum = 3;
      case 3: {
        message.bet_maximum = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 bet_minimum = 4;
      case 4: {
        message.bet_minimum = readVarint32(bb) >>> 0;
        break;
      }

      // optional string video_url_prefix = 5;
      case 5: {
        message.video_url_prefix = readString(bb, readVarint32(bb));
        break;
      }

      // optional string video_url_foldername = 6;
      case 6: {
        message.video_url_foldername = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 win_pay = 7;
      case 7: {
        message.win_pay = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeDinosaurInfo = function (message) {
  var bb = popByteBuffer();
  _encodeDinosaurInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeDinosaurInfo(message, bb) {
  // optional uint32 id = 1;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $id);
  }

  // optional uint32 areaNO = 2;
  var $areaNO = message.areaNO;
  if ($areaNO !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $areaNO);
  }

  // optional uint32 type = 3;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $type);
  }

  // optional uint32 star = 4;
  var $star = message.star;
  if ($star !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $star);
  }

  // optional uint32 rarity = 5;
  var $rarity = message.rarity;
  if ($rarity !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $rarity);
  }

  // optional uint32 rank = 6;
  var $rank = message.rank;
  if ($rank !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $rank);
  }

  // optional uint32 price = 7;
  var $price = message.price;
  if ($price !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $price);
  }

  // optional uint32 satiation = 8;
  var $satiation = message.satiation;
  if ($satiation !== undefined) {
    writeVarint32(bb, 64);
    writeVarint32(bb, $satiation);
  }

  // optional uint32 satiation_max = 9;
  var $satiation_max = message.satiation_max;
  if ($satiation_max !== undefined) {
    writeVarint32(bb, 72);
    writeVarint32(bb, $satiation_max);
  }

  // optional uint32 favorability = 10;
  var $favorability = message.favorability;
  if ($favorability !== undefined) {
    writeVarint32(bb, 80);
    writeVarint32(bb, $favorability);
  }

  // optional uint32 favorability_max = 11;
  var $favorability_max = message.favorability_max;
  if ($favorability_max !== undefined) {
    writeVarint32(bb, 88);
    writeVarint32(bb, $favorability_max);
  }

  // optional bool get_sick = 12;
  var $get_sick = message.get_sick;
  if ($get_sick !== undefined) {
    writeVarint32(bb, 96);
    writeByte(bb, $get_sick ? 1 : 0);
  }

  // optional bool get_dirty = 13;
  var $get_dirty = message.get_dirty;
  if ($get_dirty !== undefined) {
    writeVarint32(bb, 104);
    writeByte(bb, $get_dirty ? 1 : 0);
  }

  // optional bool alive = 14;
  var $alive = message.alive;
  if ($alive !== undefined) {
    writeVarint32(bb, 112);
    writeByte(bb, $alive ? 1 : 0);
  }

  // optional bool rise = 15;
  var $rise = message.rise;
  if ($rise !== undefined) {
    writeVarint32(bb, 120);
    writeByte(bb, $rise ? 1 : 0);
  }

  // optional uint32 skin_type = 16;
  var $skin_type = message.skin_type;
  if ($skin_type !== undefined) {
    writeVarint32(bb, 128);
    writeVarint32(bb, $skin_type);
  }

  // optional string remain_time = 17;
  var $remain_time = message.remain_time;
  if ($remain_time !== undefined) {
    writeVarint32(bb, 138);
    writeString(bb, $remain_time);
  }
};

exports.decodeDinosaurInfo = function (binary) {
  return _decodeDinosaurInfo(wrapByteBuffer(binary));
}

function _decodeDinosaurInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 id = 1;
      case 1: {
        message.id = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 areaNO = 2;
      case 2: {
        message.areaNO = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 type = 3;
      case 3: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 star = 4;
      case 4: {
        message.star = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 rarity = 5;
      case 5: {
        message.rarity = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 rank = 6;
      case 6: {
        message.rank = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 price = 7;
      case 7: {
        message.price = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 satiation = 8;
      case 8: {
        message.satiation = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 satiation_max = 9;
      case 9: {
        message.satiation_max = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 favorability = 10;
      case 10: {
        message.favorability = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 favorability_max = 11;
      case 11: {
        message.favorability_max = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool get_sick = 12;
      case 12: {
        message.get_sick = !!readByte(bb);
        break;
      }

      // optional bool get_dirty = 13;
      case 13: {
        message.get_dirty = !!readByte(bb);
        break;
      }

      // optional bool alive = 14;
      case 14: {
        message.alive = !!readByte(bb);
        break;
      }

      // optional bool rise = 15;
      case 15: {
        message.rise = !!readByte(bb);
        break;
      }

      // optional uint32 skin_type = 16;
      case 16: {
        message.skin_type = readVarint32(bb) >>> 0;
        break;
      }

      // optional string remain_time = 17;
      case 17: {
        message.remain_time = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeAreaInfo = function (message) {
  var bb = popByteBuffer();
  _encodeAreaInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeAreaInfo(message, bb) {
  // optional bool area_opened = 1;
  var $area_opened = message.area_opened;
  if ($area_opened !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $area_opened ? 1 : 0);
  }

  // optional uint32 area_price = 2;
  var $area_price = message.area_price;
  if ($area_price !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $area_price);
  }

  // optional uint32 use_scene_id = 3;
  var $use_scene_id = message.use_scene_id;
  if ($use_scene_id !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $use_scene_id);
  }
};

exports.decodeAreaInfo = function (binary) {
  return _decodeAreaInfo(wrapByteBuffer(binary));
}

function _decodeAreaInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool area_opened = 1;
      case 1: {
        message.area_opened = !!readByte(bb);
        break;
      }

      // optional uint32 area_price = 2;
      case 2: {
        message.area_price = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 use_scene_id = 3;
      case 3: {
        message.use_scene_id = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeFavorabilityInfoResult = function (message) {
  var bb = popByteBuffer();
  _encodeFavorabilityInfoResult(message, bb);
  return toUint8Array(bb);
}

function _encodeFavorabilityInfoResult(message, bb) {
  // optional uint32 id = 1;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $id);
  }

  // optional uint32 stage = 2;
  var $stage = message.stage;
  if ($stage !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $stage);
  }

  // optional uint32 virtual_coin = 3;
  var $virtual_coin = message.virtual_coin;
  if ($virtual_coin !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $virtual_coin);
  }

  // optional uint32 egg = 4;
  var $egg = message.egg;
  if ($egg !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $egg);
  }

  // optional bool get_mode = 5;
  var $get_mode = message.get_mode;
  if ($get_mode !== undefined) {
    writeVarint32(bb, 40);
    writeByte(bb, $get_mode ? 1 : 0);
  }
};

exports.decodeFavorabilityInfoResult = function (binary) {
  return _decodeFavorabilityInfoResult(wrapByteBuffer(binary));
}

function _decodeFavorabilityInfoResult(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 id = 1;
      case 1: {
        message.id = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 stage = 2;
      case 2: {
        message.stage = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 virtual_coin = 3;
      case 3: {
        message.virtual_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 egg = 4;
      case 4: {
        message.egg = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool get_mode = 5;
      case 5: {
        message.get_mode = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeFeedInfo = function (message) {
  var bb = popByteBuffer();
  _encodeFeedInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeFeedInfo(message, bb) {
  // optional uint32 satiation_add = 1;
  var $satiation_add = message.satiation_add;
  if ($satiation_add !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $satiation_add);
  }

  // optional uint32 favorability_add = 2;
  var $favorability_add = message.favorability_add;
  if ($favorability_add !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $favorability_add);
  }

  // optional uint32 fall_id = 3;
  var $fall_id = message.fall_id;
  if ($fall_id !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $fall_id);
  }

  // optional uint32 egg = 4;
  var $egg = message.egg;
  if ($egg !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $egg);
  }

  // optional uint32 pay = 5;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $pay);
  }
};

exports.decodeFeedInfo = function (binary) {
  return _decodeFeedInfo(wrapByteBuffer(binary));
}

function _decodeFeedInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 satiation_add = 1;
      case 1: {
        message.satiation_add = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 favorability_add = 2;
      case 2: {
        message.favorability_add = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 fall_id = 3;
      case 3: {
        message.fall_id = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 egg = 4;
      case 4: {
        message.egg = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 pay = 5;
      case 5: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeSubgameInfo = function (message) {
  var bb = popByteBuffer();
  _encodeSubgameInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeSubgameInfo(message, bb) {
  // optional uint32 game_type = 1;
  var $game_type = message.game_type;
  if ($game_type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $game_type);
  }

  // optional uint32 sub_game_type = 2;
  var $sub_game_type = message.sub_game_type;
  if ($sub_game_type !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $sub_game_type);
  }

  // optional uint32 do_times = 3;
  var $do_times = message.do_times;
  if ($do_times !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $do_times);
  }

  // optional bool go_to_optioncall = 4;
  var $go_to_optioncall = message.go_to_optioncall;
  if ($go_to_optioncall !== undefined) {
    writeVarint32(bb, 32);
    writeByte(bb, $go_to_optioncall ? 1 : 0);
  }

  // optional uint32 pay = 5;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $pay);
  }

  // optional uint32 favorability_gain = 6;
  var $favorability_gain = message.favorability_gain;
  if ($favorability_gain !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $favorability_gain);
  }

  // optional uint32 virtual_coin_gain = 7;
  var $virtual_coin_gain = message.virtual_coin_gain;
  if ($virtual_coin_gain !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $virtual_coin_gain);
  }
};

exports.decodeSubgameInfo = function (binary) {
  return _decodeSubgameInfo(wrapByteBuffer(binary));
}

function _decodeSubgameInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 game_type = 1;
      case 1: {
        message.game_type = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 sub_game_type = 2;
      case 2: {
        message.sub_game_type = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 do_times = 3;
      case 3: {
        message.do_times = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool go_to_optioncall = 4;
      case 4: {
        message.go_to_optioncall = !!readByte(bb);
        break;
      }

      // optional uint32 pay = 5;
      case 5: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 favorability_gain = 6;
      case 6: {
        message.favorability_gain = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 virtual_coin_gain = 7;
      case 7: {
        message.virtual_coin_gain = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeNewsInfo = function (message) {
  var bb = popByteBuffer();
  _encodeNewsInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeNewsInfo(message, bb) {
  // optional uint32 type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $type);
  }

  // optional uint32 id = 2;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $id);
  }

  // optional string event_time = 3;
  var $event_time = message.event_time;
  if ($event_time !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $event_time);
  }
};

exports.decodeNewsInfo = function (binary) {
  return _decodeNewsInfo(wrapByteBuffer(binary));
}

function _decodeNewsInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 type = 1;
      case 1: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 id = 2;
      case 2: {
        message.id = readVarint32(bb) >>> 0;
        break;
      }

      // optional string event_time = 3;
      case 3: {
        message.event_time = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeArcadeTamagotchiResult = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeTamagotchiResult(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeTamagotchiResult(message, bb) {
  // optional uint32 virtual_coin = 1;
  var $virtual_coin = message.virtual_coin;
  if ($virtual_coin !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $virtual_coin);
  }

  // optional uint32 egg_amount = 2;
  var $egg_amount = message.egg_amount;
  if ($egg_amount !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $egg_amount);
  }

  // optional uint32 food_amount = 3;
  var $food_amount = message.food_amount;
  if ($food_amount !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $food_amount);
  }

  // repeated uint32 incubation_eggs_id = 4;
  var array$incubation_eggs_id = message.incubation_eggs_id;
  if (array$incubation_eggs_id !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$incubation_eggs_id.length; i++) {
      var value = array$incubation_eggs_id[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 incubation_eggs_price = 5;
  var array$incubation_eggs_price = message.incubation_eggs_price;
  if (array$incubation_eggs_price !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$incubation_eggs_price.length; i++) {
      var value = array$incubation_eggs_price[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated DinosaurInfo Dinosaurs_data = 6;
  var array$Dinosaurs_data = message.Dinosaurs_data;
  if (array$Dinosaurs_data !== undefined) {
    for (var i = 0; i < array$Dinosaurs_data.length; i++) {
      var value = array$Dinosaurs_data[i];
      writeVarint32(bb, 50);
      var nested = popByteBuffer();
      _encodeDinosaurInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated AreaInfo Area_data = 7;
  var array$Area_data = message.Area_data;
  if (array$Area_data !== undefined) {
    for (var i = 0; i < array$Area_data.length; i++) {
      var value = array$Area_data[i];
      writeVarint32(bb, 58);
      var nested = popByteBuffer();
      _encodeAreaInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional FavorabilityInfoResult Favorability_data = 8;
  var $Favorability_data = message.Favorability_data;
  if ($Favorability_data !== undefined) {
    writeVarint32(bb, 66);
    var nested = popByteBuffer();
    _encodeFavorabilityInfoResult($Favorability_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional FeedInfo Feed_return_data = 9;
  var $Feed_return_data = message.Feed_return_data;
  if ($Feed_return_data !== undefined) {
    writeVarint32(bb, 74);
    var nested = popByteBuffer();
    _encodeFeedInfo($Feed_return_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional uint32 sell_dinosaur_pay = 10;
  var $sell_dinosaur_pay = message.sell_dinosaur_pay;
  if ($sell_dinosaur_pay !== undefined) {
    writeVarint32(bb, 80);
    writeVarint32(bb, $sell_dinosaur_pay);
  }

  // optional SubgameInfo sub_game_data = 11;
  var $sub_game_data = message.sub_game_data;
  if ($sub_game_data !== undefined) {
    writeVarint32(bb, 90);
    var nested = popByteBuffer();
    _encodeSubgameInfo($sub_game_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated NewsInfo News_data = 12;
  var array$News_data = message.News_data;
  if (array$News_data !== undefined) {
    for (var i = 0; i < array$News_data.length; i++) {
      var value = array$News_data[i];
      writeVarint32(bb, 98);
      var nested = popByteBuffer();
      _encodeNewsInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated DinosaurInfo Dead_data = 13;
  var array$Dead_data = message.Dead_data;
  if (array$Dead_data !== undefined) {
    for (var i = 0; i < array$Dead_data.length; i++) {
      var value = array$Dead_data[i];
      writeVarint32(bb, 106);
      var nested = popByteBuffer();
      _encodeDinosaurInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeArcadeTamagotchiResult = function (binary) {
  return _decodeArcadeTamagotchiResult(wrapByteBuffer(binary));
}

function _decodeArcadeTamagotchiResult(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 virtual_coin = 1;
      case 1: {
        message.virtual_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 egg_amount = 2;
      case 2: {
        message.egg_amount = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 food_amount = 3;
      case 3: {
        message.food_amount = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 incubation_eggs_id = 4;
      case 4: {
        var values = message.incubation_eggs_id || (message.incubation_eggs_id = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 incubation_eggs_price = 5;
      case 5: {
        var values = message.incubation_eggs_price || (message.incubation_eggs_price = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated DinosaurInfo Dinosaurs_data = 6;
      case 6: {
        var limit = pushTemporaryLength(bb);
        var values = message.Dinosaurs_data || (message.Dinosaurs_data = []);
        values.push(_decodeDinosaurInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated AreaInfo Area_data = 7;
      case 7: {
        var limit = pushTemporaryLength(bb);
        var values = message.Area_data || (message.Area_data = []);
        values.push(_decodeAreaInfo(bb));
        bb.limit = limit;
        break;
      }

      // optional FavorabilityInfoResult Favorability_data = 8;
      case 8: {
        var limit = pushTemporaryLength(bb);
        message.Favorability_data = _decodeFavorabilityInfoResult(bb);
        bb.limit = limit;
        break;
      }

      // optional FeedInfo Feed_return_data = 9;
      case 9: {
        var limit = pushTemporaryLength(bb);
        message.Feed_return_data = _decodeFeedInfo(bb);
        bb.limit = limit;
        break;
      }

      // optional uint32 sell_dinosaur_pay = 10;
      case 10: {
        message.sell_dinosaur_pay = readVarint32(bb) >>> 0;
        break;
      }

      // optional SubgameInfo sub_game_data = 11;
      case 11: {
        var limit = pushTemporaryLength(bb);
        message.sub_game_data = _decodeSubgameInfo(bb);
        bb.limit = limit;
        break;
      }

      // repeated NewsInfo News_data = 12;
      case 12: {
        var limit = pushTemporaryLength(bb);
        var values = message.News_data || (message.News_data = []);
        values.push(_decodeNewsInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated DinosaurInfo Dead_data = 13;
      case 13: {
        var limit = pushTemporaryLength(bb);
        var values = message.Dead_data || (message.Dead_data = []);
        values.push(_decodeDinosaurInfo(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeRecordList = function (message) {
  var bb = popByteBuffer();
  _encodeRecordList(message, bb);
  return toUint8Array(bb);
}

function _encodeRecordList(message, bb) {
  // optional string type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $type);
  }

  // optional uint32 amount = 2;
  var $amount = message.amount;
  if ($amount !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $amount);
  }

  // optional string game_time = 3;
  var $game_time = message.game_time;
  if ($game_time !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $game_time);
  }
};

exports.decodeRecordList = function (binary) {
  return _decodeRecordList(wrapByteBuffer(binary));
}

function _decodeRecordList(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string type = 1;
      case 1: {
        message.type = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 amount = 2;
      case 2: {
        message.amount = readVarint32(bb) >>> 0;
        break;
      }

      // optional string game_time = 3;
      case 3: {
        message.game_time = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeSlotResult = function (message) {
  var bb = popByteBuffer();
  _encodeSlotResult(message, bb);
  return toUint8Array(bb);
}

function _encodeSlotResult(message, bb) {
  // required string module_id = 1;
  var $module_id = message.module_id;
  if ($module_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $module_id);
  }

  // required uint64 credit = 2;
  var $credit = message.credit;
  if ($credit !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $credit);
  }

  // repeated int32 rng = 3;
  var array$rng = message.rng;
  if (array$rng !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$rng.length; i++) {
      var value = array$rng[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated WinLine win_line_group = 4;
  var array$win_line_group = message.win_line_group;
  if (array$win_line_group !== undefined) {
    for (var i = 0; i < array$win_line_group.length; i++) {
      var value = array$win_line_group[i];
      writeVarint32(bb, 34);
      var nested = popByteBuffer();
      _encodeWinLine(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional int32 multiplier_alone = 5;
  var $multiplier_alone = message.multiplier_alone;
  if ($multiplier_alone !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, intToLong($multiplier_alone));
  }

  // repeated int32 mulitplier_pattern = 6;
  var array$mulitplier_pattern = message.mulitplier_pattern;
  if (array$mulitplier_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$mulitplier_pattern.length; i++) {
      var value = array$mulitplier_pattern[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 50);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 random_syb_pattern = 7;
  var array$random_syb_pattern = message.random_syb_pattern;
  if (array$random_syb_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$random_syb_pattern.length; i++) {
      var value = array$random_syb_pattern[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 58);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional int32 bonus_multiplier = 8;
  var $bonus_multiplier = message.bonus_multiplier;
  if ($bonus_multiplier !== undefined) {
    writeVarint32(bb, 64);
    writeVarint64(bb, intToLong($bonus_multiplier));
  }

  // repeated WinBonus win_bonus_group = 9;
  var array$win_bonus_group = message.win_bonus_group;
  if (array$win_bonus_group !== undefined) {
    for (var i = 0; i < array$win_bonus_group.length; i++) {
      var value = array$win_bonus_group[i];
      writeVarint32(bb, 74);
      var nested = popByteBuffer();
      _encodeWinBonus(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated int32 be_locked_pattern = 10;
  var array$be_locked_pattern = message.be_locked_pattern;
  if (array$be_locked_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$be_locked_pattern.length; i++) {
      var value = array$be_locked_pattern[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 position_pay = 11;
  var array$position_pay = message.position_pay;
  if (array$position_pay !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$position_pay.length; i++) {
      var value = array$position_pay[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 90);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated ReelStackPay reel_stack_pay = 12;
  var array$reel_stack_pay = message.reel_stack_pay;
  if (array$reel_stack_pay !== undefined) {
    for (var i = 0; i < array$reel_stack_pay.length; i++) {
      var value = array$reel_stack_pay[i];
      writeVarint32(bb, 98);
      var nested = popByteBuffer();
      _encodeReelStackPay(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated bool golden_wild_flag = 13;
  var array$golden_wild_flag = message.golden_wild_flag;
  if (array$golden_wild_flag !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$golden_wild_flag.length; i++) {
      var value = array$golden_wild_flag[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 106);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 pay_of_scatter = 14;
  var array$pay_of_scatter = message.pay_of_scatter;
  if (array$pay_of_scatter !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pay_of_scatter.length; i++) {
      var value = array$pay_of_scatter[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 114);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 capture_award = 15;
  var $capture_award = message.capture_award;
  if ($capture_award !== undefined) {
    writeVarint32(bb, 120);
    writeVarint32(bb, $capture_award);
  }

  // optional uint32 win_line_multiple = 16;
  var $win_line_multiple = message.win_line_multiple;
  if ($win_line_multiple !== undefined) {
    writeVarint32(bb, 128);
    writeVarint32(bb, $win_line_multiple);
  }

  // optional Mystery mystery = 17;
  var $mystery = message.mystery;
  if ($mystery !== undefined) {
    writeVarint32(bb, 138);
    var nested = popByteBuffer();
    _encodeMystery($mystery, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional JPPay jp = 18;
  var $jp = message.jp;
  if ($jp !== undefined) {
    writeVarint32(bb, 146);
    var nested = popByteBuffer();
    _encodeJPPay($jp, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated bool overlap = 19;
  var array$overlap = message.overlap;
  if (array$overlap !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$overlap.length; i++) {
      var value = array$overlap[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 154);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 pay_of_pos = 20;
  var array$pay_of_pos = message.pay_of_pos;
  if (array$pay_of_pos !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pay_of_pos.length; i++) {
      var value = array$pay_of_pos[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 162);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated GoldenIcon golden_icon = 21;
  var array$golden_icon = message.golden_icon;
  if (array$golden_icon !== undefined) {
    for (var i = 0; i < array$golden_icon.length; i++) {
      var value = array$golden_icon[i];
      writeVarint32(bb, 170);
      var nested = popByteBuffer();
      _encodeGoldenIcon(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated bool exp_wild = 22;
  var array$exp_wild = message.exp_wild;
  if (array$exp_wild !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$exp_wild.length; i++) {
      var value = array$exp_wild[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 178);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated bool pre_exp_wild = 23;
  var array$pre_exp_wild = message.pre_exp_wild;
  if (array$pre_exp_wild !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pre_exp_wild.length; i++) {
      var value = array$pre_exp_wild[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 186);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional int32 trigger_respin_times = 24;
  var $trigger_respin_times = message.trigger_respin_times;
  if ($trigger_respin_times !== undefined) {
    writeVarint32(bb, 192);
    writeVarint64(bb, intToLong($trigger_respin_times));
  }

  // repeated bool push_wild = 25;
  var array$push_wild = message.push_wild;
  if (array$push_wild !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$push_wild.length; i++) {
      var value = array$push_wild[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 202);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional TypedWild typed_wild = 26;
  var $typed_wild = message.typed_wild;
  if ($typed_wild !== undefined) {
    writeVarint32(bb, 210);
    var nested = popByteBuffer();
    _encodeTypedWild($typed_wild, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated SubResult sub_result = 27;
  var array$sub_result = message.sub_result;
  if (array$sub_result !== undefined) {
    for (var i = 0; i < array$sub_result.length; i++) {
      var value = array$sub_result[i];
      writeVarint32(bb, 218);
      var nested = popByteBuffer();
      _encodeSubResult(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 icon_accumulate = 28;
  var $icon_accumulate = message.icon_accumulate;
  if ($icon_accumulate !== undefined) {
    writeVarint32(bb, 224);
    writeVarint32(bb, $icon_accumulate);
  }

  // repeated int32 scatter_type = 29;
  var array$scatter_type = message.scatter_type;
  if (array$scatter_type !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$scatter_type.length; i++) {
      var value = array$scatter_type[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 234);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 pre_scatter_type = 30;
  var array$pre_scatter_type = message.pre_scatter_type;
  if (array$pre_scatter_type !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pre_scatter_type.length; i++) {
      var value = array$pre_scatter_type[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 242);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 full_pay = 31;
  var $full_pay = message.full_pay;
  if ($full_pay !== undefined) {
    writeVarint32(bb, 248);
    writeVarint32(bb, $full_pay);
  }

  // optional uint32 block_reel_index = 32;
  var $block_reel_index = message.block_reel_index;
  if ($block_reel_index !== undefined) {
    writeVarint32(bb, 256);
    writeVarint32(bb, $block_reel_index);
  }

  // repeated bool trigger_super_scatter = 33;
  var array$trigger_super_scatter = message.trigger_super_scatter;
  if (array$trigger_super_scatter !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$trigger_super_scatter.length; i++) {
      var value = array$trigger_super_scatter[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 266);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 strip_index = 34;
  var $strip_index = message.strip_index;
  if ($strip_index !== undefined) {
    writeVarint32(bb, 272);
    writeVarint32(bb, $strip_index);
  }

  // repeated CascadeResult cascade_result = 35;
  var array$cascade_result = message.cascade_result;
  if (array$cascade_result !== undefined) {
    for (var i = 0; i < array$cascade_result.length; i++) {
      var value = array$cascade_result[i];
      writeVarint32(bb, 282);
      var nested = popByteBuffer();
      _encodeCascadeResult(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 random_bonus_times = 36;
  var $random_bonus_times = message.random_bonus_times;
  if ($random_bonus_times !== undefined) {
    writeVarint32(bb, 288);
    writeVarint32(bb, $random_bonus_times);
  }

  // repeated uint32 bonus_multiplier_list = 37;
  var array$bonus_multiplier_list = message.bonus_multiplier_list;
  if (array$bonus_multiplier_list !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$bonus_multiplier_list.length; i++) {
      var value = array$bonus_multiplier_list[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 298);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 bonus_multiplier_index = 38;
  var $bonus_multiplier_index = message.bonus_multiplier_index;
  if ($bonus_multiplier_index !== undefined) {
    writeVarint32(bb, 304);
    writeVarint32(bb, $bonus_multiplier_index);
  }

  // repeated uint32 col_cascade_count = 39;
  var array$col_cascade_count = message.col_cascade_count;
  if (array$col_cascade_count !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$col_cascade_count.length; i++) {
      var value = array$col_cascade_count[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 314);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 external_multiplier = 40;
  var $external_multiplier = message.external_multiplier;
  if ($external_multiplier !== undefined) {
    writeVarint32(bb, 320);
    writeVarint32(bb, $external_multiplier);
  }

  // optional uint32 pre_no_win_acc = 41;
  var $pre_no_win_acc = message.pre_no_win_acc;
  if ($pre_no_win_acc !== undefined) {
    writeVarint32(bb, 328);
    writeVarint32(bb, $pre_no_win_acc);
  }

  // optional uint32 no_win_acc = 42;
  var $no_win_acc = message.no_win_acc;
  if ($no_win_acc !== undefined) {
    writeVarint32(bb, 336);
    writeVarint32(bb, $no_win_acc);
  }

  // repeated uint32 respin_types = 43;
  var array$respin_types = message.respin_types;
  if (array$respin_types !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$respin_types.length; i++) {
      var value = array$respin_types[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 346);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint64 respin_costs = 44;
  var array$respin_costs = message.respin_costs;
  if (array$respin_costs !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$respin_costs.length; i++) {
      var value = array$respin_costs[i];
      writeVarint64(packed, value);
    }
    writeVarint32(bb, 354);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 jackpot_rng = 45;
  var $jackpot_rng = message.jackpot_rng;
  if ($jackpot_rng !== undefined) {
    writeVarint32(bb, 360);
    writeVarint32(bb, $jackpot_rng);
  }

  // optional uint32 jackpot_type = 46;
  var $jackpot_type = message.jackpot_type;
  if ($jackpot_type !== undefined) {
    writeVarint32(bb, 368);
    writeVarint32(bb, $jackpot_type);
  }

  // repeated uint32 capture_award_list = 47;
  var array$capture_award_list = message.capture_award_list;
  if (array$capture_award_list !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$capture_award_list.length; i++) {
      var value = array$capture_award_list[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 378);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 capture_award_index = 48;
  var $capture_award_index = message.capture_award_index;
  if ($capture_award_index !== undefined) {
    writeVarint32(bb, 384);
    writeVarint32(bb, $capture_award_index);
  }

  // repeated bool golden_scatter_flag = 49;
  var array$golden_scatter_flag = message.golden_scatter_flag;
  if (array$golden_scatter_flag !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$golden_scatter_flag.length; i++) {
      var value = array$golden_scatter_flag[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 394);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 full_symbol = 50;
  var $full_symbol = message.full_symbol;
  if ($full_symbol !== undefined) {
    writeVarint32(bb, 400);
    writeVarint32(bb, $full_symbol);
  }

  // repeated uint32 pay_of_star = 51;
  var array$pay_of_star = message.pay_of_star;
  if (array$pay_of_star !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$pay_of_star.length; i++) {
      var value = array$pay_of_star[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 410);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 collect_counter = 52;
  var $collect_counter = message.collect_counter;
  if ($collect_counter !== undefined) {
    writeVarint32(bb, 416);
    writeVarint32(bb, $collect_counter);
  }

  // optional uint32 cur_collect_counter = 53;
  var $cur_collect_counter = message.cur_collect_counter;
  if ($cur_collect_counter !== undefined) {
    writeVarint32(bb, 424);
    writeVarint32(bb, $cur_collect_counter);
  }

  // repeated uint32 upgrade_id = 54;
  var array$upgrade_id = message.upgrade_id;
  if (array$upgrade_id !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$upgrade_id.length; i++) {
      var value = array$upgrade_id[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 434);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 change_symbol_id = 55;
  var $change_symbol_id = message.change_symbol_id;
  if ($change_symbol_id !== undefined) {
    writeVarint32(bb, 440);
    writeVarint32(bb, $change_symbol_id);
  }

  // repeated uint32 full_symbol_pattern = 56;
  var array$full_symbol_pattern = message.full_symbol_pattern;
  if (array$full_symbol_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$full_symbol_pattern.length; i++) {
      var value = array$full_symbol_pattern[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 450);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 avg_bet = 57;
  var $avg_bet = message.avg_bet;
  if ($avg_bet !== undefined) {
    writeVarint32(bb, 456);
    writeVarint32(bb, $avg_bet);
  }

  // optional uint32 trigger_bonus_total_bet = 58;
  var $trigger_bonus_total_bet = message.trigger_bonus_total_bet;
  if ($trigger_bonus_total_bet !== undefined) {
    writeVarint32(bb, 464);
    writeVarint32(bb, $trigger_bonus_total_bet);
  }

  // repeated uint32 respin_reels = 59;
  var array$respin_reels = message.respin_reels;
  if (array$respin_reels !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$respin_reels.length; i++) {
      var value = array$respin_reels[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 474);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated CentInAsk cent_in_ask = 60;
  var array$cent_in_ask = message.cent_in_ask;
  if (array$cent_in_ask !== undefined) {
    for (var i = 0; i < array$cent_in_ask.length; i++) {
      var value = array$cent_in_ask[i];
      writeVarint32(bb, 482);
      var nested = popByteBuffer();
      _encodeCentInAsk(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 next_strip_index = 61;
  var $next_strip_index = message.next_strip_index;
  if ($next_strip_index !== undefined) {
    writeVarint32(bb, 488);
    writeVarint32(bb, $next_strip_index);
  }

  // repeated BonusBet bonus_bet_list = 62;
  var array$bonus_bet_list = message.bonus_bet_list;
  if (array$bonus_bet_list !== undefined) {
    for (var i = 0; i < array$bonus_bet_list.length; i++) {
      var value = array$bonus_bet_list[i];
      writeVarint32(bb, 498);
      var nested = popByteBuffer();
      _encodeBonusBet(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional int32 last_player_opt_index = 63;
  var $last_player_opt_index = message.last_player_opt_index;
  if ($last_player_opt_index !== undefined) {
    writeVarint32(bb, 504);
    writeVarint64(bb, intToLong($last_player_opt_index));
  }

  // repeated uint32 cur_star_counts = 64;
  var array$cur_star_counts = message.cur_star_counts;
  if (array$cur_star_counts !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$cur_star_counts.length; i++) {
      var value = array$cur_star_counts[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 514);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated CollectTimes total_star_times = 65;
  var array$total_star_times = message.total_star_times;
  if (array$total_star_times !== undefined) {
    for (var i = 0; i < array$total_star_times.length; i++) {
      var value = array$total_star_times[i];
      writeVarint32(bb, 522);
      var nested = popByteBuffer();
      _encodeCollectTimes(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated CollectTimes bonus_star_times = 66;
  var array$bonus_star_times = message.bonus_star_times;
  if (array$bonus_star_times !== undefined) {
    for (var i = 0; i < array$bonus_star_times.length; i++) {
      var value = array$bonus_star_times[i];
      writeVarint32(bb, 530);
      var nested = popByteBuffer();
      _encodeCollectTimes(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated uint32 cur_random_prize = 67;
  var array$cur_random_prize = message.cur_random_prize;
  if (array$cur_random_prize !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$cur_random_prize.length; i++) {
      var value = array$cur_random_prize[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 538);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional PoolInfo pool_info = 68;
  var $pool_info = message.pool_info;
  if ($pool_info !== undefined) {
    writeVarint32(bb, 546);
    var nested = popByteBuffer();
    _encodePoolInfo($pool_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated uint32 crush_syb_pattern = 69;
  var array$crush_syb_pattern = message.crush_syb_pattern;
  if (array$crush_syb_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$crush_syb_pattern.length; i++) {
      var value = array$crush_syb_pattern[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 554);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 bonus_symbol_pos = 70;
  var $bonus_symbol_pos = message.bonus_symbol_pos;
  if ($bonus_symbol_pos !== undefined) {
    writeVarint32(bb, 560);
    writeVarint32(bb, $bonus_symbol_pos);
  }

  // optional ArcadeMarioBar arcade_mario_bar = 71;
  var $arcade_mario_bar = message.arcade_mario_bar;
  if ($arcade_mario_bar !== undefined) {
    writeVarint32(bb, 570);
    var nested = popByteBuffer();
    _encodeArcadeMarioBar($arcade_mario_bar, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeRaceGame race_game_data = 72;
  var $race_game_data = message.race_game_data;
  if ($race_game_data !== undefined) {
    writeVarint32(bb, 578);
    var nested = popByteBuffer();
    _encodeArcadeRaceGame($race_game_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeCoinPusher coin_pusher_data = 73;
  var $coin_pusher_data = message.coin_pusher_data;
  if ($coin_pusher_data !== undefined) {
    writeVarint32(bb, 586);
    var nested = popByteBuffer();
    _encodeArcadeCoinPusher($coin_pusher_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeMonopoly arcade_monopoly = 74;
  var $arcade_monopoly = message.arcade_monopoly;
  if ($arcade_monopoly !== undefined) {
    writeVarint32(bb, 594);
    var nested = popByteBuffer();
    _encodeArcadeMonopoly($arcade_monopoly, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional PlayerData player_data = 75;
  var $player_data = message.player_data;
  if ($player_data !== undefined) {
    writeVarint32(bb, 602);
    var nested = popByteBuffer();
    _encodePlayerData($player_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional VillageInforResul village_infor = 76;
  var $village_infor = message.village_infor;
  if ($village_infor !== undefined) {
    writeVarint32(bb, 610);
    var nested = popByteBuffer();
    _encodeVillageInforResul($village_infor, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeFootBall arcade_football = 77;
  var $arcade_football = message.arcade_football;
  if ($arcade_football !== undefined) {
    writeVarint32(bb, 618);
    var nested = popByteBuffer();
    _encodeArcadeFootBall($arcade_football, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeTamagotchiResult arcade_tamagotchi = 78;
  var $arcade_tamagotchi = message.arcade_tamagotchi;
  if ($arcade_tamagotchi !== undefined) {
    writeVarint32(bb, 626);
    var nested = popByteBuffer();
    _encodeArcadeTamagotchiResult($arcade_tamagotchi, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated RecordList record_list = 79;
  var array$record_list = message.record_list;
  if (array$record_list !== undefined) {
    for (var i = 0; i < array$record_list.length; i++) {
      var value = array$record_list[i];
      writeVarint32(bb, 634);
      var nested = popByteBuffer();
      _encodeRecordList(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeSlotResult = function (binary) {
  return _decodeSlotResult(wrapByteBuffer(binary));
}

function _decodeSlotResult(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string module_id = 1;
      case 1: {
        message.module_id = readString(bb, readVarint32(bb));
        break;
      }

      // required uint64 credit = 2;
      case 2: {
        message.credit = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // repeated int32 rng = 3;
      case 3: {
        var values = message.rng || (message.rng = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated WinLine win_line_group = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_line_group || (message.win_line_group = []);
        values.push(_decodeWinLine(bb));
        bb.limit = limit;
        break;
      }

      // optional int32 multiplier_alone = 5;
      case 5: {
        message.multiplier_alone = readVarint32(bb);
        break;
      }

      // repeated int32 mulitplier_pattern = 6;
      case 6: {
        var values = message.mulitplier_pattern || (message.mulitplier_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 random_syb_pattern = 7;
      case 7: {
        var values = message.random_syb_pattern || (message.random_syb_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional int32 bonus_multiplier = 8;
      case 8: {
        message.bonus_multiplier = readVarint32(bb);
        break;
      }

      // repeated WinBonus win_bonus_group = 9;
      case 9: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_bonus_group || (message.win_bonus_group = []);
        values.push(_decodeWinBonus(bb));
        bb.limit = limit;
        break;
      }

      // repeated int32 be_locked_pattern = 10;
      case 10: {
        var values = message.be_locked_pattern || (message.be_locked_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 position_pay = 11;
      case 11: {
        var values = message.position_pay || (message.position_pay = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated ReelStackPay reel_stack_pay = 12;
      case 12: {
        var limit = pushTemporaryLength(bb);
        var values = message.reel_stack_pay || (message.reel_stack_pay = []);
        values.push(_decodeReelStackPay(bb));
        bb.limit = limit;
        break;
      }

      // repeated bool golden_wild_flag = 13;
      case 13: {
        var values = message.golden_wild_flag || (message.golden_wild_flag = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // repeated uint32 pay_of_scatter = 14;
      case 14: {
        var values = message.pay_of_scatter || (message.pay_of_scatter = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 capture_award = 15;
      case 15: {
        message.capture_award = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 win_line_multiple = 16;
      case 16: {
        message.win_line_multiple = readVarint32(bb) >>> 0;
        break;
      }

      // optional Mystery mystery = 17;
      case 17: {
        var limit = pushTemporaryLength(bb);
        message.mystery = _decodeMystery(bb);
        bb.limit = limit;
        break;
      }

      // optional JPPay jp = 18;
      case 18: {
        var limit = pushTemporaryLength(bb);
        message.jp = _decodeJPPay(bb);
        bb.limit = limit;
        break;
      }

      // repeated bool overlap = 19;
      case 19: {
        var values = message.overlap || (message.overlap = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // repeated uint32 pay_of_pos = 20;
      case 20: {
        var values = message.pay_of_pos || (message.pay_of_pos = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated GoldenIcon golden_icon = 21;
      case 21: {
        var limit = pushTemporaryLength(bb);
        var values = message.golden_icon || (message.golden_icon = []);
        values.push(_decodeGoldenIcon(bb));
        bb.limit = limit;
        break;
      }

      // repeated bool exp_wild = 22;
      case 22: {
        var values = message.exp_wild || (message.exp_wild = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // repeated bool pre_exp_wild = 23;
      case 23: {
        var values = message.pre_exp_wild || (message.pre_exp_wild = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // optional int32 trigger_respin_times = 24;
      case 24: {
        message.trigger_respin_times = readVarint32(bb);
        break;
      }

      // repeated bool push_wild = 25;
      case 25: {
        var values = message.push_wild || (message.push_wild = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // optional TypedWild typed_wild = 26;
      case 26: {
        var limit = pushTemporaryLength(bb);
        message.typed_wild = _decodeTypedWild(bb);
        bb.limit = limit;
        break;
      }

      // repeated SubResult sub_result = 27;
      case 27: {
        var limit = pushTemporaryLength(bb);
        var values = message.sub_result || (message.sub_result = []);
        values.push(_decodeSubResult(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 icon_accumulate = 28;
      case 28: {
        message.icon_accumulate = readVarint32(bb) >>> 0;
        break;
      }

      // repeated int32 scatter_type = 29;
      case 29: {
        var values = message.scatter_type || (message.scatter_type = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 pre_scatter_type = 30;
      case 30: {
        var values = message.pre_scatter_type || (message.pre_scatter_type = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional uint32 full_pay = 31;
      case 31: {
        message.full_pay = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 block_reel_index = 32;
      case 32: {
        message.block_reel_index = readVarint32(bb) >>> 0;
        break;
      }

      // repeated bool trigger_super_scatter = 33;
      case 33: {
        var values = message.trigger_super_scatter || (message.trigger_super_scatter = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // optional uint32 strip_index = 34;
      case 34: {
        message.strip_index = readVarint32(bb) >>> 0;
        break;
      }

      // repeated CascadeResult cascade_result = 35;
      case 35: {
        var limit = pushTemporaryLength(bb);
        var values = message.cascade_result || (message.cascade_result = []);
        values.push(_decodeCascadeResult(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 random_bonus_times = 36;
      case 36: {
        message.random_bonus_times = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 bonus_multiplier_list = 37;
      case 37: {
        var values = message.bonus_multiplier_list || (message.bonus_multiplier_list = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 bonus_multiplier_index = 38;
      case 38: {
        message.bonus_multiplier_index = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 col_cascade_count = 39;
      case 39: {
        var values = message.col_cascade_count || (message.col_cascade_count = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 external_multiplier = 40;
      case 40: {
        message.external_multiplier = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 pre_no_win_acc = 41;
      case 41: {
        message.pre_no_win_acc = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 no_win_acc = 42;
      case 42: {
        message.no_win_acc = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 respin_types = 43;
      case 43: {
        var values = message.respin_types || (message.respin_types = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint64 respin_costs = 44;
      case 44: {
        var values = message.respin_costs || (message.respin_costs = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64(bb, /* unsigned */ true));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64(bb, /* unsigned */ true));
        }
        break;
      }

      // optional uint32 jackpot_rng = 45;
      case 45: {
        message.jackpot_rng = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 jackpot_type = 46;
      case 46: {
        message.jackpot_type = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 capture_award_list = 47;
      case 47: {
        var values = message.capture_award_list || (message.capture_award_list = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 capture_award_index = 48;
      case 48: {
        message.capture_award_index = readVarint32(bb) >>> 0;
        break;
      }

      // repeated bool golden_scatter_flag = 49;
      case 49: {
        var values = message.golden_scatter_flag || (message.golden_scatter_flag = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      // optional uint32 full_symbol = 50;
      case 50: {
        message.full_symbol = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 pay_of_star = 51;
      case 51: {
        var values = message.pay_of_star || (message.pay_of_star = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 collect_counter = 52;
      case 52: {
        message.collect_counter = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 cur_collect_counter = 53;
      case 53: {
        message.cur_collect_counter = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 upgrade_id = 54;
      case 54: {
        var values = message.upgrade_id || (message.upgrade_id = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 change_symbol_id = 55;
      case 55: {
        message.change_symbol_id = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 full_symbol_pattern = 56;
      case 56: {
        var values = message.full_symbol_pattern || (message.full_symbol_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 avg_bet = 57;
      case 57: {
        message.avg_bet = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 trigger_bonus_total_bet = 58;
      case 58: {
        message.trigger_bonus_total_bet = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 respin_reels = 59;
      case 59: {
        var values = message.respin_reels || (message.respin_reels = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated CentInAsk cent_in_ask = 60;
      case 60: {
        var limit = pushTemporaryLength(bb);
        var values = message.cent_in_ask || (message.cent_in_ask = []);
        values.push(_decodeCentInAsk(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 next_strip_index = 61;
      case 61: {
        message.next_strip_index = readVarint32(bb) >>> 0;
        break;
      }

      // repeated BonusBet bonus_bet_list = 62;
      case 62: {
        var limit = pushTemporaryLength(bb);
        var values = message.bonus_bet_list || (message.bonus_bet_list = []);
        values.push(_decodeBonusBet(bb));
        bb.limit = limit;
        break;
      }

      // optional int32 last_player_opt_index = 63;
      case 63: {
        message.last_player_opt_index = readVarint32(bb);
        break;
      }

      // repeated uint32 cur_star_counts = 64;
      case 64: {
        var values = message.cur_star_counts || (message.cur_star_counts = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated CollectTimes total_star_times = 65;
      case 65: {
        var limit = pushTemporaryLength(bb);
        var values = message.total_star_times || (message.total_star_times = []);
        values.push(_decodeCollectTimes(bb));
        bb.limit = limit;
        break;
      }

      // repeated CollectTimes bonus_star_times = 66;
      case 66: {
        var limit = pushTemporaryLength(bb);
        var values = message.bonus_star_times || (message.bonus_star_times = []);
        values.push(_decodeCollectTimes(bb));
        bb.limit = limit;
        break;
      }

      // repeated uint32 cur_random_prize = 67;
      case 67: {
        var values = message.cur_random_prize || (message.cur_random_prize = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional PoolInfo pool_info = 68;
      case 68: {
        var limit = pushTemporaryLength(bb);
        message.pool_info = _decodePoolInfo(bb);
        bb.limit = limit;
        break;
      }

      // repeated uint32 crush_syb_pattern = 69;
      case 69: {
        var values = message.crush_syb_pattern || (message.crush_syb_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 bonus_symbol_pos = 70;
      case 70: {
        message.bonus_symbol_pos = readVarint32(bb) >>> 0;
        break;
      }

      // optional ArcadeMarioBar arcade_mario_bar = 71;
      case 71: {
        var limit = pushTemporaryLength(bb);
        message.arcade_mario_bar = _decodeArcadeMarioBar(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeRaceGame race_game_data = 72;
      case 72: {
        var limit = pushTemporaryLength(bb);
        message.race_game_data = _decodeArcadeRaceGame(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeCoinPusher coin_pusher_data = 73;
      case 73: {
        var limit = pushTemporaryLength(bb);
        message.coin_pusher_data = _decodeArcadeCoinPusher(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeMonopoly arcade_monopoly = 74;
      case 74: {
        var limit = pushTemporaryLength(bb);
        message.arcade_monopoly = _decodeArcadeMonopoly(bb);
        bb.limit = limit;
        break;
      }

      // optional PlayerData player_data = 75;
      case 75: {
        var limit = pushTemporaryLength(bb);
        message.player_data = _decodePlayerData(bb);
        bb.limit = limit;
        break;
      }

      // optional VillageInforResul village_infor = 76;
      case 76: {
        var limit = pushTemporaryLength(bb);
        message.village_infor = _decodeVillageInforResul(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeFootBall arcade_football = 77;
      case 77: {
        var limit = pushTemporaryLength(bb);
        message.arcade_football = _decodeArcadeFootBall(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeTamagotchiResult arcade_tamagotchi = 78;
      case 78: {
        var limit = pushTemporaryLength(bb);
        message.arcade_tamagotchi = _decodeArcadeTamagotchiResult(bb);
        bb.limit = limit;
        break;
      }

      // repeated RecordList record_list = 79;
      case 79: {
        var limit = pushTemporaryLength(bb);
        var values = message.record_list || (message.record_list = []);
        values.push(_decodeRecordList(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.module_id === undefined)
    throw new Error("Missing required field: module_id");

  if (message.credit === undefined)
    throw new Error("Missing required field: credit");

  return message;
};

exports.encodeOptionResult = function (message) {
  var bb = popByteBuffer();
  _encodeOptionResult(message, bb);
  return toUint8Array(bb);
}

function _encodeOptionResult(message, bb) {
  // required string module_id = 1;
  var $module_id = message.module_id;
  if ($module_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $module_id);
  }

  // repeated WinBonus win_bonus_group = 2;
  var array$win_bonus_group = message.win_bonus_group;
  if (array$win_bonus_group !== undefined) {
    for (var i = 0; i < array$win_bonus_group.length; i++) {
      var value = array$win_bonus_group[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodeWinBonus(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional int32 times_choice = 3;
  var $times_choice = message.times_choice;
  if ($times_choice !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($times_choice));
  }

  // repeated int32 times_options = 4;
  var array$times_options = message.times_options;
  if (array$times_options !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$times_options.length; i++) {
      var value = array$times_options[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional int32 multiplier_choice = 5;
  var $multiplier_choice = message.multiplier_choice;
  if ($multiplier_choice !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, intToLong($multiplier_choice));
  }

  // repeated int32 multiplier_options = 6;
  var array$multiplier_options = message.multiplier_options;
  if (array$multiplier_options !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$multiplier_options.length; i++) {
      var value = array$multiplier_options[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 50);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 lock_pattern = 7;
  var array$lock_pattern = message.lock_pattern;
  if (array$lock_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$lock_pattern.length; i++) {
      var value = array$lock_pattern[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 58);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 jp888_option = 8;
  var array$jp888_option = message.jp888_option;
  if (array$jp888_option !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$jp888_option.length; i++) {
      var value = array$jp888_option[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 66);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional int32 win_option = 9;
  var $win_option = message.win_option;
  if ($win_option !== undefined) {
    writeVarint32(bb, 72);
    writeVarint64(bb, intToLong($win_option));
  }

  // optional uint32 pay = 10;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 80);
    writeVarint32(bb, $pay);
  }

  // optional int32 jp888_progress = 11;
  var $jp888_progress = message.jp888_progress;
  if ($jp888_progress !== undefined) {
    writeVarint32(bb, 88);
    writeVarint64(bb, intToLong($jp888_progress));
  }

  // repeated int32 money_meow_options = 13;
  var array$money_meow_options = message.money_meow_options;
  if (array$money_meow_options !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$money_meow_options.length; i++) {
      var value = array$money_meow_options[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 106);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 bonus_times = 14;
  var $bonus_times = message.bonus_times;
  if ($bonus_times !== undefined) {
    writeVarint32(bb, 112);
    writeVarint32(bb, $bonus_times);
  }

  // repeated int32 choice_order = 15;
  var array$choice_order = message.choice_order;
  if (array$choice_order !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$choice_order.length; i++) {
      var value = array$choice_order[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 122);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 cre_options = 16;
  var array$cre_options = message.cre_options;
  if (array$cre_options !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$cre_options.length; i++) {
      var value = array$cre_options[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 130);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeOptionResult = function (binary) {
  return _decodeOptionResult(wrapByteBuffer(binary));
}

function _decodeOptionResult(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string module_id = 1;
      case 1: {
        message.module_id = readString(bb, readVarint32(bb));
        break;
      }

      // repeated WinBonus win_bonus_group = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.win_bonus_group || (message.win_bonus_group = []);
        values.push(_decodeWinBonus(bb));
        bb.limit = limit;
        break;
      }

      // optional int32 times_choice = 3;
      case 3: {
        message.times_choice = readVarint32(bb);
        break;
      }

      // repeated int32 times_options = 4;
      case 4: {
        var values = message.times_options || (message.times_options = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional int32 multiplier_choice = 5;
      case 5: {
        message.multiplier_choice = readVarint32(bb);
        break;
      }

      // repeated int32 multiplier_options = 6;
      case 6: {
        var values = message.multiplier_options || (message.multiplier_options = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 lock_pattern = 7;
      case 7: {
        var values = message.lock_pattern || (message.lock_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 jp888_option = 8;
      case 8: {
        var values = message.jp888_option || (message.jp888_option = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional int32 win_option = 9;
      case 9: {
        message.win_option = readVarint32(bb);
        break;
      }

      // optional uint32 pay = 10;
      case 10: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      // optional int32 jp888_progress = 11;
      case 11: {
        message.jp888_progress = readVarint32(bb);
        break;
      }

      // repeated int32 money_meow_options = 13;
      case 13: {
        var values = message.money_meow_options || (message.money_meow_options = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional uint32 bonus_times = 14;
      case 14: {
        message.bonus_times = readVarint32(bb) >>> 0;
        break;
      }

      // repeated int32 choice_order = 15;
      case 15: {
        var values = message.choice_order || (message.choice_order = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 cre_options = 16;
      case 16: {
        var values = message.cre_options || (message.cre_options = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.module_id === undefined)
    throw new Error("Missing required field: module_id");

  return message;
};

exports.encodeBonusResult = function (message) {
  var bb = popByteBuffer();
  _encodeBonusResult(message, bb);
  return toUint8Array(bb);
}

function _encodeBonusResult(message, bb) {
  // optional SlotResult slot_result = 1;
  var $slot_result = message.slot_result;
  if ($slot_result !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodeSlotResult($slot_result, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional OptionResult option_result = 2;
  var $option_result = message.option_result;
  if ($option_result !== undefined) {
    writeVarint32(bb, 18);
    var nested = popByteBuffer();
    _encodeOptionResult($option_result, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeBonusResult = function (binary) {
  return _decodeBonusResult(wrapByteBuffer(binary));
}

function _decodeBonusResult(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional SlotResult slot_result = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.slot_result = _decodeSlotResult(bb);
        bb.limit = limit;
        break;
      }

      // optional OptionResult option_result = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        message.option_result = _decodeOptionResult(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeRecoverData = function (message) {
  var bb = popByteBuffer();
  _encodeRecoverData(message, bb);
  return toUint8Array(bb);
}

function _encodeRecoverData(message, bb) {
  // required PlayerData player_data = 1;
  var $player_data = message.player_data;
  if ($player_data !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodePlayerData($player_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // required uint32 win_credit = 2;
  var $win_credit = message.win_credit;
  if ($win_credit !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $win_credit);
  }

  // required SlotResult base_result = 3;
  var $base_result = message.base_result;
  if ($base_result !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeSlotResult($base_result, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated BonusResult bonus_result_group = 4;
  var array$bonus_result_group = message.bonus_result_group;
  if (array$bonus_result_group !== undefined) {
    for (var i = 0; i < array$bonus_result_group.length; i++) {
      var value = array$bonus_result_group[i];
      writeVarint32(bb, 34);
      var nested = popByteBuffer();
      _encodeBonusResult(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // required string cur_module = 5;
  var $cur_module = message.cur_module;
  if ($cur_module !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $cur_module);
  }

  // required string next_module = 6;
  var $next_module = message.next_module;
  if ($next_module !== undefined) {
    writeVarint32(bb, 50);
    writeString(bb, $next_module);
  }

  // repeated BonusTimesCounter bonus_times_counter = 7;
  var array$bonus_times_counter = message.bonus_times_counter;
  if (array$bonus_times_counter !== undefined) {
    for (var i = 0; i < array$bonus_times_counter.length; i++) {
      var value = array$bonus_times_counter[i];
      writeVarint32(bb, 58);
      var nested = popByteBuffer();
      _encodeBonusTimesCounter(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional MemberInfo member_info = 8;
  var $member_info = message.member_info;
  if ($member_info !== undefined) {
    writeVarint32(bb, 66);
    var nested = popByteBuffer();
    _encodeMemberInfo($member_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional uint64 win_credit_long = 9;
  var $win_credit_long = message.win_credit_long;
  if ($win_credit_long !== undefined) {
    writeVarint32(bb, 72);
    writeVarint64(bb, $win_credit_long);
  }

  // optional uint64 win_credit_long_without_rate = 10;
  var $win_credit_long_without_rate = message.win_credit_long_without_rate;
  if ($win_credit_long_without_rate !== undefined) {
    writeVarint32(bb, 80);
    writeVarint64(bb, $win_credit_long_without_rate);
  }
};

exports.decodeRecoverData = function (binary) {
  return _decodeRecoverData(wrapByteBuffer(binary));
}

function _decodeRecoverData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required PlayerData player_data = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.player_data = _decodePlayerData(bb);
        bb.limit = limit;
        break;
      }

      // required uint32 win_credit = 2;
      case 2: {
        message.win_credit = readVarint32(bb) >>> 0;
        break;
      }

      // required SlotResult base_result = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.base_result = _decodeSlotResult(bb);
        bb.limit = limit;
        break;
      }

      // repeated BonusResult bonus_result_group = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        var values = message.bonus_result_group || (message.bonus_result_group = []);
        values.push(_decodeBonusResult(bb));
        bb.limit = limit;
        break;
      }

      // required string cur_module = 5;
      case 5: {
        message.cur_module = readString(bb, readVarint32(bb));
        break;
      }

      // required string next_module = 6;
      case 6: {
        message.next_module = readString(bb, readVarint32(bb));
        break;
      }

      // repeated BonusTimesCounter bonus_times_counter = 7;
      case 7: {
        var limit = pushTemporaryLength(bb);
        var values = message.bonus_times_counter || (message.bonus_times_counter = []);
        values.push(_decodeBonusTimesCounter(bb));
        bb.limit = limit;
        break;
      }

      // optional MemberInfo member_info = 8;
      case 8: {
        var limit = pushTemporaryLength(bb);
        message.member_info = _decodeMemberInfo(bb);
        bb.limit = limit;
        break;
      }

      // optional uint64 win_credit_long = 9;
      case 9: {
        message.win_credit_long = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 win_credit_long_without_rate = 10;
      case 10: {
        message.win_credit_long_without_rate = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.player_data === undefined)
    throw new Error("Missing required field: player_data");

  if (message.win_credit === undefined)
    throw new Error("Missing required field: win_credit");

  if (message.base_result === undefined)
    throw new Error("Missing required field: base_result");

  if (message.cur_module === undefined)
    throw new Error("Missing required field: cur_module");

  if (message.next_module === undefined)
    throw new Error("Missing required field: next_module");

  return message;
};

exports.encodeBetConfig = function (message) {
  var bb = popByteBuffer();
  _encodeBetConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeBetConfig(message, bb) {
  // repeated int32 bet_arr = 1;
  var array$bet_arr = message.bet_arr;
  if (array$bet_arr !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$bet_arr.length; i++) {
      var value = array$bet_arr[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeBetConfig = function (binary) {
  return _decodeBetConfig(wrapByteBuffer(binary));
}

function _decodeBetConfig(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 bet_arr = 1;
      case 1: {
        var values = message.bet_arr || (message.bet_arr = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeLocalJackpot = function (message) {
  var bb = popByteBuffer();
  _encodeLocalJackpot(message, bb);
  return toUint8Array(bb);
}

function _encodeLocalJackpot(message, bb) {
  // repeated Award award_list = 1;
  var array$award_list = message.award_list;
  if (array$award_list !== undefined) {
    for (var i = 0; i < array$award_list.length; i++) {
      var value = array$award_list[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeAward(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeLocalJackpot = function (binary) {
  return _decodeLocalJackpot(wrapByteBuffer(binary));
}

function _decodeLocalJackpot(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Award award_list = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.award_list || (message.award_list = []);
        values.push(_decodeAward(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodePsRewardRules = function (message) {
  var bb = popByteBuffer();
  _encodePsRewardRules(message, bb);
  return toUint8Array(bb);
}

function _encodePsRewardRules(message, bb) {
  // required uint32 reward_divisor = 1;
  var $reward_divisor = message.reward_divisor;
  if ($reward_divisor !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $reward_divisor);
  }

  // repeated Reward reward_list = 2;
  var array$reward_list = message.reward_list;
  if (array$reward_list !== undefined) {
    for (var i = 0; i < array$reward_list.length; i++) {
      var value = array$reward_list[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodeReward(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated Exchange exchange_list = 3;
  var array$exchange_list = message.exchange_list;
  if (array$exchange_list !== undefined) {
    for (var i = 0; i < array$exchange_list.length; i++) {
      var value = array$exchange_list[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeExchange(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodePsRewardRules = function (binary) {
  return _decodePsRewardRules(wrapByteBuffer(binary));
}

function _decodePsRewardRules(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 reward_divisor = 1;
      case 1: {
        message.reward_divisor = readVarint32(bb) >>> 0;
        break;
      }

      // repeated Reward reward_list = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.reward_list || (message.reward_list = []);
        values.push(_decodeReward(bb));
        bb.limit = limit;
        break;
      }

      // repeated Exchange exchange_list = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.exchange_list || (message.exchange_list = []);
        values.push(_decodeExchange(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.reward_divisor === undefined)
    throw new Error("Missing required field: reward_divisor");

  return message;
};

exports.encodeReward = function (message) {
  var bb = popByteBuffer();
  _encodeReward(message, bb);
  return toUint8Array(bb);
}

function _encodeReward(message, bb) {
  // required uint32 times_of_bet = 1;
  var $times_of_bet = message.times_of_bet;
  if ($times_of_bet !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $times_of_bet);
  }

  // required MedalCode medal_code = 2;
  var $medal_code = message.medal_code;
  if ($medal_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeMedalCode[$medal_code]);
  }
};

exports.decodeReward = function (binary) {
  return _decodeReward(wrapByteBuffer(binary));
}

function _decodeReward(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 times_of_bet = 1;
      case 1: {
        message.times_of_bet = readVarint32(bb) >>> 0;
        break;
      }

      // required MedalCode medal_code = 2;
      case 2: {
        message.medal_code = exports.decodeMedalCode[readVarint32(bb)];
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.times_of_bet === undefined)
    throw new Error("Missing required field: times_of_bet");

  if (message.medal_code === undefined)
    throw new Error("Missing required field: medal_code");

  return message;
};

exports.encodeExchange = function (message) {
  var bb = popByteBuffer();
  _encodeExchange(message, bb);
  return toUint8Array(bb);
}

function _encodeExchange(message, bb) {
  // required MemberMedal medal = 1;
  var $medal = message.medal;
  if ($medal !== undefined) {
    writeVarint32(bb, 10);
    var nested = popByteBuffer();
    _encodeMemberMedal($medal, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated PsCoinByLevel ps_coin_by_level = 2;
  var array$ps_coin_by_level = message.ps_coin_by_level;
  if (array$ps_coin_by_level !== undefined) {
    for (var i = 0; i < array$ps_coin_by_level.length; i++) {
      var value = array$ps_coin_by_level[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodePsCoinByLevel(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeExchange = function (binary) {
  return _decodeExchange(wrapByteBuffer(binary));
}

function _decodeExchange(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required MemberMedal medal = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        message.medal = _decodeMemberMedal(bb);
        bb.limit = limit;
        break;
      }

      // repeated PsCoinByLevel ps_coin_by_level = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.ps_coin_by_level || (message.ps_coin_by_level = []);
        values.push(_decodePsCoinByLevel(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.medal === undefined)
    throw new Error("Missing required field: medal");

  return message;
};

exports.encodeFreeGameInfo = function (message) {
  var bb = popByteBuffer();
  _encodeFreeGameInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeFreeGameInfo(message, bb) {
  // required uint32 total_times = 1;
  var $total_times = message.total_times;
  if ($total_times !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $total_times);
  }

  // optional uint32 played_times = 2;
  var $played_times = message.played_times;
  if ($played_times !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $played_times);
  }

  // optional uint64 total_win = 3;
  var $total_win = message.total_win;
  if ($total_win !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $total_win);
  }
};

exports.decodeFreeGameInfo = function (binary) {
  return _decodeFreeGameInfo(wrapByteBuffer(binary));
}

function _decodeFreeGameInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required uint32 total_times = 1;
      case 1: {
        message.total_times = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 played_times = 2;
      case 2: {
        message.played_times = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint64 total_win = 3;
      case 3: {
        message.total_win = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.total_times === undefined)
    throw new Error("Missing required field: total_times");

  return message;
};

exports.encodeModuleConfig = function (message) {
  var bb = popByteBuffer();
  _encodeModuleConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeModuleConfig(message, bb) {
  // required string module_id = 1;
  var $module_id = message.module_id;
  if ($module_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $module_id);
  }

  // repeated uint32 max_eliminate_times = 2;
  var array$max_eliminate_times = message.max_eliminate_times;
  if (array$max_eliminate_times !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$max_eliminate_times.length; i++) {
      var value = array$max_eliminate_times[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 18);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeModuleConfig = function (binary) {
  return _decodeModuleConfig(wrapByteBuffer(binary));
}

function _decodeModuleConfig(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string module_id = 1;
      case 1: {
        message.module_id = readString(bb, readVarint32(bb));
        break;
      }

      // repeated uint32 max_eliminate_times = 2;
      case 2: {
        var values = message.max_eliminate_times || (message.max_eliminate_times = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.module_id === undefined)
    throw new Error("Missing required field: module_id");

  return message;
};

exports.encodeDataList = function (message) {
  var bb = popByteBuffer();
  _encodeDataList(message, bb);
  return toUint8Array(bb);
}

function _encodeDataList(message, bb) {
  // repeated int32 data = 1;
  var array$data = message.data;
  if (array$data !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$data.length; i++) {
      var value = array$data[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeDataList = function (binary) {
  return _decodeDataList(wrapByteBuffer(binary));
}

function _decodeDataList(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 data = 1;
      case 1: {
        var values = message.data || (message.data = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeCommonDataList = function (message) {
  var bb = popByteBuffer();
  _encodeCommonDataList(message, bb);
  return toUint8Array(bb);
}

function _encodeCommonDataList(message, bb) {
  // repeated uint32 data = 1;
  var array$data = message.data;
  if (array$data !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$data.length; i++) {
      var value = array$data[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeCommonDataList = function (binary) {
  return _decodeCommonDataList(wrapByteBuffer(binary));
}

function _decodeCommonDataList(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated uint32 data = 1;
      case 1: {
        var values = message.data || (message.data = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeVillageInforConfig = function (message) {
  var bb = popByteBuffer();
  _encodeVillageInforConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeVillageInforConfig(message, bb) {
  // optional string player_id = 1;
  var $player_id = message.player_id;
  if ($player_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $player_id);
  }

  // optional uint32 player_level = 2;
  var $player_level = message.player_level;
  if ($player_level !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $player_level);
  }

  // optional uint32 virtual_coin = 3;
  var $virtual_coin = message.virtual_coin;
  if ($virtual_coin !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $virtual_coin);
  }

  // optional uint32 shield_value = 4;
  var $shield_value = message.shield_value;
  if ($shield_value !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $shield_value);
  }

  // optional string steal_player_id = 5;
  var $steal_player_id = message.steal_player_id;
  if ($steal_player_id !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $steal_player_id);
  }

  // optional uint32 steal_gain_non_player_bet = 6;
  var $steal_gain_non_player_bet = message.steal_gain_non_player_bet;
  if ($steal_gain_non_player_bet !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $steal_gain_non_player_bet);
  }

  // optional uint32 fighter_value = 7;
  var $fighter_value = message.fighter_value;
  if ($fighter_value !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $fighter_value);
  }

  // repeated uint32 house_level = 8;
  var array$house_level = message.house_level;
  if (array$house_level !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_level.length; i++) {
      var value = array$house_level[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 66);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 house_update_cost = 9;
  var array$house_update_cost = message.house_update_cost;
  if (array$house_update_cost !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_update_cost.length; i++) {
      var value = array$house_update_cost[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 74);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 house_repair_cost = 10;
  var array$house_repair_cost = message.house_repair_cost;
  if (array$house_repair_cost !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$house_repair_cost.length; i++) {
      var value = array$house_repair_cost[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 next_era_update = 11;
  var $next_era_update = message.next_era_update;
  if ($next_era_update !== undefined) {
    writeVarint32(bb, 88);
    writeVarint32(bb, $next_era_update);
  }

  // repeated VillageNewsInfo news_info = 12;
  var array$news_info = message.news_info;
  if (array$news_info !== undefined) {
    for (var i = 0; i < array$news_info.length; i++) {
      var value = array$news_info[i];
      writeVarint32(bb, 98);
      var nested = popByteBuffer();
      _encodeVillageNewsInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 min_game_bet = 13;
  var $min_game_bet = message.min_game_bet;
  if ($min_game_bet !== undefined) {
    writeVarint32(bb, 104);
    writeVarint32(bb, $min_game_bet);
  }
};

exports.decodeVillageInforConfig = function (binary) {
  return _decodeVillageInforConfig(wrapByteBuffer(binary));
}

function _decodeVillageInforConfig(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string player_id = 1;
      case 1: {
        message.player_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 player_level = 2;
      case 2: {
        message.player_level = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 virtual_coin = 3;
      case 3: {
        message.virtual_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 shield_value = 4;
      case 4: {
        message.shield_value = readVarint32(bb) >>> 0;
        break;
      }

      // optional string steal_player_id = 5;
      case 5: {
        message.steal_player_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 steal_gain_non_player_bet = 6;
      case 6: {
        message.steal_gain_non_player_bet = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 fighter_value = 7;
      case 7: {
        message.fighter_value = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 house_level = 8;
      case 8: {
        var values = message.house_level || (message.house_level = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 house_update_cost = 9;
      case 9: {
        var values = message.house_update_cost || (message.house_update_cost = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 house_repair_cost = 10;
      case 10: {
        var values = message.house_repair_cost || (message.house_repair_cost = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional uint32 next_era_update = 11;
      case 11: {
        message.next_era_update = readVarint32(bb) >>> 0;
        break;
      }

      // repeated VillageNewsInfo news_info = 12;
      case 12: {
        var limit = pushTemporaryLength(bb);
        var values = message.news_info || (message.news_info = []);
        values.push(_decodeVillageNewsInfo(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 min_game_bet = 13;
      case 13: {
        message.min_game_bet = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeArcadeFootBallConfig = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeFootBallConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeFootBallConfig(message, bb) {
  // repeated Combination game_Combination = 1;
  var array$game_Combination = message.game_Combination;
  if (array$game_Combination !== undefined) {
    for (var i = 0; i < array$game_Combination.length; i++) {
      var value = array$game_Combination[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeCombination(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 arcad_unit = 2;
  var $arcad_unit = message.arcad_unit;
  if ($arcad_unit !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $arcad_unit);
  }

  // optional uint32 bet_maximum = 3;
  var $bet_maximum = message.bet_maximum;
  if ($bet_maximum !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $bet_maximum);
  }

  // optional uint32 bet_minimum = 4;
  var $bet_minimum = message.bet_minimum;
  if ($bet_minimum !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $bet_minimum);
  }

  // repeated uint32 bet_list = 5;
  var array$bet_list = message.bet_list;
  if (array$bet_list !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$bet_list.length; i++) {
      var value = array$bet_list[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeArcadeFootBallConfig = function (binary) {
  return _decodeArcadeFootBallConfig(wrapByteBuffer(binary));
}

function _decodeArcadeFootBallConfig(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Combination game_Combination = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.game_Combination || (message.game_Combination = []);
        values.push(_decodeCombination(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 arcad_unit = 2;
      case 2: {
        message.arcad_unit = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 bet_maximum = 3;
      case 3: {
        message.bet_maximum = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 bet_minimum = 4;
      case 4: {
        message.bet_minimum = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 bet_list = 5;
      case 5: {
        var values = message.bet_list || (message.bet_list = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeSceneInfo = function (message) {
  var bb = popByteBuffer();
  _encodeSceneInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeSceneInfo(message, bb) {
  // optional bool scene_opened = 1;
  var $scene_opened = message.scene_opened;
  if ($scene_opened !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $scene_opened ? 1 : 0);
  }

  // optional uint32 scene_price = 2;
  var $scene_price = message.scene_price;
  if ($scene_price !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $scene_price);
  }

  // optional bool building1_opened = 3;
  var $building1_opened = message.building1_opened;
  if ($building1_opened !== undefined) {
    writeVarint32(bb, 24);
    writeByte(bb, $building1_opened ? 1 : 0);
  }

  // optional uint32 building1_price = 4;
  var $building1_price = message.building1_price;
  if ($building1_price !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $building1_price);
  }

  // optional bool building2_opened = 5;
  var $building2_opened = message.building2_opened;
  if ($building2_opened !== undefined) {
    writeVarint32(bb, 40);
    writeByte(bb, $building2_opened ? 1 : 0);
  }

  // optional uint32 building2_price = 6;
  var $building2_price = message.building2_price;
  if ($building2_price !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $building2_price);
  }
};

exports.decodeSceneInfo = function (binary) {
  return _decodeSceneInfo(wrapByteBuffer(binary));
}

function _decodeSceneInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional bool scene_opened = 1;
      case 1: {
        message.scene_opened = !!readByte(bb);
        break;
      }

      // optional uint32 scene_price = 2;
      case 2: {
        message.scene_price = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool building1_opened = 3;
      case 3: {
        message.building1_opened = !!readByte(bb);
        break;
      }

      // optional uint32 building1_price = 4;
      case 4: {
        message.building1_price = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool building2_opened = 5;
      case 5: {
        message.building2_opened = !!readByte(bb);
        break;
      }

      // optional uint32 building2_price = 6;
      case 6: {
        message.building2_price = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeFavorabilityInfoData = function (message) {
  var bb = popByteBuffer();
  _encodeFavorabilityInfoData(message, bb);
  return toUint8Array(bb);
}

function _encodeFavorabilityInfoData(message, bb) {
  // optional uint32 id = 1;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $id);
  }

  // optional uint32 favorability = 2;
  var $favorability = message.favorability;
  if ($favorability !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $favorability);
  }

  // optional uint32 favorability_max = 3;
  var $favorability_max = message.favorability_max;
  if ($favorability_max !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $favorability_max);
  }

  // repeated uint32 reward = 4;
  var array$reward = message.reward;
  if (array$reward !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$reward.length; i++) {
      var value = array$reward[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated bool reward_get = 5;
  var array$reward_get = message.reward_get;
  if (array$reward_get !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$reward_get.length; i++) {
      var value = array$reward_get[i];
      writeByte(packed, value ? 1 : 0);
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeFavorabilityInfoData = function (binary) {
  return _decodeFavorabilityInfoData(wrapByteBuffer(binary));
}

function _decodeFavorabilityInfoData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 id = 1;
      case 1: {
        message.id = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 favorability = 2;
      case 2: {
        message.favorability = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 favorability_max = 3;
      case 3: {
        message.favorability_max = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 reward = 4;
      case 4: {
        var values = message.reward || (message.reward = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated bool reward_get = 5;
      case 5: {
        var values = message.reward_get || (message.reward_get = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(!!readByte(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(!!readByte(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeArcadeTamagotchiConfig = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeTamagotchiConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeTamagotchiConfig(message, bb) {
  // optional string player_id = 1;
  var $player_id = message.player_id;
  if ($player_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $player_id);
  }

  // optional uint32 virtual_coin = 2;
  var $virtual_coin = message.virtual_coin;
  if ($virtual_coin !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $virtual_coin);
  }

  // optional uint32 egg_amount = 3;
  var $egg_amount = message.egg_amount;
  if ($egg_amount !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $egg_amount);
  }

  // optional uint32 food_amount = 4;
  var $food_amount = message.food_amount;
  if ($food_amount !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $food_amount);
  }

  // repeated DinosaurInfo Dinosaurs_data = 5;
  var array$Dinosaurs_data = message.Dinosaurs_data;
  if (array$Dinosaurs_data !== undefined) {
    for (var i = 0; i < array$Dinosaurs_data.length; i++) {
      var value = array$Dinosaurs_data[i];
      writeVarint32(bb, 42);
      var nested = popByteBuffer();
      _encodeDinosaurInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated AreaInfo Area_data = 6;
  var array$Area_data = message.Area_data;
  if (array$Area_data !== undefined) {
    for (var i = 0; i < array$Area_data.length; i++) {
      var value = array$Area_data[i];
      writeVarint32(bb, 50);
      var nested = popByteBuffer();
      _encodeAreaInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated SceneInfo Scene_data = 7;
  var array$Scene_data = message.Scene_data;
  if (array$Scene_data !== undefined) {
    for (var i = 0; i < array$Scene_data.length; i++) {
      var value = array$Scene_data[i];
      writeVarint32(bb, 58);
      var nested = popByteBuffer();
      _encodeSceneInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated FavorabilityInfoData Favorability_data = 8;
  var array$Favorability_data = message.Favorability_data;
  if (array$Favorability_data !== undefined) {
    for (var i = 0; i < array$Favorability_data.length; i++) {
      var value = array$Favorability_data[i];
      writeVarint32(bb, 66);
      var nested = popByteBuffer();
      _encodeFavorabilityInfoData(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated uint32 incubation_price = 9;
  var array$incubation_price = message.incubation_price;
  if (array$incubation_price !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$incubation_price.length; i++) {
      var value = array$incubation_price[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 74);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated NewsInfo News_data = 10;
  var array$News_data = message.News_data;
  if (array$News_data !== undefined) {
    for (var i = 0; i < array$News_data.length; i++) {
      var value = array$News_data[i];
      writeVarint32(bb, 82);
      var nested = popByteBuffer();
      _encodeNewsInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated DinosaurInfo Dead_data = 11;
  var array$Dead_data = message.Dead_data;
  if (array$Dead_data !== undefined) {
    for (var i = 0; i < array$Dead_data.length; i++) {
      var value = array$Dead_data[i];
      writeVarint32(bb, 90);
      var nested = popByteBuffer();
      _encodeDinosaurInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional bool isDaily_show = 12;
  var $isDaily_show = message.isDaily_show;
  if ($isDaily_show !== undefined) {
    writeVarint32(bb, 96);
    writeByte(bb, $isDaily_show ? 1 : 0);
  }

  // optional uint32 feed_price = 13;
  var $feed_price = message.feed_price;
  if ($feed_price !== undefined) {
    writeVarint32(bb, 104);
    writeVarint32(bb, $feed_price);
  }

  // optional uint32 resurrection_price = 14;
  var $resurrection_price = message.resurrection_price;
  if ($resurrection_price !== undefined) {
    writeVarint32(bb, 112);
    writeVarint32(bb, $resurrection_price);
  }

  // repeated uint32 bet_list = 15;
  var array$bet_list = message.bet_list;
  if (array$bet_list !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$bet_list.length; i++) {
      var value = array$bet_list[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 122);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeArcadeTamagotchiConfig = function (binary) {
  return _decodeArcadeTamagotchiConfig(wrapByteBuffer(binary));
}

function _decodeArcadeTamagotchiConfig(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string player_id = 1;
      case 1: {
        message.player_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 virtual_coin = 2;
      case 2: {
        message.virtual_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 egg_amount = 3;
      case 3: {
        message.egg_amount = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 food_amount = 4;
      case 4: {
        message.food_amount = readVarint32(bb) >>> 0;
        break;
      }

      // repeated DinosaurInfo Dinosaurs_data = 5;
      case 5: {
        var limit = pushTemporaryLength(bb);
        var values = message.Dinosaurs_data || (message.Dinosaurs_data = []);
        values.push(_decodeDinosaurInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated AreaInfo Area_data = 6;
      case 6: {
        var limit = pushTemporaryLength(bb);
        var values = message.Area_data || (message.Area_data = []);
        values.push(_decodeAreaInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated SceneInfo Scene_data = 7;
      case 7: {
        var limit = pushTemporaryLength(bb);
        var values = message.Scene_data || (message.Scene_data = []);
        values.push(_decodeSceneInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated FavorabilityInfoData Favorability_data = 8;
      case 8: {
        var limit = pushTemporaryLength(bb);
        var values = message.Favorability_data || (message.Favorability_data = []);
        values.push(_decodeFavorabilityInfoData(bb));
        bb.limit = limit;
        break;
      }

      // repeated uint32 incubation_price = 9;
      case 9: {
        var values = message.incubation_price || (message.incubation_price = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated NewsInfo News_data = 10;
      case 10: {
        var limit = pushTemporaryLength(bb);
        var values = message.News_data || (message.News_data = []);
        values.push(_decodeNewsInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated DinosaurInfo Dead_data = 11;
      case 11: {
        var limit = pushTemporaryLength(bb);
        var values = message.Dead_data || (message.Dead_data = []);
        values.push(_decodeDinosaurInfo(bb));
        bb.limit = limit;
        break;
      }

      // optional bool isDaily_show = 12;
      case 12: {
        message.isDaily_show = !!readByte(bb);
        break;
      }

      // optional uint32 feed_price = 13;
      case 13: {
        message.feed_price = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 resurrection_price = 14;
      case 14: {
        message.resurrection_price = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 bet_list = 15;
      case 15: {
        var values = message.bet_list || (message.bet_list = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeDailyReceive = function (message) {
  var bb = popByteBuffer();
  _encodeDailyReceive(message, bb);
  return toUint8Array(bb);
}

function _encodeDailyReceive(message, bb) {
  // optional uint32 daily_type = 1;
  var $daily_type = message.daily_type;
  if ($daily_type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $daily_type);
  }

  // repeated string award_type = 2;
  var array$award_type = message.award_type;
  if (array$award_type !== undefined) {
    for (var i = 0; i < array$award_type.length; i++) {
      var value = array$award_type[i];
      writeVarint32(bb, 18);
      writeString(bb, value);
    }
  }

  // repeated uint32 award_amount = 3;
  var array$award_amount = message.award_amount;
  if (array$award_amount !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$award_amount.length; i++) {
      var value = array$award_amount[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 award_received = 4;
  var array$award_received = message.award_received;
  if (array$award_received !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$award_received.length; i++) {
      var value = array$award_received[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional string remaining_time = 5;
  var $remaining_time = message.remaining_time;
  if ($remaining_time !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $remaining_time);
  }
};

exports.decodeDailyReceive = function (binary) {
  return _decodeDailyReceive(wrapByteBuffer(binary));
}

function _decodeDailyReceive(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 daily_type = 1;
      case 1: {
        message.daily_type = readVarint32(bb) >>> 0;
        break;
      }

      // repeated string award_type = 2;
      case 2: {
        var values = message.award_type || (message.award_type = []);
        values.push(readString(bb, readVarint32(bb)));
        break;
      }

      // repeated uint32 award_amount = 3;
      case 3: {
        var values = message.award_amount || (message.award_amount = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 award_received = 4;
      case 4: {
        var values = message.award_received || (message.award_received = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // optional string remaining_time = 5;
      case 5: {
        message.remaining_time = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeUPSdata = function (message) {
  var bb = popByteBuffer();
  _encodeUPSdata(message, bb);
  return toUint8Array(bb);
}

function _encodeUPSdata(message, bb) {
  // optional uint64 upscoin_cent = 1;
  var $upscoin_cent = message.upscoin_cent;
  if ($upscoin_cent !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, $upscoin_cent);
  }

  // optional bool ups_switch = 2;
  var $ups_switch = message.ups_switch;
  if ($ups_switch !== undefined) {
    writeVarint32(bb, 16);
    writeByte(bb, $ups_switch ? 1 : 0);
  }

  // optional uint64 threshold = 3;
  var $threshold = message.threshold;
  if ($threshold !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $threshold);
  }

  // optional uint64 coin_in = 4;
  var $coin_in = message.coin_in;
  if ($coin_in !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $coin_in);
  }

  // optional bool is_transfer = 5;
  var $is_transfer = message.is_transfer;
  if ($is_transfer !== undefined) {
    writeVarint32(bb, 40);
    writeByte(bb, $is_transfer ? 1 : 0);
  }

  // optional uint64 transfer_cent = 6;
  var $transfer_cent = message.transfer_cent;
  if ($transfer_cent !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, $transfer_cent);
  }

  // optional string remain_time = 7;
  var $remain_time = message.remain_time;
  if ($remain_time !== undefined) {
    writeVarint32(bb, 58);
    writeString(bb, $remain_time);
  }

  // optional uint32 overage_type = 8;
  var $overage_type = message.overage_type;
  if ($overage_type !== undefined) {
    writeVarint32(bb, 64);
    writeVarint32(bb, $overage_type);
  }

  // optional uint64 max_cashout = 9;
  var $max_cashout = message.max_cashout;
  if ($max_cashout !== undefined) {
    writeVarint32(bb, 72);
    writeVarint64(bb, $max_cashout);
  }
};

exports.decodeUPSdata = function (binary) {
  return _decodeUPSdata(wrapByteBuffer(binary));
}

function _decodeUPSdata(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint64 upscoin_cent = 1;
      case 1: {
        message.upscoin_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional bool ups_switch = 2;
      case 2: {
        message.ups_switch = !!readByte(bb);
        break;
      }

      // optional uint64 threshold = 3;
      case 3: {
        message.threshold = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 coin_in = 4;
      case 4: {
        message.coin_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional bool is_transfer = 5;
      case 5: {
        message.is_transfer = !!readByte(bb);
        break;
      }

      // optional uint64 transfer_cent = 6;
      case 6: {
        message.transfer_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional string remain_time = 7;
      case 7: {
        message.remain_time = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 overage_type = 8;
      case 8: {
        message.overage_type = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint64 max_cashout = 9;
      case 9: {
        message.max_cashout = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeMarqueeData = function (message) {
  var bb = popByteBuffer();
  _encodeMarqueeData(message, bb);
  return toUint8Array(bb);
}

function _encodeMarqueeData(message, bb) {
  // optional uint32 type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $type);
  }

  // optional uint32 level = 2;
  var $level = message.level;
  if ($level !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $level);
  }

  // optional string data1 = 3;
  var $data1 = message.data1;
  if ($data1 !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $data1);
  }

  // optional string data2 = 4;
  var $data2 = message.data2;
  if ($data2 !== undefined) {
    writeVarint32(bb, 34);
    writeString(bb, $data2);
  }

  // optional uint32 show_time = 5;
  var $show_time = message.show_time;
  if ($show_time !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $show_time);
  }

  // optional uint32 delay_time = 6;
  var $delay_time = message.delay_time;
  if ($delay_time !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $delay_time);
  }
};

exports.decodeMarqueeData = function (binary) {
  return _decodeMarqueeData(wrapByteBuffer(binary));
}

function _decodeMarqueeData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 type = 1;
      case 1: {
        message.type = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 level = 2;
      case 2: {
        message.level = readVarint32(bb) >>> 0;
        break;
      }

      // optional string data1 = 3;
      case 3: {
        message.data1 = readString(bb, readVarint32(bb));
        break;
      }

      // optional string data2 = 4;
      case 4: {
        message.data2 = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 show_time = 5;
      case 5: {
        message.show_time = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 delay_time = 6;
      case 6: {
        message.delay_time = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeConfigRecall = function (message) {
  var bb = popByteBuffer();
  _encodeConfigRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeConfigRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }

  // repeated int32 bet_5_arr = 3;
  var array$bet_5_arr = message.bet_5_arr;
  if (array$bet_5_arr !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$bet_5_arr.length; i++) {
      var value = array$bet_5_arr[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 26);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 line_5_arr = 4;
  var array$line_5_arr = message.line_5_arr;
  if (array$line_5_arr !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$line_5_arr.length; i++) {
      var value = array$line_5_arr[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 rate_arr = 5;
  var array$rate_arr = message.rate_arr;
  if (array$rate_arr !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$rate_arr.length; i++) {
      var value = array$rate_arr[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional int32 rate_default_index = 6;
  var $rate_default_index = message.rate_default_index;
  if ($rate_default_index !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($rate_default_index));
  }

  // repeated string language_list = 7;
  var array$language_list = message.language_list;
  if (array$language_list !== undefined) {
    for (var i = 0; i < array$language_list.length; i++) {
      var value = array$language_list[i];
      writeVarint32(bb, 58);
      writeString(bb, value);
    }
  }

  // optional int32 language_default_index = 8;
  var $language_default_index = message.language_default_index;
  if ($language_default_index !== undefined) {
    writeVarint32(bb, 64);
    writeVarint64(bb, intToLong($language_default_index));
  }

  // optional uint64 player_cent = 9;
  var $player_cent = message.player_cent;
  if ($player_cent !== undefined) {
    writeVarint32(bb, 72);
    writeVarint64(bb, $player_cent);
  }

  // repeated int32 last_rng = 10;
  var array$last_rng = message.last_rng;
  if (array$last_rng !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$last_rng.length; i++) {
      var value = array$last_rng[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional RecoverData recover_data = 11;
  var $recover_data = message.recover_data;
  if ($recover_data !== undefined) {
    writeVarint32(bb, 90);
    var nested = popByteBuffer();
    _encodeRecoverData($recover_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated BetConfig bet_config_list = 12;
  var array$bet_config_list = message.bet_config_list;
  if (array$bet_config_list !== undefined) {
    for (var i = 0; i < array$bet_config_list.length; i++) {
      var value = array$bet_config_list[i];
      writeVarint32(bb, 98);
      var nested = popByteBuffer();
      _encodeBetConfig(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional SlotResult last_bs_result = 13;
  var $last_bs_result = message.last_bs_result;
  if ($last_bs_result !== undefined) {
    writeVarint32(bb, 106);
    var nested = popByteBuffer();
    _encodeSlotResult($last_bs_result, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional MemberInfo member_info = 14;
  var $member_info = message.member_info;
  if ($member_info !== undefined) {
    writeVarint32(bb, 114);
    var nested = popByteBuffer();
    _encodeMemberInfo($member_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated LocalJackpot local_jp_list = 15;
  var array$local_jp_list = message.local_jp_list;
  if (array$local_jp_list !== undefined) {
    for (var i = 0; i < array$local_jp_list.length; i++) {
      var value = array$local_jp_list[i];
      writeVarint32(bb, 122);
      var nested = popByteBuffer();
      _encodeLocalJackpot(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional PsRewardRules ps_reward_rules = 16;
  var $ps_reward_rules = message.ps_reward_rules;
  if ($ps_reward_rules !== undefined) {
    writeVarint32(bb, 130);
    var nested = popByteBuffer();
    _encodePsRewardRules($ps_reward_rules, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional bool is_free_game = 17;
  var $is_free_game = message.is_free_game;
  if ($is_free_game !== undefined) {
    writeVarint32(bb, 136);
    writeByte(bb, $is_free_game ? 1 : 0);
  }

  // optional FreeGameInfo free_game_info = 18;
  var $free_game_info = message.free_game_info;
  if ($free_game_info !== undefined) {
    writeVarint32(bb, 146);
    var nested = popByteBuffer();
    _encodeFreeGameInfo($free_game_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional bool has_lobby_logged = 19;
  var $has_lobby_logged = message.has_lobby_logged;
  if ($has_lobby_logged !== undefined) {
    writeVarint32(bb, 152);
    writeByte(bb, $has_lobby_logged ? 1 : 0);
  }

  // optional uint32 accounting_unit = 20;
  var $accounting_unit = message.accounting_unit;
  if ($accounting_unit !== undefined) {
    writeVarint32(bb, 160);
    writeVarint32(bb, $accounting_unit);
  }

  // repeated ModuleConfig module_config = 21;
  var array$module_config = message.module_config;
  if (array$module_config !== undefined) {
    for (var i = 0; i < array$module_config.length; i++) {
      var value = array$module_config[i];
      writeVarint32(bb, 170);
      var nested = popByteBuffer();
      _encodeModuleConfig(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated uint32 bet_pays = 22;
  var array$bet_pays = message.bet_pays;
  if (array$bet_pays !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$bet_pays.length; i++) {
      var value = array$bet_pays[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 178);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint32 max_bets = 23;
  var array$max_bets = message.max_bets;
  if (array$max_bets !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$max_bets.length; i++) {
      var value = array$max_bets[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 186);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated DataList extra_datas = 24;
  var array$extra_datas = message.extra_datas;
  if (array$extra_datas !== undefined) {
    for (var i = 0; i < array$extra_datas.length; i++) {
      var value = array$extra_datas[i];
      writeVarint32(bb, 194);
      var nested = popByteBuffer();
      _encodeDataList(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated SlotResult last_fs_result_list = 25;
  var array$last_fs_result_list = message.last_fs_result_list;
  if (array$last_fs_result_list !== undefined) {
    for (var i = 0; i < array$last_fs_result_list.length; i++) {
      var value = array$last_fs_result_list[i];
      writeVarint32(bb, 202);
      var nested = popByteBuffer();
      _encodeSlotResult(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated CommonDataList common_datas = 26;
  var array$common_datas = message.common_datas;
  if (array$common_datas !== undefined) {
    for (var i = 0; i < array$common_datas.length; i++) {
      var value = array$common_datas[i];
      writeVarint32(bb, 210);
      var nested = popByteBuffer();
      _encodeCommonDataList(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional VillageInforConfig village_infor = 27;
  var $village_infor = message.village_infor;
  if ($village_infor !== undefined) {
    writeVarint32(bb, 218);
    var nested = popByteBuffer();
    _encodeVillageInforConfig($village_infor, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeFootBallConfig arcade_football = 28;
  var $arcade_football = message.arcade_football;
  if ($arcade_football !== undefined) {
    writeVarint32(bb, 226);
    var nested = popByteBuffer();
    _encodeArcadeFootBallConfig($arcade_football, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeTamagotchiConfig arcade_tamagotchi = 29;
  var $arcade_tamagotchi = message.arcade_tamagotchi;
  if ($arcade_tamagotchi !== undefined) {
    writeVarint32(bb, 234);
    var nested = popByteBuffer();
    _encodeArcadeTamagotchiConfig($arcade_tamagotchi, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional DailyReceive daily_receive = 30;
  var $daily_receive = message.daily_receive;
  if ($daily_receive !== undefined) {
    writeVarint32(bb, 242);
    var nested = popByteBuffer();
    _encodeDailyReceive($daily_receive, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated RecordList record_list = 31;
  var array$record_list = message.record_list;
  if (array$record_list !== undefined) {
    for (var i = 0; i < array$record_list.length; i++) {
      var value = array$record_list[i];
      writeVarint32(bb, 250);
      var nested = popByteBuffer();
      _encodeRecordList(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional CommonDataInfo common_data_info = 32;
  var $common_data_info = message.common_data_info;
  if ($common_data_info !== undefined) {
    writeVarint32(bb, 258);
    var nested = popByteBuffer();
    _encodeCommonDataInfo($common_data_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional UPSdata ups_data = 33;
  var $ups_data = message.ups_data;
  if ($ups_data !== undefined) {
    writeVarint32(bb, 266);
    var nested = popByteBuffer();
    _encodeUPSdata($ups_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated MarqueeData marquee_data = 34;
  var array$marquee_data = message.marquee_data;
  if (array$marquee_data !== undefined) {
    for (var i = 0; i < array$marquee_data.length; i++) {
      var value = array$marquee_data[i];
      writeVarint32(bb, 274);
      var nested = popByteBuffer();
      _encodeMarqueeData(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 lucky_strike_block_rate = 35;
  var $lucky_strike_block_rate = message.lucky_strike_block_rate;
  if ($lucky_strike_block_rate !== undefined) {
    writeVarint32(bb, 280);
    writeVarint32(bb, $lucky_strike_block_rate);
  }

  // optional uint32 law_min_bet = 36;
  var $law_min_bet = message.law_min_bet;
  if ($law_min_bet !== undefined) {
    writeVarint32(bb, 288);
    writeVarint32(bb, $law_min_bet);
  }
};

exports.decodeConfigRecall = function (binary) {
  return _decodeConfigRecall(wrapByteBuffer(binary));
}

function _decodeConfigRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      // repeated int32 bet_5_arr = 3;
      case 3: {
        var values = message.bet_5_arr || (message.bet_5_arr = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 line_5_arr = 4;
      case 4: {
        var values = message.line_5_arr || (message.line_5_arr = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 rate_arr = 5;
      case 5: {
        var values = message.rate_arr || (message.rate_arr = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional int32 rate_default_index = 6;
      case 6: {
        message.rate_default_index = readVarint32(bb);
        break;
      }

      // repeated string language_list = 7;
      case 7: {
        var values = message.language_list || (message.language_list = []);
        values.push(readString(bb, readVarint32(bb)));
        break;
      }

      // optional int32 language_default_index = 8;
      case 8: {
        message.language_default_index = readVarint32(bb);
        break;
      }

      // optional uint64 player_cent = 9;
      case 9: {
        message.player_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // repeated int32 last_rng = 10;
      case 10: {
        var values = message.last_rng || (message.last_rng = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional RecoverData recover_data = 11;
      case 11: {
        var limit = pushTemporaryLength(bb);
        message.recover_data = _decodeRecoverData(bb);
        bb.limit = limit;
        break;
      }

      // repeated BetConfig bet_config_list = 12;
      case 12: {
        var limit = pushTemporaryLength(bb);
        var values = message.bet_config_list || (message.bet_config_list = []);
        values.push(_decodeBetConfig(bb));
        bb.limit = limit;
        break;
      }

      // optional SlotResult last_bs_result = 13;
      case 13: {
        var limit = pushTemporaryLength(bb);
        message.last_bs_result = _decodeSlotResult(bb);
        bb.limit = limit;
        break;
      }

      // optional MemberInfo member_info = 14;
      case 14: {
        var limit = pushTemporaryLength(bb);
        message.member_info = _decodeMemberInfo(bb);
        bb.limit = limit;
        break;
      }

      // repeated LocalJackpot local_jp_list = 15;
      case 15: {
        var limit = pushTemporaryLength(bb);
        var values = message.local_jp_list || (message.local_jp_list = []);
        values.push(_decodeLocalJackpot(bb));
        bb.limit = limit;
        break;
      }

      // optional PsRewardRules ps_reward_rules = 16;
      case 16: {
        var limit = pushTemporaryLength(bb);
        message.ps_reward_rules = _decodePsRewardRules(bb);
        bb.limit = limit;
        break;
      }

      // optional bool is_free_game = 17;
      case 17: {
        message.is_free_game = !!readByte(bb);
        break;
      }

      // optional FreeGameInfo free_game_info = 18;
      case 18: {
        var limit = pushTemporaryLength(bb);
        message.free_game_info = _decodeFreeGameInfo(bb);
        bb.limit = limit;
        break;
      }

      // optional bool has_lobby_logged = 19;
      case 19: {
        message.has_lobby_logged = !!readByte(bb);
        break;
      }

      // optional uint32 accounting_unit = 20;
      case 20: {
        message.accounting_unit = readVarint32(bb) >>> 0;
        break;
      }

      // repeated ModuleConfig module_config = 21;
      case 21: {
        var limit = pushTemporaryLength(bb);
        var values = message.module_config || (message.module_config = []);
        values.push(_decodeModuleConfig(bb));
        bb.limit = limit;
        break;
      }

      // repeated uint32 bet_pays = 22;
      case 22: {
        var values = message.bet_pays || (message.bet_pays = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint32 max_bets = 23;
      case 23: {
        var values = message.max_bets || (message.max_bets = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated DataList extra_datas = 24;
      case 24: {
        var limit = pushTemporaryLength(bb);
        var values = message.extra_datas || (message.extra_datas = []);
        values.push(_decodeDataList(bb));
        bb.limit = limit;
        break;
      }

      // repeated SlotResult last_fs_result_list = 25;
      case 25: {
        var limit = pushTemporaryLength(bb);
        var values = message.last_fs_result_list || (message.last_fs_result_list = []);
        values.push(_decodeSlotResult(bb));
        bb.limit = limit;
        break;
      }

      // repeated CommonDataList common_datas = 26;
      case 26: {
        var limit = pushTemporaryLength(bb);
        var values = message.common_datas || (message.common_datas = []);
        values.push(_decodeCommonDataList(bb));
        bb.limit = limit;
        break;
      }

      // optional VillageInforConfig village_infor = 27;
      case 27: {
        var limit = pushTemporaryLength(bb);
        message.village_infor = _decodeVillageInforConfig(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeFootBallConfig arcade_football = 28;
      case 28: {
        var limit = pushTemporaryLength(bb);
        message.arcade_football = _decodeArcadeFootBallConfig(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeTamagotchiConfig arcade_tamagotchi = 29;
      case 29: {
        var limit = pushTemporaryLength(bb);
        message.arcade_tamagotchi = _decodeArcadeTamagotchiConfig(bb);
        bb.limit = limit;
        break;
      }

      // optional DailyReceive daily_receive = 30;
      case 30: {
        var limit = pushTemporaryLength(bb);
        message.daily_receive = _decodeDailyReceive(bb);
        bb.limit = limit;
        break;
      }

      // repeated RecordList record_list = 31;
      case 31: {
        var limit = pushTemporaryLength(bb);
        var values = message.record_list || (message.record_list = []);
        values.push(_decodeRecordList(bb));
        bb.limit = limit;
        break;
      }

      // optional CommonDataInfo common_data_info = 32;
      case 32: {
        var limit = pushTemporaryLength(bb);
        message.common_data_info = _decodeCommonDataInfo(bb);
        bb.limit = limit;
        break;
      }

      // optional UPSdata ups_data = 33;
      case 33: {
        var limit = pushTemporaryLength(bb);
        message.ups_data = _decodeUPSdata(bb);
        bb.limit = limit;
        break;
      }

      // repeated MarqueeData marquee_data = 34;
      case 34: {
        var limit = pushTemporaryLength(bb);
        var values = message.marquee_data || (message.marquee_data = []);
        values.push(_decodeMarqueeData(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 lucky_strike_block_rate = 35;
      case 35: {
        message.lucky_strike_block_rate = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 law_min_bet = 36;
      case 36: {
        message.law_min_bet = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeStripsCall = function (message) {
  var bb = popByteBuffer();
  _encodeStripsCall(message, bb);
  return toUint8Array(bb);
}

function _encodeStripsCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string token = 2;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $token);
  }
};

exports.decodeStripsCall = function (binary) {
  return _decodeStripsCall(wrapByteBuffer(binary));
}

function _decodeStripsCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string token = 2;
      case 2: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.token === undefined)
    throw new Error("Missing required field: token");

  return message;
};

exports.encodeStrip = function (message) {
  var bb = popByteBuffer();
  _encodeStrip(message, bb);
  return toUint8Array(bb);
}

function _encodeStrip(message, bb) {
  // repeated int32 strip_arr = 1;
  var array$strip_arr = message.strip_arr;
  if (array$strip_arr !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$strip_arr.length; i++) {
      var value = array$strip_arr[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 10);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeStrip = function (binary) {
  return _decodeStrip(wrapByteBuffer(binary));
}

function _decodeStrip(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated int32 strip_arr = 1;
      case 1: {
        var values = message.strip_arr || (message.strip_arr = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeMultiStrip = function (message) {
  var bb = popByteBuffer();
  _encodeMultiStrip(message, bb);
  return toUint8Array(bb);
}

function _encodeMultiStrip(message, bb) {
  // repeated Strip strips = 1;
  var array$strips = message.strips;
  if (array$strips !== undefined) {
    for (var i = 0; i < array$strips.length; i++) {
      var value = array$strips[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeStrip(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeMultiStrip = function (binary) {
  return _decodeMultiStrip(wrapByteBuffer(binary));
}

function _decodeMultiStrip(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Strip strips = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.strips || (message.strips = []);
        values.push(_decodeStrip(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeStripData = function (message) {
  var bb = popByteBuffer();
  _encodeStripData(message, bb);
  return toUint8Array(bb);
}

function _encodeStripData(message, bb) {
  // required string module_id = 1;
  var $module_id = message.module_id;
  if ($module_id !== undefined) {
    writeVarint32(bb, 10);
    writeString(bb, $module_id);
  }

  // repeated Strip strips = 2;
  var array$strips = message.strips;
  if (array$strips !== undefined) {
    for (var i = 0; i < array$strips.length; i++) {
      var value = array$strips[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodeStrip(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated MultiStrip multi_strips = 3;
  var array$multi_strips = message.multi_strips;
  if (array$multi_strips !== undefined) {
    for (var i = 0; i < array$multi_strips.length; i++) {
      var value = array$multi_strips[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeMultiStrip(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeStripData = function (binary) {
  return _decodeStripData(wrapByteBuffer(binary));
}

function _decodeStripData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required string module_id = 1;
      case 1: {
        message.module_id = readString(bb, readVarint32(bb));
        break;
      }

      // repeated Strip strips = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.strips || (message.strips = []);
        values.push(_decodeStrip(bb));
        bb.limit = limit;
        break;
      }

      // repeated MultiStrip multi_strips = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.multi_strips || (message.multi_strips = []);
        values.push(_decodeMultiStrip(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.module_id === undefined)
    throw new Error("Missing required field: module_id");

  return message;
};

exports.encodeStripsRecall = function (message) {
  var bb = popByteBuffer();
  _encodeStripsRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeStripsRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }

  // repeated StripData allstrips = 3;
  var array$allstrips = message.allstrips;
  if (array$allstrips !== undefined) {
    for (var i = 0; i < array$allstrips.length; i++) {
      var value = array$allstrips[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeStripData(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeStripsRecall = function (binary) {
  return _decodeStripsRecall(wrapByteBuffer(binary));
}

function _decodeStripsRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      // repeated StripData allstrips = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.allstrips || (message.allstrips = []);
        values.push(_decodeStripData(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeResultCall = function (message) {
  var bb = popByteBuffer();
  _encodeResultCall(message, bb);
  return toUint8Array(bb);
}

function _encodeResultCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string token = 2;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $token);
  }

  // required string module_id = 3;
  var $module_id = message.module_id;
  if ($module_id !== undefined) {
    writeVarint32(bb, 26);
    writeString(bb, $module_id);
  }

  // required int32 bet = 4;
  var $bet = message.bet;
  if ($bet !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, intToLong($bet));
  }

  // required int32 line = 5;
  var $line = message.line;
  if ($line !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, intToLong($line));
  }

  // required int32 rate = 6;
  var $rate = message.rate;
  if ($rate !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($rate));
  }

  // repeated bytes module_command = 7;
  var array$module_command = message.module_command;
  if (array$module_command !== undefined) {
    for (var i = 0; i < array$module_command.length; i++) {
      var value = array$module_command[i];
      writeVarint32(bb, 58);
      writeVarint32(bb, value.length), writeBytes(bb, value);
    }
  }

  // optional int32 orientation = 8;
  var $orientation = message.orientation;
  if ($orientation !== undefined) {
    writeVarint32(bb, 64);
    writeVarint64(bb, intToLong($orientation));
  }
};

exports.decodeResultCall = function (binary) {
  return _decodeResultCall(wrapByteBuffer(binary));
}

function _decodeResultCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string token = 2;
      case 2: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      // required string module_id = 3;
      case 3: {
        message.module_id = readString(bb, readVarint32(bb));
        break;
      }

      // required int32 bet = 4;
      case 4: {
        message.bet = readVarint32(bb);
        break;
      }

      // required int32 line = 5;
      case 5: {
        message.line = readVarint32(bb);
        break;
      }

      // required int32 rate = 6;
      case 6: {
        message.rate = readVarint32(bb);
        break;
      }

      // repeated bytes module_command = 7;
      case 7: {
        var values = message.module_command || (message.module_command = []);
        values.push(readBytes(bb, readVarint32(bb)));
        break;
      }

      // optional int32 orientation = 8;
      case 8: {
        message.orientation = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.token === undefined)
    throw new Error("Missing required field: token");

  if (message.module_id === undefined)
    throw new Error("Missing required field: module_id");

  if (message.bet === undefined)
    throw new Error("Missing required field: bet");

  if (message.line === undefined)
    throw new Error("Missing required field: line");

  if (message.rate === undefined)
    throw new Error("Missing required field: rate");

  return message;
};

exports.encodeResultRecall = function (message) {
  var bb = popByteBuffer();
  _encodeResultRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeResultRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }

  // optional SlotResult result = 3;
  var $result = message.result;
  if ($result !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeSlotResult($result, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional uint64 player_cent = 4;
  var $player_cent = message.player_cent;
  if ($player_cent !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $player_cent);
  }

  // optional string next_module = 5;
  var $next_module = message.next_module;
  if ($next_module !== undefined) {
    writeVarint32(bb, 42);
    writeString(bb, $next_module);
  }

  // optional int32 cur_module_play_times = 6;
  var $cur_module_play_times = message.cur_module_play_times;
  if ($cur_module_play_times !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, intToLong($cur_module_play_times));
  }

  // optional int32 cur_module_total_times = 7;
  var $cur_module_total_times = message.cur_module_total_times;
  if ($cur_module_total_times !== undefined) {
    writeVarint32(bb, 56);
    writeVarint64(bb, intToLong($cur_module_total_times));
  }

  // optional MemberInfo member_info = 8;
  var $member_info = message.member_info;
  if ($member_info !== undefined) {
    writeVarint32(bb, 66);
    var nested = popByteBuffer();
    _encodeMemberInfo($member_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional UPSdata ups_data = 9;
  var $ups_data = message.ups_data;
  if ($ups_data !== undefined) {
    writeVarint32(bb, 74);
    var nested = popByteBuffer();
    _encodeUPSdata($ups_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated MarqueeData marquee_data = 10;
  var array$marquee_data = message.marquee_data;
  if (array$marquee_data !== undefined) {
    for (var i = 0; i < array$marquee_data.length; i++) {
      var value = array$marquee_data[i];
      writeVarint32(bb, 82);
      var nested = popByteBuffer();
      _encodeMarqueeData(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint64 accounting_sn = 11;
  var $accounting_sn = message.accounting_sn;
  if ($accounting_sn !== undefined) {
    writeVarint32(bb, 88);
    writeVarint64(bb, $accounting_sn);
  }
};

exports.decodeResultRecall = function (binary) {
  return _decodeResultRecall(wrapByteBuffer(binary));
}

function _decodeResultRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      // optional SlotResult result = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.result = _decodeSlotResult(bb);
        bb.limit = limit;
        break;
      }

      // optional uint64 player_cent = 4;
      case 4: {
        message.player_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional string next_module = 5;
      case 5: {
        message.next_module = readString(bb, readVarint32(bb));
        break;
      }

      // optional int32 cur_module_play_times = 6;
      case 6: {
        message.cur_module_play_times = readVarint32(bb);
        break;
      }

      // optional int32 cur_module_total_times = 7;
      case 7: {
        message.cur_module_total_times = readVarint32(bb);
        break;
      }

      // optional MemberInfo member_info = 8;
      case 8: {
        var limit = pushTemporaryLength(bb);
        message.member_info = _decodeMemberInfo(bb);
        bb.limit = limit;
        break;
      }

      // optional UPSdata ups_data = 9;
      case 9: {
        var limit = pushTemporaryLength(bb);
        message.ups_data = _decodeUPSdata(bb);
        bb.limit = limit;
        break;
      }

      // repeated MarqueeData marquee_data = 10;
      case 10: {
        var limit = pushTemporaryLength(bb);
        var values = message.marquee_data || (message.marquee_data = []);
        values.push(_decodeMarqueeData(bb));
        bb.limit = limit;
        break;
      }

      // optional uint64 accounting_sn = 11;
      case 11: {
        message.accounting_sn = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeOptionCall = function (message) {
  var bb = popByteBuffer();
  _encodeOptionCall(message, bb);
  return toUint8Array(bb);
}

function _encodeOptionCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string token = 2;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $token);
  }

  // required int32 player_opt_index = 3;
  var $player_opt_index = message.player_opt_index;
  if ($player_opt_index !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($player_opt_index));
  }

  // required OPTION_MODE opt_mode = 4;
  var $opt_mode = message.opt_mode;
  if ($opt_mode !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, exports.encodeOPTION_MODE[$opt_mode]);
  }
};

exports.decodeOptionCall = function (binary) {
  return _decodeOptionCall(wrapByteBuffer(binary));
}

function _decodeOptionCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string token = 2;
      case 2: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      // required int32 player_opt_index = 3;
      case 3: {
        message.player_opt_index = readVarint32(bb);
        break;
      }

      // required OPTION_MODE opt_mode = 4;
      case 4: {
        message.opt_mode = exports.decodeOPTION_MODE[readVarint32(bb)];
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.token === undefined)
    throw new Error("Missing required field: token");

  if (message.player_opt_index === undefined)
    throw new Error("Missing required field: player_opt_index");

  if (message.opt_mode === undefined)
    throw new Error("Missing required field: opt_mode");

  return message;
};

exports.encodeOptionRecall = function (message) {
  var bb = popByteBuffer();
  _encodeOptionRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeOptionRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }

  // optional int32 player_opt_index = 3;
  var $player_opt_index = message.player_opt_index;
  if ($player_opt_index !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($player_opt_index));
  }

  // repeated int32 multiplier = 4;
  var array$multiplier = message.multiplier;
  if (array$multiplier !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$multiplier.length; i++) {
      var value = array$multiplier[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 earn_times = 5;
  var array$earn_times = message.earn_times;
  if (array$earn_times !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$earn_times.length; i++) {
      var value = array$earn_times[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 42);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional string win_nextmodule = 6;
  var $win_nextmodule = message.win_nextmodule;
  if ($win_nextmodule !== undefined) {
    writeVarint32(bb, 50);
    writeString(bb, $win_nextmodule);
  }

  // repeated int32 lock_pattern = 7;
  var array$lock_pattern = message.lock_pattern;
  if (array$lock_pattern !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$lock_pattern.length; i++) {
      var value = array$lock_pattern[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 58);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated int32 jp888_option = 8;
  var array$jp888_option = message.jp888_option;
  if (array$jp888_option !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$jp888_option.length; i++) {
      var value = array$jp888_option[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 66);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional int32 win_option = 9;
  var $win_option = message.win_option;
  if ($win_option !== undefined) {
    writeVarint32(bb, 72);
    writeVarint64(bb, intToLong($win_option));
  }

  // optional uint32 pay = 10;
  var $pay = message.pay;
  if ($pay !== undefined) {
    writeVarint32(bb, 80);
    writeVarint32(bb, $pay);
  }

  // optional uint32 trigger_index = 11;
  var $trigger_index = message.trigger_index;
  if ($trigger_index !== undefined) {
    writeVarint32(bb, 88);
    writeVarint32(bb, $trigger_index);
  }

  // repeated int32 money_meow_options = 12;
  var array$money_meow_options = message.money_meow_options;
  if (array$money_meow_options !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$money_meow_options.length; i++) {
      var value = array$money_meow_options[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 98);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // optional uint32 bonus_times = 13;
  var $bonus_times = message.bonus_times;
  if ($bonus_times !== undefined) {
    writeVarint32(bb, 104);
    writeVarint32(bb, $bonus_times);
  }

  // repeated Option options = 14;
  var array$options = message.options;
  if (array$options !== undefined) {
    for (var i = 0; i < array$options.length; i++) {
      var value = array$options[i];
      writeVarint32(bb, 114);
      var nested = popByteBuffer();
      _encodeOption(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 attack_level = 15;
  var $attack_level = message.attack_level;
  if ($attack_level !== undefined) {
    writeVarint32(bb, 120);
    writeVarint32(bb, $attack_level);
  }

  // optional bool get_shield = 16;
  var $get_shield = message.get_shield;
  if ($get_shield !== undefined) {
    writeVarint32(bb, 128);
    writeByte(bb, $get_shield ? 1 : 0);
  }

  // optional uint32 gain_coin = 17;
  var $gain_coin = message.gain_coin;
  if ($gain_coin !== undefined) {
    writeVarint32(bb, 136);
    writeVarint32(bb, $gain_coin);
  }

  // optional ArcadeTamagotchi arcade_tamagotchi = 18;
  var $arcade_tamagotchi = message.arcade_tamagotchi;
  if ($arcade_tamagotchi !== undefined) {
    writeVarint32(bb, 146);
    var nested = popByteBuffer();
    _encodeArcadeTamagotchi($arcade_tamagotchi, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional uint64 player_cent = 19;
  var $player_cent = message.player_cent;
  if ($player_cent !== undefined) {
    writeVarint32(bb, 152);
    writeVarint64(bb, $player_cent);
  }

  // optional CommonDataInfo common_data_info = 20;
  var $common_data_info = message.common_data_info;
  if ($common_data_info !== undefined) {
    writeVarint32(bb, 162);
    var nested = popByteBuffer();
    _encodeCommonDataInfo($common_data_info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional UPSdata ups_data = 21;
  var $ups_data = message.ups_data;
  if ($ups_data !== undefined) {
    writeVarint32(bb, 170);
    var nested = popByteBuffer();
    _encodeUPSdata($ups_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeOptionRecall = function (binary) {
  return _decodeOptionRecall(wrapByteBuffer(binary));
}

function _decodeOptionRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      // optional int32 player_opt_index = 3;
      case 3: {
        message.player_opt_index = readVarint32(bb);
        break;
      }

      // repeated int32 multiplier = 4;
      case 4: {
        var values = message.multiplier || (message.multiplier = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 earn_times = 5;
      case 5: {
        var values = message.earn_times || (message.earn_times = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional string win_nextmodule = 6;
      case 6: {
        message.win_nextmodule = readString(bb, readVarint32(bb));
        break;
      }

      // repeated int32 lock_pattern = 7;
      case 7: {
        var values = message.lock_pattern || (message.lock_pattern = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // repeated int32 jp888_option = 8;
      case 8: {
        var values = message.jp888_option || (message.jp888_option = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional int32 win_option = 9;
      case 9: {
        message.win_option = readVarint32(bb);
        break;
      }

      // optional uint32 pay = 10;
      case 10: {
        message.pay = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 trigger_index = 11;
      case 11: {
        message.trigger_index = readVarint32(bb) >>> 0;
        break;
      }

      // repeated int32 money_meow_options = 12;
      case 12: {
        var values = message.money_meow_options || (message.money_meow_options = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      // optional uint32 bonus_times = 13;
      case 13: {
        message.bonus_times = readVarint32(bb) >>> 0;
        break;
      }

      // repeated Option options = 14;
      case 14: {
        var limit = pushTemporaryLength(bb);
        var values = message.options || (message.options = []);
        values.push(_decodeOption(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 attack_level = 15;
      case 15: {
        message.attack_level = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool get_shield = 16;
      case 16: {
        message.get_shield = !!readByte(bb);
        break;
      }

      // optional uint32 gain_coin = 17;
      case 17: {
        message.gain_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional ArcadeTamagotchi arcade_tamagotchi = 18;
      case 18: {
        var limit = pushTemporaryLength(bb);
        message.arcade_tamagotchi = _decodeArcadeTamagotchi(bb);
        bb.limit = limit;
        break;
      }

      // optional uint64 player_cent = 19;
      case 19: {
        message.player_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional CommonDataInfo common_data_info = 20;
      case 20: {
        var limit = pushTemporaryLength(bb);
        message.common_data_info = _decodeCommonDataInfo(bb);
        bb.limit = limit;
        break;
      }

      // optional UPSdata ups_data = 21;
      case 21: {
        var limit = pushTemporaryLength(bb);
        message.ups_data = _decodeUPSdata(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeCheckCall = function (message) {
  var bb = popByteBuffer();
  _encodeCheckCall(message, bb);
  return toUint8Array(bb);
}

function _encodeCheckCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string token = 2;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $token);
  }

  // required uint64 cur_player_cent = 3;
  var $cur_player_cent = message.cur_player_cent;
  if ($cur_player_cent !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $cur_player_cent);
  }
};

exports.decodeCheckCall = function (binary) {
  return _decodeCheckCall(wrapByteBuffer(binary));
}

function _decodeCheckCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string token = 2;
      case 2: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      // required uint64 cur_player_cent = 3;
      case 3: {
        message.cur_player_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.token === undefined)
    throw new Error("Missing required field: token");

  if (message.cur_player_cent === undefined)
    throw new Error("Missing required field: cur_player_cent");

  return message;
};

exports.encodeCheckRecall = function (message) {
  var bb = popByteBuffer();
  _encodeCheckRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeCheckRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }
};

exports.decodeCheckRecall = function (binary) {
  return _decodeCheckRecall(wrapByteBuffer(binary));
}

function _decodeCheckRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeStateCall = function (message) {
  var bb = popByteBuffer();
  _encodeStateCall(message, bb);
  return toUint8Array(bb);
}

function _encodeStateCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string token = 2;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $token);
  }

  // required ESTATEID stateid = 3;
  var $stateid = message.stateid;
  if ($stateid !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, exports.encodeESTATEID[$stateid]);
  }

  // repeated int32 reserved = 4;
  var array$reserved = message.reserved;
  if (array$reserved !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$reserved.length; i++) {
      var value = array$reserved[i];
      writeVarint64(packed, intToLong(value));
    }
    writeVarint32(bb, 34);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeStateCall = function (binary) {
  return _decodeStateCall(wrapByteBuffer(binary));
}

function _decodeStateCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string token = 2;
      case 2: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      // required ESTATEID stateid = 3;
      case 3: {
        message.stateid = exports.decodeESTATEID[readVarint32(bb)];
        break;
      }

      // repeated int32 reserved = 4;
      case 4: {
        var values = message.reserved || (message.reserved = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.token === undefined)
    throw new Error("Missing required field: token");

  if (message.stateid === undefined)
    throw new Error("Missing required field: stateid");

  return message;
};

exports.encodeStateRecall = function (message) {
  var bb = popByteBuffer();
  _encodeStateRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeStateRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }
};

exports.decodeStateRecall = function (binary) {
  return _decodeStateRecall(wrapByteBuffer(binary));
}

function _decodeStateRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeSuicideCall = function (message) {
  var bb = popByteBuffer();
  _encodeSuicideCall(message, bb);
  return toUint8Array(bb);
}

function _encodeSuicideCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }
};

exports.decodeSuicideCall = function (binary) {
  return _decodeSuicideCall(wrapByteBuffer(binary));
}

function _decodeSuicideCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  return message;
};

exports.encodePayTableCall = function (message) {
  var bb = popByteBuffer();
  _encodePayTableCall(message, bb);
  return toUint8Array(bb);
}

function _encodePayTableCall(message, bb) {
};

exports.decodePayTableCall = function (binary) {
  return _decodePayTableCall(wrapByteBuffer(binary));
}

function _decodePayTableCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodePayTableRecall = function (message) {
  var bb = popByteBuffer();
  _encodePayTableRecall(message, bb);
  return toUint8Array(bb);
}

function _encodePayTableRecall(message, bb) {
};

exports.decodePayTableRecall = function (binary) {
  return _decodePayTableRecall(wrapByteBuffer(binary));
}

function _decodePayTableRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeArcadeFootBallData = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeFootBallData(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeFootBallData(message, bb) {
  // repeated Combination new_game_Combination = 1;
  var array$new_game_Combination = message.new_game_Combination;
  if (array$new_game_Combination !== undefined) {
    for (var i = 0; i < array$new_game_Combination.length; i++) {
      var value = array$new_game_Combination[i];
      writeVarint32(bb, 10);
      var nested = popByteBuffer();
      _encodeCombination(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 arcad_unit = 2;
  var $arcad_unit = message.arcad_unit;
  if ($arcad_unit !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $arcad_unit);
  }

  // optional uint32 bet_maximum = 3;
  var $bet_maximum = message.bet_maximum;
  if ($bet_maximum !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $bet_maximum);
  }

  // optional uint32 bet_minimum = 4;
  var $bet_minimum = message.bet_minimum;
  if ($bet_minimum !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $bet_minimum);
  }
};

exports.decodeArcadeFootBallData = function (binary) {
  return _decodeArcadeFootBallData(wrapByteBuffer(binary));
}

function _decodeArcadeFootBallData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // repeated Combination new_game_Combination = 1;
      case 1: {
        var limit = pushTemporaryLength(bb);
        var values = message.new_game_Combination || (message.new_game_Combination = []);
        values.push(_decodeCombination(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 arcad_unit = 2;
      case 2: {
        message.arcad_unit = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 bet_maximum = 3;
      case 3: {
        message.bet_maximum = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 bet_minimum = 4;
      case 4: {
        message.bet_minimum = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeDataCall = function (message) {
  var bb = popByteBuffer();
  _encodeDataCall(message, bb);
  return toUint8Array(bb);
}

function _encodeDataCall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required string token = 2;
  var $token = message.token;
  if ($token !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $token);
  }

  // optional uint32 target_index = 3;
  var $target_index = message.target_index;
  if ($target_index !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, $target_index);
  }

  // optional uint32 target_value = 4;
  var $target_value = message.target_value;
  if ($target_value !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, $target_value);
  }
};

exports.decodeDataCall = function (binary) {
  return _decodeDataCall(wrapByteBuffer(binary));
}

function _decodeDataCall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required string token = 2;
      case 2: {
        message.token = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint32 target_index = 3;
      case 3: {
        message.target_index = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 target_value = 4;
      case 4: {
        message.target_value = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.token === undefined)
    throw new Error("Missing required field: token");

  return message;
};

exports.encodeArcadeTamagotchiData = function (message) {
  var bb = popByteBuffer();
  _encodeArcadeTamagotchiData(message, bb);
  return toUint8Array(bb);
}

function _encodeArcadeTamagotchiData(message, bb) {
  // optional uint32 virtual_coin = 1;
  var $virtual_coin = message.virtual_coin;
  if ($virtual_coin !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, $virtual_coin);
  }

  // repeated DinosaurInfo Dinosaurs_data = 2;
  var array$Dinosaurs_data = message.Dinosaurs_data;
  if (array$Dinosaurs_data !== undefined) {
    for (var i = 0; i < array$Dinosaurs_data.length; i++) {
      var value = array$Dinosaurs_data[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodeDinosaurInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated SceneInfo Scene_data = 3;
  var array$Scene_data = message.Scene_data;
  if (array$Scene_data !== undefined) {
    for (var i = 0; i < array$Scene_data.length; i++) {
      var value = array$Scene_data[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeSceneInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated AreaInfo Area_data = 4;
  var array$Area_data = message.Area_data;
  if (array$Area_data !== undefined) {
    for (var i = 0; i < array$Area_data.length; i++) {
      var value = array$Area_data[i];
      writeVarint32(bb, 34);
      var nested = popByteBuffer();
      _encodeAreaInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated NewsInfo News_data = 5;
  var array$News_data = message.News_data;
  if (array$News_data !== undefined) {
    for (var i = 0; i < array$News_data.length; i++) {
      var value = array$News_data[i];
      writeVarint32(bb, 42);
      var nested = popByteBuffer();
      _encodeNewsInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated DinosaurInfo Dead_data = 6;
  var array$Dead_data = message.Dead_data;
  if (array$Dead_data !== undefined) {
    for (var i = 0; i < array$Dead_data.length; i++) {
      var value = array$Dead_data[i];
      writeVarint32(bb, 50);
      var nested = popByteBuffer();
      _encodeDinosaurInfo(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }
};

exports.decodeArcadeTamagotchiData = function (binary) {
  return _decodeArcadeTamagotchiData(wrapByteBuffer(binary));
}

function _decodeArcadeTamagotchiData(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint32 virtual_coin = 1;
      case 1: {
        message.virtual_coin = readVarint32(bb) >>> 0;
        break;
      }

      // repeated DinosaurInfo Dinosaurs_data = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.Dinosaurs_data || (message.Dinosaurs_data = []);
        values.push(_decodeDinosaurInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated SceneInfo Scene_data = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.Scene_data || (message.Scene_data = []);
        values.push(_decodeSceneInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated AreaInfo Area_data = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        var values = message.Area_data || (message.Area_data = []);
        values.push(_decodeAreaInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated NewsInfo News_data = 5;
      case 5: {
        var limit = pushTemporaryLength(bb);
        var values = message.News_data || (message.News_data = []);
        values.push(_decodeNewsInfo(bb));
        bb.limit = limit;
        break;
      }

      // repeated DinosaurInfo Dead_data = 6;
      case 6: {
        var limit = pushTemporaryLength(bb);
        var values = message.Dead_data || (message.Dead_data = []);
        values.push(_decodeDinosaurInfo(bb));
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
};

exports.encodeDataRecall = function (message) {
  var bb = popByteBuffer();
  _encodeDataRecall(message, bb);
  return toUint8Array(bb);
}

function _encodeDataRecall(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required StatusCode status_code = 2;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }

  // optional ArcadeFootBallData arcade_football = 3;
  var $arcade_football = message.arcade_football;
  if ($arcade_football !== undefined) {
    writeVarint32(bb, 26);
    var nested = popByteBuffer();
    _encodeArcadeFootBallData($arcade_football, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // optional ArcadeTamagotchiData arcade_tamagotchi = 4;
  var $arcade_tamagotchi = message.arcade_tamagotchi;
  if ($arcade_tamagotchi !== undefined) {
    writeVarint32(bb, 34);
    var nested = popByteBuffer();
    _encodeArcadeTamagotchiData($arcade_tamagotchi, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }

  // repeated RecordList record_list = 5;
  var array$record_list = message.record_list;
  if (array$record_list !== undefined) {
    for (var i = 0; i < array$record_list.length; i++) {
      var value = array$record_list[i];
      writeVarint32(bb, 42);
      var nested = popByteBuffer();
      _encodeRecordList(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint64 player_cent = 6;
  var $player_cent = message.player_cent;
  if ($player_cent !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, $player_cent);
  }

  // optional UPSdata ups_data = 7;
  var $ups_data = message.ups_data;
  if ($ups_data !== undefined) {
    writeVarint32(bb, 58);
    var nested = popByteBuffer();
    _encodeUPSdata($ups_data, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeDataRecall = function (binary) {
  return _decodeDataRecall(wrapByteBuffer(binary));
}

function _decodeDataRecall(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required StatusCode status_code = 2;
      case 2: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      // optional ArcadeFootBallData arcade_football = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        message.arcade_football = _decodeArcadeFootBallData(bb);
        bb.limit = limit;
        break;
      }

      // optional ArcadeTamagotchiData arcade_tamagotchi = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        message.arcade_tamagotchi = _decodeArcadeTamagotchiData(bb);
        bb.limit = limit;
        break;
      }

      // repeated RecordList record_list = 5;
      case 5: {
        var limit = pushTemporaryLength(bb);
        var values = message.record_list || (message.record_list = []);
        values.push(_decodeRecordList(bb));
        bb.limit = limit;
        break;
      }

      // optional uint64 player_cent = 6;
      case 6: {
        message.player_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional UPSdata ups_data = 7;
      case 7: {
        var limit = pushTemporaryLength(bb);
        message.ups_data = _decodeUPSdata(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeCentInAsk = function (message) {
  var bb = popByteBuffer();
  _encodeCentInAsk(message, bb);
  return toUint8Array(bb);
}

function _encodeCentInAsk(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required ECENTINTYPE type = 2;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeECENTINTYPE[$type]);
  }

  // required uint64 tid = 3;
  var $tid = message.tid;
  if ($tid !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $tid);
  }

  // required uint64 cent = 4;
  var $cent = message.cent;
  if ($cent !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $cent);
  }

  // optional int32 pool_id = 5;
  var $pool_id = message.pool_id;
  if ($pool_id !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, intToLong($pool_id));
  }

  // optional uint32 ticket = 6;
  var $ticket = message.ticket;
  if ($ticket !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $ticket);
  }

  // optional uint32 featurebuy_type = 7;
  var $featurebuy_type = message.featurebuy_type;
  if ($featurebuy_type !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $featurebuy_type);
  }
};

exports.decodeCentInAsk = function (binary) {
  return _decodeCentInAsk(wrapByteBuffer(binary));
}

function _decodeCentInAsk(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required ECENTINTYPE type = 2;
      case 2: {
        message.type = exports.decodeECENTINTYPE[readVarint32(bb)];
        break;
      }

      // required uint64 tid = 3;
      case 3: {
        message.tid = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // required uint64 cent = 4;
      case 4: {
        message.cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional int32 pool_id = 5;
      case 5: {
        message.pool_id = readVarint32(bb);
        break;
      }

      // optional uint32 ticket = 6;
      case 6: {
        message.ticket = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 featurebuy_type = 7;
      case 7: {
        message.featurebuy_type = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  if (message.tid === undefined)
    throw new Error("Missing required field: tid");

  if (message.cent === undefined)
    throw new Error("Missing required field: cent");

  return message;
};

exports.encodeCentInReask = function (message) {
  var bb = popByteBuffer();
  _encodeCentInReask(message, bb);
  return toUint8Array(bb);
}

function _encodeCentInReask(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required ECENTINTYPE type = 2;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, exports.encodeECENTINTYPE[$type]);
  }

  // required uint64 tid = 3;
  var $tid = message.tid;
  if ($tid !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $tid);
  }
};

exports.decodeCentInReask = function (binary) {
  return _decodeCentInReask(wrapByteBuffer(binary));
}

function _decodeCentInReask(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required ECENTINTYPE type = 2;
      case 2: {
        message.type = exports.decodeECENTINTYPE[readVarint32(bb)];
        break;
      }

      // required uint64 tid = 3;
      case 3: {
        message.tid = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  if (message.tid === undefined)
    throw new Error("Missing required field: tid");

  return message;
};

exports.encodePool = function (message) {
  var bb = popByteBuffer();
  _encodePool(message, bb);
  return toUint8Array(bb);
}

function _encodePool(message, bb) {
  // required int32 id = 1;
  var $id = message.id;
  if ($id !== undefined) {
    writeVarint32(bb, 8);
    writeVarint64(bb, intToLong($id));
  }

  // required string name = 2;
  var $name = message.name;
  if ($name !== undefined) {
    writeVarint32(bb, 18);
    writeString(bb, $name);
  }

  // required uint64 current_cent = 3;
  var $current_cent = message.current_cent;
  if ($current_cent !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $current_cent);
  }

  // required bool enable = 4;
  var $enable = message.enable;
  if ($enable !== undefined) {
    writeVarint32(bb, 32);
    writeByte(bb, $enable ? 1 : 0);
  }

  // optional uint64 max_cent = 5;
  var $max_cent = message.max_cent;
  if ($max_cent !== undefined) {
    writeVarint32(bb, 40);
    writeVarint64(bb, $max_cent);
  }
};

exports.decodePool = function (binary) {
  return _decodePool(wrapByteBuffer(binary));
}

function _decodePool(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required int32 id = 1;
      case 1: {
        message.id = readVarint32(bb);
        break;
      }

      // required string name = 2;
      case 2: {
        message.name = readString(bb, readVarint32(bb));
        break;
      }

      // required uint64 current_cent = 3;
      case 3: {
        message.current_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // required bool enable = 4;
      case 4: {
        message.enable = !!readByte(bb);
        break;
      }

      // optional uint64 max_cent = 5;
      case 5: {
        message.max_cent = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.id === undefined)
    throw new Error("Missing required field: id");

  if (message.name === undefined)
    throw new Error("Missing required field: name");

  if (message.current_cent === undefined)
    throw new Error("Missing required field: current_cent");

  if (message.enable === undefined)
    throw new Error("Missing required field: enable");

  return message;
};

exports.encodeLuckyDrawConfig = function (message) {
  var bb = popByteBuffer();
  _encodeLuckyDrawConfig(message, bb);
  return toUint8Array(bb);
}

function _encodeLuckyDrawConfig(message, bb) {
  // required bool enable = 1;
  var $enable = message.enable;
  if ($enable !== undefined) {
    writeVarint32(bb, 8);
    writeByte(bb, $enable ? 1 : 0);
  }

  // optional uint64 begin_time = 2;
  var $begin_time = message.begin_time;
  if ($begin_time !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, $begin_time);
  }

  // optional uint64 end_time = 3;
  var $end_time = message.end_time;
  if ($end_time !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, $end_time);
  }

  // optional uint64 server_time = 4;
  var $server_time = message.server_time;
  if ($server_time !== undefined) {
    writeVarint32(bb, 32);
    writeVarint64(bb, $server_time);
  }

  // optional uint32 max_round = 5;
  var $max_round = message.max_round;
  if ($max_round !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $max_round);
  }

  // optional uint32 cur_round = 6;
  var $cur_round = message.cur_round;
  if ($cur_round !== undefined) {
    writeVarint32(bb, 48);
    writeVarint32(bb, $cur_round);
  }

  // optional uint32 prob_config_idx = 7;
  var $prob_config_idx = message.prob_config_idx;
  if ($prob_config_idx !== undefined) {
    writeVarint32(bb, 56);
    writeVarint32(bb, $prob_config_idx);
  }

  // repeated uint32 prize_bets = 8;
  var array$prize_bets = message.prize_bets;
  if (array$prize_bets !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$prize_bets.length; i++) {
      var value = array$prize_bets[i];
      writeVarint32(packed, value);
    }
    writeVarint32(bb, 66);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint64 prize_list = 9;
  var array$prize_list = message.prize_list;
  if (array$prize_list !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$prize_list.length; i++) {
      var value = array$prize_list[i];
      writeVarint64(packed, value);
    }
    writeVarint32(bb, 74);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }

  // repeated uint64 featurebuy_list = 10;
  var array$featurebuy_list = message.featurebuy_list;
  if (array$featurebuy_list !== undefined) {
    var packed = popByteBuffer();
    for (var i = 0; i < array$featurebuy_list.length; i++) {
      var value = array$featurebuy_list[i];
      writeVarint64(packed, value);
    }
    writeVarint32(bb, 82);
    writeVarint32(bb, packed.offset);
    writeByteBuffer(bb, packed);
    pushByteBuffer(packed);
  }
};

exports.decodeLuckyDrawConfig = function (binary) {
  return _decodeLuckyDrawConfig(wrapByteBuffer(binary));
}

function _decodeLuckyDrawConfig(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required bool enable = 1;
      case 1: {
        message.enable = !!readByte(bb);
        break;
      }

      // optional uint64 begin_time = 2;
      case 2: {
        message.begin_time = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 end_time = 3;
      case 3: {
        message.end_time = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 server_time = 4;
      case 4: {
        message.server_time = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint32 max_round = 5;
      case 5: {
        message.max_round = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 cur_round = 6;
      case 6: {
        message.cur_round = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint32 prob_config_idx = 7;
      case 7: {
        message.prob_config_idx = readVarint32(bb) >>> 0;
        break;
      }

      // repeated uint32 prize_bets = 8;
      case 8: {
        var values = message.prize_bets || (message.prize_bets = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint32(bb) >>> 0);
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint32(bb) >>> 0);
        }
        break;
      }

      // repeated uint64 prize_list = 9;
      case 9: {
        var values = message.prize_list || (message.prize_list = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64(bb, /* unsigned */ true));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64(bb, /* unsigned */ true));
        }
        break;
      }

      // repeated uint64 featurebuy_list = 10;
      case 10: {
        var values = message.featurebuy_list || (message.featurebuy_list = []);
        if ((tag & 7) === 2) {
          var outerLimit = pushTemporaryLength(bb);
          while (!isAtEnd(bb)) {
            values.push(readVarint64(bb, /* unsigned */ true));
          }
          bb.limit = outerLimit;
        } else {
          values.push(readVarint64(bb, /* unsigned */ true));
        }
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.enable === undefined)
    throw new Error("Missing required field: enable");

  return message;
};

exports.encodeJackpotInfo = function (message) {
  var bb = popByteBuffer();
  _encodeJackpotInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeJackpotInfo(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // repeated Pool pool_list = 2;
  var array$pool_list = message.pool_list;
  if (array$pool_list !== undefined) {
    for (var i = 0; i < array$pool_list.length; i++) {
      var value = array$pool_list[i];
      writeVarint32(bb, 18);
      var nested = popByteBuffer();
      _encodePool(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // required StatusCode status_code = 3;
  var $status_code = message.status_code;
  if ($status_code !== undefined) {
    writeVarint32(bb, 24);
    writeVarint32(bb, exports.encodeStatusCode[$status_code]);
  }

  // optional ECENTINTYPE type = 4;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 32);
    writeVarint32(bb, exports.encodeECENTINTYPE[$type]);
  }

  // optional LuckyDrawConfig lucky_draw_config = 5;
  var $lucky_draw_config = message.lucky_draw_config;
  if ($lucky_draw_config !== undefined) {
    writeVarint32(bb, 42);
    var nested = popByteBuffer();
    _encodeLuckyDrawConfig($lucky_draw_config, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeJackpotInfo = function (binary) {
  return _decodeJackpotInfo(wrapByteBuffer(binary));
}

function _decodeJackpotInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // repeated Pool pool_list = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        var values = message.pool_list || (message.pool_list = []);
        values.push(_decodePool(bb));
        bb.limit = limit;
        break;
      }

      // required StatusCode status_code = 3;
      case 3: {
        message.status_code = exports.decodeStatusCode[readVarint32(bb)];
        break;
      }

      // optional ECENTINTYPE type = 4;
      case 4: {
        message.type = exports.decodeECENTINTYPE[readVarint32(bb)];
        break;
      }

      // optional LuckyDrawConfig lucky_draw_config = 5;
      case 5: {
        var limit = pushTemporaryLength(bb);
        message.lucky_draw_config = _decodeLuckyDrawConfig(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.status_code === undefined)
    throw new Error("Missing required field: status_code");

  return message;
};

exports.encodeJackpotNotify = function (message) {
  var bb = popByteBuffer();
  _encodeJackpotNotify(message, bb);
  return toUint8Array(bb);
}

function _encodeJackpotNotify(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required int32 type = 2;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 16);
    writeVarint64(bb, intToLong($type));
  }

  // optional int32 pool_id = 3;
  var $pool_id = message.pool_id;
  if ($pool_id !== undefined) {
    writeVarint32(bb, 24);
    writeVarint64(bb, intToLong($pool_id));
  }
};

exports.decodeJackpotNotify = function (binary) {
  return _decodeJackpotNotify(wrapByteBuffer(binary));
}

function _decodeJackpotNotify(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required int32 type = 2;
      case 2: {
        message.type = readVarint32(bb);
        break;
      }

      // optional int32 pool_id = 3;
      case 3: {
        message.pool_id = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  return message;
};

exports.encodeMemberInfo = function (message) {
  var bb = popByteBuffer();
  _encodeMemberInfo(message, bb);
  return toUint8Array(bb);
}

function _encodeMemberInfo(message, bb) {
  // required Type type = 1;
  var $type = message.type;
  if ($type !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeType[$type]);
  }

  // optional uint32 level = 2;
  var $level = message.level;
  if ($level !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $level);
  }

  // repeated MemberMedal total = 3;
  var array$total = message.total;
  if (array$total !== undefined) {
    for (var i = 0; i < array$total.length; i++) {
      var value = array$total[i];
      writeVarint32(bb, 26);
      var nested = popByteBuffer();
      _encodeMemberMedal(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // repeated MemberMedal cur_wins = 4;
  var array$cur_wins = message.cur_wins;
  if (array$cur_wins !== undefined) {
    for (var i = 0; i < array$cur_wins.length; i++) {
      var value = array$cur_wins[i];
      writeVarint32(bb, 34);
      var nested = popByteBuffer();
      _encodeMemberMedal(value, nested);
      writeVarint32(bb, nested.limit);
      writeByteBuffer(bb, nested);
      pushByteBuffer(nested);
    }
  }

  // optional uint32 ps_coin = 5;
  var $ps_coin = message.ps_coin;
  if ($ps_coin !== undefined) {
    writeVarint32(bb, 40);
    writeVarint32(bb, $ps_coin);
  }

  // optional uint64 expire_time = 6;
  var $expire_time = message.expire_time;
  if ($expire_time !== undefined) {
    writeVarint32(bb, 48);
    writeVarint64(bb, $expire_time);
  }

  // optional uint64 server_time = 7;
  var $server_time = message.server_time;
  if ($server_time !== undefined) {
    writeVarint32(bb, 56);
    writeVarint64(bb, $server_time);
  }

  // optional uint32 ps_coin_sum = 8;
  var $ps_coin_sum = message.ps_coin_sum;
  if ($ps_coin_sum !== undefined) {
    writeVarint32(bb, 64);
    writeVarint32(bb, $ps_coin_sum);
  }

  // optional bool is_reached_cap = 9;
  var $is_reached_cap = message.is_reached_cap;
  if ($is_reached_cap !== undefined) {
    writeVarint32(bb, 72);
    writeByte(bb, $is_reached_cap ? 1 : 0);
  }
};

exports.decodeMemberInfo = function (binary) {
  return _decodeMemberInfo(wrapByteBuffer(binary));
}

function _decodeMemberInfo(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required Type type = 1;
      case 1: {
        message.type = exports.decodeType[readVarint32(bb)];
        break;
      }

      // optional uint32 level = 2;
      case 2: {
        message.level = readVarint32(bb) >>> 0;
        break;
      }

      // repeated MemberMedal total = 3;
      case 3: {
        var limit = pushTemporaryLength(bb);
        var values = message.total || (message.total = []);
        values.push(_decodeMemberMedal(bb));
        bb.limit = limit;
        break;
      }

      // repeated MemberMedal cur_wins = 4;
      case 4: {
        var limit = pushTemporaryLength(bb);
        var values = message.cur_wins || (message.cur_wins = []);
        values.push(_decodeMemberMedal(bb));
        bb.limit = limit;
        break;
      }

      // optional uint32 ps_coin = 5;
      case 5: {
        message.ps_coin = readVarint32(bb) >>> 0;
        break;
      }

      // optional uint64 expire_time = 6;
      case 6: {
        message.expire_time = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 server_time = 7;
      case 7: {
        message.server_time = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint32 ps_coin_sum = 8;
      case 8: {
        message.ps_coin_sum = readVarint32(bb) >>> 0;
        break;
      }

      // optional bool is_reached_cap = 9;
      case 9: {
        message.is_reached_cap = !!readByte(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.type === undefined)
    throw new Error("Missing required field: type");

  return message;
};

exports.encodeMemberInfoAsk = function (message) {
  var bb = popByteBuffer();
  _encodeMemberInfoAsk(message, bb);
  return toUint8Array(bb);
}

function _encodeMemberInfoAsk(message, bb) {
  // required EMSGID msgid = 1;
  var $msgid = message.msgid;
  if ($msgid !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeEMSGID[$msgid]);
  }

  // required MemberInfo info = 2;
  var $info = message.info;
  if ($info !== undefined) {
    writeVarint32(bb, 18);
    var nested = popByteBuffer();
    _encodeMemberInfo($info, nested);
    writeVarint32(bb, nested.limit);
    writeByteBuffer(bb, nested);
    pushByteBuffer(nested);
  }
};

exports.decodeMemberInfoAsk = function (binary) {
  return _decodeMemberInfoAsk(wrapByteBuffer(binary));
}

function _decodeMemberInfoAsk(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required EMSGID msgid = 1;
      case 1: {
        message.msgid = exports.decodeEMSGID[readVarint32(bb)];
        break;
      }

      // required MemberInfo info = 2;
      case 2: {
        var limit = pushTemporaryLength(bb);
        message.info = _decodeMemberInfo(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.msgid === undefined)
    throw new Error("Missing required field: msgid");

  if (message.info === undefined)
    throw new Error("Missing required field: info");

  return message;
};

exports.encodeMemberMedal = function (message) {
  var bb = popByteBuffer();
  _encodeMemberMedal(message, bb);
  return toUint8Array(bb);
}

function _encodeMemberMedal(message, bb) {
  // required MedalCode code = 1;
  var $code = message.code;
  if ($code !== undefined) {
    writeVarint32(bb, 8);
    writeVarint32(bb, exports.encodeMedalCode[$code]);
  }

  // required uint32 count = 2;
  var $count = message.count;
  if ($count !== undefined) {
    writeVarint32(bb, 16);
    writeVarint32(bb, $count);
  }
};

exports.decodeMemberMedal = function (binary) {
  return _decodeMemberMedal(wrapByteBuffer(binary));
}

function _decodeMemberMedal(bb) {
  var message = {};

  end_of_message: while (!isAtEnd(bb)) {
    var tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // required MedalCode code = 1;
      case 1: {
        message.code = exports.decodeMedalCode[readVarint32(bb)];
        break;
      }

      // required uint32 count = 2;
      case 2: {
        message.count = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  if (message.code === undefined)
    throw new Error("Missing required field: code");

  if (message.count === undefined)
    throw new Error("Missing required field: count");

  return message;
};

function pushTemporaryLength(bb) {
  var length = readVarint32(bb);
  var limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb, type) {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

function stringToLong(value) {
  return {
    low: value.charCodeAt(0) | (value.charCodeAt(1) << 16),
    high: value.charCodeAt(2) | (value.charCodeAt(3) << 16),
    unsigned: false,
  };
}

function longToString(value) {
  var low = value.low;
  var high = value.high;
  return String.fromCharCode(
    low & 0xFFFF,
    low >>> 16,
    high & 0xFFFF,
    high >>> 16);
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

var f32 = new Float32Array(1);
var f32_u8 = new Uint8Array(f32.buffer);

var f64 = new Float64Array(1);
var f64_u8 = new Uint8Array(f64.buffer);

function intToLong(value) {
  value |= 0;
  return {
    low: value,
    high: value >> 31,
    unsigned: value >= 0,
  };
}

var bbStack = [];

function popByteBuffer() {
  const bb = bbStack.pop();
  if (!bb) return { bytes: new Uint8Array(64), offset: 0, limit: 0 };
  bb.offset = bb.limit = 0;
  return bb;
}

function pushByteBuffer(bb) {
  bbStack.push(bb);
}

function wrapByteBuffer(bytes) {
  return { bytes, offset: 0, limit: bytes.length };
}

function toUint8Array(bb) {
  var bytes = bb.bytes;
  var limit = bb.limit;
  return bytes.length === limit ? bytes : bytes.subarray(0, limit);
}

function skip(bb, offset) {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb) {
  return bb.offset >= bb.limit;
}

function grow(bb, count) {
  var bytes = bb.bytes;
  var offset = bb.offset;
  var limit = bb.limit;
  var finalOffset = offset + count;
  if (finalOffset > bytes.length) {
    var newBytes = new Uint8Array(finalOffset * 2);
    newBytes.set(bytes);
    bb.bytes = newBytes;
  }
  bb.offset = finalOffset;
  if (finalOffset > limit) {
    bb.limit = finalOffset;
  }
  return offset;
}

function advance(bb, count) {
  var offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readBytes(bb, count) {
  var offset = advance(bb, count);
  return bb.bytes.subarray(offset, offset + count);
}

function writeBytes(bb, buffer) {
  var offset = grow(bb, buffer.length);
  bb.bytes.set(buffer, offset);
}

function readString(bb, count) {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  var offset = advance(bb, count);
  var fromCharCode = String.fromCharCode;
  var bytes = bb.bytes;
  var invalid = '\uFFFD';
  var text = '';

  for (var i = 0; i < count; i++) {
    var c1 = bytes[i + offset], c2, c3, c4, c;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function writeString(bb, text) {
  // Sadly a hand-coded UTF8 encoder is much faster than TextEncoder+set in V8
  var n = text.length;
  var byteCount = 0;

  // Write the byte count first
  for (var i = 0; i < n; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    byteCount += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  writeVarint32(bb, byteCount);

  var offset = grow(bb, byteCount);
  var bytes = bb.bytes;

  // Then write the bytes
  for (var i = 0; i < n; i++) {
    var c = text.charCodeAt(i);
    if (c >= 0xD800 && c <= 0xDBFF && i + 1 < n) {
      c = (c << 10) + text.charCodeAt(++i) - 0x35FDC00;
    }
    if (c < 0x80) {
      bytes[offset++] = c;
    } else {
      if (c < 0x800) {
        bytes[offset++] = ((c >> 6) & 0x1F) | 0xC0;
      } else {
        if (c < 0x10000) {
          bytes[offset++] = ((c >> 12) & 0x0F) | 0xE0;
        } else {
          bytes[offset++] = ((c >> 18) & 0x07) | 0xF0;
          bytes[offset++] = ((c >> 12) & 0x3F) | 0x80;
        }
        bytes[offset++] = ((c >> 6) & 0x3F) | 0x80;
      }
      bytes[offset++] = (c & 0x3F) | 0x80;
    }
  }
}

function writeByteBuffer(bb, buffer) {
  var offset = grow(bb, buffer.limit);
  var from = bb.bytes;
  var to = buffer.bytes;

  // This for loop is much faster than subarray+set on V8
  for (var i = 0, n = buffer.limit; i < n; i++) {
    from[i + offset] = to[i];
  }
}

function readByte(bb) {
  return bb.bytes[advance(bb, 1)];
}

function writeByte(bb, value) {
  var offset = grow(bb, 1);
  bb.bytes[offset] = value;
}

function readFloat(bb) {
  var offset = advance(bb, 4);
  var bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f32_u8[0] = bytes[offset++];
  f32_u8[1] = bytes[offset++];
  f32_u8[2] = bytes[offset++];
  f32_u8[3] = bytes[offset++];
  return f32[0];
}

function writeFloat(bb, value) {
  var offset = grow(bb, 4);
  var bytes = bb.bytes;
  f32[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f32_u8[0];
  bytes[offset++] = f32_u8[1];
  bytes[offset++] = f32_u8[2];
  bytes[offset++] = f32_u8[3];
}

function readDouble(bb) {
  var offset = advance(bb, 8);
  var bytes = bb.bytes;

  // Manual copying is much faster than subarray+set in V8
  f64_u8[0] = bytes[offset++];
  f64_u8[1] = bytes[offset++];
  f64_u8[2] = bytes[offset++];
  f64_u8[3] = bytes[offset++];
  f64_u8[4] = bytes[offset++];
  f64_u8[5] = bytes[offset++];
  f64_u8[6] = bytes[offset++];
  f64_u8[7] = bytes[offset++];
  return f64[0];
}

function writeDouble(bb, value) {
  var offset = grow(bb, 8);
  var bytes = bb.bytes;
  f64[0] = value;

  // Manual copying is much faster than subarray+set in V8
  bytes[offset++] = f64_u8[0];
  bytes[offset++] = f64_u8[1];
  bytes[offset++] = f64_u8[2];
  bytes[offset++] = f64_u8[3];
  bytes[offset++] = f64_u8[4];
  bytes[offset++] = f64_u8[5];
  bytes[offset++] = f64_u8[6];
  bytes[offset++] = f64_u8[7];
}

function readInt32(bb) {
  var offset = advance(bb, 4);
  var bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function writeInt32(bb, value) {
  var offset = grow(bb, 4);
  var bytes = bb.bytes;
  bytes[offset] = value;
  bytes[offset + 1] = value >> 8;
  bytes[offset + 2] = value >> 16;
  bytes[offset + 3] = value >> 24;
}

function readInt64(bb, unsigned) {
  return {
    low: readInt32(bb),
    high: readInt32(bb),
    unsigned,
  };
}

function writeInt64(bb, value) {
  writeInt32(bb, value.low);
  writeInt32(bb, value.high);
}

function readVarint32(bb) {
  var c = 0;
  var value = 0;
  var b;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}

function writeVarint32(bb, value) {
  value >>>= 0;
  while (value >= 0x80) {
    writeByte(bb, (value & 0x7f) | 0x80);
    value >>>= 7;
  }
  writeByte(bb, value);
}

function readVarint64(bb, unsigned) {
  var part0 = 0;
  var part1 = 0;
  var part2 = 0;
  var b;

  b = readByte(bb); part0 = (b & 0x7F); if (b & 0x80) {
    b = readByte(bb); part0 |= (b & 0x7F) << 7; if (b & 0x80) {
      b = readByte(bb); part0 |= (b & 0x7F) << 14; if (b & 0x80) {
        b = readByte(bb); part0 |= (b & 0x7F) << 21; if (b & 0x80) {

          b = readByte(bb); part1 = (b & 0x7F); if (b & 0x80) {
            b = readByte(bb); part1 |= (b & 0x7F) << 7; if (b & 0x80) {
              b = readByte(bb); part1 |= (b & 0x7F) << 14; if (b & 0x80) {
                b = readByte(bb); part1 |= (b & 0x7F) << 21; if (b & 0x80) {

                  b = readByte(bb); part2 = (b & 0x7F); if (b & 0x80) {
                    b = readByte(bb); part2 |= (b & 0x7F) << 7;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return {
    low: part0 | (part1 << 28),
    high: (part1 >>> 4) | (part2 << 24),
    unsigned,
  };
}

function writeVarint64(bb, value) {
  var part0 = value.low >>> 0;
  var part1 = ((value.low >>> 28) | (value.high << 4)) >>> 0;
  var part2 = value.high >>> 24;

  // ref: src/google/protobuf/io/coded_stream.cc
  var size =
    part2 === 0 ?
      part1 === 0 ?
        part0 < 1 << 14 ?
          part0 < 1 << 7 ? 1 : 2 :
          part0 < 1 << 21 ? 3 : 4 :
        part1 < 1 << 14 ?
          part1 < 1 << 7 ? 5 : 6 :
          part1 < 1 << 21 ? 7 : 8 :
      part2 < 1 << 7 ? 9 : 10;

  var offset = grow(bb, size);
  var bytes = bb.bytes;

  switch (size) {
    case 10: bytes[offset + 9] = (part2 >>> 7) & 0x01;
    case 9: bytes[offset + 8] = size !== 9 ? part2 | 0x80 : part2 & 0x7F;
    case 8: bytes[offset + 7] = size !== 8 ? (part1 >>> 21) | 0x80 : (part1 >>> 21) & 0x7F;
    case 7: bytes[offset + 6] = size !== 7 ? (part1 >>> 14) | 0x80 : (part1 >>> 14) & 0x7F;
    case 6: bytes[offset + 5] = size !== 6 ? (part1 >>> 7) | 0x80 : (part1 >>> 7) & 0x7F;
    case 5: bytes[offset + 4] = size !== 5 ? part1 | 0x80 : part1 & 0x7F;
    case 4: bytes[offset + 3] = size !== 4 ? (part0 >>> 21) | 0x80 : (part0 >>> 21) & 0x7F;
    case 3: bytes[offset + 2] = size !== 3 ? (part0 >>> 14) | 0x80 : (part0 >>> 14) & 0x7F;
    case 2: bytes[offset + 1] = size !== 2 ? (part0 >>> 7) | 0x80 : (part0 >>> 7) & 0x7F;
    case 1: bytes[offset] = size !== 1 ? part0 | 0x80 : part0 & 0x7F;
  }
}

function readVarint32ZigZag(bb) {
  var value = readVarint32(bb);

  // ref: src/google/protobuf/wire_format_lite.h
  return (value >>> 1) ^ -(value & 1);
}

function writeVarint32ZigZag(bb, value) {
  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint32(bb, (value << 1) ^ (value >> 31));
}

function readVarint64ZigZag(bb) {
  var value = readVarint64(bb, /* unsigned */ false);
  var low = value.low;
  var high = value.high;
  var flip = -(low & 1);

  // ref: src/google/protobuf/wire_format_lite.h
  return {
    low: ((low >>> 1) | (high << 31)) ^ flip,
    high: (high >>> 1) ^ flip,
    unsigned: false,
  };
}

function writeVarint64ZigZag(bb, value) {
  var low = value.low;
  var high = value.high;
  var flip = high >> 31;

  // ref: src/google/protobuf/wire_format_lite.h
  writeVarint64(bb, {
    low: (low << 1) ^ flip,
    high: ((high << 1) | (low >>> 31)) ^ flip,
    unsigned: false,
  });
}
