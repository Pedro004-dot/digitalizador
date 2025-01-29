import boto3

# Criar cliente S3
s3_client = boto3.client("s3")

# Nome do bucket
bucket_name = "armazenadordocumentos"

try:
    # Teste de listagem de objetos
    response = s3_client.list_objects_v2(Bucket=bucket_name)

    if "Contents" in response:
        print("✅ Conexão bem-sucedida! Listando arquivos:")
        for obj in response["Contents"]:
            print(f"📂 {obj['Key']}")
    else:
        print("📂 O bucket está vazio.")

except Exception as e:
    print(f"❌ Erro ao conectar no S3: {e}")