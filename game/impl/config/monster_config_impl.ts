import { LevelEnemyData, LevelEnemy, Monster, MonsterDataList, MonsterList, LevelEnemyWithMonster } from '../../interface/config/monster_config.js'

export default class LevelData implements LevelEnemyData {

    getLevelEnemyDataByLevel(level: number, round: number) :LevelEnemyWithMonster[] {

        let result: LevelEnemyWithMonster[] = []

      let LevelEnemyResult =  MonsterDataList.filter( item =>{
          return  item.level === level && item.WaveOrder === round
        })
        let  MonsterResult = null


    if(LevelEnemyResult && LevelEnemyResult.length > 0) {
        LevelEnemyResult.forEach((element)=>{
            MonsterResult = MonsterList.find( item => {
                return  item.EnemyID === element.EnemyID
            })

            result.push({...element, Monster: MonsterResult})
        })
      
    }
        return result
    }



    getMonsterById(enemyID: number) :Monster{
        return null
    } 
}