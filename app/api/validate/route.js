
export async function POST(word, target, langauge){

    const response = await fetch("http://127.0.0.1:5000/glossary?" + new URLSearchParams({
        targetWord: target.toLowerCase(),
        word: word.toLowerCase(),
        la: langauge
    }), 
    {
        method: "POST"
    }
    )
    return await response.json()
}