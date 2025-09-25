interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ message = 'Cargando...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-32 w-32'
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 mx-auto ${sizeClasses[size]}`}></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  )
}
