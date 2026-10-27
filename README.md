# Projeto Monorepo FATEC

![Status do CI](https://github.com/renanzanettio/DW4-projeto-monorepo/actions/workflows/ci.yml/badge.svg)

Aplicação React com rotas protegidas e API Express com TypeScript, Sequelize e autenticação JWT.

## Executar localmente

Use Node.js 24 e pnpm 11.21.0, versão fixada no package.json da raiz.

```bash
corepack enable
pnpm install --frozen-lockfile
```

Copie backend/.env.example para backend/.env e configure o PostgreSQL e a chave JWT_SECRET.
Para criar as tabelas, execute na pasta backend:

```bash
pnpm exec sequelize-cli db:migrate
```

Em dois terminais, a partir da raiz:

```bash
pnpm --filter backend dev
pnpm --filter app dev
```

A API utiliza a porta 3000. O login requer um usuário cadastrado no banco.
O endpoint GET /api/health permite verificar a disponibilidade da API.

## Verificações

```bash
pnpm --filter backend lint
pnpm --filter backend format:check
pnpm --filter backend type-check
pnpm --filter backend test:coverage
pnpm --filter backend build
pnpm --filter app lint
pnpm --filter app build
```

Os testes usam SQLite em memória. Os limites de cobertura são 80% para linhas, funções e instruções e 75% para ramificações.
O Vitest utiliza vitest.config.mts; não mantenha cópias antigas em .js ou .ts.
O build de produção exclui arquivos de testes e usa CommonJS, de acordo com o código JavaScript gerado pelo TypeScript.

## Docker de produção

```bash
docker build -t api-service ./backend
```

O Dockerfile utiliza dois estágios, compila o TypeScript, remove as dependências de desenvolvimento e executa node dist/server.js com um usuário sem privilégios de root.
O backend possui um lockfile próprio para permitir o contexto Docker ./backend. A instalação do monorepo usa o lockfile da raiz.

Para executar API e PostgreSQL juntos, copie .env.example para .env na raiz e defina JWT_SECRET antes de executar:

```bash
docker compose up --build -d
```

A configuração Compose executa a imagem de produção e aguarda o PostgreSQL ficar disponível. As tabelas devem ser criadas pela migração indicada acima; o banco local exposto na porta 5432 usa o nome fatec_db.

## CI e entrega contínua

O arquivo .github/workflows/ci.yml valida lint, formatação, tipos, testes, cobertura, frontend e Docker em pushes e pull requests. O teste da imagem inicia um PostgreSQL temporário e verifica /api/health.

O arquivo .github/workflows/cd.yml publica no Docker Hub após o CI de um push na main ser aprovado. Ele usa o mesmo commit aprovado pelo CI, com as tags latest e sha-<hash completo>. Também permite acionamento manual na main.

Em Settings > Secrets and variables > Actions, cadastre os repository secrets:

- DOCKERHUB_USERNAME: seu usuário do Docker Hub.
- DOCKERHUB_TOKEN: token pessoal do Docker Hub com permissão de publicação (Read/Write).

Sem esses secrets, a publicação fica pulada e o resumo informa que nenhuma imagem foi publicada. Assim que forem configurados, um novo push aprovado na main ou o acionamento manual poderá publicar a imagem.

Para habilitar a análise externa do SonarCloud/SonarQube, configure:

- Secrets SONAR_TOKEN e SONAR_HOST_URL.
- Repository variables SONAR_PROJECT_KEY e SONAR_ORGANIZATION com os identificadores do seu projeto e organização.

Sem SONAR_TOKEN, a análise externa é informada como não executada. Os testes e a cobertura local continuam obrigatórios. Quando configurada, a análise e o Quality Gate precisam passar.
O relatório LCOV é gerado em backend/coverage/lcov.info e o relatório HTML é anexado à execução do GitHub Actions.

A integração e o deploy da API no Render são a etapa seguinte. Esta atividade prepara e publica a imagem Docker.
