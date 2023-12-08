//为了开发工具方便，做一些扩展，这些扩展对普通浏览器无用，仅用于
//https://gitee.com/lightsever/ttapi_win
//自制的工具壳

export class QExt {
    private static _extport: number = 0;
    private static _info: string;
    static get extport(): number {
        return this._extport;
    }
    static get extinfo(): string {
        return this._info;
    }
    //工具扩展的初始化可能会失败，如果失败了，是因为环境不对，给用户一个提示就得了
    static async Init(port: number = 0): Promise<boolean> {
        if (port == 0) {
            port = QExt.GetExtPort();
            if (port == 0) {
                console.warn("自动查找扩展端口失败，尝试手动，或者提前获取端口");
                return false;
            }
        }
        console.log("扩展端口:" + port);
        this._extport = port;
        try {
            var info = await fetch("http://127.0.0.1:" + this._extport + "/info");
            var result = JSON.parse(await info.text());
            this._info = result["info"];
            if ("_ttapi_localext" == result["tag"]) {
                console.log("扩展初始化成功：" + this._info);
                return true;
            }
            else {
                console.warn("扩展初始化失败,tag不对");
                return false;
            }
        } catch (e) {
            console.warn("扩展初始化失败");
            return false;
        }
    }

    static GetExtPort(): number {
        try {
            let searchParams = new URLSearchParams(window.location.search);
            let port = parseInt(searchParams.get('_localext_'));
            return port;
        }
        catch
        {
            console.error("自动查找扩展端口失败，尝试手动");
            return 0;
        }
    }
    static PingCheck() {
        let wsuri = "ws://127.0.0.1:" + this._extport + "/ping";
        console.log("wsurl=" + wsuri);
        let ws = new WebSocket(wsuri);
        ws.onopen = () => {
            console.warn("websocket in.");
        }
        ws.onerror = () => {
            console.warn("websocket error.");
            window.close();
        }
        ws.onclose = () => {
            console.warn("websocket close.");
            window.close();
        }
        ws.onmessage = (ev) => {
            console.warn("websocket onmessage.");
        };
    }
    static async SetDebug(b: boolean): Promise<boolean> {
        var info = await fetch("http://127.0.0.1:" + this._extport + "/setdebug?value=" + b);
        var result = JSON.parse(await info.text());
        return result["state"] == "ok";
    }
    static async QuitApp(): Promise<boolean> {
        var info = await fetch("http://127.0.0.1:" + this._extport + "/quit");
        var result = JSON.parse(await info.text());
        return result["state"] == "ok";
    }

}
export class QExt_RootPath {
    logic: string[];
    special: { [id: string]: string };
}
export class QExt_Dir_Info {
    exists: boolean
    Name?: string;
    FullName?: string;
    CreationTime?: number;
    LastWriteTime?: number;
    Hidden?: boolean;
    System?: boolean;
    ReadOnly?: boolean;

}
export class QExt_File_Info {
    exists: boolean
    Name?: string;
    FullName?: string;
    Length: number;
    CreationTime?: number;
    LastWriteTime?: number;
    Hidden?: boolean;
    System?: boolean;
    ReadOnly?: boolean;

}
export class QExt_Dir_List {
    dirs: string[];
    files: string[];
}
export class QExt_IO {

    // server.SetHttpAction("/fileext/getroots", LocalExt_File.onFileExt_GetRoots);//列出可用的根路径
    // server.SetHttpAction("/fileext/dir_info", LocalExt_File.onFileExt_Dir_Info);//目录操作， 增 删 查
    // server.SetHttpAction("/fileext/dir_create", LocalExt_File.onFileExt_Dir_Create);//目录操作， 增 删 查
    // server.SetHttpAction("/fileext/dir_delete", LocalExt_File.onFileExt_Dir_Delete);//目录操作， 增 删 查
    // server.SetHttpAction("/fileext/dir_list", LocalExt_File.onFileExt_Dir_List);//目录操作， 增 删 查
    // server.SetHttpAction("/fileext/file_info", LocalExt_File.onFileExt_File_Info);//文件操作，增 删 查
    // server.SetHttpAction("/fileext/file_read", LocalExt_File.onFileExt_File_Read);//文件操作，增 删 查
    // server.SetHttpAction("/fileext/file_write", LocalExt_File.onFileExt_File_Write);//文件操作，增 删 查
    // server.SetHttpAction("/fileext/file_delete", LocalExt_File.onFileExt_File_Delete);//文件操作，增 删 查
    // server.SetHttpAction("/fileext/file_copy", LocalExt_File.onFileExt_File_Copy);//扩展，文件复制
    static async GetRoots(): Promise<QExt_RootPath> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/getroots");
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {
            return result as QExt_RootPath;
        }
        else
            throw new Error(result);
    }
    static async Dir_Info(path: string): Promise<QExt_Dir_Info> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/dir_info?path=" + path);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {

            return result as QExt_Dir_Info;
        }
        else
            throw new Error(result);
    }
    static async Dir_Create(path: string): Promise<void> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/dir_create?path=" + path);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {

            return;
        }
        else {
            throw new Error(result);
        }
    }
    static async Dir_Delete(path: string): Promise<void> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/dir_delete?path=" + path);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {

            return;
        }
        else {
            throw new Error(result);
        }
    }
    static async Dir_List(path: string, pattern: string = "*.*", recursion: boolean = false): Promise<QExt_Dir_List> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/dir_list?path=" + path + "&pattern=" + pattern + "&recursion=" + recursion);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {

            return result as QExt_Dir_List;
        }
        else {
            throw new Error(result);
        }
    }
    static async File_Info(path: string): Promise<QExt_File_Info> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/file_info?path=" + path);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {

            return result as QExt_File_Info;
        }
        else
            throw new Error(result);
    }

    static async File_Read(path: string, istext: boolean = false): Promise<ArrayBuffer | string> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/file_read?path=" + path);
        if (istext) {
            return await info.text();
        }
        else {
            return await info.arrayBuffer();
        }
    }
    static async File_Write(path: string, context: string | ArrayBuffer): Promise<void> {
        var reqop: RequestInit = { "method": "post", "body": context };
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/file_write?path=" + path, reqop);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {
            return
        }
        else {
            throw new Error(result);
        }
    }
    static async File_Delete(path: string): Promise<void> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/file_delete?path=" + path);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {

            return;
        }
        else {
            throw new Error(result);
        }
    }
    static async File_Copy(from: string, to: string): Promise<void> {
        var info = await fetch("http://127.0.0.1:" + QExt.extport + "/fileext/file_delete?from=" + from + "&to=" + to);
        var result = JSON.parse(await info.text());
        if (result["state"] == "ok") {

            return;
        }
        else {
            throw new Error(result);
        }
    }
}