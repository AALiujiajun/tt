
import { tt } from "../../../ttapi_interface/ttapi.js";
import { b2Drawer } from "../../box2d_core/b2drawer.js";
import { RGBA, b2Body, b2BodyType, b2CircleShape, b2PolygonShape, b2Shape } from "../../box2d_core/src/index.js";
import { QFrame_IComponent } from "./qframe_comp.js";
import { QFrame_IRenderObj } from "./qframe_renderobj.js";
import { QFrame_SceneObj } from "./qframe_sceneobj.js";

export class QFrame_DebugRender_Circle implements QFrame_IRenderObj {
    sortvalue: number = 0;
    debugdrawer: b2Drawer;
    body: b2Body;//刚体
    sharp: b2Shape;
    color: RGBA = { r: 0, g: 0, b: 0, a: 1 };
    OnRender(bathcer: tt.IBatcher): void {
        this.debugdrawer.batcher = bathcer;
        this.debugdrawer.PushTransform(this.body.m_xf);
        this.debugdrawer.DrawCircle({ x: 0, y: 0 }, this.sharp.m_radius, this.color);
        //this.sharp.Draw(this.debugdrawer, GetShapeColor(this.body));
        this.debugdrawer.PopTransform(this.body.m_xf);
    }

}
export class QFrame_DebugRender_Polygon implements QFrame_IRenderObj {
    sortvalue: number = 0;
    debugdrawer: b2Drawer;
    body: b2Body;//刚体
    sharp: b2PolygonShape;
    color: RGBA = { r: 0, g: 0, b: 0, a: 1 };
    OnRender(bathcer: tt.IBatcher): void {
        this.debugdrawer.batcher = bathcer;
        this.debugdrawer.PushTransform(this.body.m_xf);

        this.debugdrawer.DrawPolygon(this.sharp.m_vertices, this.sharp.m_count, this.color);
        //this.sharp.Draw(this.debugdrawer, GetShapeColor(this.body));
        this.debugdrawer.PopTransform(this.body.m_xf);
    }

}
export interface ICollider {
    body: b2Body;//刚体
    debugColor: tt.Color
    GetType(): string
    obj: QFrame_SceneObj;

    OnHit?: (coll: ICollider, collB: ICollider) => void;
}
export function QFrame_ColliderMask(...params: number[]): number {
    let mask = 0;
    for (let i = 0; i < params.length; i++) {
        mask |= (1 << params[i]);
    }
    return mask
}
abstract class QFrame_Collider implements QFrame_IComponent, ICollider {
    constructor(type: string) {
        this._type = type;
    }
    private _type: string;
    body: b2Body;//刚体
    debugColor: tt.Color = new tt.Color(0, 0, 0, 1);
    sharp: b2Shape
    _dirty: boolean = false;
    MarkDirty() {
        this._dirty = true;
    }

    GetType(): string {
        return this._type;
    }
    obj: QFrame_SceneObj;
    OnHit?: (coll: ICollider, collB: ICollider) => void;
    ResetFilter(): void {
        this.body.GetFixtureList().SetFilterData(null);
    }
    SetCollider(cid: number, maskBits: number): void {
        this.body.GetFixtureList().SetFilterData({ categoryBits: 1 << (cid), maskBits, groupIndex: 0 });
    }
    GetRenderObjs(list: QFrame_IRenderObj[]): void {

    }
    abstract GetDebugRenderObjs(list: QFrame_IRenderObj[]): void

    OnAdd(obj: QFrame_SceneObj): void {
        this.obj = obj;


        let b = this.body = obj.scene.world_box2d.CreateBody(
            { type: b2BodyType.b2_dynamicBody }
        );



        //isSensor 表示仅碰撞，无物理
        let f = b.CreateFixture({ shape: this.sharp, isSensor: true });
        f.SetUserData(this);

    }
    //abstract OnUpdate(delta: number): void
}
export class QFrame_Comp_Collider_Circle extends QFrame_Collider {
    constructor() {
        super("_collider_circle")
        this.render = new QFrame_DebugRender_Circle();
    }
    private render: QFrame_DebugRender_Circle;

    radius: number = 25;

    sharp: b2CircleShape; //形状


    GetDebugRenderObjs(list: QFrame_IRenderObj[]): void {
        let dd = this.obj.scene.debugdrawer_box2d;

        this.render.debugdrawer = dd;
        this.render.sharp = this.sharp;
        this.render.body = this.body;
        this.render.color.r = this.debugColor.R;
        this.render.color.g = this.debugColor.G;
        this.render.color.b = this.debugColor.B;
        this.render.color.a = this.debugColor.A;
        list.push(this.render);
    }

    OnAdd(obj: QFrame_SceneObj): void {
        let psharp: b2Shape = this.sharp = new b2CircleShape();
        this.obj = obj;
        this.sharp.m_radius = this.radius * obj.scale.Y;
        super.OnAdd(obj);

    }
    OnUpdate(delta: number): void {

        //形状半径
        if (this._dirty) {
            this.sharp.m_radius = this.radius * this.obj.scale.Y;
            this._dirty = false;
        }
        //刚体位置更新//默认为Trigger,不受物理影响，仅做碰撞测试
        let a = this.obj.angle;
        if (a == null)
            a = 0;
        this.body.SetTransformXY(this.obj.tran.X, this.obj.tran.Y, a);

    }

}
export class QFrame_Comp_Collider_Box extends QFrame_Collider {
    constructor() {
        super("_collider_box")
        this.render = new QFrame_DebugRender_Polygon();
    }
    private render: QFrame_DebugRender_Polygon;
    width: number;
    height: number;
    pivotX: number;
    pivotY: number;


    GetDebugRenderObjs(list: QFrame_IRenderObj[]): void {
        let dd = this.obj.scene.debugdrawer_box2d;

        this.render.debugdrawer = dd;
        this.render.sharp = this.sharp as b2PolygonShape;
        this.render.body = this.body;
        this.render.color.r = this.debugColor.R;
        this.render.color.g = this.debugColor.G;
        this.render.color.b = this.debugColor.B;
        this.render.color.a = this.debugColor.A;
        list.push(this.render);
    }

    OnAdd(obj: QFrame_SceneObj): void {
        let boxsharp: b2PolygonShape = this.sharp = new b2PolygonShape();
        boxsharp.SetAsBox(20,20);
        this.obj = obj;
        this._updatebox();
        super.OnAdd(obj);

    }
    _updatebox(): void {
        let boxsharp: b2PolygonShape = this.sharp as b2PolygonShape
        let w = this.width * this.obj.scale.X
        let h = this.height * this.obj.scale.Y
        let ox = this.pivotX * this.obj.scale.X;
        let oy = this.pivotY * this.obj.scale.Y
      
        boxsharp.m_vertices[0].Set(-ox, -oy);
        boxsharp.m_vertices[1].Set(w - ox, -oy);
        boxsharp.m_vertices[2].Set(w - ox, h - oy);
        boxsharp.m_vertices[3].Set(-ox, h - oy);
    }
    OnUpdate(delta: number): void {



        if (this._dirty) {
            this._updatebox();
            this._dirty = false;
        }

        let a = this.obj.angle;
        if (a == null)
            a = 0;
        this.body.SetTransformXY(this.obj.tran.X, this.obj.tran.Y, a);// this.obj.angle);

    }

}