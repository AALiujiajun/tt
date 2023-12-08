import { tt } from "../../../ttapi_interface/ttapi.js";
import * as QUI from "../qui_base.js"
import { QUI_Canvas } from "../qui_canvas.js";

//切换控件 ，两个形态，value = true or false
export class QUI_Toggle extends QUI.QUI_BaseElement {
    constructor() {
        super();
        this.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Toggle;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_Toggle();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.ElemTrue = QUI.QUI_Clone(this.ElemTrue);
        elem.ElemTrueDown = QUI.QUI_Clone(this.ElemTrueDown);
        elem.ElemFalse = QUI.QUI_Clone(this.ElemFalse);
        elem.ElemFalseDown = QUI.QUI_Clone(this.ElemFalseDown);
        elem.value = this.value;
        return elem;
    }
    ElemTrue: QUI.QUI_IElement | null = null;
    ElemTrueDown: QUI.QUI_IElement | null = null;
    ElemFalse: QUI.QUI_IElement | null = null;
    ElemFalseDown: QUI.QUI_IElement | null = null;
    value: boolean = false;
    private press: boolean = false;
    private pressid: number = -1;

    OnChange: ((v: boolean) => void) | null = null;
    private _dbcount = 0;
    OnDbClick: (() => void) | null = null;
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


                return true;
            }
        }
        //拖动
        if (this.press == true && press == true && move == true && this.pressid == touchid) {

            return true;
        }
        //释放
        if (this.press == true && press == false && this.pressid == touchid) {
            this.press = false;
            this.pressid = -1;

            if (this._dbcount <= 0)
                this._dbcount = 20;
            else {
                if (this.OnDbClick != null) {
                    this.OnDbClick();
                }
                this._dbcount = 0;
            }
            //值取反与触发事件
            this.value = !this.value;
            if (this.OnChange != null)
                this.OnChange(this.value);


            return true;
        }
        return false;
    }
    OnRender(_canvas: QUI_Canvas): void {


        //this.Render_impl();
        if (this.press) {
            if (this.value) {
                if (this.ElemTrueDown != null) {
                    (this.ElemTrueDown as any)._parent = this;
                    this.ElemTrueDown.OnRender(_canvas);
                }
            }
            else {
                if (this.ElemFalseDown != null) {
                    (this.ElemFalseDown as any)._parent = this;
                    this.ElemFalseDown.OnRender(_canvas);
                }
            }
        }
        else {
            if (this.value) {
                if (this.ElemTrue != null) {
                    (this.ElemTrue as any)._parent = this;
                    this.ElemTrue.OnRender(_canvas)
                }
            }
            else {
                if (this.ElemFalse != null) {
                    (this.ElemFalse as any)._parent = this;
                    this.ElemFalse.OnRender(_canvas);
                }
            }
        }
        super.OnRender(_canvas);
    }
    OnUpdate(delta: number): void {
        if (this._dbcount > 0) {
            this._dbcount--;
        }
        if (this.press) {
            if (this.value) {
                if (this.ElemTrueDown != null) {
                    (this.ElemTrueDown as any)._parent = this;
                    this.ElemTrueDown.localRect.setAsFill();
                    this.ElemTrueDown.OnUpdate(delta);
                }
            }
            else {
                if (this.ElemFalseDown != null) {
                    (this.ElemFalseDown as any)._parent = this;
                    this.ElemFalseDown.localRect.setAsFill();
                    this.ElemFalseDown.OnUpdate(delta);
                }
            }
        }
        else {
            if (this.value) {
                if (this.ElemTrue != null) {
                    (this.ElemTrue as any)._parent = this;
                    this.ElemTrue.localRect.setAsFill();
                    this.ElemTrue.OnUpdate(delta);
                }
            }
            else {
                if (this.ElemFalse != null) {
                    (this.ElemFalse as any)._parent = this;
                    this.ElemFalse.localRect.setAsFill();
                    this.ElemFalse.OnUpdate(delta);
                }
            }
        }
        super.OnUpdate(delta);
    }
}