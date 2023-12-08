//场景封装

import { tt } from "../../ttapi_interface/ttapi.js"
import { b2Drawer } from "../box2d_core/b2drawer.js";
import { b2Contact, b2ContactListener, b2World } from "../box2d_core/src/index.js";
import { QUI_Container } from "../qui/qui.js";
import { QFrame_App } from "./qframe_app.js";
import { ICollider } from "./scene/qframe_comp_collider.js";

import { QFrame_IRenderObj } from "./scene/qframe_renderobj.js";
import { QFrame_SceneObj, QFrame_SceneObj_Group } from "./scene/qframe_sceneobj.js";


export enum QFrame_ScreenMode {
    SameWithWindow,//和窗口一样大
    LimitRadioFixPixel,//限制缩放比例
    LimitRadioScalePixel,//限制缩放比例，但是通过缩放适应
}
export class QFrame_ScreenSize {
    mode: QFrame_ScreenMode = QFrame_ScreenMode.SameWithWindow;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
}
export interface QFrame_IScene {
    //物理系统
    world_box2d: b2World;
    debugdrawer_box2d: b2Drawer;
    GetFont():tt.Font
    GetDebug(): boolean
    SetDebug(debug: boolean): void
    GetTarget(): tt.IRenderTarget
    GetUI(): QUI_Container
    CreateSceneObj(): QFrame_SceneObj
    GetRootGroup(): QFrame_SceneObj_Group
    Destory(): void
    UpdateScreenSize(screensize: QFrame_ScreenSize): void
    OnRender(): void
    OnUpdate(delta: number): void

}
export class QFrame_Scene<T> extends b2ContactListener implements QFrame_IScene {

    constructor(app: QFrame_App<T>, screensize?: QFrame_ScreenSize) {

        super();
        this.app = app;
        this._batcher = tt.graphic.CreateRenderer_Batcher();
        this._root = new QFrame_SceneObj_Group(this);

        if (screensize == null)
            screensize = new QFrame_ScreenSize();
        this.UpdateScreenSize(screensize);

        this.world_box2d = b2World.Create({ x: 0, y: 0 });
        this.world_box2d.SetContactListener(this);//设置碰撞事件
        this.debugdrawer_box2d = new b2Drawer(null);
    }
    //物理碰撞
    public override BeginContact(_contact: b2Contact): void {
        let c = _contact.GetFixtureA().GetUserData() as ICollider
        let c2 = _contact.GetFixtureB().GetUserData() as ICollider
        if (c.OnHit)
            c.OnHit(c, c2);
        if (c2.OnHit)
            c2.OnHit(c2, c);
    }
    private app: QFrame_App<T>
    GetFont():tt.Font
    {
        return this.app.font;
    }
    private _debug: boolean = false;//debug model
    private _root: QFrame_SceneObj_Group;
    //自带分辨率比例控制
    private _target: tt.IRenderTarget;//根据分辨率的情况，target可以是一个rendertarget 或者 就是 mainscreen

    private screenSize: QFrame_ScreenSize
    private _batcher: tt.IBatcher;
    private _targetSprite: tt.Sprite;
    private _subui: QUI_Container;
    private _outradio: number;
    private _outrect: tt.Rectangle;
    private lastwidth: number;
    private lastheight: number;

    //物理系统
    world_box2d: b2World;
    debugdrawer_box2d: b2Drawer;

    GetDebug(): boolean {
        return this._debug;
    }
    SetDebug(debug: boolean): void {
        this._debug = debug;
    }
    GetTarget(): tt.IRenderTarget {
        if (this.screenSize.mode == QFrame_ScreenMode.SameWithWindow) {
            return this.app.target;
        }
        else {
            return this._target;
        }
    }
    GetUI(): QUI_Container {
        return this._subui;
    }
    CreateSceneObj(): QFrame_SceneObj {
        return new QFrame_SceneObj(this);
    }
    CreateSceneObjGroup(): QFrame_SceneObj_Group {
        return new QFrame_SceneObj_Group(this);
    }
    GetRootGroup(): QFrame_SceneObj_Group {
        return this._root;
    }
    Destory(): void {
        if (this._subui != null) {
            this.app.canvas.removeChild(this._subui);
            this._subui = null;
        }
        if (this._target != null) {
            this._target.Destory();
        }
    }
    UpdateScreenSize(screensize: QFrame_ScreenSize) {
        this.screenSize = screensize;

        this.Destory();

        this._subui = new QUI_Container();
        this.app.canvas.addChild(this._subui);
        this.app.target.ClearColor.R = 0;
        this.app.target.ClearColor.G = 0;
        this.app.target.ClearColor.B = 0;

        this.lastwidth = this.app.target.getWidth();;
        this.lastheight = this.app.target.getHeight();



        if (screensize.mode == QFrame_ScreenMode.LimitRadioFixPixel || screensize.mode == QFrame_ScreenMode.LimitRadioScalePixel) {

            this._outrect = new tt.Rectangle(0, 0, 0, 0);
            //计算屏幕比例
            let { texwidth, texheight } = this.CalcRadio(screensize);



            //计算符合比例的目标尺寸



            this.UpdateOutRect();


            if (screensize.mode == QFrame_ScreenMode.LimitRadioFixPixel) {
                this._target = tt.graphic.CreateRenderTarget(texwidth, texheight, tt.TextureFormat.RGBA32);
                this._batcher.Scale = 1.0;
            }
            else if (screensize.mode == QFrame_ScreenMode.LimitRadioScalePixel) {
                this._target = tt.graphic.CreateRenderTarget(this._outrect.Width, this._outrect.Height, tt.TextureFormat.RGBA32);
                this._batcher.Scale = this.app.canvas.scale;
            }
            this._targetSprite = new tt.Sprite(this._target, null);

            this.app.canvas.scale = this._outrect.Height / texheight;
            this._batcher.Scale = this.app.canvas.scale;
            this._subui.localRect.setHPosByCenter(texwidth);
            this._subui.localRect.setVPosByCenter(texheight);

        }
        else {
            this._subui.localRect.setHPosByCenter(this.app.target.getWidth());
            this._subui.localRect.setVPosByCenter(this.app.target.getHeight());
        }
        // this.GetTarget().ClearColor.R = 1.0;
        // this.GetTarget().ClearColor.G = 1.0;
        // this.GetTarget().ClearColor.B = 1.0;

    }

    private CalcRadio(screensize: QFrame_ScreenSize) {
        let srcwidth = this.app.target.getWidth();;
        let srcheight = this.app.target.getHeight();
        console.log("原始尺寸:" + srcwidth + "x" + srcheight);
        let curradio = srcwidth / srcheight;
        let r1 = screensize.minWidth / screensize.minHeight;
        let r2 = screensize.maxWidth / screensize.maxHeight;
        let minradio = Math.min(r1, r2);
        let maxradio = Math.max(r1, r2);

        let texheight = screensize.maxHeight;
        let texwidth = screensize.maxHeight * curradio;

        //过窄
        if (curradio < minradio) {
            curradio = minradio;
            texwidth = screensize.minWidth;
            texheight = texwidth / curradio;

        }

        //过宽
        else if (curradio > maxradio) {
            curradio = maxradio;
            texheight = screensize.minHeight;
            texwidth = texheight * curradio;

        }

        //修正比例
        else if (texwidth > screensize.maxWidth) {
            texwidth = screensize.maxWidth;
            texheight = texwidth / curradio;

        }

        this._outradio = curradio;

        return { texwidth, texheight };
    }

    //在比例内调整输出尺寸
    private UpdateOutRect(): void {
        let srcwidth = this.app.target.getWidth();;
        let srcheight = this.app.target.getHeight();
        let useHeight = srcheight;
        let useWidth = srcheight * this._outradio;
        if (useWidth > srcwidth) {
            useWidth = srcwidth;
            useHeight = useWidth / this._outradio;
        }
        this._outrect.Width = useWidth;
        this._outrect.Height = useHeight;
        this._outrect.X = (srcwidth - this._outrect.Width) / 2;
        this._outrect.Y = (srcheight - this._outrect.Height) / 2;

    }

    private _GetRenderObjs(obj: QFrame_SceneObj, list: QFrame_IRenderObj[]) {
        for (let i = 0; i < obj.GetComponentCount(); i++) {
            obj.GetComponent(i).GetRenderObjs(list);
        }
        if (obj.IsGroup()) {


            for (let i = 0; i < (obj as QFrame_SceneObj_Group).GetChildrenCount(); i++) {
                this._GetRenderObjs((obj as QFrame_SceneObj_Group).GetChild(i), list);
            }
        }
    }
    private _GetDebugRenderObjs(obj: QFrame_SceneObj, list: QFrame_IRenderObj[]) {
        for (let i = 0; i < obj.GetComponentCount(); i++) {
            obj.GetComponent(i).GetDebugRenderObjs(list);
        }
        if (obj.IsGroup()) {
            for (let i = 0; i < (obj as QFrame_SceneObj_Group).GetChildrenCount(); i++) {
                this._GetDebugRenderObjs((obj as QFrame_SceneObj_Group).GetChild(i), list);
            }
        }
    }
    private _renderlist: QFrame_IRenderObj[] = [];
    OnRender(): void {

        let t = this.GetTarget();

        this.app.target.End();
        {

            t.Begin();
            this._batcher.BeginDraw(t);



            //收集渲染目标
            this._renderlist.splice(0);
            this._GetRenderObjs(this._root, this._renderlist);

            //排序
            this._renderlist.sort((a, b) => {
                return a.sortvalue - b.sortvalue;
            });

            //渲染
            for (let i = 0; i < this._renderlist.length; i++) {
                this._renderlist[i].OnRender(this._batcher);
            }



            if (this._debug) {
                //收集渲染目标
                this._renderlist.splice(0);
                this._GetDebugRenderObjs(this._root, this._renderlist);
                for (let i = 0; i < this._renderlist.length; i++) {
                    this._renderlist[i].OnRender(this._batcher);
                }

                this.debugdrawer_box2d.batcher = this._batcher;
                //DrawShapes(this.debugdrawer_box2d, this.world_box2d);
                //DrawAABBs(this.debugdrawer_box2d, this.world_box2d)
            }
            this._batcher.EndDraw();
            t.End();
        }
        this.app.target.PushLimitRect(this._outrect);
        this.app.target.Begin();
        let batcher = this.app.canvas.batcherUI;
       
        
        batcher.BeginDraw(this.app.target);
        if (t != this.app.target) {
            this._targetSprite.RenderRect(batcher, this._outrect);
        }

        this._subui.OnRender(this.app.canvas);
        batcher.EndDraw();
        this.app.target.PopLimitRect();
        this.app.target.End();
    }

    OnUpdate(delta: number): void {
        this._root.OnUpdate(delta);

        //改变分辨率
        if (this.lastwidth != this.app.target.getWidth() || this.lastheight != this.app.target.getHeight()) {



            let screensize = this.screenSize;

            if (screensize.mode == QFrame_ScreenMode.LimitRadioFixPixel) {

                let { texwidth, texheight } = this.CalcRadio(screensize);
                this.UpdateOutRect();

                this._batcher.Scale = 1.0;

                this._target.Resize(texwidth, texheight);


                this.app.canvas.scale = this._outrect.Height / texheight;
                this._subui.localRect.setHPosByCenter(texwidth);
                this._subui.localRect.setVPosByCenter(texheight);
            }
            else if (screensize.mode == QFrame_ScreenMode.LimitRadioScalePixel) {

                let { texwidth, texheight } = this.CalcRadio(screensize);
                this.UpdateOutRect();

                this._batcher.Scale = this.app.canvas.scale;
                this._target.Resize(this._outrect.Width, this._outrect.Height);

                this.app.canvas.scale = this._outrect.Height / texheight;
                this._subui.localRect.setHPosByCenter(texwidth);
                this._subui.localRect.setVPosByCenter(texheight);
            }
            else {
                this._subui.localRect.setHPosByCenter(this.app.target.getWidth());
                this._subui.localRect.setVPosByCenter(this.app.target.getHeight());
            }







            this.lastwidth = this.app.target.getWidth()
            this.lastheight = this.app.target.getHeight();
        }

        //物理系统更新
        this.world_box2d.Step(delta, {
            velocityIterations: 0,
            positionIterations: 0,
        });


    }
}