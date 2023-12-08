import { b2Transform, XY } from "../ttlayer2.js";
import { RGBA, b2Draw } from "./src/common/b2_draw.js";
import { tt } from "../../ttapi_interface/ttapi.js";
export class b2Drawer implements b2Draw {
    batcher: tt.IBatcher
    white: tt.ITexture;
    constructor(batcher: tt.IBatcher) {
        this.batcher = batcher;
        this.white = tt.graphic.getWhiteTexture();
    }
    tranStack: b2Transform[] = [];
    private getTran(): b2Transform {
        if (this.tranStack.length == 0) {
            return b2Transform.IDENTITY;
        }
        else {
            return this.tranStack[this.tranStack.length - 1];
        }
    }
    PushTransform(xf: b2Transform): void {
        //console.log("--pusht2");
        if (this.tranStack.length == 0) {
            this.tranStack.push(xf);
        }
        else {
            let ntran = new b2Transform();
            b2Transform.Multiply(this.tranStack[this.tranStack.length - 1], xf, ntran);
            this.tranStack.push(ntran);
        }
    }
    PopTransform(xf: b2Transform): void {
        //console.log("--popt2");
        this.tranStack.pop();
    }
    DrawPolygon(vertices: XY[], vertexCount: number, color: RGBA): void {
        while (this.points.length < 2) {
            this.points.push(new tt.DrawPoint());
        }
        let _tran = this.getTran();

        //b2Transform.MultiplyVec2(_tran, vertices[0], v0);
        for (var i = 0; i < vertexCount; i++) {


            let v1: XY = { x: 0, y: 0 }
            let v2: XY = { x: 0, y: 0 }
            let next = i + 1;
            if (next >= vertexCount)
                next = 0;
            b2Transform.MultiplyVec2(_tran, vertices[i + 0], v1);
            b2Transform.MultiplyVec2(_tran, vertices[next], v2);

            this.points[0].x = v1.x;
            this.points[0].y = v1.y;
            this.points[0].z = 0;
            this.points[0].r = color.r
            this.points[0].g = color.g
            this.points[0].b = color.b
            this.points[0].a = color.a


            this.points[1].x = v2.x;
            this.points[1].y = v2.y;
            this.points[1].z = 0;
            this.points[1].r = color.r
            this.points[1].g = color.g
            this.points[1].b = color.b
            this.points[1].a = color.a



            this.batcher.DrawLines(this.white, null, null, this.points, 1);
        }
    }
    points: tt.DrawPoint[] = [];
    DrawSolidPolygon(vertices: XY[], vertexCount: number, color: RGBA): void {
        while (this.points.length < 3) {
            this.points.push(new tt.DrawPoint());
        }
        let _tran = this.getTran();
        let v0: XY = { x: 0, y: 0 }
        b2Transform.MultiplyVec2(_tran, vertices[0], v0);
        for (var i = 0; i < vertexCount - 2; i++) {


            let v1: XY = { x: 0, y: 0 }
            let v2: XY = { x: 0, y: 0 }


            b2Transform.MultiplyVec2(_tran, vertices[i + 1], v1);
            b2Transform.MultiplyVec2(_tran, vertices[i + 2], v2);
            this.points[0].x = v0.x;
            this.points[0].y = v0.y;
            this.points[0].z = 0;
            this.points[0].r = color.r
            this.points[0].g = color.g
            this.points[0].b = color.b
            this.points[0].a = color.a


            this.points[1].x = v1.x;
            this.points[1].y = v1.y;
            this.points[1].z = 0;
            this.points[1].r = color.r
            this.points[1].g = color.g
            this.points[1].b = color.b
            this.points[1].a = color.a

            this.points[2].x = v2.x;
            this.points[2].y = v2.y;
            this.points[2].z = 0;
            this.points[2].r = color.r
            this.points[2].g = color.g
            this.points[2].b = color.b
            this.points[2].a = color.a

            this.batcher.DrawTris(this.white, null, null, this.points, 1);
        }



    }
    DrawCircle(center: XY, radius: number, color: RGBA): void {
        while (this.points.length < 2) {
            this.points.push(new tt.DrawPoint());
        }
        let _tran = this.getTran();

        //b2Transform.MultiplyVec2(_tran, vertices[0], v0);
        for (var i = 0; i < 16; i++) {
            let dx = Math.sin(Math.PI * 2 * i / 16);
            let dy = Math.cos(Math.PI * 2 * i / 16);
            let dx2 = Math.sin(Math.PI * 2 * (i + 1) / 16);
            let dy2 = Math.cos(Math.PI * 2 * (i + 1) / 16);
            let v1: XY = { x: 0, y: 0 }
            let v2: XY = { x: 0, y: 0 }

            let _v1: XY = { x: center.x + dx * radius, y: center.y + dy * radius }
            let _v2: XY = { x: center.x + dx2 * radius, y: center.y + dy2 * radius }
            b2Transform.MultiplyVec2(_tran, _v1, v1);
            b2Transform.MultiplyVec2(_tran, _v2, v2);

            this.points[0].x = v1.x;
            this.points[0].y = v1.y;
            this.points[0].z = 0;
            this.points[0].r = color.r
            this.points[0].g = color.g
            this.points[0].b = color.b
            this.points[0].a = color.a


            this.points[1].x = v2.x;
            this.points[1].y = v2.y;
            this.points[1].z = 0;
            this.points[1].r = color.r
            this.points[1].g = color.g
            this.points[1].b = color.b
            this.points[1].a = color.a



            this.batcher.DrawLines(this.white, null, null, this.points, 1);
        }
    }
    DrawSolidCircle(center: XY, radius: number, axis: XY, color: RGBA): void {
        while (this.points.length < 3) {
            this.points.push(new tt.DrawPoint());
        }
        let _tran = this.getTran();
        let v0: XY = { x: 0, y: 0 }
        b2Transform.MultiplyVec2(_tran, center, v0);
        for (var i = 0; i < 16; i++) {
            let dx = Math.sin(Math.PI * 2 * i / 16);
            let dy = Math.cos(Math.PI * 2 * i / 16);
            let dx2 = Math.sin(Math.PI * 2 * (i + 1) / 16);
            let dy2 = Math.cos(Math.PI * 2 * (i + 1) / 16);
            let v1: XY = { x: 0, y: 0 }
            let v2: XY = { x: 0, y: 0 }

            let _v1: XY = { x: center.x + dx * radius, y: center.y + dy * radius }
            let _v2: XY = { x: center.x + dx2 * radius, y: center.y + dy2 * radius }
            b2Transform.MultiplyVec2(_tran, _v1, v1);
            b2Transform.MultiplyVec2(_tran, _v2, v2);

            this.points[0].x = v0.x;
            this.points[0].y = v0.y;
            this.points[0].z = 0;
            this.points[0].r = color.r
            this.points[0].g = color.g
            this.points[0].b = color.b
            this.points[0].a = color.a


            this.points[1].x = v1.x;
            this.points[1].y = v1.y;
            this.points[1].z = 0;
            this.points[1].r = color.r
            this.points[1].g = color.g
            this.points[1].b = color.b
            this.points[1].a = color.a

            this.points[2].x = v2.x;
            this.points[2].y = v2.y;
            this.points[2].z = 0;
            this.points[2].r = color.r
            this.points[2].g = color.g
            this.points[2].b = color.b
            this.points[2].a = color.a

            this.batcher.DrawTris(this.white, null, null, this.points, 1);
        }
    }
    DrawSegment(p1: XY, p2: XY, color: RGBA): void {
        throw new Error("Method not implemented.");
    }
    DrawTransform(xf: b2Transform): void {
        throw new Error("Method not implemented.");
    }
    DrawPoint(p: XY, size: number, color: RGBA): void {
        throw new Error("Method not implemented.");
    }

}