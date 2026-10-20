/* Cache must finish before the firmware host can run. ES5 gate for PS4. */
var uaFull = navigator.userAgent;
var match = uaFull.match(/PlayStation 4[ /]([\d.]+)/i);
var isPS4 = match !== null;
var fwVersion = isPS4 ? match[1] : "Unknown";
var fwNum = parseFloat(fwVersion);

(function () {
    'use strict';
    var msgs = document.getElementById('msgs');
    var cache;
    var started = false;

    function onScriptError() {
        msgs.textContent = 'File HEN gagal dimuat. Sambungkan internet dan periksa kembali penyimpanan cache.';
    }

    function launchWhenReady() {
        /* CHECKING and DOWNLOADING are not evidence of a completed cache.
           An offline error may leave a complete cache in IDLE, which is safe. */
        if (started || !cache || cache.status !== 1) return;
        started = true;
        msgs.textContent = 'Loading GoldHEN v2.4b18.12... Please Wait';
        if (fwNum == 5.05 || fwNum == 5.07) {
            var script = document.createElement('script');
            script.src = "505/exploit.js";
            script.onerror = onScriptError;
            document.head.appendChild(script);
        }
        else if (fwNum >= 7.00 && fwNum <= 8.52) {
            var script = document.createElement('script');
            script.type = 'module';
            script.src = "700/alert.js";
            script.onerror = onScriptError;
            document.head.appendChild(script);
        }
        else if (fwNum >= 9.00 && fwNum <= 9.60) {
            var script = document.createElement('script');
            script.type = 'module';
            script.src = "900/alert.js";
            script.onerror = onScriptError;
            document.head.appendChild(script);
        }
        else if (fwNum >= 10.00 && fwNum <= 11.02) {
            var script = document.createElement('script');
            script.src = "css/main.js";
            script.onerror = onScriptError;
            script.onload = function () {
                setTimeout(function () {
                    doJb();
                }, 500);
            };
            document.head.appendChild(script);
        }
        else if (fwNum >= 11.50 && fwNum <= 12.02) {
            var script = document.createElement('script');
            script.type = 'module';
            script.src = "slopkit/chain_lapse.js";
            script.onerror = onScriptError;
            document.head.appendChild(script);
        }
        else if (fwNum >= 12.50 && fwNum <= 13.00) {
            var script = document.createElement('script');
            script.type = 'module';
            script.src = "slopkit/chain_poops.js";
            script.onerror = onScriptError;
            document.head.appendChild(script);
        }
        else if (fwNum >= 13.02 && fwNum <= 13.52) {
            var script = document.createElement('script');
            script.type = 'module';
            script.src = "slopkit/jb.js?v=19";
            script.onerror = onScriptError;
            document.head.appendChild(script);
        }

    }

    if (!isPS4) {
        msgs.textContent = 'Only for PS4 with Firmware 5.05 and 7.00 to 13.52';
        return;
    }
    if (!(fwNum === 5.05 || fwNum === 5.07 ||
          (fwNum >= 7 && fwNum <= 8.52) ||
          (fwNum >= 9 && fwNum <= 9.60) ||
          (fwNum >= 10 && fwNum <= 11.02) ||
          (fwNum >= 11.50 && fwNum <= 12.02) ||
          (fwNum >= 12.50 && fwNum <= 13.00) ||
          (fwNum >= 13.02 && fwNum <= 13.52))) {
        msgs.textContent = 'Unsupported Firmware: ' + fwVersion;
        return;
    }
    try { cache = window.applicationCache; } catch (ignore) {}
    if (!cache || typeof cache.addEventListener !== 'function') {
        msgs.textContent = 'Cache offline tidak tersedia. HEN belum dijalankan.';
        return;
    }
    msgs.textContent = 'Menunggu penyimpanan cache selesai sebelum menjalankan HEN...';
    cache.addEventListener('cached', launchWhenReady, false);
    cache.addEventListener('noupdate', launchWhenReady, false);
    cache.addEventListener('error', launchWhenReady, false);
    launchWhenReady();
}());
