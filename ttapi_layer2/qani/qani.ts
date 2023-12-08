//玩家动画系统

import { tt } from "../../ttapi_interface/ttapi.js";
import { QFrame_ResMgr } from "../ttlayer2.js";


export enum QAni_Direction {
    Left = 0,
    Right = 1,
    Up = 2,
    Down = 3,
}
export function QAni_DirToEnum(dir: tt.Vector2): QAni_Direction {
    let absx = Math.abs(dir.X);
    let absy = Math.abs(dir.Y);
    if (absx > absy) {
        if (dir.X < 0)
            return QAni_Direction.Left;//0 代表左
        else
            return QAni_Direction.Right;//1 代表右
    }
    else {
        if (dir.Y < 0)
            return QAni_Direction.Up;
        else
            return QAni_Direction.Down;
    }
}
export function QAni_Dir2ToEnum(x: number, y: number): QAni_Direction {
    let absx = Math.abs(x);
    let absy = Math.abs(y);
    if (absx > absy) {
        if (x < 0)
            return QAni_Direction.Left;//0 代表左
        else
            return QAni_Direction.Right;//1 代表右
    }
    else {
        if (y < 0)
            return QAni_Direction.Up;
        else
            return QAni_Direction.Down;
    }
}
export function QAni_UpdatePlayerAniByPos<T>(player: QAni_Player<T>, toX: number, toY: number) {
    let dir = QAni_Dir2ToEnum(toX - player.posX, toY - player.posY);
    if (dir != player.direction) {
        player.direction = dir;
        let anis = player.data.animations[player.aniname];
        player.activeani = QAni_GetAniByDirection(anis, player.direction);
    }
}
export function QAni_UpdatePlayerAni<T>(player: QAni_Player<T>): void {
    let anis = player.data.animations[player.aniname];
    player.activeani = QAni_GetAniByDirection(anis, player.direction);
}

export function QAni_GetAniByDirection(dirani: QAni_DirAniData, dir: QAni_Direction): QAni_FrameAniData {
    if (dir == QAni_Direction.Left)
        return dirani.left;
    else if (dir == QAni_Direction.Right)
        return dirani.right;
    else if (dir == QAni_Direction.Up)
        return dirani.up;
    else
        return dirani.down;
}
export function QAni_Dir2ToRotate(x: number, y: number): number {
    let upx = 0;
    let upy = -1;
    let len = Math.sqrt(x * x + y * y);
    let px = x / len;
    let py = y / len;
    let dot = px * upx + py * upy;
    let rotate = Math.acos(dot);
    if (px < 0)//左半球
        rotate = Math.PI * 2 - rotate;
    return rotate;
}
export class QAni_PlayerMgr {
    static async LoadPlayerInfo(url: string, ignoreCase: boolean = true): Promise<QAni_PlayerAniData> {
        //改为自动加载atlas

        //改为一个json 只描述一个players
        //players字段可以上移一层
        //qani2 会兼容这个格式
        //标准扩展名改为ttani.json
        let _url =QFrame_ResMgr.GetDefResPath() + url;
        let jsonstr = await tt.loader.LoadStringAsync(_url);
        let json: any = null;
        try {
            json = JSON.parse(jsonstr);
        }
        catch (e) {
            throw new Error(".ttani.json 解析错误");
        }

        let atlasname = json["atlas"] as string;

        let atlaspath = tt.PathTool.GetPathName(url)
        let it = _url.lastIndexOf("/");
        if (it >= 0)
            atlaspath = atlaspath + "/" + atlasname;
        else
            atlaspath = atlasname;

        if (atlasname == undefined) {
            throw new Error("atlas name is null");
        }
        console.log("qani2 atlas path=" + atlaspath);
        let atlas = await QFrame_ResMgr.LoadAtlasAsync(atlaspath, ignoreCase);

        //create Anilist
        let mapani: { [id: string]: QAni_FrameAniData } = {};
        let anilist = json.animations as any[];

        for (var i = 0; i < anilist.length; i++) {
            let name = anilist[i].name as string;
            if (ignoreCase)
                name = name.toLowerCase();
            let frameanidta = new QAni_FrameAniData();
            mapani[name] = frameanidta;
            frameanidta.loop = anilist[i].loop as boolean;
            let map_frames: { [id: number]: any } = {};
            let framecount = anilist[i].framecount as number;
            for (var fi = 0; fi < anilist[i].frames.length; fi++) {
                let framedata: any = anilist[i].frames[fi];
                map_frames[framedata.frameid] = framedata;
            }
            frameanidta.frames = [];
            for (var fi = 0; fi < framecount; fi++) {
                let framedata: any = map_frames[fi];
                if (framedata != undefined) {
                    let f = new QAni_Frame();
                    let sname = framedata.sprite
                    if (ignoreCase)
                        sname = sname.toLowerCase();
                    f.sprite = atlas.GetSprite(sname);
                    f.OffsetX = framedata.offsetX;
                    f.OffsetY = framedata.offsetY;
                    if (framedata.scaleX != undefined)
                        f.ScaleX = framedata.scaleX;
                    else
                        f.ScaleX = 1;
                    if (framedata.scaleY != undefined)
                        f.ScaleY = framedata.scaleY;
                    else
                        f.ScaleY = 1;
                    frameanidta.frames.push(f);
                }
                else {
                    //reuse last
                    frameanidta.frames.push(frameanidta.frames[frameanidta.frames.length - 1]);
                }
            }
        }
        //create playermap
        //为了兼容过去
        let playerroot = json;
        if (json.players != undefined) {
            let playerlist = json.players as any[];
            playerroot = playerlist[0];
        }
        let srcplayerdata = new QAni_PlayerAniData();
        //or (var i = 0; i < playerlist.length; i++)
        {
            let name = playerroot.name as string;
            if (ignoreCase)
                name = name.toLowerCase();

            this.map_srcplayerdata[name] = srcplayerdata;
            srcplayerdata.playername = name;

            let anis = playerroot.anis as any[];

            srcplayerdata.animations = {};
            for (var j = 0; j < anis.length; j++) {
                let a = new QAni_DirAniData()

                let aname = anis[j].aniname as string;
                if (ignoreCase) {
                    aname = aname.toLowerCase();
                }
                if (srcplayerdata.defani == null)
                    srcplayerdata.defani = aname;
                let leftani = anis[j].left as string;
                let rightani = anis[j].right as string;
                let upani = anis[j].up as string;
                let downani = anis[j].down as string;
                {
                    a.aniname = aname;
                    srcplayerdata.animations[a.aniname] = a;
                    a.left = mapani[leftani];
                    a.right = mapani[rightani];
                    a.up = mapani[upani];
                    a.down = mapani[downani];
                }
            }


        }
        return srcplayerdata;
    }
    static map_srcplayerdata: { [id: string]: QAni_PlayerAniData } = {}
    static CreatePlayer<T>(name: string): QAni_Player<T> | null {
        let sp = this.map_srcplayerdata[name];
        if (sp == undefined)
            return null;
        let p = new QAni_Player<T>();
        p.posX = 0;
        p.posY = 0;
        p.scaleX = p.scaleY = 1;
        p.direction = QAni_Direction.Down;
        p.data = sp;
        p.aniname = sp.defani;
        let anis = p.data.animations[p.aniname];
        p.activeani = QAni_GetAniByDirection(anis, p.direction);
        p.activeaniframe = 0;
        return p;
    }


    static UpdatePlayers_Ani<T>(players: QAni_Player<T>[], delta: number): void {
        for (var i = 0; i < players.length; i++) {
            let p = players[i];
            p.activeaniframe += 60 * delta;
            let intframe = p.activeaniframe | 0;
            if (intframe >= p.activeani.frames.length) {
                if (p.activeani.loop) {
                    p.activeaniframe = 0;
                }
                else {
                    p.activeaniframe = p.activeani.frames.length - 1;
                    p.end = true;
                }
            }
        }

    }
    static UpdatePlayer_Ani<T>(player: QAni_Player<T>, delta: number): void {
        {
            let p = player;
            p.activeaniframe += 60 * delta;
            let intframe = p.activeaniframe | 0;
            if (intframe >= p.activeani.frames.length) {
                if (p.activeani.loop) {
                    p.activeaniframe = 0;
                }
                else {
                    p.activeaniframe = p.activeani.frames.length - 1;
                    p.end = true;
                }
            }
        }

    }
    static _pos: tt.Vector2 = new tt.Vector2(0, 0);
    static _scale: tt.Vector2 = new tt.Vector2(1, 1);;
    static RenderPlayers<T>(batcher: tt.IBatcher, players: QAni_Player<T>[]): void {
        for (var i = 0; i < players.length; i++) {
            let p = players[i];
            let intframe = p.activeaniframe | 0;

            let f = p.activeani.frames[intframe];
            if (f == undefined || f.sprite == undefined) {
                throw new Error("player 动画信息错误：at frame:" + intframe +
                    " ani=" + p.aniname + " dir=" + QAni_Direction[p.direction]);
            }
            this._scale.X = p.scaleX * f.ScaleX;
            this._scale.Y = p.scaleY * f.ScaleY;
            this._pos.X = p.posX + f.OffsetX * this._scale.X;
            this._pos.Y = p.posY + f.OffsetY * this._scale.Y;
            if (p.userotate)
                f.sprite.RenderWithRotate(batcher, this._pos, this._scale, p.rotate, -f.OffsetX, -f.OffsetY);
            else
                f.sprite.Render(batcher, this._pos, this._scale);
        }

    }

}
export class QAni_Player<T> {
    posX: number;
    posY: number;
    scaleX: number;
    scaleY: number;
    direction: QAni_Direction; //0左 1右 2上 3下 四方向结构
    data: QAni_PlayerAniData;
    aniname: string;
    activeani: QAni_FrameAniData;
    activeaniframe: number;
    end: boolean;
    userotate: boolean;//启用旋转，一般不启用（硬像素不要旋转）
    rotate: number;//旋转值，弧度
    userdata: T;//专门留一个加外挂信息的变量，免得瞎搞了
}
export class QAni_PlayerAniData {
    playername: string;
    defani: string;
    animations: { [id: string]: QAni_DirAniData }
}
export class QAni_DirAniData {
    aniname: string;
    left: QAni_FrameAniData;
    right: QAni_FrameAniData;
    up: QAni_FrameAniData;
    down: QAni_FrameAniData;
}
export class QAni_FrameAniData {
    loop: boolean
    frames: QAni_Frame[];
}
export class QAni_Frame {
    sprite: tt.Sprite;
    ScaleX: number;
    ScaleY: number;
    OffsetX: number;
    OffsetY: number;
}
