#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import webbrowser, threading
HOST,PORT='127.0.0.1',8080
url=f'http://{HOST}:{PORT}/index.html'
threading.Timer(0.8, lambda: webbrowser.open(url)).start()
print(f'VBNA Chapter 11 ERP đang chạy tại: {url}')
print('Nhấn Ctrl+C để dừng.')
ThreadingHTTPServer((HOST,PORT), SimpleHTTPRequestHandler).serve_forever()
