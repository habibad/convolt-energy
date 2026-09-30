import asyncio
import websockets
import json
import subprocess
import time
import urllib.request
import base64
import os

os.makedirs('scratch/seams', exist_ok=True)

async def check_seams():
    chrome_cmd = [
        r'C:\Program Files\Google\Chrome\Application\chrome.exe',
        '--headless=new',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        'about:blank',
    ]
    proc = subprocess.Popen(chrome_cmd)
    time.sleep(2)
    try:
        with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
            ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']

        async with websockets.connect(ws_url, max_size=25000000) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Emulation.setDeviceMetricsOverride', 'params': {'width': 1536, 'height': 1024, 'deviceScaleFactor': 1, 'mobile': False}}))
            await ws.recv()
            await ws.send(json.dumps({'id': 2, 'method': 'Page.navigate', 'params': {'url': 'http://localhost:3000'}}))
            await ws.recv()
            await asyncio.sleep(2.5)

            scroll_points = [
                ('hero_unpin_7200', 7200),
                ('approach_unpin_14800', 14800),
                ('commitment_unpin_16400', 16400),
            ]

            for label, sy in scroll_points:
                eval_scroll = f"window.scrollTo({{ top: {sy}, behavior: 'instant' }})"
                await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': eval_scroll}}))
                await ws.recv()
                await asyncio.sleep(0.6)

                await ws.send(json.dumps({'id': 4, 'method': 'Page.captureScreenshot'}))
                resp = json.loads(await ws.recv())
                filepath = f"scratch/seams/{label}.png"
                with open(filepath, 'wb') as f:
                    f.write(base64.b64decode(resp['result']['data']))
                print(f'Captured {filepath}')
    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(check_seams())
