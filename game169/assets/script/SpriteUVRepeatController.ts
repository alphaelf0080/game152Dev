/**
 * SpriteUVRepeat Shader 控制器
 * 為 Sprite 提供第二層 Blend Mode 下拉菜單和 UV 控制
 * 支援 Cocos Creator 3.8 的 Inspector 編輯
 */

import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property, executeInEditMode, requireComponent } = _decorator;

// 混合模式名稱映射
const BLEND_MODE_NAMES: { [key: number]: string } = {
  0: 'Normal',
  1: 'Multiply',
  2: 'Screen',
  3: 'Overlay',
  4: 'Darken',
  5: 'Lighten',
  6: 'Color Dodge',
  7: 'Color Burn',
  8: 'Hard Light',
  9: 'Soft Light',
  10: 'Difference',
  11: 'Exclusion',
};

@ccclass('SpriteUVRepeatController')
@executeInEditMode()
@requireComponent(Sprite)
export class SpriteUVRepeatController extends Component {
  @property({ displayName: '啟用第二層' })
  public useLayer: boolean = true;

  @property({
    type: Number,
    displayName: '第二層混合模式',
    enum: {
      Normal: 0,
      Multiply: 1,
      Screen: 2,
      Overlay: 3,
      Darken: 4,
      Lighten: 5,
      'Color Dodge': 6,
      'Color Burn': 7,
      'Hard Light': 8,
      'Soft Light': 9,
      Difference: 10,
      Exclusion: 11,
    },
  })
  public layerBlendMode: number = 0;

  @property({ displayName: '混合強度', range: [0, 1], step: 0.01 })
  public layerBlendIntensity: number = 1.0;

  @property({ displayName: '第二層透明度', range: [0, 100], step: 1 })
  public layerOpacity: number = 100.0;

  @property({ displayName: '當前混合模式', readonly: true })
  public layerBlendModeName: string = 'Normal';

  @property({ displayName: '第二層色相', range: [-180, 180], step: 1 })
  public layerHue: number = 0;

  @property({ displayName: '第二層飽和度', range: [-100, 100], step: 1 })
  public layerSaturation: number = 0;

  @property({ displayName: '第二層明度', range: [-100, 100], step: 1 })
  public layerValue: number = 0;

  @property({ displayName: '第二層對比度', range: [-50, 100], step: 1 })
  public layerContrast: number = 0;

  private sprite: Sprite | null = null;
  private lastBlendMode: number = -1;
  private lastBlendIntensity: number = -1;
  private lastOpacity: number = -1;
  private lastUseLayer: boolean = false;
  private lastHue: number = -999;
  private lastSaturation: number = -999;
  private lastValue: number = -999;
  private lastContrast: number = -999;

  onLoad() {
    this.sprite = this.getComponent(Sprite);
    this.updateMaterial();
  }

  onEnable() {
    this.updateMaterial();
  }

  update() {
    // 檢查是否有屬性變化
    if (
      this.lastBlendMode !== this.layerBlendMode ||
      this.lastBlendIntensity !== this.layerBlendIntensity ||
      this.lastOpacity !== this.layerOpacity ||
      this.lastUseLayer !== this.useLayer ||
      this.lastHue !== this.layerHue ||
      this.lastSaturation !== this.layerSaturation ||
      this.lastValue !== this.layerValue ||
      this.lastContrast !== this.layerContrast
    ) {
      // 更新混合模式名稱
      this.layerBlendModeName = BLEND_MODE_NAMES[this.layerBlendMode] || 'Unknown';
      this.updateMaterial();
    }
  }

  private updateMaterial() {
    if (!this.sprite) {
      this.sprite = this.getComponent(Sprite);
    }

    if (!this.sprite) return;

    try {
      const material = this.sprite.getMaterialInstance(0);
      if (!material) return;

      // 更新材質屬性
      material.setProperty('useLayer', this.useLayer ? 1.0 : 0.0);
      material.setProperty('layerBlendMode', Number(this.layerBlendMode));
      material.setProperty('layerBlendIntensity', this.layerBlendIntensity);
      material.setProperty('layerOpacity', this.layerOpacity);
      material.setProperty('layerHue', this.layerHue);
      material.setProperty('layerSaturation', this.layerSaturation);
      material.setProperty('layerValue', this.layerValue);
      material.setProperty('layerContrast', this.layerContrast);

      // 記錄當前值
      this.lastBlendMode = this.layerBlendMode;
      this.lastBlendIntensity = this.layerBlendIntensity;
      this.lastOpacity = this.layerOpacity;
      this.lastUseLayer = this.useLayer;
      this.lastHue = this.layerHue;
      this.lastSaturation = this.layerSaturation;
      this.lastValue = this.layerValue;
      this.lastContrast = this.layerContrast;
    } catch (e) {
      // 沈默處理
    }
  }
}
