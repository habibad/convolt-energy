import asyncio
import websockets
import json
import urllib.request
import base64
import os

os.makedirs('scratch/closing_stages', exist_ok=True)

async def test_stages():
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']

    async with websockets.connect(ws_url, max_size=25000000) as ws:
        await ws.send(json.dumps({'id': 1, 'method': 'Emulation.setDeviceMetricsOverride', 'params': {'width': 1536, 'height': 1024, 'deviceScaleFactor': 1, 'mobile': False}}))
        await ws.recv()
        await ws.send(json.dumps({'id': 2, 'method': 'Page.navigate', 'params': {'url': 'http://localhost:3000'}}))
        await ws.recv()
        await asyncio.sleep(2.5)

        points = [
            ('01_closing_start_15120', 15120),
            ('02_closing_commitment_mid_15500', 15500),
            ('03_closing_commitment_full_15900', 15900),
            ('04_closing_transition_16350', 16350),
            ('05_closing_final_cta_full_16800', 16800),
            ('06_closing_footer_rising_17300', 17300),
            ('07_closing_footer_docked_17687', 17687),
        ]

        for name, sy in points:
            eval_scroll = f"window.scrollTo({{ top: {sy}, behavior: 'instant' }})"
            await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': eval_scroll}}))
            await ws.recv()
            await asyncio.sleep(0.5)

            await ws.send(json.dumps({'id': 4, 'method': 'Page.captureScreenshot'}))
            resp = json.loads(await ws.recv())
            filepath = f"scratch/closing_stages/{name}.png"
            with open(filepath, 'wb') as f:
                f.write(base64.b64decode(resp['result']['data']))
            print(f"Captured {filepath} at scrollY={sy}")

if __name__ == '__main__':
    asyncio.run(test_stages())
