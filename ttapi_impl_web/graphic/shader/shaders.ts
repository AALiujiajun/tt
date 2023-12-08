
export namespace tt_impl.Shaders
{

    export enum ShaderType
    {
        VertexShader,
        FragmentShader
    }
    export class ShaderObj
    {
        name: string
        type: ShaderType;
        source: string;
        shader: WebGLShader;
        uniformInfo: { [id: string]: string };
        constructor(type: ShaderType, name: string, source: string, shader: WebGLShader, uniformInfo: { [id: string]: string })
        {
            this.type = type;
            this.name = name;
            this.source = source;
            this.shader = shader;
            this.uniformInfo = uniformInfo;
        }
    }

    var vsp: { [id: string]: ShaderObj } = {};
    var fsp: { [id: string]: ShaderObj } = {};

    export function AddShader(webgl: WebGL2RenderingContext, type: ShaderType, name: string, source: string, keepsource: boolean): ShaderObj | null
    {
        if (type == ShaderType.VertexShader)
        {
            if (vsp[name] != undefined)
                return null;
        }
        else
        {
            if (fsp[name] != undefined)
                return null;
        }
        var _shader = webgl.createShader(type == ShaderType.VertexShader ? webgl.VERTEX_SHADER : webgl.FRAGMENT_SHADER);
        if (_shader == null)
        {
            console.error("AddShader error webgl.createShader:" + type + ":" + name);
            return null;
        }

        webgl.shaderSource(_shader, source);
        webgl.compileShader(_shader);
        var r1 = webgl.getShaderParameter(_shader, webgl.COMPILE_STATUS);
        if (r1 == false)
        {
            console.error("AddShader error webgl.compileShader:" + webgl.getShaderInfoLog(_shader) + ':' + type + ":" + name);
            return null;
        }
        else
        {
            console.log("AddShader:" + ShaderType[type].toString() + name);
        }
        var uinfo = {};
        findUniform(source, uinfo);

        var shaderobj = new ShaderObj(type, name, keepsource ? source : "", _shader, uinfo);
        if (type == ShaderType.VertexShader)
        {
            vsp[name] = shaderobj;
        }
        else
        {
            fsp[name] = shaderobj;
        }
        return shaderobj;


    }
    function findUniform(source: string, target: { [id: string]: string }): void
    {
        var lines = source.split("\n");
        for (var i = 0; i < lines.length; i++)
        {
            var line = lines[i].replace(new RegExp('\r', "g"), "");
            line = line.replace(new RegExp('\n', "g"), "");
            line = line.replace(new RegExp('\t', "g"), " ");
            line = line.replace(new RegExp(';', "g"), " ");
            line = line.replace("//", " ");
            var words = line.split(" ");
            var type = "";
            var name = "";
            var state = 0;//0 寻找uniform //1寻找type //2 寻找name
            for (var j = 0; j < words.length; j++)
            {
                var word = words[j];
                var code = word.charCodeAt(0);
                if (word == "") continue;
                if (word == " ") continue;
                else if (state == 0)
                {
                    if (word == "uniform")
                    {
                        state++;
                    }
                    else
                    {
                        break;
                    }
                }
                else if (state == 1)
                {
                    type = word;
                    state++;
                }
                else if (state == 2)
                {
                    name = word;
                    break;
                }
            }
            if (type != "")
            {
                if (name == "matrix" || name == "texpalette" || name == "texmain" || name == "texlut")
                    continue;

                target[name] = type;
            }
        }
    }

    export function LinkShader(webgl: WebGL2RenderingContext, name: string, vs: ShaderObj, fs: ShaderObj): ShaderProgram | null
    {
        var prog = webgl.createProgram();
        if (prog != null)
        {
            webgl.attachShader(prog, vs.shader);
            webgl.attachShader(prog, fs.shader);
            webgl.linkProgram(prog);
            var r3 = webgl.getProgramParameter(prog, webgl.LINK_STATUS);
            if (r3 == false)
            {
                console.error("LinkShader error webgl.linkProgram:" + webgl.getProgramInfoLog(prog));
                return null;
            }
            var _prog = new ShaderProgram(webgl, name, prog, vs, fs);
            programs[name] = _prog;
            console.log("LinkShader:" + name);
            return _prog;
        }
        else
        {
            console.error("LinkShader error webgl.createProgram");
        }
        return null;
    }

    var programs: { [id: string]: ShaderProgram } = {};
    export class ShaderProgram
    {
        name: string;
        program: WebGLProgram;
        //attr 是固定的
        attrIndexPos: number;
        attrIndexUV: number;
        attrIndexColor: number;
        attrIndexExt: number;//palu palv texid effect,


        //uniform Matrix texpalette texmain 是固定的
        uniMatModel: WebGLUniformLocation | null;
        uniMatView: WebGLUniformLocation | null;
        uniMatProj: WebGLUniformLocation | null;
        uniTex: WebGLUniformLocation | null;
        uniTex2: WebGLUniformLocation | null;
        uniTexPal: WebGLUniformLocation | null;
        //其余自定义uniform
        uniforms: { [id: string]: WebGLUniformLocation };

        constructor(webgl: WebGL2RenderingContext, name: string, program: WebGLProgram, vs: ShaderObj, fs: ShaderObj)
        {
            this.name = name;
            this.program = program;
            this.attrIndexPos = webgl.getAttribLocation(this.program, "position");
            this.attrIndexColor = webgl.getAttribLocation(this.program, "color");
            this.attrIndexUV = webgl.getAttribLocation(this.program, "uv");
            this.attrIndexExt = webgl.getAttribLocation(this.program, "ext");


            this.uniMatModel = webgl.getUniformLocation(this.program, "matModel");
            this.uniMatView = webgl.getUniformLocation(this.program, "matView");
            this.uniMatProj = webgl.getUniformLocation(this.program, "matProj");

            this.uniTex = webgl.getUniformLocation(this.program, "tex");
            this.uniTex2 = webgl.getUniformLocation(this.program, "tex2");
            this.uniTexPal = webgl.getUniformLocation(this.program, "texpal");
           
            this.uniforms = {};
            for (var key in vs.uniformInfo)
            {
                if (this.uniforms[key] != undefined) continue;
                //if (key == "matrix" || key == "texpalette" || key == "texmain") continue;
                var loc = webgl.getUniformLocation(this.program, key);
                if (loc != null)
                {
                    this.uniforms[key] = loc;
                }
            }
            for (var key in fs.uniformInfo)
            {
                if (this.uniforms[key] != undefined) continue;
                //if (key == "mattrix" || key == "texpalette" || key == "texmain") continue;
                var loc = webgl.getUniformLocation(this.program, key);
                if (loc != null)
                {
                    this.uniforms[key] = loc;
                }
            }

        }
    }


    export function GetShaderProgram(name: string): ShaderProgram | undefined
    {
        //if (programs[name] == undefined) return null;
        return programs[name];
    }
}