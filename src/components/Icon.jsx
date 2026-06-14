import * as Lucide from 'lucide-react'

// Renders a Lucide icon by name with a graceful fallback.
export default function Icon({ name, ...props }) {
  const Cmp = Lucide[name] || Lucide.Box
  return <Cmp {...props} />
}
