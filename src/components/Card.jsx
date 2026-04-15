export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-[20px] p-5 border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 ${className}`}>
      {children}
    </div>
  )
}
