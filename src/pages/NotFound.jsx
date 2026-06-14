import { Link } from 'react-router-dom'
import { Home, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-page py-32 text-center">
      <div className="relative mx-auto w-fit">
        <span className="font-display text-8xl font-bold gradient-text">404</span>
        <Compass className="absolute -right-8 -top-4 h-10 w-10 animate-spin-slow text-nebula-cyan" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-bold">Lost in the nebula</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-400">
        The page you're looking for drifted off into deep space. Let's get you back home.
      </p>
      <Link to="/" className="btn-primary mt-8"><Home className="h-4 w-4" /> Back to home</Link>
    </div>
  )
}
