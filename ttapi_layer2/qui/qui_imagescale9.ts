import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
import { QUI_Canvas } from "./qui_canvas.js";
import * as QUIS9 from "./qui_scale9.js"


export class QUI_ImageScale9 extends QUI.QUI_BaseElement {
    constructor(scale9: QUIS9.QUI_Scale9 = null) {
        super();
        this.scale9 = scale9;
        if (scale9 != null)
            this.localRect.setByRect(new tt.Rectangle(0, 0, scale9.getMinWidth(), scale9.getMinHeight()));
        else
            this.localRect.setByRect(new tt.Rectangle(0, 0, 128, 128));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Image_Scale9;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_ImageScale9();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.scale9 = this.scale9;
        elem.color = this.color.Clone();
        return elem;
    }
    scale9: QUIS9.QUI_Scale9 | null;
    color: tt.Color = tt.Color.White;

    OnRender(_canvas: QUI_Canvas): void {


        //this.Render_impl();
        if (this.scale9 != null) {
            this.scale9.RenderRect(_canvas.batcherUI, this.getWorldRectScale(_canvas.scale), this.color, -1, _canvas.scale);
        }
        super.OnRender(_canvas);
    }

}