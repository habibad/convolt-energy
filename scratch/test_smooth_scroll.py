import asyncio
import websockets
import json
import subprocess
import time
import urllib.request
import base64
import os

os.makedirs('scratch/smooth_test', exist_ok=True)

async def check_smoothness():
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
            await asyncio.sleep(3.0)

            # Get full document scroll height
            await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': 'document.body.scrollHeight'}}))
            h_resp = json.loads(await ws.recv())
            total_height = h_resp['result']['result']['value']
            print(f"Total page scroll height: {total_height}px")

            # Check points across the entire page
            test_points = [
                ('01_hero_start', 0),
                ('02_hero_chapter_4', 5000),
                ('03_hero_to_approach_seam_7000', 7000),
                ('04_hero_to_approach_seam_7400', 7400),
                ('05_approach_start_8000', 8000),
                ('06_approach_manufacturing_9500', 9500),
                ('07_approach_to_closing_seam_14400', 14400),
                ('08_approach_to_closing_seam_15000', 15000),
                ('09_closing_commitment_15600', 15600),
                ('10_closing_transition_16600', 16600),
                ('11_closing_final_cta_17200', 17200),
                ('12_closing_footer_docked_18200', 18200),
            ]

            for label, sy in test_points:
                eval_scroll = f"window.scrollTo({{ top: {sy}, behavior: 'instant' }})"
                await ws.send(json.dumps({'id': 4, 'method': 'Runtime.evaluate', 'params': {'expression': eval_scroll}}))
                await ws.recv()
                await asyncio.sleep(0.5)

                await ws.send(json.dumps({'id': 5, 'method': 'Page.captureScreenshot'}))
                resp = json.loads(await ws.recv())
                filepath = f"scratch/smooth_test/{label}.png"
                with open(filepath, 'wb') as f:
                    f.write(base64.b64decode(resp['result']['data']))
                print(f'Captured {filepath} at scrollY={sy}')
    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(check_smoothness())
