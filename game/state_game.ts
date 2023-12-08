import { tt } from "../ttapi_interface/ttapi.js"
import * as tt2 from "../ttapi_layer2/ttlayer2.js"

import LevelData from "./impl/config/monster_config_impl.js";
import * as player from "./interface/config/monster_config.js";
import { BirthPosConfig } from "./interface/config/Birth_config.js"

import { Test_UITool } from "../ttapi_layer2_test/test_uitool.js";

import { UITool } from "./uitool.js";
import { State_Logo } from "./state_logo.js";
import { UserData } from "./userdata.js";

import handlePlayer from "./components/player/handlePlayer.js";
import { QAni_Dir2ToRotate } from "../ttapi_layer2/ttlayer2.js";

import { BulletList, shopAccessoryList, shopBulletList } from "./interface/config/bullet_config.js"

class Vector2Func {
  //匀速移动方法
  //return false 表示到达
  static Goto(data: tt2.QAni_Player<any>, to: tt.Vector2, speed: number, delta: number): boolean {
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

export class State_Game implements tt2.QFrame_IState<UserData>
{
  app: tt2.QFrame_App<UserData>;
  gameStart: boolean;
  gameEnd: boolean;
  hasinited: boolean
  partLevel: Number;
  weaponGroup: {
    weapon1: tt2.QUI_Button,
    weapon2: tt2.QUI_Button,
    weapon3: tt2.QUI_Button,
    weapon4: tt2.QUI_Button,
  };
  // 关卡
  levelNum: number;
  // 波次
  roundNum: number;
  roundBg: tt2.QUI_Image;
  roundBgTimer: number;//一个数字就是一个定时器（默认用秒为单位）
  roundCountDown: tt2.QUI_Image;
  goldBg: tt2.QUI_Image;
  roundCountDownTimer_MS: number;
  atlas: tt.Atlas;
  players: tt2.QAni_Player<player.MonsterData>[];
  bullets: tt2.QAni_Player<player.BulletData>[];
  walls: tt2.QAni_Player<player.MyPlayerData>[];
  userplayer: tt2.QAni_Player<player.MonsterData>;
  background: tt.Sprite;
  joystick: tt2.QUI_JoyStick;
  timer: number;
  inputscale: number;
  nowMonsterCount: { [id: number]: number };
  BulletList: any[];
  nowAccessoryList: any[];
  BulletData: any;
  nowBullet: { [id: number]: number };
  countMonsterTime: number;
  countBulletTime: number;
  levelData: player.LevelEnemyWithMonster[];
  touchdir: tt.Vector2;
  handlePlayerFun: handlePlayer;
  lockList : any;
  nowGold: number;
  // 商店刷卡牌的下标
  shopCardMark: number;
  OnInit(statemgr: tt2.QFrame_App<UserData>): void {
    this.app = statemgr;
    
    this.hasinited = false;
    this.StartAsync();
    this.weaponGroup = {
      weapon1: null,
      weapon2: null,
      weapon3: null,
      weapon4: null,
    }
    this.levelNum = 1
    this.roundNum = 1
    this.roundCountDown = null
    this.goldBg = null

    this.shopCardMark = null
    this.timer = null
    this.inputscale = tt.graphic.getFinalScale();

    //糟糕的面向对象设计

    this.levelData = new LevelData().getLevelEnemyDataByLevel(this.levelNum, this.roundNum)

    this.nowMonsterCount = {}
    this.nowBullet = {}
    this.countMonsterTime = 0
    this.countBulletTime = 0
    // 开始刷怪
    this.gameStart = false
    // 结束刷怪
    this.gameEnd = false
    this.nowGold = 0
    this.BulletList = ['急射炮']
    this.BulletData = BulletList
    this.nowAccessoryList = []
    this.lockList = []
    this.handlePlayerFun = new handlePlayer()
    this.handlePlayerFun.onInit()
  }

  async StartAsync(): Promise<void> {
    this.background = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/levelBg.png");

    this.app.target.ClearColor = new tt.Color(0.8, 0.3, 0.5, 1.0);

    //创建一个joystick UI 并放到canvas 并限制底部
    this.joystick = await UITool.CreateJoyStick(this.app.canvas.getWorldRect());

    this.joystick.localRect.setHPosFill();
    this.joystick.localRect.radioY1 = 0.5;
    this.joystick.localRect.radioY2 = 1.0
    this.app.canvas.addChild(this.joystick);


    this.players = [];
    this.bullets = []
    this.walls = []
   // this.createPanel()

    //this.players[0].posY = 500

    // 右侧配件和武器框
    let partBtn = await UITool.CreateButtonByImg('data/uiimg/partLevel1.png', this.app.font, "");
    partBtn.localRect.setByRect(new tt.Rectangle(50, 300, this.inputscale * 60, this.inputscale * 60));
    partBtn.localRect.setHPosByRightBorder(this.inputscale * 60, 20)
    this.app.canvas.addChild(partBtn);
    partBtn.OnClick = () => {
    }

    this.weaponGroup.weapon1 = await UITool.CreateButtonByImg('data/uiimg/weapon.png', this.app.font, "");
    this.weaponGroup.weapon1.localRect.setByRect(new tt.Rectangle(515, 300 + 60 * this.inputscale, this.inputscale * 60, this.inputscale * 60));
    this.weaponGroup.weapon1.localRect.setHPosByRightBorder(this.inputscale * 60, 20)
    this.app.canvas.addChild(this.weaponGroup.weapon1);

    this.weaponGroup.weapon2 = await UITool.CreateButtonByImg('data/uiimg/weapon.png', this.app.font, "");
    this.weaponGroup.weapon2.localRect.setByRect(new tt.Rectangle(515, 300 + 60 * this.inputscale * 2, this.inputscale * 60, this.inputscale * 60));
    this.weaponGroup.weapon2.localRect.setHPosByRightBorder(this.inputscale * 60, 20)
    this.app.canvas.addChild(this.weaponGroup.weapon2);

    this.weaponGroup.weapon3 = await UITool.CreateButtonByImg('data/uiimg/weapon.png', this.app.font, "");
    this.weaponGroup.weapon3.localRect.setByRect(new tt.Rectangle(515, 300 + 60 * this.inputscale * 3, this.inputscale * 60, this.inputscale * 60));
    this.weaponGroup.weapon3.localRect.setHPosByRightBorder(this.inputscale * 60, 20)
    this.app.canvas.addChild(this.weaponGroup.weapon3);

    // 设置
    let settingBtn = await UITool.CreateButtonByImg('data/uiimg/setting.png', this.app.font, "");
    settingBtn.localRect.setByRect(new tt.Rectangle(550, 30, this.inputscale * 35, this.inputscale * 35));
    settingBtn.localRect.setHPosByRightBorder(this.inputscale * 35, 20);
    this.app.canvas.addChild(settingBtn);
    settingBtn.OnClick = () => {
    }

    // 金币
    this.goldBg = await UITool.CreateImg('data/uiimg/goldBg.png', this.app.font, String(this.nowGold));
    this.goldBg.localRect.setByRect(new tt.Rectangle(370, 30, 135 * this.inputscale, 30 * this.inputscale));
    this.app.canvas.addChild(this.goldBg);

    let gold = await UITool.CreateImg('data/uiimg/gold.png', this.app.font, "");
    gold.localRect.setByRect(new tt.Rectangle(360, 30, 35 * this.inputscale, 35 * this.inputscale));
    this.app.canvas.addChild(gold);

    // 倒计时
    this.roundCountDown = await UITool.CreateImg('data/uiimg/roundCountdown.png', this.app.font, "0")
    this.app.canvas.addChild(this.roundCountDown);
    this.roundCountDown.localRect.setByRect(new tt.Rectangle(0, 0, 200 * this.inputscale, 55 * this.inputscale));
    await this.InitRoundBg()


    this.roundBgTimer = 3.0;//用一个数字就能做定时器
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
  }

  // 生成商店界面
  async createPanel(): Promise<void>  {
    {
     
      let panel = new tt2.QUI_Panel();
      panel.borderElement = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);

      this.app.canvas.addChild(panel)
      panel.localRect.offsetX1 = 0 * this.inputscale;
      panel.localRect.offsetY1 = -10;
      panel.localRect.offsetX2 = panel.localRect.offsetX1 + 400  * this.inputscale;
      panel.localRect.offsetY2 = panel.localRect.offsetY1 + 700  * this.inputscale;
      {

        let catSprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/black.jpg");
        let catimage = new tt2.QUI_Image(catSprite);
        panel.addChild(catimage)
        catimage.localRect.setByRect(new tt.Rectangle(0, 0, 600  * this.inputscale, 900  * this.inputscale));


          let imagescale9 = new tt2.QUI_ImageScale9(Test_UITool.btn_borderscale9);
          panel.addChild(imagescale9)
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
          label.localRect.setHPosByCenter(100 * this.inputscale)
          panel.addChild(label);

            // 金币
   let goldBg = await UITool.CreateImg('data/uiimg/goldBg.png', this.app.font, String(this.nowGold));
    goldBg.localRect.setByRect(new tt.Rectangle(140 * this.inputscale, 150, 105 * this.inputscale, 30 * this.inputscale));
    //goldBg.localRect.setHPosByCenter(30 * this.inputscale)
    panel.addChild(goldBg);

    let gold = await UITool.CreateImg('data/uiimg/gold.png', this.app.font, "");
    gold.localRect.setByRect(new tt.Rectangle(135 * this.inputscale, 150, 35 * this.inputscale, 35 * this.inputscale));
   // gold.localRect.setHPosByCenter(30 * this.inputscale)
    panel.addChild(gold);


    const nowTotal = await this.refreshShop()

    
    await this.createCard(panel, nowTotal)

          let btn = await Test_UITool.CreateTestButton(this.app.font, "刷新");
          btn.localRect.setByRect(new tt.Rectangle(300, 450 * this.inputscale, 75, 50));
          btn.localRect.setHPosByRightBorder(60 * this.inputscale)
          btn.OnClick = async() => {
            const nowTotal = await this.refreshShop() 
            await this.reFreshCard(panel, nowTotal)
          }

          panel.addChild(btn)


          let nextRound = await Test_UITool.CreateTestButton(this.app.font, "next");
          nextRound.localRect.setByRect(new tt.Rectangle(500, 650 * this.inputscale, 130, 50));
          nextRound.localRect.setHPosByRightBorder(60 * this.inputscale)

          panel.addChild(nextRound)

      }
  }

  }

  // 刷新商店卡片
  async reFreshCard(panel: any, nowTotal: any) {
    const start = this.shopCardMark
    for (let i = 0; i<6; i++){
     // (this.roundBg.getChild(0) as tt2.QUI_Label).text = (this.roundBgTimer + 1 | 0).toString();
    const tempImage =  panel.container._children[start + i].getChild(0) as tt2.QUI_Image
    tempImage.sprite = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(nowTotal[i].img)
      
    const tempLabel =  panel.container._children[start + i].getChild(1) as tt2.QUI_Label
    tempLabel.text = nowTotal[i].name
    }
  }

  shuffle(arr: any){
    var l = arr.length
    var index, temp
    while(l>0){
        index = Math.floor(Math.random()*l)
        temp = arr[l-1]
        arr[l-1] = arr[index]
        arr[index] = temp
        l--
    }
    return arr
}

 // 刷新商店物品
  async refreshShop() {
    // 获取总商品目录

      let shouldShapAccessoryList = shopAccessoryList.filter((item) => {
        return this.BulletList.find((val) => {
          return val === item.bulletName
        })
      })

    const totol : any = [...shouldShapAccessoryList, ...shopBulletList]

    // 根据now的name属性去掉已经拥有的
    let now = totol.filter((item: { name: any; }) => {
      return !this.nowAccessoryList.find((val) => {
        return val.name === item.name
      })
    })
   

     now = now.filter((item: { name: any; }) => {
      return !this.BulletList.find((val) => {
        return val.name === item
      })
    })

    // 去掉和lockList重复的

    now = now.filter((item: { name: any; }) => {
      return !this.lockList.find((val: any) => {
        return val.name === item.name
      })
    })

    this.lockList = []

    now = await this.shuffle(now);
    

    // 根据now随机生成6个
    const result = []
    for (let i = 0; i < 6; i++) {
    //  const random = Math.floor(Math.random() * now.length)
      result.push(now[i])
    }
    
    return result
  }

  async createCard(panel: any, nowTotal: any) {
    const that = this

    let cardBg = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/cardBg.png");
      
    for (let i = 0; i<6; i++){
      let weaponCard = await new tt2.QUI_Image(cardBg);

      let width = i
      let height = 130

      if (i> 2) {
        width -=3
        height = 300
      }
      weaponCard.localRect.setByRect(new tt.Rectangle((width * 120 + 10) * this.inputscale, height * this.inputscale, this.inputscale * 110, this.inputscale * 150));
      if(i === 0 && this.shopCardMark === null) {
        this.shopCardMark = panel.getChildCount()
      }

      panel.addChild(weaponCard);

      

      let weaponPic = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync(nowTotal[i].img);
      let weaponPic1 = await new tt2.QUI_Image(weaponPic);
      weaponPic1.localRect.setByRect(new tt.Rectangle(2 * this.inputscale, 15 * this.inputscale, this.inputscale * 30, this.inputscale * 50));
      weaponPic1.localRect.setHPosByCenter(20 * this.inputscale)
      weaponCard.addChild(weaponPic1);

    
      

      let label = new tt2.QUI_Label(this.app.font, nowTotal[i].name);
      label.localRect.setHPosByCenter(20 * this.inputscale)
      label.localRect.setVPosByBottomBorder(20 * this.inputscale, 60 * this.inputscale)
      label.fontScale = new tt.Vector2(1.5, 1.5);
      weaponCard.addChild(label);

      let btn2 = new tt2.QUI_Button();
      let label1 = new tt2.QUI_Label(this.app.font, "买");
      label1.fontScale = new tt.Vector2(2, 2);
      //label.halign = tt2.QUI_HAlign.Middle;
      btn2.localRect.setHPosByLeftBorder(35 * this.inputscale, -10 * this.inputscale)
      btn2.localRect.setVPosByBottomBorder(35 * this.inputscale, 3 * this.inputscale)
      btn2.addChild(label1);
      weaponCard.addChild(btn2);
      btn2.OnClick = () => {
        if(this.nowGold > nowTotal[i].cost) {
          this.nowGold -= nowTotal[i].cost
          this.BulletList.push(nowTotal)
          weaponCard.removeChildAll()
          let label = new tt2.QUI_Label(this.app.font, '已购买');
          label.localRect.setHPosByCenter(20 * this.inputscale)
          label.localRect.setVPosByBottomBorder(20 * this.inputscale, 60 * this.inputscale)
          label.fontScale = new tt.Vector2(1.5, 1.5);
          weaponCard.addChild(label);
        }
       
      }


      let btn = new tt2.QUI_Button();
      let label2 = new tt2.QUI_Label(this.app.font, "锁");
      label2.fontScale = new tt.Vector2(2, 2);
      //label.halign = tt2.QUI_HAlign.Middle;
      btn.localRect.setHPosByRightBorder(35 * this.inputscale, 4 * this.inputscale)
      btn.localRect.setVPosByBottomBorder(35 * this.inputscale, 3 * this.inputscale)
      btn.addChild(label2);
      

      weaponCard.addChild(btn);
      btn.OnClick = () => {
        
        // 检查this.lockList里有没有重复的nowTotal[i]
        if(this.lockList.indexOf(nowTotal[i]) === -1) {
          this.lockList.push(nowTotal[i])
          btn.removeChildAll()
          setTimeout(function(){
            let label2 = new tt2.QUI_Label(that.app.font, "锁");
            label2.fontScale = new tt.Vector2(2, 2);
            label2.color.R = 51
            label2.color.G = 102
            label2.color.B = 255
            //label.halign = tt2.QUI_HAlign.Middle;
            btn.localRect.setHPosByRightBorder(35 * that.inputscale, 4 * that.inputscale)
            btn.localRect.setVPosByBottomBorder(35 * that.inputscale, 3 * that.inputscale)
            btn.addChild(label2);
          },200);
        }
       
      }
    }
          
          let weaponBg = await tt2.QFrame_ResMgr.LoadStandaloneSpriteAsync("data/uiimg/weaponBg.png");
          let weaponBg1 = new tt2.QUI_Image(weaponBg);
          panel.addChild(weaponBg1)
          weaponBg1.localRect.setByRect(new tt.Rectangle(0, 470 * this.inputscale, 80  * this.inputscale, 190  * this.inputscale));

          let weaponBg2 = new tt2.QUI_Image(weaponBg);
          panel.addChild(weaponBg2)
          weaponBg2.localRect.setByRect(new tt.Rectangle( 73  * this.inputscale , 470 * this.inputscale, 80  * this.inputscale, 190  * this.inputscale));

          let weaponBg3 = new tt2.QUI_Image(weaponBg);
          panel.addChild(weaponBg3)
          weaponBg3.localRect.setByRect(new tt.Rectangle(  73  * this.inputscale * 2 , 470 * this.inputscale, 80  * this.inputscale, 190  * this.inputscale));

          let weaponBg4 = new tt2.QUI_Image(weaponBg);
          panel.addChild(weaponBg4)
          weaponBg4.localRect.setByRect(new tt.Rectangle( 73  * this.inputscale * 3 , 470 * this.inputscale, 80  * this.inputscale, 190  * this.inputscale));

          
          let weaponBg5 = new tt2.QUI_Image(weaponBg);
          panel.addChild(weaponBg5)
          weaponBg5.localRect.setByRect(new tt.Rectangle( 73  * this.inputscale * 4 , 470 * this.inputscale, 80  * this.inputscale, 190  * this.inputscale));


  }

  // 刷怪物
  async monsterCreate(delta: number) {
    if (!this.gameStart) return

    this.countMonsterTime += delta
    
    this.levelData.forEach(async (item) => {

      await this.handleMonsterCreate(item)
    })



  }

  //这代码思路是有坑的，你顺序执行刷怪
  //但是用同一个nowMonster(count)控制总数量
  //然后用 不同的shouldCount控制每种怪的最大数量
  //这就导致顺序相关了，
  //解坑办法，nowMonsterCount 改成分开控制
  async handleMonsterCreate(val: player.LevelEnemyWithMonster) {

    let shouldCount = Math.floor(this.countMonsterTime / val.Frequency) * val.CreateNB
    // console.log输出怪物编号和刷怪数量
     console.log('id:' + val.EnemyID +'    num:' + shouldCount)
    if(shouldCount === 0) shouldCount = 1
    let nowCount = this.nowMonsterCount[val.EnemyID];
    if (nowCount == undefined) {
      nowCount = this.nowMonsterCount[val.EnemyID] = 0;
    }

    //if (nowCount >= val.CreateNB) { this.gameStart = false }

    const BirthGroup: Array<any> = []

    // 刷新点集合
    val.Birth.split(';').forEach((item: any) => {
      BirthGroup.push(BirthPosConfig[item])
    })

    let birthIndex = Math.floor(Math.random() * BirthGroup.length)


    for (let i = 0; i < shouldCount - nowCount; i++) {

      this.nowMonsterCount[val.EnemyID]++;
      // 基本速度单位
      const speed = 50

      //转为monster.MyPlayerData 加几个属性进去

      console.log("item.eid=" + val.EnemyID);
      let p = await this.handlePlayerFun.CreatePlayer(val.EnemyID);
      let ext = p.userdata = new player.MonsterData();
      p.posX = BirthGroup[birthIndex].posX * this.inputscale + (Math.random() * 280 - 140);
      p.posY = -400 * this.inputscale;
      ext.targetA = new tt.Vector2(p.posX, 500 * this.inputscale);
      ext.targetB = new tt.Vector2(p.posX, 500 * this.inputscale);
      ext.speed = speed;
      ext.health = val.Monster.Healh;
      ext.damage = val.Monster.Damage;
      ext.raward = val.Monster.Raward;

      tt2.QAni_UpdatePlayerAni(p)

      this.players.push(p);

    }
  }

  // 发射子弹
  async bulletCreate(delta: number) {
    //  if (!this.gameStart) return
    if (!this.gameEnd) return

    this.countBulletTime += delta

    //
    this.BulletList.forEach(async (item) => {

        const temp = this.BulletData.find( (val : any) => {
           return val.bulletName === item
         })
        await this.weaponCreate(temp)

    })

  }

  async weaponCreate(val: any) {
    let shouldCount = Math.round(this.countBulletTime / val.Rate)

    let nowCount = this.nowBullet[val.bulletName];

    if (nowCount == undefined) {
      nowCount = this.nowBullet[val.bulletName] = 0;
    }


    for (let i = 0; i < shouldCount - nowCount; i++) {
      //  targetx默认为随机-30到30
      let targetx = Math.random() * 60 - 30
      let targety = -400 * this.inputscale
      // 摇杆控制子弹方向
      if (this.touchdir !== null) {
        targetx += this.touchdir.X * 1000
      }
      this.nowBullet[val.bulletName] += 1
      // 基本速度单位
      const speed = 1000

      //转为monster.MyPlayerData 加几个属性进去
      let p = await this.handlePlayerFun.CreateBullet();
      p.aniname = val.bulletName
      p.posX = 0;
      p.posY = 400 * this.inputscale;
      p.userdata.targetA = new tt.Vector2(targetx, targety);
      p.userdata.targetB = new tt.Vector2(targetx, targety);
      p.userdata.speed = speed;
      p.userdata.bulletDamage = 10
      p.userotate = true;
      p.rotate = QAni_Dir2ToRotate(targetx - p.posX, targety - p.posY);
      this.bullets.push(p);
    }

  }

  // 城墙
  async wallCreate() {
   // if (!this.gameStart) return
    for (let i = 0; i < 8; i++) {
      let p = await this.handlePlayerFun.CreateWall();
      p.posX = -375 + i * 100;
      p.posY = 390;
      this.walls.push(p);
    }
  }

  // 波次
  private async InitRoundBg(): Promise<void> {
    this.roundBg = await UITool.CreateImg('data/uiimg/roundNumBg.png', this.app.font, this.roundNum.toString() + '波');
    this.roundBg.localRect.setByRect(new tt.Rectangle(230, 200, 103 * this.inputscale, 90 * this.inputscale));
    this.roundBg.localRect.setHPosByCenter(103 * this.inputscale)
    this.app.canvas.addChild(this.roundBg);
    return;
  }

  // 进入下一波次
  roundEnd() {
    this.roundNum++
    this.roundBgTimer = 3.0
    this.players = []
    this.bullets = []
    this.gameStart = false
    this.gameEnd = false
    this.nowMonsterCount = {}
    this.countMonsterTime = 0
    this.countBulletTime = 0
    this.nowBullet = {}

        if(this.walls.length === 0) {
            // 游戏结束
        } else {
             this.InitRoundBg()
             this.levelData = new LevelData().getLevelEnemyDataByLevel(this.levelNum, this.roundNum)
        } 



  }

  bulletchange() {
    this.nowBullet = {}
    this.countBulletTime = 0

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
  OnExit(): void {
    this.app.canvas.removeChildAll();

    clearInterval(this.timer);
  }
  
  updateBGBtnTimer(delta: number): void {
    if (this.roundBg != null) {
      this.roundBgTimer -= delta;
      if (this.roundBgTimer < 0) {
        this.roundBg.getParent().removeChild(this.roundBg);
        this.roundBg = null;
        this.gameStart = true
        this.gameEnd = true
        this.roundCountDownTimer_MS = this.levelData[0].time * 1000
        this.wallCreate()
        this.createPanel()
      }
      else {
        //   (this.roundBg.getChild(0) as tt2.QUI_Label).text = (this.roundBgTimer + 1 | 0).toString();
      }
    }
  }

  updateRoundCountDownTimer(delta: number): void {
    if (this.roundCountDown == null)
      return;
    let timerstr = "00:00:00";
    if (this.roundCountDownTimer_MS > 0) {
      this.roundCountDownTimer_MS -= delta * 1000;
      if (this.roundCountDownTimer_MS > 0) {
        let minutes = Math.floor((this.roundCountDownTimer_MS / 1000 / 60) % 60);
        let seconds = Math.floor((this.roundCountDownTimer_MS / 1000) % 60);
        let ms: any = (this.roundCountDownTimer_MS % 1000) | 0;
        ms = (ms / (1000 / 60)) | 0;
        if (ms >= 59) ms = 59;
        ms = ms < 10 ? '0' + ms : ms;
        timerstr = minutes + ":" + seconds + ":" + ms;
      }
      else {
        timerstr = "00:00:00";
        this.gameStart = false
        //this.roundEnd()
      }
    }


    let label = (this.roundCountDown.getChild(0) as tt2.QUI_Label);
    if (label != null)
      label.text = timerstr;
  }



  OnUpdate(delta: number): void {
    if (!this.hasinited) return;
    this.updateBGBtnTimer(delta);
    this.updateRoundCountDownTimer(delta);
    this.monsterCreate(delta)
    this.bulletCreate(delta)
    this.touchdir = this.joystick.GetTouchDirection()
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
    })
    this.bullets.sort((a, b) => {
      return a.posY - b.posY;
    })
    this.walls.sort((a, b) => {
      return a.posY - b.posY;
    })
    this.UpdatePlayerMove(delta);
    this.UpdateBulletsMove(delta);
    tt2.QAni_PlayerMgr.UpdatePlayers_Ani(this.players, delta);
    tt2.QAni_PlayerMgr.UpdatePlayers_Ani(this.bullets, delta);
  }

  UpdatePlayerMove(delta: number) {
    if (this.players.length === 0 && this.roundCountDownTimer_MS === 0 && this.gameEnd) {
      this.roundEnd()
    //  this.gameEnd = false
      return
    }
    for (var i = 0; i < this.players.length; i++) {
      let p = this.players[i];
      // 播放帧完毕删除怪物
      if (p.aniname === 'gone' && p.end) {
        this.players.splice(i, 1)
      }
      this.bullets.forEach((bullet, bulletIndex) => {
        if (p.aniname === 'gone') return
        if (bullet.posX > p.posX - 30 && bullet.posX < p.posX + 30 && bullet.posY > p.posY - 30 && bullet.posY < p.posY + 30) {

          p.userdata.health = p.userdata.health - bullet.userdata.bulletDamage
          this.bullets.splice(bulletIndex, 1)

          // 被击退
          p.userdata.targetB = new tt.Vector2(p.posX, p.posY - 5)
          p.aniname = 'back'

          // 被击杀
          if (p.userdata.health <= 0) {
            p.aniname = 'gone'
            this.nowGold += p.userdata.raward
            let label = (this.goldBg.getChild(0) as tt2.QUI_Label);
            if (label != null) {
              label.text = String(this.nowGold)
            }
          }
          tt2.QAni_UpdatePlayerAni(p)
          //this.players.splice(i, 1)
        }
      })
      this.walls.forEach((wall, wallIndex) => {
        if (wall.posX > p.posX - 130 && wall.posX < p.posX + 130 && wall.posY > p.posY - 50 && wall.posY < p.posY + 50) {
          this.walls = []
          this.createPanel()
          // todo 执行游戏结束
        }
      })

      if (p.aniname === 'back') {
        let b = Vector2Func.Goto(p, p.userdata.targetB, p.userdata.speed, delta);
        //到达
        if (b == false) {
          p.aniname = 'walk'
          p.userdata.targetB = new tt.Vector2(p.posX, p.userdata.targetA.Y)
          tt2.QAni_UpdatePlayerAni(p)
        }
      }

      if (p.aniname === 'walk') {
        let b = Vector2Func.Goto(p, p.userdata.targetB, p.userdata.speed, delta);
        //到达
        if (b == false) {
          this.players.splice(i, 1)
        }
      }



    }
  }


  UpdateBulletsMove(delta: number) {
    for (var i = 0; i < this.bullets.length; i++) {
      let p = this.bullets[i];
      let b = Vector2Func.Goto(p, p.userdata.targetB, p.userdata.speed, delta);
      if (b == false) {
        this.bullets.splice(i, 1)
      }//到达

    }

  }

  OnRender(): void {
    if (!this.hasinited) return;
    this.app.batcherBottom.BeginDraw(this.app.target);
    this.background.RenderRect(this.app.batcherBottom, new tt.Rectangle(-400 * this.inputscale, -800 * this.inputscale, 800 * this.inputscale, 1600 * this.inputscale));


    tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.bullets);
    tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.walls);
    tt2.QAni_PlayerMgr.RenderPlayers(this.app.batcherBottom, this.players);
    this.app.batcherBottom.EndDraw();
  }
}