import cons from "./spa-utils/cons.js";
import { parseSearchParams, navigate } from "./spa-utils/router.js";
import { request } from "./api.js";

export default function verify({ showNotif }) {
    const notif = cons("div", { hidden: "" });

    async function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;

	try {
	    await request("/api/verify", {
		payload: {
		    password: form.password.value,
		    token: parseSearchParams().token
		}
	    });
	    
	    showNotif("Account verified successfully", "success");
	    navigate("/login");
	} catch(err) {
	    showNotif(err.toString(), "error");
	}
    }
	
    return cons("main",
		cons("h2", "Confirm your account"),
		cons("form", { onsubmit: handleSubmit },
		     cons("input", {
			 type: "password",
			 name: "password",
			 placeholder: "Password"
		     }),
		     cons("button", { type: "submit" }, "Confirm account")));
}
