import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Clock, Shield, CreditCard } from 'lucide-react';

export const Terms: React.FC = () => {
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Termos de Uso</h1>
            <p className="text-lg text-muted-foreground">
              Última atualização: Janeiro de 2025
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  1. Introdução e Aceitação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Bem-vindo à <strong>Moz Store Digital</strong>, uma loja online especializada na venda de 
                  produtos digitais em Moçambique. Ao acessar e utilizar nosso site, você concorda 
                  integralmente com estes Termos de Uso.
                </p>
                <p>
                  A Moz Store Digital é uma empresa registada em Moçambique, com licença de uso 
                  exclusiva para operações no território nacional moçambicano.
                </p>
                <p>
                  Se você não concordar com qualquer parte destes termos, não deve utilizar nossos serviços.
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>2. Serviços Oferecidos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>A Moz Store Digital oferece os seguintes produtos digitais:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Streaming:</strong> Contas e assinaturas de plataformas de streaming</li>
                  <li><strong>Ebooks:</strong> Livros digitais e assinaturas de bibliotecas online</li>
                  <li><strong>Gaming:</strong> Créditos, passes e assinaturas para jogos</li>
                  <li><strong>Jogos:</strong> Jogos digitais para diversas plataformas</li>
                  <li><strong>Recargas:</strong> Recargas telefónicas e de internet</li>
                  <li><strong>PayPal:</strong> Configuração e saldo para contas PayPal</li>
                </ul>
                <p>
                  Todos os produtos são entregues digitalmente através de links de download 
                  ou redirecionamento, conforme especificado na descrição de cada produto.
                </p>
              </CardContent>
            </Card>

            {/* Payments */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-primary" />
                  3. Pagamentos e Preços
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Os pagamentos são processados exclusivamente através da plataforma 
                  <strong> Gibrapay</strong>, utilizando o sistema C2B (Customer to Business).
                </p>
                <p><strong>Formas de pagamento aceitas:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Transferência móvel para números 84, 85, 86 ou 87</li>
                  <li>Os valores são apresentados em Meticais (MZN)</li>
                  <li>Confirmação automática via SMS (opcional)</li>
                </ul>
                <p>
                  Os preços podem ser alterados a qualquer momento sem aviso prévio. 
                  O preço final é o apresentado no momento da compra.
                </p>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  4. Política de Reembolso (24 Horas)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p><strong>Garantia de Reembolso em 24 Horas:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Você tem direito a reembolso integral dentro de 24 horas da compra</li>
                  <li>O produto não deve ter sido utilizado ou ativado</li>
                  <li>Para solicitar reembolso, contacte nosso suporte via WhatsApp</li>
                  <li>Reembolsos são processados em até 48 horas após aprovação</li>
                </ul>
                <p><strong>Situações que não se aplicam ao reembolso:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Produtos já utilizados ou ativados</li>
                  <li>Solicitações após 24 horas da compra</li>
                  <li>Produtos personalizados ou sob encomenda</li>
                  <li>Mudança de opinião após ativação do produto</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Responsibilities */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>5. Responsabilidades do Usuário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>Ao utilizar nossos serviços, você se compromete a:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Utilizar os produtos adquiridos de forma legal e ética</li>
                  <li>Não compartilhar credenciais de acesso de produtos adquiridos</li>
                  <li>Não utilizar nossos serviços para atividades ilícitas</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                </ul>
              </CardContent>
            </Card>

            {/* Limitations */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>6. Limitações de Responsabilidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  A Moz Store Digital atua como intermediária na venda de produtos digitais. 
                  Nossa responsabilidade é limitada à entrega do produto conforme descrito.
                </p>
                <p>Não nos responsabilizamos por:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Problemas técnicos em plataformas de terceiros</li>
                  <li>Mudanças nas políticas de serviços externos</li>
                  <li>Interrupções temporárias nos serviços</li>
                  <li>Uso indevido dos produtos adquiridos</li>
                </ul>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>7. Privacidade e Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Respeitamos sua privacidade e protegemos seus dados pessoais conforme 
                  nossa <Link to="/privacidade" className="text-primary hover:underline">
                  Política de Privacidade</Link>.
                </p>
                <p>
                  Utilizamos cookies essenciais para funcionamento do site e análise 
                  de tráfego, sempre respeitando sua escolha de consentimento.
                </p>
              </CardContent>
            </Card>

            {/* Changes */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>8. Alterações dos Termos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. 
                  As alterações serão comunicadas através do site e entrarão em vigor imediatamente.
                </p>
                <p>
                  É sua responsabilidade revisar periodicamente estes termos para se manter 
                  informado sobre quaisquer mudanças.
                </p>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>9. Contato e Suporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>Para dúvidas, suporte ou reclamações, entre em contato:</p>
                <ul className="list-none space-y-2">
                  <li><strong>WhatsApp:</strong> +258 87 650 0685</li>
                  <li><strong>E-mail:</strong> mozstoredigitalp2@gmail.com</li>
                  <li><strong>Telegram:</strong> t.me/EllonMuskDev</li>
                  <li><strong>Horário:</strong> Segunda a Domingo, 24 horas</li>
                </ul>
              </CardContent>
            </Card>

            {/* Copyright */}
            <Card className="grok-card">
              <CardHeader>
                <CardTitle>10. Direitos Autorais e Licença</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 selectable">
                <p>
                  © 2025 Moz Store Digital. Todos os direitos reservados.
                </p>
                <p>
                  <strong>Licença de uso exclusiva para Moçambique.</strong> 
                  O conteúdo, design e funcionalidades deste site são protegidos 
                  por direitos autorais e propriedade intelectual.
                </p>
                <p>
                  É proibida a reprodução, distribuição ou uso não autorizado 
                  de qualquer material deste site sem permissão expressa.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground">
              Ao continuar usando nossos serviços, você confirma ter lido e aceito estes Termos de Uso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button onClick={() => navigate('/')} className="grok-button-primary">
                Voltar à Loja
              </Button>
              <Button 
                onClick={() => navigate('/privacidade')} 
                variant="outline" 
                className="grok-button-secondary"
              >
                Ver Política de Privacidade
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};