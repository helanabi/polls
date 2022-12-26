export let token = null;

export function setToken(newToken) {
    token = newToken;
}

export async function authenticate(storedUser) {
    const res = await fetch("/api/auth", {
	method: "POST",
	headers: {
	    "Content-Type": "application/json"
	},
	body: storedUser
    });

    if (!res.ok) throw new Error((await res.json()).error);
}

export async function logUserIn(username, password) {
    const res = await fetch("/api/login", {
	method: "POST",
	headers: {
	    "Content-Type": "application/json",
	},
	body: JSON.stringify({ username, password })
    });

    const json = await res.json();

    if (res.ok) return json;
    throw new Error(json.error);
}

// TODO: Move user registration procedure here

export async function polls() {
    const res = await fetch("/api/polls");
    const json = await res.json();

    if (res.ok) return json;
    throw new Error(json.error);
}

export async function savePoll(title, choices) {
    const res = await fetch("/api/polls", {
	method: "POST",
	headers: {
	    "Content-Type": "application/json",
	    "Authorization": token
	},
	body: JSON.stringify({ title, choices })
    });

    if (!res.ok)
	throw new Error((await res.json).error);
}
