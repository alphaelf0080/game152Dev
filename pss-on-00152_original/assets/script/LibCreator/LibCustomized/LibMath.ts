//產生min到max之間的亂數
export function Between(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


type RoundingMode = 'round' | 'floor' | 'ceil';
/**
 * 取某值到小數點第幾位
 * @param value 值，必須是有限數值
 * @param decimals 第幾位，必須大於0 
 * @param roundingMode 取值方法
 * @returns 
 */
export function formatDecimal(value: number, decimals: number, roundingMode: RoundingMode = 'round'): number {
    // 驗證參數
    if (!Number.isInteger(decimals) || decimals < 0) {
        throw new Error('小數位數必須是非負整數');
    }

    if (!Number.isFinite(value)) {
        throw new Error('輸入必須是有限數值');
    }

    // 計算縮放因子
    const factor = Math.pow(10, decimals);
    // 根據不同的捨入模式處理數值
    let result: number;
    switch (roundingMode) {
        case 'round':
            result = Math.round(value * factor) / factor;
            break;
        case 'floor':
            result = Math.floor(value * factor) / factor;
            break;
        case 'ceil':
            result = Math.ceil(value * factor) / factor;
            break;
    }
    return result
}