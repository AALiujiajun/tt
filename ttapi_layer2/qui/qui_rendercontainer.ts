import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
import { QUI_Canvas } from "./qui_canvas.js";

export class QUI_RenderContainer extends QUI.QUI_BaseElement {
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_RenderContainer;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_RenderContainer();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }
        return elem;
    }
    OnCustomUpdate: ((delta: number) => void) | null = null;
    OnCustomRender: (() => void) | null = null;
    OnCustomTouch: ((touchid: number, press: boolean, move: boolean, x: number, y: number) => boolean) | null = null;

    OnRender(_canvas: QUI_Canvas): void {

        if (this.OnCustomRender != null) {

            let target = _canvas.batcherUI.getTarget();
            _canvas.batcherUI.EndDraw();

            this.OnCustomRender();

            _canvas.batcherUI.BeginDraw(target);
        }
        super.OnRender(_canvas);
    }
    OnUpdate(delta: number): void {
        if (this.OnCustomUpdate != null) {
            this.OnCustomUpdate(delta);
        }
        super.OnUpdate(delta);
    }
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {
        let kill = super.OnTouch(touchid, press, move, x, y);
        if (kill)
            return true;

        if (this.OnCustomTouch != null) {
            return this.OnCustomTouch(touchid, press, move, x, y);
        }
        return false;

    }
}
