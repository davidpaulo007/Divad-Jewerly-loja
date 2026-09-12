// Ver a mesma nota do mbway-request.js sobre confirmar o endpoint exato com a Ifthenpay.
exports.handler = async (event) => {
  try {
    const mbWayKey = process.env.IFTHENPAY_MBWAY_KEY;
    if (!mbWayKey) {
      return { statusCode: 500, body: JSON.stringify({ error: "IFTHENPAY_MBWAY_KEY não está configurado." }) };
    }

    const requestId = event.queryStringParameters && event.queryStringParameters.requestId;
    if (!requestId) {
      return { statusCode: 400, body: JSON.stringify({ error: "requestId em falta." }) };
    }

    const url = `https://api.ifthenpay.com/spg/payment/mbway/status/${encodeURIComponent(mbWayKey)}/${encodeURIComponent(requestId)}`;
    const res = await fetch(url);
    const json = await res.json();

    const status = String(json.Status || "").toLowerCase();
    const paid = status === "000" || status === "success" || status === "paid";
    const failed = status === "rejected" || status === "declined" || status === "expired" || status === "error";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid, failed, message: json.Message || "", raw: json })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
