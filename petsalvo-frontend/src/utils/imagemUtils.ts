export function converterImagensParaFiles(pet)  {
    if (pet?.imagens) {
      const photos = pet.imagens.map((imagem) => {
        const adjustedUrl = `http://localhost:8080/${imagem.url.replace(/\\/g, "/")}`;
        return adjustedUrl;
      })
      return photos
    } 
    else return []
}
