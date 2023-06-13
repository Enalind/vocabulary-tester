import {firestore} from "../../../firebase"
import { doc, getDoc, getDocs, collection } from "firebase/firestore"

export async function PostSet(req){
    const name = req
    const docRef = doc(firestore, "Glossaries", name)
    const wordRefs = collection(firestore, "Glossaries", name, "Words")
    let [metaDataSnap, wordsSnap] = await Promise.all([getDoc(docRef), getDocs(wordRefs)])
    let metadata = metaDataSnap.data()
    let words = {}
    console.log("wordsSnap")
    // console.log(wordsSnap)
    wordsSnap.forEach(wordPair => {
        console.log("wordsSnap.data()")
        console.log(wordPair.data())
        Object.assign(words, {[wordPair.id]: wordPair.data()})
    })
    console.log("words")
    console.log(words)
    metadata["words"] = words
    return metadata
}