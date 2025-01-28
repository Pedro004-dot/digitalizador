import pdfplumber
import pytesseract
from PIL import Image
import openai
import os
from openai import OpenAI

client = OpenAI(api_key="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")


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

def classify_document_with_gpt(text):
    """
    Classifica o documento com GPT para determinar a pasta de destino e sugerir um título.
    
    :param text: Texto extraído do documento.
    :return: Nome da pasta sugerida e título.
    """
    try:
        prompt = f"""
        Analise o seguinte texto de um documento e determine um título claro sobre o conteúdo do documento. 
        Depois disso, determine em qual pasta ele deve ser anexado:
        Texto: {text}
        Pastas disponíveis: Licitações/ano, Extrato Financeiro/ano.
        Responda no seguinte formato:
        Título: <título sugerido>
        Pasta: <nome da pasta>
        """
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            temperature=0,
            max_tokens=200
        )
        result = response.choices[0].text.strip()
        return result
    except Exception as e:
        print(f"Erro ao classificar o documento com GPT: {e}")
        return "Título: Não definido\nPasta: outros"

# Testar o script integrado
if __name__ == "__main__":
    pdf_path = input("Digite o caminho completo do arquivo PDF: ").strip()
    print("\nProcessando o arquivo...")

    # Extrair texto do PDF
    extracted_text = extract_text_from_pdf(pdf_path)
    if "Erro" in extracted_text:
        print(f"Erro durante a extração de texto: {extracted_text}")
    else:
        print("\nTexto extraído do documento:")
        print(extracted_text[:500])  # Mostra os primeiros 500 caracteres

        # Classificar o documento usando GPT
        classification = classify_document_with_gpt(extracted_text)
        print("\nClassificação do Documento:")
        print(classification)