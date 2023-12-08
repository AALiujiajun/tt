
import { tt } from "../ttapi_interface/ttapi.js";

export namespace tt_impl {
  export class Loader implements tt.ILoader {


    async LoadStringAsync(url: string): Promise<string> {

      let req = await fetch(url);
      let txt = await req.text();
      return txt;

    }
    async LoadBinaryAsync(url: string): Promise<ArrayBuffer> {

      let req = await fetch(url);
      let bin = await req.arrayBuffer();
      return bin;
    }
    LoadImageAsync(url: string): Promise<HTMLImageElement> {

      // while (!comp) {
      //   await tt.sleep(1);
      // }
      //标准写法，不优雅，不着急的时候可以用更优雅的tt.sleep
      let aysnc_op = new Promise<HTMLImageElement>((resolve, reject) => {
        let img = new Image();
        img.src = url;
        let comp = false;
        img.onload = (e) => {
          comp = true;
          resolve(img);
        }
        img.onerror = (e) => {
          comp = true;
          img = null;
          reject("img error:" + e.toString());
        }
      });
      return aysnc_op;

    }
    static c2d: CanvasRenderingContext2D;
    async LoadImageDataAsync(name: string, gray: boolean): Promise<tt.ImageBuffer> {
      let img = await this.LoadImageAsync(name);
      if (Loader.c2d == null) {
        let canvas = window.document.createElement("canvas");
        Loader.c2d = canvas.getContext("2d");
      }
      Loader.c2d.canvas.width = img.width;
      Loader.c2d.canvas.height = img.height;
      Loader.c2d.clearRect(0, 0, img.width, img.height);
      Loader.c2d.drawImage(img, 0, 0);

      let data = Loader.c2d.getImageData(0, 0, img.width, img.height);
      let imgbuf = new tt.ImageBuffer();
      imgbuf.width = data.width;
      imgbuf.height = data.height;

      if (gray)
        imgbuf.data = new Uint8Array(data.width * data.height);
      else
        imgbuf.data = new Uint8Array(data.width * data.height * 4);
      for (var y = 0; y < data.height; y++) {
        for (var x = 0; x < data.width; x++) {
          if (gray) {
            let r = data.data[(y * data.width + x) * 4 + 0];
            let g = data.data[(y * data.width + x) * 4 + 1];
            let b = data.data[(y * data.width + x) * 4 + 2]
            let grayv = (0.299 * r + 0.587 * g + 0.114 * b) | 0;
            if (grayv < 0)
              grayv = 0;
            if (grayv > 255)
              grayv = 255;
            imgbuf.data[(y * data.width + x)] = grayv;
          }
          else {
            imgbuf.data[(y * data.width + x) * 4 + 0] = data.data[(y * data.width + x) * 4 + 0]
            imgbuf.data[(y * data.width + x) * 4 + 1] = data.data[(y * data.width + x) * 4 + 1]
            imgbuf.data[(y * data.width + x) * 4 + 2] = data.data[(y * data.width + x) * 4 + 2]
            imgbuf.data[(y * data.width + x) * 4 + 3] = data.data[(y * data.width + x) * 4 + 3]
          }
        }
      }
      return imgbuf;
    }



  }
}