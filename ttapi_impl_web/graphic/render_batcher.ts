import { tt } from "../../ttapi_interface/ttapi.js";
import * as impl_s from "./shader/shaders.js";
export namespace tt_impl {

  export class Render_Batcher implements tt.IBatcher {
    constructor(webgl: WebGL2RenderingContext) {
      this._webgl = webgl;
      this._target = null;
      this._lastshader = null;
      var _vbo = webgl.createBuffer();
      this._buffer = new Uint8Array(65536 * 28);
      this._bufferView = new DataView(this._buffer.buffer, 0, this._buffer.length);
      this._pointseek = 0;
      this._lastMode = webgl.TRIANGLES;
      if (_vbo != null) {
        this._vbo = _vbo;
      }
      else {
        throw new Error("error vbo.");
      }
      var _vao = webgl.createVertexArray();
      if (_vao != null) {
        this._vao = _vao;
      }
      else {
        throw new Error("error vao.");
      }
      {//初始化 vao
        webgl.bindVertexArray(_vao);
        webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vbo);
        //if (shader.attrIndexPos >= 0) {
        webgl.enableVertexAttribArray(0);
        //36 是数据步长(字节)，就是数据结构的长度
        //0 是数据偏移（字节）
        webgl.vertexAttribPointer(0, 3, webgl.FLOAT, false, 28, 0);
        //}

        //if (shader.attrIndexColor >= 0) {
        webgl.enableVertexAttribArray(1);
        webgl.vertexAttribPointer(1, 4, webgl.UNSIGNED_BYTE, true, 28, 12);
        //}
        //if (shader.attrIndexUV >= 0) {
        webgl.enableVertexAttribArray(2);
        webgl.vertexAttribPointer(2, 2, webgl.FLOAT, false, 28, 16);
        //}

        //if (shader.attrIndexExt >= 0) {
        webgl.enableVertexAttribArray(3);
        webgl.vertexAttribPointer(3, 4, webgl.UNSIGNED_BYTE, false, 28, 24);
        //}
        webgl.bindVertexArray(null);
      }
      this.LookAt = new tt.Vector2(0, 0);
      this.Scale = 1.0;
      this._lastTex = null;
      this._lastTex2 = null;
      this._lastTexPal = null;
      var shader = impl_s.tt_impl.Shaders.GetShaderProgram("default");
      if (shader == null)
        throw new Error("error load shader.");
      this._shader = shader
      this._modelMatrix = new Float32Array(16);
      this._viewMatrix = new Float32Array(16);
      this._projMatrix = new Float32Array(16);

    }
    _shader: impl_s.tt_impl.Shaders.ShaderProgram;
    _webgl: WebGL2RenderingContext
    _target: tt.IRenderTarget | null;
    _lastshader: impl_s.tt_impl.Shaders.ShaderProgram | null;
    _lastMode: number;
    _lastTex: tt.ITexture | null;
    _lastTex2: tt.ITexture | null;
    _lastTexPal: tt.ITexture | null;
    _vbo: WebGLBuffer;
    _vao: WebGLVertexArrayObject;
    _buffer: Uint8Array;
    _bufferView: DataView;
    _pointseek: number;
    _modelMatrix: Float32Array;
    _viewMatrix: Float32Array;
    _projMatrix: Float32Array;
    DrawQuads(tex: tt.ITexture, tex2: tt.ITexture | null, texpal: tt.ITexture | null, quads: tt.DrawPoint[], quadCount: number): void {
      if (this._target == null)
        throw new Error("Render_Batcher Not in Begin-End.");

      if (this._lastMode != this._webgl.TRIANGLES || this._lastTex != tex || this._lastTex2 != tex2
        || this._lastTexPal != texpal
        || this._pointseek + quadCount * 6 >= 65536) {
        this._Render();


        this._ApplySingle(tex, tex2, texpal);
      }
      this._lastMode = this._webgl.TRIANGLES

      for (var i = 0; i < quadCount; i++) {
        this._AddBuf(quads[i * 4 + 0]);
        this._AddBuf(quads[i * 4 + 1]);
        this._AddBuf(quads[i * 4 + 2]);
        this._AddBuf(quads[i * 4 + 2]);
        this._AddBuf(quads[i * 4 + 1]);
        this._AddBuf(quads[i * 4 + 3]);
      }

    }
    DrawTris(tex: tt.ITexture, tex2: tt.ITexture | null, texpal: tt.ITexture | null, tris: tt.DrawPoint[], tricount: number): void {
      if (this._target == null)
        throw new Error("Render_Batcher Not in Begin-End.");
      if (this._lastMode != this._webgl.TRIANGLES || this._lastTex != tex || this._lastTex2 != tex2
        || this._lastTexPal != texpal
        || this._pointseek + tricount * 3 > 65536) {
        this._Render();
        this._ApplySingle(tex, tex2, texpal);
      }
      this._lastMode = this._webgl.TRIANGLES

      for (var i = 0; i < tricount; i++) {
        this._AddBuf(tris[i * 3 + 0]);
        this._AddBuf(tris[i * 3 + 1]);
        this._AddBuf(tris[i * 3 + 2]);
      }
    }
    DrawLines(tex: tt.ITexture, tex2: tt.ITexture | null, texpal: tt.ITexture | null, lines: tt.DrawPoint[], linecount: number): void {
      if (this._target == null)
        throw new Error("Render_Batcher Not in Begin-End.");
      if (this._lastMode != this._webgl.LINES || this._lastTex != tex || this._lastTex2 != tex2
        || this._lastTexPal != texpal
        || this._pointseek + linecount * 2 > 65536) {
        this._Render();
        this._ApplySingle(tex, tex2, texpal);
      }
      this._lastMode = this._webgl.LINES

      for (var i = 0; i < linecount; i++) {
        this._AddBuf(lines[i * 2 + 0]);
        this._AddBuf(lines[i * 2 + 1]);
      }
    }
    DrawPoints(tex: tt.ITexture, tex2: tt.ITexture | null, texpal: tt.ITexture | null, points: tt.DrawPoint[], pointcount: number): void {
      if (this._target == null)
        throw new Error("Render_Batcher Not in Begin-End.");
      if (this._lastMode != this._webgl.POINTS || this._lastTex != tex || this._lastTex2 != tex2
        || this._lastTexPal != texpal
        || this._pointseek + pointcount * 1 > 65536) {
        this._Render();
        this._ApplySingle(tex, tex2, texpal);
      }
      this._lastMode = this._webgl.POINTS

      for (var i = 0; i < pointcount; i++) {
        this._AddBuf(points[i]);
      }
    }

    getTarget(): tt.IRenderTarget | null {
      return this._target;
    }
    getName(): string {
      return "Batcher";
    }
    LookAt: tt.Vector2;
    Scale: number;

    ResetMatrix(): void {
      this._Render();
      this._MatDefault(this._modelMatrix);
      this._MatView(this._viewMatrix);
      this._MatProj(this._projMatrix, 0, 0);
    }

    ApplyBatch(): void {
      this._Render();
    }
    BeginDraw(target: tt.IRenderTarget): void {
      this._target = target;

      //update viewmatrix & modelmatrxi projmatrix

      this._MatDefault(this._modelMatrix);
      this._MatView(this._viewMatrix);
      this._MatProj(this._projMatrix, 0, 0);

      let webgl = this._webgl;

      webgl.disable(webgl.CULL_FACE);
      webgl.depthMask(false);//这是zwrite
      webgl.disable(webgl.DEPTH_TEST);//这是ztest

      webgl.enable(webgl.BLEND);
      webgl.blendEquation(webgl.FUNC_ADD);
      webgl.blendFuncSeparate(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA,
        webgl.SRC_ALPHA, webgl.ONE);

    }

    _MatView(matrix: Float32Array) {
      let sx = this.Scale;
      let sy = this.Scale;
      let offx = -this.LookAt.X;
      let offy = -this.LookAt.Y;
      matrix[0] = sx; matrix[4] = 0; matrix[8] = 0; matrix[12] = offx * sx;
      matrix[1] = 0; matrix[5] = sy; matrix[9] = 0; matrix[13] = offy * sy;
      matrix[2] = 0; matrix[6] = 0; matrix[10] = 1; matrix[14] = 0;
      matrix[3] = 0; matrix[7] = 0; matrix[11] = 0; matrix[15] = 1;
    }
    _MatDefault(matrix: Float32Array) {


      matrix[0] = 1; matrix[4] = 0; matrix[8] = 0; matrix[12] = 0;
      matrix[1] = 0; matrix[5] = 1; matrix[9] = 0; matrix[13] = 0;
      matrix[2] = 0; matrix[6] = 0; matrix[10] = 1; matrix[14] = 0;
      matrix[3] = 0; matrix[7] = 0; matrix[11] = 0; matrix[15] = 1;

    }
    _MatProj(matrix: Float32Array, offx: number, offy: number) {
      if (this._target == null)
        throw new Error("error target.");
      let sx = 1.0 * 2 / this._target.getWidth()
      let sy = 1 * 2 / this._target.getHeight()
      if (this._target.getID() == 0)//isMainoutput
        sy *= -1;

      matrix[0] = sx; matrix[4] = 0; matrix[8] = 0; matrix[12] = offx;
      matrix[1] = 0; matrix[5] = sy; matrix[9] = 0; matrix[13] = offy;
      matrix[2] = 0; matrix[6] = 0; matrix[10] = 1; matrix[14] = 0;
      matrix[3] = 0; matrix[7] = 0; matrix[11] = 0; matrix[15] = 1;
    }

    EndDraw(): void {
      this._Render();
      this._target = null;
    }
    _Render(): void {
      if (this._pointseek == 0)
        return;
      let webgl = this._webgl;

      let shader = this._shader;

      webgl.useProgram(shader.program);

      webgl.bindVertexArray(this._vao);
      // webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vbo);
      // //if (shader.attrIndexPos >= 0) {
      // webgl.enableVertexAttribArray(0);
      // //36 是数据步长(字节)，就是数据结构的长度
      // //0 是数据偏移（字节）
      // webgl.vertexAttribPointer(0, 3, webgl.FLOAT, false, 28, 0);
      // //}

      // //if (shader.attrIndexColor >= 0) {
      // webgl.enableVertexAttribArray(1);
      // webgl.vertexAttribPointer(1, 4, webgl.UNSIGNED_BYTE, true, 28, 12);
      // //}
      // //if (shader.attrIndexUV >= 0) {
      // webgl.enableVertexAttribArray(2);
      // webgl.vertexAttribPointer(2, 2, webgl.FLOAT, false, 28, 16);
      // //}

      // //if (shader.attrIndexExt >= 0) {
      // webgl.enableVertexAttribArray(3);
      // webgl.vertexAttribPointer(3, 4, webgl.UNSIGNED_BYTE, false, 28, 24);
      // //}


      if (shader.uniMatModel != null) {
        webgl.uniformMatrix4fv(shader.uniMatModel, false, this._modelMatrix);
      }
      if (shader.uniMatView != null) {
        webgl.uniformMatrix4fv(shader.uniMatView, false, this._viewMatrix);
      }
      if (shader.uniMatProj != null) {
        webgl.uniformMatrix4fv(shader.uniMatProj, false, this._projMatrix);
      }

      if (shader.uniTex != null) {
        webgl.activeTexture(webgl.TEXTURE0);
        let tex = this._GetTexture(this._lastTex);

        webgl.bindTexture(webgl.TEXTURE_2D, tex);
        webgl.uniform1i(shader.uniTex, 0);
      }
      if (shader.uniTex2 != null && this._lastTex2 != null) {
        webgl.activeTexture(webgl.TEXTURE2);
        let tex2 = this._GetTexture(this._lastTex2);

        webgl.bindTexture(webgl.TEXTURE_2D, tex2);
        webgl.uniform1i(shader.uniTex2, 2);
      }
      if (shader.uniTexPal != null && this._lastTexPal != null) {
        webgl.activeTexture(webgl.TEXTURE3);
        let texpal = this._GetTexture(this._lastTexPal);

        webgl.bindTexture(webgl.TEXTURE_2D, texpal);
        webgl.uniform1i(shader.uniTexPal, 3);
      }

      webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vbo);
      webgl.bufferData(webgl.ARRAY_BUFFER, this._buffer, webgl.DYNAMIC_DRAW, 0, this._pointseek * 28);

      //webgl.bindBuffer(webgl.ARRAY_BUFFER, this._vbo);
      webgl.drawArrays(this._lastMode, 0, this._pointseek);
      // if (this._lastMode == webgl.TRIANGLES)
      //     webgl.drawArrays(this._lastMode, 0, this._pointseek / 3);
      // if (this._lastMode == webgl.LINES)
      //     webgl.drawArrays(this._lastMode, 0, this._pointseek / 2);
      // if (this._lastMode == webgl.POINTS)
      //     webgl.drawArrays(this._lastMode, 0, this._pointseek / 1);
      this._pointseek = 0;
    }
    _AddBuf(p: tt.DrawPoint): void {
      this._bufferView.setFloat32(this._pointseek * 28 + 0, p.x, true);
      this._bufferView.setFloat32(this._pointseek * 28 + 4, p.y, true);
      this._bufferView.setFloat32(this._pointseek * 28 + 8, p.z, true);

      this._bufferView.setUint8(this._pointseek * 28 + 12, (p.r * 255) | 0);
      this._bufferView.setUint8(this._pointseek * 28 + 13, (p.g * 255) | 0);
      this._bufferView.setUint8(this._pointseek * 28 + 14, (p.b * 255) | 0);
      this._bufferView.setUint8(this._pointseek * 28 + 15, (p.a * 255) | 0);

      this._bufferView.setFloat32(this._pointseek * 28 + 16, p.u, true);
      this._bufferView.setFloat32(this._pointseek * 28 + 20, p.v, true);

      this._bufferView.setUint8(this._pointseek * 28 + 24, p.palx);
      this._bufferView.setUint8(this._pointseek * 28 + 25, p.paly);
      this._bufferView.setUint8(this._pointseek * 28 + 26, 0);//p.texid); will be auto
      this._bufferView.setUint8(this._pointseek * 28 + 27, p.eff);
      this._pointseek++;
    }
    _GetTexture(tex: tt.ITexture): WebGLTexture {
      if (tex == null)
        return (tt.graphic.getWhiteTexture() as any)._texobj;
      var _tex = (tex as any)._texobj;
      if (_tex == undefined)
        return (tt.graphic.getWhiteTexture() as any)._texobj;
      else
        return _tex as WebGLTexture;
      // if(tex.isTarget)
      // {
      //     return (tes as impl.RenderTarget)._texobj;
      // }
      // else
      // {
      //     return (tex as impl.Texture)._texobj;
      // }
    }
    _ApplySingle(tex: tt.ITexture, tex2: tt.ITexture | null, texpal: tt.ITexture | null): void {
      this._lastTex = tex;
      this._lastTex2 = tex2;
      this._lastTexPal = texpal;
    }

  }
}