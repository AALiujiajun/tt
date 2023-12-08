
import { tt } from "../ttapi_interface/ttapi.js";

export namespace tt_impl {
    export class Input implements tt.IInput {
        constructor(canvas: HTMLCanvasElement) {

            this.Start(canvas);

            // wx.onKeyboardConfirm((x) => {
            //     this.onkeycomfirm(x.value);
            // });
        }
        _mousepress: boolean = false;
        Start(canvas: HTMLCanvasElement): void {

            window.addEventListener("keydown", (r) => {
                this.UpdateKey(r.code, true);
            });
            window.addEventListener("keyup", (r) => {
                this.UpdateKey(r.code, false);
            });
            canvas.addEventListener("mousedown", (r) => {
                if (r.button == 0) {

                    this.UpdateMouse(r, true, false);
                    this._mousepress = true;
                }
            });
            canvas.addEventListener("mouseup", (r) => {
                if (r.button == 0) {
                    this.UpdateMouse(r, false, false);
                    this._mousepress = false;
                }
            });
            canvas.addEventListener("mousemove", (r) => {
                if (r.button == 0 && this._mousepress) {

                    this.UpdateMouse(r, true, true);
                }
            });
            canvas.addEventListener("touchstart", (r) => {
                for (var i = 0; i < r.changedTouches.length; i++) {
                    this.UpdatePoint(r.changedTouches[i], true, false);
                }
            })
            canvas.addEventListener("touchmove", (r) => {
                for (var i = 0; i < r.changedTouches.length; i++) {
                    this.UpdatePoint(r.changedTouches[i], true, true);
                }
            })
            canvas.addEventListener("touchend", (r) => {
                for (var i = 0; i < r.changedTouches.length; i++) {
                    this.UpdatePoint(r.changedTouches[i], false, false);
                }
            })
            canvas.addEventListener("touchcancel", (r) => {
                for (var i = 0; i < r.changedTouches.length; i++) {
                    this.UpdatePoint(r.changedTouches[i], false, false);
                }
            })
        }
        private UpdateMouse(m: MouseEvent, press: boolean, move: boolean): void {
            while (this.points.length <= 0) {
                let p = new tt.InputPoint();
                p.id = this.points.length;
                p.press = false;
                p.x = 0;
                p.y = 0;
                this.points.push(p);
            }
            this.points[0].id = 0;
            this.points[0].press = press;
            this.points[0].x = m.x;
            this.points[0].y = m.y
            if (this.OnPoint != null)
                this.OnPoint(0, m.x, m.y, press, move);
        }
        private UpdatePoint(t: Touch, press: boolean, move: boolean): void {
            let touchid = t.identifier + 1;
            while (this.points.length <= touchid) {
                let p = new tt.InputPoint();
                p.id = this.points.length;
                p.press = false;
                p.x = 0;
                p.y = 0;
                this.points.push(p);
            }
            this.points[touchid].press = press;
            this.points[touchid].x = t.clientX;
            this.points[touchid].y = t.clientY;
            if (this.OnPoint != null)
                this.OnPoint(touchid, t.clientX, t.clientY, press, move);
        }
        private UpdateKey(keycode: string, press: boolean) {
            if (press) {
                if (this._pressKeys.indexOf(keycode) >= 0)
                    return;
                else
                    this._pressKeys.push(keycode);
            }
            else {
                let i = this._pressKeys.indexOf(keycode);
                if (i >= 0) {
                    this._pressKeys.splice(i, 1);
                }
            }
            console.log("Input Key:" + keycode + "=" + press);
            if (this.OnKey != null)
                this.OnKey(keycode, press);
        }
        _pressKeys: string[] = []
        GetPressKeys(): string[] {
            return this._pressKeys;
        }
        IsKeyDown(keycode: string): boolean {
            return this._pressKeys.indexOf(keycode) >= 0;
        }
        OnKey: null | ((keycode: string, press: boolean) => void);


        points: tt.InputPoint[] = [];
        GetInputPoints(): tt.InputPoint[] {
            return this.points;
        }
        OnPoint: null | ((id: number, x: number, y: number, press: boolean, move: boolean) => void);

        onkeycomfirm: (txt: string) => void;
        ishow: boolean = false;
        async Prompt(deftxt: string = "", maxlen: number = 256): Promise<string> {
            //releaseinput
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].press = false;
            }
            return window.prompt("", deftxt);
        }
    }
}