# USDZ (UsdPreviewSurface) -> GLB, conservando piezas y materiales por nombre.
#
# Uso (requiere: pip install usd-core trimesh numpy pillow):
#   python scripts/usdz-a-glb.py modelo.usdz crudo.glb
#   npx @gltf-transform/cli optimize crudo.glb public/models/celular.glb \
#     --texture-compress webp --texture-size 1024 --compress meshopt \
#     --simplify false --join false --instance false --flatten false --palette false
#
# Así se generó public/models/celular.glb (23,5 MB → 2,2 MB).
import io, sys, zipfile
import numpy as np
import trimesh
from PIL import Image
from pxr import Usd, UsdGeom, UsdShade, Gf

src, dst = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(src)
st = Usd.Stage.Open(src)
mpu = UsdGeom.GetStageMetersPerUnit(st)

def tex_img(shader_input):
    if not shader_input or not shader_input.HasConnectedSource():
        return None
    s, _, _ = shader_input.GetConnectedSource()
    f = UsdShade.Shader(s.GetPrim()).GetInput('file').Get()
    if f is None:
        return None
    img = Image.open(io.BytesIO(z.read(f.path)))
    img.load()
    return img

mats = {}
def material(prim):
    m, _ = UsdShade.MaterialBindingAPI(prim).ComputeBoundMaterial()
    name = m.GetPrim().GetName()
    if name in mats:
        return mats[name], name
    surf = None
    for c in m.GetPrim().GetChildren():
        sh = UsdShade.Shader(c)
        if sh and sh.GetIdAttr().Get() == 'UsdPreviewSurface':
            surf = sh
    g = lambda k, d: (surf.GetInput(k).Get() if surf.GetInput(k) and not surf.GetInput(k).HasConnectedSource() and surf.GetInput(k).Get() is not None else d)
    col = g('diffuseColor', Gf.Vec3f(0.8, 0.8, 0.8))
    op = g('opacity', 1.0)
    base_tex = tex_img(surf.GetInput('diffuseColor'))
    nrm = tex_img(surf.GetInput('normal'))
    emi = tex_img(surf.GetInput('emissiveColor'))
    pbr = trimesh.visual.material.PBRMaterial(
        name=name,
        baseColorFactor=[float(col[0]), float(col[1]), float(col[2]), float(op)],
        metallicFactor=float(g('metallic', 0.0)),
        roughnessFactor=float(g('roughness', 0.5)),
        baseColorTexture=base_tex,
        normalTexture=nrm,
        emissiveTexture=emi,
        emissiveFactor=[1, 1, 1] if emi is not None else None,
        alphaMode='BLEND' if (op < 0.999 or (surf.GetInput('opacity') and surf.GetInput('opacity').HasConnectedSource())) else 'OPAQUE',
        # respetamos el doubleSided del original: la pantalla tiene las caras hacia adentro
        doubleSided=bool(UsdGeom.Mesh(prim).GetDoubleSidedAttr().Get()),
    )
    mats[name] = pbr
    return pbr, name

scene = trimesh.Scene()
xc = UsdGeom.XformCache()
for prim in st.Traverse():
    if not prim.IsA(UsdGeom.Mesh):
        continue
    mesh = UsdGeom.Mesh(prim)
    pts = np.array(mesh.GetPointsAttr().Get(), dtype=np.float64)
    counts = np.array(mesh.GetFaceVertexCountsAttr().Get())
    idx = np.array(mesh.GetFaceVertexIndicesAttr().Get())
    M = np.array(xc.GetLocalToWorldTransform(prim)).T  # USD es fila-mayor
    pts = (np.c_[pts, np.ones(len(pts))] @ M.T)[:, :3] * mpu  # a metros
    # normales: pueden venir por vértice o por esquina (faceVarying)
    nattr = mesh.GetNormalsAttr()
    normals = nattr.Get()
    ninterp = mesh.GetNormalsInterpolation()
    pv = UsdGeom.PrimvarsAPI(prim).GetPrimvar('st0')
    uv = np.array(pv.Get()) if pv and pv.Get() is not None else None
    uvinterp = pv.GetInterpolation() if uv is not None else None
    # expandimos a esquinas (un vértice por esquina) para no perder aristas duras
    corners = idx
    V = pts[corners]
    N = None
    if normals is not None:
        normals = np.array(normals, dtype=np.float64)
        R = M[:3, :3]
        normals = normals @ R.T
        normals /= np.linalg.norm(normals, axis=1, keepdims=True) + 1e-12
        N = normals if ninterp == 'faceVarying' else normals[corners]
    UV = None
    if uv is not None:
        UV = uv if uvinterp == 'faceVarying' else uv[corners]
    # triangulación en abanico
    tris = []
    o = 0
    for c in counts:
        for k in range(1, c - 1):
            tris.append((o, o + k, o + k + 1))
        o += c
    F = np.array(tris)
    pbr, mname = material(prim)
    vis = trimesh.visual.TextureVisuals(uv=UV, material=pbr) if UV is not None else trimesh.visual.TextureVisuals(material=pbr)
    tm = trimesh.Trimesh(vertices=V, faces=F, vertex_normals=N, visual=vis, process=False)
    scene.add_geometry(tm, geom_name=mname + '__' + prim.GetName(), node_name=mname + '__' + prim.GetName())
    print(prim.GetName(), mname, 'normals', ninterp if normals is not None else None, 'uv', uvinterp, len(F))
scene.export(dst)
print('ok', dst)
