const Utils = {
    playAudio: (src) => {
        console.log('entrou')
        try {
            const audio = new Audio(src)
            audio.currentTime = 0
            audio.play().catch(err => {
                console.error('Erro ao reproduzir áudio:', err)
            })
        } catch (err) {
            console.error('Erro ao criar áudio:', err)
        }
    }
}

export { Utils }