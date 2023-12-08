import { tt } from "../../ttapi_interface/ttapi.js";

import * as impl_t from "./texture.js";
export namespace tt_impl {
  export class RenderTarget implements tt.IRenderTarget {

    constructor(webgl: WebGL2RenderingContext, width: number, height: number, format: tt.TextureFormat) {
      this._webgl = webgl;
      this._format = format;
      this._fbo = webgl.createFramebuffer();
      this._id = impl_t.tt_impl.Texture.texid;
      this._width = width;
      this._height = height;
      this.ClearColor = tt.Color.Black;



      this._texobj = webgl.createTexture();
      webgl.bindTexture(webgl.TEXTURE_2D, this._texobj);
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
      webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_S, this._webgl.CLAMP_TO_EDGE);
      webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_T, this._webgl.CLAMP_TO_EDGE);
      var formatGL = format == tt.TextureFormat.RGBA32 ? this._webgl.RGBA : this._webgl.LUMINANCE;
      webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, width, height, 0, formatGL, webgl.UNSIGNED_BYTE, null);

      webgl.bindFramebuffer(webgl.FRAMEBUFFER, this._fbo);
      webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D,
        this._texobj, 0);

      webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
    }

    Resize(width: number, height: number): void {
      let webgl = this._webgl;

      this.Destory();
      // webgl.bindFramebuffer(webgl.FRAMEBUFFER, this._fbo);
      // webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D,
      //   null, 0);
      // webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);

      //console.log("reset rt.");

      this._width = width;
      this._height = height;

      webgl.deleteTexture(this._texobj);
      
      this._texobj = webgl.createTexture();
      webgl.bindTexture(webgl.TEXTURE_2D, this._texobj);
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
      webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
      webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_S, this._webgl.CLAMP_TO_EDGE);
      webgl.texParameteri(this._webgl.TEXTURE_2D, this._webgl.TEXTURE_WRAP_T, this._webgl.CLAMP_TO_EDGE);
      var formatGL = this._format == tt.TextureFormat.RGBA32 ? this._webgl.RGBA : this._webgl.LUMINANCE;
      webgl.texImage2D(webgl.TEXTURE_2D, 0, formatGL, width, height, 0, formatGL, webgl.UNSIGNED_BYTE, null);


      this._fbo = webgl.createFramebuffer();
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, this._fbo);
      webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D,
        this._texobj, 0);

      webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
      //console.log("reset rt.");
    }
    _webgl: WebGLRenderingContext
    _format: tt.TextureFormat
    _fbo: WebGLFramebuffer | null;
    _texobj: WebGLTexture | null;
    _id: number;
    _width: number;
    _height: number;

    ClearColor: tt.Color;
    IsMainOutput(): boolean {
      return false;
    }
    Begin(): void {
      this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, this._fbo);
      this._webgl.viewport(0, 0, this._width, this._height);
      this._webgl.clearColor(this.ClearColor.R, this.ClearColor.G, this.ClearColor.B, this.ClearColor.A);
      this._webgl.clear(this._webgl.COLOR_BUFFER_BIT);
      this.ResetLimitRect();
    }
    End(): void {

      this._webgl.flush();
      this._webgl.bindFramebuffer(this._webgl.FRAMEBUFFER, null);
    }
    getID(): number {
      return this._id;
    }
    getFormat(): tt.TextureFormat {
      return this._format;
    }
    getWidth(): number {
      return this._width;
    }
    getHeight(): number {
      return this._height;
    }
    getData(): Uint8Array {
      throw new Error("not support.");
    }
    IsStatic(): boolean {
      return true;
    }
    IsTarget(): boolean {
      return true;
    }
    UploadTexture(x: number, y: number, w: number, h: number, data: Uint8Array | Uint8ClampedArray): void {
      throw new Error("Method not implemented.");
    }
    ApplyTexture(TurnToStatic: boolean): void {
      throw new Error("Method not implemented.");
    }
    Destory(): void {
      if (this._fbo != null)
        this._webgl.deleteFramebuffer(this._fbo);
      if (this._texobj != null)
        this._webgl.deleteTexture(this._texobj);
      this._fbo = null;
      this._texobj = null;
    }

    rectLimit: tt.Rectangle[] = []
    PushLimitRect(rect: tt.Rectangle): void {
      let newrect = null;
      if (this.rectLimit.length == 0)
        newrect = tt.RectangleMath.Clone(rect)

      else {
        let r = this.rectLimit[this.rectLimit.length - 1];
        newrect = tt.RectangleMath.Intersect(r, rect);
      }

      this.rectLimit.push(newrect);
      this.ResetLimitRect();
    }
    PopLimitRect() {
      this.rectLimit.splice(this.rectLimit.length - 1, 1);
      this.ResetLimitRect();
    }
    ClearLimitRect(): void {
      this.rectLimit.splice(0, this.rectLimit.length);
      this.ResetLimitRect();
    }
    ResetLimitRect() {
      if (this.rectLimit.length == 0) {
        this._webgl.disable(this._webgl.SCISSOR_TEST);
        //this._webgl.scissor(0, 0, this.getWidth(), this.getHeight());
      }
      else {
        let rect = this.rectLimit[this.rectLimit.length - 1];
        this._webgl.enable(this._webgl.SCISSOR_TEST);
        this._webgl.scissor(rect.X, rect.Y, rect.Width, rect.Height);
      }
    }
  }
}