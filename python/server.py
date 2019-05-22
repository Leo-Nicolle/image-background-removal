
#!/usr/bin/env python

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import SocketServer
from io import BytesIO
import seg



class S(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204, "ok")
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With, Content-type")

    def _set_headers(self, content_length):
        print(content_length)
        self.send_response(200)
        self.send_header('Content-type', 'image/png')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', str(content_length))

        self.end_headers()

    def do_POST(self, *args, **kwargs):
        length = int(self.headers["Content-Length"])
        binary_data = self.rfile.read(length)
        image= seg.extract_background(binary_data)
        with BytesIO() as file:
            image.save(file, 'PNG')
            data = file.getvalue()
            self._set_headers(len(data))
            self.wfile.write(data)


def run(server_class=HTTPServer, handler_class=S, port=3333):
    server_address = ('localhost', port)
    httpd = server_class(server_address, handler_class)
    print 'Starting http...'
    httpd.serve_forever()

if __name__ == "__main__":
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
