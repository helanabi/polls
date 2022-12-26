import * as api from "./api.js";
import cons from "./spa-utils/cons.js";

function makeList(polls) {
    return polls.map(poll =>
	cons("div",
	     cons("span", poll.title),
	     ...poll.choices.map(choice =>
		 cons("div",
		      cons("span", choice.description),
		      cons("span", choice.votes))),
	     cons("span", "By: ", poll.creator),
	     cons("span", new Date(poll.creation_time).toLocaleString())));
}

function pollList(shared) {
    const root = cons("section");

    async function refresh() {
	root.prepend("loading...");

	try {
	    root.replaceChildren(...makeList(await api.polls()));
	} catch(err) {
	    console.error(err = err.toString());
	    root.replaceChildren(cons("div", err));
	};
    }

    shared.refreshList = refresh;
    refresh();
    return root;
}

function pollForm(shared) {
    let optionCount = 2;
    const notif = cons("div", { hidden: "" });

    function handleAddOption(event) {
	event.target.before(
	    cons("input", { placeholder: `Option #${++optionCount}` }));
    }

    async function handleSubmit(event) {
	event.preventDefault();
	const form = event.target;

	const choices = Array.from(form.elements)
	      .filter(elem => elem.tagName === "INPUT")
	      .map(elem => elem.value)
	      .slice(1);

	try {
	    await api.savePoll(form.title.value, choices);
	    shared.refreshList();
	    form.reset();
	} catch (err) {
	    console.error(err = err.toString());
	    notif.removeAttribute("hidden");
	    notif.textContent = err;
	}
    }
    
    return cons("section",
		notif,
		cons("form", { onsubmit: handleSubmit },
		     cons("input", {
			 name: "title",
			 placeholder: "Put your question here...",
			 required: ""
		     }),
		     cons("input", { placeholder: "Option #1", required: "" }),
		     cons("input", { placeholder: "Option #2", required: "" }),
		     cons("button", {
			 onclick: handleAddOption,
			 type: "button"
		     }, "Add an option"),
		     cons("button", { type: "submit" },
			  "Post new poll")));
}

export default function home(shared) {
    const localShared = {};
    const pollListNode = pollList(localShared);
    const pollFormNode = pollForm(localShared);
    
    const root = cons("main", 
		      shared.user ? pollFormNode : "",
		      pollListNode);

    root.addEventListener("_connect", () => {
	if (shared.user)
	    root.prepend(pollFormNode);
	else
	    pollFormNode.remove();
    });

    return root;
}
