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
    const { orderID } = JSON.parse(event.body || "{}");
    if (!orderID) return { statusCode: 400, body: JSON.stringify({ error: "orderID em falta." }) };

    const token = await getAccessToken();
    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    const details = await res.json();
    if (!res.ok) throw new Error(details.message || "Falha ao capturar o pagamento.");

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(details) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
