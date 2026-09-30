import asyncio
import websockets
import json
import urllib.request
import base64
import os

os.makedirs('scratch/responsive_qa', exist_ok=True)

async def test_viewports():
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']

    viewports = [
        ('mobile_390x844', 390, 844, True),
        ('tablet_768x1024', 768, 1024, False),
    ]

    async with websockets.connect(ws_url, max_size=25000000) as ws:
        for vp_name, w, h, is_mob in viewports:
            await ws.send(json.dumps({
                'id': 1,
                'method': 'Emulation.setDeviceMetricsOverride',
                'params': {'width': w, 'height': h, 'deviceScaleFactor': 1, 'mobile': is_mob}
            }))
            await ws.recv()
            await ws.send(json.dumps({'id': 2, 'method': 'Page.navigate', 'params': {'url': 'http://localhost:3000'}}))
            await ws.recv()
            await asyncio.sleep(2.5)

            # Check height
            await ws.send(json.dumps({'id': 3, 'method': 'Runtime.evaluate', 'params': {'expression': 'document.body.scrollHeight'}}))
            total_h = json.loads(await ws.recv())['result']['result']['value']
            print(f"{vp_name} scrollHeight: {total_h}")

            # Capture bottom / closing section on mobile
            eval_scroll = f"window.scrollTo({{ top: {total_h - h}, behavior: 'instant' }})"
            await ws.send(json.dumps({'id': 4, 'method': 'Runtime.evaluate', 'params': {'expression': eval_scroll}}))
            await ws.recv()
            await asyncio.sleep(0.5)

            await ws.send(json.dumps({'id': 5, 'method': 'Page.captureScreenshot'}))
            resp = json.loads(await ws.recv())
            filepath = f"scratch/responsive_qa/{vp_name}_bottom.png"
            with open(filepath, 'wb') as f:
                f.write(base64.b64decode(resp['result']['data']))
            print(f"Captured {filepath}")

if __name__ == '__main__':
    asyncio.run(test_viewports())
