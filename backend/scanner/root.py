import pdfplumber
from GPT import classify_document_with_gpt

def extract_text_from_pdf(pdf_path):
    """
    Extrai texto de um PDF usando pdfplumber.
    
    :param pdf_path: Caminho do arquivo PDF.
    :return: Texto extraído do PDF.
    """
    import pdfplumber
import pytesseract
from PIL import Image
import os

print(f"Tesseract OCR encontrado em: {pytesseract.pytesseract.tesseract_cmd}")
def extract_text_with_ocr(image_path):
    """
    Extrai texto de uma imagem usando OCR (Tesseract).
    """
    try:
        text = pytesseract.image_to_string(Image.open(image_path), lang="por")  # 'por' para Português
        return text
    except Exception as e:
        return f"Erro ao processar OCR: {str(e)}"

def extract_text_from_pdf(pdf_path):
    """
    Extrai texto das primeiras 5 páginas de um PDF usando pdfplumber e Tesseract OCR, se necessário.
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            extracted_text = ""
            total_pages = len(pdf.pages)
            print(f"O PDF contém {total_pages} páginas.\n")

            for i, page in enumerate(pdf.pages[:5]):  # Limitar às 5 primeiras páginas
                print(f"Processando página {i + 1}...")
                text = page.extract_text()
                if text:
                    extracted_text += f"\n--- Página {i + 1} ---\n{text}"
                else:
                    print(f"Nenhum texto encontrado na página {i + 1}. Tentando OCR...")
                    # Salvar a página como imagem e usar OCR
                    image_path = f"temp_page_{i + 1}.png"
                    page.to_image().save(image_path)
                    ocr_text = extract_text_with_ocr(image_path)
                    extracted_text += f"\n--- Página {i + 1} (OCR) ---\n{ocr_text}"
                    os.remove(image_path)  # Remover a imagem temporária

            return extracted_text
    except FileNotFoundError:
        return f"Arquivo não encontrado: {pdf_path}"
    except Exception as e:
        return f"Erro ao processar o PDF: {str(e)}"

# Testar o script
if __name__ == "__main__":
    pdf_path = input("Digite o caminho completo do arquivo PDF: ").strip()
    print("\nProcessando o arquivo...")
    result = extract_text_from_pdf(pdf_path)
    print("\n=== Texto Extraído das Primeiras 5 Páginas ===\n")
    print(result)

def catalogar_documento(pdf_path):
    """
    Processa o PDF, extrai texto e classifica usando o GPT.
    
    :param pdf_path: Caminho do arquivo PDF.
    :return: Nome da pasta sugerida.
    """
    # Extrair texto do PDF
    texto = extract_text_from_pdf(pdf_path)
    
    if not texto.strip():
        print("Nenhum texto foi extraído do documento.")
        return "outros"
    
    # Classificar o texto usando GPT
    folder = classify_document_with_gpt(texto)
    print(f"Documento classificado na pasta: {folder}")
    return folder