import {
  IonContent,
  IonHeader,
  IonPage,
  IonNavLink,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab2.css";
import MyPosts from "../components/MyPosts";
import Category from "../components/Category";
import { logoIonic } from "ionicons/icons";
import { useEffect, useState, useContext, SetStateAction } from "react";
import { MyContext } from "../providers/postProvider";
import Replies from "../components/Replies";
import Page from "../pages/Edit";
import UserComments from "../components/UserComments";

interface EditProfileProps {
  editProfileRef: any;
  currProfileImage: string;
  setProfileImageUri: React.Dispatch<SetStateAction<string>>;
}


const Tab2 = ({
  editProfileRef,
  currProfileImage,
  setProfileImageUri,
}: EditProfileProps) => {
  const [choices, setChoices] = useState({
    posts: 1,
    replies: 0,
    likes: 0,
    categories: 0,
  });
  // const [posts, setPosts] = useState(0)
  const {
    posts,
    myPosts,
    setPosts,
    setMyPosts,
    updatePost,
    getAllPosts,
    myInfo,
  } = useContext(MyContext);
  const [replies, setReplies] = useState(0);
  const [likes, setLikes] = useState(1);
  const [categories, setCategories] = useState(0);


  async function uploadProfileImage(imageUri: string) {
    try {
      // Fetch the image from the URI
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }
      const formData = new FormData();

      formData.append("image", {
        uri: imageUri,
        type: "image/jpg",
        name: `${myInfo.id}.jpg`,
      } as any);
      const uploadResponse = await fetch(`${getBaseUrl()}/api/supabase-s3?id=${myInfo.id}`, {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }
      const result = await uploadResponse.json();
      console.log("Upload successful:", result);
      setProfileImageUri(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-images/${myInfo.id}.jpg?${Date.now()}`
      );
      setProfileImage(null);
    } catch (error) {
      console.error(
        "Error uploading image:",
        error instanceof Error ? error.message : error
      );
    }
  }



  return (
    <IonPage>
      <IonContent>
        <IonCard className="noMargin" color={"light"}>
          <div className="paddingCenter">
            <IonCardTitle>{myInfo?.username}</IonCardTitle>
          </div>
          <div className="rowEven">
            <img
              style={{ marginLeft: "10px" }}
              className="user-icon"
              src={"https://ionicframework.com/docs/img/demos/avatar.svg"}
              alt="User icon"
            />
            <div className="rowClose">
              <div>Posts</div>
              <div className="centerSmall">{myPosts?.length}</div>
            </div>
            <div className="rowClose">
              <div>Following</div>
              <div className="centerSmall">{myInfo?.following.length}</div>
            </div>
            <div className="rowClose">
              <div>Followers</div>
              <div className="centerSmall">{myInfo?.followers.length}</div>
            </div>
          </div>
          <IonCardHeader>
            {/* <IonNavLink routerDirection="forward" component={() => <Page />}>
            <div>edit profile</div>
          </IonNavLink> */}
          </IonCardHeader>
          <IonCardContent>{myInfo?.bio}</IonCardContent>
          <div className="flexChoice">
            <div
              className={
                !choices.posts ? "smallTitleChoice" : "smallTitleChoiceLine"
              }
              onClick={() => {
                setChoices({
                  posts: 1,
                  replies: 0,
                  likes: 0,
                  categories: 0,
                });
              }}
            >
              My Posts
            </div>
            <div
              className={
                !choices.replies ? "smallTitleChoice" : "smallTitleChoiceLine"
              }
              onClick={() => {
                setChoices({
                  posts: 0,
                  replies: 1,
                  likes: 0,
                  categories: 0,
                });
              }}
            >
              Replies
            </div>
            <div
              className={
                !choices.likes ? "smallTitleChoice" : "smallTitleChoiceLine"
              }
              onClick={() => {
                setChoices({
                  posts: 0,
                  replies: 0,
                  likes: 1,
                  categories: 0,
                });
              }}
            >
              Likes
            </div>
            <div
              className={
                !choices.categories
                  ? "smallTitleChoice"
                  : "smallTitleChoiceLine"
              }
              onClick={() => {
                setChoices({
                  posts: 0,
                  replies: 0,
                  likes: 0,
                  categories: 1,
                });
              }}
            >
              Reposts
            </div>
          </div>
        </IonCard>
        {choices.replies ? (
          <>
            <UserComments id={myInfo.id} />
          </>
        ) : choices.posts ? (
          <>
            <MyPosts />
          </>
        ) : choices.likes ? (
          <>Likes</>
        ) : choices.categories ? (
          <>
            <Category />
          </>
        ) : (
          // <MyPosts></MyPosts>
          <></>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
