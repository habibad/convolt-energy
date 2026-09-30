import asyncio
import websockets
import json
import urllib.request

async def test():
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']
    async with websockets.connect(ws_url) as ws:
        js = '''(() => {
            const sections = ['hero', 'our-approach', 'closing-experience'].map(id => {
                const el = document.getElementById(id);
                if (!el) return { id, error: 'not found' };
                const rect = el.getBoundingClientRect();
                return {
                    id,
                    top: rect.top + window.scrollY,
                    height: el.offsetHeight,
                    bottom: rect.top + window.scrollY + el.offsetHeight
                };
            });
            return {
                scrollY: window.scrollY,
                scrollHeight: document.body.scrollHeight,
                sections
            };
        })()'''
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print(json.dumps(res['result']['result']['value'], indent=2))

if __name__ == '__main__':
    asyncio.run(test())
