import { tt } from "../../../ttapi_interface/ttapi.js";
import * as QUI from "../qui_base.js"


//Over控件只是单纯的吃掉触摸事件，没别的功能
export class QUI_Overlay extends QUI.QUI_BaseElement {
    constructor() {
        super();
        this.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Overlay;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_Overlay();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        return elem;
    }
    OnPress: () => void;

    ids: number[] = []
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {

        let kill = super.OnTouch(touchid, press, move, x, y);
        if (kill) return true;

        //this.OnTouch_Impl();
        let rect = this.getWorldRect();
        let x2 = rect.X + rect.Width;
        let y2 = rect.Y + rect.Height;

        //console.log("touch " + touchid + " press=" + press + " x=" + x + "y=" + y);
        //按下
        if (press == true && move == false) {
            if (x >= rect.X && x < x2 && y >= rect.Y && y < y2) {
                if (this.ids.indexOf(touchid) < 0)
                    this.ids.push(touchid);
                if (this.OnPress != null)
                    this.OnPress();
                return true;
            }
        }
        //拖动
        if (press == true && move == true && this.ids.indexOf(touchid) >= 0) {

            return true;
        }
        if (press == false && this.ids.indexOf(touchid) >= 0) {
            let i = this.ids.indexOf(touchid);
            this.ids.splice(i, 1);
            return true;
        }
        return false;
    }

}