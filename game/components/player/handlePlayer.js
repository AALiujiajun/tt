var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//自己封装一个CreatePlayer函数，在其中应用懒汉模式
import * as tt2 from "../../../ttapi_layer2/ttlayer2.js";
import { tt } from "../../../ttapi_interface/ttapi.js";
import * as players from "../../interface/config/monster_config.js";
export default class handlePlayer {
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.json = {
                bullet: null,
                '2000': null,
                '2001': null,
                '2003': null,
                wall: null
            };
            this.atlasJson = yield tt2.QFrame_ResMgr.LoadAtlasAsync("data/ttatlas.json", true);
            this.json.bullet = JSON.parse(yield tt.loader.LoadStringAsync("data/bullet.json"));
            this.json.wall = JSON.parse(yield tt.loader.LoadStringAsync("data/wall.json"));
            this.json['2000'] = JSON.parse(yield tt.loader.LoadStringAsync("data/monster.json"));
            this.json['2001'] = JSON.parse(yield tt.loader.LoadStringAsync("data/monster2.json"));
            this.json['2003'] = JSON.parse(yield tt.loader.LoadStringAsync("data/monster3.json"));
        });
    }
    CreatePlayer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let playerType = 'p1';
            let jsonFile = 'data/monster.json';
            if (id === 2001) {
                playerType = 'p2';
                jsonFile = 'data/monster2.json';
            }
            if (id === 2003) {
                playerType = 'p3';
                jsonFile = 'data/monster3.json';
            }
            let player = tt2.QAni_PlayerMgr.CreatePlayer(playerType);
            let json = JSON.parse(JSON.stringify(this.json[id]));
            if (player == null) {
                // let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync("data/ttatlas.json", true);
                // let json = JSON.parse(await tt.loader.LoadStringAsync(jsonFile));
                // 循环frames里的ScaleX和ScaleY随机变为当前值的0.8-1.2倍
                json.animations.forEach((element) => {
                    element.frames
                        .forEach((frame) => {
                        frame.ScaleX = frame.ScaleX * (Math.random() * 0.4 + 0.8);
                        frame.ScaleY = frame.ScaleY * (Math.random() * 0.4 + 0.8);
                    });
                });
                tt2.QAni_PlayerMgr.LoadPlayerInfo(this.atlasJson, json);
                player = tt2.QAni_PlayerMgr.CreatePlayer(playerType);
            }
            if (player == null) {
                throw new Error("加载怪物 失败");
            }
            player.userdata = new players.MonsterData();
            return player;
        });
    }
    CreateBullet() {
        return __awaiter(this, void 0, void 0, function* () {
            let player = tt2.QAni_PlayerMgr.CreatePlayer("b1");
            if (player == null) {
                //      let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync("data/ttatlas.json", true);
                //let json = await tt.loader.LoadStringAsync("data/bullet.json");
                tt2.QAni_PlayerMgr.LoadPlayerInfo(this.atlasJson, this.json.bullet);
                player = tt2.QAni_PlayerMgr.CreatePlayer("b1");
            }
            if (player == null) {
                throw new Error("加载子弹 失败");
            }
            player.userdata = new players.BulletData();
            return player;
        });
    }
    CreateWall() {
        return __awaiter(this, void 0, void 0, function* () {
            let player = tt2.QAni_PlayerMgr.CreatePlayer("wall");
            if (player == null) {
                // let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync("data/ttatlas.json", true);
                // let json = await tt.loader.LoadStringAsync("data/wall.json");
                tt2.QAni_PlayerMgr.LoadPlayerInfo(this.atlasJson, this.json.wall);
                player = tt2.QAni_PlayerMgr.CreatePlayer("wall");
            }
            if (player == null) {
                throw new Error("加载城墙 失败");
            }
            player.userdata = new players.MyPlayerData();
            return player;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlUGxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGFuZGxlUGxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLGdDQUFnQztBQUNoQyxPQUFPLEtBQUssR0FBRyxNQUFNLG1DQUFtQyxDQUFBO0FBQ3hELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQTtBQUN0RCxPQUFPLEtBQUssT0FBTyxNQUFNLDBDQUEwQyxDQUFDO0FBQ3BFLE1BQU0sQ0FBQyxPQUFPLE9BQU8sWUFBWTtJQUkzQixNQUFNOztZQUVWLElBQUksQ0FBQyxJQUFJLEdBQUc7Z0JBQ1YsTUFBTSxFQUFFLElBQUk7Z0JBQ1osTUFBTSxFQUFFLElBQUk7Z0JBQ1osTUFBTSxFQUFFLElBQUk7Z0JBQ1osTUFBTSxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLElBQUk7YUFDWixDQUFBO1lBQ0EsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxDQUFBO1lBQ2xGLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUE7WUFDakYsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQTtZQUM3RSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7WUFDcEYsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FB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SSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDM0MsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQztLQUFBO0lBRUssVUFBVTs7WUFDZCxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBdUIsTUFBTSxDQUFDLENBQUM7WUFFM0UsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO2dCQUNuQixpRkFBaUY7Z0JBQ2pGLGdFQUFnRTtnQkFDL0QsR0FBRyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsRSxNQUFNLEdBQUcsR0FBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7YUFFbEQ7WUFDRCxJQUFJLE1BQU0sSUFBSSxJQUFJLEVBQUU7Z0JBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDNUI7WUFDRCxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQzdDLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLy/oh6rlt7HlsIHoo4XkuIDkuKpDcmVhdGVQbGF5ZXLlh73mlbDvvIzlnKjlhbbkuK3lupTnlKjmh5LmsYnmqKHlvI9cclxuaW1wb3J0ICogYXMgdHQyIGZyb20gXCIuLi8uLi8uLi90dGFwaV9sYXllcjIvdHRsYXllcjIuanNcIlxyXG5pbXBvcnQgeyB0dCB9IGZyb20gXCIuLi8uLi8uLi90dGFwaV9pbnRlcmZhY2UvdHRhcGkuanNcIlxyXG5pbXBvcnQgKiBhcyBwbGF5ZXJzIGZyb20gXCIuLi8uLi9pbnRlcmZhY2UvY29uZmlnL21vbnN0ZXJfY29uZmlnLmpzXCI7XHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGhhbmRsZVBsYXllciB7XHJcbiAgYXRsYXNKc29uOiBhbnk7XHJcbiAganNvbjogYW55O1xyXG5cclxuYXN5bmMgb25Jbml0KCkge1xyXG4gIFxyXG4gIHRoaXMuanNvbiA9IHtcclxuICAgIGJ1bGxldDogbnVsbCxcclxuICAgICcyMDAwJzogbnVsbCxcclxuICAgICcyMDAxJzogbnVsbCxcclxuICAgICcyMDAzJzogbnVsbCxcclxuICAgICB3YWxsOiBudWxsXHJcbiAgfVxyXG4gICB0aGlzLmF0bGFzSnNvbiA9IGF3YWl0IHR0Mi5RRnJhbWVfUmVzTWdyLkxvYWRBdGxhc0FzeW5jKFwiZGF0YS90dGF0bGFzLmpzb25cIiwgdHJ1ZSlcclxuICAgdGhpcy5qc29uLmJ1bGxldCA9SlNPTi5wYXJzZShhd2FpdCB0dC5sb2FkZXIuTG9hZFN0cmluZ0FzeW5jKFwiZGF0YS9idWxsZXQuanNvblwiKSlcclxuICAgdGhpcy5qc29uLndhbGwgPUpTT04ucGFyc2UoYXdhaXQgdHQubG9hZGVyLkxvYWRTdHJpbmdBc3luYyhcImRhdGEvd2FsbC5qc29uXCIpKVxyXG4gICB0aGlzLmpzb25bJzIwMDAnXSA9IEpTT04ucGFyc2UoYXdhaXQgdHQubG9hZGVyLkxvYWRTdHJpbmdBc3luYyhcImRhdGEvbW9uc3Rlci5qc29uXCIpKVxyXG4gICB0aGlzLmpzb25bJzIwMDEnXSA9IEpTT04ucGFyc2UoYXdhaXQgdHQubG9hZGVyLkxvYWRTdHJpbmdBc3luYyhcImRhdGEvbW9uc3RlcjIuanNvblwiKSlcclxuICAgdGhpcy5qc29uWycyMDAzJ10gPSBKU09OLnBhcnNlKGF3YWl0IHR0LmxvYWRlci5Mb2FkU3RyaW5nQXN5bmMoXCJkYXRhL21vbnN0ZXIzLmpzb25cIikpXHJcbiAgXHJcbiAgfVxyXG5cclxuICBhc3luYyBDcmVhdGVQbGF5ZXIoaWQ6IG51bWJlcik6IFByb21pc2U8dHQyLlFBbmlfUGxheWVyPHBsYXllcnMuTW9uc3RlckRhdGE+PiB7XHJcbiAgICBsZXQgcGxheWVyVHlwZSA9ICdwMSdcclxuICAgIGxldCBqc29uRmlsZSA9ICdkYXRhL21vbnN0ZXIuanNvbidcclxuICAgIGlmIChpZCA9PT0gMjAwMSkge1xyXG4gICAgICBwbGF5ZXJUeXBlID0gJ3AyJ1xyXG4gICAgICBqc29uRmlsZSA9ICdkYXRhL21vbnN0ZXIyLmpzb24nXHJcbiAgICB9XHJcblxyXG4gICAgaWYoaWQgPT09IDIwMDMpIHtcclxuICAgICAgcGxheWVyVHlwZSA9ICdwMydcclxuICAgICAganNvbkZpbGUgPSAnZGF0YS9tb25zdGVyMy5qc29uJ1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBwbGF5ZXIgPSB0dDIuUUFuaV9QbGF5ZXJNZ3IuQ3JlYXRlUGxheWVyPHBsYXllcnMuTW9uc3RlckRhdGE+KHBsYXllclR5cGUpO1xyXG5cclxuICAgIGxldCAganNvbjogYW55ID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh0aGlzLmpzb25baWRdKSk7XHJcbiAgICBcclxuICAgIGlmIChwbGF5ZXIgPT0gbnVsbCkge1xyXG4gICAgIC8vIGxldCBhdGxhcyA9IGF3YWl0IHR0Mi5RRnJhbWVfUmVzTWdyLkxvYWRBdGxhc0FzeW5jKFwiZGF0YS90dGF0bGFzLmpzb25cIiwgdHJ1ZSk7XHJcbiAgICAgLy8gbGV0IGpzb24gPSBKU09OLnBhcnNlKGF3YWl0IHR0LmxvYWRlci5Mb2FkU3RyaW5nQXN5bmMoanNvbkZpbGUpKTtcclxuXHJcbiAgICAgIC8vIOW+queOr2ZyYW1lc+mHjOeahFNjYWxlWOWSjFNjYWxlWemaj+acuuWPmOS4uuW9k+WJjeWAvOeahDAuOC0xLjLlgI1cclxuXHJcbiAgICAgIFxyXG4gICAgICBqc29uLmFuaW1hdGlvbnMuZm9yRWFjaCgoZWxlbWVudDogYW55KSA9PiB7XHJcbiAgICAgICAgZWxlbWVudC5mcmFtZXNcclxuICAgICAgICAgIC5mb3JFYWNoKChmcmFtZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGZyYW1lLlNjYWxlWCA9IGZyYW1lLlNjYWxlWCAqIChNYXRoLnJhbmRvbSgpICogMC40ICsgMC44KVxyXG4gICAgICAgICAgICBmcmFtZS5TY2FsZVkgPSBmcmFtZS5TY2FsZVkgKiAoTWF0aC5yYW5kb20oKSAqIDAuNCArIDAuOClcclxuICAgICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICAgIHR0Mi5RQW5pX1BsYXllck1nci5Mb2FkUGxheWVySW5mbyh0aGlzLmF0bGFzSnNvbiwganNvbik7XHJcbiAgICAgIHBsYXllciA9IHR0Mi5RQW5pX1BsYXllck1nci5DcmVhdGVQbGF5ZXIocGxheWVyVHlwZSk7XHJcblxyXG4gICAgfVxyXG4gICAgaWYgKHBsYXllciA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIuWKoOi9veaAqueJqSDlpLHotKVcIik7XHJcbiAgICB9XHJcbiAgICBwbGF5ZXIudXNlcmRhdGEgPSBuZXcgcGxheWVycy5Nb25zdGVyRGF0YSgpO1xyXG4gICAgcmV0dXJuIHBsYXllcjtcclxuICB9XHJcblxyXG4gIGFzeW5jIENyZWF0ZUJ1bGxldCgpOiBQcm9taXNlPHR0Mi5RQW5pX1BsYXllcjxwbGF5ZXJzLkJ1bGxldERhdGE+PiB7XHJcbiAgICBsZXQgcGxheWVyID0gdHQyLlFBbmlfUGxheWVyTWdyLkNyZWF0ZVBsYXllcjxwbGF5ZXJzLkJ1bGxldERhdGE+KFwiYjFcIik7XHJcblxyXG4gICAgaWYgKHBsYXllciA9PSBudWxsKSB7XHJcbi8vICAgICAgbGV0IGF0bGFzID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZEF0bGFzQXN5bmMoXCJkYXRhL3R0YXRsYXMuanNvblwiLCB0cnVlKTtcclxuICAgICAgLy9sZXQganNvbiA9IGF3YWl0IHR0LmxvYWRlci5Mb2FkU3RyaW5nQXN5bmMoXCJkYXRhL2J1bGxldC5qc29uXCIpO1xyXG4gICAgICB0dDIuUUFuaV9QbGF5ZXJNZ3IuTG9hZFBsYXllckluZm8odGhpcy5hdGxhc0pzb24sIHRoaXMuanNvbi5idWxsZXQpO1xyXG4gICAgICBwbGF5ZXIgPSB0dDIuUUFuaV9QbGF5ZXJNZ3IuQ3JlYXRlUGxheWVyKFwiYjFcIik7XHJcblxyXG4gICAgfVxyXG4gICAgaWYgKHBsYXllciA9PSBudWxsKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIuWKoOi9veWtkOW8uSDlpLHotKVcIik7XHJcbiAgICB9XHJcbiAgICBwbGF5ZXIudXNlcmRhdGEgPSBuZXcgcGxheWVycy5CdWxsZXREYXRhKCk7XHJcbiAgICByZXR1cm4gcGxheWVyO1xyXG4gIH1cclxuXHJcbiAgYXN5bmMgQ3JlYXRlV2FsbCgpOiBQcm9taXNlPHR0Mi5RQW5pX1BsYXllcjxwbGF5ZXJzLk15UGxheWVyRGF0YT4+IHtcclxuICAgIGxldCBwbGF5ZXIgPSB0dDIuUUFuaV9QbGF5ZXJNZ3IuQ3JlYXRlUGxheWVyPHBsYXllcnMuTXlQbGF5ZXJEYXRhPihcIndhbGxcIik7XHJcblxyXG4gICAgaWYgKHBsYXllciA9PSBudWxsKSB7XHJcbiAgICAgLy8gbGV0IGF0bGFzID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZEF0bGFzQXN5bmMoXCJkYXRhL3R0YXRsYXMuanNvblwiLCB0cnVlKTtcclxuICAgICAvLyBsZXQganNvbiA9IGF3YWl0IHR0LmxvYWRlci5Mb2FkU3RyaW5nQXN5bmMoXCJkYXRhL3dhbGwuanNvblwiKTtcclxuICAgICAgdHQyLlFBbmlfUGxheWVyTWdyLkxvYWRQbGF5ZXJJbmZvKHRoaXMuYXRsYXNKc29uLCB0aGlzLmpzb24ud2FsbCk7XHJcbiAgICAgIHBsYXllciA9IHR0Mi5RQW5pX1BsYXllck1nci5DcmVhdGVQbGF5ZXIoXCJ3YWxsXCIpO1xyXG5cclxuICAgIH1cclxuICAgIGlmIChwbGF5ZXIgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCLliqDovb3ln47lopkg5aSx6LSlXCIpO1xyXG4gICAgfVxyXG4gICAgcGxheWVyLnVzZXJkYXRhID0gbmV3IHBsYXllcnMuTXlQbGF5ZXJEYXRhKCk7XHJcbiAgICByZXR1cm4gcGxheWVyO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5cclxuIl19