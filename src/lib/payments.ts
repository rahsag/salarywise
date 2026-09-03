import { getApp } from '@react-native-firebase/app';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';
import RazorpayCheckout from 'react-native-razorpay';

// Must match setGlobalOptions({ region: ... }) in functions/src/index.ts.
const FUNCTIONS_REGION = 'asia-south1';

interface CreateOrderResult {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

interface VerifyResult {
  ok: boolean;
}

function friendlyPurchaseError(err: unknown): string {
  const description = (err as { description?: string })?.description ?? '';
  if (/cancel/i.test(description)) return 'Payment cancelled.';
  const message = (err as { message?: string })?.message;
  if (message) return message;
  return 'Payment failed. Please try again.';
}

export async function purchasePro(name: string, email: string): Promise<void> {
  const functions = getFunctions(getApp(), FUNCTIONS_REGION);

  try {
    const createOrder = httpsCallable<undefined, CreateOrderResult>(functions, 'createRazorpayOrder');
    const { data: order } = await createOrder();

    const checkout = await RazorpayCheckout.open({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: 'SalaryWise',
      description: 'Pro unlock — Tax Planner & Salary Optimizer',
      prefill: { name, email },
      theme: { color: '#2f4a34' },
    });

    const verify = httpsCallable<
      { orderId: string; paymentId: string; signature: string },
      VerifyResult
    >(functions, 'verifyRazorpayPayment');
    await verify({
      orderId: checkout.razorpay_order_id,
      paymentId: checkout.razorpay_payment_id,
      signature: checkout.razorpay_signature,
    });
  } catch (err) {
    throw new Error(friendlyPurchaseError(err));
  }
}
