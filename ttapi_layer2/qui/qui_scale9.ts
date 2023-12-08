import { tt } from "../../ttapi_interface/ttapi.js";
import * as QUI from "./qui_base.js"
//9宫格,通常用于实现边角缩放的UI背景之类的功能
export class QUI_Scale9 {
    ////
    //uv scale9 图片的整体uv
    //border 从uv 四边缩进多少，作为切九宫的位置
    //minwidth 最小尺寸，如果给0，自动计算
    //minheight 最小尺寸，如果给0，自动计算
    //如果小于最小尺寸，无法正确渲染
    constructor(sprite: tt.Sprite, border: tt.Border, minwidth: number = 0, minheight: number = 0) {

        this.sprite = sprite;
        this.l = border.XLeft;
        this.r = border.XRight;
        this.t = border.YTop;
        this.b = border.YBottom;

        this._texwidth = sprite.tex.getWidth();
        this._texheight = sprite.tex.getHeight();
        let uv = sprite.uv;

        this.u0 = uv.U1;//left
        this.u3 = uv.U2;//right
        this.u1 = this.u0 + border.XLeft / this._texwidth;
        this.u2 = this.u3 - border.XRight / this._texwidth;
        if (this.u0 <= this.u1 && this.u1 < this.u2 && this.u2 <= this.u3) {
            //check u right
        }
        else {
            throw new Error("U尺寸不对，无法形成九宫");
        }
        this.v0 = uv.V1;
        this.v3 = uv.V2;
        this.v1 = this.v0 + border.YTop / this._texheight;
        this.v2 = this.v3 - border.YBottom / this._texheight;
        if (this.v0 <= this.v1 && this.v1 < this.v2 && this.v2 <= this.v3) {
            //check v right
        }
        else {
            throw new Error("U尺寸不对，无法形成九宫");
        }
        if (minwidth == 0)
            minwidth = this.u3 - this.u0;
        if (minheight == 0)
            minheight = this.v3 - this.v0;
        this._minwidth = minwidth;
        this._minheight = minheight;

    }
    getElementType(): QUI.QUI_ElementType {
        return QUI.QUI_ElementType.Element_Image_Scale9;
    }
    sprite: tt.Sprite;
    l: number; t: number; r: number; b: number; //边距
    u0: number; u1: number; u2: number; u3: number; //分线uv
    v0: number; v1: number; v2: number; v3: number;
    private _minwidth: number;
    private _minheight: number;
    private _texwidth: number;
    private _texheight: number;
    getMinWidth(): number {
        return this._minwidth;
    }
    getMinHeight(): number {
        return this._minheight;
    }

    private _Render1RectWithLimit(u1: number, u2: number, v1: number, v2: number, batcher: tt.IBatcher, rect: tt.Rectangle, limitRect: tt.Rectangle, color: tt.Color | null = null, palindex: number = -1): void {
        let rectbuf = tt.Sprite._rectbuf
        while (rectbuf.length < 4) {
            rectbuf.push(new tt.DrawPoint());
        }
        if (tt.Sprite._colorbuf == null) {
            tt.Sprite._colorbuf = tt.Color.White;
        }
        let _color = color == null ? tt.Sprite._colorbuf : color;

        let palu = 0;
        let palv = 0;
        if (palindex >= 0) {
            palu = this.sprite.paluvs[palindex].X;
            palv = this.sprite.paluvs[palindex].Y;
        }

        let x1 = rect.X
        let x2 = rect.X + rect.Width
        let y1 = rect.Y
        let y2 = rect.Y + rect.Height

        let wx = x2 - x1;
        let wy = y2 - y1;
        //检查是否整体抹去
        if (x1 >= limitRect.X + limitRect.Width || x2 < limitRect.X
            ||
            y1 >= limitRect.Y + limitRect.Height || y2 < limitRect.Y) {
            x1 = x2 = y1 = y2 = 0;
        }
        else if (wx != 0 && wy != 0) {
            let nx1 = x1;
            let nx2 = x2;
            let ny1 = y1;
            let ny2 = y2;
            let change = false;
            if (x1 < limitRect.X) {
                nx1 = limitRect.X;
                change = true;
            }
            if (x2 > limitRect.X + limitRect.Width) {
                nx2 = limitRect.X + limitRect.Width;
                change = true;
            }
            if (y1 < limitRect.Y) {
                ny1 = limitRect.Y;
                change = true;
            }
            if (y2 > limitRect.Y + limitRect.Height) {
                ny2 = limitRect.Y + limitRect.Height;
                change = true;
            }
            if (change) {
                let uw = u2 - u1;
                let vw = v2 - v1;
                let sx1 = (nx1 - x1) / wx;
                let sx2 = (nx2 - x2) / wx;
                let sy1 = (ny1 - y1) / wy;
                let sy2 = (ny2 - y2) / wy;

                u1 = u1 + uw * sx1;
                v1 = v1 + vw * sy1;
                u2 = u2 + uw * sx2;
                v2 = v2 + vw * sy2;
                x1 = nx1;
                y1 = ny1;
                x2 = nx2;
                y2 = ny2;


            }
        }

        rectbuf[0].x = x1;
        rectbuf[0].y = y1;
        rectbuf[0].u = u1;
        rectbuf[0].v = v1;
        rectbuf[0].r = _color.R;
        rectbuf[0].g = _color.G;
        rectbuf[0].b = _color.B;
        rectbuf[0].a = _color.A;
        rectbuf[0].palx = palu;
        rectbuf[0].paly = palv;
        rectbuf[0].eff = this.sprite.effect

        rectbuf[1].x = x2;
        rectbuf[1].y = y1;
        rectbuf[1].u = u2;
        rectbuf[1].v = v1;
        rectbuf[1].r = _color.R
        rectbuf[1].g = _color.G
        rectbuf[1].b = _color.B
        rectbuf[1].a = _color.A
        rectbuf[1].palx = palu;
        rectbuf[1].paly = palv;
        rectbuf[1].eff = this.sprite.effect;

        rectbuf[2].x = x1;
        rectbuf[2].y = y2;
        rectbuf[2].u = u1;
        rectbuf[2].v = v2;
        rectbuf[2].r = _color.R
        rectbuf[2].g = _color.G
        rectbuf[2].b = _color.B
        rectbuf[2].a = _color.A
        rectbuf[2].palx = palu;
        rectbuf[2].paly = palv;
        rectbuf[2].eff = this.sprite.effect;

        rectbuf[3].x = x2;
        rectbuf[3].y = y2;
        rectbuf[3].u = u2;
        rectbuf[3].v = v2;
        rectbuf[3].r = _color.R
        rectbuf[3].g = _color.G
        rectbuf[3].b = _color.B
        rectbuf[3].a = _color.A
        rectbuf[3].palx = palu;
        rectbuf[3].paly = palv;
        rectbuf[3].eff = this.sprite.effect;
        batcher.DrawQuads(this.sprite.tex, null, this.sprite.texpal, rectbuf, 1);
    }
    private _Render1Rect(u1: number, u2: number, v1: number, v2: number, batcher: tt.IBatcher, rect: tt.Rectangle, color: tt.Color | null = null, palindex: number = -1) {
        if (u1 == u2 || v1 == v2)
            return;
        let rectbuf = tt.Sprite._rectbuf
        while (rectbuf.length < 4) {
            rectbuf.push(new tt.DrawPoint());
        }
        if (tt.Sprite._colorbuf == null) {
            tt.Sprite._colorbuf = tt.Color.White;
        }
        let _color = color == null ? tt.Sprite._colorbuf : color;

        let palu = 0;
        let palv = 0;
        if (palindex >= 0) {
            palu = this.sprite.paluvs[palindex].X;
            palv = this.sprite.paluvs[palindex].Y;
        }

        rectbuf[0].x = rect.X;
        rectbuf[0].y = rect.Y;
        rectbuf[0].u = u1;
        rectbuf[0].v = v1;
        rectbuf[0].r = _color.R;
        rectbuf[0].g = _color.G;
        rectbuf[0].b = _color.B;
        rectbuf[0].a = _color.A;
        rectbuf[0].palx = palu;
        rectbuf[0].paly = palv;
        rectbuf[0].eff = this.sprite.effect

        rectbuf[1].x = rect.X + rect.Width;
        rectbuf[1].y = rect.Y;
        rectbuf[1].u = u2;
        rectbuf[1].v = v1;
        rectbuf[1].r = _color.R
        rectbuf[1].g = _color.G
        rectbuf[1].b = _color.B
        rectbuf[1].a = _color.A
        rectbuf[1].palx = palu;
        rectbuf[1].paly = palv;
        rectbuf[1].eff = this.sprite.effect;

        rectbuf[2].x = rect.X
        rectbuf[2].y = rect.Y + rect.Height
        rectbuf[2].u = u1;
        rectbuf[2].v = v2;
        rectbuf[2].r = _color.R
        rectbuf[2].g = _color.G
        rectbuf[2].b = _color.B
        rectbuf[2].a = _color.A
        rectbuf[2].palx = palu;
        rectbuf[2].paly = palv;
        rectbuf[2].eff = this.sprite.effect;

        rectbuf[3].x = rect.X + rect.Width;
        rectbuf[3].y = rect.Y + rect.Height;
        rectbuf[3].u = u2;
        rectbuf[3].v = v2;
        rectbuf[3].r = _color.R
        rectbuf[3].g = _color.G
        rectbuf[3].b = _color.B
        rectbuf[3].a = _color.A
        rectbuf[3].palx = palu;
        rectbuf[3].paly = palv;
        rectbuf[3].eff = this.sprite.effect;
        batcher.DrawQuads(this.sprite.tex, null, this.sprite.texpal, rectbuf, 1);
    }
    RenderRect(batcher: tt.IBatcher, rect: tt.Rectangle, color: tt.Color | null = null, palindex: number = -1, imgscale: number) {
        let l = this.l * imgscale;
        let r = this.r * imgscale;
        let t = this.t * imgscale;
        let b = this.b * imgscale;
        let rt = new tt.Rectangle(0, 0, 1, 1);
        //line01
        rt.Y = rect.Y;
        rt.Height = t;

        rt.X = rect.X;
        rt.Width = l;
        this._Render1Rect(this.u0, this.u1, this.v0, this.v1, batcher, rt, color, palindex);
        rt.X = rect.X + l;
        rt.Width = rect.Width - l - r;
        this._Render1Rect(this.u1, this.u2, this.v0, this.v1, batcher, rt, color, palindex);
        rt.X = rect.X + rect.Width - r;
        rt.Width = r;
        this._Render1Rect(this.u2, this.u3, this.v0, this.v1, batcher, rt, color, palindex);

        //line02
        rt.Y = rect.Y + t;
        rt.Height = rect.Height - t - b;

        rt.X = rect.X;
        rt.Width = l;
        this._Render1Rect(this.u0, this.u1, this.v1, this.v2, batcher, rt, color, palindex);
        rt.X = rect.X + l;
        rt.Width = rect.Width - l - r;
        this._Render1Rect(this.u1, this.u2, this.v1, this.v2, batcher, rt, color, palindex);
        rt.X = rect.X + rect.Width - r;
        rt.Width = r;
        this._Render1Rect(this.u2, this.u3, this.v1, this.v2, batcher, rt, color, palindex);

        //line03
        rt.Y = rect.Y + rect.Height - b;
        rt.Height = b;

        rt.X = rect.X;
        rt.Width = l;
        this._Render1Rect(this.u0, this.u1, this.v2, this.v3, batcher, rt, color, palindex);
        rt.X = rect.X + l;
        rt.Width = rect.Width - l - r;
        this._Render1Rect(this.u1, this.u2, this.v2, this.v3, batcher, rt, color, palindex);
        rt.X = rect.X + rect.Width - r;
        rt.Width = r;
        this._Render1Rect(this.u2, this.u3, this.v2, this.v3, batcher, rt, color, palindex);
    }
    RenderRectWithLimit(batcher: tt.IBatcher, rect: tt.Rectangle, limitRect: tt.Rectangle, color: tt.Color | null = null, palindex: number = -1, imgscale: number) {
        let l = this.l * imgscale;
        let r = this.r * imgscale;
        let t = this.t * imgscale;
        let b = this.b * imgscale;
        let rt = new tt.Rectangle(0, 0, 1, 1);
        //line01
        rt.Y = rect.Y;
        rt.Height = t;

        rt.X = rect.X;
        rt.Width = l;
        this._Render1RectWithLimit(this.u0, this.u1, this.v0, this.v1, batcher, rt, limitRect, color, palindex);
        rt.X = rect.X + l;
        rt.Width = rect.Width - l - t;
        this._Render1RectWithLimit(this.u1, this.u2, this.v0, this.v1, batcher, rt, limitRect, color, palindex);
        rt.X = rect.X + rect.Width - r;
        rt.Width = r;
        this._Render1RectWithLimit(this.u2, this.u3, this.v0, this.v1, batcher, rt, limitRect, color, palindex);

        //line02
        rt.Y = rect.Y + t;
        rt.Height = rect.Height - t - b;

        rt.X = rect.X;
        rt.Width = l;
        this._Render1RectWithLimit(this.u0, this.u1, this.v1, this.v2, batcher, rt, limitRect, color, palindex);
        rt.X = rect.X + l;
        rt.Width = rect.Width - l - t;
        this._Render1RectWithLimit(this.u1, this.u2, this.v1, this.v2, batcher, rt, limitRect, color, palindex);
        rt.X = rect.X + rect.Width - r;
        rt.Width = r;
        this._Render1RectWithLimit(this.u2, this.u3, this.v1, this.v2, batcher, rt, limitRect, color, palindex);

        //line03
        rt.Y = rect.Y + rect.Height - b;
        rt.Height = b;

        rt.X = rect.X;
        rt.Width = l;
        this._Render1RectWithLimit(this.u0, this.u1, this.v2, this.v3, batcher, rt, limitRect, color, palindex);
        rt.X = rect.X + l;
        rt.Width = rect.Width - l - t;
        this._Render1RectWithLimit(this.u1, this.u2, this.v2, this.v3, batcher, rt, limitRect, color, palindex);
        rt.X = rect.X + rect.Width - r;
        rt.Width = r;
        this._Render1RectWithLimit(this.u2, this.u3, this.v2, this.v3, batcher, rt, limitRect, color, palindex);
    }
}