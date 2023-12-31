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
export class State_JoyTest {
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
    OnRender() {
        this.app.batcherBottom.BeginDraw(this.app.target);
        this.background.RenderRect(this.app.batcherBottom, new tt.Rectangle(-10240, -10240, 20480, 20480));
        this.app.batcherBottom.EndDraw();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVfam95dGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlX2pveXRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ2hELE9BQU8sS0FBSyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0MsTUFBTSxPQUFPLGFBQWE7SUFPdEIsTUFBTSxDQUFDLFFBQWtDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDO1FBRXBCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUssVUFBVTs7WUFFWixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLGFBQWEsQ0FBQyx5QkFBeUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUluRixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBRTlELDJCQUEyQjtZQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFJeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDcEMs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ZnJvbSBcIi4uL3R0YXBpX2ludGVyZmFjZS90dGFwaS5qc1wiXHJcbmltcG9ydCAqIGFzIHR0MiBmcm9tIFwiLi4vdHRhcGlfbGF5ZXIyL3R0bGF5ZXIyLmpzXCJcclxuXHJcbmltcG9ydCB7IFVJVG9vbCB9IGZyb20gXCIuL3VpdG9vbC5qc1wiO1xyXG5pbXBvcnQgeyBTdGF0ZV9Mb2dvIH0gZnJvbSBcIi4vc3RhdGVfbG9nby5qc1wiO1xyXG5pbXBvcnQgeyBVc2VyRGF0YSB9IGZyb20gXCIuL3VzZXJkYXRhLmpzXCI7XHJcbmV4cG9ydCBjbGFzcyBTdGF0ZV9Kb3lUZXN0IGltcGxlbWVudHMgdHQyLlFGcmFtZV9JU3RhdGU8VXNlckRhdGE+XHJcbntcclxuICAgIGFwcDogdHQyLlFGcmFtZV9BcHA8VXNlckRhdGE+O1xyXG4gICAgaGFzaW5pdGVkOiBib29sZWFuXHJcblxyXG4gICAgYmFja2dyb3VuZDogdHQuU3ByaXRlO1xyXG4gICAgam95c3RpY2s6IHR0Mi5RVUlfSm95U3RpY2s7XHJcbiAgICBPbkluaXQoc3RhdGVtZ3I6IHR0Mi5RRnJhbWVfQXBwPFVzZXJEYXRhPik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXBwID0gc3RhdGVtZ3I7XHJcblxyXG4gICAgICAgIHRoaXMuaGFzaW5pdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5TdGFydEFzeW5jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgU3RhcnRBc3luYygpOiBQcm9taXNlPHZvaWQ+IHtcclxuXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZFN0YW5kYWxvbmVTcHJpdGVBc3luYyhcImRhdGEvcDEuanBnXCIpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuYXBwLnRhcmdldC5DbGVhckNvbG9yID0gbmV3IHR0LkNvbG9yKDAuOCwgMC4zLCAwLjUsIDEuMCk7XHJcblxyXG4gICAgICAgIC8v5Yib5bu65LiA5Liqam95c3RpY2sgVUkg5bm25pS+5YiwY2FudmFzXHJcbiAgICAgICAgdGhpcy5qb3lzdGljayA9IGF3YWl0IFVJVG9vbC5DcmVhdGVKb3lTdGljayh0aGlzLmFwcC5jYW52YXMuZ2V0V29ybGRSZWN0KCkpO1xyXG4gICAgICAgIHRoaXMuYXBwLmNhbnZhcy5hZGRDaGlsZCh0aGlzLmpveXN0aWNrKTtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5YID0gMDtcclxuICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5ZID0gMDtcclxuXHJcbiAgICAgICAgLy/liqDkuIDkuKrpgIDlh7rmjInpkq5cclxuICAgICAgICBsZXQgYnRuID0gYXdhaXQgVUlUb29sLkNyZWF0ZUJ1dHRvbih0aGlzLmFwcC5mb250LCBcIjwtLVwiKTtcclxuICAgICAgICBidG4ubG9jYWxSZWN0LnNldEJ5UmVjdChuZXcgdHQuUmVjdGFuZ2xlKDUwLCAxMDAsIDE1MCwgNTApKTtcclxuICAgICAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQoYnRuKTtcclxuICAgICAgICBidG4uT25DbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hcHAuQ2hhbmdlU3RhdGUobmV3IFN0YXRlX0xvZ28oKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMuaGFzaW5pdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIE9uRXhpdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFwcC5jYW52YXMucmVtb3ZlQ2hpbGRBbGwoKTtcclxuICAgIH1cclxuICAgIE9uVXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzaW5pdGVkKSByZXR1cm47XHJcbiAgICAgICAgbGV0IHRvdWNoZGlyID0gdGhpcy5qb3lzdGljay5HZXRUb3VjaERpcmVjdGlvbigpXHJcbiAgICAgICAgaWYgKHRvdWNoZGlyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWCArPSB0b3VjaGRpci5YICogMTAwO1xyXG4gICAgICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5ZICs9IHRvdWNoZGlyLlkgKiAxMDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5YIDwgLTEwMjQwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWCA9IC0xMDI0MDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggPiAxMDI0MClcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggPSAxMDI0MDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlkgPCAtMTAyNDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5ZID0gLTEwMjQwO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWSA+IDEwMjQwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWSA9IDEwMjQwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIE9uUmVuZGVyKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uQmVnaW5EcmF3KHRoaXMuYXBwLnRhcmdldCk7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLlJlbmRlclJlY3QodGhpcy5hcHAuYmF0Y2hlckJvdHRvbSwgbmV3IHR0LlJlY3RhbmdsZSgtMTAyNDAsIC0xMDI0MCwgMjA0ODAsIDIwNDgwKSk7XHJcbiAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5FbmREcmF3KCk7XHJcbiAgICB9XHJcbn0iXX0=