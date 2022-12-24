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

export default function pollList() {
    const root = cons("main", "Loading...");
    
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
