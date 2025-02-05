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



# Configuração de logs
logging.basicConfig(level=logging.INFO)

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)


import os

def verificar_ou_criar_diretorio(diretorio):
    """
    Verifica se o diretório existe e o cria, se necessário.
    """
    if not os.path.exists(diretorio):
        os.makedirs(diretorio)
        logging.info(f"Diretório '{diretorio}' criado com sucesso.")
    else:
        logging.info(f"Diretório '{diretorio}' já existe.")
def criar_pasta_s3(bucket_name, folder_path):
    """
    Cria a estrutura da pasta no S3 se não existir.
    """
    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=folder_path, Delimiter="/")
        if "Contents" not in response and "CommonPrefixes" not in response:
            # A pasta não existe; criar
            s3_client.put_object(Bucket=bucket_name, Key=(folder_path + "/"))
            logging.info(f"Pasta '{folder_path}' criada no S3.")
        else:
            logging.info(f"Pasta '{folder_path}' já existe no S3.")
    except Exception as e:
        logging.error(f"Erro ao criar/verificar pasta no S3: {str(e)}")
        raise RuntimeError(f"Erro ao criar/verificar pasta no S3: {str(e)}")

def upload_para_s3(bucket_name, folder_level1, folder_level2, file_name, file_buffer):
    """
    Faz o upload do arquivo para a pasta correta no S3, criando as pastas necessárias.
    """
    try:
        print(folder_level1, folder_level2,file_name)
        # Verificar e criar a pasta de nível 1
        if folder_level1 not in ["Licitacoes", "Diversos", "Empenhos"]:
            raise ValueError("Pasta de nível 1 inválida.")
        
        # Caminho para a pasta de nível 2
        nivel2_path = f"{folder_level1}/{folder_level2}"

        # Verificar e criar a pasta de nível 2 (ano)
        criar_pasta_s3(bucket_name, nivel2_path)

        # Caminho completo do arquivo
        s3_key = f"{nivel2_path}/{file_name}"

        # Upload do arquivo
        s3_client.put_object(Bucket=bucket_name, Key=s3_key, Body=file_buffer.getvalue())
        logging.info(f"Arquivo '{file_name}' enviado para '{s3_key}'.")
        return f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{s3_key}"
    except ValueError as ve:
        logging.error(f"Erro de validação: {str(ve)}")
        raise
    except Exception as e:
        logging.error(f"Erro ao fazer upload para o S3: {str(e)}")
        raise

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
        file_name = payload.get('file_name')
        folder_level1 = payload.get('folder_level1')  # Ex: "Licitacoes"
        folder_level2 = payload.get('folder_level2')  # Ex: "2023"

        if not scanner or not scanner.get('address'):
            return jsonify({"message": "Erro: Endereço do scanner não fornecido", "status": "error"}), 400

        if not file_name or not folder_level1 or not folder_level2:
            return jsonify({"message": "Erro: Nome, pasta ou ano ausentes.", "status": "error"}), 400

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

        # Certificar-se de que o diretório local existe
        local_path = f"{UPLOAD_FOLDER}/{folder_level1}/{folder_level2}"
        os.makedirs(local_path, exist_ok=True)

        # Consolidar em PDF
        output_pdf = f"{local_path}/{file_name}.pdf"
        consolidate_to_pdf(pages, output_pdf)

        # Upload ao S3
        with open(output_pdf, 'rb') as pdf_file:
            pdf_buffer = io.BytesIO(pdf_file.read())
            file_url = upload_para_s3(AWS_BUCKET_NAME, folder_level1, folder_level2, file_name, pdf_buffer)

        return jsonify({"message": "Digitalização concluída com sucesso.", "file_url": file_url, "status": "success"}), 200

    except Exception as e:
        logging.error(f"Erro durante o processo de digitalização: {str(e)}")
        return jsonify({"message": f"Erro no backend: {str(e)}", "status": "error"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5004)