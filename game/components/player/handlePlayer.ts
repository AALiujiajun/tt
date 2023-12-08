//自己封装一个CreatePlayer函数，在其中应用懒汉模式
import * as tt2 from "../../../ttapi_layer2/ttlayer2.js"
import { tt } from "../../../ttapi_interface/ttapi.js"
import * as players from "../../interface/config/monster_config.js";
export default class handlePlayer {
  atlasJson: any;
  json: any;

async onInit() {
  
  this.json = {
    bullet: null,
    '2000': null,
    '2001': null,
    '2003': null,
     wall: null
  }
   this.atlasJson = await tt2.QFrame_ResMgr.LoadAtlasAsync("data/ttatlas.json", true)
   this.json.bullet =JSON.parse(await tt.loader.LoadStringAsync("data/bullet.json"))
   this.json.wall =JSON.parse(await tt.loader.LoadStringAsync("data/wall.json"))
   this.json['2000'] = JSON.parse(await tt.loader.LoadStringAsync("data/monster.json"))
   this.json['2001'] = JSON.parse(await tt.loader.LoadStringAsync("data/monster2.json"))
   this.json['2003'] = JSON.parse(await tt.loader.LoadStringAsync("data/monster3.json"))
  
  }

  async CreatePlayer(id: number): Promise<tt2.QAni_Player<players.MonsterData>> {
    let playerType = 'p1'
    let jsonFile = 'data/monster.json'
    if (id === 2001) {
      playerType = 'p2'
      jsonFile = 'data/monster2.json'
    }

    if(id === 2003) {
      playerType = 'p3'
      jsonFile = 'data/monster3.json'
    }

    let player = tt2.QAni_PlayerMgr.CreatePlayer<players.MonsterData>(playerType);

    let  json: any = JSON.parse(JSON.stringify(this.json[id]));
    
    if (player == null) {
     // let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync("data/ttatlas.json", true);
     // let json = JSON.parse(await tt.loader.LoadStringAsync(jsonFile));

      // 循环frames里的ScaleX和ScaleY随机变为当前值的0.8-1.2倍

      
      json.animations.forEach((element: any) => {
        element.frames
          .forEach((frame: any) => {
            frame.ScaleX = frame.ScaleX * (Math.random() * 0.4 + 0.8)
            frame.ScaleY = frame.ScaleY * (Math.random() * 0.4 + 0.8)
          })
      })
      tt2.QAni_PlayerMgr.LoadPlayerInfo(this.atlasJson, json);
      player = tt2.QAni_PlayerMgr.CreatePlayer(playerType);

    }
    if (player == null) {
      throw new Error("加载怪物 失败");
    }
    player.userdata = new players.MonsterData();
    return player;
  }

  async CreateBullet(): Promise<tt2.QAni_Player<players.BulletData>> {
    let player = tt2.QAni_PlayerMgr.CreatePlayer<players.BulletData>("b1");

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
  }

  async CreateWall(): Promise<tt2.QAni_Player<players.MyPlayerData>> {
    let player = tt2.QAni_PlayerMgr.CreatePlayer<players.MyPlayerData>("wall");

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
  }
}




