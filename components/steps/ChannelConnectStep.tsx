import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { ChatBubble } from '../ui/ChatBubble';

const QRCode: React.FC = () => {
  const size = 180; 
  const cells = 21; 
  const cs = size / cells;
  const [pattern] = useState(() => {
    const p = [];
    for (let i = 0; i < cells; i++) for (let j = 0; j < cells; j++)
      if ((i < 7 && j < 7) || (i < 7 && j >= cells - 7) || (i >= cells - 7 && j < 7) || Math.random() > 0.55)
        p.push({ x: j * cs, y: i * cs });
    return p;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-xl">
      <rect width={size} height={size} fill="white" rx="12" />
      {pattern.map((c, i) => <rect key={i} x={c.x} y={c.y} width={cs - 0.5} height={cs - 0.5} fill="#1B3D2F" rx={1.5} />)}
    </svg>
  );
};

const TermsModal: React.FC<{ title: string, onClose: () => void, children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
    <div className="bg-white rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl animate-slide-up overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10 shrink-0">
        <h3 className="text-xl font-bold text-brand-greenDark">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none transition-colors">&times;</button>
      </div>
      
      {/* Scrollable Content */}
      <div className="p-8 overflow-y-auto text-sm text-gray-600 leading-relaxed flex-1 custom-scrollbar">
        {children}
      </div>
      
      {/* Footer */}
      <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
        <button onClick={onClose} className="px-8 py-3 bg-brand-green text-white font-bold rounded-xl hover:brightness-105 transition-all shadow-lg shadow-brand-green/20">
          Li e aceito os termos
        </button>
      </div>
    </div>
  </div>
);

export const ChannelConnectStep: React.FC = () => {
  const { currentStep, nextStep, data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<'web'|'waba'|'both'|null>(null);
  const [showDetails, setShowDetails] = useState<'web'|'waba'|'both'|null>(null);
  
  // Terms State
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showContract, setShowContract] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Connect step states
  const [wabaPhase, setWabaPhase] = useState<'offer'|'qr'|'skip'>('offer');
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<{text: string, from: 'system'|'bot'}[]>([]);
  const [offerPulse, setOfferPulse] = useState(true);

  // Constants matching prototype
  const channels = [
    {
      id: "web",
      icon: "📱",
      name: "WhatsApp Web",
      badge: "Ativação imediata",
      badgeColor: "#2DD4A0",
      accent: "#2DD4A0",
      accentLt: "#E8F8F0",
      headline: "Conecte em 30 segundos",
      description: "Escaneie um QR Code e seu número pessoal ou comercial já está integrado ao ChatGuru. Sem burocracia, sem espera.",
      pros: [
        { icon: "⚡", text: "Ativação instantânea via QR Code" },
        { icon: "🔄", text: "Use seu número atual sem mudanças" },
        { icon: "💬", text: "Todas as conversas na plataforma" },
        { icon: "🤖", text: "Chatbot e automações inclusos" },
      ],
      note: "Utiliza integração não oficial (WhatsApp Web). Ideal para começar imediatamente."
    },
    {
      id: "waba",
      icon: "🏢",
      name: "API Oficial Meta",
      badge: "Verificado pela Meta",
      badgeColor: "#7BA3D4",
      accent: "#7BA3D4",
      accentLt: "#C8D9EE",
      headline: "Número comercial verificado",
      description: "Integração oficial da Meta com selo de verificação, maior confiabilidade e recursos exclusivos para empresas.",
      pros: [
        { icon: "✅", text: "Selo verde de verificado no WhatsApp" },
        { icon: "📊", text: "Envio de mensagens em massa (HSM)" },
        { icon: "🛡️", text: "Maior estabilidade e compliance" },
        { icon: "🏷️", text: "Templates oficiais aprovados pela Meta" },
      ],
      note: "Requer configuração assistida por nosso time (geralmente em até 24h úteis)."
    },
    {
      id: "both",
      icon: "🔥",
      name: "Ambos",
      badge: "Recomendado",
      badgeColor: "#E8952D",
      accent: "#E8952D",
      accentLt: "#F5DFC0",
      headline: "O melhor dos dois mundos",
      description: "Comece agora com WhatsApp Web enquanto nosso time configura sua API Oficial. Sem tempo de espera, máximo poder.",
      pros: [
        { icon: "⚡", text: "Comece atendendo agora, hoje" },
        { icon: "🏢", text: "API Oficial pronta em até 24h" },
        { icon: "🔄", text: "Transição suave e automática" },
        { icon: "💎", text: "Todos os recursos combinados" },
      ],
      note: "Atenda imediatamente via Web e ganhe a API Oficial sem interrupção."
    },
  ] as const;

  // Pulse effect for WABA Offer
  useEffect(() => {
    if (currentStep === 'connect' && wabaPhase === 'offer') {
      const t = setInterval(() => setOfferPulse(p => !p), 2000);
      return () => clearInterval(t);
    }
  }, [currentStep, wabaPhase]);

  // QR Code Logic
  useEffect(() => {
    if (currentStep !== 'connect') return;
    
    const channel = data.channel;
    const needsQR = channel === "web" || channel === "both";
    
    if ((!needsQR && wabaPhase !== "qr") || connected) return;

    if (needsQR || wabaPhase === "qr") {
      const t = setTimeout(() => setConnected(true), 3500);
      return () => clearTimeout(t);
    }
  }, [currentStep, data.channel, wabaPhase, connected]);

  // Messages after connection
  useEffect(() => {
    if (!connected) return;
    const channel = data.channel;
    const isAlsoWaba = channel === "both" || (channel === "waba" && wabaPhase === "qr");
    
    const msgs = [
      { delay: 600, from: "system", text: "✅ Número WhatsApp Web conectado com sucesso!" },
      { delay: 1800, from: "bot", text: "👋 Seu WhatsApp está pronto no ChatGuru!" },
      { delay: 3000, from: "bot", text: isAlsoWaba
        ? "💡 Enquanto isso, nosso time já está preparando sua API Oficial! Agora vamos configurar seu chatbot."
        : "💡 Agora vamos ativar seu chatbot de boas-vindas — rapidinho!" },
    ];
    
    const timers = msgs.map((m) => setTimeout(() => setMessages((prev) => [...prev, m as any]), m.delay));
    return () => timers.forEach(clearTimeout);
  }, [connected, data.channel, wabaPhase]);


  const handleSelectChannel = (id: any) => {
    setSelected(id);
    setShowDetails(id);
    setTermsAccepted(false); // Reset terms on new selection
  };

  const handleContinueSelection = () => {
    if (!selected) return;
    updateData({ channel: selected, hasWebNumber: selected === "web" || selected === "both" });
    nextStep();
  };

  const acceptWebOffer = () => {
    updateData({ hasWebNumber: true });
    setWabaPhase("qr");
  };

  const declineWebOffer = () => {
    setWabaPhase("skip");
    updateData({ hasWebNumber: false });
  };

  // --- RENDER: SELECTION STEP ---
  if (currentStep === 'channel') {
    return (
      <div className="py-4 text-center animate-fade-in relative">
        <h2 className="text-2xl font-bold text-brand-greenDark mb-1.5 font-sans">Como quer conectar seu WhatsApp?</h2>
        <p className="text-sm text-brand-textMuted mb-6">Escolha o tipo de integração ideal para o seu negócio</p>

        <div className="max-w-[720px] mx-auto">
          {/* Channel Cards - Top Row */}
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {channels.map((ch) => {
              const isActive = selected === ch.id;
              // If something is selected, fade out the others slightly
              const isDimmed = selected && !isActive; 
              
              return (
                <div
                  key={ch.id}
                  onClick={() => handleSelectChannel(ch.id)}
                  className={`flex-1 min-w-[200px] max-w-[230px] p-5 rounded-[20px] cursor-pointer text-center relative overflow-hidden transition-all duration-300
                    ${isActive ? 'transform -translate-y-1 z-10' : 'bg-white border-2 border-[#E2EDE7]'}
                    ${isDimmed ? 'opacity-60 scale-95' : 'hover:border-brand-green/30'}
                  `}
                  style={{
                    backgroundColor: isActive ? ch.accentLt : '#FFFFFF',
                    borderColor: isActive ? ch.accent : undefined,
                    borderWidth: isActive ? '3px' : '2px',
                    boxShadow: isActive ? `0 10px 30px ${ch.accent}30` : "0 2px 8px rgba(0,0,0,0.03)"
                  }}
                >
                  {/* Fixed "Recommended" Badge */}
                  {ch.id === "both" && (
                    <div className="absolute top-5 -right-12 w-[150px] bg-gradient-to-r from-brand-pastelOrange to-[#D4781F] text-white text-[9px] font-bold py-1.5 rotate-45 tracking-widest shadow-md text-center z-10">
                      RECOMENDADO
                    </div>
                  )}

                  <div className="text-4xl mb-3">{ch.icon}</div>
                  <div className="text-[15px] font-bold text-brand-greenDark mb-1.5">{ch.name}</div>
                  <div className="text-xs text-brand-textMuted leading-relaxed mb-4">{ch.headline}</div>

                  <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center transition-all duration-300
                    ${isActive ? '' : 'border-2 border-[#D5DED9] bg-transparent'}
                  `}
                  style={{
                    backgroundColor: isActive ? ch.accent : undefined
                  }}>
                    {isActive && <span className="text-white text-[12px] font-bold">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC CONTENT AREA */}
          
          {/* 1. DETAIL VIEW (When Selected) */}
          {showDetails && (
            <div className="bg-white rounded-[20px] shadow-lg border border-[#E2EDE7] overflow-hidden mb-8 animate-slide-up relative">
              {(() => {
                const ch = channels.find(c => c.id === showDetails);
                if (!ch) return null;

                return (
                  <div className="p-6 md:p-8 text-left">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-4xl p-3 bg-gray-50 rounded-2xl">{ch.icon}</div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-greenDark flex items-center gap-2">
                          {ch.name}
                          {ch.id === 'both' && <span className="text-[10px] bg-brand-pastelOrange text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Top Choice</span>}
                        </h3>
                        <p className="text-sm text-brand-textMuted mt-1 leading-relaxed max-w-lg">{ch.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      {ch.pros.map((pro, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <span className="text-lg">{pro.icon}</span>
                          <span className="text-[13px] font-semibold text-brand-greenDark">{pro.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Special Section for 'Both' */}
                    {ch.id === 'both' && (
                      <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-brand-greenLight to-[#d4f5e9] border border-brand-green relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🚀</div>
                        <div className="relative z-10">
                          <h4 className="text-sm font-bold text-brand-greenDark mb-2 flex items-center gap-2">
                            <span>💡</span> Estratégia Inteligente:
                          </h4>
                          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-brand-textMuted">
                            <div className="flex-1 bg-white/60 p-3 rounded-lg w-full">
                              <div className="font-bold text-brand-green mb-1">AGORA (0min)</div>
                              <div>Você conecta o <strong>WhatsApp Web</strong> e começa a vender imediatamente.</div>
                            </div>
                            <div className="text-brand-greenDark font-bold">➜</div>
                            <div className="flex-1 bg-white/60 p-3 rounded-lg w-full">
                              <div className="font-bold text-brand-pastelBlue mb-1">EM BREVE (~24h)</div>
                              <div>Nossa equipe ativa sua <strong>API Oficial</strong> em paralelo nos bastidores.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-brand-offWhite p-3 rounded-lg border border-[#E2EDE7] flex items-start gap-2.5 mb-6">
                      <span className="text-base">ℹ️</span>
                      <p className="text-xs text-brand-textLight leading-relaxed">{ch.note}</p>
                    </div>

                    {/* Legal Checkbox moved INSIDE details */}
                    <div className="pt-6 border-t border-gray-100">
                      <div className="flex items-start gap-3 mb-6">
                        <div className="mt-0.5">
                          <input 
                            type="checkbox" 
                            id="terms" 
                            checked={termsAccepted} 
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer accent-brand-green"
                          />
                        </div>
                        <label htmlFor="terms" className="text-xs text-brand-textMuted cursor-pointer select-none leading-relaxed">
                          Declaro que li e concordo com o <span onClick={(e) => { e.preventDefault(); setShowContract(true); }} className="text-brand-green font-bold hover:underline">Contrato de Prestação de Serviço</span> e as <span onClick={(e) => { e.preventDefault(); setShowRules(true); }} className="text-brand-green font-bold hover:underline">Regras de Uso</span>.
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Button
                          onClick={handleContinueSelection}
                          disabled={!termsAccepted}
                          className={`w-full sm:w-auto px-8 ${!termsAccepted ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {selected === "web" ? "Conectar e Ativar →" :
                           selected === "waba" ? "Solicitar API Oficial →" :
                           "Ativar Web + Solicitar API →"}
                        </Button>
                        <button 
                          onClick={() => { setShowDetails(null); setSelected(null); }}
                          className="text-xs text-brand-textLight font-semibold hover:text-brand-textMuted underline"
                        >
                          Voltar para comparar opções
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 2. COMPARISON TABLE (Only shown when nothing selected/detailed) */}
          {!showDetails && (
            <div className="bg-white rounded-[20px] shadow-sm border border-[#E2EDE7] overflow-hidden mb-8 animate-fade-in">
               <div className="grid grid-cols-[1.5fr_1fr_1fr] text-sm">
                  {/* Header */}
                  <div className="p-4 bg-gray-50/80 font-bold text-brand-textMuted border-b border-[#E2EDE7]">Recurso</div>
                  <div className="p-4 bg-brand-greenLight/30 font-bold text-brand-green border-b border-[#E2EDE7] text-center border-l border-[#E2EDE7]">📱 WhatsApp Web</div>
                  <div className="p-4 bg-brand-pastelBlueLt/30 font-bold text-brand-pastelBlue border-b border-[#E2EDE7] text-center border-l border-[#E2EDE7]">🏢 API Oficial (WABA)</div>

                  {/* Rows */}
                  {[
                    { label: "Ativação", web: "Imediata (QR Code)", waba: "Aprovação Meta (~24h)" },
                    { label: "Estabilidade", web: "Depende do celular", waba: "Alta (Nuvem)" },
                    { label: "Selo Verificado", web: "—", waba: "✅ Opcional" },
                    { label: "Envio em Massa", web: "Limitado (Risco)", waba: "✅ Oficial (HSM)" },
                    { label: "Chatbot & Filas", web: "✅ Incluso", waba: "✅ Incluso" },
                    { label: "Custo Adicional", web: "Zero", waba: "Sob Consulta" },
                  ].map((row, i) => (
                    <React.Fragment key={i}>
                      <div className="p-3.5 px-5 text-gray-600 font-medium border-b border-gray-50 last:border-0">{row.label}</div>
                      <div className="p-3.5 text-center text-gray-700 border-l border-gray-50 border-b last:border-b-0 bg-brand-greenLight/5">{row.web}</div>
                      <div className="p-3.5 text-center text-gray-700 border-l border-gray-50 border-b last:border-b-0 bg-brand-pastelBlueLt/5">{row.waba}</div>
                    </React.Fragment>
                  ))}
               </div>
               <div className="p-3 bg-gray-50 text-center text-xs text-brand-textLight border-t border-[#E2EDE7]">
                 Selecione uma opção acima para ver detalhes e contratar
               </div>
            </div>
          )}
        </div>

        {/* Contract Modal with Long Text */}
        {showContract && (
          <TermsModal title="Contrato de Prestação de Serviço - ChatGuru" onClose={() => { setShowContract(false); setTermsAccepted(true); }}>
            <p className="font-bold mb-2">TERMOS E CONDIÇÕES GERAIS DE USO</p>
            <p>Este Contrato de Prestação de Serviços ("Contrato") é um acordo legal entre você ("Cliente") e a ChatGuru Tecnologia LTDA ("ChatGuru"). Ao marcar a caixa de aceitação, você concorda com os termos abaixo.</p>
            
            <p className="font-bold mt-4 mb-2">1. OBJETO DO CONTRATO</p>
            <p>1.1. O presente instrumento tem como objeto o licenciamento de uso do software ChatGuru, na modalidade SaaS (Software as a Service), para gestão de atendimentos via WhatsApp.</p>
            <p>1.2. A plataforma inclui funcionalidades de chatbot, multiatendimento, gestão de filas e etiquetas (tags), conforme plano contratado.</p>

            <p className="font-bold mt-4 mb-2">2. DA DISPONIBILIDADE (SLA)</p>
            <p>2.1. A ChatGuru envidará os melhores esforços para garantir uma disponibilidade de 99% (noventa e nove por cento) ao mês.</p>
            <p>2.2. O Cliente compreende que instabilidades no próprio WhatsApp ou nos serviços da Meta Platforms Inc. fogem ao controle da ChatGuru e não configuram quebra de SLA.</p>

            <p className="font-bold mt-4 mb-2">3. RESPONSABILIDADES DO CLIENTE</p>
            <p>3.1. O Cliente é inteiramente responsável pelo conteúdo das mensagens enviadas através da plataforma.</p>
            <p>3.2. É vedado o uso da plataforma para envio de SPAM, conteúdo ilícito, ofensivo ou que viole direitos autorais.</p>
            <p>3.3. O Cliente deve manter seus dados de acesso (login e senha) confidenciais.</p>

            <p className="font-bold mt-4 mb-2">4. PAGAMENTO E PLANOS</p>
            <p>4.1. O serviço é pré-pago. O acesso é liberado mediante confirmação do pagamento.</p>
            <p>4.2. O não pagamento na data de vencimento poderá acarretar a suspensão temporária do acesso.</p>

            <p className="font-bold mt-4 mb-2">5. CANCELAMENTO</p>
            <p>5.1. O Cliente pode cancelar a assinatura a qualquer momento, sem multa, desde que solicite com antecedência mínima de 30 dias do próximo vencimento.</p>
            
            <p className="font-bold mt-4 mb-2">6. PROTEÇÃO DE DADOS (LGPD)</p>
            <p>6.1. As partes comprometem-se a seguir a Lei Geral de Proteção de Dados (Lei 13.709/2018). O ChatGuru atua como operador dos dados inseridos pelo Cliente (controlador).</p>

            <p className="mt-6 italic text-gray-400 text-xs">Fim do documento. Versão 2.4 - Atualizada em 2025.</p>
          </TermsModal>
        )}

        {/* Rules Modal with Long Text */}
        {showRules && (
          <TermsModal title="Regras e Limitações - WhatsApp Web" onClose={() => { setShowRules(false); setTermsAccepted(true); }}>
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl mb-4 text-red-700 font-semibold">
              ⚠️ ATENÇÃO: O uso da conexão via QR Code (WhatsApp Web) é uma solução não-oficial e possui limitações técnicas inerentes.
            </div>

            <p className="font-bold mb-2">1. DEPENDÊNCIA DO APARELHO CELULAR</p>
            <p>O funcionamento da integração via QR Code emula uma sessão do WhatsApp Web. Para estabilidade máxima:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>O aparelho celular deve permanecer conectado à internet.</li>
              <li>Recomendamos manter o aparelho com bateria carregada ou conectado à tomada.</li>
              <li>Evite abrir o WhatsApp Web em outros computadores simultaneamente com o mesmo número.</li>
            </ul>

            <p className="font-bold mt-4 mb-2">2. RISCO DE BLOQUEIO (BANIMENTO)</p>
            <p>O WhatsApp monitora o comportamento dos usuários para evitar abusos. Para reduzir o risco de bloqueio do seu número:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>NÃO ENVIE SPAM:</strong> Evite enviar mensagens em massa para contatos que não salvaram seu número na agenda.</li>
              <li>Aqueça o número: Se o chip for novo, comece com poucas conversas manuais antes de ativar automações.</li>
              <li>Evite denúncias: Se muitos usuários denunciarem ou bloquearem seu número, o WhatsApp poderá bani-lo.</li>
            </ul>

            <p className="font-bold mt-4 mb-2">3. LIMITAÇÕES DA TECNOLOGIA</p>
            <p>Diferente da API Oficial (WABA), a conexão via QR Code não suporta nativamente botões interativos (listas e botões de resposta rápida) em todos os dispositivos, e a velocidade de envio pode ser menor.</p>

            <p className="font-bold mt-4 mb-2">4. RECOMENDAÇÃO</p>
            <p>Para empresas com alto volume de atendimento ou que necessitam de garantia absoluta de entrega (SLA) e selo de verificação, recomendamos fortemente a migração para a API Oficial (WABA) assim que possível.</p>
          </TermsModal>
        )}
      </div>
    );
  }

  // --- RENDER: CONNECT STEP (WABA Offer / QR) ---
  const channel = data.channel;

  // WABA-only: Offer
  if (channel === "waba" && wabaPhase === "offer") {
    return (
      <div className="py-4">
        <div className="max-w-[520px] mx-auto">
          {/* Consultant confirmation */}
          <div className="p-5 rounded-[18px] mb-5 bg-brand-pastelBlueLt border-2 border-brand-pastelBlue animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-[14px] flex-shrink-0 bg-brand-pastelBlue flex items-center justify-center text-xl">👨‍💻</div>
              <div className="text-left">
                <div className="text-[15px] font-bold text-[#3A6B9F]">API Oficial em andamento!</div>
                <div className="text-[13px] text-[#5A7AA0]">Um consultor entrará em contato para configurar</div>
              </div>
            </div>
            <div className="flex gap-2">
              {["📋 Dados coletados", "📞 Contato imediato", "⏰ Pronto em ~24h"].map((item, i) => (
                <div key={i} className="flex-1 p-1.5 px-2 rounded-lg bg-white/60 text-[10px] text-[#4A6FA5] font-semibold text-center">{item}</div>
              ))}
            </div>
          </div>

          {/* THE ENCHANTING OFFER */}
          <div className="p-7 px-6 rounded-[22px] bg-gradient-to-br from-brand-greenLight via-[#CDFCE3] to-[#E0F9EE] border-[3px] border-brand-green shadow-[0_8px_32px_rgba(45,212,160,0.2)] relative overflow-hidden animate-fade-in animate-delay-200">
             <div className="absolute -top-10 -right-10 w-[120px] h-[120px] rounded-full bg-brand-green/10 blur-[30px] pointer-events-none" />
             
             <div className="text-center mb-4">
               <div className={`inline-flex items-center justify-center w-16 h-16 rounded-[20px] bg-white shadow-[0_4px_16px_rgba(45,212,160,0.3)] text-[32px] transition-transform duration-500 ${offerPulse ? 'scale-100' : 'scale-105'}`}>
                 🎁
               </div>
             </div>

             <div className="text-center mb-1.5">
               <span className="inline-block text-[10px] font-extrabold px-3.5 py-1 rounded-[20px] bg-brand-green text-white tracking-widest uppercase">Oferta exclusiva</span>
             </div>

             <h3 className="text-xl font-extrabold text-brand-greenDark text-center my-2 leading-snug">
              Comece a atender agora<br/>
              <span className="text-brand-green">sem esperar!</span>
             </h3>

             <p className="text-sm text-brand-textMuted text-center leading-relaxed mb-5 max-w-[400px] mx-auto">
              Enquanto preparamos sua API Oficial, <strong className="text-brand-greenDark">ative gratuitamente um número WhatsApp Web</strong> e comece a usar o ChatGuru agora mesmo — chatbot, filas, automações, tudo funcionando!
             </p>

             <div className="flex flex-col gap-2 mb-6">
              {[
                { icon: "⚡", title: "Ativação em 30 segundos", desc: "Escaneie o QR e pronto" },
                { icon: "🆓", title: "100% gratuito, sem custo extra", desc: "Já incluso no seu plano" },
                { icon: "🔄", title: "Transição transparente", desc: "Quando a API ficar pronta, nada muda" },
                { icon: "📈", title: "Não perca nenhum cliente", desc: "Comece a captar leads agora" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3 p-3 px-3.5 rounded-[14px] bg-white/75 border border-brand-green/20 animate-slide-up" style={{ animationDelay: `${0.3 + i * 0.08}s` }}>
                  <span className="text-[22px] flex-shrink-0">{b.icon}</span>
                  <div className="text-left">
                    <div className="text-[13px] font-semibold text-brand-greenDark">{b.title}</div>
                    <div className="text-xs text-brand-textMuted">{b.desc}</div>
                  </div>
                </div>
              ))}
             </div>

             <button
              onClick={acceptWebOffer}
              className="w-full p-4 px-6 text-base font-bold text-white bg-gradient-to-br from-brand-greenDark to-brand-greenMid border-none rounded-[14px] shadow-[0_6px_24px_rgba(45,212,160,0.4)] hover:brightness-105 transition-all"
             >
              🚀 Sim! Quero ativar agora, grátis →
             </button>

             <div className="text-center mt-3">
               <button onClick={declineWebOffer} className="bg-transparent border-none cursor-pointer text-xs text-brand-textLight hover:text-brand-textMuted">
                 Não, prefiro aguardar apenas a API Oficial
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // WABA-only: Skip (Consultant Handoff)
  if (channel === "waba" && wabaPhase === "skip") {
    return (
      <div className="py-4">
        <div className="max-w-[480px] mx-auto text-center">
          <div className="p-8 px-6 rounded-[22px] bg-white border-2 border-[#E2EDE7] shadow-[0_4px_20px_rgba(0,0,0,0.04)] animate-fade-in mb-4">
             <div className="text-5xl mb-3">🤝</div>
             <h3 className="text-xl font-bold text-brand-greenDark mb-2">Tudo certo!</h3>
             <p className="text-sm text-brand-textMuted leading-relaxed mb-6">
              Nosso consultor especializado vai entrar em contato com você <strong className="text-brand-greenDark">imediatamente</strong> para configurar sua API Oficial da Meta.
             </p>

             <div className="text-left max-w-[340px] mx-auto mb-6">
              {[
                { time: "Agora", icon: "📞", text: "Consultor entra em contato", active: true },
                { time: "~2h", icon: "📋", text: "Configuração da conta Meta", active: false },
                { time: "~24h", icon: "✅", text: "API Oficial ativa e funcionando", active: false },
              ].map((step, i) => (
                <div key={i} className={`flex gap-3 relative ${i < 2 ? 'pb-5' : ''}`}>
                  {i < 2 && <div className={`absolute left-[17px] top-[32px] w-[2px] h-[calc(100%-24px)] ${i === 0 ? 'bg-brand-green' : 'bg-[#E2EDE7]'}`} />}
                  <div className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-base border-2
                    ${step.active ? 'bg-brand-greenLight border-brand-green' : 'bg-brand-offWhite border-[#E2EDE7]'}
                  `}>
                    {step.icon}
                  </div>
                  <div>
                    <div className={`text-[10px] font-bold ${step.active ? 'text-brand-green' : 'text-brand-textLight'}`}>{step.time}</div>
                    <div className={`text-[13px] text-brand-greenDark ${step.active ? 'font-semibold' : 'font-normal'}`}>{step.text}</div>
                  </div>
                </div>
              ))}
             </div>

             <div className="p-3 px-4 rounded-xl bg-brand-greenLight border border-brand-green/20 mb-4 text-left">
               <div className="text-xs text-brand-greenDark leading-relaxed">
                💡 Lembre-se: você pode ativar um <strong>número WhatsApp Web gratuito</strong> a qualquer momento para começar a atender enquanto aguarda.
               </div>
               <button onClick={acceptWebOffer} className="mt-2 px-4 py-2 bg-brand-green text-white text-xs font-semibold rounded-[10px]">
                 Mudei de ideia! Quero ativar agora 🚀
               </button>
             </div>
          </div>
          
          <Button onClick={nextStep}>Continuar para configurar chatbot →</Button>
        </div>
      </div>
    );
  }

  // QR Code Flow (Web, Both, or WABA Accepted)
  return (
    <div className="py-4 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-greenDark mb-1.5">Conecte seu WhatsApp Web</h2>
      <p className="text-sm text-brand-textMuted mb-6">Escaneie o QR Code com o WhatsApp</p>

      {(channel === "both" || (channel === "waba" && wabaPhase === "qr")) && (
        <div className="max-w-[440px] mx-auto mb-4 p-2.5 px-4 rounded-xl bg-brand-pastelBlueLt border-[1.5px] border-brand-pastelBlue flex items-center gap-2.5 animate-fade-in">
          <span className="text-base">🏢</span>
          <span className="text-xs text-[#4A6FA5]">
            <strong>API Oficial:</strong> Nosso time já foi notificado e entrará em contato em breve!
          </span>
        </div>
      )}

      <div className="max-w-[440px] mx-auto">
        {!connected ? (
          <div className="p-8 rounded-2xl bg-white border-[1.5px] border-[#E2EDE7] shadow-[0_1px_4px_rgba(0,0,0,0.03)] text-center">
            <div className="inline-block p-4 bg-brand-greenLight rounded-2xl mb-4 border-2 border-brand-green">
              <QRCode />
            </div>
            <div className="text-[13px] text-brand-textMuted flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-pastelOrange animate-pulse-slow" /> Aguardando leitura...
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className="animate-slide-up">
                {m.from === 'system' ? (
                  <div className="p-2.5 px-4 rounded-xl bg-brand-greenLight text-center text-[13px] text-brand-greenMid font-semibold">
                    {m.text}
                  </div>
                ) : (
                  <ChatBubble color="white" borderColor="#7BA3D4" className="border shadow-sm">
                    <span className="text-[11px] text-brand-pastelBlue font-semibold block mb-1">ChatGuru Bot</span>
                    <span className="text-[13px] text-brand-text">{m.text}</span>
                  </ChatBubble>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {connected && messages.length >= 3 && (
        <div className="mt-6 animate-fade-in">
          <Button onClick={() => { updateData({ hasWebNumber: true }); nextStep(); }} className="bg-gradient-to-br from-brand-greenDark to-brand-greenMid">
            🤖 Configurar chatbot →
          </Button>
        </div>
      )}
    </div>
  );
};
