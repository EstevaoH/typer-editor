import AbacatePay from "abacatepay-nodejs-sdk";

export const getAbacatePayClient = () => {
  const apiKey = process.env.ABACATE_PAY_API_KEY;
  if (!apiKey) {
    throw new Error("ABACATE_PAY_API_KEY is not configured");
  }
  return new AbacatePay(apiKey);
};

export async function createAbacateCustomer(data: {
  name: string;
  email: string;
  cellphone?: string;
  taxId?: string;
}) {
  const client = getAbacatePayClient();
  try {
    // List customers to check if already exists
    const customers = await client.customers.list({ email: data.email });
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

    const newCustomer = await client.customers.create(customerPayload);
    return newCustomer;
  } catch (error) {
    console.error("Error creating Abacate customer:", error);
    throw error;
  }
}

export async function createCheckoutUrl(customerId: string, returnUrl: string) {
  const client = getAbacatePayClient();
  try {
    const checkout = await client.billing.create({
      customerId,
      amount: 1500, // R$ 15.00
      currency: "BRL",
      description: "Typer Editor Pro Plan",
      frequency: "MONTHLY",
      returnUrl,
      methods: ["PIX", "CREDIT_CARD"],
      products: [
        {
          externalId: "pro-plan",
          name: "Typer Editor Pro",
          description: "Access to all premium features",
          quantity: 1,
          price: 1500
        }
      ]
    });
    return checkout.url;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

export async function cancelSubscription(subscriptionId: string) {
  const client = getAbacatePayClient();
  try {
    // AbacatePay uses billing.cancel to cancel a subscription
    const result = await client.billing.cancel(subscriptionId);
    return result;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

export async function getSubscriptionDetails(subscriptionId: string) {
  const client = getAbacatePayClient();
  try {
    const subscription = await client.billing.get(subscriptionId);
    return subscription;
  } catch (error) {
    console.error("Error getting subscription details:", error);
    throw error;
  }
}
