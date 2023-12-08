
import { tt } from "../../../ttapi_interface/ttapi.js"

export interface QFrame_IRenderObj {
    sortvalue: number;
    OnRender(bathcer: tt.IBatcher): void;
}
