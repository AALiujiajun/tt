


//declare var wx: any;
import { tt_impl } from "./ttapi_impl_web/ttimpl_web.js"
import { tt } from "./ttapi_interface/ttapi.js"



import * as tt2 from "./ttapi_layer2/ttlayer2.js";
import * as tt2test from "./ttapi_layer2_test/layer2_test.js";
import  * as State_game from "./game/state_game.js";

export class App {

    //此处的CommonData是Test中的不太好

    async Start(): Promise<void> {
        console.warn("==初始化扩展==");
        //本地扩展是为了做编辑器用的，非编辑器不用管
        let b = await tt2.QExt.Init();
        if (b) {
            tt2.QExt.SetDebug(true);//自己扩展的小界面，用处不大，主要给f5 f12 整俩个按钮
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

        let app = new tt2.QFrame_App<UserData>(userdata, deffonturl, debug);

        await app.Start();

        app.ChangeState(new State_game.State_Game());
    }


}
export class UserData {

}