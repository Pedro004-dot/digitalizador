from flask_cors import CORS
import boto3
import requests
import time
import io
from flask import Flask, request, jsonify
from PyPDF2 import PdfMerger
from PIL import Image
import os
import logging

# Configurações
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = './scanner/scans'
AWS_ACCESS_KEY = 'AKIA6ODU356GIUTGAFGE'
AWS_SECRET_KEY = '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'
AWS_BUCKET_NAME = 'armazenadordocumentos'
AWS_REGION = 'sa-east-1'

# Configuração de logs
logging.basicConfig(level=logging.INFO)

def upload_to_s3(file_buffer, bucket_name, s3_key):
    """
    Faz o upload de um arquivo para o S3 a partir de um buffer na memória.
    """
    s3 = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY,
        aws_secret_access_key=AWS_SECRET_KEY,
        region_name=AWS_REGION,
        endpoint_url='https://s3.sa-east-1.amazonaws.com'  
    )
    try:
        s3.head_bucket(Bucket=bucket_name)
        logging.info(f"Bucket '{bucket_name}' encontrado.")
        s3.put_object(Bucket=bucket_name, Key=s3_key, Body=file_buffer.getvalue())
        logging.info(f"Arquivo enviado para o S3 com sucesso. Key: {s3_key}")
        return f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"
    except s3.exceptions.NoSuchBucket:
        logging.error(f"Bucket '{bucket_name}' não encontrado.")
        raise RuntimeError(f"O bucket '{bucket_name}' não existe.")
    except Exception as e:
        logging.error(f"Erro ao fazer upload para o S3: {str(e)}")
        raise RuntimeError(f"Erro ao fazer upload para o S3: {str(e)}")

# Função de Digitalização
def create_scan_job(scanner_url, format_type="image/jpeg", input_source="Feeder"):
    scan_settings = f'''<?xml version="1.0" encoding="UTF-8"?>
    <scan:ScanSettings xmlns:scan="http://schemas.hp.com/imaging/escl/2011/05/03">
        <scan:DocumentFormat>{format_type}</scan:DocumentFormat>
        <scan:InputSource>{input_source}</scan:InputSource>
    </scan:ScanSettings>'''

    response = requests.post(
        f"{scanner_url}/eSCL/ScanJobs",
        data=scan_settings,
        headers={'Content-Type': 'application/xml'}
    )

    if response.status_code == 201:
        return response.headers['Location']
    else:
        raise RuntimeError(f"Erro ao criar ScanJob: {response.status_code} - {response.text}")

def fetch_pages(scanner_url, scan_job_url):
    pages = []
    while True:
        response = requests.get(f"{scanner_url}{scan_job_url}/NextDocument", stream=True)
        if response.status_code == 200:
            page_path = f"page_{len(pages) + 1}.jpg"
            with open(page_path, 'wb') as file:
                file.write(response.content)
            pages.append(page_path)
            print(f"Página salva: {page_path}")
        elif response.status_code == 404:
            print("Todas as páginas foram processadas.")
            break
        else:
            raise RuntimeError(f"Erro ao obter página: {response.status_code} - {response.text}")
    return pages

def consolidate_to_pdf(image_files, output_pdf_path):
    images = [Image.open(img).convert('RGB') for img in image_files]
    images[0].save(output_pdf_path, save_all=True, append_images=images[1:])
    print(f"PDF consolidado em: {output_pdf_path}")

# Endpoint do Flask
@app.route('/scan/start', methods=['POST'])
def start_scan():
    """
    Endpoint para iniciar a digitalização.
    """
    try:
        payload = request.get_json()
        scanner = payload.get('scanner')
        if not scanner or not scanner.get('address'):
            return jsonify({"message": "Erro: Endereço do scanner não fornecido", "status": "error"}), 400

        scanner_url = f"http://{scanner['address']}:8080"
        format_type = payload.get('format', 'image/jpeg')  # Usar imagem como padrão
        input_source = payload.get('input_source', 'Feeder')

        # Criar ScanJob
        scan_job_url = create_scan_job(scanner_url, format_type, input_source)
        print(f"ScanJob criado em: {scanner_url}{scan_job_url}")

        # Buscar páginas digitalizadas
        pages = fetch_pages(scanner_url, scan_job_url)
        if not pages:
            return jsonify({"message": "Nenhuma página foi digitalizada.", "status": "error"}), 400

        # Consolidar em PDF
        output_pdf = f"{UPLOAD_FOLDER}/documento_{int(time.time())}.pdf"
        consolidate_to_pdf(pages, output_pdf)

        # Upload ao S3
        with open(output_pdf, 'rb') as pdf_file:
            pdf_buffer = io.BytesIO(pdf_file.read())
        s3_key = f"scans/documento_digitalizado_{int(time.time())}.pdf"
        file_url = upload_to_s3(pdf_buffer, AWS_BUCKET_NAME, s3_key)

        return jsonify({"message": "Digitalização concluída com sucesso.", "file_url": file_url, "status": "success"}), 200

    except Exception as e:
        return jsonify({"message": f"Erro no backend: {str(e)}", "status": "error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)