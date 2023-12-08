import * as app from "./app.js"


window.onload=()=>
{
    console.log("==start app.");

    //启动，主入口固定名称game.js
    let _app =new app.App();
    _app.Start();
}




