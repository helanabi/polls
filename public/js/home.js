import * as api from "./api.js";
import cons from "./spa-utils/cons.js";

function makePoll(poll, shared) {
    let choice;
    const voteBtn = cons("button", { disabled: "" }, "Vote");
    if (!shared.user || poll.choice) voteBtn.setAttribute("hidden", "");

    voteBtn.onclick = async (event) => {
	try {
	    await api.request("/api/votes", {
		useAuth: true,
		payload: {
		    pollId: poll.id,
		    choice: choice.firstElementChild.textContent
		}
	    });
	    
	    shared.refreshList();
	} catch (err) {
	    console.error(err = err.toString());
	    shared.showNotif(err, "error");
	}
    };

    let handleSelect = function(event) {
	if (!shared.user || poll.choice) return;
	choice?.classList.remove("selected-choice");
	choice = this;
	choice.classList.add("selected-choice");
	voteBtn.removeAttribute("disabled");
    }
    
    return cons("div",
		cons("span", poll.title),
		...poll.choices.map(choice =>
		    cons("div",
			 {
			     class: "poll-choice",
			     onclick: handleSelect
			 },
			 cons("span", choice.description),
			 cons("span", choice.votes))),
		voteBtn,
		cons("span", "By: ", poll.creator),
		cons("span",
		     new Date(poll.creation_time).toLocaleString()));
}

function pollList(shared) {
    const root = cons("section");

    shared.refreshList = async () => {
	root.prepend("loading...");

	try {
	    const polls = await api.request("/api/polls", {
		useAuth: Boolean(shared.user)
	    });
	    
	    shared.togglePollView = [];
	    root.replaceChildren(...polls.map(poll =>
		makePoll(poll, shared)));
	    
	} catch(err) {
	    console.error(err = err.toString());
	    root.replaceChildren(cons("div", err));
	};
    }
    
    shared.refreshList();
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
	    await api.request("api/polls", {
		useAuth: true,
		payload: {
		    title: form.title.value,
		    choices
		}
	    });
	    
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
    const pollListNode = pollList(shared);
    const pollFormNode = pollForm(shared);
    
    const root = cons("main", 
		      shared.user ? pollFormNode : "",
		      pollListNode);

    shared.toggleHomeView = () => {
	shared.refreshList();
	
	if (shared.user)
	    root.prepend(pollFormNode);
	else
	    pollFormNode.remove();
    };
    
    return root;
}
