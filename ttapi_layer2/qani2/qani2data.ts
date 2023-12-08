import { tt } from "../../ttapi_interface/ttapi.js"
import * as tt2 from "../qframe/qframe.js"
import { QAni2_Player } from "./qani2player.js";


//表示动画中引用的具体一块图片
export class QAni2_Sprite {
    sprite: tt.Sprite;
    srcname: string;
    ScaleX: number;
    ScaleY: number;
    OffsetX: number;
    OffsetY: number;
}
//表示动画中的一个判定框
export enum HitType {
    Attack,//攻击判定
    BeHit,//受击判定
    Other,
}
export class QAni2_Rect {
    type: HitType;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    id: number;
}
//表示动画的一帧
export class QAni2_Frame {
    sprites: QAni2_Sprite[];
    rects: QAni2_Rect[];
}
//表示动画的某一个方向
export class QAni2_FrameAniData {
    loop: boolean;
    framecount: number;//长度，单位帧，1帧=1/60秒
    frames: QAni2_Frame[];
}
//方向用角度固定
const dir_top: number = 0;
const dir_right: number = 90;
const dir_bottom: number = 180;
const dir_left: number = 270;

export class QAni2_AniRef {
    srcname: string;
    ani: QAni2_FrameAniData;
    flipx: boolean;
    flipy: boolean;
}
//表示一个动画
export class QAni2_DirAniData {
    aniname: string;
    dirani: QAni2_AniRef[];
    dircount: number;//该动画共计几个方向
    loop: boolean;
    framecount: number;//长度，单位帧，1帧=1/60秒
}
export class QAni2_PlayerAniData {
    playername: string;
    defani: string;
    animations: { [id: string]: QAni2_DirAniData }
}
export class QAni2_Direction {
    private dircount: number;
    private dirindex: number;
    constructor(dircount: number, initdir: number) {
        this.dircount = dircount;
        let angel = 360 / dircount;
        this.dirindex = (initdir / angel) | 0;
    }
    getDirIndex(): number {
        return this.dirindex;
    }
    getDirCount(): number {
        return this.dircount;
    }
    getDirAngle(): number {
        if (this.dircount == 1)
            return 0;
        if (this.dircount == 0) {
            if (this.dirindex == 0)
                return 90;
            else
                return 270;
        }
        let angel = 360 / this.dircount;
        return this.dirindex * angel;
    }
    getDirName(): string {
        if (this.dircount == 2) {
            if (this.dirindex == 0)
                return "right";
            else
                return "left";
        }
        else if (this.dircount == 4) {
            if (this.dirindex == 0)
                return "top";
            else if (this.dirindex == 1)
                return "right";
            else if (this.dirindex == 2)
                return "bottom";
            else
                return "left";
        }
        else {
            throw new Error("error dir name");

        }
    }
    setDirCount(dircount: number): void {
        this.dircount = dircount;
    }
    setDirIndex(dirindex: number): void {
        this.dirindex = dirindex;
        if (this.dirindex >= this.dircount)
            this.dirindex = 0;
    }
    setDirValue(v: number) {
        let angel = 360 / this.dircount;
        this.dirindex = (v / angel) | 0;
    }
    setDirName(dirname: string): void {
        if (this.dircount == 2) {
            if (dirname == "right")
                this.dirindex = 0
            else
                this.dirindex = 1;
        }
        else if (this.dircount == 4) {
            if (dirname == "top")
                this.dirindex = 0
            else if (dirname == "right")
                this.dirindex = 1
            else if (dirname == "down")
                this.dirindex = 2
            else
                this.dirindex = 3
        }
        else {
            throw new Error("error dir name");

        }
    }
}
export class QAni2_PlayerMgr {

    private static FindAni(name: string, mapani: { [id: string]: QAni2_FrameAniData }): QAni2_AniRef {
        let aname = name;
        let flipx = false;
        let flipy = false;
        let i = name.indexOf(":");
        if (i >= 0) {
            aname = name.substring(i + 1);
            if (name.includes("flipx:"))
                flipx = true;
            else if (name.includes("flipy:")) {
                flipy = true;
            }
            else if (name.includes("flipxy:")) {
                flipx = flipy = true;
            }
        }

        let ani = mapani[aname];
        if (ani == undefined)
            throw new Error("not find ani:" + name);

        return { srcname: aname, ani: ani, flipx: flipx, flipy: flipy };

    }
    static map_srcplayerdata: { [id: string]: QAni2_PlayerAniData } = {}
    static async LoadPlayerInfo(url: string, ignoreCase: boolean = true): Promise<QAni2_PlayerAniData> {
        let _url = tt2.QFrame_ResMgr.GetDefResPath() + url;
        let jsonstr = await tt.loader.LoadStringAsync(_url);
        let json: any = null;
        try {
            json = JSON.parse(jsonstr);
        }
        catch (e) {
            throw new Error(".ttani.json 解析错误");
        }
        console.log("load qani2 json");
        let atlasname = json["atlas"] as string;
        let atlaspath = tt.PathTool.GetPathName(_url)
        let it = _url.lastIndexOf("/");
        if (it >= 0)
            atlaspath = atlaspath + "/" + atlasname;
        else
            atlaspath = atlasname;

        if (atlasname == undefined) {
            throw new Error("atlas name is null");
        }
        console.log("qani2 atlas path=" + atlaspath);
        let atlas = await tt2.QFrame_ResMgr.LoadAtlasAsync(atlaspath, ignoreCase);
        //create Anilist

        let anilist = json.clips as any[];
        if (anilist == undefined) {
            //可能是qani 1.0 的格式，试一下
            return QAni2_PlayerMgr.LoadOldFormat(json, atlas, ignoreCase);
        }
        let mapani: { [id: string]: QAni2_FrameAniData } = {};
        for (var i = 0; i < anilist.length; i++) {
            let name = anilist[i].name as string;
            if (ignoreCase)
                name = name.toLowerCase();
            let frameanidta = new QAni2_FrameAniData();
            mapani[name] = frameanidta;
            frameanidta.framecount = anilist[i].framecount as number;
            frameanidta.loop = anilist[i].loop as boolean;
            let map_frames: { [id: number]: any } = {};

            for (var fi = 0; fi < anilist[i].frames.length; fi++) {
                let framedata: any = anilist[i].frames[fi];
                map_frames[framedata.frameid] = framedata;
            }

            frameanidta.frames = [];
            let framecount = anilist[i].framecount as number;
            for (var fi = 0; fi < framecount; fi++) {
                let framedata: any = map_frames[fi];
                if (framedata != undefined) {
                    let f = new QAni2_Frame();

                    f.sprites = [];
                    if (framedata.sprites == undefined) {
                        throw new Error("framedata.sprites is undefined");
                    }
                    for (var si = 0; si < framedata.sprites.length; si++) {
                        let sprite = framedata.sprites[si];
                        let s = new QAni2_Sprite();

                        let sname = sprite.sprite
                        if (ignoreCase)
                            sname = sname.toLowerCase();
                        s.sprite = atlas.GetSprite(sname);
                        s.srcname = sname;
                        s.OffsetX = sprite.offsetX;
                        s.OffsetY = sprite.offsetY;
                        if (sprite.offsetX == undefined) {
                            throw new Error("sprite.offsetX is undefined");
                        }
                        if (sprite.offsetY == undefined) {
                            throw new Error("sprite.offsetX is undefined");
                        }
                        if (sprite.scaleX != undefined)
                            s.ScaleX = sprite.scaleX;
                        else
                            s.ScaleX = 1;
                        if (sprite.scaleY != undefined)
                            s.ScaleY = sprite.scaleY;
                        else
                            s.ScaleY = 1;
                        f.sprites.push(s);
                    }

                    f.rects = [];
                    if (framedata.rects != undefined)
                        for (var ri = 0; ri < framedata.rects.length; ri++) {
                            let rect = framedata.rects[ri];
                            let r = new QAni2_Rect();
                            r.x1 = rect.x1;
                            r.y1 = rect.y1;
                            r.x2 = rect.x2
                            r.y2 = rect.y2;
                            let hittype = (rect.type as string).toLowerCase();
                            if (hittype == "attack")
                                r.type = HitType.Attack
                            else if (hittype == "behit")
                                r.type = HitType.BeHit
                            else if (hittype == "other")
                                r.type = HitType.Other
                            else
                                throw new Error("Unknown hit type: " + rect.type);
                            r.id = rect.id;
                            f.rects.push(r);
                        }
                    frameanidta.frames.push(f);
                }
                else {
                    //reuse last
                    frameanidta.frames.push(frameanidta.frames[frameanidta.frames.length - 1]);
                }
            }
        }
        //create playermap
        //let playerlist = json.players as any[];
        //for (var i = 0; i < playerlist.length; i++) {
        let name = json.playername as string;
        if (name == undefined) {
            throw new Error("playername is undefined");
        }
        if (ignoreCase)
            name = name.toLowerCase();
        let srcplayerdata = new QAni2_PlayerAniData();

        this.map_srcplayerdata[name] = srcplayerdata;
        srcplayerdata.playername = name;

        let anis = json.playeranis as any[];
        if (anis == undefined) {
            throw new Error("playeranis is undefined");
        }
        srcplayerdata.animations = {};
        for (var j = 0; j < anis.length; j++) {
            let a = new QAni2_DirAniData()

            let aname = anis[j].aniname as string;
            if (ignoreCase) {
                aname = aname.toLowerCase();
            }
            srcplayerdata.animations[aname] = a;
            if (srcplayerdata.defani == null)
                srcplayerdata.defani = aname;
            let dircount = anis[j].dircount as number;
            if (dircount == undefined) {
                throw new Error("dircount is undefined");
            }
            a.dircount = dircount;
            a.dirani = [];
            //一方向动画
            if (dircount == 1) {
                let rightani = anis[j].right as string;

                if (rightani == null)
                    rightani = anis[j].d90 as string;
                if (rightani == null)
                    rightani = anis[j].ani as string;
                a.dirani.push(QAni2_PlayerMgr.FindAni(rightani, mapani));
                a.framecount = a.dirani[0].ani.framecount;
                a.loop = a.dirani[0].ani.loop;
            }
            //二方向动画
            if (dircount == 2) {
                let leftani = anis[j].left as string;
                let rightani = anis[j].right as string;
                if (leftani == null)
                    leftani = anis[j].d270 as string;
                if (rightani == null)
                    rightani = anis[j].d90 as string;

                a.dirani.push(QAni2_PlayerMgr.FindAni(rightani, mapani));
                a.dirani.push(QAni2_PlayerMgr.FindAni(leftani, mapani));
                a.framecount = a.dirani[0].ani.framecount;
                a.loop = a.dirani[0].ani.loop;
                if (a.framecount != a.dirani[1].ani.framecount)
                    throw new Error("动画帧数不一致");
                if (a.loop != a.dirani[1].ani.loop)
                    throw new Error("动画循环不一致");
            }
            //四方向动画
            else if (dircount == 4) {
                let leftani = anis[j].left as string;
                let rightani = anis[j].right as string;
                let upani = anis[j].up as string;
                let downani = anis[j].down as string;
                if (upani == null)
                    upani = anis[j].d0 as string;
                if (rightani == null)
                    rightani = anis[j].d90 as string;
                if (downani == null)
                    downani = anis[j].d180 as string;
                if (leftani == null)
                    leftani = anis[j].d270 as string;
                a.dirani.push(QAni2_PlayerMgr.FindAni(upani, mapani));
                a.dirani.push(QAni2_PlayerMgr.FindAni(rightani, mapani));
                a.dirani.push(QAni2_PlayerMgr.FindAni(downani, mapani));
                a.dirani.push(QAni2_PlayerMgr.FindAni(leftani, mapani));
                a.framecount = a.dirani[0].ani.framecount;
                a.loop = a.dirani[0].ani.loop;
                if (a.framecount != a.dirani[1].ani.framecount ||
                    a.framecount != a.dirani[2].ani.framecount ||
                    a.framecount != a.dirani[3].ani.framecount)
                    throw new Error("动画帧数不一致");
                if (a.loop != a.dirani[1].ani.loop ||
                    a.loop != a.dirani[2].ani.loop ||
                    a.loop != a.dirani[3].ani.loop)
                    throw new Error("动画循环不一致");
            }
            //八方向，16方向也都可以搞


        }

        return srcplayerdata;
        //}
    }
    static LoadOldFormat(json: any, atlas: tt.Atlas, ignoreCase: boolean): QAni2_PlayerAniData {
        let mapani: { [id: string]: QAni2_FrameAniData } = {};
        let anilist = json.animations as any[];
        for (var i = 0; i < anilist.length; i++) {
            let name = anilist[i].name as string;
            if (ignoreCase)
                name = name.toLowerCase();
            let frameanidta = new QAni2_FrameAniData();
            mapani[name] = frameanidta;
            frameanidta.framecount = anilist[i].framecount as number;
            frameanidta.loop = anilist[i].loop as boolean;
            let map_frames: { [id: number]: any } = {};

            for (var fi = 0; fi < anilist[i].frames.length; fi++) {
                let framedata: any = anilist[i].frames[fi];
                map_frames[framedata.frameid] = framedata;
            }

            frameanidta.frames = [];
            let framecount = anilist[i].framecount as number;
            for (var fi = 0; fi < framecount; fi++) {
                let framedata: any = map_frames[fi];
                if (framedata != undefined) {
                    let f = new QAni2_Frame();

                    f.sprites = [];

                    //old format only have 1 sprite
                    //if (framedata.sprites == undefined) {
                    //    throw new Error("framedata.sprites is undefined");
                    //}
                    //for (var si = 0; si < framedata.sprites.length; si++) 
                    {
                        let sprite = framedata;
                        let s = new QAni2_Sprite();

                        let sname = sprite.sprite
                        if (ignoreCase)
                            sname = sname.toLowerCase();
                        s.sprite = atlas.GetSprite(sname);
                        s.srcname = sname;
                        s.OffsetX = sprite.offsetX;
                        s.OffsetY = sprite.offsetY;
                        if (sprite.offsetX == undefined) {
                            throw new Error("sprite.offsetX is undefined");
                        }
                        if (sprite.offsetY == undefined) {
                            throw new Error("sprite.offsetX is undefined");
                        }
                        if (sprite.scaleX != undefined)
                            s.ScaleX = sprite.scaleX;
                        else
                            s.ScaleX = 1;
                        if (sprite.scaleY != undefined)
                            s.ScaleY = sprite.scaleY;
                        else
                            s.ScaleY = 1;
                        f.sprites.push(s);
                    }

                    f.rects = [];
                    //old format do not have rect
                    // if (framedata.rects != undefined)
                    //     for (var ri = 0; ri < framedata.rects.length; ri++) {
                    //         let rect = framedata.rects[ri];
                    //         let r = new QAni2_Rect();
                    //         r.x1 = rect.x1;
                    //         r.y1 = rect.y1;
                    //         r.x2 = rect.x2
                    //         r.y2 = rect.y2;
                    //         let hittype = (rect.type as string).toLowerCase();
                    //         if (hittype == "attack")
                    //             r.type = HitType.Attack
                    //         else if (hittype == "behit")
                    //             r.type = HitType.BeHit
                    //         else if (hittype == "other")
                    //             r.type = HitType.Other
                    //         else
                    //             throw new Error("Unknown hit type: " + rect.type);
                    //         r.id = rect.id;
                    //         f.rects.push(r);
                    //     }
                    frameanidta.frames.push(f);
                }
                else {
                    //reuse last
                    frameanidta.frames.push(frameanidta.frames[frameanidta.frames.length - 1]);
                }
            }
        }

        //create playermap
        let playerroot = json;
        if (json.players != undefined) {
            let playerlist = json.players as any[];
            playerroot = playerlist[0];
        }
        //let playerlist = json.players as any[];
        //for (var i = 0; i < playerlist.length; i++) {
        let name = playerroot.name as string;
        if (name == undefined) {
            throw new Error("playername is undefined");
        }
        if (ignoreCase)
            name = name.toLowerCase();
        let srcplayerdata = new QAni2_PlayerAniData();

        this.map_srcplayerdata[name] = srcplayerdata;
        srcplayerdata.playername = name;

        let anis = playerroot.anis as any[];
        if (anis == undefined) {
            throw new Error("playeranis is undefined");
        }
        srcplayerdata.animations = {};
        for (var j = 0; j < anis.length; j++) {
            let a = new QAni2_DirAniData()

            let aname = anis[j].aniname as string;
            if (ignoreCase) {
                aname = aname.toLowerCase();
            }
            srcplayerdata.animations[aname] = a;
            if (srcplayerdata.defani == null)
                srcplayerdata.defani = aname;
            // let dircount = anis[j].dircount as number;
            // if (dircount == undefined) {
            //     throw new Error("dircount is undefined");
            // }
            a.dircount = 4;//固定四向
            a.dirani = [];
         
           {
                let leftani = anis[j].left as string;
                let rightani = anis[j].right as string;
                let upani = anis[j].up as string;
                let downani = anis[j].down as string;
                // if (upani == null)
                //     upani = anis[j].d0 as string;
                // if (rightani == null)
                //     rightani = anis[j].d90 as string;
                // if (downani == null)
                //     downani = anis[j].d180 as string;
                // if (leftani == null)
                //     leftani = anis[j].d270 as string;
                a.dirani.push(QAni2_PlayerMgr.FindAni(upani, mapani));
                a.dirani.push(QAni2_PlayerMgr.FindAni(rightani, mapani));
                a.dirani.push(QAni2_PlayerMgr.FindAni(downani, mapani));
                a.dirani.push(QAni2_PlayerMgr.FindAni(leftani, mapani));
                a.framecount = a.dirani[0].ani.framecount;
                a.loop = a.dirani[0].ani.loop;
                if (a.framecount != a.dirani[1].ani.framecount ||
                    a.framecount != a.dirani[2].ani.framecount ||
                    a.framecount != a.dirani[3].ani.framecount)
                    throw new Error("动画帧数不一致");
                if (a.loop != a.dirani[1].ani.loop ||
                    a.loop != a.dirani[2].ani.loop ||
                    a.loop != a.dirani[3].ani.loop)
                    throw new Error("动画循环不一致");
            }
         


        }

        return srcplayerdata;
        //}
    }

    static CreatePlayer<T>(name: string): QAni2_Player<T> | null {
        let sp = this.map_srcplayerdata[name];
        if (sp == undefined)
            return null;
        let p = new QAni2_Player<T>();
        p.posX = 0;
        p.posY = 0;
        p.scaleX = p.scaleY = 1;
        p.direction = new QAni2_Direction(sp.animations[sp.defani].dircount, 0);
        p.data = sp;
        p.aniname = sp.defani;

        //p.activeani = GetAniByDirection(anis, p.direction);
        p.activeaniframe = 0;
        p.Update(0);
        return p;
    }
}