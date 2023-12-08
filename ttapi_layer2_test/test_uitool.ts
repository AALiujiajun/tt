import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"
export class Test_UITool {
    private static _respath: string;
    static getResRootPath(): string {
        return this._respath;
    }
    static InitResPath(path: string): void {
        this._respath = path;
        if (this._respath.substring(this._respath.length - 1, this._respath.length) != "/")
            this._respath += "/";
    }
    static getDefaultFontResPath(): string {
        return this._respath + "hzk12.ttfont.bin";
    }
    static getResPath(name: string): string {
        return this._respath + name;
    }
    static btn_borderscale9: tt2.QUI_Scale9;
    static async CreateTestButton(font: tt.Font, text: string): Promise<tt2.QUI_Button> {
        let at = await tt2.QFrame_ResMgr.LoadAtlasAsync(this._respath + "uires_pack0.ttatlas.json");
        var btnborder = at.GetSprite("border");

        if (this.btn_borderscale9 == null) {
            this.btn_borderscale9 = new tt2.QUI_Scale9(btnborder, new tt.Border(4, 4, 4, 4));
        }



        let btn = new tt2.QUI_Button();
        //this.cdata.canvas.addChild(btn);
        {
            let btnnormal = new tt2.QUI_ImageScale9(this.btn_borderscale9);
            btnnormal.localRect.setAsFill();
            btn.ElemNormal = btnnormal;
            let label = new tt2.QUI_Label(font, text);
            btnnormal.addChild(label);
            label.localRect.setAsFill();
            label.localRect.radioX1 = 0.2;
            label.localRect.radioX2 = 0.8;
            label.fontScale = new tt.Vector2(2.0, 2.0);
            label.cut = true;//超出边界是否裁剪
            let btnpress = new tt2.QUI_ImageScale9(this.btn_borderscale9);
            btnpress.localRect.setAsFill();
            btnpress.color.R = 0.3;
            btnpress.color.G = 0.5;
            btn.ElemPress = btnpress;
            let labelPress = new tt2.QUI_Label(font, text);
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

    static async CreateJoyStick(rect: tt.Rectangle): Promise<tt2.QUI_JoyStick> {
        let joystick = new tt2.QUI_JoyStick();
        {


            joystick.spriteJoyBack = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(this.getResPath("uiimg/joyback.png"));
            joystick.spriteJoyHot = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(this.getResPath("uiimg/joyhot.png"));
            //let canvassize = this.cdata.canvas.getWorldRect();

            let radio = tt.graphic.getDevicePixelRadio();//设备像素比例
            //考虑这个radio，就能让不同设备尺寸差不多
            //jotstick 默认撑满父容器，这里就是全屏

            //touchArea 表示 触摸底板的限制区域 
            //joystick.touchArea = new tt.Rectangle(100 * radio, 100 * radio, rect.Width - 200 * radio, rect.Height - 200 * radio);
            //摇杆中心点可以偏离底板多远
            joystick.hotMaxDist = 50 * radio;
            joystick.touchBackSize = new tt.Vector2(128 * radio, 128 * radio);
            joystick.touchHotSize = new tt.Vector2(80 * radio, 80 * radio);
        }
        return joystick;
    }
}