BO DIGITAL GSP — v32.0.0
Fluxo Padronizado Profissional

OBJETIVO
O BO Digital GSP v32 foi reorganizado para reduzir esquecimentos durante a coleta de informações e padronizar a elaboração dos boletins da Segurança Patrimonial.

O aplicativo deixa de funcionar como um formulário genérico e passa a atuar como um roteiro operacional guiado: o vigilante escolhe a natureza e o tipo da ocorrência, e o sistema apresenta somente os blocos, perguntas e evidências pertinentes àquele boletim.

FLUXO OPERACIONAL ADOTADO
1. O solicitante realiza o chamado por telefone.
2. O atendente repassa a solicitação ao vigilante.
3. Ao chegar ao local, o vigilante toca em “Novo boletim”.
4. Nesse momento, o aplicativo registra automaticamente o início do BO/atendimento.
5. O vigilante coleta e registra as informações guiado pelo modelo da ocorrência.
6. Na revisão, o sistema aponta pendências essenciais e recomendações.
7. Ao tocar em “Finalizar e enviar”, o horário de término é registrado, o BO é finalizado e ocorre a tentativa de sincronização com o Google Sheets.

NOVA ORGANIZAÇÃO EM 5 ETAPAS
1. OCORRÊNCIA
   - natureza da ocorrência;
   - tipo de boletim;
   - data e hora do fato;
   - local e identificação detalhada;
   - solicitante;
   - diretoria e área/setor.

2. DADOS ESSENCIAIS
   - pessoas envolvidas;
   - relação do solicitante com o fato;
   - testemunhas;
   - veículos;
   - materiais, peças, equipamentos ou cargas.
   O aplicativo oculta automaticamente os grupos sem relação com o modelo escolhido.

3. APURAÇÃO
   - relato recebido de solicitante/envolvido/terceiro;
   - constatação própria da Segurança Patrimonial;
   - roteiro padronizado específico para a ocorrência.
   As perguntas são classificadas como Essenciais, Recomendadas ou Opcionais.

4. PROVIDÊNCIAS E EVIDÊNCIAS
   - providências adotadas;
   - áreas/responsáveis acionados;
   - desfecho;
   - fotos e documentos;
   - justificativa quando uma evidência essencial não puder ser registrada;
   - geração local de relato profissional.

5. REVISÃO E FINALIZAÇÃO
   - conferência dos blocos essenciais;
   - pendências clicáveis com retorno direto ao ponto de correção;
   - resumo de envolvidos, testemunhas, veículos e materiais;
   - apuração padronizada;
   - providências e evidências;
   - relato consolidado;
   - início e duração do atendimento;
   - confirmações obrigatórias antes da finalização.

PADRONIZAÇÃO POR TIPO DE BO
A versão possui 41 modelos distribuídos em 7 grupos:
- Acesso e credenciamento;
- Veículos e circulação;
- Materiais, peças e cargas;
- Pessoas, conduta e saúde;
- Instalações, patrimônio e emergências;
- Atividade de segurança e controle;
- Outras ocorrências.

Cada modelo define:
- quais entidades devem ser coletadas;
- quais perguntas são essenciais;
- quais informações são recomendadas;
- quando evidência é essencial ou recomendada;
- orientação operacional de preenchimento.

INFORMAÇÃO NÃO OBTIDA
O sistema não deve incentivar o preenchimento de informações inventadas. Para perguntas textuais essenciais existe a opção “Não foi possível obter”. Quando utilizada, o vigilante informa o motivo real da indisponibilidade.

LINGUAGEM PROFISSIONAL
O formulário foi organizado para distinguir:
- o que foi informado por terceiros;
- o que foi constatado pela Segurança Patrimonial;
- as providências adotadas.

O relato consolidado é gerado localmente a partir dos dados preenchidos, com linguagem objetiva e formal. O texto não cria fatos que não estejam registrados no boletim e pode ser revisado pelo vigilante antes do envio.

NEXO OPERADOR — SEM API PAGA
O NEXO continua funcionando em modo local, sem necessidade de OpenAI/Luna.
Recursos relevantes:
- situação atual;
- prioridades;
- roteiro do BO atual;
- checklist do BO;
- consulta e abertura de registros;
- fila de sincronização;
- passagem de turno;
- diagnóstico;
- sincronização com confirmação;
- novo boletim por comando.

Exemplos:
“Nexo, roteiro deste BO.”
“Nexo, o que falta neste BO?”
“Nexo, situação atual.”

CONFIABILIDADE E OFFLINE
Foram preservados os recursos de confiabilidade das versões anteriores:
- salvamento automático local;
- recuperação de rascunhos;
- funcionamento offline;
- fila de sincronização somente para BOs finalizados;
- retry/backoff;
- detecção de conflito entre aparelhos;
- auditoria;
- lightbox de evidências;
- atualização do PWA;
- diagnóstico do sistema;
- criptografia local opcional;
- atalhos e Share Target PWA.

TEMPO OPERACIONAL
Não existe mais um painel separado “Elaboração x atendimento” na primeira etapa.
O ciclo operacional adotado é único:
- início: criação do novo BO quando o vigilante chega ao local;
- fim: finalização/envio do BO;
- duração: intervalo entre esses dois momentos.
A apresentação detalhada do tempo fica concentrada na revisão e nas telas de consulta.

GOOGLE APPS SCRIPT
Backend requerido: API 6.3.0
Esquema requerido: compact-t

IMPORTANTE: a reorganização da v32 foi feita no frontend e mantém compatibilidade com o Google Apps Script 6.3.0. Se o endpoint 6.3.0 já está publicado e funcionando, não é necessário criar uma nova implantação apenas para usar esta versão do aplicativo.

PUBLICAÇÃO NO GITHUB PAGES
1. Faça backup da versão atual.
2. Substitua os arquivos do repositório pelos arquivos deste pacote, preservando a mesma estrutura na raiz.
3. Aguarde a publicação do GitHub Pages.
4. Abra o aplicativo conectado à internet.
5. Quando o PWA detectar a nova versão, use “Atualizar agora”.
6. Em aparelhos que insistirem em cache antigo, feche e reabra o PWA após a publicação.

TESTE FUNCIONAL RECOMENDADO
Primeiro teste:
- Novo boletim;
- Veículos e circulação;
- Acidente ou colisão com veículo;
- preencher localização/solicitante;
- registrar os dados essenciais;
- responder o roteiro da apuração;
- registrar providências/evidência;
- gerar o relato;
- revisar as pendências;
- finalizar e conferir a sincronização.

Depois, teste modelos com comportamento diferente:
- Entrada de veículo com danos;
- Divergência de carga, quantidade ou documentação;
- Desaparecimento de material ou equipamento;
- Acesso não autorizado;
- Ocorrência médica, mal-estar ou acidente pessoal.

ARQUIVOS PRINCIPAIS
index.html              Interface base
styles.css              Layout e responsividade
app.js                   Regras, fluxo, persistência e sincronização
bo-templates.js          Biblioteca dos 41 modelos padronizados
assistant.js             NEXO Operador local
advanced.js              Recursos avançados
pwa.js                   Instalação/atualização PWA
service-worker.js        Cache e funcionamento offline
manifest.json            Manifesto PWA/atalhos/share target
google-apps-script.gs    Referência do backend 6.3.0 já compatível
MATRIZ_BO_PADRONIZADOS.txt Matriz funcional dos modelos
TESTES_REALIZADOS.txt    Validações da versão

VERSÃO DO APLICATIVO
32.0.0
