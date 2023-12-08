import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
import { QUI_Canvas } from "./qui_canvas.js";

export class QUI_Label extends QUI.QUI_BaseElement {

    constructor(font: tt.Font | null = null, txt: string = "") {
        super();
        this.font = font;
        this.text = txt;
        this.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Label;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_Label();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.font = this.font;
        elem.text = this.text;
        elem.color = this.color.Clone();
        elem.fontScale = this.fontScale.Clone();
        elem.cut = this.cut;
        elem.halign = this.halign;
        elem.valign = this.valign;
        return elem;
    }
    font: tt.Font | null;
    text: string;
    color: tt.Color = tt.Color.White;
    //是否裁剪
    fontScale: tt.Vector2 = new tt.Vector2(1.0, 1.0);
    cut: boolean = false;
    halign: QUI.QUI_HAlign = QUI.QUI_HAlign.Middle;
    valign: QUI.QUI_VAlign = QUI.QUI_VAlign.Middle;
    private _pos: tt.Vector2 = new tt.Vector2(0, 0);
    OnRender(_canvas: QUI_Canvas): void {

        this.color.A = this.alpha;
        //this.Render_impl();
        if (this.font != null) {
            let sw = this.getWorldRectScale(_canvas.scale);

            let fontheight = this.font.GetFontSize() * this.fontScale.Y * _canvas.scale;
            let fontwidth = this.font.SureText(this.text, this.fontScale.X * _canvas.scale);
            if (this.halign == QUI.QUI_HAlign.Left) {
                this._pos.X = sw.X;
            }
            else if (this.halign == QUI.QUI_HAlign.Middle) {
                this._pos.X = (sw.X + (sw.Width - fontwidth) / 2);
            }
            else if (this.halign == QUI.QUI_HAlign.Right) {
                this._pos.X = (sw.X + (sw.Width - fontwidth));
            }

            if (this.valign == QUI.QUI_VAlign.Top) {
                this._pos.Y = sw.Y;
            }
            else if (this.valign == QUI.QUI_VAlign.Middle) {
                this._pos.Y = (sw.Y + (sw.Height - fontheight) / 2);
            }
            else if (this.valign == QUI.QUI_VAlign.Bottom) {
                this._pos.Y = (sw.Y + (sw.Height - fontheight));
            }


            let _outs = new tt.Vector2(this.fontScale.X * _canvas.scale, this.fontScale.Y * _canvas.scale);
            if (this.cut) {
                this.font.RenderTextWithLimit(_canvas.batcherUI, this.text, this._pos, _outs, this.color, sw);
            }
            else {
                this.font.RenderText(_canvas.batcherUI, this.text, this._pos, _outs, this.color);
            }

        }
        super.OnRender(_canvas);
    }

}