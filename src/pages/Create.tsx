import { useEffect, useState, useRef, useCallback } from 'react';
import { useApi } from '../hooks/useApi';
// import Editor from '../components/Editor';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill/core';
import {
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonToast,
    useIonLoading,
} from '@ionic/react';
import { supabase } from '../components/supaBase';
import './Tab1.css';
const Delta = Quill.import('delta');

const Create: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();
    const [password, setPassword] = useState<string>('')
    const [username, setUsername] = useState<string>()
    const [range, setRange] = useState();
    const [lastChange, setLastChange] = useState();
    const [readOnly, setReadOnly] = useState(false);
    const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');
    const quillRef = useRef();
    const { createUser } = useApi()

    const create = async () => {
        if (email && username) {
            const result = await createUser(email, username)
            console.log(result, "this is the create user result")
        } else {
            console.log('there is an error')
        }


    }



    const handleSignUp = async () => {
        console.log('kale')
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            })
        } catch (error) {
            console.log(error)
        }
    };

    const handleLogin = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) {
                console.log(error, "this is the login error")
            }
            if (data) {
                console.log(data, "this is login data")
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.log("this is logout error", error)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const getUser = async () => {
        try {
            const { data, error } = await supabase.auth.getSession()
            console.log(data, "this is the data")
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <IonPage>
            <div>This Is Working</div>
        </IonPage>
    );
}

export default Create