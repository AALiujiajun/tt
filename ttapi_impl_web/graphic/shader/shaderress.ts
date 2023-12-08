import * as s from "./shaders.js"

export namespace tt_impl.Shaders {


    var vs_default: string = `#version 300 es
    layout(location = 0) in vec3 position;//顶点提供的数据
    layout(location = 1) in vec4 color; 
    layout(location = 2) in vec2 uv; 
    layout(location = 3) in vec4 ext; 

    uniform mat4 matModel;
    uniform mat4 matView;
    uniform mat4 matProj;

    out vec4 vColor;//输出给fs的参数
    out vec2 vUv;//输出给fs的参数2
    flat out vec4 vExt;

    void main(void) 
    {
        mat4 matrix = matProj*matView*matModel;
        gl_Position = matrix * vec4(position,1);// uViewProjMatrix * uModelMatrix * position;
        vColor = color;
        vUv = uv;
        vExt = ext;
    }
    `;

    var fs_default: string = `#version 300 es
    precision mediump float;//指定浮点型精确度
    
    in vec2 vUv;//从vs接收的参数
    in vec4 vColor;//从vs接收的参数
    flat in vec4 vExt;

        
    layout(location = 0) out vec4 fragColor;

    //uniform sampler2D tex2;
    uniform sampler2D tex;  //从外部设置的参数
    uniform sampler2D texpal;  //调色板用
    void main(void) 
    {
        vec4 texc = texture(tex,vUv);
        vec4 outc = vColor;
        int effect = int(vExt.w);
        if(effect==0)//rgba model 
        {
            outc = vColor * texc;
        }
        else if(effect==1)//gray model
        {
            vec4 c = vec4(texc.r,texc.r,texc.r,1);
            outc = vColor * c;
        }
        else if(effect==2)//pal8 model
        {
            vec2 paluv = vec2(texc.r+vExt.x/256.0,vExt.y/256.0);
            vec4 c = texture(texpal,paluv);
            outc = vColor * c;
        }
        else if(effect==3)//p5a3 model
        {
      
            int v =  int(texc.r *255.0+0.9);
            
            //分解调色板和alpha

            float palx = float(v % 32)/255.0 + vExt.x/255.0;
            float paly = vExt.y/255.0;
            float alpha = float(v/32) /7.0f;

            vec4 c = texture(texpal,vec2(palx,paly));
            c.a = alpha;
            //c =vec4(1.0,1.0,1.0,1.0);
            outc = vColor * c;
          
        }
        else if(effect==4)//gray as alpha model
        {
            outc.a *= texc.r;
            //vec4 c = vec4(1.0,1.0,1.0,texc.r);
            //outc = vColor * c;
        }
        fragColor =  outc;
    }
    `;


    export function InitShader(webgl: WebGL2RenderingContext): void {
        var vsdef =s.tt_impl.Shaders.AddShader(webgl, s.tt_impl.Shaders.ShaderType.VertexShader, "default", vs_default, true);
        var fsdef = s.tt_impl.Shaders.AddShader(webgl, s.tt_impl.Shaders.ShaderType.FragmentShader, "default", fs_default, true);

        if (vsdef != null && fsdef != null)
        s.tt_impl.Shaders.LinkShader(webgl, "default", vsdef, fsdef);

        // var fsdef_noa = Shaders.AddShader(webgl, Shaders.ShaderType.FragmentShader, "default_noa", fs_default_noa, true);

        // if (vsdef != null && fsdef_noa != null)
        //     Shaders.LinkShader(webgl, "default_noa", vsdef, fsdef_noa);

        // var fspal = Shaders.AddShader(webgl, Shaders.ShaderType.FragmentShader, "palette", fs_palette, true);
        // if (vsdef != null && fspal != null)
        // Shaders.LinkShader(webgl, "palette", vsdef, fspal);

        // var fslight = Shaders.AddShader(webgl, Shaders.ShaderType.FragmentShader, "lightmap", fs_lightmap, true);
        // if (vsdef != null && fslight != null)
        // Shaders.LinkShader(webgl, "lightmap", vsdef, fslight);


    }
}