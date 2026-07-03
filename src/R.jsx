import { useEffect, useState } from "react";
import "./App.css";
import supabase from "./superbase/superbase.js";

function R() {
  const [allData, setAllData] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function getPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")

    if (error) {
      console.log(error);
    } else {
      setAllData(data);
    }
  }

  async function createPost() {
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          content,
        },
      ])
      .select();

    if (error) {
      console.log(error);
      return;
    }
    setAllData((prev) => [...data, ...prev]);

    setTitle("");
    setContent("");
    setOpen(false);
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div style={{ width: "600px", margin: "20px auto" }}>
      {!open ? (
        <button onClick={() => setOpen(true)}>Create Post</button>
      ) : (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
            }}
          />

          <textarea
            placeholder="Enter Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
            }}
          />

          <button onClick={createPost}>Submit</button>

          <button
            onClick={() => {
              setOpen(false);
              setTitle("");
              setContent("");
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        </div>
      )}

      <hr />

      <h2>All Posts</h2>

      {allData.map((post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid gray",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>{new Date(post.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default R;