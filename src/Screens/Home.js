import { useState, useEffect } from "react";
import { postDb } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, selectPosts } from "../features/postSlice";
import { selectUser } from "../features/userSlice";
import Post from "../Components/Post";
import AddPost from "../Components/AddPost";
import { setSearch } from "../features/searchSlice";
import "./Home.css";
import SearchModal from "../Components/SearchModal";
function Home() {
  //  const [posts, setPosts] = useState([])
  const user = useSelector(selectUser);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [userFollowing, setUserFollowing] = useState([]);
  const [searchModalIsOpen, setSearchOpen] = useState(false);
  const posts = useSelector(selectPosts);
  const dispatch = useDispatch();
  dispatch(setSearch(null));
  if (!user) window.location = "/";
  const openModal = () => setIsOpen(true);
  const openSearchModal = () => setSearchOpen(true);
  useEffect(() => {
    postDb.orderBy("timeStamp", "desc").onSnapshot((snapshot) => {
      dispatch(
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            username: doc.data().username,
            likes: doc.data().likes,
            caption: doc.data().caption,
            pic: doc.data().pic,
            timeStamp: doc.data().timeStamp?.seconds,
            uid: doc.data().uid,
            comments: doc.data().comments,
          }))
        )
      );
    });
  }, [postDb]);

  useEffect(() => {
    setUserFollowing([]);
    user.following?.map((following) =>
      setUserFollowing((oldData) => [...oldData, following])
    );
  }, [user, user.following]);

  return (
    <div>
      <button id="addPost" onClick={openModal}>
        +
      </button>
      <button id="search-btn" onClick={openSearchModal}>
        <ion-icon name="search"></ion-icon>
      </button>
      <div className="posts">
        {userFollowing.length !== 0 ? (
          posts.map((post) => {
            if (userFollowing?.includes(post.uid))
              return (
                <Post
                  key={post.id}
                  id={post.id}
                  username={post.username}
                  pictureUrl={post.pic}
                  caption={post.caption}
                  likes={post.likes}
                  comments={post?.comments}
                  likedStatus={user?.likedPosts?.includes(post.id)}
                />
              );
          })
        ) : (
          <h1 id="centered-text">Follow other users to view their posts.</h1>
        )}
      </div>
      {modalIsOpen ? (
        <AddPost modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} />
      ) : (
        ""
      )}
      {searchModalIsOpen ? (
        <SearchModal
          searchModalIsOpen={searchModalIsOpen}
          setSearchOpen={setSearchOpen}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Home;
