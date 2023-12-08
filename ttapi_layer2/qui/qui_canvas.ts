import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"


export class QUI_Canvas extends QUI.QUI_BaseElement {
    constructor(target: tt.IRenderTarget) {
        super();
        this.target = target;
        this.batcherUI = tt.graphic.CreateRenderer_Batcher();
        //设置canvas 基本尺寸
        this.localRect.setByRect(new tt.Rectangle(0, 0, this.target.getWidth(), this.target.getHeight()));

        //让batcher的中心点看着target中心点，这样就会把0，0点移动到左上角
        this.batcherUI.LookAt.X = this.target.getWidth() / 2;
        this.batcherUI.LookAt.Y = this.target.getHeight() / 2;
    }
    Clone(): QUI.QUI_IElement {
        throw new Error("can not clone canvas.");
    }
    //Canvas Scale 不改变输出分辨率，而是直接缩放
    //而tt.graphic.setMainScreenScale 会直接改变输出分辨率
    scale: number = 1.0;
    batcherUI: tt.IBatcher;
    target: tt.IRenderTarget;
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Canvas;
    }
    OnUpdate(delta: number): void {

        //要考虑到屏幕尺寸会变
        if (!this.Enable)
            return;

        this.batcherUI.LookAt.X = this.target.getWidth() / 2;
        this.batcherUI.LookAt.Y = this.target.getHeight() / 2;

        let scalewidth = this.target.getWidth() / this.scale;
        let scaleheight = this.target.getHeight() / this.scale;
        this.localRect.setByRect(new tt.Rectangle(0, 0, scalewidth, scaleheight));
        super.OnUpdate(delta);
    }
    OnRender(_canvas: QUI_Canvas): void {
        //canvas 自身不绘制
        if (!this.Enable)
            return;
        this.batcherUI.BeginDraw(this.target);
        super.OnRender(this);
        this.batcherUI.EndDraw();
    }
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {
        let fs = tt.graphic.getFinalScale() / this.scale;
        let tx = x * fs;
        let ty = y * fs;
        return super.OnTouch(touchid, press, move, tx, ty);
    }
}
