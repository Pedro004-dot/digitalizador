from openai import OpenAI

client = OpenAI(api_key="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")

# Configuração da chave da API OpenAI
  # Substitua pela sua chave da API OpenAI

def test_gpt_api(prompt):
    """
    Testa a API do GPT usando a nova interface baseada em mensagens.
    
    :param prompt: Texto de entrada para o GPT.
    :return: Resposta gerada pelo GPT.
    """
    try:
        # Solicitação à API no formato de mensagens
        response = client.chat.completions.create(model="gpt-3.5-turbo",  # Ou "gpt-4", dependendo do modelo que você quer usar
        messages=[
            {"role": "system", "content": "Você é um assistente útil e conhece diversos assuntos."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,  # Grau de aleatoriedade da resposta
        max_tokens=200)
        # Retorna o texto gerado
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Erro ao acessar a API do GPT: {e}"

# Teste do GPT
if __name__ == "__main__":
    # Prompt para testar
    prompt = input("Digite o prompt para o GPT: ").strip()
    print("\nProcessando...\n")
    resposta = test_gpt_api(prompt)
    print("Resposta do GPT:")
    print(resposta)
            prompt = "Analise o seguinte texto de um documento e determine um título claro sobre o conteúdo do documento.Depois disso, determine em qual pasta ele deve ser anexado: Texto: {text} Pastas disponíveis: Licitações/ano, Extrato Financeiro/ano. Responda no seguinte formato: Título: <título sugerido> Pasta: <nome da pasta>"
