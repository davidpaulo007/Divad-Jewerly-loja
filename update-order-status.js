// Só um admin pode alterar o estado de uma encomenda (ex: marcar como "enviado").
exports.handler = async (event, context) => {
  const caller = context.clientContext && context.clientContext.user;
  if (!caller) {
    return { statusCode: 401, body: JSON.stringify({ error: "Não autenticado." }) };
  }
  const roles = (caller.app_metadata && caller.app_metadata.roles) || [];
  if (!roles.includes("admin")) {
    return { statusCode: 403, body: JSON.stringify({ error: "Esta conta não tem acesso ao painel administrativo." }) };
  }

  const identity = context.clientContext.identity;
  if (!identity) {
    return { statusCode: 500, body: JSON.stringify({ error: "Identity não está disponível neste site." }) };
  }

  try {
    const { userId, orderId, status } = JSON.parse(event.body || "{}");
    if (!userId || !orderId || !status) {
      return { statusCode: 400, body: JSON.stringify({ error: "Dados em falta (userId, orderId, status)." }) };
    }

    // 1) Vai buscar o utilizador atual para não perder os outros dados dele.
    const getRes = await fetch(`${identity.url}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${identity.token}` }
    });
    const user = await getRes.json();
    if (!getRes.ok) {
      return { statusCode: getRes.status, body: JSON.stringify({ error: "Cliente não encontrado.", detail: user }) };
    }

    const currentMeta = user.user_metadata || {};
    const orders = (currentMeta.orders || []).map(o => o.id === orderId ? { ...o, status } : o);

    // 2) Grava de volta só o campo "orders" atualizado, mantendo o resto igual.
    const putRes = await fetch(`${identity.url}/admin/users/${userId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${identity.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ user_metadata: { ...currentMeta, orders } })
    });
    const updated = await putRes.json();
    if (!putRes.ok) {
      return { statusCode: putRes.status, body: JSON.stringify({ error: "Falha ao atualizar a encomenda.", detail: updated }) };
    }

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Falha interna.", detail: String(err) }) };
  }
};
