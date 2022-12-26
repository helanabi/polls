import { savePoll } from "./api.js";
import cons from "./spa-utils/cons.js";

function makeList(polls) {
    return polls.map(poll =>
	cons("div",
	     cons("span", poll.title),
	     ...poll.choices.map(choice =>
		 cons("div",
		      cons("span", choice.description),
		      cons("span", choice.votes))),
	     cons("span", "Posted by:", poll.creator),
	     cons("span", new Date(poll.creation_time))));
}

function pollList() {
    const root = cons("section", "Loading...");
    
    fetch("/api/polls")
	.then(res => {
	    if (res.ok) return res.json();
	    throw new Error(`${res.status}: ${res.statusText}`);
	})
	.then(polls => {
	    root.replaceChildren(...makeList(polls));
	})
	.catch(err => {
	    console.error(err = err.toString());
	    root.replaceChildren(cons("div", err));
	});

    return root;
}

function pollForm() {
    // TODO: sync list when polls added
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
	    await savePoll(form.title.value, choices);
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
    const pollFormNode = pollForm();
    
    const root = cons("main", 
		      shared.user ? pollFormNode : "",
		      pollList());

    root.addEventListener("_connect", () => {
	if (shared.user)
	    root.prepend(pollFormNode);
	else
	    pollFormNode.remove();
    });

    return root;
}
