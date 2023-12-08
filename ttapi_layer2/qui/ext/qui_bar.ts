import { tt } from "../../../ttapi_interface/ttapi.js";
import * as QUI from "../qui_base.js"
import { QUI_Canvas } from "../qui_canvas.js";

//Bar 是一种功能很丰富的组件
//主要用来表示进度
export enum QUI_BarScrollMode {
    DoNotScroll,
    ScrollByTouchDrag,
    ScrollByTouchDrag_LoopValue,
}
export class QUI_Bar extends QUI.QUI_BaseElement {
    constructor() {
        super();

        this.localRect.setByRect(new tt.Rectangle(0, 0, 250, 50));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Bar;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_Bar();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.spriteBackground = QUI.QUI_Clone(this.spriteBackground);
        elem.spriteValue = QUI.QUI_Clone(this.spriteValue);
        elem.dir = this.dir;
        elem.scroll = this.scroll
        return elem;
    }
    spriteBackground: QUI.QUI_IElement; //背景控件
    spriteValue: QUI.QUI_IElement; //前控件，自动改成填充定位，改右值或者底值;
    dir: QUI.QUI_Direction = QUI.QUI_Direction.LeftToRight;//方向，
    scroll: QUI_BarScrollMode = QUI_BarScrollMode.DoNotScroll;
    private _value: number = 0.5;
    OnChange: (v: number) => void;
    getValue(): number {
        return this._value;
    }
    setValue(v: number) {
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        this._value = v;
    }
    OnRender(_canvas: QUI_Canvas): void {


        if (this.spriteBackground != null) {

            this.spriteBackground.OnRender(_canvas);
        }

        if (this.spriteValue != null) {

            this.spriteValue.OnRender(_canvas)
        }

        super.OnRender(_canvas);
    }
    OnUpdate(delta: number): void {


        if (this.spriteBackground != null) {
            (this.spriteBackground as any)._parent = this;
            this.spriteBackground.localRect.setAsFill();
            this.spriteBackground.OnUpdate(delta)
        }

        if (this.spriteValue != null) {
            (this.spriteValue as any)._parent = this;
            this.spriteValue.localRect.setAsFill();
            if (this.dir == QUI.QUI_Direction.LeftToRight) {
                this.spriteValue.localRect.radioX2 = this._value;
            }
            else if (this.dir == QUI.QUI_Direction.RightToLeft) {
                this.spriteValue.localRect.radioX1 = 1.0 - this._value;
            }
            else if (this.dir == QUI.QUI_Direction.UpToDown) {
                this.spriteValue.localRect.radioY2 = this._value;
            }
            else if (this.dir == QUI.QUI_Direction.DownToUp) {
                this.spriteValue.localRect.radioY1 = 1.0 - this._value;
            }
            this.spriteValue.OnUpdate(delta)
        }


        super.OnUpdate(delta);
    }
    private press: boolean = false;
    private pressid: number = -1;
    private dragX: number;
    private dragY: number;
    private dragV: number;
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {
        if (this.scroll == QUI_BarScrollMode.DoNotScroll) {
            press = false;
            return false;
        }
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

                this.dragV = this._value;
                return true;
            }
        }
        //拖动
        if (this.press == true && press == true && this.pressid == touchid) {
            let vchange = 0;
            if (this.dir == QUI.QUI_Direction.LeftToRight) {
                vchange = (x - this.dragX) / rect.Width;
            }
            else if (this.dir == QUI.QUI_Direction.RightToLeft) {
                vchange = (this.dragX - x) / rect.Width;
            }
            else if (this.dir == QUI.QUI_Direction.UpToDown) {
                vchange = (y - this.dragY) / rect.Height;
            }
            else if (this.dir == QUI.QUI_Direction.DownToUp) {
                vchange = (this.dragY - y) / rect.Height;
            }

            this._value = this.dragV + vchange;
            if (this.scroll == QUI_BarScrollMode.ScrollByTouchDrag) {
                if (this._value < 0)
                    this._value = 0;
                if (this._value > 1)
                    this._value = 1;
            }
            else if (this.scroll == QUI_BarScrollMode.ScrollByTouchDrag_LoopValue) {
                while (this._value < 0)
                    this._value += 1;
                while (this._value > 1)
                    this._value -= 1;
            }
            if (this.OnChange != null)
                this.OnChange(this._value);
            return true;
        }
        //释放
        if (this.press == true && press == false && this.pressid == touchid) {
            this.press = false;
            this.pressid = -1;

            return true;
        }
        return false;
    }
}