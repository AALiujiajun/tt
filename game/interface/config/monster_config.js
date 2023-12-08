export class MyPlayerData {
}
export class BulletData extends MyPlayerData {
}
export class MonsterData extends MyPlayerData {
}
export class LevelEnemyWithMonster {
}
export class LevelEnemy {
}
export class Monster {
}
export const MonsterDataList = [
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
export const MonsterList = [
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
    }, {
        EnemyID: 2002,
        Healh: 43200,
        Damage: 120,
        Type: 3,
        Volume: 5,
        Friction: 1,
        Raward: 0,
    }, {
        EnemyID: 2003,
        Healh: 43200,
        Damage: 120,
        Type: 3,
        Volume: 5,
        Friction: 1,
        Raward: 0,
    },
];
export const LevelTimeList = [
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uc3Rlcl9jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtb25zdGVyX2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxNQUFNLE9BQU8sWUFBWTtDQUl4QjtBQUVELE1BQU0sT0FBTyxVQUFXLFNBQVEsWUFBWTtDQU8zQztBQUVELE1BQU0sT0FBTyxXQUFZLFNBQVEsWUFBWTtDQUk1QztBQVVELE1BQU0sT0FBTyxxQkFBcUI7Q0FVakM7QUFHRCxNQUFNLE9BQU8sVUFBVTtDQVN0QjtBQUVELE1BQU0sT0FBTyxPQUFPO0NBUW5CO0FBRUQsTUFBTSxDQUFDLE1BQU0sZUFBZSxHQUFpQjtJQUMzQztRQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1IsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUUsSUFBSTtRQUNiLE1BQU0sRUFBRSxDQUFDO1FBQ1QsS0FBSyxFQUFFLFNBQVM7UUFDaEIsU0FBUyxFQUFFLEdBQUc7UUFDZCxRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1IsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUUsSUFBSTtRQUNiLE1BQU0sRUFBRSxDQUFDO1FBQ1QsS0FBSyxFQUFFLFNBQVM7UUFDaEIsU0FBUyxFQUFFLEdBQUc7UUFDZCxRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1IsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUUsSUFBSTtRQUNiLE1BQU0sRUFBRSxDQUFDO1FBQ1QsS0FBSyxFQUFFLFNBQVM7UUFDaEIsU0FBUyxFQUFFLEdBQUc7UUFDZCxRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1IsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUUsSUFBSTtRQUNiLE1BQU0sRUFBRSxDQUFDO1FBQ1QsS0FBSyxFQUFFLFNBQVM7UUFDaEIsU0FBUyxFQUFFLEdBQUc7UUFDZCxRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRDtRQUNFLEtBQUssRUFBRSxDQUFDO1FBQ1IsU0FBUyxFQUFFLENBQUM7UUFDWixPQUFPLEVBQUUsSUFBSTtRQUNiLE1BQU0sRUFBRSxDQUFDO1FBQ1QsS0FBSyxFQUFFLFNBQVM7UUFDaEIsU0FBUyxFQUFFLEVBQUU7UUFDYixRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksRUFBRSxFQUFFO0tBQ1Q7Q0FDRixDQUFDO0FBRUYsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFjO0lBQ2xDO1FBQ0EsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsRUFBRTtRQUNULE1BQU0sRUFBRSxDQUFDO1FBQ1QsSUFBSSxFQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsQ0FBQztRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsTUFBTSxFQUFFLENBQUM7S0FDUjtJQUNEO1FBQ0UsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsRUFBRTtRQUNULE1BQU0sRUFBRSxFQUFFO1FBQ1YsSUFBSSxFQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsQ0FBQztRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsTUFBTSxFQUFFLENBQUM7S0FDVixFQUFHO1FBQ0YsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsS0FBSztRQUNaLE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsQ0FBQztRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsTUFBTSxFQUFFLENBQUM7S0FDVixFQUFHO1FBQ0YsT0FBTyxFQUFFLElBQUk7UUFDYixLQUFLLEVBQUUsS0FBSztRQUNaLE1BQU0sRUFBRSxHQUFHO1FBQ1gsSUFBSSxFQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsQ0FBQztRQUNULFFBQVEsRUFBRSxDQUFDO1FBQ1gsTUFBTSxFQUFFLENBQUM7S0FDVjtDQUNGLENBQUM7QUFHSixNQUFNLENBQUMsTUFBTSxhQUFhLEdBQVU7SUFDbEM7UUFDRSxTQUFTLEVBQUUsQ0FBQztRQUNaLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRDtRQUNFLFNBQVMsRUFBRSxDQUFDO1FBQ1osSUFBSSxFQUFFLEVBQUU7S0FDVDtJQUNEO1FBQ0UsU0FBUyxFQUFFLENBQUM7UUFDWixJQUFJLEVBQUUsRUFBRTtLQUNUO0lBQ0Q7UUFDRSxTQUFTLEVBQUUsQ0FBQztRQUNaLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRDtRQUNFLFNBQVMsRUFBRSxDQUFDO1FBQ1osSUFBSSxFQUFFLEVBQUU7S0FDVDtJQUNEO1FBQ0UsU0FBUyxFQUFFLENBQUM7UUFDWixJQUFJLEVBQUUsRUFBRTtLQUNUO0lBQ0Q7UUFDRSxTQUFTLEVBQUUsQ0FBQztRQUNaLElBQUksRUFBRSxFQUFFO0tBQ1Q7SUFDRDtRQUNFLFNBQVMsRUFBRSxDQUFDO1FBQ1osSUFBSSxFQUFFLEVBQUU7S0FDVDtJQUNEO1FBQ0UsU0FBUyxFQUFFLENBQUM7UUFDWixJQUFJLEVBQUUsRUFBRTtLQUNUO0lBQ0Q7UUFDRSxTQUFTLEVBQUUsRUFBRTtRQUNiLElBQUksRUFBRSxFQUFFO0tBQ1Q7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXHJcblxyXG5pbXBvcnQgKiBhcyB0dDIgZnJvbSBcIi4uLy4uLy4uL3R0YXBpX2xheWVyMi90dGxheWVyMi5qc1wiXHJcbmltcG9ydCB7IHR0IH0gZnJvbSBcIi4uLy4uLy4uL3R0YXBpX2ludGVyZmFjZS90dGFwaS5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgTXlQbGF5ZXJEYXRhIHtcclxuICAgIHRhcmdldEE6IHR0LlZlY3RvcjI7XHJcbiAgICB0YXJnZXRCOiB0dC5WZWN0b3IyO1xyXG4gICAgc3BlZWQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEJ1bGxldERhdGEgZXh0ZW5kcyBNeVBsYXllckRhdGF7XHJcbiAgICBidWxsZXREYW1hZ2U6IG51bWJlcjtcclxuICAgIFZvbHVtZTogbnVtYmVyO1xyXG4gICAgUkFjdGlvbjogbnVtYmVyO1xyXG4gICAgQW5nbGU6IG51bWJlcjtcclxuICAgIFJhdGU6IG51bWJlcjtcclxuICAgIFBlbmV0cmF0ZU5COiBudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBNb25zdGVyRGF0YSBleHRlbmRzIE15UGxheWVyRGF0YSB7XHJcbiAgICBoZWFsdGg6IG51bWJlcjtcclxuICAgIGRhbWFnZTogbnVtYmVyO1xyXG4gICAgcmF3YXJkOiBudW1iZXI7XHJcbn1cclxuXHJcblxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTGV2ZWxFbmVteURhdGEge1xyXG4gICBnZXRMZXZlbEVuZW15RGF0YUJ5TGV2ZWwobGV2ZWw6IG51bWJlciwgcm91bmQ6IG51bWJlcikgOkxldmVsRW5lbXlXaXRoTW9uc3RlciBbXVxyXG4gICBnZXRNb25zdGVyQnlJZChlbmVteUlEOiBudW1iZXIpOiBNb25zdGVyXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBMZXZlbEVuZW15V2l0aE1vbnN0ZXIge1xyXG4gICAgbGV2ZWw6IG51bWJlcjtcclxuICAgIFdhdmVPcmRlcjogbnVtYmVyO1xyXG4gICAgRW5lbXlJRDogbnVtYmVyO1xyXG4gICAgQWRkTUVUOiBudW1iZXI7XHJcbiAgICBCaXJ0aDogc3RyaW5nO1xyXG4gICAgRnJlcXVlbmN5OiBudW1iZXI7XHJcbiAgICBDcmVhdGVOQjogbnVtYmVyO1xyXG4gICAgdGltZTogbnVtYmVyO1xyXG4gICAgTW9uc3RlcjogTW9uc3RlclxyXG59XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIExldmVsRW5lbXkge1xyXG4gICAgbGV2ZWw6IG51bWJlcjtcclxuICAgIFdhdmVPcmRlcjogbnVtYmVyO1xyXG4gICAgRW5lbXlJRDogbnVtYmVyO1xyXG4gICAgQWRkTUVUOiBudW1iZXI7XHJcbiAgICBCaXJ0aDogc3RyaW5nO1xyXG4gICAgRnJlcXVlbmN5OiBudW1iZXI7XHJcbiAgICBDcmVhdGVOQjogbnVtYmVyO1xyXG4gICAgdGltZTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTW9uc3RlciB7XHJcbiAgICBFbmVteUlEOiBudW1iZXI7XHJcbiAgICBIZWFsaDogbnVtYmVyO1xyXG4gICAgRGFtYWdlOiBudW1iZXI7XHJcbiAgICBUeXBlOiBudW1iZXI7XHJcbiAgICBWb2x1bWU6IG51bWJlcjtcclxuICAgIEZyaWN0aW9uOiBudW1iZXI7XHJcbiAgICBSYXdhcmQ6IG51bWJlcjtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IE1vbnN0ZXJEYXRhTGlzdDogTGV2ZWxFbmVteVtdID0gW1xyXG4gIHtcclxuICAgIGxldmVsOiAxLFxyXG4gICAgV2F2ZU9yZGVyOiAxLFxyXG4gICAgRW5lbXlJRDogMjAwMCxcclxuICAgIEFkZE1FVDogMCxcclxuICAgIEJpcnRoOiAnYTtiO2M7ZCcsXHJcbiAgICBGcmVxdWVuY3k6IDAuMixcclxuICAgIENyZWF0ZU5COiA1LFxyXG4gICAgdGltZTogMTBcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAxLFxyXG4gICAgV2F2ZU9yZGVyOiAxLFxyXG4gICAgRW5lbXlJRDogMjAwMSxcclxuICAgIEFkZE1FVDogMCxcclxuICAgIEJpcnRoOiAnYTtiO2M7ZCcsXHJcbiAgICBGcmVxdWVuY3k6IDAuNSxcclxuICAgIENyZWF0ZU5COiAyLFxyXG4gICAgdGltZTogMTBcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAxLFxyXG4gICAgV2F2ZU9yZGVyOiAyLFxyXG4gICAgRW5lbXlJRDogMjAwMSxcclxuICAgIEFkZE1FVDogMCxcclxuICAgIEJpcnRoOiAnYTtiO2M7ZCcsXHJcbiAgICBGcmVxdWVuY3k6IDAuMixcclxuICAgIENyZWF0ZU5COiAzLFxyXG4gICAgdGltZTogMTBcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAxLFxyXG4gICAgV2F2ZU9yZGVyOiAyLFxyXG4gICAgRW5lbXlJRDogMjAwMSxcclxuICAgIEFkZE1FVDogMSxcclxuICAgIEJpcnRoOiAnYTtiO2M7ZCcsXHJcbiAgICBGcmVxdWVuY3k6IDAuMSxcclxuICAgIENyZWF0ZU5COiAyLFxyXG4gICAgdGltZTogMTBcclxuICB9LFxyXG4gIHtcclxuICAgIGxldmVsOiAxLFxyXG4gICAgV2F2ZU9yZGVyOiAzLFxyXG4gICAgRW5lbXlJRDogMjAwMyxcclxuICAgIEFkZE1FVDogMSxcclxuICAgIEJpcnRoOiAnYTtiO2M7ZCcsXHJcbiAgICBGcmVxdWVuY3k6IDM1LFxyXG4gICAgQ3JlYXRlTkI6IDEsXHJcbiAgICB0aW1lOiAzNVxyXG4gIH0sXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgTW9uc3Rlckxpc3Q6IE1vbnN0ZXJbXSA9IFtcclxuICAgIHtcclxuICAgIEVuZW15SUQ6IDIwMDAsXHJcbiAgICBIZWFsaDogMjUsXHJcbiAgICBEYW1hZ2U6IDUsXHJcbiAgICBUeXBlOiAwLFxyXG4gICAgVm9sdW1lOiAxLFxyXG4gICAgRnJpY3Rpb246IDEsXHJcbiAgICBSYXdhcmQ6IDEsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBFbmVteUlEOiAyMDAxLFxyXG4gICAgICBIZWFsaDogNTAsXHJcbiAgICAgIERhbWFnZTogMjAsXHJcbiAgICAgIFR5cGU6IDEsXHJcbiAgICAgIFZvbHVtZTogMixcclxuICAgICAgRnJpY3Rpb246IDEsXHJcbiAgICAgIFJhd2FyZDogMyxcclxuICAgIH0sICB7XHJcbiAgICAgIEVuZW15SUQ6IDIwMDIsXHJcbiAgICAgIEhlYWxoOiA0MzIwMCxcclxuICAgICAgRGFtYWdlOiAxMjAsXHJcbiAgICAgIFR5cGU6IDMsXHJcbiAgICAgIFZvbHVtZTogNSxcclxuICAgICAgRnJpY3Rpb246IDEsXHJcbiAgICAgIFJhd2FyZDogMCxcclxuICAgIH0sICB7XHJcbiAgICAgIEVuZW15SUQ6IDIwMDMsXHJcbiAgICAgIEhlYWxoOiA0MzIwMCxcclxuICAgICAgRGFtYWdlOiAxMjAsXHJcbiAgICAgIFR5cGU6IDMsXHJcbiAgICAgIFZvbHVtZTogNSxcclxuICAgICAgRnJpY3Rpb246IDEsXHJcbiAgICAgIFJhd2FyZDogMCxcclxuICAgIH0sXHJcbiAgXTtcclxuXHJcbiAgXHJcbmV4cG9ydCBjb25zdCBMZXZlbFRpbWVMaXN0OiBhbnlbXSA9IFtcclxuICB7XHJcbiAgICBXYXZlT3JkZXI6IDEsXHJcbiAgICBUaW1lOiAxMCxcclxuICB9LFxyXG4gIHtcclxuICAgIFdhdmVPcmRlcjogMixcclxuICAgIFRpbWU6IDEzLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgV2F2ZU9yZGVyOiAzLFxyXG4gICAgVGltZTogMTcsXHJcbiAgfSxcclxuICB7XHJcbiAgICBXYXZlT3JkZXI6IDQsXHJcbiAgICBUaW1lOiAyMSxcclxuICB9LFxyXG4gIHtcclxuICAgIFdhdmVPcmRlcjogNSxcclxuICAgIFRpbWU6IDIzLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgV2F2ZU9yZGVyOiA2LFxyXG4gICAgVGltZTogMjUsXHJcbiAgfSxcclxuICB7XHJcbiAgICBXYXZlT3JkZXI6IDcsXHJcbiAgICBUaW1lOiAyOCxcclxuICB9LFxyXG4gIHtcclxuICAgIFdhdmVPcmRlcjogOCxcclxuICAgIFRpbWU6IDMwLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgV2F2ZU9yZGVyOiA5LFxyXG4gICAgVGltZTogMzMsXHJcbiAgfSxcclxuICB7XHJcbiAgICBXYXZlT3JkZXI6IDEwLFxyXG4gICAgVGltZTogMzUsXHJcbiAgfVxyXG5dO1xyXG5cclxuXHJcblxyXG4iXX0=