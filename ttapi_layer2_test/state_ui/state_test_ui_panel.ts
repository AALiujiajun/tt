

import { tt } from "../../ttapi_interface/ttapi.js"
import * as tt2 from "../../ttapi_layer2/ttlayer2.js"


import { Test_UITool } from "../test_uitool.js";
import { State_Test_UI } from "./state_test_ui.js";


//这里用一个T，就是不明确UserData的类型而已，测试程序不用那个
export class State_Test_UI_Panel<T> implements tt2.QFrame_IState<T>
{
    app: tt2.QFrame_App<T>;

    hasinited: boolean
    OnInit(statemgr: tt2.QFrame_App<T>): void {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }

    async StartAsync(): Promise<void> {




        //this.atlas = await ResMgr.LoadAtlasAsync("data/splittex_pack0.png");




        //1.Panel
        {
            this.addLabel("1.Panel 面板的特点是会裁剪");
            let panel = new tt2.QUI_Panel();
            panel.borderElement = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);

            this.app.canvas.addChild(panel)
            panel.localRect.offsetX1 = 50;
            panel.localRect.offsetY1 = this.testY;
            panel.localRect.offsetX2 = panel.localRect.offsetX1 + 350;
            panel.localRect.offsetY2 = panel.localRect.offsetY1 + 250;
            this.testY += 275;
            {
                let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));
                let catimage = new tt2.QUI_Image(catSprite);
                panel.addChild(catimage)
                catimage.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));

                let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync(Test_UITool.getResPath("splittex_pack0.png.json"));
                for (var i = 0; i < 5; i++) {
                    var iss = i % atlas.allsprite.length;
                    var s = atlas.allsprite[iss];
                    let spriteimage = new tt2.QUI_Image(s);
                    panel.addChild(spriteimage)
                    spriteimage.localRect.offsetX1 = catimage.localRect.offsetX1 + 100 * (i + 1);
                    spriteimage.localRect.offsetY1 = catimage.localRect.offsetY1;
                    spriteimage.localRect.offsetX2 = spriteimage.localRect.offsetX1 + s.totalWidth * 1;
                    spriteimage.localRect.offsetY2 = spriteimage.localRect.offsetY1 + s.totalHeight * 1;
                }

                let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                panel.addChild(imagescale9)
                imagescale9.localRect.offsetX1 = 300;
                imagescale9.localRect.offsetY1 = 100;
                imagescale9.localRect.offsetX2 = imagescale9.localRect.offsetX1 + 100;
                imagescale9.localRect.offsetY2 = imagescale9.localRect.offsetY1 + 100;

                let btn = await Test_UITool.CreateTestButton(this.app.font, "ppp");
                panel.addChild(btn)
                btn.localRect.setByRect(new tt.Rectangle(300, 200, 150, 50));

            }
        }


        //2.ScrollPanel
        {
            this.addLabel("2.ScrollPanel 可滚动");
            let panel = new tt2.QUI_Panel_Scroll();
            panel.borderElement = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
            panel.dragDirection = tt2.QUI_DragDriection.UpToDown;
            panel.panelWidth = 500;
            panel.panelHeight = 400;
            this.app.canvas.addChild(panel)
            panel.localRect.offsetX1 = 50;
            panel.localRect.offsetY1 = this.testY;
            panel.localRect.offsetX2 = panel.localRect.offsetX1 + 350;
            panel.localRect.offsetY2 = panel.localRect.offsetY1 + 250;
            this.testY += 275;
            {
                let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));
                let catimage = new tt2.QUI_Image(catSprite);
                panel.addChild(catimage)
                catimage.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));

                let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync(Test_UITool.getResPath("splittex_pack0.png.json"));
                for (var i = 0; i < 5; i++) {
                    var iss = i % atlas.allsprite.length;
                    var s = atlas.allsprite[iss];
                    let spriteimage = new tt2.QUI_Image(s);
                    panel.addChild(spriteimage)
                    spriteimage.localRect.offsetX1 = catimage.localRect.offsetX1 + 100 * (i + 1);
                    spriteimage.localRect.offsetY1 = catimage.localRect.offsetY1;
                    spriteimage.localRect.offsetX2 = spriteimage.localRect.offsetX1 + s.totalWidth * 1;
                    spriteimage.localRect.offsetY2 = spriteimage.localRect.offsetY1 + s.totalHeight * 1;
                }

                let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                panel.addChild(imagescale9)
                imagescale9.localRect.offsetX1 = 300;
                imagescale9.localRect.offsetY1 = 100;
                imagescale9.localRect.offsetX2 = imagescale9.localRect.offsetX1 + 100;
                imagescale9.localRect.offsetY2 = imagescale9.localRect.offsetY1 + 100;

                let btn = await Test_UITool.CreateTestButton(this.app.font, "ppp");
                panel.addChild(btn)
                btn.localRect.setByRect(new tt.Rectangle(300, 200, 150, 50));

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