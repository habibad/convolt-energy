import asyncio
import websockets
import json
import urllib.request
import base64
import os

os.makedirs('scratch/qa_journey', exist_ok=True)

async def capture_journey():
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']

    async with websockets.connect(ws_url, max_size=25000000) as ws:
        await ws.send(json.dumps({'id': 1, 'method': 'Emulation.setDeviceMetricsOverride', 'params': {'width': 1536, 'height': 1024, 'deviceScaleFactor': 1, 'mobile': False}}))
        await ws.recv()
        await ws.send(json.dumps({'id': 2, 'method': 'Page.navigate', 'params': {'url': 'http://localhost:3000'}}))
        await ws.recv()
        await asyncio.sleep(2.5)

        points = [
            ('hero_top', 0),
            ('hero_mid', 3600),
            ('hero_exit_seam', 7200),
            ('approach_entrance', 7600),
            ('approach_solar', 9600),
            ('approach_conclusion', 14500),
            ('approach_exit_seam', 14950),
            ('closing_commitment_full', 15900),
            ('closing_transformation_dusk', 16400),
            ('closing_final_cta_full', 16850),
            ('closing_footer_docked', 17687),
        ]

        for name, sy in points:
            eval_scroll = f"window.scrollTo({{ top: {sy}, behavior: 'instant' }})"
            await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': eval_scroll}}))
            await ws.recv()
            await asyncio.sleep(0.6)

            await ws.send(json.dumps({'id': 4, 'method': 'Page.captureScreenshot'}))
            resp = json.loads(await ws.recv())
            filepath = f"scratch/qa_journey/{name}.png"
            with open(filepath, 'wb') as f:
                f.write(base64.b64decode(resp['result']['data']))
            print(f"Captured {filepath} (scrollY={sy})")

if __name__ == '__main__':
    asyncio.run(capture_journey())
