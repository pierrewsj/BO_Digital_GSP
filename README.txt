BO DIGITAL GSP • PWA v31.0.0
CONFIABILIDADE OPERACIONAL + NEXO LOCAL

Esta versão evolui a base v30 sem exigir OpenAI, Luna ou qualquer API paga para os recursos do NEXO descritos abaixo.

PRINCIPAIS MELHORIAS

1. OPERAÇÃO OFFLINE MAIS SEGURA
- Banner explícito quando o aparelho fica sem internet.
- Dados continuam salvos localmente.
- Fila de sincronização visível.
- Retry automático progressivo: 10 s, 30 s, 1 min, 2 min e 5 min.
- Botão para tentar sincronizar imediatamente.
- Status por BO: sincronizado, pendente, erro ou conflito.

2. SALVAMENTO E RECUPERAÇÃO
- O preenchimento continua sendo salvo automaticamente no IndexedDB.
- Ao reabrir o app após interrupção, um rascunho em andamento pode ser recuperado.
- O último salvamento automático é exibido na recuperação.

3. CONFLITO ENTRE APARELHOS
- Antes de sobrescrever um BO já sincronizado, o app consulta a versão remota.
- Se detectar atualização feita por outro aparelho, marca o BO como conflito.
- O operador pode revisar antes de manter a cópia local ou carregar a remota.

4. NEXO OPERACIONAL SEM IA PAGA
- Feedback visual durante ações e mudanças de tela.
- Situação atual e prioridades.
- Checklist do BO com pendências obrigatórias e recomendadas.
- Acesso por comando à passagem de turno, fila de sincronização e diagnóstico.
- Comandos contextuais como “abra o primeiro” continuam disponíveis.

5. VALIDAÇÃO ANTES DA FINALIZAÇÃO
- Mantidas e reforçadas as validações condicionais por etapa/tipo de ocorrência.
- O checklist do NEXO usa a mesma lógica para apontar o que falta.

6. EVIDÊNCIAS
- Fotos podem ser abertas em lightbox para conferência em tela ampliada.
- Exclusões e inclusões de anexos entram na auditoria local.

7. AUDITORIA
- Eventos relevantes registram data/hora, usuário, registro e turno quando disponíveis.
- Criação, recuperação, anexos, sincronização e outras ações importantes geram histórico.

8. PASSAGEM DE TURNO
- Tela com rascunhos, pendências de sincronização e conflitos.
- Campo para observação de continuidade (armazenada localmente neste aparelho).
- Geração/cópia de resumo para passagem.

9. SAÚDE E DIAGNÓSTICO
- Card de saúde do sistema: internet, Google Sheets, fila e armazenamento.
- Diagnóstico com versão do app, API esperada, Service Worker, modo instalado, criptografia, uso de armazenamento, navegador, últimos testes e erros locais.

10. TEMPO OPERACIONAL
- Indicador visual de tempo aberto/duração nos cartões de BO.
- Faixas configuráveis localmente (padrão inicial: atenção em 20 min e crítico em 30 min).
- IMPORTANTE: essas faixas são indicadores operacionais locais e não representam SLA oficial da Stellantis, salvo se sua gestão definir assim.

11. CRIPTOGRAFIA LOCAL OPCIONAL
- AES-GCM 256 para os registros mantidos no IndexedDB.
- Chave derivada por PBKDF2/SHA-256.
- A senha não é gravada permanentemente; fica somente na sessão do navegador.
- Se a senha for perdida, os registros locais criptografados não poderão ser lidos. Cópias já sincronizadas no servidor são independentes.

12. PWA
- Atalhos: Novo BO, Consultar BOs e NEXO.
- Share Target de texto/link para abrir um novo rascunho com conteúdo compartilhado.
- Aviso explícito quando existe nova versão do PWA.

13. QR CODE DO BO
- QR gerado localmente, sem serviço externo.
- O QR aponta para um deep link do próprio aplicativo e tenta abrir o BO correspondente.
- Pode ser compartilhado/copiadado pelo navegador quando suportado.

14. LAZY LOAD
- assistant.js deixou de ser executado no carregamento inicial da tela de login.
- NEXO é carregado após o login/tempo ocioso.
- advanced.js (lightbox/QR) só carrega quando necessário.

PUBLICAÇÃO

Substitua no GitHub os arquivos da versão anterior pelos arquivos deste pacote.
O frontend continua exigindo a API Apps Script 6.3.0, portanto o endpoint atual permanece compatível.
O arquivo google-apps-script.gs incluído mantém APP_VERSION 6.3.0 e apenas atualiza SCRIPT_REVISION para v31-confiabilidade-operacional.

Se quiser que o diagnóstico/ping mostre a revisão v31, publique novamente o Apps Script depois de substituir o código. Isso não é necessário para os recursos puramente locais do frontend.

TESTE RÁPIDO RECOMENDADO

A) Offline
1. Entre no aplicativo.
2. Inicie um BO e preencha alguns campos.
3. Desative internet/Wi-Fi.
4. Continue preenchendo e confirme o banner offline.
5. Feche e reabra o app; confirme a recuperação do rascunho.
6. Reative internet e veja a fila sincronizar.

B) NEXO
- “Situação atual”
- “Quais são as prioridades?”
- “Checklist deste BO”
- “Abrir fila de sincronização”
- “Passagem de turno”
- “Abrir diagnóstico”

C) Evidência/QR
- Adicione uma foto e toque na miniatura para ampliar.
- Abra um BO salvo e use o botão QR.

D) Criptografia
- Ative somente depois de testar normalmente.
- Use uma senha de teste que você não esqueça.
- Feche/reabra e confirme o desbloqueio dos registros locais.
