import cons from "spa-utils/cons";

async function saveUser(form) {
    if (form.password.value !== form["password-confirm"].value)
	throw new Error("Passwords entered dot not match");

    const res = await fetch("/api/signup", {
	method: "POST",
	headers: {
	    "Content-Type": "application/json"
	},
	body: JSON.stringify({
	    username: form.username.value,
	    email: form.email.value,
	    password: form.password.value,
	})
    });

    if (!res.ok) {
	throw new Error((await res.json()).error);
    }
}

export default function signup() {
    const notif = cons("div", { hidden: "" });

    async function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;
	
	try {
	    await saveUser(form);
	    form.reset();
	    notif.removeAttribute("hidden");

	    notif.replaceChildren(
		"Almost there! We've sent a verification link to your email" +
		    ", please visit it to confirm your account.");
	} catch(err) {
	    console.error(err = err.toString());
	    notif.removeAttribute("hidden");
	    notif.textContent = err;
	}
    }
	
    return cons("main",
		cons("h2", "Sign Up"),
		notif,
		cons("form", { onsubmit: handleSubmit },
		     cons("input", {
			 name: "username",
			 placeholder: "Username",
			 required: ""
		     }),
		     cons("input", {
			 type: "email",
			 name: "email",
			 placeholder: "Email",
			 required: ""
		     }),
		     cons("input", {
			 type: "password",
			 name: "password",
			 placeholder: "Password",
			 required: ""
		     }),
		     cons("input", {
			 type: "password",
			 name: "password-confirm",
			 placeholder: "Confirm password",
			 required: ""
		     }),
		     cons("button", { type: "submit" }, "Sign me up")));
    
}
