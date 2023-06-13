
export async function POST(word, target, langauge){

    const response = await fetch("https://934e-94-255-188-31.ngrok-free.app/glossary?" + new URLSearchParams({
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