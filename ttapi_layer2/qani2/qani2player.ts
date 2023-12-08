import { HitType, QAni2_AniRef, QAni2_Direction, QAni2_FrameAniData, QAni2_PlayerAniData } from "./qani2data.js";
import { tt } from "../../ttapi_interface/ttapi.js";
export class QAni2_Player<T> {
    posX: number;
    posY: number;
    scaleX: number;
    scaleY: number;
    direction: QAni2_Direction; //0左 1右 2上 3下 四方向结构
    data: QAni2_PlayerAniData;
    aniname: string;
    activeani: QAni2_AniRef;
    activeaniframe: number;
    end: boolean;

    showrect: boolean;
    //userotate: boolean;//启用旋转，一般不启用（硬像素不要旋转）
    //rotate: number;//旋转值，弧度
    userdata: T;//专门留一个加外挂信息的变量，免得瞎搞了
    SetFrame(frame: number) {
        if (frame < 0) {
            frame = 0;
        }
        if (frame >= this.activeani.ani.framecount) {
            frame = this.activeani.ani.framecount - 1;
        }
        this.activeaniframe = frame;
        this.timer = this.activeaniframe / 60;
    }
    SetEndFrame() {
        this.activeaniframe = this.activeani.ani.framecount - 1;
        this.timer = this.activeaniframe / 60;
    }
    Play(name: string): void {
        this.aniname = name;
        this.UpdateAni();
        this.activeaniframe = 0;
        this.end = false;
        this.timer = 0;
    }
    private timer: number = 0;
    UpdateAni() {
        this.activeani = null;
        let a = this.data.animations[this.aniname];
        if (a != null) {
            this.activeani = a.dirani[this.direction.getDirIndex()];
        }
    }
    Update(delta: number) {
        if (this.activeani == null) {
            this.UpdateAni();
        }
        if (this.activeani != null) {
            this.timer += delta;
            this.activeaniframe = this.timer * 60 | 0;
            if (this.activeaniframe >= this.activeani.ani.frames.length) {

                if (this.activeani.ani.loop) {
                    this.activeaniframe = 0;
                    this.timer = 0;
                }
                else {
                    this.activeaniframe = this.activeani.ani.frames.length - 1;
                    this.end = true;
                }
            }

        }

    }
    static _pos: tt.Vector2 = new tt.Vector2(0, 0);
    static _scale: tt.Vector2 = new tt.Vector2(1, 1);
    static _whiteS: tt.Sprite;
    RenderCenter(batcher: tt.IBatcher, color: tt.Color) {
        if (QAni2_Player._whiteS == undefined) {

            QAni2_Player._whiteS = new tt.Sprite(tt.graphic.getWhiteTexture(), null);
        }
        QAni2_Player._whiteS.RenderRect2(batcher, this.posX - 100, this.posY - 1, this.posX + 100, this.posY + 1, color);
        QAni2_Player._whiteS.RenderRect2(batcher, this.posX - 1, this.posY - 100, this.posX + 1, this.posY + 100, color);
    }
    RenderRect(batcher: tt.IBatcher, x1: number, y1: number, x2: number, y2: number, color: tt.Color) {
        if (QAni2_Player._whiteS == undefined) {

            QAni2_Player._whiteS = new tt.Sprite(tt.graphic.getWhiteTexture(), null);
        }
        let _x1 = this.posX + x1 * QAni2_Player._scale.X;
        let _x2 = this.posX + x2 * QAni2_Player._scale.X;
        let _y1 = this.posY + y1 * QAni2_Player._scale.Y;
        let _y2 = this.posY + y2 * QAni2_Player._scale.Y;

        QAni2_Player._whiteS.RenderRect2(batcher, _x1, _y1, _x2, _y2, color);
    }
    RenderRectBorder(batcher: tt.IBatcher, x1: number, y1: number, x2: number, y2: number, color: tt.Color) {
        if (QAni2_Player._whiteS == undefined) {

            QAni2_Player._whiteS = new tt.Sprite(tt.graphic.getWhiteTexture(), null);
        }
        let __x1 = this.posX + x1 * QAni2_Player._scale.X;
        let __x2 = this.posX + x2 * QAni2_Player._scale.X;
        let __y1 = this.posY + y1 * QAni2_Player._scale.Y;
        let __y2 = this.posY + y2 * QAni2_Player._scale.Y;
        let _x1 = Math.min(__x1, __x2);
        let _x2 = Math.max(__x1, __x2);
        let _y1 = Math.min(__y1, __y2);
        let _y2 = Math.max(__y1, __y2);
        QAni2_Player._whiteS.RenderRect2(batcher, _x1, _y1, _x2, _y1 + 2, color);
        QAni2_Player._whiteS.RenderRect2(batcher, _x1, _y2 - 2, _x2, _y2, color);
        QAni2_Player._whiteS.RenderRect2(batcher, _x1, _y1, _x1 + 2, _y2, color);
        QAni2_Player._whiteS.RenderRect2(batcher, _x2 - 2, _y1, _x2, _y2, color);
    }
    Render(batcher: tt.IBatcher) {
        let fx = this.activeani.flipx;
        let fy = this.activeani.flipy;
        let f = this.activeani.ani.frames[this.activeaniframe];

        if (this.showrect) {
            QAni2_Player._scale.X = this.scaleX * (fx ? -1 : 1);
            QAni2_Player._scale.Y = this.scaleY * (fy ? -1 : 1);
            for (var i = 0; i < f.rects.length; i++) {
                let r = f.rects[i];
                let c: tt.Color = new tt.Color(255, 255, 255, 100);
                if (r.type == HitType.Attack) {
                    c.R = 1;
                    c.G = c.B = 0;
                }
                else if (r.type == HitType.BeHit) {
                    c.G = 1;
                    c.R = c.B = 0
                }
                this.RenderRect(batcher, r.x1, r.y1, r.x2, r.y2, c);

            }

        }

        for (var i = 0; i < f.sprites.length; i++) {
            let s = f.sprites[i];
            QAni2_Player._scale.X = this.scaleX * s.ScaleX * (fx ? -1 : 1);
            QAni2_Player._scale.Y = this.scaleY * s.ScaleY * (fy ? -1 : 1);
            QAni2_Player._pos.X = this.posX + s.OffsetX * QAni2_Player._scale.X;
            QAni2_Player._pos.Y = this.posY + s.OffsetY * QAni2_Player._scale.Y;
            f.sprites[i].sprite.Render(batcher, QAni2_Player._pos, QAni2_Player._scale);
        }
        if (this.showrect) {
            QAni2_Player._scale.X = this.scaleX * (fx ? -1 : 1);
            QAni2_Player._scale.Y = this.scaleY * (fy ? -1 : 1);
            for (var i = 0; i < f.rects.length; i++) {
                let r = f.rects[i];
                let c: tt.Color = new tt.Color(255, 255, 255, 100);
                if (r.type == HitType.Attack) {
                    c.R = 1;
                    c.G = c.B = 0;
                }
                else if (r.type == HitType.BeHit) {
                    c.G = 1;
                    c.R = c.B = 0
                }
                this.RenderRectBorder(batcher, r.x1, r.y1, r.x2, r.y2, c);

            }

        }
    }
}