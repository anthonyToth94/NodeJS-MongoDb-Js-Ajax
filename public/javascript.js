window.onload = () => {
  addItem();
  deleteItem();
};

function addItem() {
  document.querySelector("#addItem").onsubmit = function (event) {
    event.preventDefault();
    const item = event.target.elements.items.value;
    const body = JSON.stringify({
      name: item,
    });

    fetch("/list", {
      method: "POST",
      body: body,
      headers: {
        "Content-type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        console.log("Server Error");
        return;
      }
      location.reload();
    });
  };
}

function deleteItem() {
  const deleteButton = document.querySelectorAll(".delete");

  for (const dbtn of deleteButton) {
    dbtn.onclick = async function (event) {
      const id = event.target.dataset.productid;

      const response = await fetch(`/list/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.log("Server Error");
        return;
      }
      location.reload();
    };
  }
}
