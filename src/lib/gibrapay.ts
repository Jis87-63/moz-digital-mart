// Gibrapay Payment Service
const GIBRAPAY_API_URL = 'https://gibrapay.online/v1';

export interface GibrapayTransferRequest {
  wallet_id: string;
  amount: number;
  number_phone: string;
  alert_sms?: {
    api_key: string;
    sender_id: string;
    phone: string;
    phone_customer: string;
    message: string;
    customer_message: string;
  };
}

export interface GibrapayResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    id: string;
    wallet_id: string;
    amount: string;
    number_phone: string;
    type: string;
    status: 'complete' | 'failed' | 'pending';
    at_created: string;
  };
}

class GibrapayService {
  private apiKey: string;
  private walletId: string;
  private authToken: string;

  constructor() {
    // Credentials provided by user
    this.apiKey = 'b3b33cba8a903626a015d592754f1dcec756e9fbb12d411516f4a79b04aba8923ebb6396da29e61c899154ab005aaf056961b819c263e1ec5d88c60b9cae6aba';
    this.walletId = '50c282d1-843f-4b9c-a287-2140e9e8d94b';
    this.authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImQxMmFmYWNhLWVhNDctNGNkZS04NmJlLWJlMDM5Mzc2OTczMiIsImVtYWlsIjoienVuaWFtdW5pcjMwQGdtYWlsLmNvbSIsImlhdCI6MTc1Njk5MTk0MiwiZXhwIjoxNzU2OTk1NTQyfQ.7KFXSdhTEG1NkyyATa7sL256TUb_t2T_oqh3TVHdabc';
  }

  async transfer(phoneNumber: string, amount: number): Promise<GibrapayResponse> {
    const requestData: GibrapayTransferRequest = {
      wallet_id: this.walletId,
      amount: amount,
      number_phone: phoneNumber
    };

    try {
      const response = await fetch(`${GIBRAPAY_API_URL}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.apiKey,
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Gibrapay transfer error:', error);
      throw new Error('Erro na comunicação com o serviço de pagamento');
    }
  }

  async getWalletBalance(): Promise<any> {
    try {
      const response = await fetch(`${GIBRAPAY_API_URL}/wallet/${this.walletId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.apiKey
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Gibrapay wallet balance error:', error);
      throw new Error('Erro ao consultar saldo da carteira');
    }
  }

  async getTransactions(): Promise<any> {
    try {
      const response = await fetch(`${GIBRAPAY_API_URL}/transactions/${this.walletId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': this.apiKey
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Gibrapay transactions error:', error);
      throw new Error('Erro ao consultar transações');
    }
  }

  validatePhoneNumber(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    const mozambiqueNumber = digits.slice(-9);
    
    // Check if it's a valid Mozambique mobile number (84, 85, 86, 87)
    return mozambiqueNumber.length === 9 && ['84', '85', '86', '87'].includes(mozambiqueNumber.slice(0, 2));
  }

  formatPhoneNumber(phone: string): string {
    // Remove non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Format for Mozambique (+258 XX XXX XXXX)
    if (digits.length >= 9) {
      const formatted = digits.slice(-9);
      return `+258 ${formatted.slice(0, 2)} ${formatted.slice(2, 5)} ${formatted.slice(5)}`;
    }
    return phone;
  }
}

export const gibrapayService = new GibrapayService();