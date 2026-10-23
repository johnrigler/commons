"""Build only the canonical blank PDF. Never accepts consumer data or a signing key.

Python 3 + ReportLab are publication dependencies, not reader dependencies.
Text comes from the numbered HTML parts; blank spaces are drawn as rules.
"""
from pathlib import Path
import base64
import hashlib
import json
import xml.etree.ElementTree as ET
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from html import escape

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
AUTHOR = 'LcudkPQzLuuqsnzHSmJ7iLREaHStvPKRVb'
FONTS = Path('/usr/share/fonts/truetype/dejavu')
for name, filename in [('Body', 'DejaVuSerif.ttf'), ('Body-Bold', 'DejaVuSerif-Bold.ttf'),
                       ('Sans', 'DejaVuSans.ttf'), ('Sans-Bold', 'DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / filename)))
pdfmetrics.registerFontFamily('Body', normal='Body', bold='Body-Bold')
pdfmetrics.registerFontFamily('Sans', normal='Sans', bold='Sans-Bold')
roots = [ET.fromstring((HERE / name).read_text()) for name in ['1_30-letter.html', '1_40-request.html']]
nodes = {node.get('id'): node for root in roots for node in root.iter() if node.get('id')}

def inline(node):
    value = escape(node.text or '')
    for child in node:
        content = inline(child)
        value += '<b>' + content + '</b>' if child.tag == 'strong' else content
        value += escape(child.tail or '')
    return value

ink, muted, rule = HexColor('#17241c'), HexColor('#586354'), HexColor('#a8afa4')
styles = {
    'body': ParagraphStyle('body', fontName='Body', fontSize=9.7, leading=13.1, textColor=ink),
    'small': ParagraphStyle('small', fontName='Sans', fontSize=8.1, leading=10.6, textColor=ink),
    'heading': ParagraphStyle('heading', fontName='Sans-Bold', fontSize=10, leading=13, textColor=ink),
}

temporary = OUT / '.blank-edition.pdf'
c = canvas.Canvas(str(temporary), pagesize=(612, 792), invariant=1, pageCompression=1)
c.setTitle('Experian correction form — blank Commons edition')
c.setAuthor(AUTHOR)
c.setSubject('Reusable blank template; author signature and IPFS pin pending; consumer fields unfilled')
y = 752

def paragraph(text, style='body', width=526, x=43, gap=8):
    global y
    p = Paragraph(text, styles[style])
    _, height = p.wrap(width, 720)
    if y - height < 58:
        raise ValueError(f'Content exceeds two-page layout at {text[:70]}')
    p.drawOn(c, x, y - height)
    y -= height + gap

def heading(text):
    global y
    y -= 4
    paragraph(text, 'heading', gap=4)

def line(label, x, top, width, font=9):
    c.setFillColor(ink); c.setFont('Sans', font)
    c.drawString(x, top - 10, label)
    start = x + pdfmetrics.stringWidth(label, 'Sans', font) + 6
    c.setStrokeColor(rule); c.setLineWidth(.5)
    c.line(start, top - 13, x + width, top - 13)

def writing(lines):
    global y
    c.setStrokeColor(rule); c.setLineWidth(.5)
    for _ in range(lines):
        y -= 20
        c.line(43, y + 2, 569, y + 2)
    y -= 3

def start(title, eyebrow):
    global y
    y = 752
    c.setFillColor(muted); c.setFont('Sans-Bold', 8)
    c.drawString(43, y, eyebrow.upper())
    y -= 34
    c.setFillColor(ink); c.setFont('Body-Bold', 24)
    c.drawString(43, y, title)
    y -= 19

def footer(page):
    c.setStrokeColor(rule); c.setLineWidth(.5); c.line(43, 45, 569, 45)
    c.setFont('Sans', 7.1); c.setFillColor(muted)
    c.drawString(43, 31, 'Commons · Experian correction form · 23 October 2026')
    c.drawRightString(569, 31, f'{page} of 2')

start('Experian dispute', 'Request to correct credit reporting')
top = y
for i, label in enumerate(['Consumer 1:', 'Consumer 2 (optional):', 'Date:']):
    line(label, 43, top - i * 22, 312)
p = Paragraph('Experian · Dispute by Mail<br/>P.O. Box 4500<br/>Allen, TX 75013', styles['body'])
_, h = p.wrap(185, 100); p.drawOn(c, 384, top - h)
y -= 73
paragraph('Return addresses and identification are on separate enclosed sheets.', 'small', gap=8)
for label in ['Reporting company / collector:', 'Original creditor / property:']:
    line(label, 43, y, 526); y -= 22
line('Account reference:', 43, y, 310)
line('Reported balance:', 370, y, 199); y -= 22
line('Report date / dispute reference:', 43, y, 526); y -= 25
paragraph(inline(nodes['opening']))
heading('The specific error and supporting facts'); writing(3)
heading('The correction requested'); writing(2)
heading('Disputed charges or adjustments (if applicable)')
table = Table([['Charge / entry', 'Amount', 'Missing support or correction needed'], ['', '', ''], ['', '', ''], ['', '', '']],
              colWidths=[152, 95, 279], rowHeights=[21, 36, 36, 36])
table.setStyle(TableStyle([
    ('FONTNAME', (0,0), (-1,-1), 'Sans'), ('FONTNAME', (0,0), (-1,0), 'Sans-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 8), ('BACKGROUND', (0,0), (-1,0), HexColor('#eef2eb')),
    ('TEXTCOLOR', (0,0), (-1,-1), ink), ('GRID', (0,0), (-1,-1), .5, rule),
    ('VALIGN', (0,0), (-1,-1), 'TOP'), ('TOPPADDING', (0,0), (-1,-1), 6),
]))
table.wrapOn(c,526,200); table.drawOn(c,43,y-129); y -= 141
paragraph('Optional statement — check only if true: ☐', 'small', gap=4)
paragraph(inline(nodes['fraud-text']), 'small', gap=0)
footer(1); c.showPage()

start('Review the written dispute', 'Request for a substantive written result')
for i in range(1,5):
    paragraph(f'<b>{i}.</b> ' + inline(nodes[f'request{i}']), gap=9)
heading('Earlier requests / completed result, if any'); writing(2)
paragraph(inline(nodes['correspondence']), gap=11)
signature_top = y
for x, label in [(43,'Consumer 1'), (320,'Consumer 2 (optional)')]:
    c.setFillColor(ink); c.setFont('Sans-Bold',9); c.drawString(x,signature_top,label)
    c.setStrokeColor(rule); c.line(x,signature_top-31,x+249,signature_top-31)
    c.setFont('Sans',8); c.drawString(x,signature_top-43,'Signature')
    line('Printed name:',x,signature_top-50,249,8)
    line('Date:',x,signature_top-73,249,8)
y -= 102
heading('Enclosures')
paragraph(inline(nodes['enclosure-note']),'small',gap=0); writing(2)
paragraph(inline(nodes['legal-reference']),'small',gap=0)
footer(2); c.save()

data = temporary.read_bytes()
if len(data) > 1024 * 1024:
    raise ValueError('PDF exceeds the Commons single raw-block limit')
digest = hashlib.sha256(data).digest()
cid = 'b' + base64.b32encode(b'\x01\x55\x12\x20' + digest).decode().lower().rstrip('=')
snapshot = OUT / (cid + '.pdf')
if snapshot.exists() and snapshot.read_bytes() != data:
    raise ValueError('Refusing to alter a CID-named edition')
if not snapshot.exists():
    temporary.replace(snapshot)
else:
    temporary.unlink()
selector = OUT / 'Experian-Correction-Blank.pdf'
if selector.exists() and not selector.is_symlink():
    raise ValueError('Refusing to overwrite a non-selector PDF')
link = OUT / '.blank-next'
link.unlink(missing_ok=True); link.symlink_to(snapshot.name); link.replace(selector)
reference = {'media_type':'application/pdf','path':snapshot.name,'cid':cid,'sha256':digest.hex(),
             'bytes':len(data),'pages':2,'consumer_fields':'blank','template_author':AUTHOR,
             'author_signature':{'status':'pending','verified':False,'certificate_fingerprint':None},
             'ipfs':{'uri':'ipfs://'+cid,'status':'not-pinned','receipt':None}}
(HERE/'pdf-reference.json').write_text(json.dumps(reference,indent=2)+'\n')
print(json.dumps(reference,indent=2))
