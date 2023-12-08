

export module tt {



    export var graphic: IGraphic;
    export var platform: IPlatform;
    export var store: IStore
    // export var rootPack:IPackGroup;
    export var input: IInput;
    export var audio: IAudio;
    export var loader: ILoader;


    export async function sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    export interface IStore {
        GetText(name: string): Promise<string | null>;
        GetBinary(name: string): Promise<Uint8Array | null>;
        SaveText(name: string, data: string): Promise<void>;
        SaveBinary(name: string, data: Uint8Array): Promise<void>;
        SaveDataToLocal(key: string, data: string | ArrayBuffer): Promise<boolean>
    }

    export interface IPlatform {
        getPlatformName(): string;
    }


    //#region   ------Code From Color
    export class Color {
        constructor(r: number, g: number, b: number, a: number = 1) {
            this.R = r;
            this.G = g;
            this.B = b;
            this.A = a;
        }
        R: number
        G: number
        B: number
        A: number
        static get White(): Color {
            return new Color(1, 1, 1, 1);
        }
        static get Black(): Color {
            return new Color(0, 0, 0, 1);
        }
        static get Tran(): Color {
            return new Color(0, 0, 0, 0);
        }
        Clone(): Color {
            return new Color(this.R, this.G, this.B, this.A);

        }
    }
    //不一定用的到，保证RGBA取值的玩意儿罢了
    export class Color32 {
        constructor(r: number, g: number, b: number, a: number = 255) {
            this.data = new Uint8Array(4);
            this.R = r;
            this.G = g;
            this.B = b;
            this.A = a;
        }
        data: Uint8Array
        get R(): number {
            return this.data[0];
        }
        set R(v: number) {
            this.data[0] = v;
        }
        get G(): number {
            return this.data[1];
        }
        set G(v: number) {
            this.data[1] = v;
        }
        get B(): number {
            return this.data[2];
        }
        set B(v: number) {
            this.data[2] = v;
        }
        get A(): number {
            return this.data[3];
        }
        set A(v: number) {
            this.data[3] = v;
        }
    }
    //#endregion

    //#region  -----Code From Vector
    export class Vector2 {
        constructor(x: number, y: number) {
            this.X = x;
            this.Y = y;
        }
        X: number;
        Y: number;
        Clone(): Vector2 {
            return new Vector2(this.X, this.Y);
        }
        static get One(): Vector2 {
            return new Vector2(1, 1);
        }
        static get Zero(): Vector2 {
            return new Vector2(0, 0);
        }
        static Length(v1: Vector2): number {
            return Math.sqrt((v1.X) * (v1.X) + (v1.Y) * (v1.Y));
        }
        static Dist(v1: Vector2, v2: Vector2): number {
            return Math.sqrt((v1.X - v2.X) * (v1.X - v2.X) + (v1.Y - v2.Y) * (v1.Y - v2.Y));
        }
        static Dir(from: Vector2, to: Vector2): Vector2 {
            let dist = Vector2.Dist(from, to);
            return new Vector2((to.X - from.X) / dist, (to.Y - from.Y) / dist);
        }
        static Add(v1: Vector2, v2: Vector2): Vector2 {
            return new Vector2(v1.X + v2.X, v1.Y + v2.Y);
        }

        static Normal(src: Vector2): Vector2 {
            let len = Vector2.Length(src);
            return new Vector2(src.X / len, src.Y / len);
        }
    }
    export class Vector3 {
        constructor(x: number, y: number, z: number) {
            this.X = x;
            this.Y = y;
            this.Z = z;
        }
        X: number;
        Y: number;
        Z: number;

        Clone(): Vector3 {
            return new Vector3(this.X, this.Y, this.Z);
        }
        static get One(): Vector3 {
            return new Vector3(1, 1, 1);
        }
        static get Zero(): Vector3 {
            return new Vector3(0, 0, 0);
        }
    }
    //#endregion 

    //#region  -----Code From DrawPoint
    export class DrawPoint {
        //pos
        x: number = 0;  //offset 0
        y: number = 0;  //offset 4
        z: number = 0;  //offset 8

        //color (byte)
        r: number = 0;    //offset 12
        g: number = 0;    //offset 13
        b: number = 0;    //offset 14
        a: number = 0;    //offset 15
        //uv
        u: number = 0;      //offset 16
        v: number = 0;      //offset 20


        //tex&paluv (byte)
        palx: number = 0;   //offset 24
        paly: number = 0;   //offset 25
        anyz: number = 0;  //offset 26 //this can be auto,no need to public
        eff: number = 0;    //offset 27
        //pixel length =28

        Clone(): DrawPoint {
            var p = new DrawPoint();
            p.x = this.x;
            p.y = this.y;
            p.z = this.z;
            p.u = this.u;
            p.v = this.v;
            p.r = this.r;
            p.g = this.g;
            p.b = this.b;
            p.a = this.a;
            p.palx = this.palx;
            p.paly = this.paly;
            p.anyz = this.anyz;
            p.eff = this.eff;
            p.x = this.x;

            return p;

        }
    }
    //#endregion

    //#region -----Code From Rectangle
    export class Rectangle {
        constructor(x: number, y: number, w: number, h: number) {
            this.X = x;
            this.Y = y;
            this.Width = w;
            this.Height = h;
        }
        X: number;
        Y: number;
        Width: number;
        Height: number;

    }
    export class RectangleMath {
        static Clone(r: Rectangle): Rectangle {
            return new Rectangle(r.X, r.Y, r.Width, r.Height);
        }
        static Intersect(left: Rectangle, r: Rectangle): Rectangle {
            let x1 = left.X;
            let x2 = left.X + left.Width;
            let y1 = left.Y;
            let y2 = left.Y + left.Height;
            let rx1 = r.X;
            let ry1 = r.Y;
            let rx2 = rx1 + r.Width;
            let ry2 = ry1 + r.Height;
            if (x1 >= rx2 || rx1 >= x2 || y1 >= ry2 || ry1 >= y2)
                return new Rectangle(0, 0, 0, 0);
            let nx1 = Math.max(x1, rx1);
            let ny1 = Math.max(y1, ry1);
            let nx2 = Math.min(x2, rx2);
            let ny2 = Math.min(y2, ry2);
            return new Rectangle(nx1, ny1, nx2 - nx1, ny2 - ny1);
        }
    }
    export class Border {
        constructor(xLeft: number, yTop: number, xRight: number, yBottom: number) {
            this.XLeft = xLeft;
            this.YTop = yTop;
            this.XRight = xRight;
            this.YBottom = yBottom;
        }
        XLeft: number;
        XRight: number;
        YTop: number;
        YBottom: number;
    }
    export class UVRect {
        constructor(u1: number, v1: number, u2: number, v2: number) {
            this.U1 = u1;
            this.V1 = v1;
            this.U2 = u2;
            this.V2 = v2;
        }
        U1: number;
        V1: number;
        U2: number;
        V2: number;
    }
    //#endregion

    //#region   -----Code From Graphics

    export enum RenderEffect {
        RGBA = 0,
        Gray = 1,
        PAL8 = 2,
        P5A3 = 3,
        GrayAsAlpha = 4,
    }
    export enum TextureFormat {
        R8,
        RGBA32,
    }
    export interface IDestoryable {
        Destory(): void;
    }
    export interface ITexture extends IDestoryable {
        getID(): number;
        getFormat(): TextureFormat;
        getWidth(): number;
        getHeight(): number;
        getData(): Uint8Array;
        IsStatic(): boolean;
        IsTarget(): boolean;
        UploadTexture(x: number, y: number,
            w: number, h: number,
            data: Uint8Array | Uint8ClampedArray): void


        ApplyTexture(TurnToStatic: boolean): void
    }
    //将来加上这个支持
    export interface ITextureArray extends tt.IDestoryable {

    }

    //
    export interface IRenderTarget extends tt.ITexture {
        //RenderTarget 的观察点
        ClearColor: tt.Color
        IsMainOutput(): boolean
        Begin(): void;
        End(): void;

        PushLimitRect(rect: tt.Rectangle): void;
        PopLimitRect(): void;
        ClearLimitRect(): void;

        Resize(width: number, height: number): void;
    }
    export interface IRenderer {
        getTarget(): IRenderTarget | null
        getName(): string;

        LookAt: Vector2;
        Scale: number;
        //立即让Lookat 和 Scale 生效,begindraw 会做这个动作
        ResetMatrix(): void;

        BeginDraw(target: IRenderTarget): void;
        EndDraw(): void;

        //立即绘制一次
        ApplyBatch(): void;
    }
    export interface IBatcher extends IRenderer {
        DrawQuads(tex: ITexture, tex2: ITexture | null, texpal: ITexture | null, points: DrawPoint[], quadCount: number): void;
        DrawTris(tex: ITexture, tex2: ITexture | null, texpal: ITexture | null, tris: DrawPoint[], tricount: number): void;
        DrawLines(tex: ITexture, tex2: ITexture | null, texpal: ITexture | null, lines: DrawPoint[], linecount: number): void;
        DrawPoints(tex: ITexture, tex2: ITexture | null, texpal: ITexture | null, points: DrawPoint[], pointcount: number): void;

        // EX_DrawTexArrayQuads(tex: ITextureArray, texpal: ITexture, points: DrawPoint[], quadCount: number): void;
        // EX_DrawTexArrayTris(tex: ITextureArray, texpal: ITexture, tris: DrawPoint[], tricount: number): void;
        // EX_DrawTexArrayLines(tex: ITextureArray, texpal: ITexture, lines: DrawPoint[], linecount: number): void;
        // EX_DrawTexArrayPoints(tex: ITextureArray, texpal: ITexture, points: DrawPoint[], pointcount: number): void;
    }
    export interface IGraphic {
        //MainScreen as a RenderTarget
        getMainScreen(): IRenderTarget;
        getWhiteTexture(): ITexture;

        IsSupportUploadImg(): boolean;
        CreateStaticTextureFromImage(format: tt.TextureFormat, src: TexImageSource): ITexture;

        CreateStaticTexture(w: number, h: number, format: TextureFormat, data: Uint8Array | Uint8ClampedArray): ITexture;
        CreateDynamicTexture(w: number, h: number, format: TextureFormat): ITexture;

        //render target
        CreateRenderTarget(w: number, h: number, format: TextureFormat): IRenderTarget;
        ReadRenderTarget(
            target: IRenderTarget,
            onReadBack: (format: TextureFormat, w: number, h: number, byte: Uint8Array | Uint8ClampedArray) => void
        ): void;
        //IBatcher Batcher
        CreateRenderer_Batcher(): IBatcher

        getDeviceScreenWidth(): number;
        getDeviceScreenHeight(): number;
        getDevicePixelRadio(): number;
        getMainScreenScale(): number;
        setMainScreenScale(v: number): void;
        //UpdateScreenSize():void;
        getFinalScale(): number;
        OnUpdate: ((delta: number) => void) | null;
        OnResize: ((width: number, height: number) => void) | null;
        OnRender: (() => void) | null;

    }
    //#endregion

    //#region  -----Code From Input
    export class InputPoint {
        id: number = 0;
        x: number = 0;
        y: number = 0;
        press: boolean = false;
        move: boolean = false;
        Clone(): InputPoint {
            let p = new InputPoint();
            p.id = this.id;
            p.x = this.x;
            p.y = this.y;
            p.press = this.press;
            return p

        }
    }
    export interface IInput {
        //触摸点或者鼠标
        GetInputPoints(): InputPoint[];
        OnPoint: null | ((id: number, x: number, y: number, press: boolean, move: boolean) => void);

        //键盘
        IsKeyDown(keycode: string): boolean
        GetPressKeys(): string[];
        OnKey: null | ((keycode: string, press: boolean) => void);

        //弹出输入文本框
        Prompt(deftxt: string, maxlen: number): Promise<string>
    }

    //#endregion
    export class ImageBuffer {
        width: number;
        height: number;
        gray: boolean;
        data: Uint8Array;
    }
    //#region  -----Code From Loader
    export interface ILoader {
        // IsSupportTextSync(): boolean;
        // IsSupportBinarySync(): boolean
        // IsSupportImageSync(): boolean
        // LoadStringSync(name: string): string;
        // LoadBinarySync(name: string): ArrayBuffer;
        // LoadImageSync(name: string): HTMLImageElement

        LoadStringAsync(name: string): Promise<string>;
        LoadBinaryAsync(name: string): Promise<ArrayBuffer>;
        LoadImageAsync(name: string): Promise<HTMLImageElement>;
        LoadImageDataAsync(name: string, gray: boolean): Promise<ImageBuffer>;
    }
    //#endregion

    //#region  PathTool
    export class FileNameObj {
        constructor(filenameonly: string, longext: string) {
            this.filename = filenameonly;
            this.ext = longext;

            this.dotcount = 0;
            for (var i = 0; i < longext.length; i++) {
                if (longext.charAt(i) == ".")
                    this.dotcount++;
            }
            this.nextLevel = this.NextLevel();
        }
        filename: string;
        ext: string;
        dotcount: number;
        readonly nextLevel: FileNameObj | null
        private NextLevel(): FileNameObj | null {
            if (this.dotcount <= 1)
                return null;

            let pp = this.ext.indexOf('.', 1);

            let moreext = this.ext.substring(0, pp);
            let _ext = this.ext.substring(pp, this.ext.length);
            let _filename = this.filename + moreext;
            return new FileNameObj(_filename, _ext);
        }
    }
    export class PathTool {
        static CheckPath(url: string): string {
            let nurl = url;
            while (nurl.indexOf('\\') >= 0) {
                nurl = nurl.replace('\\', '/');
            }
            if (nurl.charAt(nurl.length - 1) == '/')
                nurl = nurl.substring(0, nurl.length - 1);
            if (nurl.indexOf("./") == 0)
                nurl = nurl.substring(2, nurl.length);
            return nurl;
        }
        static GetPathName(url: string): string {
            var i = url.lastIndexOf('/');
            if (i < 0)
                return url;
            else
                return url.substring(0, i);
        }
        static GetFileName(url: string): string {
            var i = url.lastIndexOf('/');
            if (i < 0)
                return url;
            else
                return url.substring(i + 1, url.length);
        }
        static GetExt(filename: string): string {
            if (filename.indexOf("\\") >= 0 || filename.indexOf("/") >= 0)
                throw new Error("error filename");
            let pp = filename.lastIndexOf('.');
            if (pp <= 0) {
                return "";
            }
            return filename.substring(pp, filename.length);
        }

        static GetLongExt(filename: string): string {
            if (filename.indexOf("\\") >= 0 || filename.indexOf("/") >= 0)
                throw new Error("error filename");
            let pp = filename.indexOf('.', 0);
            if (pp <= 0) {
                return "";
            }
            return filename.substring(pp, filename.length);
        }

        static GetFileNameObj(filename: string): FileNameObj {
            let fname = this.GetFileName(filename);
            let pp = fname.indexOf('.', 0);
            if (pp < 1)
                return new FileNameObj(fname, "");
            let _filename = fname.substring(0, pp);
            let _ext = fname.substring(pp, fname.length);

            return new FileNameObj(_filename, _ext);
        }

    }
    //#endregion

    //#region  binreader
    export class StringConv {
        static ArrayToString_Utf8(array: Uint8Array | Uint8ClampedArray | number[]): string {
            var ret: string[] = [];
            for (var i = 0; i < array.length; i++) {
                var cc = array[i];
                if (cc == 0)
                    break;
                var ct = 0;
                if (cc > 0xE0) {
                    ct = (cc & 0x0F) << 12;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    cc = array[++i];
                    ct |= cc & 0x3F;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0xC0) {
                    ct = (cc & 0x1F) << 6;
                    cc = array[++i];
                    ct |= (cc & 0x3F) << 6;
                    ret.push(String.fromCharCode(ct));
                }
                else if (cc > 0x80) {
                    throw new Error("InvalidCharacterError");
                }
                else {
                    ret.push(String.fromCharCode(array[i]));
                }
            }
            return ret.join('');
        }
        static ArrayToString_Ansi(array: Uint8Array | Uint8ClampedArray | number[]): string {
            var ret: string[] = [];
            for (var i = 0; i < array.length; i++) {
                ret[i] = String.fromCharCode(array[i]);
            }
            return ret.join('');
        }
        static StringToArray_Ansi(str: string): number[] {
            var bstr: number[] = [];
            for (var i = 0; i < str.length; i++) {
                bstr.push(str.charCodeAt(i));
            }
            return bstr;
        }
        static StringToArray_Utf8(str: string): number[] {
            var bstr: number[] = [];
            for (var i = 0; i < str.length; i++) {
                var c = str.charAt(i);
                var cc = c.charCodeAt(0);
                if (cc > 0xFFFF) {
                    throw new Error("InvalidCharacterError");
                }
                if (cc > 0x80) {
                    if (cc < 0x07FF) {
                        var c1 = (cc >>> 6) | 0xC0;
                        var c2 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2);
                    }
                    else {
                        var c1 = (cc >>> 12) | 0xE0;
                        var c2 = ((cc >>> 6) & 0x3F) | 0x80;
                        var c3 = (cc & 0x3F) | 0x80;
                        bstr.push(c1, c2, c3);
                    }
                }
                else {
                    bstr.push(cc);
                }
            }

            return bstr;
        }
    }
    export class BinReader {
        private _data: DataView;
        constructor(buf: ArrayBuffer, seek: number = 0) {
            this._seek = seek;
            this._data = new DataView(buf, seek);
        }
        private _seek: number;


        set position(seek: number) {
            this._seek = seek;
        }
        get position(): number {
            return this._seek;
        }
        length(): number {
            return this._data.byteLength;
        }
        canread(): number {
            //LogManager.Warn(this._buf.byteLength + "  &&&&&&&&&&&   " + this._seek + "    " + this._buf.buffer.byteLength);
            return this._data.byteLength - this._seek;
        }



        readSingle(): number {
            var num = this._data.getFloat32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readDouble(): number {
            var num = this._data.getFloat64(this._seek, true);
            this._seek += 8;
            return num;
        }
        readInt8(): number {
            var num = this._data.getInt8(this._seek);
            this._seek += 1;
            return num;
        }
        readUInt8(): number {
            //LogManager.Warn(this._data.byteLength + "  @@@@@@@@@@@@@@@@@  " + this._seek);
            var num = this._data.getUint8(this._seek);
            this._seek += 1;
            return num;
        }
        readInt16(): number {
            //LogManager.Log(this._seek + "   " + this.length());
            var num = this._data.getInt16(this._seek, true);
            this._seek += 2;
            return num;
        }
        readUInt16(): number {
            var num = this._data.getUint16(this._seek, true);
            this._seek += 2;
            //LogManager.Warn("readUInt16 " + this._seek);
            return num;
        }
        readInt32(): number {
            var num = this._data.getInt32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readUInt32(): number {
            var num = this._data.getUint32(this._seek, true);
            this._seek += 4;
            return num;
        }
        readUint8Array(target: Uint8Array | Uint8ClampedArray, offset: number = 0, length: number = -1): void {
            if (length < 0) length = target.length;
            for (var i = 0; i < length; i++) {
                target[i] = this._data.getUint8(this._seek);
                this._seek++;
            }

        }




        readBoolean(): boolean {
            return this.readUInt8() > 0;
        }

    }
    export class BinWriter {
        _buf: Uint8Array;
        private _data: DataView;
        private _length: number;
        private _seek: number;

        constructor() {
            //if (buf == null)
            {
                var buf = new ArrayBuffer(1024);
                this._length = 0;
            }

            this._buf = new Uint8Array(buf);
            this._data = new DataView(this._buf.buffer);
            this._seek = 0;
        }



        public get length(): number {
            return this._seek;
        }


        private sureData(addlen: number): void {
            var nextlen = this._buf.byteLength;
            while (nextlen < (this._length + addlen)) {
                nextlen += 1024;
            }
            if (nextlen != this._buf.byteLength) {
                var newbuf = new Uint8Array(nextlen);
                for (var i = 0; i < this._length; i++) {
                    newbuf[i] = this._buf[i];
                }
                this._buf = newbuf;
                this._data = new DataView(this._buf.buffer);
            }
            this._length += addlen;
        }


        getBuffer(): ArrayBuffer {
            return this._buf.buffer.slice(0, this._seek);
        }
        set position(seek: number) {
            this._seek = seek;
        }
        get position(): number {
            return this._seek;
        }
        writeInt8(num: number): void {
            this.sureData(1);
            this._data.setInt8(this._seek, num);
            this._seek++;

        }
        writeUInt8(num: number): void {
            this.sureData(1);
            this._data.setUint8(this._seek, num);
            this._seek++;
        }
        writeInt16(num: number): void {
            this.sureData(2);
            this._data.setInt16(this._seek, num, true);
            this._seek += 2;
        }
        writeUInt16(num: number): void {
            this.sureData(2);
            this._data.setUint16(this._seek, num, true);
            this._seek += 2;
        }
        writeInt32(num: number): void {
            this.sureData(4);
            this._data.setInt32(this._seek, num, true);
            this._seek += 4;
        }
        writeUInt32(num: number): void {
            this.sureData(4);
            this._data.setUint32(this._seek, num, true);
            this._seek += 4;
        }
        writeSingle(num: number): void {
            this.sureData(4);
            this._data.setFloat32(this._seek, num, true);
            this._seek += 4;
        }
        writeDouble(num: number): void {
            this.sureData(8);
            this._data.setFloat64(this._seek, num, true);
            this._seek += 8;
        }

        writeBoolean(v: boolean): void {
            this.writeUInt8(v == true ? 1 : 0);
        }


        writeUint8Array(array: Uint8Array | number[], offset: number = 0, length: number = -1) {
            if (length < 0) length = array.length;
            this.sureData(length);
            for (var i = offset; i < offset + length; i++) {
                this._data.setUint8(this._seek, array[i]);
                this._seek++;
            }
        }






    }
    //#endregion

    //#region ttfont

    const font_magic = "TTFontV1";
    export class TTFontHeader {


        charCount: number = 0;
        fontSize: number = 0;
        fontBorder: number = 0;//可以加一个边，bit
        get fontBitmapSize() {

            return this.fontSize + this.fontBorder;

        }
        Read(stream: BinReader): void {
            let buf = new Uint8Array(8);
            stream.readUint8Array(buf, 0, 8);
            if (StringConv.ArrayToString_Ansi(buf) != font_magic)
                throw new Error("not ttfont file.");

            this.charCount = stream.readUInt32();
            this.fontSize = stream.readUInt8();
            this.fontBorder = stream.readUInt8();
            if (this.charCount == 0 || this.charCount > 1000000)
                throw new Error("error char count.");
            if (this.fontSize < 8 || this.fontSize > 128)
                throw new Error("error fontSize");
            if (this.fontBorder > 128)
                throw new Error("error fontBorder");
        }



    }
    export class TTFontItem {
        constructor(bitmapsize: number) {
            this.graydata = new Uint8Array(bitmapsize * bitmapsize);
        }
        charCode: number = 0;
        width: number = 0;
        height: number = 0;
        emptyX: number = 0;
        emptyY: number = 0;
        advanceX: number = 0;
        graydata: Uint8Array;//charwidth*charwidth

        Read(stream: BinReader): void {
            this.charCode = stream.readUInt32();
            this.width = stream.readUInt8();
            this.height = stream.readUInt8();
            this.emptyX = stream.readInt8();
            this.emptyY = stream.readInt8();
            this.advanceX = stream.readUInt8();
            stream.readUint8Array(this.graydata, 0, this.graydata.length);
        }
    }
    export class TTFontData {
        header: TTFontHeader = new TTFontHeader();
        fontitems: { [id: number]: TTFontItem } = {};
        Load(buf: ArrayBuffer): void {
            var stream = new tt.BinReader(buf, 0);
            this.header.Read(stream);
            for (var i = 0; i < this.header.charCount; i++) {
                let item = new TTFontItem(this.header.fontBitmapSize);
                item.Read(stream);
                this.fontitems[item.charCode] = item;
            }
        }
    }
    //#endregion 

    //#region  image
    const img_magic = "TTIMG_V1";
    export enum TTIMGFormat {
        P5A3 = 0,//32 color with palette + 8 alpha
        PAL8 = 1,//256 color with palette
        GRAY = 2,//256 color (with a fix gray palette)
        RGBA = 3,//最暴躁的保存方式，先存工具屏蔽
    }
    export class PalData {
        constructor(color32: boolean) {
            this.color32 = color32;
            this.paldata = new Uint8Array(color32 ? 32 * 4 : 256 * 4);
        }
        color32: boolean;
        paldata: Uint8Array;//r g b byte array;len =colorcount*3;
        CanMerge(data: PalData): boolean {
            let count = this.color32 ? 32 : 256
            for (var i = this.color32 ? 0 : 1; i < count; i++) {
                let equal = (data.paldata[i * 4 + 0] == data.paldata[i * 4 + 0]
                    && data.paldata[i * 4 + 1] == data.paldata[i * 4 + 1]
                    && data.paldata[i * 4 + 2] == data.paldata[i * 4 + 2]
                    && data.paldata[i * 4 + 3] == data.paldata[i * 4 + 3])
                if (equal)
                    continue;
                let lzero = (this.paldata[i * 4 + 0] == 0 && this.paldata[i * 4 + 1] == 0 && this.paldata[i * 4 + 2] == 0 && this.paldata[i * 4 + 3] == 0);
                let rzero = (data.paldata[i * 4 + 0] == 0 && data.paldata[i * 4 + 1] == 0 && data.paldata[i * 4 + 2] == 0 && data.paldata[i * 4 + 3] == 0);
                if (lzero || rzero)
                    continue;

                return false;

            }
            return true;
        }
        TryMerge(data: PalData): boolean {
            let canm = this.CanMerge(data);
            if (!canm)
                return false;
            let count = this.color32 ? 32 : 256
            for (var i = this.color32 ? 0 : 1; i < count; i++) {
                let lzero = (this.paldata[i * 4 + 0] == 0 && this.paldata[i * 4 + 1] == 0 && this.paldata[i * 4 + 2] == 0 && this.paldata[i * 4 + 3] == 0);
                let rzero = (data.paldata[i * 4 + 0] == 0 && data.paldata[i * 4 + 1] == 0 && data.paldata[i * 4 + 2] == 0 && data.paldata[i * 4 + 3] == 0);
                if (lzero && !rzero) {
                    this.paldata[i * 4 + 0] = data.paldata[i * 4 + 0];
                    this.paldata[i * 4 + 1] = data.paldata[i * 4 + 1];
                    this.paldata[i * 4 + 2] = data.paldata[i * 4 + 2];
                    this.paldata[i * 4 + 3] = data.paldata[i * 4 + 3];
                }
            }
            return true;
        }
        Clone(): PalData {
            var pdat = new PalData(this.color32);
            for (var i = 0; i < pdat.paldata.length; i++) {
                pdat.paldata[i] = this.paldata[i];
            }
            return pdat;
        }
    }
    export class TTImgData {
        constructor() {
            this.width = 0;
            this.height = 0;
            this.format = 0;
            this.data = null;
            this.pals = [];
        }
        width: number;
        height: number;
        format: TTIMGFormat;
        data: Uint8Array | Uint8ClampedArray | null;
        pals: PalData[];
        GetRgbaData(palindex: number = 0): Uint8Array | Uint8ClampedArray {
            if (this.data == null)
                throw new Error("data is null.");
            if (this.format == TTIMGFormat.RGBA) {
                return this.data;
            }
            else {
                var outdata = new Uint8Array(this.width * this.height * 4);
                for (var i = 0; i < this.data.length; i++) {
                    var s = this.data[i];
                    if (this.format == TTIMGFormat.GRAY) {
                        outdata[i * 4 + 0] = s;
                        outdata[i * 4 + 1] = s;
                        outdata[i * 4 + 2] = s;
                        outdata[i * 4 + 3] = s;
                    }
                    if (this.format == TTIMGFormat.PAL8) {
                        outdata[i * 4 + 0] = this.pals[palindex].paldata[s * 4 + 0];
                        outdata[i * 4 + 1] = this.pals[palindex].paldata[s * 4 + 1];
                        outdata[i * 4 + 2] = this.pals[palindex].paldata[s * 4 + 2];
                        outdata[i * 4 + 3] = this.pals[palindex].paldata[s * 4 + 3];
                    }
                    if (this.format == TTIMGFormat.P5A3) {
                        let p = s % 32;
                        outdata[i * 4 + 0] = this.pals[palindex].paldata[p * 4 + 0];
                        outdata[i * 4 + 1] = this.pals[palindex].paldata[p * 4 + 1];
                        outdata[i * 4 + 2] = this.pals[palindex].paldata[p * 4 + 2];
                        outdata[i * 4 + 3] = this.pals[palindex].paldata[p * 4 + 3];
                    }
                }
                return outdata;
            }

        }
        Load(buf: ArrayBuffer): void {
            var stream = new tt.BinReader(buf, 0);
            var magicarr = new Uint8Array(8);
            stream.readUint8Array(magicarr, 0, 8);
            if (img_magic != StringConv.ArrayToString_Ansi(magicarr))
                throw new Error("not ttimg file");

            this.format = stream.readUInt8();



            if (this.format > TTIMGFormat.RGBA)
                throw new Error("error format");

            let needpal = (this.format == TTIMGFormat.PAL8 || this.format == TTIMGFormat.P5A3);

            var palcount = stream.readUInt8();

            if (!needpal && palcount > 0)
                throw new Error("donot need pal but got >0.");
            if (needpal && palcount == 0)
                throw new Error("need pal but got =0.");
            for (var i = 0; i < palcount; i++) {

                let colorcount = stream.readUInt8();
                let pal = new PalData(this.format == TTIMGFormat.P5A3);
                if (this.format == TTIMGFormat.PAL8) {
                    pal.paldata = new Uint8Array(256 * 4);
                    stream.readUint8Array(pal.paldata, 0, 256 * 4);
                }
                else if (this.format == TTIMGFormat.P5A3) {
                    pal.paldata = new Uint8Array(32 * 4);
                    stream.readUint8Array(pal.paldata, 0, 32 * 4);
                }
                else
                    throw new Error("shoud not be here.");
                this.pals.push(pal);
            }
            this.width = stream.readUInt16();
            this.height = stream.readUInt16();
            let bytelen = this.format == TTIMGFormat.RGBA ? 4 : 1;
            this.data = new Uint8Array(this.width * this.height * bytelen);
            stream.readUint8Array(this.data, 0, this.data.length);

        }
    }
    //#endregion

    //#region  Sprite
    export class Sprite {
        constructor(tex: ITexture, texpal: ITexture) {
            this.tex = tex;
            this.texpal = texpal;
            this.effect = RenderEffect.RGBA;
            this.uv = new UVRect(0, 0, 1, 1);
            this.border = new Border(0, 0, 0, 0);
            this.pixelwidth = tex.getWidth();
            this.pixelheight = tex.getHeight();
            this.paluvs = [];
        }
        tex: ITexture;
        texpal: ITexture;
        effect: RenderEffect;
        paluvs: Vector2[]
        uv: UVRect;//xywz
        //border
        border: Border;
        //total width
        get totalWidth(): number {
            return this.pixelwidth + this.border.XLeft + this.border.XRight;
        }
        //total height
        get totalHeight(): number {
            return this.pixelheight + this.border.YTop + this.border.YBottom;
        }
        pixelwidth: number;
        pixelheight: number;
        static _rectbuf: tt.DrawPoint[] = [];
        static _colorbuf: Color;
        RenderRectWithLimit(batcher: IBatcher, rect: Rectangle, limitRect: Rectangle, color: Color | null = null, palindex: number = -1): void {
            let rectbuf = Sprite._rectbuf
            while (rectbuf.length < 4) {
                rectbuf.push(new tt.DrawPoint());
            }
            if (Sprite._colorbuf == null) {
                Sprite._colorbuf = Color.White;
            }
            let _color = color == null ? Sprite._colorbuf : color;

            let palu = 0;
            let palv = 0;
            if (palindex >= 0) {
                palu = this.paluvs[palindex].X;
                palv = this.paluvs[palindex].Y;
            }
            let sx = rect.Width / this.totalWidth;
            let sy = rect.Height / this.totalHeight;

            let x1 = rect.X + sx * this.border.XLeft;
            let x2 = rect.X + rect.Width - sx * this.border.XRight;
            let y1 = rect.Y + sy * this.border.YTop;
            let y2 = rect.Y + rect.Height - sy * this.border.YBottom
            let u1 = this.uv.U1;
            let v1 = this.uv.V1
            let u2 = this.uv.U2
            let v2 = this.uv.V2
            let wx = x2 - x1;
            let wy = y2 - y1;
            //检查是否整体抹去
            if (x1 >= limitRect.X + limitRect.Width || x2 < limitRect.X
                ||
                y1 >= limitRect.Y + limitRect.Height || y2 < limitRect.Y) {
                x1 = x2 = y1 = y2 = 0;
            }
            else if (wx != 0 && wy != 0) {
                let nx1 = x1;
                let nx2 = x2;
                let ny1 = y1;
                let ny2 = y2;
                let change = false;
                if (x1 < limitRect.X) {
                    nx1 = limitRect.X;
                    change = true;
                }
                if (x2 > limitRect.X + limitRect.Width) {
                    nx2 = limitRect.X + limitRect.Width;
                    change = true;
                }
                if (y1 < limitRect.Y) {
                    ny1 = limitRect.Y;
                    change = true;
                }
                if (y2 > limitRect.Y + limitRect.Height) {
                    ny2 = limitRect.Y + limitRect.Height;
                    change = true;
                }
                if (change) {
                    let uw = u2 - u1;
                    let vw = v2 - v1;
                    let sx1 = (nx1 - x1) / wx;
                    let sx2 = (nx2 - x2) / wx;
                    let sy1 = (ny1 - y1) / wy;
                    let sy2 = (ny2 - y2) / wy;

                    u1 = u1 + uw * sx1;
                    v1 = v1 + vw * sy1;
                    u2 = u2 + uw * sx2;
                    v2 = v2 + vw * sy2;
                    x1 = nx1;
                    y1 = ny1;
                    x2 = nx2;
                    y2 = ny2;


                }
            }

            rectbuf[0].x = x1;
            rectbuf[0].y = y1;
            rectbuf[0].u = u1;
            rectbuf[0].v = v1;
            rectbuf[0].r = _color.R;
            rectbuf[0].g = _color.G;
            rectbuf[0].b = _color.B;
            rectbuf[0].a = _color.A;
            rectbuf[0].palx = palu;
            rectbuf[0].paly = palv;
            rectbuf[0].eff = this.effect

            rectbuf[1].x = x2;
            rectbuf[1].y = y1;
            rectbuf[1].u = u2;
            rectbuf[1].v = v1;
            rectbuf[1].r = _color.R
            rectbuf[1].g = _color.G
            rectbuf[1].b = _color.B
            rectbuf[1].a = _color.A
            rectbuf[1].palx = palu;
            rectbuf[1].paly = palv;
            rectbuf[1].eff = this.effect;

            rectbuf[2].x = x1;
            rectbuf[2].y = y2;
            rectbuf[2].u = u1;
            rectbuf[2].v = v2;
            rectbuf[2].r = _color.R
            rectbuf[2].g = _color.G
            rectbuf[2].b = _color.B
            rectbuf[2].a = _color.A
            rectbuf[2].palx = palu;
            rectbuf[2].paly = palv;
            rectbuf[2].eff = this.effect;

            rectbuf[3].x = x2;
            rectbuf[3].y = y2;
            rectbuf[3].u = u2;
            rectbuf[3].v = v2;
            rectbuf[3].r = _color.R
            rectbuf[3].g = _color.G
            rectbuf[3].b = _color.B
            rectbuf[3].a = _color.A
            rectbuf[3].palx = palu;
            rectbuf[3].paly = palv;
            rectbuf[3].eff = this.effect;
            batcher.DrawQuads(this.tex, null, this.texpal, rectbuf, 1);
        }
        RenderRect(batcher: IBatcher, rect: Rectangle, color: Color | null = null, palindex: number = -1) {
            let rectbuf = Sprite._rectbuf
            while (rectbuf.length < 4) {
                rectbuf.push(new tt.DrawPoint());
            }
            if (Sprite._colorbuf == null) {
                Sprite._colorbuf = Color.White;
            }
            let _color = color == null ? Sprite._colorbuf : color;

            let palu = 0;
            let palv = 0;
            if (palindex >= 0) {
                palu = this.paluvs[palindex].X;
                palv = this.paluvs[palindex].Y;
            }
            let sx = rect.Width / this.totalWidth;
            let sy = rect.Height / this.totalHeight;
            rectbuf[0].x = rect.X + sx * this.border.XLeft;
            rectbuf[0].y = rect.Y + sy * this.border.YTop;
            rectbuf[0].u = this.uv.U1;
            rectbuf[0].v = this.uv.V1;
            rectbuf[0].r = _color.R;
            rectbuf[0].g = _color.G;
            rectbuf[0].b = _color.B;
            rectbuf[0].a = _color.A;
            rectbuf[0].palx = palu;
            rectbuf[0].paly = palv;
            rectbuf[0].eff = this.effect

            rectbuf[1].x = rect.X + rect.Width - sx * this.border.XRight;
            rectbuf[1].y = rect.Y + sy * this.border.YTop;
            rectbuf[1].u = this.uv.U2;
            rectbuf[1].v = this.uv.V1;
            rectbuf[1].r = _color.R
            rectbuf[1].g = _color.G
            rectbuf[1].b = _color.B
            rectbuf[1].a = _color.A
            rectbuf[1].palx = palu;
            rectbuf[1].paly = palv;
            rectbuf[1].eff = this.effect;

            rectbuf[2].x = rect.X + sx * this.border.XLeft;
            rectbuf[2].y = rect.Y + rect.Height - sy * this.border.YBottom;
            rectbuf[2].u = this.uv.U1;
            rectbuf[2].v = this.uv.V2;
            rectbuf[2].r = _color.R
            rectbuf[2].g = _color.G
            rectbuf[2].b = _color.B
            rectbuf[2].a = _color.A
            rectbuf[2].palx = palu;
            rectbuf[2].paly = palv;
            rectbuf[2].eff = this.effect;

            rectbuf[3].x = rect.X + rect.Width - sx * this.border.XRight;
            rectbuf[3].y = rect.Y + rect.Height - sy * this.border.YBottom;
            rectbuf[3].u = this.uv.U2;
            rectbuf[3].v = this.uv.V2;
            rectbuf[3].r = _color.R
            rectbuf[3].g = _color.G
            rectbuf[3].b = _color.B
            rectbuf[3].a = _color.A
            rectbuf[3].palx = palu;
            rectbuf[3].paly = palv;
            rectbuf[3].eff = this.effect;
            batcher.DrawQuads(this.tex, null, this.texpal, rectbuf, 1);
        }
        RenderRect2(batcher: IBatcher, x1: number, y1: number, x2: number, y2: number, color: Color | null = null, palindex: number = -1) {
            let rectbuf = Sprite._rectbuf
            while (rectbuf.length < 4) {
                rectbuf.push(new tt.DrawPoint());
            }
            if (Sprite._colorbuf == null) {
                Sprite._colorbuf = Color.White;
            }
            let _color = color == null ? Sprite._colorbuf : color;

            let palu = 0;
            let palv = 0;
            if (palindex >= 0) {
                palu = this.paluvs[palindex].X;
                palv = this.paluvs[palindex].Y;
            }
            let sx = (x2 - x1) / this.totalWidth;
            let sy = (y2 - y1) / this.totalHeight;
            rectbuf[0].x = x1 + sx * this.border.XLeft;
            rectbuf[0].y = y1 + sy * this.border.YTop;
            rectbuf[0].u = this.uv.U1;
            rectbuf[0].v = this.uv.V1;
            rectbuf[0].r = _color.R;
            rectbuf[0].g = _color.G;
            rectbuf[0].b = _color.B;
            rectbuf[0].a = _color.A;
            rectbuf[0].palx = palu;
            rectbuf[0].paly = palv;
            rectbuf[0].eff = this.effect

            rectbuf[1].x = x2 - sx * this.border.XRight;
            rectbuf[1].y = y1 + sy * this.border.YTop;
            rectbuf[1].u = this.uv.U2;
            rectbuf[1].v = this.uv.V1;
            rectbuf[1].r = _color.R
            rectbuf[1].g = _color.G
            rectbuf[1].b = _color.B
            rectbuf[1].a = _color.A
            rectbuf[1].palx = palu;
            rectbuf[1].paly = palv;
            rectbuf[1].eff = this.effect;

            rectbuf[2].x = x1 + sx * this.border.XLeft;
            rectbuf[2].y = y2 - sy * this.border.YBottom;
            rectbuf[2].u = this.uv.U1;
            rectbuf[2].v = this.uv.V2;
            rectbuf[2].r = _color.R
            rectbuf[2].g = _color.G
            rectbuf[2].b = _color.B
            rectbuf[2].a = _color.A
            rectbuf[2].palx = palu;
            rectbuf[2].paly = palv;
            rectbuf[2].eff = this.effect;

            rectbuf[3].x = x2 - sx * this.border.XRight;
            rectbuf[3].y = y2 - sy * this.border.YBottom;
            rectbuf[3].u = this.uv.U2;
            rectbuf[3].v = this.uv.V2;
            rectbuf[3].r = _color.R
            rectbuf[3].g = _color.G
            rectbuf[3].b = _color.B
            rectbuf[3].a = _color.A
            rectbuf[3].palx = palu;
            rectbuf[3].paly = palv;
            rectbuf[3].eff = this.effect;
            batcher.DrawQuads(this.tex, null, this.texpal, rectbuf, 1);
        }
        Render(batcher: IBatcher, pos: Vector2, scale: Vector2, color: Color | null = null, palindex: number = -1): void {
            let rectbuf = Sprite._rectbuf
            while (rectbuf.length < 4) {
                rectbuf.push(new tt.DrawPoint());
            }
            if (Sprite._colorbuf == null) {
                Sprite._colorbuf = Color.White;
            }
            let _color = color == null ? Sprite._colorbuf : color;

            let palu = 0;
            let palv = 0;
            if (palindex >= 0) {
                palu = this.paluvs[palindex].X;
                palv = this.paluvs[palindex].Y;
            }


            //  let rect = new Rectangle(x, y, s.totalWidth * scale.X, s.totalHeight * scale.Y);
            //   rectbuf[0].x = rect.X + sx * this.border.XLeft;
            //   rectbuf[0].y = rect.Y + sy * this.border.YTop;
            // rectbuf[1].x = rect.X + rect.Width - sx * this.border.XRight;
            // rectbuf[1].y = rect.Y + sy * this.border.YTop;
            rectbuf[0].x = pos.X + scale.X * this.border.XLeft;
            rectbuf[0].y = pos.Y + scale.Y * this.border.YTop;
            rectbuf[0].u = this.uv.U1;
            rectbuf[0].v = this.uv.V1;
            rectbuf[0].r = _color.R;
            rectbuf[0].g = _color.G;
            rectbuf[0].b = _color.B;
            rectbuf[0].a = _color.A;
            rectbuf[0].palx = palu;
            rectbuf[0].paly = palv;
            rectbuf[0].eff = this.effect

            //(this.totalWidth - this.border.XRight) * scale.X;
            rectbuf[1].x = pos.X + scale.X * (this.totalWidth - this.border.XRight);
            rectbuf[1].y = pos.Y + scale.Y * this.border.YTop;
            rectbuf[1].u = this.uv.U2;
            rectbuf[1].v = this.uv.V1;
            rectbuf[1].r = _color.R
            rectbuf[1].g = _color.G
            rectbuf[1].b = _color.B
            rectbuf[1].a = _color.A
            rectbuf[1].palx = palu;
            rectbuf[1].paly = palv;
            rectbuf[1].eff = this.effect;

            rectbuf[2].x = pos.X + scale.X * this.border.XLeft;
            rectbuf[2].y = pos.Y + scale.Y * (this.totalHeight - this.border.YBottom);
            rectbuf[2].u = this.uv.U1;
            rectbuf[2].v = this.uv.V2;
            rectbuf[2].r = _color.R
            rectbuf[2].g = _color.G
            rectbuf[2].b = _color.B
            rectbuf[2].a = _color.A
            rectbuf[2].palx = palu;
            rectbuf[2].paly = palv;
            rectbuf[2].eff = this.effect;

            rectbuf[3].x = pos.X + scale.X * (this.totalWidth - this.border.XRight);
            rectbuf[3].y = pos.Y + scale.Y * (this.totalHeight - this.border.YBottom);
            rectbuf[3].u = this.uv.U2;
            rectbuf[3].v = this.uv.V2;
            rectbuf[3].r = _color.R
            rectbuf[3].g = _color.G
            rectbuf[3].b = _color.B
            rectbuf[3].a = _color.A
            rectbuf[3].palx = palu;
            rectbuf[3].paly = palv;
            rectbuf[3].eff = this.effect;
            batcher.DrawQuads(this.tex, null, this.texpal, rectbuf, 1);
        }
        RenderWithRotate(batcher: IBatcher, pos: Vector2, scale: Vector2, rotate: number, rotate_povit_x: number, rotate_povit_y: number, color: Color | null = null, palindex: number = -1): void {
            let rectbuf = Sprite._rectbuf
            while (rectbuf.length < 4) {
                rectbuf.push(new tt.DrawPoint());
            }
            if (Sprite._colorbuf == null) {
                Sprite._colorbuf = Color.White;
            }
            let _color = color == null ? Sprite._colorbuf : color;

            let palu = 0;
            let palv = 0;
            if (palindex >= 0) {
                palu = this.paluvs[palindex].X;
                palv = this.paluvs[palindex].Y;
            }
            let x1 = pos.X + scale.X * this.border.XLeft;
            let x2 = pos.X + scale.X * (this.totalWidth - this.border.XRight);
            let y1 = pos.Y + scale.Y * this.border.YTop;
            let y2 = pos.Y + scale.Y * (this.totalHeight - this.border.YBottom);

            //旋转逻辑
            let cx = pos.X + rotate_povit_x * scale.X;
            let cy = pos.Y + rotate_povit_y * scale.Y;//中心点
            let dx1 = x1 - cx;//偏移
            let dy1 = y1 - cy;
            let dx2 = x2 - cx;
            let dy2 = y2 - cy;
            //矩阵变换
            let sinr = Math.sin(rotate);
            let cosr = Math.cos(rotate);
            let p0x = cx + dx1 * cosr - dy1 * sinr;
            let p0y = cy + dx1 * sinr + dy1 * cosr;
            let p1x = cx + dx2 * cosr - dy1 * sinr;
            let p1y = cy + dx2 * sinr + dy1 * cosr;
            let p2x = cx + dx1 * cosr - dy2 * sinr;
            let p2y = cy + dx1 * sinr + dy2 * cosr;
            let p3x = cx + dx2 * cosr - dy2 * sinr;
            let p3y = cy + dx2 * sinr + dy2 * cosr;


            rectbuf[0].x = p0x;
            rectbuf[0].y = p0y;
            rectbuf[0].u = this.uv.U1;
            rectbuf[0].v = this.uv.V1;
            rectbuf[0].r = _color.R;
            rectbuf[0].g = _color.G;
            rectbuf[0].b = _color.B;
            rectbuf[0].a = _color.A;
            rectbuf[0].palx = palu;
            rectbuf[0].paly = palv;
            rectbuf[0].eff = this.effect

            //(this.totalWidth - this.border.XRight) * scale.X;
            rectbuf[1].x = p1x;
            rectbuf[1].y = p1y;
            rectbuf[1].u = this.uv.U2;
            rectbuf[1].v = this.uv.V1;
            rectbuf[1].r = _color.R
            rectbuf[1].g = _color.G
            rectbuf[1].b = _color.B
            rectbuf[1].a = _color.A
            rectbuf[1].palx = palu;
            rectbuf[1].paly = palv;
            rectbuf[1].eff = this.effect;

            rectbuf[2].x = p2x;
            rectbuf[2].y = p2y;
            rectbuf[2].u = this.uv.U1;
            rectbuf[2].v = this.uv.V2;
            rectbuf[2].r = _color.R
            rectbuf[2].g = _color.G
            rectbuf[2].b = _color.B
            rectbuf[2].a = _color.A
            rectbuf[2].palx = palu;
            rectbuf[2].paly = palv;
            rectbuf[2].eff = this.effect;

            rectbuf[3].x = p3x;
            rectbuf[3].y = p3y;
            rectbuf[3].u = this.uv.U2;
            rectbuf[3].v = this.uv.V2;
            rectbuf[3].r = _color.R
            rectbuf[3].g = _color.G
            rectbuf[3].b = _color.B
            rectbuf[3].a = _color.A
            rectbuf[3].palx = palu;
            rectbuf[3].paly = palv;
            rectbuf[3].eff = this.effect;
            batcher.DrawQuads(this.tex, null, this.texpal, rectbuf, 1);
        }
    }
    //#endregion

    //#region  Atalas
    export class Atlas {
        allsprite: tt.Sprite[] = [];
        mapsprite: { [id: string]: number } = {};
        tex: tt.ITexture;
        ParseJson(json: any, ignoreCase: boolean = true): void {
            let ss = json["sprites"] as [];
            let texsize = (json["texsize"] as string).split(",");
            let w = parseInt(texsize[0]);
            let h = parseInt(texsize[1]);
            for (var i = 0; i < ss.length; i++) {
                let s = new tt.Sprite(this.tex, null);
                let name = ss[i]["name"] as string;;
                if (ignoreCase) {
                    name = name.toLowerCase();
                }
                let border = (ss[i]["border"] as string).split(",");
                let uv = (ss[i]["uv"] as string).split(",");
                //let pivot = (ss[i]["pivot"] as string).split(",");

                this.mapsprite[name] = this.allsprite.length;
                this.allsprite.push(s);


                s.border.XLeft = parseInt(border[0]);
                s.border.YTop = parseInt(border[1]);
                s.border.XRight = parseInt(border[2]);
                s.border.YBottom = parseInt(border[3]);

                let ux = parseInt(uv[0])
                let uy = parseInt(uv[1])
                s.pixelwidth = parseInt(uv[2])
                s.pixelheight = parseInt(uv[3])

                s.uv.U1 = (ux - 0.01) / w;
                s.uv.V1 = (uy - 0.01) / h;
                s.uv.U2 = (ux + s.pixelwidth - 0.01) / w;
                s.uv.V2 = (uy + s.pixelheight - 0.01) / h;




            }
        }

        GetSprite(name: string): tt.Sprite {
            return this.allsprite[this.mapsprite[name]];
        }
    }

    //#endregion

    //#region  texturepool

    class FillTexture {
        constructor(size: number = 2048, gray: boolean) {
            this.tex = tt.graphic.CreateDynamicTexture(size, size, gray ? TextureFormat.R8 : TextureFormat.RGBA32);

            this.fillX = 0;
            this.fillY = 0;
            this.lineHeight = 0;
            this._dirty = false;
        }
        tex: ITexture;
        fillX: number;
        fillY: number;
        lineHeight: number;
        private _dirty: boolean;
        HaveSpace(width: number, height: number): boolean {
            if (width > this.tex.getWidth() || height > this.tex.getHeight())
                return false;


            if (this.fillX + width > this.tex.getWidth()) {//need new line
                return (this.fillY + this.lineHeight + height <= this.tex.getHeight());
            }
            else {
                return (this.fillY + height <= this.tex.getHeight());
            }
        }
        AddSprite_ByFontItem(fontitem: TTFontItem, paltex: ITexture): Sprite {
            if (this.HaveSpace(fontitem.width, fontitem.height) == false)
                throw new Error("no space.");

            let u1 = this.fillX;
            let v1 = this.fillY;

            if (this.fillX + fontitem.width > this.tex.getWidth()) {//need new line
                u1 = 0;
                this.fillX = fontitem.width;
                this.fillY += this.lineHeight;
                v1 = this.fillY;
                this.lineHeight = fontitem.height;
            }
            else {
                this.fillX += fontitem.width;
                if (this.lineHeight < fontitem.height)
                    this.lineHeight = fontitem.height;
            }
            this.tex.UploadTexture(u1, v1, fontitem.width, fontitem.height, fontitem.graydata);
            //this.tex.ApplyTexture(false);
            let s = new Sprite(this.tex, paltex);
            s.tex = this.tex;

            s.effect = RenderEffect.GrayAsAlpha;

            u1 -= 0.01;
            v1 -= 0.01;
            let u2 = u1 + fontitem.width - 0.01;
            let v2 = v1 + fontitem.height - 0.01;
            s.uv = new UVRect(u1 / this.tex.getWidth(), v1 / this.tex.getHeight(), u2 / this.tex.getWidth(), v2 / this.tex.getHeight());
            s.pixelwidth = fontitem.width;
            s.pixelheight = fontitem.height;
            s.border.XLeft = fontitem.emptyX;

            s.border.XRight = fontitem.advanceX - fontitem.emptyX - fontitem.width;
            s.border.YTop = fontitem.emptyY;
            s.border.YBottom = 0;
            if (s.border.XLeft < 0) s.border.XLeft = 0;
            if (s.border.XRight < 0) s.border.XRight = 0;
            if (s.border.YTop < 0) s.border.YTop = 0;
            this._dirty = true;
            return s;
        }
        AddSprite_ByImg(img: TTImgData, paltex: ITexture): Sprite {
            if (this.HaveSpace(img.width, img.height) == false)
                throw new Error("no space.");
            if (img.data == null)
                throw new Error("error img.");

            let u1 = this.fillX;
            let v1 = this.fillY;

            if (this.fillX + img.width > this.tex.getWidth()) {//need new line
                u1 = 0;
                this.fillX = img.width;
                this.fillY += this.lineHeight;
                v1 = this.fillY;
                this.lineHeight = img.height;
            }
            else {
                this.fillX += img.width;
                if (this.lineHeight < img.height)
                    this.lineHeight = img.height;
            }
            this.tex.UploadTexture(u1, v1, img.width, img.height, img.data);
            //this.tex.ApplyTexture(false);
            let s = new Sprite(this.tex, paltex);
            s.tex = this.tex;

            if (img.format == TTIMGFormat.RGBA)
                throw new Error("no way.");
            if (img.format == TTIMGFormat.PAL8)
                s.effect = RenderEffect.PAL8;
            if (img.format == TTIMGFormat.P5A3)
                s.effect = RenderEffect.P5A3;
            if (img.format == TTIMGFormat.GRAY)
                s.effect = RenderEffect.Gray;

            let u2 = u1 + img.width;
            let v2 = v1 + img.height;
            s.uv = new UVRect(u1 / this.tex.getWidth(), v1 / this.tex.getHeight(), u2 / this.tex.getWidth(), v2 / this.tex.getHeight());
            s.pixelwidth = img.width;
            s.pixelheight = img.height;

            this._dirty = true;
            return s;
        }
        Apply(): void {
            if (this._dirty) {
                this.tex.ApplyTexture(false);
                this._dirty = false;
            }
        }
    }
    class PalLine {
        col: number[] = [];
    }
    export class Texture8Pool {

        constructor(texsize: number = 2048) {
            this.texs = [];
            this._size = texsize;
            this.texs.push(new FillTexture(texsize, true));
            this._paltexture = tt.graphic.CreateDynamicTexture(256, 256, TextureFormat.RGBA32);
            this._palline = [];
            this._allpals = [];
            this._allpaluvs = [];
        }
        _size: number;
        texs: FillTexture[]
        _paltexture: ITexture;
        _palline: PalLine[];
        _allpals: PalData[];
        _allpaluvs: Vector2[];
        get PaletteTexture(): ITexture {
            return this._paltexture;
        }
        ApplyLast(): void {
            let last = this.texs[this.texs.length - 1];
            last.Apply();
        }
        ApplyAll(): void {
            for (var i = 0; i < this.texs.length; i++) {
                this.texs[i].Apply();
            }
        }
        AddSprite_ByFontItem(fontitem: TTFontItem): Sprite {
            if (fontitem.width > this._size || fontitem.height > this._size)
                throw new Error("img is too large.");
            let last = this.texs[this.texs.length - 1];
            if (!last.HaveSpace(fontitem.width, fontitem.height)) {
                last.Apply();
                last = new FillTexture(this._size, true);
                this.texs.push(last);
            }
            let sprite = last.AddSprite_ByFontItem(fontitem, this._paltexture);
            return sprite;
        }
        AddSprite_ByImg(img: TTImgData): Sprite {
            if (img.width > this._size || img.height > this._size)
                throw new Error("img is too large.");
            let last = this.texs[this.texs.length - 1];
            if (!last.HaveSpace(img.width, img.height)) {
                last.Apply();
                last = new FillTexture(this._size, true);
                this.texs.push(last);
            }
            let sprite = last.AddSprite_ByImg(img, this._paltexture);

            for (var i = 0; i < img.pals.length; i++) {
                var paluv = this.AddPal(img.pals[i]);
                sprite.paluvs.push(paluv);
            }
            return sprite;
        }
        AddPal(data: PalData): Vector2 {
            for (var i = 0; i < this._allpals.length; i++) {
                if (this._allpals[i].TryMerge(data)) {
                    return this._allpaluvs[i].Clone();
                }
            }

            let y = 0;
            let x = 0;

            if (data.color32) {
                for (y = 0; y < this._palline.length; y++) {
                    let line = this._palline[y];
                    let right = line.col[line.col.length - 1];
                    if (256 - right >= 32) {
                        x = right + 32
                        break;
                    }
                }
            }
            if (y >= 256) {
                throw new Error("no free pal pos.");
            }
            this._paltexture.UploadTexture(x, y, data.color32 ? 32 : 256, 1, data.paldata);
            this._paltexture.ApplyTexture(false);

            this._allpals.push(data.Clone());
            this._allpaluvs.push(new Vector2(x, y));

            return new Vector2(x, y);
        }
    }
    //#endregion

    //#region  font
    export class Font {
        private _pool: Texture8Pool
        private _fontdata: TTFontData
        private _mapSprites: { [id: number]: Sprite } = {}
        constructor(packer: Texture8Pool, fontdata: TTFontData) {
            this._pool = packer;
            this._fontdata = fontdata;
        }
        GetFontSize(): number {
            return this._fontdata.header.fontSize;
        }
        GetCharSprite(charCode: number): Sprite | null {
            let ss = this._mapSprites[charCode];
            if (ss != undefined)
                return ss;
            let fitem = this._fontdata.fontitems[charCode];
            if (fitem == undefined)
                return null;

            var s = this._pool.AddSprite_ByFontItem(fitem);
            this._mapSprites[charCode] = s;
            return s
        }
        SureText(text: string, scale: number = 1.0): number {
            let w = 0;
            for (var i = 0; i < text.length; i++) {
                let s = this.GetCharSprite(text.charCodeAt(i));
                if (s == null) {
                    w += this._fontdata.header.fontSize / 2 * scale;
                } else {
                    w += s.totalWidth * scale;
                }

            }
            this._pool.ApplyAll();
            return w;
        }
        RenderText(bathcer: IBatcher, text: string, pos: Vector2, scale: Vector2, color: Color): void {
            //tt.platform.Log("==render"+text);
            let xadd = 0;
            for (var i = 0; i < text.length; i++) {
                let s = this.GetCharSprite(text.charCodeAt(i));
                if (s != null) {
                    //let rect = new Rectangle(pos.X + xadd, pos.Y, s.totalWidth * scale.X, s.totalHeight * scale.Y);
                    //s.RenderRect(bathcer, rect, color)
                    s.Render(bathcer, new Vector2(pos.X + xadd, pos.Y), scale, color);
                    xadd += (s.totalWidth * scale.X);
                }
                else {
                    xadd += this._fontdata.header.fontSize / 2 * scale.X;
                }
            }
        }
        RenderTextWithLimit(bathcer: IBatcher, text: string, pos: Vector2, scale: Vector2, color: Color, limitRect: Rectangle): void {
            let xadd = 0;
            for (var i = 0; i < text.length; i++) {
                let s = this.GetCharSprite(text.charCodeAt(i));
                if (s != null) {
                    let rect = new Rectangle(pos.X + xadd, pos.Y, s.totalWidth * scale.X, s.totalHeight * scale.Y);
                    s.RenderRectWithLimit(bathcer, rect, limitRect, color)

                    //s.Render(bathcer, new Vector2(pos.X + xadd, pos.Y), scale, color);
                    xadd += (s.totalWidth * scale.X);
                }
                else {
                    xadd += this._fontdata.header.fontSize / 2 * scale.X;
                }
            }
        }
    }
    //#endregion

    //#region  Audio
    export interface IBGM {
        url: string;
        setLoop(loop: boolean): void;
        getLoop(): boolean;
        loaded: boolean;
        onEnd: ((bgm: IBGM) => void) | null;
    }
    export interface ISound {
        loaded: boolean;
        onEnd: ((sound: ISound) => void) | null
    }
    export interface IChannel {
        setVolume(v: number): void
        getVolume(): number;

        SetBGM(bgm: IBGM | null): void; //直接播放,BGM只有一个

        PlaySound(sound: ISound): void; //Sound播放一次，短小
    }
    export interface IAudio {
        GetChannel(id: number): IChannel
        CreateBGM(url: string): IBGM;
        CreateSound(url: string): ISound;
        CreateSoundFromArrayBuffer(array: ArrayBuffer): ISound;
        ReInit(): void;//在一些平台上Audio必须在onclick事件中初始化，留下这个接口
    }

    //#endregion
}