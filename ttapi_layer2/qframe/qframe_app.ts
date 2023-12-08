import { tt } from "../../ttapi_interface/ttapi.js"
import * as ttlayer2 from "../ttlayer2.js";

export interface QFrame_IState<T> {
    OnInit(statemgr: QFrame_StateMgr<T>): void;
    OnExit(): void;
    OnUpdate(delta: number): void
    OnRender(): void;
}
export class QFrame_StateMgr<T>
{
    constructor(userdata: T) {
        this.userdata = userdata;
    }
    private userdata: T;
    getUserData() {
        return this.userdata;
    }
    ChangeState(state: QFrame_IState<T>) {
        if (this.curState != null)
            this.curState.OnExit();
        this.curState = state;
        if (this.curState != null) {
            this.curState.OnInit(this);
        }
    }
    protected curState: QFrame_IState<T>;
    getCurState(): QFrame_IState<T> {
        return this.curState;
    }


    OnUpdate(delta: number): void {
        if (this.curState != null)
            this.curState.OnUpdate(delta);
    }
    OnRender(): void {
        if (this.curState != null) {
            this.curState.OnRender();
        }
    }
}
export class QFrame_App<T> extends QFrame_StateMgr<T>
{
    constructor(userdata: T, deffonturl: string, debug: boolean) {
        super(userdata)
        this.deffonturl = deffonturl;
        this.debug = debug;

    }

    private deffonturl: string;
    debug: boolean;


    font: tt.Font;
    batcherBottom: tt.IBatcher;
    //private batcherTop: tt.IBatcher;
    target: tt.IRenderTarget;
    canvas: ttlayer2.QUI_Canvas;

    private inited: boolean;



    async Start(): Promise<void> {

        this.inited = false;
        this.target = tt.graphic.getMainScreen();
        this.batcherBottom = tt.graphic.CreateRenderer_Batcher();
        //this.batcherTop = tt.graphic.CreateRenderer_Batcher();
        let ftdata = await tt.loader.LoadBinaryAsync(this.deffonturl);
        console.log("ftdata len=" + ftdata.byteLength);
        let fontdata = new tt.TTFontData();
        fontdata.Load(ftdata);
        let packer = new tt.Texture8Pool(256);
        this.font = new tt.Font(packer, fontdata);
        tt.graphic.setMainScreenScale(1.0);//修改实现，立即刷新了
        //tt.graphic.UpdateScreenSize(); //立即刷新screensize，否则可能后面取到的screensize是不对的

        this.batcherBottom.LookAt.X = this.target.getWidth() / 2;
        this.batcherBottom.LookAt.Y = this.target.getHeight() / 2;
        //加入canvas
        this.canvas = new ttlayer2.QUI_Canvas(this.target);

        //输入事件绑定
        tt.input.OnPoint = (id, x, y, press, move) => {
            var fs = tt.graphic.getFinalScale();
            this.canvas.OnTouch(id, press, move, x, y);
        }

        tt.graphic.OnUpdate = (delta: number) => {
            //this.canvas.localRect.setByRect(new tt.Rectangle(0, 0, this.target.getWidth(), this.target.getHeight()));
            this.canvas.OnUpdate(delta);

            this.updateFps(delta);

            this.OnUpdate(delta);

        }
        tt.graphic.OnRender = () => {
            this.target.Begin();

            this.OnRender();

            this.canvas.OnRender(null);
            if (this.debug) {

                this.renderDebugInfo();
            }
            this.target.End();;
        };

        return;
    }
    //计算FPS
    private fps: number = 0;
    private fpscount: number = 0;
    private fps_timer: number = 0;
    private updateFps(delta: number) {
        this.fps_timer += delta;
        this.fpscount++;
        if (this.fps_timer > 1.0) {
            this.fps_timer %= 1.0;
            this.fps = this.fpscount;
            this.fpscount = 0;

        }
    }
    private _debug_y: number;
    private ShowDebugText(txt: string, scale: number) {
        this.font.SureText(txt);
        this.font.RenderText(this.canvas.batcherUI, txt, new tt.Vector2(0, this._debug_y), new tt.Vector2(scale, scale)
            , new tt.Color(1, 0, 0, 1));
        this._debug_y += this.font.GetFontSize() * scale;
    }
    private renderDebugInfo(): void {
        let radio = tt.graphic.getDevicePixelRadio();
        this.canvas.batcherUI.BeginDraw(this.target);
        {
            this._debug_y = 0;
            this.ShowDebugText("DebugMode", radio);
            this.ShowDebugText("LogicSize(" + tt.graphic.getDeviceScreenWidth() + ","
                + tt.graphic.getDeviceScreenHeight()
                + ") radio=" + radio, radio);
            this.ShowDebugText("PixelSize(" + this.target.getWidth() + ","
                + this.target.getHeight()
                + ") scale=" + tt.graphic.getFinalScale(), radio);
            this.ShowDebugText("FPS=" + this.fps.toString(), radio);

            this.ShowDebugText("plat=" + tt.platform.getPlatformName(), radio);
        }
        this.canvas.batcherUI.EndDraw();
    }
}
