import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });

  // Quick validations similar to VTEX order placement expectations
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
  }
  if (!body.clientProfileData || !body.clientProfileData.email) {
    return NextResponse.json({ error: 'Dados do cliente incompletos' }, { status: 400 });
  }
  if (!body.shipping || !body.shipping.selectedAddress) {
    return NextResponse.json({ error: 'Endereço não informado' }, { status: 400 });
  }
  if (!Array.isArray(body.payments) || body.payments.length === 0) {
    return NextResponse.json({ error: 'Forma de pagamento não selecionada' }, { status: 400 });
  }

  // Emulate order id creation
  const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();

  // In real integration, forward to a gateway and persist. Here we just acknowledge.
  return NextResponse.json({ orderId, status: 'created' }, { status: 201 });
}
