

import * as tt2 from "../../../ttapi_layer2/ttlayer2.js"
import { tt } from "../../../ttapi_interface/ttapi.js"

export class MyPlayerData {
    targetA: tt.Vector2;
    targetB: tt.Vector2;
    speed: number;
}

export class BulletData extends MyPlayerData{
    bulletDamage: number;
    Volume: number;
    RAction: number;
    Angle: number;
    Rate: number;
    PenetrateNB: number;
}

export class MonsterData extends MyPlayerData {
    health: number;
    damage: number;
    raward: number;
}




export interface LevelEnemyData {
   getLevelEnemyDataByLevel(level: number, round: number) :LevelEnemyWithMonster []
   getMonsterById(enemyID: number): Monster
}

export class LevelEnemyWithMonster {
    level: number;
    WaveOrder: number;
    EnemyID: number;
    AddMET: number;
    Birth: string;
    Frequency: number;
    CreateNB: number;
    time: number;
    Monster: Monster
}


export class LevelEnemy {
    level: number;
    WaveOrder: number;
    EnemyID: number;
    AddMET: number;
    Birth: string;
    Frequency: number;
    CreateNB: number;
    time: number;
}

export class Monster {
    EnemyID: number;
    Healh: number;
    Damage: number;
    Type: number;
    Volume: number;
    Friction: number;
    Raward: number;
}

export const MonsterDataList: LevelEnemy[] = [
  {
    level: 1,
    WaveOrder: 1,
    EnemyID: 2000,
    AddMET: 0,
    Birth: 'a;b;c;d',
    Frequency: 0.2,
    CreateNB: 5,
    time: 10
  },
  {
    level: 1,
    WaveOrder: 1,
    EnemyID: 2001,
    AddMET: 0,
    Birth: 'a;b;c;d',
    Frequency: 0.5,
    CreateNB: 2,
    time: 10
  },
  {
    level: 1,
    WaveOrder: 2,
    EnemyID: 2001,
    AddMET: 0,
    Birth: 'a;b;c;d',
    Frequency: 0.2,
    CreateNB: 3,
    time: 10
  },
  {
    level: 1,
    WaveOrder: 2,
    EnemyID: 2001,
    AddMET: 1,
    Birth: 'a;b;c;d',
    Frequency: 0.1,
    CreateNB: 2,
    time: 10
  },
  {
    level: 1,
    WaveOrder: 3,
    EnemyID: 2003,
    AddMET: 1,
    Birth: 'a;b;c;d',
    Frequency: 35,
    CreateNB: 1,
    time: 35
  },
];

export const MonsterList: Monster[] = [
    {
    EnemyID: 2000,
    Healh: 25,
    Damage: 5,
    Type: 0,
    Volume: 1,
    Friction: 1,
    Raward: 1,
    },
    {
      EnemyID: 2001,
      Healh: 50,
      Damage: 20,
      Type: 1,
      Volume: 2,
      Friction: 1,
      Raward: 3,
    },  {
      EnemyID: 2002,
      Healh: 43200,
      Damage: 120,
      Type: 3,
      Volume: 5,
      Friction: 1,
      Raward: 0,
    },  {
      EnemyID: 2003,
      Healh: 43200,
      Damage: 120,
      Type: 3,
      Volume: 5,
      Friction: 1,
      Raward: 0,
    },
  ];

  
export const LevelTimeList: any[] = [
  {
    WaveOrder: 1,
    Time: 10,
  },
  {
    WaveOrder: 2,
    Time: 13,
  },
  {
    WaveOrder: 3,
    Time: 17,
  },
  {
    WaveOrder: 4,
    Time: 21,
  },
  {
    WaveOrder: 5,
    Time: 23,
  },
  {
    WaveOrder: 6,
    Time: 25,
  },
  {
    WaveOrder: 7,
    Time: 28,
  },
  {
    WaveOrder: 8,
    Time: 30,
  },
  {
    WaveOrder: 9,
    Time: 33,
  },
  {
    WaveOrder: 10,
    Time: 35,
  }
];



