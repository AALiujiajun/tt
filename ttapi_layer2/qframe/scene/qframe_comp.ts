import { QFrame_IRenderObj } from "./qframe_renderobj.js";
import { QFrame_SceneObj } from "./qframe_sceneobj.js";

//一个场景组件
export interface QFrame_IComponent {
    GetType(): string;
    GetRenderObjs(list: QFrame_IRenderObj[]): void;
    GetDebugRenderObjs(list: QFrame_IRenderObj[]): void;
    OnAdd(obj: QFrame_SceneObj): void;
    OnUpdate?(delta: number): void;
}