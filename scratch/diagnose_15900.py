import asyncio
import websockets
import json
import urllib.request

async def test():
    with urllib.request.urlopen('http://127.0.0.1:9222/json') as resp:
        ws_url = json.loads(resp.read().decode())[0]['webSocketDebuggerUrl']
    async with websockets.connect(ws_url) as ws:
        js = '''(() => {
            window.scrollTo({ top: 15900, behavior: 'instant' });
            const getR = (el) => {
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return { top: r.top, bottom: r.bottom, height: r.height };
            };
            const app = document.getElementById('our-approach');
            const clos = document.getElementById('closing-experience');
            return {
                scrollY: window.scrollY,
                approachRect: getR(app),
                closingRect: getR(clos)
            };
        })()'''
        await ws.send(json.dumps({'id': 1, 'method': 'Runtime.evaluate', 'params': {'expression': js, 'returnByValue': True}}))
        res = json.loads(await ws.recv())
        print(json.dumps(res['result']['result']['value'], indent=2))

if __name__ == '__main__':
    asyncio.run(test())
