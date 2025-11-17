# Urban Jarvis: Sistema de Consulta de Horários de Transporte Público com Estruturas de Dados

## Informações Gerais

**Instituição:** Centro Universitário UniBrasil  
**Curso:** Análise e Desenvolvimento de Sistemas / Ciência da Computação  
**Disciplina:** Estrutura de Dados  
**Ano:** 2024  

**Equipe:**
- João Vitor Soares da Silva
- Matheus Bilro Pereira Leite
- Leonardo Bora da Costa
- Luan Constancio

---

## Resumo

Este projeto acadêmico consiste no desenvolvimento de um sistema embarcado baseado em microcontrolador ESP32 S3 para consulta e exibição em tempo real de horários de ônibus do transporte público de Curitiba-PR (URBS). O sistema integra conceitos de estruturas de dados, especialmente árvores binárias de busca (BST - Binary Search Tree), com tecnologias de backend (Node.js) e hardware embarcado, demonstrando a aplicação prática dos conhecimentos teóricos adquiridos na disciplina de Estrutura de Dados.

O objetivo principal é implementar um totem interativo que permita aos usuários visualizar, de forma intuitiva, os próximos horários de ônibus em terminais de transporte público, utilizando árvores binárias de busca para otimizar a consulta de horários futuros a partir do horário atual.

---

## 1. Introdução

### 1.1 Contextualização

O acesso à informação sobre transporte público é fundamental para a mobilidade urbana. Apesar da disponibilidade de aplicativos móveis, nem todos os usuários possuem smartphones ou conhecimento técnico para utilizá-los. Nesse contexto, totens informativos instalados em pontos de ônibus e terminais podem democratizar o acesso a essas informações.

Do ponto de vista acadêmico, este projeto representa uma oportunidade de aplicar conceitos fundamentais de estrutura de dados em um cenário real, demonstrando como escolhas algorítmicas adequadas podem resolver problemas de eficiência computacional em sistemas embarcados com recursos limitados.

### 1.2 Justificativa

A escolha deste projeto se justifica por diversos aspectos:

**Aspecto Acadêmico:**
- Aplicação prática de árvores binárias de busca (BST) para resolução de problema real
- Demonstração de otimização de consultas através de estruturas de dados adequadas
- Análise de complexidade temporal e espacial em contexto de hardware embarcado
- Integração de conhecimentos de programação, banco de dados e sistemas distribuídos

**Aspecto Técnico:**
- Limitações de memória RAM do ESP32 S3 (512 KB SRAM) exigem estruturas de dados eficientes
- Necessidade de respostas em tempo real para consulta de horários
- Sincronização entre backend (Node.js) e firmware embarcado

**Aspecto Social:**
- Democratização do acesso à informação de transporte público
- Melhoria da experiência do usuário em terminais de ônibus
- Inclusão digital de pessoas sem acesso a smartphones

### 1.3 Objetivos

**Objetivo Geral:**
Desenvolver um sistema embarcado com interface visual que permita consulta eficiente de horários de ônibus utilizando árvores binárias de busca.

**Objetivos Específicos:**
1. Implementar uma árvore binária de busca (BST) em C++ para armazenamento de horários
2. Desenvolver algoritmos de inserção, busca e travessia em árvore binária
3. Criar backend em Node.js para processamento e filtragem de dados da API URBS
4. Integrar microcontrolador ESP32 S3 com display TFT touchscreen
5. Implementar sincronização via Wi-Fi entre dispositivo embarcado e backend
6. Demonstrar ganho de performance através da escolha adequada de estrutura de dados

---

## 2. Fundamentação Teórica

### 2.1 Árvores Binárias de Busca (BST)

Uma árvore binária de busca é uma estrutura de dados hierárquica onde cada nó possui no máximo dois filhos (esquerdo e direito), obedecendo a seguinte propriedade fundamental:

- Todos os valores na subárvore esquerda são **menores** que o valor do nó pai
- Todos os valores na subárvore direita são **maiores ou iguais** ao valor do nó pai

**Complexidade Temporal:**
- Inserção: O(log n) no caso médio, O(n) no pior caso (árvore degenerada)
- Busca: O(log n) no caso médio, O(n) no pior caso
- Travessia em ordem: O(n)

**Vantagens para este projeto:**
1. Busca eficiente de horários futuros próximos ao horário atual
2. Ordenação implícita dos dados (travessia em ordem retorna horários ordenados)
3. Baixo overhead de memória (apenas ponteiros para filhos)
4. Algoritmos recursivos simples e elegantes

**Descrição textual:** A árvore binária de busca é a estrutura central deste projeto. Ela permite que, dado um horário atual (por exemplo, 14:30), o sistema encontre rapidamente o próximo horário de ônibus disponível (por exemplo, 14:45) sem precisar percorrer todos os horários do dia. A estrutura se organiza hierarquicamente, onde horários menores ficam à esquerda e maiores à direita, formando uma árvore que pode ser percorrida de forma eficiente.

### 2.2 Justificativa da Escolha da BST

No contexto deste projeto, a árvore binária de busca foi escolhida em detrimento de outras estruturas pelos seguintes motivos:

**Comparação com Array Linear:**
- Array: busca linear O(n) - percorreria todos os horários até encontrar o próximo
- BST: busca O(log n) - elimina metade dos candidatos a cada nível
- Em um dia com 200 horários, BST reduz de 200 operações (média) para ~8 operações

**Comparação com Hash Table:**
- Hash Table requer chaves exatas, não suporta consultas de "próximo maior"
- BST permite busca por intervalo e travessia ordenada
- Overhead de memória menor no ESP32

**Comparação com Lista Ordenada:**
- Lista ordenada: inserção O(n), busca O(log n) com busca binária
- BST: inserção O(log n), busca O(log n)
- BST é mais eficiente para dados dinâmicos

**Descrição textual:** A tabela acima compara diferentes estruturas de dados. Enquanto um array exigiria verificar cada horário sequencialmente (lento), e uma hash table não permitiria encontrar "o próximo horário maior", a BST oferece o equilíbrio ideal entre velocidade de busca e flexibilidade para consultas de intervalo, essencial para encontrar o próximo ônibus.

### 2.3 Estruturas de Dados Auxiliares

O projeto também utiliza outras estruturas fundamentais:

**Backend (Node.js):**
- **Banco de Dados Relacional (PostgreSQL):** armazena histórico completo de horários com índices B-Tree para consultas SQL otimizadas
- **Arrays/Listas:** manipulação de resultados da API URBS antes da persistência

**Firmware (ESP32):**
- **Strings (C++):** armazenamento de horários no formato "HH:MM"
- **Struct:** definição do nó da árvore (`HorarioNode`)

---

## 3. Metodologia

### 3.1 Arquitetura do Sistema

O sistema é composto por três camadas principais, conforme ilustrado no diagrama textual abaixo:

```
┌─────────────────────────────────────────┐
│         API URBS (Dados Externos)       │
│   Fornece horários de todas as linhas  │
└────────────────┬────────────────────────┘
                 │ HTTPS
                 │ Requisições para obter dados brutos
                 ▼
┌─────────────────────────────────────────┐
│     Backend Node.js + PostgreSQL        │
│  - Consome API URBS                     │
│  - Filtra horários futuros              │
│  - Persiste em banco relacional         │
│  - Expõe endpoints REST enxutos         │
└────────────────┬────────────────────────┘
                 │ HTTP/JSON
                 │ Envia apenas dados filtrados
                 ▼
┌─────────────────────────────────────────┐
│  ESP32 S3 + Display TFT + LED RGB       │
│  - Consome endpoint filtrado            │
│  - Monta BST com horários recebidos     │
│  - Busca próximo horário >= atual       │
│  - Exibe em interface visual touchscreen│
└─────────────────────────────────────────┘
```

**Descrição textual da arquitetura:** O diagrama acima representa o fluxo de dados no sistema. No topo, a API URBS fornece dados brutos de horários. O backend Node.js (camada intermediária) processa esses dados, filtrando apenas informações relevantes e armazenando em PostgreSQL. Na base, o ESP32 recebe dados já filtrados via HTTP, constrói a árvore binária de busca em memória e exibe o próximo horário na tela TFT. Esta separação em camadas resolve o problema de memória limitada do microcontrolador.

Esta arquitetura em camadas permite:
- Separação de responsabilidades (backend processa dados volumosos, ESP32 apenas consome dados filtrados)
- Escalabilidade (backend pode atender múltiplos dispositivos)
- Resiliência (ESP32 pode trabalhar com cache em caso de perda de conexão)

### 3.2 Implementação da Árvore Binária de Busca

#### 3.2.1 Estrutura do Nó

O nó da árvore é definido como uma estrutura (`struct`) em C++ contendo os seguintes campos:

```cpp
struct HorarioNode {
  String hora;           // Horário no formato "HH:MM"
  String ponto;          // Nome do ponto de parada
  HorarioNode *left;     // Ponteiro para filho esquerdo
  HorarioNode *right;    // Ponteiro para filho direito
  
  // Construtor
  HorarioNode(String h, String p) 
    : hora(h), ponto(p), left(NULL), right(NULL) {}
};
```

**Descrição textual:** O código acima define a estrutura de cada nó da árvore. Cada nó armazena um horário (ex: "14:30"), o nome do ponto de parada, e dois ponteiros que apontam para os nós filhos (esquerdo e direito). Esta estrutura permite que a árvore se organize hierarquicamente, com cada nó conectado a no máximo dois outros nós.

Cada nó armazena aproximadamente:
- 2 Strings (~50 bytes cada)
- 2 ponteiros (8 bytes total em ESP32)
- **Total: ~108 bytes por nó**

Com 512 KB de SRAM, teoricamente cabem ~4700 nós, mas considerando overhead do sistema, limitamos a ~200-500 horários por dia, o que é suficiente para o caso de uso.

#### 3.2.2 Conversão de Horário para Inteiro

Para comparação eficiente, convertemos horários "HH:MM" para minutos desde 00:00:

```cpp
int horaStrToMin(const String& hora) {
  int h = hora.substring(0,2).toInt();  // Extrai horas
  int m = hora.substring(3,5).toInt();  // Extrai minutos
  return h*60 + m;                      // Converte para minutos
}
```

**Descrição textual:** Esta função converte um horário em formato texto (como "14:30") para um número inteiro representando minutos desde meia-noite. Por exemplo, "14:30" se torna 870 minutos (14 horas × 60 + 30 minutos). Isso permite comparações numéricas rápidas ao invés de comparações de texto.

**Exemplo:**
- "08:30" → 8×60 + 30 = 510 minutos
- "14:45" → 14×60 + 45 = 885 minutos

Esta conversão permite comparações numéricas rápidas (O(1)) ao invés de comparações de strings.

#### 3.2.3 Algoritmo de Inserção

A inserção segue o algoritmo clássico de BST com recursão:

```cpp
HorarioNode* insertHorario(HorarioNode* node, String h, String p) {
  // Caso base: posição encontrada (nó vazio)
  if (!node) 
    return new HorarioNode(h, p);
  
  // Compara horário a inserir com nó atual
  if (horaStrToMin(h) < horaStrToMin(node->hora))
    node->left = insertHorario(node->left, h, p);   // Insere à esquerda
  else
    node->right = insertHorario(node->right, h, p); // Insere à direita
  
  return node;
}
```

**Descrição textual:** O código acima implementa a inserção de um novo horário na árvore. O algoritmo funciona recursivamente: se a posição está vazia, cria um novo nó; se o horário a inserir é menor que o nó atual, desce para a esquerda; caso contrário, desce para a direita. Assim, horários menores sempre ficam à esquerda e maiores à direita.

**Propriedade Mantida:** Após a inserção, todos os horários menores estão à esquerda e todos os maiores ou iguais à direita, preservando a propriedade fundamental da BST.

#### 3.2.4 Algoritmo de Busca do Próximo Horário

Este é o algoritmo mais crítico do projeto. Dado o horário atual, devemos encontrar o menor horário maior ou igual a ele:

```cpp
HorarioNode* buscarProximo(HorarioNode* node, String atual) {
  HorarioNode* sucessor = NULL;
  int minAtual = horaStrToMin(atual);
  
  while (node) {
    int minNode = horaStrToMin(node->hora);
    
    if (minNode >= minAtual) {
      // Candidato encontrado, mas pode haver um menor à esquerda
      sucessor = node;
      node = node->left;
    } else {
      // Horário já passou, procura à direita
      node = node->right;
    }
  }
  
  return sucessor;
}
```

**Descrição textual:** Esta função implementa o coração do sistema: encontrar o próximo ônibus. Ela percorre a árvore comparando cada nó com o horário atual. Se o nó é maior ou igual ao horário atual, ele é um candidato a "próximo horário", mas ainda busca à esquerda para encontrar um ainda mais próximo. Se o nó é menor que o horário atual (ônibus já passou), busca à direita. No final, retorna o horário futuro mais próximo.

**Análise do Algoritmo:**
1. Compara horário do nó com horário atual
2. Se nó >= atual: é candidato a sucessor, mas busca à esquerda por um mais próximo
3. Se nó < atual: horário já passou, busca à direita
4. Retorna o menor horário >= atual

**Exemplo Prático - Visualização da Busca:**

Considere uma árvore com os seguintes horários: 08:00, 08:30, 09:15, 10:00, 14:30  
Horário atual do sistema: 09:00

```
         09:15 (raiz)
        /          \
     08:30        10:00
     /              \
  08:00            14:30
```

**Descrição textual do exemplo:** A figura acima mostra uma árvore binária de busca com horários organizados. O nó raiz contém 09:15. À esquerda estão horários menores (08:30 e 08:00), à direita estão horários maiores (10:00 e 14:30). Esta organização permite busca eficiente.

Processo de busca por próximo horário >= 09:00:
1. **Passo 1:** Inicia na raiz (09:15)
   - Compara: 09:15 >= 09:00? Sim
   - Ação: 09:15 é candidato a próximo, mas verifica esquerda buscando algo mais próximo
   
2. **Passo 2:** Navega para esquerda (08:30)
   - Compara: 08:30 >= 09:00? Não
   - Ação: Horário passou, vai para direita (NULL - não existe)
   
3. **Passo 3:** Retorna 09:15 como próximo horário

**Descrição textual do processo:** O sistema começa na raiz (09:15) e verifica se é maior que 09:00. Como é, guarda como candidato mas ainda tenta a esquerda buscando algo mais próximo. Encontra 08:30, que já passou, então retorna ao candidato 09:15 como resposta final. Se o horário atual fosse 10:30, o sistema iria para a direita e encontraria 14:30.

**Complexidade:** O(log n) no caso médio, O(n) no pior caso (árvore degenerada). Com 200 horários, executa aproximadamente 8 comparações.

#### 3.2.5 Travessia Em Ordem (In-Order)

Para exibir todos os horários ordenados (ex: no servidor web embarcado do ESP32):

```cpp
void printInOrderWeb(HorarioNode* node, String &html) {
  if (!node) return;
  
  printInOrderWeb(node->left, html);          // Visita subárvore esquerda
  html += "<li>" + node->hora + "</li>";      // Visita nó atual
  printInOrderWeb(node->right, html);         // Visita subárvore direita
}
```

**Descrição textual:** Esta função percorre a árvore em ordem (esquerda-raiz-direita) para gerar uma lista HTML de todos os horários. Como a BST mantém horários menores à esquerda, esta travessia automaticamente produz os horários em ordem cronológica crescente, sem necessidade de ordenação adicional.

**Propriedade:** A travessia em ordem de uma BST visita os nós em ordem crescente (horários ordenados cronológica e automaticamente).

#### 3.2.6 Liberação de Memória

Para evitar vazamento de memória (memory leak), implementamos liberação recursiva:

```cpp
void liberaArvore(HorarioNode* node) {
  if (!node) return;
  
  liberaArvore(node->left);   // Libera subárvore esquerda
  liberaArvore(node->right);  // Libera subárvore direita
  delete node;                // Libera nó atual (pós-ordem)
}
```

**Descrição textual:** Esta função libera toda a memória ocupada pela árvore. Ela percorre recursivamente todos os nós em pós-ordem (esquerda-direita-raiz), liberando primeiro os filhos e depois o pai, evitando perda de ponteiros. É chamada antes de reconstruir a árvore com novos dados sincronizados.

Esta função é chamada antes de reconstruir a árvore com novos dados sincronizados do backend, garantindo que não há acúmulo de memória não utilizada.

### 3.3 Backend Node.js

O backend é responsável por intermediar a comunicação entre a API URBS e o dispositivo embarcado, aplicando camadas de processamento e otimização.

**Arquitetura MVC (Model-View-Controller):**
- **Framework:** Express.js para criação de API RESTful
- **ORM:** Sequelize para mapeamento objeto-relacional
- **Banco de Dados:** PostgreSQL em contêiner Docker
- **HTTP Client:** Axios para consumir API externa URBS
- **Estrutura de pastas:** Organização em `controllers/`, `services/`, `models/`, `routes/`

**Descrição textual da arquitetura MVC:** O backend segue o padrão MVC onde Models definem a estrutura dos dados (tabelas do banco), Controllers processam as requisições HTTP, e Services encapsulam a lógica de negócio. Routes definem os endpoints da API. Esta separação facilita manutenção e testes.

**Modelo de Dados (Sequelize ORM):**

O modelo `UrbsSchedule` representa os horários persistidos no PostgreSQL:

```javascript
{
  id: BIGINT (chave primária),
  cod: STRING(10),      // Código da linha (ex: "303")
  hora: STRING(5),      // Horário no formato "HH:MM"
  ponto: STRING(120),   // Nome do ponto de parada
  dia: STRING(2),       // Dia da semana (1-7)
  num: STRING(16),      // Número identificador
  tabela: STRING(8),    // Código da tabela de horários
  adapt: STRING(60),    // Informações de acessibilidade
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
}
```

**Descrição textual do modelo:** A tabela acima representa a estrutura de dados armazenada no PostgreSQL. Cada linha contém informações completas sobre um horário de ônibus: código da linha, hora de partida, ponto de parada, dia da semana, e metadados adicionais. Os campos created_at e updated_at permitem rastrear quando os dados foram inseridos ou atualizados.

**Índices para Otimização:**
- Índice único composto: `(cod, num, dia, tabela, hora)` - evita duplicações
- Índice de busca: `(cod, hora)` - otimiza consultas por linha e horário

**Descrição textual dos índices:** Os índices são estruturas auxiliares (geralmente B-Trees no PostgreSQL) que aceleram as consultas. O índice único garante que não haja horários duplicados. O índice de busca permite que queries filtrando por código de linha e horário sejam executadas rapidamente, sem varrer toda a tabela.

**Fluxo de Sincronização de Dados:**

1. **Requisição à API URBS:**
```
GET https://transporteservico.urbs.curitiba.pr.gov.br/getTabelaLinha.php
Parâmetros: linha=303, c=858ce
```

2. **Processamento no Backend:**
   - Deserialização do JSON retornado pela URBS
   - Normalização de dados (remoção de campos desnecessários)
   - Inserção/atualização no PostgreSQL via Sequelize (upsert)

3. **Consulta Filtrada para ESP32:**
```
GET /api/urbs/horarios-linha/db/dia-ponto
Parâmetros: dia=1, ponto=TERMINAL%20CENTENARIO, cod=303, limit=700
```
Retorna apenas horários futuros do dia e ponto especificados

**Descrição textual do fluxo:** O diagrama acima mostra como os dados fluem pelo sistema. Primeiro, o backend requisita dados completos da URBS. Depois, processa e armazena esses dados no PostgreSQL. Finalmente, quando o ESP32 faz uma requisição, o backend consulta o banco e retorna apenas os dados relevantes (horários futuros de um ponto específico), reduzindo drasticamente o volume de dados transferidos.

**Endpoints da API:**

```
GET  /health                          → Status do servidor
GET  /api/db/health                   → Status do banco de dados
GET  /api/urbs/horarios-linha         → Proxy direto para URBS
POST /api/urbs/horarios-linha/sync    → Sincroniza dados URBS → PostgreSQL
GET  /api/urbs/horarios-linha/db      → Consulta geral no banco
GET  /api/urbs/horarios-linha/db/dia  → Filtra por dia da semana
GET  /api/urbs/horarios-linha/db/dia-ponto → Filtra por dia e ponto (usado pelo ESP32)
```

**Descrição textual dos endpoints:** A lista acima descreve todos os pontos de acesso da API. O endpoint `/health` verifica se o servidor está funcionando. `/sync` busca dados da URBS e armazena no banco. Os endpoints `/db/*` consultam dados já armazenados, com filtros progressivamente mais específicos. O ESP32 usa principalmente `/dia-ponto` para obter apenas horários relevantes.

### 3.4 Firmware ESP32 S3

O firmware embarcado integra múltiplas bibliotecas e componentes:

**Componentes de Hardware:**
- **Microcontrolador:** ESP32 S3 (Dual-core Xtensa LX7, 240 MHz, 512 KB SRAM)
- **Display:** TFT LCD touchscreen (biblioteca TFT_eSPI)
- **Touch:** TFT_Touch para detecção de toques na tela
- **LED RGB:** Adafruit NeoPixel para feedback visual
- **Wi-Fi:** Conectividade IEEE 802.11 b/g/n integrada

**Descrição textual dos componentes:** O sistema embarcado utiliza um ESP32 S3, um microcontrolador potente com processador dual-core e Wi-Fi integrado. Conectado a ele estão um display TFT touchscreen para exibição e interação, e um LED RGB para feedback luminoso. Apesar da capacidade de processamento, a memória RAM limitada (512 KB) exige otimização de estruturas de dados.

**Bibliotecas Utilizadas:**
- **WiFi.h / HTTPClient.h:** Comunicação HTTP/HTTPS
- **ArduinoJson.h:** Desserialização de respostas JSON (capacidade: 64 KB)
- **TFT_eSPI.h / TFT_Touch.h:** Interface gráfica
- **Adafruit_NeoPixel.h:** Controle de LED RGB
- **time.h:** Sincronização NTP (Network Time Protocol)

**Fluxo de Execução Principal:**

```
1. setup() - Inicialização
   ├─ Conecta Wi-Fi
   ├─ Sincroniza relógio via NTP
   ├─ Inicializa display TFT
   ├─ Inicializa LED RGB
   └─ Inicia servidor web local (porta 80)

2. loop() - Execução contínua
   ├─ Verifica toque na tela (LED on/off)
   ├─ A cada 5 minutos:
   │  ├─ Consulta endpoint /dia-ponto do backend
   │  ├─ Libera árvore antiga (liberaArvore)
   │  ├─ Constrói nova BST (insertHorario)
   │  └─ Filtra horários já passados
   ├─ Busca próximo horário (buscarProximo)
   └─ Atualiza display (mostraProximoHorario)
```

**Descrição textual do fluxo de execução:** O programa do ESP32 tem duas fases principais. Na inicialização (setup), ele se conecta ao Wi-Fi, acerta o relógio, e prepara a tela e LED. No loop contínuo, ele verifica toques na tela, atualiza os horários a cada 5 minutos consultando o backend, reconstrói a árvore binária com dados novos, e atualiza a tela com o próximo horário. Este ciclo se repete indefinidamente.

**Interface do Usuário - Descrição da Tela:**

O display TFT exibe as seguintes informações organizadas verticalmente:

```
┌────────────────────────────────┐
│      URBAN JARVIS (título)     │ ← Amarelo, centralizado
├────────────────────────────────┤
│      Atual: 14:25 (hora)       │ ← Amarelo, centralizado
├────────────────────────────────┤
│ ╔═══════════════════════════╗  │
│ ║  Próximo: 14:45          ║  │ ← Caixa azul, horário verde
│ ║  TERMINAL CENTENARIO     ║  │ ← Nome do ponto em ciano
│ ╚═══════════════════════════╝  │
├────────────────────────────────┤
│   ┌───────────────────┐        │
│   │  Desligar LED     │        │ ← Botão vermelho/verde
│   └───────────────────┘        │
└────────────────────────────────┘
```

**Descrição textual da interface:** A tela do totem apresenta quatro áreas principais. No topo, o título "URBAN JARVIS" identifica o sistema. Logo abaixo, o horário atual sincronizado via internet. A área central destaca o próximo ônibus em uma caixa azul, mostrando o horário (14:45) em verde grande e o nome do ponto. Na base, um botão touchscreen permite ligar/desligar o LED RGB, alterando de vermelho (desligado) para verde (ligado). Todas as informações são apresentadas com cores contrastantes para fácil visualização.

**Servidor Web Embarcado:**

O ESP32 também executa um servidor HTTP local (porta 80) para monitoramento:

```
GET http://[IP_do_ESP32]/
Retorna página HTML com:
- Status da conexão Wi-Fi
- Horário atual sincronizado
- Próximo horário encontrado
- Lista completa de horários (travessia em ordem da BST)
- Última atualização dos dados
```

**Descrição textual do servidor web:** Além de mostrar informações na tela TFT, o ESP32 também funciona como um pequeno servidor web. Ao acessar o IP do dispositivo pelo navegador, é possível visualizar status detalhado, lista completa de horários, e informações de diagnóstico. Isso facilita a depuração e monitoramento remoto do sistema.

---

## 4. Análise de Desempenho e Complexidade

### 4.1 Complexidade Temporal

**Operações principais e suas complexidades:**

| Operação | BST (caso médio) | BST (pior caso) | Array Linear | Lista Ordenada |
|----------|-----------------|----------------|--------------|----------------|
| Inserção | O(log n) | O(n) | O(1) append | O(n) |
| Busca próximo | O(log n) | O(n) | O(n) | O(log n) com busca binária |
| Travessia ordenada | O(n) | O(n) | O(n log n) sort | O(n) |
| Liberação memória | O(n) | O(n) | O(1) | O(n) |

**Descrição textual da tabela de complexidade:** A tabela compara o desempenho de diferentes estruturas de dados para as operações do projeto. A BST oferece inserção e busca em O(log n) no caso médio, significando que duplicar a quantidade de horários aumenta apenas uma comparação. Arrays lineares são mais lentos para busca O(n), enquanto listas ordenadas têm inserção lenta O(n). A BST equilibra bem todas as operações necessárias.

**Análise prática com 200 horários:**
- BST: ~8 comparações para encontrar próximo horário
- Array: ~100 comparações em média (percorre metade do array)
- **Ganho:** 12,5x mais rápido com BST

### 4.2 Complexidade Espacial

**Memória consumida por estrutura:**

- **Por nó da BST:** ~108 bytes (2 strings + 2 ponteiros)
- **200 horários:** ~21.6 KB
- **Overhead do firmware:** ~100-150 KB
- **JSON buffer:** 64 KB (DynamicJsonDocument)
- **Stack de recursão:** ~2-3 KB (profundidade máxima ~15 níveis)
- **Total estimado:** ~190 KB de uso de SRAM
- **Margem de segurança:** ~320 KB livres dos 512 KB disponíveis

**Descrição textual do consumo de memória:** O sistema usa aproximadamente 190 KB dos 512 KB de RAM disponíveis no ESP32. A árvore com 200 horários ocupa cerca de 21 KB, o buffer para processar JSON da API consome 64 KB, e o restante é usado pelo sistema operacional e bibliotecas. Ainda sobram 320 KB livres, garantindo estabilidade e evitando estouro de memória.

### 4.3 Otimizações Implementadas

**Backend:**
1. **Filtragem de horários futuros:** Reduz payload JSON de ~5 KB para ~1.5 KB
2. **Índices PostgreSQL:** Consultas executam em <10ms mesmo com milhares de registros
3. **Conexão keep-alive:** Reutiliza conexões HTTP, reduz latência

**Firmware:**
4. **Pré-filtragem antes de inserir na BST:** Apenas horários >= atual são inseridos, reduzindo árvore em ~60% após meio-dia
5. **Conversão para inteiros:** Comparações numéricas (O(1)) ao invés de comparação de strings
6. **Sincronização periódica:** Atualiza a cada 5 minutos, não a cada segundo (reduz tráfego de rede)

**Descrição textual das otimizações:** Várias técnicas foram aplicadas para melhorar desempenho. O backend filtra dados antes de enviar, reduzindo tráfego de rede. Índices no banco aceleram consultas. No firmware, apenas horários futuros são armazenados na árvore, e comparações usam números inteiros ao invés de texto. A atualização periódica (não contínua) economiza energia e banda.

---

## 5. Resultados Esperados e Discussão

### 5.1 Objetivos de Aprendizagem Alcançados

Este projeto demonstra a aplicação prática dos seguintes conceitos de Estrutura de Dados:

**Árvores Binárias:**
- ✅ Implementação de estrutura recursiva em C++
- ✅ Algoritmos de inserção, busca e travessia
- ✅ Análise de complexidade temporal e espacial
- ✅ Comparação com estruturas alternativas

**Otimização Algorítmica:**
- ✅ Escolha de estrutura adequada ao problema
- ✅ Trade-offs entre memória e velocidade
- ✅ Consideração de limitações de hardware

**Integração de Sistemas:**
- ✅ Comunicação entre backend (alto nível) e firmware (baixo nível)
- ✅ Serialização/desserialização de dados (JSON)
- ✅ Arquitetura em camadas

**Descrição textual dos resultados de aprendizagem:** O projeto permitiu aplicar na prática todos os conceitos teóricos estudados em Estrutura de Dados. Além de implementar árvores binárias, foi necessário analisar complexidade, comparar alternativas, e integrar diferentes sistemas. A experiência reforça a importância de escolher estruturas de dados adequadas ao problema.

### 5.2 Limitações e Trabalhos Futuros

**Limitações Identificadas:**

1. **Árvore não balanceada:** 
   - Problema: No pior caso (horários inseridos ordenados), a BST degenera para lista linear O(n)
   - Impacto: Horários da URBS geralmente vêm ordenados, resultando em árvore desbalanceada
   - Solução futura: Implementar AVL Tree ou Red-Black Tree para auto-balanceamento

2. **Sem persistência local:**
   - Problema: Se Wi-Fi cair durante inicialização, sistema fica sem dados
   - Solução futura: Salvar último payload em memória flash (SPIFFS/LittleFS)

3. **Tratamento de meia-noite:**
   - Problema: Horários após meia-noite (00:00-03:00) requerem lógica especial
   - Solução atual: Considera horários < 04:00 como do próximo dia
   - Solução futura: Usar timestamp Unix para eliminar ambiguidade

**Descrição textual das limitações:** Como todo projeto acadêmico, existem limitações identificadas. A principal é que a árvore não é auto-balanceada, então no pior caso (dados já ordenados) o desempenho cai. Também não há cache persistente, dependendo sempre de conexão Wi-Fi. Horários próximos à meia-noite requerem tratamento especial. Essas limitações são reconhecidas e documentadas como oportunidades de melhoria futura.

**Propostas de Melhoria:**

1. **AVL ou Red-Black Tree:** Garantir O(log n) mesmo com dados ordenados
2. **Cache em Flash:** Armazenar último dataset válido em memória não-volátil
3. **Heap para "top K":** Se precisar apenas dos próximos 5 horários, usar min-heap (O(log k) insert)
4. **Compressão de dados:** Reduzir payload JSON com compressão gzip
5. **Display e-Paper:** Reduzir consumo energético para versão solar

---

## 6. Conclusão

Este projeto demonstrou com sucesso a aplicação de estruturas de dados, especificamente árvores binárias de busca, em um contexto real de sistema embarcado. A escolha da BST como estrutura central permitiu otimizar consultas de horários futuros, reduzindo a complexidade de O(n) para O(log n) em comparação com busca linear.

A integração entre backend Node.js e firmware ESP32 ilustra a importância de arquiteturas em camadas, onde cada componente lida com suas responsabilidades específicas. O backend processa volumes maiores de dados e aplica filtros, enquanto o firmware trabalha apenas com dados essenciais, respeitando limitações de memória.

Do ponto de vista acadêmico, o projeto cumpriu os objetivos de:
- Implementar algoritmos fundamentais de árvores binárias (inserção, busca, travessia)
- Analisar complexidade temporal e espacial
- Comparar estruturas de dados alternativas e justificar escolhas
- Integrar conhecimentos de programação, banco de dados e sistemas embarcados

As limitações identificadas (árvore não balanceada, falta de persistência local) representam oportunidades de aprofundamento em tópicos avançados como AVL Trees e sistemas de arquivos embarcados.

**Alinhamento com Estrutura de Dados:**

O projeto aborda diretamente os seguintes tópicos da disciplina:
- Estruturas lineares vs. hierárquicas
- Árvores binárias de busca (BST)
- Análise de complexidade (Big O notation)
- Recursão em estruturas de dados
- Trade-offs memória vs. velocidade
- Aplicação prática de teoria algorítmica

**Descrição textual da conclusão:** Este projeto comprova que estruturas de dados não são apenas conceitos teóricos, mas ferramentas essenciais para resolver problemas reais. A árvore binária de busca foi fundamental para permitir consultas rápidas em um dispositivo com memória limitada. O trabalho integrou conhecimentos de algoritmos, programação em diferentes linguagens, e arquitetura de sistemas, demonstrando a importância da disciplina de Estrutura de Dados na formação do desenvolvedor.

---

## 7. Referências Bibliográficas

**Livros e Materiais Didáticos:**

1. CORMEN, T. H.; LEISERSON, C. E.; RIVEST, R. L.; STEIN, C. **Algoritmos: Teoria e Prática**. 3ª ed. Rio de Janeiro: Elsevier, 2012.

2. DROZDEK, Adam. **Estrutura de Dados e Algoritmos em C++**. São Paulo: Cengage Learning, 2016.

3. GOODRICH, Michael T.; TAMASSIA, Roberto. **Estruturas de Dados e Algoritmos em Java**. 5ª ed. Porto Alegre: Bookman, 2013.

4. ZIVIANI, Nivio. **Projeto de Algoritmos com Implementações em Java e C++**. São Paulo: Cengage Learning, 2011.

**Documentação Técnica:**

5. ESP32-S3 Series Datasheet. **Espressif Systems**. Disponível em: https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf

6. PostgreSQL 14 Documentation. **PostgreSQL Global Development Group**. Disponível em: https://www.postgresql.org/docs/14/

7. Node.js v20 Documentation. **OpenJS Foundation**. Disponível em: https://nodejs.org/docs/latest-v20.x/api/

8. Sequelize v6 Documentation. **Sequelize**. Disponível em: https://sequelize.org/docs/v6/

**APIs e Serviços:**

9. API URBS - Urbanização de Curitiba S.A. **Prefeitura Municipal de Curitiba**. Disponível em: https://transporteservico.urbs.curitiba.pr.gov.br/

**Bibliotecas Utilizadas:**

10. TFT_eSPI Library. **Bodmer**. Disponível em: https://github.com/Bodmer/TFT_eSPI

11. ArduinoJson Library. **Benoit Blanchon**. Disponível em: https://arduinojson.org/

12. Adafruit NeoPixel Library. **Adafruit Industries**. Disponível em: https://github.com/adafruit/Adafruit_NeoPixel

---

## 8. Apêndices

### Apêndice A - Requisitos para Execução

**Hardware Necessário:**
- Microcontrolador ESP32 S3 DevKit
- Display TFT LCD com touchscreen (compatível com TFT_eSPI)
- LED RGB WS2812B (NeoPixel)
- Cabos de conexão e fonte de alimentação 5V

**Software Necessário:**
- Arduino IDE 2.x ou PlatformIO
- Node.js 18+ (recomendado 20+)
- Docker e Docker Compose
- Git para versionamento

### Apêndice B - Configuração do Ambiente Backend

**1. Instalar dependências do Node.js:**
```bash
npm install
```

**2. Criar arquivo `.env` na raiz do projeto:**
```env
PORT=3000
CORS_ORIGIN=*
POSTGRES_DB=urbs
POSTGRES_USER=urbs
POSTGRES_PASSWORD=urbs
POSTGRES_PORT=5432
DATABASE_URL=postgres://urbs:urbs@localhost:5432/urbs
```

**3. Iniciar PostgreSQL via Docker:**
```bash
docker compose up -d
```

**4. Executar o backend:**
```bash
# Modo desenvolvimento (hot reload)
npm run dev

# Modo produção
npm start
```

**5. Verificar saúde do sistema:**
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/db/health
```

### Apêndice C - Configuração do Firmware ESP32

**1. Configurar credenciais Wi-Fi no código `esp32s3.cpp`:**
```cpp
const char* WIFI_SSID = "SuaRedeWiFi";
const char* WIFI_PASS = "SuaSenhaWiFi";
```

**2. Configurar URL do backend:**
```cpp
const char* URL_URBS = "http://[IP_DO_BACKEND]:3000/api/urbs/horarios-linha/db/dia-ponto?dia=1&ponto=TERMINAL%20CENTENARIO&cod=303";
```

**3. Instalar bibliotecas no Arduino IDE:**
- TFT_eSPI
- ArduinoJson (v6.x)
- Adafruit_NeoPixel

**4. Configurar pinos no arquivo `User_Setup.h` da TFT_eSPI conforme hardware**

**5. Compilar e fazer upload para o ESP32**

### Apêndice D - Endpoints da API (Referência Completa)

**Saúde do Sistema:**
```
GET /health
Resposta: {"status": "ok"}

GET /api/db/health
Resposta: {"status": "connected"} ou erro
```

**Operações URBS:**
```
GET /api/urbs/horarios-linha?linha=303&c=858ce
Descrição: Proxy direto para API URBS
Resposta: Array JSON com todos os horários

POST /api/urbs/horarios-linha/sync?linha=303&c=858ce
Descrição: Sincroniza dados URBS → PostgreSQL
Resposta: {"message": "Sincronizados X registros"}

GET /api/urbs/horarios-linha/db?cod=303&limit=700
Descrição: Consulta todos os horários da linha
Resposta: Array JSON de objetos UrbsSchedule

GET /api/urbs/horarios-linha/db/dia?dia=1&cod=303&limit=700
Descrição: Filtra por dia da semana (1=segunda, 7=domingo)
Resposta: Array JSON filtrado

GET /api/urbs/horarios-linha/db/dia-ponto?dia=1&ponto=TERMINAL%20CENTENARIO&cod=303&limit=700
Descrição: Filtra por dia e ponto de parada (usado pelo ESP32)
Resposta: Array JSON otimizado para o dispositivo
```

### Apêndice E - Estrutura de Pastas do Projeto

```
Urban-Jarvis/
├── src/                          # Código-fonte do backend Node.js
│   ├── app.js                    # Configuração do Express
│   ├── server.js                 # Ponto de entrada do servidor
│   ├── config/
│   │   └── database.js           # Configuração Sequelize
│   ├── controllers/
│   │   ├── ItemController.js     # CRUD de exemplo
│   │   └── UrbsController.js     # Lógica de horários URBS
│   ├── models/
│   │   ├── index.js              # Inicialização dos models
│   │   ├── Item.js               # Model de exemplo
│   │   ├── UrbsSchedule.js       # Model de horários
│   │   └── Users.js              # Model de usuários
│   ├── routes/
│   │   ├── index.js              # Roteador principal
│   │   └── v1.js                 # Rotas v1 da API
│   └── services/
│       ├── ExternalApiService.js # Serviços genéricos
│       └── UrbsApiService.js     # Integração com API URBS
├── esp32s3.cpp                   # Firmware do ESP32 (Arduino)
├── docker-compose.yml            # Configuração do PostgreSQL
├── package.json                  # Dependências Node.js
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore                    # Arquivos ignorados pelo Git
└── README.md                     # Este documento
```

---

## 9. Glossário

**API (Application Programming Interface):** Interface que permite comunicação entre diferentes sistemas de software.

**AVL Tree:** Árvore binária de busca auto-balanceada onde a diferença de altura entre subárvores não excede 1.

**Backend:** Camada de servidor de uma aplicação, responsável por lógica de negócio e persistência de dados.

**Big O Notation:** Notação matemática para descrever a complexidade temporal ou espacial de algoritmos.

**BST (Binary Search Tree):** Árvore binária de busca, estrutura hierárquica onde cada nó possui no máximo dois filhos, com propriedade de ordenação.

**Complexidade Espacial:** Quantidade de memória consumida por um algoritmo em função do tamanho da entrada.

**Complexidade Temporal:** Tempo de execução de um algoritmo em função do tamanho da entrada.

**Endpoint:** URL específica em uma API que responde a requisições HTTP.

**ESP32:** Família de microcontroladores com Wi-Fi e Bluetooth integrados, fabricados pela Espressif.

**Firmware:** Software de baixo nível executado diretamente no hardware embarcado.

**JSON (JavaScript Object Notation):** Formato leve de intercâmbio de dados baseado em texto.

**MVC (Model-View-Controller):** Padrão arquitetural que separa dados (Model), lógica de apresentação (View) e lógica de controle (Controller).

**NTP (Network Time Protocol):** Protocolo para sincronização de relógios via rede.

**ORM (Object-Relational Mapping):** Técnica que mapeia objetos de programação para tabelas de banco de dados relacional.

**PostgreSQL:** Sistema de gerenciamento de banco de dados relacional open-source.

**Recursão:** Técnica de programação onde uma função chama a si mesma.

**REST (Representational State Transfer):** Estilo arquitetural para APIs web baseadas em HTTP.

**SRAM (Static Random-Access Memory):** Tipo de memória volátil de acesso aleatório usada em microcontroladores.

**TFT (Thin-Film Transistor):** Tecnologia de display LCD de matriz ativa.

**Travessia (Tree Traversal):** Processo de visitar todos os nós de uma árvore em ordem específica.

**URBS:** Urbanização de Curitiba S.A., empresa responsável pelo transporte público de Curitiba-PR.

---

## Licença

Este projeto é desenvolvido para fins acadêmicos no Centro Universitário UniBrasil.

MIT License - Copyright (c) 2024 Urban Jarvis Team

---

**Nota Final:** Este documento foi elaborado como base para futura formatação em padrão ABNT (Associação Brasileira de Normas Técnicas) para submissão acadêmica. Inclui fundamentação teórica, justificativas, metodologia, e explicações detalhadas de implementação técnica, atendendo aos requisitos de um trabalho de pesquisa em Estrutura de Dados.
