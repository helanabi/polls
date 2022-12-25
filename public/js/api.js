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
