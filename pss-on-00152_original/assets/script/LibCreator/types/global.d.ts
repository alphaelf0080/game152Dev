export { };

declare global {
    interface Window {
        psapi?: Psapi;
        getHostImages?: () => Record<string, { h: string, v: string }>
        getPSImages?: () => { jp_mode: number, mode: number, type: number[] }
        goHome?: () => void;
        hostInitialize?: () => void; // 依實際型別調整
        getPSEvents?: () => typeof psapi.hostInfo.eventInfo;
        RedPacketFakeData?: { RSYB: number[], WT: number[], TA: number }
    }
    type LangCode = "sch" | "eng" | "tai" | "ind" | "kor" | "vie" | "tch" | "mys" | "jp" | "ru" | "por" | "esp" | "tur";
}

// type HostImages = {
//     [key: string]: { h: string, v: string }
// }

interface Psapi {
    getURLParameter: (name: string) => string | null;
    hostInfo: {
        game_id: string;
        game_version: {
            rev: number;
            build: number;
        };
        history_url: string;
        lang: string;
        host_id: string;
        return_type: number,
        history_sn_enable: boolean;
        game_type: string;
        server_info: Record<string, string>;
        host_resource: {
            jp_mode: number;
            mode: 101;
            type: number[];
        },
        reel_spin: number
    };
    origin: string;
    platform: {
        isWebView: boolean;
    }
    openLobby: () => void;
    queryString: Record<string, string>; // 內建泛型型別 物件的 key 是字串，value 也是字串
    allowFullscr: boolean;
}

/* Record 是 TypeScript 內建的一個泛型工具型別，
type HostImages = Record<string, { h: string; v: string }>;
    等同於：
    type HostImages = {
        [key: string]: {
            h: string;
            v: string;
        };
    };
    可以有任意多個鍵，只要鍵是字串、值符合 { h: string; v: string } 的結構就行
    所以它可以無限延伸



    as 是 型別斷言（Type Assertion） 的語法，意思是告訴編譯器：
    我很確定這個值是某個型別，你先別懷疑。”

    as 與 ! 的差別
    !（non-null assertion）只是告訴編譯器「這個值一定不是 null/undefined」。

    as 是告訴編譯器「這個值的型別是 XXX」。
*/
