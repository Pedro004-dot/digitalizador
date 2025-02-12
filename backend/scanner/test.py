import os
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import os

# Set Tesseract paths
os.environ['TESSDATA_PREFIX'] = '/opt/homebrew/share/tessdata'
os.environ['PATH'] += os.pathsep + '/opt/homebrew/bin/'

import pytesseract
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'
# Configurações do Tesseract
os.environ['TESSDATA_PREFIX'] = '/opt/homebrew/share/tessdata'  # Diretório onde está por.traineddata
pytesseract.pytesseract.tesseract_cmd = '/opt/homebrew/bin/tesseract'  # Caminho para o executável do Tesseract

def ocr_pdf(file_path: str, dpi: int = 300, lang: str = "por") -> str:
    """
    Converte um PDF em imagens e extrai o texto via OCR usando pytesseract.

    :param file_path: Caminho para o arquivo PDF.
    :param dpi: Resolução para converter o PDF em imagens.
    :param lang: Idioma para o OCR (ex.: 'por' para português).
    :return: Texto extraído de todas as páginas do PDF.
    """
    text = ""
    try:
        # Converte cada página do PDF em imagens
        images = convert_from_path(file_path, dpi=dpi)
        for i, image in enumerate(images):
            print(f"  Processando página {i+1} de {len(images)}...")
            page_text = pytesseract.image_to_string(image, lang=lang)
            text += page_text + "\n"
    except Exception as e:
        print(f"Erro ao processar {file_path}: {e}")
    return text

def main():
    file_path = input("Digite o caminho do arquivo PDF:\n").strip()
    print(f"\nProcessando {file_path} com OCR...")
    extracted_text = ocr_pdf(file_path)
    print("\n=== Texto Extraído ===")
    print(extracted_text)

if __name__ == "__main__":
    main()