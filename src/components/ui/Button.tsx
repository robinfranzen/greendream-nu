import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed gap-2'
    const variants: Record<Variant, string> = {
      primary: 'bg-green-700 text-white hover:bg-green-600 active:scale-[0.98]',
      secondary: 'bg-stone-900 text-white hover:bg-stone-700 active:scale-[0.98]',
      outline: 'border border-stone-300 text-stone-700 hover:bg-stone-50 active:scale-[0.98]',
      ghost: 'text-stone-600 hover:bg-stone-100',
    }
    const sizes: Record<Size, string> = {
      sm: 'px-3.5 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
    }

    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    )
  }
)
Button.displayName = 'Button'
export default Button
