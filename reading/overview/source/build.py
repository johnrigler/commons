"""Build the reading edition from numbered HTML parts (optional authoring tool).

Requires Python 3 and ReportLab. Readers open the completed HTML or PDF.
Set COMMONS_FONT_DIR if the four DejaVu TTF files live elsewhere.
The HTML fallback expands literal local readfile calls; it does not execute PHP.
"""
from pathlib import Path
import base64
import hashlib
import json
import os
import re
import xml.etree.ElementTree as ET
from html import escape
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
FONT_DIR = Path(os.environ.get('COMMONS_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
for name, file in [('ReadingSerif','DejaVuSerif.ttf'), ('ReadingSerifBold','DejaVuSerif-Bold.ttf'),
                   ('ReadingSans','DejaVuSans.ttf'), ('ReadingSansBold','DejaVuSans-Bold.ttf')]:
    if not (FONT_DIR / file).is_file():
        raise RuntimeError('Set COMMONS_FONT_DIR to a directory containing the DejaVu Serif/Sans regular and bold TTF files')
    pdfmetrics.registerFont(TTFont(name, str(FONT_DIR / file)))

def cid(content):
    if len(content) > 1024 * 1024:
        raise ValueError('Raw CID profile is limited to 1 MiB')
    return 'b' + base64.b32encode(b'\x01\x55\x12\x20' + hashlib.sha256(content).digest()).decode().lower().rstrip('=')

def raw(path):
    return path.read_bytes().decode('utf-8')

def expand(match):
    name = match.group(1)
    if Path(name).name != name:
        raise ValueError('Only local source filenames are allowed')
    return raw(HERE / name)

html = re.sub(r"<\?php readfile\(__DIR__ \. '/([^']+)'\); \?>", expand, raw(HERE / 'page.php'))
if '<?' in html:
    raise ValueError('Unexpected PHP instruction')
html_bytes = html.encode('utf-8')
snapshot = OUT / (cid(html_bytes) + '.html')
if snapshot.exists() and snapshot.read_bytes() != html_bytes:
    raise ValueError('Refusing to overwrite a mismatched CID snapshot')
if not snapshot.exists():
    snapshot.write_bytes(html_bytes)

ink, accent, muted, rule = [HexColor(c) for c in ['#242624','#86503c','#5a6058','#d2d4c9']]
styles = {
    'eyebrow': ParagraphStyle('eyebrow', fontName='ReadingSansBold', fontSize=8, leading=11, textColor=accent, spaceAfter=16),
    'h1': ParagraphStyle('h1', fontName='ReadingSerif', fontSize=26, leading=29, textColor=ink, spaceAfter=13),
    'deck': ParagraphStyle('deck', fontName='ReadingSerif', fontSize=12.5, leading=17, textColor=muted, spaceAfter=18),
    'h2': ParagraphStyle('h2', fontName='ReadingSansBold', fontSize=10, leading=13, textColor=ink, spaceBefore=10, spaceAfter=6, keepWithNext=True),
    'p': ParagraphStyle('p', fontName='ReadingSerif', fontSize=10.2, leading=14, textColor=ink, spaceAfter=9),
    'small': ParagraphStyle('small', fontName='ReadingSans', fontSize=7.8, leading=10.5, textColor=muted, spaceAfter=8),
    'review': ParagraphStyle('review', fontName='ReadingSans', fontSize=9, leading=12.5, textColor=accent, borderColor=rule, borderWidth=.5, borderPadding=10, spaceBefore=12, spaceAfter=6),
    'td': ParagraphStyle('td', fontName='ReadingSans', fontSize=8.5, leading=11.5, textColor=ink),
    'th': ParagraphStyle('th', fontName='ReadingSansBold', fontSize=8.5, leading=11.5, textColor=ink),
}

def inline(node):
    result = escape(node.text or '')
    for child in node:
        inner = inline(child)
        if child.tag == 'a':
            result += '<link href="' + escape(child.get('href',''), quote=True) + '" color="#77432f">' + inner + '</link>'
        else:
            result += inner
        result += escape(child.tail or '')
    return result

parts = sorted(HERE.glob('1_*.html'))
if len(parts) != 6:
    raise ValueError('Expected six reading articles')
story = []
def add(node):
    if node.tag == 'header':
        for child in node:
            add(child)
    elif node.tag in ('p','h1','h2'):
        story.append(Paragraph(inline(node), styles[node.get('class',node.tag)]))
    elif node.tag == 'table':
        rows = [[Paragraph(inline(cell), styles[cell.tag]) for cell in row] for row in node.iter('tr')]
        table = Table(rows, colWidths=[112,194,212], hAlign='LEFT', repeatRows=1, spaceBefore=8, spaceAfter=14)
        table.setStyle(TableStyle([
            ('BACKGROUND',(0,0),(-1,0),HexColor('#f0f0e8')),
            ('VALIGN',(0,0),(-1,-1),'TOP'),
            ('LINEBELOW',(0,0),(-1,-1),.5,rule),
            ('LEFTPADDING',(0,0),(-1,-1),8), ('RIGHTPADDING',(0,0),(-1,-1),8),
            ('TOPPADDING',(0,0),(-1,-1),8), ('BOTTOMPADDING',(0,0),(-1,-1),8)
        ]))
        story.append(table)

for number, part in enumerate(parts):
    if number:
        story.append(PageBreak())
    for child in ET.fromstring(raw(part)):
        add(child)

def footer(c, doc):
    c.setStrokeColor(rule)
    c.line(47, 42, 565, 42)
    c.setFillColor(muted)
    c.setFont('ReadingSans',7.5)
    c.drawString(47,28,'John Rigler / Commons / Draft for review / 21 October 2026')
    c.drawRightString(565,28,str(doc.page) + ' / 6')

def deterministic_canvas(*args, **kwargs):
    kwargs['invariant'] = 1
    return canvas.Canvas(*args, **kwargs)

pdf = OUT / 'Commons-Overview-and-Review.pdf'
doc = SimpleDocTemplate(str(pdf), pagesize=letter, leftMargin=47, rightMargin=47, topMargin=43, bottomMargin=56,
                        title='Commons - Overview and Review', author='John Rigler', pageCompression=1)
doc.build(story, onFirstPage=footer, onLaterPages=footer, canvasmaker=deterministic_canvas)
if doc.page != len(parts):
    raise ValueError('Each article must fit one page; review the PDF layout before publishing')

# Update the selector after artifact creation; never redirect output through it.
selector, temporary = OUT / 'index.html', OUT / '.index-next'
if selector.exists() and not selector.is_symlink():
    raise ValueError('Refusing to overwrite a real index.html')
temporary.unlink(missing_ok=True)
temporary.symlink_to(snapshot.name)
temporary.replace(selector)

artifacts = []
for path, media in [(snapshot,'text/html'),(pdf,'application/pdf')]:
    content = path.read_bytes()
    artifacts.append({'path':path.name,'media_type':media,'sha256':hashlib.sha256(content).hexdigest(),'cid':cid(content)})
metadata = {
    'title':'Commons - Overview and Review', 'author':'John Rigler', 'date':'2026-10-21',
    'status':'New unsigned editorial draft for author review; AI-assisted from the conversation and current project notes',
    'scope':'Six short articles explaining the open stream, article relationships, comparison of processes, internet of value, scribes and paid services',
    'pdf_expected_pages':6,
    'pdf_method':'Independent ReportLab typesetting from the same numbered HTML text; not a Chrome print export',
    'pdf_fonts':'DejaVu Serif/Sans regular and bold, embedded',
    'artifacts':artifacts,
    'base_commons_commit':'f396fdb7a508ee9a05aa58b3db4be200d55397de',
    'publication':'Repository reading edition; no signature, IPFS pin, chain transaction, dispatch or court approval claimed',
    'references':[
        'https://www.va.gov/decision-reviews/',
        'https://bitcoin.org/bitcoin.pdf',
        'https://github.com/bitcoin/bitcoin/blob/master/src/kernel/chainparams.cpp',
        'https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_1_competence/comment_on_rule_1_1/',
        'https://www.uscourts.gov/sites/default/files/document/federal-rules-of-evidence.pdf'
    ],
    'reference_basis':'Primary sources checked earlier in the October 21, 2026 conversation; case examples do not prescribe filing procedures'
}
(OUT/'edition.json').write_text(json.dumps(metadata,indent=2)+'\n')
print(json.dumps({'html':snapshot.name,'pdf':pdf.name}))
