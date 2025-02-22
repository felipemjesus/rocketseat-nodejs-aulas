# nest-clean

Todos os comandos foram executados utilizando o sistema operacional Ubuntu 24.04 LTS

## Instalação

```bash
npm install
```

### Gerar chave privada e publica

```bash
openssl genpkey -algorithm RSA -out ./src/storage/security/private_key.pem -pkeyopt rsa_keygen_bits:2048
```

```bash
openssl rsa -in ./src/storage/security/private_key.pem -pubout -out ./src/storage/security/public_key.pem
```

## Execução

```bash
npm run start:dev
```
