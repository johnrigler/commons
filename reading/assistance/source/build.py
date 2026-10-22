"""Optional publication tool: Python 3 + reportlab; readers need neither.

Numbered HTML parts supply the text for both artifacts. PHP remains the HTML
assembler; this fallback expands only its literal local readfile instructions.
It never evaluates PHP or loads network content. Existing CID files are checked.
"""
from pathlib import Path
import base64
import hashlib
import json
import re
import xml.etree.ElementTree as ET
from html import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, PageBreak
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter

HERE = Path(__file__).resolve().parent
OUT = HERE.parent

def cid(data):
    if len(data) > 1024 * 1024:
        raise ValueError('Raw CID profile is limited to 1 MiB')
    return 'b' + base64.b32encode(b'\x01\x55\x12\x20' + hashlib.sha256(data).digest()).decode().lower().rstrip('=')

def raw(path):
    return path.read_bytes().decode('utf-8')

def expand(match):
    name = match.group(1)
    if Path(name).name != name:
        raise ValueError('Only source-directory files are allowed')
    return raw(HERE / name)

html = re.sub(r"<\?php readfile\(__DIR__ \. '/([^']+)'\); \?>", expand, raw(HERE / 'page.php'))
if '<?' in html:
    raise ValueError('Unexpected PHP instruction')
data = html.encode('utf-8')
snapshot = OUT / (cid(data) + '.html')
if snapshot.exists() and snapshot.read_bytes() != data:
    raise ValueError('CID snapshot already exists with different bytes')
snapshot.write_bytes(data)
# Move the selector, never write through it into a previous edition.
selector = OUT / 'index.html'
if selector.exists() and not selector.is_symlink():
    raise ValueError('Refusing to replace a real index.html')
temporary = OUT / '.index-next'
temporary.unlink(missing_ok=True)
temporary.symlink_to(snapshot.name)
temporary.replace(selector)

ink = HexColor('#242624')
accent = HexColor('#86503c')
styles = {
    'eyebrow': ParagraphStyle('eyebrow', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=accent, spaceAfter=16),
    'h1': ParagraphStyle('h1', fontName='Times-Roman', fontSize=27, leading=29, textColor=ink, spaceAfter=12),
    'deck': ParagraphStyle('deck', fontName='Times-Roman', fontSize=13, leading=17, textColor=ink, spaceAfter=18),
    'h2': ParagraphStyle('h2', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=ink, spaceBefore=9, spaceAfter=5, keepWithNext=True),
    'p': ParagraphStyle('p', fontName='Times-Roman', fontSize=10.5, leading=14, textColor=ink, spaceAfter=8),
    'field': ParagraphStyle('field', fontName='Helvetica', fontSize=9, leading=15, textColor=ink, spaceAfter=7),
    'small': ParagraphStyle('small', fontName='Helvetica', fontSize=8.1, leading=10.7, textColor=ink, spaceAfter=8),
}
story = []
parts = sorted(HERE.glob('1_*.html'))
for number, part in enumerate(parts):
    if number:
        story.append(PageBreak())
    root = ET.fromstring(raw(part))
    for node in root.iter():
        if node.tag not in ('p', 'h1', 'h2'):
            continue
        text = ' '.join(''.join(node.itertext()).split())
        key = node.get('class', node.tag)
        story.append(Paragraph(escape(text), styles[key]))

def footer(c, doc):
    c.setStrokeColor(HexColor('#cdd0c7'))
    c.line(47, 43, 565, 43)
    c.setFillColor(HexColor('#60655f'))
    c.setFont('Helvetica', 8)
    c.drawString(47, 29, 'John Rigler / Commons / Unsigned draft / 21 October 2026')
    c.drawRightString(565, 29, str(doc.page))

pdf = OUT / 'Commons-Preparation-and-Assistance.pdf'
doc = SimpleDocTemplate(str(pdf), pagesize=letter, leftMargin=47, rightMargin=47,
                        topMargin=43, bottomMargin=56, title='Commons - Preparation and Assistance',
                        author='John Rigler', pageCompression=1)
def deterministic_canvas(*args, **kwargs):
    kwargs['invariant'] = 1
    return canvas.Canvas(*args, **kwargs)

doc.build(story, onFirstPage=footer, onLaterPages=footer,
          canvasmaker=deterministic_canvas)

artifacts = []
for path, media in [(snapshot, 'text/html'), (pdf, 'application/pdf')]:
    content = path.read_bytes()
    artifacts.append({'path': path.name, 'media_type': media, 'sha256': hashlib.sha256(content).hexdigest(), 'cid': cid(content)})
metadata = {
    'title': 'Commons - Preparation and Assistance',
    'author': 'John Rigler', 'date': '2026-10-21',
    'status': 'Unsigned draft implementing conversation direction; no independent legal review recorded',
    'scope': 'Self-service walkthrough, optional private credit-correspondence record, and independent foundations with traffic and VA case branches',
    'pdf_expected_pages': 3,
    'pdf_method': 'ReportLab typesetting of the same numbered HTML text; not a Chrome print export',
    'artifacts': artifacts,
    'publication': 'GitHub publication only; no submission, signature, IPFS pin or ledger transaction claimed',
    'sources': [
        'https://www.consumerfinance.gov/complaint/submitting-a-complaint-on-behalf-of-a-consumer/',
        'https://www.azcourts.gov/DefensiveDriving/FAQ',
        'https://www.azcourts.gov/drive/cost-to-attend-school',
        'https://www.azcourts.gov/drive/court-information',
        'https://www.va.gov/decision-reviews/',
        'https://www.va.gov/resources/va-accredited-representative-faqs/'
    ],
    'sources_checked': '2026-10-21'
}
(OUT / 'edition.json').write_text(json.dumps(metadata, indent=2) + '\n')
print(json.dumps({'html': snapshot.name, 'pdf': pdf.name}))
