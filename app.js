var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//declare var wx: any;
import { tt_impl } from "./ttapi_impl_web/ttimpl_web.js";
import * as tt2 from "./ttapi_layer2/ttlayer2.js";
import * as tt2test from "./ttapi_layer2_test/layer2_test.js";
import * as State_game from "./game/state_game.js";
export class App {
    //此处的CommonData是Test中的不太好
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.warn("==初始化扩展==");
            //本地扩展是为了做编辑器用的，非编辑器不用管
            let b = yield tt2.QExt.Init();
            if (b) {
                tt2.QExt.SetDebug(true); //自己扩展的小界面，用处不大，主要给f5 f12 整俩个按钮
            }
            //首先 初始化 TTEngine ，TTEngine 是一套极简的渲染引擎
            let impl = new tt_impl.ttimpl_browser();
            let canvas = window.document.createElement("canvas");
            window.document.body.append(canvas);
            canvas.style.width = "100%";
            canvas.style.height = "100%";
            canvas.style.border = "0px";
            canvas.style.margin = "0px";
            impl.Init(canvas);
            let userdata = new UserData();
            //测试程序指定资源位置
            tt2test.Test_UITool.InitResPath("ttapi_layer2_test/data/");
            let deffonturl = tt2test.Test_UITool.getDefaultFontResPath();
            let debug = true;
            let app = new tt2.QFrame_App(userdata, deffonturl, debug);
            yield app.Start();
            app.ChangeState(new State_game.State_Game());
        });
    }
}
export class UserData {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUdBLHNCQUFzQjtBQUN0QixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sZ0NBQWdDLENBQUE7QUFLeEQsT0FBTyxLQUFLLEdBQUcsTUFBTSw0QkFBNEIsQ0FBQztBQUNsRCxPQUFPLEtBQUssT0FBTyxNQUFNLG9DQUFvQyxDQUFDO0FBQzlELE9BQVEsS0FBSyxVQUFVLE1BQU0sc0JBQXNCLENBQUM7QUFFcEQsTUFBTSxPQUFPLEdBQUc7SUFFWix5QkFBeUI7SUFFbkIsS0FBSzs7WUFDUCxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzFCLHVCQUF1QjtZQUN2QixJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLEVBQUU7Z0JBQ0gsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSwrQkFBK0I7YUFDMUQ7WUFDRCxzQ0FBc0M7WUFDdEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDeEMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUM1QixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRWxCLElBQUksUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7WUFFOUIsWUFBWTtZQUNaLE9BQU8sQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFFM0QsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQzdELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUVqQixJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQVcsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVwRSxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVsQixHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUFBO0NBR0o7QUFDRCxNQUFNLE9BQU8sUUFBUTtDQUVwQiIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5cclxuXHJcbi8vZGVjbGFyZSB2YXIgd3g6IGFueTtcclxuaW1wb3J0IHsgdHRfaW1wbCB9IGZyb20gXCIuL3R0YXBpX2ltcGxfd2ViL3R0aW1wbF93ZWIuanNcIlxyXG5pbXBvcnQgeyB0dCB9IGZyb20gXCIuL3R0YXBpX2ludGVyZmFjZS90dGFwaS5qc1wiXHJcblxyXG5cclxuXHJcbmltcG9ydCAqIGFzIHR0MiBmcm9tIFwiLi90dGFwaV9sYXllcjIvdHRsYXllcjIuanNcIjtcclxuaW1wb3J0ICogYXMgdHQydGVzdCBmcm9tIFwiLi90dGFwaV9sYXllcjJfdGVzdC9sYXllcjJfdGVzdC5qc1wiO1xyXG5pbXBvcnQgICogYXMgU3RhdGVfZ2FtZSBmcm9tIFwiLi9nYW1lL3N0YXRlX2dhbWUuanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHAge1xyXG5cclxuICAgIC8v5q2k5aSE55qEQ29tbW9uRGF0YeaYr1Rlc3TkuK3nmoTkuI3lpKrlpb1cclxuXHJcbiAgICBhc3luYyBTdGFydCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zb2xlLndhcm4oXCI9PeWIneWni+WMluaJqeWxlT09XCIpO1xyXG4gICAgICAgIC8v5pys5Zyw5omp5bGV5piv5Li65LqG5YGa57yW6L6R5Zmo55So55qE77yM6Z2e57yW6L6R5Zmo5LiN55So566hXHJcbiAgICAgICAgbGV0IGIgPSBhd2FpdCB0dDIuUUV4dC5Jbml0KCk7XHJcbiAgICAgICAgaWYgKGIpIHtcclxuICAgICAgICAgICAgdHQyLlFFeHQuU2V0RGVidWcodHJ1ZSk7Ly/oh6rlt7HmianlsZXnmoTlsI/nlYzpnaLvvIznlKjlpITkuI3lpKfvvIzkuLvopoHnu5lmNSBmMTIg5pW05L+p5Liq5oyJ6ZKuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8v6aaW5YWIIOWIneWni+WMliBUVEVuZ2luZSDvvIxUVEVuZ2luZSDmmK/kuIDlpZfmnoHnroDnmoTmuLLmn5PlvJXmk45cclxuICAgICAgICBsZXQgaW1wbCA9IG5ldyB0dF9pbXBsLnR0aW1wbF9icm93c2VyKCk7XHJcbiAgICAgICAgbGV0IGNhbnZhcyA9IHdpbmRvdy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIHdpbmRvdy5kb2N1bWVudC5ib2R5LmFwcGVuZChjYW52YXMpO1xyXG4gICAgICAgIGNhbnZhcy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUuYm9yZGVyID0gXCIwcHhcIjtcclxuICAgICAgICBjYW52YXMuc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcclxuICAgICAgICBpbXBsLkluaXQoY2FudmFzKTtcclxuXHJcbiAgICAgICAgbGV0IHVzZXJkYXRhID0gbmV3IFVzZXJEYXRhKCk7XHJcblxyXG4gICAgICAgIC8v5rWL6K+V56iL5bqP5oyH5a6a6LWE5rqQ5L2N572uXHJcbiAgICAgICAgdHQydGVzdC5UZXN0X1VJVG9vbC5Jbml0UmVzUGF0aChcInR0YXBpX2xheWVyMl90ZXN0L2RhdGEvXCIpO1xyXG5cclxuICAgICAgICBsZXQgZGVmZm9udHVybCA9IHR0MnRlc3QuVGVzdF9VSVRvb2wuZ2V0RGVmYXVsdEZvbnRSZXNQYXRoKCk7XHJcbiAgICAgICAgbGV0IGRlYnVnID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgbGV0IGFwcCA9IG5ldyB0dDIuUUZyYW1lX0FwcDxVc2VyRGF0YT4odXNlcmRhdGEsIGRlZmZvbnR1cmwsIGRlYnVnKTtcclxuXHJcbiAgICAgICAgYXdhaXQgYXBwLlN0YXJ0KCk7XHJcblxyXG4gICAgICAgIGFwcC5DaGFuZ2VTdGF0ZShuZXcgU3RhdGVfZ2FtZS5TdGF0ZV9HYW1lKCkpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuZXhwb3J0IGNsYXNzIFVzZXJEYXRhIHtcclxuXHJcbn0iXX0=