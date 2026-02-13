import { StepConfig, Plan, Niche, NicheConfig } from './types';

export const STEPS: StepConfig[] = [
  { id: "welcome", label: "Início", icon: "👋" },
  { id: "auth", label: "Conta", icon: "🔐" },
  { id: "verify", label: "Verificação", icon: "✅" },
  { id: "plan", label: "Plano", icon: "💳" },
  { id: "niche", label: "Nicho", icon: "🎯" },
  { id: "channel", label: "Canal", icon: "📡" },
  { id: "connect", label: "Conexão", icon: "📱" },
  { id: "chatbot", label: "Chatbot", icon: "🤖" },
  { id: "cockpit", label: "Ativação", icon: "🚀" },
  { id: "live", label: "Ao vivo!", icon: "💬" },
];

export const PLANS: Plan[] = [
  { id: "starter", name: "Starter", price: "R$ 197", period: "/mês", features: ["3 atendentes", "1 número WhatsApp", "500 conversas/mês", "Chatbot básico"], highlight: false, theme: 'blue' },
  { id: "business", name: "Business", price: "R$ 397", period: "/mês", features: ["10 atendentes", "3 números WhatsApp", "2.000 conversas/mês", "Chatbot + IA", "Automações avançadas"], highlight: true, theme: 'green' },
  { id: "enterprise", name: "Enterprise", price: "R$ 797", period: "/mês", features: ["Ilimitado atendentes", "10 números WhatsApp", "Conversas ilimitadas", "IA completa + API", "Suporte prioritário"], highlight: false, theme: 'sand' },
];

export const NICHES: Niche[] = [
  { id: "provedor", icon: "🌐", name: "Provedor de Internet", desc: "ISPs e telecom" },
  { id: "clinica", icon: "🏥", name: "Clínica / Saúde", desc: "Consultórios e clínicas" },
  { id: "estetica", icon: "💆", name: "Estética / Beleza", desc: "Salões e clínicas" },
  { id: "imobiliaria", icon: "🏠", name: "Imobiliária", desc: "Corretores e imobiliárias" },
  { id: "ecommerce", icon: "🛒", name: "E-commerce", desc: "Lojas online" },
  { id: "educacao", icon: "📚", name: "Educação", desc: "Escolas e cursos" },
  { id: "restaurante", icon: "🍽️", name: "Restaurante / Food", desc: "Delivery e reservas" },
  { id: "servicos", icon: "🔧", name: "Serviços Gerais", desc: "Prestadores de serviço" },
];

export const NICHE_CONFIGS: Record<string, NicheConfig> = {
  provedor: { tags: ["Suporte Técnico", "Financeiro", "Comercial", "Instalação"], queues: ["Suporte N1", "Suporte N2", "Financeiro"], auto_msgs: "Olá! Bem-vindo ao suporte. Como posso ajudar?" },
  clinica: { tags: ["Agendamento", "Retorno", "Exames", "Urgência"], queues: ["Recepção", "Agendamento", "Financeiro"], auto_msgs: "Olá! Bem-vindo à nossa clínica. Deseja agendar uma consulta?" },
  estetica: { tags: ["Agendamento", "Promoções", "Pós-atendimento"], queues: ["Atendimento", "Agendamento"], auto_msgs: "Olá! ✨ Bem-vinda! Gostaria de agendar um horário?" },
  imobiliaria: { tags: ["Compra", "Aluguel", "Visita", "Documentação"], queues: ["Atendimento", "Comercial", "Jurídico"], auto_msgs: "Olá! Está procurando imóvel para compra ou aluguel?" },
  ecommerce: { tags: ["Pedido", "Troca", "Rastreio", "Dúvidas"], queues: ["Vendas", "Pós-venda", "Logística"], auto_msgs: "Olá! 🛍️ Como posso ajudar com seu pedido?" },
  educacao: { tags: ["Matrícula", "Financeiro", "Pedagógico", "Secretaria"], queues: ["Atendimento", "Secretaria", "Financeiro"], auto_msgs: "Olá! Bem-vindo! Como posso ajudar?" },
  restaurante: { tags: ["Pedido", "Reserva", "Cardápio", "Reclamação"], queues: ["Pedidos", "Atendimento"], auto_msgs: "Olá! 🍽️ Gostaria de fazer um pedido ou reserva?" },
  servicos: { tags: ["Orçamento", "Agendamento", "Suporte", "Financeiro"], queues: ["Atendimento", "Comercial"], auto_msgs: "Olá! Como posso ajudar você hoje?" },
};

export const NICHE_SIM_MESSAGES: Record<string, {delay: number, text: string}[]> = {
  provedor: [
    { delay: 1500, text: "Olá, boa tarde! Estou com problema na minha internet, está muito lenta desde ontem." },
    { delay: 4500, text: "Meu plano é o de 300MB. O número do contrato é 45892." },
  ],
  clinica: [
    { delay: 1500, text: "Oi! Gostaria de agendar uma consulta com o Dr. Silva para essa semana, é possível?" },
    { delay: 4500, text: "Pode ser terça ou quarta-feira, de preferência pela manhã. Meu convênio é Unimed." },
  ],
  estetica: [
    { delay: 1500, text: "Oi! Quero agendar uma limpeza de pele + hidratação. Vocês têm horário disponível essa semana?" },
    { delay: 4500, text: "Prefiro sexta à tarde, se tiver. Pode ser com a Juliana?" },
  ],
  imobiliaria: [
    { delay: 1500, text: "Boa tarde! Vi no site um apartamento de 3 quartos no bairro Manaíra. Ainda está disponível?" },
    { delay: 4500, text: "Meu orçamento é até R$ 450 mil. Gostaria de agendar uma visita, se possível." },
  ],
  ecommerce: [
    { delay: 1500, text: "Olá! Fiz um pedido ontem (#78432) e gostaria de saber a previsão de entrega." },
    { delay: 4500, text: "O rastreio ainda não atualizou. Podem verificar por gentileza?" },
  ],
  educacao: [
    { delay: 1500, text: "Boa tarde! Gostaria de informações sobre matrícula para o ensino fundamental. Meu filho tem 8 anos." },
    { delay: 4500, text: "Qual o valor da mensalidade e o horário das aulas?" },
  ],
  restaurante: [
    { delay: 1500, text: "Oi! Gostaria de fazer uma reserva para 6 pessoas, sábado às 20h. Vocês têm disponibilidade?" },
    { delay: 4500, text: "Perfeito! Alguém do grupo é vegetariano, vocês têm opções no cardápio?" },
  ],
  servicos: [
    { delay: 1500, text: "Olá, preciso de um orçamento para manutenção do ar-condicionado. São 3 aparelhos split." },
    { delay: 4500, text: "A marca é Samsung, todos de 12.000 BTUs. Podem vir amanhã?" },
  ],
};
