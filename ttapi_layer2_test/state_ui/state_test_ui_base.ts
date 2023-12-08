

import { tt } from "../../ttapi_interface/ttapi.js"
import * as tt2 from "../../ttapi_layer2/ttlayer2.js"


import { Test_UITool } from "../test_uitool.js";
import { State_Test_UI } from "./state_test_ui.js";


//这里用一个T，就是不明确UserData的类型而已，测试程序不用那个
export class State_Test_UI_Base<T> implements tt2.QFrame_IState<T>
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




        //Image
        {
            this.addLabel("1.Image");
            let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));
            let catimage = new tt2.QUI_Image(catSprite);
            this.app.canvas.addChild(catimage)
            catimage.localRect.setByRect(new tt.Rectangle(0, 0, 100, 100));//只需要给个尺寸，UpdatePos会调整
            this.updatePos(catimage);

            let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync(Test_UITool.getResPath("splittex_pack0.png.json"));
            for (var i = 0; i < 5; i++) {
                var iss = i % atlas.allsprite.length;
                var s = atlas.allsprite[iss];
                let spriteimage = new tt2.QUI_Image(s);
                this.app.canvas.addChild(spriteimage)
                spriteimage.localRect.offsetX1 = catimage.localRect.offsetX1 + 100 * (i + 1);
                spriteimage.localRect.offsetY1 = catimage.localRect.offsetY1;
                spriteimage.localRect.offsetX2 = spriteimage.localRect.offsetX1 + s.totalWidth * 1;
                spriteimage.localRect.offsetY2 = spriteimage.localRect.offsetY1 + s.totalHeight * 1;
            }

            let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
            this.app.canvas.addChild(imagescale9)
            imagescale9.localRect.offsetX1 = catimage.localRect.offsetX1 + 100 * 6;
            imagescale9.localRect.offsetY1 = catimage.localRect.offsetY1;
            imagescale9.localRect.offsetX2 = imagescale9.localRect.offsetX1 + 100;
            imagescale9.localRect.offsetY2 = imagescale9.localRect.offsetY1 + 100;
        }
        //Label
        {
            this.addLabel("2.Label");
            {
                let l = this.addLabel("label 1 居中对齐", 50);
                l.halign = tt2.QUI_HAlign.Middle;
                l.valign = tt2.QUI_VAlign.Middle;
                l.color = new tt.Color(1, 0.3, 0.3, 1.0);

                let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                this.app.canvas.addChild(imagescale9)
                imagescale9.localRect.offsetX1 = l.localRect.offsetX1;
                imagescale9.localRect.offsetY1 = l.localRect.offsetY1;
                imagescale9.localRect.offsetX2 = l.localRect.offsetX2;
                imagescale9.localRect.offsetY2 = l.localRect.offsetY2;
            }
            {
                let l = this.addLabel("label 2 底对齐", 50);
                l.halign = tt2.QUI_HAlign.Right;
                l.valign = tt2.QUI_VAlign.Bottom;
                l.color = new tt.Color(1, 0.3, 0.3, 1.0);

                let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                this.app.canvas.addChild(imagescale9)
                imagescale9.localRect.offsetX1 = l.localRect.offsetX1;
                imagescale9.localRect.offsetY1 = l.localRect.offsetY1;
                imagescale9.localRect.offsetX2 = l.localRect.offsetX2;
                imagescale9.localRect.offsetY2 = l.localRect.offsetY2;
            }
            this.testY += 15;
        }
        //JoyStick
        {
            this.addLabel("3.JoyStick 下面的框框是触发区");
            let joystick = new tt2.QUI_JoyStick();
            this.app.canvas.addChild(joystick);

            let radio = tt.graphic.getDevicePixelRadio();//设备像素比例
            let joystick_touchArea = new tt.Rectangle(50, this.testY, 150 * radio, 150 * radio);
            {


                joystick.spriteJoyBack = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("uiimg/joyback.png"));
                joystick.spriteJoyHot = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("uiimg/joyhot.png"));
                //let canvassize = this.cdata.canvas.getWorldRect();

           
                //考虑这个radio，就能让不同设备尺寸差不多
                //jotstick 默认撑满父容器，这里就是全屏

                //touchArea 表示 触摸底板的限制区域 

                //摇杆中心点可以偏离底板多远
                joystick.hotMaxDist = 50 * radio;
                joystick.touchBackSize = new tt.Vector2(128 * radio, 128 * radio);
                joystick.touchHotSize = new tt.Vector2(80 * radio, 80 * radio);

                this.testY += joystick_touchArea.Height + 15;
            }
            let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
            this.app.canvas.addChild(imagescale9)
            joystick.localRect.setByRect(joystick_touchArea);//localrect 是控件区域，touchArea 可以小于控件区域
            imagescale9.localRect.setByRect(joystick_touchArea);

        }
        {
            this.addLabel("4.TextBox 弹框型文本框");
            let textbox = new tt2.QUI_TextBox_Prompt(this.app.font, "hello");
            textbox.localRect.setByRect(new tt.Rectangle(0, 0, 300, 30));
            textbox.fontScale = new tt.Vector2(2, 2);
            let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
            textbox.border = imagescale9;


            this.app.canvas.addChild(textbox)
            this.updatePos(textbox);
            this.testY += 15
        }
        {
            this.addLabel("4.2 TextBox 键盘输入型文本框");
            this.addLabel("移动用不着，暂缓缺");
            this.testY += 15
        }
        {
            this.addLabel("5 标准按钮");
            let btn = await Test_UITool.CreateTestButton(this.app.font, "按我");
            btn.localRect.setByRect(new tt.Rectangle(50, 50, 150, 50));
            this.app.canvas.addChild(btn);
            this.updatePos(btn);
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