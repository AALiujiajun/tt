import { tt } from "../../ttapi_interface/ttapi.js";

import * as impl_m from "./mainscreen.js"
import * as impl_s from "./shader/shaders.js";
import * as impl_ss from "./shader/shaderress.js";
import * as impl_t from "./texture.js"
import * as impl_r from "./rendertarget.js"
import * as impl_b from "./render_batcher.js"
export namespace tt_impl {
    class ReadPixelTask {
        constructor(target: tt.IRenderTarget, onReadBack: (format: tt.TextureFormat, w: number, h: number, byte: Uint8Array | Uint8ClampedArray) => void) {
            this.target = target;
            this.onReadBack = onReadBack;
        }
        target: tt.IRenderTarget;
        onReadBack: (format: tt.TextureFormat, w: number, h: number, byte: Uint8Array | Uint8ClampedArray) => void
    }

    export class ttimpl_graphics implements tt.IGraphic {
        _webgl: WebGL2RenderingContext;
        public constructor(webgl: WebGL2RenderingContext) {
            this._webgl = webgl;
            this._mainscreen = new impl_m.tt_impl.MainScreen(webgl)



            let data = new Uint8Array(64);
            for (let i = 0; i < 64; i++)
                data[i] = 255;
            this._whitetexture = new impl_t.tt_impl.Texture(webgl, 4, 4, tt.TextureFormat.RGBA32, data, true, false);
            impl_ss.tt_impl.Shaders.InitShader(this._webgl);

            //let info = wx.getSystemInfoSync();

            //pc 平台这几个值不是稳定的
            // this._pixelRadio = window.devicePixelRatio;
            // let c = this._webgl.canvas as HTMLCanvasElement;
            // this._pixelWidth = c.clientWidth;
            // this._pixelHeight = c.clientHeight;
        }
        // _pixelRadio: number;
        // _pixelWidth: number;
        // _pixelHeight: number;
        _mainscreen: impl_m.tt_impl.MainScreen;
        getMainScreen(): tt.IRenderTarget {
            return this._mainscreen;
        }
        _whitetexture: tt.ITexture;
        getWhiteTexture(): tt.ITexture {
            return this._whitetexture;
        }
        IsSupportUploadImg(): boolean {
            return true;
        }
        CreateStaticTextureFromImage(format: tt.TextureFormat, src: TexImageSource): tt.ITexture {
            let w = (src as any).width;
            let h = (src as any).height;
            var t = new impl_t.tt_impl.Texture(this._webgl, w, h, format, null, true, true);
            t.UploadImg(src);
            return t;
        }
        CreateStaticTexture(w: number, h: number, format: tt.TextureFormat, data: Uint8Array | Uint8ClampedArray): tt.ITexture {
            return new impl_t.tt_impl.Texture(this._webgl, w, h, format, data, true, false);
        }
        CreateDynamicTexture(w: number, h: number, format: tt.TextureFormat): tt.ITexture {
            return new impl_t.tt_impl.Texture(this._webgl, w, h, format, null, false, false);
        }
        CreateRenderTarget(w: number, h: number, format: tt.TextureFormat): tt.IRenderTarget {
            return new impl_r.tt_impl.RenderTarget(this._webgl, w, h, format);
        }
        _OnUpdateTask() {
            if (this._tasks.length > 0) {
                let task = this._tasks.pop();
                if (task == null)
                    return;
                if (task.target.IsMainOutput()) {
                    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, null);
                }
                else {
                    this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, (task.target as impl_r.tt_impl.RenderTarget)._fbo);
                }
                task.target.Begin();
                var formatGL = task.target.getFormat() == tt.TextureFormat.RGBA32 ? this._webgl.RGBA : this._webgl.LUMINANCE;
                let bitsize = task.target.getFormat() == tt.TextureFormat.RGBA32 ? 4 : 1;
                let buf = new Uint8Array(task.target.getWidth() * task.target.getHeight() * bitsize);
                this._webgl.readPixels(0, 0, task.target.getWidth(), task.target.getHeight(), formatGL, this._webgl.UNSIGNED_BYTE, buf);
                task.onReadBack(task.target.getFormat(), task.target.getWidth(), task.target.getHeight(), buf);
            }
        }

        _tasks: ReadPixelTask[] = [];
        ReadRenderTarget(target: tt.IRenderTarget, onReadBack: (format: tt.TextureFormat, w: number, h: number, byte: Uint8Array | Uint8ClampedArray) => void): void {
            this._tasks.push(new ReadPixelTask(target, onReadBack));
        }
        CreateRenderer_Batcher(): tt.IBatcher {
            return new impl_b.tt_impl.Render_Batcher(this._webgl);
        }
        _MainScreenScale: number = 1.0;
        getMainScreenScale(): number {
            return this._MainScreenScale;
        }
        setMainScreenScale(v: number) {
            this._MainScreenScale = v;
            this.UpdateScreenSize();
        }
        UpdateScreenSize(): void {
            let canvas = this._webgl.canvas;
            var wantwidth = (tt.graphic.getDeviceScreenWidth() * tt.graphic.getFinalScale()) | 0;
            var wantheight = (tt.graphic.getDeviceScreenHeight() * tt.graphic.getFinalScale()) | 0;

            if (canvas.width != wantwidth || canvas.height != wantheight) {
                //console.log("radio = " + radio + " ,screenwidth=" + sw + " ,windowwidth=" + ww +",ms="+ms);
                console.log("--resize wantwidth = " + wantwidth + " ,wantheight=" + wantheight);
                canvas.width = wantwidth;
                canvas.height = wantheight;
                if (tt.graphic.OnResize != null)
                    tt.graphic.OnResize(canvas.width, canvas.height);
            }
        }

        getDeviceScreenWidth(): number {
            let c = this._webgl.canvas as HTMLCanvasElement;
            return c.clientWidth;
            //return  this._pixelWidth
        }
        getDeviceScreenHeight(): number {
            let c = this._webgl.canvas as HTMLCanvasElement;
            return c.clientHeight;
            //return this._pixelHeight;
        }
        getDevicePixelRadio(): number {
            return  window.devicePixelRatio;
            //return this._pixelRadio;
        }

        getFinalScale(): number {
            return this.getDevicePixelRadio() / this._MainScreenScale;
        }
        OnUpdate: ((delta: number) => void) | null = null;
        OnResize: ((width: number, height: number) => void) | null = null;
        OnRender: (() => void) | null = null;

        
    }

}