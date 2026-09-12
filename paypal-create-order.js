const PAYPAL_API = process.env.PAYPAL_ENV === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error_description || "Falha ao autenticar com o PayPal.");
  return json.access_token;
}

exports.handler = async (event) => {
  try {
    const { amount } = JSON.parse(event.body || "{}");
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Valor inválido." }) };
    }

    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "EUR", value: Number(amount).toFixed(2) } }]
      })
    });
    const order = await res.json();
    if (!res.ok) throw new Error(order.message || "Falha ao criar a encomenda PayPal.");

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: order.id }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
