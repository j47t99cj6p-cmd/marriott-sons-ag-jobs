const K={jobs:'ms_jobs',customers:'ms_customers',employees:'ms_employees'};
const get=k=>JSON.parse(localStorage.getItem(K[k])||'[]'), put=(k,v)=>localStorage.setItem(K[k],JSON.stringify(v));
let tab='home';

function render(){document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
const a=document.getElementById('app'); if(tab==='home')home(a); if(tab==='jobs')jobs(a); if(tab==='customers')customers(a); if(tab==='employees')employees(a); if(tab==='reports')reports(a)}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;render()});

function home(a){const j=get('jobs'),today=new Date().toDateString(),t=j.filter(x=>new Date(x.date).toDateString()===today);
a.innerHTML=`<div class="card"><h2>Dashboard</h2><p class="muted">Track your agricultural work in one place.</p>
<div class="grid"><div class="card"><div class="stat">${t.length}</div><div class="muted">Today's jobs</div></div>
<div class="card"><div class="stat">${sum(t,'acreage').toFixed(1)}</div><div class="muted">Acres today</div></div>
<div class="card"><div class="stat">${sum(t,'loads')}</div><div class="muted">Loads today</div></div>
<div class="card"><div class="stat">${sum(t,'fuel').toFixed(0)} L</div><div class="muted">Fuel today</div></div></div>
<button class="primary" onclick="tab='jobs';render();setTimeout(()=>document.getElementById('newJob').scrollIntoView(),50)">+ New Job</button></div>
<div class="card"><h3>Recent jobs</h3>${j.length?j.slice(-5).reverse().map(jobCard).join(''):'<div class="empty">No jobs recorded yet.</div>'}</div>`}
function sum(arr,k){return arr.reduce((n,x)=>n+(Number(x[k])||0),0)}
function jobCard(x){return `<div class="card"><div class="row"><b>${esc(x.title)}</b><button class="danger" onclick="delJob('${x.id}')">Delete</button></div><div>${esc(x.customer)} · ${esc(x.employee)}</div><div class="muted">${new Date(x.date).toLocaleDateString('en-GB')} · ${x.acreage||0} acres · ${x.loads||0} loads · ${x.fuel||0} L</div><p>${esc(x.work||'')}</p></div>`}
function jobs(a){const j=get('jobs'),cs=get('customers'),es=get('employees');
a.innerHTML=`<div class="card" id="newJob"><h2>New Job</h2>
<label>Date</label><input id="date" type="datetime-local" value="${new Date().toISOString().slice(0,16)}">
<label>Job / work type</label><input id="title" placeholder="e.g. Baling, drilling, carting">
<label>Customer</label><select id="customer"><option value="">Select customer</option>${cs.map(x=>`<option>${esc(x.name)}</option>`).join('')}</select>
<label>Employee</label><select id="employee"><option value="">Select employee</option>${es.map(x=>`<option>${esc(x.name)}</option>`).join('')}</select>
<label>Acreage</label><input id="acreage" type="number" step="0.1" placeholder="0">
<label>Fuel used (litres)</label><input id="fuel" type="number" step="0.1" placeholder="0">
<label>Loads</label><input id="loads" type="number" step="1" placeholder="0">
<label>Work carried out</label><textarea id="work" rows="3" placeholder="Describe what was done"></textarea>
<button class="primary" onclick="saveJob()">Save Job</button></div>
<h2>Job History</h2>${j.length?j.slice().reverse().map(jobCard).join(''):'<div class="card empty">No jobs recorded yet.</div>'}`}

function saveJob(){const x={id:Date.now().toString(),date:date.value,title:title.value||'Job',customer:customer.value,employee:employee.value,acreage:+acreage.value||0,fuel:+fuel.value||0,loads:+loads.value||0,work:work.value};
if(!x.customer||!x.employee){alert('Please select a customer and employee.');return}const j=get('jobs');j.push(x);put('jobs',j);alert('Job saved');render()}
function delJob(id){put('jobs',get('jobs').filter(x=>x.id!==id));render()}

function customers(a){const cs=get('customers');a.innerHTML=`<div class="card"><h2>Customers</h2><label>Customer name</label><input id="cname" placeholder="Customer name"><label>Contact / phone</label><input id="cphone" placeholder="Optional"><button class="primary" onclick="addCustomer()">Add Customer</button></div>${cs.length?cs.map((x,i)=>`<div class="card row"><div><b>${esc(x.name)}</b><div class="muted">${esc(x.phone||'')}</div></div><button class="danger" onclick="delCustomer(${i})">Delete</button></div>`).join(''):'<div class="card empty">No customers yet.</div>'}`}
function addCustomer(){if(!cname.value.trim())return;const x=get('customers');x.push({name:cname.value.trim(),phone:cphone.value.trim()});put('customers',x);render()}
function delCustomer(i){const x=get('customers');x.splice(i,1);put('customers',x);render()}

function employees(a){const es=get('employees');a.innerHTML=`<div class="card"><h2>Employees</h2><label>Employee name</label><input id="ename" placeholder="Employee name"><label>Phone</label><input id="ephone" placeholder="Optional"><button class="primary" onclick="addEmployee()">Add Employee</button></div>${es.length?es.map((x,i)=>`<div class="card row"><div><b>${esc(x.name)}</b><div class="muted">${esc(x.phone||'')}</div></div><button class="danger" onclick="delEmployee(${i})">Delete</button></div>`).join(''):'<div class="card empty">No employees yet.</div>'}`}
function addEmployee(){if(!ename.value.trim())return;const x=get('employees');x.push({name:ename.value.trim(),phone:ephone.value.trim()});put('employees',x);render()}
function delEmployee(i){const x=get('employees');x.splice(i,1);put('employees',x);render()}

function reports(a){const j=get('jobs');a.innerHTML=`<div class="card"><h2>Reports</h2><div class="grid">
<div class="card"><div class="stat">${j.length}</div><div class="muted">Jobs</div></div>
<div class="card"><div class="stat">${sum(j,'acreage').toFixed(1)}</div><div class="muted">Total acres</div></div>
<div class="card"><div class="stat">${sum(j,'loads')}</div><div class="muted">Total loads</div></div>
<div class="card"><div class="stat">${sum(j,'fuel').toFixed(1)} L</div><div class="muted">Total fuel</div></div></div></div>`}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
render();