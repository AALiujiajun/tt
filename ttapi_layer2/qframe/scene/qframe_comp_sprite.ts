import { tt } from "../../../ttapi_interface/ttapi.js"

import { QFrame_IComponent } from "./qframe_comp.js";
import { QFrame_IRenderObj } from "./qframe_renderobj.js";


import { QFrame_SceneObj } from "./qframe_sceneobj.js";
//import { matrix3x2 } from "../qframe_matrix2d.js";
import { b2Vec2 } from "../../ttlayer2.js";

export class QFrame_Render_Sprite implements QFrame_IRenderObj {
    sortvalue: number = 0;
    sprite: tt.Sprite = null;
    povit: tt.Vector2 = null;
    //matrix: matrix3x2 = null;
    pos: tt.Vector2 = null;
    angle: number = null;
    scale: tt.Vector2 = null;
    color: tt.Color = tt.Color.White;
    palindex: number = -1;
    OnRender(bathcer: tt.IBatcher): void {
        let np = new tt.Vector2(this.pos.X - this.povit.X * this.scale.X, this.pos.Y - this.povit.Y * this.scale.Y);
        //QFrame_Render_Sprite.SpriteRenderMatrix(bathcer, this.sprite, this.povit, this.matrix, this.color, this.palindex)
        if (this.angle != null) {
            this.sprite.RenderWithRotate(bathcer, np, this.scale, this.angle, this.povit.X, this.povit.Y, this.color, this.palindex);
        }
        else {
            let np = new tt.Vector2(this.pos.X - this.povit.X * this.scale.X, this.pos.Y - this.povit.Y * this.scale.Y);
            this.sprite.Render(bathcer, np, this.scale, this.color, this.palindex);
        }
    }

    // static SpriteRenderMatrix(batcher: tt.IBatcher, sprite: tt.Sprite, povit: tt.Vector2, mat: matrix3x2, color: tt.Color | null = null, palindex: number = -1) {
    //     let rectbuf = tt.Sprite._rectbuf
    //     while (rectbuf.length < 4) {
    //         rectbuf.push(new tt.DrawPoint());
    //     }
    //     if (tt.Sprite._colorbuf == null) {
    //         tt.Sprite._colorbuf = tt.Color.White;
    //     }
    //     let _color = color == null ? tt.Sprite._colorbuf : color;


    //     let palu = 0;
    //     let palv = 0;
    //     if (palindex >= 0) {
    //         palu = sprite.paluvs[palindex].X;
    //         palv = sprite.paluvs[palindex].Y;
    //     }
    //     let l = sprite.border.XLeft - povit.X;
    //     let t = sprite.border.YTop - povit.Y;
    //     let r = sprite.totalWidth - sprite.border.XRight - povit.X;
    //     let b = sprite.totalHeight - sprite.border.YBottom - povit.Y;
    //     let xy: b2Vec2 = new b2Vec2(l, t);
    //     let pos: b2Vec2 = new b2Vec2(0, 0);
    //     matrix3x2.MultiplyVec2(mat, xy, pos)
    //     rectbuf[0].x = pos.x;
    //     rectbuf[0].y = pos.y;
    //     rectbuf[0].u = sprite.uv.U1;
    //     rectbuf[0].v = sprite.uv.V1;
    //     rectbuf[0].r = _color.R;
    //     rectbuf[0].g = _color.G;
    //     rectbuf[0].b = _color.B;
    //     rectbuf[0].a = _color.A;
    //     rectbuf[0].palx = palu;
    //     rectbuf[0].paly = palv;
    //     rectbuf[0].eff = sprite.effect

    //     xy.x = r;

    //     matrix3x2.MultiplyVec2(mat, xy, pos)
    //     rectbuf[1].x = pos.x;
    //     rectbuf[1].y = pos.y;
    //     rectbuf[1].u = sprite.uv.U2;
    //     rectbuf[1].v = sprite.uv.V1;
    //     rectbuf[1].r = _color.R
    //     rectbuf[1].g = _color.G
    //     rectbuf[1].b = _color.B
    //     rectbuf[1].a = _color.A
    //     rectbuf[1].palx = palu;
    //     rectbuf[1].paly = palv;
    //     rectbuf[1].eff = sprite.effect;

    //     xy.x = l;
    //     xy.y = b;
    //     matrix3x2.MultiplyVec2(mat, xy, pos)
    //     rectbuf[2].x = pos.x;
    //     rectbuf[2].y = pos.y;
    //     rectbuf[2].u = sprite.uv.U1;
    //     rectbuf[2].v = sprite.uv.V2;
    //     rectbuf[2].r = _color.R
    //     rectbuf[2].g = _color.G
    //     rectbuf[2].b = _color.B
    //     rectbuf[2].a = _color.A
    //     rectbuf[2].palx = palu;
    //     rectbuf[2].paly = palv;
    //     rectbuf[2].eff = sprite.effect;

    //     xy.x = r;
    //     //xy.y = b;
    //     matrix3x2.MultiplyVec2(mat, xy, pos)
    //     rectbuf[3].x = pos.x;
    //     rectbuf[3].y = pos.y;
    //     rectbuf[3].u = sprite.uv.U2;
    //     rectbuf[3].v = sprite.uv.V2;
    //     rectbuf[3].r = _color.R
    //     rectbuf[3].g = _color.G
    //     rectbuf[3].b = _color.B
    //     rectbuf[3].a = _color.A
    //     rectbuf[3].palx = palu;
    //     rectbuf[3].paly = palv;
    //     rectbuf[3].eff = sprite.effect;
    //     batcher.DrawQuads(sprite.tex, null, sprite.texpal, rectbuf, 1);
    // }
    static XY2SortValue(x: number, y: number, layer: number): number {
        let maxsortid = 65536 * 256;


        let sx = x / 1024 + 0.5;
        if (sx < 0) sx = 0;
        if (sx > 1) sx = 1;

        let sy = y / 1024 + 0.5;
        if (sy < 0) sy = 0;
        if (sy > 1) sy = 1;

        let sortid = sy * 256 + sx * 256 + maxsortid / 2;

        if (sortid < 0) sortid = 0;
        if (sortid >= maxsortid - 1) sortid = maxsortid - 1;
        let slayer = layer + 127;
        if (slayer < 0) slayer = 0;
        if (slayer > 255) slayer = 255;
        return slayer * 256 + sortid;
    }
}
export class QFrame_Comp_Sprite implements QFrame_IComponent {
    constructor(s: tt.Sprite) {
        this.sprite = s;
        this.render = new QFrame_Render_Sprite();
    }
    GetType(): string {
        return "_sprite";
    }
    renderlayer: number = 0; //渲染层次
    sprite: tt.Sprite
    povit: tt.Vector2 = new tt.Vector2(0, 0);
    private render: QFrame_Render_Sprite;

    private obj: QFrame_SceneObj
    OnAdd(obj: QFrame_SceneObj): void {
        this.obj = obj;
    }
    //收集渲染对象
    GetRenderObjs(list: QFrame_IRenderObj[]): void {
        this.render.sprite = this.sprite;
        this.render.pos = this.obj.tran

        this.render.angle = this.obj.angle;
        this.render.scale = this.obj.scale

        this.render.povit = this.povit;

        this.render.sortvalue = QFrame_Render_Sprite.XY2SortValue(this.render.pos.X, this.render.pos.Y, this.renderlayer);
        list.push(this.render);
    }
    //收集调试渲染对象
    GetDebugRenderObjs(list: QFrame_IRenderObj[]): void {

    }


}