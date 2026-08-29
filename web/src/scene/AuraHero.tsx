import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

const BG_URL = "/hero-bg.jpg"
const ANIMATE_BG = true

const C = {
  radius: 0.9,
  strandCount: 34000,
  segments: 4,
  strandLength: 0.42,
  strandWidth: 0.012,
  swirl: 2.4,
  colorRoot: new THREE.Color("#12300f"),
  colorMid: new THREE.Color("#4c8a2c"),
  colorTip: new THREE.Color("#b9dd7a"),
  bg: "#0a0f0a",
}

function strandCountFor() {
  if (typeof window === "undefined") return C.strandCount
  if (window.innerWidth < 640) return 16000
  return C.strandCount
}

function fbm(x: number, y: number, z: number) {
  const s = (a: number, b: number, c: number) =>
    Math.sin(a * 1.7 + b * 2.3 + c * 1.1) *
    Math.cos(a * 0.9 - c * 1.6) *
    Math.sin(b * 1.3 + c * 0.7)
  return 0.55 * s(x, y, z) + 0.3 * s(x * 2.1, y * 2.1, z * 2.1) + 0.15 * s(x * 4.3, y * 4.3, z * 4.3)
}

function swirlDir(
  n: THREE.Vector3,
  tangent: THREE.Vector3,
  bitangent: THREE.Vector3,
  out: THREE.Vector3,
) {
  const a =
    Math.sin(n.x * C.swirl + n.y * 1.3) +
    Math.cos(n.z * C.swirl - n.y * 1.7) +
    0.5 * Math.sin(n.y * C.swirl * 1.6)
  out.copy(tangent).multiplyScalar(Math.cos(a)).addScaledVector(bitangent, Math.sin(a))
  return out.normalize()
}

function useFurGeometry() {
  return useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const S = C.segments
    const vertsPerStrand = S * 6
    const count = strandCountFor()
    const total = count * vertsPerStrand

    const positions = new Float32Array(total * 3)
    const colors = new Float32Array(total * 3)
    const base = new Float32Array(total * 3)
    const sway = new Float32Array(total)
    const phase = new Float32Array(total)

    const up = new THREE.Vector3()
    const tangent = new THREE.Vector3()
    const bitangent = new THREE.Vector3()
    const dir = new THREE.Vector3()
    const root = new THREE.Vector3()
    const tmp = new THREE.Vector3()
    const side = new THREE.Vector3()
    const p0 = new THREE.Vector3()
    const p1 = new THREE.Vector3()
    const ringPts = Array.from({ length: S + 1 }, () => new THREE.Vector3())

    let v = 0
    for (let i = 0; i < count; i += 1) {
      const t = i / count
      const phi = Math.acos(1 - 2 * t)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const nx = Math.sin(phi) * Math.cos(theta)
      const ny = Math.sin(phi) * Math.sin(theta)
      const nz = Math.cos(phi)

      const disp = 0.14 * fbm(nx * 2.2, ny * 2.2, nz * 2.2)
      const r = C.radius * (1 + disp)
      root.set(nx * r, ny * r, nz * r)
      up.set(nx, ny, nz).normalize()

      tmp.set(0, 1, 0)
      if (Math.abs(up.dot(tmp)) > 0.9) tmp.set(1, 0, 0)
      tangent.crossVectors(up, tmp).normalize()
      bitangent.crossVectors(up, tangent).normalize()

      swirlDir(up, tangent, bitangent, dir)
      const lenJ = C.strandLength * (0.7 + Math.random() * 0.6)
      const curl = 0.55 + Math.random() * 0.35
      const strandPhase = Math.random() * Math.PI * 2

      ringPts[0].copy(root)
      for (let s = 1; s <= S; s += 1) {
        const f = s / S
        tmp.copy(up).multiplyScalar(1 - f * curl).addScaledVector(dir, f * curl).normalize()
        ringPts[s].copy(ringPts[s - 1]).addScaledVector(tmp, lenJ / S)
      }

      const hueShift = (Math.random() - 0.5) * 0.12
      const cRoot = C.colorRoot.clone().offsetHSL(hueShift, 0, 0)
      const cMid = C.colorMid.clone().offsetHSL(hueShift, 0, 0)
      const cTip = C.colorTip.clone().offsetHSL(hueShift, 0, (Math.random() - 0.5) * 0.08)

      side.copy(bitangent).multiplyScalar(C.strandWidth)

      const colorAt = (f: number, target: THREE.Color) => {
        if (f < 0.5) target.copy(cRoot).lerp(cMid, f * 2)
        else target.copy(cMid).lerp(cTip, (f - 0.5) * 2)
      }
      const cA = new THREE.Color()
      const cB = new THREE.Color()

      for (let s = 0; s < S; s += 1) {
        p0.copy(ringPts[s])
        p1.copy(ringPts[s + 1])
        const f0 = s / S
        const f1 = (s + 1) / S
        const w0 = 1 - f0 * 0.7
        const w1 = 1 - f1 * 0.7

        const a0x = p0.x - side.x * w0
        const a0y = p0.y - side.y * w0
        const a0z = p0.z - side.z * w0
        const b0x = p0.x + side.x * w0
        const b0y = p0.y + side.y * w0
        const b0z = p0.z + side.z * w0
        const a1x = p1.x - side.x * w1
        const a1y = p1.y - side.y * w1
        const a1z = p1.z - side.z * w1
        const b1x = p1.x + side.x * w1
        const b1y = p1.y + side.y * w1
        const b1z = p1.z + side.z * w1

        colorAt(f0, cA)
        colorAt(f1, cB)

        const quad: [number, number, number, number, THREE.Color][] = [
          [a0x, a0y, a0z, f0, cA],
          [b0x, b0y, b0z, f0, cA],
          [a1x, a1y, a1z, f1, cB],
          [b0x, b0y, b0z, f0, cA],
          [b1x, b1y, b1z, f1, cB],
          [a1x, a1y, a1z, f1, cB],
        ]
        for (let k = 0; k < 6; k += 1) {
          const [x, y, z, ff, col] = quad[k]
          const o = v * 3
          positions[o] = x
          positions[o + 1] = y
          positions[o + 2] = z
          base[o] = x
          base[o + 1] = y
          base[o + 2] = z
          colors[o] = col.r
          colors[o + 1] = col.g
          colors[o + 2] = col.b
          sway[v] = ff * ff
          phase[v] = strandPhase
          v += 1
        }
      }
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3))
    geo.setAttribute("aBase", new THREE.BufferAttribute(base, 3))
    geo.setAttribute("aSway", new THREE.BufferAttribute(sway, 1))
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1))
    geo.computeVertexNormals()
    return geo
  }, [])
}

export function AuraHero() {
  const mountRef = useRef<HTMLDivElement>(null)
  const geometry = useFurGeometry()

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const width = () => Math.max(mount.clientWidth, 1)
    const height = () => Math.max(mount.clientHeight, 1)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(C.bg, 0.09)
    const camera = new THREE.PerspectiveCamera(35, width() / height(), 0.1, 100)
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width(), height())
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    mount.appendChild(renderer.domElement)

    const orb = new THREE.Group()
    const coreGeo = new THREE.SphereGeometry(C.radius * 0.9, 48, 48)
    const coreMat = new THREE.MeshStandardMaterial({ color: "#0c1f0c", roughness: 1, metalness: 0 })
    orb.add(new THREE.Mesh(coreGeo, coreMat))

    const uniforms = {
      uTime: { value: 0 },
      uLightDir: { value: new THREE.Vector3(-3, 4, -2.5).normalize() },
      uWindAmp: { value: 0.05 },
    }

    const furMat = new THREE.ShaderMaterial({
      uniforms,
      vertexColors: true,
      side: THREE.DoubleSide,
      transparent: false,
      vertexShader: `
        attribute vec3 aBase;
        attribute float aSway;
        attribute float aPhase;
        uniform float uTime;
        uniform float uWindAmp;
        varying vec3 vColor;
        varying float vSway;
        varying vec3 vNormal;

        void main() {
          vColor = color;
          vSway = aSway;
          float t = uTime;
          vec3 pos = aBase;
          float w = aSway * uWindAmp;
          pos.x += sin(t * 1.1 + aPhase + aBase.y * 2.0) * w;
          pos.z += cos(t * 0.9 + aPhase + aBase.x * 2.0) * w;
          pos.y += sin(t * 1.3 + aPhase) * w * 0.4;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform vec3 uLightDir;
        varying vec3 vColor;
        varying float vSway;
        varying vec3 vNormal;

        void main() {
          float diff = max(dot(normalize(vNormal), normalize(uLightDir)), 0.0);
          float sss = pow(vSway, 1.5) * 0.5;
          vec3 col = vColor * (0.45 + 0.75 * diff) + vColor * sss;
          col = col / (col + vec3(0.6));
          col = pow(col, vec3(0.85));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })

    orb.add(new THREE.Mesh(geometry, furMat))
    scene.add(orb)

    const key = new THREE.DirectionalLight("#e6ffd0", 2.2)
    key.position.set(-3, 4, -2.5)
    scene.add(key)
    const rim = new THREE.DirectionalLight("#b6ff82", 1.4)
    rim.position.set(4, 1.5, -3)
    scene.add(rim)
    scene.add(new THREE.AmbientLight("#12281a", 0.5))

    let dragging = false
    let pxp = 0
    let pyp = 0
    let vx = 0
    let vy = 0
    const onDown = (event: PointerEvent) => {
      dragging = true
      pxp = event.clientX
      pyp = event.clientY
    }
    const onMove = (event: PointerEvent) => {
      if (!dragging) return
      vy = (event.clientX - pxp) * 0.005
      vx = (event.clientY - pyp) * 0.005
      orb.rotation.y += vy
      orb.rotation.x += vx
      pxp = event.clientX
      pyp = event.clientY
    }
    const onUp = () => {
      dragging = false
    }
    renderer.domElement.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const clock = new THREE.Clock()
    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = clock.getDelta()
      const el = clock.elapsedTime
      uniforms.uTime.value = reduce ? 0 : el
      if (!dragging) {
        vy *= 0.95
        vx *= 0.95
        orb.rotation.y += vy + (reduce ? 0 : dt * 0.1)
        orb.rotation.x += vx
        orb.rotation.z = Math.sin(el * 0.1) * 0.03
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = width() / height()
      camera.updateProjectionMatrix()
      renderer.setSize(width(), height())
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      renderer.domElement.removeEventListener("pointerdown", onDown)
      renderer.dispose()
      furMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [geometry])

  return (
    <div
      className="absolute inset-0 z-[1] overflow-hidden"
      style={{ background: C.bg }}
    >
      <div
        className={ANIMATE_BG ? "aura-hero-drift" : undefined}
        style={{
          position: "absolute",
          inset: "-8%",
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: ANIMATE_BG ? "transform" : undefined,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle 22% at 50% 40%, rgba(6,10,6,0.6) 0%, transparent 60%)",
        }}
      />
      <div
        ref={mountRef}
        className="absolute inset-0"
        style={{ cursor: "grab", opacity: 0.76 }}
      />
      <style>{`
        @keyframes auraDrift {
          0%   { transform: scale(1.0) rotate(0deg); }
          100% { transform: scale(1.06) rotate(1.5deg); }
        }
        .aura-hero-drift {
          animation: auraDrift 40s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .aura-hero-drift { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
