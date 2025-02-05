import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

# Configurações da AWS
AWS_ACCESS_KEY_ID = "AKIA6ODU356GDWP4MBOQ"
AWS_SECRET_ACCESS_KEY = "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"
AWS_BUCKET_NAME = "armazenadordocumentos"
AWS_REGION = "sa-east-1"

def test_s3_connection():
    try:
        # Criar o cliente S3
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_REGION,
        )

        # Tenta listar os objetos no bucket
        print(f"Conectando ao bucket: {AWS_BUCKET_NAME}...")
        response = s3_client.list_objects_v2(Bucket=AWS_BUCKET_NAME)

        if "Contents" in response:
            print("✅ Conexão bem-sucedida! Lista de arquivos no bucket:")
            for obj in response["Contents"]:
                print(f"- {obj['Key']}")
        else:
            print("✅ Conexão bem-sucedida, mas o bucket está vazio.")

    except NoCredentialsError:
        print("❌ Erro: Credenciais não fornecidas ou inválidas.")
    except PartialCredentialsError:
        print("❌ Erro: Credenciais fornecidas estão incompletas.")
    except Exception as e:
        print(f"❌ Erro ao conectar no S3: {str(e)}")

# Executar teste de conexão
if __name__ == "__main__":
    test_s3_connection()