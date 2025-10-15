import { sp, SpriteFrame, LabelAtlas, Asset } from 'cc';

/**
 * 節點路徑配置
 */
export interface NodePathConfig {
    id: string;
    path: string;
    componentType: 'Skeleton' | 'Sprite' | 'Button' | 'Label';
    resourceKey: string;
}

/**
 * 資源載入配置
 */
export interface ResourceLoadConfig {
    key: string;
    path: string;
    type: typeof Asset;
    priority: number;
}

/**
 * 語言配置
 */
export const SUPPORTED_LANGUAGES = [
    "eng", "esp", "ind", "jp", "kor", "mys", 
    "por", "ru", "sch", "tai", "tch", "vie", "tur", "xeng"
];

/**
 * 資源載入配置（按優先級排序）
 */
export const RESOURCE_LOAD_CONFIG: ResourceLoadConfig[] = [
    // Priority 1: 高優先級（遊戲核心資源）
    { key: 'bigwin', path: '/anm/bigwin', type: sp.SkeletonData, priority: 1 },
    { key: 'banner', path: '/pic/banner', type: SpriteFrame, priority: 1 },
    { key: 'fs', path: '/pic/fs', type: SpriteFrame, priority: 1 },
    
    // Priority 2: 中優先級（常用功能）
    { key: 'featurebuy_anm', path: '/anm/featureBuy', type: sp.SkeletonData, priority: 2 },
    { key: 'featurebuy_pic', path: '/pic/feature_buy3.0', type: SpriteFrame, priority: 2 },
    { key: '5kind', path: '/anm/5kind', type: sp.SkeletonData, priority: 2 },
    
    // Priority 3: 低優先級（UI 資源）
    { key: 'num', path: '/num', type: LabelAtlas, priority: 3 },
    { key: 'ui3_common', path: '/ui3.0/common', type: SpriteFrame, priority: 3 },
    { key: 'ui3', path: '/ui3.0', type: SpriteFrame, priority: 3 },
    { key: 'ucoin', path: '/UCoin/pic', type: SpriteFrame, priority: 3 }
];

/**
 * 節點路徑配置（所有需要設置語言資源的節點）
 */
export const NODE_PATH_CONFIG: NodePathConfig[] = [
    // BigWin 動畫
    {
        id: 'BWinSlogan',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinSlogan',
        componentType: 'Skeleton',
        resourceKey: 'bigwin'
    },
    {
        id: 'BWinSlogan2',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinSlogan2',
        componentType: 'Skeleton',
        resourceKey: 'bigwin'
    },
    {
        id: 'BWinTitle',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinTitle',
        componentType: 'Skeleton',
        resourceKey: 'bigwin'
    },
    {
        id: 'BWinTitle2',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BigwinAnm/BWinTitle2',
        componentType: 'Skeleton',
        resourceKey: 'bigwin'
    },
    
    // FeatureBuy 動畫
    {
        id: 'FeatureBuyAnm',
        path: 'Canvas/BaseGame/Layer/Shake/UI/BsUI/FeatureBuyButton/FeatureBuyAnm',
        componentType: 'Skeleton',
        resourceKey: 'featurebuy_anm'
    },
    
    // 5連線動畫
    {
        id: 'FiveLineAnm',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BannerController/FiveLineAnm',
        componentType: 'Skeleton',
        resourceKey: '5kind'
    },
    
    // Banner 圖片
    {
        id: 'BannerText',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BannerController/BannerBgCover/BannerText',
        componentType: 'Sprite',
        resourceKey: 'banner'
    },
    
    // FeatureBuy 按鈕
    {
        id: 'FeatureBuyStartBtn',
        path: 'Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyStartBtn',
        componentType: 'Button',
        resourceKey: 'featurebuy_pic'
    },
    {
        id: 'FeatureBuyBackBtn2',
        path: 'Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyBackBtn2',
        componentType: 'Button',
        resourceKey: 'featurebuy_pic'
    },
    
    // FeatureBuy 圖片
    {
        id: 'FeatureBuyText',
        path: 'Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyText',
        componentType: 'Sprite',
        resourceKey: 'featurebuy_pic'
    },
    {
        id: 'FeatureBuyTitle',
        path: 'Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyTitle',
        componentType: 'Sprite',
        resourceKey: 'featurebuy_pic'
    },
    {
        id: 'FeatureBuyLabel',
        path: 'Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyLabel',
        componentType: 'Sprite',
        resourceKey: 'featurebuy_pic'
    },
    {
        id: 'FeatureBuyDiscount',
        path: 'Canvas/BaseGame/Page/FeatureBuyPage/FeatureBuyPage2/FeatureBuyDiscount',
        componentType: 'Sprite',
        resourceKey: 'featurebuy_pic'
    },
    
    // FreeGame 圖片
    {
        id: 'FreeSpinNum_1',
        path: 'Canvas/BaseGame/Layer/Shake/UI/FSUI/FreeSpinNum_1',
        componentType: 'Sprite',
        resourceKey: 'fs'
    },
    {
        id: 'FreeSpinNum_2',
        path: 'Canvas/BaseGame/Layer/Shake/UI/FSUI/FreeSpinNum_2',
        componentType: 'Sprite',
        resourceKey: 'fs'
    },
    {
        id: 'TransNum',
        path: 'Canvas/BaseGame/Trans/TransNum',
        componentType: 'Sprite',
        resourceKey: 'fs'
    },
    {
        id: 'TransEnd',
        path: 'Canvas/BaseGame/Trans/TransEnd',
        componentType: 'Sprite',
        resourceKey: 'fs'
    },
    {
        id: 'TransBtN',
        path: 'Canvas/BaseGame/Trans/TransBtN',
        componentType: 'Button',
        resourceKey: 'fs'
    },
    {
        id: 'BannerReText',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BannerWin/BannerReText',
        componentType: 'Sprite',
        resourceKey: 'fs'
    },
    {
        id: 'BannerMaxText',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BannerWin/BannerMaxText',
        componentType: 'Sprite',
        resourceKey: 'fs'
    },
    
    // 字體
    {
        id: 'WinText',
        path: 'Canvas/BaseGame/Layer/Shake/Animation/BannerWin/WinText',
        componentType: 'Label',
        resourceKey: 'num'
    },
    
    // UI3.0 Common
    {
        id: 'HelpNotice',
        path: 'Canvas/BaseGame/Page/HelpPage/HelpBg/Notice',
        componentType: 'Sprite',
        resourceKey: 'ui3_common'
    },
    {
        id: 'InfoBgText',
        path: 'Canvas/Notice/InfoBg/text',
        componentType: 'Sprite',
        resourceKey: 'ui3_common'
    },
    {
        id: 'InfoNoBalanceText',
        path: 'Canvas/Notice/InfoNoBalance/text',
        componentType: 'Sprite',
        resourceKey: 'ui3_common'
    },
    
    // UI3.0
    {
        id: 'HelpTitle',
        path: 'Canvas/BaseGame/Page/HelpPage/HelpBg/Title',
        componentType: 'Sprite',
        resourceKey: 'ui3'
    },
    {
        id: 'BetScrollText1',
        path: 'Canvas/BaseGame/Page/BetSCroll/ScrollBg/text1',
        componentType: 'Sprite',
        resourceKey: 'ui3'
    },
    {
        id: 'BetScrollText2',
        path: 'Canvas/BaseGame/Page/BetSCroll/ScrollBg/text2',
        componentType: 'Sprite',
        resourceKey: 'ui3'
    },
    {
        id: 'MaxBetTxt',
        path: 'Canvas/BaseGame/Page/BetSCroll/MaxBetAnm/MaxBetTxt',
        componentType: 'Sprite',
        resourceKey: 'ui3'
    },
    {
        id: 'TurboOn',
        path: 'Canvas/Notice/turboOn',
        componentType: 'Sprite',
        resourceKey: 'ui3'
    },
    {
        id: 'TurboOff',
        path: 'Canvas/Notice/turboOff',
        componentType: 'Sprite',
        resourceKey: 'ui3'
    },
    {
        id: 'GameWay',
        path: 'Canvas/BaseGame/Layer/Shake/UI/GameWay',
        componentType: 'Sprite',
        resourceKey: 'ui3'
    },
    
    // UCoin
    {
        id: 'UcoinReward',
        path: 'Canvas/Ucoin/UcoinRule/Reward',
        componentType: 'Sprite',
        resourceKey: 'ucoin'
    },
    {
        id: 'UcoinRule1',
        path: 'Canvas/Ucoin/UcoinRule/Rule/Rule1',
        componentType: 'Sprite',
        resourceKey: 'ucoin'
    },
    {
        id: 'UcoinRule2',
        path: 'Canvas/Ucoin/UcoinRule/Rule/Rule2',
        componentType: 'Sprite',
        resourceKey: 'ucoin'
    },
    {
        id: 'UcoinRule3',
        path: 'Canvas/Ucoin/UcoinRule/Rule/Rule3',
        componentType: 'Sprite',
        resourceKey: 'ucoin'
    },
    {
        id: 'UcoinRule4',
        path: 'Canvas/Ucoin/UcoinRule/Rule/Rule4',
        componentType: 'Sprite',
        resourceKey: 'ucoin'
    },
    {
        id: 'UcoinTextEndNotice',
        path: 'Canvas/Ucoin/UcoinTextEnd/Notice',
        componentType: 'Sprite',
        resourceKey: 'ucoin'
    }
];

/**
 * 根據優先級分組資源配置
 */
export function groupResourcesByPriority(): Map<number, ResourceLoadConfig[]> {
    const grouped = new Map<number, ResourceLoadConfig[]>();
    
    RESOURCE_LOAD_CONFIG.forEach(config => {
        if (!grouped.has(config.priority)) {
            grouped.set(config.priority, []);
        }
        grouped.get(config.priority)!.push(config);
    });
    
    return grouped;
}

/**
 * 獲取所有節點路徑（用於預載入）
 */
export function getAllNodePaths(): string[] {
    return NODE_PATH_CONFIG.map(config => config.path);
}
