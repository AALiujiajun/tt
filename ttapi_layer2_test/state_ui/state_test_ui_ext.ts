

import { tt } from "../../ttapi_interface/ttapi.js"
import * as tt2 from "../../ttapi_layer2/ttlayer2.js"


import { Test_UITool } from "../test_uitool.js";
import { State_Test_UI } from "./state_test_ui.js";


//这里用一个T，就是不明确UserData的类型而已，测试程序不用那个
export class State_Test_UI_Ext<T> implements tt2.QFrame_IState<T>
{
    app: tt2.QFrame_App<T>;

    hasinited: boolean
    OnInit(statemgr: tt2.QFrame_App<T>): void {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }
    bar: tt2.QUI_Bar;

    async StartAsync(): Promise<void> {




        //this.atlas = await ResMgr.LoadAtlasAsync("data/splittex_pack0.png");




        //test drag btn
        {
            this.addLabel("1. DragButton");
            let btn = this.addDragBtn("Drag");
            btn.localRect.setByRect(new tt.Rectangle(50, 50, 150, 50));
            this.app.canvas.addChild(btn);
            this.updatePos(btn);
            {//drag button 的特别就是事件设计不同，可以通过他的事件来驱动拖拽效果
                let _ccx = 0;
                let _ccy = 0;
                btn.OnDragStart = (x, y) => {
                    _ccx = btn.localRect.offsetX1;
                    _ccy = btn.localRect.offsetY1;
                }
                btn.OnDrag = (x, y, bx, by) => {
                    let w = btn.localRect.offsetX2 - btn.localRect.offsetX1;
                    let h = btn.localRect.offsetY2 - btn.localRect.offsetY1;
                    btn.localRect.offsetX1 = _ccx + (x - bx);
                    btn.localRect.offsetY1 = _ccy + (y - by);
                    btn.localRect.offsetX2 = btn.localRect.offsetX1 + w
                    btn.localRect.offsetY2 = btn.localRect.offsetY1 + h
                };
            }


            //drag button 的特别就是事件设计不同，可以通过他的事件来驱动拖拽效果
            //下面来拖拽一只猫
            let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));
            let catimage = new tt2.QUI_Image(catSprite);
            this.app.canvas.addChild(catimage)
            catimage.localRect.setByRect(new tt.Rectangle(100, 0, 100, 100));//只需要给个尺寸，UpdatePos会调整
            this.updatePos(catimage);

            let btn2 = this.addDragBtn("Drag2");
            let _cx = 0;
            let _cy = 0;
            btn2.localRect.setByRect(new tt.Rectangle(50, 50, 150, 50));
            catimage.addChild(btn2);
            btn2.OnDragStart = (x, y) => {
                _cx = catimage.localRect.offsetX1;
                _cy = catimage.localRect.offsetY1;
            }
            btn2.OnDrag = (x, y, bx, by) => {
                let w = catimage.localRect.offsetX2 - catimage.localRect.offsetX1;
                let h = catimage.localRect.offsetY2 - catimage.localRect.offsetY1;
                catimage.localRect.offsetX1 = _cx + (x - bx);
                catimage.localRect.offsetY1 = _cy + (y - by);
                catimage.localRect.offsetX2 = catimage.localRect.offsetX1 + w
                catimage.localRect.offsetY2 = catimage.localRect.offsetY1 + h
            };
            this.testY += 15;
        }

        //test toggle
        {
            this.addLabel("2. Toggle & Overlay");
            let toggle = this.addToggle("true", "false");

            toggle.localRect.setByRect(new tt.Rectangle(50, 50, 150, 50));
            this.app.canvas.addChild(toggle);
            this.updatePos(toggle);
            this.addLabel("为 true 时打开一个overlay,toggle 以上都不能点击了");

            let overlay = new tt2.QUI_Overlay();
            overlay.Enable = false;
            this.app.canvas.addChild(overlay);

            toggle.OnChange = (v) => {
                let height = toggle.getWorldRect().Y;
                let width = this.app.canvas.getWorldRect().Width;
                overlay.localRect.setByRect(new tt.Rectangle(0, 0, width, height));
                overlay.Enable = v;
            }
            this.testY += 15;
        }

        //test bar
        {
            this.addLabel("3. Bar");
            this.bar = await this.addBar();
            this.app.canvas.addChild(this.bar);
            this.updatePos(this.bar);
            this.testY += 15;
            let bar2txt = this.addLabel("可以拖拽 数字滚动条");
            let bar2 = await this.addBar();
            bar2.scroll = tt2.QUI_BarScrollMode.ScrollByTouchDrag;
            bar2.OnChange = (v) => {
                bar2txt.text = "可以拖拽 数字滚动条=" + ((v * 100) | 0);
            }
            this.app.canvas.addChild(bar2);
            this.updatePos(bar2);
            this.testY += 15;

            let bar3 = await this.addScrollBar();
            bar3.localRect.setByRect(new tt.Rectangle(500, this.testY - 500, 50, 500));
            this.app.canvas.addChild(bar3);
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
    private addDragBtn(text: string): tt2.QUI_DragButton {
        let btn = new tt2.QUI_DragButton();
        //let text="Drag";
        {
            let btnnormal = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
            btnnormal.localRect.setAsFill();
            btn.ElemNormal = btnnormal;
            let label = new tt2.QUI_Label(this.app.font, text);
            btnnormal.addChild(label);
            label.localRect.setAsFill();
            label.localRect.radioX1 = 0.2;
            label.localRect.radioX2 = 0.8;
            label.fontScale = new tt.Vector2(2.0, 2.0);
            label.cut = true;//超出边界是否裁剪
            let btnpress = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
            btnpress.localRect.setAsFill();
            btnpress.color.R = 0.3;
            btnpress.color.G = 0.5;
            btn.ElemPress = btnpress;
            let labelPress = new tt2.QUI_Label(this.app.font, text);
            labelPress.color.R = 0.3;
            labelPress.color.G = 0.5;
            labelPress.fontScale = new tt.Vector2(1.5, 1.5);
            labelPress.cut = true;
            btnpress.addChild(labelPress);
            labelPress.localRect.setAsFill();
            labelPress.localRect.radioX1 = 0.2;
            labelPress.localRect.radioX2 = 0.8;
        }
        return btn;
    }
    private addToggle(text_true: string, text_false: string): tt2.QUI_Toggle {
        let btn = new tt2.QUI_Toggle();
        //let text="Drag";
        {
            //toogle 需要设置四个外观
            {
                let elemtrue = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                elemtrue.localRect.setAsFill();

                let label = new tt2.QUI_Label(this.app.font, text_true);
                elemtrue.addChild(label);
                label.localRect.setAsFill();
                label.fontScale = new tt.Vector2(2, 2);

                let elemtruedown = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                elemtruedown.localRect.setAsFill();
                elemtruedown.color.R = 0.3;
                elemtruedown.color.G = 0.5;
                let labelPress = new tt2.QUI_Label(this.app.font, text_true);
                labelPress.color.R = 0.3;
                labelPress.color.G = 0.5;
                labelPress.fontScale = new tt.Vector2(1.5, 1.5);
                labelPress.cut = true;
                elemtruedown.addChild(labelPress);
                labelPress.localRect.setAsFill();
                labelPress.localRect.radioX1 = 0.2;
                labelPress.localRect.radioX2 = 0.8;
                btn.ElemTrue = elemtrue;
                btn.ElemTrueDown = elemtruedown;
            }

            {
                let elemfalse = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                elemfalse.localRect.setAsFill();

                let label = new tt2.QUI_Label(this.app.font, text_false);
                elemfalse.addChild(label);
                label.localRect.setAsFill();
                label.fontScale = new tt.Vector2(2, 2);

                let elemfalsedown = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                elemfalsedown.localRect.setAsFill();
                elemfalsedown.color.R = 0.3;
                elemfalsedown.color.G = 0.5;
                let labelPress = new tt2.QUI_Label(this.app.font, text_false);
                labelPress.color.R = 0.3;
                labelPress.color.G = 0.5;
                labelPress.fontScale = new tt.Vector2(1.5, 1.5);
                labelPress.cut = true;
                elemfalsedown.addChild(labelPress);
                labelPress.localRect.setAsFill();
                labelPress.localRect.radioX1 = 0.2;
                labelPress.localRect.radioX2 = 0.8;
                btn.ElemFalse = elemfalse;
                btn.ElemFalseDown = elemfalsedown;
            }

        }
        return btn;
    }

    private async addBar(): Promise<tt2.QUI_Bar> {
        let bar = new tt2.QUI_Bar();
        let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));
        let catimage = new tt2.QUI_Image(catSprite);
        bar.spriteValue = catimage;
        bar.spriteBackground = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
        return bar;
    }
    private async addScrollBar(): Promise<tt2.QUI_ScrollBar> {
        let bar = new tt2.QUI_ScrollBar();
        let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(Test_UITool.getResPath("p1.jpg"));
        let catimage = new tt2.QUI_Image(catSprite);
        bar.spriteValue = catimage;
        bar.spriteBackground = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
        return bar;
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
        var v = this.bar.getValue();
        v += delta;
        if (v > 1.0) v = 0;
        this.bar.setValue(v);
    }
    OnRender(): void {

    }
}