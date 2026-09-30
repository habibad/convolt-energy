import asyncio
import json
import os
import subprocess
import time
import urllib.request
import base64
import websockets

SCREENSHOT_DIR = r"C:\Users\anik\.gemini\antigravity-ide\brain\a68c1345-a61a-413f-a078-99fb45c1f4be\qa_screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PORT = 9222

RESOLUTIONS = [
    ("desktop_1536x1024", 1536, 1024),
    ("desktop_1440x900", 1440, 900),
    ("tablet_1024x768", 1024, 768),
    ("tablet_portrait_768x1024", 768, 1024),
    ("mobile_390x844", 390, 844),
]

async def send_cmd(ws, method, params=None, msg_id=1):
    req = {"id": msg_id, "method": method, "params": params or {}}
    await ws.send(json.dumps(req))
    while True:
        resp = json.loads(await ws.recv())
        if resp.get("id") == msg_id:
            return resp

async def run_qa():
    # Start Chrome
    chrome_cmd = [
        CHROME_PATH,
        "--headless=new",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--hide-scrollbars",
        "about:blank",
    ]
    proc = subprocess.Popen(chrome_cmd)
    time.sleep(2)

    try:
        # Get target tab websocket URL
        with urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json") as resp:
            tabs = json.loads(resp.read().decode())
            ws_url = tabs[0]["webSocketDebuggerUrl"]

        async with websockets.connect(ws_url, max_size=20_000_000) as ws:
            msg_id = 1

            for name, width, height in RESOLUTIONS:
                print(f"Testing {name} ({width}x{height})...")

                # Set viewport size
                msg_id += 1
                await send_cmd(ws, "Emulation.setDeviceMetricsOverride", {
                    "width": width,
                    "height": height,
                    "deviceScaleFactor": 1,
                    "mobile": width < 768,
                }, msg_id)

                # Navigate
                msg_id += 1
                await send_cmd(ws, "Page.navigate", {"url": "http://localhost:3000"}, msg_id)
                await asyncio.sleep(2.5)

                # Scroll to #our-commitment
                msg_id += 1
                eval_scroll = """
                (() => {
                    const el = document.getElementById('our-commitment');
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        const targetY = window.scrollY + rect.top + rect.height * 0.45;
                        window.scrollTo({ top: targetY, behavior: 'instant' });
                        return { found: true, targetY };
                    }
                    return { found: false };
                })()
                """
                scroll_res = await send_cmd(ws, "Runtime.evaluate", {"expression": eval_scroll, "returnByValue": True}, msg_id)
                print(f"  Scroll result: {scroll_res.get('result', {}).get('value')}")
                await asyncio.sleep(1.5)

                # Take screenshot
                msg_id += 1
                shot_res = await send_cmd(ws, "Page.captureScreenshot", {"format": "png"}, msg_id)
                img_data = shot_res.get("result", {}).get("data")
                if img_data:
                    filepath = os.path.join(SCREENSHOT_DIR, f"{name}.png")
                    with open(filepath, "wb") as f:
                        f.write(base64.b64decode(img_data))
                    print(f"  Saved screenshot: {filepath}")

    finally:
        proc.terminate()

if __name__ == "__main__":
    asyncio.run(run_qa())
