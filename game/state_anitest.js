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
import { UITool } from "./uitool.js";
import { State_Logo } from "./state_logo.js";
export class State_AniTest {
    OnInit(statemgr) {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }
    StartAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this.background = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/p1.jpg");
            this.app.target.ClearColor = new tt.Color(0.8, 0.3, 0.5, 1.0);
            //创建一个joystick UI 并放到canvas
            this.joystick = yield UITool.CreateJoyStick(this.app.canvas.getWorldRect());
            this.app.canvas.addChild(this.joystick);
            //players
            this.players = [];
            this.userplayer = tt2.QAni_PlayerMgr.CreatePlayer("p1");
            if (this.userplayer == null) {
                let atlas = yield tt2.QFrame_ResMgr.LoadAtlasAsync("data/splittex_pack0.png.json");
                let json = yield tt.loader.LoadStringAsync("data/playerani.json");
                tt2.QAni_PlayerMgr.LoadPlayerInfo("data/splittex_pack0.png.json", JSON.parse(json));
                this.userplayer = tt2.QAni_PlayerMgr.CreatePlayer("p1");
            }
            if (this.userplayer == null) {
                throw new Error("加载Main Player 失败");
            }
            this.players.push(this.userplayer);
            let ranps = [];
            for (var i = 0; i < 1000; i++) {
                let p = tt2.QAni_PlayerMgr.CreatePlayer("p1");
                p.posX = Math.random() * 1000;
                p.posY = Math.random() * 1000;
                this.players.push(p);
            }
            this.app.batcherBottom.LookAt.X = 0;
            this.app.batcherBottom.LookAt.Y = 0;
            //加一个退出按钮
            let btn = yield UITool.CreateButton(this.app.font, "<--");
            btn.localRect.setByRect(new tt.Rectangle(50, 100, 150, 50));
            this.app.canvas.addChild(btn);
            btn.OnClick = () => {
                this.app.ChangeState(new State_Logo());
            };
            this.hasinited = true;
        });
    }
    OnExit() {
        this.app.canvas.removeChildAll();
    }
    OnUpdate(delta) {
        if (!this.hasinited)
            return;
        let touchdir = this.joystick.GetTouchDirection();
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
        });
        tt2.QAni_PlayerMgr.UpdatePlayers_Ani(this.players, delta);
    }
    OnRender() {
        if (!this.hasinited)
            return;
        this.app.batcherBottom.BeginDraw(this.app.target);
        this.background.RenderRect(this.app.batcherBottom, new tt.Rectangle(-10240, -10240, 20480, 20480));
        tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.players);
        this.app.batcherBottom.EndDraw();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVfYW5pdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlX2FuaXRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ2hELE9BQU8sS0FBSyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0MsTUFBTSxPQUFPLGFBQWE7SUFVdEIsTUFBTSxDQUFDLFFBQWlDO1FBQ3BDLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO1FBRXBCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUssVUFBVTs7WUFFWixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUluRixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTlELDJCQUEyQjtZQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsU0FBUztZQUNULElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEdBQUcs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TSxDQUFDLENBQUMsQ0FBQztRQUN2RCxRQUFRO1FBQ1IsSUFBSTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZCLE9BQU8sQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFBO1FBRUgsR0FBRyxDQUFFLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRCxRQUFRO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTO1lBQUUsT0FBTztRQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFHbkcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JDLENBQUM7Q0FDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR0IH0gZnJvbSBcIi4uL3R0YXBpX2ludGVyZmFjZS90dGFwaS5qc1wiXHJcbmltcG9ydCAqIGFzIHR0MiBmcm9tIFwiLi4vdHRhcGlfbGF5ZXIyL3R0bGF5ZXIyLmpzXCJcclxuXHJcbmltcG9ydCB7IFVJVG9vbCB9IGZyb20gXCIuL3VpdG9vbC5qc1wiO1xyXG5pbXBvcnQgeyBTdGF0ZV9Mb2dvIH0gZnJvbSBcIi4vc3RhdGVfbG9nby5qc1wiO1xyXG5pbXBvcnQgeyBVc2VyRGF0YSB9IGZyb20gXCIuL3VzZXJkYXRhLmpzXCI7XHJcbmV4cG9ydCBjbGFzcyBTdGF0ZV9BbmlUZXN0IGltcGxlbWVudHMgdHQyLlFGcmFtZV9JU3RhdGU8VXNlckRhdGE+XHJcbntcclxuICAgIGFwcDogdHQyLlFGcmFtZV9BcHA8VXNlckRhdGE+O1xyXG5cclxuICAgIGhhc2luaXRlZDogYm9vbGVhblxyXG5cclxuICAgIGJhY2tncm91bmQ6IHR0LlNwcml0ZTtcclxuICAgIGpveXN0aWNrOiB0dDIuUVVJX0pveVN0aWNrO1xyXG4gICAgcGxheWVyczogdHQyLlFBbmlfUGxheWVyPGFueT5bXTtcclxuICAgIHVzZXJwbGF5ZXI6IHR0Mi5RQW5pX1BsYXllcjxhbnk+O1xyXG4gICAgT25Jbml0KHN0YXRlbWdyOnR0Mi5RRnJhbWVfQXBwPFVzZXJEYXRhPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXBwID0gc3RhdGVtZ3I7XHJcbiAgICAgXHJcbiAgICAgICAgdGhpcy5oYXNpbml0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLlN0YXJ0QXN5bmMoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBTdGFydEFzeW5jKCk6IFByb21pc2U8dm9pZD4ge1xyXG5cclxuICAgICAgICB0aGlzLmJhY2tncm91bmQgPSBhd2FpdCB0dDIuUUZyYW1lX1Jlc01nci5Mb2FkU3RhbmRhbG9uZVNwcml0ZUFzeW5jKFwiZGF0YS9wMS5qcGdcIik7XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5hcHAudGFyZ2V0LkNsZWFyQ29sb3IgPSBuZXcgdHQuQ29sb3IoMC44LCAwLjMsIDAuNSwgMS4wKTtcclxuXHJcbiAgICAgICAgLy/liJvlu7rkuIDkuKpqb3lzdGljayBVSSDlubbmlL7liLBjYW52YXNcclxuICAgICAgICB0aGlzLmpveXN0aWNrID0gYXdhaXQgVUlUb29sLkNyZWF0ZUpveVN0aWNrKHRoaXMuYXBwLmNhbnZhcy5nZXRXb3JsZFJlY3QoKSk7XHJcbiAgICAgICAgdGhpcy5hcHAuY2FudmFzLmFkZENoaWxkKHRoaXMuam95c3RpY2spO1xyXG5cclxuICAgICAgICAvL3BsYXllcnNcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnVzZXJwbGF5ZXIgPSB0dDIuUUFuaV9QbGF5ZXJNZ3IuQ3JlYXRlUGxheWVyKFwicDFcIik7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlcnBsYXllciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBhdGxhcyA9IGF3YWl0IHR0Mi5RRnJhbWVfUmVzTWdyLkxvYWRBdGxhc0FzeW5jKFwiZGF0YS9zcGxpdHRleF9wYWNrMC5wbmcuanNvblwiKTtcclxuICAgICAgICAgICAgbGV0IGpzb24gPSBhd2FpdCB0dC5sb2FkZXIuTG9hZFN0cmluZ0FzeW5jKFwiZGF0YS9wbGF5ZXJhbmkuanNvblwiKTtcclxuICAgICAgICAgICAgdHQyLlFBbmlfUGxheWVyTWdyLkxvYWRQbGF5ZXJJbmZvKFwiZGF0YS9zcGxpdHRleF9wYWNrMC5wbmcuanNvblwiLCBKU09OLnBhcnNlKGpzb24pKTtcclxuICAgICAgICAgICAgdGhpcy51c2VycGxheWVyID0gdHQyLlFBbmlfUGxheWVyTWdyLkNyZWF0ZVBsYXllcihcInAxXCIpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMudXNlcnBsYXllciA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIuWKoOi9vU1haW4gUGxheWVyIOWksei0pVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnB1c2godGhpcy51c2VycGxheWVyKTtcclxuICAgICAgICBsZXQgcmFucHM6IHR0Mi5RQW5pX1BsYXllcjxhbnk+W10gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwMDA7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcCA9IHR0Mi5RQW5pX1BsYXllck1nci5DcmVhdGVQbGF5ZXIoXCJwMVwiKTtcclxuICAgICAgICAgICAgcC5wb3NYID0gTWF0aC5yYW5kb20oKSAqIDEwMDA7XHJcbiAgICAgICAgICAgIHAucG9zWSA9IE1hdGgucmFuZG9tKCkgKiAxMDAwO1xyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnMucHVzaChwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggPSAwO1xyXG4gICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlkgPSAwO1xyXG5cclxuICAgICAgICAvL+WKoOS4gOS4qumAgOWHuuaMiemSrlxyXG4gICAgICAgIGxldCBidG4gPSBhd2FpdCBVSVRvb2wuQ3JlYXRlQnV0dG9uKHRoaXMuYXBwLmZvbnQsIFwiPC0tXCIpO1xyXG4gICAgICAgIGJ0bi5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoNTAsIDEwMCwgMTUwLCA1MCkpO1xyXG4gICAgICAgIHRoaXMuYXBwLmNhbnZhcy5hZGRDaGlsZChidG4pO1xyXG4gICAgICAgIGJ0bi5PbkNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFwcC5DaGFuZ2VTdGF0ZShuZXcgU3RhdGVfTG9nbygpKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5oYXNpbml0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgT25FeGl0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXBwLmNhbnZhcy5yZW1vdmVDaGlsZEFsbCgpO1xyXG4gICAgfVxyXG4gICAgT25VcGRhdGUoZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNpbml0ZWQpIHJldHVybjtcclxuICAgICAgICBsZXQgdG91Y2hkaXIgPSB0aGlzLmpveXN0aWNrLkdldFRvdWNoRGlyZWN0aW9uKClcclxuICAgICAgICBpZiAodG91Y2hkaXIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5YICs9IHRvdWNoZGlyLlggKiAxMDtcclxuICAgICAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWSArPSB0b3VjaGRpci5ZICogMTA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5YIDwgLTEwMjQwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWCA9IC0xMDI0MDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggPiAxMDI0MClcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggPSAxMDI0MDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlkgPCAtMTAyNDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5ZID0gLTEwMjQwO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWSA+IDEwMjQwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWSA9IDEwMjQwO1xyXG5cclxuICAgICAgICAgICAgdGhpcy51c2VycGxheWVyLmRpcmVjdGlvbiA9IHR0Mi5RQW5pX0RpclRvRW51bSh0b3VjaGRpcik7XHJcbiAgICAgICAgICAgIHR0Mi5RQW5pX1VwZGF0ZVBsYXllckFuaSh0aGlzLnVzZXJwbGF5ZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVzZXJwbGF5ZXIucG9zWCA9IHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0Llg7XHJcbiAgICAgICAgdGhpcy51c2VycGxheWVyLnBvc1kgPSB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5ZO1xyXG4gICAgICAgIC8v5om56YeP5pu05paw5Yqo55S7XHJcbiAgICAgICAgLy/mjpLluo9cclxuICAgICAgICB0aGlzLnBsYXllcnMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYS5wb3NZIC0gYi5wb3NZO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgdHQyLiBRQW5pX1BsYXllck1nci5VcGRhdGVQbGF5ZXJzX0FuaSh0aGlzLnBsYXllcnMsIGRlbHRhKTtcclxuICAgIH1cclxuICAgIE9uUmVuZGVyKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICghdGhpcy5oYXNpbml0ZWQpIHJldHVybjtcclxuICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkJlZ2luRHJhdyh0aGlzLmFwcC50YXJnZXQpO1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5SZW5kZXJSZWN0KHRoaXMuYXBwLmJhdGNoZXJCb3R0b20sIG5ldyB0dC5SZWN0YW5nbGUoLTEwMjQwLCAtMTAyNDAsIDIwNDgwLCAyMDQ4MCkpO1xyXG5cclxuXHJcbiAgICAgICAgdHQyLlFBbmlfUGxheWVyTWdyLlJlbmRlclBsYXllcnModGhpcy5hcHAuYmF0Y2hlckJvdHRvbSwgdGhpcy5wbGF5ZXJzKTtcclxuICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkVuZERyYXcoKTtcclxuICAgIH1cclxufSJdfQ==