/* Grouped VBNA directory. Existing records and uploaded logo files are retained. */
function migrateVbnaGroups(){
 let changed=false;
 if(!Array.isArray(S.vbnaGroups)){S.vbnaGroups=['HĐSL','HĐTV','Chủ tịch Chapter','LT Chapter'].map((name,i)=>({id:'VBNA-G'+(i+1),name}));changed=true}
 for(const p of S.vbnaPeople){
  if(!S.vbnaGroups.some(g=>g.id===p.groupId)){
   const name=p.group||'Cần cập nhật nhóm';let g=S.vbnaGroups.find(g=>g.name===name);
   if(!g){g={id:uid('VG'),name};S.vbnaGroups.push(g)}p.groupId=g.id;p.group=g.name;changed=true;
  }
  if(p.position===undefined){p.position=p.department||'';changed=true}
 }
 if(changed)save();
}
migrateVbnaGroups();
renderVbnaPeople=function(){
 const el=q('#section-vbna-people');if(!el||!canLead())return;
 el.innerHTML=`<div class="toolbar"><div><h2>Danh mục VBNA</h2><p>Chọn nhóm để thêm hội viên hoặc người mới.</p></div>${button('+ Tạo nhóm','createVbnaGroup()')}</div><div class="vbna-groups">${S.vbnaGroups.map(g=>{const people=S.vbnaPeople.filter(p=>p.groupId===g.id);return `<section class="panel"><div class="toolbar"><div><h3>${esc(g.name)}</h3><span class="small-text">${people.length} người</span></div>${button('+ Thêm vào nhóm',`addExternalPerson('${g.id}')`,'btn-outline')}</div>${table(['Họ tên / Liên hệ','Chức danh','Chapter','Doanh nghiệp',''],people.map(p=>[`<b>${esc(p.fullName)}</b><br><small>${esc(p.phone)}${p.email?' · '+esc(p.email):''}</small>`,p.position?esc(p.position):'<span class="chip gold">Cần cập nhật chức danh</span>',esc(p.chapter),esc(p.company),button('Sửa',`editVbnaPerson('${p.id}')`,'btn-outline btn-sm')]))}</section>`}).join('')}</div>`;
};
window.createVbnaGroup=()=>{if(!canLead())return toast('Chỉ Chủ tịch / Admin được tạo nhóm');openModal('Tạo nhóm VBNA',`<form onsubmit="saveVbnaGroup(event)">${field('vgName','Tên nhóm','','text','required maxlength="100"')}<div class="form-actions"><button class="btn btn-wine">Tạo nhóm</button></div></form>`)};
window.saveVbnaGroup=e=>{e.preventDefault();if(!canLead())return;const name=val('vgName').replace(/\s+/g,' ');if(!name)return toast('Vui lòng nhập tên nhóm');if(S.vbnaGroups.some(g=>g.name.toLocaleLowerCase('vi')===name.toLocaleLowerCase('vi')))return toast('Tên nhóm đã tồn tại');S.vbnaGroups.push({id:uid('VG'),name});save();log('Tạo nhóm VBNA','VbnaGroup',name);closeModal();renderVbnaPeople();toast('Đã tạo nhóm','success')};
window.addExternalPerson=groupId=>{if(!canLead())return;if(!S.vbnaGroups.some(g=>g.id===groupId))return toast('Vui lòng bấm Thêm vào nhóm tại nhóm cần bổ sung');vbnaPersonForm(groupId)};
window.editVbnaPerson=id=>{if(!canLead())return;const p=S.vbnaPeople.find(p=>p.id===id);if(p)vbnaPersonForm(p.groupId,p)};
function vbnaPersonForm(groupId,p=null){
 const g=S.vbnaGroups.find(g=>g.id===groupId);if(!g)return;
 openModal(p?'Sửa thông tin trong nhóm':'Thêm vào '+g.name,`<form onsubmit="saveExternalPerson(event,'${p?.id||''}')"><div class="form-grid">${select('epGroupId','Nhóm bắt buộc',S.vbnaGroups.map(g=>[g.id,g.name]),groupId)}${select('epMemberId','Chọn hội viên có sẵn (hoặc nhập người mới)',[['','Nhập người mới'],...actives().map(m=>[m.id,m.fullName])],p?.memberId||'')}${field('epName','Họ tên *',p?.fullName||'','text','required')}${field('epPosition','Chức danh trong nhóm *',p?.position||'','text','required maxlength="150"')}${field('epPhone','Số điện thoại *',p?.phone||'','tel','required')}${field('epEmail','Email',p?.email||'','email')}${field('epChapter','Chapter',p?.chapter||'')}${field('epCompany','Doanh nghiệp',p?.company||'')}${field('epIndustry','Ngành nghề',p?.industry||'')}</div><div class="form-actions"><button class="btn btn-wine">Lưu vào nhóm</button></div></form>`);
 q('#epGroupId').required=true;q('#epMemberId').onchange=()=>{const m=S.members.find(m=>m.id===val('epMemberId'));if(!m)return;for(const [id,key]of [['epName','fullName'],['epPhone','phone'],['epEmail','email'],['epCompany','company'],['epIndustry','industry']])q('#'+id).value=m[key]||'';q('#epChapter').value='11';};
}
window.saveExternalPerson=(e,id='')=>{
 e.preventDefault();if(!canLead())return;
 const group=S.vbnaGroups.find(g=>g.id===val('epGroupId')),position=val('epPosition'),name=val('epName'),phone=val('epPhone'),memberId=val('epMemberId');
 if(!group)return toast('Phải chọn một nhóm đã tạo');if(!position)return toast('Vui lòng nhập chức danh cụ thể trong nhóm');if(!name||!phone)return toast('Nhập họ tên và số điện thoại');
 const existing=id?S.vbnaPeople.find(p=>p.id===id):null;if(id&&!existing)return;
 const canonicalPhone=phone.replace(/\D/g,'');
 if(S.vbnaPeople.some(p=>p.id!==id&&p.groupId===group.id&&((memberId&&p.memberId===memberId)||(canonicalPhone&&(p.phone||'').replace(/\D/g,'')===canonicalPhone))))return toast('Người này đã có trong nhóm. Hãy sửa thông tin hiện có.');
 const before=existing?structuredClone(existing):null;
 const record={...(existing||{}),id:existing?.id||uid('P'),groupId:group.id,group:group.name,position,memberId:memberId||null,fullName:normalizeName(name),phone,email:val('epEmail'),chapter:val('epChapter'),company:val('epCompany'),industry:val('epIndustry')};
 if(existing)Object.assign(existing,record);else S.vbnaPeople.push(record);
 auditChange(existing?'Sửa người trong nhóm VBNA':'Thêm người vào nhóm VBNA','VbnaPerson',before,record);closeModal();renderVbnaPeople();toast('Đã lưu vào '+group.name,'success');
};
function syncChapterLogos(){
 const src=imageSrc(S.config.site.leftLogo);if(!src)return;
 qa('.logo-mark').filter(el=>el.textContent.trim()==='C11').forEach(el=>{const im=document.createElement('img');im.className='chapter-logo';im.alt='Logo Chapter 11';im.src=src;el.replaceWith(im)});
 qa('img.chapter-logo').forEach(im=>im.src=src);
}
const bootBeforeDirectory=bootV6;bootV6=function(){bootBeforeDirectory();syncChapterLogos()};
const saveBeforeChapterLogo=window.saveSiteSettings;window.saveSiteSettings=async e=>{await saveBeforeChapterLogo(e);syncChapterLogos()};
