
import { tt } from "../../ttapi_interface/ttapi.js";

export class TTStore implements tt.IStore {
    constructor() {
        this.InitAsync();

    }
    async InitAsync() {
        await KeyStore.OpenOrCreateDB("_ttstore_");
        this._loaded = true;
    }
    private _loaded = false;
    IsReady(): boolean {
        return this._loaded;
    }
    async GetText(key: string): Promise<string | null> {
        return await KeyStore.GetStringValue(key);
    }
    async GetBinary(key: string): Promise<Uint8Array | null> {
        return await KeyStore.GetBinaryValue(key);
    }
    async SaveText(key: string, data: string): Promise<void> {
        await KeyStore.SetStringValue(key, data);
    }
    async SaveBinary(key: string, data: Uint8Array): Promise<void> {
        await KeyStore.SetBinaryValue(key, data);
    }

    async SaveDataToLocal(key: string, data: string | ArrayBuffer): Promise<boolean> {
        // 创建隐藏的可下载链接
        var eleLink = document.createElement('a');
        eleLink.download = key;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([data]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
        return true;
    }
}

//将INDEXDBSTORE 封装起来

const _storename: string = "__store__";
class StoreItem {
    value: string | Uint8Array;
    format: string;
}
class KeyStore {
    private static db: IDBDatabase | null = null;
    static async DeleteDb(dbname: string): Promise<void> {
        let dbreq = indexedDB.deleteDatabase(dbname);
        let dbinit = 0;
        dbreq.onsuccess = () => {
            console.log("db delete succ.");
            dbinit = 1;
        }
        dbreq.onerror = () => {
            console.log("db delete error.");
            dbinit = 2;
        }
        while (dbinit == 0) {
            await tt.sleep(1);
        }
    }

    static async OpenOrCreateDB(dbname: string): Promise<void> {
        let dbinit = 0;

        let dbreq = indexedDB.open(dbname, 1);

        dbreq.onsuccess = (evt) => {
            console.log("db open");
            dbinit = 1;

            this.db = dbreq.result;

        }
        dbreq.onerror = () => {
            console.log(" dbreq.onerror");
            dbinit = 2;
            this.db = null;
        }
        dbreq.onupgradeneeded = (evt) => {
            console.log("db onupgradeneeded");
            this.db = dbreq.result;
            let store = this.db.createObjectStore(_storename, { "keyPath": ["_id"] });
            store.createIndex("_id", "_id", { "unique": true });
            //let idi= store.createIndex("value", "value", { "unique": false });
            //let idi2= store.createIndex("value2", "value2", { "unique": false });

            console.log(" --create store--");
            //dbinit = 1;
        }
        while (dbinit == 0) {
            await tt.sleep(1);
        }
    }
    static async SetStringValue(key: string, data: string): Promise<void> {
        if (this.db == null)
            return;
        let tran = this.db.transaction(_storename, "readwrite");
        let reqdone = 0;
        let store = tran.objectStore(_storename);
        let req = store.put({ "_id": key, "value": data, "format": "text" });
        req.onsuccess = (ev) => {
            reqdone = 1;
            console.log("SetValue " + " key:" + key + " data:" + JSON.stringify(data));
        };
        req.onerror = (ev) => {
            reqdone = 2;
            console.log("SetValue fail " + " key:" + key + " data:" + JSON.stringify(data));
        }
        while (reqdone == 0) {
            await tt.sleep(1);
        }


    }
    static async SetBinaryValue(key: string, data: Uint8Array): Promise<void> {
        if (this.db == null)
            return;
        let tran = this.db.transaction(_storename, "readwrite");
        let reqdone = 0;
        let store = tran.objectStore(_storename);
        let req = store.put({ "_id": key, "value": data, "format": "hex" });
        req.onsuccess = (ev) => {
            reqdone = 1;
            console.log("SetValue " + " key:" + key + " data:" + JSON.stringify(data));
        };
        req.onerror = (ev) => {
            reqdone = 2;
            console.log("SetValue fail " + " key:" + key + " data:" + JSON.stringify(data));
        }
        while (reqdone == 0) {
            await tt.sleep(1);
        }


    }

    static async GetValue(key: string): Promise<StoreItem | null> {
        if (this.db == null)
            return null;
        let tran = this.db.transaction(_storename, "readonly");
        let store = tran.objectStore(_storename);

        let index = store.index("_id");//用索引去查
        let req = index.get(key);
        //let req = store.get(key); //直接用主键查不好使
        let reqdone = 0;
        req.onsuccess = (ev) => {
            reqdone = 1;
            console.log("GetValue " + "key:" + key + " data:" + JSON.stringify(req.result));
        };
        req.onerror = (ev) => {
            reqdone = 2;
            console.log("GetValue Fail " + "key:" + JSON.stringify(req.result));
        }

        while (reqdone == 0) {
            await tt.sleep(1);
        }

        return req.result as StoreItem;
    }
    static async GetBinaryValue(key: string): Promise<Uint8Array | null> {
        let v = await this.GetValue(key);
        if (v == undefined)
            return null;
        else if (v.format == "hex")
            return v.value as Uint8Array;
        else
            throw new Error("format is text.");
    }
    static async GetStringValue(key: string): Promise<string | null> {
        let v = await this.GetValue(key);
        if (v == undefined)
            return null;
        else if (v.format == "text")
            return v.value as string;
        else
            throw new Error("format is text.");
    }
}