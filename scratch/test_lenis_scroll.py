import asyncio
import websockets
import json
import urllib.request
import base64
import os

os.makedirs('scratch/test_lenis_scroll', exist_ok=True)

async def test():
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']
    async with websockets.connect(ws_url, max_size=25000000) as ws:
        js_scroll = '''((sy) => {
            if (window.__lenis) {
                window.__lenis.scrollTo(sy, { immediate: true });
            } else {
                window.scrollTo({ top: sy, behavior: 'instant' });
            }
            if (window.ScrollTrigger) {
                window.ScrollTrigger.update();
            }
            return window.scrollY;
        })'''

        points = [
            ('commitment_15600', 15600),
            ('commitment_16000', 16000),
            ('transition_16500', 16500),
            ('final_cta_17000', 17000),
            ('footer_17687', 17687),
        ]

        for name, sy in points:
            await ws.send(json.dumps({
                'id': 1,
                'method': 'Runtime.evaluate',
                'params': {'expression': f"({js_scroll})({sy})", 'returnByValue': True}
            }))
            res = json.loads(await ws.recv())
            actual_y = res['result']['result']['value']
            await asyncio.sleep(0.4)

            await ws.send(json.dumps({'id': 2, 'method': 'Page.captureScreenshot'}))
            resp = json.loads(await ws.recv())
            filepath = f"scratch/test_lenis_scroll/{name}.png"
            with open(filepath, 'wb') as f:
                f.write(base64.b64decode(resp['result']['data']))
            print(f"Captured {filepath}: requested={sy}, actual={actual_y}")

if __name__ == '__main__':
    asyncio.run(test())
