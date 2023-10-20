const url = "http://localhost:3000/transitions"

function renderTransition(transition) { // Função para criar uma linha da tabela
  const tbody = document.querySelector("#tbody")

  const tr = document.createElement("tr")
  tr.id = `tr-${transition.id}`

  const id = document.createElement("td")
  id.textContent = transition.id

  const title = document.createElement("td")
  title.id = `title-${transition.id}`
  title.textContent = transition.title

  const value = document.createElement("td")
  value.id = `value-${transition.id}`
  value.textContent = transition.value

  const tdEditButton = document.createElement("td")
  const editButton = document.createElement("button")
  editButton.textContent = "EDIT"
  editButton.id = `editButton-${transition.id}`
  editButton.classList.add("editButton")
  editButton.addEventListener("click", () => handleEditClick(transition.id))

  const tdDeleteButton = document.createElement("td")
  const deleteButton = document.createElement("button")
  deleteButton.textContent = "DELETE"
  deleteButton.id = `deleteButton-${transition.id}`
  deleteButton.classList.add("deleteButton")
  deleteButton.addEventListener("click", () => handleDeleteClick(transition.id))

  tdEditButton.appendChild(editButton)
  tdDeleteButton.appendChild(deleteButton)

  tr.append(id, title, value, tdEditButton, tdDeleteButton)

  tbody.appendChild(tr)
}

async function getTransitions() {
  const response = await fetch(url)
  const transitions = await response.json()

  transitions.forEach(renderTransition)

  calculateTotal()
}

async function calculateTotal() { // Função de calcular o valor total das transações
  const response = await fetch(url)
  const transitions = await response.json()

  const totalValue = transitions.reduce((total, transition) => total + transition.value, 0)
  const totalSpan = document.querySelector("#total")
  totalSpan.textContent = totalValue
}

const form = document.querySelector("form")
form.addEventListener("submit", async (ev) => { // Função de criar nova transação
  ev.preventDefault()

  const transitionData = {
    title: document.querySelector("#title").value,
    value: Number(document.querySelector("#value").value),
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transitionData)
  }

  const response = await fetch(url, options)
  const savedTransition = await response.json()

  form.reset()
  renderTransition(savedTransition)
  
  calculateTotal()
})

async function deleteTransition(transitionId) { // Função de deletar transação
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  }

  try {
    await fetch(`${url}/${transitionId}`, options)
    const tr = document.querySelector(`#tr-${transitionId}`)
    if (tr) {
      tr.remove()
    }
    calculateTotal()
  } catch (error) {
    console.error(`Erro ao deletar transação: ${error}`)
  }  
}

function handleDeleteClick(transitionId) { // Trata a função de deletar transação
  const confirmation = confirm("Deseja deletar essa transação?")

  if (confirmation) {
    deleteTransition(transitionId)
  }
}

async function editTransition(transitionId, newTitle, newValue) { // Função de editar transação
  const edicao = {
    title: newTitle,
    value: newValue
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(edicao)
  }

  try {
    await fetch(`${url}/${transitionId}`, options)

    const title = document.getElementById(`title-${transitionId}`)
    const value = document.getElementById(`value-${transitionId}`)
    title.textContent = newTitle
    value.textContent = newValue
    
    calculateTotal()
  } catch (error) {
    console.error(`Erro na edição da transação: ${error}`);
  }
}

function handleEditClick(transitionId) { // Trata a função de editar transação
  const newTitle = prompt("Digite o novo título")
  const newValue = Number(prompt("Digite o novo valor"))

  if (newTitle !== null && !isNaN(newValue)) {
    editTransition(transitionId, newTitle, newValue)
  } else {
    alert("Erro ao ler os novos valores")
  }
}

addEventListener("DOMContentLoaded", getTransitions)