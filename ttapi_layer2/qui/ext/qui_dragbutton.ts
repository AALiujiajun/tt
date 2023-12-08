import { tt } from "../../../ttapi_interface/ttapi.js";
import * as QUI from "../qui_base.js"
import { QUI_Canvas } from "../qui_canvas.js";


export class QUI_DragButton extends QUI.QUI_BaseElement {
    constructor() {
        super();
        this.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_DragButton;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_DragButton();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.ElemNormal = QUI.QUI_Clone(this.ElemNormal);
        elem.ElemPress = QUI.QUI_Clone(this.ElemPress);

        return elem;
    }
    ElemNormal: QUI.QUI_IElement | null = null;
    ElemPress: QUI.QUI_IElement | null = null;
    private press: boolean = false;
    private pressid: number = -1;
    private dragX: number;
    private dragY: number;
    private dragOX: number;
    private dragOY: number;
    OnDragStart: ((x: number, y: number) => void) | null = null;
    OnDrag: ((x: number, y: number, beginx: number, beginy: number) => void) | null = null;
    OnDragEnd: ((x: number, y: number) => void) | null = null;
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {

        let kill = super.OnTouch(touchid, press, move, x, y);
        if (kill) return true;

        //this.OnTouch_Impl();
        let rect = this.getWorldRect();
        let x1 = rect.X;
        let y1 = rect.Y;
        let x2 = rect.X + rect.Width;
        let y2 = rect.Y + rect.Height;

        //自动转换到绝对定位
        // let prect = this.getParent().getWorldRect();
        // rect.X -= prect.X;
        // rect.Y -= prect.Y;
        // this.localRect.setByRect(rect);

        //console.log("touch " + touchid + " press=" + press + " x=" + x + "y=" + y);
        //按下
        if (this.press == false && press == true && move == false) {
            if (x >= x1 && x < x2 && y >= y1 && y < y2) {
                this.press = true;
                this.pressid = touchid;

                this.dragX = x;
                this.dragY = y;
                this.dragOX = this.localRect.offsetX1;
                this.dragOY = this.localRect.offsetY1;
                if (this.OnDragStart != null)
                    this.OnDragStart(x, y);
                return true;
            }
        }
        //拖动
        if (this.press == true && press == true && this.pressid == touchid) {

            // var xadd = x - this.dragX;
            // var yadd = y - this.dragY;
            // this.localRect.offsetX1 = this.dragOX + xadd;
            // this.localRect.offsetY1 = this.dragOY + yadd;
            // this.localRect.offsetX2 = this.localRect.offsetX1 + rect.Width;
            // this.localRect.offsetY2 = this.localRect.offsetY1 + rect.Height;
            if (this.OnDrag != null)
                this.OnDrag(x, y, this.dragX, this.dragY);
            return true;
        }
        //释放
        if (this.press == true && press == false && this.pressid == touchid) {
            this.press = false;
            this.pressid = -1;
            if (this.OnDragEnd != null)
                this.OnDragEnd(x, y);
            // if (x >= x1 && x < x2 && y >= y1 && y < y2) {
            //     // if (this.OnClick != null) {
            //     //     // if (x >= rect.X && x < x2 && y >= rect.Y && y < y2) {
            //     //     this.OnClick();
            //     //     //return true;
            //     //     //}
            //     // }


            // }
            return true;
        }
        return false;
    }
    OnRender(_canvas: QUI_Canvas): void {


        //this.Render_impl();
        if (this.press) {
            if (this.ElemPress != null) {
                (this.ElemPress as any)._parent = this;
                this.ElemPress.OnRender(_canvas);
            }
        }
        else {
            if (this.ElemNormal != null) {
                (this.ElemNormal as any)._parent = this;
                this.ElemNormal.OnRender(_canvas)
            }
        }

        super.OnRender(_canvas);
    }
    OnUpdate(delta: number): void {
        // //自动转换到绝对定位
        // let rect = this.getWorldRect();
        // let prect = this.getParent().getWorldRect();
        // rect.X -= prect.X;
        // rect.Y -= prect.Y;
        // this.localRect.setByRect(rect);


        if (this.press) {
            if (this.ElemPress != null) {
                this.ElemPress.OnUpdate(delta)
            }
        }
        else {
            if (this.ElemNormal != null) {
                this.ElemNormal.OnUpdate(delta)
            }
        }

    }
}