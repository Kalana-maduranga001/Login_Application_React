import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react"

// Mock services - replace with your actual imports
const createPost = async (formData: FormData) => {
  return { success: true }
}

const viewAllPosts = async (page: number, limit: number) => {
  return {
    data: [],
    totalPages: 1
  }
}

export default function Post() {
  const [post, setPost] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const fetchData = async (pageNumber = 1) => {
    try {
      const data = await viewAllPosts(pageNumber, 2)
      setPost(data?.data)
      setTotalPage(data?.totalPages)
      setPage(pageNumber)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Animated background with particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 53, 128, ${particle.opacity})`
        ctx.fill()

        // Draw connections
        particles.forEach((particle2, j) => {
          if (i !== j) {
            const dx = particle.x - particle2.x
            const dy = particle.y - particle2.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(0, 53, 128, ${0.1 * (1 - distance / 150)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(particle2.x, particle2.y)
              ctx.stroke()
            }
          }
        })
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSavePost = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("tags", tags)
      if (image) formData.append("image", image)

      const res = await createPost(formData)

      await fetchData(1)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#001a40] via-[#003580] to-[#000d1a]">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Floating orbs */}
      <div 
        className="fixed w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #bff912ff 0%, transparent 10%)',
          left: `${mousePosition.x - 192}px`,
          top: `${mousePosition.y - 192}px`,
          transition: 'all 0.3s ease-out'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <div 
            className="inline-block mb-6"
            style={{
              transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) / 50}deg) rotateY(${(mousePosition.x - window.innerWidth / 2) / 50}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            <h1 className="text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white animate-pulse">
              POST MANAGER
            </h1>
            <div className="h-2 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></div>
          </div>
          <p className="text-white/60 text-xl">Create and manage your content in 3D space</p>
        </div>

        {/* Create Post Section */}
        <div 
          className="mb-20 backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden group"
          style={{
            transform: 'translateZ(50px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Animated border gradient */}
          {/* <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
               style={{
                 background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                 animation: 'shimmer 3s infinite'
               }}
          /> */}

          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Create New Post</h2>
            </div>

            {/* Title Input */}
            <div className="mb-6 group/input">
              <label className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/60"></span>
                Title
              </label>
              <input
                type="text"
                placeholder="Enter an amazing title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 outline-none transition-all duration-300 backdrop-blur-sm"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>

            {/* Content Input */}
            <div className="mb-6 group/input">
              <label className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/60"></span>
                Content
              </label>
              <input
                type="text"
                placeholder="Share your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 outline-none transition-all duration-300 backdrop-blur-sm"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>

            {/* Tags Input */}
            <div className="mb-6 group/input">
              <label className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/60"></span>
                Tags
              </label>
              <input
                type="text"
                placeholder="Add tags..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 outline-none transition-all duration-300 backdrop-blur-sm"
                style={{
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              />
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="text-white/80 text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/60"></span>
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="flex items-center justify-center gap-3 w-full px-6 py-6 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm group/upload"
              >
                <svg className="w-8 h-8 text-white/60 group-hover/upload:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-white/60 font-medium group-hover/upload:text-white transition-colors">
                  {image ? image.name : "Click to upload image"}
                </span>
              </label>
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mb-6 relative group/preview">
                <div className="relative rounded-2xl overflow-hidden border-2 border-white/20"
                     style={{
                       boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                     }}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003580]/80 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300"></div>
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null)
                      setPreview("")
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-all duration-300 hover:bg-red-600 hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSavePost}
              className="w-full py-5 px-6 bg-gradient-to-r from-white to-blue-100 text-[#003580] rounded-2xl font-bold text-lg relative overflow-hidden group/button transform hover:scale-[1.02] transition-all duration-300"
              style={{ 
                boxShadow: '0 20px 60px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Publish Post
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">All Posts</h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {post.map((p: any, index) => (
            <div
              key={index}
              className="backdrop-blur-xl bg-white/10 rounded-3xl overflow-hidden border border-white/20 hover:border-white/40 transform hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 cursor-pointer group/card"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                transform: `perspective(1000px) rotateX(${index % 2 === 0 ? 2 : -2}deg)`
              }}
            >
              {p?.imageURL && (
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={p?.imageURL} 
                    alt={p?.title}
                    className="w-full h-full object-cover transform group-hover/card:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003580] via-transparent to-transparent opacity-60"></div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover/card:text-blue-200 transition-colors duration-300">
                  {p?.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {p?.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center p-6 backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20"
             style={{
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
             }}>
          <button
            onClick={() => fetchData(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transform hover:-translate-x-1 transition-all duration-300 backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <div className="px-8 py-4 bg-gradient-to-r from-white to-blue-100 text-[#003580] rounded-2xl font-bold"
               style={{ 
                 boxShadow: '0 10px 30px rgba(255, 255, 255, 0.3)'
               }}>
            {page} / {totalPage}
          </div>
          
          <button
            onClick={() => fetchData(page + 1)}
            disabled={page === totalPage}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transform hover:translate-x-1 transition-all duration-300 backdrop-blur-sm"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
      `}</style>
    </div>
  )
}