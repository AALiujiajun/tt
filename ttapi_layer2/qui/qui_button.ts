import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
import { QUI_Canvas } from "./qui_canvas.js";


export class QUI_Button extends QUI.QUI_BaseElement {
    constructor() {
        super();
        this.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));
    }
    Clone(): QUI.QUI_IElement {
        let btn = new QUI_Button();
        btn.localRect = this.localRect.Clone();
        btn._parent = null;
        btn.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            btn.addChild(this.getChild(i).Clone());
        }
        btn.ElemNormal = QUI.QUI_Clone(this.ElemNormal);
        btn.ElemPress = QUI.QUI_Clone(this.ElemPress);
        return btn;
    }

    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Button;
    }
    ElemNormal: QUI.QUI_IElement | null = null;
    ElemPress: QUI.QUI_IElement | null = null;
    BindKey: string = null;
    _press: boolean = false;
    _keypress: boolean = false;
    _pressid: number = -1;
    OnClick: (() => void) | null = null;
    OnPressDown: (() => void) | null = null;
    OnPressUp: (() => void) | null = null;
    CancelTouch() {
        this._press = false;
        this._pressid = -1;
        super.CancelTouch();
    }
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {
        let kill = super.OnTouch(touchid, press, move, x, y);
        if (kill) return true;

        //this.OnTouch_Impl();
        let rect = this.getWorldRect();
        let x2 = rect.X + rect.Width;
        let y2 = rect.Y + rect.Height;

        //console.log("touch " + touchid + " press=" + press + " x=" + x + "y=" + y);
        //按下
        if (this._press == false && press == true && move == false) {
            if (x >= rect.X && x < x2 && y >= rect.Y && y < y2) {
                this._press = true;
                this._pressid = touchid;
                if (this.OnPressDown != null)
                    this.OnPressDown();
                return true;
            }
        }
        //拖动
        if (this._press == true && press == true && this._pressid == touchid) {
            return true;
        }
        //释放
        if (this._press == true && press == false && this._pressid == touchid) {
            this._press = false;
            this._pressid = -1;
            if (this.OnPressUp != null)
                this.OnPressUp();
            if (x >= rect.X && x < x2 && y >= rect.Y && y < y2) {
                if (this.OnClick != null) {
                    // if (x >= rect.X && x < x2 && y >= rect.Y && y < y2) {
                    this.OnClick();
                    //return true;
                    //}
                }
                return true;
            }

        }
        return false;
    }
    OnRender(_canvas: QUI_Canvas): void {

       
        //this.Render_impl();
        if (this._press) {
            if (this.ElemPress != null) {
                (this.ElemPress as any)._parent = this;
                this.ElemPress.alpha = this.alpha;
                this.ElemPress.OnRender(_canvas);
            }
        }
        else {
            if (this.ElemNormal != null) {
                (this.ElemNormal as any)._parent = this;
                this.ElemNormal.alpha = this.alpha;
                this.ElemNormal.OnRender(_canvas)
            }
        }


        super.OnRender(_canvas);
    }
    OnUpdate(delta: number): void {
        if (this.BindKey != null) {
            let keydown = tt.input.IsKeyDown(this.BindKey);
            if (this._keypress && !keydown) {
                this._keypress = false;
                this._press = false;
                if (this.OnPressDown != null)
                    this.OnPressUp();
            }
            else if (this._keypress == false && keydown) {
                this._keypress = true;
                this._press = true;
                if (this.OnPressDown != null)
                    this.OnPressDown();
            }
        }
        if (this._press) {
            if (this.ElemPress != null) {
                this.ElemPress.OnUpdate(delta)
            }
        }
        else {
            if (this.ElemNormal != null) {
                this.ElemNormal.OnUpdate(delta)
            }
        }

        super.OnUpdate(delta);
    }
}