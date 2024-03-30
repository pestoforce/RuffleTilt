let flashObj = null;
let jsLoggingEnabled = true;


window.addEventListener('DOMContentLoaded', () => {
    myInit();
});

// window.addEventListener("gamepadconnected", (e) => {
//     const [index, id, numBtns, numAxes] =
//         [e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length];
//     jsLog(`Gamepad connected at index ${index}: ${id}. ${numBtns} buttons, ${numAxes} axes.`);
//
//     if (!!flashObj && !!flashObj.handlePadEvent) {
//         flashObj.handlePadEvent("gamepadconnected", e.gamepad.index);
//     }
// });

function myInit() {
    // once the DOM is loaded, store a ref to the swf object
    jsLog("DOM Initialized!");
    flashObj = document.getElementById("output");
}

function requestTiltState(data) {
    // // We must re-query gamepads afresh to get current state (Chrome limitation)
    // const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    //
    // if (!gamepads[index]) {
    //     return;
    // }
    //
    // for (const gamepad of gamepads) {
    //     if (+gamepad.index == +index) {
    //         const buttons = [];
    //         const axes = [];
    //
    //         for (var i=0; i<gamepad.buttons.length; i++) {
    //           var val = gamepad.buttons[i];
    //           buttons[i] = val.pressed;
    //         }
    //
    //         for (var i=0; i<gamepad.axes.length; i++) {
    //           var val = gamepad.axes[i];
    //           axes[i] = val;
    //         }
    //
    //         flashObj.receivePadState(index, buttons, axes);
    //     }
    // }
    flashObj.receiveTiltState(data[0]);
}

/*
Only log to js console if jsLogging is enabled
*/
function jsLog(msg) {
    if (jsLoggingEnabled) {
        console.log(msg);
    }
}
