
import { tt } from "../../../ttapi_interface/ttapi.js";
import * as QUI from "../qui_base.js"
import { QUI_Canvas } from "../qui_canvas.js";
import { QUI_Container } from "../qui_container.js";


//Panel 是最简单的组件
export class QUI_Panel extends QUI.QUI_BaseElement {
    constructor() {
        super();

        this.localRect.setByRect(new tt.Rectangle(0, 0, 250, 250));
        this.container = new QUI_Container();
        this.container._parent = this;
        this.container.localRect.setAsFill();
        this._border = new tt.Border(2, 2, 2, 2);
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Panel;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_Panel();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.backElement = QUI.QUI_Clone(this.backElement);
        elem.borderElement = QUI.QUI_Clone(this.borderElement);
        return elem;
    }
    backElement: QUI.QUI_IElement;
    borderElement: QUI.QUI_IElement;//面板的边界外观
    protected _border: tt.Border;//面板的边距
    getBorder(): tt.Border {
        return this._border;
    }
    OnRender(_canvas: QUI_Canvas): void {
        if (this.backElement != null) {
            this.backElement.OnRender(_canvas);
        }
        let batcher = _canvas.batcherUI;

        //根据边距计算限制区域
        let rectlimit = this.getWorldRectScale(_canvas.scale);
        rectlimit.X += this._border.XLeft;
        rectlimit.Y += this._border.YTop;
        rectlimit.Width -= (this._border.XLeft + this._border.XRight);
        rectlimit.Height -= (this._border.YTop + this._border.YBottom);

        let target = batcher.getTarget();
        batcher.EndDraw();

        target.PushLimitRect(rectlimit);

        batcher.BeginDraw(target);
        this.container.OnRender(_canvas);
        batcher.EndDraw();

        target.PopLimitRect();

        batcher.BeginDraw(target);
        if (this.borderElement != null)
            this.borderElement.OnRender(_canvas);
    }

    protected updateContainerPos(): void {

        this.container.localRect.radioX1 = 0;
        this.container.localRect.radioY1 = 0;
        this.container.localRect.radioX2 = 1;
        this.container.localRect.radioY2 = 1;
        this.container.localRect.offsetX1 = this._border.XLeft;
        this.container.localRect.offsetX2 = -this._border.XRight;
        this.container.localRect.offsetY1 = this._border.YTop;
        this.container.localRect.offsetY2 = -this._border.YBottom;
    }
    OnUpdate(delta: number): void {
        if (this.backElement != null) {
            (this.backElement as QUI.QUI_BaseElement)._parent = this;
            this.backElement.localRect.setAsFill();
            this.backElement.OnUpdate(delta);
        }
        this.updateContainerPos();
        this.container.OnUpdate(delta);
        if (this.borderElement != null) {
            (this.borderElement as QUI.QUI_BaseElement)._parent = this;
            this.borderElement.localRect.setAsFill();
            this.borderElement.OnUpdate(delta);
        }
        super.OnUpdate(delta);
    }
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {
        if (press == true && move == false) {
            let rectlimit = this.getWorldRect();
            let x1 = rectlimit.X + this._border.XLeft;
            let y1 = rectlimit.Y + this._border.YTop;
            let x2 = rectlimit.X + rectlimit.Width - this._border.XRight;
            let y2 = rectlimit.Y + rectlimit.Height - this._border.YBottom;
            if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {

            }
            else {
                //按下事件在panel限制只外，不往下传了
                return false;
            }
        }

        return this.container.OnTouch(touchid, press, move, x, y);
    }
    protected container: QUI_Container;
    getChildCount(): number {
        return this.container.getChildCount();
    }
    getChild(index: number): QUI.QUI_IElement | null {
        return this.container.getChild(index);
    }
    addChild(elem: QUI.QUI_IElement): void {

        this.container.addChild(elem);
    }
    removeChild(elem: QUI.QUI_IElement): void {
        this.container.removeChild(elem);
    }
    removeChildAll(): void {
        this.container.removeChildAll();
    }
    removeChildBegin(n: number): void {
        this.container.removeChildBegin(n);
    }
    removeChildAt(index: number): void {
        this.container.removeChildAt(index);
    }

}