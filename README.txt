BO DIGITAL GSP — v30.0.0 — NEXO OPERADOR + ATUALIZAÇÃO DO PWA

Base utilizada:
- v29.0.0, que já continha o NEXO contextual e operacional.
- API Google Sheets permanece 6.3.0 / schema compact-t.
- Nenhuma alteração no Apps Script é necessária para usar as novidades desta versão.

NOVIDADES v30
1. NEXO IDENTIFICADO COMO PERFIL OPERADOR
- O NEXO fica invisível na tela de login.
- Ele só aparece depois que existe uma sessão de operador no aplicativo.
- O cabeçalho passa a mostrar “NEXO • Perfil Operador”.
- O escopo acompanha a tela atual: visão geral, consulta, preenchimento, BO em análise ou área técnica.
- Isso é separação de interface, não autenticação corporativa forte. O login atual do BO Digital continua sendo a identificação operacional já existente.

2. ATUALIZAÇÃO VISÍVEL DO APLICATIVO
- Quando uma nova versão do PWA fica pronta, aparece uma faixa:
  “Nova versão disponível”.
- O usuário pode tocar em “Atualizar agora” ou “Depois”.
- Ao tocar em Atualizar, o novo Service Worker assume e o aplicativo recarrega na versão nova.
- O app verifica atualizações ao abrir, ao voltar para primeiro plano e aproximadamente a cada 15 minutos enquanto estiver em uso.

3. CACHE PWA CONTROLADO
- Novo cache: bo-digital-gsp-v30-nexo-operador-update-api63.
- O Service Worker não força mais a troca silenciosa durante a instalação; aguarda o comando “Atualizar agora”.
- Arquivos críticos continuam usando estratégia de rede primeiro, com fallback offline.

NEXO LOCAL
Continua sem custo e sem OpenAI para os comandos locais já existentes, incluindo:
- Situação atual
- Prioridades
- Rascunhos
- BOs sem sincronizar
- Abrir/resumir BO
- Sincronizar com confirmação
- Iniciar novo boletim
- Modo conversa

OBSERVAÇÃO SOBRE “SOLICITANTE x OPERADOR”
Esta base BO Digital GSP é o aplicativo operacional usado para registrar boletins. Ela não possui uma Área do Solicitante separada. Por isso, nesta v30 o NEXO foi protegido visualmente como NEXO Operador e fica oculto antes do login. Se futuramente o app do solicitante for incorporado a esta mesma base, podemos criar um NEXO Solicitante limitado a abrir e consultar o próprio chamado.

PUBLICAÇÃO
1. Substitua no GitHub os arquivos da v29 pelos arquivos da v30.
2. Não é necessário alterar o Google Apps Script apenas por causa desta v30.
3. Abra o aplicativo conectado à internet.
4. Usuários que ainda estiverem na v29 deverão receber a oferta de atualização quando o navegador detectar a nova versão.

ARQUIVOS PRINCIPAIS
- index.html
- styles.css
- app.js
- assistant.js
- pwa.js
- service-worker.js
- manifest.json
- google-apps-script.gs (mantido da v29)
