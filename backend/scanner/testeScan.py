import requests
import xml.etree.ElementTree as ET
import time

# URL base do scanner
base_url = 'http://192.168.15.182:8080'

# Endpoint para iniciar a digitalização
scan_url = f'{base_url}/eSCL/ScanJobs'

# Corpo da solicitação em XML para configurar a digitalização
scan_request = '''<?xml version="1.0" encoding="UTF-8"?>
<scan:ScanSettings xmlns:scan="http://schemas.hp.com/imaging/escl/2011/05/03">
    <scan:DocumentFormat>image/jpeg</scan:DocumentFormat>
    <scan:InputSource>Feeder</scan:InputSource>
    <scan:PageSize>
        <scan:Width>215.9</scan:Width>
        <scan:Height>279.4</scan:Height>
    </scan:PageSize>
    <scan:Resolution>
        <scan:XResolution>300</scan:XResolution>
        <scan:YResolution>300</scan:YResolution>
    </scan:Resolution>
    <scan:ColorMode>Color</scan:ColorMode>
</scan:ScanSettings>'''

# Cabeçalhos da solicitação
headers = {'Content-Type': 'application/xml'}

# Enviar a solicitação de digitalização
response = requests.post(scan_url, data=scan_request, headers=headers)

# Verificar se a solicitação foi bem-sucedida
if response.status_code == 201:
    # Extrair a URL do trabalho de digitalização a partir do cabeçalho 'Location'
    job_url = response.headers['Location']
    print(f'Trabalho de digitalização iniciado: {job_url}')

    # Verificar o status do trabalho de digitalização
    while True:
        job_response = requests.get(job_url)
        job_status = ET.fromstring(job_response.content)
        state = job_status.find('.//{http://schemas.hp.com/imaging/escl/2011/05/03}State').text
        if state == 'Completed':
            print('Digitalização concluída.')
            break
        elif state == 'Processing':
            print('Digitalizando...')
        else:
            print(f'Status desconhecido: {state}')
            break
        time.sleep(1)

    # Baixar a imagem digitalizada
    image_url = f'{job_url}/NextDocument'
    image_response = requests.get(image_url)
    if image_response.status_code == 200:
        with open('documento_digitalizado.jpg', 'wb') as f:
            f.write(image_response.content)
        print('Imagem digitalizada salva como "documento_digitalizado.jpg".')
    else:
        print('Falha ao baixar a imagem digitalizada.')
else:
    print(f'Erro ao iniciar a digitalização: {response.status_code}')