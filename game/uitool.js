var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { tt } from "../ttapi_interface/ttapi.js";
import * as tt2 from "../ttapi_layer2/ttlayer2.js";
export class UITool {
    static CreateImg(img, font, text) {
        return __awaiter(this, void 0, void 0, function* () {
            let btnImg = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(img);
            //this.cdata.canvas.addChild(btn);
            let btnnormal = new tt2.QUI_Image(btnImg);
            btnnormal.localRect.setAsFill();
            if (text != null && text != "") {
                let label = new tt2.QUI_Label(font, text);
                btnnormal.addChild(label);
                label.localRect.setAsFill();
                label.localRect.radioX1 = 0.2;
                label.localRect.radioX2 = 0.8;
                label.fontScale = new tt.Vector2(2.0, 2.0);
                label.cut = true; //超出边界是否裁剪
            }
            return btnnormal;
        });
    }
    static CreateButtonByImg(img, font, text) {
        return __awaiter(this, void 0, void 0, function* () {
            let btnImg = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(img);
            let btn = new tt2.QUI_Button();
            //this.cdata.canvas.addChild(btn);
            {
                let btnnormal = new tt2.QUI_Image(btnImg);
                btnnormal.localRect.setAsFill();
                btn.ElemNormal = btnnormal;
                if (text != null && text != "") {
                    let label = new tt2.QUI_Label(font, text);
                    btnnormal.addChild(label);
                    label.localRect.setAsFill();
                    label.localRect.radioX1 = 0.2;
                    label.localRect.radioX2 = 0.8;
                    label.fontScale = new tt.Vector2(2.0, 2.0);
                    label.cut = true; //超出边界是否裁剪
                }
            }
            return btn;
        });
    }
    static CreateButton(font, text) {
        return __awaiter(this, void 0, void 0, function* () {
            let btnImgDark = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/btn1.png");
            let btnImg = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/btn2.png");
            let btn = new tt2.QUI_Button();
            //this.cdata.canvas.addChild(btn);
            {
                let btnnormal = new tt2.QUI_Image(btnImg);
                btnnormal.localRect.setAsFill();
                btn.ElemNormal = btnnormal;
                let label = new tt2.QUI_Label(font, text);
                btnnormal.addChild(label);
                label.localRect.setAsFill();
                label.localRect.radioX1 = 0.2;
                label.localRect.radioX2 = 0.8;
                label.fontScale = new tt.Vector2(2.0, 2.0);
                label.cut = true; //超出边界是否裁剪
                let btnpress = new tt2.QUI_Image(btnImgDark);
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
        });
    }
    static CreateJoyStick(rect) {
        return __awaiter(this, void 0, void 0, function* () {
            let joystick = new tt2.QUI_JoyStick();
            {
                joystick.spriteJoyBack = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/joyback.png");
                joystick.spriteJoyHot = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/joyhot.png");
                //let canvassize = this.cdata.canvas.getWorldRect();
                let radio = tt.graphic.getDevicePixelRadio(); //设备像素比例
                //考虑这个radio，就能让不同设备尺寸差不多
                //jotstick 默认撑满父容器，这里就是全屏
                //touchArea 表示 触摸底板的限制区域 
                //    joystick.touchArea = new tt.Rectangle(100 * radio, 100 * radio, rect.Width - 200 * radio, rect.Height - 200 * radio);
                //摇杆中心点可以偏离底板多远
                joystick.hotMaxDist = 50 * radio;
                joystick.touchBackSize = new tt.Vector2(128 * radio, 128 * radio);
                joystick.touchHotSize = new tt.Vector2(80 * radio, 80 * radio);
            }
            return joystick;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWl0b29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidWl0b29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTtBQUNoRCxPQUFPLEtBQUssR0FBRyxNQUFNLDZCQUE2QixDQUFBO0FBRWxELE1BQU0sT0FBTyxNQUFNO0lBRWYsTUFBTSxDQUFPLFNBQVMsQ0FBQyxHQUFXLEVBQUUsSUFBYSxFQUFFLElBQVk7O1lBRTNELElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwRSxrQ0FBa0M7WUFDOUIsSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7WUFFaEMsSUFBRyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLEVBQUU7Z0JBQy9CLElBQUksS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzVCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztnQkFDOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO2dCQUM5QixLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUEsVUFBVTthQUU5QjtZQUNELE9BQU8sU0FBUyxDQUFDO1FBQ3JCLENBQUM7S0FBQTtJQUVELE1BQU0sQ0FBTyxpQkFBaUIsQ0FBQyxHQUFXLEVBQUUsSUFBYSxFQUFFLElBQVk7O1lBQ25FLElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwRSxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUUvQixrQ0FBa0M7WUFDbEM7Z0JBQ0ksSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQyxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNoQyxHQUFHLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztnQkFDM0IsSUFBRyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFLEVBQUU7b0JBQy9CLElBQUksS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQzVCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztvQkFDOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO29CQUM5QixLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBQzNDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUEsVUFBVTtpQkFDN0I7YUFDRDtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRUQsTUFBTSxDQUFPLFlBQVksQ0FBQyxJQUFhLEVBQUUsSUFBWTs7WUFFakQsSUFBSSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDMUYsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDdEYsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7WUFFL0Isa0NBQWtDO1lBQ2xDO2dCQUNJLElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztnQkFDaEMsR0FBRyxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7Z0JBQzNCLElBQUksS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzVCLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztnQkFDOUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO2dCQUM5QixLQUFLLENBQUMsU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzNDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUEsVUFBVTtnQkFDM0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM3QyxRQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUMvQixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ3ZCLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDdkIsR0FBRyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7Z0JBQ3pCLElBQUksVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDekIsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2dCQUN6QixVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ2hELFVBQVUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO2dCQUN0QixRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QixVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNqQyxVQUFVLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7Z0JBQ25DLFVBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQzthQUN0QztZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBQ0QsTUFBTSxDQUFPLGNBQWMsQ0FBQyxJQUFrQjs7WUFDMUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdEM7Z0JBR0ksUUFBUSxDQUFDLGFBQWEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDckcsUUFBUSxDQUFDLFlBQVksR0FBRyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztnQkFDbkcsb0RBQW9EO2dCQUVwRCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQSxRQUFRO2dCQUNyRCx3QkFBd0I7Z0JBQ3hCLHlCQUF5QjtnQkFFekIseUJBQXlCO2dCQUM3QiwySEFBMkg7Z0JBQ3ZILGVBQWU7Z0JBQ2YsUUFBUSxDQUFDLFVBQVUsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxRQUFRLENBQUMsYUFBYSxHQUFHLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsS0FBSyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDbEUsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxHQUFHLEtBQUssRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7YUFDbEU7WUFDRCxPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO0tBQUE7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR0IH0gZnJvbSBcIi4uL3R0YXBpX2ludGVyZmFjZS90dGFwaS5qc1wiXHJcbmltcG9ydCAqIGFzIHR0MiBmcm9tIFwiLi4vdHRhcGlfbGF5ZXIyL3R0bGF5ZXIyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBVSVRvb2wge1xyXG5cclxuICAgIHN0YXRpYyBhc3luYyBDcmVhdGVJbWcoaW1nOiBzdHJpbmcgLGZvbnQ6IHR0LkZvbnQsIHRleHQ6IHN0cmluZyk6IFByb21pc2U8dHQyLlFVSV9JbWFnZT4ge1xyXG5cclxuICAgICAgICBsZXQgYnRuSW1nID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZFN0YW5kYWxvbmVTcHJpdGVBc3luYyhpbWcpO1xyXG4gICAgICAgIC8vdGhpcy5jZGF0YS5jYW52YXMuYWRkQ2hpbGQoYnRuKTtcclxuICAgICAgICAgICAgbGV0IGJ0bm5vcm1hbCA9IG5ldyB0dDIuUVVJX0ltYWdlKGJ0bkltZyk7XHJcbiAgICAgICAgICAgIGJ0bm5vcm1hbC5sb2NhbFJlY3Quc2V0QXNGaWxsKCk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodGV4dCAhPSBudWxsICYmIHRleHQgIT0gXCJcIikge1xyXG4gICAgICAgICAgICBsZXQgbGFiZWwgPSBuZXcgdHQyLlFVSV9MYWJlbChmb250LCB0ZXh0KTtcclxuICAgICAgICAgICAgYnRubm9ybWFsLmFkZENoaWxkKGxhYmVsKTtcclxuICAgICAgICAgICAgbGFiZWwubG9jYWxSZWN0LnNldEFzRmlsbCgpO1xyXG4gICAgICAgICAgICBsYWJlbC5sb2NhbFJlY3QucmFkaW9YMSA9IDAuMjtcclxuICAgICAgICAgICAgbGFiZWwubG9jYWxSZWN0LnJhZGlvWDIgPSAwLjg7XHJcbiAgICAgICAgICAgIGxhYmVsLmZvbnRTY2FsZSA9IG5ldyB0dC5WZWN0b3IyKDIuMCwgMi4wKTtcclxuICAgICAgICAgICAgbGFiZWwuY3V0ID0gdHJ1ZTsvL+i2heWHuui+ueeVjOaYr+WQpuijgeWJqlxyXG4gICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ0bm5vcm1hbDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgQ3JlYXRlQnV0dG9uQnlJbWcoaW1nOiBzdHJpbmcgLGZvbnQ6IHR0LkZvbnQsIHRleHQ6IHN0cmluZyk6IFByb21pc2U8dHQyLlFVSV9CdXR0b24+IHtcclxuICAgICAgICBsZXQgYnRuSW1nID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZFN0YW5kYWxvbmVTcHJpdGVBc3luYyhpbWcpO1xyXG4gICAgICAgIGxldCBidG4gPSBuZXcgdHQyLlFVSV9CdXR0b24oKTtcclxuXHJcbiAgICAgICAgLy90aGlzLmNkYXRhLmNhbnZhcy5hZGRDaGlsZChidG4pO1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGV0IGJ0bm5vcm1hbCA9IG5ldyB0dDIuUVVJX0ltYWdlKGJ0bkltZyk7XHJcbiAgICAgICAgICAgIGJ0bm5vcm1hbC5sb2NhbFJlY3Quc2V0QXNGaWxsKCk7XHJcbiAgICAgICAgICAgIGJ0bi5FbGVtTm9ybWFsID0gYnRubm9ybWFsO1xyXG4gICAgICAgICAgICBpZih0ZXh0ICE9IG51bGwgJiYgdGV4dCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IG5ldyB0dDIuUVVJX0xhYmVsKGZvbnQsIHRleHQpO1xyXG4gICAgICAgICAgICBidG5ub3JtYWwuYWRkQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgICAgICBsYWJlbC5sb2NhbFJlY3Quc2V0QXNGaWxsKCk7XHJcbiAgICAgICAgICAgIGxhYmVsLmxvY2FsUmVjdC5yYWRpb1gxID0gMC4yO1xyXG4gICAgICAgICAgICBsYWJlbC5sb2NhbFJlY3QucmFkaW9YMiA9IDAuODtcclxuICAgICAgICAgICAgbGFiZWwuZm9udFNjYWxlID0gbmV3IHR0LlZlY3RvcjIoMi4wLCAyLjApO1xyXG4gICAgICAgICAgICBsYWJlbC5jdXQgPSB0cnVlOy8v6LaF5Ye66L6555WM5piv5ZCm6KOB5YmqXHJcbiAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ0bjtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgYXN5bmMgQ3JlYXRlQnV0dG9uKGZvbnQ6IHR0LkZvbnQsIHRleHQ6IHN0cmluZyk6IFByb21pc2U8dHQyLlFVSV9CdXR0b24+IHtcclxuXHJcbiAgICAgICAgbGV0IGJ0bkltZ0RhcmsgPSBhd2FpdCB0dDIuUUZyYW1lX1Jlc01nci5Mb2FkU3RhbmRhbG9uZVNwcml0ZUFzeW5jKFwiZGF0YS91aWltZy9idG4xLnBuZ1wiKTtcclxuICAgICAgICBsZXQgYnRuSW1nID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZFN0YW5kYWxvbmVTcHJpdGVBc3luYyhcImRhdGEvdWlpbWcvYnRuMi5wbmdcIik7XHJcbiAgICAgICAgbGV0IGJ0biA9IG5ldyB0dDIuUVVJX0J1dHRvbigpO1xyXG5cclxuICAgICAgICAvL3RoaXMuY2RhdGEuY2FudmFzLmFkZENoaWxkKGJ0bik7XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsZXQgYnRubm9ybWFsID0gbmV3IHR0Mi5RVUlfSW1hZ2UoYnRuSW1nKTtcclxuICAgICAgICAgICAgYnRubm9ybWFsLmxvY2FsUmVjdC5zZXRBc0ZpbGwoKTtcclxuICAgICAgICAgICAgYnRuLkVsZW1Ob3JtYWwgPSBidG5ub3JtYWw7XHJcbiAgICAgICAgICAgIGxldCBsYWJlbCA9IG5ldyB0dDIuUVVJX0xhYmVsKGZvbnQsIHRleHQpO1xyXG4gICAgICAgICAgICBidG5ub3JtYWwuYWRkQ2hpbGQobGFiZWwpO1xyXG4gICAgICAgICAgICBsYWJlbC5sb2NhbFJlY3Quc2V0QXNGaWxsKCk7XHJcbiAgICAgICAgICAgIGxhYmVsLmxvY2FsUmVjdC5yYWRpb1gxID0gMC4yO1xyXG4gICAgICAgICAgICBsYWJlbC5sb2NhbFJlY3QucmFkaW9YMiA9IDAuODtcclxuICAgICAgICAgICAgbGFiZWwuZm9udFNjYWxlID0gbmV3IHR0LlZlY3RvcjIoMi4wLCAyLjApO1xyXG4gICAgICAgICAgICBsYWJlbC5jdXQgPSB0cnVlOy8v6LaF5Ye66L6555WM5piv5ZCm6KOB5YmqXHJcbiAgICAgICAgICAgIGxldCBidG5wcmVzcyA9IG5ldyB0dDIuUVVJX0ltYWdlKGJ0bkltZ0RhcmspO1xyXG4gICAgICAgICAgICBidG5wcmVzcy5sb2NhbFJlY3Quc2V0QXNGaWxsKCk7XHJcbiAgICAgICAgICAgIGJ0bnByZXNzLmNvbG9yLlIgPSAwLjM7XHJcbiAgICAgICAgICAgIGJ0bnByZXNzLmNvbG9yLkcgPSAwLjU7XHJcbiAgICAgICAgICAgIGJ0bi5FbGVtUHJlc3MgPSBidG5wcmVzcztcclxuICAgICAgICAgICAgbGV0IGxhYmVsUHJlc3MgPSBuZXcgdHQyLlFVSV9MYWJlbChmb250LCB0ZXh0KTtcclxuICAgICAgICAgICAgbGFiZWxQcmVzcy5jb2xvci5SID0gMC4zO1xyXG4gICAgICAgICAgICBsYWJlbFByZXNzLmNvbG9yLkcgPSAwLjU7XHJcbiAgICAgICAgICAgIGxhYmVsUHJlc3MuZm9udFNjYWxlID0gbmV3IHR0LlZlY3RvcjIoMS41LCAxLjUpO1xyXG4gICAgICAgICAgICBsYWJlbFByZXNzLmN1dCA9IHRydWU7XHJcbiAgICAgICAgICAgIGJ0bnByZXNzLmFkZENoaWxkKGxhYmVsUHJlc3MpO1xyXG4gICAgICAgICAgICBsYWJlbFByZXNzLmxvY2FsUmVjdC5zZXRBc0ZpbGwoKTtcclxuICAgICAgICAgICAgbGFiZWxQcmVzcy5sb2NhbFJlY3QucmFkaW9YMSA9IDAuMjtcclxuICAgICAgICAgICAgbGFiZWxQcmVzcy5sb2NhbFJlY3QucmFkaW9YMiA9IDAuODtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ0bjtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBDcmVhdGVKb3lTdGljayhyZWN0OiB0dC5SZWN0YW5nbGUpOiBQcm9taXNlPHR0Mi5RVUlfSm95U3RpY2s+IHtcclxuICAgICAgICBsZXQgam95c3RpY2sgPSBuZXcgdHQyLlFVSV9Kb3lTdGljaygpO1xyXG4gICAgICAgIHtcclxuXHJcblxyXG4gICAgICAgICAgICBqb3lzdGljay5zcHJpdGVKb3lCYWNrID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZFN0YW5kYWxvbmVTcHJpdGVBc3luYyhcImRhdGEvdWlpbWcvam95YmFjay5wbmdcIik7XHJcbiAgICAgICAgICAgIGpveXN0aWNrLnNwcml0ZUpveUhvdCA9IGF3YWl0IHR0Mi5RRnJhbWVfUmVzTWdyLkxvYWRTdGFuZGFsb25lU3ByaXRlQXN5bmMoXCJkYXRhL3VpaW1nL2pveWhvdC5wbmdcIik7XHJcbiAgICAgICAgICAgIC8vbGV0IGNhbnZhc3NpemUgPSB0aGlzLmNkYXRhLmNhbnZhcy5nZXRXb3JsZFJlY3QoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCByYWRpbyA9IHR0LmdyYXBoaWMuZ2V0RGV2aWNlUGl4ZWxSYWRpbygpOy8v6K6+5aSH5YOP57Sg5q+U5L6LXHJcbiAgICAgICAgICAgIC8v6ICD6JmR6L+Z5LiqcmFkaW/vvIzlsLHog73orqnkuI3lkIzorr7lpIflsLrlr7jlt67kuI3lpJpcclxuICAgICAgICAgICAgLy9qb3RzdGljayDpu5jorqTmkpHmu6HniLblrrnlmajvvIzov5nph4zlsLHmmK/lhajlsY9cclxuXHJcbiAgICAgICAgICAgIC8vdG91Y2hBcmVhIOihqOekuiDop6bmkbjlupXmnb/nmoTpmZDliLbljLrln58gXHJcbiAgICAgICAgLy8gICAgam95c3RpY2sudG91Y2hBcmVhID0gbmV3IHR0LlJlY3RhbmdsZSgxMDAgKiByYWRpbywgMTAwICogcmFkaW8sIHJlY3QuV2lkdGggLSAyMDAgKiByYWRpbywgcmVjdC5IZWlnaHQgLSAyMDAgKiByYWRpbyk7XHJcbiAgICAgICAgICAgIC8v5pGH5p2G5Lit5b+D54K55Y+v5Lul5YGP56a75bqV5p2/5aSa6L+cXHJcbiAgICAgICAgICAgIGpveXN0aWNrLmhvdE1heERpc3QgPSA1MCAqIHJhZGlvO1xyXG4gICAgICAgICAgICBqb3lzdGljay50b3VjaEJhY2tTaXplID0gbmV3IHR0LlZlY3RvcjIoMTI4ICogcmFkaW8sIDEyOCAqIHJhZGlvKTtcclxuICAgICAgICAgICAgam95c3RpY2sudG91Y2hIb3RTaXplID0gbmV3IHR0LlZlY3RvcjIoODAgKiByYWRpbywgODAgKiByYWRpbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBqb3lzdGljaztcclxuICAgIH1cclxufVxyXG4iXX0=