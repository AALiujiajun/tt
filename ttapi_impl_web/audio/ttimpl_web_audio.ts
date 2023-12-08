

import { tt } from "../../ttapi_interface/ttapi.js";

export namespace tt_impl {
    class Sound_Impl implements tt.ISound {
        constructor(audioContext: AudioContext, url: string | null, array: ArrayBuffer | null) {

            if (url != null && array == null) {
                this.loaded = false;
                this.initByUrlAsync(audioContext, url);
            }

            else if (array != null && url == null) {
                this.initByDataAsync(audioContext, array);
            }
        }
        buffer: AudioBuffer | null;
        private async initByUrlAsync(audioContext: AudioContext, url: string) {
            let req = await fetch(url);
            let buff = await req.arrayBuffer();
            this.buffer = await audioContext.decodeAudioData(buff);
        }
        private async initByDataAsync(audioContext: AudioContext, array: ArrayBuffer) {
            this.buffer = await audioContext.decodeAudioData(array);
            this.loaded = true;
        }


        loaded: boolean;
        onEnd: ((sound: tt.ISound) => void) | null
    }
    class BMG_Impl implements tt.IBGM {
        constructor(audioContext: AudioContext, url: string) {

            let bgmaudio = new HTMLAudioElement();
            this.url = bgmaudio.src = url;
            bgmaudio.loop = true;
            this.node = audioContext.createMediaElementSource(bgmaudio);
            this.loaded = false;
            bgmaudio.onload = () => {
                this.loaded = true;
            }
            bgmaudio.loop = true;
            bgmaudio.onended = () => {
                if (this.onEnd != null)
                    this.onEnd(this);
            }

        }
        node: MediaElementAudioSourceNode;
        url: string;
        loaded: boolean;
        setLoop(loop: boolean): void {
            this.node.mediaElement.loop = loop;
        }
        getLoop(): boolean {
            return this.node.mediaElement.loop;
        }
        onEnd: ((sound: tt.IBGM) => void) | null
    }

    export class Channel_Impl implements tt.IChannel {
        constructor(audioContext: AudioContext) {
            this.audioContext = audioContext;
            this.vol = this.audioContext.createGain();
            this.vol.gain.value = 1.0;
            this.vol.connect(this.audioContext.destination);
            
        }
        audioContext: AudioContext;
        vol: GainNode;//音量节点
        sourceBGM: MediaElementAudioSourceNode = null;
        inBGM: boolean = false;

        SetBGM(bgm: tt.IBGM | null): void {
            if (this.inBGM) {
                this.inBGM = false;
                this.sourceBGM.disconnect();
                this.sourceBGM = null;
            }
            if (bgm != null) {
                this.sourceBGM = (bgm as BMG_Impl).node;
                this.sourceBGM.connect(this.vol);
                
            }

        }

        setVolume(v: number): void {
            this.vol.gain.value = v;
        }
        getVolume(): number {
            return this.vol.gain.value;
        }

        PlaySound(sound: tt.ISound): void //Sound播放一次，短小
        {

            let node = this.audioContext.createBufferSource();
            node.buffer = (sound as Sound_Impl).buffer;
            node.connect(this.vol);
            node.loop = false;
            node.start();
            if ((sound as Sound_Impl).onEnd != null) {
                node.onended = () => {
                    (sound as Sound_Impl).onEnd(sound);
                }
            }
        }

    }
    export class AudioImpl implements tt.IAudio {
        constructor() {
            // this.audioBGM = wx.createInnerAudioContext({ "useWebAudioImplement": false });
            try {
                //var _AudioContext = window["AudioContext"] || window as any ["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
                this.audioContext = new AudioContext();
                console.log("audio Context inited");
            }
            catch (e) {
                console.error("!Your browser does not support AudioContext");
                throw new Error("!Your browser does not support AudioContext");
            }


            this.Init();
        }

        channels: (tt.IChannel | null)[] = []
        GetChannel(id: number): tt.IChannel | null {
            if (id > 16 || id < 0) {
                throw new Error("error channel id.");
                return null;
            }
            while (this.channels.length <= id) {
                this.channels.push(null);
            }
            if (this.channels[id] == null) {
                this.channels[id] = new Channel_Impl(this.audioContext);
            }
            return this.channels[id];
        }
        audioContext: AudioContext;

        CreateBGM(url: string): tt.IBGM {
            return new BMG_Impl(this.audioContext, url);
        }
        CreateSound(url: string): tt.ISound {
            return new Sound_Impl(this.audioContext, url, null);
        }
        CreateSoundFromArrayBuffer(array: ArrayBuffer): tt.ISound {
            return new Sound_Impl(this.audioContext, null, array);
        }
        //audioBGM: WechatMinigame.InnerAudioContext;
        private Init(): void {
            // create empty buffer
            if (this.audioContext != null) {
                //产生一个空声音播放一下
                var buffer = this.audioContext.createBuffer(1, 1, 22050);
                var source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                // connect to output (your speakers)
                source.connect(this.audioContext.destination);
                // play the file
                source.start();
            }
        }

        ReInit(): void {
            this.Init();
        }
    }
}