import base64, os

docs_path = 'public/documents/divya-villas'

images = {
    'bankAccount':  'Divya Villas Bank Account.jpeg',
    'road1':        '1 Road.jpeg',
    'road2':        '2 Road.jpeg',
    'road3':        '3 Road.jpeg',
    'site1':        '4 Site.jpeg',
    'site2':        '5 Site.jpeg',
    'road4':        '6 Road.jpeg',
    'site3':        '7 Site.jpeg',
    'drain':        '8 Udrain.jpeg',
    'layout1':      '9 Layout.jpeg',
    'park':         '10 Park.jpeg',
    'layout2':      '11 Layout.jpeg',
    'borewell':     '12 Borewell.jpeg',
    'streetLight':  '13 Street light.jpeg',
}

lines = []
lines.append('// @ts-nocheck')
lines.append('// Divya Villas images — base64 encoded from real files')
lines.append('')
lines.append('export const divyaVillasImages: Record<string, string> = {')

for key, filename in images.items():
    path = os.path.join(docs_path, filename)
    if os.path.exists(path):
        with open(path, 'rb') as f:
            data = base64.b64encode(f.read()).decode('utf-8')
        lines.append('  ' + key + ': "data:image/jpeg;base64,' + data + '",')
        print('OK ' + key + ': ' + str(len(data)//1024) + 'KB')
    else:
        print('MISSING: ' + filename)

lines.append('}')
lines.append('')
lines.append('export function openImage(key, filename) {')
lines.append('  const dataUrl = divyaVillasImages[key]')
lines.append('  if (!dataUrl) { alert("Image not found: " + key); return }')
lines.append('  const win = window.open()')
lines.append('  if (win) {')
lines.append('    win.document.write("<img src=" + dataUrl + " style=max-width:100%;height:auto; />")')
lines.append('    win.document.title = filename')
lines.append('  }')
lines.append('}')

with open('lib/divya-villas-images.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Done — lib/divya-villas-images.ts regenerated from real images')