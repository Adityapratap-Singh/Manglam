async function addGuest(){
  const name = document.getElementById("guestName").value.trim();
  const withFamily = document.getElementById("withFamily").checked;

  if(!name) return alert("Enter guest name");

  await fetch("/api/guest",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ name, withFamily })
  });

  document.getElementById("guestName").value="";
  document.getElementById("withFamily").checked=false;

  loadGuests();
}

async function loadGuests(){
  const res = await fetch("/api/guests");
  const guests = await res.json();

  const list = document.getElementById("guestList");
  list.innerHTML="";

  guests.forEach(g=>{
    const div=document.createElement("div");
    div.className="guest";

    const link = `${location.origin}/invite/${g.inviteId}`;

    div.innerHTML=`
      <div class="guest-info">
        <b>${g.name}</b> ${g.withFamily ? "👨‍👩‍👧‍👦" : ""}
        <small>${link}</small>
        <span class="status ${g.opened ? "opened" : "pending"}">
          ${g.opened ? "Opened" : "Not Opened"}
        </span>
      </div>
      <div class="actions">
        <button class="copy-btn" onclick="copyLink('${link}')">Copy Link</button>
        <button class="edit-btn" onclick="editGuest('${g._id}', '${g.name}', ${g.withFamily})">Edit</button>
        <button class="delete-btn" onclick="deleteGuest('${g._id}')">Delete</button>
      </div>
    `;

    list.appendChild(div);
  });
}

function copyLink(link){
  navigator.clipboard.writeText(link);
  alert("Invitation link copied!");
}

async function deleteGuest(id){
  if(!confirm("Delete this guest?")) return;

  await fetch("/api/guest/"+id,{ method:"DELETE" });
  loadGuests();
}

function editGuest(id, name, withFamily){
  const newName = prompt("Edit guest name:", name);
  if(newName === null) return;

  const newWithFamily = confirm("Include family members? Click OK for Yes, Cancel for No");

  updateGuest(id, newName.trim(), newWithFamily);
}

async function updateGuest(id, name, withFamily){
  if(!name) return alert("Name cannot be empty");

  await fetch("/api/guest/"+id,{
    method:"PUT",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ name, withFamily })
  });

  loadGuests();
}

loadGuests();


function requireAdmin(req, res, next) {
  if(!req.session.admin){
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
