import "./post.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUser } from "../../redux/userAction";
import { dislikePost, likePost } from "../../redux/postAction";
import { getFormattedDate } from "../../utilities/getFormatedDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { img_url } from "../../utilities/ImgUrl";

export default function Post({ post }) {
  const { userInfo } = useSelector((state) => state.auth);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(userInfo?._id));
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.user);
  const [user, setUser] = useState(true);

  useEffect(() => {
    if (users && users.find((user) => user._id === post.userId)) {
      setUser(users.find((user) => user._id === post.userId));
    }
  }, [users, post]);

  useEffect(() => {
    if (post.userId) {
      dispatch(fetchUser(post.userId));
    }
  }, [dispatch, post.userId]);

  const likeHandler = () => {
    if (isLiked === false) {
      dispatch(likePost({ postId: post._id, userId: userInfo._id }));
      setLike(like + 1);
    } else {
      dispatch(dislikePost({ postId: post._id, userId: userInfo._id }));
      setLike(like - 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : img_url + "person/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{getFormattedDate(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVertIcon />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc} </span>
          <img src={post.img} alt="" className="postImg" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              src={`${img_url}like.png`}
              onClick={likeHandler}
              className="likeIcon"
              alt=""
            />
            <img
              src={`${img_url}heart.png`}
              onClick={likeHandler}
              className="likeIcon"
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comments}comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
