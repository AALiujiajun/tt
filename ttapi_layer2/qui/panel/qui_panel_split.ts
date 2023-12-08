
import { tt } from "../../../ttapi_interface/ttapi.js";
import * as QUI from "../qui_base.js"
import { QUI_Container } from "../qui_container.js";
import { QUI_DragButton } from "../ext/qui_dragbutton.js";
import { QUI_Canvas } from "../qui_canvas.js";

//切分面板
export class QUI_Panel_Split extends QUI.QUI_BaseElement {
    constructor() {
        super();

        this.localRect.setByRect(new tt.Rectangle(0, 0, 250, 250));
        this._panel1 = new QUI_Container();
        this._panel1._parent = this;
        this._panel1.localRect.setAsFill();

        this._panel2 = new QUI_Container();
        this._panel2._parent = this;
        this._panel2.localRect.setAsFill();

        this._border = new tt.Border(16, 16, 16, 16);

        this._splitButton = new QUI_DragButton();
        this._splitButton._parent = this;
        this._splitButton.localRect.setAsFill();
        this._splitButton.OnDragStart = this._ondragstart.bind(this);
        this._splitButton.OnDrag = this._ondrag.bind(this);
        // this._splitButton.OnDragEnd = this._ondragend.bind(this);

        this.updateContainerPos();
        this.updateSplitBtnPos();
    }
    // _dragx: number;
    // _dragy: number;
    private _dragvalue: number;
    _ondragstart(x: number, y: number): void {
        // this._dragx = x;
        // this._dragy = y;
        this._dragvalue = this.splitPos;
    }
    _ondrag(x: number, y: number, bx: number, by: number): void {
        if (this.splitDir == QUI.QUI_Direction2.Horizontal) {
            let xadd = (x - bx) / this.getWorldRect().Width;
            this.splitPos = this._dragvalue + xadd;
        }
        else {
            let yadd = (y - by) / this.getWorldRect().Height;
            this.splitPos = this._dragvalue + yadd;
        }
        if (this.splitPos < 0.1)
            this.splitPos = 0.1;
        if (this.splitPos > 0.9)
            this.splitPos = 0.9;
        this.updateSplitBtnPos();
    }
    // _ondragend(x: number, y: number): void {
    //     this.updateSplitBtnPos();
    // }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Panel_Split;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_Panel_Split();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.backElement = QUI.QUI_Clone(this.backElement);
        elem.borderElement = QUI.QUI_Clone(this.borderElement);

        elem.splitSize = this.splitSize;
        elem.splitPos = this.splitPos;
        elem.splitDir = this.splitDir;
        return elem;
    }
    backElement: QUI.QUI_IElement;
    borderElement: QUI.QUI_IElement;//面板的边界外观
    protected _border: tt.Border;//面板的边距
    getBorder(): tt.Border {
        return this._border;
    }
    splitSize: number = 16;
    splitPos: number = 0.5;
    splitDir: QUI.QUI_Direction2 = QUI.QUI_Direction2.Horizontal;
    private _splitButton: QUI_DragButton;
    getSplitButton(): QUI_DragButton {
        return this._splitButton;
    }
    OnRender(_canvas: QUI_Canvas): void {
        if (this.backElement != null) {
            this.backElement.OnRender(_canvas);
        }
        //根据边距计算限制区域
        let batcher = _canvas.batcherUI;


        let target = batcher.getTarget();
        batcher.EndDraw();


        {
            target.PushLimitRect(this._panel1.getWorldRectScale(_canvas.scale));

            batcher.BeginDraw(target);
            this._panel1.OnRender(_canvas);
            batcher.EndDraw();

            target.PopLimitRect();
        }
        {
            target.PushLimitRect(this._panel2.getWorldRectScale(_canvas.scale));

            batcher.BeginDraw(target);
            this._panel2.OnRender(_canvas);
            batcher.EndDraw();

            target.PopLimitRect();
        }
        batcher.BeginDraw(target);

        this._splitButton.OnRender(_canvas);

        if (this.borderElement != null)
            this.borderElement.OnRender(_canvas);
    }

    protected updateSplitBtnPos(): void {

        if (this.splitDir == QUI.QUI_Direction2.Horizontal) {

            this._splitButton.localRect.radioX1 = this.splitPos;
            this._splitButton.localRect.radioX2 = this.splitPos;
            this._splitButton.localRect.radioY1 = 0;
            this._splitButton.localRect.radioY2 = 1;
            this._splitButton.localRect.offsetX1 = -this.splitSize * 0.5;
            this._splitButton.localRect.offsetX2 = this.splitSize * 0.5;
            this._splitButton.localRect.offsetY1 = this._border.YTop;
            this._splitButton.localRect.offsetY2 = -this._border.YBottom;
        }
        else {


            this._splitButton.localRect.radioY1 = this.splitPos;
            this._splitButton.localRect.radioY2 = this.splitPos;
            this._splitButton.localRect.radioX1 = 0;
            this._splitButton.localRect.radioX2 = 1;
            this._splitButton.localRect.offsetX1 = this._border.XLeft;
            this._splitButton.localRect.offsetX2 = this._border.XRight;
            this._splitButton.localRect.offsetY1 = -this.splitSize * 0.5;
            this._splitButton.localRect.offsetY2 = this.splitSize * 0.5;
        }
    }
    protected updateContainerPos(): void {

        if (this.splitDir == QUI.QUI_Direction2.Horizontal) {
            this._panel1.localRect.radioX1 = 0;
            this._panel1.localRect.radioY1 = 0;
            this._panel1.localRect.radioX2 = this.splitPos;
            this._panel1.localRect.radioY2 = 1;
            this._panel1.localRect.offsetX1 = this._border.XLeft;
            this._panel1.localRect.offsetX2 = this.splitSize * -0.5;
            this._panel1.localRect.offsetY1 = this._border.YTop;
            this._panel1.localRect.offsetY2 = -this._border.YBottom;

            this._panel2.localRect.radioX1 = this.splitPos;
            this._panel2.localRect.radioY1 = 0;
            this._panel2.localRect.radioX2 = 1;
            this._panel2.localRect.radioY2 = 1;
            this._panel2.localRect.offsetX1 = this.splitSize * 0.5;
            this._panel2.localRect.offsetX2 = -this._border.XRight;
            this._panel2.localRect.offsetY1 = this._border.YTop;
            this._panel2.localRect.offsetY2 = -this._border.YBottom;

        }
        else {
            this._panel1.localRect.radioX1 = 0;
            this._panel1.localRect.radioY1 = 0;
            this._panel1.localRect.radioX2 = 1;
            this._panel1.localRect.radioY2 = this.splitPos;
            this._panel1.localRect.offsetX1 = this._border.XLeft;
            this._panel1.localRect.offsetX2 = -this._border.XRight;
            this._panel1.localRect.offsetY1 = this._border.YTop;
            this._panel1.localRect.offsetY2 = this.splitSize * -0.5;

            this._panel2.localRect.radioX1 = 0;
            this._panel2.localRect.radioY1 = this.splitPos;
            this._panel2.localRect.radioX2 = 1;
            this._panel2.localRect.radioY2 = 1;
            this._panel2.localRect.offsetX1 = this._border.XLeft;
            this._panel2.localRect.offsetX2 = this._border.XRight;
            this._panel2.localRect.offsetY1 = this.splitSize * 0.5;
            this._panel2.localRect.offsetY2 = -this._border.YBottom;

        }
    }
    OnUpdate(delta: number): void {
        if (this.backElement != null) {
            (this.backElement as QUI.QUI_BaseElement)._parent = this;
            this.backElement.localRect.setAsFill();
            this.backElement.OnUpdate(delta);
        }
        this.updateContainerPos();
        this.updateSplitBtnPos();

        this._panel1.OnUpdate(delta);
        this._panel2.OnUpdate(delta);
        this._splitButton.OnUpdate(delta);

        if (this.borderElement != null) {
            (this.borderElement as QUI.QUI_BaseElement)._parent = this;
            this.borderElement.localRect.setAsFill();
            this.borderElement.OnUpdate(delta);
        }

        super.OnUpdate(delta);
    }
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {
        let skippanel1 = false;
        let skippanel2 = false;
        if (press == true && move == false) {
            {
                let rectlimit = this._panel1.getWorldRect();
                let x1 = rectlimit.X;
                let y1 = rectlimit.Y;
                let x2 = rectlimit.X + rectlimit.Width;
                let y2 = rectlimit.Y + rectlimit.Height;
                if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {

                }
                else {
                    //按下事件在panel限制只外，不往下传了
                    skippanel1 = true;
                }
            }
            {
                let rectlimit = this._panel2.getWorldRect();
                let x1 = rectlimit.X;
                let y1 = rectlimit.Y;
                let x2 = rectlimit.X + rectlimit.Width;
                let y2 = rectlimit.Y + rectlimit.Height;
                if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {

                }
                else {
                    //按下事件在panel限制只外，不往下传了
                    skippanel2 = true;
                }
            }
        }

        if (this._splitButton.OnTouch(touchid, press, move, x, y))
            return true;

        var b1 = skippanel1 ? false : this._panel1.OnTouch(touchid, press, move, x, y);
        if (b1) return true;
        var b2 = skippanel2 ? false : this._panel2.OnTouch(touchid, press, move, x, y);
        return b2;
    }
    protected _panel1: QUI_Container;
    protected _panel2: QUI_Container;
    getPanel1(): QUI_Container {
        return this._panel1;
    }
    getPanel2(): QUI_Container {
        return this._panel2;
    }
    getChildCount(): number {
        throw new Error("QUI_Panel_Split,use panel1 or panel2");
    }
    getChild(index: number): QUI.QUI_IElement | null {
        throw new Error("QUI_Panel_Split,use panel1 or panel2");
    }
    addChild(elem: QUI.QUI_IElement): void {
        throw new Error("QUI_Panel_Split,use panel1 or panel2");
    }
    removeChild(elem: QUI.QUI_IElement): void {
        throw new Error("QUI_Panel_Split,use panel1 or panel2");
    }
    removeChildAll(): void {
        throw new Error("QUI_Panel_Split,use panel1 or panel2");
    }


}