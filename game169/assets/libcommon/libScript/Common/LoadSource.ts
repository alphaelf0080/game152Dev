import { _decorator, Asset, AssetManager, assetManager, BitmapFont, ImageAsset, JsonAsset, resources, sp, SpriteFrame, TextAsset, Texture2D } from 'cc';
import { Singleton } from './Singleton';
import { logCtrl, LogType } from '../Controller/LogController';
import { FntParser } from './FntParser';

export enum BundleType {
    Resources = "resources",
    BsSound = "bsSound",
    FsSound = "fsSound",
    CCY = "currency",
    DynamicBs = "dynamicLoadingBs",
    DynamicFs = "dynamicLoadingFs",
    JackpotDynamic = "jackpotDynamic",
    RedJackpotDynamic = "redJackpotDynamic",
    UCoinDynamic = "uCoinDynamic",
    NoticePrefab = "noticePrefab",
    MiniSpinCost = "MiniSpinCost",
};
class LoadSource extends Singleton<LoadSource> {

    public loadBundle(bundleName: string, cb?: Function): Promise<AssetManager.Bundle | void> {
        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            if (bundleName == BundleType.Resources) {
                if (cb) cb(resources);
                resolve(resources);
                return;
            }

            assetManager.loadBundle(bundleName, (err, bundle) => {
                if (err) {
                    reject();
                    return;
                }

                if (cb) cb(bundle);
                resolve(bundle);
            });
        }).catch((err) => {
            logCtrl.log(LogType.Trace, "[LoadBundle] err:", err);
        });
    }

    /**將ImageAsset資源轉成SpriteFrame*/
    private _imageAssetToSpriteFrame(imgAsset: ImageAsset): SpriteFrame {
        let sp = new SpriteFrame();
        let tex = new Texture2D();
        tex.image = imgAsset;
        sp.texture = tex;
        return sp;
    }

    public loadBundleSrc(bundleName: string, path: string, type?: any, cb?: Function): Promise<any | void> {
        return new Promise<any>(async (resolve, reject) => {
            let isNeedChange: boolean = (type === ImageAsset) || (type === SpriteFrame);
            let bundle = this.getBundle(bundleName);
            if (!bundle) bundle = await this.loadBundle(bundleName) as AssetManager.Bundle;

            let t = isNeedChange ? ImageAsset : type ? type : Asset;
            let source = bundle.get(path, t);
            if (source) {
                let src = isNeedChange ? this._imageAssetToSpriteFrame(source as ImageAsset) : source;
                resolve(src);
            }
            else {
                bundle.load(path, t, (err, assets) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    let src = isNeedChange ? this._imageAssetToSpriteFrame(assets as ImageAsset) : assets;
                    if (cb) cb(src);
                    resolve(src);
                });
            }
        }).catch((err) => {
            logCtrl.log(LogType.Trace, "[LoadSource] err:", err);
        });
    }

    public loadBundleDir(bundleName: string, path: string, type?: any, cb?: Function): Promise<any | void> {
        return new Promise<any>(async (resolve, reject) => {
            let bundle = this.getBundle(bundleName);
            if (!bundle) bundle = await this.loadBundle(bundleName) as AssetManager.Bundle;

            let t = type ? type : Asset;
            let source = bundle.get(path, t);

            if (source) resolve(source);
            else {
                bundle.loadDir(path, t, (err, assets) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (cb) cb(assets);
                    resolve(assets);
                });
            }
        }).catch((err) => {
            logCtrl.log(LogType.Trace, "[LoadDir] err:", err);
        });
    }

    public getBundle(bundleName: string): AssetManager.Bundle {
        return (bundleName == BundleType.Resources) ? resources : assetManager.getBundle(bundleName);
    }

    public getSrc(bundleName: string, path: string, type: any): any {
        let isNeedChange: boolean = (type === ImageAsset) || (type === SpriteFrame);
        let t = isNeedChange ? ImageAsset : type ? type : Asset;
        let source = this.getBundle(bundleName).get(path, t);
        let src = isNeedChange ? this._imageAssetToSpriteFrame(source as ImageAsset) : source;
        return src;
    }

    public loadRemote<T extends Asset>(path: string, cb?: Function): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            assetManager.loadRemote<T>(path, (err, assets) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (assetManager.cacheManager) assetManager.cacheManager.removeCache(assets.nativeUrl);
                if (cb) cb(assets);
                resolve(assets);
            })
        }).catch((err) => {
            logCtrl.log(LogType.Trace, "[LoadRemote] err:", err);
        });
    }

    async loadRemoteSpriteFrame(path: string): Promise<SpriteFrame> {
        let imageAsset = await this.loadRemote<ImageAsset>(path);
        return this._imageAssetToSpriteFrame(imageAsset);
    }

    /**
    * 
    * @param path [png,atlas,json,png]
    */
    async loadRemoteSpine(
        path: [string, string, string, string],
    ): Promise<sp.SkeletonData> {
        try {
            return new Promise<sp.SkeletonData>(async (resolve, reject) => {
                // 加載資源
                const imageAsset = await this.loadRemote<ImageAsset>(path[0]);
                const atlasAsset = await this.loadRemote<TextAsset>(path[1]);
                const jsonAsset = await this.loadRemote<JsonAsset>(path[2]);

                // 組合 Spine 資源
                const texture = new Texture2D();
                texture.image = imageAsset;

                const spineAtlas = atlasAsset.text;
                const spineJson = jsonAsset.json;

                const asset = new sp.SkeletonData();
                asset.skeletonJson = spineJson;
                asset.atlasText = spineAtlas;
                asset.textures = [texture];
                let split = path[3].split('/');
                asset.textureNames = [split[split.length - 1]];

                // 成功回調
                resolve(asset);
            })
        } catch (error) {
            console.error("Failed to load Spine resources:", error);
        }
    }

    /**
     * 
     * @param path [png,fnt]
     */
    async loadRemoteBitMapFnt(path: [string, string]): Promise<BitmapFont> {
        return new Promise<BitmapFont>(async (resolve, reject) => {
            // 加載資源
            const imageAsset = await this.loadRemote<ImageAsset>(path[0]);
            const fontAsset = await this.loadRemote<TextAsset>(path[1]);

            const spriteFrame = this._imageAssetToSpriteFrame(imageAsset);
            let bitmapFont = new BitmapFont();
            bitmapFont.fntConfig = this._parseFnt(fontAsset.text);
            bitmapFont.spriteFrame = spriteFrame;
            bitmapFont.fontSize = bitmapFont.fntConfig.fontSize;
            let split = fontAsset.uuid.split('/')
            let splitLen = split.length;
            bitmapFont.name = split[splitLen - 1].replace(/\..*$/, "");
            bitmapFont.onLoaded()
            resolve(bitmapFont);
        });
    }

    private _parseFnt(fntText: string): any {
        var char;
        const parser = FntParser.parse(fntText);
        const json = parser.toJSON();
        const cccFnt: Record<string, any> = {
            commonHeight: json.common.lineHeight,
            fontSize: json.info.size,
            atlasName: json.page.file,
            fontDefDictionary: {},
            kerningDict: {},
        };
        for (const idx in json.char) {
            char = json.char[idx];
            cccFnt.fontDefDictionary[char.id] = {
                rect: {
                    x: char.x,
                    y: char.y,
                    width: char.width,
                    height: char.height,
                },
                xOffset: char.xoffset,
                yOffset: char.yoffset,
                xAdvance: char.xadvance,
            };
        }
        return cccFnt;
    }
}

export const LSInst = LoadSource.getInstance(LoadSource);