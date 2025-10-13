#!/usr/bin/env python3
"""
簡單的 HTTP 伺服器，用於提供遊戲模擬器所需的 JSON 檔案
支援 CORS，允許從遊戲客戶端訪問

使用方法:
    python serve_json.py [port] [directory]

參數:
    port (可選): 伺服器端口，預設 9000
    directory (可選): 要提供的目錄，預設為當前目錄

範例:
    python serve_json.py
    python serve_json.py 8080
    python serve_json.py 9000 ./game_output
"""

import sys
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from functools import partial


class CORSRequestHandler(SimpleHTTPRequestHandler):
    """支援 CORS 的 HTTP 請求處理器"""
    
    def end_headers(self):
        """添加 CORS 標頭"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def do_OPTIONS(self):
        """處理 OPTIONS 請求（CORS preflight）"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """自定義日誌格式"""
        print(f"[{self.log_date_time_string()}] {format % args}")


def run_server(port=9000, directory=None):
    """
    啟動 HTTP 伺服器
    
    Args:
        port: 伺服器端口
        directory: 要提供的目錄路徑
    """
    if directory:
        os.chdir(directory)
        print(f"提供目錄: {os.path.abspath(directory)}")
    else:
        print(f"提供目錄: {os.path.abspath('.')}")
    
    handler_class = CORSRequestHandler
    server_address = ('', port)
    httpd = HTTPServer(server_address, handler_class)
    
    print(f"\n伺服器已啟動！")
    print(f"URL: http://localhost:{port}/")
    print(f"按 Ctrl+C 停止伺服器\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n伺服器已停止")
        httpd.server_close()


def main():
    """主函數"""
    port = 9000
    directory = None
    
    # 解析命令列參數
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"錯誤: 端口必須是數字")
            sys.exit(1)
    
    if len(sys.argv) > 2:
        directory = sys.argv[2]
        if not os.path.isdir(directory):
            print(f"錯誤: 目錄不存在: {directory}")
            sys.exit(1)
    
    run_server(port, directory)


if __name__ == '__main__':
    main()
