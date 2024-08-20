import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { MyContext } from "../../providers/postProvider";
import {
  arrowBackOutline,
  chatbubbleOutline,
  heartCircle,
  bookmarkOutline,
  shareOutline,
} from "ionicons/icons";
import Replies from "../../components/Replies";
import "react-quill/dist/quill.snow.css";
import {
  IonButton,
  IonTextarea,
  IonAvatar,
  IonIcon,
  IonCard,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRouterLink,
  IonToolbar,
} from "@ionic/react";
import { post } from "../../utils/fetch";
import "../../theme/id.module.css";

const Post = () => {
  const [content, setContent] = useState<any[]>([]); // Initialize as an empty array
  const [comments, setComments] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");
  const [myVote, setMyVote] = useState<string>("");
  const [value, setValue] = useState("");
  const { myInfo } = useContext(MyContext);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { id } = useParams<{ id: string }>();


  useEffect(() => {
    getOnePost();
  }, []);


  const getOnePost = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/getPost?id=${id}&userId=${myInfo?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await result.json();
      setContent([post.post]); // Ensure the post is wrapped in an array
      setMyVote(post.userVote?.vote || "");
      // Set hasVoted based on whether a vote exists
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };



  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const handleVote = async () => {
    setHasVoted(true);
    setTimeout(async () => {
      await updateVote(id, myInfo?.email, myVote);
      getOnePost(); // Re-fetch the post data to trigger re-render
    }, 500); // The delay should match the CSS transition duration
  };

  const transformTitleToH1 = (title: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(title, "text/html");
    const pTag = doc.querySelector("p");

    if (pTag) {
      const h1Tag = document.createElement("h1");
      h1Tag.innerHTML = pTag.innerHTML;
      pTag.parentNode?.replaceChild(h1Tag, pTag);
    }

    return doc.body.innerHTML;
  };

  const updateVote = async (id: string, email: string, vote: string) => {
    console.log(email, 'this is email')
    const updateUser = await post({
      url: "http://localhost:3000/api/addVote",
      body: { vote: selectedOption, id, email: myInfo?.id },
    });
    console.log(updateUser, 'this is the updated user')
    setMyVote(selectedOption);
    await post({
      url: "http://localhost:3000/api/updateUser",
      body: { vote: selectedOption, id, email: myInfo?.email },
    });
  };

  const getMyVote = async (id: string, postId: string) => {
    const result = await fetch(
      `http://localhost:3000/api/getVote?postId=${postId}&userId=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );    
    setHasVoted(await result.json())
    
  }



  useEffect(() => {
    getMyVote(myInfo.id, id)
  }, [])



  console.log(hasVoted, 'has voted')

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonRouterLink href={`/tab1`}>
              <IonIcon size="large" icon={arrowBackOutline}></IonIcon>
            </IonRouterLink>
          </IonToolbar>
        </IonHeader>
        {Array.isArray(content) &&
          content.map((post: any, index: number) => {
            const transformedTitle = transformTitleToH1(post.title);

            return (
              <div className="shadow" key={index}>
                <IonCard
                  style={{
                    marginBottom: "25px",
                  }}
                  className="card"
                >
                  <div className="around">
                    <div className="emailContainer">
                      <IonAvatar
                        style={{
                          height: "20px",
                          width: "20px",
                          marginLeft: "5px",
                          marginRight: "5px",
                        }}
                      >
                        <img
                          alt="Silhouette of a person's head"
                          src="https://ionicframework.com/docs/img/demos/avatar.svg"
                        />
                      </IonAvatar>
                      <div className="username">{post?.email}</div>
                    </div>
                  </div>
                  <ReactQuill
                    className="quillTitle"
                    style={{ color: "black" }}
                    readOnly={true}
                    theme="bubble"
                    value={transformedTitle}
                  />
                  <ReactQuill
                    className="small"
                    style={{ color: "black" }}
                    readOnly={true}
                    theme="bubble"
                    value={post?.content}
                  />
                </IonCard>
              </div>
            );
          })}

        {hasVoted ? (
          <>
            <div className="vote">
              {myVote === "yes" && <div>{content[0]?.yesAction}</div>}
              {myVote === "no" && <div>{content[0]?.noAction}</div>}
              {myVote === "maybe" && <div>{content[0]?.maybeAction}</div>}
            </div>
            {/* Render the comments if the user has voted */}
            <Replies id={id} />
          </>
        ) : (
          <>
            <div className="centerThesis">
              <div className="question">{content[0]?.thesis}</div>
            </div>
            <div className="quizCenter">
              <div className="checkSpace">
                <input
                  type="radio"
                  value="yes"
                  checked={selectedOption === "yes"}
                  onChange={handleOptionChange}
                />
                <div className="answerWidth">Definitely Yes</div>
              </div>
              <div className="checkSpace">
                <input
                  type="radio"
                  value="no"
                  checked={selectedOption === "no"}
                  onChange={handleOptionChange}
                />
                <div className="answerWidth">Maybe Yes</div>
              </div>
              <div className="checkSpace">
                <input
                  type="radio"
                  value="maybe"
                  checked={selectedOption === "maybe"}
                  onChange={handleOptionChange}
                />
                <div className="answerWidth">Neutral</div>
              </div>
              <div className="checkSpace">
                <input
                  type="radio"
                  value="maybe"
                  checked={selectedOption === "maybe"}
                  onChange={handleOptionChange}
                />
                <div className="answerWidth">Maybe No</div>
              </div>
              <div className="checkSpace">
                <input
                  type="radio"
                  value="maybe"
                  checked={selectedOption === "maybe"}
                  onChange={handleOptionChange}
                />
                <div className="answerWidth">Definitely No</div>
              </div>
              <div className={`${!hasVoted ? "middle" : "none"}`}>
                <button className="noPadding" onClick={handleVote}>Submit</button>
              </div>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Post;