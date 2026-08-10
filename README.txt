BO DIGITAL GSP — v28.0.0 — NEXO ASSISTENTE IA

Base utilizada:
- v27.0.0 com sincronização idempotente preservada.
- API Google Sheets continua 6.3.0 / schema compact-t.
- O ID interno do BO continua sendo a chave de idempotência.

NOVIDADE — NEXO
- Botão flutuante NEXO após o login do vigilante.
- Chat por texto dentro do próprio aplicativo.
- Entrada por voz quando o navegador oferece Web Speech / reconhecimento de fala.
- Resposta falada usando síntese de voz do navegador.
- Modo local funciona sem chave de IA e sem alterar BOs críticos.
- Comandos locais disponíveis:
  * “Faça um resumo dos boletins de hoje”.
  * “Quantos rascunhos existem?”.
  * “Qual é o último boletim?”.
  * “Consultar BO 26”.
  * “Abrir BO 26”.
  * “Iniciar novo boletim”.
  * “Abrir lista de boletins”.
- O NEXO consulta também a planilha quando houver internet e o endpoint estiver configurado.
- Finalização, exclusão e outras ações críticas continuam na interface normal do BO Digital.

IA OPENAI — OPCIONAL
O app funciona em modo local sem OpenAI. Para habilitar perguntas mais livres:

1. Substitua o código do Apps Script pelo arquivo google-apps-script.gs deste pacote.
2. No projeto do Apps Script, abra Configurações do projeto > Propriedades do script.
3. Crie a propriedade OPENAI_API_KEY com a sua chave da OpenAI.
4. Crie a propriedade NEXO_ACCESS_TOKEN com um código secreto forte escolhido por você.
   - Esse código NÃO é a chave da OpenAI.
   - Ele protege o endpoint de IA contra uso público indevido.
5. Opcional: crie OPENAI_MODEL. O padrão do pacote é gpt-5.6-luna.
6. Salve e publique uma NOVA VERSÃO da implantação existente do Apps Script.
7. Confirme que o /exec?action=assistantstatus devolve revision v28-nexo-ai e assistantConfigured true.
8. Ao fazer a primeira pergunta livre ao NEXO, o aplicativo solicitará o código NEXO_ACCESS_TOKEN.
   O código fica apenas na sessão do navegador e é apagado ao encerrar/reabrir a sessão do navegador.

SEGURANÇA IMPORTANTE
- Nunca coloque OPENAI_API_KEY dentro de app.js, assistant.js, index.html ou no GitHub.
- A chave fica somente nas Propriedades do Script do Apps Script.
- Como dados de BO podem conter informações corporativas e pessoais, habilite a IA externa apenas se o uso estiver autorizado pelas regras da empresa.
- O reconhecimento de voz do navegador pode utilizar o serviço de voz do próprio navegador/plataforma.

ATUALIZAÇÃO DO PWA
1. Substitua os arquivos do aplicativo no GitHub pelos deste pacote.
2. Mantenha todos os arquivos, inclusive assistant.js.
3. Feche e reabra o PWA.
4. Se uma versão antiga continuar aparecendo, feche completamente o aplicativo e abra novamente para o Service Worker v28 assumir.

ARQUIVOS PRINCIPAIS
- index.html
- styles.css
- app.js
- assistant.js      <- NEXO
- pwa.js
- service-worker.js
- manifest.json
- google-apps-script.gs

Observação:
A gravação real no Google Sheets, o reconhecimento de voz e a chamada real à OpenAI dependem respectivamente da implantação Google, das permissões/capacidades do navegador e da configuração da chave OpenAI.
