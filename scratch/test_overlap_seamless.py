import asyncio
import websockets
import json
import urllib.request
import base64
import os

os.makedirs('scratch/seamless_test', exist_ok=True)

async def capture_seamless():
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']

    async with websockets.connect(ws_url, max_size=25000000) as ws:
        await ws.send(json.dumps({'id': 1, 'method': 'Emulation.setDeviceMetricsOverride', 'params': {'width': 1536, 'height': 1024, 'deviceScaleFactor': 1, 'mobile': False}}))
        await ws.recv()
        await ws.send(json.dumps({'id': 2, 'method': 'Page.navigate', 'params': {'url': 'http://localhost:3000'}}))
        await ws.recv()
        await asyncio.sleep(2.5)

        points = [
            ('01_hero_start', 0),
            ('02_hero_chapter_5', 6200),
            ('03_hero_to_approach_seam_6615', 6615),
            ('04_approach_active_8000', 8000),
            ('05_approach_solar_9500', 9500),
            ('06_approach_to_closing_seam_13230', 13230),
            ('07_closing_commitment_full_13900', 13900),
            ('08_closing_transition_dusk_14500', 14500),
            ('09_closing_final_cta_full_14950', 14950),
            ('10_closing_footer_docked_15797', 15797),
        ]

        for name, sy in points:
            eval_scroll = f"window.scrollTo({{ top: {sy}, behavior: 'instant' }})"
            await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': eval_scroll}}))
            await ws.recv()
            await asyncio.sleep(0.5)

            await ws.send(json.dumps({'id': 4, 'method': 'Page.captureScreenshot'}))
            resp = json.loads(await ws.recv())
            filepath = f"scratch/seamless_test/{name}.png"
            with open(filepath, 'wb') as f:
                f.write(base64.b64decode(resp['result']['data']))
            print(f"Captured {filepath} (scrollY={sy})")

if __name__ == '__main__':
    asyncio.run(capture_seamless())
