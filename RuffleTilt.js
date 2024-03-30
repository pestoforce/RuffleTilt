let flashObj = null;
let initialized = false;
let jsLoggingEnabled = true;
let device = "";
let spin = 0;

function getMobileOperatingSystem() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

window.addEventListener('DOMContentLoaded', () => {
    myInit();
    device = getMobileOperatingSystem();
    document.getElementById('floaterbottom').innerHTML = device;
});

function getAccel(){
    if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response == 'granted') {
                // console.log("accelerometer permission granted");
                addMotionListener();
            }
        });
    }
}

function checkConfirm() {
    const but = document.getElementById("floater");

    if (DeviceMotionEvent.requestPermission) {
        but.addEventListener("click", (e) => {
            but.style.display = "none";
            getAccel();
        });
    } else {
        addMotionListener();
    }
}

function addMotionListener(doConfirm) {
    if (window.DeviceMotionEvent) {
        document.getElementById('floaterbottom').innerHTML += " - doIt!";
        window.addEventListener("devicemotion", handleMotionEvent, true);
        window.addEventListener("deviceorientation", handleOrientation, true);
        flashObj.enableAccel();
    } else {
        but.innerHTML = "no device motion...";
    }
}

function handleMotionEvent(event) {
    if (initialized && flashObj.receiveTiltState) {
        let x = event.accelerationIncludingGravity.x;
        let y = event.accelerationIncludingGravity.y;
        let z = event.accelerationIncludingGravity.z;

        let isUpward = spin < 0 && spin > -180;

        if (device == "iOS") {
            // iOS has normal values swapped...
            y = -y;
        }

        if (!isUpward) {
            y = -y;
        }

        flashObj.receiveTiltState([x,y,z]);
    }
}

function handleOrientation(event) {
  var alpha = event.alpha;
  var beta = event.beta;
  var gamma = event.gamma;

  // JS math works in radians
  var betaR = beta / 180 * Math.PI;
  var gammaR = gamma / 180 * Math.PI;
  var spinR = Math.atan2(Math.cos(betaR) * Math.sin(gammaR), Math.sin(betaR));

  // convert back to degrees
  spin = spinR * 180 / Math.PI;

  document.getElementById('floaterbottom').innerHTML = spin;
}

function pollFlashObj() {
    if (flashObj.enableAccel && flashObj.receiveTiltState) {
        const but = document.getElementById("floater");

        if (!DeviceMotionEvent.requestPermission && !window.DeviceMotionEvent) {
            flashObj.enableAccel();
            but.innerHTML = "desktop?";
        } else {
            checkConfirm();
        }

        initialized = true;
        flashObj.receiveTiltState([0,0,0]);
    } else {
        setTimeout(() => {
            pollFlashObj();
        }, 500);
    }
}

function myInit() {
    // once the DOM is loaded, store a ref to the swf object
    jsLog("DOM Initialized!");
    flashObj = document.getElementById("output");
    pollFlashObj();
}

function requestTiltState(data) {
    flashObj.receiveTiltState(data);
}

/*
Only log to js console if jsLogging is enabled
*/
function jsLog(msg) {
    if (jsLoggingEnabled) {
        console.log(msg);
    }
}
