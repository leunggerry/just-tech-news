// Async because it will eventually be making an asynchronous PUT requests with afetch()
// provide 2 things for the PUT request
// post_idd and the user_id
async function upvoteClickHandler(event) {
  event.preventDefault();

  const id = window.location.toString().split("/")[window.location.toString().split("/").length - 1];

  const response = await fetch("/api/posts/upvote", {
    method: "PUT",
    body: JSON.stringify({
      post_id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.reload();
  } else {
    alert(response.statusText);
  }
}

document.querySelector(".upvote-btn").addEventListener("click", upvoteClickHandler);
