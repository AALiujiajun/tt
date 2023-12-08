

import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"
import { State_Test_Ani } from "./state_test_ani.js";
import { State_Test_Ani_Rotate } from "./state_test_ani_rotate.js";
import { State_Test_Batcher } from "./state_test_draw.js";
import { State_Test_Joy } from "./state_test_joy.js";
import { State_Test_UI } from "./state_ui/state_test_ui.js";
import { State_Test_Box2D } from "./state_test_box2d.js";

import { Test_UITool } from "./test_uitool.js";
import { State_Test_Box2D_Scene } from "./state_test_box2d_scene.js";


//这里用一个T，就是不明确UserData的类型而已，测试程序不用那个
export class State_TestAll<T> implements tt2.QFrame_IState<T>
{
    app: tt2.QFrame_App<T>;

    hasinited: boolean
    OnInit(statemgr: tt2.QFrame_App<T>): void {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }

    async StartAsync(): Promise<void> {

        let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));


        //this.atlas = await ResMgr.LoadAtlasAsync("data/splittex_pack0.png");

        // let catimage = new tt2.QUI_Image(catSprite);
        // catimage.color.A = 0.5;
        // catimage.color.R = 1.0;
        // this.app.canvas.addChild(catimage)

        //Button 需要配置  ElemNormal 和 ElemClick 两个外观组件
        await this.addTestBtn("1.Test Batcher绘制.", () => {
            this.app.ChangeState(new State_Test_Batcher());
        });

        await this.addTestBtn("2.虚拟摇杆 Test.", () => {
            this.app.ChangeState(new State_Test_Joy());
        });

        await this.addTestBtn("3.动画 Test.", () => {
            this.app.ChangeState(new State_Test_Ani());
        });
        await this.addTestBtn("3.1.动画 Rotate Test.", () => {
            this.app.ChangeState(new State_Test_Ani_Rotate());
        });
        await this.addTestBtn("4.UI Test.", async () => {
            this.app.ChangeState(new State_Test_UI());
        });

        await this.addTestBtn("5.Box2d Test.", async () => {
            this.app.ChangeState(new State_Test_Box2D());
        });
        await this.addTestBtn("5.Box2d Test(场景方式).", async () => {
            this.app.ChangeState(new State_Test_Box2D_Scene());
        });
        this.app.target.ClearColor = new tt.Color(0, 0, 0, 1.0);

        this.hasinited = true;
    }
    testbtn_Y: number = 100;

    async addTestBtn(text: string, callback: () => void): Promise<void> {
        let btn = await Test_UITool.CreateTestButton(this.app.font, text);

        //绝对定位函数，依据左上角定位
        //btn.localRect.setByRect(new tt.Rectangle(50, this.testbtn_Y, this.app.target.getWidth() - 100, 50));
        btn.localRect.radioX1 = 0; // x1 依据0%定位，即最左侧
        btn.localRect.radioX2 = 1; // x2 依据100% 定位，即最右侧
        btn.localRect.offsetX1 = 10; //最左侧+100
        btn.localRect.offsetX2 = -10; //最右侧-100

        btn.localRect.radioY1 = 0; // y1 根据0%定位，即顶端
        btn.localRect.radioY2 = 0;// y2 根据0%定位，即顶端
        btn.localRect.offsetY1 = this.testbtn_Y;//最顶端 + this.testbtn_Y
        btn.localRect.offsetY2 = btn.localRect.offsetY1 + 50; //再加50


        this.testbtn_Y += 75;
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