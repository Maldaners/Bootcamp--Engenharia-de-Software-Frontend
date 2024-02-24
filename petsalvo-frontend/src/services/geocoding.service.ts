class GeocodingService {
    private readonly baseUrl = "https://nominatim.openstreetmap.org";

    public async getCoordinates(address: any) {
        try {
            const response = await fetch(`${this.baseUrl}/search.php?q=${address}&polygon_geojson=1&format=jsonv2`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Erro ao efetuar busca do endereço');          
            }

            const responseData = await response.json();

            const coords = [Number(responseData[0]?.lon || 0), Number(responseData[0]?.lat || 0)]
            return coords;

        } catch (error: any) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Falha na comunicação');
            }
            throw new Error(error.message);

        }

    }
}

export const geocodingService = new GeocodingService();