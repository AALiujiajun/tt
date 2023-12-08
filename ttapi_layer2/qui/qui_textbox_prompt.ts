import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
import { QUI_Canvas } from "./qui_canvas.js";

export class QUI_TextBox_Prompt extends QUI.QUI_BaseElement {

    constructor(font: tt.Font | null = null, txt: string = "") {
        super();
        this.font = font;
        this.text = txt;
        this.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_TextBox_Prompt;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_TextBox_Prompt();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.font = this.font;
        elem.text = this.text;
        elem.maxlen = this.maxlen;
        elem.color = this.color.Clone();
        elem.fontScale = this.fontScale.Clone();
        elem.cut = this.cut;
        elem.halign = this.halign;
        elem.valign = this.valign;
        elem.border = this.border.Clone();
        return elem;
    }
    font: tt.Font | null;
    text: string;
    maxlen: number = 10;
    color: tt.Color = tt.Color.White;
    //是否裁剪
    fontScale: tt.Vector2 = new tt.Vector2(1.0, 1.0);
    cut: boolean = false;
    halign: QUI.QUI_HAlign = QUI.QUI_HAlign.Middle;
    valign: QUI.QUI_VAlign = QUI.QUI_VAlign.Middle;
    border: QUI.QUI_IElement;
    private _pos: tt.Vector2 = new tt.Vector2(0, 0);
    OnRender(_canvas: QUI_Canvas): void {

        if (this.border != null) {
            this.border.localRect.setAsFill();
            (this.border as QUI.QUI_BaseElement)._parent = this;
        }
        //this.Render_impl();
        if (this.font != null) {
            let sw = this.getWorldRectScale(_canvas.scale);


            let fontheight = this.font.GetFontSize() * this.fontScale.Y * _canvas.scale;
            let fontwidth = this.font.SureText(this.text, this.fontScale.X * _canvas.scale);
            if (this.halign == QUI.QUI_HAlign.Left) {
                this._pos.X = sw.X;
            }
            else if (this.halign == QUI.QUI_HAlign.Middle) {
                this._pos.X = sw.X + (sw.Width - fontwidth) / 2;
            }
            else if (this.halign == QUI.QUI_HAlign.Right) {
                this._pos.X = sw.X + (sw.Width - fontwidth);
            }

            if (this.valign == QUI.QUI_VAlign.Top) {
                this._pos.Y = sw.Y;
            }
            else if (this.valign == QUI.QUI_VAlign.Middle) {
                this._pos.Y = sw.Y + (sw.Height - fontheight) / 2;
            }
            else if (this.valign == QUI.QUI_VAlign.Bottom) {
                this._pos.Y = sw.Y + (sw.Height - fontheight);
            }
            let _outs = new tt.Vector2(this.fontScale.X * _canvas.scale, this.fontScale.Y * _canvas.scale);
            if (this.cut) {
                this.font.RenderTextWithLimit(_canvas.batcherUI, this.text, this._pos, _outs, this.color, sw);
            }
            else {
                this.font.RenderText(_canvas.batcherUI, this.text, this._pos, _outs, this.color);
            }

        }

        this.border.OnRender(_canvas);

        super.OnRender(_canvas);
    }
    _press: boolean = false;
    _pressid: number = -1;
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
                this.Prompt();
                this._press = true;
                this._pressid = touchid;
                return true;
            }
        }
        if (this._press == true && press == false && this._pressid == touchid) {
            this._press = false;
            this._pressid = -1;
            return true;
        }
        return false;
    }
    async Prompt() {
        let t = await tt.input.Prompt(this.text, this.maxlen);
        if (t.length > this.maxlen)
            t = t.substring(0, this.maxlen);
        this.text = t;
    }
}