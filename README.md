# Urban Jarvis API (Node.js + Express + MVC)

API construída em Node.js para servir como “cérebro” do projeto Urban Jarvis — um totem baseado em ESP32 S3 que exibe, em tempo real, os horários de ônibus da URBS em estações como o Terminal do Centenário, em Curitiba. O backend filtra, organiza e armazena os dados volumosos da URBS antes de enviá-los ao microcontrolador, evitando estourar a memória do dispositivo embarcado.

## Visão Geral do Projeto

- **Urban Jarvis (ESP32 S3 + TFT Touch + LED RGB)**  
  Dispositivo de campo que se conecta ao Wi-Fi, consulta este backend e mostra o próximo ônibus de forma acessível, com botões touch, feedback luminoso e atualização automática de horário. Em caso de falta de internet, trabalha com dados cacheados.

- **Backend Node.js (este repositório)**  
  Serviço web que conversa com a API oficial da URBS, persiste os dados em Postgres e expõe endpoints enxutos para o ESP32. A lógica em Node também ordena e filtra os horários (ex.: ignora horários já passados, prioriza intervalos úteis) para que o microcontrolador receba apenas o necessário.

- **Desafio de Estrutura de Dados**  
  No firmware, os horários são armazenados em árvores binárias de busca (BST) para garantir consultas rápidas ao “próximo ônibus”. Esta API entrega os dados já prontos para alimentar essa estrutura sem sobrecarregar memória ou rede.

## Motivação

1. **Limitações do ESP32 S3**: a URBS devolve listas grandes de horários e metadados. Processar tudo diretamente no microcontrolador poderia consumir muita RAM, tempo de CPU e banda.
2. **Filtro inteligente**: centralizamos o tratamento em Node, que pode rodar em infraestrutura mais robusta (local ou cloud), aplicar regras de negócios e servir apenas o essencial.
3. **Experiência urbana**: disponibilizar informações de transporte público em pontos físicos aumenta acessibilidade, especialmente para quem não tem aplicativos no celular.

## Como o fluxo funciona

1. O backend chama a URBS e normaliza os dados (dia, ponto, código da linha).
2. Os registros são persistidos em Postgres via Sequelize, permitindo histórico e cache.
3. Endpoints específicos entregam recortes enxutos: por linha, por dia, por ponto.
4. O ESP32 acessa o endpoint adequado (`/api/urbs/horarios-linha/db/dia-ponto`) e monta/atualiza a BST local.
5. A tela TFT mostra o horário atual, o próximo ônibus e um carrossel com os demais horários.
6. A lógica embarcada também disponibiliza um web server local para debug/monitoramento.

## Arquitetura do Backend

- **Framework**: Express, seguindo padrão MVC (controllers, services, routes).
- **ORM**: Sequelize (dialeto Postgres).
- **Banco**: Postgres em contêiner Docker (via `docker compose`).
- **HTTP Client**: Axios para interagir com a API URBS.
- **Estrutura**: `src/` com `app.js`, `server.js`, `config/`, `controllers/`, `models/`, `routes/` e `services/`.

## Requisitos

- Node.js 18+ (recomendado 20+).
- Docker e Docker Compose.
- Acesso à internet para consumir a API URBS.

## Configuração

1. **Instale dependências**
   ```bash
   npm install
   ```
2. **Crie o arquivo `.env`**
   ```bash
   PORT=3000
   CORS_ORIGIN=*
   POSTGRES_DB=urbs
   POSTGRES_USER=urbs
   POSTGRES_PASSWORD=urbs
   POSTGRES_PORT=5432
   DATABASE_URL=postgres://urbs:urbs@localhost:5432/urbs
   EXTERNAL_API_BASE=https://jsonplaceholder.typicode.com
   ```
3. **Suba o Postgres**
   ```bash
   docker compose up -d
   ```
4. **Teste saúde do banco**  
   Depois que o app estiver rodando: `GET /api/db/health`.

## Executando

- **Desenvolvimento (hot reload com nodemon)**
  ```bash
  npm run dev
  ```
- **Produção simples**
  ```bash
  npm start
  ```
  O servidor fica disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

## Endpoints principais

- **Saúde**
  - `GET /health`
  - `GET /api/db/health`
- **URBS**
  - `GET /api/urbs/horarios-linha?linha=303&c=858ce` → Proxy direto.
  - `POST /api/urbs/horarios-linha/sync?linha=303&c=858ce` → Sincroniza e grava no Postgres.
  - `GET /api/urbs/horarios-linha/db?cod=303&limit=700` → Consulta geral.
  - `GET /api/urbs/horarios-linha/db/dia?dia=1&cod=303&limit=700` → Filtra por dia.
  - `GET /api/urbs/horarios-linha/db/dia-ponto?dia=1&ponto=TERMINAL%20CENTENARIO&cod=303&limit=700` → Filtra por dia e ponto (principal consumo do ESP32).
- **CRUD de exemplo (Items)**
  - `GET /api/v1/items`
  - `GET /api/v1/items/:id`
  - `POST /api/v1/items`
  - `PUT /api/v1/items/:id`
  - `DELETE /api/v1/items/:id`

## Estrutura de pastas (resumo)

```
src/
  app.js
  server.js
  config/
    database.js
  controllers/
    ItemController.js
  models/
    Item.js
    index.js
  routes/
    index.js
    v1.js
  services/
    ExternalApiService.js

docker-compose.yml
.env (local)
```

## Hardware: ESP32 S3 + Estruturas de Dados

- Microcontrolador com Wi-Fi/Bluetooth integrado, ideal para IoT urbano.
- Display TFT sensível ao toque e LED RGB facilitam interação e feedback.
- Dados vindos desta API alimentam uma árvore binária (BST) que permite encontrar rapidamente o próximo horário igual ou posterior ao atual.
- Caso falte internet, o firmware trabalha com o payload mais recente armazenado localmente.

## Equipe

Projeto acadêmico do Centro Universitário UniBrasil, desenvolvido por:

- João Vitor Soares da Silva
- Matheus Bilro Pereira Leite
- Leonardo Bora da Costa
- Luan Constancio

## Licença

MIT
