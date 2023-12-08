// import { tt } from "../../ttapi_interface/ttapi.js"
// import { b2Mat22, b2Vec2 } from "../ttlayer2.js";

// export class matrix3x2 {
//     //public rawData: Float32Array;
//     public mat2: b2Mat22 = new b2Mat22()
//     public xy: b2Vec2 = new b2Vec2();

//     //public rawData: Array<number>;
//     constructor() {
//         this.mat2 = new b2Mat22();

//     }
//     public static MakeIdentity(out: matrix3x2) {
//         out.mat2.SetScalars(1, 0, 0, 1);
//         out.xy.x = 0;
//         out.xy.y = 0;
//     }
//     public static Clone(src: matrix3x2, out: matrix3x2) {
//         out.mat2.SetScalars(src.mat2.ex.x, src.mat2.ex.y, src.mat2.ey.x, src.mat2.ey.y);
//         out.xy.x = src.xy.x;
//         out.xy.y = src.xy.y;
//     }
//     public static SetScale(out: matrix3x2, scaleX: number, scaleY: number) {
//         out.mat2.ex.x=scaleX;
//         out.mat2.ex.y=0;
//         out.mat2.ey.x=0;
//         out.mat2.ey.y=scaleY;
//     }
//     public static SetAngle(out: matrix3x2, angle: number) {
//         out.mat2.SetAngle(angle);
//     }
//     public static SetScaleAndAngle(out: matrix3x2, scaleX: number, scaleY: number, angle: number) {
//         let m1 = b2Mat22.FromScalars(scaleX, 0, 0, scaleY);
//         let m2 = b2Mat22.FromAngle(angle)
//         b2Mat22.Multiply(m1, m2, out.mat2);
//     }
//     public static Multiply(a: matrix3x2, b: matrix3x2, out: matrix3x2) {
//         b2Mat22.Multiply(a.mat2, b.mat2, out.mat2);
//         b2Mat22.MultiplyVec2(a.mat2, b.xy, out.xy).Add(a.xy);

//     }
//     public static MultiplyVec2(a: matrix3x2, v: b2Vec2, out: b2Vec2) {
//         b2Mat22.MultiplyVec2(a.mat2, v, out).Add(a.xy);
//     }
// }

