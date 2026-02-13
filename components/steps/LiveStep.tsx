
import React, { useState, useEffect, useRef } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { NICHE_CONFIGS } from '../../constants';

// Icons components for the interface
const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Filter: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  User: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Paperclip: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Mic: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
  Smile: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  Image: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Video: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Whatsapp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
};

export const LiveStep: React.FC = () => {
  const { data, resetOnboarding } = useOnboarding();
  const niche = data.niche || "servicos";
  const companyName = data.companyName || "Minha Empresa";
  const cfg = NICHE_CONFIGS[niche];
  const userName = data.name ? data.name.split(" ")[0] : "Usuário";
  const fullName = data.name || "Usuário";
  
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<'customer' | 'support'>("customer");
  
  // Messages state
  const [customerMsgs, setCustomerMsgs] = useState<{text: string, time: string, id: number}[]>([]);
  const [myCustomerMsgs, setMyCustomerMsgs] = useState<{text: string, time: string}[]>([]);
  
  const [supportMsgs, setSupportMsgs] = useState<{text: string, time: string}[]>([]);
  const [mySupportMsgs, setMySupportMsgs] = useState<{text: string, time: string}[]>([]);
  const [supportUnread, setSupportUnread] = useState(0);

  const [inputVal, setInputVal] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const activeChatRef = useRef(activeChat);

  // Sync ref
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  // Clear unread on support click
  useEffect(() => {
    if (activeChat === 'support') setSupportUnread(0);
  }, [activeChat]);

  const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 3500); // Increased loading time slightly to read the message
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (loading) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // --- Customer Flow (Exciting Onboarding Script) ---
    // 1. Initial High-Energy Welcome (Simulated Client)
    timers.push(setTimeout(() => {
      setCustomerMsgs(p => [...p, { 
        text: `Olá ${userName}! 👋 Parabéns pela decisão de transformar seu atendimento! Imagine que sou seu cliente entrando em contato agora. Com o ChatGuru, esse atendimento que antes levava minutos, agora é instantâneo e organizado. Sua produtividade vai voar! 🚀`, 
        time: timeStr, 
        id: 1 
      }]);
    }, 1500));

    // 2. Call to Action
    timers.push(setTimeout(() => {
      setCustomerMsgs(p => [...p, { 
        text: "Essa é uma simulação real da sua plataforma. Pra você sentir como é fácil, **responda qualquer coisa** aqui embaixo (um 'oi', um emoji...) pra ver a mágica acontecer! 👇", 
        time: timeStr, 
        id: 2 
      }]);
    }, 4500));

    // --- Support Flow ---
    // 1. Support Message 1
    timers.push(setTimeout(() => {
      setSupportMsgs(p => [...p, { text: `Olá ${userName}! 👋 Bem-vindo(a) ao ChatGuru! Sou do time de suporte e estou aqui para te ajudar no que precisar.`, time: timeStr }]);
      if (activeChatRef.current !== 'support') setSupportUnread(p => p + 1);
    }, 3500));

    // 2. Support Message 2
    timers.push(setTimeout(() => {
      setSupportMsgs(p => [...p, { text: "Pode explorar a plataforma à vontade! Se tiver qualquer dúvida sobre filas, tags, chatbot ou automações, é só me chamar aqui. Respondemos por dentro da própria plataforma — rápido e sem complicação! 😊", time: timeStr }]);
      if (activeChatRef.current !== 'support') setSupportUnread(p => p + 1);
    }, 5500));

    return () => timers.forEach(clearTimeout);
  }, [loading, timeStr, userName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [customerMsgs, myCustomerMsgs, supportMsgs, mySupportMsgs, activeChat]);

  const sendMessage = () => {
    if (!inputVal.trim()) return;
    const now = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (activeChat === "customer") {
      setMyCustomerMsgs(prev => [...prev, { text: inputVal, time: now }]);
      
      // If it's the first response, trigger the congratulatory message
      if (myCustomerMsgs.length === 0) {
        setTimeout(() => setShowConfetti(true), 500);
        
        // Final automated response in simulation
        setTimeout(() => {
          setCustomerMsgs(prev => [...prev, {
            text: "Viu como é fácil? ⚡ Em segundos você respondeu e manteve o cliente engajado. É essa agilidade que vai fazer você vender muito mais! Parabéns pelo primeiro atendimento, você já dominou o ChatGuru! 🥂",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            id: 3
          }]);
        }, 1500);

        // Follow-up with resources
        setTimeout(() => {
          setCustomerMsgs(prev => [...prev, {
            text: "Aproveitando, separei alguns materiais importantes para você virar expert na plataforma:\n\n📘 **Manual da Plataforma**\n💡 **Blog ChatGuru**\n🎥 **Tutoriais**\n\nÉ só clicar e acessar! 🚀",
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            id: 4
          }]);
        }, 4000);
      }

    } else {
      setMySupportMsgs(prev => [...prev, { text: inputVal, time: now }]);
      // Auto-reply for support if user types
      setTimeout(() => {
        setSupportMsgs(prev => [...prev, {
          text: "Recebido! Um atendente do nosso time vai te responder em instantes. Enquanto isso, continue explorando a plataforma! 🚀",
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        }]);
      }, 2000);
    }
    setInputVal("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-fade-in bg-white h-screen">
        <div className="w-20 h-20 rounded-2xl bg-[#2a2f32] flex items-center justify-center p-3 shadow-2xl ring-4 ring-brand-green/20">
          <img src="https://chatguru.com.br/wp-content/themes/chatguru-3/assets/img/logo.svg" alt="CG" className="w-full h-full object-contain filter brightness-0 invert" />
        </div>
        
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-bold text-[#2a2f32] mb-2">Preparando seu ambiente...</h2>
          <div className="text-xl font-bold text-brand-green mb-4">Obrigado e Parabéns! 🚀</div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Estamos configurando sua plataforma de alta performance. <br/>
            Prepare-se para levar seu atendimento para outro nível e escalar suas vendas!
          </p>
        </div>

        <div className="flex gap-2 mt-2">
          {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-[#2DD4A0] animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
        </div>
      </div>
    );
  }

  const isCustomer = activeChat === "customer";
  
  // Theme constants based on screenshot
  const colors = {
    sidebar: "bg-[#2a2f32]", // Dark sidebar
    sidebarIcon: "text-[#8a9095]",
    sidebarIconActive: "text-white bg-[#3b4146] border-l-4 border-[#2DD4A0]",
    header: "bg-white border-b border-[#e5e7eb]",
    panelBg: "bg-white",
    panelBorder: "border-[#e5e7eb]",
    chatBg: "bg-[#efeae2]",
    primary: "text-[#2DD4A0]",
    primaryBg: "bg-[#2DD4A0]",
    blueTag: "bg-[#5b9bd5]",
    redTag: "bg-[#ef4444]",
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 font-sans text-xs md:text-sm animate-fade-in absolute top-0 left-0 z-50">
      
      {/* Simulation Reset Bar */}
      <div className="w-full h-[40px] bg-[#1B3D2F] flex items-center justify-between px-5 flex-shrink-0 shadow-md z-[60]">
        <div className="flex items-center gap-3 text-white">
          <span className="text-brand-green font-bold tracking-wider text-[10px] uppercase border border-brand-green px-1.5 py-0.5 rounded">Ambiente de Demonstração</span>
          <span className="text-xs text-brand-greenLight opacity-80 hidden sm:inline-block">Você está visualizando uma simulação interativa da plataforma.</span>
        </div>
        <button 
          onClick={resetOnboarding}
          className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-brand-green transition-colors opacity-90 hover:opacity-100"
        >
          <span className="text-sm">↺</span> <span>Reiniciar Processo</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative w-full">
        {/* Confetti Modal */}
        {showConfetti && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 pointer-events-auto backdrop-blur-[1px]">
            <div className="bg-white rounded-lg p-8 text-center shadow-2xl animate-fade-in max-w-sm mx-4 border-t-4 border-[#2DD4A0]">
              <div className="text-5xl mb-3">🎉</div>
              <div className="text-xl font-bold text-[#1B3D2F] mb-1.5">Atendimento Iniciado!</div>
              <p className="text-sm text-gray-500 mb-6">Você sentiu a rapidez? É assim que o ChatGuru funciona no dia a dia.</p>
              <button onClick={() => setShowConfetti(false)} className="px-6 py-2 bg-[#2DD4A0] hover:bg-[#25b588] text-white font-semibold rounded text-sm transition-colors">Continuar</button>
            </div>
          </div>
        )}

        {/* LEFT SIDEBAR (Dark) */}
        <div className={`w-[50px] ${colors.sidebar} flex flex-col items-center py-3 gap-2 flex-shrink-0 z-20`}>
            <div className="w-8 h-8 rounded mb-2 flex items-center justify-center bg-white/10 p-1.5">
              <img src="https://chatguru.com.br/wp-content/themes/chatguru-3/assets/img/logo.svg" className="w-full h-full object-contain filter brightness-0 invert" alt="CG" />
            </div>
            
            {[
              { icon: "⚡", active: false },
              { icon: "💬", active: true },
              { icon: "📅", active: false },
              { icon: "👥", active: false },
              { icon: "📢", active: false },
              { icon: "📊", active: false },
              { icon: "🏷️", active: false },
              { icon: "⚙️", active: false }
            ].map((item, i) => (
              <div 
              key={i} 
              className={`w-full h-[40px] flex items-center justify-center cursor-pointer text-lg transition-colors relative
                ${item.active ? colors.sidebarIconActive : `${colors.sidebarIcon} hover:text-white hover:bg-[#3b4146]`}
              `}
              >
                {item.icon}
              </div>
            ))}
            <div className="mt-auto mb-2 text-[#8a9095] text-lg cursor-pointer">🎧</div>
        </div>

        <div className="flex flex-1 flex-col h-full overflow-hidden">
          {/* TOP HEADER */}
          <div className={`h-[50px] ${colors.header} flex items-center justify-between px-4 flex-shrink-0 z-10 shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold border border-gray-300">
                {fullName[0].toUpperCase()}
              </div>
              <span className="text-[13px] font-medium text-gray-700">
                {fullName} <span className="text-gray-300 mx-1">|</span> {companyName}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-gray-500">
              <span className="cursor-pointer text-[#25D366]"><Icons.Whatsapp /></span> 
              <div className="relative cursor-pointer hover:text-gray-700">
                <Icons.Bell />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">2</span>
              </div>
              <span className="cursor-pointer hover:text-gray-700"><Icons.Send /></span>
              <span className="cursor-pointer hover:text-gray-700 text-lg">◑</span>
              <span className="cursor-pointer hover:text-red-500 text-lg">✕</span>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* CONTACT LIST PANEL */}
            <div className={`w-[320px] ${colors.panelBg} border-r ${colors.panelBorder} flex flex-col flex-shrink-0`}>
              {/* Search */}
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
                  <input 
                    className="w-full bg-[#f0f2f5] text-gray-700 text-[12px] py-2 pl-9 pr-8 rounded border border-transparent focus:bg-white focus:border-[#2DD4A0] outline-none transition-all placeholder-gray-400"
                    placeholder="Pesquisar mensagem" 
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-[#2DD4A0]">
                    <Icons.User />
                  </span>
                </div>
              </div>

              {/* Filters (Mocked to match screenshot) */}
              <div className="p-3 bg-white border-b border-gray-200 text-[11px] flex flex-col gap-2 overflow-y-auto max-h-[220px]">
                  <div className="border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center relative">
                    <span className="font-medium">Nome:</span> <div className="w-4 h-4 bg-red-400 rounded text-white flex items-center justify-center text-[8px] font-bold cursor-pointer">•••</div>
                  </div>
                  <div className="border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center">
                    <span className="font-medium">Aparelho:</span> <span className="text-[10px]">▼</span>
                  </div>
                  <div className="border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center">
                    <span className="font-medium">Número Whatsapp:</span>
                  </div>
                  <div className="border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center">
                    <span className="font-medium">Tags:</span> <span className="text-gray-400">Qualquer ▼</span>
                  </div>
                  <div className="border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center">
                    <span className="font-medium">Usuário/Departamento:</span> <span className="text-gray-400">Qualquer ▼</span>
                  </div>
                  <div className="border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center">
                    <span className="font-medium">Etapa do Funil:</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center">
                      <span className="font-medium">Status:</span> <span className="text-[10px]">▼</span>
                    </div>
                    <div className="flex-1 border border-gray-200 rounded px-2 py-1.5 bg-gray-50 text-gray-500 flex justify-between items-center">
                      <span className="font-medium">Ordenar Por</span> <span className="text-[10px]">▼</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1 pt-1">
                    <div className="flex gap-2">
                        <div className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center text-red-400 cursor-pointer hover:bg-gray-50">✉️</div>
                        <div className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center text-blue-400 cursor-pointer hover:bg-gray-50">💳</div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 border border-gray-300 rounded px-1.5 h-7">
                          <span className="text-lg leading-none">((•))</span> <input type="checkbox" className="w-3 h-3" />
                      </div>
                      <div className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center text-yellow-400 cursor-pointer hover:bg-gray-50">⭐</div>
                      <div className="w-7 h-7 border border-gray-300 rounded flex items-center justify-center text-blue-400 cursor-pointer hover:bg-gray-50">🕒</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-start text-[10px] text-gray-500 mt-1 cursor-pointer hover:text-gray-700">
                    Esconder Filtros <span className="rotate-180 ml-1">^</span>
                  </div>
              </div>
              
              <div className="px-3 py-1.5 text-[10px] text-gray-500 font-medium italic border-b border-gray-100 bg-gray-50">
                  Exibindo 2 resultados:
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto bg-white">
                  
                  {/* Item 1: Customer (Active) */}
                  <div 
                    onClick={() => setActiveChat('customer')}
                    className={`flex gap-3 p-3 border-b border-gray-100 cursor-pointer transition-colors relative
                      ${activeChat === 'customer' ? 'bg-[#e9eff5]' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src="https://ui-avatars.com/api/?name=F&background=F3DFC0&color=8B4D2E&size=128" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[13px] font-bold text-gray-800">Cliente Simulação</span>
                          <span className={`text-[9px] text-white ${colors.blueTag} px-1.5 rounded-[2px] font-bold`}>EM ATENDI</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
                          {customerMsgs.length > 0 ? <span>{customerMsgs[customerMsgs.length-1].text}</span> : <span>Foto</span>}
                      </div>
                      <div className="text-[10px] text-gray-400 text-right mt-1">há 3 dias</div>
                    </div>
                    {activeChat === 'customer' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500"></div>}
                  </div>

                  {/* Item 2: Support */}
                  <div 
                    onClick={() => setActiveChat('support')}
                    className={`flex gap-3 p-3 border-b border-gray-100 cursor-pointer transition-colors relative
                      ${activeChat === 'support' ? 'bg-[#e9eff5]' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-[#1B3D2F] flex items-center justify-center text-white text-xs font-bold">cg</div>
                      {supportUnread > 0 && activeChat !== 'support' && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
                          {supportUnread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[13px] font-bold text-gray-800">Suporte</span>
                          <span className={`text-[9px] text-white ${colors.redTag} px-1.5 rounded-[2px] font-bold`}>ABERTO</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 truncate">
                          <span>{supportMsgs.length > 0 ? supportMsgs[supportMsgs.length-1].text : 'Bem-vindo!'}</span>
                      </div>
                      <div className="text-[10px] text-gray-400 text-right mt-1">agora</div>
                    </div>
                    {activeChat === 'support' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-500"></div>}
                  </div>

              </div>
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 flex flex-col bg-[#efeae2] relative min-w-0">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}></div>

              {/* Chat Header */}
              <div className={`h-[50px] bg-white border-b ${colors.panelBorder} flex items-center justify-between px-3 z-10 shadow-sm`}>
                <div className="flex items-center gap-3">
                  {isCustomer ? 
                    <img src="https://ui-avatars.com/api/?name=F&background=F3DFC0&color=8B4D2E&size=128" className="w-9 h-9 rounded-full object-cover" alt="" /> :
                    <div className="w-9 h-9 rounded-full bg-[#1B3D2F] flex items-center justify-center text-white text-xs font-bold">cg</div>
                  }
                  <div className="font-semibold text-[14px] text-gray-800">
                    {isCustomer ? "Cliente Simulação" : "Suporte ChatGuru"}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`flex items-center ${isCustomer ? colors.blueTag : colors.redTag} text-white text-[11px] font-bold px-3 py-1.5 rounded-[4px] cursor-pointer`}>
                      {isCustomer ? "EM ATENDIMENTO" : "ABERTO"} <span className="ml-2 text-[8px]">▼</span>
                    </div>
                    <span className="text-gray-500 cursor-pointer transform rotate-45"><Icons.Paperclip /></span>
                    <span className="text-gray-500 cursor-pointer text-lg">💬</span>
                    <span className="text-gray-500 cursor-pointer">•••</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 z-10 custom-scrollbar">
                {isCustomer && (
                  <>
                    {customerMsgs.map((m, i) => (
                      <div key={i} className="self-start max-w-[75%] bg-white rounded-lg rounded-tl-none shadow-sm p-1.5 px-3 animate-slide-up">
                          <div className="text-[13px] text-[#111b21] leading-snug whitespace-pre-wrap">
                            {m.text.split("**").map((part, idx) => 
                              idx % 2 === 1 ? <strong key={idx} className="font-bold text-brand-greenDark">{part}</strong> : part
                            )}
                          </div>
                          <div className="text-[10px] text-gray-400 text-right mt-1">{m.time}</div>
                      </div>
                    ))}

                    {myCustomerMsgs.map((m, i) => (
                      <div key={i} className="self-end max-w-[65%] bg-[#d9fdd3] rounded-lg rounded-tr-none shadow-sm p-1.5 px-2 animate-slide-up">
                        <div className="text-[13px] text-[#111b21]">{m.text}</div>
                        <div className="text-[10px] text-gray-400 text-right flex items-center justify-end gap-1 mt-1">
                            {m.time} <span className="text-[#53bdeb]"><Icons.Check /></span>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {!isCustomer && (
                  <>
                    {supportMsgs.map((m, i) => (
                        <div key={i} className="self-start max-w-[70%] bg-white rounded-lg rounded-tl-none shadow-sm p-2 border-l-4 border-l-blue-400 animate-slide-up">
                            <span className="text-[10px] font-bold text-blue-500 block mb-1">Suporte ChatGuru</span>
                            <div className="text-[13px] text-[#111b21]">{m.text}</div>
                            <div className="text-[10px] text-gray-400 text-right mt-1">{m.time}</div>
                        </div>
                    ))}
                    {mySupportMsgs.map((m, i) => (
                      <div key={i} className="self-end max-w-[65%] bg-[#d9fdd3] rounded-lg rounded-tr-none shadow-sm p-1.5 px-2 animate-slide-up">
                        <div className="text-[13px] text-[#111b21]">{m.text}</div>
                        <div className="text-[10px] text-gray-400 text-right flex items-center justify-end gap-1 mt-1">
                            {m.time} <span className="text-[#53bdeb]"><Icons.Check /></span>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Bar */}
              <div className={`p-2 bg-[#f0f2f5] border-t ${colors.panelBorder} flex items-center gap-3 z-10`}>
                  <div className="flex gap-3 text-gray-500 px-2">
                    <span className="cursor-pointer hover:text-gray-700 text-lg">📅</span>
                    <span className="cursor-pointer hover:text-gray-700 text-lg"><Icons.Smile /></span>
                  </div>
                  <div className="flex-1 bg-white rounded-[8px] border border-white flex items-center px-3 py-1.5 shadow-sm focus-within:border-[#2DD4A0]">
                    <input 
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 text-[14px] outline-none text-gray-700 placeholder-gray-400 h-[24px]"
                      placeholder="Digite uma mensagem"
                    />
                  </div>
                  <div className="flex gap-3 text-gray-500 px-1 items-center">
                    <span className="cursor-pointer hover:text-gray-700 text-lg text-[#2DD4A0]"><Icons.Filter /></span>
                    <button onClick={sendMessage} className="text-[#2DD4A0] hover:text-[#25b588]">
                        {inputVal ? <Icons.Send /> : <Icons.Mic />}
                    </button>
                  </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR (Contact Info) */}
            {isCustomer && (
              <div className={`w-[300px] ${colors.panelBg} border-l ${colors.panelBorder} flex flex-col overflow-y-auto hidden md:flex flex-shrink-0 z-10`}>
                {/* Top Icons */}
                <div className="flex items-center justify-between p-2 border-b border-gray-100 text-gray-500 text-lg">
                  <div className="flex gap-4 px-2">
                      <span className="text-blue-500 border-b-2 border-blue-500 pb-2 -mb-2.5 cursor-pointer">👤</span>
                      <span className="cursor-pointer hover:text-blue-500">🕒</span>
                      <span className="cursor-pointer hover:text-blue-500">📅</span>
                      <span className="cursor-pointer hover:text-blue-500">▼</span>
                      <span className="cursor-pointer hover:text-blue-500">👥</span>
                      <span className="cursor-pointer hover:text-blue-500">🤖</span>
                      <span className="cursor-pointer hover:text-blue-500">⇆</span>
                      <span className="cursor-pointer hover:text-blue-500">▶</span>
                  </div>
                  <span className="text-red-400 cursor-pointer text-sm">✕</span>
                </div>

                {/* Profile Card */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex gap-3 mb-3">
                      <img src="https://ui-avatars.com/api/?name=F&background=F3DFC0&color=8B4D2E&size=128" className="w-[70px] h-[70px] rounded object-cover" alt="" />
                      <div className="flex-1">
                        <div className="text-[10px] text-gray-400 uppercase font-bold">NOME:</div>
                        <div className="flex items-center gap-1 font-bold text-[#5b9bd5] text-[14px]">
                            <span className="text-xs text-gray-400">★</span> Cliente Simulação
                        </div>
                        <div className="text-[12px] text-gray-600">+55 (11) 99999-9999</div>
                      </div>
                      <div className="text-blue-400 text-xs cursor-pointer">🔗</div>
                  </div>
                  
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-2 text-[11px] items-center">
                      <span className="text-gray-500 text-right">🤖 Chatbot:</span>
                      <div className="flex justify-end"><span className="bg-[#2DD4A0] text-white px-2 rounded-[2px] font-bold">Sim</span></div>
                      
                      <span className="text-gray-500 text-right">📦 Arquivar:</span>
                      <div className="flex justify-end"><span className="bg-gray-400 text-white px-2 rounded-[2px] font-bold">Não</span></div>
                  </div>
                </div>

                {/* Responsible */}
                <div className="p-3 border-b border-gray-100">
                  <div className="text-[12px] font-bold text-[#5b9bd5] mb-1">Responsável:</div>
                  <div className="flex gap-2">
                      <div className="flex-1 border border-gray-300 bg-white rounded px-2 py-1 text-[11px] text-gray-500 flex justify-between items-center cursor-pointer">
                        - Ninguém Delegado - <span className="text-[8px]">▼</span>
                      </div>
                      <button className="border border-gray-300 bg-white rounded px-2 py-1 text-[11px] text-gray-500 hover:bg-gray-50">Delegar p/ Fila</button>
                  </div>
                </div>

                {/* Tags */}
                <div className="p-3 border-b border-gray-100">
                  <div className="text-[12px] font-bold text-[#5b9bd5] mb-2">Tags:</div>
                  <button className="flex items-center gap-1 text-[11px] text-blue-500 border border-blue-200 rounded px-2 py-0.5 hover:bg-blue-50 w-fit mb-2">
                    <span className="font-bold text-lg leading-none">+</span> Nova Tag
                  </button>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {cfg?.tags.slice(0, 3).map((t, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Custom Fields */}
                <div className="p-3 border-b border-gray-100 bg-[#fbfcfd]">
                  <div className="text-[12px] font-bold text-[#5b9bd5] mb-2">Campos Personalizados:</div>
                  <div className="flex flex-col gap-2">
                    {[
                      { l: "E-mail:", p: "" },
                      { l: "Data reunião:", p: "dd/mm/aaaa", i: "📅" },
                      { l: "Horário reunião:", p: "--:--", i: "🕒" },
                      { l: "Empresa:", p: companyName },
                      { l: "Site:", p: "" },
                      { l: "CRM:", p: "" },
                      { l: "Contato:", p: "" }
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                          <div className="w-[90px] text-[11px] text-gray-600 font-medium truncate">{f.l}</div>
                          <div className="flex-1 relative">
                            <input className="w-full border border-gray-300 rounded px-2 py-1 text-[11px] bg-white outline-none focus:border-[#5b9bd5]" defaultValue={f.p} />
                            {f.i && <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] opacity-50">{f.i}</span>}
                          </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 w-fit border border-gray-300 rounded bg-white px-2 py-1 text-[10px] text-gray-500 flex items-center justify-center gap-1 hover:bg-gray-50">
                      <span className="text-sm">👤</span> Gerenciar Campos Personalizados
                  </button>
                </div>

                {/* Other Info */}
                <div className="p-3">
                  <div className="text-[12px] font-bold text-[#5b9bd5] mb-1.5">Outras Informações:</div>
                  <div className="text-[10px] text-gray-500 leading-relaxed">
                    <div className="flex gap-1"><span>📞</span> Aparelho Origem: 556196316015</div>
                    <div className="flex gap-1"><span>📅</span> Data de Cadastro: 04/08/25 16:48</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
