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
import LevelData from "./impl/config/monster_config_impl.js";
import * as player from "./interface/config/monster_config.js";
import { BirthPosConfig } from "./interface/config/Birth_config.js";
import { Test_UITool } from "../ttapi_layer2_test/test_uitool.js";
import { UITool } from "./uitool.js";
import handlePlayer from "./components/player/handlePlayer.js";
import { QAni_Dir2ToRotate } from "../ttapi_layer2/ttlayer2.js";
import { BulletList, shopAccessoryList, shopBulletList } from "./interface/config/bullet_config.js";
class Vector2Func {
    //匀速移动方法
    //return false 表示到达
    static Goto(data, to, speed, delta) {
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
        // 怪物只会向下走
        data.direction = tt2.QAni_Direction.Down;
        tt2.QAni_UpdatePlayerAni(data);
        //本来写了下面的代码，有点啰嗦，封装一下
        // tt2.QAni_UpdatePlayerAniByPos(data,data.targetB.X,data.targetB.Y);
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
export class State_Game {
    OnInit(statemgr) {
        this.app = statemgr;
        this.hasinited = false;
        this.StartAsync();
        this.weaponGroup = {
            weapon1: null,
            weapon2: null,
            weapon3: null,
            weapon4: null,
        };
        this.levelNum = 1;
        this.roundNum = 1;
        this.roundCountDown = null;
        this.goldBg = null;
        this.shopCardMark = null;
        this.timer = null;
        this.inputscale = tt.graphic.getFinalScale();
        //糟糕的面向对象设计
        this.levelData = new LevelData().getLevelEnemyDataByLevel(this.levelNum, this.roundNum);
        this.nowMonsterCount = {};
        this.nowBullet = {};
        this.countMonsterTime = 0;
        this.countBulletTime = 0;
        // 开始刷怪
        this.gameStart = false;
        // 结束刷怪
        this.gameEnd = false;
        this.nowGold = 0;
        this.BulletList = ['急射炮'];
        this.BulletData = BulletList;
        this.nowAccessoryList = [];
        this.lockList = [];
        this.handlePlayerFun = new handlePlayer();
        this.handlePlayerFun.onInit();
    }
    StartAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            this.background = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/levelBg.png");
            this.app.target.ClearColor = new tt.Color(0.8, 0.3, 0.5, 1.0);
            //创建一个joystick UI 并放到canvas 并限制底部
            this.joystick = yield UITool.CreateJoyStick(this.app.canvas.getWorldRect());
            this.joystick.localRect.setHPosFill();
            this.joystick.localRect.radioY1 = 0.5;
            this.joystick.localRect.radioY2 = 1.0;
            this.app.canvas.addChild(this.joystick);
            this.players = [];
            this.bullets = [];
            this.walls = [];
            // this.createPanel()
            //this.players[0].posY = 500
            // 右侧配件和武器框
            let partBtn = yield UITool.CreateButtonByImg('data/uiimg/partLevel1.png', this.app.font, "");
            partBtn.localRect.setByRect(new tt.Rectangle(50, 300, this.inputscale * 60, this.inputscale * 60));
            partBtn.localRect.setHPosByRightBorder(this.inputscale * 60, 20);
            this.app.canvas.addChild(partBtn);
            partBtn.OnClick = () => {
            };
            this.weaponGroup.weapon1 = yield UITool.CreateButtonByImg('data/uiimg/weapon.png', this.app.font, "");
            this.weaponGroup.weapon1.localRect.setByRect(new tt.Rectangle(515, 300 + 60 * this.inputscale, this.inputscale * 60, this.inputscale * 60));
            this.weaponGroup.weapon1.localRect.setHPosByRightBorder(this.inputscale * 60, 20);
            this.app.canvas.addChild(this.weaponGroup.weapon1);
            this.weaponGroup.weapon2 = yield UITool.CreateButtonByImg('data/uiimg/weapon.png', this.app.font, "");
            this.weaponGroup.weapon2.localRect.setByRect(new tt.Rectangle(515, 300 + 60 * this.inputscale * 2, this.inputscale * 60, this.inputscale * 60));
            this.weaponGroup.weapon2.localRect.setHPosByRightBorder(this.inputscale * 60, 20);
            this.app.canvas.addChild(this.weaponGroup.weapon2);
            this.weaponGroup.weapon3 = yield UITool.CreateButtonByImg('data/uiimg/weapon.png', this.app.font, "");
            this.weaponGroup.weapon3.localRect.setByRect(new tt.Rectangle(515, 300 + 60 * this.inputscale * 3, this.inputscale * 60, this.inputscale * 60));
            this.weaponGroup.weapon3.localRect.setHPosByRightBorder(this.inputscale * 60, 20);
            this.app.canvas.addChild(this.weaponGroup.weapon3);
            // 设置
            let settingBtn = yield UITool.CreateButtonByImg('data/uiimg/setting.png', this.app.font, "");
            settingBtn.localRect.setByRect(new tt.Rectangle(550, 30, this.inputscale * 35, this.inputscale * 35));
            settingBtn.localRect.setHPosByRightBorder(this.inputscale * 35, 20);
            this.app.canvas.addChild(settingBtn);
            settingBtn.OnClick = () => {
            };
            // 金币
            this.goldBg = yield UITool.CreateImg('data/uiimg/goldBg.png', this.app.font, String(this.nowGold));
            this.goldBg.localRect.setByRect(new tt.Rectangle(370, 30, 135 * this.inputscale, 30 * this.inputscale));
            this.app.canvas.addChild(this.goldBg);
            let gold = yield UITool.CreateImg('data/uiimg/gold.png', this.app.font, "");
            gold.localRect.setByRect(new tt.Rectangle(360, 30, 35 * this.inputscale, 35 * this.inputscale));
            this.app.canvas.addChild(gold);
            // 倒计时
            this.roundCountDown = yield UITool.CreateImg('data/uiimg/roundCountdown.png', this.app.font, "0");
            this.app.canvas.addChild(this.roundCountDown);
            this.roundCountDown.localRect.setByRect(new tt.Rectangle(0, 0, 200 * this.inputscale, 55 * this.inputscale));
            yield this.InitRoundBg();
            this.roundBgTimer = 3.0; //用一个数字就能做定时器
            //不要用 setInterval 去驱动逻辑，会破坏帧驱动的系统;
            // 根据传入时间n秒后消失
            // 关卡倒计时
            this.roundCountDownTimer_MS = 0; //用豪秒为单位的计时器
            // todo 用onUpdate更新
            // tt.graphic.OnUpdate = (delta: number) => {
            //     this.canvas.localRect.setByRect(new tt.Rectangle(0, 0, this.target.getWidth(), this.target.getHeight()));
            //     this.canvas.OnUpdate(delta);
            //     this.updateFps(delta);
            //     this.OnUpdate(delta);
            // }
            this.app.batcherBottom.LookAt.X = 0;
            this.app.batcherBottom.LookAt.Y = 0;
            this.hasinited = true;
        });
    }
    // 生成商店界面
    createPanel() {
        return __awaiter(this, void 0, void 0, function* () {
            {
                let panel = new tt2.QUI_Panel();
                panel.borderElement = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                this.app.canvas.addChild(panel);
                panel.localRect.offsetX1 = 0 * this.inputscale;
                panel.localRect.offsetY1 = -10;
                panel.localRect.offsetX2 = panel.localRect.offsetX1 + 400 * this.inputscale;
                panel.localRect.offsetY2 = panel.localRect.offsetY1 + 700 * this.inputscale;
                {
                    let catSprite = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/black.jpg");
                    let catimage = new tt2.QUI_Image(catSprite);
                    panel.addChild(catimage);
                    catimage.localRect.setByRect(new tt.Rectangle(0, 0, 600 * this.inputscale, 900 * this.inputscale));
                    let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
                    panel.addChild(imagescale9);
                    imagescale9.localRect.offsetX1 = 200 * this.inputscale;
                    imagescale9.localRect.offsetY1 = 75 * this.inputscale;
                    imagescale9.localRect.offsetX2 = imagescale9.localRect.offsetX1 + 50 * this.inputscale;
                    imagescale9.localRect.offsetY2 = imagescale9.localRect.offsetY1 + 50 * this.inputscale;
                    let label = new tt2.QUI_Label(this.app.font, "肉鸽商店");
                    label.color.R = 0.7;
                    label.color.G = 0.7;
                    label.color.B = 0.3;
                    panel.addChild(label);
                    label.halign = tt2.QUI_HAlign.Middle;
                    //  label.valign = tt2.QUI_VAlign.Top;
                    label.localRect.setByRect(new tt.Rectangle(50, 50, this.app.target.getWidth() + this.inputscale * 100, this.inputscale * 20));
                    label.fontScale = new tt.Vector2(5, 5);
                    label.localRect.setHPosByCenter(100 * this.inputscale);
                    panel.addChild(label);
                    // 金币
                    let goldBg = yield UITool.CreateImg('data/uiimg/goldBg.png', this.app.font, String(this.nowGold));
                    goldBg.localRect.setByRect(new tt.Rectangle(140 * this.inputscale, 150, 105 * this.inputscale, 30 * this.inputscale));
                    //goldBg.localRect.setHPosByCenter(30 * this.inputscale)
                    panel.addChild(goldBg);
                    let gold = yield UITool.CreateImg('data/uiimg/gold.png', this.app.font, "");
                    gold.localRect.setByRect(new tt.Rectangle(135 * this.inputscale, 150, 35 * this.inputscale, 35 * this.inputscale));
                    // gold.localRect.setHPosByCenter(30 * this.inputscale)
                    panel.addChild(gold);
                    const nowTotal = yield this.refreshShop();
                    yield this.createCard(panel, nowTotal);
                    let btn = yield Test_UITool.CreateTestButton(this.app.font, "刷新");
                    btn.localRect.setByRect(new tt.Rectangle(300, 450 * this.inputscale, 75, 50));
                    btn.localRect.setHPosByRightBorder(60 * this.inputscale);
                    btn.OnClick = () => __awaiter(this, void 0, void 0, function* () {
                        const nowTotal = yield this.refreshShop();
                        yield this.reFreshCard(panel, nowTotal);
                    });
                    panel.addChild(btn);
                    let nextRound = yield Test_UITool.CreateTestButton(this.app.font, "next");
                    nextRound.localRect.setByRect(new tt.Rectangle(500, 650 * this.inputscale, 130, 50));
                    nextRound.localRect.setHPosByRightBorder(60 * this.inputscale);
                    panel.addChild(nextRound);
                }
            }
        });
    }
    // 刷新商店卡片
    reFreshCard(panel, nowTotal) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = this.shopCardMark;
            for (let i = 0; i < 6; i++) {
                // (this.roundBg.getChild(0) as tt2.QUI_Label).text = (this.roundBgTimer + 1 | 0).toString();
                const tempImage = panel.container._children[start + i].getChild(0);
                tempImage.sprite = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(nowTotal[i].img);
                const tempLabel = panel.container._children[start + i].getChild(1);
                tempLabel.text = nowTotal[i].name;
            }
        });
    }
    shuffle(arr) {
        var l = arr.length;
        var index, temp;
        while (l > 0) {
            index = Math.floor(Math.random() * l);
            temp = arr[l - 1];
            arr[l - 1] = arr[index];
            arr[index] = temp;
            l--;
        }
        return arr;
    }
    // 刷新商店物品
    refreshShop() {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取总商品目录
            let shouldShapAccessoryList = shopAccessoryList.filter((item) => {
                return this.BulletList.find((val) => {
                    return val === item.bulletName;
                });
            });
            const totol = [...shouldShapAccessoryList, ...shopBulletList];
            // 根据now的name属性去掉已经拥有的
            let now = totol.filter((item) => {
                return !this.nowAccessoryList.find((val) => {
                    return val.name === item.name;
                });
            });
            now = now.filter((item) => {
                return !this.BulletList.find((val) => {
                    return val.name === item;
                });
            });
            // 去掉和lockList重复的
            now = now.filter((item) => {
                return !this.lockList.find((val) => {
                    return val.name === item.name;
                });
            });
            this.lockList = [];
            now = yield this.shuffle(now);
            // 根据now随机生成6个
            const result = [];
            for (let i = 0; i < 6; i++) {
                //  const random = Math.floor(Math.random() * now.length)
                result.push(now[i]);
            }
            return result;
        });
    }
    createCard(panel, nowTotal) {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            let cardBg = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/cardBg.png");
            for (let i = 0; i < 6; i++) {
                let weaponCard = yield new tt2.QUI_Image(cardBg);
                let width = i;
                let height = 130;
                if (i > 2) {
                    width -= 3;
                    height = 300;
                }
                weaponCard.localRect.setByRect(new tt.Rectangle((width * 120 + 10) * this.inputscale, height * this.inputscale, this.inputscale * 110, this.inputscale * 150));
                if (i === 0 && this.shopCardMark === null) {
                    this.shopCardMark = panel.getChildCount();
                }
                panel.addChild(weaponCard);
                let weaponPic = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(nowTotal[i].img);
                let weaponPic1 = yield new tt2.QUI_Image(weaponPic);
                weaponPic1.localRect.setByRect(new tt.Rectangle(2 * this.inputscale, 15 * this.inputscale, this.inputscale * 30, this.inputscale * 50));
                weaponPic1.localRect.setHPosByCenter(20 * this.inputscale);
                weaponCard.addChild(weaponPic1);
                let label = new tt2.QUI_Label(this.app.font, nowTotal[i].name);
                label.localRect.setHPosByCenter(20 * this.inputscale);
                label.localRect.setVPosByBottomBorder(20 * this.inputscale, 60 * this.inputscale);
                label.fontScale = new tt.Vector2(1.5, 1.5);
                weaponCard.addChild(label);
                let btn2 = new tt2.QUI_Button();
                let label1 = new tt2.QUI_Label(this.app.font, "买");
                label1.fontScale = new tt.Vector2(2, 2);
                //label.halign = tt2.QUI_HAlign.Middle;
                btn2.localRect.setHPosByLeftBorder(35 * this.inputscale, -10 * this.inputscale);
                btn2.localRect.setVPosByBottomBorder(35 * this.inputscale, 3 * this.inputscale);
                btn2.addChild(label1);
                weaponCard.addChild(btn2);
                btn2.OnClick = () => {
                    if (this.nowGold > nowTotal[i].cost) {
                        this.nowGold -= nowTotal[i].cost;
                        this.BulletList.push(nowTotal);
                        weaponCard.removeChildAll();
                        let label = new tt2.QUI_Label(this.app.font, '已购买');
                        label.localRect.setHPosByCenter(20 * this.inputscale);
                        label.localRect.setVPosByBottomBorder(20 * this.inputscale, 60 * this.inputscale);
                        label.fontScale = new tt.Vector2(1.5, 1.5);
                        weaponCard.addChild(label);
                    }
                };
                let btn = new tt2.QUI_Button();
                let label2 = new tt2.QUI_Label(this.app.font, "锁");
                label2.fontScale = new tt.Vector2(2, 2);
                //label.halign = tt2.QUI_HAlign.Middle;
                btn.localRect.setHPosByRightBorder(35 * this.inputscale, 4 * this.inputscale);
                btn.localRect.setVPosByBottomBorder(35 * this.inputscale, 3 * this.inputscale);
                btn.addChild(label2);
                weaponCard.addChild(btn);
                btn.OnClick = () => {
                    // 检查this.lockList里有没有重复的nowTotal[i]
                    if (this.lockList.indexOf(nowTotal[i]) === -1) {
                        this.lockList.push(nowTotal[i]);
                        btn.removeChildAll();
                        setTimeout(function () {
                            let label2 = new tt2.QUI_Label(that.app.font, "锁");
                            label2.fontScale = new tt.Vector2(2, 2);
                            label2.color.R = 51;
                            label2.color.G = 102;
                            label2.color.B = 255;
                            //label.halign = tt2.QUI_HAlign.Middle;
                            btn.localRect.setHPosByRightBorder(35 * that.inputscale, 4 * that.inputscale);
                            btn.localRect.setVPosByBottomBorder(35 * that.inputscale, 3 * that.inputscale);
                            btn.addChild(label2);
                        }, 200);
                    }
                };
            }
            let weaponBg = yield tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/weaponBg.png");
            let weaponBg1 = new tt2.QUI_Image(weaponBg);
            panel.addChild(weaponBg1);
            weaponBg1.localRect.setByRect(new tt.Rectangle(0, 470 * this.inputscale, 80 * this.inputscale, 190 * this.inputscale));
            let weaponBg2 = new tt2.QUI_Image(weaponBg);
            panel.addChild(weaponBg2);
            weaponBg2.localRect.setByRect(new tt.Rectangle(73 * this.inputscale, 470 * this.inputscale, 80 * this.inputscale, 190 * this.inputscale));
            let weaponBg3 = new tt2.QUI_Image(weaponBg);
            panel.addChild(weaponBg3);
            weaponBg3.localRect.setByRect(new tt.Rectangle(73 * this.inputscale * 2, 470 * this.inputscale, 80 * this.inputscale, 190 * this.inputscale));
            let weaponBg4 = new tt2.QUI_Image(weaponBg);
            panel.addChild(weaponBg4);
            weaponBg4.localRect.setByRect(new tt.Rectangle(73 * this.inputscale * 3, 470 * this.inputscale, 80 * this.inputscale, 190 * this.inputscale));
            let weaponBg5 = new tt2.QUI_Image(weaponBg);
            panel.addChild(weaponBg5);
            weaponBg5.localRect.setByRect(new tt.Rectangle(73 * this.inputscale * 4, 470 * this.inputscale, 80 * this.inputscale, 190 * this.inputscale));
        });
    }
    // 刷怪物
    monsterCreate(delta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.gameStart)
                return;
            this.countMonsterTime += delta;
            this.levelData.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                yield this.handleMonsterCreate(item);
            }));
        });
    }
    //这代码思路是有坑的，你顺序执行刷怪
    //但是用同一个nowMonster(count)控制总数量
    //然后用 不同的shouldCount控制每种怪的最大数量
    //这就导致顺序相关了，
    //解坑办法，nowMonsterCount 改成分开控制
    handleMonsterCreate(val) {
        return __awaiter(this, void 0, void 0, function* () {
            let shouldCount = Math.floor(this.countMonsterTime / val.Frequency) * val.CreateNB;
            // console.log输出怪物编号和刷怪数量
            console.log('id:' + val.EnemyID + '    num:' + shouldCount);
            if (shouldCount === 0)
                shouldCount = 1;
            let nowCount = this.nowMonsterCount[val.EnemyID];
            if (nowCount == undefined) {
                nowCount = this.nowMonsterCount[val.EnemyID] = 0;
            }
            //if (nowCount >= val.CreateNB) { this.gameStart = false }
            const BirthGroup = [];
            // 刷新点集合
            val.Birth.split(';').forEach((item) => {
                BirthGroup.push(BirthPosConfig[item]);
            });
            let birthIndex = Math.floor(Math.random() * BirthGroup.length);
            for (let i = 0; i < shouldCount - nowCount; i++) {
                this.nowMonsterCount[val.EnemyID]++;
                // 基本速度单位
                const speed = 50;
                //转为monster.MyPlayerData 加几个属性进去
                console.log("item.eid=" + val.EnemyID);
                let p = yield this.handlePlayerFun.CreatePlayer(val.EnemyID);
                let ext = p.userdata = new player.MonsterData();
                p.posX = BirthGroup[birthIndex].posX * this.inputscale + (Math.random() * 280 - 140);
                p.posY = -400 * this.inputscale;
                ext.targetA = new tt.Vector2(p.posX, 500 * this.inputscale);
                ext.targetB = new tt.Vector2(p.posX, 500 * this.inputscale);
                ext.speed = speed;
                ext.health = val.Monster.Healh;
                ext.damage = val.Monster.Damage;
                ext.raward = val.Monster.Raward;
                tt2.QAni_UpdatePlayerAni(p);
                this.players.push(p);
            }
        });
    }
    // 发射子弹
    bulletCreate(delta) {
        return __awaiter(this, void 0, void 0, function* () {
            //  if (!this.gameStart) return
            if (!this.gameEnd)
                return;
            this.countBulletTime += delta;
            //
            this.BulletList.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                const temp = this.BulletData.find((val) => {
                    return val.bulletName === item;
                });
                yield this.weaponCreate(temp);
            }));
        });
    }
    weaponCreate(val) {
        return __awaiter(this, void 0, void 0, function* () {
            let shouldCount = Math.round(this.countBulletTime / val.Rate);
            let nowCount = this.nowBullet[val.bulletName];
            if (nowCount == undefined) {
                nowCount = this.nowBullet[val.bulletName] = 0;
            }
            for (let i = 0; i < shouldCount - nowCount; i++) {
                //  targetx默认为随机-30到30
                let targetx = Math.random() * 60 - 30;
                let targety = -400 * this.inputscale;
                // 摇杆控制子弹方向
                if (this.touchdir !== null) {
                    targetx += this.touchdir.X * 1000;
                }
                this.nowBullet[val.bulletName] += 1;
                // 基本速度单位
                const speed = 1000;
                //转为monster.MyPlayerData 加几个属性进去
                let p = yield this.handlePlayerFun.CreateBullet();
                p.aniname = val.bulletName;
                p.posX = 0;
                p.posY = 400 * this.inputscale;
                p.userdata.targetA = new tt.Vector2(targetx, targety);
                p.userdata.targetB = new tt.Vector2(targetx, targety);
                p.userdata.speed = speed;
                p.userdata.bulletDamage = 10;
                p.userotate = true;
                p.rotate = QAni_Dir2ToRotate(targetx - p.posX, targety - p.posY);
                this.bullets.push(p);
            }
        });
    }
    // 城墙
    wallCreate() {
        return __awaiter(this, void 0, void 0, function* () {
            // if (!this.gameStart) return
            for (let i = 0; i < 8; i++) {
                let p = yield this.handlePlayerFun.CreateWall();
                p.posX = -375 + i * 100;
                p.posY = 390;
                this.walls.push(p);
            }
        });
    }
    // 波次
    InitRoundBg() {
        return __awaiter(this, void 0, void 0, function* () {
            this.roundBg = yield UITool.CreateImg('data/uiimg/roundNumBg.png', this.app.font, this.roundNum.toString() + '波');
            this.roundBg.localRect.setByRect(new tt.Rectangle(230, 200, 103 * this.inputscale, 90 * this.inputscale));
            this.roundBg.localRect.setHPosByCenter(103 * this.inputscale);
            this.app.canvas.addChild(this.roundBg);
            return;
        });
    }
    // 进入下一波次
    roundEnd() {
        this.roundNum++;
        this.roundBgTimer = 3.0;
        this.players = [];
        this.bullets = [];
        this.gameStart = false;
        this.gameEnd = false;
        this.nowMonsterCount = {};
        this.countMonsterTime = 0;
        this.countBulletTime = 0;
        this.nowBullet = {};
        if (this.walls.length === 0) {
            // 游戏结束
        }
        else {
            this.InitRoundBg();
            this.levelData = new LevelData().getLevelEnemyDataByLevel(this.levelNum, this.roundNum);
        }
    }
    bulletchange() {
        this.nowBullet = {};
        this.countBulletTime = 0;
    }
    //  showtime(second: number): string  {
    // // 根据传入秒数 返回分秒毫秒倒计时
    // let min = Math.floor(second / 60);
    // let sec = Math.floor(second % 60);
    // let msec = Math.floor((second - Math.floor(second)) * 100);
    // let minStr = min < 10 ? "0" + min : min;
    // let secStr = sec < 10 ? "0" + sec : sec;
    // let msecStr = msec < 10 ? "0" + msec : msec;
    // this.roundCountDownTime = minStr + ":" + secStr + ":" + msecStr;
    // return minStr + ":" + secStr + ":" + msecStr;
    // }
    OnExit() {
        this.app.canvas.removeChildAll();
        clearInterval(this.timer);
    }
    updateBGBtnTimer(delta) {
        if (this.roundBg != null) {
            this.roundBgTimer -= delta;
            if (this.roundBgTimer < 0) {
                this.roundBg.getParent().removeChild(this.roundBg);
                this.roundBg = null;
                this.gameStart = true;
                this.gameEnd = true;
                this.roundCountDownTimer_MS = this.levelData[0].time * 1000;
                this.wallCreate();
                this.createPanel();
            }
            else {
                //   (this.roundBg.getChild(0) as tt2.QUI_Label).text = (this.roundBgTimer + 1 | 0).toString();
            }
        }
    }
    updateRoundCountDownTimer(delta) {
        if (this.roundCountDown == null)
            return;
        let timerstr = "00:00:00";
        if (this.roundCountDownTimer_MS > 0) {
            this.roundCountDownTimer_MS -= delta * 1000;
            if (this.roundCountDownTimer_MS > 0) {
                let minutes = Math.floor((this.roundCountDownTimer_MS / 1000 / 60) % 60);
                let seconds = Math.floor((this.roundCountDownTimer_MS / 1000) % 60);
                let ms = (this.roundCountDownTimer_MS % 1000) | 0;
                ms = (ms / (1000 / 60)) | 0;
                if (ms >= 59)
                    ms = 59;
                ms = ms < 10 ? '0' + ms : ms;
                timerstr = minutes + ":" + seconds + ":" + ms;
            }
            else {
                timerstr = "00:00:00";
                this.gameStart = false;
                //this.roundEnd()
            }
        }
        let label = this.roundCountDown.getChild(0);
        if (label != null)
            label.text = timerstr;
    }
    OnUpdate(delta) {
        if (!this.hasinited)
            return;
        this.updateBGBtnTimer(delta);
        this.updateRoundCountDownTimer(delta);
        this.monsterCreate(delta);
        this.bulletCreate(delta);
        this.touchdir = this.joystick.GetTouchDirection();
        // if (touchdir != null) {
        //     this.app.batcherBottom.LookAt.X += touchdir.X * 100;
        //     this.app.batcherBottom.LookAt.Y += touchdir.Y * 100;
        //     if (this.app.batcherBottom.LookAt.X < -0)
        //         this.app.batcherBottom.LookAt.X = -0;
        //     if (this.app.batcherBottom.LookAt.X > 800)
        //         this.app.batcherBottom.LookAt.X = 800;
        //     if (this.app.batcherBottom.LookAt.Y < -0)
        //         this.app.batcherBottom.LookAt.Y = -0;
        //     if (this.app.batcherBottom.LookAt.Y > 1600)
        //         this.app.batcherBottom.LookAt.Y = 1600;
        // }
        this.players.sort((a, b) => {
            return a.posY - b.posY;
        });
        this.bullets.sort((a, b) => {
            return a.posY - b.posY;
        });
        this.walls.sort((a, b) => {
            return a.posY - b.posY;
        });
        this.UpdatePlayerMove(delta);
        this.UpdateBulletsMove(delta);
        tt2.QAni_PlayerMgr.UpdatePlayers_Ani(this.players, delta);
        tt2.QAni_PlayerMgr.UpdatePlayers_Ani(this.bullets, delta);
    }
    UpdatePlayerMove(delta) {
        if (this.players.length === 0 && this.roundCountDownTimer_MS === 0 && this.gameEnd) {
            this.roundEnd();
            //  this.gameEnd = false
            return;
        }
        for (var i = 0; i < this.players.length; i++) {
            let p = this.players[i];
            // 播放帧完毕删除怪物
            if (p.aniname === 'gone' && p.end) {
                this.players.splice(i, 1);
            }
            this.bullets.forEach((bullet, bulletIndex) => {
                if (p.aniname === 'gone')
                    return;
                if (bullet.posX > p.posX - 30 && bullet.posX < p.posX + 30 && bullet.posY > p.posY - 30 && bullet.posY < p.posY + 30) {
                    p.userdata.health = p.userdata.health - bullet.userdata.bulletDamage;
                    this.bullets.splice(bulletIndex, 1);
                    // 被击退
                    p.userdata.targetB = new tt.Vector2(p.posX, p.posY - 5);
                    p.aniname = 'back';
                    // 被击杀
                    if (p.userdata.health <= 0) {
                        p.aniname = 'gone';
                        this.nowGold += p.userdata.raward;
                        let label = this.goldBg.getChild(0);
                        if (label != null) {
                            label.text = String(this.nowGold);
                        }
                    }
                    tt2.QAni_UpdatePlayerAni(p);
                    //this.players.splice(i, 1)
                }
            });
            this.walls.forEach((wall, wallIndex) => {
                if (wall.posX > p.posX - 130 && wall.posX < p.posX + 130 && wall.posY > p.posY - 50 && wall.posY < p.posY + 50) {
                    this.walls = [];
                    this.createPanel();
                    // todo 执行游戏结束
                }
            });
            if (p.aniname === 'back') {
                let b = Vector2Func.Goto(p, p.userdata.targetB, p.userdata.speed, delta);
                //到达
                if (b == false) {
                    p.aniname = 'walk';
                    p.userdata.targetB = new tt.Vector2(p.posX, p.userdata.targetA.Y);
                    tt2.QAni_UpdatePlayerAni(p);
                }
            }
            if (p.aniname === 'walk') {
                let b = Vector2Func.Goto(p, p.userdata.targetB, p.userdata.speed, delta);
                //到达
                if (b == false) {
                    this.players.splice(i, 1);
                }
            }
        }
    }
    UpdateBulletsMove(delta) {
        for (var i = 0; i < this.bullets.length; i++) {
            let p = this.bullets[i];
            let b = Vector2Func.Goto(p, p.userdata.targetB, p.userdata.speed, delta);
            if (b == false) {
                this.bullets.splice(i, 1);
            } //到达
        }
    }
    OnRender() {
        if (!this.hasinited)
            return;
        this.app.batcherBottom.BeginDraw(this.app.target);
        this.background.RenderRect(this.app.batcherBottom, new tt.Rectangle(-400 * this.inputscale, -800 * this.inputscale, 800 * this.inputscale, 1600 * this.inputscale));
        tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.bullets);
        tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.walls);
        tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.players);
        this.app.batcherBottom.EndDraw();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGVfZ2FtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YXRlX2dhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLDZCQUE2QixDQUFBO0FBQ2hELE9BQU8sS0FBSyxHQUFHLE1BQU0sNkJBQTZCLENBQUE7QUFFbEQsT0FBTyxTQUFTLE1BQU0sc0NBQXNDLENBQUM7QUFDN0QsT0FBTyxLQUFLLE1BQU0sTUFBTSxzQ0FBc0MsQ0FBQztBQUMvRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sb0NBQW9DLENBQUE7QUFFbkUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRWxFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFJckMsT0FBTyxZQUFZLE1BQU0scUNBQXFDLENBQUM7QUFDL0QsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFaEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQTtBQUVuRyxNQUFNLFdBQVc7SUFDZixRQUFRO0lBQ1IsbUJBQW1CO0lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBMEIsRUFBRSxFQUFjLEVBQUUsS0FBYSxFQUFFLEtBQWE7UUFDbEYsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2xCLDhDQUE4QztRQUM5QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxH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QUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBRXpILElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ3pCLFNBQVMsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsQ0FBRSxFQUFFLEdBQUksSUFBSSxDQUFDLFVBQVUsRUFBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEdBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFL0ksSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDekIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFHLEVBQUUsR0FBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEdBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFFcEosSUFBSSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzVDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDekIsU0FBUyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFFLEVBQUUsR0FBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLEdBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLEdBQUksSUFB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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHQgfSBmcm9tIFwiLi4vdHRhcGlfaW50ZXJmYWNlL3R0YXBpLmpzXCJcclxuaW1wb3J0ICogYXMgdHQyIGZyb20gXCIuLi90dGFwaV9sYXllcjIvdHRsYXllcjIuanNcIlxyXG5cclxuaW1wb3J0IExldmVsRGF0YSBmcm9tIFwiLi9pbXBsL2NvbmZpZy9tb25zdGVyX2NvbmZpZ19pbXBsLmpzXCI7XHJcbmltcG9ydCAqIGFzIHBsYXllciBmcm9tIFwiLi9pbnRlcmZhY2UvY29uZmlnL21vbnN0ZXJfY29uZmlnLmpzXCI7XHJcbmltcG9ydCB7IEJpcnRoUG9zQ29uZmlnIH0gZnJvbSBcIi4vaW50ZXJmYWNlL2NvbmZpZy9CaXJ0aF9jb25maWcuanNcIlxyXG5cclxuaW1wb3J0IHsgVGVzdF9VSVRvb2wgfSBmcm9tIFwiLi4vdHRhcGlfbGF5ZXIyX3Rlc3QvdGVzdF91aXRvb2wuanNcIjtcclxuXHJcbmltcG9ydCB7IFVJVG9vbCB9IGZyb20gXCIuL3VpdG9vbC5qc1wiO1xyXG5pbXBvcnQgeyBTdGF0ZV9Mb2dvIH0gZnJvbSBcIi4vc3RhdGVfbG9nby5qc1wiO1xyXG5pbXBvcnQgeyBVc2VyRGF0YSB9IGZyb20gXCIuL3VzZXJkYXRhLmpzXCI7XHJcblxyXG5pbXBvcnQgaGFuZGxlUGxheWVyIGZyb20gXCIuL2NvbXBvbmVudHMvcGxheWVyL2hhbmRsZVBsYXllci5qc1wiO1xyXG5pbXBvcnQgeyBRQW5pX0RpcjJUb1JvdGF0ZSB9IGZyb20gXCIuLi90dGFwaV9sYXllcjIvdHRsYXllcjIuanNcIjtcclxuXHJcbmltcG9ydCB7IEJ1bGxldExpc3QsIHNob3BBY2Nlc3NvcnlMaXN0LCBzaG9wQnVsbGV0TGlzdCB9IGZyb20gXCIuL2ludGVyZmFjZS9jb25maWcvYnVsbGV0X2NvbmZpZy5qc1wiXHJcblxyXG5jbGFzcyBWZWN0b3IyRnVuYyB7XHJcbiAgLy/ljIDpgJ/np7vliqjmlrnms5VcclxuICAvL3JldHVybiBmYWxzZSDooajnpLrliLDovr5cclxuICBzdGF0aWMgR290byhkYXRhOiB0dDIuUUFuaV9QbGF5ZXI8YW55PiwgdG86IHR0LlZlY3RvcjIsIHNwZWVkOiBudW1iZXIsIGRlbHRhOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGxldCB4ID0gZGF0YS5wb3NYO1xyXG4gICAgbGV0IHkgPSBkYXRhLnBvc1k7XHJcbiAgICAvL+WPr+S7peeUqHR0LnZlY3RvcjIuRGlzdCDns7vliJfmlrnms5XorqHnrpfvvIzkvYbmmK/pnaLlkJHlr7nosaE957yT5oWi77yM6IO95bCR55So5a+56LGh5YiZ5bCR55SoXHJcbiAgICBsZXQgZGlzdCA9IE1hdGguc3FydCgoeCAtIHRvLlgpICogKHggLSB0by5YKSArICh5IC0gdG8uWSkgKiAoeSAtIHRvLlkpKTtcclxuICAgIGlmIChkaXN0IDwgMSlcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgIC8v5Y+v5Lul55SodHQudmVjdG9yMi5EaXIg57O75YiX5pa55rOV6K6h566X77yM6L+Z6YeM5piv5bGV5byA5b2i5oCBXHJcbiAgICBsZXQgZGlyWCA9ICh0by5YIC0geCkgLyBkaXN0O1xyXG4gICAgbGV0IGRpclkgPSAodG8uWSAtIHkpIC8gZGlzdDtcclxuXHJcbiAgICBsZXQgbW92ZWRpc3QgPSBzcGVlZCAqIGRlbHRhO1xyXG4gICAgZGF0YS5wb3NYID0geCArIGRpclggKiBtb3ZlZGlzdDtcclxuICAgIGRhdGEucG9zWSA9IHkgKyBkaXJZICogbW92ZWRpc3Q7XHJcblxyXG4gICAgLy8g5oCq54mp5Y+q5Lya5ZCR5LiL6LWwXHJcbiAgICBkYXRhLmRpcmVjdGlvbiA9IHR0Mi5RQW5pX0RpcmVjdGlvbi5Eb3duO1xyXG4gICAgdHQyLlFBbmlfVXBkYXRlUGxheWVyQW5pKGRhdGEpO1xyXG5cclxuICAgIC8v5pys5p2l5YaZ5LqG5LiL6Z2i55qE5Luj56CB77yM5pyJ54K55ZWw5Zem77yM5bCB6KOF5LiA5LiLXHJcbiAgICAvLyB0dDIuUUFuaV9VcGRhdGVQbGF5ZXJBbmlCeVBvcyhkYXRhLGRhdGEudGFyZ2V0Qi5YLGRhdGEudGFyZ2V0Qi5ZKTtcclxuXHJcblxyXG4gICAgLy/nlKjmsLTlubPmlrnlkJHmlLnkuIDkuIvmlrnlkJFcclxuICAgIC8vIGlmIChkaXJYIDwgMCYmZGF0YS5kaXJlY3Rpb24hPXR0Mi5RQW5pX0RpcmVjdGlvbi5MZWZ0KVxyXG4gICAgLy8geyAgICBcclxuICAgIC8vICAgICAgZGF0YS5kaXJlY3Rpb24gPSB0dDIuUUFuaV9EaXJlY3Rpb24uTGVmdDtcclxuICAgIC8vICAgICAgdHQyLlFBbmlfVXBkYXRlUGxheWVyQW5pKGRhdGEpO1xyXG4gICAgLy8gfVxyXG4gICAgLy8gaWYgKGRpclggPiAwJiZkYXRhLmRpcmVjdGlvbiE9dHQyLlFBbmlfRGlyZWN0aW9uLlJpZ2h0KVxyXG4gICAgLy8ge1xyXG4gICAgLy8gICAgIGRhdGEuZGlyZWN0aW9uID0gdHQyLlFBbmlfRGlyZWN0aW9uLlJpZ2h0O1xyXG4gICAgLy8gICAgIHR0Mi5RQW5pX1VwZGF0ZVBsYXllckFuaShkYXRhKTtcclxuICAgIC8vIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRlX0dhbWUgaW1wbGVtZW50cyB0dDIuUUZyYW1lX0lTdGF0ZTxVc2VyRGF0YT5cclxue1xyXG4gIGFwcDogdHQyLlFGcmFtZV9BcHA8VXNlckRhdGE+O1xyXG4gIGdhbWVTdGFydDogYm9vbGVhbjtcclxuICBnYW1lRW5kOiBib29sZWFuO1xyXG4gIGhhc2luaXRlZDogYm9vbGVhblxyXG4gIHBhcnRMZXZlbDogTnVtYmVyO1xyXG4gIHdlYXBvbkdyb3VwOiB7XHJcbiAgICB3ZWFwb24xOiB0dDIuUVVJX0J1dHRvbixcclxuICAgIHdlYXBvbjI6IHR0Mi5RVUlfQnV0dG9uLFxyXG4gICAgd2VhcG9uMzogdHQyLlFVSV9CdXR0b24sXHJcbiAgICB3ZWFwb240OiB0dDIuUVVJX0J1dHRvbixcclxuICB9O1xyXG4gIC8vIOWFs+WNoVxyXG4gIGxldmVsTnVtOiBudW1iZXI7XHJcbiAgLy8g5rOi5qyhXHJcbiAgcm91bmROdW06IG51bWJlcjtcclxuICByb3VuZEJnOiB0dDIuUVVJX0ltYWdlO1xyXG4gIHJvdW5kQmdUaW1lcjogbnVtYmVyOy8v5LiA5Liq5pWw5a2X5bCx5piv5LiA5Liq5a6a5pe25Zmo77yI6buY6K6k55So56eS5Li65Y2V5L2N77yJXHJcbiAgcm91bmRDb3VudERvd246IHR0Mi5RVUlfSW1hZ2U7XHJcbiAgZ29sZEJnOiB0dDIuUVVJX0ltYWdlO1xyXG4gIHJvdW5kQ291bnREb3duVGltZXJfTVM6IG51bWJlcjtcclxuICBhdGxhczogdHQuQXRsYXM7XHJcbiAgcGxheWVyczogdHQyLlFBbmlfUGxheWVyPHBsYXllci5Nb25zdGVyRGF0YT5bXTtcclxuICBidWxsZXRzOiB0dDIuUUFuaV9QbGF5ZXI8cGxheWVyLkJ1bGxldERhdGE+W107XHJcbiAgd2FsbHM6IHR0Mi5RQW5pX1BsYXllcjxwbGF5ZXIuTXlQbGF5ZXJEYXRhPltdO1xyXG4gIHVzZXJwbGF5ZXI6IHR0Mi5RQW5pX1BsYXllcjxwbGF5ZXIuTW9uc3RlckRhdGE+O1xyXG4gIGJhY2tncm91bmQ6IHR0LlNwcml0ZTtcclxuICBqb3lzdGljazogdHQyLlFVSV9Kb3lTdGljaztcclxuICB0aW1lcjogbnVtYmVyO1xyXG4gIGlucHV0c2NhbGU6IG51bWJlcjtcclxuICBub3dNb25zdGVyQ291bnQ6IHsgW2lkOiBudW1iZXJdOiBudW1iZXIgfTtcclxuICBCdWxsZXRMaXN0OiBhbnlbXTtcclxuICBub3dBY2Nlc3NvcnlMaXN0OiBhbnlbXTtcclxuICBCdWxsZXREYXRhOiBhbnk7XHJcbiAgbm93QnVsbGV0OiB7IFtpZDogbnVtYmVyXTogbnVtYmVyIH07XHJcbiAgY291bnRNb25zdGVyVGltZTogbnVtYmVyO1xyXG4gIGNvdW50QnVsbGV0VGltZTogbnVtYmVyO1xyXG4gIGxldmVsRGF0YTogcGxheWVyLkxldmVsRW5lbXlXaXRoTW9uc3RlcltdO1xyXG4gIHRvdWNoZGlyOiB0dC5WZWN0b3IyO1xyXG4gIGhhbmRsZVBsYXllckZ1bjogaGFuZGxlUGxheWVyO1xyXG4gIGxvY2tMaXN0IDogYW55O1xyXG4gIG5vd0dvbGQ6IG51bWJlcjtcclxuICAvLyDllYblupfliLfljaHniYznmoTkuIvmoIdcclxuICBzaG9wQ2FyZE1hcms6IG51bWJlcjtcclxuICBPbkluaXQoc3RhdGVtZ3I6IHR0Mi5RRnJhbWVfQXBwPFVzZXJEYXRhPik6IHZvaWQge1xyXG4gICAgdGhpcy5hcHAgPSBzdGF0ZW1ncjtcclxuICAgIFxyXG4gICAgdGhpcy5oYXNpbml0ZWQgPSBmYWxzZTtcclxuICAgIHRoaXMuU3RhcnRBc3luYygpO1xyXG4gICAgdGhpcy53ZWFwb25Hcm91cCA9IHtcclxuICAgICAgd2VhcG9uMTogbnVsbCxcclxuICAgICAgd2VhcG9uMjogbnVsbCxcclxuICAgICAgd2VhcG9uMzogbnVsbCxcclxuICAgICAgd2VhcG9uNDogbnVsbCxcclxuICAgIH1cclxuICAgIHRoaXMubGV2ZWxOdW0gPSAxXHJcbiAgICB0aGlzLnJvdW5kTnVtID0gMVxyXG4gICAgdGhpcy5yb3VuZENvdW50RG93biA9IG51bGxcclxuICAgIHRoaXMuZ29sZEJnID0gbnVsbFxyXG5cclxuICAgIHRoaXMuc2hvcENhcmRNYXJrID0gbnVsbFxyXG4gICAgdGhpcy50aW1lciA9IG51bGxcclxuICAgIHRoaXMuaW5wdXRzY2FsZSA9IHR0LmdyYXBoaWMuZ2V0RmluYWxTY2FsZSgpO1xyXG5cclxuICAgIC8v57Of57OV55qE6Z2i5ZCR5a+56LGh6K6+6K6hXHJcblxyXG4gICAgdGhpcy5sZXZlbERhdGEgPSBuZXcgTGV2ZWxEYXRhKCkuZ2V0TGV2ZWxFbmVteURhdGFCeUxldmVsKHRoaXMubGV2ZWxOdW0sIHRoaXMucm91bmROdW0pXHJcblxyXG4gICAgdGhpcy5ub3dNb25zdGVyQ291bnQgPSB7fVxyXG4gICAgdGhpcy5ub3dCdWxsZXQgPSB7fVxyXG4gICAgdGhpcy5jb3VudE1vbnN0ZXJUaW1lID0gMFxyXG4gICAgdGhpcy5jb3VudEJ1bGxldFRpbWUgPSAwXHJcbiAgICAvLyDlvIDlp4vliLfmgKpcclxuICAgIHRoaXMuZ2FtZVN0YXJ0ID0gZmFsc2VcclxuICAgIC8vIOe7k+adn+WIt+aAqlxyXG4gICAgdGhpcy5nYW1lRW5kID0gZmFsc2VcclxuICAgIHRoaXMubm93R29sZCA9IDBcclxuICAgIHRoaXMuQnVsbGV0TGlzdCA9IFsn5oCl5bCE54KuJ11cclxuICAgIHRoaXMuQnVsbGV0RGF0YSA9IEJ1bGxldExpc3RcclxuICAgIHRoaXMubm93QWNjZXNzb3J5TGlzdCA9IFtdXHJcbiAgICB0aGlzLmxvY2tMaXN0ID0gW11cclxuICAgIHRoaXMuaGFuZGxlUGxheWVyRnVuID0gbmV3IGhhbmRsZVBsYXllcigpXHJcbiAgICB0aGlzLmhhbmRsZVBsYXllckZ1bi5vbkluaXQoKVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgU3RhcnRBc3luYygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRoaXMuYmFja2dyb3VuZCA9IGF3YWl0IHR0Mi5RRnJhbWVfUmVzTWdyLkxvYWRTdGFuZGFsb25lU3ByaXRlQXN5bmMoXCJkYXRhL3VpaW1nL2xldmVsQmcucG5nXCIpO1xyXG5cclxuICAgIHRoaXMuYXBwLnRhcmdldC5DbGVhckNvbG9yID0gbmV3IHR0LkNvbG9yKDAuOCwgMC4zLCAwLjUsIDEuMCk7XHJcblxyXG4gICAgLy/liJvlu7rkuIDkuKpqb3lzdGljayBVSSDlubbmlL7liLBjYW52YXMg5bm26ZmQ5Yi25bqV6YOoXHJcbiAgICB0aGlzLmpveXN0aWNrID0gYXdhaXQgVUlUb29sLkNyZWF0ZUpveVN0aWNrKHRoaXMuYXBwLmNhbnZhcy5nZXRXb3JsZFJlY3QoKSk7XHJcblxyXG4gICAgdGhpcy5qb3lzdGljay5sb2NhbFJlY3Quc2V0SFBvc0ZpbGwoKTtcclxuICAgIHRoaXMuam95c3RpY2subG9jYWxSZWN0LnJhZGlvWTEgPSAwLjU7XHJcbiAgICB0aGlzLmpveXN0aWNrLmxvY2FsUmVjdC5yYWRpb1kyID0gMS4wXHJcbiAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQodGhpcy5qb3lzdGljayk7XHJcblxyXG5cclxuICAgIHRoaXMucGxheWVycyA9IFtdO1xyXG4gICAgdGhpcy5idWxsZXRzID0gW11cclxuICAgIHRoaXMud2FsbHMgPSBbXVxyXG4gICAvLyB0aGlzLmNyZWF0ZVBhbmVsKClcclxuXHJcbiAgICAvL3RoaXMucGxheWVyc1swXS5wb3NZID0gNTAwXHJcblxyXG4gICAgLy8g5Y+z5L6n6YWN5Lu25ZKM5q2m5Zmo5qGGXHJcbiAgICBsZXQgcGFydEJ0biA9IGF3YWl0IFVJVG9vbC5DcmVhdGVCdXR0b25CeUltZygnZGF0YS91aWltZy9wYXJ0TGV2ZWwxLnBuZycsIHRoaXMuYXBwLmZvbnQsIFwiXCIpO1xyXG4gICAgcGFydEJ0bi5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoNTAsIDMwMCwgdGhpcy5pbnB1dHNjYWxlICogNjAsIHRoaXMuaW5wdXRzY2FsZSAqIDYwKSk7XHJcbiAgICBwYXJ0QnRuLmxvY2FsUmVjdC5zZXRIUG9zQnlSaWdodEJvcmRlcih0aGlzLmlucHV0c2NhbGUgKiA2MCwgMjApXHJcbiAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQocGFydEJ0bik7XHJcbiAgICBwYXJ0QnRuLk9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53ZWFwb25Hcm91cC53ZWFwb24xID0gYXdhaXQgVUlUb29sLkNyZWF0ZUJ1dHRvbkJ5SW1nKCdkYXRhL3VpaW1nL3dlYXBvbi5wbmcnLCB0aGlzLmFwcC5mb250LCBcIlwiKTtcclxuICAgIHRoaXMud2VhcG9uR3JvdXAud2VhcG9uMS5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoNTE1LCAzMDAgKyA2MCAqIHRoaXMuaW5wdXRzY2FsZSwgdGhpcy5pbnB1dHNjYWxlICogNjAsIHRoaXMuaW5wdXRzY2FsZSAqIDYwKSk7XHJcbiAgICB0aGlzLndlYXBvbkdyb3VwLndlYXBvbjEubG9jYWxSZWN0LnNldEhQb3NCeVJpZ2h0Qm9yZGVyKHRoaXMuaW5wdXRzY2FsZSAqIDYwLCAyMClcclxuICAgIHRoaXMuYXBwLmNhbnZhcy5hZGRDaGlsZCh0aGlzLndlYXBvbkdyb3VwLndlYXBvbjEpO1xyXG5cclxuICAgIHRoaXMud2VhcG9uR3JvdXAud2VhcG9uMiA9IGF3YWl0IFVJVG9vbC5DcmVhdGVCdXR0b25CeUltZygnZGF0YS91aWltZy93ZWFwb24ucG5nJywgdGhpcy5hcHAuZm9udCwgXCJcIik7XHJcbiAgICB0aGlzLndlYXBvbkdyb3VwLndlYXBvbjIubG9jYWxSZWN0LnNldEJ5UmVjdChuZXcgdHQuUmVjdGFuZ2xlKDUxNSwgMzAwICsgNjAgKiB0aGlzLmlucHV0c2NhbGUgKiAyLCB0aGlzLmlucHV0c2NhbGUgKiA2MCwgdGhpcy5pbnB1dHNjYWxlICogNjApKTtcclxuICAgIHRoaXMud2VhcG9uR3JvdXAud2VhcG9uMi5sb2NhbFJlY3Quc2V0SFBvc0J5UmlnaHRCb3JkZXIodGhpcy5pbnB1dHNjYWxlICogNjAsIDIwKVxyXG4gICAgdGhpcy5hcHAuY2FudmFzLmFkZENoaWxkKHRoaXMud2VhcG9uR3JvdXAud2VhcG9uMik7XHJcblxyXG4gICAgdGhpcy53ZWFwb25Hcm91cC53ZWFwb24zID0gYXdhaXQgVUlUb29sLkNyZWF0ZUJ1dHRvbkJ5SW1nKCdkYXRhL3VpaW1nL3dlYXBvbi5wbmcnLCB0aGlzLmFwcC5mb250LCBcIlwiKTtcclxuICAgIHRoaXMud2VhcG9uR3JvdXAud2VhcG9uMy5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoNTE1LCAzMDAgKyA2MCAqIHRoaXMuaW5wdXRzY2FsZSAqIDMsIHRoaXMuaW5wdXRzY2FsZSAqIDYwLCB0aGlzLmlucHV0c2NhbGUgKiA2MCkpO1xyXG4gICAgdGhpcy53ZWFwb25Hcm91cC53ZWFwb24zLmxvY2FsUmVjdC5zZXRIUG9zQnlSaWdodEJvcmRlcih0aGlzLmlucHV0c2NhbGUgKiA2MCwgMjApXHJcbiAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQodGhpcy53ZWFwb25Hcm91cC53ZWFwb24zKTtcclxuXHJcbiAgICAvLyDorr7nva5cclxuICAgIGxldCBzZXR0aW5nQnRuID0gYXdhaXQgVUlUb29sLkNyZWF0ZUJ1dHRvbkJ5SW1nKCdkYXRhL3VpaW1nL3NldHRpbmcucG5nJywgdGhpcy5hcHAuZm9udCwgXCJcIik7XHJcbiAgICBzZXR0aW5nQnRuLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSg1NTAsIDMwLCB0aGlzLmlucHV0c2NhbGUgKiAzNSwgdGhpcy5pbnB1dHNjYWxlICogMzUpKTtcclxuICAgIHNldHRpbmdCdG4ubG9jYWxSZWN0LnNldEhQb3NCeVJpZ2h0Qm9yZGVyKHRoaXMuaW5wdXRzY2FsZSAqIDM1LCAyMCk7XHJcbiAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQoc2V0dGluZ0J0bik7XHJcbiAgICBzZXR0aW5nQnRuLk9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g6YeR5biBXHJcbiAgICB0aGlzLmdvbGRCZyA9IGF3YWl0IFVJVG9vbC5DcmVhdGVJbWcoJ2RhdGEvdWlpbWcvZ29sZEJnLnBuZycsIHRoaXMuYXBwLmZvbnQsIFN0cmluZyh0aGlzLm5vd0dvbGQpKTtcclxuICAgIHRoaXMuZ29sZEJnLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSgzNzAsIDMwLCAxMzUgKiB0aGlzLmlucHV0c2NhbGUsIDMwICogdGhpcy5pbnB1dHNjYWxlKSk7XHJcbiAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQodGhpcy5nb2xkQmcpO1xyXG5cclxuICAgIGxldCBnb2xkID0gYXdhaXQgVUlUb29sLkNyZWF0ZUltZygnZGF0YS91aWltZy9nb2xkLnBuZycsIHRoaXMuYXBwLmZvbnQsIFwiXCIpO1xyXG4gICAgZ29sZC5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoMzYwLCAzMCwgMzUgKiB0aGlzLmlucHV0c2NhbGUsIDM1ICogdGhpcy5pbnB1dHNjYWxlKSk7XHJcbiAgICB0aGlzLmFwcC5jYW52YXMuYWRkQ2hpbGQoZ29sZCk7XHJcblxyXG4gICAgLy8g5YCS6K6h5pe2XHJcbiAgICB0aGlzLnJvdW5kQ291bnREb3duID0gYXdhaXQgVUlUb29sLkNyZWF0ZUltZygnZGF0YS91aWltZy9yb3VuZENvdW50ZG93bi5wbmcnLCB0aGlzLmFwcC5mb250LCBcIjBcIilcclxuICAgIHRoaXMuYXBwLmNhbnZhcy5hZGRDaGlsZCh0aGlzLnJvdW5kQ291bnREb3duKTtcclxuICAgIHRoaXMucm91bmRDb3VudERvd24ubG9jYWxSZWN0LnNldEJ5UmVjdChuZXcgdHQuUmVjdGFuZ2xlKDAsIDAsIDIwMCAqIHRoaXMuaW5wdXRzY2FsZSwgNTUgKiB0aGlzLmlucHV0c2NhbGUpKTtcclxuICAgIGF3YWl0IHRoaXMuSW5pdFJvdW5kQmcoKVxyXG5cclxuXHJcbiAgICB0aGlzLnJvdW5kQmdUaW1lciA9IDMuMDsvL+eUqOS4gOS4quaVsOWtl+WwseiDveWBmuWumuaXtuWZqFxyXG4gICAgLy/kuI3opoHnlKggc2V0SW50ZXJ2YWwg5Y676amx5Yqo6YC76L6R77yM5Lya56C05Z2P5bin6amx5Yqo55qE57O757ufO1xyXG4gICAgLy8g5qC55o2u5Lyg5YWl5pe26Ze0buenkuWQjua2iOWksVxyXG5cclxuICAgIC8vIOWFs+WNoeWAkuiuoeaXtlxyXG4gICAgdGhpcy5yb3VuZENvdW50RG93blRpbWVyX01TID0gMDsgLy/nlKjosarnp5LkuLrljZXkvY3nmoTorqHml7blmahcclxuXHJcbiAgICAvLyB0b2RvIOeUqG9uVXBkYXRl5pu05pawXHJcbiAgICAvLyB0dC5ncmFwaGljLk9uVXBkYXRlID0gKGRlbHRhOiBudW1iZXIpID0+IHtcclxuICAgIC8vICAgICB0aGlzLmNhbnZhcy5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoMCwgMCwgdGhpcy50YXJnZXQuZ2V0V2lkdGgoKSwgdGhpcy50YXJnZXQuZ2V0SGVpZ2h0KCkpKTtcclxuICAgIC8vICAgICB0aGlzLmNhbnZhcy5PblVwZGF0ZShkZWx0YSk7XHJcblxyXG4gICAgLy8gICAgIHRoaXMudXBkYXRlRnBzKGRlbHRhKTtcclxuXHJcbiAgICAvLyAgICAgdGhpcy5PblVwZGF0ZShkZWx0YSk7XHJcblxyXG4gICAgLy8gfVxyXG5cclxuICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggPSAwO1xyXG4gICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWSA9IDA7XHJcblxyXG5cclxuICAgIHRoaXMuaGFzaW5pdGVkID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIC8vIOeUn+aIkOWVhuW6l+eVjOmdolxyXG4gIGFzeW5jIGNyZWF0ZVBhbmVsKCk6IFByb21pc2U8dm9pZD4gIHtcclxuICAgIHtcclxuICAgICBcclxuICAgICAgbGV0IHBhbmVsID0gbmV3IHR0Mi5RVUlfUGFuZWwoKTtcclxuICAgICAgcGFuZWwuYm9yZGVyRWxlbWVudCA9IG5ldyB0dDIuUVVJX0ltYWdlU2NhbGU5KFRlc3RfVUlUb29sLmJ0bl9ib3JkZXJzY2FsZTkpO1xyXG5cclxuICAgICAgdGhpcy5hcHAuY2FudmFzLmFkZENoaWxkKHBhbmVsKVxyXG4gICAgICBwYW5lbC5sb2NhbFJlY3Qub2Zmc2V0WDEgPSAwICogdGhpcy5pbnB1dHNjYWxlO1xyXG4gICAgICBwYW5lbC5sb2NhbFJlY3Qub2Zmc2V0WTEgPSAtMTA7XHJcbiAgICAgIHBhbmVsLmxvY2FsUmVjdC5vZmZzZXRYMiA9IHBhbmVsLmxvY2FsUmVjdC5vZmZzZXRYMSArIDQwMCAgKiB0aGlzLmlucHV0c2NhbGU7XHJcbiAgICAgIHBhbmVsLmxvY2FsUmVjdC5vZmZzZXRZMiA9IHBhbmVsLmxvY2FsUmVjdC5vZmZzZXRZMSArIDcwMCAgKiB0aGlzLmlucHV0c2NhbGU7XHJcbiAgICAgIHtcclxuXHJcbiAgICAgICAgbGV0IGNhdFNwcml0ZSA9IGF3YWl0IHR0Mi5RRnJhbWVfUmVzTWdyLkxvYWRTdGFuZGFsb25lU3ByaXRlQXN5bmMoXCJkYXRhL3VpaW1nL2JsYWNrLmpwZ1wiKTtcclxuICAgICAgICBsZXQgY2F0aW1hZ2UgPSBuZXcgdHQyLlFVSV9JbWFnZShjYXRTcHJpdGUpO1xyXG4gICAgICAgIHBhbmVsLmFkZENoaWxkKGNhdGltYWdlKVxyXG4gICAgICAgIGNhdGltYWdlLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSgwLCAwLCA2MDAgICogdGhpcy5pbnB1dHNjYWxlLCA5MDAgICogdGhpcy5pbnB1dHNjYWxlKSk7XHJcblxyXG5cclxuICAgICAgICAgIGxldCBpbWFnZXNjYWxlOSA9IG5ldyB0dDIuUVVJX0ltYWdlU2NhbGU5KFRlc3RfVUlUb29sLmJ0bl9ib3JkZXJzY2FsZTkpO1xyXG4gICAgICAgICAgcGFuZWwuYWRkQ2hpbGQoaW1hZ2VzY2FsZTkpXHJcbiAgICAgICAgICBpbWFnZXNjYWxlOS5sb2NhbFJlY3Qub2Zmc2V0WDEgPSAyMDAgKiB0aGlzLmlucHV0c2NhbGU7XHJcbiAgICAgICAgICBpbWFnZXNjYWxlOS5sb2NhbFJlY3Qub2Zmc2V0WTEgPSA3NSAqIHRoaXMuaW5wdXRzY2FsZTtcclxuICAgICAgICAgIGltYWdlc2NhbGU5LmxvY2FsUmVjdC5vZmZzZXRYMiA9IGltYWdlc2NhbGU5LmxvY2FsUmVjdC5vZmZzZXRYMSArIDUwICogdGhpcy5pbnB1dHNjYWxlO1xyXG4gICAgICAgICAgaW1hZ2VzY2FsZTkubG9jYWxSZWN0Lm9mZnNldFkyID0gaW1hZ2VzY2FsZTkubG9jYWxSZWN0Lm9mZnNldFkxICsgNTAgKiB0aGlzLmlucHV0c2NhbGU7XHJcblxyXG4gICAgICAgICAgbGV0IGxhYmVsID0gbmV3IHR0Mi5RVUlfTGFiZWwodGhpcy5hcHAuZm9udCwgXCLogonpuL3llYblupdcIik7XHJcbiAgICAgICAgICBsYWJlbC5jb2xvci5SID0gMC43O1xyXG4gICAgICAgICAgbGFiZWwuY29sb3IuRyA9IDAuNztcclxuICAgICAgICAgIGxhYmVsLmNvbG9yLkIgPSAwLjM7XHJcbiAgICAgICAgICBwYW5lbC5hZGRDaGlsZChsYWJlbCk7XHJcbiAgICAgICAgICBsYWJlbC5oYWxpZ24gPSB0dDIuUVVJX0hBbGlnbi5NaWRkbGU7XHJcbiAgICAgICAgLy8gIGxhYmVsLnZhbGlnbiA9IHR0Mi5RVUlfVkFsaWduLlRvcDtcclxuICAgICAgICAgIGxhYmVsLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSg1MCwgNTAsIHRoaXMuYXBwLnRhcmdldC5nZXRXaWR0aCgpICsgdGhpcy5pbnB1dHNjYWxlICogMTAwLCB0aGlzLmlucHV0c2NhbGUgKiAyMCkpO1xyXG4gICAgICAgICAgbGFiZWwuZm9udFNjYWxlID0gbmV3IHR0LlZlY3RvcjIoNSwgNSk7XHJcbiAgICAgICAgICBsYWJlbC5sb2NhbFJlY3Quc2V0SFBvc0J5Q2VudGVyKDEwMCAqIHRoaXMuaW5wdXRzY2FsZSlcclxuICAgICAgICAgIHBhbmVsLmFkZENoaWxkKGxhYmVsKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmHkeW4gVxyXG4gICBsZXQgZ29sZEJnID0gYXdhaXQgVUlUb29sLkNyZWF0ZUltZygnZGF0YS91aWltZy9nb2xkQmcucG5nJywgdGhpcy5hcHAuZm9udCwgU3RyaW5nKHRoaXMubm93R29sZCkpO1xyXG4gICAgZ29sZEJnLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSgxNDAgKiB0aGlzLmlucHV0c2NhbGUsIDE1MCwgMTA1ICogdGhpcy5pbnB1dHNjYWxlLCAzMCAqIHRoaXMuaW5wdXRzY2FsZSkpO1xyXG4gICAgLy9nb2xkQmcubG9jYWxSZWN0LnNldEhQb3NCeUNlbnRlcigzMCAqIHRoaXMuaW5wdXRzY2FsZSlcclxuICAgIHBhbmVsLmFkZENoaWxkKGdvbGRCZyk7XHJcblxyXG4gICAgbGV0IGdvbGQgPSBhd2FpdCBVSVRvb2wuQ3JlYXRlSW1nKCdkYXRhL3VpaW1nL2dvbGQucG5nJywgdGhpcy5hcHAuZm9udCwgXCJcIik7XHJcbiAgICBnb2xkLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSgxMzUgKiB0aGlzLmlucHV0c2NhbGUsIDE1MCwgMzUgKiB0aGlzLmlucHV0c2NhbGUsIDM1ICogdGhpcy5pbnB1dHNjYWxlKSk7XHJcbiAgIC8vIGdvbGQubG9jYWxSZWN0LnNldEhQb3NCeUNlbnRlcigzMCAqIHRoaXMuaW5wdXRzY2FsZSlcclxuICAgIHBhbmVsLmFkZENoaWxkKGdvbGQpO1xyXG5cclxuXHJcbiAgICBjb25zdCBub3dUb3RhbCA9IGF3YWl0IHRoaXMucmVmcmVzaFNob3AoKVxyXG5cclxuICAgIFxyXG4gICAgYXdhaXQgdGhpcy5jcmVhdGVDYXJkKHBhbmVsLCBub3dUb3RhbClcclxuXHJcbiAgICAgICAgICBsZXQgYnRuID0gYXdhaXQgVGVzdF9VSVRvb2wuQ3JlYXRlVGVzdEJ1dHRvbih0aGlzLmFwcC5mb250LCBcIuWIt+aWsFwiKTtcclxuICAgICAgICAgIGJ0bi5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoMzAwLCA0NTAgKiB0aGlzLmlucHV0c2NhbGUsIDc1LCA1MCkpO1xyXG4gICAgICAgICAgYnRuLmxvY2FsUmVjdC5zZXRIUG9zQnlSaWdodEJvcmRlcig2MCAqIHRoaXMuaW5wdXRzY2FsZSlcclxuICAgICAgICAgIGJ0bi5PbkNsaWNrID0gYXN5bmMoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vd1RvdGFsID0gYXdhaXQgdGhpcy5yZWZyZXNoU2hvcCgpIFxyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnJlRnJlc2hDYXJkKHBhbmVsLCBub3dUb3RhbClcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBwYW5lbC5hZGRDaGlsZChidG4pXHJcblxyXG5cclxuICAgICAgICAgIGxldCBuZXh0Um91bmQgPSBhd2FpdCBUZXN0X1VJVG9vbC5DcmVhdGVUZXN0QnV0dG9uKHRoaXMuYXBwLmZvbnQsIFwibmV4dFwiKTtcclxuICAgICAgICAgIG5leHRSb3VuZC5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoNTAwLCA2NTAgKiB0aGlzLmlucHV0c2NhbGUsIDEzMCwgNTApKTtcclxuICAgICAgICAgIG5leHRSb3VuZC5sb2NhbFJlY3Quc2V0SFBvc0J5UmlnaHRCb3JkZXIoNjAgKiB0aGlzLmlucHV0c2NhbGUpXHJcblxyXG4gICAgICAgICAgcGFuZWwuYWRkQ2hpbGQobmV4dFJvdW5kKVxyXG5cclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyDliLfmlrDllYblupfljaHniYdcclxuICBhc3luYyByZUZyZXNoQ2FyZChwYW5lbDogYW55LCBub3dUb3RhbDogYW55KSB7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMuc2hvcENhcmRNYXJrXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaTw2OyBpKyspe1xyXG4gICAgIC8vICh0aGlzLnJvdW5kQmcuZ2V0Q2hpbGQoMCkgYXMgdHQyLlFVSV9MYWJlbCkudGV4dCA9ICh0aGlzLnJvdW5kQmdUaW1lciArIDEgfCAwKS50b1N0cmluZygpO1xyXG4gICAgY29uc3QgdGVtcEltYWdlID0gIHBhbmVsLmNvbnRhaW5lci5fY2hpbGRyZW5bc3RhcnQgKyBpXS5nZXRDaGlsZCgwKSBhcyB0dDIuUVVJX0ltYWdlXHJcbiAgICB0ZW1wSW1hZ2Uuc3ByaXRlID0gYXdhaXQgdHQyLlFGcmFtZV9SZXNNZ3IuTG9hZFN0YW5kYWxvbmVTcHJpdGVBc3luYyhub3dUb3RhbFtpXS5pbWcpXHJcbiAgICAgIFxyXG4gICAgY29uc3QgdGVtcExhYmVsID0gIHBhbmVsLmNvbnRhaW5lci5fY2hpbGRyZW5bc3RhcnQgKyBpXS5nZXRDaGlsZCgxKSBhcyB0dDIuUVVJX0xhYmVsXHJcbiAgICB0ZW1wTGFiZWwudGV4dCA9IG5vd1RvdGFsW2ldLm5hbWVcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNodWZmbGUoYXJyOiBhbnkpe1xyXG4gICAgdmFyIGwgPSBhcnIubGVuZ3RoXHJcbiAgICB2YXIgaW5kZXgsIHRlbXBcclxuICAgIHdoaWxlKGw+MCl7XHJcbiAgICAgICAgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqbClcclxuICAgICAgICB0ZW1wID0gYXJyW2wtMV1cclxuICAgICAgICBhcnJbbC0xXSA9IGFycltpbmRleF1cclxuICAgICAgICBhcnJbaW5kZXhdID0gdGVtcFxyXG4gICAgICAgIGwtLVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyclxyXG59XHJcblxyXG4gLy8g5Yi35paw5ZWG5bqX54mp5ZOBXHJcbiAgYXN5bmMgcmVmcmVzaFNob3AoKSB7XHJcbiAgICAvLyDojrflj5bmgLvllYblk4Hnm67lvZVcclxuXHJcbiAgICAgIGxldCBzaG91bGRTaGFwQWNjZXNzb3J5TGlzdCA9IHNob3BBY2Nlc3NvcnlMaXN0LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLkJ1bGxldExpc3QuZmluZCgodmFsKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gdmFsID09PSBpdGVtLmJ1bGxldE5hbWVcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG5cclxuICAgIGNvbnN0IHRvdG9sIDogYW55ID0gWy4uLnNob3VsZFNoYXBBY2Nlc3NvcnlMaXN0LCAuLi5zaG9wQnVsbGV0TGlzdF1cclxuXHJcbiAgICAvLyDmoLnmja5ub3fnmoRuYW1l5bGe5oCn5Y675o6J5bey57uP5oul5pyJ55qEXHJcbiAgICBsZXQgbm93ID0gdG90b2wuZmlsdGVyKChpdGVtOiB7IG5hbWU6IGFueTsgfSkgPT4ge1xyXG4gICAgICByZXR1cm4gIXRoaXMubm93QWNjZXNzb3J5TGlzdC5maW5kKCh2YWwpID0+IHtcclxuICAgICAgICByZXR1cm4gdmFsLm5hbWUgPT09IGl0ZW0ubmFtZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICAgXHJcblxyXG4gICAgIG5vdyA9IG5vdy5maWx0ZXIoKGl0ZW06IHsgbmFtZTogYW55OyB9KSA9PiB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5CdWxsZXRMaXN0LmZpbmQoKHZhbCkgPT4ge1xyXG4gICAgICAgIHJldHVybiB2YWwubmFtZSA9PT0gaXRlbVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuXHJcbiAgICAvLyDljrvmjonlkoxsb2NrTGlzdOmHjeWkjeeahFxyXG5cclxuICAgIG5vdyA9IG5vdy5maWx0ZXIoKGl0ZW06IHsgbmFtZTogYW55OyB9KSA9PiB7XHJcbiAgICAgIHJldHVybiAhdGhpcy5sb2NrTGlzdC5maW5kKCh2YWw6IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB2YWwubmFtZSA9PT0gaXRlbS5uYW1lXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIHRoaXMubG9ja0xpc3QgPSBbXVxyXG5cclxuICAgIG5vdyA9IGF3YWl0IHRoaXMuc2h1ZmZsZShub3cpO1xyXG4gICAgXHJcblxyXG4gICAgLy8g5qC55o2ubm936ZqP5py655Sf5oiQNuS4qlxyXG4gICAgY29uc3QgcmVzdWx0ID0gW11cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XHJcbiAgICAvLyAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbm93Lmxlbmd0aClcclxuICAgICAgcmVzdWx0LnB1c2gobm93W2ldKVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICByZXR1cm4gcmVzdWx0XHJcbiAgfVxyXG5cclxuICBhc3luYyBjcmVhdGVDYXJkKHBhbmVsOiBhbnksIG5vd1RvdGFsOiBhbnkpIHtcclxuICAgIGNvbnN0IHRoYXQgPSB0aGlzXHJcblxyXG4gICAgbGV0IGNhcmRCZyA9IGF3YWl0IHR0Mi5RRnJhbWVfUmVzTWdyLkxvYWRTdGFuZGFsb25lU3ByaXRlQXN5bmMoXCJkYXRhL3VpaW1nL2NhcmRCZy5wbmdcIik7XHJcbiAgICAgIFxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGk8NjsgaSsrKXtcclxuICAgICAgbGV0IHdlYXBvbkNhcmQgPSBhd2FpdCBuZXcgdHQyLlFVSV9JbWFnZShjYXJkQmcpO1xyXG5cclxuICAgICAgbGV0IHdpZHRoID0gaVxyXG4gICAgICBsZXQgaGVpZ2h0ID0gMTMwXHJcblxyXG4gICAgICBpZiAoaT4gMikge1xyXG4gICAgICAgIHdpZHRoIC09M1xyXG4gICAgICAgIGhlaWdodCA9IDMwMFxyXG4gICAgICB9XHJcbiAgICAgIHdlYXBvbkNhcmQubG9jYWxSZWN0LnNldEJ5UmVjdChuZXcgdHQuUmVjdGFuZ2xlKCh3aWR0aCAqIDEyMCArIDEwKSAqIHRoaXMuaW5wdXRzY2FsZSwgaGVpZ2h0ICogdGhpcy5pbnB1dHNjYWxlLCB0aGlzLmlucHV0c2NhbGUgKiAxMTAsIHRoaXMuaW5wdXRzY2FsZSAqIDE1MCkpO1xyXG4gICAgICBpZihpID09PSAwICYmIHRoaXMuc2hvcENhcmRNYXJrID09PSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5zaG9wQ2FyZE1hcmsgPSBwYW5lbC5nZXRDaGlsZENvdW50KClcclxuICAgICAgfVxyXG5cclxuICAgICAgcGFuZWwuYWRkQ2hpbGQod2VhcG9uQ2FyZCk7XHJcblxyXG4gICAgICBcclxuXHJcbiAgICAgIGxldCB3ZWFwb25QaWMgPSBhd2FpdCB0dDIuUUZyYW1lX1Jlc01nci5Mb2FkU3RhbmRhbG9uZVNwcml0ZUFzeW5jKG5vd1RvdGFsW2ldLmltZyk7XHJcbiAgICAgIGxldCB3ZWFwb25QaWMxID0gYXdhaXQgbmV3IHR0Mi5RVUlfSW1hZ2Uod2VhcG9uUGljKTtcclxuICAgICAgd2VhcG9uUGljMS5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoMiAqIHRoaXMuaW5wdXRzY2FsZSwgMTUgKiB0aGlzLmlucHV0c2NhbGUsIHRoaXMuaW5wdXRzY2FsZSAqIDMwLCB0aGlzLmlucHV0c2NhbGUgKiA1MCkpO1xyXG4gICAgICB3ZWFwb25QaWMxLmxvY2FsUmVjdC5zZXRIUG9zQnlDZW50ZXIoMjAgKiB0aGlzLmlucHV0c2NhbGUpXHJcbiAgICAgIHdlYXBvbkNhcmQuYWRkQ2hpbGQod2VhcG9uUGljMSk7XHJcblxyXG4gICAgXHJcbiAgICAgIFxyXG5cclxuICAgICAgbGV0IGxhYmVsID0gbmV3IHR0Mi5RVUlfTGFiZWwodGhpcy5hcHAuZm9udCwgbm93VG90YWxbaV0ubmFtZSk7XHJcbiAgICAgIGxhYmVsLmxvY2FsUmVjdC5zZXRIUG9zQnlDZW50ZXIoMjAgKiB0aGlzLmlucHV0c2NhbGUpXHJcbiAgICAgIGxhYmVsLmxvY2FsUmVjdC5zZXRWUG9zQnlCb3R0b21Cb3JkZXIoMjAgKiB0aGlzLmlucHV0c2NhbGUsIDYwICogdGhpcy5pbnB1dHNjYWxlKVxyXG4gICAgICBsYWJlbC5mb250U2NhbGUgPSBuZXcgdHQuVmVjdG9yMigxLjUsIDEuNSk7XHJcbiAgICAgIHdlYXBvbkNhcmQuYWRkQ2hpbGQobGFiZWwpO1xyXG5cclxuICAgICAgbGV0IGJ0bjIgPSBuZXcgdHQyLlFVSV9CdXR0b24oKTtcclxuICAgICAgbGV0IGxhYmVsMSA9IG5ldyB0dDIuUVVJX0xhYmVsKHRoaXMuYXBwLmZvbnQsIFwi5LmwXCIpO1xyXG4gICAgICBsYWJlbDEuZm9udFNjYWxlID0gbmV3IHR0LlZlY3RvcjIoMiwgMik7XHJcbiAgICAgIC8vbGFiZWwuaGFsaWduID0gdHQyLlFVSV9IQWxpZ24uTWlkZGxlO1xyXG4gICAgICBidG4yLmxvY2FsUmVjdC5zZXRIUG9zQnlMZWZ0Qm9yZGVyKDM1ICogdGhpcy5pbnB1dHNjYWxlLCAtMTAgKiB0aGlzLmlucHV0c2NhbGUpXHJcbiAgICAgIGJ0bjIubG9jYWxSZWN0LnNldFZQb3NCeUJvdHRvbUJvcmRlcigzNSAqIHRoaXMuaW5wdXRzY2FsZSwgMyAqIHRoaXMuaW5wdXRzY2FsZSlcclxuICAgICAgYnRuMi5hZGRDaGlsZChsYWJlbDEpO1xyXG4gICAgICB3ZWFwb25DYXJkLmFkZENoaWxkKGJ0bjIpO1xyXG4gICAgICBidG4yLk9uQ2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5ub3dHb2xkID4gbm93VG90YWxbaV0uY29zdCkge1xyXG4gICAgICAgICAgdGhpcy5ub3dHb2xkIC09IG5vd1RvdGFsW2ldLmNvc3RcclxuICAgICAgICAgIHRoaXMuQnVsbGV0TGlzdC5wdXNoKG5vd1RvdGFsKVxyXG4gICAgICAgICAgd2VhcG9uQ2FyZC5yZW1vdmVDaGlsZEFsbCgpXHJcbiAgICAgICAgICBsZXQgbGFiZWwgPSBuZXcgdHQyLlFVSV9MYWJlbCh0aGlzLmFwcC5mb250LCAn5bey6LSt5LmwJyk7XHJcbiAgICAgICAgICBsYWJlbC5sb2NhbFJlY3Quc2V0SFBvc0J5Q2VudGVyKDIwICogdGhpcy5pbnB1dHNjYWxlKVxyXG4gICAgICAgICAgbGFiZWwubG9jYWxSZWN0LnNldFZQb3NCeUJvdHRvbUJvcmRlcigyMCAqIHRoaXMuaW5wdXRzY2FsZSwgNjAgKiB0aGlzLmlucHV0c2NhbGUpXHJcbiAgICAgICAgICBsYWJlbC5mb250U2NhbGUgPSBuZXcgdHQuVmVjdG9yMigxLjUsIDEuNSk7XHJcbiAgICAgICAgICB3ZWFwb25DYXJkLmFkZENoaWxkKGxhYmVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGxldCBidG4gPSBuZXcgdHQyLlFVSV9CdXR0b24oKTtcclxuICAgICAgbGV0IGxhYmVsMiA9IG5ldyB0dDIuUVVJX0xhYmVsKHRoaXMuYXBwLmZvbnQsIFwi6ZSBXCIpO1xyXG4gICAgICBsYWJlbDIuZm9udFNjYWxlID0gbmV3IHR0LlZlY3RvcjIoMiwgMik7XHJcbiAgICAgIC8vbGFiZWwuaGFsaWduID0gdHQyLlFVSV9IQWxpZ24uTWlkZGxlO1xyXG4gICAgICBidG4ubG9jYWxSZWN0LnNldEhQb3NCeVJpZ2h0Qm9yZGVyKDM1ICogdGhpcy5pbnB1dHNjYWxlLCA0ICogdGhpcy5pbnB1dHNjYWxlKVxyXG4gICAgICBidG4ubG9jYWxSZWN0LnNldFZQb3NCeUJvdHRvbUJvcmRlcigzNSAqIHRoaXMuaW5wdXRzY2FsZSwgMyAqIHRoaXMuaW5wdXRzY2FsZSlcclxuICAgICAgYnRuLmFkZENoaWxkKGxhYmVsMik7XHJcbiAgICAgIFxyXG5cclxuICAgICAgd2VhcG9uQ2FyZC5hZGRDaGlsZChidG4pO1xyXG4gICAgICBidG4uT25DbGljayA9ICgpID0+IHtcclxuICAgICAgICBcclxuICAgICAgICAvLyDmo4Dmn6V0aGlzLmxvY2tMaXN06YeM5pyJ5rKh5pyJ6YeN5aSN55qEbm93VG90YWxbaV1cclxuICAgICAgICBpZih0aGlzLmxvY2tMaXN0LmluZGV4T2Yobm93VG90YWxbaV0pID09PSAtMSkge1xyXG4gICAgICAgICAgdGhpcy5sb2NrTGlzdC5wdXNoKG5vd1RvdGFsW2ldKVxyXG4gICAgICAgICAgYnRuLnJlbW92ZUNoaWxkQWxsKClcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgbGV0IGxhYmVsMiA9IG5ldyB0dDIuUVVJX0xhYmVsKHRoYXQuYXBwLmZvbnQsIFwi6ZSBXCIpO1xyXG4gICAgICAgICAgICBsYWJlbDIuZm9udFNjYWxlID0gbmV3IHR0LlZlY3RvcjIoMiwgMik7XHJcbiAgICAgICAgICAgIGxhYmVsMi5jb2xvci5SID0gNTFcclxuICAgICAgICAgICAgbGFiZWwyLmNvbG9yLkcgPSAxMDJcclxuICAgICAgICAgICAgbGFiZWwyLmNvbG9yLkIgPSAyNTVcclxuICAgICAgICAgICAgLy9sYWJlbC5oYWxpZ24gPSB0dDIuUVVJX0hBbGlnbi5NaWRkbGU7XHJcbiAgICAgICAgICAgIGJ0bi5sb2NhbFJlY3Quc2V0SFBvc0J5UmlnaHRCb3JkZXIoMzUgKiB0aGF0LmlucHV0c2NhbGUsIDQgKiB0aGF0LmlucHV0c2NhbGUpXHJcbiAgICAgICAgICAgIGJ0bi5sb2NhbFJlY3Quc2V0VlBvc0J5Qm90dG9tQm9yZGVyKDM1ICogdGhhdC5pbnB1dHNjYWxlLCAzICogdGhhdC5pbnB1dHNjYWxlKVxyXG4gICAgICAgICAgICBidG4uYWRkQ2hpbGQobGFiZWwyKTtcclxuICAgICAgICAgIH0sMjAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICBcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBsZXQgd2VhcG9uQmcgPSBhd2FpdCB0dDIuUUZyYW1lX1Jlc01nci5Mb2FkU3RhbmRhbG9uZVNwcml0ZUFzeW5jKFwiZGF0YS91aWltZy93ZWFwb25CZy5wbmdcIik7XHJcbiAgICAgICAgICBsZXQgd2VhcG9uQmcxID0gbmV3IHR0Mi5RVUlfSW1hZ2Uod2VhcG9uQmcpO1xyXG4gICAgICAgICAgcGFuZWwuYWRkQ2hpbGQod2VhcG9uQmcxKVxyXG4gICAgICAgICAgd2VhcG9uQmcxLmxvY2FsUmVjdC5zZXRCeVJlY3QobmV3IHR0LlJlY3RhbmdsZSgwLCA0NzAgKiB0aGlzLmlucHV0c2NhbGUsIDgwICAqIHRoaXMuaW5wdXRzY2FsZSwgMTkwICAqIHRoaXMuaW5wdXRzY2FsZSkpO1xyXG5cclxuICAgICAgICAgIGxldCB3ZWFwb25CZzIgPSBuZXcgdHQyLlFVSV9JbWFnZSh3ZWFwb25CZyk7XHJcbiAgICAgICAgICBwYW5lbC5hZGRDaGlsZCh3ZWFwb25CZzIpXHJcbiAgICAgICAgICB3ZWFwb25CZzIubG9jYWxSZWN0LnNldEJ5UmVjdChuZXcgdHQuUmVjdGFuZ2xlKCA3MyAgKiB0aGlzLmlucHV0c2NhbGUgLCA0NzAgKiB0aGlzLmlucHV0c2NhbGUsIDgwICAqIHRoaXMuaW5wdXRzY2FsZSwgMTkwICAqIHRoaXMuaW5wdXRzY2FsZSkpO1xyXG5cclxuICAgICAgICAgIGxldCB3ZWFwb25CZzMgPSBuZXcgdHQyLlFVSV9JbWFnZSh3ZWFwb25CZyk7XHJcbiAgICAgICAgICBwYW5lbC5hZGRDaGlsZCh3ZWFwb25CZzMpXHJcbiAgICAgICAgICB3ZWFwb25CZzMubG9jYWxSZWN0LnNldEJ5UmVjdChuZXcgdHQuUmVjdGFuZ2xlKCAgNzMgICogdGhpcy5pbnB1dHNjYWxlICogMiAsIDQ3MCAqIHRoaXMuaW5wdXRzY2FsZSwgODAgICogdGhpcy5pbnB1dHNjYWxlLCAxOTAgICogdGhpcy5pbnB1dHNjYWxlKSk7XHJcblxyXG4gICAgICAgICAgbGV0IHdlYXBvbkJnNCA9IG5ldyB0dDIuUVVJX0ltYWdlKHdlYXBvbkJnKTtcclxuICAgICAgICAgIHBhbmVsLmFkZENoaWxkKHdlYXBvbkJnNClcclxuICAgICAgICAgIHdlYXBvbkJnNC5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoIDczICAqIHRoaXMuaW5wdXRzY2FsZSAqIDMgLCA0NzAgKiB0aGlzLmlucHV0c2NhbGUsIDgwICAqIHRoaXMuaW5wdXRzY2FsZSwgMTkwICAqIHRoaXMuaW5wdXRzY2FsZSkpO1xyXG5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgbGV0IHdlYXBvbkJnNSA9IG5ldyB0dDIuUVVJX0ltYWdlKHdlYXBvbkJnKTtcclxuICAgICAgICAgIHBhbmVsLmFkZENoaWxkKHdlYXBvbkJnNSlcclxuICAgICAgICAgIHdlYXBvbkJnNS5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoIDczICAqIHRoaXMuaW5wdXRzY2FsZSAqIDQgLCA0NzAgKiB0aGlzLmlucHV0c2NhbGUsIDgwICAqIHRoaXMuaW5wdXRzY2FsZSwgMTkwICAqIHRoaXMuaW5wdXRzY2FsZSkpO1xyXG5cclxuXHJcbiAgfVxyXG5cclxuICAvLyDliLfmgKrnialcclxuICBhc3luYyBtb25zdGVyQ3JlYXRlKGRlbHRhOiBudW1iZXIpIHtcclxuICAgIGlmICghdGhpcy5nYW1lU3RhcnQpIHJldHVyblxyXG5cclxuICAgIHRoaXMuY291bnRNb25zdGVyVGltZSArPSBkZWx0YVxyXG4gICAgXHJcbiAgICB0aGlzLmxldmVsRGF0YS5mb3JFYWNoKGFzeW5jIChpdGVtKSA9PiB7XHJcblxyXG4gICAgICBhd2FpdCB0aGlzLmhhbmRsZU1vbnN0ZXJDcmVhdGUoaXRlbSlcclxuICAgIH0pXHJcblxyXG5cclxuXHJcbiAgfVxyXG5cclxuICAvL+i/meS7o+eggeaAnei3r+aYr+acieWdkeeahO+8jOS9oOmhuuW6j+aJp+ihjOWIt+aAqlxyXG4gIC8v5L2G5piv55So5ZCM5LiA5Liqbm93TW9uc3Rlcihjb3VudCnmjqfliLbmgLvmlbDph49cclxuICAvL+eEtuWQjueUqCDkuI3lkIznmoRzaG91bGRDb3VudOaOp+WItuavj+enjeaAqueahOacgOWkp+aVsOmHj1xyXG4gIC8v6L+Z5bCx5a+86Ie06aG65bqP55u45YWz5LqG77yMXHJcbiAgLy/op6PlnZHlip7ms5XvvIxub3dNb25zdGVyQ291bnQg5pS55oiQ5YiG5byA5o6n5Yi2XHJcbiAgYXN5bmMgaGFuZGxlTW9uc3RlckNyZWF0ZSh2YWw6IHBsYXllci5MZXZlbEVuZW15V2l0aE1vbnN0ZXIpIHtcclxuXHJcbiAgICBsZXQgc2hvdWxkQ291bnQgPSBNYXRoLmZsb29yKHRoaXMuY291bnRNb25zdGVyVGltZSAvIHZhbC5GcmVxdWVuY3kpICogdmFsLkNyZWF0ZU5CXHJcbiAgICAvLyBjb25zb2xlLmxvZ+i+k+WHuuaAqueJqee8luWPt+WSjOWIt+aAquaVsOmHj1xyXG4gICAgIGNvbnNvbGUubG9nKCdpZDonICsgdmFsLkVuZW15SUQgKycgICAgbnVtOicgKyBzaG91bGRDb3VudClcclxuICAgIGlmKHNob3VsZENvdW50ID09PSAwKSBzaG91bGRDb3VudCA9IDFcclxuICAgIGxldCBub3dDb3VudCA9IHRoaXMubm93TW9uc3RlckNvdW50W3ZhbC5FbmVteUlEXTtcclxuICAgIGlmIChub3dDb3VudCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgbm93Q291bnQgPSB0aGlzLm5vd01vbnN0ZXJDb3VudFt2YWwuRW5lbXlJRF0gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vaWYgKG5vd0NvdW50ID49IHZhbC5DcmVhdGVOQikgeyB0aGlzLmdhbWVTdGFydCA9IGZhbHNlIH1cclxuXHJcbiAgICBjb25zdCBCaXJ0aEdyb3VwOiBBcnJheTxhbnk+ID0gW11cclxuXHJcbiAgICAvLyDliLfmlrDngrnpm4blkIhcclxuICAgIHZhbC5CaXJ0aC5zcGxpdCgnOycpLmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBCaXJ0aEdyb3VwLnB1c2goQmlydGhQb3NDb25maWdbaXRlbV0pXHJcbiAgICB9KVxyXG5cclxuICAgIGxldCBiaXJ0aEluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogQmlydGhHcm91cC5sZW5ndGgpXHJcblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hvdWxkQ291bnQgLSBub3dDb3VudDsgaSsrKSB7XHJcblxyXG4gICAgICB0aGlzLm5vd01vbnN0ZXJDb3VudFt2YWwuRW5lbXlJRF0rKztcclxuICAgICAgLy8g5Z+65pys6YCf5bqm5Y2V5L2NXHJcbiAgICAgIGNvbnN0IHNwZWVkID0gNTBcclxuXHJcbiAgICAgIC8v6L2s5Li6bW9uc3Rlci5NeVBsYXllckRhdGEg5Yqg5Yeg5Liq5bGe5oCn6L+b5Y67XHJcblxyXG4gICAgICBjb25zb2xlLmxvZyhcIml0ZW0uZWlkPVwiICsgdmFsLkVuZW15SUQpO1xyXG4gICAgICBsZXQgcCA9IGF3YWl0IHRoaXMuaGFuZGxlUGxheWVyRnVuLkNyZWF0ZVBsYXllcih2YWwuRW5lbXlJRCk7XHJcbiAgICAgIGxldCBleHQgPSBwLnVzZXJkYXRhID0gbmV3IHBsYXllci5Nb25zdGVyRGF0YSgpO1xyXG4gICAgICBwLnBvc1ggPSBCaXJ0aEdyb3VwW2JpcnRoSW5kZXhdLnBvc1ggKiB0aGlzLmlucHV0c2NhbGUgKyAoTWF0aC5yYW5kb20oKSAqIDI4MCAtIDE0MCk7XHJcbiAgICAgIHAucG9zWSA9IC00MDAgKiB0aGlzLmlucHV0c2NhbGU7XHJcbiAgICAgIGV4dC50YXJnZXRBID0gbmV3IHR0LlZlY3RvcjIocC5wb3NYLCA1MDAgKiB0aGlzLmlucHV0c2NhbGUpO1xyXG4gICAgICBleHQudGFyZ2V0QiA9IG5ldyB0dC5WZWN0b3IyKHAucG9zWCwgNTAwICogdGhpcy5pbnB1dHNjYWxlKTtcclxuICAgICAgZXh0LnNwZWVkID0gc3BlZWQ7XHJcbiAgICAgIGV4dC5oZWFsdGggPSB2YWwuTW9uc3Rlci5IZWFsaDtcclxuICAgICAgZXh0LmRhbWFnZSA9IHZhbC5Nb25zdGVyLkRhbWFnZTtcclxuICAgICAgZXh0LnJhd2FyZCA9IHZhbC5Nb25zdGVyLlJhd2FyZDtcclxuXHJcbiAgICAgIHR0Mi5RQW5pX1VwZGF0ZVBsYXllckFuaShwKVxyXG5cclxuICAgICAgdGhpcy5wbGF5ZXJzLnB1c2gocCk7XHJcblxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8g5Y+R5bCE5a2Q5by5XHJcbiAgYXN5bmMgYnVsbGV0Q3JlYXRlKGRlbHRhOiBudW1iZXIpIHtcclxuICAgIC8vICBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSByZXR1cm5cclxuICAgIGlmICghdGhpcy5nYW1lRW5kKSByZXR1cm5cclxuXHJcbiAgICB0aGlzLmNvdW50QnVsbGV0VGltZSArPSBkZWx0YVxyXG5cclxuICAgIC8vXHJcbiAgICB0aGlzLkJ1bGxldExpc3QuZm9yRWFjaChhc3luYyAoaXRlbSkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy5CdWxsZXREYXRhLmZpbmQoICh2YWwgOiBhbnkpID0+IHtcclxuICAgICAgICAgICByZXR1cm4gdmFsLmJ1bGxldE5hbWUgPT09IGl0ZW1cclxuICAgICAgICAgfSlcclxuICAgICAgICBhd2FpdCB0aGlzLndlYXBvbkNyZWF0ZSh0ZW1wKVxyXG5cclxuICAgIH0pXHJcblxyXG4gIH1cclxuXHJcbiAgYXN5bmMgd2VhcG9uQ3JlYXRlKHZhbDogYW55KSB7XHJcbiAgICBsZXQgc2hvdWxkQ291bnQgPSBNYXRoLnJvdW5kKHRoaXMuY291bnRCdWxsZXRUaW1lIC8gdmFsLlJhdGUpXHJcblxyXG4gICAgbGV0IG5vd0NvdW50ID0gdGhpcy5ub3dCdWxsZXRbdmFsLmJ1bGxldE5hbWVdO1xyXG5cclxuICAgIGlmIChub3dDb3VudCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgbm93Q291bnQgPSB0aGlzLm5vd0J1bGxldFt2YWwuYnVsbGV0TmFtZV0gPSAwO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNob3VsZENvdW50IC0gbm93Q291bnQ7IGkrKykge1xyXG4gICAgICAvLyAgdGFyZ2V0eOm7mOiupOS4uumaj+acui0zMOWIsDMwXHJcbiAgICAgIGxldCB0YXJnZXR4ID0gTWF0aC5yYW5kb20oKSAqIDYwIC0gMzBcclxuICAgICAgbGV0IHRhcmdldHkgPSAtNDAwICogdGhpcy5pbnB1dHNjYWxlXHJcbiAgICAgIC8vIOaRh+adhuaOp+WItuWtkOW8ueaWueWQkVxyXG4gICAgICBpZiAodGhpcy50b3VjaGRpciAhPT0gbnVsbCkge1xyXG4gICAgICAgIHRhcmdldHggKz0gdGhpcy50b3VjaGRpci5YICogMTAwMFxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMubm93QnVsbGV0W3ZhbC5idWxsZXROYW1lXSArPSAxXHJcbiAgICAgIC8vIOWfuuacrOmAn+W6puWNleS9jVxyXG4gICAgICBjb25zdCBzcGVlZCA9IDEwMDBcclxuXHJcbiAgICAgIC8v6L2s5Li6bW9uc3Rlci5NeVBsYXllckRhdGEg5Yqg5Yeg5Liq5bGe5oCn6L+b5Y67XHJcbiAgICAgIGxldCBwID0gYXdhaXQgdGhpcy5oYW5kbGVQbGF5ZXJGdW4uQ3JlYXRlQnVsbGV0KCk7XHJcbiAgICAgIHAuYW5pbmFtZSA9IHZhbC5idWxsZXROYW1lXHJcbiAgICAgIHAucG9zWCA9IDA7XHJcbiAgICAgIHAucG9zWSA9IDQwMCAqIHRoaXMuaW5wdXRzY2FsZTtcclxuICAgICAgcC51c2VyZGF0YS50YXJnZXRBID0gbmV3IHR0LlZlY3RvcjIodGFyZ2V0eCwgdGFyZ2V0eSk7XHJcbiAgICAgIHAudXNlcmRhdGEudGFyZ2V0QiA9IG5ldyB0dC5WZWN0b3IyKHRhcmdldHgsIHRhcmdldHkpO1xyXG4gICAgICBwLnVzZXJkYXRhLnNwZWVkID0gc3BlZWQ7XHJcbiAgICAgIHAudXNlcmRhdGEuYnVsbGV0RGFtYWdlID0gMTBcclxuICAgICAgcC51c2Vyb3RhdGUgPSB0cnVlO1xyXG4gICAgICBwLnJvdGF0ZSA9IFFBbmlfRGlyMlRvUm90YXRlKHRhcmdldHggLSBwLnBvc1gsIHRhcmdldHkgLSBwLnBvc1kpO1xyXG4gICAgICB0aGlzLmJ1bGxldHMucHVzaChwKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICAvLyDln47loplcclxuICBhc3luYyB3YWxsQ3JlYXRlKCkge1xyXG4gICAvLyBpZiAoIXRoaXMuZ2FtZVN0YXJ0KSByZXR1cm5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XHJcbiAgICAgIGxldCBwID0gYXdhaXQgdGhpcy5oYW5kbGVQbGF5ZXJGdW4uQ3JlYXRlV2FsbCgpO1xyXG4gICAgICBwLnBvc1ggPSAtMzc1ICsgaSAqIDEwMDtcclxuICAgICAgcC5wb3NZID0gMzkwO1xyXG4gICAgICB0aGlzLndhbGxzLnB1c2gocCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyDms6LmrKFcclxuICBwcml2YXRlIGFzeW5jIEluaXRSb3VuZEJnKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgdGhpcy5yb3VuZEJnID0gYXdhaXQgVUlUb29sLkNyZWF0ZUltZygnZGF0YS91aWltZy9yb3VuZE51bUJnLnBuZycsIHRoaXMuYXBwLmZvbnQsIHRoaXMucm91bmROdW0udG9TdHJpbmcoKSArICfms6InKTtcclxuICAgIHRoaXMucm91bmRCZy5sb2NhbFJlY3Quc2V0QnlSZWN0KG5ldyB0dC5SZWN0YW5nbGUoMjMwLCAyMDAsIDEwMyAqIHRoaXMuaW5wdXRzY2FsZSwgOTAgKiB0aGlzLmlucHV0c2NhbGUpKTtcclxuICAgIHRoaXMucm91bmRCZy5sb2NhbFJlY3Quc2V0SFBvc0J5Q2VudGVyKDEwMyAqIHRoaXMuaW5wdXRzY2FsZSlcclxuICAgIHRoaXMuYXBwLmNhbnZhcy5hZGRDaGlsZCh0aGlzLnJvdW5kQmcpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgLy8g6L+b5YWl5LiL5LiA5rOi5qyhXHJcbiAgcm91bmRFbmQoKSB7XHJcbiAgICB0aGlzLnJvdW5kTnVtKytcclxuICAgIHRoaXMucm91bmRCZ1RpbWVyID0gMy4wXHJcbiAgICB0aGlzLnBsYXllcnMgPSBbXVxyXG4gICAgdGhpcy5idWxsZXRzID0gW11cclxuICAgIHRoaXMuZ2FtZVN0YXJ0ID0gZmFsc2VcclxuICAgIHRoaXMuZ2FtZUVuZCA9IGZhbHNlXHJcbiAgICB0aGlzLm5vd01vbnN0ZXJDb3VudCA9IHt9XHJcbiAgICB0aGlzLmNvdW50TW9uc3RlclRpbWUgPSAwXHJcbiAgICB0aGlzLmNvdW50QnVsbGV0VGltZSA9IDBcclxuICAgIHRoaXMubm93QnVsbGV0ID0ge31cclxuXHJcbiAgICAgICAgaWYodGhpcy53YWxscy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8g5ri45oiP57uT5p2fXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgIHRoaXMuSW5pdFJvdW5kQmcoKVxyXG4gICAgICAgICAgICAgdGhpcy5sZXZlbERhdGEgPSBuZXcgTGV2ZWxEYXRhKCkuZ2V0TGV2ZWxFbmVteURhdGFCeUxldmVsKHRoaXMubGV2ZWxOdW0sIHRoaXMucm91bmROdW0pXHJcbiAgICAgICAgfSBcclxuXHJcblxyXG5cclxuICB9XHJcblxyXG4gIGJ1bGxldGNoYW5nZSgpIHtcclxuICAgIHRoaXMubm93QnVsbGV0ID0ge31cclxuICAgIHRoaXMuY291bnRCdWxsZXRUaW1lID0gMFxyXG5cclxuICB9XHJcblxyXG5cclxuICAvLyAgc2hvd3RpbWUoc2Vjb25kOiBudW1iZXIpOiBzdHJpbmcgIHtcclxuICAvLyAvLyDmoLnmja7kvKDlhaXnp5LmlbAg6L+U5Zue5YiG56eS5q+r56eS5YCS6K6h5pe2XHJcbiAgLy8gbGV0IG1pbiA9IE1hdGguZmxvb3Ioc2Vjb25kIC8gNjApO1xyXG4gIC8vIGxldCBzZWMgPSBNYXRoLmZsb29yKHNlY29uZCAlIDYwKTtcclxuICAvLyBsZXQgbXNlYyA9IE1hdGguZmxvb3IoKHNlY29uZCAtIE1hdGguZmxvb3Ioc2Vjb25kKSkgKiAxMDApO1xyXG4gIC8vIGxldCBtaW5TdHIgPSBtaW4gPCAxMCA/IFwiMFwiICsgbWluIDogbWluO1xyXG4gIC8vIGxldCBzZWNTdHIgPSBzZWMgPCAxMCA/IFwiMFwiICsgc2VjIDogc2VjO1xyXG4gIC8vIGxldCBtc2VjU3RyID0gbXNlYyA8IDEwID8gXCIwXCIgKyBtc2VjIDogbXNlYztcclxuICAvLyB0aGlzLnJvdW5kQ291bnREb3duVGltZSA9IG1pblN0ciArIFwiOlwiICsgc2VjU3RyICsgXCI6XCIgKyBtc2VjU3RyO1xyXG4gIC8vIHJldHVybiBtaW5TdHIgKyBcIjpcIiArIHNlY1N0ciArIFwiOlwiICsgbXNlY1N0cjtcclxuICAvLyB9XHJcbiAgT25FeGl0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5hcHAuY2FudmFzLnJlbW92ZUNoaWxkQWxsKCk7XHJcblxyXG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKTtcclxuICB9XHJcbiAgXHJcbiAgdXBkYXRlQkdCdG5UaW1lcihkZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5yb3VuZEJnICE9IG51bGwpIHtcclxuICAgICAgdGhpcy5yb3VuZEJnVGltZXIgLT0gZGVsdGE7XHJcbiAgICAgIGlmICh0aGlzLnJvdW5kQmdUaW1lciA8IDApIHtcclxuICAgICAgICB0aGlzLnJvdW5kQmcuZ2V0UGFyZW50KCkucmVtb3ZlQ2hpbGQodGhpcy5yb3VuZEJnKTtcclxuICAgICAgICB0aGlzLnJvdW5kQmcgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZ2FtZVN0YXJ0ID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZUVuZCA9IHRydWVcclxuICAgICAgICB0aGlzLnJvdW5kQ291bnREb3duVGltZXJfTVMgPSB0aGlzLmxldmVsRGF0YVswXS50aW1lICogMTAwMFxyXG4gICAgICAgIHRoaXMud2FsbENyZWF0ZSgpXHJcbiAgICAgICAgdGhpcy5jcmVhdGVQYW5lbCgpXHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgLy8gICAodGhpcy5yb3VuZEJnLmdldENoaWxkKDApIGFzIHR0Mi5RVUlfTGFiZWwpLnRleHQgPSAodGhpcy5yb3VuZEJnVGltZXIgKyAxIHwgMCkudG9TdHJpbmcoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdXBkYXRlUm91bmRDb3VudERvd25UaW1lcihkZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5yb3VuZENvdW50RG93biA9PSBudWxsKVxyXG4gICAgICByZXR1cm47XHJcbiAgICBsZXQgdGltZXJzdHIgPSBcIjAwOjAwOjAwXCI7XHJcbiAgICBpZiAodGhpcy5yb3VuZENvdW50RG93blRpbWVyX01TID4gMCkge1xyXG4gICAgICB0aGlzLnJvdW5kQ291bnREb3duVGltZXJfTVMgLT0gZGVsdGEgKiAxMDAwO1xyXG4gICAgICBpZiAodGhpcy5yb3VuZENvdW50RG93blRpbWVyX01TID4gMCkge1xyXG4gICAgICAgIGxldCBtaW51dGVzID0gTWF0aC5mbG9vcigodGhpcy5yb3VuZENvdW50RG93blRpbWVyX01TIC8gMTAwMCAvIDYwKSAlIDYwKTtcclxuICAgICAgICBsZXQgc2Vjb25kcyA9IE1hdGguZmxvb3IoKHRoaXMucm91bmRDb3VudERvd25UaW1lcl9NUyAvIDEwMDApICUgNjApO1xyXG4gICAgICAgIGxldCBtczogYW55ID0gKHRoaXMucm91bmRDb3VudERvd25UaW1lcl9NUyAlIDEwMDApIHwgMDtcclxuICAgICAgICBtcyA9IChtcyAvICgxMDAwIC8gNjApKSB8IDA7XHJcbiAgICAgICAgaWYgKG1zID49IDU5KSBtcyA9IDU5O1xyXG4gICAgICAgIG1zID0gbXMgPCAxMCA/ICcwJyArIG1zIDogbXM7XHJcbiAgICAgICAgdGltZXJzdHIgPSBtaW51dGVzICsgXCI6XCIgKyBzZWNvbmRzICsgXCI6XCIgKyBtcztcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICB0aW1lcnN0ciA9IFwiMDA6MDA6MDBcIjtcclxuICAgICAgICB0aGlzLmdhbWVTdGFydCA9IGZhbHNlXHJcbiAgICAgICAgLy90aGlzLnJvdW5kRW5kKClcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgbGFiZWwgPSAodGhpcy5yb3VuZENvdW50RG93bi5nZXRDaGlsZCgwKSBhcyB0dDIuUVVJX0xhYmVsKTtcclxuICAgIGlmIChsYWJlbCAhPSBudWxsKVxyXG4gICAgICBsYWJlbC50ZXh0ID0gdGltZXJzdHI7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIE9uVXBkYXRlKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5oYXNpbml0ZWQpIHJldHVybjtcclxuICAgIHRoaXMudXBkYXRlQkdCdG5UaW1lcihkZWx0YSk7XHJcbiAgICB0aGlzLnVwZGF0ZVJvdW5kQ291bnREb3duVGltZXIoZGVsdGEpO1xyXG4gICAgdGhpcy5tb25zdGVyQ3JlYXRlKGRlbHRhKVxyXG4gICAgdGhpcy5idWxsZXRDcmVhdGUoZGVsdGEpXHJcbiAgICB0aGlzLnRvdWNoZGlyID0gdGhpcy5qb3lzdGljay5HZXRUb3VjaERpcmVjdGlvbigpXHJcbiAgICAvLyBpZiAodG91Y2hkaXIgIT0gbnVsbCkge1xyXG4gICAgLy8gICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggKz0gdG91Y2hkaXIuWCAqIDEwMDtcclxuICAgIC8vICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5ZICs9IHRvdWNoZGlyLlkgKiAxMDA7XHJcbiAgICAvLyAgICAgaWYgKHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlggPCAtMClcclxuICAgIC8vICAgICAgICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWCA9IC0wO1xyXG4gICAgLy8gICAgIGlmICh0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5YID4gODAwKVxyXG4gICAgLy8gICAgICAgICB0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5YID0gODAwO1xyXG4gICAgLy8gICAgIGlmICh0aGlzLmFwcC5iYXRjaGVyQm90dG9tLkxvb2tBdC5ZIDwgLTApXHJcbiAgICAvLyAgICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlkgPSAtMDtcclxuICAgIC8vICAgICBpZiAodGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5Mb29rQXQuWSA+IDE2MDApXHJcbiAgICAvLyAgICAgICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uTG9va0F0LlkgPSAxNjAwO1xyXG4gICAgLy8gfVxyXG4gICAgdGhpcy5wbGF5ZXJzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgcmV0dXJuIGEucG9zWSAtIGIucG9zWTtcclxuICAgIH0pXHJcbiAgICB0aGlzLmJ1bGxldHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gYS5wb3NZIC0gYi5wb3NZO1xyXG4gICAgfSlcclxuICAgIHRoaXMud2FsbHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICByZXR1cm4gYS5wb3NZIC0gYi5wb3NZO1xyXG4gICAgfSlcclxuICAgIHRoaXMuVXBkYXRlUGxheWVyTW92ZShkZWx0YSk7XHJcbiAgICB0aGlzLlVwZGF0ZUJ1bGxldHNNb3ZlKGRlbHRhKTtcclxuICAgIHR0Mi5RQW5pX1BsYXllck1nci5VcGRhdGVQbGF5ZXJzX0FuaSh0aGlzLnBsYXllcnMsIGRlbHRhKTtcclxuICAgIHR0Mi5RQW5pX1BsYXllck1nci5VcGRhdGVQbGF5ZXJzX0FuaSh0aGlzLmJ1bGxldHMsIGRlbHRhKTtcclxuICB9XHJcblxyXG4gIFVwZGF0ZVBsYXllck1vdmUoZGVsdGE6IG51bWJlcikge1xyXG4gICAgaWYgKHRoaXMucGxheWVycy5sZW5ndGggPT09IDAgJiYgdGhpcy5yb3VuZENvdW50RG93blRpbWVyX01TID09PSAwICYmIHRoaXMuZ2FtZUVuZCkge1xyXG4gICAgICB0aGlzLnJvdW5kRW5kKClcclxuICAgIC8vICB0aGlzLmdhbWVFbmQgPSBmYWxzZVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBwID0gdGhpcy5wbGF5ZXJzW2ldO1xyXG4gICAgICAvLyDmkq3mlL7luKflrozmr5XliKDpmaTmgKrnialcclxuICAgICAgaWYgKHAuYW5pbmFtZSA9PT0gJ2dvbmUnICYmIHAuZW5kKSB7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzLnNwbGljZShpLCAxKVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuYnVsbGV0cy5mb3JFYWNoKChidWxsZXQsIGJ1bGxldEluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKHAuYW5pbmFtZSA9PT0gJ2dvbmUnKSByZXR1cm5cclxuICAgICAgICBpZiAoYnVsbGV0LnBvc1ggPiBwLnBvc1ggLSAzMCAmJiBidWxsZXQucG9zWCA8IHAucG9zWCArIDMwICYmIGJ1bGxldC5wb3NZID4gcC5wb3NZIC0gMzAgJiYgYnVsbGV0LnBvc1kgPCBwLnBvc1kgKyAzMCkge1xyXG5cclxuICAgICAgICAgIHAudXNlcmRhdGEuaGVhbHRoID0gcC51c2VyZGF0YS5oZWFsdGggLSBidWxsZXQudXNlcmRhdGEuYnVsbGV0RGFtYWdlXHJcbiAgICAgICAgICB0aGlzLmJ1bGxldHMuc3BsaWNlKGJ1bGxldEluZGV4LCAxKVxyXG5cclxuICAgICAgICAgIC8vIOiiq+WHu+mAgFxyXG4gICAgICAgICAgcC51c2VyZGF0YS50YXJnZXRCID0gbmV3IHR0LlZlY3RvcjIocC5wb3NYLCBwLnBvc1kgLSA1KVxyXG4gICAgICAgICAgcC5hbmluYW1lID0gJ2JhY2snXHJcblxyXG4gICAgICAgICAgLy8g6KKr5Ye75p2AXHJcbiAgICAgICAgICBpZiAocC51c2VyZGF0YS5oZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICBwLmFuaW5hbWUgPSAnZ29uZSdcclxuICAgICAgICAgICAgdGhpcy5ub3dHb2xkICs9IHAudXNlcmRhdGEucmF3YXJkXHJcbiAgICAgICAgICAgIGxldCBsYWJlbCA9ICh0aGlzLmdvbGRCZy5nZXRDaGlsZCgwKSBhcyB0dDIuUVVJX0xhYmVsKTtcclxuICAgICAgICAgICAgaWYgKGxhYmVsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICBsYWJlbC50ZXh0ID0gU3RyaW5nKHRoaXMubm93R29sZClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdHQyLlFBbmlfVXBkYXRlUGxheWVyQW5pKHApXHJcbiAgICAgICAgICAvL3RoaXMucGxheWVycy5zcGxpY2UoaSwgMSlcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIHRoaXMud2FsbHMuZm9yRWFjaCgod2FsbCwgd2FsbEluZGV4KSA9PiB7XHJcbiAgICAgICAgaWYgKHdhbGwucG9zWCA+IHAucG9zWCAtIDEzMCAmJiB3YWxsLnBvc1ggPCBwLnBvc1ggKyAxMzAgJiYgd2FsbC5wb3NZID4gcC5wb3NZIC0gNTAgJiYgd2FsbC5wb3NZIDwgcC5wb3NZICsgNTApIHtcclxuICAgICAgICAgIHRoaXMud2FsbHMgPSBbXVxyXG4gICAgICAgICAgdGhpcy5jcmVhdGVQYW5lbCgpXHJcbiAgICAgICAgICAvLyB0b2RvIOaJp+ihjOa4uOaIj+e7k+adn1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuXHJcbiAgICAgIGlmIChwLmFuaW5hbWUgPT09ICdiYWNrJykge1xyXG4gICAgICAgIGxldCBiID0gVmVjdG9yMkZ1bmMuR290byhwLCBwLnVzZXJkYXRhLnRhcmdldEIsIHAudXNlcmRhdGEuc3BlZWQsIGRlbHRhKTtcclxuICAgICAgICAvL+WIsOi+vlxyXG4gICAgICAgIGlmIChiID09IGZhbHNlKSB7XHJcbiAgICAgICAgICBwLmFuaW5hbWUgPSAnd2FsaydcclxuICAgICAgICAgIHAudXNlcmRhdGEudGFyZ2V0QiA9IG5ldyB0dC5WZWN0b3IyKHAucG9zWCwgcC51c2VyZGF0YS50YXJnZXRBLlkpXHJcbiAgICAgICAgICB0dDIuUUFuaV9VcGRhdGVQbGF5ZXJBbmkocClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwLmFuaW5hbWUgPT09ICd3YWxrJykge1xyXG4gICAgICAgIGxldCBiID0gVmVjdG9yMkZ1bmMuR290byhwLCBwLnVzZXJkYXRhLnRhcmdldEIsIHAudXNlcmRhdGEuc3BlZWQsIGRlbHRhKTtcclxuICAgICAgICAvL+WIsOi+vlxyXG4gICAgICAgIGlmIChiID09IGZhbHNlKSB7XHJcbiAgICAgICAgICB0aGlzLnBsYXllcnMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgVXBkYXRlQnVsbGV0c01vdmUoZGVsdGE6IG51bWJlcikge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJ1bGxldHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IHAgPSB0aGlzLmJ1bGxldHNbaV07XHJcbiAgICAgIGxldCBiID0gVmVjdG9yMkZ1bmMuR290byhwLCBwLnVzZXJkYXRhLnRhcmdldEIsIHAudXNlcmRhdGEuc3BlZWQsIGRlbHRhKTtcclxuICAgICAgaWYgKGIgPT0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmJ1bGxldHMuc3BsaWNlKGksIDEpXHJcbiAgICAgIH0vL+WIsOi+vlxyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBPblJlbmRlcigpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5oYXNpbml0ZWQpIHJldHVybjtcclxuICAgIHRoaXMuYXBwLmJhdGNoZXJCb3R0b20uQmVnaW5EcmF3KHRoaXMuYXBwLnRhcmdldCk7XHJcbiAgICB0aGlzLmJhY2tncm91bmQuUmVuZGVyUmVjdCh0aGlzLmFwcC5iYXRjaGVyQm90dG9tLCBuZXcgdHQuUmVjdGFuZ2xlKC00MDAgKiB0aGlzLmlucHV0c2NhbGUsIC04MDAgKiB0aGlzLmlucHV0c2NhbGUsIDgwMCAqIHRoaXMuaW5wdXRzY2FsZSwgMTYwMCAqIHRoaXMuaW5wdXRzY2FsZSkpO1xyXG5cclxuXHJcbiAgICB0dDIuUUFuaV9QbGF5ZXJNZ3IuUmVuZGVyUGxheWVycyh0aGlzLmFwcC5iYXRjaGVyQm90dG9tLCB0aGlzLmJ1bGxldHMpO1xyXG4gICAgdHQyLlFBbmlfUGxheWVyTWdyLlJlbmRlclBsYXllcnModGhpcy5hcHAuYmF0Y2hlckJvdHRvbSwgdGhpcy53YWxscyk7XHJcbiAgICB0dDIuUUFuaV9QbGF5ZXJNZ3IuUmVuZGVyUGxheWVycyh0aGlzLmFwcC5iYXRjaGVyQm90dG9tLCB0aGlzLnBsYXllcnMpO1xyXG4gICAgdGhpcy5hcHAuYmF0Y2hlckJvdHRvbS5FbmREcmF3KCk7XHJcbiAgfVxyXG59Il19