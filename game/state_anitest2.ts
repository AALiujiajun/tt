import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"

import { UITool } from "./uitool.js";
import { State_Logo } from "./state_logo.js";
import { UserData } from "./userdata.js";
import { QAni_Player } from "../ttapi_layer2/ttlayer2.js";

class MyPlayerData {
    targetA: tt.Vector2;
    targetB: tt.Vector2;
    speed: number;
}
class Vector2Func {
    //匀速移动方法
    //return false 表示到达
    static Goto(data: tt2.QAni_Player<MyPlayerData>, to: tt.Vector2, speed: number, delta: number): boolean {
        let x = data.posX;
        let y = data.posY;
        //可以用tt.vector2.Dist 系列方法计算，但是面向对象=缓慢，能少用对象则少用
        let dist = Math.sqrt((x - to.X) * (x - to.X) + (y - to.Y) * (y - to.Y));
        if (dist < 1)
            return false;

        //可以用tt.vector2.Dir 系列方法计算，这里是展开形态
        let dirX = (to.X - x) / dist;
        let dirY = (to.Y - y) / dist;

        let movedist = speed * delta;
        data.posX = x + dirX * movedist;
        data.posY = y + dirY * movedist;


        //本来写了下面的代码，有点啰嗦，封装一下
        tt2.QAni_UpdatePlayerAniByPos(data, to.X, to.Y);


        //用水平方向改一下方向
        // if (dirX < 0&&data.direction!=tt2.QAni_Direction.Left)
        // {    
        //      data.direction = tt2.QAni_Direction.Left;
        //      tt2.QAni_UpdatePlayerAni(data);
        // }
        // if (dirX > 0&&data.direction!=tt2.QAni_Direction.Right)
        // {
        //     data.direction = tt2.QAni_Direction.Right;
        //     tt2.QAni_UpdatePlayerAni(data);
        // }
        return true;
    }
}
export class State_AniTest2 implements tt2.QFrame_IState<UserData>
{
    app: tt2.QFrame_App<UserData>;

    hasinited: boolean


    players: QAni_Player<MyPlayerData>[];

    OnInit(statemgr: tt2.QFrame_App<UserData>): void {
        this.app = statemgr;

        this.hasinited = false;
        this.StartAsync();
    }
    //自己封装一个CreatePlayer函数，在其中应用懒汉模式
    async CreatePlayer(): Promise<tt2.QAni_Player<MyPlayerData>> {
        let player = tt2.QAni_PlayerMgr.CreatePlayer<MyPlayerData>("p1");
        if (player == null) {
            let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync("data/splittex_pack0.png.json");
            let json = await tt.loader.LoadStringAsync("data/monster.json");
            tt2.QAni_PlayerMgr.LoadPlayerInfo("data/splittex_pack0.png.json", JSON.parse(json));
            player = tt2.QAni_PlayerMgr.CreatePlayer("p1");

        }
        if (player == null) {
            throw new Error("加载Main Player 失败");
        }
        player.userdata = new MyPlayerData();
        return player;
    }
    async StartAsync(): Promise<void> {



        this.app.target.ClearColor = new tt.Color(0, 0, 0, 1.0);



        //players
        this.players = [];


        for (var i = 0; i < 10; i++) {
            //转为MyPlayerData 加几个属性进去
            let p = await this.CreatePlayer();
            //换一个侵入性更低的方法，之前的方法有被滥用的迹象

            p.posX = Math.random() * 200 - 100;
            p.posY = i * 64;
            p.userdata.targetA = new tt.Vector2(- 200, p.posY);
            p.userdata.targetB = new tt.Vector2(+ 200, p.posY);
            p.userdata.speed = 100 + Math.random() * 100;
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

        //批量更新动画
        //排序
        this.players.sort((a, b) => {
            return a.posY - b.posY;
        })

        this.UpdatePlayerMove(delta);
        tt2.QAni_PlayerMgr.UpdatePlayers_Ani(this.players, delta);
    }
    //把角色集中起来控制
    UpdatePlayerMove(delta: number) {
        for (var i = 0; i < this.players.length; i++) {
            let p = this.players[i];

            let b = Vector2Func.Goto(p, p.userdata.targetB, p.userdata.speed, delta);
            if (b == false)//到达
            {//交换两点

                let t = p.userdata.targetA;
                p.userdata.targetA = p.userdata.targetB;
                p.userdata.targetB = t;
            }
        }

    }
    OnRender(): void {
        if (!this.hasinited) return;
        this.app.batcherBottom.BeginDraw(this.app.target);

        tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.players);
        this.app.batcherBottom.EndDraw();
    }
}