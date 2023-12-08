import { tt } from "../../ttapi_interface/ttapi.js"

//资源管理器，只简单的把资源命名化
export class QFrame_ResMgr {
    //独立精灵，往往指向一整张图片
    static allStandaloneSprite: { [id: string]: tt.Sprite } = {};
    //图集，包含图集精灵
    static allAtlas: { [id: string]: tt.Atlas } = {}
    private static _respath: string = "";
    static GetDefResPath(): string {
        return this._respath;
    }
    static SetDefResPath(respath: string) {
        QFrame_ResMgr._respath = respath;
        if (respath != null && respath != "") {
            if (QFrame_ResMgr._respath[QFrame_ResMgr._respath.length - 1] != "/")
                QFrame_ResMgr._respath += "/"
        }
        else {
            QFrame_ResMgr._respath = "";
        }
    }
    static async LoadStandaloneSpriteAsync(url: string): Promise<tt.Sprite> {
        url = QFrame_ResMgr._respath + url;

        let name = tt.PathTool.GetFileName(url).toLowerCase();
        let s = this.allStandaloneSprite[name];
        if (s != undefined)
            return s;



        let img = await tt.loader.LoadImageAsync(url);
        let tex = tt.graphic.CreateStaticTextureFromImage(tt.TextureFormat.RGBA32, img);
        s = new tt.Sprite(tex, null);
        this.allStandaloneSprite[name] = s;
        return s;
    }
    static async LoadAtlasAsync(url: string, ignoreCase: boolean = true): Promise<tt.Atlas> {
        url = QFrame_ResMgr._respath + url;
        //去重
        let name = tt.PathTool.GetFileName(url).toLowerCase();
        let s = this.allAtlas[name];
        if (s != undefined)
            return s;


        let txt = await tt.loader.LoadStringAsync(url)
        //加载atlas 配置
        let json = JSON.parse(txt);


        //加载图片
        let texname = json["tex"];

        let it = url.lastIndexOf("/");
        let imgurl = tt.PathTool.GetPathName(url);
        if (it >= 0)
            imgurl = imgurl.substring(0, it) + "/" + texname;
        else
            imgurl = texname;

        // let imgurl = tt.PathTool.GetPathName(url) + "/" + texname;
        let img = await tt.loader.LoadImageAsync(imgurl);
        let tex = tt.graphic.CreateStaticTextureFromImage(tt.TextureFormat.RGBA32, img);

        //组装atlas
        s = new tt.Atlas();
        s.tex = tex;
        s.ParseJson(json, ignoreCase);

        if (ignoreCase) {
            name = name.toLowerCase();
        }
        this.allAtlas[name] = s;
        return s;
    }
}