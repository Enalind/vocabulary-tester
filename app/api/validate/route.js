
export async function POST(word, target, langauge){

    const response = await fetch("https://f6c7-94-255-188-31.ngrok-free.app/glossary?" + new URLSearchParams({
        targetWord: target.toLowerCase(),
        word: word.toLowerCase(),
        la: langauge
    }), 
    {
        method: "POST",
        headers:{"ngrok-skip-browser-warning": "true"}
    }
    )
    return await response.json()
}