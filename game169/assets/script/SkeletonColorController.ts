import { _decorator, Component, sp, Color, log } from 'cc';
const { ccclass, property } = _decorator;

/**
 * SkeletonColorController
 * Spine 骨骼色彩控制器 - 控制同節點上的 sp.Skeleton 組件的顏色
 * 
 * 用法:
 * - 在包含 sp.Skeleton 和此組件的節點上自動初始化
 * - 提供 setSkeletonColor(), getSkeletonColor() 等方法
 * - 支援色彩染色、重置等操作
 */
@ccclass('SkeletonColorController')
export class SkeletonColorController extends Component {
    private skeletonComponent: sp.Skeleton | null = null;

    onLoad() {
        // Get the sp.Skeleton component on the same node
        this.skeletonComponent = this.node.getComponent(sp.Skeleton);
        
        if (!this.skeletonComponent) {
            console.warn(`[SkeletonColorController] No sp.Skeleton component found on node: ${this.node.name}`);
        }
    }

    /**
     * Set the color of the skeleton
     * @param color The color to set
     */
    public setSkeletonColor(color: Color) {
        if (this.skeletonComponent) {
            this.skeletonComponent.color = color;
        }
    }

    /**
     * Get the current color of the skeleton
     * @returns The current color, or null if skeleton not found
     */
    public getSkeletonColor(): Color | null {
        if (this.skeletonComponent) {
            return this.skeletonComponent.color;
        }
        return null;
    }

    /**
     * Set skeleton color by RGB values (0-255)
     * @param r Red value (0-255)
     * @param g Green value (0-255)
     * @param b Blue value (0-255)
     * @param a Alpha value (0-255), default 255
     */
    public setSkeletonColorRGB(r: number, g: number, b: number, a: number = 255) {
        if (this.skeletonComponent) {
            this.skeletonComponent.color = new Color(r, g, b, a);
        }
    }

    /**
     * Tint the skeleton color with a multiplier
     * @param tintColor The tint color to apply
     */
    public tintSkeletonColor(tintColor: Color) {
        if (this.skeletonComponent) {
            const currentColor = this.skeletonComponent.color;
            const tintedColor = new Color(
                Math.round(currentColor.r * tintColor.r / 255),
                Math.round(currentColor.g * tintColor.g / 255),
                Math.round(currentColor.b * tintColor.b / 255),
                currentColor.a
            );
            this.skeletonComponent.color = tintedColor;
        }
    }

    /**
     * Reset the skeleton color to white (default)
     */
    public resetSkeletonColor() {
        if (this.skeletonComponent) {
            this.skeletonComponent.color = Color.WHITE;
        }
    }

    /**
     * Get reference to the skeleton component directly
     */
    public getSkeleton(): sp.Skeleton | null {
        return this.skeletonComponent;
    }
}
