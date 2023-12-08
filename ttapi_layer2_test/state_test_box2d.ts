
import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"


export class State_Test_Box2D<T> extends tt2.b2ContactListener implements tt2.QFrame_IState<T>
{
    world: tt2.b2World;
    bodys: tt2.b2Body[] = [];
    app: tt2.QFrame_App<T>;
    b2drawer: tt2.b2Drawer;//box2d 的 debug render
    sprite: tt.Sprite;

    OnInit(statemgr: tt2.QFrame_App<T>): void {
        this.app = statemgr;
        this.world = tt2.b2World.Create({ x: 0, y: 0 });
        this.sprite = new tt.Sprite(tt.graphic.getWhiteTexture(), null);
        this.sprite.pixelwidth = 50;
        this.sprite.pixelheight = 50;


        for (let i = 0; i < 10; i++) {
            let b = this.world.CreateBody(
                { type: tt2.b2BodyType.b2_dynamicBody }
            );

            let psharp: tt2.b2Shape = null;
            if (i % 2 == 0) {
                psharp = new tt2.b2CircleShape();
                psharp.m_radius = 25;
            }
            else {
                let boxs = psharp = new tt2.b2PolygonShape();
                boxs.SetAsBox(25, 25);
            }

            let f = b.CreateFixture({ shape: psharp, isSensor: true });
            f.SetUserData("body:" + i);
            if (i % 2 == 0) {
                //属于第1组，可以碰到第二组
                f.SetFilterData({ categoryBits: 1 << 0, maskBits: 1 << 1 });
            }
            else
            {
                //属于第2组，可以碰到第1组
                f.SetFilterData({ categoryBits: 1 << 1, maskBits: 1 << 0 });
            }
            b.SetTransformXY(i * 10, 0, 0);
            //b.SetUserData("body:" + i);
            this.bodys.push(b);
        }

        //设置碰撞关系

        this.world.SetContactListener(this);

    }

    public  BeginContact(_contact: tt2.b2Contact): void {
        console.log("hit " + _contact.GetFixtureA().GetUserData() + " " + _contact.GetFixtureB().GetUserData()
        );
    }
    OnExit(): void {

    }
    b1: boolean = false;
    OnUpdate(delta: number): void {
        //this.b1 = !this.b1;
        // if (this.b1) {
        //     for (var i = 0; i < 10; i++) {
        //         let b = this.bodys[i];
        //         b.SetTransformXY(i * 10, 0, 0);
        //         this.bodys.push(b);
        //     }
        // }
        // else
        {
            for (var i = 0; i < 10; i++) {
                let b = this.bodys[i];
                b.SetTransformXY(Math.random() * 400, Math.random() * 400, 0);
                //this.bodys.push(b);
            }
        }

        this.world.Step(delta, {
            velocityIterations: 0,
            positionIterations: 0,
        });
    }
    OnRender(): void {
        if (this.b2drawer == null) {
            this.b2drawer = new tt2.b2Drawer(this.app.batcherBottom);
        }
        this.app.batcherBottom.BeginDraw(this.app.target);

        //tt2.DrawAABBs(this.b2drawer, this.world);
        for (var i = 0; i < 10; i++) {
            let b = this.bodys[i];
            let p = b.GetPosition();
            this.sprite.Render(this.app.batcherBottom, new tt.Vector2(p.x - 25, p.y - 25), tt.Vector2.One);

        }

        //debug 绘制物理
        tt2.DrawShapes(this.b2drawer, this.world);
        tt2.DrawAABBs(this.b2drawer, this.world)
        // tt2.DrawJoints(this.b2drawer, this.world);
        this.app.batcherBottom.EndDraw();
    }
}