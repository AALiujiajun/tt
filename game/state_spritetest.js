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
export class State_SpriteTest {
    OnInit(statemgr) {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
    }
    StartAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cats = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/p1.jpg");
            this.atlas = yield tt2.QFrame_ResMgr.LoadAtlasAsync("data/splittex_pack0.png");
            //加一个退出按钮
            let btn = yield UITool.CreateButton(this.app.font, "<--");
            btn.localRect.setByRect(new tt.Rectangle(50, 100, 150, 50));
            this.app.canvas.addChild(btn);
            btn.OnClick = () => {
                this.app.ChangeState(new State_Logo());
            };
            //中心看中心
            this.app.batcherBottom.LookAt.X = this.app.target.getWidth() / 2;
            this.app.batcherBottom.LookAt.Y = this.app.target.getHeight() / 2;
            this.hasinited = true;
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
        if (!this.hasinited)
            return;
        let b = this.app.batcherBottom;
        this.app.batcherBottom.BeginDraw(this.app.target);
        this.cats.Render(b, new tt.Vector2(0, 0), new tt.Vector2(0.5, 0.5), tt.Color.White);
        let w = this.app.target.getWidth();
        let h = this.app.target.getHeight();
        for (var i = 0; i < 256; i++) {
            var iss = i % this.atlas.allsprite.length;
            var s = this.atlas.allsprite[iss];
            s.Render(b, new tt.Vector2(Math.random() * w, Math.random() * h / 2), new tt.Vector2(1, 1));
            //this.drawRect(ltex, 0, new tt.Rectangle(Math.random() * w, Math.random() * h, 12, 12));
        }
        let inputscale = tt.graphic.getFinalScale();
        let ps = tt.input.GetInputPoints();
        for (var i = 0; i < ps.length; i++) {
            if (ps[i].press) {
                var iss = ((Math.random() * 1000) | 0) % this.atlas.allsprite.length;
                var s = this.atlas.allsprite[iss];
                if (s == undefined)
                    continue;
                console.log("inputscale=" + inputscale + " id = " + ps[i].id + " i =" + i);
                s.Render(b, new tt.Vector2(ps[i].x * inputscale - 64, ps[i].y * inputscale - 64), new tt.Vector2(1, 1), tt.Color.White);
            }
        }
        this.app.batcherBottom.EndDraw();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVfc3ByaXRldGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlX3Nwcml0ZXRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ2hELE9BQU8sS0FBSyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNyQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFN0MsTUFBTSxPQUFPLGdCQUFnQjtJQUl6QixNQUFNLENBQUMsUUFBa0M7UUFDckMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUM7UUFFcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFJSyxVQUFVOztZQUVaLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRzdFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1lBRy9FLFNBQVM7WUFDVCxJQUFJLEdBQUcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLEdBQUcsQ0FB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QUMsTUFBTSxDQUFDO2dCQUNyRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLElBQUksU0FBUztvQkFDZCxTQUFTO2dCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxHQUFHLFVBQVUsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzNFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsRUFBRSxDQUFDLEVBQzVFLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUU3QztTQUNKO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckMsQ0FBQztDQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHQgfSBmcm9tIFwiLi4vdHRhcGlfaW50ZXJmYWNlL3R0YXBpLmpzXCJcclxuaW1wb3J0ICogYXMgdHQyIGZyb20gXCIuLi90dGFwaV9sYXllcjIvdHRsYXllcjIuanNcIlxyXG5cclxuaW1wb3J0IHsgVUlUb29sIH0gZnJvbSBcIi4vdWl0b29sLmpzXCI7XHJcbmltcG9ydCB7IFN0YXRlX0xvZ28gfSBmcm9tIFwiLi9zdGF0ZV9sb2dvLmpzXCI7XHJcbmltcG9ydCB7IFVzZXJEYXRhIH0gZnJvbSBcIi4vdXNlcmRhdGEuanNcIjtcclxuZXhwb3J0IGNsYXNzIFN0YXRlX1Nwcml0ZVRlc3QgaW1wbGVtZW50cyB0dDIuUUZyYW1lX0lTdGF0ZTxVc2VyRGF0YT5cclxue1xyXG4gICAgYXBwOiB0dDIuUUZyYW1lX0FwcDxVc2VyRGF0YT47XHJcbiAgICBoYXNpbml0ZWQ6IGJvb2xlYW5cclxuICAgIE9uSW5pdChzdGF0ZW1ncjogdHQyLlFGcmFtZV9BcHA8VXNlckRhdGE+KTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBzdGF0ZW1ncjtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNpbml0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLlN0YXJ0QXN5bmMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjYXRzOiB0dC5TcHJpdGU7XHJcbiAgICBhdGxhczogdHQuQXRsYXM7XHJcbiAgICBhc3luYyBTdGFydEFzeW5jKCk6IFByb21pc2U8dm9pZD4ge1xyXG5cclxuICAgICAgICB0aGlzLmNhdHMgPSBhd2FpdCB0dDIuUUZyYW1lX1Jlc01nci5Mb2FkU3RhbmRhbG9uZVNwcml0ZUFzeW5jKFwiZGF0YS9wMS5qcGdcIik7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmF0bGFzID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZEF0bGFzQXN5bmMoXCJkYXRhL3NwbGl0dGV4X3BhY2swLnBuZ1wiKTtcclxuXHJcblxyXG4gICAgICAgIC8v5Yqg5LiA5Liq6YCA5Ye65oyJ6ZKuXHJcbiAgICAgICAgbGV0IGJ0biA9IGF3YWl0IFVJVG9vbC5DcmVhdGVCdXR0b24odGhpcy5hcHAuZm9udCwgXCI8LS1cIik7XHJcbiAgICAgICAgYnRuLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSg1MCwgMTAwLCAxNTAsIDUwKSk7XHJcbiAgICAgICAgdGhpcy5hcHAuY2FudmFzLmFkZENoaWxkKGJ0bik7XHJcbiAgICAgICAgYnRuLk9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwLkNoYW5nZVN0YXRlKG5ldyBTdGF0ZV9Mb2dvKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/kuK3lv4PnnIvkuK3lv4NcclxuICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5YID0gdGhpcy5hcHAudGFyZ2V0LmdldFdpZHRoKCkgLyAyO1xyXG4gICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlkgPSB0aGlzLmFwcC50YXJnZXQuZ2V0SGVpZ2h0KCkgLyAyO1xyXG4gICAgICAgIHRoaXMuaGFzaW5pdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIE9uRXhpdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmFwcC5jYW52YXMucmVtb3ZlQ2hpbGRBbGwoKTtcclxuICAgIH1cclxuICAgIE9uVXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBpZiAoIXRoaXMuaGFzaW5pdGVkKSByZXR1cm47XHJcblxyXG4gICAgfVxyXG4gICAgT25SZW5kZXIoKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmhhc2luaXRlZCkgcmV0dXJuO1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5hcHAuYmF0Y2hlckJvdHRvbTtcclxuICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkJlZ2luRHJhdyh0aGlzLmFwcC50YXJnZXQpO1xyXG4gICAgICAgIHRoaXMuY2F0cy5SZW5kZXIoYiwgbmV3IHR0LlZlY3RvcjIoMCwgMCksIG5ldyB0dC5WZWN0b3IyKDAuNSwgMC41KSwgdHQuQ29sb3IuV2hpdGUpO1xyXG5cclxuICAgICAgICBsZXQgdyA9IHRoaXMuYXBwLnRhcmdldC5nZXRXaWR0aCgpO1xyXG4gICAgICAgIGxldCBoID0gdGhpcy5hcHAudGFyZ2V0LmdldEhlaWdodCgpO1xyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXNzID0gaSAlIHRoaXMuYXRsYXMuYWxsc3ByaXRlLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLmF0bGFzLmFsbHNwcml0ZVtpc3NdO1xyXG4gICAgICAgICAgICBzLlJlbmRlcihiLCBuZXcgdHQuVmVjdG9yMihNYXRoLnJhbmRvbSgpICogdywgTWF0aC5yYW5kb20oKSAqIGggLyAyKSxcclxuICAgICAgICAgICAgICAgIG5ldyB0dC5WZWN0b3IyKDEsIDEpKTtcclxuICAgICAgICAgICAgLy90aGlzLmRyYXdSZWN0KGx0ZXgsIDAsIG5ldyB0dC5SZWN0YW5nbGUoTWF0aC5yYW5kb20oKSAqIHcsIE1hdGgucmFuZG9tKCkgKiBoLCAxMiwgMTIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGlucHV0c2NhbGUgPSB0dC5ncmFwaGljLmdldEZpbmFsU2NhbGUoKTtcclxuICAgICAgICBsZXQgcHMgPSB0dC5pbnB1dC5HZXRJbnB1dFBvaW50cygpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHBzW2ldLnByZXNzKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXNzID0gKChNYXRoLnJhbmRvbSgpICogMTAwMCkgfCAwKSAlIHRoaXMuYXRsYXMuYWxsc3ByaXRlLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHZhciBzID0gdGhpcy5hdGxhcy5hbGxzcHJpdGVbaXNzXTtcclxuICAgICAgICAgICAgICAgIGlmIChzID09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW5wdXRzY2FsZT1cIiArIGlucHV0c2NhbGUgKyBcIiBpZCA9IFwiICsgcHNbaV0uaWQgKyBcIiBpID1cIiArIGkpO1xyXG4gICAgICAgICAgICAgICAgcy5SZW5kZXIoYiwgbmV3IHR0LlZlY3RvcjIocHNbaV0ueCAqIGlucHV0c2NhbGUgLSA2NCwgcHNbaV0ueSAqIGlucHV0c2NhbGUgLSA2NCksXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IHR0LlZlY3RvcjIoMSwgMSksIHR0LkNvbG9yLldoaXRlKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5FbmREcmF3KCk7XHJcbiAgICB9XHJcbn0iXX0=