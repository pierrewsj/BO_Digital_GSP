(() => {
  'use strict';

  const NEXO_HISTORY_KEY = 'bo-digital-nexo-history-v1';
  const NEXO_VOICE_KEY = 'bo-digital-nexo-voice-v1';
  const NEXO_TOKEN_KEY = 'bo-digital-nexo-token-session-v1';
  const MAX_HISTORY = 24;
  const MAX_CONTEXT_RECORDS = 40;

  const ICON = {
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 11 18-8-8 18-2-8zM11 13l4-4"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v6h4l5 4V5L9 9zM18 9a4 4 0 0 1 0 6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>'
  };

  let messages = loadHistory();
  let recognition = null;
  let listening = false;
  let aiStatus = { checked: false, configured: false, requiresAccessToken: true, model: '', revision: '' };
  let busy = false;

  const root = document.createElement('div');
  root.id = 'nexo-root';
  root.innerHTML = `
    <button id="nexo-fab" class="nexo-fab" type="button" aria-label="Abrir NEXO Assistente IA" title="NEXO Assistente IA">
      <span class="nexo-fab-core" aria-hidden="true">${ICON.spark}</span>
      <span class="nexo-fab-label">NEXO</span>
    </button>
    <div id="nexo-backdrop" class="nexo-backdrop hidden" aria-hidden="true">
      <section class="nexo-panel" role="dialog" aria-modal="true" aria-labelledby="nexo-title">
        <header class="nexo-header">
          <div class="nexo-identity">
            <span class="nexo-orb" aria-hidden="true"><i></i><b></b>${ICON.spark}</span>
            <div>
              <p>NEXO • Assistente IA</p>
              <h2 id="nexo-title">Como posso ajudar?</h2>
            </div>
          </div>
          <div class="nexo-header-actions">
            <button id="nexo-voice-toggle" class="nexo-icon-button" type="button" aria-label="Ativar ou desativar resposta por voz" title="Resposta por voz">${ICON.speaker}</button>
            <button id="nexo-close" class="nexo-icon-button" type="button" aria-label="Fechar NEXO">${ICON.close}</button>
          </div>
        </header>
        <div class="nexo-statusbar">
          <span id="nexo-status-dot" class="nexo-status-dot local"><i></i><b id="nexo-status-label">Modo local</b></span>
          <span id="nexo-scope">Dados do BO Digital</span>
        </div>
        <div id="nexo-messages" class="nexo-messages" aria-live="polite"></div>
        <div class="nexo-quick" aria-label="Comandos rápidos">
          <button type="button" data-nexo-prompt="Faça um resumo dos boletins de hoje">Resumo de hoje</button>
          <button type="button" data-nexo-prompt="Quantos rascunhos existem?">Rascunhos</button>
          <button type="button" data-nexo-prompt="Qual é o último boletim?">Último BO</button>
          <button type="button" data-nexo-prompt="Iniciar novo boletim">Novo boletim</button>
        </div>
        <form id="nexo-form" class="nexo-compose">
          <button id="nexo-mic" class="nexo-mic" type="button" aria-label="Falar com o NEXO" title="Falar">${ICON.mic}</button>
          <label class="nexo-input-wrap" for="nexo-input">
            <span class="sr-only">Mensagem para o NEXO</span>
            <textarea id="nexo-input" rows="1" maxlength="700" placeholder="Digite ou toque no microfone…"></textarea>
          </label>
          <button id="nexo-send" class="nexo-send" type="submit" aria-label="Enviar mensagem" title="Enviar">${ICON.send}</button>
        </form>
        <p class="nexo-footnote">Ações críticas, exclusões e finalização de BO continuam protegidas pela interface normal do aplicativo.</p>
      </section>
    </div>`;
  document.body.appendChild(root);

  const fab = root.querySelector('#nexo-fab');
  const backdrop = root.querySelector('#nexo-backdrop');
  const panel = root.querySelector('.nexo-panel');
  const closeButton = root.querySelector('#nexo-close');
  const messagesEl = root.querySelector('#nexo-messages');
  const form = root.querySelector('#nexo-form');
  const input = root.querySelector('#nexo-input');
  const micButton = root.querySelector('#nexo-mic');
  const sendButton = root.querySelector('#nexo-send');
  const voiceToggle = root.querySelector('#nexo-voice-toggle');
  const statusDot = root.querySelector('#nexo-status-dot');
  const statusLabel = root.querySelector('#nexo-status-label');

  if (!messages.length) {
    messages = [{
      role: 'assistant',
      text: 'Olá. Eu sou o NEXO. Posso consultar boletins, resumir a atividade, localizar registros e iniciar um novo BO. Você pode falar ou digitar.',
      ts: Date.now()
    }];
    saveHistory();
  }

  function safeText(value = '') {
    return String(value ?? '').trim();
  }

  function normalize(value = '') {
    return safeText(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s/-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escape(value = '') {
    return safeText(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function loadHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(NEXO_HISTORY_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.slice(-MAX_HISTORY) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory() {
    try { localStorage.setItem(NEXO_HISTORY_KEY, JSON.stringify(messages.slice(-MAX_HISTORY))); } catch (_) {}
  }

  function voiceEnabled() {
    try { return localStorage.getItem(NEXO_VOICE_KEY) !== 'off'; } catch (_) { return true; }
  }

  function setVoiceEnabled(enabled) {
    try { localStorage.setItem(NEXO_VOICE_KEY, enabled ? 'on' : 'off'); } catch (_) {}
    voiceToggle.classList.toggle('active', enabled);
    voiceToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  }

  function renderMessages() {
    messagesEl.innerHTML = messages.map(message => `
      <article class="nexo-message ${message.role === 'user' ? 'user' : 'assistant'}">
        <span class="nexo-message-avatar" aria-hidden="true">${message.role === 'user' ? 'EU' : 'NX'}</span>
        <div><p>${escape(message.text).replace(/\n/g, '<br>')}</p></div>
      </article>`).join('');
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addMessage(role, text, options = {}) {
    const value = safeText(text);
    if (!value) return;
    messages.push({ role, text: value, ts: Date.now() });
    messages = messages.slice(-MAX_HISTORY);
    saveHistory();
    renderMessages();
    if (role === 'assistant' && options.speak !== false) speak(value);
  }

  function setBusy(value, label = '') {
    busy = value;
    form.classList.toggle('busy', value);
    sendButton.disabled = value;
    micButton.disabled = value;
    input.disabled = value;
    if (label) statusLabel.textContent = label;
  }

  function updateVisibility() {
    const loggedIn = document.body.dataset.route !== 'login' && Boolean(state?.operator);
    fab.classList.toggle('hidden', !loggedIn);
    if (!loggedIn && !backdrop.classList.contains('hidden')) closeAssistant();
  }

  async function checkAiStatus(force = false) {
    if (aiStatus.checked && !force) return aiStatus;
    aiStatus = { checked: true, configured: false, requiresAccessToken: true, model: '', revision: '' };
    if (!navigator.onLine || !apiConfigured()) {
      updateStatus();
      return aiStatus;
    }
    try {
      const result = await apiGet({ action: 'assistantstatus' });
      aiStatus = {
        checked: true,
        configured: result.assistantConfigured === true,
        requiresAccessToken: result.requiresAccessToken !== false,
        model: safeText(result.model),
        revision: safeText(result.revision)
      };
    } catch (_) {
      aiStatus = { checked: true, configured: false, requiresAccessToken: true, model: '', revision: '' };
    }
    updateStatus();
    return aiStatus;
  }

  function updateStatus() {
    statusDot.classList.remove('online', 'local', 'offline', 'listening', 'thinking');
    if (listening) {
      statusDot.classList.add('listening');
      statusLabel.textContent = 'Ouvindo…';
      return;
    }
    if (busy) {
      statusDot.classList.add('thinking');
      statusLabel.textContent = 'Analisando…';
      return;
    }
    if (!navigator.onLine) {
      statusDot.classList.add('offline');
      statusLabel.textContent = 'Offline • modo local';
    } else if (aiStatus.configured) {
      statusDot.classList.add('online');
      statusLabel.textContent = 'IA conectada';
    } else {
      statusDot.classList.add('local');
      statusLabel.textContent = 'Modo local + voz';
    }
  }

  async function openAssistant() {
    if (!state?.operator) return;
    backdrop.classList.remove('hidden');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nexo-open');
    renderMessages();
    setVoiceEnabled(voiceEnabled());
    input.focus({ preventScroll: true });
    await checkAiStatus();
  }

  function closeAssistant() {
    stopListening();
    backdrop.classList.add('hidden');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nexo-open');
    window.speechSynthesis?.cancel?.();
    fab.focus({ preventScroll: true });
  }

  function speak(text) {
    if (!voiceEnabled() || !('speechSynthesis' in window)) return;
    const clean = safeText(text).replace(/\bhttps?:\/\/\S+/gi, '').slice(0, 900);
    if (!clean) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'pt-BR';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function setupRecognition() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return null;
    const rec = new Recognition();
    rec.lang = 'pt-BR';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onstart = () => {
      listening = true;
      micButton.classList.add('listening');
      updateStatus();
    };
    rec.onresult = event => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0]?.transcript || '';
      }
      input.value = transcript.trim();
      autoGrowInput();
      const last = event.results[event.results.length - 1];
      if (last?.isFinal && input.value.trim()) {
        setTimeout(() => submitPrompt(input.value.trim()), 120);
      }
    };
    rec.onerror = event => {
      listening = false;
      micButton.classList.remove('listening');
      updateStatus();
      const blocked = ['not-allowed', 'service-not-allowed'].includes(event.error);
      addMessage('assistant', blocked
        ? 'O navegador não liberou o microfone. Autorize o acesso ao microfone nas permissões do site ou use o campo de texto.'
        : 'Não consegui entender o áudio. Tente novamente ou digite a mensagem.', { speak: false });
    };
    rec.onend = () => {
      listening = false;
      micButton.classList.remove('listening');
      updateStatus();
    };
    return rec;
  }

  function startListening() {
    if (busy) return;
    if (!recognition) recognition = setupRecognition();
    if (!recognition) {
      addMessage('assistant', 'Este navegador não oferece reconhecimento de voz pelo Web Speech. O NEXO continua funcionando por texto.', { speak: false });
      return;
    }
    try {
      window.speechSynthesis?.cancel?.();
      recognition.start();
    } catch (_) {}
  }

  function stopListening() {
    if (!recognition || !listening) return;
    try { recognition.stop(); } catch (_) {}
  }

  function mergedRecords(localRecords, remoteRecords) {
    const map = new Map();
    (localRecords || []).forEach(record => { if (record?.id) map.set(record.id, record); });
    (remoteRecords || []).forEach(record => {
      if (!record?.id) return;
      const current = map.get(record.id);
      if (!current || safeText(record.updatedAt) > safeText(current.updatedAt)) map.set(record.id, record);
    });
    return [...map.values()].sort((a, b) => safeText(b.updatedAt).localeCompare(safeText(a.updatedAt)));
  }

  async function getAllRecords(refreshRemote = false) {
    let remote = state.remoteRecords || [];
    if (refreshRemote && navigator.onLine && apiConfigured()) {
      try {
        const payload = await apiGet({ action: 'list' });
        remote = (payload.records || []).map(item => ({ ...normalizeRecord(item), _source: 'remote' }));
        state.remoteRecords = remote;
      } catch (_) {}
    }
    return mergedRecords(state.records || [], remote);
  }

  function recordNumber(record) {
    return safeText(record?.numero || record?.numeroTemporario || 'Sem número');
  }

  function summarizeRecord(record) {
    if (!record) return 'Registro não encontrado.';
    const b = record.basic || {};
    const ref = safeText(resolvedReference(record) || b.referencia || 'Referência não informada');
    const local = [b.local, b.complementoLocal].filter(Boolean).join(' — ');
    return `${recordNumber(record)} • ${safeText(record.status || 'Sem status')} • ${ref}${local ? ` • ${local}` : ''}${b.data ? ` • ${b.data}${b.hora ? ` às ${b.hora}` : ''}` : ''}`;
  }

  function compactContext(records) {
    const today = localDateInput();
    const selected = records.slice(0, MAX_CONTEXT_RECORDS);
    return {
      app: 'BO Digital GSP',
      dataLocal: today,
      vigilante: {
        nome: safeText(state.operator?.usuario),
        registro: safeText(state.operator?.registro),
        turno: safeText(state.operator?.turno)
      },
      totais: {
        total: records.length,
        rascunhos: records.filter(r => r.status === 'Rascunho').length,
        finalizados: records.filter(r => r.status === 'Finalizado').length,
        hoje: records.filter(r => safeText(r.basic?.data) === today).length
      },
      registrosRecentes: selected.map(record => ({
        numero: recordNumber(record),
        status: safeText(record.status),
        data: safeText(record.basic?.data),
        hora: safeText(record.basic?.hora),
        referencia: safeText(resolvedReference(record) || record.basic?.referencia),
        local: [record.basic?.local, record.basic?.complementoLocal].filter(Boolean).join(' — '),
        solicitante: safeText(record.basic?.nomeEmissor),
        matriculaSolicitante: safeText(record.basic?.matriculaEmissor),
        atualizadoEm: safeText(record.updatedAt)
      }))
    };
  }

  function extractRecordQuery(text) {
    const raw = safeText(text).toUpperCase();
    const boMatch = raw.match(/(?:BO|BOLETIM)\s*[-#:º°N]*\s*([A-Z0-9./-]{2,})/i);
    if (boMatch?.[1]) return boMatch[1];
    const numeric = raw.match(/\b(\d{1,8})\b/);
    return numeric?.[1] || '';
  }

  function matchesRecordNumber(record, query) {
    const q = normalize(query).replace(/\s/g, '');
    if (!q) return false;
    const number = normalize(recordNumber(record)).replace(/\s/g, '');
    if (number === q || number.endsWith(q)) return true;
    const digitsQ = q.replace(/\D/g, '');
    const digitsN = number.replace(/\D/g, '');
    return digitsQ && digitsN.endsWith(digitsQ.padStart(Math.min(6, Math.max(digitsQ.length, 1)), '0')) || (digitsQ && digitsN.endsWith(digitsQ));
  }

  async function handleLocalCommand(text, records) {
    const n = normalize(text);
    const today = localDateInput();

    if (/\b(novo|nova|iniciar|criar|abrir)\b.*\b(bo|boletim|ocorrencia)\b/.test(n)) {
      addMessage('assistant', 'Vou abrir um novo boletim.');
      closeAssistant();
      await createNewBo();
      return { handled: true, action: true };
    }

    if (/\b(ajuda|o que voce faz|comandos|capaz)\b/.test(n)) {
      return { handled: true, response: 'Posso resumir os boletins, contar rascunhos e finalizados, localizar um BO pelo número, abrir um registro e iniciar um novo boletim. Quando a IA estiver configurada, também respondo perguntas mais livres sobre os dados disponíveis.' };
    }

    const recordQuery = extractRecordQuery(text);
    if (recordQuery && /\b(consult|buscar|procura|localiz|abrir|ver|mostr|status|situacao)\w*\b/.test(n)) {
      const found = records.find(record => matchesRecordNumber(record, recordQuery));
      if (!found) return { handled: true, response: `Não encontrei um boletim correspondente a ${recordQuery} nos dados disponíveis.` };
      if (/\b(abrir|ver|mostr)\w*\b/.test(n)) {
        addMessage('assistant', `Encontrei ${summarizeRecord(found)}. Vou abrir o registro.`);
        closeAssistant();
        await openRecord(found.id);
        return { handled: true, action: true };
      }
      return { handled: true, response: summarizeRecord(found) };
    }

    if (/\b(ultimo|mais recente|recente)\b.*\b(bo|boletim|registro)\b/.test(n)) {
      return { handled: true, response: records.length ? `O boletim mais recente é: ${summarizeRecord(records[0])}.` : 'Ainda não há boletins disponíveis.' };
    }

    if (/\b(rascunh)\w*\b/.test(n) && /\b(quant|exist|tem|lista|mostr|quais)\w*\b/.test(n)) {
      const drafts = records.filter(record => record.status === 'Rascunho');
      const list = drafts.slice(0, 5).map(recordNumber).join(', ');
      return { handled: true, response: drafts.length
        ? `Existem ${drafts.length} rascunho${drafts.length === 1 ? '' : 's'}. ${list ? `Mais recentes: ${list}.` : ''}`
        : 'Não há rascunhos disponíveis.' };
    }

    if (/\b(finaliz)\w*\b/.test(n) && /\b(quant|exist|tem|total)\w*\b/.test(n)) {
      const count = records.filter(record => record.status === 'Finalizado').length;
      return { handled: true, response: `Há ${count} boletim${count === 1 ? '' : 's'} finalizado${count === 1 ? '' : 's'} nos dados disponíveis.` };
    }

    if (/\b(hoje|resumo|atividade)\b/.test(n) && /\b(bo|boletim|registro|resumo|atividade|quant)\w*\b/.test(n)) {
      const todayRecords = records.filter(record => safeText(record.basic?.data) === today);
      const finalized = todayRecords.filter(record => record.status === 'Finalizado').length;
      const drafts = todayRecords.filter(record => record.status === 'Rascunho').length;
      const refs = new Map();
      todayRecords.forEach(record => {
        const ref = safeText(resolvedReference(record) || record.basic?.referencia || 'Sem referência');
        refs.set(ref, (refs.get(ref) || 0) + 1);
      });
      const topRef = [...refs.entries()].sort((a, b) => b[1] - a[1])[0];
      return { handled: true, response: todayRecords.length
        ? `Hoje há ${todayRecords.length} boletim${todayRecords.length === 1 ? '' : 's'}: ${finalized} finalizado${finalized === 1 ? '' : 's'} e ${drafts} rascunho${drafts === 1 ? '' : 's'}.${topRef ? ` Assunto mais frequente: ${topRef[0]} (${topRef[1]}).` : ''}`
        : 'Não encontrei boletins com a data de hoje nos dados disponíveis.' };
    }

    if (/\b(quant|total|numero de)\w*\b.*\b(bo|boletim|registro)\w*\b/.test(n)) {
      return { handled: true, response: `Há ${records.length} boletim${records.length === 1 ? '' : 's'} disponível${records.length === 1 ? '' : 'eis'}: ${records.filter(r => r.status === 'Rascunho').length} rascunho(s) e ${records.filter(r => r.status === 'Finalizado').length} finalizado(s).` };
    }

    if (/\b(ir|abrir|mostrar)\b.*\b(lista|boletins|registros)\b/.test(n)) {
      addMessage('assistant', 'Abrindo a consulta de boletins.');
      closeAssistant();
      await navigate('records');
      return { handled: true, action: true };
    }

    return { handled: false };
  }

  function getAssistantToken(askIfMissing = true) {
    let token = '';
    try { token = sessionStorage.getItem(NEXO_TOKEN_KEY) || ''; } catch (_) {}
    if (token || !askIfMissing) return token;
    const entered = window.prompt('Código de acesso do NEXO IA. Esse código é definido nas propriedades do Apps Script e não é a chave da OpenAI.');
    token = safeText(entered);
    if (token) {
      try { sessionStorage.setItem(NEXO_TOKEN_KEY, token); } catch (_) {}
    }
    return token;
  }

  function clearAssistantToken() {
    try { sessionStorage.removeItem(NEXO_TOKEN_KEY); } catch (_) {}
  }

  async function askAi(text, records) {
    const status = await checkAiStatus();
    if (!status.configured) return null;
    const assistantToken = status.requiresAccessToken ? getAssistantToken(true) : '';
    if (status.requiresAccessToken && !assistantToken) return null;
    const recentConversation = messages.slice(-8).map(item => ({ role: item.role, text: item.text }));
    const payload = {
      action: 'assistant',
      assistantToken,
      message: safeText(text),
      context: compactContext(records),
      history: recentConversation,
      operator: {
        usuario: safeText(state.operator?.usuario),
        registro: safeText(state.operator?.registro),
        turno: safeText(state.operator?.turno)
      }
    };
    try {
      const result = await apiPost(payload);
      if (!result?.answer) throw new Error('A IA não devolveu uma resposta válida.');
      aiStatus.configured = result.assistantConfigured !== false;
      aiStatus.model = safeText(result.model || aiStatus.model);
      updateStatus();
      return safeText(result.answer);
    } catch (error) {
      if (String(error?.message || '').includes('NEXO_AUTH_REQUIRED')) clearAssistantToken();
      throw error;
    }
  }

  async function submitPrompt(rawText) {
    const text = safeText(rawText);
    if (!text || busy) return;
    stopListening();
    input.value = '';
    autoGrowInput();
    addMessage('user', text, { speak: false });
    setBusy(true, 'Analisando…');
    updateStatus();

    try {
      const records = await getAllRecords(true);
      const local = await handleLocalCommand(text, records);
      if (local.handled) {
        if (local.response) addMessage('assistant', local.response);
        return;
      }

      try {
        const aiAnswer = await askAi(text, records);
        if (aiAnswer) {
          addMessage('assistant', aiAnswer);
          return;
        }
      } catch (error) {
        console.warn('NEXO IA:', error);
        aiStatus.configured = false;
        updateStatus();
      }

      addMessage('assistant', 'Estou funcionando no modo local. Tente pedir “resumo de hoje”, “quantos rascunhos existem?”, “consultar BO 26” ou “iniciar novo boletim”. Para perguntas mais livres, é preciso ativar a integração de IA no Apps Script.', { speak: false });
    } finally {
      setBusy(false);
      updateStatus();
      input.disabled = false;
      input.focus({ preventScroll: true });
    }
  }

  function autoGrowInput() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
  }

  fab.addEventListener('click', openAssistant);
  closeButton.addEventListener('click', closeAssistant);
  backdrop.addEventListener('click', event => { if (event.target === backdrop) closeAssistant(); });
  panel.addEventListener('click', event => event.stopPropagation());
  micButton.addEventListener('click', () => listening ? stopListening() : startListening());
  voiceToggle.addEventListener('click', () => {
    const enabled = !voiceEnabled();
    setVoiceEnabled(enabled);
    if (!enabled) window.speechSynthesis?.cancel?.();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    submitPrompt(input.value);
  });
  input.addEventListener('input', autoGrowInput);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  root.querySelectorAll('[data-nexo-prompt]').forEach(button => button.addEventListener('click', () => submitPrompt(button.dataset.nexoPrompt)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !backdrop.classList.contains('hidden')) closeAssistant();
  });
  window.addEventListener('online', () => { aiStatus.checked = false; checkAiStatus(true); });
  window.addEventListener('offline', updateStatus);

  const routeObserver = new MutationObserver(updateVisibility);
  routeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-route'] });

  setVoiceEnabled(voiceEnabled());
  renderMessages();
  updateVisibility();
  updateStatus();

  window.NEXO_ASSISTANT = {
    open: openAssistant,
    close: closeAssistant,
    ask: submitPrompt,
    refreshStatus: () => checkAiStatus(true)
  };
})();
