export let token = null;

export function setToken(newToken) {
    token = newToken;
}

export async function request(url, { payload, method, useAuth }={}) {
    const opts = {};
    opts.method = method ?? (payload ? "POST" : "GET");

    if (payload) {
	opts.headers = { "Content-Type": "application/json" };

	opts.body = typeof payload === "string" ?
	    payload:
	    JSON.stringify(payload);
    }

    if (useAuth) {
	opts.headers = {
	    ...(opts.headers ?? {}),
	    Authorization: token
	};
    }
    
    const res = await fetch(url, opts);

    const hasBody = res.headers
	  .get("Content-Type")?.startsWith("application/json");

    const json = hasBody && await res.json();

    if (res.ok && hasBody) return json;
    if (!res.ok) throw new Error(json.error);
}
