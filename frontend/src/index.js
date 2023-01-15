/* Copyright 2022-2023 Hassan El anabi (al-annabi.tech) */

import cons from "spa-utils/cons";
import { link, router } from "spa-utils/router";
import * as api from "./lib/api.js";
import icon from "./lib/icons.js";
import { dict, setLang } from "./lib/dict.js";
import home from "./views/home.js";
import login from "./views/login.js";
import signup from "./views/signup.js";
import verify from "./views/verify.js";
import "./styles/types.css";

function header(userLoggedIn, setUser) {
    function handleLang(event) {
	setLang(event.target.value);
    }
    
    const links = cons("ul", cons("li", link("/", dict("home"))));

    if (!userLoggedIn) {
	links.append(
	    cons("li", link("/signup", dict("signup"))),
	    cons("li", link("/login", dict("login"))));
    } else {
	links.append(
	    cons("button", { onclick: () => setUser(null) }, "Log out"));
    }

    links.append(
 	cons("select", { onchange: handleLang },
	     cons("option", { value: "en" }, "English"),
	     cons("option", { value: "ar" }, "العربية")));
    
    return cons("header",
		cons("h1", icon("poll"), "Polls"),
		cons("span", dict("title")),
		links);
}

function notfound() {
    return cons("h2", "Page Not Found");
}   

function app() {
    const shared = {};

    function setUser(user) {
	if (user)
	    localStorage.setItem("user", JSON.stringify(user));
	else
	    localStorage.removeItem("user");
	
	shared.user = user;
	api.setToken(user?.token);
	currentHeader.replaceWith(
	    currentHeader = header(Boolean(user), setUser));
	shared.toggleHomeView?.();
    }

    shared.showNotif = (msg, type) => {
	alert(msg);
    };

    const routes = new Map()
	  .set(/\/$/, () => home(shared))
	  .set(/\/login$/, () => login(setUser))
	  .set(/\/signup$/, signup)
	  .set(/\/verify(\?|$)/, () => verify(shared))
	  .set(/\//, notfound);

    const container = new DocumentFragment();
    let currentHeader = header(false);
    const notif = cons("div", { hidden: "" });
    const storedUser = localStorage.getItem("user"); 

    if (storedUser) {
	notif.removeAttribute("hidden");
	notif.textContent = "Authenticating user...";

	api.request("/api/auth", { payload: storedUser })
	    .then(() => {
		setUser(JSON.parse(storedUser));
		notif.setAttribute("hidden", "");
	    })
	    .catch(err => {
		console.error(err = err.toString());
		notif.textContent = err;
	    });
    }

    container.append(currentHeader, notif, router(routes));
    return container;
}

document.body.replaceChildren(app());
