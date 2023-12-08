import { tt } from "../../../ttapi_interface/ttapi.js"

import { QFrame_IComponent } from "./qframe_comp.js";
import { QFrame_IRenderObj } from "./qframe_renderobj.js";


import { QFrame_SceneObj } from "./qframe_sceneobj.js";
//import { matrix3x2 } from "../qframe_matrix2d.js";
import { QAni_Direction, QAni_Player, QAni_PlayerMgr, QAni_UpdatePlayerAni, QFrame_Render_Sprite, b2Vec2 } from "../../ttlayer2.js";

//用组件树模式是简单，但是计算量有点大，要优化，尽量自己画
export class QFrame_Comp_QAni implements QFrame_IComponent {
    constructor(player: QAni_Player<any>) {
        this.player = player;
        this.render = new QFrame_Render_Sprite();
        this.render.povit = new tt.Vector2(0, 0);

     
    }
    
    GetType(): string {
        return "_qani";
    }
    renderlayer: number = 0; //渲染层次
    player: QAni_Player<any>;
    direction = QAni_Direction.Down;
    private render: QFrame_Render_Sprite;

    private obj: QFrame_SceneObj
    OnAdd(obj: QFrame_SceneObj): void {
        this.obj = obj;
    }
    //收集渲染对象
    GetRenderObjs(list: QFrame_IRenderObj[]): void {

        let p = this.player;
        let intframe = p.activeaniframe | 0;

        let f = p.activeani.frames[intframe];
        if (f == undefined || f.sprite == undefined) {
            throw new Error("player 动画信息错误：at frame:" + intframe +
                " ani=" + p.aniname + " dir=" + QAni_Direction[p.direction]);
        }

        this.render.sprite = f.sprite

        this.render.pos = this.obj.tran
        this.render.angle = this.obj.angle;
        this.render.scale = this.obj.scale

        this.render.povit.X = -f.OffsetX;
        this.render.povit.Y = -f.OffsetX;

        this.render.sortvalue = QFrame_Render_Sprite.XY2SortValue(this.render.pos.X, this.render.pos.Y, this.renderlayer);
        list.push(this.render);
    }
    //收集调试渲染对象
    GetDebugRenderObjs(list: QFrame_IRenderObj[]): void {

    }

    OnUpdate(delta: number): void {
        if (this.direction != this.player.direction) {
            this.player.direction = this.direction;
            QAni_UpdatePlayerAni(this.player);
        }
        QAni_PlayerMgr.UpdatePlayer_Ani(this.player, delta);
    }
}