

import { tt } from "../../ttapi_interface/ttapi.js"
import * as tt2 from "../../ttapi_layer2/ttlayer2.js"


import { Test_UITool } from "../test_uitool.js";
import { State_Test_UI } from "./state_test_ui.js";


//这里用一个T，就是不明确UserData的类型而已，测试程序不用那个
export class State_Test_UI_Panel_Unlimit<T> implements tt2.QFrame_IState<T>
{
    app: tt2.QFrame_App<T>;

    sprite: tt.Sprite;

    hasinited: boolean
    OnInit(statemgr: tt2.QFrame_App<T>): void {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }

    unlimit_update_elem(txt: string, elem: tt2.QUI_IElement): tt2.QUI_IElement {
        let viewelem: tt2.QUI_Container = null;
        if (elem == null) {
            //init mode
            viewelem = new tt2.QUI_Container();
            viewelem.localRect.setHPosFill();
            viewelem.localRect.setVPosByTopBorder(32);

            let img = new tt2.QUI_Image(this.sprite);
            viewelem.addChild(img);
            img.localRect.setByRect(new tt.Rectangle(1, 1, 30, 30));

            let label = new tt2.QUI_Label(this.app.font, "deftext.");
            //label.cut = true;
            viewelem.addChild(label);

            label.localRect.setHPosFill(64, 0);
            label.localRect.setVPosFill();
        }
        else {
            viewelem = elem as tt2.QUI_Container;
        }
        if (txt != null) {
            (viewelem.getChild(1) as tt2.QUI_Label).text = txt;
        }
        return viewelem;
    }
    async StartAsync(): Promise<void> {


        this.sprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));

        //this.atlas = await ResMgr.LoadAtlasAsync("data/splittex_pack0.png");




        //1.Panel
        {
            this.addLabel("1.Panel 面板的特点是会裁剪");
            let panel = new tt2.QUI_Panel_Scroll_Unlimit<string>(this.unlimit_update_elem.bind(this));
            panel.borderElement = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);

            this.app.canvas.addChild(panel)
            panel.localRect.offsetX1 = 50;
            panel.localRect.offsetY1 = this.testY;
            panel.localRect.offsetX2 = panel.localRect.offsetX1 + 350;
            panel.localRect.offsetY2 = panel.localRect.offsetY1 + 250;

            for (var i = 0; i < 100; i++) {
                panel.getItems().push("newtime:" + i);
            }
        }


        this.app.target.ClearColor = new tt.Color(0, 0, 0, 1.0);





        //加一个退出按钮
        let btn = await Test_UITool.CreateTestButton(this.app.font, "<--");
        btn.localRect.setByRect(new tt.Rectangle(50, 50, 150, 50));
        this.app.canvas.addChild(btn);
        btn.OnClick = () => {
            this.app.ChangeState(new State_Test_UI());
        }

        this.hasinited = true;
    }
    testY: number = 150;
    private addLabel(text: string, height: number = 25): tt2.QUI_Label {
        let label = new tt2.QUI_Label(this.app.font, text);
        this.app.canvas.addChild(label);
        label.halign = tt2.QUI_HAlign.Left;
        label.valign = tt2.QUI_VAlign.Top;
        label.localRect.setByRect(new tt.Rectangle(50, this.testY, this.app.target.getWidth() - 100, height));
        label.fontScale = new tt.Vector2(2, 2);
        this.testY += height;
        return label;
    }
    private updatePos(e: tt2.QUI_IElement): void {
        let xadd = 50 - e.localRect.offsetX1;
        let yadd = this.testY - e.localRect.offsetY1;
        let height = e.localRect.offsetY2 - e.localRect.offsetY1
        e.localRect.offsetX1 += xadd;
        e.localRect.offsetX2 += xadd;
        e.localRect.offsetY1 += yadd;
        e.localRect.offsetY2 += yadd;
        this.testY += height + 15;
    }

    OnExit(): void {
        this.app.canvas.removeChildAll();
    }
    OnUpdate(delta: number): void {

    }
    OnRender(): void {

    }
}