// Esta função corre no servidor da Netlify (nunca no navegador do cliente).
// Só devolve a lista de clientes se quem pedir tiver a role "admin".
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
    const users = (json.users || []).map(u => ({
      email: u.email,
      created_at: u.created_at,
      confirmed: !!u.confirmed_at,
      full_name: (u.user_metadata && u.user_metadata.full_name) || "",
      phone: (u.user_metadata && u.user_metadata.phone) || "",
      address: (u.user_metadata && u.user_metadata.address) || "",
      zip: (u.user_metadata && u.user_metadata.zip) || "",
      city: (u.user_metadata && u.user_metadata.city) || "",
      country: (u.user_metadata && u.user_metadata.country) || ""
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "Falha interna.", detail: String(err) }) };
  }
};
