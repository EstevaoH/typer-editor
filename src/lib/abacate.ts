import AbacatePay from "abacatepay-nodejs-sdk";

export const getAbacatePayClient = () => {
  const apiKey = process.env.ABACATE_PAY_API_KEY;
  if (!apiKey) {
    throw new Error("ABACATE_PAY_API_KEY is not configured");
  }
  return AbacatePay(apiKey);
};

// ============================================
// MÉTODOS DE CLIENTE (Customer)
// ============================================

export async function createAbacateCustomer(data: {
  name: string;
  email: string;
  cellphone?: string;
  taxId?: string;
}) {
  const client = getAbacatePayClient();
  try {
    // List customers to check if already exists
    // Nota: Ajustar conforme a API real - pode não aceitar argumentos
    const customers = await (client.customer.list as any)({ email: data.email });
    if (customers.data && customers.data.length > 0) {
      return customers.data[0];
    }

    const customerPayload: any = {
      name: data.name,
      email: data.email,
    };

    // Add optional fields if provided
    if (data.cellphone) {
      customerPayload.cellphone = data.cellphone;
    }
    if (data.taxId) {
      customerPayload.taxId = data.taxId;
    }

    const newCustomer = await client.customer.create(customerPayload);
    return newCustomer;
  } catch (error) {
    console.error("Error creating Abacate customer:", error);
    throw error;
  }
}

/**
 * Lista todos os clientes
 * @param filters - Filtros opcionais (ex: { email: string })
 * Nota: Ajustar conforme a API real do AbacatePay
 */
export async function listCustomers(filters?: { email?: string }) {
  const client = getAbacatePayClient();
  try {
    // O método list() pode não aceitar argumentos, ajustar conforme necessário
    const customers = await (client.customer.list as any)(filters || {});
    return customers;
  } catch (error) {
    console.error("Error listing customers:", error);
    throw error;
  }
}

// ============================================
// MÉTODOS DE COBRANÇA (Billing)
// ============================================

export async function createCheckoutUrl(
  customerId: string, 
  returnUrl: string,
  couponCode?: string,
  amount: number = 1500
) {
  const client = getAbacatePayClient();
  try {
    // Validar cupom se fornecido
    let finalAmount = amount;
    let couponId = undefined;
    
    if (couponCode) {
      const validation = await validateCoupon(couponCode, amount);
      if (validation.valid && validation.coupon) {
        finalAmount = validation.coupon.finalAmount;
        couponId = validation.coupon.id;
      } else {
        throw new Error(validation.error || "Cupom inválido");
      }
    }
    
    // Nota: Os tipos podem não corresponder exatamente à implementação real
    const checkoutPayload: any = {
      customerId,
      amount: finalAmount,
      currency: "BRL",
      description: "Typer Editor Pro Plan - Pagamento Único",
      frequency: "ONE_TIME", // Pagamento único, não recorrente
      returnUrl,
      methods: ["PIX"], // Apenas pagamento via PIX
      products: [
        {
          externalId: "pro-plan",
          name: "Typer Editor Pro",
          description: "Acesso vitalício a todos os recursos premium",
          quantity: 1,
          price: finalAmount
        }
      ]
    };
    
    // Adicionar cupom se válido
    if (couponId) {
      checkoutPayload.couponId = couponId;
      // Ou pode ser couponCode dependendo da API
      checkoutPayload.couponCode = couponCode;
    }
    
    const checkout = await (client.billing.create as any)(checkoutPayload);
    // Ajustar conforme a estrutura real da resposta
    return (checkout as any).url || (checkout as any).data?.url;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

/**
 * Lista todas as cobranças
 */
export async function listBillings() {
  const client = getAbacatePayClient();
  try {
    const billings = await client.billing.list();
    return billings;
  } catch (error) {
    console.error("Error listing billings:", error);
    throw error;
  }
}

/**
 * Obtém detalhes de uma cobrança específica
 * @param billingId - ID da cobrança
 * Nota: Pode ser necessário filtrar da lista ou usar método específico
 */
export async function getBillingDetails(billingId: string) {
  const client = getAbacatePayClient();
  try {
    const billings = await client.billing.list();
    // Filtrar pelo ID se necessário, ou usar método específico se disponível
    // Nota: Ajustar conforme a API real do AbacatePay
    if ((billings as any).data) {
      const billing = (billings as any).data.find((b: any) => b.id === billingId);
      return billing;
    }
    return billings;
  } catch (error) {
    console.error("Error getting billing details:", error);
    throw error;
  }
}

/**
 * Cancela uma assinatura recorrente no AbacatePay
 * 
 * NOTA: Esta função não é mais usada no sistema atual, pois o pagamento é único (ONE_TIME).
 * Mantida apenas para compatibilidade ou caso seja necessário no futuro.
 * 
 * @deprecated O sistema usa pagamento único, não há assinaturas recorrentes para cancelar
 */
export async function cancelSubscription(subscriptionId: string) {
  const client = getAbacatePayClient();
  try {
    // Nota: O método cancel pode não existir na tipagem, mas pode existir na implementação
    const result = await (client.billing as any).cancel?.(subscriptionId);
    return result;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

export async function getSubscriptionDetails(subscriptionId: string) {
  const client = getAbacatePayClient();
  try {
    // Nota: O método get pode não existir na tipagem, mas pode existir na implementação
    const subscription = await (client.billing as any).get?.(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error getting subscription details:", error);
    throw error;
  }
}

// ============================================
// MÉTODOS DE PIX QRCODE
// ============================================

/**
 * Cria um QRCode PIX para pagamento
 * @param billingId - ID da cobrança
 * Nota: Ajustar conforme a estrutura real do SDK do AbacatePay
 */
export async function createPixQRCode(billingId: string) {
  const client = getAbacatePayClient();
  try {
    // Ajustar conforme a estrutura real do SDK
    // Pode ser: client.pix.createQRCode, client.pix.create, etc.
    const qrCode = await (client as any).pix?.createQRCode?.(billingId) || 
                   await (client as any).pix?.create?.(billingId);
    return qrCode;
  } catch (error) {
    console.error("Error creating PIX QRCode:", error);
    throw error;
  }
}

/**
 * Simula um pagamento PIX (útil para testes)
 * @param billingId - ID da cobrança
 * Nota: Ajustar conforme a estrutura real do SDK do AbacatePay
 */
export async function simulatePixPayment(billingId: string) {
  const client = getAbacatePayClient();
  try {
    // Ajustar conforme a estrutura real do SDK
    const result = await (client as any).pix?.simulate?.(billingId) ||
                   await (client as any).pix?.simulatePayment?.(billingId);
    return result;
  } catch (error) {
    console.error("Error simulating PIX payment:", error);
    throw error;
  }
}

/**
 * Verifica o status de um pagamento PIX
 * @param billingId - ID da cobrança
 * Nota: Ajustar conforme a estrutura real do SDK do AbacatePay
 */
export async function checkPixStatus(billingId: string) {
  const client = getAbacatePayClient();
  try {
    // Ajustar conforme a estrutura real do SDK
    const status = await (client as any).pix?.checkStatus?.(billingId) ||
                   await (client as any).pix?.getStatus?.(billingId);
    return status;
  } catch (error) {
    console.error("Error checking PIX status:", error);
    throw error;
  }
}

// ============================================
// MÉTODOS DE CUPOM (Coupon)
// ============================================

/**
 * Cria um novo cupom de desconto
 * @param data - Dados do cupom
 * Nota: Ajustar os campos conforme a documentação real do AbacatePay
 */
export async function createCoupon(data: {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  expirationDate?: string;
  maxUses?: number;
  minPurchaseAmount?: number;
}) {
  const client = getAbacatePayClient();
  try {
    // Ajustar os campos conforme a documentação real
    // O campo pode ser 'discount' ao invés de 'discountType' e 'discountValue'
    const couponPayload: any = {
      code: data.code,
      discount: {
        type: data.discountType,
        value: data.discountValue,
      },
    };
    
    if (data.expirationDate) {
      couponPayload.expirationDate = data.expirationDate;
    }
    if (data.maxUses) {
      couponPayload.maxUses = data.maxUses;
    }
    if (data.minPurchaseAmount) {
      couponPayload.minPurchaseAmount = data.minPurchaseAmount;
    }
    
    const coupon = await client.coupon.create(couponPayload);
    return coupon;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
}

/**
 * Lista todos os cupons
 */
export async function listCoupons() {
  const client = getAbacatePayClient();
  try {
    const coupons = await client.coupon.list();
    return coupons;
  } catch (error) {
    console.error("Error listing coupons:", error);
    throw error;
  }
}

/**
 * Valida um cupom de desconto
 * @param code - Código do cupom
 * @param amount - Valor da compra em centavos (para validar valor mínimo)
 * @returns Dados do cupom válido ou null se inválido
 */
export async function validateCoupon(code: string, amount: number = 1500) {
  const client = getAbacatePayClient();
  try {
    const coupons = await client.coupon.list();
    
    // Buscar cupom pelo código
    let coupon = null;
    if ((coupons as any).data) {
      coupon = (coupons as any).data.find((c: any) => 
        c.code?.toUpperCase() === code.toUpperCase()
      );
    }
    
    if (!coupon) {
      return { valid: false, error: "Cupom não encontrado" };
    }
    
    // Verificar se está expirado
    if (coupon.expirationDate) {
      const expiration = new Date(coupon.expirationDate);
      if (expiration < new Date()) {
        return { valid: false, error: "Cupom expirado" };
      }
    }
    
    // Verificar valor mínimo
    if (coupon.minPurchaseAmount && amount < coupon.minPurchaseAmount) {
      return { 
        valid: false, 
        error: `Valor mínimo de R$ ${(coupon.minPurchaseAmount / 100).toFixed(2)}` 
      };
    }
    
    // Verificar usos máximos
    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      return { valid: false, error: "Cupom esgotado" };
    }
    
    // Calcular desconto
    let discountAmount = 0;
    if (coupon.discount?.type === "PERCENTAGE") {
      discountAmount = Math.round(amount * (coupon.discount.value / 100));
    } else if (coupon.discount?.type === "FIXED") {
      discountAmount = coupon.discount.value;
    }
    
    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discount?.type,
        discountValue: coupon.discount?.value,
        discountAmount,
        finalAmount: amount - discountAmount,
      }
    };
  } catch (error) {
    console.error("Error validating coupon:", error);
    return { valid: false, error: "Erro ao validar cupom" };
  }
}
