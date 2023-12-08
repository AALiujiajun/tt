
import { tt } from "../../../ttapi_interface/ttapi.js"
import { b2Transform, b2Vec2 } from "../../box2d_core/src/index.js";
//import { matrix3x2 } from "../qframe_matrix2d.js";
import { QFrame_IScene, QFrame_Scene } from "../qframe_scene.js";
import { QFrame_IComponent } from "./qframe_comp.js";
import { QFrame_IRenderObj } from "./qframe_renderobj.js";






//虽然Unity的组件式设计很浪费
//但是一个有弹性的组件式设计确实比较灵活

//实践检验之下，大量的矩阵运算，性能是真的不行。
export class QFrame_SceneObj {


    constructor(scene: QFrame_IScene) {
        this.scene = scene;
        this.tran = new tt.Vector2(0, 0);
        this.scale = new tt.Vector2(1, 1);
        this.angle = undefined;
        //this._tran2dworld = new matrix3x2();

    }
    userdata: any;
    scene: QFrame_IScene
    IsGroup(): boolean {
        return false;
    }
    //box2d 的tran 只有 p q 少一个scale
    tran: tt.Vector2;
    scale: tt.Vector2;
    angle: number = undefined;
    //protected _tran2dworld: matrix3x2;
    protected _components: QFrame_IComponent[] = [];
    AddComponent(com: QFrame_IComponent) {
        for (var i = 0; i < this._components.length; i++) {
            if (this._components[i].GetType() == com.GetType()) {
                throw new Error("duplicate component type:" + com.GetType());
            }
        }
        com.OnAdd(this);
        this._components.push(com);
    }
    GetComponent(index: number) {
        return this._components[index];

    }
    GetComponentCount(): number {
        return this._components.length;
    }

    GetParent(): QFrame_SceneObj {
        return this._parent;
    }

    // GetWorldTran(): matrix3x2 {
    //     return this._tran2dworld;
    // }
    protected _parent: QFrame_SceneObj;

    OnUpdate(delta: number): void {
        //递归矩阵
        // if (this._parent != null) {
        //     matrix3x2.Multiply(this._parent._tran2dworld, this.tran2d, this._tran2dworld)
        // }

        for (let i = 0; i < this._components.length; i++) {
            let c = this._components[i];
            if (c.OnUpdate)
                c.OnUpdate(delta);
        }


    }

}
export class QFrame_SceneObj_Group extends QFrame_SceneObj {
    protected _children: QFrame_SceneObj[] = [];
    override  IsGroup(): boolean {
        return true;
    }
    AddChild(obj: QFrame_SceneObj) {

        if (this._children.indexOf(obj) >= 0) {
            return;
        }
        if ((obj as any)._parent != null) {
            (obj as any)._parent.RemoveChild(obj);
        }
        (obj as any)._parent = this;
        this._children.push(obj);
    }
    RemoveChild(obj: QFrame_SceneObj) {
        let i = this._children.indexOf(obj);
        if (i < 0) {
            throw new Error("not have this obj");
        }
        this._children.splice(i, 1);
        (obj as any)._parent = null;
    }
    RemoveChildAll() {
        for (let i = 0; i < this._children.length; i++) {
            let obj = this._children[i];
            (obj as any)._parent = null;
        }
        this._children.splice(0);
    }
    GetChildrenCount(): number {
        return this._children.length;
    }
    GetChild(index: number): QFrame_SceneObj {

        return this._children[index];
    }

    override  OnUpdate(delta: number): void {
        //matrix3x2Clone(this.tran2d, this._tran2dworld);
        super.OnUpdate(delta);

        //向下传递
        for (let i = 0; i < this._children.length; i++) {
            this._children[i].OnUpdate(delta);
        }
    }
}