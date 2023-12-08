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
import { State_JoyTest } from "./state_joytest.js";
import { State_Game } from "./state_game.js";
import { UITool } from "./uitool.js";
import { State_AniTest } from "./state_anitest.js";
import { State_SpriteTest } from "./state_spritetest.js";
import { State_AniTest2 } from "./state_anitest2.js";
export class State_Logo {
    constructor() {
        this.testbtn_Y = 100;
    }
    OnInit(statemgr) {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }
    StartAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            let catSprite = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/p1.jpg");
            //this.atlas = await ResMgr.LoadAtlasAsync("data/splittex_pack0.png");
            let catimage = new tt2.QUI_Image(catSprite);
            catimage.color.A = 0.5;
            catimage.color.R = 1.0;
            this.app.canvas.addChild(catimage);
            //Button 需要配置  ElemNormal 和 ElemClick 两个外观组件
            yield this.addTestBtn("图集Atlas Test.", () => {
                this.app.ChangeState(new State_SpriteTest());
            });
            yield this.addTestBtn("虚拟摇杆 Test.", () => {
                this.app.ChangeState(new State_JoyTest());
            });
            yield this.addTestBtn("动画 Test.", () => {
                this.app.ChangeState(new State_AniTest());
            });
            yield this.addTestBtn("动画 Test2.", () => {
                this.app.ChangeState(new State_AniTest2());
            });
            // 进入游戏界面
            yield this.addTestBtn("play", () => {
                this.app.ChangeState(new State_Game());
            });
            this.app.target.ClearColor = new tt.Color(0, 1.0, 0.5, 1.0);
            this.hasinited = true;
        });
    }
    addTestBtn(text, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            let btn = yield UITool.CreateButton(this.app.font, text);
            btn.localRect.setByRect(new tt.Rectangle(50, this.testbtn_Y, this.app.target.getWidth() - 100, 50));
            this.testbtn_Y += 100;
            this.app.canvas.addChild(btn);
            btn.OnClick = callback;
        });
    }
    OnExit() {
        this.app.canvas.removeChildAll();
    }
    OnUpdate(delta) {
        if (!this.hasinited)
            return;
    }
    OnRender() {
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVfbG9nby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlX2xvZ28udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ2hELE9BQU8sS0FBSyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDckQsTUFBTSxPQUFPLFVBQVU7SUFBdkI7UUErQ0ksY0FBUyxHQUFXLEdBQUcsQ0FBQztJQW9CNUIsQ0FBQztJQS9ERyxNQUFNLENBQUMsUUFBbUM7UUFDdEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFFcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFSyxVQUFVOztZQUVaLElBQUksU0FBUyxHQUFHLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUdqRixzRUFBc0U7WUFFdEUsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzVDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUN2QixRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDdkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBRWxDLDRDQUE0QztZQUM1QyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUM7WUFFSCxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtnQkFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBQzlDLENBQUMsQ0FBQyxDQUFDO1lBRUgsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksYUFBYSxFQUFFLENBQUMsQ0FBQztZQUM5QyxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLGNBQWMsRUFBRSxDQUFDLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxTQUFTO1lBQ1QsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQztZQUMzQyxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFNUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDMUIsQ0FBQztLQUFBO0lBRUssVUFBVSxDQUFDLElBQVksRUFBRSxRQUFvQjs7WUFDL0MsSUFBSSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3pELEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVwRyxJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQztZQUN0QixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsR0FBRyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7UUFDM0IsQ0FBQztLQUFBO0lBRUQsTUFBTTtRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3JDLENBQUM7SUFDRCxRQUFRLENBQUMsS0FBYTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVM7WUFBRSxPQUFPO0lBRWhDLENBQUM7SUFDRCxRQUFRO0lBRVIsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHQgfSBmcm9tIFwiLi4vdHRhcGlfaW50ZXJmYWNlL3R0YXBpLmpzXCJcclxuaW1wb3J0ICogYXMgdHQyIGZyb20gXCIuLi90dGFwaV9sYXllcjIvdHRsYXllcjIuanNcIlxyXG5cclxuaW1wb3J0IHsgU3RhdGVfSm95VGVzdCB9IGZyb20gXCIuL3N0YXRlX2pveXRlc3QuanNcIjtcclxuaW1wb3J0IHsgU3RhdGVfR2FtZSB9IGZyb20gXCIuL3N0YXRlX2dhbWUuanNcIjtcclxuaW1wb3J0IHsgVUlUb29sIH0gZnJvbSBcIi4vdWl0b29sLmpzXCI7XHJcbmltcG9ydCB7IFN0YXRlX0FuaVRlc3QgfSBmcm9tIFwiLi9zdGF0ZV9hbml0ZXN0LmpzXCI7XHJcbmltcG9ydCB7IFVzZXJEYXRhIH0gZnJvbSBcIi4vdXNlcmRhdGEuanNcIjtcclxuaW1wb3J0IHsgU3RhdGVfU3ByaXRlVGVzdCB9IGZyb20gXCIuL3N0YXRlX3Nwcml0ZXRlc3QuanNcIjtcclxuaW1wb3J0IHsgU3RhdGVfQW5pVGVzdDIgfSBmcm9tIFwiLi9zdGF0ZV9hbml0ZXN0Mi5qc1wiO1xyXG5leHBvcnQgY2xhc3MgU3RhdGVfTG9nbyBpbXBsZW1lbnRzICB0dDIuUUZyYW1lX0lTdGF0ZTxVc2VyRGF0YT5cclxue1xyXG4gICAgYXBwOiB0dDIuUUZyYW1lX0FwcDxVc2VyRGF0YT47XHJcbiAgICBoYXNpbml0ZWQ6IGJvb2xlYW5cclxuICAgIE9uSW5pdChzdGF0ZW1ncjogIHR0Mi5RRnJhbWVfQXBwPFVzZXJEYXRhPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXBwID0gc3RhdGVtZ3I7XHJcbiAgICAgXHJcbiAgICAgICAgdGhpcy5oYXNpbml0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLlN0YXJ0QXN5bmMoKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBTdGFydEFzeW5jKCk6IFByb21pc2U8dm9pZD4ge1xyXG5cclxuICAgICAgICBsZXQgY2F0U3ByaXRlID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZFN0YW5kYWxvbmVTcHJpdGVBc3luYyhcImRhdGEvcDEuanBnXCIpO1xyXG5cclxuXHJcbiAgICAgICAgLy90aGlzLmF0bGFzID0gYXdhaXQgUmVzTWdyLkxvYWRBdGxhc0FzeW5jKFwiZGF0YS9zcGxpdHRleF9wYWNrMC5wbmdcIik7XHJcblxyXG4gICAgICAgIGxldCBjYXRpbWFnZSA9IG5ldyB0dDIuUVVJX0ltYWdlKGNhdFNwcml0ZSk7XHJcbiAgICAgICAgY2F0aW1hZ2UuY29sb3IuQSA9IDAuNTtcclxuICAgICAgICBjYXRpbWFnZS5jb2xvci5SID0gMS4wO1xyXG4gICAgICAgIHRoaXMuYXBwLmNhbnZhcy5hZGRDaGlsZChjYXRpbWFnZSlcclxuXHJcbiAgICAgICAgLy9CdXR0b24g6ZyA6KaB6YWN572uICBFbGVtTm9ybWFsIOWSjCBFbGVtQ2xpY2sg5Lik5Liq5aSW6KeC57uE5Lu2XHJcbiAgICAgICAgYXdhaXQgdGhpcy5hZGRUZXN0QnRuKFwi5Zu+6ZuGQXRsYXMgVGVzdC5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFwcC5DaGFuZ2VTdGF0ZShuZXcgU3RhdGVfU3ByaXRlVGVzdCgpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hZGRUZXN0QnRuKFwi6Jma5ouf5pGH5p2GIFRlc3QuXCIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHAuQ2hhbmdlU3RhdGUobmV3IFN0YXRlX0pveVRlc3QoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMuYWRkVGVzdEJ0bihcIuWKqOeUuyBUZXN0LlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwLkNoYW5nZVN0YXRlKG5ldyBTdGF0ZV9BbmlUZXN0KCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuYWRkVGVzdEJ0bihcIuWKqOeUuyBUZXN0Mi5cIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmFwcC5DaGFuZ2VTdGF0ZShuZXcgU3RhdGVfQW5pVGVzdDIoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8g6L+b5YWl5ri45oiP55WM6Z2iXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hZGRUZXN0QnRuKFwicGxheVwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwLkNoYW5nZVN0YXRlKG5ldyBTdGF0ZV9HYW1lKCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFwcC50YXJnZXQuQ2xlYXJDb2xvciA9IG5ldyB0dC5Db2xvcigwLCAxLjAsIDAuNSwgMS4wKTtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNpbml0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGVzdGJ0bl9ZOiBudW1iZXIgPSAxMDA7XHJcbiAgICBhc3luYyBhZGRUZXN0QnRuKHRleHQ6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgYnRuID0gYXdhaXQgVUlUb29sLkNyZWF0ZUJ1dHRvbih0aGlzLmFwcC5mb250LCB0ZXh0KTtcclxuICAgICAgICBidG4ubG9jYWxSZWN0LnNldEJ5UmVjdChuZXcgdHQuUmVjdGFuZ2xlKDUwLCB0aGlzLnRlc3RidG5fWSwgdGhpcy5hcHAudGFyZ2V0LmdldFdpZHRoKCkgLSAxMDAsIDUwKSk7XHJcblxyXG4gICAgICAgIHRoaXMudGVzdGJ0bl9ZICs9IDEwMDtcclxuICAgICAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQoYnRuKTtcclxuICAgICAgICBidG4uT25DbGljayA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIE9uRXhpdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFwcC5jYW52YXMucmVtb3ZlQ2hpbGRBbGwoKTtcclxuICAgIH1cclxuICAgIE9uVXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzaW5pdGVkKSByZXR1cm47XHJcblxyXG4gICAgfVxyXG4gICAgT25SZW5kZXIoKTogdm9pZCB7XHJcblxyXG4gICAgfVxyXG59Il19