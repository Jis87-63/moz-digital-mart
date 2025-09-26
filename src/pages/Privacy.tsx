import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Cookie, Database, Lock } from 'lucide-react';

export const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <Button
            variant="ghost"
            className="mb-6 p-0 h-auto hover:bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <div className="text-center mb-8">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Política de Privacidade</h1>
            <p className="text-lg text-muted-foreground">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" />
                  1. Introdução
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  A <strong>Moz Store Digital</strong> valoriza e respeita a privacidade dos nossos usuários. 
                  Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos 
                  suas informações pessoais.
                </p>
                <p>
                  Ao utilizar nosso site e serviços, você concorda com as práticas descritas 
                  nesta política. Se você não concordar com qualquer aspecto desta política, 
                  recomendamos que não utilize nossos serviços.
                </p>
              </CardContent>
            </Card>

            {/* Data Collection */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  2. Informações que Coletamos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p><strong>Informações Fornecidas Diretamente:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dados de Registro:</strong> Nome, e-mail, número de telefone</li>
                  <li><strong>Informações de Pagamento:</strong> Dados necessários para processar pagamentos via Gibrapay</li>
                  <li><strong>Comunicações:</strong> Mensagens enviadas através do suporte ao cliente</li>
                  <li><strong>Preferências:</strong> Configurações de conta e preferências do usuário</li>
                </ul>
                
                <p><strong>Informações Coletadas Automaticamente:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dados de Navegação:</strong> Endereço IP, tipo de navegador, dispositivo utilizado</li>
                  <li><strong>Cookies:</strong> Informações armazenadas através de cookies (com seu consentimento)</li>
                  <li><strong>Logs de Acesso:</strong> Horários de acesso, páginas visitadas, ações realizadas</li>
                  <li><strong>Dados de Desempenho:</strong> Tempo de carregamento, erros de sistema</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Usage */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>3. Como Utilizamos suas Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>Utilizamos suas informações para os seguintes propósitos:</p>
                
                <p><strong>Prestação de Serviços:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processar e entregar produtos digitais adquiridos</li>
                  <li>Gerenciar sua conta e preferências</li>
                  <li>Processar pagamentos de forma segura</li>
                  <li>Fornecer suporte ao cliente</li>
                </ul>

                <p><strong>Melhoramento dos Serviços:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Análise de uso para melhorar a experiência do usuário</li>
                  <li>Desenvolvimento de novos produtos e funcionalidades</li>
                  <li>Otimização de desempenho do site</li>
                  <li>Prevenção de fraudes e atividades suspeitas</li>
                </ul>

                <p><strong>Comunicação:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Envio de confirmações de compra e atualizações de pedidos</li>
                  <li>Comunicação sobre promoções e novidades (com consentimento)</li>
                  <li>Notificações importantes sobre o serviço</li>
                  <li>Resposta a consultas e solicitações de suporte</li>
                </ul>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Cookie className="h-5 w-5 text-primary" />
                  4. Política de Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Utilizamos cookies para melhorar sua experiência em nosso site. 
                  Os cookies são pequenos arquivos de texto armazenados em seu dispositivo.
                </p>
                
                <p><strong>Tipos de Cookies que Utilizamos:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cookies Essenciais:</strong> Necessários para funcionamento básico do site</li>
                  <li><strong>Cookies de Desempenho:</strong> Ajudam a analisar como você usa o site</li>
                  <li><strong>Cookies de Funcionalidade:</strong> Lembram suas preferências e configurações</li>
                  <li><strong>Cookies de Marketing:</strong> Utilizados para personalizar anúncios (apenas com consentimento)</li>
                </ul>
                
                <p>
                  Você pode gerenciar suas preferências de cookies através do banner de 
                  consentimento ou nas configurações do seu navegador.
                </p>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  5. Proteção de Dados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Implementamos medidas de segurança técnicas e organizacionais adequadas 
                  para proteger suas informações pessoais contra acesso não autorizado, 
                  alteração, divulgação ou destruição.
                </p>
                
                <p><strong>Medidas de Segurança:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Criptografia SSL/TLS para transmissão de dados</li>
                  <li>Armazenamento seguro em servidores protegidos (Firebase/Google Cloud)</li>
                  <li>Acesso restrito às informações pessoais</li>
                  <li>Monitoramento regular de segurança</li>
                  <li>Backups regulares e seguros</li>
                </ul>
                
                <p>
                  <strong>Importante:</strong> Nenhum sistema é 100% seguro. Embora 
                  implementemos as melhores práticas de segurança, não podemos garantir 
                  a segurança absoluta dos dados transmitidos pela internet.
                </p>
              </CardContent>
            </Card>

            {/* Data Sharing */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>6. Compartilhamento de Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais 
                  com terceiros para fins comerciais, exceto nas seguintes situações:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Processamento de Pagamentos:</strong> Compartilhamos dados necessários com Gibrapay para processar pagamentos</li>
                  <li><strong>Prestadores de Serviços:</strong> Terceiros que nos ajudam a operar o site (Firebase, Google Analytics)</li>
                  <li><strong>Obrigações Legais:</strong> Quando exigido por lei ou autoridades competentes</li>
                  <li><strong>Proteção de Direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
                  <li><strong>Consentimento:</strong> Quando você der consentimento explícito</li>
                </ul>
                
                <p>
                  Todos os terceiros com quem compartilhamos dados são obrigados a manter 
                  a confidencialidade e usar as informações apenas para os fins especificados.
                </p>
              </CardContent>
            </Card>

            {/* User Rights */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>7. Seus Direitos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>Você tem os seguintes direitos em relação aos seus dados pessoais:</p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Acesso:</strong> Solicitar uma cópia das informações que temos sobre você</li>
                  <li><strong>Retificação:</strong> Corrigir informações incorretas ou desatualizadas</li>
                  <li><strong>Exclusão:</strong> Solicitar a exclusão de suas informações pessoais</li>
                  <li><strong>Portabilidade:</strong> Receber suas informações em formato portável</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados em certas circunstâncias</li>
                  <li><strong>Limitação:</strong> Solicitar a limitação do processamento de seus dados</li>
                </ul>
                
                <p>
                  Para exercer qualquer um destes direitos, entre em contato conosco através 
                  dos canais mencionados na seção de contato.
                </p>
              </CardContent>
            </Card>

            {/* Data Retention */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>8. Retenção de Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Mantemos suas informações pessoais pelo tempo necessário para cumprir 
                  os propósitos descritos nesta política, ou conforme exigido por lei.
                </p>
                
                <p><strong>Períodos de Retenção:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Dados de Conta:</strong> Enquanto sua conta estiver ativa</li>
                  <li><strong>Dados de Transação:</strong> 5 anos para fins fiscais e legais</li>
                  <li><strong>Logs de Segurança:</strong> 2 anos para investigações de segurança</li>
                  <li><strong>Comunicações de Suporte:</strong> 3 anos para referência futura</li>
                </ul>
                
                <p>
                  Após os períodos de retenção, os dados são excluídos de forma segura 
                  ou anonimizados para uso estatístico.
                </p>
              </CardContent>
            </Card>

            {/* Changes */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>9. Alterações nesta Política</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente para 
                  refletir mudanças em nossos serviços ou requisitos legais.
                </p>
                
                <p>
                  Quando fizermos alterações significativas, notificaremos você através 
                  de e-mail ou aviso prominente em nosso site antes que as mudanças entrem em vigor.
                </p>
                
                <p>
                  Recomendamos que você revise esta política regularmente para se manter 
                  informado sobre como protegemos suas informações.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>10. Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Se você tiver dúvidas sobre esta Política de Privacidade ou sobre 
                  como tratamos seus dados pessoais, entre em contato:
                </p>
                
                <ul className="list-none space-y-2">
                  <li><strong>E-mail:</strong> mozstoredigitalp2@gmail.com</li>
                  <li><strong>WhatsApp:</strong> +258 87 650 0685</li>
                  <li><strong>Telegram:</strong> t.me/EllonMuskDev</li>
                  <li><strong>Horário de Atendimento:</strong> Segunda a Domingo, 24 horas</li>
                </ul>
                
                <p>
                  Responderemos às suas consultas dentro de 30 dias úteis após o recebimento.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground mb-6">
              Esta política é efetiva a partir da data de última atualização mencionada acima.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')} className="grok-button-primary">
                Voltar à Loja
              </Button>
              <Button 
                onClick={() => navigate('/termos')} 
                variant="outline" 
                className="grok-button-secondary"
              >
                Ver Termos de Uso
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};