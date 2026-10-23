"""Record an already-built unsigned blank edition; never claims a signature or pin."""
from pathlib import Path
import base64
import hashlib
import json

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
ROOT = OUT.parent.parent
reference = json.loads((HERE/'pdf-reference.json').read_text())
html = OUT/'index.html'
data = html.read_bytes()
cid = 'b' + base64.b32encode(b'\x01\x55\x12\x20'+hashlib.sha256(data).digest()).decode().lower().rstrip('=')
if html.resolve().name != cid+'.html':
    raise ValueError('Publish HTML through sb.publish before recording the edition')
manifest = {
    'schema':'commons/blank-form-edition/1','title':'Experian correction form',
    'date':'2026-10-23','author':reference['template_author'],
    'status':'Unsigned reusable blank template; author signature and IPFS pin pending',
    'scope':'Written accuracy/completeness dispute for one or two consumers; private evidence excluded',
    'canonical_record':'blank_pdf','consumer_fields':'blank',
    'pdf_expected_pages':2,'pdf_method':'ReportLab typesetting from numbered HTML text with drawn handwriting rules',
    'author_signature':reference['author_signature'],'ipfs':reference['ipfs'],
    'artifacts':[
        {key:reference[key] for key in ['path','media_type','sha256','cid','bytes','pages']},
        {'path':cid+'.html','media_type':'text/html','sha256':hashlib.sha256(data).hexdigest(),'cid':cid,'bytes':len(data)}
    ],
    'private_copy':{'storage':'Current tab DOM only','submission':False,'canonical_pdf_unchanged':True},
    'publication':'GitHub Pages edition; no signature, IPFS pin, ledger announcement or consumer submission claimed',
    'intended_final_record':'Author-signed PDF with consumer fields blank, identified by a new CID after signing',
    'sources_checked':'2026-10-23',
    'sources':['https://uscode.house.gov/us/usc/119-120/t15/s1681i/','https://www.experian.com/help/dispute-credit'],
    'review':'AI-assisted adaptation; independent legal review not recorded'
}
serialized = (json.dumps(manifest,indent=2)+'\n').encode()
manifest_cid = 'b'+base64.b32encode(b'\x01\x55\x12\x20'+hashlib.sha256(serialized).digest()).decode().lower().rstrip('=')
snapshot = OUT/(manifest_cid+'.json')
if snapshot.exists() and snapshot.read_bytes()!=serialized:
    raise ValueError('Refusing to alter a CID-named manifest')
if not snapshot.exists(): snapshot.write_bytes(serialized)
(OUT/'edition.json').write_bytes(serialized)
catalog_path = ROOT/'portal.json'
catalog = json.loads(catalog_path.read_text())
item = {
    'id':'experian-correction-form','kind':'description','genre':'template',
    'title':'Experian correction form',
    'summary':'A blank two-page correction request to print by hand or fill privately in the browser. The public PDF stays blank.',
    'cid':cid,'path':'reading/experian-form/'+cid+'.html','fragment':'experian-correction-form',
    'pdf':'reading/experian-form/'+reference['path'],'author':reference['template_author'],
    'status':manifest['status'],'sources_checked':'2026-10-23','indexed':True,
    'related':['dispute-referral-loop','request','credit-reporting','rent-acceleration','prepare'],
    'companies':['company-experian'],'topics':['Housing & credit','Commons practice']
}
catalog['items'] = [item]+[old for old in catalog['items'] if old['id']!=item['id']]
for old in catalog['items']:
    if old['id'] in ['dispute-referral-loop','request','prepare','company-experian'] and item['id'] not in old['related']:
        old['related'].append(item['id'])
catalog_path.write_text(json.dumps(catalog,indent=2)+'\n')
print(json.dumps({'pdf':reference['cid'],'html':cid,'manifest':manifest_cid},indent=2))
