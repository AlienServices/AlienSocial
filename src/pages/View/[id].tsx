import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import { useHistory } from "react-router-dom";
import Replies from "../../components/Replies";
import "react-quill/dist/quill.snow.css";
import {
  IonButton,
  IonAvatar,
  IonIcon,
  IonCard,
  IonContent,
  IonPage,
  IonImg,
  IonCheckbox,
  IonList,
  IonSkeletonText,
  IonItem,
  IonLabel,
  useIonViewWillLeave,
  useIonViewDidLeave,
  useIonViewWillEnter,
} from "@ionic/react";
import { post } from "../../utils/fetch";
import { arrowBackCircleOutline } from "ionicons/icons";
import "../../theme/id.module.css";
import { UserContext } from "../../providers/userProvider";
import HeaderAlien from "../../components/preRender/Header";
import { MyContext } from "../../providers/postProvider";

const Post = () => {
  const history = useHistory();
  const [content, setContent] = useState<any[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [commentsLoaded, setCommentsLoaded] = useState<boolean>(false);
  const [myVote, setMyVote] = useState<string>("");
  const { getBaseUrl } = useContext(MyContext)
  const [selected, setSelected] = useState<number | null>(null);
  const [image, setImage] = useState("");
  const { myInfo } = useContext(UserContext);
  const [toggle, setToggle] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasVoted, setHasVoted] = useState(false);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    getOnePost();
  }, []);

  const goBack = () => {
    history.goBack();
  };

  const getOnePost = async () => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getPost?id=${id}&userId=${myInfo?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const post = await result.json();
      setImage(post.post.owner.id);
      setContent([post.post]);
      setMyVote(post.userVote?.vote || "");
      setLoaded(true);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e);
  };

  const handleVote = async () => {
    setHasVoted(true);
    setTimeout(async () => {
      await updateVote(id, myInfo?.id || "", selectedOption);
      getOnePost();
    }, 500);
  };

  const profileImage = (id: string) => {
    if (id) {
      const newProfileImageUri = `${import.meta.env.VITE_APP_SUPABASE_URL
        }/storage/v1/object/public/ProfilePhotos/${id}.jpg`;
      return newProfileImageUri;
    }
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

  const updateVote = async (id: string, userId: string, vote: string) => {
    const updateUser = await post({
      url: `${getBaseUrl()}/api/posts/addVote`,
      body: { vote, id, userId },
    });
    setMyVote(selectedOption);
    await post({
      url: `${getBaseUrl()}/api/users/updateUser`,
      body: { vote: selectedOption, id, email: myInfo?.email },
    });
  };

  const getMyVote = async (id: string, postId: string) => {
    try {
      const result = await fetch(
        `${getBaseUrl()}/api/posts/getVote?postId=${postId}&userId=${myInfo?.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!result.ok) {
        console.error("Failed to fetch vote information");
        return; // Exit the function without setting state
      }
      const data = await result.json();
      console.log(data);
      setHasVoted(data); // Set state only if the request was successful
    } catch (error) {
      // Handle any network or parsing errors
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    getMyVote(myInfo?.id || '', id);
  }, []);

  useIonViewWillLeave(() => {
    console.log("Cleaning up resources...");
    setToggle(false);
  });

  useIonViewWillEnter(() => {
    setToggle(true);
  });


  return (
    <IonPage
      id="main-content"
      style={{
        opacity: toggle ? "1" : "0",
        transition: "opacity 0.1s ease-in-out",
      }}
    >
      <IonContent>
        <HeaderAlien next={false} title={'null'} content={''} backArrowToggle={true} />
        {loaded ? (
          <>
            {" "}
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
                              height: "40px",
                              width: "40px",
                              marginLeft: "5px",
                              marginRight: "5px",
                            }}
                          >
                            {/* <img
                              alt="Silhouette of a person's head"
                              src={profileImage(image)}
                            /> */}
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
                        readOnly={true}
                        theme="bubble"
                        value={post?.content}
                      />
                    </IonCard>
                  </div>
                );
              })}
          </>
        ) : (
          <IonList style={{ height: "400px" }}>
            <IonItem
              lines="none"
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <IonLabel>
                <h3>
                  <IonSkeletonText
                    animated={true}
                    style={{ width: "100%" }}
                  ></IonSkeletonText>
                </h3>
                <p>
                  <IonSkeletonText
                    animated={true}
                    style={{ width: "100%" }}
                  ></IonSkeletonText>
                </p>
                <p>
                  <IonSkeletonText
                    animated={true}
                    style={{ width: "100%" }}
                  ></IonSkeletonText>
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        )}

        {hasVoted ? (
          <div className="answers">
            <div className="vote">
              {myVote === "true" && (
                <div className="action">{content[0]?.yesAction}</div>
              )}
              {myVote === "probably true" && (
                <div className="action">{content[0]?.noAction}</div>
              )}
              {myVote === "neutral" && (
                <div className="action">{content[0]?.maybeAction}</div>
              )}
              {myVote === "probably false" && (
                <div className="action">{content[0]?.yesAction}</div>
              )}
              {myVote === "false" && (
                <div className="action">{content[0]?.noAction}</div>
              )}
            </div>
            <div style={{ paddingBottom: "100px" }}>
              <Replies postId={id} myVote={myVote} />
            </div>
          </div>
        ) : (
          <div className="centerMiddle">
            <div className="centerThesis">
              <ReactQuill
                className="quillTitle"
                style={{ color: "black" }}
                readOnly={true}
                theme="bubble"
                value={transformTitleToH1(content[0]?.thesis)}
              />
              {/* <div className="question">{content[0]?.thesis}</div> */}
            </div>
            <div className="quizCenter">
              <div className="checkSpace">
                <IonCheckbox
                  checked={selected === 1}
                  onIonChange={() => {
                    setSelected(1);
                    handleOptionChange("true");
                  }}
                  style={{ "--border-radius": "4px", padding: "5px" }}
                ></IonCheckbox>
                <div className="answerWidth">Yes Absolutely 100% True!</div>
              </div>
              <div className="checkSpace">
                <IonCheckbox
                  checked={selected === 2}
                  onIonChange={() => {
                    setSelected(2);
                    handleOptionChange("probably true");
                  }}
                  style={{ "--border-radius": "4px", padding: "5px" }}
                ></IonCheckbox>
                <div className="answerWidth">Probably True</div>
              </div>
              <div className="checkSpace">
                <IonCheckbox
                  checked={selected === 3}
                  onIonChange={() => {
                    setSelected(3);
                    handleOptionChange("neutral");
                  }}
                  style={{ "--border-radius": "4px", padding: "5px" }}
                ></IonCheckbox>
                <div className="answerWidth">Not Sure/Need More Info</div>
              </div>
              <div className="checkSpace">
                <IonCheckbox
                  checked={selected === 4}
                  onIonChange={() => {
                    setSelected(4);
                    handleOptionChange("probably false");
                  }}
                  style={{ "--border-radius": "4px", padding: "5px" }}
                ></IonCheckbox>
                <div className="answerWidth">Probably False</div>
              </div>
              <div className="checkSpace">
                <IonCheckbox
                  checked={selected === 5}
                  onIonChange={() => {
                    setSelected(5);
                    handleOptionChange("false");
                  }}
                  style={{ "--border-radius": "4px", padding: "5px" }}
                ></IonCheckbox>
                <div className="answerWidth">
                  No! This is Propaganda. 100% False
                </div>
              </div>
              <div className={`${!hasVoted ? "middle" : "none"}`}>
                <IonButton
                  style={{ backgroundColor: "black", padding: "0px" }}
                  onClick={handleVote}
                >
                  Submit
                </IonButton>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Post;
