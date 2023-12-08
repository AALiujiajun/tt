import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"

import { UITool } from "./uitool.js";
import { State_Logo } from "./state_logo.js";
import { UserData } from "./userdata.js";
export class State_AniTest implements tt2.QFrame_IState<UserData>
{
    app: tt2.QFrame_App<UserData>;

    hasinited: boolean

    background: tt.Sprite;
    joystick: tt2.QUI_JoyStick;
    players: tt2.QAni_Player<any>[];
    userplayer: tt2.QAni_Player<any>;
    OnInit(statemgr:tt2.QFrame_App<UserData>): void {
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

        //players
        this.players = [];
        this.userplayer = tt2.QAni_PlayerMgr.CreatePlayer("p1");
        if (this.userplayer == null) {
            let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync("data/splittex_pack0.png.json");
            let json = await tt.loader.LoadStringAsync("data/playerani.json");
            tt2.QAni_PlayerMgr.LoadPlayerInfo("data/splittex_pack0.png.json", JSON.parse(json));
            this.userplayer = tt2.QAni_PlayerMgr.CreatePlayer("p1");

        }
        if (this.userplayer == null) {
            throw new Error("加载Main Player 失败");
        }
        this.players.push(this.userplayer);
        let ranps: tt2.QAni_Player<any>[] = [];
        for (var i = 0; i < 1000; i++) {
            let p = tt2.QAni_PlayerMgr.CreatePlayer("p1");
            p.posX = Math.random() * 1000;
            p.posY = Math.random() * 1000;
            this.players.push(p);
        }

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
            this.app.batcherBottom.LookAt.X += touchdir.X * 10;
            this.app.batcherBottom.LookAt.Y += touchdir.Y * 10;
            if (this.app.batcherBottom.LookAt.X < -10240)
                this.app.batcherBottom.LookAt.X = -10240;
            if (this.app.batcherBottom.LookAt.X > 10240)
                this.app.batcherBottom.LookAt.X = 10240;
            if (this.app.batcherBottom.LookAt.Y < -10240)
                this.app.batcherBottom.LookAt.Y = -10240;
            if (this.app.batcherBottom.LookAt.Y > 10240)
                this.app.batcherBottom.LookAt.Y = 10240;

            this.userplayer.direction = tt2.QAni_DirToEnum(touchdir);
            tt2.QAni_UpdatePlayerAni(this.userplayer);
        }
        this.userplayer.posX = this.app.batcherBottom.LookAt.X;
        this.userplayer.posY = this.app.batcherBottom.LookAt.Y;
        //批量更新动画
        //排序
        this.players.sort((a, b) => {
            return a.posY - b.posY;
        })

       tt2. QAni_PlayerMgr.UpdatePlayers_Ani(this.players, delta);
    }
    OnRender(): void {
        if (!this.hasinited) return;
        this.app.batcherBottom.BeginDraw(this.app.target);
        this.background.RenderRect(this.app.batcherBottom, new tt.Rectangle(-10240, -10240, 20480, 20480));


        tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.players);
        this.app.batcherBottom.EndDraw();
    }
}