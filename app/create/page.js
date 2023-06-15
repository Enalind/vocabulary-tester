"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css"
import Image from "next/image";
import { PostCreate } from "../api/createWords/route";
import { GET } from "../api/getSets/route"
import { PostSet } from "../api/getSet/route";
import Link from "next/link";
import Metaballs from "@/react-metaballs-js/dist";


export default function Create(){
    const [languages, setLanguages] = useState(["Loading"])
    const [words, setWords] = useState({0: {"wordPair": ["", ""], "blacklisted": [false, false]}})
    const [name, setName] = useState("")
    const [langDropDowns, setLangDropDowns] = useState(["From", "To"])
    const [verified, setVerified] = useState(true)
    const [editable, setEditable] = useState([{"id": "loading"}])

    useEffect(() => {
        fetch("https://5c7b-94-255-188-31.ngrok-free.app/languages", {headers:{"ngrok-skip-browser-warning": "true"}}).then(response => response.json()).then(json => setLanguages(json))
        fetch(`/api/getSets`, {next:{revalidate: 20}}).then(data => data.json()).then(json => setEditable(json))
        // const sets = await re.json()
        // GET().then(data => setEditable(data))
    }, [])
    

    async function submit(){
        const jsonBody = JSON.stringify({
            "name": name,
            "fromLanguage": langDropDowns[0],
            "toLanguage": langDropDowns[1],
            "date": new Date().toJSON(),
            "words": words,
            "validate": verified
        })
        console.log(jsonBody)
        // let response = await PostCreate(jsonBody)
        let response = await fetch("/api/createWords", {method: "POST", 
        headers: {
            'Content-Type': 'application/json',
          },  
          body: jsonBody})
        response = await response.json()
        fetch("/api/revalidatePages")
        console.log("response")
        console.log(response)
        if(typeof response === "object" && verified){
            const wordCpy = Object.assign({}, words)
            for(const key in Object.keys(wordCpy)){
                wordCpy[key]["blacklisted"] = [false, false]
            }
            for(const lanKey of Object.keys(response)){
                for(const wordIndex of response[lanKey]){
                    wordCpy[wordIndex]["blacklisted"][lanKey] = true
                }
            }
            setWords(wordCpy)
            
        }
        else{
            alert("Created Successfully")
            let w = JSON.parse(JSON.stringify(words))
            for(const i in Object.keys(w)){
                w[i]["blacklisted"] = [false, false]
            }
            setWords(w)
        }
        setVerified(!verified)
    }

    return <div className={styles.outer}>
        <main className={styles.main}>
            <div className={styles.upper}>
                <select className={styles.edit} onChange={e => {
                    PostSet(e.target.value).then(data => {
                        console.log(data)
                        setName(e.target.value)
                        setLangDropDowns([data["fromLanguage"], data["toLanguage"]])
                        let transformedWords = {}
                        for(const key in Object.keys(data["words"])){
                            transformedWords[key] = {"wordPair": data["words"][key]["wordPair"], "blacklisted": data["words"][key]["backendValidation"].map(val => !val)}
                        }
                        setWords(transformedWords)
                    })
                }}>
                    <option selected disabled>Edit</option>
                    {editable.map(doc => <option value={doc["id"]} key={doc["id"]}>{doc["id"]}</option>)}
                </select>
                <input value={name} className={styles.name} onChange={e => setName(e.target.value)}/>
            </div>
                <select value={langDropDowns[0]} className={`${styles.langSelect}`} onChange={(e) => {
                    let copy = langDropDowns.slice()
                    copy[0] = e.target.value
                    setLangDropDowns(copy)
                    }}>
                    <option selected disabled>From</option>
                    {languages.map((lang) => {
                        return <option value={lang} className={styles.option} key={lang}>{lang}</option>
                    })}
                </select>
                <select value={langDropDowns[1]} className={`${styles.langSelect}`} onChange={(e) => {
                    let copy = langDropDowns.slice()
                    copy[1] = e.target.value
                    setLangDropDowns(copy)
                    }}>
                    <option selected disabled>To</option>
                    {languages.map((lang) => {
                        return <option value={lang} className={styles.option} key={lang}>{lang}</option>
                    })}
                </select>
        
                {Object.keys(words).map(i => {
                    const computedColor1 = words[i]["blacklisted"][0] ? "red": "white"
                    const computedColor2 = words[i]["blacklisted"][1] ? "red": "white"
                    return <>
                            <input style={{"borderColor": computedColor1}} value={words[i]["wordPair"][0]} className={styles.word} onChange={(e) => {
                                // console.log(words)
                                if(!verified){setVerified(true)}
                                let wordsCopy = Object.assign({}, words)
                                console.log(wordsCopy)
                                wordsCopy[i]["wordPair"][0] = e.target.value
                                setWords(wordsCopy)
                                
                            }}/>
                            <input style={{"borderColor": computedColor2}} value={words[i]["wordPair"][1]} className={styles.word} onChange={(e) => {
                                if(!verified){setVerified(true)}
                                
                                let wordsCopy = Object.assign({}, words)
                                console.log(wordsCopy)
                                wordsCopy[i]["wordPair"][1] = e.target.value
                                setWords(wordsCopy)
                                
                            }}/>
                        </>
                })}
            <div className={styles.controls}>
                <Image src="./circle-plus-solid.svg" width={64} height={64} onClick={() => {
                    let wordsCopy = Object.assign({}, words)
                    wordsCopy[parseInt(Object.keys(wordsCopy)[Object.keys(wordsCopy).length - 1]) + 1] = {"wordPair": ["", ""], "blacklisted": [false,false]}
                    setWords(wordsCopy)
                }} />
            </div>
            <div className={styles.controls}>
                <Image src="./circle-minus-solid.svg" width={64} height={64} onClick={() => {
                    let wordsCopy = Object.assign({}, words)
                    delete wordsCopy[Object.keys(wordsCopy)[Object.keys(wordsCopy).length - 1]]
                    setWords(wordsCopy)
                }} />
            </div>


            <p className={styles.bottom} onClick={() => submit()}>Submit Set</p>
            <Link className={styles.bottom} href={"/#content"}>Return to main page</Link>
            
        </main>
        <Metaballs
            numMetaballs={10}
            minRadius={15}
            maxRadius={30}
            speed={3}
            colorFrom="#4CA1AF"
            colorTo="#C4E0E5"
            backgroundColorFrom="#4B79A1"
            backgroundColorTo="#283E51"
            useDevicePixelRatio={true}
            className="metaballs"
          />
    </div>
}
