from flask import Flask, jsonify, request
import platform
import socket
from zeroconf import Zeroconf, ServiceBrowser
from threading import Event, Thread
from flask_cors import CORS

# Configurações
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Identificar o sistema operacional
def identify_os():
    os_name = platform.system()
    if os_name == "Windows":
        return "Windows"
    elif os_name in ["Linux", "Darwin"]:  # Darwin é macOS
        return "Unix"
    else:
        return "Unknown"

# Descoberta de dispositivos Bonjour para Unix (Linux/macOS)
class BonjourListener:
    def __init__(self):
        self.services = []
        self.event = Event()

    def remove_service(self, zeroconf, service_type, name):
        print(f"Serviço removido: {name}")

    def add_service(self, zeroconf, service_type, name):
        info = zeroconf.get_service_info(service_type, name)
        if info:
            self.services.append({
                "name": name,
                "address": info.parsed_scoped_addresses()[0] if info.parsed_scoped_addresses() else "Desconhecido",
                "port": info.port,
                "protocol": "eSCL",  # Define o protocolo detectado
            })
            print(f"Serviço encontrado: {name}")
        self.event.set()  # Sinaliza que pelo menos um serviço foi encontrado

    def update_service(self, zeroconf, service_type, name):
        print(f"Serviço atualizado: {name}")

def discover_bonjour_services(timeout=5):
    """
    Descobre serviços Bonjour em sistemas Unix por um tempo limitado.
    """
    zeroconf = Zeroconf()
    listener = BonjourListener()
    ServiceBrowser(zeroconf, "_http._tcp.local.", listener)

    # Aguarda até que serviços sejam encontrados ou o tempo limite expire
    listener.event.wait(timeout)
    zeroconf.close()

    return listener.services

# Descoberta de dispositivos WSD para Windows
def discover_wsd_devices(timeout=5):
    """
    Descobre dispositivos WSD em sistemas Windows.
    """
    message = """<?xml version="1.0" encoding="UTF-8"?>
    <e:Envelope xmlns:e="http://www.w3.org/2003/05/soap-envelope" xmlns:w="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:d="http://schemas.xmlsoap.org/ws/2005/04/discovery">
      <e:Header>
        <w:MessageID>uuid:{}</w:MessageID>
        <w:To>urn:schemas-xmlsoap-org:ws:2005:04/discovery</w:To>
        <w:Action>http://schemas.xmlsoap.org/ws/2005:04/discovery/Probe</w:Action>
      </e:Header>
      <e:Body>
        <d:Probe>
          <d:Types>dn:Printer</d:Types>
        </d:Probe>
      </e:Body>
    </e:Envelope>
    """.format(socket.gethostname())

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    sock.settimeout(timeout)

    devices = []
    try:
        sock.sendto(message.encode('utf-8'), ('239.255.255.250', 3702))
        while True:
            try:
                data, addr = sock.recvfrom(4096)
                devices.append({
                    "address": addr[0],
                    "protocol": "WSD",
                    "info": data.decode('utf-8', errors='ignore')
                })
            except socket.timeout:
                break
    finally:
        sock.close()

    return devices

@app.route('/scanners', methods=['GET'])
def list_scanners():
    """
    Endpoint para listar scanners disponíveis.
    """
    try:
        os_type = identify_os()
        if os_type == "Unix":
            devices = discover_bonjour_services(timeout=5)
        elif os_type == "Windows":
            devices = discover_wsd_devices(timeout=5)
        else:
            return jsonify({"status": "error", "message": "Sistema operacional não suportado"}), 400

        if not devices:
            return jsonify({"status": "error", "message": "Nenhum scanner encontrado"}), 404

        return jsonify({"status": "success", "scanners": devices})
    except Exception as e:
        print("Erro no backend:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/scanners/manual', methods=['POST'])
def configure_manual_scanner():
    """
    Permite configurar um scanner manualmente.
    """
    try:
        data = request.json
        address = data.get("address")
        protocol = data.get("protocol", "eSCL")

        if not address:
            return jsonify({"status": "error", "message": "Endereço IP do scanner é obrigatório"}), 400

        manual_scanner = {
            "address": address,
            "protocol": protocol,
        }
        return jsonify({"status": "success", "scanner": manual_scanner})

    except Exception as e:
        print("Erro no backend:", str(e))
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)