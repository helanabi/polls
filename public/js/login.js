import cons from "./spa-utils/cons.js";
import { navigate } from "./spa-utils/router.js";
import { request } from "./api.js";

export default function login(setUser) {
    const notif = cons("div", { hidden: "" });

    async function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;
	try {
	    const user = await request("/api/login", {
		payload: {
		    username: form.username.value,
		    password: form.password.value
		}
	    });

	    form.reset();
	    setUser(user);
	    navigate("/");
	} catch(err) {
	    console.error(err = err.toString());
	    notif.removeAttribute("hidden");
	    notif.textContent = err;
	}
    }
    
    return cons("main",
		cons("h2", "Log in"),
		notif,
		cons("form", { onsubmit: handleSubmit },
		     cons("input", {
			 name: "username",
			 placeholder: "Username",
			 required: ""
		     }),
		     cons("input", {
			 name: "password",
			 type: "password",
			 placeholder: "Password",
			 required: ""
		     }),
		     cons("button", { type: "submit" }, "Log in")));
}
