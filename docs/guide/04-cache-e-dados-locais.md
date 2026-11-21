# 04 · Cache e dados locais

O estado vindo da API mora no cache do **TanStack Query 5**. Não há Redux, Zustand nem persistência do cache: ao recarregar o app, tudo é buscado de novo. O que fica guardado no aparelho é pouco e está listado no [fim da página](#o-que-fica-guardado-no-aparelho).

## O modelo: buscar uma vez, atualizar por ação

Todas as queries usam **`staleTime: Infinity`**: um dado buscado nunca fica "velho" sozinho. Ele só é buscado de novo quando:

- alguma mutation chama `invalidateQueries` naquela chave (se a query estiver em uso na tela, a busca acontece na hora);
- o usuário puxa a lista da Home para baixo (pull-to-refresh);
- o código chama `refetch` explicitamente (FAB da Home, confirmação de pagamento);
- a query está invalidada e a janela volta ao foco (só no web; no nativo não há `focusManager` configurado).

O `queryClient` ([`libs/queryClient.ts`](../../src/app/libs/queryClient.ts)) roda com `retry: false`: erro aparece na hora, sem novas tentativas automáticas.

## Catálogo de chaves

| Chave | Hook | Rota | Quem escreve direto (`setQueryData`) | Quem invalida |
|---|---|---|---|---|
| `['accounts']` | `useAccount` | `GET /me` | `updateMealQuotaInCache` (criar refeição por foto, áudio ou texto) | Editar perfil e meta, trial, checkout, cancelamento, foco na tela de Planos, refeição `REJECTED`/`FAILED`, `DAILY_MEAL_LIMIT_REACHED`, erro na refeição por texto, `SUBSCRIPTION_ALREADY_ACTIVE` |
| `['meals', 'AAAA-MM-DD']` | `useListMealByDay` | `GET /meals?date=` | `insertMealIntoDayList` (refeição criada), itens copiados de `['meal', id]`, `useDeleteMeal` (tira a refeição) | Erro na refeição por texto (dia de hoje), polling que passou de 3 min (`refetchType: 'none'`) |
| `['meal', mealId]` | `useGetMealById` | `GET /meals/{id}` | Refeição por texto (resposta do `201`), resposta de adicionar, remover e restaurar item | Fim de cada mutation de itens; polling que passou de 3 min (`refetchType: 'none'`) |
| `['billing', 'plans']` | `useGetPlans` | `GET /billing/plans` | — | Cancelamento |

`['meal', id]` também é **removida** (`removeQueries`) quando a refeição volta `REJECTED` ou `FAILED` no modal de criação e quando a tela de detalhes desmonta depois de excluir a refeição.

Quem lê cada chave:

- `['accounts']`: praticamente todo o `AppStack` (Home, FAB, `MealQuotaNotice`, Perfil, Planos, `EditGoals`, `EditProfile`) e o `AuthContext` na abertura. `useAccount` devolve atalhos prontos: `account` (só com onboarding feito), `plan`, `isPro`, `subscription`, `mealQuota`, `dailyMealQuota`, `email`.
- `['meals', dia]`: Home (lista, `MacroRainbow` e resumo do dia). Usa `placeholderData: keepPreviousData`, então trocar de dia no calendário mantém a lista anterior na tela até a nova chegar.
- `['meal', id]`: modais de criação (polling) e `MealDetails`.

## Escrever no cache ou invalidar

Cada mutation escolhe entre gravar a resposta no cache ou mandar buscar de novo. A regra é **não buscar de novo o que a API pode devolver desatualizado**:

| Dado | Escolha | Motivo |
|---|---|---|
| Lista do dia depois de criar uma refeição | Inserir no cache (`insertMealIntoDayList`) | O `GET /meals` lê um índice secundário do DynamoDB (GSI1), que é **eventualmente consistente**: logo depois de criar, a lista pode voltar sem a refeição nova |
| Lista do dia depois de mexer em itens | Copiar os itens de `['meal', id]` para a refeição na lista | Mesmo motivo: o índice pode devolver o item removido de volta |
| Refeição depois de mexer em itens | Gravar a resposta e invalidar `['meal', id]` | O `GET /meals/{id}` lê com consistência forte; buscar de novo é seguro e corrige qualquer corrida |
| Cota depois de criar uma refeição | Gravar `mealQuota`/`dailyMealQuota` do `201` | Evita um `GET /me` a cada refeição. Se a resposta não trouxer a cota, ou o plano dela não bater com o do cache (a resposta tem `dailyMealQuota` e o cache diz Free, ou o contrário), cai no `invalidateQueries` |
| Conta depois de editar perfil, meta ou plano | Invalidar `['accounts']` | As rotas respondem `204` ou um status curto; a fonte da verdade é o `/me` |

### `insertMealIntoDayList`

[`mealItemsCache.ts`](../../src/app/hooks/mutations/mealItemsCache.ts). Insere a refeição na lista do dia **local** em que ela foi criada (`toLocalIsoDate(meal.createdAt)`):

- Só mexe se a lista daquele dia já estiver no cache; se não estiver, ela será buscada quando o usuário abrir o dia.
- Não duplica (confere o `id`).
- Insere ordenando por `createdAt`, da mais nova para a mais antiga, como a API devolve.
- Grava o `timeZone` do aparelho junto, para a Home mostrar a hora como a API mostraria.
- Se a lista estava marcada como invalidada, continua invalidada depois da inserção (para a próxima busca ainda acontecer).

### Mutations de itens

Adicionar, remover e restaurar item compartilham a `mutationKey` `['meal-items', mealId]`. Remover e restaurar são **otimistas**: o `onMutate` cancela as buscas em andamento e muda `['meal', id]` e as listas `['meals', ...]` antes da resposta. No fim (sucesso ou erro), `syncMealAfterItemsMutation`:

1. Se ainda há outra mutation de itens da mesma refeição rodando (`isMutating > 1`), não faz nada: **só a última a terminar sincroniza**, para uma resposta antiga não sobrescrever o estado de uma ação mais nova.
2. Grava a refeição devolvida (se houver) em `['meal', id]`.
3. Invalida `['meal', id]` e espera a busca nova.
4. Copia os itens dessa versão para a refeição nas listas da Home.

Detalhes do fluxo em [Detalhes e itens](fluxos/refeicao-itens.md).

## Polling do status da refeição

`useGetMealById(mealId, pollingStartedAt)` faz polling enquanto o status é `UPLOADING`, `QUEUED` ou `PROCESSING`. O relógio começa no fim do upload (`uploadedAt`, devolvido pelo `useCreateMeal`):

| Tempo desde o upload | Intervalo entre consultas |
|---|---|
| 0 a 20 s | 2 s |
| depois de 20 s | o anterior × 1,5 (3 s, 4,5 s, 6,75 s...) até o máximo de 10 s |
| 3 min | para |

Ao chegar nos 3 min, um `setTimeout` independente do `refetchInterval` faz **uma última consulta** (esse timer corre mesmo com a aba oculta ou o app em segundo plano, quando o `refetchInterval` pode pausar). Se a refeição ainda estiver em andamento, o hook devolve `isPollingTimedOut: true` e o modal reage ([foto ou áudio](fluxos/refeicao-foto-audio.md#passo-a-passo)).

Na tela `MealDetails`, o hook é chamado sem `pollingStartedAt`; se a refeição estiver em processamento (aberta pela Home antes de terminar), o polling roda a cada 2 s, sem backoff e sem limite de tempo, até um status terminal.

## O que fica guardado no aparelho

No web, o `AsyncStorage` grava no `localStorage` (compartilhado entre abas da mesma origem).

| Chave | Onde | Conteúdo | Quem usa |
|---|---|---|---|
| `@nacal:authtokens` | `AsyncStorage` | `{ accessToken, refreshToken }` em JSON | [`AuthTokenManager`](../../src/app/libs/AuthTokenManager.ts) |
| `@nacal:install-tip-dismissed-at` | `AsyncStorage` | Timestamp do "Agora não" da dica de instalação; silencia por 7 dias | [`InstallTipStorage`](../../src/app/libs/InstallTipStorage.ts) |
| `@nacal:yearly-expiry-notice-dismissed` | `AsyncStorage` | `paidUntil` (ISO) do aviso de anual vencido que foi dispensado | [`YearlyExpiryNoticeStorage`](../../src/app/libs/YearlyExpiryNoticeStorage.ts) |
| `nacal:checkout:pending` | `sessionStorage` (só web) | `<timestamp>\|<paidUntil anterior>`, gravado antes de ir para o Asaas; vale 30 min | [`usePlansScreen`](../../src/ui/screens/plans/usePlansScreen.ts) |

Só em memória (some ao recarregar):

- **Senha do cadastro pendente** (`pendingSignUp` no `AuthContext`), usada na confirmação por código.
- **Formulário do onboarding**: recarregar no meio das etapas volta para o começo.
- Todo o cache do TanStack Query.

Os acessos ao storage das dicas e avisos são envolvidos em `try/catch`: sem storage (aba privada, por exemplo), a dica só volta na próxima sessão e o aviso pode reaparecer, mas nada quebra.

## Arquivos envolvidos

| Parte | Arquivo |
|---|---|
| Client e padrões | [`libs/queryClient.ts`](../../src/app/libs/queryClient.ts) |
| Queries | [`hooks/queries/`](../../src/app/hooks/queries/) |
| Mutations | [`hooks/mutations/`](../../src/app/hooks/mutations/) |
| Lista e itens no cache | [`mealItemsCache.ts`](../../src/app/hooks/mutations/mealItemsCache.ts) |
| Cota no cache | [`mealQuotaCache.ts`](../../src/app/hooks/mutations/mealQuotaCache.ts) |
| Data local da lista | [`utils/toLocalIsoDate.ts`](../../src/app/utils/toLocalIsoDate.ts) |
| Índice da listagem na API | [Modelo de dados da API](https://github.com/nivaldoandrade/nacal-api/blob/main/docs/guide/03-modelo-de-dados.md) |
