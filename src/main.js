import './style.css'
import { supabase } from './supabase'

document.querySelector('#app').innerHTML = `
<div class="header">

  <h1>Phone Compare</h1>

  <div class="auth-buttons">

    <button id="loginBtn">
      Login
    </button>

    <button id="logoutBtn" class="hidden">
      Logout
    </button>

  </div>

</div>

  <input type="text" id="search" placeholder="Search phone..." />

<div class="overlay hidden"></div>

<div class="login-form hidden" autocomplete="off">

  <input
    type="email"
    id="emailInput"
    placeholder="Username"
    autocomplete="off"
  />

  <input
    type="password"
    id="passwordInput"
    placeholder="Password"
    autocomplete="new-password"
  />

  <div class="login-buttons">

  <button id="submitLoginBtn">
    Login
  </button>

  <button id="googleBtn">
  Continue with Google
   </button>

  <button id="cancelLoginBtn">
    Cancel
  </button>

</div>

</div>

<div class="form hidden">

  <input type="text" id="brandInput" placeholder="Brand" />

  <input type="text" id="modelInput" placeholder="Model" />

  <input type="text" id="ramInput" placeholder="RAM" />

  <input type="text" id="batteryInput" placeholder="Battery" />

  <input type="text" id="cameraInput" placeholder="Camera" />

  <input type="text" id="imageInput" placeholder="Image URL" />

  <button id="addPhoneBtn">
    Add Phone
  </button>
  </div>

  <div class="top-bar">

  <h2>Comparison</h2>

  <select id="sortSelect">
    <option value="">Sort By</option>
    <option value="battery">Battery</option>
    <option value="ram">RAM</option>
    <option value="camera">Camera</option>
  </select>

</div>

  <div id="selected"></div>

  <div id="phones"></div>
`

let phones = []
let selectedPhones = []
let isAdmin = false
const savedPhones = localStorage.getItem('selectedPhones')

if (savedPhones) {

  selectedPhones = JSON.parse(savedPhones)
}
async function getPhones() {

  const { data } = await supabase
    .from('PHONES')
    .select('*')

  phones = data

  displayPhones(phones)
}

getPhones()

updateComparison()
checkUser()

function updateComparison() {

  if (selectedPhones.length === 0) {
    document.querySelector('#selected').innerHTML = ''
    return
  }

  document.querySelector('#selected').innerHTML = `
    <table>
      <tr>
        <th>Model</th>
        <th>RAM</th>
        <th>Battery</th>
        <th>Camera</th>
      </tr>

      ${selectedPhones.map(phone => `
        <tr>
          <td>
            ${phone.brand} ${phone.model}

            <button class="remove-btn" data-model="${phone.model}">
              ❌
            </button>
          </td>

          <td>${phone.ram}</td>
          <td>${phone.battery}</td>
          <td>${phone.camera}</td>
        </tr>
      `).join('')}
    </table>
  `

  const removeButtons = document.querySelectorAll('.remove-btn')

  removeButtons.forEach(button => {

    button.addEventListener('click', () => {

      const model = button.dataset.model

      selectedPhones = selectedPhones.filter(
        phone => phone.model !== model
      )
      localStorage.setItem(
  'selectedPhones',
  JSON.stringify(selectedPhones)
)

      updateComparison()
    })
  })
}

function displayPhones(phoneList) {

  document.querySelector('#phones').innerHTML = ''

  phoneList.forEach(phone => {

    const phoneContainer = document.querySelector('#phones')

    phoneContainer.innerHTML += `
    

      <div class="phone">

        <img src="${phone.image}" class="phone-image" />

        <h2>${phone.brand} ${phone.model}</h2>

        <p>RAM: ${phone.ram}</p>
        <p>Battery: ${phone.battery}</p>
        <p>Camera: ${phone.camera}</p>

        <button class="compare-btn">Compare</button>

        ${isAdmin ? `
<button class="delete-btn" data-id="${phone.id}">
  Delete
</button>
` : ''}

      </div>
    `
  })

const buttons = document.querySelectorAll('.compare-btn')

buttons.forEach((button, index) => {

  button.addEventListener('click', () => {

    const selectedPhone = phoneList[index]

    if (!selectedPhone) return

    const alreadyAdded = selectedPhones.find(
      phone => phone.model === selectedPhone.model
    )

    if (alreadyAdded) {
      alert('Phone already added')
      return
    }

    selectedPhones.push(selectedPhone)

    localStorage.setItem(
      'selectedPhones',
      JSON.stringify(selectedPhones)
    )

    updateComparison()

    alert(
      `${selectedPhone.brand} ${selectedPhone.model} added to compare`
    )
  })
})
  const deleteButtons = document.querySelectorAll('.delete-btn')

deleteButtons.forEach(button => {

  button.addEventListener('click', async () => {

    const id = button.dataset.id

    await supabase
      .from('PHONES')
      .delete()
      .eq('id', id)

    alert('Phone Deleted')

    getPhones()
  })
})
}

const searchInput = document.querySelector('#search')

searchInput.addEventListener('input', (e) => {

  const value = e.target.value.toLowerCase()

const filteredPhones = phones.filter(phone => {

  const fullName = `${phone.brand} ${phone.model}`

return fullName
  .toLowerCase()
  .includes(value)
})

  displayPhones(filteredPhones)
})
const sortSelect = document.querySelector('#sortSelect')

sortSelect.addEventListener('change', (e) => {

  const value = e.target.value

  let sortedPhones = [...phones]

  if (value === 'battery') {

    sortedPhones.sort((a, b) =>
      parseInt(b.battery) - parseInt(a.battery)
    )
  }

  if (value === 'ram') {

    sortedPhones.sort((a, b) =>
      parseInt(b.ram) - parseInt(a.ram)
    )
  }

  if (value === 'camera') {

    sortedPhones.sort((a, b) =>
      parseInt(b.camera) - parseInt(a.camera)
    )
  }

  displayPhones(sortedPhones)
})
const addPhoneBtn = document.querySelector('#addPhoneBtn')

addPhoneBtn.addEventListener('click', async () => {

  const brand = document.querySelector('#brandInput').value

  const model = document.querySelector('#modelInput').value

  const ram = document.querySelector('#ramInput').value

  const battery = document.querySelector('#batteryInput').value

  const camera = document.querySelector('#cameraInput').value

  const image = document.querySelector('#imageInput').value

  await supabase
    .from('PHONES')
    .insert([
      {
        brand,
        model,
        ram,
        battery,
        camera,
        image
      }
    ])

  alert('Phone Added')

  getPhones()
})
const loginBtn = document.querySelector('#loginBtn')

const googleBtn = document.querySelector('#googleBtn')

loginBtn.addEventListener('click', async () => {

document
  .querySelector('.login-form')
  .classList.remove('hidden')

  document
  .querySelector('.overlay')
  .classList.remove('hidden')
  })



const logoutBtn = document.querySelector('#logoutBtn')

logoutBtn.addEventListener('click', async () => {
 
 await supabase.auth.signOut()

  alert('Logged out')

  isAdmin = false

  displayPhones(phones)

  document
    .querySelector('.form')
    .classList.add('hidden')

  logoutBtn.classList.add('hidden')

  loginBtn.classList.remove('hidden')

  document.querySelector('#emailInput').value = ''

document.querySelector('#passwordInput').value = ''
})
googleBtn.addEventListener('click', async () => {

  await supabase.auth.signInWithOAuth({
    provider: 'google',

    options: {
      queryParams: {
        prompt: 'select_account'
      }
    }
  })

})

async function checkUser() {

  const { data } = await supabase.auth.getSession()

  if (data.session) {

    isAdmin = true

    document
      .querySelector('.form')
      .classList.remove('hidden')

    logoutBtn.classList.remove('hidden')

    loginBtn.classList.add('hidden')

    displayPhones(phones)
  }
}
const submitLoginBtn = document.querySelector('#submitLoginBtn')

submitLoginBtn.addEventListener('click', async () => {

  const email = document.querySelector('#emailInput').value

  const password = document.querySelector('#passwordInput').value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert(error.message)
    return
  }

  isAdmin = true

  displayPhones(phones)

  document
    .querySelector('.login-form')
    .classList.add('hidden')

  document
    .querySelector('.overlay')
    .classList.add('hidden')

  document
    .querySelector('.form')
    .classList.remove('hidden')

  logoutBtn.classList.remove('hidden')

loginBtn.classList.add('hidden')
  
alert('Logged in')
})
const cancelLoginBtn = document.querySelector('#cancelLoginBtn')

cancelLoginBtn.addEventListener('click', () => {

  document
    .querySelector('.login-form')
    .classList.add('hidden')

  document
    .querySelector('.overlay')
    .classList.add('hidden')
})


