// IMPORTANTE: a Ifthenpay entrega-te, junto com a tua chave MB WAY, um manual técnico (PDF)
// com o endpoint e nomes de parâmetros exatos para a tua conta/contrato. Os valores abaixo
// são os documentados publicamente pela Ifthenpay — confirma-os no teu manual antes de ires
// para produção, e testa sempre primeiro em modo sandbox.
const MBWAY_API = "https://api.ifthenpay.com/spg/payment/mbway";

exports.handler = async (event) => {
  try {
    const mbWayKey = process.env.IFTHENPAY_MBWAY_KEY;
    if (!mbWayKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "IFTHENPAY_MBWAY_KEY não está configurado nas variáveis de ambiente do Netlify." }) };
    }

    const { amount, mobileNumber, orderId } = JSON.parse(event.body || "{}");
    if (!amount || !mobileNumber || !orderId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Dados em falta (amount, mobileNumber, orderId)." }) };
    }

    const res = await fetch(MBWAY_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mbWayKey,
        orderId,
        amount: Number(amount).toFixed(2),
        mobileNumber: mobileNumber.startsWith("351#") ? mobileNumber : `351#${mobileNumber}`
      })
    });

    const json = await res.json();
    if (!res.ok || (json.Status && json.Status !== "000" && json.Status !== "pending")) {
      return { statusCode: 400, body: JSON.stringify({ error: json.Message || "O pedido MB WAY foi recusado.", raw: json }) };
    }

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify(json) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
