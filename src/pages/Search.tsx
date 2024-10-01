import React, { useState, useEffect, useRef, useContext } from "react";
import ReactQuill from "react-quill";
import { MyContext } from "../providers/postProvider";
import { useHistory } from "react-router";
import "react-quill/dist/quill.snow.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "../theme/create.css";
import {
    IonButton,
    IonText,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonNavLink,
    IonMenuButton,
    IonMenuToggle,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonToast,
    useIonLoading,
    IonMenu,
    IonImg,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import Quiz from "../subPages/Quiz";

const Search = () => {
    const [editorHtmlTitle, setEditorHtmlTitle] = useState("");
    const [editorHtml, setEditorHtml] = useState("");
    const [categories, setCategories] = useState([
        "Aliens",
        "Vaccines",
        "Government",
        "Space",
        "9/11",
        "Covid",
        "Israel",
    ]);
    const titleQuillRef = useRef(null);
    const [currentCategory, setCurrentCategory] = useState(categories[0]);
    const history = useHistory();
    const {
        posts,
        myPosts,
        setPosts,
        setMyPosts,
        updatePost,
        getAllPosts,
        myInfo,
        createPost,
    } = useContext(MyContext);
    const contentQuillRef = useRef(null);

    // useEffect(() => {
    //   debugger
    // }, [])

    return (
        <IonPage style={{ paddingTop: '20px', padding: "15px" }}>
            <IonContent>
                <IonInput placeholder="Search Here"></IonInput>
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={50}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    onSlideChange={(swiper) =>
                        setCurrentCategory(categories[swiper.activeIndex])
                    } // Update category on slide change
                    style={{ height: "100%" }}
                >
                    {categories.map((category, index) => (
                        <SwiperSlide key={index}>
                            <Category category={category} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </IonContent>
        </IonPage>
    );
};


export default Search;
