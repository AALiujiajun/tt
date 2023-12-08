import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
import { QUI_Canvas } from "./qui_canvas.js";

//摇杆控件
export class QUI_JoyStick extends QUI.QUI_BaseElement {
    constructor() {
        super();
        this.localRect.setAsFill();
    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Joystick;
    }
    Clone(): QUI.QUI_IElement {
        let elem = new QUI_JoyStick();
        elem.localRect = this.localRect.Clone();
        elem._parent = null;
        elem.Enable = this.Enable;
        for (var i = 0; i < this.getChildCount(); i++) {
            elem.addChild(this.getChild(i).Clone());
        }

        elem.spriteJoyBack = this.spriteJoyBack;
        elem.spriteJoyHot = this.spriteJoyHot;
        //elem.touchArea = tt.RectangleMath.Clone(this.touchArea);
        elem.touchBackSize = this.touchBackSize.Clone();
        elem.touchHotSize = this.touchHotSize.Clone();
        elem.hotMaxDist = this.hotMaxDist;
        elem.color = this.color.Clone();
        elem.keymode = this.keymode;
        return elem;
    }


    spriteJoyBack: tt.Sprite | null;
    spriteJoyHot: tt.Sprite | null;
    //touchArea: tt.Rectangle = new tt.Rectangle(100, 100, 320, 320);//整体可触碰区域


    touchBackSize: tt.Vector2 = new tt.Vector2(160, 160);//背景图大小
    private _touchBackPoint: tt.Vector2 = new tt.Vector2(100, 100);//背景区中心点

    touchHotSize: tt.Vector2 = new tt.Vector2(160, 160);//热点图尺寸
    hotMaxDist: number = 100;
    private _touchHotPoint: tt.Vector2 = new tt.Vector2(100, 100);//触摸区中心点
    GetTouchDirection(): tt.Vector2 | null {
        if (this._press == false)
            return null;
        else {
            let dec = new tt.Vector2(
                (this._touchHotPoint.X - this._touchBackPoint.X) / this.hotMaxDist,
                (this._touchHotPoint.Y - this._touchBackPoint.Y) / this.hotMaxDist
            )
            return dec;
        }
    }

    color: tt.Color = tt.Color.White;
    private _press: boolean = false;
    private _pressid: number = 0;
    OnRender(_canvas: QUI_Canvas): void {

        let sw = this.getWorldRect();

        //this.Render_impl();
        if (this._press) {
            if (this.spriteJoyBack != null) {
                let touchbackrect = new tt.Rectangle(
                    (this._touchBackPoint.X - this.touchBackSize.X / 2) * _canvas.scale + sw.X * _canvas.scale,
                    (this._touchBackPoint.Y - this.touchBackSize.Y / 2) * _canvas.scale + sw.Y * _canvas.scale,
                    (this.touchBackSize.X) * _canvas.scale,
                    (this.touchBackSize.Y) * _canvas.scale
                );
                this.spriteJoyBack.RenderRect(_canvas.batcherUI, touchbackrect);
            }
            if (this.spriteJoyHot != null) {
                let touchhotrect = new tt.Rectangle(
                    (this._touchHotPoint.X - this.touchHotSize.X / 2) * _canvas.scale + sw.X * _canvas.scale,
                    (this._touchHotPoint.Y - this.touchHotSize.Y / 2) * _canvas.scale + sw.Y * _canvas.scale,
                    (this.touchHotSize.X) * _canvas.scale,
                    (this.touchHotSize.Y) * _canvas.scale
                );
                this.spriteJoyHot.RenderRect(_canvas.batcherUI, touchhotrect);
            }
        }
        super.OnRender(_canvas);
    }
    keymode: boolean = false;//加入键盘控制模式，仅PC版本有效
    OnUpdate(delta: number): void {
        super.OnUpdate(delta);
        this._updateKeyBoardToDir();
    }
    private _updateKeyBoardToDir() {
        let p = false;
        let dir = tt.Vector2.Zero;
        if (tt.input.IsKeyDown("KeyW")) {
            this.keymode = true;
            p = true;
            dir.Y -= 1;
        }
        if (tt.input.IsKeyDown("KeyS")) {
            this.keymode = true;
            p = true;
            dir.Y += 1;
        }
        if (tt.input.IsKeyDown("KeyA")) {
            this.keymode = true;
            p = true;
            dir.X -= 1;
        }
        if (tt.input.IsKeyDown("KeyD")) {
            this.keymode = true;
            p = true;
            dir.X += 1;
        }
        if (this.keymode) {

            if (p) {
                this._press = true;
                let sw = this.getWorldRect();

                this._touchBackPoint = new tt.Vector2(
                    this.touchBackSize.X / 2,
                    sw.Height - this.touchBackSize.Y / 2
                );
                this._touchHotPoint = new tt.Vector2(
                    this._touchBackPoint.X + dir.X * this.hotMaxDist,
                    this._touchBackPoint.Y + dir.Y * this.hotMaxDist);
            }
            else {
                this._press = false;
            }
        }

    }
    CancelTouch() {
        this._press = false;
        this._pressid = -1;
        super.CancelTouch();
    }
    OnTouch(touchid: number, press: boolean, move: boolean, x: number, y: number): boolean {
        let kill = super.OnTouch(touchid, press, move, x, y);
        if (kill) return true;

        this.keymode = false;

        let rect = this.getWorldRect();
        let prect = this._parent.getWorldRect();
        let x2 = rect.X + rect.Width;
        let y2 = rect.Y + rect.Height;

        //初次按下
        if (this._press == false && press == true && move == false) {
            if (x >= rect.X && x < x2 && y >= rect.Y && y < y2) {
                this._press = true;
                this._pressid = touchid;
                let lx = x - prect.X
                let ly = y - prect.Y;
                let lpoint = new tt.Vector2(lx, ly);
                let tx2 = rect.Width - this.touchBackSize.X / 2;
                let ty2 = rect.Height - this.touchBackSize.Y / 2;
                if (lx < this.touchBackSize.X / 2)
                    lx = this.touchBackSize.X / 2;
                if (ly < this.touchBackSize.Y / 2)
                    ly = this.touchBackSize.Y / 2;
                if (lx > tx2)
                    lx = tx2;
                if (ly > ty2)
                    ly = ty2;
                this._touchBackPoint.X = lx;
                this._touchBackPoint.Y = ly;

                let dist = tt.Vector2.Dist(this._touchBackPoint, lpoint);
                if (dist > this.hotMaxDist) {
                    let dir = tt.Vector2.Dir(this._touchBackPoint, lpoint);
                    dir.X *= this.hotMaxDist;
                    dir.Y *= this.hotMaxDist;
                    lpoint = tt.Vector2.Add(this._touchBackPoint, dir);
                }
                this._touchHotPoint.X = lpoint.X;
                this._touchHotPoint.Y = lpoint.Y;

                return true;
            }
        }
        //拖拽
        if (this._press == true && press == true && this._pressid == touchid) {
            let lpoint = new tt.Vector2(x - prect.X, y - prect.Y);

            let dist = tt.Vector2.Dist(this._touchBackPoint, lpoint);
            if (dist > this.hotMaxDist) {
                let dir = tt.Vector2.Dir(this._touchBackPoint, lpoint);
                dir.X *= this.hotMaxDist;
                dir.Y *= this.hotMaxDist;
                lpoint = tt.Vector2.Add(this._touchBackPoint, dir);

            }
            this._touchHotPoint.X = lpoint.X;
            this._touchHotPoint.Y = lpoint.Y;

            return true;
        }
        //弹起
        if (this._press == true && press == false && this._pressid == touchid) {
            this._press = false;
            this._pressid = -1;
            return true;
        }
        return false;
    }
}