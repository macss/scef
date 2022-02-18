export default function camelize(str: string) {
  return str.replace(/-([a-z])/g, (m) => m[1].toUpperCase())
            .replace(/^[a-z]/g, m => m[0].toUpperCase())
}