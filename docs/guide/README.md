# Guia do app do NaCal

Guia para quem vai trabalhar no app pela primeira vez. Explica o app com diagramas: o que existe, como as camadas conversam e o que acontece em cada fluxo, da tela até a API.

> Os diagramas são [Mermaid](https://mermaid.js.org/) e aparecem desenhados no GitHub e no preview de Markdown do VS Code. Para editar com preview ao vivo, use o [Mermaid Live Editor](https://mermaid.live).

O app só conversa com a API. O que acontece do lado do servidor (filas, IA, Asaas, DynamoDB) está no [Guia da API](https://github.com/nivaldoandrade/nacal-api/blob/main/docs/guide/README.md); cada página de fluxo daqui aponta para a página correspondente de lá.

## Comece por aqui

Leia nesta ordem:

1. **[Visão geral](01-visao-geral.md)**: plataformas, com quem o app conversa e o mapa das telas.
2. **[Arquitetura do código](02-arquitetura-codigo.md)**: as duas camadas (`src/ui` e `src/app`), o caminho de um dado da tela até a API e como criar uma tela ou uma chamada nova.
3. **[Navegação e sessão](03-navegacao-e-sessao.md)**: como o `AuthContext` decide entre login, onboarding e Home, e como o token é renovado sozinho.
4. **[Fluxo de refeição por foto ou áudio](fluxos/refeicao-foto-audio.md)**: o fluxo principal do produto, com upload direto no S3 e polling do status.

Depois, vá direto ao fluxo em que vai mexer (tabela abaixo). As páginas 04 a 06 servem de consulta.

O setup local, as variáveis de ambiente, os comandos e o troubleshooting estão no [README do app](../../README.md). Tokens visuais e componentes estão no [`DESIGN.md`](../../DESIGN.md); público e princípios do produto, no [`PRODUCT.md`](../../PRODUCT.md).

## Mapa do guia

### Fundamentos

| Página | Conteúdo |
|---|---|
| [01 · Visão geral](01-visao-geral.md) | Plataformas, sistemas externos, mapa de navegação e inventário de telas |
| [02 · Arquitetura do código](02-arquitetura-codigo.md) | Camadas, mapa das pastas, fluxo de dados, convenções, arquivos por plataforma e como criar uma tela ou um endpoint |
| [03 · Navegação e sessão](03-navegacao-e-sessao.md) | Stacks, estados do `AuthContext`, abertura do app, refresh do token, saída da conta e deep link |
| [04 · Cache e dados locais](04-cache-e-dados-locais.md) | Chaves do TanStack Query, quem lê e quem escreve, polling, consistência eventual e o que fica guardado no aparelho |
| [05 · Erros, cotas e mensagens](05-erros-cotas-e-mensagens.md) | Códigos de erro da API e a reação de cada tela, toasters, cota Free/Pro na interface |
| [06 · Plataformas, build e deploy](06-plataformas-build-deploy.md) | Web, PWA e nativo, diferenças por plataforma, variáveis, deploy no Cloudflare e verificações |

### Fluxos

| Domínio | Página | Conteúdo |
|---|---|---|
| Conta | [Onboarding e cadastro por e-mail](fluxos/auth-cadastro-email.md) | 8 etapas, sign-up, confirmação por código e senha guardada em memória |
| Conta | [Login com Google](fluxos/auth-google.md) | OAuth + PKCE pelo Cognito, conta nova sem onboarding e erro de beta |
| Conta | [Login e senha](fluxos/auth-login-e-senha.md) | Login por e-mail, conta não confirmada, esqueci a senha e sair |
| Home | [Home e o dia](fluxos/home-e-dia.md) | Calendário, lista do dia, resumo de macros, FAB, modais do primeiro acesso e avisos |
| Refeição | [Foto ou áudio](fluxos/refeicao-foto-audio.md) | Captura, normalização, presigned POST, polling com backoff, rejeição e falha |
| Refeição | [Texto](fluxos/refeicao-texto.md) | Chamada síncrona, sem upload nem polling |
| Refeição | [Detalhes e itens](fluxos/refeicao-itens.md) | Adicionar por texto, remover com "Desfazer", restaurar e excluir a refeição |
| Conta | [Perfil e metas](fluxos/perfil-e-metas.md) | Ajustes, editar perfil, editar metas e pedido de exclusão de conta |
| Billing | [Planos e pagamento](fluxos/billing.md) | Estados da tela de Planos, trial, checkout no web e no nativo, confirmação, cancelamento e vencimento do anual |

## Modelo de página de fluxo

Toda página em `fluxos/` segue a mesma ordem, para dar para pular direto ao que interessa:

1. **Resumo**: o fluxo em 2 ou 3 linhas, com as telas, os hooks e as rotas da API envolvidos.
2. **Diagrama de sequência**: quem chama quem, da tela até a API, na ordem.
3. **Passo a passo**: o que cada etapa faz e por quê.
4. **Erros e casos de borda**: o que dá errado e como a tela reage.
5. **Arquivos envolvidos**: links para o código e para o lado da API.

## Glossário

| Termo | Significado |
|---|---|
| **`src/ui`** / **`src/app`** | As duas camadas do código. `ui` é o que aparece na tela (telas, componentes, estilos); `app` é a lógica sem layout (services, hooks de dados, contexto de auth, navegação). |
| **Service** | Classe estática em `src/app/services/` que faz as chamadas HTTP. Todas herdam de `Service`, que guarda o client axios único e o interceptor de refresh. |
| **Hook de tela** | `use*.ts` dentro da pasta da tela (`useHome`, `usePlansScreen`). Junta queries, mutations, navegação e toasts para a tela só renderizar. |
| **Query / mutation** | Hooks do TanStack Query em `src/app/hooks/queries` (leitura com cache) e `src/app/hooks/mutations` (escrita, que atualiza ou invalida o cache). |
| **Query key** | Endereço de um dado no cache, como `['accounts']`, `['meals', '2026-11-20']` ou `['meal', id]`. Ver [cache](04-cache-e-dados-locais.md). |
| **`AuthContext`** | Contexto que guarda se o usuário está logado e se falta o onboarding. É ele que decide qual stack de navegação aparece. |
| **Onboarding** | As 8 etapas do primeiro acesso (termos, objetivo, gênero, nascimento, altura, peso, atividade e criação da conta). Com o Google, a última etapa some. |
| **Presigned POST** | Formulário assinado pela API que deixa o app subir a foto ou o áudio direto no S3, sem passar pela Lambda. |
| **Polling** | Consultar `GET /meals/{id}` de tempos em tempos até a refeição sair do processamento. |
| **Atualização otimista** | Mudar o cache antes da resposta da API (remover item, por exemplo) e corrigir depois, se a chamada falhar. |
| **Toaster do modal** | Segundo `<Toaster>` com id `modal`, renderizado dentro do `ModalWrapper`, para o toast aparecer por cima de um modal aberto. |
| **PWA** | Versão web instalada na tela inicial do celular. É a superfície principal de validação do app. |
| **`DesktopGate`** | Componente que bloqueia o web em janelas com mais de 480 px de largura. O produto é só para celular. |
| **🔒** | Nas tabelas de fluxo, rota que exige o access token do Cognito no header `Authorization`. |
| **Free / Pro** | Planos. Free: 20 refeições com IA por mês. Pro (mensal, anual ou trial de 7 dias): até 20 por dia. |

## Mantendo o guia em dia

Ao mudar um fluxo, atualize o diagrama da página correspondente no mesmo commit. Diagrama desatualizado é pior do que nenhum diagrama.
