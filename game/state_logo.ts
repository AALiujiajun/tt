import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"

import { State_JoyTest } from "./state_joytest.js";
import { State_Game } from "./state_game.js";
import { UITool } from "./uitool.js";
import { State_AniTest } from "./state_anitest.js";
import { UserData } from "./userdata.js";
import { State_SpriteTest } from "./state_spritetest.js";
import { State_AniTest2 } from "./state_anitest2.js";
export class State_Logo implements  tt2.QFrame_IState<UserData>
{
    app: tt2.QFrame_App<UserData>;
    hasinited: boolean
    OnInit(statemgr:  tt2.QFrame_App<UserData>): void {
        this.app = statemgr;
     
        this.hasinited = false;
        this.StartAsync();
    }

    async StartAsync(): Promise<void> {

        let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/p1.jpg");


        //this.atlas = await ResMgr.LoadAtlasAsync("data/splittex_pack0.png");

        let catimage = new tt2.QUI_Image(catSprite);
        catimage.color.A = 0.5;
        catimage.color.R = 1.0;
        this.app.canvas.addChild(catimage)

        //Button 需要配置  ElemNormal 和 ElemClick 两个外观组件
        await this.addTestBtn("图集Atlas Test.", () => {
            this.app.ChangeState(new State_SpriteTest());
        });

        await this.addTestBtn("虚拟摇杆 Test.", () => {
            this.app.ChangeState(new State_JoyTest());
        });

        await this.addTestBtn("动画 Test.", () => {
            this.app.ChangeState(new State_AniTest());
        });
        await this.addTestBtn("动画 Test2.", () => {
            this.app.ChangeState(new State_AniTest2());
        });
        // 进入游戏界面
        await this.addTestBtn("play", () => {
            this.app.ChangeState(new State_Game());
        });

        this.app.target.ClearColor = new tt.Color(0, 1.0, 0.5, 1.0);

        this.hasinited = true;
    }
    testbtn_Y: number = 100;
    async addTestBtn(text: string, callback: () => void): Promise<void> {
        let btn = await UITool.CreateButton(this.app.font, text);
        btn.localRect.setByRect(new tt.Rectangle(50, this.testbtn_Y, this.app.target.getWidth() - 100, 50));

        this.testbtn_Y += 100;
        this.app.canvas.addChild(btn);
        btn.OnClick = callback;
    }

    OnExit(): void {
        this.app.canvas.removeChildAll();
    }
    OnUpdate(delta: number): void {
        if (!this.hasinited) return;

    }
    OnRender(): void {

    }
}