/* V6 — explicit prototype storage; do not deploy personal data without a server. */
function safeNext(value){return value&&/^[a-z-]+\.html(?:[?#][^\s]*)?$/.test(value)?value:null}
function migrateV6(){
 if(S.upgradeVersion===6)return;
 localStorage.setItem('c11_backup_before_v6',JSON.stringify(S));
 S.upgradeVersion=6; S.config.domain='vbna.chapter11.com';S.config.senderEmail='bnachapter11@gmail.com';
 S.config.fees.initial=4500000; S.config.fees.annual=3000000;
 S.config.site={slogan:'Kết nối giá trị.\nKiến tạo cơ hội.',subtitle:'Gặp gỡ doanh nhân, mở rộng kết nối và cùng nhau phát triển tại Chapter 11.',aboutVBNA:'',aboutChapter:'',contactName:'',contactTitle:'Ban Khách mời',contactPhone:'',leftLogo:'',rightLogo:'',heroImage:''};
 S.config.chapters=[1,2,3,4,5,6,7,8,9,10,11,12,19,23];
 S.config.leaderOrder=['secretariat','president','vice','guests','training','events','development','orientation','support_director'];
 S.config.founders=[{name:'',title:'',photo:''},{name:'',title:'',photo:''},{name:'',title:'',photo:''}];
 S.config.openingRevenue=0;S.config.openingRevenueDate=new Date().toISOString().slice(0,10);
 S.config.assessment={attendance:80,referrals:1};
 for(const key of ['posts','training','media','obligations','pledges','attendanceNotes','notifications'])S[key]??=[];
 S.config.lockedMonths??=[];
 S.members.forEach(m=>{m.secondaryIndustry??='';m.avatar??='';});
 S.powerTeams.forEach(p=>p.openIndustries??=[]);
 save();
}
migrateV6();
const canLead=()=>['admin','president'].includes(currentUser()?.role);
const canDept=id=>!!currentUser()&&(canLead()||currentUser().role===S.departments.find(d=>d.id===id)?.leadRole);
const actives=()=>S.members.filter(m=>m.status==='active');
const localDay=(d=new Date())=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(d));
const clockVN=d=>new Date(d).toLocaleTimeString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',hour12:false});
const sum=(xs,key)=>xs.reduce((a,x)=>a+Number(x[key]||0),0);
const field=(name,label,value='',type='text',extra='')=>`<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" value="${esc(value)}" ${extra}></div>`;
const area=(name,label,value='')=>`<div class="field wide"><label for="${name}">${label}</label><textarea id="${name}" name="${name}">${esc(value)}</textarea></div>`;
const opts=(items,value='')=>items.map(x=>{let [v,l]=Array.isArray(x)?x:[x,x];return `<option value="${esc(v)}" ${String(v)===String(value)?'selected':''}>${esc(l)}</option>`}).join('');
const select=(name,label,items,value='')=>`<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${opts(items,value)}</select></div>`;
const val=id=>q('#'+id)?.value?.trim()||'';
const empty=t=>`<div class="empty">${esc(t)}</div>`;
const button=(label,fn,cls='btn-wine')=>`<button type="button" class="btn ${cls}" onclick="${fn}">${label}</button>`;
function table(headers,rows){return `<div class="table-wrap"><table class="table"><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr>${r.map(v=>`<td>${v??'—'}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${headers.length}">${empty('Chưa có dữ liệu')}</td></tr>`}</tbody></table></div>`}
const stats=items=>`<div class="kpi-grid v6-kpis">${items.map(([name,value,sub])=>`<div class="kpi"><span>${esc(name)}</span><strong>${esc(value)}</strong>${sub?`<small>${esc(sub)}</small>`:''}</div>`).join('')}</div>`;
function downloadBlob(blob,name){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)}
function strictName(name){return name.length>1&&name!==name.toLocaleUpperCase('vi')&&name!==name.toLocaleLowerCase('vi')}
function requireName(name){if(strictName(name))return true;toast('Họ tên cần có chữ hoa và chữ thường. Ví dụ: Nguyễn Văn An.');return false}
function imageSrc(src){return /^(data:image\/(png|jpeg|webp);base64,|blob:|https:\/\/)/.test(src||'')?src:''}
async function readImage(input){const f=input?.files?.[0];if(!f)return '';if(!['image/png','image/jpeg','image/webp'].includes(f.type)||f.size>6*1024*1024)throw Error('Chọn ảnh JPG, PNG hoặc WebP tối đa 6 MB.');return new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>{let im=new Image();im.onload=()=>{let c=document.createElement('canvas'),ratio=Math.min(1,1600/im.width,1600/im.height);c.width=im.width*ratio;c.height=im.height*ratio;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/webp',.84))};im.onerror=()=>rej(Error('Ảnh không hợp lệ'));im.src=r.result};r.onerror=rej;r.readAsDataURL(f)})}
function auditChange(action,entity,before,after){log(action,entity,JSON.stringify({before,after}))}
const baseSave=save;save=function(){try{baseSave()}catch(e){toast('Bộ nhớ trình duyệt đã đầy. Hãy sao lưu dữ liệu trước khi tiếp tục.');throw e}};
const baseActiveMeeting=activeMeeting;
activeMeeting=function(){const id=new URLSearchParams(location.search).get('meeting');return S.meetings.find(m=>m.id===id)||baseActiveMeeting()};
const originalApprove=window.approveRequest;
window.approveRequest=function(id){if(!canLead())return toast('Chỉ Admin hoặc Chủ tịch được phê duyệt');const a=S.approvals.find(x=>x.id===id);if(!a||a.status!=='pending')return;
 if(['profile','post','finance_edit','fee_config'].includes(a.type)){
  if(a.type==='profile')Object.assign(S.members.find(m=>m.id===a.entityId),a.payload);
  if(a.type==='post'){let p=S.posts.find(p=>p.id===a.entityId);if(p)p.status='approved'}
  if(a.type==='finance_edit')Object.assign(S.finance.find(f=>f.id===a.entityId),a.payload);
  if(a.type==='fee_config')S.config.fees.monthly=a.payload.monthly;
  a.status='approved';a.approvedBy=currentUser().id;a.approvedAt=iso();save();log('Phê duyệt',a.type,a.title);renderApprovals();toast('Đã phê duyệt','success');return;
 }originalApprove(id);
};
function requestApproval(type,id,title,payload){S.approvals.unshift({id:uid('APR'),type,entityId:id,title,payload,status:'pending',requestedBy:currentUser().id,createdAt:iso()});save()}
const originalShowAlerts=showAlerts;showAlerts=function(){};
function bootV6(){
 const p=document.body.dataset.page;
 if(['admin','departments','finance','finance-entry','support','lucky','member-portal','settings','reports'].includes(p)&&!requireAuth())return;
 if(currentUser()?.forcePasswordChange&&p!=='login'){showForcePassword(currentUser());return}
 if(p==='home')renderHomeV6();else if(p==='members-public'||p==='power-teams')renderMembersV6();
 else if(p==='media')renderMedia();else if(p==='settings')renderSiteSettings();else if(p==='reports')renderReportPage();
 else if(p==='departments')renderDepartmentsV6();else if(p==='member-portal')renderPortalV6();
 else if(p==='finance')renderFinanceV6();else {updateMeetingText();({meeting:renderMeetingPage,checkin:renderCheckin,'guest-register':renderGuestRegister,opportunity:renderOpportunity,admin:renderAdmin,'finance-entry':initFinanceEntry,support:renderSupport,lucky:renderLucky})[p]?.()}
 enhancePage(p);showPostNotifications();
}
function enhancePage(p){
 document.querySelectorAll('a[href="power-teams.html"]').forEach(a=>{a.href='members.html';a.textContent='Hội viên & Power Team'});
 if(['admin','departments'].includes(p)){let side=q('.sidebar');side?.insertAdjacentHTML('beforeend',`<div class="side-group"><a class="side-link" href="reports.html">Báo cáo & xuất Excel</a><a class="side-link" href="settings.html">Cài đặt website</a><a class="side-link" href="member-portal.html">Hồ sơ của tôi</a><a class="side-link" href="index.html">Website công khai</a><button class="side-link" onclick="logout()">Đăng xuất</button></div>`)}
 if(p==='meeting'){(q('main')||q('.hero>.container'))?.insertAdjacentHTML('beforeend',`<section class="panel"><h3>Mã QR buổi họp</h3><div id="meetingQR"></div>${canLead()?button('In mã QR','printMeetingQR()'):''}</section>`);renderQR('meetingQR',activeMeeting());qa('a[href="checkin.html"],a[href="opportunity.html"],a[href="guest-register.html"]').forEach(a=>a.href+='?meeting='+encodeURIComponent(activeMeeting().id))}
 if(p==='checkin'){q('#guestChapter').outerHTML=`<select id="guestChapter">${opts([['','Chọn Chapter'],...Array.from({length:23},(_,i)=>[i+1,'Chapter '+(i+1)]),...S.config.chapters.filter(n=>n>23).map(n=>[n,'Chapter '+n])])}</select>`;q('#memberCheckinBox').insertAdjacentHTML('beforeend',field('checkinPhoto','Ảnh hiện diện tại buổi họp *','','file','accept="image/png,image/jpeg,image/webp" capture="user"'));}
 if(p==='opportunity'){q('#giverId').insertAdjacentHTML('afterend','<small id="giverPhone"></small>');q('#giverId').addEventListener('change',()=>q('#giverPhone').textContent=S.members.find(m=>m.id===val('giverId'))?.phone||'')}
 if(p==='lucky')enhanceLucky();
 if(p==='admin'){q('#section-settings')?.insertAdjacentHTML('afterbegin','<a class="btn btn-wine" href="settings.html">Logo, nội dung, nhân sự & cấu hình</a>');q('#section-reports')?.insertAdjacentHTML('afterbegin','<a class="btn btn-wine" href="reports.html">Báo cáo chi tiết, Excel & in PDF</a>');q('#section-finance')?.insertAdjacentHTML('afterbegin','<a class="btn btn-wine" href="finance.html">Sổ quỹ, công nợ & tài trợ</a>')}
 if(currentUser())document.body.insertAdjacentHTML('beforeend','<div class="storage-note">Bản chạy thử trên máy này · Dữ liệu chưa đồng bộ máy chủ</div>');
}
window.printMeetingQR=()=>{const m=activeMeeting();openModal('In mã QR',`<div class="print-document qr-poster"><div class="poster-logos">${logoHTML('left')}${logoHTML('right')}</div><h2>${esc(m.name)}</h2><p>${fmtDate(m.date)} · ${esc(m.time)} · ${esc(m.location)}</p><div id="printQR"></div><h3>Quét mã để điểm danh và trao cơ hội</h3><p>VBNA Chapter 11</p></div>${button('In / Lưu PDF','window.print()')}`);renderQR('printQR',m)};
function renderQR(id,m){let el=q('#'+id);if(!el)return;let code=qrcode(0,'M');code.addData('https://'+S.config.domain+'/meeting.html?meeting='+encodeURIComponent(m.id));code.make();el.innerHTML=code.createSvgTag(6,24)}
