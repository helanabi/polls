export let token = null;

export function setToken(newToken) {
    token = newToken;
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

    if (!res.ok)
	throw new Error(json.error);

    return json;
}

// TODO: Move user registration procedure here

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
