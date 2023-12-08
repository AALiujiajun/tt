

import { tt } from "../../ttapi_interface/ttapi.js"
import * as tt2 from "../../ttapi_layer2/ttlayer2.js"
import { State_TestAll } from "../state_testall.js";


import { Test_UITool } from "../test_uitool.js";
import { State_Test_UI_Base } from "./state_test_ui_base.js";
import { State_Test_UI_Ext } from "./state_test_ui_ext.js";
import { State_Test_UI_Panel } from "./state_test_ui_panel.js";
import { State_Test_UI_Panel_Unlimit } from "./state_test_ui_panel_unlimit.js";
import { State_Test_UI_PanelSplit } from "./state_test_ui_split.js";

//这里用一个T，就是不明确UserData的类型而已，测试程序不用那个
export class State_Test_UI<T> implements tt2.QFrame_IState<T>
{
    app: tt2.QFrame_App<T>;

    hasinited: boolean
    OnInit(statemgr: tt2.QFrame_App<T>): void {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }

    async StartAsync(): Promise<void> {


        //加一个退出按钮
        let btn = await Test_UITool.CreateTestButton(this.app.font, "<--");
        btn.localRect.setByRect(new tt.Rectangle(50, 50, 150, 50));
        this.app.canvas.addChild(btn);
        btn.OnClick = () => {
            this.app.ChangeState(new State_TestAll());
        }


        //Button 需要配置  ElemNormal 和 ElemClick 两个外观组件
        await this.addTestBtn("基本控件测试.", new State_Test_UI_Base());


        await this.addTestBtn("扩展控件测试.", new State_Test_UI_Ext());

        await this.addTestBtn("面板测试.", new State_Test_UI_Panel());

        await this.addTestBtn("切分面板测试.", new State_Test_UI_PanelSplit());

        await this.addTestBtn("无限滚动面板测试.", new State_Test_UI_Panel_Unlimit());


        this.app.target.ClearColor = new tt.Color(0, 0, 0, 1.0);

        this.hasinited = true;
    }
    testbtn_Y: number = 150;

    async addTestBtn(text: string, goState: tt2.QFrame_IState<T>): Promise<void> {
        let btn = await Test_UITool.CreateTestButton(this.app.font, text);

        //绝对定位函数，依据左上角定位
        //btn.localRect.setByRect(new tt.Rectangle(50, this.testbtn_Y, this.app.target.getWidth() - 100, 50));
        btn.localRect.radioX1 = 0; // x1 依据0%定位，即最左侧
        btn.localRect.radioX2 = 1; // x2 依据100% 定位，即最右侧
        btn.localRect.offsetX1 = 100; //最左侧+100
        btn.localRect.offsetX2 = -100; //最右侧-100

        btn.localRect.radioY1 = 0; // y1 根据0%定位，即顶端
        btn.localRect.radioY2 = 0;// y2 根据0%定位，即顶端
        btn.localRect.offsetY1 = this.testbtn_Y;//最顶端 + this.testbtn_Y
        btn.localRect.offsetY2 = btn.localRect.offsetY1 + 50; //再加50


        this.testbtn_Y += 75;
        this.app.canvas.addChild(btn);
        btn.OnClick = () => {
            if (goState != null)
                this.app.ChangeState(goState);
        };
    }

    OnExit(): void {
        this.app.canvas.removeChildAll();
    }
    OnUpdate(delta: number): void {

    }
    OnRender(): void {

    }
}