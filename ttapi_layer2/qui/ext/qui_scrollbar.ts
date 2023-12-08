import { tt } from "../../../ttapi_interface/ttapi.js";
import * as QUI from "../qui_base.js"
import { QUI_Canvas } from "../qui_canvas.js";

//ScrollBar 用来表示滚动区域


export class QUI_ScrollBar extends QUI.QUI_BaseElement {
    constructor() {
        super();

        this.localRect.setByRect(new tt.Rectangle(0, 0, 16, 250));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_ScrollBar;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_ScrollBar();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.spriteBackground = QUI.QUI_Clone(this.spriteBackground);
        elem.spriteValue = QUI.QUI_Clone(this.spriteValue);
        elem.dir = this.dir;
        elem.size = this.size;
        elem.min = this.min;
        elem.max = this.max;
        elem.value = this.value;
        return elem;
    }
    dir: QUI.QUI_Direction2 = QUI.QUI_Direction2.Vertical;
    spriteBackground: QUI.QUI_IElement; //背景控件
    spriteValue: QUI.QUI_IElement; //前控件
    size: number = 10;
    min: number = 1;
    max: number = 100;
    value: number = 50;
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
            let v1 = this.value / (this.max - this.min + this.size);
            if (v1 < 0) v1 = 0;
            if (v1 > 1) v1 = 1;
            let v2 = (this.value + this.size) / (this.max - this.min + this.size);
            if (v2 < 0) v2 = 0;
            if (v2 > 1) v2 = 1;
            if (this.dir == QUI.QUI_Direction2.Horizontal) {
                this.spriteValue.localRect.radioX1 = v1;
                this.spriteValue.localRect.radioX2 = v2;
            }
            else {
                this.spriteValue.localRect.radioY1 = v1;
                this.spriteValue.localRect.radioY2 = v2;
            }
            this.spriteValue.OnUpdate(delta)
        }
        super.OnUpdate(delta);
    }

}