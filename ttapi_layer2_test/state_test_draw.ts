


import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"
import { State_TestAll } from "./state_testall.js";


import { Test_UITool } from "./test_uitool.js";

export class State_Test_Batcher<T> implements tt2.QFrame_IState<T>
{
    app: tt2.QFrame_App<T>;
    hasinited: boolean
    OnInit(statemgr: tt2.QFrame_App<T>): void {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }

    cats: tt.Sprite;
    atlas: tt.Atlas;
    async StartAsync(): Promise<void> {

        this.cats = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));
        let data = await tt.loader.LoadImageDataAsync(Test_UITool.getResPath("p1.jpg"), true);

        this.atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync(Test_UITool.getResPath("splittex_pack0.png.json"));


        //加一个退出按钮
        let btn = await Test_UITool.CreateTestButton(this.app.font, "<--");
        btn.localRect.setByRect(new tt.Rectangle(50, 100, 150, 50));
        this.app.canvas.addChild(btn);
        btn.OnClick = () => {
            this.app.ChangeState(new State_TestAll());
        }

        //中心看中心
        this.app.batcherBottom.LookAt.X = this.app.target.getWidth() / 2;
        this.app.batcherBottom.LookAt.Y = this.app.target.getHeight() / 2;
        this.hasinited = true;
    }
    OnExit(): void {
        this.app.canvas.removeChildAll();
    }
    OnUpdate(delta: number): void {
        if (!this.hasinited) return;

    }
    OnRender(): void {
        if (!this.hasinited) return;
        let b = this.app.batcherBottom;
        this.app.batcherBottom.BeginDraw(this.app.target);
        this.cats.Render(b, new tt.Vector2(0, 0), new tt.Vector2(0.5, 0.5), tt.Color.White);

        let w = this.app.target.getWidth();
        let h = this.app.target.getHeight();


        for (var i = 0; i < 256; i++) {
            var iss = i % this.atlas.allsprite.length;
            var s = this.atlas.allsprite[iss];
            s.Render(b, new tt.Vector2(Math.random() * w, Math.random() * h / 2),
                new tt.Vector2(1, 1));
            //this.drawRect(ltex, 0, new tt.Rectangle(Math.random() * w, Math.random() * h, 12, 12));
        }
        let inputscale = tt.graphic.getFinalScale();
        let ps = tt.input.GetInputPoints();
        for (var i = 0; i < ps.length; i++) {
            if (ps[i].press) {
                var iss = ((Math.random() * 1000) | 0) % this.atlas.allsprite.length;
                var s = this.atlas.allsprite[iss];
                if (s == undefined)
                    continue;
                console.log("inputscale=" + inputscale + " id = " + ps[i].id + " i =" + i);
                s.Render(b, new tt.Vector2(ps[i].x * inputscale - 64, ps[i].y * inputscale - 64),
                    new tt.Vector2(1, 1), tt.Color.White);

            }
        }
        this.app.batcherBottom.EndDraw();
    }
}