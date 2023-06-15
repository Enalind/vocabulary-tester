import { NextResponse } from "next/server"
import {firestore} from "../../../firebase"
import { doc, Timestamp, writeBatch } from "firebase/firestore"
// import { revalidatePath } from "next/cache"
export async function POST(req){
    
    const body = await req.json()
    console.log(body["words"])
    const words = body["words"]
    const fromLang = body["fromLanguage"]
    const toLang = body["toLanguage"]
    const fromLangArr = []
    const toLangArr = []
    const validate = body["validate"]
    if(validate){
        for(const wordPair of Object.values(words)){
            fromLangArr.push(wordPair["wordPair"][0])
            toLangArr.push(wordPair["wordPair"][1])
        }
    
        const validationJson = {
            [fromLang]: fromLangArr,
            [toLang]: toLangArr 
        }
        const validationResponse = await fetch(
            "https://5c7b-94-255-188-31.ngrok-free.app/validate",
            {
                method: "POST",
                body: JSON.stringify(validationJson),
                headers:{
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "true"
                }
            }
        )
        
        const validationResponseJson = await validationResponse.json()
        
        const keys = Object.keys(validationResponseJson)
        console.log(keys)
        console.log("keys")
        if(keys.length !== 0){
            let out = {}
            for(const key of keys){
                if(key === fromLang){
                    out[0] = validationResponseJson[key]
                }
                else{
                    out[1] = validationResponseJson[key]
                }
                console.log(key)
                console.log("key")
            }
            // revalidatePath("/sets/[set]")
            // revalidatePath("/sets")
            Object.assign(out, { revalidated: true, now: Date.now() })
            return NextResponse.json(out)
        }
    }
    let batch = writeBatch(firestore)
    const docData = {
        "toLanguage": toLang,
        "fromLanguage": fromLang,
        "date": Timestamp.fromDate(new Date(body["date"]))
    } 
    const glossaryRef = doc(firestore, "Glossaries", body["name"])
    batch.set(glossaryRef, docData)
    console.log(words)
    for(const [i, val] of Object.entries(words)){
        console.log(i, val)
        const data = {
            "wordPair": [val["wordPair"][0].toLowerCase(), val["wordPair"][1].toLowerCase()],
            "backendValidation": [!val["blacklisted"][0], !val["blacklisted"][1]]
        } 
        const wordRef = doc(firestore, "Glossaries", body["name"], "Words", i)
        batch.set(wordRef, data)
    }
    // revalidatePath("/sets")
    // revalidatePath("/sets/[set]")
    await batch.commit()
    return NextResponse.json({ revalidated: true, now: Date.now() })
    
}