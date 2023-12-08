import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
import { QUI_Canvas } from "./qui_canvas.js";

export class QUI_Container extends QUI.QUI_BaseElement {
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Container;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_Container();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }
        return elem;
    }
}
