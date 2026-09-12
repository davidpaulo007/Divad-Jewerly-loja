// Só um admin pode ver todas as encomendas de todos os clientes.
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
    const res = await fetch(`${identity.url}/admin/users`, {
      headers: { Authorization: `Bearer ${identity.token}` }
    });
    if (!res.ok) {
      const detail = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: "Erro ao consultar clientes.", detail }) };
    }
    const json = await res.json();

    const orders = [];
    (json.users || []).forEach(u => {
      const list = (u.user_metadata && u.user_metadata.orders) || [];
      list.forEach(o => {
        orders.push({
          ...o,
          userId: u.id,
          customerEmail: u.email,
          customerName: (u.user_metadata && u.user_metadata.full_name) || "",
          customerAddress: (u.user_metadata && u.user_metadata.address) || "",
          customerZip: (u.user_metadata && u.user_metadata.zip) || "",
          customerCity: (u.user_metadata && u.user_metadata.city) || "",
          customerPhone: (u.user_metadata && u.user_metadata.phone) || ""
        });
      });
    });

    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orders }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Falha interna.", detail: String(err) }) };
  }
};
