import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { createPost, viewAllPosts } from "../services/post"

export default function Post() {
  const [post, setPost] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState("")

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
    <div className="p-6">
      <form>
        <input
          type="text"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <div>
            <img src={preview} />
          </div>
        )}
        <button onClick={handleSavePost}>Save</button>
      </form>

      <h2 className="text-2xl font-bold mb-6 text-center">All Post</h2>
      <div className="grid grid-cols-1 gap-6">
        {post.map((p: any, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl overflow-hidden border p-3"
          >
            <h3>{p?.title}</h3>
            <p>{p?.content}</p>
            <img src={p?.imageURL} className="w-full h-48 object-cover" />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => {
            fetchData(page - 1)
          }}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm text-gray-600">
          Page {page} of {totalPage}
        </div>
        <button
          onClick={() => {
            fetchData(page + 1)
          }}
          disabled={page === totalPage}
          className="px-4 py-2 rounded bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}