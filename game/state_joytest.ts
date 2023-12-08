import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"

import { UITool } from "./uitool.js";
import { State_Logo } from "./state_logo.js";
import { UserData } from "./userdata.js";
export class State_JoyTest implements tt2.QFrame_IState<UserData>
{
    app: tt2.QFrame_App<UserData>;
    hasinited: boolean

    background: tt.Sprite;
    joystick: tt2.QUI_JoyStick;
    OnInit(statemgr: tt2.QFrame_App<UserData>): void {
        this.app = statemgr;

        this.hasinited = false;
        this.StartAsync();
    }

    async StartAsync(): Promise<void> {

        this.background = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/p1.jpg");



        this.app.target.ClearColor = new tt.Color(0.8, 0.3, 0.5, 1.0);

        //创建一个joystick UI 并放到canvas
        this.joystick = await UITool.CreateJoyStick(this.app.canvas.getWorldRect());
        this.app.canvas.addChild(this.joystick);



        this.app.batcherBottom.LookAt.X = 0;
        this.app.batcherBottom.LookAt.Y = 0;

        //加一个退出按钮
        let btn = await UITool.CreateButton(this.app.font, "<--");
        btn.localRect.setByRect(new tt.Rectangle(50, 100, 150, 50));
        this.app.canvas.addChild(btn);
        btn.OnClick = () => {
            this.app.ChangeState(new State_Logo());
        }



        this.hasinited = true;
    }
    OnExit(): void {
        this.app.canvas.removeChildAll();
    }
    OnUpdate(delta: number): void {
        if (!this.hasinited) return;
        let touchdir = this.joystick.GetTouchDirection()
        if (touchdir != null) {
            this.app.batcherBottom.LookAt.X += touchdir.X * 100;
            this.app.batcherBottom.LookAt.Y += touchdir.Y * 100;
            if (this.app.batcherBottom.LookAt.X < -10240)
                this.app.batcherBottom.LookAt.X = -10240;
            if (this.app.batcherBottom.LookAt.X > 10240)
                this.app.batcherBottom.LookAt.X = 10240;
            if (this.app.batcherBottom.LookAt.Y < -10240)
                this.app.batcherBottom.LookAt.Y = -10240;
            if (this.app.batcherBottom.LookAt.Y > 10240)
                this.app.batcherBottom.LookAt.Y = 10240;
        }
    }
    OnRender(): void {
        this.app.batcherBottom.BeginDraw(this.app.target);
        this.background.RenderRect(this.app.batcherBottom, new tt.Rectangle(-10240, -10240, 20480, 20480));
        this.app.batcherBottom.EndDraw();
    }
}