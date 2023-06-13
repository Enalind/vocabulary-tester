"use client";

import { useEffect, useState } from "react";
import { POST } from "@/app/api/validate/route";
import Link from "next/link";
import styles from "./page.module.css"


function shuffleArray(arr) {
    console.log(arr)
    let array = arr.slice()
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

export default function Boxed(props){
    const [wordList, setWordList] = useState({list: [{"wordPair": [["loading", "loading"]]}], toLanguage: "loading"})
    const [index, setIndex] = useState(0)
    const [input, setInput] = useState("")
    const [score, setScore] = useState(0)
    const [done, setDone] = useState(false)
    const [results, setResults] = useState({positives: [], negatives: []})
    const [completed, setCompleted] = useState(0)

    useEffect(() => {
        setWordList({list: shuffleArray(Object.values(props.wordList)), toLanguage: props.toLanguage})
    }, [])

    const levenshteinDistance = (str1 = '', str2 = '') => {
        const track = Array(str2.length + 1).fill(null).map(() =>
        Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1) {
           track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1) {
           track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1) {
           for (let i = 1; i <= str1.length; i += 1) {
              const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
              track[j][i] = Math.min(
                 track[j][i - 1] + 1, // deletion
                 track[j - 1][i] + 1, // insertion
                 track[j - 1][i - 1] + indicator, // substitution
              );
           }
        }
        return track[str2.length][str1.length];
     };

    const handleKeyDown = (event) => {
        if(event.key !== "Enter"){return}
        console.log(index + 1, wordList["list"].length)
        let res = Object.assign({}, results)
        if(!wordList["list"][index]["backendValidation"][1]){
            if(levenshteinDistance(wordList["list"][index]["wordPair"][1], input) < 2){
                setScore(score + 1)
                res["positives"].push(index)
                
            }
            else{
                res["negatives"].push(index)
            }
        }
        else{
            POST(wordList["list"][index]["wordPair"][1], input, wordList["toLanguage"]).then(data => {
                console.log(data["Accepted"])
                if(data["Accepted"] === "True"){
                    setScore(score + 1)
                    res["positives"].push(index)
                }
                else{
                    res["negatives"].push(index)
                }
                
            }).catch(e => {
                res["negatives"].push(index)
                
            })
        }
        setInput("")
        setResults(res)
        setCompleted(completed+1)
        if(index + 1 === wordList["list"].length){
            
            setDone(true)
        }
        else{
            setIndex(index + 1)
        }
        
    }
    if(!done){
        return <>
        <p>Translate to {wordList["toLanguage"]}</p>
        
        <p className={styles.score}>{score}/{completed}</p>
        <div className={styles.glossary}>
            <p>{wordList["list"][index]["wordPair"][0]}</p>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => handleKeyDown(e)}/>
        </div>
        </>
    }
    else{
        return <>
        {/* <div/> */}
        <div>
            <p>Well done. You got: {score}/{wordList["list"].length}</p>
        </div>
        <p className={styles.retry} onClick={() => {
                setDone(false)
                setScore(0)
                setIndex(0)
                setResults({positives: [], negatives: []})
            }}>Try Again</p>
            {[...Array(wordList["list"].length).keys()].map(key => {
                console.log("key")
                console.log(key)
                const computedColor = results["positives"].includes(key) ? "white" : "red"
                return <>
                    <p style={{color: computedColor}}>{wordList["list"][key]["wordPair"][0]}</p>
                    <p style={{color: computedColor}}>{wordList["list"][key]["wordPair"][1]}</p>
                </>
            })}
            
        </>
    }
    function checkPosOrNeg(index){
        return results["positives"].includes(index)
    }
}