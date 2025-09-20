import { generateYunoHeaders, getYunoBaseUrl, getAccountId } from '@/lib/gen-headers';

export async function POST(request: Request) {
  console.log('Payment create endpoint called');
  
  try {
    const headers = generateYunoHeaders();
    const baseUrl = getYunoBaseUrl();
    const accountId = getAccountId();
    
    const body = await request.json();
    
    const paymentData = {
      account_id: accountId,
      ...body
    };
    
    console.log('Creating payment with Yuno API:', paymentData);
    
    const response = await fetch(`${baseUrl}/v1/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentData)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('Yuno API error:', result);
      return Response.json({ 
        error: 'Failed to create payment',
        details: result
      }, { status: response.status });
    }
    
    console.log('Payment created successfully:', result);
    
    return Response.json({
      message: "Payment created successfully",
      payment: result
    });
    
  } catch (error) {
    console.error('Error creating payment:', error);
    return Response.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}