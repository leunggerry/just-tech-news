async function editFormHandler(event) {
  event.preventDefault();

  const postId = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  // capture the text from the area
  const title = document.querySelector('input[name="post-title"]').value.trim();

  const response = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document.querySelector(".edit-post-form").addEventListener("submit", editFormHandler);
