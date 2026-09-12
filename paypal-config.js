// O Client ID do PayPal NÃO é secreto (é feito para ser usado no navegador).
// O Client Secret é que nunca deve sair do servidor — só é usado nas outras duas funções.
exports.handler = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  if (!clientId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "PAYPAL_CLIENT_ID não está configurado nas variáveis de ambiente do Netlify." })
    };
  }
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId })
  };
};
