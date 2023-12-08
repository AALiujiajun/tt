
import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"
import { Test_UITool } from "./test_uitool.js";

export class State_Test_Box2D_Scene<T> extends tt2.b2ContactListener implements tt2.QFrame_IState<T>
{
    scene: tt2.QFrame_Scene<T>
    // world: tt2.b2World;
    // bodys: tt2.b2Body[] = [];
    // app: tt2.QFrame_App<T>;
    // b2drawer: tt2.b2Drawer;//box2d 的 debug render
    // sprite: tt.Sprite;
    scaleobj: tt2.QFrame_SceneObj_Group;//一个分组
    aniobj: tt2.QFrame_SceneObj_Group;//一个分组
    //变换不会传递，仅起到分组的功能

    OnInit(statemgr: tt2.QFrame_App<T>): void {
        //这是场景的功能之一
        //控制屏幕比例
        let ssize = new tt2.QFrame_ScreenSize();
        ssize.mode = tt2.QFrame_ScreenMode.LimitRadioScalePixel;//
        ssize.minWidth = ssize.maxWidth = 240;
        ssize.minHeight = 320;
        ssize.maxHeight = 480;
        this.scene = new tt2.QFrame_Scene<T>(statemgr, ssize);

        this.scaleobj = this.scene.CreateSceneObjGroup();
        this.scene.GetRootGroup().AddChild(this.scaleobj);



        this.aniobj = this.scene.CreateSceneObjGroup();
        this.scene.GetRootGroup().AddChild(this.aniobj);


        //打开调试模式
        this.scene.SetDebug(true);

        tt.input.OnKey = (c, p) => {
            if (c == "Digit1" && p == false) {
                this.scene.SetDebug(!this.scene.GetDebug());

            }
        }
        this.StartAsync();

    }
    atlas: tt.Atlas;
    async StartAsync(): Promise<void> {
        this.atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync(Test_UITool.getResPath("splittex_pack0.png.json"));
        //添加一百个显示精灵的对象
        for (var i = 0; i < 100; i++) {
            let obj = this.scene.CreateSceneObj();

            obj.tran.X = Math.random() * 100 - 100
            obj.tran.Y = Math.random() * 200;
            obj.scale.X = 0.25;
            obj.scale.Y = 0.25
            //obj.angle = Math.random() * Math.PI * 2;

            let s = this.atlas.allsprite[i % this.atlas.allsprite.length]

            let comps = new tt2.QFrame_Comp_Sprite(s);
            comps.povit.X = s.totalWidth / 2;
            comps.povit.Y = s.totalHeight / 2;
            obj.AddComponent(comps);
            this.scaleobj.AddChild(obj);
        }


        let userplayer = tt2.QAni_PlayerMgr.CreatePlayer("p1");
        if (userplayer == null) {
            // let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync(Test_UITool.getResPath("splittex_pack0.png.json"));
            // let json = await tt.loader.LoadStringAsync(Test_UITool.getResPath("playerani.json"));
            await tt2.QAni_PlayerMgr.LoadPlayerInfo(Test_UITool.getResPath("playerani.json"));
            userplayer = tt2.QAni_PlayerMgr.CreatePlayer("p1");

        }
        if (userplayer == null) {
            throw new Error("加载Main Player 失败");
        }

        for (var i = 0; i < 100; i++) {
            let obj = this.scene.CreateSceneObj();

            obj.tran.X = Math.random() * 200
            obj.tran.Y = Math.random() * 400;
            obj.scale.X = 0.25;
            obj.scale.Y = 0.25
            //obj.angle = Math.random() * Math.PI * 2;

            let s = this.atlas.allsprite[i % this.atlas.allsprite.length]

            let player = tt2.QAni_PlayerMgr.CreatePlayer("p1");
            let comps = new tt2.QFrame_Comp_QAni(player);

            obj.AddComponent(comps);

            if (i % 2 == 0) {
                //圆形 Collider
                let compc = new tt2.QFrame_Comp_Collider_Circle();
                compc.radius = 32;
                compc.debugColor.R = 1;

                compc.OnHit = (a, b) => {
                    //console.log("碰撞发生：" + a.GetType() + "," + b.GetType());
                }
                obj.AddComponent(compc);

                //碰撞组1，只能和2碰撞（1和 1 不碰）
                //这个操作需要在AddComponent 之后做
                compc.SetCollider(1, tt2.QFrame_ColliderMask(2));
            }
            else {
                //Box Collider
                let compc = new tt2.QFrame_Comp_Collider_Box();
                compc.width = 64;
                compc.height = 64;
                compc.pivotX = 32;
                compc.pivotY = 32;
                compc.debugColor.B = 1;

                // compc.OnHit = (a, b) => {
                //     console.log("碰撞发生：" + a.GetType() + "," + b.GetType());
                // }
                obj.AddComponent(compc);

                //碰撞组2，只能和1碰撞
                compc.SetCollider(2, tt2.QFrame_ColliderMask(1));
            }

            this.aniobj.AddChild(obj);
        }
    }

    OnExit(): void {

    }

    angle: number = 0;
    OnUpdate(delta: number): void {

        this.angle += delta;
        if (this.angle > Math.PI * 2)
            this.angle = 0;


        for (var i = 0; i < this.aniobj.GetChildrenCount(); i++) {
            let obj = this.aniobj.GetChild(i);
            //obj.tran.X = Math.random() * 200
            //obj.tran.Y = Math.random() * 400;

            //不需要旋转时将角度设置为null 可以提高性能
            if (this.angle < 0.01)
                obj.angle = null;
            else
                obj.angle = this.angle;
            //tt2.matrix3x2.SetScaleAndAngle(tran,0.25,0.25,Math.random() * Math.PI * 2);
            //tran.mat2.SetAngle();
        }

        this.scene.OnUpdate(delta);
    }
    OnRender(): void {
        this.scene.OnRender();
    }
}